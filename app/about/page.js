"use client";

import { useEffect, useRef } from "react";
import Navigation from "../components/Navigation";
import LineReveal from "../components/LineReveal";
import Footer from "../components/Footer";
import AboutDetails from "../components/AboutDetails";
import { bio } from "../data/about";
import "./about.css";

export default function About() {
  const bioRef = useRef(null);

  // Reveal the bio heading line by line on scroll-in.
  useEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revealed");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("revealed"); observer.disconnect(); }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navigation title="About" />
      <div className="about">
        {/* ── Bio ── */}
        <section className="about-section col-grid">
          <h2 ref={bioRef} className="section-heading-reveal">
            <LineReveal heading={bio.heading} lead={bio.personal} plain />
          </h2>
          <img className="about-bio-image" src={bio.image} alt="Alice Zhao" />
        </section>

        <AboutDetails />
      </div>
      <Footer />
    </>
  );
}
