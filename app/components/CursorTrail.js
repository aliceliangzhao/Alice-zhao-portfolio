"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import "./CursorTrail.css";

const PIXEL_SIZE = 16;
const STIFFNESS = 0.2;
const DAMPING = 0.5;

function findCursorTarget(el) {
  while (el) {
    if (el.dataset && "cursor" in el.dataset) return el.dataset.cursor || null;
    if (el.tagName === "BUTTON") return "View";
    if (el.tagName === "A" && el.getAttribute("href")?.startsWith("/")) return "View";
    el = el.parentElement;
  }
  return null;
}

export default function CursorTrail() {
  const [pos, setPos] = useState({ x: -1000, y: -1000, vx: 0, vy: 0 });
  const [mounted, setMounted] = useState(false);
  const [hoverText, setHoverText] = useState(null);
  const cursorPos = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (hasFinePointer) setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mql.matches;
    const onChange = (e) => { prefersReducedMotion.current = e.matches; };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e) => {
      const text = findCursorTarget(e.target);
      if (text) setHoverText(text);
    };

    const handleMouseOut = (e) => {
      const text = findCursorTarget(e.relatedTarget);
      if (!text) setHoverText(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setPos({ x: cursorPos.current.x, y: cursorPos.current.y, vx: 0, vy: 0 });

    const animate = () => {
      if (prefersReducedMotion.current) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }


      startTransition(() => {
        setPos((prev) => {
          const dx = cursorPos.current.x - prev.x;
          const dy = cursorPos.current.y - prev.y;
          let vx = prev.vx + dx * STIFFNESS;
          let vy = prev.vy + dy * STIFFNESS;
          vx *= DAMPING;
          vy *= DAMPING;
          return { x: prev.x + vx, y: prev.y + vy, vx, vy };
        });
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  if (!mounted) return null;

  const expanded = !!hoverText;

  return (
    <div className={`cursor-container${expanded ? " expanded" : ""}`}>
      <div
        className="cursor-dot"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          ...(expanded ? {} : { width: `${PIXEL_SIZE}px`, height: `${PIXEL_SIZE}px` }),
        }}
      >
        {expanded && (
          <span className="cursor-text">
            {hoverText}
          </span>
        )}
      </div>
    </div>
  );
}
