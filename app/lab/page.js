"use client";

import { useEffect, useRef, useCallback } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { labItems } from "../data/lab";
import "./lab.css";

const POSITIONS = [
  { x: 40,   y: 60,  w: 260 },
  { x: 360,  y: 380, w: 300 },
  { x: 720,  y: 40,  w: 240 },
  { x: 1020, y: 440, w: 280 },
  { x: 1360, y: 80,  w: 220 },
  { x: 1640, y: 500, w: 300 },
  { x: 1980, y: 60,  w: 260 },
  { x: 2300, y: 400, w: 240 },
];

const SET_W = 2600;
const SET_H = 900;

function LabCard({ item, pos }) {
  const Tag = item.href ? "a" : "div";
  const linkProps = item.href ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Tag
      {...linkProps}
      className={`lab-card${item.href ? " lab-card-link" : ""}`}
      style={{ "--x": `${pos.x}px`, "--y": `${pos.y}px`, "--w": `${pos.w}px` }}
    >
      <img src={item.image} alt={item.title} draggable={false} />
      <p className="lab-card-title">{item.title}</p>
      <p className="lab-card-desc">{item.description}</p>
    </Tag>
  );
}

function LabSet() {
  return (
    <div className="lab-set" style={{ width: SET_W, height: SET_H }}>
      {labItems.map((item, i) => (
        <LabCard key={i} item={item} pos={POSITIONS[i]} />
      ))}
    </div>
  );
}

export default function Lab() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const parallaxRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const loopRef = useRef(null);

  const PARALLAX_STRENGTH = 30;

  const applyTransform = useCallback(() => {
    if (!canvasRef.current) return;
    const p = parallaxRef.current;
    let x = (posRef.current.x + p.x) % SET_W;
    let y = (posRef.current.y + p.y) % SET_H;
    if (x > 0) x -= SET_W;
    if (y > 0) y -= SET_H;
    canvasRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    function onWheel(e) {
      e.preventDefault();
      posRef.current.x -= e.deltaX;
      posRef.current.y -= e.deltaY;
      applyTransform();
    }

    function onPointerDown(e) {
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        startPosX: posRef.current.x,
        startPosY: posRef.current.y,
      };
      wrap.classList.add("dragging");
      wrap.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
      if (dragRef.current.active) {
        posRef.current.x = dragRef.current.startPosX + (e.clientX - dragRef.current.startX);
        posRef.current.y = dragRef.current.startPosY + (e.clientY - dragRef.current.startY);
        applyTransform();
      } else {
        const cx = (e.clientX / window.innerWidth - 0.5) * 2;
        const cy = (e.clientY / window.innerHeight - 0.5) * 2;
        parallaxRef.current.targetX = cx * PARALLAX_STRENGTH;
        parallaxRef.current.targetY = cy * PARALLAX_STRENGTH;
      }
    }

    function onPointerUp(e) {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      wrap.classList.remove("dragging");
      wrap.releasePointerCapture(e.pointerId);
    }

    wrap.addEventListener("wheel", onWheel, { passive: false });
    wrap.addEventListener("pointerdown", onPointerDown);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerup", onPointerUp);
    wrap.addEventListener("pointercancel", onPointerUp);

    function tick() {
      const p = parallaxRef.current;
      p.x += (p.targetX - p.x) * 0.08;
      p.y += (p.targetY - p.y) * 0.08;
      applyTransform();
      loopRef.current = requestAnimationFrame(tick);
    }
    loopRef.current = requestAnimationFrame(tick);

    return () => {
      wrap.removeEventListener("wheel", onWheel);
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointercancel", onPointerUp);
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [applyTransform]);

  return (
    <>
      <Navigation title="My lab" />
      <div className="lab" ref={wrapRef}>
        <div className="lab-canvas" ref={canvasRef}>
          {[0, 1, 2].map((row) => (
            <div key={row} className="lab-row">
              {[0, 1, 2].map((col) => (
                <LabSet key={col} />
              ))}
            </div>
          ))}
        </div>

        <span className="lab-hint">
          ✦ Scroll or drag to explore
        </span>
      </div>
      <Footer />
    </>
  );
}
