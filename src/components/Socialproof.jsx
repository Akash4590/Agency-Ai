// ─────────────────────────────────────────────────────────────────────────────
// SocialProof.jsx — Social Proof + Results + Trust + CTA Bridge
// File: src/components/SocialProof.jsx
// deps: react, gsap (already installed)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

// ── Design tokens — identical to Hero / DashboardShowcase ──────────────────
const C = {
  cyan:    "#00e8ff",
  violet:  "#a450f7",
  pink:    "#f72585",
  bg:      "#020409",
  bgMid:   "#060c1a",
  bgCard:  "rgba(6,12,26,0.94)",
  border:  "rgba(255,255,255,0.07)",
  borderC: "rgba(0,232,255,0.13)",
  text:    "#f0f4ff",
  muted:   "#64748b",
  subtle:  "#334155",
  green:   "#34d399",
  amber:   "#fbbf24",
};

// ── Shared style helpers ───────────────────────────────────────────────────
const glass = (extra = {}) => ({
  background: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: "16px",
  backdropFilter: "blur(24px) saturate(160%)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
  ...extra,
});

const micro = (extra = {}) => ({
  fontSize: "9px",
  textTransform: "uppercase",
  letterSpacing: "0.13em",
  fontWeight: 600,
  color: C.muted,
  ...extra,
});

// ── useInView hook — triggers once when element enters viewport ────────────
function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ── Animated counter ───────────────────────────────────────────────────────
function Counter({ to, prefix = "", suffix = "", decimals = 0, duration = 2 }) {
  const ref  = useRef();
  const seen = useInView(ref, 0.5);
  const ran  = useRef(false);

  useEffect(() => {
    if (!seen || ran.current || !ref.current) return;
    ran.current = true;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: to,
      duration,
      ease: "power2.out",
      onUpdate() {
        if (ref.current)
          ref.current.textContent = prefix + obj.val.toFixed(decimals) + suffix;
      },
    });
  }, [seen, to, prefix, suffix, decimals, duration]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}0{suffix}
    </span>
  );
}

// ── 3D tilt card ──────────────────────────────────────────────────────────
function TiltCard({ children, style = {} }) {
  const ref = useRef();

  const onMove = useCallback((e) => {
    const el   = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) scale(1.02)`;
  }, []);

  const onLeave = useCallback(() => {
    if (ref.current)
      ref.current.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transition: "transform 0.25s cubic-bezier(0.25,1,0.5,1)",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. SECTION TRANSITION — glowing divider
// ═══════════════════════════════════════════════════════════════════════════
function SectionTransition() {
  return (
    <div style={{ position: "relative", height: "80px", overflow: "hidden", background: C.bg }}>
      {/* Gradient line */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "70%", height: "1px",
        background: `linear-gradient(90deg, transparent 0%, ${C.cyan}40 30%, ${C.violet}60 70%, transparent 100%)`,
      }} />
      {/* Glow bloom */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "300px", height: "80px",
        background: `radial-gradient(ellipse at center, ${C.violet}12 0%, transparent 70%)`,
      }} />
      {/* Center jewel */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "6px", height: "6px", borderRadius: "50%",
        background: C.cyan,
        boxShadow: `0 0 12px ${C.cyan}, 0 0 24px ${C.cyan}80`,
        animation: "spJewelPulse 2.5s ease-in-out infinite",
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. LOGO MARQUEE
// ═══════════════════════════════════════════════════════════════════════════
const LOGOS = [
  { name: "Shopify",    abbr: "S",  color: "#96bf48" },
  { name: "Klaviyo",   abbr: "K",  color: "#ffb100" },
  { name: "Stripe",    abbr: "St", color: "#635bff" },
  { name: "Salesforce",abbr: "SF", color: "#00a1e0" },
  { name: "HubSpot",   abbr: "H",  color: "#ff7a59" },
  { name: "Snowflake", abbr: "Sn", color: "#29b5e8" },
  { name: "Notion",    abbr: "N",  color: "#ffffff" },
  { name: "Figma",     abbr: "F",  color: "#f24e1e" },
  { name: "Linear",    abbr: "L",  color: "#5e6ad2" },
  { name: "Vercel",    abbr: "V",  color: "#ffffff" },
];

function LogoItem({ name, abbr, color }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 28px", borderRadius: "12px",
        border: `1px solid ${hov ? color + "30" : C.border}`,
        background: hov ? `${color}08` : "rgba(255,255,255,0.02)",
        transition: "all 0.3s",
        cursor: "default", flexShrink: 0,
        boxShadow: hov ? `0 0 20px ${color}18` : "none",
      }}
    >
      <div style={{
        width: "28px", height: "28px", borderRadius: "7px",
        background: hov ? `${color}22` : "rgba(255,255,255,0.06)",
        border: `1px solid ${hov ? color + "40" : "rgba(255,255,255,0.08)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "11px", fontWeight: 700,
        color: hov ? color : C.muted,
        transition: "all 0.3s",
        fontFamily: "'DM Sans',sans-serif",
      }}>{abbr}</div>
      <span style={{
        fontSize: "13px", fontWeight: 600, letterSpacing: "0.01em",
        color: hov ? C.text : C.muted,
        transition: "color 0.3s",
        fontFamily: "'DM Sans',sans-serif",
      }}>{name}</span>
    </div>
  );
}

function LogoMarquee() {
  const doubled = [...LOGOS, ...LOGOS]; // duplicate for seamless loop

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      {/* Fade masks */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", zIndex: 2,
        background: `linear-gradient(90deg, ${C.bg} 0%, transparent 100%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", zIndex: 2,
        background: `linear-gradient(270deg, ${C.bg} 0%, transparent 100%)`,
        pointerEvents: "none",
      }} />

      <div className="sp-marquee-track" style={{
        display: "flex", gap: "12px", width: "max-content",
        animation: "spMarquee 32s linear infinite",
      }}>
        {doubled.map((l, i) => <LogoItem key={i} {...l} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. METRICS — animated glowing counter cards
// ═══════════════════════════════════════════════════════════════════════════
const METRICS = [
  { prefix: "+", suffix: "%",  to: 340, dec: 0, label: "Average ROI",           sub: "Across all active accounts",    color: C.cyan,   icon: "◈" },
  { prefix: "$", suffix: "B+", to: 2.4, dec: 1, label: "Revenue Tracked",       sub: "Processed through Nexus pipes", color: C.violet, icon: "◆" },
  { prefix: "",  suffix: "ms", to: 12,  dec: 0, label: "Data Latency",          sub: "Real-time pipeline speed",      color: C.green,  icon: "⚡" },
  { prefix: "",  suffix: "%",  to: 99.99,dec:2,  label: "Uptime SLA",           sub: "Enterprise-grade reliability",  color: C.amber,  icon: "◉" },
  { prefix: "",  suffix: "K+", to: 12,  dec: 0, label: "Brands Powered",        sub: "Growing 40% month over month",  color: C.cyan,   icon: "⬡" },
  { prefix: "",  suffix: "M+", to: 2.1, dec: 1, label: "Daily Automations",     sub: "Tasks executed autonomously",   color: C.violet, icon: "⟐" },
];

function MetricCard({ prefix, suffix, to, dec, label, sub, color, icon, index }) {
  const ref  = useRef();
  const seen = useInView(ref, 0.3);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      className="sp-metric-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...glass({
          borderColor: hov ? `${color}30` : C.border,
          boxShadow: hov
            ? `0 0 40px ${color}14, 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)`
            : "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }),
        padding: "28px 24px",
        position: "relative", overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.25s",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        opacity: seen ? 1 : 0,
        animation: seen ? `spFadeUp 0.6s ease ${index * 0.09}s both` : "none",
      }}
    >
      {/* Top glow line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(90deg, transparent, ${color}50, transparent)`,
        opacity: hov ? 1 : 0,
        transition: "opacity 0.3s",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "9px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "15px", color: color,
          background: `${color}12`, border: `1px solid ${color}22`,
        }}>{icon}</div>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
      </div>

      <div style={{
        fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
        fontSize: "clamp(28px,3vw,36px)", color: C.text,
        letterSpacing: "-0.04em", lineHeight: 1,
        marginBottom: "6px",
      }}>
        {seen ? <Counter prefix={prefix} suffix={suffix} to={to} decimals={dec} duration={2} /> : `${prefix}0${suffix}`}
      </div>

      <p style={{ fontSize: "13px", fontWeight: 600, color: C.text, marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "11px", color: C.muted, lineHeight: 1.6, fontWeight: 400 }}>{sub}</p>
    </div>
  );
}

function MetricsGrid() {
  return (
    <div className="sp-metrics-grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
    }}>
      {METRICS.map((m, i) => <MetricCard key={i} {...m} index={i} />)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════
const TESTIMONIALS = [
  {
    name: "Sarah Kim",
    role: "VP of Revenue Operations",
    company: "Archetype Commerce",
    avatar: "SK",
    avatarColor: "#a450f7",
    stars: 5,
    text: "Nexus replaced four tools and a data analyst. Our gross margin improved 22% in the first quarter because we stopped leaving revenue on the table. The AI insights aren't generic — they're frighteningly specific to our business.",
    metric: "+22% gross margin",
    metricColor: "#34d399",
  },
  {
    name: "Marcus Torres",
    role: "Co-Founder & CTO",
    company: "Beacon Labs",
    avatar: "MT",
    avatarColor: "#00e8ff",
    stars: 5,
    text: "We evaluated Klaviyo, Triple Whale, and Northbeam before finding Nexus. Nothing comes close on data freshness. Sub-12ms latency isn't a marketing claim — I've watched our engineers verify it in production. It's real.",
    metric: "12ms verified latency",
    metricColor: "#00e8ff",
  },
  {
    name: "Priya Nair",
    role: "Head of Growth",
    company: "Volta DTC",
    avatar: "PN",
    avatarColor: "#f72585",
    stars: 5,
    text: "The automated cart recovery alone paid for the annual plan in the first week. What shocked me was how it adapted — the AI learned our customer behavior and stopped using the same playbook everyone else uses.",
    metric: "ROI in week one",
    metricColor: "#fbbf24",
  },
  {
    name: "James Whitfield",
    role: "Director of Engineering",
    company: "Meridian Group",
    avatar: "JW",
    avatarColor: "#34d399",
    stars: 5,
    text: "SOC 2 Type II, ISO 27001, GDPR-compliant infrastructure — Nexus passed our enterprise security review faster than any vendor I've worked with. The API is clean, the webhooks are reliable, the docs are actually good.",
    metric: "Zero security incidents",
    metricColor: "#34d399",
  },
];

function Stars({ count = 5 }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={C.amber}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t, index, visible }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...glass({
          borderColor: hov ? `${t.avatarColor}28` : C.border,
          boxShadow: hov
            ? `0 0 48px ${t.avatarColor}12, 0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)`
            : "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }),
        padding: "28px",
        display: "flex", flexDirection: "column", gap: "18px",
        transition: "all 0.3s",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        opacity: visible ? 1 : 0,
        animation: visible ? `spFadeUp 0.65s ease ${index * 0.12}s both` : "none",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Quote mark */}
      <div style={{
        position: "absolute", top: "14px", right: "20px",
        fontSize: "64px", lineHeight: 1, color: `${t.avatarColor}12`,
        fontFamily: "Georgia, serif", fontWeight: 700,
        userSelect: "none",
      }}>"</div>

      {/* Stars */}
      <Stars count={t.stars} />

      {/* Quote body */}
      <p style={{
        fontSize: "14px", lineHeight: 1.72, color: "#94a3b8",
        fontWeight: 400, fontFamily: "'DM Sans',sans-serif",
        flex: 1,
      }}>
        "{t.text}"
      </p>

      {/* Metric highlight */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "5px 12px", borderRadius: "8px", alignSelf: "flex-start",
        background: `${t.metricColor}10`, border: `1px solid ${t.metricColor}25`,
      }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: t.metricColor }} />
        <span style={{ fontSize: "11px", fontWeight: 600, color: t.metricColor }}>{t.metric}</span>
      </div>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "4px", borderTop: `1px solid ${C.border}` }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
          background: `${t.avatarColor}20`, border: `2px solid ${t.avatarColor}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 700, color: t.avatarColor,
          fontFamily: "'DM Sans',sans-serif",
        }}>{t.avatar}</div>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: C.text, lineHeight: 1.3, fontFamily: "'DM Sans',sans-serif" }}>{t.name}</p>
          <p style={{ fontSize: "11px", color: C.muted, lineHeight: 1.4 }}>{t.role} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsGrid() {
  const ref     = useRef();
  const visible = useInView(ref, 0.1);

  return (
    <div ref={ref} className="sp-testimonials-grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "16px",
    }}>
      {TESTIMONIALS.map((t, i) => (
        <TestimonialCard key={i} t={t} index={i} visible={visible} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. ENTERPRISE TRUST
// ═══════════════════════════════════════════════════════════════════════════
const CERTS = [
  { label: "SOC 2 Type II",   icon: "🔐", desc: "Annually audited security controls" },
  { label: "ISO 27001",       icon: "🏛",  desc: "Information security management" },
  { label: "GDPR Compliant",  icon: "🇪🇺", desc: "Full EU data residency options" },
  { label: "AES-256 Encrypt", icon: "🔑", desc: "End-to-end at rest and in transit" },
  { label: "99.99% Uptime",   icon: "📡", desc: "SLA-backed with financial penalties" },
  { label: "API Reliability", icon: "⚙️",  desc: "p99 latency under 15ms globally" },
];

function CertBadge({ label, icon, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "16px 18px", borderRadius: "12px",
        border: `1px solid ${hov ? C.borderC : C.border}`,
        background: hov ? "rgba(0,232,255,0.04)" : "rgba(255,255,255,0.02)",
        transition: "all 0.25s", cursor: "default",
      }}
    >
      <span style={{ fontSize: "20px", flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ fontSize: "12px", fontWeight: 700, color: C.text, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.3 }}>{label}</p>
        <p style={{ fontSize: "10px", color: C.muted, marginTop: "2px" }}>{desc}</p>
      </div>
      <div style={{
        marginLeft: "auto", width: "7px", height: "7px", borderRadius: "50%",
        background: C.green, boxShadow: `0 0 8px ${C.green}`,
        flexShrink: 0, animation: "spGreenPulse 2.4s ease-in-out infinite",
      }} />
    </div>
  );
}

function EnterpriseTrust() {
  const ref     = useRef();
  const visible = useInView(ref, 0.2);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity 0.7s, transform 0.7s",
    }}>
      {/* Section label */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          padding: "5px 16px", borderRadius: "100px", marginBottom: "16px",
          fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em",
          color: C.green, fontWeight: 600,
          background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)",
          fontFamily: "'DM Sans',sans-serif",
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.green }} />
          Enterprise Security
        </div>
        <h3 style={{
          fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
          fontSize: "clamp(20px,2.4vw,28px)", color: C.text,
          letterSpacing: "-0.4px", lineHeight: 1.2, margin: "0 auto",
          maxWidth: "500px",
        }}>
          Built to pass your security review.<br />
          <span style={{ color: C.muted, fontWeight: 400, fontSize: "90%" }}>On day one.</span>
        </h3>
      </div>

      <div className="sp-certs-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        {CERTS.map((c, i) => <CertBadge key={i} {...c} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. CTA BRIDGE
// ═══════════════════════════════════════════════════════════════════════════
function CTABridge() {
  const ref     = useRef();
  const visible = useInView(ref, 0.3);
  const [loading, setLoading] = useState(false);
  const [btnState, setBtnState] = useState("idle"); // idle | loading | done

  const handleTrial = () => {
    if (btnState !== "idle") return;
    setBtnState("loading");
    setTimeout(() => {
      setBtnState("done");
      setTimeout(() => setBtnState("idle"), 3000);
    }, 1800);
  };

  const handleDemo = () => {
    // Scroll to top (simulates navigating to booking)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={ref} style={{
      position: "relative",
      padding: "clamp(48px,7vw,96px) clamp(24px,5vw,80px)",
      borderRadius: "24px",
      border: `1px solid rgba(0,232,255,0.1)`,
      overflow: "hidden",
      textAlign: "center",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(32px)",
      transition: "opacity 0.8s, transform 0.8s",
      marginTop: "80px",
    }}>
      {/* BG glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(0,232,255,0.04) 0%, rgba(164,80,247,0.06) 50%, rgba(247,37,133,0.03) 100%)",
      }} />
      <div style={{
        position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "300px",
        background: `radial-gradient(ellipse at center, ${C.violet}14 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(${C.cyan} 1px, transparent 1px), linear-gradient(90deg, ${C.cyan} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          padding: "5px 16px", borderRadius: "100px", marginBottom: "24px",
          fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em",
          color: "#c084fc", fontWeight: 600,
          background: "rgba(164,80,247,0.1)", border: "1px solid rgba(164,80,247,0.22)",
          fontFamily: "'DM Sans',sans-serif",
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#c084fc", animation: "spJewelPulse 2s ease-in-out infinite" }} />
          Ready when you are
        </div>

        <h2 style={{
          fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
          fontSize: "clamp(26px,3.5vw,46px)",
          lineHeight: 1.1, letterSpacing: "-0.8px",
          color: C.text, marginBottom: "16px",
        }}>
          Stop leaving revenue on the table.<br />
          <span style={{
            background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.violet} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>Start growing this week.</span>
        </h2>

        <p style={{
          fontSize: "clamp(13px,1.3vw,16px)", lineHeight: 1.75,
          color: "#7d8fa8", fontWeight: 400, maxWidth: "480px",
          margin: "0 auto 40px", fontFamily: "'DM Sans',sans-serif",
        }}>
          Join 12,000+ brands using Nexus to turn their data into their most powerful growth engine. No contracts. Cancel anytime.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          {/* Primary — with loading state */}
          <button
            onClick={handleTrial}
            disabled={btnState !== "idle"}
            style={{
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
              fontSize: "14px", letterSpacing: "0.02em",
              padding: "14px 36px", borderRadius: "10px",
              border: "none", cursor: btnState === "idle" ? "pointer" : "default",
              color: btnState === "done" ? C.green : "#000",
              background: btnState === "done"
                ? "rgba(52,211,153,0.15)"
                : `linear-gradient(135deg, ${C.cyan}, #00a8c4)`,
              border: btnState === "done" ? `1px solid ${C.green}40` : "1px solid transparent",
              transition: "all 0.3s",
              boxShadow: btnState === "idle" ? `0 0 0 rgba(0,232,255,0)` : "none",
              minWidth: "180px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
            onMouseEnter={e => {
              if (btnState === "idle") {
                e.currentTarget.style.boxShadow = `0 0 36px rgba(0,232,255,0.42), 0 0 72px rgba(0,232,255,0.14)`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {btnState === "loading" && (
              <svg width="14" height="14" viewBox="0 0 24 24" style={{ animation: "spSpin 0.8s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.3)" strokeWidth="3" fill="none" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            )}
            {btnState === "loading" && "Setting up..."}
            {btnState === "idle"    && "Start Free Trial"}
            {btnState === "done"    && "✓ Check your email"}
          </button>

          {/* Secondary */}
          <button
            onClick={handleDemo}
            style={{
              fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
              fontSize: "14px", letterSpacing: "0.02em",
              padding: "14px 32px", borderRadius: "10px",
              cursor: "pointer", color: "#94a3b8",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${C.border}`,
              transition: "all 0.25s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(164,80,247,0.4)";
              e.currentTarget.style.color = "#c084fc";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(164,80,247,0.16)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Book a Demo →
          </button>
        </div>

        {/* Social proof footnote */}
        <div style={{
          marginTop: "28px", display: "flex", alignItems: "center",
          justifyContent: "center", gap: "16px", flexWrap: "wrap",
        }}>
          {["No credit card required", "14-day free trial", "Cancel anytime"].map((t, i) => (
            <span key={i} style={{
              display: "flex", alignItems: "center", gap: "5px",
              fontSize: "11px", color: C.muted, fontFamily: "'DM Sans',sans-serif",
            }}>
              <span style={{ color: C.green }}>✓</span> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION HEADER — shared
// ═══════════════════════════════════════════════════════════════════════════
function SectionHeader({ badge, badgeColor = C.cyan, title, titleAccent, sub, ref: _ref }) {
  const ref     = useRef();
  const visible = useInView(ref, 0.3);

  return (
    <div ref={ref} style={{
      textAlign: "center", marginBottom: "56px",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity 0.7s, transform 0.7s",
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "7px",
        padding: "5px 16px", borderRadius: "100px", marginBottom: "18px",
        fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em",
        color: badgeColor, fontWeight: 600,
        background: `${badgeColor}10`, border: `1px solid ${badgeColor}28`,
        fontFamily: "'DM Sans',sans-serif",
      }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: badgeColor }} />
        {badge}
      </div>
      <h2 style={{
        fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
        fontSize: "clamp(24px,3vw,40px)",
        lineHeight: 1.12, letterSpacing: "-0.8px",
        color: C.text, margin: "0 auto 14px",
      }}>
        {title}{" "}
        {titleAccent && (
          <span style={{
            background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.violet} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>{titleAccent}</span>
        )}
      </h2>
      {sub && (
        <p style={{
          fontSize: "clamp(13px,1.2vw,15px)", lineHeight: 1.72, color: "#7d8fa8",
          fontWeight: 400, maxWidth: "480px", margin: "0 auto",
          fontFamily: "'DM Sans',sans-serif",
        }}>{sub}</p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT SECTION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function SocialProof() {
  return (
    <>
      {/* Section transition from DashboardShowcase */}
      <SectionTransition />

      <section style={{
        position: "relative",
        background: C.bg,
        overflow: "hidden",
        padding: "0 clamp(20px,6vw,80px) 80px",
      }}>
        {/* Global ambient glow blobs */}
        <div style={{
          position: "absolute", top: "5%", left: "-8%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: `radial-gradient(circle, ${C.violet}08 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "-5%",
          width: "420px", height: "420px", borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cyan}06 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>

          {/* ── LOGOS ── */}
          <div style={{ marginBottom: "96px", paddingTop: "40px" }}>
            <p style={{
              textAlign: "center", ...micro({ fontSize: "10px", marginBottom: "24px", display: "block" }),
              fontFamily: "'DM Sans',sans-serif",
            }}>
              Powering growth teams at category-defining companies
            </p>
            <LogoMarquee />
          </div>

          {/* ── METRICS ── */}
          <div style={{ marginBottom: "100px" }}>
            <SectionHeader
              badge="Proven at scale"
              title="Numbers that"
              titleAccent="speak for themselves."
              sub="Nexus performance benchmarks pulled live from aggregate account data across all active storefronts."
            />
            <MetricsGrid />
          </div>

          {/* ── TESTIMONIALS ── */}
          <div style={{ marginBottom: "100px" }}>
            <SectionHeader
              badge="Customer stories"
              badgeColor={C.violet}
              title="Real results from"
              titleAccent="real operators."
              sub="Not managed case studies. Direct quotes from the people running the numbers every day."
            />
            <TestimonialsGrid />
          </div>

          {/* ── ENTERPRISE TRUST ── */}
          <div style={{ marginBottom: "80px" }}>
            <EnterpriseTrust />
          </div>

          {/* ── CTA BRIDGE ── */}
          <CTABridge />
        </div>

        {/* Bottom page fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
          background: `linear-gradient(to bottom, transparent, ${C.bg})`,
          pointerEvents: "none",
        }} />

        {/* ── ALL KEYFRAMES ── */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

          @keyframes spMarquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes spFadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes spJewelPulse {
            0%,100% { opacity:1; transform:scale(1);    }
            50%      { opacity:0.4; transform:scale(0.6); }
          }
          @keyframes spGreenPulse {
            0%,100% { opacity:1; box-shadow: 0 0 8px #34d399; }
            50%      { opacity:0.5; box-shadow: 0 0 16px #34d399; }
          }
          @keyframes spSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }

          /* Pause marquee on hover */
          .sp-marquee-track:hover { animation-play-state: paused !important; }

          /* Responsive: metrics 2-col tablet */
          @media (max-width: 860px) {
            .sp-metrics-grid      { grid-template-columns: repeat(2,1fr) !important; }
            .sp-certs-grid        { grid-template-columns: repeat(2,1fr) !important; }
          }
          /* Responsive: testimonials 1-col tablet */
          @media (max-width: 720px) {
            .sp-testimonials-grid { grid-template-columns: 1fr !important; }
          }
          /* Responsive: metrics + certs 1-col mobile */
          @media (max-width: 520px) {
            .sp-metrics-grid { grid-template-columns: 1fr !important; }
            .sp-certs-grid   { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}