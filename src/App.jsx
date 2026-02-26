import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// ══════════════════════════════════════════════════
// DESIGN SYSTEM — Living Document
// Clean, confident. DM Sans throughout. Muted teal accent.
// Light-first, dark adaptive.
// ══════════════════════════════════════════════════
const C = {
  bg:          "var(--lp-bg)",
  surface:     "var(--lp-surface)",
  surfaceHigh: "var(--lp-surface-high)",
  border:      "var(--lp-border)",
  borderMid:   "var(--lp-border-mid)",
  text:        "var(--lp-text)",
  textMuted:   "var(--lp-text-muted)",
  textDim:     "var(--lp-text-dim)",
  navy:        "var(--lp-ink)",
  navySoft:    "var(--lp-ink-soft)",
  teal:        "var(--lp-accent)",
  tealSoft:    "var(--lp-accent-soft)",
  green:       "var(--lp-green)",
  greenSoft:   "var(--lp-green-soft)",
  amber:       "var(--lp-amber)",
  amberSoft:   "var(--lp-amber-soft)",
  steel:       "var(--lp-steel)",
  steelSoft:   "var(--lp-steel-soft)",
  plum:        "var(--lp-plum)",
  plumSoft:    "var(--lp-plum-soft)",
  terracotta:  "var(--lp-terra)",
  terraSoft:   "var(--lp-terra-soft)",
  gold:        "var(--lp-gold)",
  goldSoft:    "var(--lp-gold-soft)",
  rose:        "var(--lp-rose)",
  roseSoft:    "var(--lp-rose-soft)",
  danger:      "var(--lp-danger)",
  dangerBg:    "var(--lp-danger-bg)",
  onDark:      "#fff",
  overlay:     "var(--lp-overlay)",
  graphAxes:   "var(--lp-text-dim)",
  graphGrid:   "var(--lp-border)",
};

const FONTS = {
  serif:  "'DM Sans', 'Helvetica Neue', sans-serif",
  sans:   "'DM Sans', 'Helvetica Neue', sans-serif",
  mono:   "'DM Mono', 'Courier New', monospace",
};

// ── Data ─────────────────────────────────────────────────────────────────────
const TREND_DATA = [
  {w:"W1", fatigue:8.2,cognition:7.4,pain:6.1,mood:3.8,sleep:4.2},
  {w:"W2", fatigue:8.0,cognition:7.8,pain:6.8,mood:3.4,sleep:4.0},
  {w:"W3", fatigue:7.4,cognition:7.2,pain:5.4,mood:4.8,sleep:4.8},
  {w:"W4", fatigue:8.8,cognition:8.0,pain:6.2,mood:3.2,sleep:3.8},
  {w:"W5", fatigue:7.2,cognition:6.4,pain:4.2,mood:5.4,sleep:5.2},
  {w:"W6", fatigue:6.2,cognition:6.0,pain:3.8,mood:6.2,sleep:5.8},
  {w:"W7", fatigue:5.4,cognition:5.2,pain:3.2,mood:6.4,sleep:6.2},
  {w:"W8", fatigue:5.8,cognition:4.8,pain:2.8,mood:7.2,sleep:6.8},
  {w:"W9", fatigue:4.4,cognition:4.2,pain:2.2,mood:7.4,sleep:7.0},
  {w:"W10",fatigue:4.8,cognition:3.8,pain:2.0,mood:7.8,sleep:7.4},
  {w:"W11",fatigue:3.8,cognition:3.2,pain:1.8,mood:8.2,sleep:7.8},
  {w:"W12",fatigue:3.2,cognition:2.8,pain:1.4,mood:8.8,sleep:8.2},
];

const WEARABLE_DATA = [
  {w:"W1", hrv:28,sleep_h:5.2,steps:3200,rhr:78,temp:+0.3},
  {w:"W2", hrv:26,sleep_h:4.8,steps:2800,rhr:80,temp:+0.5},
  {w:"W3", hrv:30,sleep_h:5.6,steps:3600,rhr:76,temp:+0.2},
  {w:"W4", hrv:22,sleep_h:4.2,steps:1900,rhr:84,temp:+0.8},
  {w:"W5", hrv:31,sleep_h:5.8,steps:4100,rhr:74,temp:+0.1},
  {w:"W6", hrv:35,sleep_h:6.2,steps:4800,rhr:72,temp:+0.0},
  {w:"W7", hrv:38,sleep_h:6.6,steps:5200,rhr:70,temp:-0.1},
  {w:"W8", hrv:36,sleep_h:6.4,steps:4900,rhr:71,temp:+0.1},
  {w:"W9", hrv:42,sleep_h:7.0,steps:5800,rhr:68,temp:-0.2},
  {w:"W10",hrv:44,sleep_h:7.2,steps:6200,rhr:66,temp:-0.2},
  {w:"W11",hrv:48,sleep_h:7.6,steps:6800,rhr:64,temp:-0.3},
  {w:"W12",hrv:52,sleep_h:8.0,steps:7400,rhr:62,temp:-0.3},
];

const SYMS = {
  fatigue:{color:"var(--lp-data-1)",label:"Fatigue"},
  cognition:{color:"var(--lp-data-2)",label:"Cognition"},
  pain:{color:"var(--lp-data-3)",label:"Pain"},
  mood:{color:"var(--lp-data-4)",label:"Mood"},
  sleep:{color:"var(--lp-data-5)",label:"Sleep"},
};

const TIMELINE = [
  {w:"W1",type:"treatment",label:"Doxycycline 100mg",color:C.navy},
  {w:"W4",type:"flare",label:"Major fatigue flare",color:C.terracotta},
  {w:"W6",type:"treatment",label:"LDN 1.5mg added",color:C.teal},
  {w:"W7",type:"lab",label:"CD57 panel",color:C.steel},
  {w:"W9",type:"treatment",label:"Herbal + microdose began",color:C.plum},
  {w:"W12",type:"milestone",label:"Fatigue 8.2 → 3.2",color:C.gold},
];

const WORDS = [
  {text:"fatigue",count:38,type:"symptom"},
  {text:"fog",count:31,type:"symptom"},
  {text:"crash",count:24,type:"pattern"},
  {text:"better",count:19,type:"signal"},
  {text:"dismissed",count:17,type:"pattern"},
  {text:"sleep",count:15,type:"context"},
  {text:"improving",count:13,type:"signal"},
  {text:"hopeful",count:8,type:"signal"},
];
const WORD_C = {
  symptom:{color:"var(--lp-data-1)",bg:"var(--lp-surface-highlight)"},
  pattern:{color:"var(--lp-data-2)",bg:"var(--lp-surface-highlight)"},
  signal:{color:"var(--lp-data-4)",bg:"var(--lp-surface-highlight)"},
  context:{color:"var(--lp-data-3)",bg:"var(--lp-surface-highlight)"},
};

const INSIGHTS = [
  {id:1,q:"Mood rose 1.4 pts in week 9–11 alongside microdosing. Anything else change that week?",color:C.plum,bg:C.plumSoft},
  {id:2,q:"Sleep improved 2 weeks before fatigue did. Anything around sleep not logged?",color:C.teal,bg:C.tealSoft},
  {id:3,q:"Stress peaked at week 4, same as your worst flare. What was happening externally?",color:C.terracotta,bg:C.terraSoft},
];

const COINFECTIONS = [
  {key:"babesia",label:"Babesia",positive:true,tested:true,color:C.rose},
  {key:"bartonella",label:"Bartonella",positive:false,tested:true,color:C.steel},
  {key:"ehrlichia",label:"Ehrlichia",positive:false,tested:false,color:C.steel},
  {key:"anaplasma",label:"Anaplasma",positive:false,tested:false,color:C.steel},
  {key:"mycoplasma",label:"Mycoplasma",positive:true,tested:true,color:C.rose},
  {key:"epstein",label:"EBV",positive:true,tested:true,color:C.plum},
];

const PROTOCOL = [
  {id:"doxy",name:"Doxycycline",cat:"Antibiotic",color:C.navy,bg:C.navySoft,
   dose:"100mg → 50mg",weeks:"W1–now",
   evidence:"Established",evColor:C.navy,evBg:C.navySoft,
   note:"IDSA recommends 2–4 weeks. ILADS supports extended use. The gap reflects genuine ongoing scientific debate.",
   links:[{l:"NEJM: Doxycycline for Early Lyme",t:"rct"},{l:"ILADS Evidence-Based Guidelines",t:"guideline"}],
   cohort:"7 of 9 similar profiles. 5 reported improvement."},
  {id:"ldn",name:"Low Dose Naltrexone",cat:"Immunomodulator",color:C.teal,bg:C.tealSoft,
   dose:"1.5mg",weeks:"W6–now",
   evidence:"Emerging",evColor:C.teal,evBg:C.tealSoft,
   note:"Growing observational evidence for neuroinflammation. Lyme-specific studies limited but increasing.",
   links:[{l:"LDN Research Trust — Overview",t:"review"},{l:"Neuroinflammation & LDN",t:"study"}],
   cohort:"4 of 9. 3 reported cognitive improvement."},
  {id:"herbs",name:"Herbal Protocol",cat:"Botanical",color:C.green,bg:C.greenSoft,
   dose:"Variable",weeks:"W9–now",
   evidence:"Early evidence",evColor:C.amber,evBg:C.amberSoft,
   note:"Hopkins 2020 in-vitro research shows activity against Borrelia. Human clinical trials remain limited.",
   links:[{l:"Hopkins: Botanical Agents vs Borrelia (2020)",t:"study"}],
   cohort:"6 of 9. 4 reported improvement."},
  {id:"psilocybin",name:"Psilocybin",cat:"Microdose",color:C.plum,bg:C.plumSoft,
   dose:"0.1g",weeks:"W9–now",
   evidence:"Early evidence",evColor:C.amber,evBg:C.amberSoft,
   note:"Active research on neuroplasticity and inflammation. Lyme-specific evidence absent. Your record is contributing to what doesn't yet exist.",
   links:[{l:"Johns Hopkins Psychedelic Research Center",t:"resource"},{l:"MAPS: Psilocybin & Neuroplasticity",t:"study"}],
   cohort:"2 of 9. Both showed mood improvement. Sample too small for signal."},
];
const LINK_C = {rct:C.navy,guideline:C.teal,study:C.steel,review:C.plum,resource:C.green};

const MONTHS = ["Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
const RADIAL = {
  Fatigue:[8,7,6,5,4,3,3],Cognition:[7,8,7,6,5,4,3],
  Pain:[6,6,5,4,3,2,1],Sleep:[5,6,7,7,6,5,4],Mood:[4,3,4,5,6,7,9],
};
const RCOL = {
  Fatigue:"var(--lp-data-1)",
  Cognition:"var(--lp-data-2)",
  Pain:"var(--lp-data-3)",
  Sleep:"var(--lp-data-5)",
  Mood:"var(--lp-data-4)"
};

const VOICE_TURNS = [
  {ai:"Hello. I'm glad you're here.\n\nSpeak plainly — your experience, what you're feeling, what's shifted. I'll listen carefully.\n\nWhere would you like to begin?",
   user:"Week three of microdosing. My mood has been noticeably better.",
   extract:null},
  {ai:"That's worth paying attention to. Week nine — three weeks into both the herbal protocol and the microdosing. Mood went from 7.4 to 7.8 in that window and it's continued climbing.\n\nIs there anything else that changed over those weeks beyond what you've logged?",
   user:"I started working less. Less screen time. Not sure if that's related.",
   extract:{items:[{text:"Reduced work and screen time — week 9",type:"context"},{text:"Mood correlation with overlapping changes",type:"pattern"}]}},
  {ai:"That's exactly the kind of thing worth tracking. It may be part of the picture.\n\nThe challenge with overlapping changes is isolating what's doing what. But noticing it is the kind of signal that gets lost in clinical settings. I'll note it.\n\nHow's the microdosing sitting with you physically?",
   user:"Sometimes more sensitive to sound. Otherwise pretty smooth.",
   extract:{items:[{text:"Reduced work and screen time — week 9",type:"context"},{text:"Mood correlation with overlapping changes",type:"pattern"},{text:"Sound sensitivity noted post-microdose",type:"symptom"}]}},
];
const TAG_C = {
  context: {bg:"var(--lp-amber-soft)",  text:"var(--lp-amber)",  dot:"var(--lp-amber)"},
  pattern: {bg:"var(--lp-plum-soft)",   text:"var(--lp-plum)",   dot:"var(--lp-plum)"},
  symptom: {bg:"var(--lp-terra-soft)",  text:"var(--lp-terra)",  dot:"var(--lp-terra)"},
  timeline:{bg:"var(--lp-steel-soft)", text:"var(--lp-steel)", dot:"var(--lp-steel)"},
};

const OB_STEPS = ["path","orientation","coinfections","environment","wearables","ready"];

// ── Atoms ─────────────────────────────────────────────────────────────────────
function Card({children,style={}}) {
  return (
    <div style={{background:C.surface,borderRadius:22,padding:18,
      boxShadow:"var(--lp-shadow-soft)",border:"1px solid var(--lp-border-soft)",lineHeight:1.5,...style}}>
      {children}
    </div>
  );
}
function Label({children,sub}) {
  return (
    <div style={{marginBottom:12}}>
      <div className="section-title" style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:FONTS.sans,letterSpacing:"-0.01em"}}>{children}</div>
      {sub && <div style={{fontSize:11,color:C.textDim,marginTop:2,fontFamily:FONTS.sans}}>{sub}</div>}
    </div>
  );
}
function VBtn({onClick,label="Ask aloud"}) {
  return (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:5,
      background:C.tealSoft,border:"1px solid var(--lp-border-strong)",color:C.teal,
      borderRadius:20,padding:"6px 12px",fontSize:11,fontFamily:FONTS.sans,
      cursor:"pointer",fontWeight:500,whiteSpace:"nowrap",flexShrink:0}}>
      <span style={{fontSize:13}}>◎</span>{label}
    </button>
  );
}
function EvidenceBadge({label,color,bg}) {
  return (
    <span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:bg,color,
      fontFamily:FONTS.sans,letterSpacing:"0.07em",textTransform:"uppercase",fontWeight:600}}>
      {label}
    </span>
  );
}
function Tip({active,payload,label}) {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,padding:"9px 13px",
      borderRadius:10,boxShadow:"var(--lp-shadow-tooltip)",fontSize:11,fontFamily:FONTS.sans}}>
      <div style={{color:C.textDim,marginBottom:5,fontWeight:600}}>{label}</div>
      {payload.map(p=>(
        <div key={p.dataKey} style={{color:p.stroke,marginBottom:2}}>
          {p.name}: <strong style={{color:C.text}}>{typeof p.value==="number"?p.value.toFixed(1):p.value}</strong>
        </div>
      ))}
    </div>
  );
}
function Grads() {
  return (
    <defs>
      {Object.entries(SYMS).map(([k,v])=>(
        <linearGradient key={k} id={`g_${k}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={v.color} stopOpacity={0.28}/>
          <stop offset="100%" stopColor={v.color} stopOpacity={0}/>
        </linearGradient>
      ))}
      <linearGradient id="g_hrv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.teal} stopOpacity={0.3}/><stop offset="100%" stopColor={C.teal} stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="g_sleep_h" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.green} stopOpacity={0.3}/><stop offset="100%" stopColor={C.green} stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="g_steps" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.navy} stopOpacity={0.28}/><stop offset="100%" stopColor={C.navy} stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="g_rhr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.rose} stopOpacity={0.3}/><stop offset="100%" stopColor={C.rose} stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="g_temp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.amber} stopOpacity={0.3}/><stop offset="100%" stopColor={C.amber} stopOpacity={0}/>
      </linearGradient>
    </defs>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo({size=22}) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" stroke={C.navy} strokeWidth="3">
      <ellipse cx="40" cy="32" rx="13" ry="18" transform="rotate(-18 40 40)"/>
      <ellipse cx="40" cy="32" rx="8" ry="13" transform="rotate(-18 40 40)"/>
      <ellipse cx="40" cy="48" rx="13" ry="18" transform="rotate(18 40 40)"/>
      <ellipse cx="40" cy="48" rx="8" ry="13" transform="rotate(18 40 40)"/>
      <ellipse cx="30" cy="40" rx="18" ry="13" transform="rotate(18 40 40)"/>
      <ellipse cx="50" cy="40" rx="18" ry="13" transform="rotate(-18 40 40)"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════
// ONBOARDING
// ══════════════════════════════════════════════════
function Onboarding({onComplete}) {
  const [step, setStep] = useState(0);
  const [path, setPath] = useState(null);
  const [coInf, setCoInf] = useState({});
  const [env, setEnv] = useState({location:"",climate:"",mold:false,smoke:false,altitude:false});
  const [wearable, setWearable] = useState(null);
  const [fading, setFading] = useState(false);

  const advance = () => {
    setFading(true);
    setTimeout(()=>{ setStep(s=>s+1); setFading(false); }, 220);
  };

  const name = OB_STEPS[step];
  const wrap = {
    flex:1, overflowY:"auto", padding:"0 20px 28px",
    opacity: fading ? 0 : 1,
    transform: fading ? "translateY(6px)" : "none",
    transition:"opacity 0.22s,transform 0.22s",
  };

  const Dots = () => (
    <div style={{display:"flex",gap:5,justifyContent:"center",padding:"10px 0 0",flexShrink:0}}>
      {OB_STEPS.map((_,i)=>(
        <div key={i} style={{width:i===step?18:6,height:6,borderRadius:3,
          background:i===step?C.navy:i<step?C.teal:C.borderMid,transition:"all 0.3s"}}/>
      ))}
    </div>
  );

  const Btn = ({label,onClick,disabled}) => (
    <button onClick={onClick} disabled={disabled}
      style={{width:"100%",padding:14,background:disabled?"var(--lp-disabled-bg)":C.navySoft,
        border:"none",color:disabled?"var(--lp-disabled-text)":C.teal,borderRadius:14,fontSize:13,
        fontFamily:FONTS.sans,cursor:disabled?"default":"pointer",fontWeight:500,marginTop:12}}>
      {label}
    </button>
  );

  if (name==="path") return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <Dots/>
      <div style={{...wrap,paddingTop:24}}>
        <div style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.textDim,
          fontFamily:FONTS.sans,marginBottom:10,textAlign:"center"}}>Welcome</div>
        <div style={{fontSize:22,fontWeight:700,color:C.navy,textAlign:"center",lineHeight:1.4,
          marginBottom:8,fontFamily:FONTS.sans}}
          >
          Before Lyme had a name,<br/>it had witnesses.
        </div>
        <div style={{fontSize:12,color:C.textMuted,textAlign:"center",lineHeight:1.7,
          marginBottom:28,fontFamily:FONTS.sans,fontStyle:"italic"}}>
          LymePath listens carefully, over time, and in context.<br/>Where are you right now?
        </div>
        {[
          {key:"learning",icon:"○",title:"I'm learning about Lyme",sub:"New to the diagnosis or still figuring things out"},
          {key:"diagnosed",icon:"◉",title:"I've been diagnosed",sub:"Managing ongoing or complex symptoms"},
          {key:"symptoms",icon:"◈",title:"I have symptoms, no answers yet",sub:"Experiencing something undiagnosed or dismissed"},
        ].map(p=>(
          <div key={p.key} onClick={()=>{setPath(p.key);advance();}}
            style={{padding:"14px 16px",borderRadius:14,marginBottom:8,cursor:"pointer",
              border:`1.5px solid ${path===p.key?C.navy:C.border}`,
              background:path===p.key?C.navySoft:C.surface,
              display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
            <span style={{fontSize:18,color:C.navy,opacity:0.6}}>{p.icon}</span>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:FONTS.sans,marginBottom:2}}>{p.title}</div>
              <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans}}>{p.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (name==="orientation") return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <Dots/>
      <div style={wrap}>
        <div style={{marginTop:16,marginBottom:6}}>
          <div style={{fontSize:16,fontWeight:700,color:C.navy,fontFamily:FONTS.sans,letterSpacing:"-0.01em",marginBottom:10,lineHeight:1.4}}>
            What LymePath is — and isn't
          </div>
          {[
            {title:"We listen. We don't diagnose.",body:"LymePath is not a medical tool. It is a place to speak your experience into a record that grows over time.",color:C.navy},
            {title:"Your protocol is yours.",body:"Whatever you're trying — pharmaceutical, herbal, experimental — we observe it without judgment. Desperation is treated as information, not irrationality.",color:C.teal},
            {title:"Your data is yours.",body:"Nothing is shared without your explicit consent. You choose what practitioners can see.",color:C.green},
            {title:"The stories are consistent.",body:"Across thousands of people with Lyme, the same arcs appear. When they repeat at scale, they become signal.",color:C.gold},
          ].map((s,i)=>(
            <div key={i} style={{padding:"11px 13px",marginBottom:8,background:C.bg,borderRadius:12,borderLeft:`3px solid ${s.color}`}}>
              <div style={{fontSize:12,fontWeight:600,color:s.color,fontFamily:FONTS.sans,marginBottom:3}}>{s.title}</div>
              <div style={{fontSize:11,color:C.textMuted,fontFamily:FONTS.sans,lineHeight:1.6}}>{s.body}</div>
            </div>
          ))}
        </div>
        <Btn label="I understand — continue" onClick={advance}/>
      </div>
    </div>
  );

  if (name==="coinfections") return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <Dots/>
      <div style={wrap}>
        <div style={{marginTop:16}}>
          <div style={{fontSize:16,fontWeight:700,color:C.navy,fontFamily:FONTS.sans,letterSpacing:"-0.01em",marginBottom:4}}>Co-infections</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.6,marginBottom:14}}>
            Co-infections are core to your illness picture, not secondary. Untested is valid information too.
          </div>
          {COINFECTIONS.map(ci=>{
            const s = coInf[ci.key] || {tested:ci.tested,positive:ci.positive};
            const status = !s.tested ? "untested" : s.positive ? "positive" : "negative";
            return (
              <div key={ci.key} style={{padding:"11px 13px",marginBottom:6,background:C.surface,
                borderRadius:12,border:`1px solid ${C.border}`,
                borderLeft:`3px solid ${s.positive?ci.color:s.tested?C.steel:C.borderMid}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,fontWeight:500,color:C.text,fontFamily:FONTS.sans}}>{ci.label}</span>
                  <div style={{display:"flex",gap:5}}>
                    {["untested","negative","positive"].map(v=>(
                      <button key={v} onClick={()=>setCoInf(p=>({...p,[ci.key]:{tested:v!=="untested",positive:v==="positive"}}))}
                        style={{padding:"3px 8px",borderRadius:10,fontSize:10,fontFamily:FONTS.sans,cursor:"pointer",
                          border:`1px solid ${status===v?ci.color:C.border}`,
                          background:status===v?(v==="positive"?C.navySoft:C.steelSoft):C.surface,
                          color:status===v?(v==="positive"?ci.color:C.steel):C.textDim}}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans,marginTop:8,lineHeight:1.6,fontStyle:"italic"}}>
            If untested, that's noted — incomplete testing is common and limits interpretation in ways we'll hold alongside your record.
          </div>
        </div>
        <Btn label="Continue" onClick={advance}/>
      </div>
    </div>
  );

  if (name==="environment") return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <Dots/>
      <div style={wrap}>
        <div style={{marginTop:16}}>
          <div style={{fontSize:16,fontWeight:700,color:C.navy,fontFamily:FONTS.sans,letterSpacing:"-0.01em",marginBottom:4}}>Your environment</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.6,marginBottom:14}}>
            Where you live is part of your illness picture. Climate, altitude, mold, and smoke all affect how symptoms present and shift.
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>Location</div>
            <input value={env.location} onChange={e=>setEnv(p=>({...p,location:e.target.value}))}
              placeholder="City, state or region"
              style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${C.border}`,
                fontSize:13,fontFamily:FONTS.sans,color:C.text,background:C.bg,boxSizing:"border-box",outline:"none"}}/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Climate type</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {["Humid","Dry","Coastal","High altitude","Variable","Unknown"].map(cl=>(
                <button key={cl} onClick={()=>setEnv(p=>({...p,climate:cl}))}
                  style={{padding:"5px 12px",borderRadius:16,fontSize:11,fontFamily:FONTS.sans,cursor:"pointer",
                    border:`1px solid ${env.climate===cl?C.teal:C.border}`,
                    background:env.climate===cl?C.tealSoft:C.surface,
                    color:env.climate===cl?C.teal:C.textDim}}>
                  {cl}
                </button>
              ))}
            </div>
          </div>
          {[
            {key:"mold",label:"Mold exposure",sub:"Home, work, or past exposure"},
            {key:"smoke",label:"Smoke / air quality",sub:"Wildfire, pollution, or indoor smoke"},
            {key:"altitude",label:"Altitude change",sub:"Recent relocation to higher elevation"},
          ].map(ex=>(
            <div key={ex.key} onClick={()=>setEnv(p=>({...p,[ex.key]:!p[ex.key]}))}
              style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"10px 12px",marginBottom:5,borderRadius:10,cursor:"pointer",
                background:env[ex.key]?C.amberSoft:C.bg,
                border:`1px solid ${env[ex.key]?C.amber:C.border}`,transition:"all 0.2s"}}>
              <div>
                <div style={{fontSize:12,color:env[ex.key]?C.amber:C.text,fontFamily:FONTS.sans,fontWeight:500}}>{ex.label}</div>
                <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans}}>{ex.sub}</div>
              </div>
              <div style={{width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                background:env[ex.key]?C.amber:C.bg,border:`1.5px solid ${env[ex.key]?C.amber:C.borderMid}`}}>
                {env[ex.key]&&<span style={{fontSize:11,color:C.onDark,lineHeight:1}}>✓</span>}
              </div>
            </div>
          ))}
        </div>
        <Btn label="Continue" onClick={advance}/>
      </div>
    </div>
  );

  if (name==="wearables") return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <Dots/>
      <div style={wrap}>
        <div style={{marginTop:16}}>
          <div style={{fontSize:16,fontWeight:700,color:C.navy,fontFamily:FONTS.sans,letterSpacing:"-0.01em",marginBottom:4}}>Wearable data</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.6,marginBottom:14}}>
            Wearable data anchors your story in time — making visible what memory can't reliably track. Entirely optional.
          </div>
          {[
            {key:"apple",icon:"◉",label:"Apple Watch / Health",metrics:"HRV, sleep, activity, resting HR"},
            {key:"oura",icon:"◈",label:"Oura Ring",metrics:"Sleep stages, HRV, temperature, readiness"},
            {key:"garmin",icon:"○",label:"Garmin",metrics:"Sleep, HRV, activity, stress score"},
            {key:"none",icon:"—",label:"No wearable",metrics:"You can add this later in settings"},
          ].map(w=>(
            <div key={w.key} onClick={()=>setWearable(w.key)}
              style={{padding:"13px 16px",marginBottom:8,borderRadius:14,cursor:"pointer",
                border:`1.5px solid ${wearable===w.key?C.navy:C.border}`,
                background:wearable===w.key?C.navySoft:C.surface,
                display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
              <span style={{fontSize:18,color:C.navy,opacity:0.6}}>{w.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:C.text,fontFamily:FONTS.sans,marginBottom:2}}>{w.label}</div>
                <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans}}>{w.metrics}</div>
              </div>
              {wearable===w.key&&<div style={{width:8,height:8,borderRadius:"50%",background:C.navy}}/>}
            </div>
          ))}
        </div>
        <Btn label="Continue" onClick={advance} disabled={!wearable}/>
      </div>
    </div>
  );

  // ready
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",textAlign:"center"}}>
      <Dots/>
      <div style={{marginTop:20}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:C.greenSoft,
          border:`2px solid ${C.green}44`,display:"flex",alignItems:"center",
          justifyContent:"center",margin:"0 auto 16px",fontSize:22,color:C.green}}>◉</div>
        <div style={{fontSize:18,fontWeight:400,color:C.navy,lineHeight:1.4,marginBottom:8,fontFamily:FONTS.sans}}>
          Your record begins now.
        </div>
        <div style={{fontSize:12,color:C.textMuted,lineHeight:1.7,marginBottom:28,fontFamily:FONTS.sans,fontStyle:"italic"}}>
          Speak plainly. There is no wrong way to begin.<br/>What you share will take shape over time.
        </div>
        <button onClick={onComplete}
          style={{width:"100%",padding:14,background:C.navySoft,border:"none",color:C.teal,
            borderRadius:14,fontSize:13,fontFamily:FONTS.sans,cursor:"pointer",fontWeight:500}}>
          Begin my first session →
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// VOICE SESSION
// ══════════════════════════════════════════════════
// ElevenLabs voice ID — Rachel (calm, clear)
const EL_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const SILENCE_MS = 1750;
const MIN_UTTERANCE_CHARS = 12;
const MIN_UTTERANCE_WORDS = 3;
const ANTHROPIC_KEY_STORAGE = "lymepath.anthropicKey";
const ELEVEN_KEY_STORAGE = "lymepath.elevenlabsKey";
const ONBOARDED_STORAGE = "lymepath.onboarded";

const SYSTEM_PROMPT = `You are LymePath — a voice companion for people living with Lyme disease. You sound like a health coach they genuinely trust: warm, unhurried, casually informed. Not a doctor. Not a therapist. Someone who's done the reading, cares deeply, and knows how to listen without rushing to fix things.

VOICE & TONE
- Warm and conversational. Casual but not flippant. Like talking to someone who gets it.
- Medium pace. Never rushed. Never clinical.
- Use plain language. If you use a medical term, explain it briefly in the same breath.
- Never relentlessly positive. If something is hard, let it be hard.
- Never give unsolicited medical opinions. You share what's known, flag what isn't, and leave decisions to them.

WHO YOU'RE TALKING TO
- Read the room. Some people are newly diagnosed and scared. Some are chronic, exhausted, and have been dismissed for years. Some are actively improving and cautiously hopeful.
- Adapt your tone to what you're hearing. Don't assume. Listen first.
- Treat desperation as information, not irrationality. If someone has tried something unusual, that's worth understanding, not judging.

HOW YOU LISTEN
- Ask one question at a time. Always.
- Default to open-ended questions: "How has that been for you?" "What does that feel like day to day?" "What's shifted, if anything?"
- If something specific comes up — a symptom, a treatment, a pattern, a moment — follow it. Ask a more direct question. "You mentioned sugar — that's actually something worth unpacking a bit. Want to talk about it?"
- When someone says "I don't know" or "fine" or gives a very short answer, don't drop it. Ask a softer version: "What would you say if you had to guess?" or "Fine like okay, or fine like getting by?"
- When someone shares something painful — grief, anger, hopelessness — acknowledge it fully before asking anything. Don't pivot. Don't fix. Just be with it for a moment.

WHAT YOU KNOW
- You're informed about Lyme disease, co-infections, common treatments (pharmaceutical and herbal), the controversy between IDSA and ILADS, the reality of chronic symptoms, and the emotional toll of being dismissed by the medical system.
- When you know something, share it conversationally. "Bacteria actually does love sugar — it's one of those things both clinical and non-clinical people tend to agree on."
- When you don't know something or the evidence is unclear, say so honestly. "Honestly, the research on that is pretty thin right now — here's what we do know..."
- Never overclaim. Never diagnose. Never prescribe.

PACING & MEMORY
- This is a voice conversation. Keep responses to 2-4 sentences maximum.
- Remember everything said in this session. Reference it naturally when relevant. "Earlier you mentioned the fatigue was worst in the mornings — is that still true?"
- Don't summarize everything back. Just hold it and use it when it matters.

RECORD EXTRACTION
At the end of every response, output a JSON block on its own line in this exact format:
EXTRACT:{"items":[{"text":"brief description","type":"symptom|pattern|context|timeline"}]}
Only extract genuinely new, specific information mentioned in this turn.
If nothing new to extract: EXTRACT:{"items":[]}
Types: symptom (physical or cognitive), pattern (recurring behavior or trigger), context (life circumstances, environment, emotional state), timeline (dates, durations, sequences of events).`;

function VoiceSession({onBack,initialPrompt,elKey,onConfigKey,anthropicKey}) {
  const [orb, setOrb] = useState("idle");
  const [aiText, setAiText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [items, setItems] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const mountedR = useRef(true);
  const timerR = useRef(null);
  const recognitionR = useRef(null);
  const audioR = useRef(null);
  const historyR = useRef([]);
  const transcriptR = useRef("");
  const silenceTimerR = useRef(null);

  useEffect(()=>{
    mountedR.current = true;
    return ()=>{
      mountedR.current = false;
      clearInterval(timerR.current);
      clearTimeout(silenceTimerR.current);
      if (recognitionR.current) try { recognitionR.current.abort(); } catch(e) {}
      if (audioR.current) { audioR.current.pause(); audioR.current = null; }
      window.speechSynthesis.cancel();
    };
  },[]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const isMeaningfulUtterance = (text) => {
    const clean = text.trim();
    if (!clean) return false;
    const words = clean.split(/\s+/).filter(Boolean);
    return clean.length >= MIN_UTTERANCE_CHARS || words.length >= MIN_UTTERANCE_WORDS;
  };

  // ── Extract record items from GPT response ───
  const extractItems = (text) => {
    try {
      const match = text.match(/EXTRACT:(\{"items":\[.*?\]\})/);
      if (!match) return [];
      return JSON.parse(match[1]).items || [];
    } catch(e) { return []; }
  };

  // ── ElevenLabs TTS ──────────────────────────────
  const speak = async (text, onDone) => {
    if (!mountedR.current) return;
    const clean = text.replace(/EXTRACT:\{.*?\}/g,"").trim();
    setOrb("ai-speaking");
    setAiText(clean);

    if (!elKey) {
      const utt = new SpeechSynthesisUtterance(clean);
      utt.rate = 0.9; utt.pitch = 1.0;
      utt.onend = ()=>{ if(mountedR.current && onDone) onDone(); };
      window.speechSynthesis.speak(utt);
      return;
    }

    try {
      const res = await fetch(`/elevenlabs/v1/text-to-speech/${EL_VOICE_ID}/stream`, {
        method:"POST",
        headers:{"Content-Type":"application/json","xi-api-key":elKey},
        body: JSON.stringify({
          text: clean,
          model_id:"eleven_turbo_v2",
          voice_settings:{stability:0.45,similarity_boost:0.82,style:0.18,use_speaker_boost:true}
        })
      });
      if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioR.current) audioR.current.pause();
      audioR.current = new Audio(url);
      audioR.current.onended = ()=>{ URL.revokeObjectURL(url); if(mountedR.current && onDone) onDone(); };
      audioR.current.onerror = ()=>{ URL.revokeObjectURL(url); if(mountedR.current && onDone) onDone(); };
      audioR.current.play();
    } catch(e) {
      setError(`ElevenLabs: ${e.message}`);
      if (onDone) onDone();
    }
  };

  // ── Claude API ──────────────────────────────────
  const askClaude = async (userMsg) => {
    if (!mountedR.current) return;
    setOrb("processing");

    const prevHistory = historyR.current;
    const newHistory = [...prevHistory, {role:"user", content:userMsg}];
    historyR.current = newHistory;

    try {
      if (!anthropicKey) {
        throw new Error("Add your Anthropic key in Keys before starting a session.");
      }

      const res = await fetch("/anthropic/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key": anthropicKey,
          "anthropic-version":"2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true"
        },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:300,
          system: SYSTEM_PROMPT,
          messages: newHistory
        })
      });
      if (!res.ok) throw new Error(`Claude API ${res.status}`);
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm here. Tell me more.";

      const extracted = extractItems(reply);
      if (extracted.length > 0) {
        setItems(prev=>{ setNewCount(extracted.length); return [...prev,...extracted]; });
      }

      historyR.current = [...newHistory, {role:"assistant", content:reply}];
      setHistory(historyR.current);

      speak(reply, ()=>{ if(mountedR.current) startListening(); });

    } catch(e) {
      historyR.current = prevHistory;
      setError(`Claude: ${e.message}`);
      setOrb("idle");
    }
  };

  // ── Web Speech STT ──────────────────────────────
  const startListening = () => {
    if (!mountedR.current) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("Speech recognition requires Chrome."); return; }
    setOrb("listening"); setTranscript("");
    transcriptR.current = "";
    clearTimeout(silenceTimerR.current);
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognitionR.current = rec;
    rec.onresult = (e) => {
      let interim="", final="";
      for (let i=e.resultIndex;i<e.results.length;i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      if (mountedR.current) {
        const live = (final || interim).trim();
        setTranscript(live);
        transcriptR.current = live;

        if (live) {
          clearTimeout(silenceTimerR.current);
          silenceTimerR.current = setTimeout(() => {
            if (mountedR.current) stopListening();
          }, SILENCE_MS);
        }
      }
    };
    rec.onerror = (e) => {
      if (e.error!=="no-speech" && mountedR.current) setError(`Mic: ${e.error}`);
    };
    rec.start();
  };

  const stopListening = () => {
    clearTimeout(silenceTimerR.current);
    if (recognitionR.current) {
      try { recognitionR.current.stop(); } catch(e) {}
      recognitionR.current = null;
    }
    const said = transcriptR.current.trim();
    setTranscript("");
    transcriptR.current = "";
    if (!isMeaningfulUtterance(said)) { startListening(); return; }
    askClaude(said);
  };

  const interruptAndListen = () => {
    clearTimeout(silenceTimerR.current);
    if (audioR.current) {
      audioR.current.pause();
      audioR.current = null;
    }
    window.speechSynthesis.cancel();
    startListening();
  };

  // ── Begin session ───────────────────────────────
  const begin = () => {
    setStarted(true);
    timerR.current = setInterval(()=>{ if(mountedR.current) setElapsed(t=>t+1); },1000);
    const opening = initialPrompt
      ? `I'd like to ask you something. ${initialPrompt} Take your time.\n\nEXTRACT:{"items":[]}`
      : `Hey, have a specific place you want to start, or would you like me to ask you a question to get things going?\n\nEXTRACT:{"items":[]}`;
    historyR.current = [
      {role:"user", content:"Hello"},
      {role:"assistant", content:opening}
    ];
    setHistory(historyR.current);
    speak(opening, ()=>{ if(mountedR.current) startListening(); });
  };

  const isL = orb==="listening", isA = orb==="ai-speaking", isP = orb==="processing";

  // Sound wave bars — 12 bars, each animated with staggered delay
  const WaveBar = ({i, active, color}) => (
    <div style={{
      width:3, minHeight:4, maxHeight:28, height:active ? `${8+Math.sin(i*0.8)*10+10}px` : "5px",
      background: color, borderRadius:3, flexShrink:0, opacity: active ? 0.85 : 0.25,
      animation: active ? `lp-breathe ${0.8+i*0.07}s ease-in-out ${i*0.06}s infinite` : "none",
      transition:"height 0.3s ease, opacity 0.3s",
      transformOrigin:"bottom"
    }}/>
  );

  const SoundWave = ({active, color, bars=14}) => (
    <div style={{display:"flex",alignItems:"center",gap:3,height:32}}>
      {Array.from({length:bars},(_,i)=>(
        <WaveBar key={i} i={i} active={active} color={color}/>
      ))}
    </div>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:C.bg,fontFamily:FONTS.sans}}>
      {/* Session Header */}
      <div style={{padding:"10px 20px",background:C.surface,borderBottom:`1px solid ${C.border}`,
        display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:13,color:C.textDim,fontFamily:FONTS.sans,cursor:"pointer",letterSpacing:"0.02em"}}>← Back</button>
        <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.mono}}>{started?fmt(elapsed):"Session"}</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={onConfigKey} style={{background:"none",border:"none",cursor:"pointer",
            fontSize:9,color:elKey?C.green:C.textDim,fontFamily:FONTS.mono}}>
            {elKey?"● EL":"○ Voice"}
          </button>
          <div style={{fontSize:11,fontFamily:FONTS.sans,fontWeight:500,letterSpacing:"0.04em",
            color:isL?C.green:isA?C.teal:isP?C.amber:C.textDim}}>
            {isA?"Speaking":isL?"Listening":isP?"Thinking":"—"}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{padding:"8px 16px",background:C.dangerBg,borderBottom:`1px solid ${C.danger}`,
          fontSize:11,color:C.danger,fontFamily:FONTS.sans,display:"flex",justifyContent:"space-between"}}>
          <span>{error}</span>
          <button onClick={()=>setError(null)} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:13}}>×</button>
        </div>
      )}

      {/* ElevenLabs indicator */}
      {started && (
        <div style={{padding:"4px 16px",background:C.bg,borderBottom:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:elKey?C.green:C.amber}}/>
          <span style={{fontSize:9,color:C.textDim,fontFamily:FONTS.sans,letterSpacing:"0.06em"}}>
            {elKey?"ElevenLabs · Rachel":"Browser TTS — add ElevenLabs key for better voice"}
          </span>
        </div>
      )}

      {!started ? (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px",gap:0,background:C.surface}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:C.tealSoft,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28}}>
            <SoundWave active={false} color={C.teal} bars={9}/>
          </div>
          <div style={{fontSize:26,color:C.navy,fontWeight:700,textAlign:"center",lineHeight:1.25,marginBottom:10,fontFamily:FONTS.sans,letterSpacing:"-0.02em"}}>
            Start a session
          </div>
          <div style={{fontSize:14,color:C.textMuted,textAlign:"center",lineHeight:1.7,marginBottom:40,fontFamily:FONTS.sans,maxWidth:240}}>
            Speak plainly — your experience, what you're feeling, what's shifted.
            <br/><span style={{fontSize:12,color:C.textDim,marginTop:4,display:"block"}}>Requires Chrome.</span>
          </div>
          <button onClick={begin} className="lp-btn-primary" style={{padding:"15px 48px",fontSize:15}}>
            Begin session
          </button>
        </div>
      ) : (
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* AI voice area — editorial, progressive */}
          <div style={{padding:"20px 24px 0",flexShrink:0,minHeight:120}}>
            <div style={{fontSize:11,letterSpacing:"0.04em",textTransform:"uppercase",color:C.teal,fontFamily:FONTS.sans,fontWeight:600,marginBottom:12}}>LymePath</div>
            <div key={aiText.slice(0,20)} className="lp-session-text" style={{fontSize:16,lineHeight:1.8,color:C.text,fontFamily:FONTS.sans,fontWeight:400,minHeight:64}}>
              {aiText.split("\n").map((l,i,arr)=>(
                <span key={i}>{l}{i<arr.length-1&&<><br/><br/></>}</span>
              ))}
              {isA&&<span style={{color:C.teal,animation:"blink 0.8s infinite"}}> |</span>}
            </div>
          </div>

          {/* Sound wave + state center */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 0 12px",gap:8,flexShrink:0}}>

            {/* Wave display */}
            <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",height:40}}>
              {isP ? (
                <div style={{width:20,height:20,border:`2px solid ${C.borderMid}`,borderTop:`2px solid ${C.navy}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
              ) : (
                <SoundWave active={isL||isA} color={isL?C.green:isA?C.teal:C.textDim} bars={16}/>
              )}
              {/* Pulse ring when listening */}
              {isL && (
                <div style={{position:"absolute",inset:-12,borderRadius:"50%",border:`1px solid ${C.green}`,opacity:0,animation:"lp-pulse-ring 1.8s ease-out infinite"}}/>
              )}
            </div>

            {/* Live transcript — italic, fading in */}
            <div style={{fontSize:13,color:C.textMuted,fontStyle:"italic",fontFamily:FONTS.sans,
              textAlign:"center",maxWidth:260,lineHeight:1.7,minHeight:22,padding:"0 20px",
              opacity:isL?1:0,transition:"opacity 0.3s"}}>
              {transcript || (isL ? <span style={{color:C.textDim}}>Listening…</span> : null)}
            </div>

            {/* Status line */}
            <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.mono,
              opacity: isL||isA||isP ? 0 : 0.6}}>
              Auto-sends after {SILENCE_MS/1000}s of silence
            </div>

            {/* Action buttons — only shown when needed */}
            {isL && (
              <button onClick={stopListening} className="lp-btn-ghost" style={{padding:"7px 20px",fontSize:12}}>
                Send now
              </button>
            )}
            {isA && (
              <button onClick={interruptAndListen} className="lp-btn-ghost" style={{padding:"7px 20px",fontSize:12,color:C.teal,borderColor:C.tealSoft}}>
                Interrupt
              </button>
            )}
          </div>

          {/* Record panel — progressive reveal */}
          <div style={{flex:1,overflow:"hidden",borderTop:`1px solid ${C.border}`,background:C.surface,display:"flex",flexDirection:"column",
            opacity: items.length>0 ? 1 : 0.4, transition:"opacity 0.5s"}}>
            <div style={{padding:"10px 16px 6px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <div style={{fontSize:11,fontWeight:600,color:C.textMuted,fontFamily:FONTS.sans}}>
                {items.length>0 ? `Your record — ${items.length} item${items.length===1?"":"s"}` : "Your record"}
              </div>
              <div style={{display:"flex",gap:4}}>
                {Object.entries(TAG_C).slice(0,3).map(([type,s])=>(
                  <span key={type} className="lp-tag" style={{background:s.bg,color:s.text}}>{type}</span>
                ))}
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"4px 14px 16px"}}>
              {items.length===0 ? (
                <div style={{padding:"16px 0",fontSize:13,color:C.textDim,lineHeight:1.8,textAlign:"center",fontFamily:FONTS.sans}}>
                  As you speak, what matters<br/>will take shape here.
                </div>
              ) : items.map((item,i)=>{
                const s = TAG_C[item.type]||TAG_C.symptom;
                const isNew = i>=items.length-newCount;
                return (
                  <div key={i} className={isNew?"lp-record-item":""} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",
                    background:isNew?s.bg:"transparent",
                    borderLeft:`2px solid ${isNew?s.dot:C.border}`,
                    borderRadius:"0 8px 8px 0",marginBottom:3,transition:"background 0.5s"}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:s.dot,marginTop:6,flexShrink:0}}/>
                    <div style={{fontSize:12,color:isNew?s.text:C.textMuted,lineHeight:1.6,fontFamily:FONTS.sans}}>{item.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// MY RECORD
// ══════════════════════════════════════════════════
function MyRecord({onVoice}) {
  const [active, setActive] = useState(["fatigue","cognition","mood","sleep"]);
  const [coOpen, setCoOpen] = useState(false);
  const maxW = Math.max(...WORDS.map(w=>w.count));

  const toggle = k => setActive(p=>p.includes(k)?p.length>1?p.filter(x=>x!==k):p:[...p,k]);

  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>
      {/* Co-infections */}
      <Card style={{marginBottom:14}}>
        <div onClick={()=>setCoOpen(o=>!o)} style={{cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <Label sub={`${COINFECTIONS.filter(c=>c.positive).length} confirmed · ${COINFECTIONS.filter(c=>!c.tested).length} untested`}>Co-infections</Label>
          <span style={{fontSize:13,color:C.textDim,transform:coOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>⌄</span>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:coOpen?10:0}}>
          {COINFECTIONS.map(ci=>(
            <span key={ci.key} style={{fontSize:9,padding:"3px 8px",borderRadius:10,fontFamily:FONTS.sans,
              background:ci.positive?C.navySoft:ci.tested?C.steelSoft:C.bg,
              color:ci.positive?ci.color:ci.tested?C.steel:C.textDim,
              border:`1px solid ${ci.positive?"var(--lp-border-strong)":C.border}`}}>
              {ci.label}{ci.positive?" +":ci.tested?" −":" ?"}
            </span>
          ))}
        </div>
        {coOpen && (
          <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.65,
            padding:"10px 12px",background:C.bg,borderRadius:10,borderLeft:`3px solid ${C.amber}`}}>
            Babesia and Mycoplasma are confirmed. Bartonella tested negative. Ehrlichia and Anaplasma untested — this limits interpretation of some symptom patterns.
          </div>
        )}
      </Card>

      {/* Environment */}
      <Card style={{marginBottom:14}}>
        <Label sub="Denver, CO · High altitude">Environment</Label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
          {[
            {label:"Location",value:"Denver, CO",color:C.navy},
            {label:"Climate",value:"Semi-arid",color:C.steel},
            {label:"Altitude",value:"5,280 ft",color:C.amber},
            {label:"Air quality",value:"Moderate",color:C.green},
          ].map(s=>(
            <div key={s.label} style={{background:C.bg,borderRadius:10,padding:"9px 11px"}}>
              <div style={{fontSize:9,color:C.textDim,fontFamily:FONTS.sans,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>{s.label}</div>
              <div style={{fontSize:13,fontWeight:600,color:s.color,fontFamily:FONTS.sans}}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.6,padding:"8px 10px",background:C.amberSoft,borderRadius:10,borderLeft:`3px solid ${C.amber}`}}>
          High altitude may affect oxygenation and fatigue presentation. Seasonal smoke correlates with your worst months in the pattern view.
        </div>
      </Card>

      {/* Trends */}
      <Card style={{marginBottom:14}}>
        <Label sub="Severity 1–10">Symptom trends</Label>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
          {Object.entries(SYMS).map(([k,v])=>{
            const on = active.includes(k);
            return (
              <button key={k} onClick={()=>toggle(k)} style={{display:"flex",alignItems:"center",gap:4,
                padding:"3px 9px",borderRadius:16,border:`1.5px solid ${on?v.color:C.border}`,
                background:on?C.surface:C.bg,cursor:"pointer",fontFamily:FONTS.sans,
                opacity:on?1:0.38,transition:"all 0.2s"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:v.color}}/>
                <span style={{fontSize:10,color:on?v.color:C.textDim,fontWeight:500}}>{v.label}</span>
              </button>
            );
          })}
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={TREND_DATA} margin={{top:4,right:8,bottom:0,left:-24}}>
            <Grads/>
            <XAxis dataKey="w" tick={{fill:C.graphAxes,fontSize:9,fontFamily:FONTS.sans}} axisLine={false} tickLine={false}/>
            <YAxis domain={[0,10]} tick={{fill:C.graphAxes,fontSize:9,fontFamily:FONTS.sans}} axisLine={false} tickLine={false}/>
            <Tooltip content={<Tip/>}/>
            {TIMELINE.filter(e=>e.type==="treatment"||e.type==="flare").map(e=>(
              <ReferenceLine key={e.w+e.label} x={e.w} stroke={e.color} strokeDasharray="3 3" strokeOpacity={0.15} strokeWidth={1.5}/>
            ))}
            {Object.entries(SYMS).map(([k,v])=>active.includes(k)&&(
              <Area key={k} type="monotone" dataKey={k} name={v.label} stroke={v.color} strokeWidth={2.5} fill={`url(#g_${k})`} dot={false} activeDot={{r:4,fill:v.color,stroke:C.onDark,strokeWidth:2}}/>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Timeline */}
      <Card style={{marginBottom:14}}>
        <Label sub="12 weeks">Timeline</Label>
        <div style={{position:"relative",paddingLeft:18}}>
          <div style={{position:"absolute",left:5,top:8,bottom:8,width:1.5,background:`linear-gradient(to bottom,${C.navy},${C.gold})`,opacity:0.25}}/>
          {TIMELINE.map((e,i)=>{
            const isRecent = e.w === "W12";
            return (
            <div
              key={i}
              className={isRecent ? "recent-activity-indicator" : ""}
              style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:i<TIMELINE.length-1?12:0}}
            >
              <div style={{width:9,height:9,borderRadius:"50%",background:e.color,flexShrink:0,marginTop:3,
                boxShadow:`0 0 0 2px ${C.surface},0 0 0 3.5px ${e.color}44`,
                position:"relative",left:-13,marginRight:-13}}/>
              <div style={{flex:1}}>
                <span style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans}}>Week {e.w.replace("W","")}</span>
                {isRecent && (
                  <span style={{fontSize:9,color:C.teal,fontFamily:FONTS.sans,fontWeight:600,letterSpacing:"0.04em",marginLeft:6}}>
                    Recent
                  </span>
                )}
                <span style={{fontSize:10,color:C.borderMid,margin:"0 5px"}}>·</span>
                <span style={{fontSize:12,color:e.type==="milestone"?e.color:C.textMuted,fontFamily:FONTS.sans,fontWeight:e.type==="milestone"?"600":"400"}}>{e.label}</span>
              </div>
            </div>
          )})}
        </div>
      </Card>

      {/* Language */}
      <Card style={{marginBottom:14}}>
        <Label sub="Most frequent across 18 sessions">Your language</Label>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
          {Object.entries(WORD_C).map(([type,s])=>(
            <span key={type} style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:s.bg,color:s.color,fontFamily:FONTS.sans,letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:500}}>{type}</span>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {WORDS.map(w=>{
            const pct = (w.count/maxW)*100;
            const s = WORD_C[w.type];
            return (
              <div key={w.text} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:76,textAlign:"right",flexShrink:0,fontSize:12,color:C.textMuted,fontFamily:FONTS.sans,fontStyle:"italic"}}>{w.text}</div>
                <div style={{flex:1,height:10,background:C.bg,borderRadius:5,overflow:"hidden"}}>
                  <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${s.color}77,${s.color})`,borderRadius:5}}/>
                </div>
                <div style={{width:24,textAlign:"right",flexShrink:0,fontSize:10,color:C.textDim,fontFamily:FONTS.sans}}>{w.count}</div>
                <div style={{width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0}}/>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Insights */}
      <div style={{marginBottom:6}}>
        <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textDim,fontFamily:FONTS.sans,marginBottom:8,paddingLeft:2}}>Insights from your record</div>
        {INSIGHTS.map(ins=>(
          <div key={ins.id} style={{background:ins.bg,borderRadius:14,padding:"12px 14px",marginBottom:8,borderLeft:`3px solid ${ins.color}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
              <div style={{fontSize:12,color:C.textMuted,fontFamily:FONTS.sans,fontStyle:"italic",lineHeight:1.55,flex:1}}>"{ins.q}"</div>
              <VBtn onClick={()=>onVoice(ins.q)} label="Respond"/>
            </div>
          </div>
        ))}
      </div>
      <div style={{height:8}}/>
    </div>
  );
}

// ══════════════════════════════════════════════════
// PROTOCOL
// ══════════════════════════════════════════════════
function Protocol({onVoice}) {
  const [expanded, setExpanded] = useState(null);
  const [overlays, setOverlays] = useState(["fatigue","mood"]);
  const toggleO = k => setOverlays(p=>p.includes(k)?p.length>1?p.filter(x=>x!==k):p:[...p,k]);

  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>
      <Card style={{marginBottom:14}}>
        <Label sub="Protocol doses overlaid with symptom trends">Protocol & trends</Label>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
          {Object.entries(SYMS).map(([k,v])=>{
            const on = overlays.includes(k);
            return (
              <button key={k} onClick={()=>toggleO(k)} style={{display:"flex",alignItems:"center",gap:4,
                padding:"3px 9px",borderRadius:16,border:`1.5px solid ${on?v.color:C.border}`,
                background:on?C.surface:C.bg,cursor:"pointer",fontFamily:FONTS.sans,opacity:on?1:0.38,transition:"all 0.2s"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:v.color}}/>
                <span style={{fontSize:10,color:on?v.color:C.textDim,fontWeight:500}}>{v.label}</span>
              </button>
            );
          })}
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={TREND_DATA} margin={{top:4,right:8,bottom:0,left:-24}}>
            <Grads/>
            <XAxis dataKey="w" tick={{fill:C.graphAxes,fontSize:9,fontFamily:FONTS.sans}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.graphAxes,fontSize:9,fontFamily:FONTS.sans}} axisLine={false} tickLine={false}/>
            <Tooltip content={<Tip/>}/>
            {TIMELINE.filter(e=>e.type==="treatment").map(e=>(
              <ReferenceLine key={e.w+e.label} x={e.w} stroke={C.borderMid} strokeDasharray="4 3" strokeWidth={1}/>
            ))}
            {Object.entries(SYMS).map(([k,v])=>overlays.includes(k)&&(
              <Area key={k} type="monotone" dataKey={k} name={v.label} stroke={v.color} strokeWidth={2} fill={`url(#g_${k})`} dot={false} activeDot={{r:3,fill:v.color}}/>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div style={{padding:"11px 14px",marginBottom:14,background:C.surface,borderRadius:12,
        border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,
        fontSize:11,color:C.textDim,lineHeight:1.65,fontFamily:FONTS.sans,fontStyle:"italic"}}>
        Your protocol is yours. What follows is a scientific lens — current evidence, where the gaps are, and how others with similar profiles have used it. No verdicts.
      </div>

      {PROTOCOL.map(item=>{
        const open = expanded===item.id;
        return (
          <div key={item.id} style={{border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:10,borderLeft:`3px solid ${item.color}`}}>
            <div onClick={()=>setExpanded(open?null:item.id)} style={{padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",background:open?item.bg:C.surface,transition:"background 0.2s"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:FONTS.sans}}>{item.name}</span>
                  <span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:item.bg,color:item.color,fontFamily:FONTS.sans}}>{item.cat}</span>
                </div>
                <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans}}>{item.dose} · {item.weeks}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <EvidenceBadge label={item.evidence} color={item.evColor} bg={item.evBg}/>
                <span style={{fontSize:13,color:C.textDim,transform:open?"rotate(180deg)":"none",display:"block",transition:"transform 0.2s"}}>⌄</span>
              </div>
            </div>
            {open && (
              <div style={{padding:"0 16px 16px",background:C.surface}}>
                <div style={{padding:"10px 12px",background:C.bg,borderRadius:10,marginBottom:10,marginTop:4}}>
                  <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textDim,fontFamily:FONTS.sans,marginBottom:6}}>Scientific lens</div>
                  <div style={{fontSize:11,color:C.textDim,lineHeight:1.65,fontFamily:FONTS.sans,fontStyle:"italic",borderLeft:`2px solid ${C.borderMid}`,paddingLeft:10}}>{item.note}</div>
                </div>
                <div style={{marginBottom:10}}>
                  {item.links.map((lnk,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:C.bg,borderRadius:8,cursor:"pointer",border:`1px solid ${C.border}`,marginBottom:4}}>
                      <span style={{fontSize:8,padding:"1px 6px",borderRadius:6,background:C.surface,color:LINK_C[lnk.t]||C.steel,border:`1px solid ${C.border}`,fontFamily:FONTS.sans,letterSpacing:"0.06em",textTransform:"uppercase",flexShrink:0,fontWeight:600}}>{lnk.t}</span>
                      <span style={{fontSize:11,color:item.color,fontFamily:FONTS.sans,flex:1,lineHeight:1.4}}>{lnk.l}</span>
                      <span style={{fontSize:11,color:C.textDim}}>→</span>
                    </div>
                  ))}
                </div>
                <div style={{padding:"10px 12px",background:`linear-gradient(135deg,${item.bg},${C.surface})`,borderRadius:10,border:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textDim,fontFamily:FONTS.sans,marginBottom:4}}>In the cohort</div>
                    <div style={{fontSize:11,color:C.textMuted,fontFamily:FONTS.sans,lineHeight:1.55}}>{item.cohort}</div>
                  </div>
                  <VBtn onClick={()=>onVoice(`Tell me more about what you've noticed with ${item.name}.`)} label="Discuss"/>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{padding:"13px 16px",borderRadius:14,border:`1.5px dashed ${C.borderMid}`,display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",marginBottom:14}}>
        <span style={{fontSize:18,color:C.textDim,lineHeight:1}}>+</span>
        <span style={{fontSize:12,color:C.textDim,fontFamily:FONTS.sans}}>Add something you're trying</span>
      </div>
      <div style={{height:8}}/>
    </div>
  );
}

// ══════════════════════════════════════════════════
// ══════════════════════════════════════════════════
// PATTERNS
// ══════════════════════════════════════════════════
function Patterns() {
  const [selSym, setSelSym] = useState(null);
  const [stats, setStats] = useState({active:142,insights:28,pct:0.67,cohort:847});

  useEffect(()=>{
    const t = setInterval(()=>setStats(p=>({...p,
      active:p.active+(Math.random()>0.5?1:-1),
      insights:p.insights+(Math.random()>0.82?1:0),
      pct:Math.min(1,Math.max(0.4,p.pct+(Math.random()-0.5)*0.018)),
    })),3000);
    return()=>clearInterval(t);
  },[]);

  const cx=130,cy=118,r0=22,r1=96;
  const n=MONTHS.length;
  const startA=-Math.PI/2;
  const aStep=(2*Math.PI)/n;

  const path = sym => {
    const vals = RADIAL[sym];
    const pts = vals.map((v,i)=>{
      const a = startA+i*aStep;
      const r = r0+((v/10)*(r1-r0));
      return [cx+r*Math.cos(a),cy+r*Math.sin(a)];
    });
    return pts.map((p,i)=>`${i===0?"M":"L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")+" Z";
  };

  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>
      <Card style={{marginBottom:14}}>
        <Label sub="Tap a ribbon to isolate">Seasonal patterns</Label>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
          {Object.keys(RADIAL).map(sym=>{
            const on = selSym===null||selSym===sym;
            return (
              <button key={sym} onClick={()=>setSelSym(selSym===sym?null:sym)} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:16,border:`1.5px solid ${on?RCOL[sym]:C.border}`,background:on?C.surface:C.bg,cursor:"pointer",fontFamily:FONTS.sans,opacity:on?1:0.32,transition:"all 0.2s"}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:RCOL[sym]}}/>
                <span style={{fontSize:10,color:on?RCOL[sym]:C.textDim,fontWeight:500}}>{sym}</span>
              </button>
            );
          })}
        </div>
        <svg width="100%" viewBox="0 0 260 240" style={{display:"block",overflow:"visible"}}>
          {[0.25,0.5,0.75,1].map(f=>(
            <circle key={f} cx={cx} cy={cy} r={r0+f*(r1-r0)} fill="none" stroke={C.border} strokeWidth="0.5"/>
          ))}
          {MONTHS.map((_,i)=>{
            const a=startA+i*aStep;
            return <line key={i} x1={cx+r0*Math.cos(a)} y1={cy+r0*Math.sin(a)} x2={cx+r1*Math.cos(a)} y2={cy+r1*Math.sin(a)} stroke={C.border} strokeWidth="0.5"/>;
          })}
          {Object.keys(RADIAL).map(sym=>{
            const show = selSym===null||selSym===sym;
            const col = RCOL[sym];
            return <path key={sym} d={path(sym)} fill={col} fillOpacity={show?(selSym===sym?0.22:0.10):0.03} stroke={col} strokeWidth={show?(selSym===sym?2:1.2):0.3} strokeOpacity={show?1:0.2} style={{cursor:"pointer",transition:"all 0.25s"}} onClick={()=>setSelSym(selSym===sym?null:sym)}/>;
          })}
          {MONTHS.map((m,i)=>{
            const a=startA+i*aStep; const r=r1+14;
            return <text key={m} x={cx+r*Math.cos(a)} y={cy+r*Math.sin(a)} fontSize="8" fill={C.textDim} fontFamily="sans-serif" textAnchor="middle" dominantBaseline="middle">{m}</text>;
          })}
        </svg>
      </Card>

      {/* Live stats */}
      <Card style={{marginBottom:14}}>
        <Label sub="Updates in real time">Shared activity</Label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {[
            {label:"Active sessions",value:stats.active,color:C.teal,fmt:v=>v},
            {label:"Cohort size",value:stats.cohort,color:C.navy,fmt:v=>v.toLocaleString()},
            {label:"Insights today",value:stats.insights,color:C.green,fmt:v=>v},
            {label:"Avg session",value:18,color:C.amber,fmt:v=>`${v} min`},
          ].map(s=>(
            <div key={s.label} style={{background:C.bg,borderRadius:12,padding:"12px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:700,color:s.color,fontFamily:FONTS.sans,lineHeight:1,marginBottom:4}}>{s.fmt(s.value)}</div>
              <div style={{fontSize:9,color:C.textDim,fontFamily:FONTS.sans,letterSpacing:"0.07em",textTransform:"uppercase",lineHeight:1.3}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans}}>Sessions today vs daily avg</span>
            <span style={{fontSize:10,color:C.teal,fontFamily:FONTS.sans,fontWeight:600}}>{Math.round(stats.pct*100)}%</span>
          </div>
          <div style={{height:6,background:C.bg,borderRadius:3,overflow:"hidden"}}>
            <div style={{width:`${stats.pct*100}%`,height:"100%",background:`linear-gradient(90deg,${C.teal}88,${C.teal})`,borderRadius:3,transition:"width 1.4s ease"}}/>
          </div>
        </div>
        <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textDim,fontFamily:FONTS.sans,marginBottom:7}}>New variables this week</div>
        {[["Methylene blue",C.teal],["Red light therapy",C.amber],["HBOT sessions",C.navy]].map(([v,col],i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:C.bg,borderRadius:8,marginBottom:4,borderLeft:`2px solid ${col}`}}>
            <span style={{fontSize:11,color:C.textMuted,fontFamily:FONTS.sans,flex:1}}>{v}</span>
            <span style={{fontSize:9,color:col,fontFamily:FONTS.sans,fontWeight:600,background:C.surface,padding:"1px 6px",borderRadius:8,border:`1px solid ${C.border}`}}>new</span>
          </div>
        ))}
      </Card>
      <div style={{height:8}}/>
    </div>
  );
}

// ══════════════════════════════════════════════════
// BODY / VITALS TAB
// ══════════════════════════════════════════════════
const BODY_METRICS = [
  {key:"hrv",    label:"Heart Rate Variability", unit:"ms",  color:C.teal,  grad:"g_hrv",    current:52,  baseline:28,  fmt:v=>`${v} ms`,   good:"higher",
   note:"HRV has risen steadily from W6 onward, correlating with LDN introduction and improved sleep. Low HRV at W4 aligned with your worst flare."},
  {key:"rhr",    label:"Resting Heart Rate",     unit:"bpm", color:C.rose,  grad:"g_rhr",    current:62,  baseline:78,  fmt:v=>`${v} bpm`,  good:"lower",
   note:"Resting HR dropped 16 bpm over 12 weeks. Elevated HR at W4 preceded the fatigue flare by approximately 2 days."},
  {key:"sleep_h",label:"Sleep Duration",         unit:"hrs", color:C.green, grad:"g_sleep_h", current:8.0, baseline:5.2, fmt:v=>`${v.toFixed(1)} h`, good:"higher",
   note:"Sleep improved 2 weeks before fatigue scores followed — suggesting sleep may be a leading indicator in your pattern."},
  {key:"steps",  label:"Daily Steps",            unit:"",    color:C.navy,  grad:"g_steps",  current:7400,baseline:3200,fmt:v=>v.toLocaleString(),   good:"higher",
   note:"Activity roughly doubled from W6 onward. Lowest at W4 during flare — useful anchor for understanding crash severity."},
  {key:"temp",   label:"Skin Temp Offset",       unit:"°F",  color:C.amber, grad:"g_temp",   current:-0.3,baseline:+0.3,fmt:v=>`${v>0?"+":""}${v.toFixed(1)}°`, good:"lower",
   note:"Temperature offset trending slightly negative (cooler than baseline) — a pattern sometimes associated with improving autonomic function."},
];

const CORRELATIONS = [
  {a:"HRV ↑",        b:"Fatigue ↓",   strength:0.82, weeks:"W6–W12", color:C.teal,  note:"Strong inverse relationship. HRV rises tend to precede fatigue improvement by ~5 days."},
  {a:"Sleep ↑",      b:"Cognition ↓", strength:0.74, weeks:"W7–W12", color:C.green, note:"Sleep duration correlates with cognitive clarity the following 2–3 days."},
  {a:"Resting HR ↑", b:"Flare",       strength:0.68, weeks:"W4",     color:C.rose,  note:"Elevated resting HR appeared ~48 hrs before your worst fatigue flare. Worth watching."},
  {a:"Steps ↑",      b:"Mood ↑",      strength:0.61, weeks:"W8–W12", color:C.navy,  note:"Activity and mood move together — direction of causality unclear but pattern is consistent."},
];

function StrengthBar({value, color}) {
  return (
    <div style={{flex:1,height:5,background:C.bg,borderRadius:3,overflow:"hidden"}}>
      <div style={{width:`${value*100}%`,height:"100%",background:`linear-gradient(90deg,${color}66,${color})`,borderRadius:3,transition:"width 0.6s ease"}}/>
    </div>
  );
}

function Body() {
  const [metric, setMetric] = useState("hrv");
  const [corrOpen, setCorrOpen] = useState(null);
  const m = BODY_METRICS.find(x=>x.key===metric);
  const pctChange = m ? Math.round(((m.current - m.baseline) / m.baseline) * 100) : 0;
  const improved = m ? (m.good==="higher" ? m.current > m.baseline : m.current < m.baseline) : false;

  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>

      {/* Device status */}
      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:FONTS.sans,marginBottom:2}}>Apple Watch</div>
            <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans}}>Last synced 14 min ago · 12 weeks of data</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:12,background:C.greenSoft,border:`1px solid ${C.green}44`}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.green}}/>
            <span style={{fontSize:10,color:C.green,fontFamily:FONTS.sans,fontWeight:600}}>Connected</span>
          </div>
        </div>
      </Card>

      {/* Metric overview pills */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
        {BODY_METRICS.map(bm=>{
          const on = metric===bm.key;
          const imp = bm.good==="higher" ? bm.current > bm.baseline : bm.current < bm.baseline;
          return (
            <div key={bm.key} onClick={()=>setMetric(bm.key)}
              style={{padding:"11px 12px",borderRadius:14,cursor:"pointer",
                border:`1.5px solid ${on?bm.color:C.border}`,
                background:on?C.navySoft:C.surface,transition:"all 0.2s"}}>
              <div style={{fontSize:9,color:on?bm.color:C.textDim,fontFamily:FONTS.sans,
                letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4,fontWeight:on?"600":"400"}}>{bm.label.split(" ").slice(-1)[0]}</div>
              <div style={{fontSize:17,fontWeight:700,color:on?bm.color:C.text,fontFamily:FONTS.sans,lineHeight:1,marginBottom:3}}>{bm.fmt(bm.current)}</div>
              <div style={{fontSize:10,color:imp?C.green:C.rose,fontFamily:FONTS.sans,fontWeight:500}}>
                {imp?"↑":"↓"} {Math.abs(Math.round(((bm.current-bm.baseline)/Math.abs(bm.baseline||1))*100))}% from start
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected metric chart */}
      {m && (
        <Card style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:FONTS.sans,marginBottom:2}}>{m.label}</div>
              <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans}}>12-week trend · Apple Watch</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:18,fontWeight:700,color:m.color,fontFamily:FONTS.sans,lineHeight:1}}>{m.fmt(m.current)}</div>
              <div style={{fontSize:10,color:improved?C.green:C.rose,fontFamily:FONTS.sans,marginTop:2}}>
                {improved?"↑":"↓"} {Math.abs(pctChange)}% from W1
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={WEARABLE_DATA} margin={{top:4,right:8,bottom:0,left:-24}}>
              <Grads/>
              <XAxis dataKey="w" tick={{fill:C.graphAxes,fontSize:9,fontFamily:FONTS.sans}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.graphAxes,fontSize:9,fontFamily:FONTS.sans}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <ReferenceLine y={m.baseline} stroke={m.color} strokeDasharray="4 3" strokeOpacity={0.15} strokeWidth={1}/>
              <Area type="monotone" dataKey={m.key} name={m.label} stroke={m.color} strokeWidth={2.5}
                fill={`url(#${m.grad})`} dot={false} activeDot={{r:4,fill:m.color,stroke:C.onDark,strokeWidth:2}}/>
            </AreaChart>
          </ResponsiveContainer>

          <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.65,
            marginTop:10,padding:"9px 11px",background:C.bg,borderRadius:10,
            borderLeft:`3px solid ${m.color}`}}>
            {m.note}
          </div>
        </Card>
      )}

      {/* Correlations */}
      <Card style={{marginBottom:14}}>
        <Label sub="Where passive data intersects your symptom record">Correlations</Label>
        <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.6,
          marginBottom:12,padding:"8px 10px",background:C.bg,borderRadius:8,
          borderLeft:`2px solid ${C.borderMid}`,fontStyle:"italic"}}>
          These are observed associations, not causes. They surface patterns worth reflecting on, not conclusions.
        </div>
        {CORRELATIONS.map((corr,i)=>{
          const open = corrOpen===i;
          return (
            <div key={i} onClick={()=>setCorrOpen(open?null:i)}
              style={{padding:"11px 13px",marginBottom:6,borderRadius:12,cursor:"pointer",
                border:`1px solid ${open?corr.color:C.border}`,
                background:open?C.navySoft:C.surface,transition:"all 0.2s"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:open?8:0}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                    <span style={{fontSize:12,fontWeight:600,color:corr.color,fontFamily:FONTS.sans}}>{corr.a}</span>
                    <span style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans}}>with</span>
                    <span style={{fontSize:12,fontWeight:600,color:C.text,fontFamily:FONTS.sans}}>{corr.b}</span>
                    <span style={{fontSize:9,color:C.textDim,fontFamily:FONTS.sans,marginLeft:"auto"}}>{corr.weeks}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <StrengthBar value={corr.strength} color={corr.color}/>
                    <span style={{fontSize:10,color:corr.color,fontFamily:FONTS.sans,fontWeight:600,flexShrink:0}}>{Math.round(corr.strength*100)}%</span>
                  </div>
                </div>
                <span style={{fontSize:12,color:C.textDim,transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>⌄</span>
              </div>
              {open && (
                <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.65,
                  paddingTop:6,borderTop:`1px solid ${C.border}`}}>
                  {corr.note}
                </div>
              )}
            </div>
          );
        })}
      </Card>

      {/* Observational note */}
      <div style={{padding:"12px 14px",borderRadius:12,background:C.bg,
        border:`1px solid ${C.border}`,marginBottom:14,
        fontSize:11,color:C.textDim,lineHeight:1.65,fontFamily:FONTS.sans,fontStyle:"italic",
        borderLeft:`3px solid ${C.gold}`}}>
        Wearable data doesn't replace your story. It anchors it in time — surfacing what memory can't reliably track and what a single clinical visit can't see.
      </div>

      <div style={{height:8}}/>
    </div>
  );
}

// ══════════════════════════════════════════════════
// PRACTITIONER SHARE
// ══════════════════════════════════════════════════
function PractitionerShare({onClose}) {
  const [sel, setSel] = useState({timeline:true,protocol:true,coinfections:true,wearables:false,language:false,insights:true});
  const [expiry, setExpiry] = useState("7days");
  const [preview, setPreview] = useState(false);
  const [linked, setLinked] = useState(false);

  const items = [
    {key:"timeline",label:"Timeline",sub:"12 weeks of events"},
    {key:"protocol",label:"Protocol",sub:"Interventions, doses, changes"},
    {key:"coinfections",label:"Co-infections",sub:"Testing status and results"},
    {key:"wearables",label:"Wearable data",sub:"HRV, sleep, activity"},
    {key:"insights",label:"Insights",sub:"Correlations surfaced by the app"},
    {key:"language",label:"Language patterns",sub:"Recurring words from sessions"},
  ];

  return (
    <div style={{position:"absolute",inset:0,background:C.bg,borderRadius:46,display:"flex",flexDirection:"column",overflow:"hidden",zIndex:50}}>
      <div style={{padding:"8px 20px",background:C.surface,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:12,color:C.textDim,fontFamily:FONTS.sans,cursor:"pointer"}}>← Back</button>
        <div style={{fontSize:12,fontWeight:600,color:C.text,fontFamily:FONTS.sans}}>Share with practitioner</div>
        <div style={{width:40}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>
        {!preview ? <>
          <div style={{padding:"11px 13px",marginBottom:14,background:C.navySoft,borderRadius:12,borderLeft:`3px solid ${C.navy}`,fontSize:11,color:C.textDim,lineHeight:1.65,fontFamily:FONTS.sans,fontStyle:"italic"}}>
            You decide what your practitioner sees. Select what's relevant for this appointment.
          </div>
          <Label sub="Select what to include">Curate your view</Label>
          {items.map(item=>(
            <div key={item.key} onClick={()=>setSel(p=>({...p,[item.key]:!p[item.key]}))}
              style={{display:"flex",alignItems:"center",gap:12,padding:"11px 13px",marginBottom:6,borderRadius:12,cursor:"pointer",background:sel[item.key]?C.navySoft:C.surface,border:`1.5px solid ${sel[item.key]?C.navy:C.border}`,transition:"all 0.2s"}}>
              <div style={{width:18,height:18,borderRadius:5,flexShrink:0,background:sel[item.key]?C.navy:C.bg,border:`1.5px solid ${sel[item.key]?C.navy:C.borderMid}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {sel[item.key]&&<span style={{fontSize:11,color:C.onDark,lineHeight:1}}>✓</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:500,color:sel[item.key]?C.navy:C.text,fontFamily:FONTS.sans}}>{item.label}</div>
                <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans}}>{item.sub}</div>
              </div>
            </div>
          ))}
          <div style={{marginTop:14,marginBottom:14}}>
            <Label sub="Link expires after">Access duration</Label>
            <div style={{display:"flex",gap:6}}>
              {[{k:"24hrs",l:"24 hours"},{k:"7days",l:"7 days"},{k:"30days",l:"30 days"},{k:"once",l:"One-time"}].map(e=>(
                <button key={e.k} onClick={()=>setExpiry(e.k)} style={{flex:1,padding:"7px 4px",borderRadius:10,fontSize:10,fontFamily:FONTS.sans,border:`1px solid ${expiry===e.k?C.navy:C.border}`,background:expiry===e.k?C.navySoft:C.surface,color:expiry===e.k?C.navy:C.textDim,cursor:"pointer"}}>
                  {e.l}
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>setPreview(true)} style={{width:"100%",padding:14,background:C.navySoft,border:"none",color:C.teal,borderRadius:14,fontSize:13,fontFamily:FONTS.sans,cursor:"pointer",fontWeight:500}}>
            Preview & generate link
          </button>
        </> : <>
          <Label sub="What your practitioner will see">Preview</Label>
          <div style={{background:C.surface,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:14}}>
            <div style={{padding:14,borderBottom:`1px solid ${C.border}`,background:C.navySoft}}>
              <div style={{fontSize:12,fontWeight:600,color:C.navy,fontFamily:FONTS.sans,marginBottom:2}}>LymePath — Practitioner View</div>
              <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans}}>Shared by patient · Expires {expiry} · Read only</div>
            </div>
            <div style={{padding:"12px 14px"}}>
              {items.filter(i=>sel[i.key]).map(item=>(
                <div key={item.key} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.navy}}/>
                  <span style={{fontSize:11,color:C.textMuted,fontFamily:FONTS.sans}}>{item.label}</span>
                  <span style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans,marginLeft:"auto"}}>{item.sub}</span>
                </div>
              ))}
            </div>
            <div style={{padding:"10px 13px",background:C.bg,fontSize:10,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.6}}>
              This view is observational only. All clinical judgment remains with the practitioner.
            </div>
          </div>
          {!linked ? (
            <button onClick={()=>setLinked(true)} style={{width:"100%",padding:14,background:C.navySoft,border:"none",color:C.teal,borderRadius:14,fontSize:13,fontFamily:FONTS.sans,cursor:"pointer",fontWeight:500}}>
              Generate secure link
            </button>
          ) : (
            <div style={{padding:14,background:C.greenSoft,borderRadius:14,border:`1px solid ${C.green}44`}}>
              <div style={{fontSize:11,color:C.green,fontFamily:FONTS.sans,fontWeight:600,marginBottom:6}}>Link generated</div>
              <div style={{fontSize:12,color:C.textMuted,fontFamily:FONTS.sans,background:C.surface,padding:"8px 10px",borderRadius:8,border:`1px solid ${C.border}`,marginBottom:8,wordBreak:"break-all"}}>lymepath.io/share/p7x2k9…</div>
              <div style={{display:"flex",gap:6}}>
                <button style={{flex:1,padding:10,background:C.navySoft,border:"none",color:C.teal,borderRadius:10,fontSize:12,fontFamily:FONTS.sans,cursor:"pointer"}}>Copy link</button>
                <button style={{flex:1,padding:10,background:C.surface,border:`1px solid ${C.border}`,color:C.textMuted,borderRadius:10,fontSize:12,fontFamily:FONTS.sans,cursor:"pointer"}}>Email</button>
              </div>
            </div>
          )}
        </>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════
function Export({onClose}) {
  const [fmt, setFmt] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const go = () => { setExporting(true); setTimeout(()=>{setExporting(false);setDone(true);},2000); };

  return (
    <div style={{position:"absolute",inset:0,background:C.bg,borderRadius:46,display:"flex",flexDirection:"column",overflow:"hidden",zIndex:50}}>
      <div style={{padding:"8px 20px",background:C.surface,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:12,color:C.textDim,fontFamily:FONTS.sans,cursor:"pointer"}}>← Back</button>
        <div style={{fontSize:12,fontWeight:600,color:C.text,fontFamily:FONTS.sans}}>Export record</div>
        <div style={{width:40}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>
        <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.65,marginBottom:16}}>
          Export a copy of your record for appointments, second opinions, or personal reference.
        </div>
        {[
          {key:"pdf",icon:"◉",title:"Clinical summary PDF",sub:"Timeline, protocol, co-infections, wearable highlights. Formatted for practitioners.",color:C.navy},
          {key:"csv",icon:"◈",title:"Full data export (CSV)",sub:"All logged variables, wearable data, and session-extracted entries.",color:C.steel},
          {key:"json",icon:"○",title:"Raw record (JSON)",sub:"Complete structured record for developers or custom tools.",color:C.textDim},
        ].map(f=>(
          <div key={f.key} onClick={()=>setFmt(f.key)} style={{padding:"13px 16px",marginBottom:8,borderRadius:14,cursor:"pointer",border:`1.5px solid ${fmt===f.key?f.color:C.border}`,background:fmt===f.key?C.navySoft:C.surface,display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
            <span style={{fontSize:18,color:f.color,opacity:0.7}}>{f.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:500,color:fmt===f.key?f.color:C.text,fontFamily:FONTS.sans,marginBottom:2}}>{f.title}</div>
              <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans}}>{f.sub}</div>
            </div>
            {fmt===f.key&&<div style={{width:8,height:8,borderRadius:"50%",background:f.color}}/>}
          </div>
        ))}
        <div style={{marginTop:6,padding:"10px 12px",background:C.bg,borderRadius:12,fontSize:10,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.6,marginBottom:14}}>
          Exports contain only your data. Nothing from the anonymized cohort is included.
        </div>
        {!done ? (
          <button onClick={go} disabled={!fmt||exporting} style={{width:"100%",padding:14,background:fmt&&!exporting?C.navySoft:"var(--lp-disabled-bg)",border:"none",color:fmt&&!exporting?C.teal:"var(--lp-disabled-text)",borderRadius:14,fontSize:13,fontFamily:FONTS.sans,cursor:fmt&&!exporting?"pointer":"default",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {exporting ? <>
              <div style={{width:14,height:14,border:"2px solid var(--lp-spinner-track)",borderTop:"2px solid var(--lp-spinner-head)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
              Preparing…
            </> : "Export record"}
          </button>
        ) : (
          <div style={{padding:14,background:C.greenSoft,borderRadius:14,border:`1px solid ${C.green}44`,textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:6}}>◉</div>
            <div style={{fontSize:13,color:C.green,fontFamily:FONTS.sans,fontWeight:600,marginBottom:4}}>Export ready</div>
            <div style={{fontSize:11,color:C.textDim,fontFamily:FONTS.sans}}>Your record has been prepared for download.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════
const TABS = [
  {key:"record",  icon:"◉",label:"My Record"},
  {key:"protocol",icon:"◈",label:"Protocol"},
  {key:"body",    icon:"◌",label:"Body"},
  {key:"patterns",icon:"◎",label:"Patterns"},
];

export default function App() {
  const [screen, setScreen] = useState(
    () => (localStorage.getItem(ONBOARDED_STORAGE) === "true" ? "app" : "onboarding")
  );
  const [tab, setTab] = useState("record");
  const [voicePrompt, setVoicePrompt] = useState(null);
  const [overlay, setOverlay] = useState(null); // "share" | "export" | null
  const [elKey, setElKey] = useState(() => localStorage.getItem(ELEVEN_KEY_STORAGE) || "");
  const [anthropicKey, setOpenaiKey] = useState(() => localStorage.getItem(ANTHROPIC_KEY_STORAGE) || "");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [dark, setDark] = useState(false);

  const goVoice = (prompt=null) => { setVoicePrompt(prompt); setScreen("voice"); };
  const backFromVoice = () => { setScreen("app"); setVoicePrompt(null); };
  const finishOnboarding = () => {
    localStorage.setItem(ONBOARDED_STORAGE, "true");
    setScreen("app");
  };

  useEffect(() => {
    localStorage.setItem(ANTHROPIC_KEY_STORAGE, anthropicKey);
  }, [anthropicKey]);

  useEffect(() => {
    localStorage.setItem(ELEVEN_KEY_STORAGE, elKey);
  }, [elKey]);

  return (
    <div
      className=""
      style={{
        backgroundColor:"#E8ECF0",
        backgroundImage:
          "radial-gradient(var(--lp-grain-a) 0.45px, transparent 0.45px), radial-gradient(var(--lp-grain-b) 0.45px, transparent 0.45px)",
        backgroundSize:"3px 3px, 5px 5px",
        backgroundPosition:"0 0, 1px 2px",
        minHeight:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        padding:20,
        fontFamily: FONTS.sans,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=DM+Mono:wght@300;400&display=swap');

        :root {
          --lp-bg:          #F2F4F6;
          --lp-surface:     #FFFFFF;
          --lp-surface-alt: #F7F9FA;
          --lp-border:      rgba(0,0,0,0.07);
          --lp-border-mid:  rgba(0,0,0,0.12);
          --lp-text:        #0F1923;
          --lp-text-muted:  #526070;
          --lp-text-dim:    #96A4B0;
          --lp-ink:         #0F1923;
          --lp-ink-soft:    #E8F0F8;
          --lp-accent:      #1A9E96;
          --lp-accent-mid:  #158C84;
          --lp-accent-soft: #E6F7F6;
          --lp-accent-text: #0D6E68;
          --lp-green:       #1A9E96;
          --lp-green-soft:  #E6F7F6;
          --lp-amber:       #D4840A;
          --lp-amber-soft:  #FEF4E4;
          --lp-steel:       #3A6299;
          --lp-steel-soft:  #EAF0FA;
          --lp-plum:        #8B44AA;
          --lp-plum-soft:   #F5EAFA;
          --lp-terra:       #C44B2A;
          --lp-terra-soft:  #FDEEE9;
          --lp-gold:        #D4840A;
          --lp-gold-soft:   #FEF4E4;
          --lp-rose:        #C43060;
          --lp-rose-soft:   #FDEAF2;
          --lp-danger:      #D03030;
          --lp-danger-bg:   #FEF0F0;
          --lp-overlay:     rgba(15,25,35,0.52);
          --lp-notch:       #D8DDE2;
          --lp-shadow:      0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04);
          --lp-shadow-md:   0 2px 8px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06);
          --lp-shell:       0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08);
        }

        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes lp-breathe{0%,100%{transform:scaleY(0.25);opacity:0.35}50%{transform:scaleY(1);opacity:1}}
        @keyframes lp-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes lp-pulse-ring{0%{transform:scale(0.9);opacity:0.5}100%{transform:scale(1.15);opacity:0}}
        @keyframes lp-record-appear{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}
        @keyframes lp-slide-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

        * { box-sizing: border-box; }
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:var(--lp-border-mid);border-radius:3px}

        body, input, button { font-family: 'DM Sans', 'Helvetica Neue', sans-serif; }

        .lp-tab-btn { color: var(--lp-text-dim); transition: color 0.18s; }
        .lp-tab-btn.active { color: var(--lp-accent); }
        .lp-tab-indicator { height: 2px; background: var(--lp-accent); border-radius: 2px; transition: opacity 0.2s; }

        .lp-record-item { animation: lp-record-appear 0.3s ease forwards; }
        .lp-session-text { animation: lp-fade-in 0.35s ease forwards; }
        .lp-wave-bar { animation: lp-breathe 1.4s ease-in-out infinite; transform-origin: bottom; }
        .lp-slide-up { animation: lp-slide-up 0.4s ease forwards; }

        .lp-btn-primary {
          background: var(--lp-accent);
          color: #fff;
          border: none;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }
        .lp-btn-primary:hover { background: var(--lp-accent-mid); }
        .lp-btn-primary:active { transform: scale(0.97); }

        .lp-btn-ghost {
          background: transparent;
          border: 1.5px solid var(--lp-border-mid);
          color: var(--lp-text-muted);
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .lp-btn-ghost:hover { border-color: var(--lp-accent); color: var(--lp-accent); }

        .lp-card {
          background: var(--lp-surface);
          border-radius: 18px;
          border: 1px solid var(--lp-border);
          box-shadow: var(--lp-shadow);
        }

        .lp-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.01em;
          padding: 3px 10px;
          border-radius: 100px;
        }

        .lp-pill {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 13px;
          border-radius: 100px;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
        }
        .lp-pill:hover { opacity: 0.88; }
      `}</style>
      <div style={{width:390,height:844,background:"var(--lp-bg)",borderRadius:44,border:"1px solid var(--lp-border)",boxShadow:"var(--lp-shell)",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",fontFamily:FONTS.sans}}>

        {/* ElevenLabs key drawer — floats over everything when open */}
        {showKeyInput && (
          <div style={{position:"absolute",inset:0,background:C.overlay,zIndex:100,display:"flex",alignItems:"flex-end",borderRadius:46}}>
            <div style={{width:"100%",background:C.surface,borderRadius:"24px 24px 0 0",padding:"20px 20px 32px"}}>
              <div style={{fontSize:16,fontWeight:500,color:C.navy,fontFamily:FONTS.sans,marginBottom:6,letterSpacing:"-0.01em"}}>API Keys</div><div style={{fontSize:12,color:C.textDim,fontFamily:FONTS.sans,marginBottom:16,lineHeight:1.6}}>Keys stay in your browser only and are never sent to LymePath.</div>
              
              <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans,marginBottom:4,letterSpacing:"0.06em",textTransform:"uppercase"}}>Anthropic (Claude)</div>
              <input value={anthropicKey} onChange={e=>setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                type="password"
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${anthropicKey?C.navy:C.border}`,fontSize:13,fontFamily:FONTS.sans,color:C.text,background:C.bg,boxSizing:"border-box",outline:"none",marginBottom:10}}/>

              <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans,marginBottom:4,letterSpacing:"0.06em",textTransform:"uppercase"}}>ElevenLabs (voice)</div>
              <input value={elKey} onChange={e=>setElKey(e.target.value)}
                placeholder="sk_..."
                type="password"
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${elKey?C.teal:C.border}`,fontSize:13,fontFamily:FONTS.sans,color:C.text,background:C.bg,boxSizing:"border-box",outline:"none",marginBottom:4}}/>
              <div style={{fontSize:10,color:C.textDim,fontFamily:FONTS.sans,lineHeight:1.5,marginBottom:14}}>
                Keys stay in your browser only. Get ElevenLabs key at elevenlabs.io/app/settings/api-keys
              </div>

              <button onClick={()=>setShowKeyInput(false)} style={{width:"100%",padding:12,background:anthropicKey?C.navySoft:"var(--lp-disabled-bg)",border:"none",color:anthropicKey?C.teal:"var(--lp-disabled-text)",borderRadius:12,fontSize:13,fontFamily:FONTS.sans,cursor:"pointer",fontWeight:500}}>
                {anthropicKey?"Save & close":"Close"}
              </button>
            </div>
          </div>
        )}

        {/* Notch */}
        <div style={{width:120,height:32,background:"var(--lp-notch)",borderRadius:"0 0 18px 18px",margin:"0 auto",flexShrink:0}}/>

        {/* ONBOARDING */}
        {screen==="onboarding" && <>
          <div style={{padding:"10px 22px",borderBottom:`1px solid ${C.border}`,background:C.surface,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Logo size={20}/>
            <span style={{fontSize:17,fontWeight:700,color:C.navy,letterSpacing:"-0.02em",fontFamily:FONTS.sans}}>LymePath</span>
          </div>
          <Onboarding onComplete={finishOnboarding}/>
          <div style={{height:28,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:C.surface,borderTop:`1px solid ${C.border}`}}>
            <div style={{width:120,height:4,background:C.borderMid,borderRadius:2,opacity:0.5}}/>
          </div>
        </>}

        {/* VOICE */}
        {screen==="voice" && <VoiceSession onBack={backFromVoice} initialPrompt={voicePrompt} elKey={elKey} anthropicKey={anthropicKey} onConfigKey={()=>setShowKeyInput(true)}/> }

        {/* MAIN APP */}
        {screen==="app" && <>
          {overlay==="share" && <PractitionerShare onClose={()=>setOverlay(null)}/>}
          {overlay==="export" && <Export onClose={()=>setOverlay(null)}/>}

          {/* Header */}
          <div style={{padding:"10px 18px",borderBottom:`1px solid ${C.border}`,background:C.surface,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Logo size={22}/>
              <span style={{fontSize:17,fontWeight:700,color:C.navy,letterSpacing:"-0.02em",fontFamily:FONTS.sans}}>LymePath</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <button onClick={()=>setOverlay("export")} className="lp-btn-ghost" style={{padding:"4px 10px"}}>Export</button>
              <button onClick={()=>setOverlay("share")} className="lp-btn-ghost" style={{padding:"4px 10px",color:C.steel,borderColor:C.steelSoft}}>Share</button>
              <button onClick={()=>setShowKeyInput(true)} className="lp-btn-ghost" style={{padding:"4px 10px",color:anthropicKey?C.green:C.textDim,borderColor:anthropicKey?C.greenSoft:C.border}}>{anthropicKey?"● Keys":"○ Keys"}</button>
              <button onClick={()=>goVoice(null)} className="lp-btn-primary" style={{padding:"6px 14px"}}>Session</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",background:C.surface,borderBottom:`1px solid ${C.border}`,flexShrink:0,padding:"0 4px"}}>
            {TABS.map(t=>(
              <button
                key={t.key}
                className={`lp-tab-btn ${tab===t.key ? "active" : ""}`}
                onClick={()=>setTab(t.key)}
                style={{
                  flex:1,padding:"10px 4px 8px",fontSize:11,fontFamily:FONTS.sans,
                  fontWeight:tab===t.key?"600":"400",letterSpacing:"0.01em",
                  background:"none",border:"none",cursor:"pointer",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative"
                }}>
                <span style={{fontSize:11,opacity:tab===t.key?1:0.5,transition:"opacity 0.2s"}}>{t.icon}</span>
                <span style={{fontSize:10}}>{t.label}</span>
                <div className="lp-tab-indicator" style={{position:"absolute",bottom:0,left:"15%",right:"15%",opacity:tab===t.key?1:0}}/>
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {tab==="record"   && <MyRecord   onVoice={goVoice}/>}
            {tab==="protocol" && <Protocol   onVoice={goVoice}/>}
            {tab==="body"     && <Body/>}
            {tab==="patterns" && <Patterns/>}
          </div>

          {/* Home bar */}
          <div style={{height:28,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:C.surface,borderTop:`1px solid ${C.border}`}}>
            <div style={{width:120,height:4,background:C.borderMid,borderRadius:2,opacity:0.5}}/>
          </div>
        </>}

      </div>
    </div>
  );
}
