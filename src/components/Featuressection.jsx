

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
  HiOutlineAdjustments,
  HiOutlineRefresh,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

gsap.registerPlugin(ScrollTrigger);

// ─── FEATURE DATA ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: "ai-forecast",
    icon: HiOutlineChartBar,
    accent: "#00e5ff",
    label: "AI Revenue Forecasting",
    desc: "Predict next-quarter revenue with 94% accuracy using transformer-based models trained on 2.4B+ transactions. Stop guessing, start knowing.",
    stat: "94% accuracy",
    statLabel: "forecast precision",
  },
  {
    id: "conv-opt",
    icon: HiOutlineLightningBolt,
    accent: "#7c3aed",
    label: "Conversion Optimization",
    desc: "Autonomous A/B engine tests 200+ variables simultaneously — copy, layout, pricing, and timing — maximizing CVR without engineer intervention.",
    stat: "+340%",
    statLabel: "avg. conversion lift",
  },
  {
    id: "pred-analytics",
    icon: HiOutlineUserGroup,
    accent: "#00e5ff",
    label: "Predictive Customer Analytics",
    desc: "Know which customers will churn 30 days before they do. Trigger personalized retention flows automatically with sub-100ms decisioning.",
    stat: "30 days",
    statLabel: "churn prediction lead",
  },
  {
    id: "attribution",
    icon: HiOutlineAdjustments,
    accent: "#a78bfa",
    label: "Attribution Intelligence",
    desc: "Multi-touch, data-driven attribution across every channel. Unify ad spend, organic, and referral into a single source of truth in real time.",
    stat: "100%",
    statLabel: "channel coverage",
  },
  {
    id: "campaign-scale",
    icon: HiOutlineRefresh,
    accent: "#7c3aed",
    label: "Automated Campaign Scaling",
    desc: "Nexus reads ROAS signals and auto-scales budgets 24/7. Reallocate spend from underperformers to winning audiences before competitors react.",
    stat: "24/7",
    statLabel: "autonomous scaling",
  },
  {
    id: "profit-monitor",
    icon: HiOutlineCurrencyDollar,
    accent: "#00e5ff",
    label: "Real-Time Profit Monitoring",
    desc: "Net margin, contribution margin, and LTV:CAC — refreshed every 12ms. Catch margin erosion the moment it starts, not when the books close.",
    stat: "12ms",
    statLabel: "data refresh rate",
  },
];

// ─── FEATURE CARD ─────────────────────────────────────────────────────────────
function FeatureCard({ feature, index }) {
  const cardRef = useRef();
  const glowRef = useRef();
  const iconRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const bounds = useRef(null);
  const rafId = useRef(null);

  // Magnetic tilt
  const handleMouseMove = (e) => {
    if (!bounds.current) bounds.current = cardRef.current.getBoundingClientRect();
    const b = bounds.current;
    const x = ((e.clientX - b.left) / b.width - 0.5) * 2;
    const y = ((e.clientY - b.top) / b.height - 0.5) * 2;
    mouse.current = { x, y };

    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      gsap.to(cardRef.current, {
        rotateY: x * 6,
        rotateX: -y * 4,
        transformPerspective: 900,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(glowRef.current, {
        opacity: 1,
        x: `${(x + 1) * 50}%`,
        y: `${(y + 1) * 50}%`,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  };

  const handleMouseEnter = () => {
    bounds.current = cardRef.current.getBoundingClientRect();
    gsap.to(iconRef.current, { scale: 1.15, rotate: -5, duration: 0.3, ease: "back.out(2)" });
  };

  const handleMouseLeave = () => {
    bounds.current = null;
    cancelAnimationFrame(rafId.current);
    gsap.to(cardRef.current, {
      rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out",
    });
    gsap.to(glowRef.current, { opacity: 0, duration: 0.5 });
    gsap.to(iconRef.current, { scale: 1, rotate: 0, duration: 0.4, ease: "power2.out" });
  };

  const Icon = feature.icon;
  const isEven = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className="feat-card"
      style={{ "--accent": feature.accent, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Moving glow blob */}
      <div ref={glowRef} className="feat-card__glow" style={{ background: `radial-gradient(circle at 50% 50%, ${feature.accent}22 0%, transparent 65%)` }} />

      {/* Border gradient */}
      <div className="feat-card__border" style={{ "--accent": feature.accent }} />

      {/* Icon */}
      <div className="feat-card__icon-wrap" style={{ "--accent": feature.accent }}>
        <span ref={iconRef} className="feat-card__icon">
          <Icon />
        </span>
      </div>

      {/* Content */}
      <div className="feat-card__content">
        <h3 className="feat-card__title">{feature.label}</h3>
        <p className="feat-card__desc">{feature.desc}</p>
      </div>

      {/* Stat */}
      <div className="feat-card__stat">
        <span className="feat-card__stat-num" style={{ color: feature.accent }}>{feature.stat}</span>
        <span className="feat-card__stat-label">{feature.statLabel}</span>
      </div>
    </div>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  const sectionRef = useRef();
  const badgeRef = useRef();
  const headRef = useRef();
  const subRef = useRef();
  const gridRef = useRef();

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Badge + headline
      gsap.from([badgeRef.current, headRef.current, subRef.current], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Cards stagger
      const cards = gridRef.current.querySelectorAll(".feat-card");
      gsap.from(cards, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          once: true,
        },
        y: 48,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="features-section" aria-label="Platform features">
      {/* BG accents */}
      <div className="features-bg" aria-hidden="true" />

      <div className="section-container">
        {/* Header */}
        <div className="section-header">
          <div ref={badgeRef} className="section-badge">
            <span className="section-badge__dot" />
            Platform Capabilities
          </div>
          <h2 ref={headRef} className="section-headline">
            Every tool you need to<br />
            <span className="gradient-text">dominate your market</span>
          </h2>
          <p ref={subRef} className="section-sub">
            Six intelligence modules working in concert — each one best-in-class,
            together they form an unfair competitive advantage.
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="feat-grid">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} />
          ))}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        /* ─── SECTION BASE ───────────────────────────────────────── */
        .features-section {
          position: relative;
          background: #05070f;
          padding: clamp(80px, 12vh, 140px) 0;
          overflow: hidden;
        }
        .features-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 40% at 15% 50%, rgba(124,58,237,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 40% 60% at 85% 30%, rgba(0,229,255,0.05) 0%, transparent 65%);
        }
        .section-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 48px);
        }

        /* ─── HEADER ─────────────────────────────────────────────── */
        .section-header {
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          margin-bottom: clamp(48px, 7vh, 80px);
          max-width: 680px;
          margin-inline: auto;
          margin-bottom: clamp(48px, 7vh, 80px);
        }
        .section-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 100px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #00e5ff;
          background: rgba(0,229,255,0.08);
          border: 1px solid rgba(0,229,255,0.18);
          margin-bottom: 20px;
        }
        .section-badge__dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00e5ff;
          animation: pulseDot 2.2s ease-in-out infinite;
        }
        .section-headline {
          font-family: 'Sora', sans-serif;
          font-size: clamp(32px, 4vw, 54px);
          font-weight: 800; line-height: 1.1;
          letter-spacing: -0.03em;
          color: #f1f5fe;
          margin-bottom: 18px;
        }
        .section-sub {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(15px, 1.1vw, 17px);
          line-height: 1.75; color: #8b95b3; font-weight: 400;
        }
        .gradient-text {
          background: linear-gradient(135deg, #00e5ff 0%, #7c3aed 55%, #e040fb 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ─── GRID ───────────────────────────────────────────────── */
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2vw, 24px);
        }

        /* ─── CARD ───────────────────────────────────────────────── */
        .feat-card {
          position: relative;
          background: rgba(255,255,255,0.025);
          border-radius: 20px;
          padding: clamp(24px, 3vw, 36px);
          display: flex; flex-direction: column; gap: 18px;
          overflow: hidden;
          cursor: default;
          transition: background 0.3s ease;
          will-change: transform;
        }
        .feat-card:hover {
          background: rgba(255,255,255,0.038);
        }

        /* Border via pseudo / overlay */
        .feat-card__border {
          position: absolute; inset: 0;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.07);
          pointer-events: none;
          transition: border-color 0.3s;
        }
        .feat-card:hover .feat-card__border {
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
        }

        /* Glow blob */
        .feat-card__glow {
          position: absolute;
          width: 220px; height: 220px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none; opacity: 0;
          will-change: opacity, transform;
          top: 0; left: 0;
        }

        /* Icon */
        .feat-card__icon-wrap {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
          flex-shrink: 0;
        }
        .feat-card__icon {
          display: flex; font-size: 22px;
          color: var(--accent);
          will-change: transform;
        }

        /* Content */
        .feat-card__content { flex: 1; }
        .feat-card__title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(15px, 1.2vw, 17px);
          font-weight: 700; letter-spacing: -0.02em;
          color: #f1f5fe;
          margin-bottom: 10px;
        }
        .feat-card__desc {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(13px, 0.95vw, 14px);
          line-height: 1.72; color: #6b7599;
          font-weight: 400;
        }

        /* Stat */
        .feat-card__stat {
          display: flex; align-items: center; gap: 10px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .feat-card__stat-num {
          font-family: 'Sora', sans-serif;
          font-size: 18px; font-weight: 800;
          letter-spacing: -0.04em;
        }
        .feat-card__stat-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: #4b5472;
        }

        /* ─── RESPONSIVE ─────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .feat-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .feat-grid { grid-template-columns: 1fr; }
          .feat-card { padding: 22px 20px; }
        }
        @media (max-width: 480px) {
          .section-headline br { display: none; }
        }

        /* ─── KEYFRAMES ──────────────────────────────────────────── */
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.6); }
        }
        @media (prefers-reduced-motion: reduce) {
          .feat-card { transition: none !important; }
          .section-badge__dot { animation: none; }
        }
      `}</style>
    </section>
  );
}
