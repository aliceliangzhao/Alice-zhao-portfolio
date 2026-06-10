"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "../data/projects";
import WaveBackground from "./WaveBackground";
import s from "./HomepageScroll.module.css";

const HERO_SLIDES = [
  "/img/hero-card/me-4.jpg",
  "/img/hero-card/206311main_wright_brothers_full-1024x637-2214572863.jpg",
  "/img/hero-card/9933c0ab-5c4a-4283-bf19-debb4aeefb2c-EPA_SPACE_PHOTO_ESSAY_MOON_LANDING_ANNIVERSARY.5-3782150148.jpg",
  "/img/hero-card/Ada-1945299396.jpg",
  "/img/hero-card/How-ENIAC-Worked-min-1024x536-4207126977.png",
  "/img/hero-card/me-1.jpg",
  "/img/hero-card/IMG_2613-2533134824.jpg",
  "/img/hero-card/Intel 4004 (1971).jpg",
  "/img/hero-card/MV5BOTU3NWJjNDktZGU5Zi00ZWYwLTg1MzQtYWNlN2Q4ZTNjNDU4XkEyXkFqcGc@._V1_-1615251397.jpg",
  "/img/hero-card/OIP-1311303196.jpg",
  "/img/hero-card/deep-blue-vs-garry-kasparov-chess-3360251239.jpg",
  "/img/hero-card/me-3.jpg",
  "/img/hero-card/doAmESF84E3NVgu2mbEBAX-1312980986.jpg",
  "/img/hero-card/first-web-server_0451b7775b0ff60c530e897c31ea3ad1-3243532772.jpg",
  "/img/hero-card/hst_launch_hi-658738499.jpg",
  "/img/hero-card/sputnik-1-satellite-806590417.jpg",
  "/img/hero-card/steve-wozniak-working-in-garage-2-1562671878.jpg",
  "/img/hero-card/me-2.jpg",
  "/img/hero-card/uUzyjQw1zPGuTy4XirHoCcr8odl0tEiupNpbCzp4-478125760.jpg",
  "/img/hero-card/arduino-uno-pinout-80294469.jpg",
  "/img/hero-card/hedy-lamarr-2000-908a22cd2d3c490ab20edfa189e95a72-643054585.jpg",
  "/img/hero-card/Perlman_Radia+CIC+judge-595700236.jpg",
];

const CARD_DEFS = [
  { id: "my-ai-toolkit",
    title: "My design toolkit",
    year: "2024 - present",
    type: "Github",
    tags: "AI",
    pos: "side-tl",
    from: "left",
    layout: "center",
    href: "/about#ai-toolkit",
    cursor: "Always evolving :D" },
  { id: "my-lab",
    title: "My lab",
    year: "2015 - present",
    type: "Seattle",
    tags: "Just for fun",
    pos: "side-bl",
    from: "left",
    layout: "center",
    href: "/lab",
    cursor: "Something silly~" },
  { id: "s3-tables",
    slug: "s3-tables",
    pos: "center-tl",
    from: "top-left",
    vector: "/img/hero-card/vector-cube.svg",
    cursor: "My favourite project" },
  { id: "agent-opp",
    slug: "agent-opportunities",
    pos: "center-bl",
    from: "bottom-left",
    vector: "/img/hero-card/Vector3.svg",
    cursor: "Launching soon" },
  { id: "sda",
    slug: "simplifying-data-access",
    pos: "center-tr",
    from: "top-right",
    vector: "/img/hero-card/vector-tube.svg",
    cursor: "My favourite project, too" },
  { id: "design-process",
    title: "My AI-empowered\ndesign process",
    year: "2014 - present",
    type: "My brain",
    tags: "Human + LLMs",
    pos: "center-br",
    from: "bottom-right",
    layout: "center",
    href: "/about#design-process",
    cursor: "Always evolving :D" },
  { id: "about",
    title: "About me",
    year: "1760CE - 2026",
    type: "Earth",
    tags: "Human, mostly",
    pos: "side-tr",
    from: "right",
    layout: "center",
    href: "/about",
    cursor: "Ni Hao!" },
  { id: "links",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/liangzhaoux/" },
      { label: "Github", href: "https://github.com/aliceliangzhao" },
      { label: "Resume", href: "https://drive.google.com/file/d/1mJRSpRVt-9k0j9rOz154nCsfPWPXsa4D/view" },
      { label: "Email", href: "mailto:liangzhao0801@gmail.com", cursor: "Let's chat :)" },
    ],
    pos: "side-br",
    from: "right" },
].map(def => {
  if (!def.slug) return { ...def, slides: [] };
  const p = projects[def.slug];
  return {
    ...def,
    title: typeof p.projectTitle === "object" ? `${p.projectTitle.main}${p.projectTitle.sub ? ": " + p.projectTitle.sub : ""}` : p.projectTitle,
    year: p.year,
    type: p.type,
    impact: typeof p.impact === "object" ? p.impact.card : p.impact,
    tags: p.tags,
    href: `/projects/${p.slug}`,
    slides: [],
  };
});

const SCROLL_KEY = "homepage-visited";
const DASHBOARD_READY_PROGRESS = 0.995;
const EYE_EASE = 0.18;
const EYE_IDLE_RESET_MS = 5200;
const EYE_SETTLE_EPSILON = 0.05;
const EYE_ANCHOR_FALLBACKS = {
  left: { x: 0.33733, y: 0.598 },
  right: { x: 0.546, y: 0.63933 },
};

function useScrollProgress(containerRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setProgress(1);
      return;
    }

    const returning = sessionStorage.getItem(SCROLL_KEY) === "1";
    if (returning) {
      const scrollableDistance = container.scrollHeight - window.innerHeight;
      const target = container.getBoundingClientRect().top + window.scrollY + scrollableDistance;
      window.scrollTo(0, target);
      setProgress(1);
      container.style.setProperty("--scroll-progress", "1.0000");
    }

    let ticking = false;

    function update() {
      const rect = container.getBoundingClientRect();
      const scrollableDistance = container.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(1, Math.max(0, scrolled / scrollableDistance));
      setProgress(p);
      container.style.setProperty("--scroll-progress", p.toFixed(4));
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!returning) update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      sessionStorage.setItem(SCROLL_KEY, "1");
    };
  }, [containerRef]);

  return progress;
}

function useViewportSize() {
  const [size, setSize] = useState({ vw: 1440, vh: 900 });

  useEffect(() => {
    function onResize() {
      setSize({ vw: window.innerWidth, vh: window.innerHeight });
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const INTRO_BREAKPOINTS = [
  {
    maxProgress: 0.15,
    text: "Currently designing agentic experience at Amazon AWS. Previously built design systems and enterprise applications at Morgan Stanley, Siemens, and Insperity.",
  },
  {
    maxProgress: 0.35,
    text: "Currently designing agentic experience at Amazon AWS. Previously at Morgan Stanley, Siemens, and Insperity.",
  },
  {
    maxProgress: 0.55,
    text: "Currently designing agentic experience at Amazon AWS.",
  },
  {
    maxProgress: 0.75,
    text: "Defining agentic CX at AWS.",
  },
];

function getIntroText(progress) {
  for (const bp of INTRO_BREAKPOINTS) {
    if (progress <= bp.maxProgress) return bp.text;
  }
  return null;
}

function parsePercent(value, fallback) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed / 100 : fallback;
}

function parseNumber(value, fallback) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function useAvatarEyeTracking(avatarRef, enabled) {
  useEffect(() => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    function writeEyeOffset(side, x, y) {
      avatar.style.setProperty(`--${side}-eye-dx`, `${x.toFixed(3)}px`);
      avatar.style.setProperty(`--${side}-eye-dy`, `${y.toFixed(3)}px`);
    }

    function resetEyeOffsets() {
      writeEyeOffset("left", 0, 0);
      writeEyeOffset("right", 0, 0);
    }

    function setAvatarMotionActive(active) {
      if (active) {
        avatar.dataset.motionActive = "true";
      } else {
        delete avatar.dataset.motionActive;
      }
    }

    if (!enabled) {
      resetEyeOffsets();
      setAvatarMotionActive(false);
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const cursor = { x: 0, y: 0, active: false, lastMove: 0 };
    const current = {
      left: { x: 0, y: 0 },
      right: { x: 0, y: 0 },
    };
    let frameId = null;
    let anchors = readAnchors();

    function canTrack() {
      return finePointerQuery.matches && !reducedMotionQuery.matches;
    }

    function readAnchors() {
      const style = getComputedStyle(avatar);
      return {
        left: {
          x: parsePercent(style.getPropertyValue("--left-eye-x"), EYE_ANCHOR_FALLBACKS.left.x),
          y: parsePercent(style.getPropertyValue("--left-eye-y"), EYE_ANCHOR_FALLBACKS.left.y),
          xLeftLimit: parseNumber(style.getPropertyValue("--left-eye-left-limit"), 0.65),
          xRightLimit: parseNumber(style.getPropertyValue("--left-eye-right-limit"), 1),
        },
        right: {
          x: parsePercent(style.getPropertyValue("--right-eye-x"), EYE_ANCHOR_FALLBACKS.right.x),
          y: parsePercent(style.getPropertyValue("--right-eye-y"), EYE_ANCHOR_FALLBACKS.right.y),
          xLeftLimit: parseNumber(style.getPropertyValue("--right-eye-left-limit"), 1),
          xRightLimit: parseNumber(style.getPropertyValue("--right-eye-right-limit"), 1),
        },
      };
    }

    function clampEyeX(x, anchor, maxTravel) {
      const min = -maxTravel * anchor.xLeftLimit;
      const max = maxTravel * anchor.xRightLimit;
      return Math.min(max, Math.max(min, x));
    }

    function targetForEye(rect, anchor, now) {
      if (!canTrack() || !cursor.active || now - cursor.lastMove >= EYE_IDLE_RESET_MS) {
        return { x: 0, y: 0 };
      }

      const eyeX = rect.left + rect.width * anchor.x;
      const eyeY = rect.top + rect.height * anchor.y;
      const dx = cursor.x - eyeX;
      const dy = cursor.y - eyeY;
      const distance = Math.hypot(dx, dy);

      if (distance < 0.01) return { x: 0, y: 0 };

      const maxTravel = Math.min(4, Math.max(1, rect.width * 0.025));
      const pull = Math.min(1, distance / Math.max(rect.width * 0.75, 1));
      const x = (dx / distance) * maxTravel * pull;

      return {
        x: clampEyeX(x, anchor, maxTravel),
        y: (dy / distance) * maxTravel * pull,
      };
    }

    function animate(now) {
      const rect = avatar.getBoundingClientRect();
      const leftTarget = targetForEye(rect, anchors.left, now);
      const rightTarget = targetForEye(rect, anchors.right, now);
      const returning =
        !canTrack() ||
        !cursor.active ||
        now - cursor.lastMove >= EYE_IDLE_RESET_MS;

      if (returning) {
        setAvatarMotionActive(false);
      }

      current.left.x += (leftTarget.x - current.left.x) * EYE_EASE;
      current.left.y += (leftTarget.y - current.left.y) * EYE_EASE;
      current.right.x += (rightTarget.x - current.right.x) * EYE_EASE;
      current.right.y += (rightTarget.y - current.right.y) * EYE_EASE;

      writeEyeOffset("left", current.left.x, current.left.y);
      writeEyeOffset("right", current.right.x, current.right.y);

      const centered =
        Math.abs(current.left.x) < EYE_SETTLE_EPSILON &&
        Math.abs(current.left.y) < EYE_SETTLE_EPSILON &&
        Math.abs(current.right.x) < EYE_SETTLE_EPSILON &&
        Math.abs(current.right.y) < EYE_SETTLE_EPSILON;

      if (returning && centered) {
        current.left.x = 0;
        current.left.y = 0;
        current.right.x = 0;
        current.right.y = 0;
        resetEyeOffsets();
        setAvatarMotionActive(false);
        frameId = null;
        return;
      }

      frameId = requestAnimationFrame(animate);
    }

    function startLoop() {
      if (frameId === null) {
        frameId = requestAnimationFrame(animate);
      }
    }

    function returnToCenter() {
      cursor.active = false;
      setAvatarMotionActive(false);
      startLoop();
    }

    function onPointerMove(event) {
      if (!canTrack()) return;
      cursor.x = event.clientX;
      cursor.y = event.clientY;
      cursor.active = true;
      cursor.lastMove = performance.now();
      setAvatarMotionActive(true);
      startLoop();
    }

    function onPointerOut(event) {
      if (!event.relatedTarget) returnToCenter();
    }

    function onPreferenceChange() {
      if (!canTrack()) returnToCenter();
    }

    function onResize() {
      anchors = readAnchors();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("blur", returnToCenter);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", returnToCenter);
    reducedMotionQuery.addEventListener("change", onPreferenceChange);
    finePointerQuery.addEventListener("change", onPreferenceChange);

    resetEyeOffsets();
    setAvatarMotionActive(false);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", returnToCenter);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", returnToCenter);
      reducedMotionQuery.removeEventListener("change", onPreferenceChange);
      finePointerQuery.removeEventListener("change", onPreferenceChange);
      if (frameId !== null) cancelAnimationFrame(frameId);
      resetEyeOffsets();
      setAvatarMotionActive(false);
    };
  }, [avatarRef, enabled]);
}

function LayeredAvatar({ active }) {
  const avatarRef = useRef(null);
  useAvatarEyeTracking(avatarRef, active);

  return (
    <div className={s.avatarComposite} ref={avatarRef}>
      <Image
        className={s.avatarBase}
        src="/img/aboutMe/alice_transparent.png"
        alt="Alice Zhao"
        width={750}
        height={750}
        sizes="180px"
        loading="eager"
      />
      <Image
        className={`${s.avatarArtLayer} ${s.avatarCamera}`}
        src="/img/aboutMe/alice_camera.png"
        alt=""
        aria-hidden="true"
        width={619}
        height={351}
        sizes="160px"
      />
      <Image
        className={`${s.avatarArtLayer} ${s.avatarSnail}`}
        src="/img/aboutMe/alice_snail.png"
        alt=""
        aria-hidden="true"
        width={81}
        height={52}
        sizes="24px"
      />
      <Image
        className={`${s.avatarEye} ${s.leftEye}`}
        src="/img/aboutMe/alice_left_eye.png"
        alt=""
        aria-hidden="true"
        width={24}
        height={23}
        sizes="8px"
      />
      <Image
        className={`${s.avatarEye} ${s.rightEye}`}
        src="/img/aboutMe/alice_right_eye.png"
        alt=""
        aria-hidden="true"
        width={25}
        height={27}
        sizes="8px"
      />
    </div>
  );
}

function useSlideshow(images, interval = 250) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const start = useCallback(() => {
    setActive(true);
    setIndex(0);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
  }, [images.length, interval]);

  const stop = useCallback(() => {
    setActive(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return { active, index, start, stop };
}

function useFitTitle(titleRef) {
  const ratioRef = useRef(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el || ratioRef.current) return;

    const style = getComputedStyle(el);
    const baseFontSize = parseFloat(style.fontSize);
    el.style.whiteSpace = "nowrap";
    const textWidth = el.scrollWidth;
    el.style.whiteSpace = "";
    ratioRef.current = baseFontSize / textWidth;
  }, [titleRef]);

  return ratioRef;
}

function SecondaryCard({ def, style, hoverable }) {
  const slideshow = useSlideshow(def.slides, 200);
  const cursorOverRef = useRef(false);

  useEffect(() => {
    if (!hoverable && slideshow.active) slideshow.stop();
    if (hoverable && !slideshow.active && cursorOverRef.current && def.slides.length > 0) slideshow.start();
  }, [hoverable, slideshow.active, slideshow.start, slideshow.stop]);

  const onEnter = () => {
    cursorOverRef.current = true;
    if (hoverable && def.slides.length > 0) slideshow.start();
  };
  const onLeave = () => {
    cursorOverRef.current = false;
    slideshow.stop();
  };

  const Wrapper = def.href ? Link : "div";
  const wrapperProps = def.href ? { href: def.href } : {};
  if (def.cursor) wrapperProps["data-cursor"] = def.cursor;

  return (
    <Wrapper
      {...wrapperProps}
      className={`${s.card}${hoverable ? ` ${s.hoverable}` : ""}`}
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={s.shadow} />
      <div className={`${s.secCardFront}${slideshow.active ? ` ${s.sliding}` : ""}`}>
        {slideshow.active && (
          <img
            className={s.slideshow}
            src={def.slides[slideshow.index]}
            alt=""
          />
        )}
        {def.vector && (
          <img
            className={s.cardVector}
            src={def.vector}
            alt=""
          />
        )}
        {def.links ? (
          <div className={s.linksContent}>
            {def.links.map((link, i) => (
              <a key={i} className={s.linksItem} href={link.href} target="_blank" rel="noopener noreferrer" {...(link.cursor ? { "data-cursor": link.cursor } : {})}>
                {link.label}
              </a>
            ))}
          </div>
        ) : def.title ? (
          <div className={`${s.content} ${def.layout === "center" ? s.centerLayout : ""}`}>
            <div className={s.metaRow}>
              {def.year && <span className={s.year}>{def.year}</span>}
              {def.type && <span className={s.type}>{def.type}</span>}
            </div>
            <h2 className={s.title}>
              {def.title.split("\n").map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>
            {def.impact && <p className={s.impact}>{def.impact}</p>}
            {def.tags && (
              <span className={s.tags}>
                {[].concat(def.tags).map((tag, i) => (
                  <span key={i} className={s.tag}>{tag}</span>
                ))}
              </span>
            )}
          </div>
        ) : (
          <span className={s.label}>{def.label}</span>
        )}
      </div>
    </Wrapper>
  );
}

function HeroBorderDraw({ onComplete }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const parent = svg.parentElement;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    const perim = (w + h) * 2;

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const rect = svg.querySelector("rect");
    rect.setAttribute("width", w - 1);
    rect.setAttribute("height", h - 1);
    rect.setAttribute("stroke-dasharray", perim);
    rect.setAttribute("stroke-dashoffset", perim);

    requestAnimationFrame(() => {
      rect.classList.add(s.heroBorderRect);
      rect.style.setProperty("--perim", perim);
    });

    const handleEnd = () => onComplete();
    rect.addEventListener("animationend", handleEnd);
    return () => rect.removeEventListener("animationend", handleEnd);
  }, [onComplete]);

  return (
    <svg ref={svgRef} className={s.heroBorderDraw}>
      <rect
        x="0.5"
        y="0.5"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function HomepageScroll() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const progress = useScrollProgress(containerRef);

  const isReturning = useRef(false);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const returning = sessionStorage.getItem(SCROLL_KEY) === "1";
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (returning || prefersReduced) {
      isReturning.current = true;
      setIntroReady(true);
    }
  }, []);

  const { vw, vh } = useViewportSize();
  const isMobile = vw < 768;
  // The hero card starts as a square that's 90% of the viewport width on mobile (capped at 640px), 
  // or 37% of the viewport width on desktop (capped at 530px). 
  // It shrinks down to a square that's 80px on mobile or 120px on desktop.
  const heroStart = isMobile ? Math.min(vw * 0.9, 640) : Math.min(530, vw * 0.37);
  const heroEnd = isMobile ? 60 : 120;
  const avatarFixed = Math.max((heroStart - 48 * 2) * 0.4, heroEnd);

  const heroSize = lerp(heroStart, heroEnd, progress);
  //The space between adgacent cards starts at 20px on desktop (with 20px padding on either side) 
  //or 8px on mobile (with 8px padding on either side), and shrinks down to 0.
  const gridGap = isMobile ? 8 : 20;
  //The outer margin between the cards and the viewport edges starts at 20px on desktop or 8px on mobile, 
  //and shrinks down to 0.
  const gridPad = isMobile ? 8 : 20;
  const totalW = vw - 2 * gridPad;
  const totalH = vh - 2 * gridPad;
  const topY = gridPad;
  const bottomY = topY + totalH;

  // mobileRowH describes the height of the mobile rows of the side cards. 
  // The 0.15 mean 15% of the viewport height of each row, so 30% total for the side cards.
  const mobileRowH = isMobile ? Math.round(totalH * 0.15) : 0;
  const pTop = isMobile ? topY + mobileRowH + gridGap : topY;
  const pBottom = isMobile ? bottomY - mobileRowH - gridGap : bottomY;

  const sideW = isMobile ? 0 : (totalW - 3 * gridGap) / 6;

  const heroCX = vw / 2;
  const heroCY = pTop + (pBottom - pTop) / 2;
  const centerL = isMobile ? gridPad : gridPad + sideW + gridGap;
  const centerR = isMobile ? vw - gridPad : vw - gridPad - sideW - gridGap;

  const heroLEnd = heroCX - heroEnd / 2;
  const heroREnd = heroCX + heroEnd / 2;
  const heroTEnd = heroCY - heroEnd / 2;
  const shortH = heroTEnd - gridGap - pTop;
  const tallH = pBottom - heroTEnd;

  const heroLNow = heroCX - heroSize / 2;
  const heroRNow = heroCX + heroSize / 2;
  const heroTNow = heroCY - heroSize / 2;

  const shortHNow = heroTNow - gridGap - pTop;
  const tallHNow = pBottom - heroTNow;

  function getCardBounds(pos) {
    if (isMobile && pos.startsWith("side")) {
      const halfW = (totalW - gridGap) / 2;
      switch (pos) {
        case "side-tl": return { left: gridPad, top: topY, width: halfW, height: mobileRowH };
        case "side-tr": return { left: gridPad + halfW + gridGap, top: topY, width: halfW, height: mobileRowH };
        case "side-bl": return { left: gridPad, top: bottomY - mobileRowH, width: halfW, height: mobileRowH };
        case "side-br": return { left: gridPad + halfW + gridGap, top: bottomY - mobileRowH, width: halfW, height: mobileRowH };
      }
    }
    switch (pos) {
      case "side-tl":   return { left: gridPad, top: topY, width: sideW, height: shortH };
      case "side-bl":   return { left: gridPad, top: topY + shortH + gridGap, width: sideW, height: tallH };
      case "center-tl": return { left: centerL, top: pTop, width: heroLNow - gridGap - centerL, height: tallHNow };
      case "center-bl": return { left: centerL, top: pTop + tallHNow + gridGap, width: heroRNow - centerL, height: shortHNow };
      case "center-tr": return { left: heroLNow, top: pTop, width: centerR - heroLNow, height: shortHNow };
      case "center-br": return { left: heroRNow + gridGap, top: pTop + shortHNow + gridGap, width: centerR - heroRNow - gridGap, height: tallHNow };
      case "side-tr":   return { left: vw - gridPad - sideW, top: topY, width: sideW, height: tallH };
      case "side-br":   return { left: vw - gridPad - sideW, top: topY + tallH + gridGap, width: sideW, height: shortH };
    }
  }

  const introText = getIntroText(progress);
  const hasText = introText !== null;
  const dashboardReady = progress >= DASHBOARD_READY_PROGRESS;

  const textOpacity = progress > 0.65
    ? lerp(1, 0, (progress - 0.65) / 0.1)
    : 1;

  const avatarSize = Math.min(avatarFixed, heroSize);
  const avatarPad = Math.max(0, (heroSize - avatarFixed) / 2);
  const textBlend = Math.min(1, Math.max(0, (progress - 0.65) / 0.1));
  const padding = lerp(20, avatarPad, textBlend);

  const titleRatioRef = useFitTitle(titleRef);
  const maxTitleSize = Math.min(48, vw * 0.035);
  const availableWidth = heroSize - padding * 2;
  const titleFontSize = !isMobile && titleRatioRef.current
    ? Math.min(maxTitleSize, availableWidth * titleRatioRef.current)
    : null;

  const hoverable = progress < 0.75;
  const slideshow = useSlideshow(HERO_SLIDES, 200);
  const cursorOverRef = useRef(false);

  useEffect(() => {
    if (!hoverable && slideshow.active) slideshow.stop();
    if (hoverable && !slideshow.active && cursorOverRef.current) slideshow.start();
  }, [hoverable, slideshow.active, slideshow.start, slideshow.stop]);

  const onEnter = () => {
    cursorOverRef.current = true;
    if (hoverable) slideshow.start();
  };
  const onLeave = () => {
    cursorOverRef.current = false;
    slideshow.stop();
  };

  function getEndBounds(pos) {
    switch (pos) {
      case "center-tl": return { left: centerL, top: pTop, width: heroLEnd - gridGap - centerL, height: tallH };
      case "center-bl": return { left: centerL, top: pTop + tallH + gridGap, width: heroREnd - centerL, height: shortH };
      case "center-tr": return { left: heroLEnd, top: pTop, width: centerR - heroLEnd, height: shortH };
      case "center-br": return { left: heroREnd + gridGap, top: pTop + shortH + gridGap, width: centerR - heroREnd - gridGap, height: tallH };
    }
  }

  function getCardOffset(from, bounds) {
    let offsetX = 0;
    let offsetY = 0;
    switch (from) {
      case "left":         offsetX = -(bounds.left + bounds.width); break;
      case "right":        offsetX = vw - bounds.left; break;
      case "top-left":     offsetX = -(bounds.left + bounds.width); offsetY = -(bounds.top + bounds.height); break;
      case "top-right":    offsetX = vw - bounds.left; offsetY = -(bounds.top + bounds.height); break;
      case "bottom-left":  offsetX = -(bounds.left + bounds.width); offsetY = vh - bounds.top; break;
      case "bottom-right": offsetX = vw - bounds.left; offsetY = vh - bounds.top; break;
    }
    return { offsetX, offsetY };
  }

  return (
    <div className={s.runway} ref={containerRef}>
      <div className={s.sticky}>
        <WaveBackground className={introReady ? s.introVisible : s.introHidden} />
        {CARD_DEFS.map((def) => {
          const bounds = getCardBounds(def.pos);
          if (bounds.width <= 0 || bounds.height <= 0) return null;

          const isCenter = def.pos.startsWith("center");
          const style = {
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height,
          };

          if (isCenter) {
            const endBounds = getEndBounds(def.pos);
            const { offsetX, offsetY } = getCardOffset(def.from, endBounds);
            style.transform = `translate(${lerp(offsetX, 0, progress)}px, ${lerp(offsetY, 0, progress)}px)`;
          } else if (isMobile) {
            const isTopRow = def.pos === "side-tl" || def.pos === "side-tr";
            const neighborPos = def.pos.replace("side", "center");
            const neighborDef = CARD_DEFS.find(d => d.pos === neighborPos);
            const neighborEndBounds = getEndBounds(neighborPos);
            const neighborOffset = getCardOffset(neighborDef.from, neighborEndBounds);
            const sideOffsetY = isTopRow ? -(bounds.top + bounds.height) : (vh - bounds.top);
            const totalY = neighborOffset.offsetY + sideOffsetY;
            style.transform = `translate(0px, ${lerp(totalY, 0, progress)}px)`;
          } else {
            const neighborPos = def.pos.replace("side", "center");
            const neighborDef = CARD_DEFS.find(d => d.pos === neighborPos);
            const neighborEndBounds = getEndBounds(neighborPos);
            const neighborOffset = getCardOffset(neighborDef.from, neighborEndBounds);
            const { offsetX: sideOffsetX } = getCardOffset(def.from, bounds);
            const totalX = neighborOffset.offsetX + sideOffsetX;
            style.transform = `translate(${lerp(totalX, 0, progress)}px, 0px)`;
          }

          return (
            <SecondaryCard
              key={def.id}
              def={def}
              style={style}
              hoverable={progress >= 1}
            />
          );
        })}

        <div
          className={`${s.heroWrap}${hoverable ? ` ${s.hoverable}` : ""}`}
          style={{
            left: heroCX - heroSize / 2,
            top: heroCY - heroSize / 2,
            width: heroSize,
            height: heroSize,
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <div className={s.heroShadow} />
          {!isReturning.current && !introReady && (
            <HeroBorderDraw onComplete={() => setIntroReady(true)} />
          )}
          <div className={`${s.heroCard}${slideshow.active ? ` ${s.sliding}` : ""}${!introReady ? ` ${s.heroHidden}` : ""}`}>
            {slideshow.active && (
              <img
                className={s.heroSlideshow}
                src={HERO_SLIDES[slideshow.index]}
                alt=""
              />
            )}
            <div
              className={`${s.heroInner}${introReady && !isReturning.current ? ` ${s.introFadeIn}` : ""}`}
              style={{
                padding,
                alignItems: hasText ? 'flex-start' : 'center',
                justifyContent: hasText ? 'space-between' : 'center',
              }}
            >
              <div
                className={s.heroAvatar}
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  minWidth: avatarSize,
                  minHeight: avatarSize,
                }}
              >
                <LayeredAvatar active={dashboardReady} />
              </div>
              {hasText && (
                <div className={s.heroText} style={{ opacity: textOpacity }}>
                  <h1
                    ref={titleRef}
                    className={s.heroTitle}
                    style={titleFontSize ? { fontSize: titleFontSize } : undefined}
                  >
                    Alice Zhao, UX Designer
                  </h1>
                  <p className={s.heroIntro}>
                    {introText}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {introReady && progress < 0.15 && (
          <div className={s.scrollHint} style={{ opacity: 1 - progress / 0.15 }}>
            <span className={s.scrollHintText}>Scroll</span>
            <span className={s.scrollHintLine} />
          </div>
        )}
      </div>
    </div>
  );
}
