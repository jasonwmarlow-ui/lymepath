import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const C = {
  bg:"#f2f3f7", surface:"#ffffff", border:"#e4e6ed", borderMid:"#cdd0db",
  text:"#111827", textMuted:"#4a5568", textDim:"#9aa3b2",
  navy:"#1e2d5a", navySoft:"#eceef6",
  teal:"#4ab8c4", tealSoft:"#e6f6f8",
  steel:"#5a8fa0", steelSoft:"#eaf2f5",
  green:"#2a8a6a", greenSoft:"#e6f5f0",
  amber:"#b05a2a", amberSoft:"#fdf0e8",
  plum:"#7a4a8a", plumSoft:"#f3eef8",
  terracotta:"#c4704a", terraSoft:"#fdf0e8",
  gold:"#c8a84a", goldSoft:"#fdf8e8",
  rose:"#c45a6a", roseSoft:"#faeef0",
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
  fatigue:{color:"#1e2d5a",label:"Fatigue"},
  cognition:{color:"#b05a2a",label:"Cognition"},
  pain:{color:"#7a4a8a",label:"Pain"},
  mood:{color:"#2a8a6a",label:"Mood"},
  sleep:{color:"#4ab8c4",label:"Sleep"},
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
  symptom:{color:"#1e2d5a",bg:"#eceef6"},
  pattern:{color:"#b05a2a",bg:"#fdf0e8"},
  signal:{color:"#2a8a6a",bg:"#e6f5f0"},
  context:{color:"#7a4a8a",bg:"#f3eef8"},
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
const RCOL = {Fatigue:"#1e2d5a",Cognition:"#b05a2a",Pain:"#7a4a8a",Sleep:"#4ab8c4",Mood:"#2a8a6a"};

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
  context:{bg:"#e6f5f0",text:"#2a8a6a",dot:"#2a8a6a"},
  pattern:{bg:"#fdf0e8",text:"#b05a2a",dot:"#b05a2a"},
  symptom:{bg:"#e6f6f8",text:"#4ab8c4",dot:"#4ab8c4"},
  timeline:{bg:"#eceef6",text:"#1e2d5a",dot:"#1e2d5a"},
};

const OB_STEPS = ["path","orientation","coinfections","environment","wearables","ready"];

// ── Atoms ─────────────────────────────────────────────────────────────────────
function Card({children,style={}}) {
  return (
    <div style={{background:C.surface,borderRadius:16,padding:18,
      boxShadow:"0 2px 16px rgba(0,0,0,0.055)",border:`1px solid ${C.border}`,...style}}>
      {children}
    </div>
  );
}
function Label({children,sub}) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:"'Helvetica Neue',sans-serif",letterSpacing:"-0.01em"}}>{children}</div>
      {sub && <div style={{fontSize:11,color:C.textDim,marginTop:2,fontFamily:"sans-serif"}}>{sub}</div>}
    </div>
  );
}
function VBtn({onClick,label="Ask aloud"}) {
  return (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:5,
      background:C.tealSoft,border:`1px solid ${C.teal}55`,color:C.teal,
      borderRadius:20,padding:"6px 12px",fontSize:11,fontFamily:"sans-serif",
      cursor:"pointer",fontWeight:500,whiteSpace:"nowrap",flexShrink:0}}>
      <span style={{fontSize:13}}>◎</span>{label}
    </button>
  );
}
function EvidenceBadge({label,color,bg}) {
  return (
    <span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:bg,color,
      fontFamily:"sans-serif",letterSpacing:"0.07em",textTransform:"uppercase",fontWeight:600}}>
      {label}
    </span>
  );
}
function Tip({active,payload,label}) {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,padding:"9px 13px",
      borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,0.10)",fontSize:11,fontFamily:"sans-serif"}}>
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
          <stop offset="0%" stopColor={v.color} stopOpacity={0.18}/>
          <stop offset="100%" stopColor={v.color} stopOpacity={0}/>
        </linearGradient>
      ))}
      <linearGradient id="g_hrv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.teal} stopOpacity={0.2}/><stop offset="100%" stopColor={C.teal} stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="g_sleep_h" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.green} stopOpacity={0.2}/><stop offset="100%" stopColor={C.green} stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="g_steps" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.navy} stopOpacity={0.18}/><stop offset="100%" stopColor={C.navy} stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="g_rhr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.rose} stopOpacity={0.2}/><stop offset="100%" stopColor={C.rose} stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="g_temp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.amber} stopOpacity={0.2}/><stop offset="100%" stopColor={C.amber} stopOpacity={0}/>
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
      style={{width:"100%",padding:14,background:disabled?"#d0d3dc":C.navy,
        border:"none",color:"white",borderRadius:14,fontSize:13,
        fontFamily:"sans-serif",cursor:disabled?"default":"pointer",fontWeight:500,marginTop:12}}>
      {label}
    </button>
  );

  if (name==="path") return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <Dots/>
      <div style={{...wrap,paddingTop:24}}>
        <div style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.textDim,
          fontFamily:"sans-serif",marginBottom:10,textAlign:"center"}}>Welcome</div>
        <div style={{fontSize:19,fontWeight:300,color:C.navy,textAlign:"center",lineHeight:1.4,
          marginBottom:8,fontFamily:"'Helvetica Neue',sans-serif"}}>
          Before Lyme had a name,<br/>it had witnesses.
        </div>
        <div style={{fontSize:12,color:C.textMuted,textAlign:"center",lineHeight:1.7,
          marginBottom:28,fontFamily:"Georgia,serif",fontStyle:"italic"}}>
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
              <div style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:"'Helvetica Neue',sans-serif",marginBottom:2}}>{p.title}</div>
              <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif"}}>{p.sub}</div>
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
          <div style={{fontSize:15,fontWeight:500,color:C.navy,fontFamily:"'Helvetica Neue',sans-serif",marginBottom:10,lineHeight:1.4}}>
            What LymePath is — and isn't
          </div>
          {[
            {title:"We listen. We don't diagnose.",body:"LymePath is not a medical tool. It is a place to speak your experience into a record that grows over time.",color:C.navy},
            {title:"Your protocol is yours.",body:"Whatever you're trying — pharmaceutical, herbal, experimental — we observe it without judgment. Desperation is treated as information, not irrationality.",color:C.teal},
            {title:"Your data is yours.",body:"Nothing is shared without your explicit consent. You choose what practitioners can see.",color:C.green},
            {title:"The stories are consistent.",body:"Across thousands of people with Lyme, the same arcs appear. When they repeat at scale, they become signal.",color:C.gold},
          ].map((s,i)=>(
            <div key={i} style={{padding:"11px 13px",marginBottom:8,background:C.bg,borderRadius:12,borderLeft:`3px solid ${s.color}`}}>
              <div style={{fontSize:12,fontWeight:600,color:s.color,fontFamily:"sans-serif",marginBottom:3}}>{s.title}</div>
              <div style={{fontSize:11,color:C.textMuted,fontFamily:"sans-serif",lineHeight:1.6}}>{s.body}</div>
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
          <div style={{fontSize:15,fontWeight:500,color:C.navy,fontFamily:"'Helvetica Neue',sans-serif",marginBottom:4}}>Co-infections</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.6,marginBottom:14}}>
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
                  <span style={{fontSize:13,fontWeight:500,color:C.text,fontFamily:"sans-serif"}}>{ci.label}</span>
                  <div style={{display:"flex",gap:5}}>
                    {["untested","negative","positive"].map(v=>(
                      <button key={v} onClick={()=>setCoInf(p=>({...p,[ci.key]:{tested:v!=="untested",positive:v==="positive"}}))}
                        style={{padding:"3px 8px",borderRadius:10,fontSize:10,fontFamily:"sans-serif",cursor:"pointer",
                          border:`1px solid ${status===v?ci.color:C.border}`,
                          background:status===v?(v==="positive"?ci.color+"22":C.steelSoft):C.surface,
                          color:status===v?(v==="positive"?ci.color:C.steel):C.textDim}}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif",marginTop:8,lineHeight:1.6,fontStyle:"italic"}}>
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
          <div style={{fontSize:15,fontWeight:500,color:C.navy,fontFamily:"'Helvetica Neue',sans-serif",marginBottom:4}}>Your environment</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.6,marginBottom:14}}>
            Where you live is part of your illness picture. Climate, altitude, mold, and smoke all affect how symptoms present and shift.
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>Location</div>
            <input value={env.location} onChange={e=>setEnv(p=>({...p,location:e.target.value}))}
              placeholder="City, state or region"
              style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${C.border}`,
                fontSize:13,fontFamily:"sans-serif",color:C.text,background:C.bg,boxSizing:"border-box",outline:"none"}}/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Climate type</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {["Humid","Dry","Coastal","High altitude","Variable","Unknown"].map(cl=>(
                <button key={cl} onClick={()=>setEnv(p=>({...p,climate:cl}))}
                  style={{padding:"5px 12px",borderRadius:16,fontSize:11,fontFamily:"sans-serif",cursor:"pointer",
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
                <div style={{fontSize:12,color:env[ex.key]?C.amber:C.text,fontFamily:"sans-serif",fontWeight:500}}>{ex.label}</div>
                <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif"}}>{ex.sub}</div>
              </div>
              <div style={{width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                background:env[ex.key]?C.amber:C.bg,border:`1.5px solid ${env[ex.key]?C.amber:C.borderMid}`}}>
                {env[ex.key]&&<span style={{fontSize:11,color:"white",lineHeight:1}}>✓</span>}
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
          <div style={{fontSize:15,fontWeight:500,color:C.navy,fontFamily:"'Helvetica Neue',sans-serif",marginBottom:4}}>Wearable data</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.6,marginBottom:14}}>
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
                <div style={{fontSize:13,fontWeight:500,color:C.text,fontFamily:"sans-serif",marginBottom:2}}>{w.label}</div>
                <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif"}}>{w.metrics}</div>
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
        <div style={{fontSize:18,fontWeight:300,color:C.navy,lineHeight:1.4,marginBottom:8,fontFamily:"'Helvetica Neue',sans-serif"}}>
          Your record begins now.
        </div>
        <div style={{fontSize:12,color:C.textMuted,lineHeight:1.7,marginBottom:28,fontFamily:"Georgia,serif",fontStyle:"italic"}}>
          Speak plainly. There is no wrong way to begin.<br/>What you share will take shape over time.
        </div>
        <button onClick={onComplete}
          style={{width:"100%",padding:14,background:C.navy,border:"none",color:"white",
            borderRadius:14,fontSize:13,fontFamily:"sans-serif",cursor:"pointer",fontWeight:500}}>
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
const EL_VOICE_ID = "UgBBYS2sOqTuMpoF3BR0";

const SYSTEM_PROMPT = `You are LymePath — a voice companion for people living with Lyme disease. You sound like a health coach they genuinely trust: warm, unhurried, casually informed. Not a doctor. Not a therapist. Someone who’s done the reading, cares deeply, and knows how to listen without rushing to fix things.

VOICE & TONE
- Warm and conversational. Casual but not flippant. Like talking to someone who gets it.
- Medium pace. Never rushed. Never clinical.
- Use plain language. If you use a medical term, explain it briefly in the same breath.
- Never relentlessly positive. If something is hard, let it be hard.
- Never give unsolicited medical opinions. You share what’s known, flag what isn’t, and leave decisions to them.

WHO YOU’RE TALKING TO
- Read the room. Some people are newly diagnosed and scared. Some are chronic, exhausted, and have been dismissed for years. Some are actively improving and cautiously hopeful.
- Adapt your tone to what you’re hearing. Don’t assume. Listen first.
- Treat desperation as information, not irrationality. If someone has tried something unusual, that’s worth understanding, not judging.

HOW YOU LISTEN
- Ask one question at a time. Always.
- Default to open-ended questions: "How has that been for you?" "What does that feel like day to day?" "What’s shifted, if anything?"
- If something specific comes up — a symptom, a treatment, a pattern, a moment — follow it. Ask a more direct question. "You mentioned sugar — that’s actually something worth unpacking a bit. Want to talk about it?"
- When someone says "I don’t know" or "fine" or gives a very short answer, don’t drop it. Ask a softer version: "What would you say if you had to guess?" or "Fine like okay, or fine like getting by?"
- When someone shares something painful — grief, anger, hopelessness — acknowledge it fully before asking anything. Don’t pivot. Don’t fix. Just be with it for a moment.

WHAT YOU KNOW
- You’re informed about Lyme disease, co-infections, common treatments (pharmaceutical and herbal), the controversy between IDSA and ILADS, the reality of chronic symptoms, and the emotional toll of being dismissed by the medical system.
- When you know something, share it conversationally. "Bacteria actually does love sugar — it’s one of those things both clinical and non-clinical people tend to agree on."
- When you don’t know something or the evidence is unclear, say so honestly. "Honestly, the research on that is pretty thin right now — here’s what we do know..."
- Never overclaim. Never diagnose. Never prescribe.

PACING & MEMORY
- This is a voice conversation. Keep responses to 2-4 sentences maximum.
- Remember everything said in this session. Reference it naturally when relevant. "Earlier you mentioned the fatigue was worst in the mornings — is that still true?"
- Don’t summarize everything back. Just hold it and use it when it matters.

RECORD EXTRACTION
At the end of every response, output a JSON block on its own line in this exact format:
EXTRACT:{"items":[{"text":"brief description","type":"symptom|pattern|context|timeline"}]}
Only extract genuinely new, specific information mentioned in this turn.
If nothing new to extract: EXTRACT:{"items":[]}
Types: symptom (physical or cognitive), pattern (recurring behavior or trigger), context (life circumstances, environment, emotional state), timeline (dates, durations, sequences of events).`;


function VoiceSession({onBack,initialPrompt,elKey,onConfigKey,anthropicKey}) {
  const [orb, setOrb_] = useState("idle");
  const orbR = useRef("idle");
  const setOrb = v => { orbR.current = v; setOrb_(v); };
  const [aiText, setAiText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [items, setItems] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(null);

  const mountedR = useRef(true);
  const timerR = useRef(null);
  const recognitionR = useRef(null);
  const historyR = useRef([]);
  const transcriptR = useRef("");

  // Audio (Web Audio API + MediaSource streaming)
  const audioCtxR = useRef(null);
  const currentAudioR = useRef(null); // { element, msURL }
  const audioOnDoneR = useRef(null);

  // VAD
  const micStreamR = useRef(null);
  const analyserR = useRef(null);
  const vadRafR = useRef(null);
  const silenceTimerR = useRef(null);
  const speechDetectedR = useRef(false);
  const aboveThresholdFramesR = useRef(0); // consecutive frames above speech threshold
  const interruptLockoutR = useRef(0);     // timestamp: no interruption before this

  useEffect(()=>{
    mountedR.current = true;
    return ()=>{
      mountedR.current = false;
      clearInterval(timerR.current);
      if (recognitionR.current) try { recognitionR.current.abort(); } catch(e) {}
      if (currentAudioR.current) {
        try { currentAudioR.current.element.pause(); } catch(e) {}
        if (currentAudioR.current.msURL) URL.revokeObjectURL(currentAudioR.current.msURL);
      }
      if (vadRafR.current) cancelAnimationFrame(vadRafR.current);
      clearTimeout(silenceTimerR.current);
      if (micStreamR.current) micStreamR.current.getTracks().forEach(t => t.stop());
      if (audioCtxR.current) audioCtxR.current.close().catch(()=>{});
    };
  },[]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // ── Extract record items from Claude response ───
  const extractItems = (text) => {
    try {
      const match = text.match(/EXTRACT:(\{"items":\[.*?\]\})/);
      if (!match) return [];
      return JSON.parse(match[1]).items || [];
    } catch(e) { return []; }
  };

  // ── Stop current audio playback ──────────────────
  const stopAudio = () => {
    window.speechSynthesis.cancel();
    if (currentAudioR.current) {
      const {element, msURL} = currentAudioR.current;
      try { element.pause(); } catch(e) {}
      if (msURL) URL.revokeObjectURL(msURL);
      currentAudioR.current = null;
    }
    audioOnDoneR.current = null;
  };

  // ── ElevenLabs streaming TTS via Web Audio API ───
  const speak = async (text, onDone) => {
    if (!mountedR.current) return;
    const clean = text.replace(/EXTRACT:\{.*?\}/g,"").trim();
    setOrb("ai-speaking");
    setAiText(clean);
    audioOnDoneR.current = onDone;

    if (!elKey) {
      const utt = new SpeechSynthesisUtterance(clean);
      utt.rate = 0.9; utt.pitch = 1.0;
      utt.onend = ()=>{ if(mountedR.current && onDone) onDone(); };
      window.speechSynthesis.speak(utt);
      interruptLockoutR.current = Date.now() + 2000;
      return;
    }

    try {
      if (!audioCtxR.current) audioCtxR.current = new AudioContext();
      const audioCtx = audioCtxR.current;
      if (audioCtx.state === "suspended") await audioCtx.resume();

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

      // Create MediaSource so playback starts as first bytes arrive
      const ms = new MediaSource();
      const msURL = URL.createObjectURL(ms);
      const audio = new Audio();
      audio.src = msURL;

      // Route through Web Audio API for monitoring / interruption
      const elemSrc = audioCtx.createMediaElementSource(audio);
      elemSrc.connect(audioCtx.destination);

      const entry = {element: audio, msURL};
      currentAudioR.current = entry;

      // Open SourceBuffer and pump stream chunks in as they arrive
      await new Promise((resolve, reject) => {
        ms.addEventListener("sourceopen", async () => {
          try {
            const sb = ms.addSourceBuffer("audio/mpeg");
            const reader = res.body.getReader();
            const pump = async () => {
              if (!mountedR.current || currentAudioR.current !== entry) { reader.cancel(); return; }
              const {done, value} = await reader.read();
              if (done) { if (ms.readyState === "open") ms.endOfStream(); return; }
              if (sb.updating) await new Promise(r => sb.addEventListener("updateend", r, {once:true}));
              sb.appendBuffer(value);
              sb.addEventListener("updateend", pump, {once:true});
            };
            pump();
            resolve();
          } catch(e) { reject(e); }
        }, {once:true});
      });

      audio.play();
      interruptLockoutR.current = Date.now() + 2000;
      audio.onended = () => {
        if (currentAudioR.current === entry) {
          URL.revokeObjectURL(msURL);
          currentAudioR.current = null;
          if (mountedR.current) {
            const done = audioOnDoneR.current;
            audioOnDoneR.current = null;
            if (done) done();
          }
        }
      };
    } catch(e) {
      setError(`ElevenLabs: ${e.message}`);
      const done = audioOnDoneR.current;
      audioOnDoneR.current = null;
      if (done) done();
    }
  };

  // ── Claude API ──────────────────────────────────
  const askClaude = async (userMsg) => {
    if (!mountedR.current) return;
    setOrb("processing");

    historyR.current = [...historyR.current, {role: "user", content: userMsg}];

    try {
      const res = await fetch("/anthropic/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: historyR.current
        })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(`Claude API ${res.status}: ${errBody.error?.message || JSON.stringify(errBody)}`);
      }
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm here. Tell me more.";

      historyR.current = [...historyR.current, {role: "assistant", content: reply}];

      const extracted = extractItems(reply);
      if (extracted.length > 0) {
        setItems(prev => { setNewCount(extracted.length); return [...prev, ...extracted]; });
      }

      speak(reply, () => { if (mountedR.current) startListening(); });

    } catch(e) {
      setError(`Claude: ${e.message}`);
      setOrb("idle");
    }
  };

  // ── VAD — runs for the whole session ─────────────
  // Detects speech/silence to auto-trigger and interrupt
  const startVAD = () => {
    if (!analyserR.current) return;
    const analyser = analyserR.current;
    const data = new Uint8Array(analyser.frequencyBinCount);

    // Hysteresis: energy must rise above SPEECH to start counting as speech,
    // and fall below SILENCE to count as silence. The gap between them prevents
    // chattering when levels hover near the boundary.
    const SPEECH_THRESHOLD  = 30; // avg energy (0-255) to register as speech
    const SILENCE_THRESHOLD = 20; // avg energy below which we call it silence
    // Require ~130 ms of sustained energy before an interruption fires
    // (~8 frames at 60 fps). Prevents brief noise spikes from interrupting.
    const INTERRUPT_MIN_FRAMES = 8;

    const tick = () => {
      if (!mountedR.current) return;
      vadRafR.current = requestAnimationFrame(tick);
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;

      if (avg > SPEECH_THRESHOLD) {
        aboveThresholdFramesR.current++;

        // Interrupt AI: only after sustained speech AND past the 2 s lockout
        if (
          orbR.current === "ai-speaking" &&
          aboveThresholdFramesR.current >= INTERRUPT_MIN_FRAMES &&
          Date.now() > interruptLockoutR.current
        ) {
          stopAudio();
          if (recognitionR.current) { try { recognitionR.current.abort(); } catch(e) {} recognitionR.current = null; }
          aboveThresholdFramesR.current = 0;
          speechDetectedR.current = false;
          clearTimeout(silenceTimerR.current); silenceTimerR.current = null;
          transcriptR.current = ""; setTranscript("");
          setOrb("listening");
          _startRecognition();
          return;
        }

        // User speaking while listening: cancel silence countdown
        if (orbR.current === "listening") {
          speechDetectedR.current = true;
          clearTimeout(silenceTimerR.current); silenceTimerR.current = null;
        }

      } else if (avg < SILENCE_THRESHOLD) {
        aboveThresholdFramesR.current = 0;

        // Silence after confirmed speech: start 1.5 s countdown
        if (orbR.current === "listening" && speechDetectedR.current && !silenceTimerR.current) {
          silenceTimerR.current = setTimeout(() => {
            silenceTimerR.current = null;
            if (mountedR.current && orbR.current === "listening") triggerResponse();
          }, 1500);
        }
      }
      // Energy between thresholds: hysteresis zone — change nothing
    };

    vadRafR.current = requestAnimationFrame(tick);
  };

  // ── Web Speech STT ──────────────────────────────
  const _startRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("Speech recognition requires Chrome."); return; }
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
      const t = (final||interim).trim();
      transcriptR.current = t;
      if (mountedR.current) setTranscript(t);
    };
    rec.onerror = (e) => {
      if (e.error!=="no-speech" && mountedR.current) setError(`Mic: ${e.error}`);
    };
    rec.start();
  };

  const startListening = () => {
    if (!mountedR.current) return;
    setOrb("listening");
    setTranscript(""); transcriptR.current = "";
    speechDetectedR.current = false;
    aboveThresholdFramesR.current = 0;
    clearTimeout(silenceTimerR.current); silenceTimerR.current = null;
    _startRecognition();
    // VAD is already running session-wide; just reset state above
  };

  // Triggered automatically by VAD after 1.5 s silence, or manually by button
  const triggerResponse = () => {
    clearTimeout(silenceTimerR.current); silenceTimerR.current = null;
    if (recognitionR.current) { try { recognitionR.current.stop(); } catch(e) {} recognitionR.current = null; }
    const said = transcriptR.current.trim();
    setTranscript(""); transcriptR.current = "";
    speechDetectedR.current = false;
    aboveThresholdFramesR.current = 0;
    if (!said) { startListening(); return; }
    askClaude(said);
  };

  const stopListening = () => triggerResponse();

  // ── Begin session ───────────────────────────────
  const begin = async () => {
    setStarted(true);
    timerR.current = setInterval(()=>{ if(mountedR.current) setElapsed(t=>t+1); },1000);
    const opening = `Hey, have a specific place you want to start, or would you like me to ask you a question to get things going?\n\nEXTRACT:{"items":[]}`;

    historyR.current = [];

    // Init AudioContext and mic stream for VAD (runs for the whole session)
    try {
      if (!audioCtxR.current) audioCtxR.current = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {echoCancellation:true, noiseSuppression:true},
        video: false
      });
      micStreamR.current = stream;
      const src = audioCtxR.current.createMediaStreamSource(stream);
      const analyser = audioCtxR.current.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      src.connect(analyser); // NOT connected to destination — no mic feedback
      analyserR.current = analyser;
      startVAD();
    } catch(e) {
      setError("Microphone access is required for voice detection.");
    }

    speak(opening, ()=>{ if(mountedR.current) startListening(); });
  };


  const isL = orb==="listening", isA = orb==="ai-speaking", isP = orb==="processing";

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:C.bg}}>
      {/* Header */}
      <div style={{padding:"8px 20px",background:C.surface,borderBottom:`1px solid ${C.border}`,
        display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:12,color:C.textDim,fontFamily:"sans-serif",cursor:"pointer"}}>← Back</button>
        <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif"}}>{started?fmt(elapsed):"Session"}</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={onConfigKey} style={{background:"none",border:"none",cursor:"pointer",
            fontSize:9,color:elKey?C.green:C.textDim,fontFamily:"sans-serif",letterSpacing:"0.06em"}}>
            {elKey?"● EL":"○ Voice"}
          </button>
          <div style={{fontSize:11,fontFamily:"sans-serif",fontWeight:500,
            color:isL?C.green:isA?C.teal:isP?C.amber:C.textDim}}>
            {isA?"Speaking":isL?"Listening":isP?"Thinking":"—"}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{padding:"8px 16px",background:"#fef2f2",borderBottom:`1px solid #fecaca`,
          fontSize:11,color:"#dc2626",fontFamily:"sans-serif",display:"flex",justifyContent:"space-between"}}>
          <span>{error}</span>
          <button onClick={()=>setError(null)} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:13}}>×</button>
        </div>
      )}

      {/* ElevenLabs indicator */}
      {started && (
        <div style={{padding:"4px 16px",background:C.bg,borderBottom:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:elKey?C.green:C.amber}}/>
          <span style={{fontSize:9,color:C.textDim,fontFamily:"sans-serif",letterSpacing:"0.06em"}}>
            {elKey?"ElevenLabs · Rachel":"Browser TTS — add ElevenLabs key for better voice"}
          </span>
        </div>
      )}

      {!started ? (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px"}}>
          <div style={{fontSize:20,color:C.navy,fontWeight:300,textAlign:"center",lineHeight:1.4,marginBottom:12,fontFamily:"'Helvetica Neue',sans-serif"}}>
            A place to speak plainly
          </div>
          <div style={{fontSize:13,color:C.textMuted,textAlign:"center",lineHeight:1.7,marginBottom:36,fontFamily:"sans-serif"}}>
            Your voice, your experience, your record.<br/>
            <span style={{fontSize:11,color:C.textDim}}>Use Chrome for voice input.</span>
          </div>
          <div style={{position:"relative",width:90,height:90,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:36}}>
            {[90,68].map((sz,i)=>(
              <div key={i} style={{position:"absolute",width:sz,height:sz,borderRadius:"50%",border:`1px solid ${C.borderMid}`,opacity:0.2+i*0.05}}/>
            ))}
            <div style={{width:52,height:52,borderRadius:"50%",background:C.navySoft,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:C.textDim}}>○</div>
          </div>
          <button onClick={begin} style={{background:C.navySoft,border:`1px solid ${C.navy}44`,color:C.navy,padding:"14px 36px",borderRadius:28,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",fontWeight:500}}>
            Begin session
          </button>
        </div>
      ) : (
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* AI response text */}
          <div style={{padding:"18px 24px 12px",flexShrink:0}}>
            <div style={{fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:C.textDim,fontFamily:"sans-serif",marginBottom:8}}>LymePath</div>
            <div style={{fontSize:14,lineHeight:1.8,color:C.text,minHeight:72,fontFamily:"Georgia,serif"}}>
              {aiText.split("\n").map((l,i,arr)=>(
                <span key={i}>{l}{i<arr.length-1&&<><br/><br/></>}</span>
              ))}
              {isA&&<span style={{color:C.teal,animation:"blink 0.8s infinite"}}> |</span>}
            </div>
          </div>

          {/* Orb */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 0 10px",gap:10,flexShrink:0}}>
            <div style={{position:"relative",width:80,height:80,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {[80,60].map((sz,i)=>(
                <div key={i} style={{position:"absolute",width:sz,height:sz,borderRadius:"50%",
                  border:`1px solid ${isL?C.teal:isA?C.navy:C.borderMid}`,
                  opacity:(isL||isA)?0.4-i*0.12:0.1,
                  animation:isL?`pulse ${1.2+i*0.4}s ease-in-out infinite`:"none"}}/>
              ))}
              <div style={{width:48,height:48,borderRadius:"50%",
                background:isL?`radial-gradient(circle,${C.tealSoft},${C.bg})`:isA?`radial-gradient(circle,${C.navySoft},${C.bg})`:C.bg,
                border:`1px solid ${isL?C.teal:isA?C.navy:C.border}`,
                display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.4s"}}>
                {isP
                  ? <div style={{width:16,height:16,border:`2px solid ${C.borderMid}`,borderTop:`2px solid ${C.navy}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                  : <span style={{fontSize:16,opacity:isL||isA?1:0.3,color:isL?C.teal:C.navy}}>{isL?"◉":isA?"◈":"○"}</span>
                }
              </div>
            </div>

            {/* Live transcript */}
            {isL && (
              <div style={{fontSize:12,color:C.textMuted,fontStyle:"italic",textAlign:"center",
                maxWidth:240,lineHeight:1.6,minHeight:30,fontFamily:"Georgia,serif",padding:"0 20px"}}>
                {transcript || <span style={{color:C.textDim}}>Listening…</span>}
              </div>
            )}

            {/* Done button */}
            {isL && (
              <button onClick={stopListening}
                style={{background:C.tealSoft,border:`1px solid ${C.teal}`,color:C.teal,
                  padding:"8px 24px",borderRadius:22,fontSize:13,cursor:"pointer",fontFamily:"sans-serif"}}>
                Done speaking
              </button>
            )}
          </div>

          {/* Record panel */}
          <div style={{flex:1,overflow:"hidden",borderTop:`1px solid ${C.border}`,background:C.surface,display:"flex",flexDirection:"column"}}>
            <div style={{padding:"7px 16px 4px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <div style={{fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textDim,fontFamily:"sans-serif"}}>Building your record</div>
              <div style={{display:"flex",gap:4}}>
                {Object.entries(TAG_C).map(([type,s])=>(
                  <span key={type} style={{fontSize:8,padding:"1px 6px",background:s.bg,color:s.text,borderRadius:8,fontFamily:"sans-serif"}}>{type}</span>
                ))}
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"4px 10px 14px"}}>
              {items.length===0
                ? <div style={{padding:14,fontSize:12,color:C.textDim,fontStyle:"italic",lineHeight:1.7,textAlign:"center",fontFamily:"sans-serif"}}>As you speak, what matters will take shape here.</div>
                : items.map((item,i)=>{
                    const s = TAG_C[item.type]||TAG_C.symptom;
                    const isNew = i>=items.length-newCount;
                    return (
                      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 10px",
                        background:isNew?s.bg:"transparent",
                        borderLeft:`2px solid ${isNew?s.dot:C.border}`,
                        borderRadius:"0 6px 6px 0",marginBottom:2}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:s.dot,marginTop:5,flexShrink:0}}/>
                        <div style={{fontSize:11,color:s.text,lineHeight:1.5,fontFamily:"sans-serif"}}>{item.text}</div>
                      </div>
                    );
                  })
              }
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
            <span key={ci.key} style={{fontSize:9,padding:"3px 8px",borderRadius:10,fontFamily:"sans-serif",
              background:ci.positive?ci.color+"22":ci.tested?C.steelSoft:C.bg,
              color:ci.positive?ci.color:ci.tested?C.steel:C.textDim,
              border:`1px solid ${ci.positive?ci.color+"44":C.border}`}}>
              {ci.label}{ci.positive?" +":ci.tested?" −":" ?"}
            </span>
          ))}
        </div>
        {coOpen && (
          <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.65,
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
              <div style={{fontSize:9,color:C.textDim,fontFamily:"sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>{s.label}</div>
              <div style={{fontSize:13,fontWeight:600,color:s.color,fontFamily:"sans-serif"}}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.6,padding:"8px 10px",background:C.amberSoft,borderRadius:10,borderLeft:`3px solid ${C.amber}`}}>
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
                background:on?C.surface:C.bg,cursor:"pointer",fontFamily:"sans-serif",
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
            <XAxis dataKey="w" tick={{fill:C.textDim,fontSize:9,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
            <YAxis domain={[0,10]} tick={{fill:C.textDim,fontSize:9,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
            <Tooltip content={<Tip/>}/>
            {TIMELINE.filter(e=>e.type==="treatment"||e.type==="flare").map(e=>(
              <ReferenceLine key={e.w+e.label} x={e.w} stroke={e.color} strokeDasharray="3 3" strokeOpacity={0.4} strokeWidth={1.5}/>
            ))}
            {Object.entries(SYMS).map(([k,v])=>active.includes(k)&&(
              <Area key={k} type="monotone" dataKey={k} name={v.label} stroke={v.color} strokeWidth={2} fill={`url(#g_${k})`} dot={false} activeDot={{r:4,fill:v.color,stroke:"white",strokeWidth:2}}/>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Timeline */}
      <Card style={{marginBottom:14}}>
        <Label sub="12 weeks">Timeline</Label>
        <div style={{position:"relative",paddingLeft:18}}>
          <div style={{position:"absolute",left:5,top:8,bottom:8,width:1.5,background:`linear-gradient(to bottom,${C.navy},${C.gold})`,opacity:0.25}}/>
          {TIMELINE.map((e,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:i<TIMELINE.length-1?12:0}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:e.color,flexShrink:0,marginTop:3,
                boxShadow:`0 0 0 2px ${C.surface},0 0 0 3.5px ${e.color}44`,
                position:"relative",left:-13,marginRight:-13}}/>
              <div style={{flex:1}}>
                <span style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif"}}>Week {e.w.replace("W","")}</span>
                <span style={{fontSize:10,color:C.borderMid,margin:"0 5px"}}>·</span>
                <span style={{fontSize:12,color:e.type==="milestone"?e.color:C.textMuted,fontFamily:"sans-serif",fontWeight:e.type==="milestone"?"600":"400"}}>{e.label}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Language */}
      <Card style={{marginBottom:14}}>
        <Label sub="Most frequent across 18 sessions">Your language</Label>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
          {Object.entries(WORD_C).map(([type,s])=>(
            <span key={type} style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:s.bg,color:s.color,fontFamily:"sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:500}}>{type}</span>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {WORDS.map(w=>{
            const pct = (w.count/maxW)*100;
            const s = WORD_C[w.type];
            return (
              <div key={w.text} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:76,textAlign:"right",flexShrink:0,fontSize:12,color:C.textMuted,fontFamily:"Georgia,serif",fontStyle:"italic"}}>{w.text}</div>
                <div style={{flex:1,height:10,background:C.bg,borderRadius:5,overflow:"hidden"}}>
                  <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${s.color}77,${s.color})`,borderRadius:5}}/>
                </div>
                <div style={{width:24,textAlign:"right",flexShrink:0,fontSize:10,color:C.textDim,fontFamily:"sans-serif"}}>{w.count}</div>
                <div style={{width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0}}/>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Insights */}
      <div style={{marginBottom:6}}>
        <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textDim,fontFamily:"sans-serif",marginBottom:8,paddingLeft:2}}>Insights from your record</div>
        {INSIGHTS.map(ins=>(
          <div key={ins.id} style={{background:ins.bg,borderRadius:14,padding:"12px 14px",marginBottom:8,borderLeft:`3px solid ${ins.color}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
              <div style={{fontSize:12,color:C.textMuted,fontFamily:"Georgia,serif",fontStyle:"italic",lineHeight:1.55,flex:1}}>"{ins.q}"</div>
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
                background:on?C.surface:C.bg,cursor:"pointer",fontFamily:"sans-serif",opacity:on?1:0.38,transition:"all 0.2s"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:v.color}}/>
                <span style={{fontSize:10,color:on?v.color:C.textDim,fontWeight:500}}>{v.label}</span>
              </button>
            );
          })}
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={TREND_DATA} margin={{top:4,right:8,bottom:0,left:-24}}>
            <Grads/>
            <XAxis dataKey="w" tick={{fill:C.textDim,fontSize:9,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.textDim,fontSize:9,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
            <Tooltip content={<Tip/>}/>
            {TIMELINE.filter(e=>e.type==="treatment").map(e=>(
              <ReferenceLine key={e.w+e.label} x={e.w} stroke={C.borderMid} strokeDasharray="4 3" strokeWidth={1}/>
            ))}
            {Object.entries(SYMS).map(([k,v])=>overlays.includes(k)&&(
              <Area key={k} type="monotone" dataKey={k} name={v.label} stroke={v.color} strokeWidth={1.5} fill={`url(#g_${k})`} dot={false} activeDot={{r:3,fill:v.color}}/>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div style={{padding:"11px 14px",marginBottom:14,background:C.surface,borderRadius:12,
        border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,
        fontSize:11,color:C.textDim,lineHeight:1.65,fontFamily:"Georgia,serif",fontStyle:"italic"}}>
        Your protocol is yours. What follows is a scientific lens — current evidence, where the gaps are, and how others with similar profiles have used it. No verdicts.
      </div>

      {PROTOCOL.map(item=>{
        const open = expanded===item.id;
        return (
          <div key={item.id} style={{border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:10,borderLeft:`3px solid ${item.color}`}}>
            <div onClick={()=>setExpanded(open?null:item.id)} style={{padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",background:open?item.bg:C.surface,transition:"background 0.2s"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:"'Helvetica Neue',sans-serif"}}>{item.name}</span>
                  <span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:item.bg,color:item.color,fontFamily:"sans-serif"}}>{item.cat}</span>
                </div>
                <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif"}}>{item.dose} · {item.weeks}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <EvidenceBadge label={item.evidence} color={item.evColor} bg={item.evBg}/>
                <span style={{fontSize:13,color:C.textDim,transform:open?"rotate(180deg)":"none",display:"block",transition:"transform 0.2s"}}>⌄</span>
              </div>
            </div>
            {open && (
              <div style={{padding:"0 16px 16px",background:C.surface}}>
                <div style={{padding:"10px 12px",background:C.bg,borderRadius:10,marginBottom:10,marginTop:4}}>
                  <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textDim,fontFamily:"sans-serif",marginBottom:6}}>Scientific lens</div>
                  <div style={{fontSize:11,color:C.textDim,lineHeight:1.65,fontFamily:"Georgia,serif",fontStyle:"italic",borderLeft:`2px solid ${C.borderMid}`,paddingLeft:10}}>{item.note}</div>
                </div>
                <div style={{marginBottom:10}}>
                  {item.links.map((lnk,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:C.bg,borderRadius:8,cursor:"pointer",border:`1px solid ${C.border}`,marginBottom:4}}>
                      <span style={{fontSize:8,padding:"1px 6px",borderRadius:6,background:C.surface,color:LINK_C[lnk.t]||C.steel,border:`1px solid ${C.border}`,fontFamily:"sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",flexShrink:0,fontWeight:600}}>{lnk.t}</span>
                      <span style={{fontSize:11,color:item.color,fontFamily:"sans-serif",flex:1,lineHeight:1.4}}>{lnk.l}</span>
                      <span style={{fontSize:11,color:C.textDim}}>→</span>
                    </div>
                  ))}
                </div>
                <div style={{padding:"10px 12px",background:`linear-gradient(135deg,${item.bg},${C.surface})`,borderRadius:10,border:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textDim,fontFamily:"sans-serif",marginBottom:4}}>In the cohort</div>
                    <div style={{fontSize:11,color:C.textMuted,fontFamily:"sans-serif",lineHeight:1.55}}>{item.cohort}</div>
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
        <span style={{fontSize:12,color:C.textDim,fontFamily:"sans-serif"}}>Add something you're trying</span>
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
              <button key={sym} onClick={()=>setSelSym(selSym===sym?null:sym)} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:16,border:`1.5px solid ${on?RCOL[sym]:C.border}`,background:on?C.surface:C.bg,cursor:"pointer",fontFamily:"sans-serif",opacity:on?1:0.32,transition:"all 0.2s"}}>
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
              <div style={{fontSize:22,fontWeight:700,color:s.color,fontFamily:"sans-serif",lineHeight:1,marginBottom:4}}>{s.fmt(s.value)}</div>
              <div style={{fontSize:9,color:C.textDim,fontFamily:"sans-serif",letterSpacing:"0.07em",textTransform:"uppercase",lineHeight:1.3}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif"}}>Sessions today vs daily avg</span>
            <span style={{fontSize:10,color:C.teal,fontFamily:"sans-serif",fontWeight:600}}>{Math.round(stats.pct*100)}%</span>
          </div>
          <div style={{height:6,background:C.bg,borderRadius:3,overflow:"hidden"}}>
            <div style={{width:`${stats.pct*100}%`,height:"100%",background:`linear-gradient(90deg,${C.teal}88,${C.teal})`,borderRadius:3,transition:"width 1.4s ease"}}/>
          </div>
        </div>
        <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textDim,fontFamily:"sans-serif",marginBottom:7}}>New variables this week</div>
        {[["Methylene blue",C.teal],["Red light therapy",C.amber],["HBOT sessions",C.navy]].map(([v,col],i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:C.bg,borderRadius:8,marginBottom:4,borderLeft:`2px solid ${col}`}}>
            <span style={{fontSize:11,color:C.textMuted,fontFamily:"sans-serif",flex:1}}>{v}</span>
            <span style={{fontSize:9,color:col,fontFamily:"sans-serif",fontWeight:600,background:C.surface,padding:"1px 6px",borderRadius:8,border:`1px solid ${C.border}`}}>new</span>
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
            <div style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:"'Helvetica Neue',sans-serif",marginBottom:2}}>Apple Watch</div>
            <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif"}}>Last synced 14 min ago · 12 weeks of data</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:12,background:C.greenSoft,border:`1px solid ${C.green}44`}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.green}}/>
            <span style={{fontSize:10,color:C.green,fontFamily:"sans-serif",fontWeight:600}}>Connected</span>
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
                background:on?bm.color+"11":C.surface,transition:"all 0.2s"}}>
              <div style={{fontSize:9,color:on?bm.color:C.textDim,fontFamily:"sans-serif",
                letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4,fontWeight:on?"600":"400"}}>{bm.label.split(" ").slice(-1)[0]}</div>
              <div style={{fontSize:17,fontWeight:700,color:on?bm.color:C.text,fontFamily:"sans-serif",lineHeight:1,marginBottom:3}}>{bm.fmt(bm.current)}</div>
              <div style={{fontSize:10,color:imp?C.green:C.rose,fontFamily:"sans-serif",fontWeight:500}}>
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
              <div style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:"'Helvetica Neue',sans-serif",marginBottom:2}}>{m.label}</div>
              <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif"}}>12-week trend · Apple Watch</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:18,fontWeight:700,color:m.color,fontFamily:"sans-serif",lineHeight:1}}>{m.fmt(m.current)}</div>
              <div style={{fontSize:10,color:improved?C.green:C.rose,fontFamily:"sans-serif",marginTop:2}}>
                {improved?"↑":"↓"} {Math.abs(pctChange)}% from W1
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={WEARABLE_DATA} margin={{top:4,right:8,bottom:0,left:-24}}>
              <Grads/>
              <XAxis dataKey="w" tick={{fill:C.textDim,fontSize:9,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.textDim,fontSize:9,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <ReferenceLine y={m.baseline} stroke={m.color} strokeDasharray="4 3" strokeOpacity={0.35} strokeWidth={1}/>
              <Area type="monotone" dataKey={m.key} name={m.label} stroke={m.color} strokeWidth={2}
                fill={`url(#${m.grad})`} dot={false} activeDot={{r:4,fill:m.color,stroke:"white",strokeWidth:2}}/>
            </AreaChart>
          </ResponsiveContainer>

          <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.65,
            marginTop:10,padding:"9px 11px",background:C.bg,borderRadius:10,
            borderLeft:`3px solid ${m.color}`}}>
            {m.note}
          </div>
        </Card>
      )}

      {/* Correlations */}
      <Card style={{marginBottom:14}}>
        <Label sub="Where passive data intersects your symptom record">Correlations</Label>
        <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.6,
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
                background:open?corr.color+"0a":C.surface,transition:"all 0.2s"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:open?8:0}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                    <span style={{fontSize:12,fontWeight:600,color:corr.color,fontFamily:"sans-serif"}}>{corr.a}</span>
                    <span style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif"}}>with</span>
                    <span style={{fontSize:12,fontWeight:600,color:C.text,fontFamily:"sans-serif"}}>{corr.b}</span>
                    <span style={{fontSize:9,color:C.textDim,fontFamily:"sans-serif",marginLeft:"auto"}}>{corr.weeks}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <StrengthBar value={corr.strength} color={corr.color}/>
                    <span style={{fontSize:10,color:corr.color,fontFamily:"sans-serif",fontWeight:600,flexShrink:0}}>{Math.round(corr.strength*100)}%</span>
                  </div>
                </div>
                <span style={{fontSize:12,color:C.textDim,transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>⌄</span>
              </div>
              {open && (
                <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.65,
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
        fontSize:11,color:C.textDim,lineHeight:1.65,fontFamily:"Georgia,serif",fontStyle:"italic",
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
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:12,color:C.textDim,fontFamily:"sans-serif",cursor:"pointer"}}>← Back</button>
        <div style={{fontSize:12,fontWeight:600,color:C.text,fontFamily:"sans-serif"}}>Share with practitioner</div>
        <div style={{width:40}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>
        {!preview ? <>
          <div style={{padding:"11px 13px",marginBottom:14,background:C.navySoft,borderRadius:12,borderLeft:`3px solid ${C.navy}`,fontSize:11,color:C.textDim,lineHeight:1.65,fontFamily:"Georgia,serif",fontStyle:"italic"}}>
            You decide what your practitioner sees. Select what's relevant for this appointment.
          </div>
          <Label sub="Select what to include">Curate your view</Label>
          {items.map(item=>(
            <div key={item.key} onClick={()=>setSel(p=>({...p,[item.key]:!p[item.key]}))}
              style={{display:"flex",alignItems:"center",gap:12,padding:"11px 13px",marginBottom:6,borderRadius:12,cursor:"pointer",background:sel[item.key]?C.navySoft:C.surface,border:`1.5px solid ${sel[item.key]?C.navy:C.border}`,transition:"all 0.2s"}}>
              <div style={{width:18,height:18,borderRadius:5,flexShrink:0,background:sel[item.key]?C.navy:C.bg,border:`1.5px solid ${sel[item.key]?C.navy:C.borderMid}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {sel[item.key]&&<span style={{fontSize:11,color:"white",lineHeight:1}}>✓</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:500,color:sel[item.key]?C.navy:C.text,fontFamily:"sans-serif"}}>{item.label}</div>
                <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif"}}>{item.sub}</div>
              </div>
            </div>
          ))}
          <div style={{marginTop:14,marginBottom:14}}>
            <Label sub="Link expires after">Access duration</Label>
            <div style={{display:"flex",gap:6}}>
              {[{k:"24hrs",l:"24 hours"},{k:"7days",l:"7 days"},{k:"30days",l:"30 days"},{k:"once",l:"One-time"}].map(e=>(
                <button key={e.k} onClick={()=>setExpiry(e.k)} style={{flex:1,padding:"7px 4px",borderRadius:10,fontSize:10,fontFamily:"sans-serif",border:`1px solid ${expiry===e.k?C.navy:C.border}`,background:expiry===e.k?C.navySoft:C.surface,color:expiry===e.k?C.navy:C.textDim,cursor:"pointer"}}>
                  {e.l}
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>setPreview(true)} style={{width:"100%",padding:14,background:C.navy,border:"none",color:"white",borderRadius:14,fontSize:13,fontFamily:"sans-serif",cursor:"pointer",fontWeight:500}}>
            Preview & generate link
          </button>
        </> : <>
          <Label sub="What your practitioner will see">Preview</Label>
          <div style={{background:C.surface,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:14}}>
            <div style={{padding:14,borderBottom:`1px solid ${C.border}`,background:C.navySoft}}>
              <div style={{fontSize:12,fontWeight:600,color:C.navy,fontFamily:"sans-serif",marginBottom:2}}>LymePath — Practitioner View</div>
              <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif"}}>Shared by patient · Expires {expiry} · Read only</div>
            </div>
            <div style={{padding:"12px 14px"}}>
              {items.filter(i=>sel[i.key]).map(item=>(
                <div key={item.key} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.navy}}/>
                  <span style={{fontSize:11,color:C.textMuted,fontFamily:"sans-serif"}}>{item.label}</span>
                  <span style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif",marginLeft:"auto"}}>{item.sub}</span>
                </div>
              ))}
            </div>
            <div style={{padding:"10px 13px",background:C.bg,fontSize:10,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.6}}>
              This view is observational only. All clinical judgment remains with the practitioner.
            </div>
          </div>
          {!linked ? (
            <button onClick={()=>setLinked(true)} style={{width:"100%",padding:14,background:C.navy,border:"none",color:"white",borderRadius:14,fontSize:13,fontFamily:"sans-serif",cursor:"pointer",fontWeight:500}}>
              Generate secure link
            </button>
          ) : (
            <div style={{padding:14,background:C.greenSoft,borderRadius:14,border:`1px solid ${C.green}44`}}>
              <div style={{fontSize:11,color:C.green,fontFamily:"sans-serif",fontWeight:600,marginBottom:6}}>Link generated</div>
              <div style={{fontSize:12,color:C.textMuted,fontFamily:"sans-serif",background:C.surface,padding:"8px 10px",borderRadius:8,border:`1px solid ${C.border}`,marginBottom:8,wordBreak:"break-all"}}>lymepath.io/share/p7x2k9…</div>
              <div style={{display:"flex",gap:6}}>
                <button style={{flex:1,padding:10,background:C.navy,border:"none",color:"white",borderRadius:10,fontSize:12,fontFamily:"sans-serif",cursor:"pointer"}}>Copy link</button>
                <button style={{flex:1,padding:10,background:C.surface,border:`1px solid ${C.border}`,color:C.textMuted,borderRadius:10,fontSize:12,fontFamily:"sans-serif",cursor:"pointer"}}>Email</button>
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
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:12,color:C.textDim,fontFamily:"sans-serif",cursor:"pointer"}}>← Back</button>
        <div style={{fontSize:12,fontWeight:600,color:C.text,fontFamily:"sans-serif"}}>Export record</div>
        <div style={{width:40}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>
        <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.65,marginBottom:16}}>
          Export a copy of your record for appointments, second opinions, or personal reference.
        </div>
        {[
          {key:"pdf",icon:"◉",title:"Clinical summary PDF",sub:"Timeline, protocol, co-infections, wearable highlights. Formatted for practitioners.",color:C.navy},
          {key:"csv",icon:"◈",title:"Full data export (CSV)",sub:"All logged variables, wearable data, and session-extracted entries.",color:C.steel},
          {key:"json",icon:"○",title:"Raw record (JSON)",sub:"Complete structured record for developers or custom tools.",color:C.textDim},
        ].map(f=>(
          <div key={f.key} onClick={()=>setFmt(f.key)} style={{padding:"13px 16px",marginBottom:8,borderRadius:14,cursor:"pointer",border:`1.5px solid ${fmt===f.key?f.color:C.border}`,background:fmt===f.key?f.color+"11":C.surface,display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
            <span style={{fontSize:18,color:f.color,opacity:0.7}}>{f.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:500,color:fmt===f.key?f.color:C.text,fontFamily:"sans-serif",marginBottom:2}}>{f.title}</div>
              <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif"}}>{f.sub}</div>
            </div>
            {fmt===f.key&&<div style={{width:8,height:8,borderRadius:"50%",background:f.color}}/>}
          </div>
        ))}
        <div style={{marginTop:6,padding:"10px 12px",background:C.bg,borderRadius:12,fontSize:10,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.6,marginBottom:14}}>
          Exports contain only your data. Nothing from the anonymized cohort is included.
        </div>
        {!done ? (
          <button onClick={go} disabled={!fmt||exporting} style={{width:"100%",padding:14,background:fmt&&!exporting?C.navy:"#d0d3dc",border:"none",color:"white",borderRadius:14,fontSize:13,fontFamily:"sans-serif",cursor:fmt&&!exporting?"pointer":"default",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {exporting ? <>
              <div style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.4)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
              Preparing…
            </> : "Export record"}
          </button>
        ) : (
          <div style={{padding:14,background:C.greenSoft,borderRadius:14,border:`1px solid ${C.green}44`,textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:6}}>◉</div>
            <div style={{fontSize:13,color:C.green,fontFamily:"sans-serif",fontWeight:600,marginBottom:4}}>Export ready</div>
            <div style={{fontSize:11,color:C.textDim,fontFamily:"sans-serif"}}>Your record has been prepared for download.</div>
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
  const [screen, setScreen] = useState("onboarding");
  const [tab, setTab] = useState("record");
  const [voicePrompt, setVoicePrompt] = useState(null);
  const [overlay, setOverlay] = useState(null); // "share" | "export" | null
  const [elKey, setElKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const goVoice = (prompt=null) => { setVoicePrompt(prompt); setScreen("voice"); };
  const backFromVoice = () => { setScreen("app"); setVoicePrompt(null); };

  return (
    <div style={{background:"#e8e9ee",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Georgia,'Times New Roman',serif"}}>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#cdd0db;border-radius:2px}
      `}</style>
      <div style={{width:390,height:844,background:C.bg,borderRadius:48,border:`2px solid ${C.borderMid}`,boxShadow:"0 24px 80px rgba(0,0,0,0.18),0 4px 16px rgba(0,0,0,0.08)",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>

        {/* ElevenLabs key drawer — floats over everything when open */}
        {showKeyInput && (
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"flex-end",borderRadius:46}}>
            <div style={{width:"100%",background:C.surface,borderRadius:"24px 24px 0 0",padding:"20px 20px 32px"}}>
              <div style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:"sans-serif",marginBottom:12}}>API Keys</div>
              
              <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif",marginBottom:4,letterSpacing:"0.06em",textTransform:"uppercase"}}>Anthropic (Claude)</div>
              <input value={anthropicKey} onChange={e=>setAnthropicKey(e.target.value)}
                placeholder="sk-ant-..."
                type="password"
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${anthropicKey?C.navy:C.border}`,fontSize:13,fontFamily:"sans-serif",color:C.text,background:C.bg,boxSizing:"border-box",outline:"none",marginBottom:10}}/>

              <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif",marginBottom:4,letterSpacing:"0.06em",textTransform:"uppercase"}}>ElevenLabs (voice)</div>
              <input value={elKey} onChange={e=>setElKey(e.target.value)}
                placeholder="sk_..."
                type="password"
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${elKey?C.teal:C.border}`,fontSize:13,fontFamily:"sans-serif",color:C.text,background:C.bg,boxSizing:"border-box",outline:"none",marginBottom:4}}/>
              <div style={{fontSize:10,color:C.textDim,fontFamily:"sans-serif",lineHeight:1.5,marginBottom:14}}>
                Keys stay in your browser only. Get ElevenLabs key at elevenlabs.io/app/settings/api-keys
              </div>

              <button onClick={()=>setShowKeyInput(false)} style={{width:"100%",padding:12,background:anthropicKey?C.navy:"#d0d3dc",border:"none",color:"white",borderRadius:12,fontSize:13,fontFamily:"sans-serif",cursor:"pointer",fontWeight:500}}>
                {anthropicKey?"Save & close":"Close"}
              </button>
            </div>
          </div>
        )}

        {/* Notch */}
        <div style={{width:126,height:34,background:"#111",borderRadius:"0 0 20px 20px",margin:"0 auto",flexShrink:0}}/>

        {/* ONBOARDING */}
        {screen==="onboarding" && <>
          <div style={{padding:"6px 22px 6px",borderBottom:`1px solid ${C.border}`,background:C.surface,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Logo size={20}/>
            <span style={{fontSize:15,fontWeight:300,color:C.navy,letterSpacing:"0.02em",fontFamily:"'Helvetica Neue',sans-serif"}}>LymePath</span>
          </div>
          <Onboarding onComplete={()=>setScreen("app")}/>
          <div style={{height:28,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:C.surface,borderTop:`1px solid ${C.border}`}}>
            <div style={{width:134,height:4,background:C.borderMid,borderRadius:3}}/>
          </div>
        </>}

        {/* VOICE */}
        {screen==="voice" && <VoiceSession onBack={backFromVoice} initialPrompt={voicePrompt} elKey={elKey} anthropicKey={anthropicKey} onConfigKey={()=>setShowKeyInput(true)}/> }

        {/* MAIN APP */}
        {screen==="app" && <>
          {overlay==="share" && <PractitionerShare onClose={()=>setOverlay(null)}/>}
          {overlay==="export" && <Export onClose={()=>setOverlay(null)}/>}

          {/* Header */}
          <div style={{padding:"7px 14px",borderBottom:`1px solid ${C.border}`,background:C.surface,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Logo size={22}/>
              <span style={{fontSize:15,fontWeight:300,color:C.navy,letterSpacing:"0.02em",fontFamily:"'Helvetica Neue',sans-serif"}}>LymePath</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <button onClick={()=>setOverlay("export")} style={{display:"flex",alignItems:"center",gap:3,background:C.bg,border:`1px solid ${C.border}`,color:C.textDim,borderRadius:14,padding:"4px 9px",fontSize:10,fontFamily:"sans-serif",cursor:"pointer"}}>↓ Export</button>
              <button onClick={()=>setOverlay("share")} style={{display:"flex",alignItems:"center",gap:3,background:C.steelSoft,border:`1px solid ${C.steel}44`,color:C.steel,borderRadius:14,padding:"4px 9px",fontSize:10,fontFamily:"sans-serif",cursor:"pointer"}}>◈ Share</button>
              <button onClick={()=>setShowKeyInput(true)} style={{display:"flex",alignItems:"center",gap:3,background:anthropicKey?C.greenSoft:C.bg,border:`1px solid ${anthropicKey?C.green+"44":C.border}`,color:anthropicKey?C.green:C.textDim,borderRadius:14,padding:"4px 9px",fontSize:10,fontFamily:"sans-serif",cursor:"pointer"}}>{anthropicKey?"● Keys":"○ Keys"}</button>
              <button onClick={()=>goVoice(null)} style={{display:"flex",alignItems:"center",gap:4,background:C.tealSoft,border:`1px solid ${C.teal}44`,color:C.teal,borderRadius:14,padding:"4px 9px",fontSize:10,fontFamily:"sans-serif",cursor:"pointer",fontWeight:500}}>◎ Session</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",background:C.surface,borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)} style={{
                flex:1,padding:"9px 4px",fontSize:11,fontFamily:"sans-serif",
                color:tab===t.key?C.navy:C.textDim,fontWeight:tab===t.key?"600":"400",
                background:"none",border:"none",cursor:"pointer",transition:"all 0.15s",
                borderBottom:tab===t.key?`2px solid ${C.navy}`:"2px solid transparent",
                display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <span style={{fontSize:12,opacity:tab===t.key?1:0.4}}>{t.icon}</span>
                <span>{t.label}</span>
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
            <div style={{width:134,height:4,background:C.borderMid,borderRadius:3}}/>
          </div>
        </>}

      </div>
    </div>
  );
}
