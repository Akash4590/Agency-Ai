// Hero.jsx — Premium SaaS Redesign
// Dependencies: react, @react-three/fiber, @react-three/drei, three, gsap
// Install: npm install react react-dom @react-three/fiber @react-three/drei three gsap

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const TOKENS = {
  cyan: "#00e5ff",
  violet: "#7c3aed",
  violetSoft: "#a78bfa",
  bg: "#05070f",
  surface: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(0,229,255,0.3)",
  textPrimary: "#f1f5fe",
  textSecondary: "#8b95b3",
  textMuted: "#4b5472",
};

const BAR_DATA = [0.28, 0.45, 0.38, 0.6, 0.55, 0.72, 0.65, 0.82, 0.75, 0.91, 0.88, 1.0];
const BAR_COLORS = [
  "#00e5ff","#00cce8","#00b4d0","#4d9fff","#7b85ff",
  "#7c3aed","#9b59f0","#7c3aed","#6d5de0","#00e5ff","#00cce8","#00e5ff",
];
const NAV_LINKS = ["Platform", "Analytics", "Integrations", "Pricing"];

// ─── 3D: HOLOGRAPHIC BAR ──────────────────────────────────────────────────────
function HoloBar({ position, height, color, index }) {
  const meshRef = useRef();
  const topRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.14 + Math.sin(t * 1.2 + index * 0.5) * 0.06;
    }
    if (topRef.current) {
      topRef.current.material.opacity = 0.6 + Math.sin(t * 1.8 + index * 0.4) * 0.25;
    }
  });

  const col = new THREE.Color(color);

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.44, height, 0.44]} />
        <meshBasicMaterial color={col} transparent opacity={0.14} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.46, height + 0.01, 0.46]} />
        <meshBasicMaterial color={col} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={topRef} position={[0, height, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.44, 0.04]} />
        <meshBasicMaterial color={col} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── 3D: REVENUE LINE ─────────────────────────────────────────────────────────
function RevenueLine() {
  const lineRef = useRef();
  const points = useMemo(
    () => BAR_DATA.map((h, i) => new THREE.Vector3((i - 5.5) * 0.72, h * 3.2 - 0.1, 0.32)),
    []
  );
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.6 + Math.sin(clock.getElapsedTime() * 1.8) * 0.25;
    }
  });

  return (
    <group>
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial color="#00e5ff" transparent opacity={0.8} linewidth={2} />
      </line>
      {points.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[i === points.length - 1 ? 0.055 : 0.035, 8, 8]} />
          <meshBasicMaterial
            color={i === points.length - 1 ? "#ffffff" : "#00e5ff"}
            transparent
            opacity={i === points.length - 1 ? 1 : 0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── 3D: PARTICLE FIELD ───────────────────────────────────────────────────────
function ParticleField({ count = 300 }) {
  const ref = useRef();
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color("#00e5ff");
    const violet = new THREE.Color("#7c3aed");
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      const c = Math.random() > 0.55 ? cyan : violet;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame(({ clock, mouse }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.03 + mouse.x * 0.05;
    ref.current.rotation.x = mouse.y * 0.025;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.003;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.038} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ─── 3D: FLOATING RINGS ───────────────────────────────────────────────────────
function HoloRings() {
  const refs = [useRef(), useRef(), useRef()];
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs[0].current && (refs[0].current.rotation.z = t * 0.2);
    refs[1].current && (refs[1].current.rotation.z = -t * 0.14);
    refs[2].current && (refs[2].current.rotation.y = t * 0.1);
  });
  return (
    <group position={[0, 2.5, -1]}>
      {[1.4, 2.1, 2.9].map((r, i) => (
        <mesh key={i} ref={refs[i]} rotation={[Math.PI / 2 + i * 0.22, 0, 0]}>
          <torusGeometry args={[r, 0.012, 8, 100]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#00e5ff" : "#7c3aed"}
            transparent
            opacity={0.08 + i * 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── 3D: CHART SCENE ─────────────────────────────────────────────────────────
function ChartScene() {
  const groupRef = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (mouse.x * 0.18 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (-mouse.y * 0.07 - groupRef.current.rotation.x) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <gridHelper args={[14, 20, "#00e5ff", "#0f1530"]} position={[0, -0.3, 0]}>
        <meshBasicMaterial transparent opacity={0.18} />
      </gridHelper>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]}>
        <planeGeometry args={[12, 0.04]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {BAR_DATA.map((h, i) => (
        <HoloBar key={i} index={i} position={[(i - 5.5) * 0.72, -0.3, 0]} height={h * 3.2} color={BAR_COLORS[i]} />
      ))}
      <RevenueLine />
      <HoloRings />
      <ParticleField count={300} />
      <Sparkles count={40} scale={10} size={1.2} speed={0.25} color="#00e5ff" opacity={0.35} />
    </group>
  );
}

// ─── UI: STAT CARD ────────────────────────────────────────────────────────────
function StatCard({ label, value, delta, positive = true, sparkBars, style = {}, className = "" }) {
  return (
    <div
      className={`stat-card ${className}`}
      style={style}
      role="figure"
      aria-label={`${label}: ${value}`}
    >
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className={`stat-delta ${positive ? "positive" : "negative"}`}>
        <span aria-hidden="true">{positive ? "▲" : "▼"}</span> {delta}
      </p>
      {sparkBars && (
        <div className="spark-bars" aria-hidden="true">
          {sparkBars.map((h, i) => (
            <div key={i} className="spark-bar" style={{ height: `${h}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── UI: TRUST BADGE ─────────────────────────────────────────────────────────
function TrustBadge({ label }) {
  return (
    <span className="trust-badge">
      <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
        <circle cx="4" cy="4" r="3" fill={TOKENS.cyan} opacity="0.7" />
      </svg>
      {label}
    </span>
  );
}

// ─── UI: TRUST STAT ──────────────────────────────────────────────────────────
function TrustStat({ num, label }) {
  return (
    <div className="trust-stat">
      <span className="trust-stat-num">{num}</span>
      <span className="trust-stat-label">{label}</span>
    </div>
  );
}

// ─── UI: NAV ─────────────────────────────────────────────────────────────────
function Navbar({ navRef }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav ref={navRef} className="navbar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <a href="/" className="logo" aria-label="Nexus home">
        <div className="logo-dot" aria-hidden="true" />
        NEXUS
      </a>

      {/* Desktop nav */}
      <ul className="nav-links" role="list">
        {NAV_LINKS.map(l => (
          <li key={l}>
            <a href="#" className="nav-link">{l}</a>
          </li>
        ))}
      </ul>

      {/* Desktop CTA */}
      <a href="#" className="btn btn-ghost nav-cta" aria-label="Get early access">
        Get Access <span aria-hidden="true">→</span>
      </a>

      {/* Hamburger */}
      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <span /><span /><span />
      </button>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <ul role="list">
          {NAV_LINKS.map(l => (
            <li key={l}>
              <a href="#" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>{l}</a>
            </li>
          ))}
        </ul>
        <a href="#" className="btn btn-primary mobile-cta">Get Access →</a>
      </div>
    </nav>
  );
}

// ─── MAIN HERO ────────────────────────────────────────────────────────────────
export default function Hero() {
  // Animation refs
  const eyebrowRef = useRef();
  const headlineRef = useRef();
  const subRef = useRef();
  const ctaRef = useRef();
  const trustRef = useRef();
  const navRef = useRef();
  const canvasWrapRef = useRef();

  // Cursor refs
  const cursorRef = useRef();
  const trailRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const trail = useRef({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, []);

  const onMouseMove = useCallback((e) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    if (cursorRef.current) {
      cursorRef.current.style.left = e.clientX + "px";
      cursorRef.current.style.top = e.clientY + "px";
    }
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    window.addEventListener("mousemove", onMouseMove);
    let raf;
    const animateTrail = () => {
      trail.current.x += (mouse.current.x - trail.current.x) * 0.1;
      trail.current.y += (mouse.current.y - trail.current.y) * 0.1;
      if (trailRef.current) {
        trailRef.current.style.left = trail.current.x + "px";
        trailRef.current.style.top = trail.current.y + "px";
      }
      raf = requestAnimationFrame(animateTrail);
    };
    raf = requestAnimationFrame(animateTrail);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [onMouseMove, isTouchDevice]);

  // GSAP entrance
  useEffect(() => {
    const wordEls = headlineRef.current?.querySelectorAll(".headline-word") ?? [];

    gsap.set([eyebrowRef.current, subRef.current, ctaRef.current, trustRef.current], { opacity: 0, y: 20 });
    gsap.set(wordEls, { y: "110%", opacity: 0 });
    gsap.set(navRef.current, { y: -60, opacity: 0 });
    gsap.set(canvasWrapRef.current, { opacity: 0, x: 30 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl
      .to(navRef.current, { y: 0, opacity: 1, duration: 0.65 })
      .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.55 }, "-=0.2")
      .to(wordEls, { y: "0%", opacity: 1, duration: 0.7, stagger: 0.08, ease: "power4.out" }, "-=0.15")
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.35")
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .to(trustRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .to(canvasWrapRef.current, { opacity: 1, x: 0, duration: 1, ease: "power2.out" }, "-=0.85");

    return () => tl.kill();
  }, []);

  return (
    <>
      {/* Custom cursor (desktop only) */}
      {!isTouchDevice && (
        <>
          <div ref={cursorRef} className="cursor-dot" aria-hidden="true" />
          <div ref={trailRef} className="cursor-ring" aria-hidden="true" />
        </>
      )}

      {/* Navbar */}
      <Navbar navRef={navRef} />

      {/* Hero */}
      <main>
        <section className="hero" aria-label="Hero section">
          {/* Background layers */}
          <div className="bg-gradient" aria-hidden="true" />
          <div className="bg-grid" aria-hidden="true" />
          <div className="bg-orb bg-orb--left" aria-hidden="true" />
          <div className="bg-orb bg-orb--right" aria-hidden="true" />

          {/* Content */}
          <div className="hero-inner">
            {/* Left column */}
            <div className="hero-left">

              {/* Eyebrow */}
              <div ref={eyebrowRef} className="eyebrow" aria-label="Social proof">
                <span className="eyebrow-dot" aria-hidden="true" />
                Trusted by 12,000+ brands worldwide
              </div>

              {/* Headline */}
              <h1 ref={headlineRef} className="headline">
                <span className="headline-line">
                  <span className="headline-word">Scale Your</span>
                </span>
                <span className="headline-line">
                  <span className="headline-word headline-word--gradient">Revenue</span>
                </span>
                <span className="headline-line">
                  <span className="headline-word">Without Limits</span>
                </span>
              </h1>

              {/* Subheadline */}
              <p ref={subRef} className="subheadline">
                The intelligence layer your e-commerce stack has been missing. Real-time analytics,
                predictive insights, and autonomous optimization — all in one unified platform.
              </p>

              {/* CTAs */}
              <div ref={ctaRef} className="cta-group">
                <a href="#" className="btn btn-primary" role="button">
                  Start Free Trial
                </a>
                <a href="#" className="btn btn-ghost" role="button">
                  <span className="btn-icon" aria-hidden="true">▶</span>
                  Watch Demo
                </a>
              </div>

              {/* Trust row */}
              <div ref={trustRef} className="trust-row">
                <TrustStat num="$2.4B+" label="Revenue tracked" />
                <div className="divider" role="separator" />
                <TrustStat num="340%" label="Avg. ROI" />
                <div className="divider" role="separator" />
                <TrustStat num="12ms" label="Latency" />
                <div className="divider divider--mobile-hide" role="separator" />
                <div className="trust-badges" role="list" aria-label="Certifications">
                  <TrustBadge label="SOC 2" />
                  <TrustBadge label="GDPR" />
                  <TrustBadge label="ISO 27001" />
                </div>
              </div>
            </div>

            {/* Right column — 3D canvas */}
            <div ref={canvasWrapRef} className="hero-right" aria-label="Interactive analytics visualization" role="img">
              <div className="canvas-container">
                <Canvas
                  camera={{ position: [0, 2, 9], fov: 55 }}
                  style={{ width: "100%", height: "100%", borderRadius: "16px" }}
                  gl={{ alpha: true, antialias: true }}
                >
                  <ChartScene />
                </Canvas>
              </div>

              {/* Floating stat cards */}
              <StatCard
                label="Monthly Revenue"
                value="$847K"
                delta="28.4% this month"
                positive
                sparkBars={[40, 55, 48, 70, 62, 85, 100]}
                className="stat-card--tr"
              />
              <StatCard
                label="Orders Today"
                value="4,291"
                delta="12.1% vs yesterday"
                positive
                className="stat-card--br"
              />
              <StatCard
                label="Conv. Rate"
                value="6.8%"
                delta="1.4% this week"
                positive
                className="stat-card--ml"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ── ALL STYLES ── */}
      <style>{`
        /* ─── FONTS ─────────────────────────────────────────────────────── */
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        /* ─── RESET & BASE ──────────────────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #05070f;
          color: #f1f5fe;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          cursor: none;
        }
        @media (pointer: coarse) { body { cursor: auto; } }
        a { text-decoration: none; color: inherit; }
        ul { list-style: none; }
        img { max-width: 100%; display: block; }

        /* ─── TYPE SCALE ────────────────────────────────────────────────── */
        /* Hero: clamp(40px, 5.5vw, 72px) */
        /* H2:   clamp(28px, 3.5vw, 48px) */
        /* Body: clamp(15px, 1.1vw, 17px) */
        /* Label: 11px / 12px */

        /* ─── CUSTOM CURSOR ─────────────────────────────────────────────── */
        .cursor-dot {
          position: fixed; pointer-events: none; z-index: 9999;
          width: 8px; height: 8px; border-radius: 50%;
          background: #00e5ff;
          transform: translate(-50%, -50%);
          mix-blend-mode: screen;
          will-change: left, top;
        }
        .cursor-ring {
          position: fixed; pointer-events: none; z-index: 9998;
          width: 28px; height: 28px; border-radius: 50%;
          border: 1px solid rgba(0,229,255,0.35);
          transform: translate(-50%, -50%);
          will-change: left, top;
        }

        /* ─── NAVBAR ────────────────────────────────────────────────────── */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(20px, 4vw, 48px);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(5,7,15,0.7);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .logo {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Sora', sans-serif;
          font-weight: 800; font-size: 18px;
          letter-spacing: -0.04em;
          color: #f1f5fe;
        }
        .logo-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #00e5ff;
          box-shadow: 0 0 12px #00e5ff;
        }
        .nav-links {
          display: flex; gap: clamp(20px, 3vw, 36px);
        }
        .nav-link {
          font-size: 13px; font-weight: 500;
          color: #8b95b3;
          letter-spacing: 0.01em;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #f1f5fe; }
        .nav-cta { display: flex; }

        /* Buttons */
        .btn {
          display: inline-flex; align-items: center; gap: 8px;
          height: 42px;
          padding: 0 22px;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer; border: none;
          transition: transform 0.18s ease, box-shadow 0.25s ease, border-color 0.2s, color 0.2s;
          text-decoration: none;
          white-space: nowrap;
        }
        .btn:focus-visible {
          outline: 2px solid #00e5ff;
          outline-offset: 2px;
        }
        .btn-primary {
          background: #00e5ff;
          color: #030508;
          font-weight: 700;
          box-shadow: 0 0 0 rgba(0,229,255,0);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(0,229,255,0.4), 0 2px 8px rgba(0,229,255,0.25);
        }
        .btn-primary:active { transform: translateY(0); }
        .btn-ghost {
          background: rgba(255,255,255,0.04);
          color: #8b95b3;
          border: 1px solid rgba(255,255,255,0.09);
        }
        .btn-ghost:hover {
          color: #f1f5fe;
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .btn-icon { font-size: 10px; }

        /* Hamburger */
        .hamburger {
          display: none; flex-direction: column; justify-content: space-between;
          width: 22px; height: 15px;
          background: none; border: none; cursor: pointer; padding: 0;
        }
        .hamburger span {
          display: block; width: 100%; height: 1.5px;
          background: #8b95b3;
          transition: transform 0.25s, opacity 0.25s, background 0.2s;
          transform-origin: center;
        }
        .hamburger:hover span { background: #f1f5fe; }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          position: fixed; top: 64px; left: 0; right: 0; bottom: 0; z-index: 99;
          backdrop-filter: blur(24px);
          background: rgba(5,7,15,0.97);
          flex-direction: column; align-items: center; justify-content: center; gap: 32px;
          opacity: 0; transform: translateY(-8px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          pointer-events: none;
        }
        .mobile-menu--open {
          opacity: 1; transform: translateY(0);
          pointer-events: all;
        }
        .mobile-nav-link {
          font-family: 'Sora', sans-serif;
          font-size: clamp(22px, 6vw, 32px); font-weight: 700;
          color: #8b95b3;
          transition: color 0.2s;
        }
        .mobile-nav-link:hover { color: #f1f5fe; }
        .mobile-cta { height: 50px; padding: 0 32px; font-size: 15px; }

        /* ─── HERO ──────────────────────────────────────────────────────── */
        .hero {
          position: relative;
          min-height: 100svh;
          padding-top: 64px;
          overflow: hidden;
        }
        .hero-inner {
          position: relative; z-index: 10;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: clamp(32px, 4vw, 60px);
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(48px, 7vh, 96px) clamp(20px, 4vw, 48px) clamp(32px, 5vh, 64px);
          min-height: calc(100svh - 64px);
        }

        /* ─── BACKGROUNDS ───────────────────────────────────────────────── */
        .bg-gradient {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 5% 50%, rgba(124,58,237,0.1) 0%, transparent 65%),
            radial-gradient(ellipse 50% 70% at 95% 50%, rgba(0,229,255,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 40% 35% at 50% 105%, rgba(124,58,237,0.08) 0%, transparent 55%);
        }
        .bg-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 80%);
        }
        .bg-orb {
          position: absolute; pointer-events: none; border-radius: 50%;
          animation: orbFloat 9s ease-in-out infinite;
        }
        .bg-orb--left {
          top: -20%; left: -15%;
          width: clamp(300px, 45vw, 560px); height: clamp(300px, 45vw, 560px);
          background: radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%);
        }
        .bg-orb--right {
          bottom: -10%; right: 15%;
          width: clamp(200px, 30vw, 380px); height: clamp(200px, 30vw, 380px);
          background: radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%);
          animation-delay: -4s; animation-direction: reverse;
        }

        /* ─── LEFT COLUMN ───────────────────────────────────────────────── */
        .hero-left {
          display: flex; flex-direction: column;
          gap: 0;
        }

        /* Eyebrow */
        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px; align-self: flex-start;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #a78bfa;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.22);
          margin-bottom: clamp(20px, 2.5vh, 28px);
        }
        .eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #a78bfa;
          animation: pulseDot 2.2s ease-in-out infinite;
        }

        /* Headline */
        .headline {
          font-family: 'Sora', sans-serif;
          font-size: clamp(38px, 5vw, 68px);
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -0.03em;
          color: #f1f5fe;
          margin-bottom: clamp(20px, 2.5vh, 28px);
        }
        .headline-line {
          display: block; overflow: hidden;
        }
        .headline-word {
          display: inline-block;
        }
        .headline-word--gradient {
          background: linear-gradient(135deg, #00e5ff 0%, #7c3aed 55%, #e040fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Sub */
        .subheadline {
          font-size: clamp(15px, 1.15vw, 17px);
          line-height: 1.8;
          color: #8b95b3;
          font-weight: 400;
          max-width: 460px;
          margin-bottom: clamp(28px, 4vh, 44px);
        }

        /* CTA group */
        .cta-group {
          display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
          margin-bottom: clamp(36px, 5vh, 56px);
        }
        .cta-group .btn-primary { height: 50px; padding: 0 28px; font-size: 14px; }
        .cta-group .btn-ghost  { height: 50px; padding: 0 24px; font-size: 14px; }

        /* Trust row */
        .trust-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: clamp(12px, 2vw, 24px);
          row-gap: 16px;
        }
        .trust-stat { display: flex; flex-direction: column; gap: 2px; }
        .trust-stat-num {
          font-family: 'Sora', sans-serif;
          font-size: clamp(16px, 1.4vw, 20px);
          font-weight: 700; letter-spacing: -0.03em;
          color: #f1f5fe;
        }
        .trust-stat-label {
          font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #4b5472;
        }
        .divider {
          width: 1px; height: 28px;
          background: rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .trust-badges {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .trust-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.03em;
          color: #8b95b3;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
        }

        /* ─── RIGHT COLUMN ──────────────────────────────────────────────── */
        .hero-right {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          height: clamp(380px, 50vw, 580px);
        }
        .canvas-container {
          width: 100%; height: 100%;
          border-radius: 16px;
          overflow: hidden;
        }

        /* ─── STAT CARDS ────────────────────────────────────────────────── */
        .stat-card {
          position: absolute; z-index: 20;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(5,7,15,0.75);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05);
          min-width: 148px;
        }
        .stat-label {
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #4b5472;
          margin-bottom: 4px;
        }
        .stat-value {
          font-family: 'Sora', sans-serif;
          font-size: 20px; font-weight: 700; letter-spacing: -0.04em;
          color: #f1f5fe;
          line-height: 1.1;
        }
        .stat-delta {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 500;
          margin-top: 4px;
        }
        .stat-delta.positive { color: #34d399; }
        .stat-delta.negative { color: #f87171; }
        .spark-bars {
          display: flex; align-items: flex-end; gap: 2px;
          height: 20px; margin-top: 10px;
        }
        .spark-bar {
          width: 4px; border-radius: 2px;
          background: rgba(0,229,255,0.55);
          min-height: 3px;
        }

        /* Card positions */
        .stat-card--tr {
          top: clamp(8px, 3%, 32px);
          right: clamp(-4px, -2%, -8px);
          animation: floatCard 6s ease-in-out infinite;
        }
        .stat-card--br {
          bottom: clamp(16px, 5%, 60px);
          right: clamp(-4px, -2%, -12px);
          animation: floatCard 7.5s ease-in-out infinite 1.2s;
        }
        .stat-card--ml {
          top: 50%; left: clamp(-4px, -2%, -20px);
          transform: translateY(-50%);
          animation: floatCardMid 5.5s ease-in-out infinite 0.6s;
        }

        /* ─── KEYFRAMES ─────────────────────────────────────────────────── */
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-22px); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.6); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatCardMid {
          0%, 100% { transform: translateY(-50%); }
          50% { transform: translateY(calc(-50% - 10px)); }
        }

        /* ─── RESPONSIVE ────────────────────────────────────────────────── */

        /* ≤ 1024px: stack layout */
        @media (max-width: 1024px) {
          .hero-inner {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: clamp(40px, 6vh, 72px);
          }
          .hero-left { align-items: center; }
          .eyebrow { align-self: center; }
          .subheadline { max-width: 560px; margin-inline: auto; }
          .cta-group { justify-content: center; }
          .trust-row { justify-content: center; }
          .headline { font-size: clamp(36px, 6.5vw, 56px); }

          .hero-right {
            height: clamp(320px, 55vw, 480px);
            width: 100%;
          }
          .stat-card--tr { top: 6px; right: 6px; }
          .stat-card--br { bottom: 14px; right: 6px; }
          .stat-card--ml { left: 6px; }
        }

        /* ≤ 768px */
        @media (max-width: 768px) {
          .nav-links, .nav-cta { display: none; }
          .hamburger { display: flex; }
          .mobile-menu { display: flex; }

          .hero-inner { padding-inline: 20px; gap: 28px; }
          .headline { font-size: clamp(32px, 8vw, 48px); }
          .subheadline { font-size: 15px; }
          .trust-row { gap: 12px; row-gap: 14px; }
          .divider--mobile-hide { display: none; }
          .trust-badges { width: 100%; justify-content: center; }

          .hero-right { height: clamp(280px, 65vw, 400px); }
          .stat-card { padding: 10px 12px; min-width: 120px; }
          .stat-value { font-size: 17px; }
          .spark-bars { height: 16px; }
        }

        /* ≤ 480px */
        @media (max-width: 480px) {
          .navbar { padding: 0 16px; }
          .eyebrow { font-size: 10px; padding: 5px 11px; }
          .headline { font-size: clamp(28px, 9vw, 40px); letter-spacing: -0.025em; }
          .cta-group { flex-direction: column; align-items: stretch; }
          .cta-group .btn { width: 100%; justify-content: center; height: 48px; }
          .trust-row { flex-direction: row; flex-wrap: wrap; justify-content: center; }
          .hero-right { height: clamp(240px, 70vw, 320px); }
          .stat-card--ml { display: none; }
        }

        /* ≤ 320px */
        @media (max-width: 320px) {
          .headline { font-size: 26px; }
          .stat-card--br { display: none; }
          .trust-stat:nth-child(5),
          .trust-stat:nth-child(7) { display: none; }
        }
      `}</style>
    </>
  );
}