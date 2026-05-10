// ─────────────────────────────────────────────────────────────────────────────
// DashboardShowcase.jsx — Product Experience Section
// File: src/components/DashboardShowcase.jsx
// deps: react, gsap
// Usage: import DashboardShowcase from "./components/DashboardShowcase"
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// ── Design tokens (matches Hero) ───────────────────────────────────────────
const C = {
  cyan:    "#00e8ff",
  violet:  "#a450f7",
  pink:    "#f72585",
  bg:      "#020409",
  bgMid:   "#060c1a",
  bgCard:  "rgba(6,12,26,0.92)",
  border:  "rgba(255,255,255,0.07)",
  borderC: "rgba(0,232,255,0.14)",
  text:    "#f0f4ff",
  muted:   "#64748b",
  subtle:  "#334155",
  green:   "#34d399",
  amber:   "#fbbf24",
  red:     "#f87171",
};

// ── Tiny helpers ───────────────────────────────────────────────────────────
const glass = (extra = {}) => ({
  background: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: "14px",
  backdropFilter: "blur(20px) saturate(150%)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
  ...extra,
});

const label = (extra = {}) => ({
  fontSize: "9px",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: C.muted,
  fontWeight: 500,
  ...extra,
});

// ── Revenue Sparkline ──────────────────────────────────────────────────────
const SPARK = [38, 52, 44, 61, 55, 70, 63, 80, 74, 88, 82, 100];

function RevenueChart() {
  const [lit, setLit] = useState(SPARK.length - 1);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setLit(i % SPARK.length);
      i++;
    }, 900);
    return () => clearInterval(id);
  }, []);

  // SVG polyline path
  const W = 260, H = 72;
  const pts = SPARK.map((v, i) => {
    const x = (i / (SPARK.length - 1)) * W;
    const y = H - (v / 100) * H;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div style={{ ...glass(), padding: "18px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div>
          <p style={label()}>Revenue — 30d</p>
          <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "22px", color: C.text, letterSpacing: "-0.5px", lineHeight: 1.1, marginTop: "3px" }}>
            $2,841,400
          </p>
          <p style={{ fontSize: "11px", color: C.green, marginTop: "3px", fontWeight: 500 }}>▲ 34.2% vs last month</p>
        </div>
        <div style={{
          padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 600,
          color: C.cyan, background: "rgba(0,232,255,0.08)", border: `1px solid ${C.borderC}`,
        }}>LIVE</div>
      </div>

      {/* SVG line chart */}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.18" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <polygon
          points={`0,${H} ${pts} ${W},${H}`}
          fill="url(#lineGrad)"
        />
        {/* Line */}
        <polyline points={pts} fill="none" stroke={C.cyan} strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
        {/* Dots */}
        {SPARK.map((v, i) => {
          const x = (i / (SPARK.length - 1)) * W;
          const y = H - (v / 100) * H;
          return (
            <circle key={i} cx={x} cy={y} r={i === lit ? 4 : 2.2}
              fill={i === lit ? "#fff" : C.cyan}
              opacity={i === lit ? 1 : 0.5}
              style={{ transition: "r 0.4s, fill 0.4s" }} />
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        {["Jan","Feb","Mar","Apr","May","Jun"].map(m => (
          <span key={m} style={{ fontSize: "9px", color: C.subtle, letterSpacing: "0.05em" }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

// ── AI Insight Panel ───────────────────────────────────────────────────────
const INSIGHTS = [
  { icon: "⚡", text: "Checkout abandonment dropped 18% after AI-optimized flow", tag: "Conversion", color: C.cyan },
  { icon: "📈", text: "Predicted Q3 revenue: $4.2M based on current trajectory", tag: "Forecast",   color: C.violet },
  { icon: "🎯", text: "Top cohort LTV increased 2.3× with dynamic pricing", tag: "Retention",  color: C.green },
];

function AIInsightPanel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % INSIGHTS.length), 3200);
    return () => clearInterval(id);
  }, []);

  const ins = INSIGHTS[active];

  return (
    <div style={{ ...glass(), padding: "16px 18px", position: "relative", overflow: "hidden" }}>
      {/* Glow accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(90deg, transparent, ${ins.color}, transparent)`,
        transition: "background 0.6s",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "14px",
          background: "rgba(164,80,247,0.1)", border: "1px solid rgba(164,80,247,0.18)",
        }}>{ins.icon}</div>
        <div>
          <p style={label()}>Nexus AI · Insight</p>
          <span style={{
            fontSize: "9px", fontWeight: 600, color: ins.color,
            textTransform: "uppercase", letterSpacing: "0.08em",
            transition: "color 0.4s",
          }}>{ins.tag}</span>
        </div>
        {/* Rotating indicator */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
          {INSIGHTS.map((_, i) => (
            <div key={i} style={{
              width: i === active ? "16px" : "4px", height: "4px", borderRadius: "2px",
              background: i === active ? C.cyan : C.subtle,
              transition: "all 0.4s",
            }} />
          ))}
        </div>
      </div>

      <p style={{ fontSize: "12px", lineHeight: 1.65, color: "#94a3b8", transition: "opacity 0.4s" }}>
        {ins.text}
      </p>
    </div>
  );
}

// ── Active Users Pulse ─────────────────────────────────────────────────────
function ActiveUsers() {
  const [count, setCount] = useState(3847);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 7) - 2);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const BARS = [55, 70, 60, 82, 74, 90, 78, 95, 85, 100, 88, 94];

  return (
    <div style={{ ...glass(), padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div>
          <p style={label()}>Active Users</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "3px" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "20px", color: C.text, letterSpacing: "-0.4px" }}>
              {count.toLocaleString()}
            </span>
            <span style={{ fontSize: "10px", color: C.green, fontWeight: 500 }}>▲ live</span>
          </div>
        </div>
        {/* Pulsing dot */}
        <div style={{ position: "relative", width: "10px", height: "10px" }}>
          <div style={{
            width: "10px", height: "10px", borderRadius: "50%", background: C.green,
            position: "absolute",
          }} />
          <div style={{
            width: "10px", height: "10px", borderRadius: "50%", background: C.green,
            position: "absolute", opacity: 0.4,
            animation: "pingPulse 1.6s ease-out infinite",
          }} />
        </div>
      </div>

      {/* Mini bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "32px" }}>
        {BARS.map((h, i) => (
          <div key={i} style={{
            flex: 1, height: `${h}%`, borderRadius: "2px 2px 0 0",
            background: i >= BARS.length - 3
              ? `linear-gradient(to top, ${C.violet}, ${C.cyan})`
              : `rgba(100,116,139,0.25)`,
            transition: "height 0.8s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Conversion Metrics ─────────────────────────────────────────────────────
const METRICS = [
  { label: "Checkout Rate",  value: 72, color: C.cyan,   display: "72%" },
  { label: "Cart Recovery",  value: 58, color: C.violet, display: "58%" },
  { label: "Email CTR",      value: 84, color: C.green,  display: "84%" },
];

function ConversionMetrics() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ ...glass(), padding: "16px 18px" }}>
      <p style={{ ...label(), marginBottom: "14px" }}>Conversion Metrics</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
        {METRICS.map((m, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>{m.label}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: m.color }}>{m.display}</span>
            </div>
            <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "2px",
                background: `linear-gradient(90deg, ${m.color}88, ${m.color})`,
                width: animated ? `${m.value}%` : "0%",
                transition: `width ${0.8 + i * 0.15}s cubic-bezier(0.25,1,0.5,1)`,
                boxShadow: `0 0 8px ${m.color}55`,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Notification Popup ─────────────────────────────────────────────────────
const NOTIFS = [
  { avatar: "SK", name: "Sarah K.",  action: "just upgraded to Enterprise", time: "2s ago",  color: "#a450f7" },
  { avatar: "MT", name: "Mike T.",   action: "recovered $8,400 in lost carts", time: "14s ago", color: "#00e8ff" },
  { avatar: "AL", name: "Aisha L.", action: "automation saved 12h this week",  time: "1m ago",  color: "#34d399" },
];

function NotificationPopup() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(p => (p + 1) % NOTIFS.length);
        setVisible(true);
      }, 350);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const n = NOTIFS[idx];

  return (
    <div style={{
      ...glass({ borderRadius: "12px" }),
      padding: "12px 14px",
      border: `1px solid rgba(0,232,255,0.12)`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(6px)",
      transition: "opacity 0.35s, transform 0.35s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
          background: `${n.color}22`, border: `1px solid ${n.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "10px", fontWeight: 700, color: n.color,
        }}>{n.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "11px", color: C.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {n.name} <span style={{ color: "#94a3b8", fontWeight: 400 }}>{n.action}</span>
          </p>
          <p style={{ fontSize: "9px", color: C.muted, marginTop: "2px" }}>{n.time}</p>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Panel (assembled) ────────────────────────────────────────────
function DashboardPanel() {
  const panelRef = useRef();

  return (
    <div ref={panelRef} style={{
      position: "relative",
      width: "100%",
      maxWidth: "540px",
      margin: "0 auto",
    }}>
      {/* Outer glow halo */}
      <div style={{
        position: "absolute", inset: "-1px",
        borderRadius: "20px",
        background: `linear-gradient(135deg, ${C.cyan}22, ${C.violet}22)`,
        filter: "blur(1px)",
        zIndex: 0,
      }} />

      {/* Main dashboard frame */}
      <div style={{
        position: "relative", zIndex: 1,
        background: "linear-gradient(145deg, rgba(6,12,26,0.98) 0%, rgba(4,8,20,0.98) 100%)",
        border: `1px solid rgba(0,232,255,0.12)`,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
      }}>
        {/* Title bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "12px 18px",
          borderBottom: `1px solid ${C.border}`,
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f87171" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.amber }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.green }} />
          <span style={{ marginLeft: "8px", fontSize: "11px", color: C.muted, fontWeight: 500, letterSpacing: "0.04em" }}>
            nexus · revenue intelligence
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green, display: "inline-block", animation: "pingPulse 2s ease-out infinite" }} />
            <span style={{ fontSize: "9px", color: C.green, fontWeight: 600 }}>CONNECTED</span>
          </div>
        </div>

        {/* Dashboard body */}
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <RevenueChart />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <ActiveUsers />
            <ConversionMetrics />
          </div>

          <AIInsightPanel />

          <NotificationPopup />
        </div>

        {/* Bottom status bar */}
        <div style={{
          padding: "8px 18px",
          borderTop: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(255,255,255,0.015)",
        }}>
          <span style={{ fontSize: "9px", color: C.subtle, letterSpacing: "0.08em" }}>
            LAST SYNC: 0.4s AGO
          </span>
          <div style={{ display: "flex", gap: "12px" }}>
            {["API", "DB", "ML"].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.green }} />
                <span style={{ fontSize: "9px", color: C.subtle }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating insight badge */}
      <div style={{
        position: "absolute", top: "-18px", right: "-18px",
        ...glass({ borderRadius: "12px", border: `1px solid rgba(164,80,247,0.22)` }),
        padding: "10px 14px",
        animation: "floatBadge 5s ease-in-out infinite",
        zIndex: 10,
      }}>
        <p style={label({ marginBottom: "2px" })}>AI Score</p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "17px", color: C.violet }}>98.4</span>
          <span style={{ fontSize: "10px", color: C.green }}>↑</span>
        </div>
      </div>

      {/* Floating bottom-left stat */}
      <div style={{
        position: "absolute", bottom: "-14px", left: "-16px",
        ...glass({ borderRadius: "12px", border: `1px solid rgba(0,232,255,0.16)` }),
        padding: "10px 14px",
        animation: "floatBadge 6s ease-in-out infinite 1.2s",
        zIndex: 10,
      }}>
        <p style={label({ marginBottom: "2px" })}>Automation</p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "17px", color: C.cyan }}>2,140</span>
          <span style={{ fontSize: "9px", color: C.muted }}>tasks/day</span>
        </div>
      </div>
    </div>
  );
}

// ── Left content: Feature highlights ──────────────────────────────────────
const HIGHLIGHTS = [
  {
    icon: "◈",
    title: "Unified data in real time",
    desc: "Every order, session, and signal — merged into one live operational view with sub-12ms latency.",
    color: C.cyan,
  },
  {
    icon: "⬡",
    title: "AI that acts, not just alerts",
    desc: "Nexus doesn't surface insights and wait. It executes optimizations autonomously across pricing, inventory, and flows.",
    color: C.violet,
  },
  {
    icon: "◉",
    title: "Enterprise-grade reliability",
    desc: "99.99% uptime SLA, SOC 2 Type II certified, with GDPR-compliant data pipelines built for scale.",
    color: C.green,
  },
];

function HighlightRow({ icon, title, desc, color, delay }) {
  const ref = useRef();
  return (
    <div ref={ref} className="ds-highlight" style={{
      display: "flex", gap: "14px", alignItems: "flex-start",
      padding: "14px 16px", borderRadius: "12px",
      border: `1px solid ${C.border}`,
      background: "rgba(6,12,26,0.6)",
      transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s",
      cursor: "default",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}30`;
        e.currentTarget.style.boxShadow = `0 0 24px ${color}12`;
        e.currentTarget.style.background = `rgba(6,12,26,0.85)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = "rgba(6,12,26,0.6)";
      }}
    >
      <div style={{
        width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "15px", background: `${color}12`,
        border: `1px solid ${color}22`,
        color: color,
      }}>{icon}</div>
      <div>
        <p style={{ fontSize: "13px", fontWeight: 600, color: C.text, marginBottom: "4px", lineHeight: 1.35 }}>{title}</p>
        <p style={{ fontSize: "12px", lineHeight: 1.68, color: "#7d8fa8", fontWeight: 300 }}>{desc}</p>
      </div>
    </div>
  );
}

// ── Trust Strip ────────────────────────────────────────────────────────────
const TRUST_STATS = [
  { num: "99.99%",  label: "Uptime SLA" },
  { num: "340%",    label: "Avg. ROI" },
  { num: "4.8×",    label: "Customer Growth" },
  { num: "2.1M+",   label: "Tasks Automated Daily" },
  { num: "$2.4B+",  label: "Revenue Tracked" },
  { num: "<12ms",   label: "Data Latency" },
];

function TrustStrip() {
  return (
    <div style={{
      marginTop: "80px",
      borderTop: `1px solid ${C.border}`,
      paddingTop: "40px",
    }}>
      <p style={{
        textAlign: "center", ...label({ fontSize: "10px", letterSpacing: "0.14em", marginBottom: "28px", color: C.subtle }),
      }}>
        Performance metrics across 12,000+ active storefronts
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "1px",
        background: C.border,
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${C.border}`,
      }}>
        {TRUST_STATS.map((s, i) => (
          <div key={i} style={{
            background: C.bgMid,
            padding: "20px 16px",
            textAlign: "center",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,232,255,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = C.bgMid}
          >
            <p style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "18px",
              color: i % 2 === 0 ? C.cyan : C.text,
              letterSpacing: "-0.4px", marginBottom: "4px",
            }}>{s.num}</p>
            <p style={{ fontSize: "10px", color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section Root ───────────────────────────────────────────────────────────
export default function DashboardShowcase() {
  const sectionRef  = useRef();
  const badgeRef    = useRef();
  const headRef     = useRef();
  const paraRef     = useRef();
  const hlRefs      = useRef([]);
  const ctaRef      = useRef();
  const dashRef     = useRef();
  const stripRef    = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
        defaults: { ease: "power3.out" },
      });

      // Fallback: if ScrollTrigger isn't loaded, just run after small delay
      if (!gsap.plugins?.ScrollTrigger) {
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            runAnim();
            obs.disconnect();
          }
        }, { threshold: 0.12 });
        obs.observe(sectionRef.current);
        return;
      }

      function runAnim() {
        gsap.set([badgeRef.current, headRef.current, paraRef.current, ctaRef.current], { y: 28, opacity: 0 });
        gsap.set(hlRefs.current, { x: -20, opacity: 0 });
        gsap.set(dashRef.current, { x: 40, opacity: 0 });
        gsap.set(stripRef.current, { y: 20, opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl
          .to(badgeRef.current,  { y: 0, opacity: 1, duration: 0.55 })
          .to(headRef.current,   { y: 0, opacity: 1, duration: 0.65 }, "-=0.3")
          .to(paraRef.current,   { y: 0, opacity: 1, duration: 0.6  }, "-=0.4")
          .to(hlRefs.current,    { x: 0, opacity: 1, duration: 0.6, stagger: 0.12 }, "-=0.3")
          .to(ctaRef.current,    { y: 0, opacity: 1, duration: 0.55 }, "-=0.25")
          .to(dashRef.current,   { x: 0, opacity: 1, duration: 0.85, ease: "power2.out" }, "-=0.9")
          .to(stripRef.current,  { y: 0, opacity: 1, duration: 0.65 }, "-=0.2");
      }

      runAnim();
    }, sectionRef);

    // Simple IntersectionObserver fallback (always works, no plugin needed)
    gsap.set([badgeRef.current, headRef.current, paraRef.current, ctaRef.current], { y: 28, opacity: 0 });
    gsap.set(hlRefs.current.filter(Boolean), { x: -20, opacity: 0 });
    gsap.set(dashRef.current, { x: 40, opacity: 0 });
    gsap.set(stripRef.current, { y: 20, opacity: 0 });

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl
        .to(badgeRef.current,                { y: 0, opacity: 1, duration: 0.55 })
        .to(headRef.current,                 { y: 0, opacity: 1, duration: 0.65 }, "-=0.3")
        .to(paraRef.current,                 { y: 0, opacity: 1, duration: 0.60 }, "-=0.4")
        .to(hlRefs.current.filter(Boolean),  { x: 0, opacity: 1, duration: 0.60, stagger: 0.12 }, "-=0.3")
        .to(ctaRef.current,                  { y: 0, opacity: 1, duration: 0.55 }, "-=0.25")
        .to(dashRef.current,                 { x: 0, opacity: 1, duration: 0.85, ease: "power2.out" }, "-=0.9")
        .to(stripRef.current,               { y: 0, opacity: 1, duration: 0.65 }, "-=0.2");
      obs.disconnect();
    }, { threshold: 0.10 });

    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: C.bg,
        overflow: "hidden",
        padding: "120px clamp(20px,6vw,80px) 80px",
      }}
    >
      {/* ── Top gradient continuation from previous section ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "180px",
        background: `linear-gradient(to bottom, rgba(164,80,247,0.05) 0%, transparent 100%)`,
        pointerEvents: "none",
      }} />

      {/* ── Ambient glow blobs ── */}
      <div style={{
        position: "absolute", top: "10%", right: "-5%",
        width: "500px", height: "500px", borderRadius: "50%",
        background: `radial-gradient(circle, rgba(164,80,247,0.07) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "-5%",
        width: "400px", height: "400px", borderRadius: "50%",
        background: `radial-gradient(circle, rgba(0,232,255,0.05) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── Main two-column layout ── */}
        <div className="ds-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px,6vw,96px)",
          alignItems: "center",
        }}>

          {/* ── LEFT: Text content ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Badge */}
            <div ref={badgeRef} style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              alignSelf: "flex-start",
              padding: "5px 14px", borderRadius: "100px",
              fontSize: "10px", textTransform: "uppercase",
              letterSpacing: "0.12em", color: C.cyan, fontWeight: 600,
              background: "rgba(0,232,255,0.07)", border: `1px solid ${C.borderC}`,
            }}>
              <span style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: C.cyan, animation: "pulseDot 2s ease-in-out infinite",
              }} />
              Product Experience
            </div>

            {/* Heading */}
            <h2 ref={headRef} style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 700,
              fontSize: "clamp(26px,3.2vw,42px)",
              lineHeight: 1.12, letterSpacing: "-1px",
              color: C.text, margin: 0,
            }}>
              Intelligence you can{" "}
              <span style={{
                background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.violet} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                see working
              </span>
            </h2>

            {/* Supporting copy */}
            <p ref={paraRef} style={{
              fontSize: "clamp(13px,1.2vw,15px)", lineHeight: 1.78,
              color: "#7d8fa8", fontWeight: 300, margin: 0,
              maxWidth: "420px",
            }}>
              Nexus gives your entire team a real-time command center. From revenue forecasting to automated cart recovery — every metric, every signal, every action in one place.
            </p>

            {/* Feature highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {HIGHLIGHTS.map((h, i) => (
                <div key={i} ref={el => hlRefs.current[i] = el}>
                  <HighlightRow {...h} delay={i * 0.12} />
                </div>
              ))}
            </div>

            {/* CTA */}
            <div ref={ctaRef} style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <button style={{
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                fontSize: "13px", letterSpacing: "0.025em",
                padding: "13px 30px", borderRadius: "10px",
                border: "none", cursor: "pointer", color: "#000",
                background: `linear-gradient(135deg, ${C.cyan}, #00a8c4)`,
                transition: "transform 0.18s, box-shadow 0.28s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 0 32px rgba(0,232,255,0.40)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                See Full Demo
              </button>
              <button style={{
                fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
                fontSize: "13px", letterSpacing: "0.025em",
                padding: "13px 24px", borderRadius: "10px", cursor: "pointer",
                background: "transparent", border: `1px solid ${C.border}`,
                color: "#94a3b8", transition: "all 0.22s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(164,80,247,0.38)"; e.currentTarget.style.color="#c084fc"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color="#94a3b8"; }}>
                Read Case Studies →
              </button>
            </div>
          </div>

          {/* ── RIGHT: Dashboard ── */}
          <div ref={dashRef}>
            <DashboardPanel />
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div ref={stripRef}>
          <TrustStrip />
        </div>
      </div>

      {/* ── Bottom section fade ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
        background: `linear-gradient(to bottom, transparent, ${C.bg})`,
        pointerEvents: "none",
      }} />

      {/* ── Global styles for this section ── */}
      <style>{`
        @keyframes pingPulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          70%  { transform: scale(2.2); opacity: 0;   }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1);    }
          50%      { opacity:0.35; transform:scale(0.55); }
        }
        @keyframes floatBadge {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-8px); }
        }

        /* Responsive grid */
        @media (max-width: 900px) {
          .ds-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Trust strip: collapse to 3 cols on tablet */
        @media (max-width: 860px) {
          .ds-trust-grid {
            grid-template-columns: repeat(3,1fr) !important;
          }
        }
        /* Trust strip: 2 cols on mobile */
        @media (max-width: 520px) {
          .ds-trust-grid {
            grid-template-columns: repeat(2,1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
