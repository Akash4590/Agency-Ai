// ─────────────────────────────────────────────────────────────────────────────
// AutomationWorkflow.jsx — AI Automation Workflow Experience
// File: src/components/AutomationWorkflow.jsx
// deps: react, gsap (already installed — no new deps)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  cyan:    "#00e8ff",
  violet:  "#a450f7",
  pink:    "#f72585",
  green:   "#34d399",
  amber:   "#fbbf24",
  bg:      "#020409",
  bgMid:   "#060c1a",
  bgCard:  "rgba(6,12,26,0.94)",
  border:  "rgba(255,255,255,0.07)",
  borderC: "rgba(0,232,255,0.13)",
  text:    "#f0f4ff",
  muted:   "#64748b",
  subtle:  "#1e293b",
};

const glass = (extra = {}) => ({
  background: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: "14px",
  backdropFilter: "blur(24px) saturate(160%)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
  ...extra,
});

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
  }, []);
  return visible;
}

function TiltCard({ children, style = {}, intensity = 5 }) {
  const ref = useRef();
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale(1.015)`;
  }, [intensity]);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: "transform 0.28s cubic-bezier(0.25,1,0.5,1)", willChange: "transform", ...style }}>
      {children}
    </div>
  );
}

// ── NODE DEFINITIONS on a 480x320 SVG canvas ──────────────────────────────
const NODES = [
  { id:"traffic",   label:"Traffic Signals",  sub:"All channels",       icon:"◈", color:C.cyan,   x:52,  y:160, metrics:["+2.4K sessions","14 sources"]  },
  { id:"ai",        label:"Nexus AI Core",     sub:"Inference engine",   icon:"⬡", color:C.violet, x:180, y:72,  metrics:["98.4 score","12ms"], central:true },
  { id:"revenue",   label:"Revenue Ops",       sub:"Dynamic pricing",    icon:"◆", color:C.green,  x:180, y:248, metrics:["$847K/mo","+34%"]             },
  { id:"decisions", label:"Smart Decisions",   sub:"Autonomous actions", icon:"◉", color:C.amber,  x:310, y:72,  metrics:["2.1M tasks","99.9%"]          },
  { id:"growth",    label:"Growth Output",     sub:"Compounding ROI",    icon:"⚡", color:C.pink,   x:310, y:248, metrics:["4.8× LTV","340% ROI"]        },
  { id:"output",    label:"Real Revenue",      sub:"Verified results",   icon:"◈", color:C.cyan,   x:428, y:160, metrics:["$2.4B+","12K brands"]         },
];

const EDGES = [
  { from:"traffic",   to:"ai",        color:C.cyan,   delay:0    },
  { from:"traffic",   to:"revenue",   color:C.cyan,   delay:0.5  },
  { from:"ai",        to:"decisions", color:C.violet, delay:0.2  },
  { from:"ai",        to:"growth",    color:C.violet, delay:0.7  },
  { from:"revenue",   to:"growth",    color:C.green,  delay:0.9  },
  { from:"decisions", to:"output",    color:C.amber,  delay:1.1  },
  { from:"growth",    to:"output",    color:C.pink,   delay:1.3  },
];

// ── Animated SVG edge (path + travelling dot via CSS animation) ────────────
function FlowEdge({ from, to, color, delay, active }) {
  const id  = `aw-edge-${from.x}-${to.x}-${delay}`.replace(/\./g,"");
  const cx  = (from.x + to.x) / 2;
  const cy  = Math.min(from.y, to.y) - 28;
  const d   = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;

  return (
    <g>
      {/* Glowing halo */}
      <path d={d} fill="none" stroke={color} strokeWidth="4" opacity={active ? 0.05 : 0}
        style={{ filter:`blur(3px)`, transition:"opacity 0.6s" }} />
      {/* Main line */}
      <path d={d} fill="none" stroke={color} strokeWidth="1.2"
        opacity={active ? 0.38 : 0.08}
        style={{ transition:"opacity 0.6s" }} />
      {/* Travelling dot */}
      {active && (
        <circle r="3" fill={color}
          style={{
            filter: `drop-shadow(0 0 4px ${color})`,
            animation: `awDotTravel-${id} 2.4s ease-in-out ${delay}s infinite`,
            offsetPath: `path('${d}')`,
            offsetDistance: "0%",
          }}
        />
      )}
      {active && (
        <style>{`
          @keyframes awDotTravel-${id} {
            0%   { offset-distance: 0%;   opacity: 0; }
            8%   { opacity: 1; }
            92%  { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
        `}</style>
      )}
    </g>
  );
}

// ── SVG node ──────────────────────────────────────────────────────────────
function WorkflowNode({ node, active }) {
  const [hov, setHov] = useState(false);
  const { label, sub, icon, color, x, y, metrics, central } = node;
  const r = central ? 28 : 24;

  return (
    <g transform={`translate(${x},${y})`} style={{ cursor:"pointer" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      {/* Pulse ring */}
      {active && (
        <circle r={r + 12} fill="none" stroke={color} strokeWidth="1"
          opacity={0.15}
          style={{ animation: "awRingPulse 2.2s ease-out infinite" }} />
      )}
      {/* Glow halo */}
      <circle r={r + 5}
        fill={`${color}${hov ? "14" : "07"}`}
        stroke={color}
        strokeWidth={hov ? 1.4 : 0.7}
        opacity={hov ? 1 : 0.55}
        style={{ transition:"all 0.28s" }} />
      {/* Body */}
      <circle r={r}
        fill="rgba(4,8,20,0.96)"
        stroke={color}
        strokeWidth={central ? 1.4 : 1} />
      {/* Icon */}
      <text textAnchor="middle" dominantBaseline="central"
        fontSize={central ? "17" : "14"}
        fill={color}
        style={{ userSelect:"none", filter:`drop-shadow(0 0 4px ${color})` }}>
        {icon}
      </text>
      {/* Label */}
      <text y={r + 14} textAnchor="middle"
        fontSize="8.5" fontWeight="700" fill={C.text}
        fontFamily="'DM Sans',sans-serif" style={{ userSelect:"none" }}>
        {label}
      </text>
      <text y={r + 24} textAnchor="middle"
        fontSize="7" fill={C.muted}
        fontFamily="'DM Sans',sans-serif" style={{ userSelect:"none" }}>
        {sub}
      </text>
      {/* Metric chips on hover */}
      {hov && metrics.map((m, i) => (
        <g key={i} transform={`translate(${i === 0 ? -34 : 8}, ${-r - 18 - i * 17})`}>
          <rect x="0" y="-9" width={m.length * 5.8 + 10} height="14"
            rx="4" fill={`${color}18`} stroke={color} strokeWidth="0.5" opacity="0.95" />
          <text x={(m.length * 5.8 + 10) / 2} textAnchor="middle"
            dominantBaseline="central" fontSize="7" fontWeight="700"
            fill={color} fontFamily="'DM Sans',sans-serif"
            style={{ userSelect:"none" }}>
            {m}
          </text>
        </g>
      ))}
    </g>
  );
}

// ── Live ticker ───────────────────────────────────────────────────────────
const TICKER = [
  { text:"Cart recovery triggered · $3,240",       color:C.green  },
  { text:"Pricing optimized · SKU #A-1847",        color:C.cyan   },
  { text:"Churn risk flagged · Account #4921",     color:C.amber  },
  { text:"Email sequence deployed · 8.4K users",  color:C.violet },
  { text:"Inventory reorder signal · 2 SKUs",      color:C.green  },
  { text:"Attribution model updated · 3 channels", color:C.cyan   },
];

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setIdx(i => (i + 1) % TICKER.length), 2400);
    const b = setInterval(() => setTick(t => t + 1), 1000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  const ev = TICKER[idx];
  const d  = new Date();

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", gap:"12px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"7px", minWidth:0 }}>
        <div style={{
          width:"5px", height:"5px", borderRadius:"50%",
          background:ev.color, boxShadow:`0 0 7px ${ev.color}`, flexShrink:0,
        }} />
        <span key={idx} style={{
          fontSize:"10px", color:"#94a3b8", fontFamily:"'DM Sans',sans-serif",
          animation:"awTickerIn 0.3s ease both",
          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
        }}>{ev.text}</span>
      </div>
      <span style={{ fontSize:"9px", color:C.subtle, flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>
        {d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" })}
      </span>
    </div>
  );
}

// ── Workflow canvas ───────────────────────────────────────────────────────
function WorkflowCanvas({ visible }) {
  const nodeMap = useMemo(() => Object.fromEntries(NODES.map(n => [n.id, n])), []);

  return (
    <div style={{
      width:"100%", position:"relative",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateX(36px)",
      transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
    }}>
      {/* Glow halo frame */}
      <div style={{
        position:"absolute", inset:"-2px", borderRadius:"22px",
        background:`linear-gradient(135deg,${C.cyan}14,${C.violet}18)`,
        filter:"blur(2px)", zIndex:0,
      }} />
      <div style={{
        position:"relative", zIndex:1,
        background:"linear-gradient(145deg,rgba(4,8,20,0.99),rgba(6,12,26,0.99))",
        border:`1px solid rgba(0,232,255,0.10)`,
        borderRadius:"20px", overflow:"hidden",
        boxShadow:"0 24px 80px rgba(0,0,0,0.7)",
      }}>
        {/* Title bar */}
        <div style={{
          display:"flex", alignItems:"center", gap:"8px",
          padding:"10px 16px", borderBottom:`1px solid ${C.border}`,
          background:"rgba(255,255,255,0.02)",
        }}>
          {["#f87171","#fbbf24","#34d399"].map((c,i) => (
            <div key={i} style={{ width:"7px", height:"7px", borderRadius:"50%", background:c }} />
          ))}
          <span style={{ marginLeft:"8px", fontSize:"10px", color:C.muted, fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.06em" }}>
            nexus · automation engine · live
          </span>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"5px" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:C.green, animation:"awGreenBlink 1.9s ease-in-out infinite" }} />
            <span style={{ fontSize:"9px", color:C.green, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>PROCESSING</span>
          </div>
        </div>

        {/* SVG canvas */}
        <div style={{ padding:"16px 12px 4px" }}>
          <svg viewBox="0 0 480 320" style={{ width:"100%", display:"block", overflow:"visible" }}>
            {/* Edges */}
            {EDGES.map((e, i) => {
              const fn = nodeMap[e.from], tn = nodeMap[e.to];
              if (!fn || !tn) return null;
              return <FlowEdge key={i}
                from={{ x:fn.x, y:fn.y }}
                to={{ x:tn.x, y:tn.y }}
                color={e.color} delay={e.delay} active={visible} />;
            })}
            {/* Nodes */}
            {NODES.map(n => <WorkflowNode key={n.id} node={n} active={visible} />)}
          </svg>
        </div>

        {/* Live ticker */}
        <div style={{
          padding:"9px 16px",
          borderTop:`1px solid ${C.border}`,
          background:"rgba(255,255,255,0.012)",
        }}>
          <LiveTicker />
        </div>
      </div>
    </div>
  );
}

// ── Floating stat card ────────────────────────────────────────────────────
function FloatingCard({ label, value, sub, color, delay }) {
  return (
    <div style={{
      ...glass({ borderRadius:"12px", border:`1px solid ${color}22`,
        boxShadow:`0 8px 24px rgba(0,0,0,0.5),0 0 28px ${color}0a,inset 0 1px 0 rgba(255,255,255,0.06)` }),
      padding:"12px 16px", minWidth:"140px",
      animation:`awFloatCard 5s ease-in-out ${delay} infinite`,
    }}>
      <p style={{ fontSize:"9px", textTransform:"uppercase", letterSpacing:"0.12em", color:C.muted, fontWeight:600, marginBottom:"4px", fontFamily:"'DM Sans',sans-serif" }}>{label}</p>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"18px", color:C.text, letterSpacing:"-0.4px", lineHeight:1 }}>{value}</p>
      <p style={{ fontSize:"10px", color:color, marginTop:"3px", fontWeight:500, fontFamily:"'DM Sans',sans-serif" }}>{sub}</p>
    </div>
  );
}

// ── Bullet row ────────────────────────────────────────────────────────────
const BULLETS = [
  { icon:"◈", color:C.cyan,   title:"Continuous signal collection",   desc:"Every click, session, purchase, and abandonment feeds Nexus in real time — across all 300+ integrations simultaneously." },
  { icon:"⬡", color:C.violet, title:"Autonomous AI decision making",  desc:"The engine doesn't surface alerts — it acts. Pricing, messaging, and inventory respond automatically without a single manual task." },
  { icon:"◆", color:C.green,  title:"Compounding revenue loops",      desc:"Each optimization improves the model. The longer you run Nexus, the smarter and more profitable your store becomes." },
];

function BulletRow({ icon, color, title, desc, index, visible }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", gap:"14px", alignItems:"flex-start",
        padding:"14px 16px", borderRadius:"12px",
        border:`1px solid ${hov ? color+"28" : C.border}`,
        background: hov ? `${color}06` : "rgba(6,12,26,0.5)",
        boxShadow: hov ? `0 0 22px ${color}10` : "none",
        transition:"all 0.28s",
        cursor:"default",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(-18px)",
        transitionDelay: visible ? `${0.2 + index * 0.11}s` : "0s",
      }}
    >
      <div style={{
        width:"34px", height:"34px", borderRadius:"9px", flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"15px", color:color,
        background:`${color}12`, border:`1px solid ${color}20`,
      }}>{icon}</div>
      <div>
        <p style={{ fontSize:"13px", fontWeight:600, color:C.text, marginBottom:"4px", lineHeight:1.35, fontFamily:"'DM Sans',sans-serif" }}>{title}</p>
        <p style={{ fontSize:"12px", lineHeight:1.7, color:"#7d8fa8", fontWeight:400, fontFamily:"'DM Sans',sans-serif" }}>{desc}</p>
      </div>
    </div>
  );
}

// ── Section transition ─────────────────────────────────────────────────────
function SectionTransition() {
  return (
    <div style={{ position:"relative", height:"80px", background:C.bg, overflow:"hidden" }}>
      <div style={{
        position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"65%", height:"1px",
        background:`linear-gradient(90deg,transparent,${C.violet}44,${C.cyan}55,${C.violet}44,transparent)`,
      }} />
      <div style={{
        position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"260px", height:"70px",
        background:`radial-gradient(ellipse at center,${C.cyan}0d 0%,transparent 70%)`,
      }} />
      <div style={{
        position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"6px", height:"6px", borderRadius:"50%",
        background:C.violet, boxShadow:`0 0 12px ${C.violet},0 0 28px ${C.violet}88`,
        animation:"awJewelPulse 2.5s ease-in-out infinite",
      }} />
    </div>
  );
}

// ── Signup modal ──────────────────────────────────────────────────────────
function SignupModal({ onClose }) {
  const [step, setStep]   = useState(0);
  const [email, setEmail] = useState("");
  const [busy, setBusy]   = useState(false);
  const bgRef  = useRef();
  const boxRef = useRef();

  useEffect(() => {
    gsap.from(bgRef.current,  { opacity:0, duration:0.25 });
    gsap.from(boxRef.current, { opacity:0, scale:0.93, duration:0.3, ease:"back.out(1.5)" });
  }, []);

  const close = () => {
    gsap.to(boxRef.current, { opacity:0, scale:0.94, duration:0.2 });
    gsap.to(bgRef.current,  { opacity:0, duration:0.25, onComplete: onClose });
  };

  const submit = () => {
    if (!email.includes("@")) return;
    setBusy(true);
    setTimeout(() => { setBusy(false); setStep(1); }, 1700);
  };

  return (
    <div ref={bgRef} style={{
      position:"fixed", inset:0, zIndex:9900,
      background:"rgba(2,4,9,0.88)", backdropFilter:"blur(14px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:"24px",
    }} onClick={e => e.target === e.currentTarget && close()}>
      <div ref={boxRef} style={{
        ...glass({ borderRadius:"20px", border:`1px solid ${C.borderC}` }),
        width:"100%", maxWidth:"420px", padding:"36px 32px", position:"relative",
        boxShadow:`0 0 60px ${C.cyan}10,0 32px 80px rgba(0,0,0,0.75)`,
      }}>
        <button onClick={close} style={{
          position:"absolute", top:"14px", right:"16px",
          background:"none", border:"none", color:C.muted, cursor:"pointer",
          fontSize:"16px", padding:"4px 8px", borderRadius:"6px", transition:"color 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.color=C.text}
          onMouseLeave={e => e.currentTarget.style.color=C.muted}>✕</button>

        {step === 0 ? (
          <>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"6px", marginBottom:"18px",
              padding:"4px 12px", borderRadius:"100px",
              fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.12em",
              color:C.cyan, fontWeight:600,
              background:"rgba(0,232,255,0.08)", border:`1px solid ${C.borderC}`,
              fontFamily:"'DM Sans',sans-serif",
            }}>
              <span style={{ width:"4px", height:"4px", borderRadius:"50%", background:C.cyan }} />
              Free 14-day trial
            </div>
            <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"22px", color:C.text, letterSpacing:"-0.4px", marginBottom:"8px" }}>
              Start your free trial
            </h3>
            <p style={{ fontSize:"13px", color:C.muted, marginBottom:"22px", lineHeight:1.65, fontFamily:"'DM Sans',sans-serif" }}>
              No credit card required. Full platform access. Cancel anytime.
            </p>
            <input type="email" placeholder="you@company.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{
                width:"100%", padding:"12px 16px", marginBottom:"12px",
                background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
                borderRadius:"10px", color:C.text, fontSize:"14px",
                fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box",
                transition:"border-color 0.2s",
              }}
              onFocus={e => e.currentTarget.style.borderColor=C.borderC}
              onBlur={e => e.currentTarget.style.borderColor=C.border}
            />
            <button onClick={submit} disabled={busy} style={{
              width:"100%", padding:"13px", borderRadius:"10px", border:"none",
              cursor: busy ? "default" : "pointer",
              fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"14px", color:"#000",
              background:`linear-gradient(135deg,${C.cyan},#00a8c4)`,
              transition:"box-shadow 0.25s,transform 0.18s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
            }}
              onMouseEnter={e => { if (!busy) { e.currentTarget.style.boxShadow=`0 0 32px rgba(0,232,255,0.38)`; e.currentTarget.style.transform="translateY(-1px)"; }}}
              onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}>
              {busy && (
                <svg width="14" height="14" viewBox="0 0 24 24" style={{ animation:"awSpin 0.8s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3" fill="none" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              )}
              {busy ? "Creating account…" : "Get instant access →"}
            </button>
            <p style={{ textAlign:"center", marginTop:"13px", fontSize:"11px", color:C.subtle, fontFamily:"'DM Sans',sans-serif" }}>
              SOC 2 certified · GDPR compliant · No spam
            </p>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"12px 0" }}>
            <div style={{
              width:"54px", height:"54px", borderRadius:"50%", margin:"0 auto 18px",
              background:"rgba(52,211,153,0.1)", border:`2px solid ${C.green}40`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px",
            }}>✓</div>
            <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"20px", color:C.text, marginBottom:"8px" }}>You're in!</h3>
            <p style={{ fontSize:"13px", color:C.muted, lineHeight:1.65, fontFamily:"'DM Sans',sans-serif", marginBottom:"22px" }}>
              Check <strong style={{ color:C.text }}>{email}</strong> to activate your account. Setup takes under 60 seconds.
            </p>
            <button onClick={close} style={{
              padding:"11px 28px", borderRadius:"10px", border:"none",
              background:`linear-gradient(135deg,${C.cyan},#00a8c4)`,
              color:"#000", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"13px", cursor:"pointer",
            }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT EXPORT
// ═══════════════════════════════════════════════════════════════════════════
export default function AutomationWorkflow() {
  const sectionRef = useRef();
  const leftRef    = useRef();
  const visible    = useInView(sectionRef, 0.1);
  const [modal, setModal] = useState(false);

  const handleDemo = useCallback(() => {
    window.scrollTo({ top:0, behavior:"smooth" });
  }, []);

  return (
    <>
      <SectionTransition />

      <section ref={sectionRef} style={{
        position:"relative", background:C.bg,
        overflow:"hidden",
        padding:"80px clamp(20px,6vw,80px) 100px",
      }}>
        {/* Ambient blobs */}
        <div style={{ position:"absolute", top:"0%", right:"-6%", width:"520px", height:"520px", borderRadius:"50%", background:`radial-gradient(circle,${C.cyan}05 0%,transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"5%", left:"-8%", width:"440px", height:"440px", borderRadius:"50%", background:`radial-gradient(circle,${C.violet}06 0%,transparent 70%)`, pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:"1200px", margin:"0 auto" }}>

          {/* Two-column grid */}
          <div className="aw-grid" style={{
            display:"grid",
            gridTemplateColumns:"1fr 1.1fr",
            gap:"clamp(36px,5vw,88px)",
            alignItems:"center",
          }}>

            {/* LEFT */}
            <div ref={leftRef} style={{
              display:"flex", flexDirection:"column", gap:"24px",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(-28px)",
              transition:"opacity 0.8s ease, transform 0.8s ease",
            }}>
              {/* Badge */}
              <div style={{
                display:"inline-flex", alignItems:"center", gap:"7px", alignSelf:"flex-start",
                padding:"5px 14px", borderRadius:"100px",
                fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.12em",
                color:C.violet, fontWeight:600,
                background:`${C.violet}10`, border:`1px solid ${C.violet}28`,
                fontFamily:"'DM Sans',sans-serif",
              }}>
                <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:C.violet, animation:"awJewelPulse 2s ease-in-out infinite" }} />
                How It Works
              </div>

              {/* Heading */}
              <h2 style={{
                fontFamily:"'DM Sans',sans-serif", fontWeight:700,
                fontSize:"clamp(26px,3vw,40px)",
                lineHeight:1.12, letterSpacing:"-0.9px",
                color:C.text, margin:0,
              }}>
                Your revenue engine,{" "}
                <span style={{
                  background:`linear-gradient(135deg,${C.violet} 0%,${C.cyan} 100%)`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                }}>running 24/7.</span>
              </h2>

              {/* Sub */}
              <p style={{
                fontSize:"clamp(13px,1.2vw,15px)", lineHeight:1.78,
                color:"#7d8fa8", fontWeight:400, margin:0,
                maxWidth:"400px", fontFamily:"'DM Sans',sans-serif",
              }}>
                Nexus ingests every signal from your store, runs it through a proprietary AI core, and executes revenue-maximizing decisions — without a single manual task.
              </p>

              {/* Feature bullets */}
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {BULLETS.map((b, i) => <BulletRow key={i} {...b} index={i} visible={visible} />)}
              </div>

              {/* CTAs */}
              <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
                <button onClick={() => setModal(true)} style={{
                  fontFamily:"'DM Sans',sans-serif", fontWeight:600,
                  fontSize:"13px", letterSpacing:"0.025em",
                  padding:"13px 30px", borderRadius:"10px",
                  border:"none", cursor:"pointer", color:"#000",
                  background:`linear-gradient(135deg,${C.cyan},#00a8c4)`,
                  transition:"transform 0.18s,box-shadow 0.28s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 0 32px rgba(0,232,255,0.38)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                  Start Free Trial
                </button>
                <button onClick={handleDemo} style={{
                  fontFamily:"'DM Sans',sans-serif", fontWeight:500,
                  fontSize:"13px", letterSpacing:"0.025em",
                  padding:"13px 24px", borderRadius:"10px",
                  cursor:"pointer", color:"#94a3b8",
                  background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
                  transition:"all 0.22s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=`${C.violet}44`; e.currentTarget.style.color="#c084fc"; e.currentTarget.style.boxShadow=`0 0 22px ${C.violet}14`; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color="#94a3b8"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}>
                  See Live Automation →
                </button>
              </div>

              <p style={{ fontSize:"11px", color:C.subtle, fontFamily:"'DM Sans',sans-serif" }}>
                Avg. setup time: <span style={{ color:"#94a3b8" }}>47 minutes</span> · No engineers required
              </p>
            </div>

            {/* RIGHT */}
            <div style={{ position:"relative" }}>
              <TiltCard intensity={4}>
                <WorkflowCanvas visible={visible} />
              </TiltCard>

              {/* Floating badges */}
              <div className="aw-float-badge" style={{
                position:"absolute", top:"-20px", right:"-14px", zIndex:10,
                opacity: visible ? 1 : 0,
                transition:"opacity 0.8s ease 0.7s",
              }}>
                <FloatingCard label="Time Saved" value="14h" sub="this week" color={C.violet} delay="0s" />
              </div>
              <div className="aw-float-badge" style={{
                position:"absolute", bottom:"-14px", right:"-10px", zIndex:10,
                opacity: visible ? 1 : 0,
                transition:"opacity 0.8s ease 1.0s",
              }}>
                <FloatingCard label="Revenue Recovered" value="$12.4K" sub="from carts" color={C.green} delay="1.3s" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom page fade */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:"100px",
          background:`linear-gradient(to bottom,transparent,${C.bg})`,
          pointerEvents:"none",
        }} />

        {/* ── Keyframes ── */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

          @keyframes awJewelPulse {
            0%,100%{opacity:1;transform:scale(1);}
            50%{opacity:0.35;transform:scale(0.55);}
          }
          @keyframes awRingPulse {
            0%{opacity:0.2;}
            60%{r:40;opacity:0;}
            100%{r:40;opacity:0;}
          }
          @keyframes awGreenBlink {
            0%,100%{opacity:1;}
            50%{opacity:0.35;}
          }
          @keyframes awFloatCard {
            0%,100%{transform:translateY(0px);}
            50%{transform:translateY(-10px);}
          }
          @keyframes awTickerIn {
            from{opacity:0;transform:translateY(4px);}
            to{opacity:1;transform:translateY(0);}
          }
          @keyframes awSpin {
            from{transform:rotate(0deg);}
            to{transform:rotate(360deg);}
          }

          @media(max-width:900px){
            .aw-grid{grid-template-columns:1fr !important;}
          }
          @media(max-width:640px){
            .aw-float-badge{display:none !important;}
          }
        `}</style>
      </section>

      {modal && <SignupModal onClose={() => setModal(false)} />}
    </>
  );
}