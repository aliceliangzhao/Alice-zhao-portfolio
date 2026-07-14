"use client";

import { useLayoutEffect, useEffect, useRef, useState, useMemo } from "react";
import InlineImageLoop from "./InlineImageLoop";
import ExternalLink from "./ExternalLink";
import styles from "./LineReveal.module.css";

// Turn a string into tokens, extracting inline {img:...} loops (which may carry
// an optional |url link) before splitting the rest into words. `wordType` tags
// the plain words as "heading" or "lead".
function pushSegmentTokens(str, wordType, tokens) {
  const segments = str.split(/(\{img(?::[^}]*)?\})/g);
  for (const seg of segments) {
    const imgMatch = seg.match(/^\{img:([^}]+)\}$/);
    if (imgMatch) {
      const [srcs, href] = imgMatch[1].split("|");
      tokens.push({ type: "img", srcs: srcs.split(","), href });
      continue;
    }
    if (seg === "{img}") {
      tokens.push({ type: "placeholder" });
      continue;
    }
    const cleaned = seg.replace(/\{\{(.+?)\}\}/g, "$1");
    const words = cleaned.split(/( )/);
    for (const w of words) {
      if (w === " ") tokens.push({ type: "space" });
      else if (w) tokens.push({ type: wordType, text: w });
    }
  }
}

function buildTokens(heading, lead, insertBreak) {
  const tokens = [];

  const numMatch = heading.match(/^(\d+[_.]?\s*)/);
  if (numMatch) {
    tokens.push({ type: "heading-num", text: numMatch[1] });
    pushSegmentTokens(heading.slice(numMatch[1].length), "heading", tokens);
  } else {
    pushSegmentTokens(heading, "heading", tokens);
  }

  if (insertBreak) {
    tokens.push({ type: "break" });
  } else {
    tokens.push({ type: "space" });
  }

  pushSegmentTokens(lead, "lead", tokens);

  return tokens;
}

// Render an {img} token: the looping strip, wrapped in a link when it has one.
function renderImgLoop(t) {
  const loop = <InlineImageLoop srcs={t.srcs} />;
  return t.href ? <ExternalLink href={t.href} hideIcon>{loop}</ExternalLink> : loop;
}

export default function LineReveal({ heading, lead, align, plain, stagger = 130 }) {
  const ref = useRef(null);
  const [lines, setLines] = useState(null);
  const centered = align === "center";
  const tokens = useMemo(
    () => buildTokens(heading, lead, centered),
    [heading, lead, centered]
  );
  const headingCls = plain ? undefined : styles.headingText;
  const leadCls = plain ? styles.headingText : styles.leadText;

  useLayoutEffect(() => {
    if (lines !== null) return;
    const el = ref.current;
    if (!el) return;

    const spans = el.querySelectorAll("[data-i]");
    if (!spans.length) return;

    const groups = [];
    let group = [];
    let prevY = null;

    spans.forEach((span) => {
      const y = Math.round(span.getBoundingClientRect().top);
      const i = parseInt(span.dataset.i);
      if (prevY !== null && Math.abs(y - prevY) > 4) {
        groups.push(group);
        group = [];
      }
      group.push(i);
      prevY = y;
    });
    if (group.length) groups.push(group);

    const ranges = groups.map((g, li) => {
      const start = g[0];
      const nextStart = li < groups.length - 1 ? groups[li + 1][0] : tokens.length;
      let end = nextStart;
      while (end > start && (tokens[end - 1].type === "space" || tokens[end - 1].type === "break")) end--;
      return [start, end];
    });

    setLines(ranges);
  });

  useEffect(() => {
    if (lines === null) return;
    let timer;
    function onResize() {
      clearTimeout(timer);
      timer = setTimeout(() => setLines(null), 200);
    }
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, [lines]);

  if (lines === null) {
    return (
      <span ref={ref} className={styles.wrapper}>
        {tokens.map((t, i) => {
          if (t.type === "space") return " ";
          if (t.type === "break") return <br key={i} />;
          if (t.type === "heading-num") return (
            <span key={i} data-i={i} className={headingCls} style={{ whiteSpace: "pre" }}>{t.text}</span>
          );
          if (t.type === "heading") return (
            <span key={i} data-i={i} className={headingCls}>{t.text}</span>
          );
          if (t.type === "img") return (
            <span key={i} data-i={i} style={{ display: "inline" }}>
              {renderImgLoop(t)}
            </span>
          );
          if (t.type === "placeholder") return (
            <span key={i} data-i={i} className="inline-img" />
          );
          return <span key={i} data-i={i} className={leadCls}>{t.text}</span>;
        })}
      </span>
    );
  }

  return (
    <span ref={ref} className={`${styles.wrapper}${centered ? ` ${styles.centered}` : ""}`}>
      {lines.map(([start, end], li) => (
        <span key={li} className={styles.lineClip}>
          <span
            className={styles.lineInner}
            style={{ transitionDelay: `${li * stagger}ms` }}
          >
            {tokens.slice(start, end).map((t, j) => {
              if (t.type === "space") return " ";
              if (t.type === "break") return null;
              if (t.type === "heading-num") return (
                <span key={j} className={headingCls} style={{ whiteSpace: "pre" }}>{t.text}</span>
              );
              if (t.type === "heading") return (
                <span key={j} className={headingCls}>{t.text}</span>
              );
              if (t.type === "img") return <span key={j}>{renderImgLoop(t)}</span>;
              if (t.type === "placeholder") return <span key={j} className="inline-img" />;
              return <span key={j} className={leadCls}>{t.text}</span>;
            })}
          </span>
        </span>
      ))}
    </span>
  );
}
