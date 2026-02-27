import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const NEXGO_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgMTAwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZzEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRjBEMDgwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojQzlBODRDIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhBNjgyMCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZzIiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOUE3QTJFIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0U4Qzk3QSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPCEtLSBTcGVlZCBsaW5lcyAtLT4KICA8cmVjdCB4PSI4IiB5PSIzNiIgd2lkdGg9IjI2IiBoZWlnaHQ9IjUiIHJ4PSIyLjUiIGZpbGw9InVybCgjZzEpIiBvcGFjaXR5PSIwLjkiLz4KICA8cmVjdCB4PSI0IiB5PSI0OCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjQiIHJ4PSIyIiBmaWxsPSJ1cmwoI2cxKSIgb3BhY2l0eT0iMC42Ii8+CiAgPCEtLSBPdXRlciBjaGV2cm9uIC0tPgogIDxwYXRoIGQ9Ik0zOCAxNSBMNjggNTAgTDM4IDg1IEw1MiA4NSBMODIgNTAgTDUyIDE1IFoiIGZpbGw9InVybCgjZzEpIi8+CiAgPCEtLSBJbm5lciBjaGV2cm9uIChsaWdodGVyLCBjcmVhdGVzIGRlcHRoKSAtLT4KICA8cGF0aCBkPSJNNTQgMjIgTDc4IDUwIEw1NCA3OCBMNjIgNzggTDg4IDUwIEw2MiAyMiBaIiBmaWxsPSJ1cmwoI2cyKSIgb3BhY2l0eT0iMC43NSIvPgogIDwhLS0gTmV4R28gdGV4dCAtLT4KICA8dGV4dCB4PSI5OCIgeT0iNjkiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjaywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI1MCIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0idXJsKCNnMSkiIGxldHRlci1zcGFjaW5nPSItMC41Ij5OZXhHbzwvdGV4dD4KPC9zdmc+";

const G = {
  gold:"#C9A84C",goldLight:"#E8C97A",goldDark:"#9A7A2E",
  goldGlow:"rgba(201,168,76,0.15)",goldBorder:"rgba(201,168,76,0.3)",
  black:"#0A0A0A",b2:"#111111",b3:"#1A1A1A",b4:"#242424",b5:"#2E2E2E",
  white:"#F5F0E8",whiteDim:"rgba(245,240,232,0.55)",
  danger:"#E05555",success:"#4CAF7A",
};

const injectStyles = () => {
  if (document.getElementById("nexgo-styles")) return;
  const s = document.createElement("style");
  s.id = "nexgo-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html,body,#root{height:100%;background:#0A0A0A;color:#F5F0E8;font-family:'DM Sans',sans-serif;}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:#9A7A2E;border-radius:2px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shimmer{0%,100%{opacity:.6}50%{opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(201,168,76,0.3)}50%{text-shadow:0 0 60px rgba(201,168,76,0.9)}}
    @keyframes popUp{from{opacity:0;transform:translateX(-50%) translateY(24px) scale(0.94)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
    @keyframes slideIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
    input,textarea,select{outline:none;font-family:inherit;}
    button{cursor:pointer;font-family:inherit;border:none;}
    .hover-gold:hover{border-color:rgba(201,168,76,0.4)!important;background:rgba(201,168,76,0.06)!important;}
    .hover-lift:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.4)!important;}
  `;
  document.head.appendChild(s);
};

// ─── Style helpers ────────────────────────────────────────────────────────────
const btn = (v="gold",ex={}) => ({
  display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,
  padding:"12px 24px",borderRadius:10,fontWeight:600,fontSize:14,
  letterSpacing:".03em",cursor:"pointer",border:"none",transition:"all .2s",
  ...(v==="gold"?{background:`linear-gradient(135deg,${G.gold},${G.goldDark})`,color:G.black}:
     v==="outline"?{background:"transparent",border:`1.5px solid ${G.gold}`,color:G.gold}:
     v==="danger"?{background:`linear-gradient(135deg,${G.danger},#C04040)`,color:G.white}:
     {background:G.b4,color:G.white}),
  ...ex,
});
const card = (ex={}) => ({background:G.b3,border:`1px solid ${G.b5}`,borderRadius:16,padding:20,...ex});
const inp  = (ex={}) => ({width:"100%",padding:"13px 16px",background:G.b4,border:`1.5px solid ${G.b5}`,borderRadius:10,color:G.white,fontSize:14,...ex});

// ─── Toast system ─────────────────────────────────────────────────────────────
let _toastSetter: any = null;
const toast = (msg: string, type="info") => _toastSetter && _toastSetter((p: any)=>[...p,{id:Date.now(),msg,type}]);

function ToastContainer() {
  const [toasts, setToasts] = useState<any[]>([]);
  useEffect(()=>{ _toastSetter=setToasts; return ()=>{ _toastSetter=null; }; },[]);
  useEffect(()=>{
    if(!toasts.length) return;
    const t = setTimeout(()=>setToasts(p=>p.slice(1)),3000);
    return ()=>clearTimeout(t);
  },[toasts]);
  if(!toasts.length) return null;
  const colors: any = {success:G.success,error:G.danger,info:G.gold};
  const icons: any  = {success:"✅",error:"❌",info:"ℹ️"};
  return (
    <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:9999,display:"flex",flexDirection:"column",gap:8,width:"calc(100% - 32px)",maxWidth:500,pointerEvents:"none"}}>
      {toasts.map((t: any)=>(
        <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,background:G.b3,border:`1px solid ${colors[t.type]}50`,borderLeft:`3px solid ${colors[t.type]}`,borderRadius:10,padding:"12px 16px",boxShadow:"0 8px 32px rgba(0,0,0,0.6)",animation:"slideIn .3s ease",fontSize:14,color:G.white,fontWeight:500}}>
          <span>{icons[t.type]}</span><span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
const STitle = ({children}: any) => <div style={{fontFamily:"'Cormorant Garamond'",fontSize:20,fontWeight:700,color:G.white}}>{children}</div>;
const PHeader = ({title,sub,icon}: any) => (
  <div style={{display:"flex",alignItems:"center",gap:10}}>
    <span style={{fontSize:26}}>{icon}</span>
    <div>
      <div style={{fontFamily:"'Cormorant Garamond'",fontSize:26,fontWeight:700,color:G.white,lineHeight:1.1}}>{title}</div>
      <div style={{color:G.whiteDim,fontSize:12}}>{sub}</div>
    </div>
  </div>
);
const Lbl = ({children}: any) => <div style={{fontSize:11,fontWeight:600,color:G.whiteDim,letterSpacing:".06em",textTransform:"uppercase"}}>{children}</div>;
const Chip = ({children}: any) => <div style={{background:G.goldGlow,border:`1px solid ${G.goldDark}`,color:G.gold,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6}}>{children}</div>;
const Badge = ({status}: any) => {
  const c: any=({delivered:G.success,done:G.success,active:G.gold,out_for_delivery:G.gold,preparing:"#E8A030",pending:G.whiteDim,ready:G.goldLight,open:G.success,suspended:G.danger,confirmed:G.success,accepted:"#E8A030",cancelled:G.danger,under_review:"#E8A030","In Transit":G.gold,Delivered:G.success,Done:G.success,Pending:G.whiteDim,Ready:G.goldLight,Preparing:"#E8A030",Confirmed:G.success})[status]||G.whiteDim;
  return <div style={{background:`${c}22`,color:c,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:6,display:"inline-block",whiteSpace:"nowrap",textTransform:"capitalize"}}>{status}</div>;
};
const Spinner = ({size=16,color=G.black}: any) => <span style={{display:"inline-block",width:size,height:size,border:`2px solid ${color}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>;
const LoadingCard = () => <div style={{...card({}),textAlign:"center",padding:40}}><Spinner size={24} color={G.gold}/><div style={{color:G.whiteDim,fontSize:13,marginTop:12}}>Loading...</div></div>;

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({role,tab,setTab,cartCount}: any) {
  const [showMore,setShowMore] = useState(false);
  const cfg: any = {
    student:{
      left:[{id:"home",icon:"⊞",label:"Home"},{id:"chow",icon:"🍽️",label:"NexChow"}],
      right:[{id:"wallet",icon:"💳",label:"Wallet"},{id:"profile",icon:"👤",label:"Profile"}],
      more:[{id:"dispatch",icon:"📦",label:"Dispatch"},{id:"trip",icon:"🚌",label:"NexTrip"},{id:"chat",icon:"💬",label:"Support"}],
    },
    vendor:{
      left:[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"orders",icon:"📦",label:"Orders"}],
      right:[{id:"menu",icon:"🍽️",label:"Menu"},{id:"profile",icon:"👤",label:"Profile"}],
      more:[{id:"earnings",icon:"💳",label:"Earnings"},{id:"chat",icon:"💬",label:"Support"}],
    },
    rider:{
      left:[{id:"rdashboard",icon:"📊",label:"Dashboard"},{id:"deliveries",icon:"🏍️",label:"Active"}],
      right:[{id:"earnings",icon:"💳",label:"Earnings"},{id:"profile",icon:"👤",label:"Profile"}],
      more:[{id:"chat",icon:"💬",label:"Support"}],
    },
    admin:{
      left:[{id:"adashboard",icon:"📊",label:"Dashboard"},{id:"users",icon:"👥",label:"Users"}],
      right:[{id:"settings",icon:"⚙️",label:"Settings"},{id:"profile",icon:"👤",label:"Profile"}],
      more:[{id:"analytics",icon:"📈",label:"Analytics"}],
    },
  }[role]||{left:[],right:[],more:[]};

  const NavBtn = ({t}: any) => (
    <button onClick={()=>{setTab(t.id);setShowMore(false);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 2px",background:"transparent",border:"none",cursor:"pointer",position:"relative"}}>
      <div style={{fontSize:20,filter:t.id===tab?`drop-shadow(0 0 6px ${G.gold})`:"none",transition:"filter .2s"}}>{t.icon}</div>
      {t.id==="chow"&&cartCount>0&&<div style={{position:"absolute",top:2,right:"14%",width:16,height:16,borderRadius:"50%",background:G.gold,color:G.black,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</div>}
      <div style={{fontSize:10,fontWeight:600,color:t.id===tab?G.gold:G.whiteDim,transition:"color .2s"}}>{t.label}</div>
      {t.id===tab&&<div style={{position:"absolute",bottom:-14,left:"50%",transform:"translateX(-50%)",width:18,height:2,background:G.gold,borderRadius:1}}/>}
    </button>
  );

  return (
    <>
      {showMore&&<div onClick={()=>setShowMore(false)} style={{position:"fixed",inset:0,zIndex:98,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)"}}/>}
      {showMore&&cfg.more.length>0&&(
        <div style={{position:"fixed",bottom:82,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:500,background:G.b3,border:`1px solid ${G.goldBorder}`,borderRadius:20,zIndex:99,padding:"18px 14px 14px",boxShadow:"0 -8px 40px rgba(0,0,0,0.8)",animation:"popUp .28s cubic-bezier(0.34,1.56,0.64,1)"}}>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.14em",color:G.whiteDim,textAlign:"center",marginBottom:14}}>More Services</div>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(cfg.more.length,3)},1fr)`,gap:10}}>
            {cfg.more.map((t: any)=>(
              <button key={t.id} onClick={()=>{setTab(t.id);setShowMore(false);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,background:t.id===tab?"rgba(201,168,76,0.12)":"rgba(255,255,255,0.04)",border:`1px solid ${t.id===tab?"rgba(201,168,76,0.4)":"rgba(255,255,255,0.06)"}`,borderRadius:14,padding:"14px 8px",cursor:"pointer",transition:"all .2s"}}>
                <div style={{fontSize:26}}>{t.icon}</div>
                <div style={{fontSize:10,fontWeight:600,color:t.id===tab?G.gold:G.whiteDim,textAlign:"center",letterSpacing:"0.04em",textTransform:"uppercase"}}>{t.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:G.b2,borderTop:`1px solid rgba(201,168,76,0.2)`,display:"flex",alignItems:"center",padding:"8px 4px 14px",zIndex:100}}>
        {cfg.left.map((t: any)=><NavBtn key={t.id} t={t}/>)}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",marginTop:-24}} onClick={()=>setShowMore((p: boolean)=>!p)}>
          <div style={{width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${G.goldDark},${G.gold},${G.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 -4px 20px rgba(201,168,76,0.5),0 4px 16px rgba(0,0,0,0.6)`,border:`3px solid ${G.b2}`,transition:"transform .28s cubic-bezier(0.34,1.56,0.64,1)",transform:showMore?"rotate(45deg) scale(1.08)":"rotate(0deg) scale(1)"}}>
            <img src={NEXGO_LOGO} alt="" style={{width:50,height:28,objectFit:"contain",filter:"brightness(0) invert(0.15)"}}/>
          </div>
          <div style={{fontSize:9,fontWeight:700,color:G.gold,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:4}}>{showMore?"Close":"Menu"}</div>
        </div>
        {cfg.right.map((t: any)=><NavBtn key={t.id} t={t}/>)}
      </div>
    </>
  );
}

// ─── Splash ───────────────────────────────────────────────────────────────────
function Splash({onDone}: any) {
  const [progress,setProgress] = useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setProgress((p: number)=>{if(p>=100){clearInterval(t);setTimeout(onDone,300);return 100;}return p+1.5;}),25);
    return ()=>clearInterval(t);
  },[]);
  return (
    <div style={{height:"100vh",background:G.black,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:48,overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${G.goldGlow} 0%,transparent 65%)`,top:-200,right:-200,pointerEvents:"none"}}/>
      <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 65%)`,bottom:-100,left:-100,pointerEvents:"none"}}/>
      <div style={{textAlign:"center",animation:"glow 3s ease infinite",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <img src={NEXGO_LOGO} alt="NexGo" style={{width:220,objectFit:"contain",filter:"drop-shadow(0 0 24px rgba(201,168,76,0.5))"}}/>
        <div style={{color:G.whiteDim,fontSize:12,letterSpacing:"6px",textTransform:"uppercase",marginTop:4}}>Campus Super App</div>
      </div>
      <div style={{display:"flex",gap:16}}>
        {["🍽️","📦","🚌"].map((ic,i)=>(
          <div key={i} style={{width:52,height:52,borderRadius:"50%",background:G.b3,border:`1.5px solid ${G.b5}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,animation:`shimmer 2s ease ${i*0.4}s infinite`}}>{ic}</div>
        ))}
      </div>
      <div style={{width:220}}>
        <div style={{height:2,background:G.b4,borderRadius:1,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${G.goldDark},${G.gold})`,borderRadius:1,transition:"width .03s linear"}}/>
        </div>
        <div style={{textAlign:"center",marginTop:10,fontSize:11,color:G.whiteDim,fontFamily:"'DM Mono'"}}>{Math.round(progress)}%</div>
      </div>
    </div>
  );
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function Auth() {
  const { signIn, signUp } = useAuth();
  const [step,setStep] = useState("login");
  const [role,setRole] = useState("student");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");
  const [loading,setLoading] = useState(false);
  const [errorMsg,setErrorMsg] = useState("");

  const RolePicker = ({roles}: any) => (
    <div style={{display:"grid",gridTemplateColumns:`repeat(${roles.length},1fr)`,gap:8}}>
      {roles.map(({r,ic}: any)=>(
        <button key={r} onClick={()=>setRole(r)} style={{padding:"10px 8px",borderRadius:8,fontSize:12,fontWeight:600,border:`1.5px solid ${role===r?G.gold:G.b5}`,background:role===r?G.goldGlow:G.b4,color:role===r?G.gold:G.whiteDim,cursor:"pointer",textTransform:"capitalize",transition:"all .2s"}}>{ic} {r}</button>
      ))}
    </div>
  );

  const handleLogin = async () => {
    if (!email || !password) { setErrorMsg("Please fill in all fields"); return; }
    setLoading(true); setErrorMsg("");
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setErrorMsg(error.message); return; }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) { setErrorMsg("Please fill in all fields"); return; }
    setLoading(true); setErrorMsg("");
    const { error } = await signUp(email, password, name, role);
    setLoading(false);
    if (error) { setErrorMsg(error.message); return; }
    toast("Check your email to confirm your account!", "success");
    setStep("login");
  };

  const handleForgotPassword = async () => {
    if (!email) { setErrorMsg("Enter your email first"); return; }
    setLoading(true); setErrorMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { setErrorMsg(error.message); return; }
    toast("Check your email for a password reset link!", "success");
    setStep("login");
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:G.black,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${G.goldGlow} 0%,transparent 70%)`,top:-150,right:-150,pointerEvents:"none"}}/>
      <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%)`,bottom:-100,left:-100,pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:420,animation:"fadeUp .5s ease"}}>
        <div style={{textAlign:"center",marginBottom:36,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <img src={NEXGO_LOGO} alt="NexGo" style={{width:180,objectFit:"contain",filter:"drop-shadow(0 0 16px rgba(201,168,76,0.4))"}}/>
          <div style={{color:G.whiteDim,fontSize:13,marginTop:2}}>
            {step==="login"?"Welcome back, campus legend":step==="forgot"?"Reset your password":"Join the campus revolution"}
          </div>
        </div>
        <div style={card({border:`1px solid ${G.b5}`,padding:24})}>
          {errorMsg && <div style={{background:`${G.danger}22`,border:`1px solid ${G.danger}`,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13,color:G.danger}}>{errorMsg}</div>}
          {step==="login"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Lbl>Email</Lbl>
              <input style={inp()} placeholder="you@university.edu.ng" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
              <Lbl>Password</Lbl>
              <input style={inp()} placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
              <button style={{...btn("gold"),width:"100%",padding:"14px",marginTop:6,opacity:loading?.6:1}} onClick={handleLogin} disabled={loading}>
                {loading?<Spinner/>:"Sign In →"}
              </button>
              <div style={{textAlign:"center",fontSize:13,color:G.whiteDim}}>
                <span onClick={()=>{setStep("forgot");setErrorMsg("");}} style={{color:G.gold,cursor:"pointer",fontWeight:600}}>Forgot password?</span>
              </div>
              <div style={{textAlign:"center",fontSize:13,color:G.whiteDim}}>No account? <span onClick={()=>{setStep("register");setErrorMsg("");}} style={{color:G.gold,cursor:"pointer",fontWeight:600}}>Sign up</span></div>
            </div>
          )}
          {step==="forgot"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Lbl>Email</Lbl>
              <input style={inp()} placeholder="you@university.edu.ng" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
              <button style={{...btn("gold"),width:"100%",padding:"14px",marginTop:6,opacity:loading?.6:1}} onClick={handleForgotPassword} disabled={loading}>
                {loading?<Spinner/>:"Send Reset Link →"}
              </button>
              <div style={{textAlign:"center",fontSize:13,color:G.whiteDim}}>
                Remember? <span onClick={()=>{setStep("login");setErrorMsg("");}} style={{color:G.gold,cursor:"pointer",fontWeight:600}}>Sign in</span>
              </div>
            </div>
          )}
          {step==="register"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Lbl>Full Name</Lbl>
              <input style={inp()} placeholder="Chioma Adaeze" value={name} onChange={e=>setName(e.target.value)}/>
              <Lbl>Email</Lbl>
              <input style={inp()} placeholder="you@university.edu.ng" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
              <Lbl>Password</Lbl>
              <input style={inp()} placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
              <Lbl>Register as</Lbl>
              <RolePicker roles={[{r:"student",ic:"🎓"},{r:"vendor",ic:"🍽️"},{r:"rider",ic:"🏍️"}]}/>
              <button style={{...btn("gold"),width:"100%",padding:"14px",opacity:loading?.6:1}} onClick={handleRegister} disabled={loading}>
                {loading?<Spinner/>:"Create Account →"}
              </button>
              <div style={{textAlign:"center",fontSize:13,color:G.whiteDim}}>Have account? <span onClick={()=>{setStep("login");setErrorMsg("");}} style={{color:G.gold,cursor:"pointer",fontWeight:600}}>Sign in</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Student: Home ────────────────────────────────────────────────────────────
function StudentHome({wallet,setTab,profile}: any) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);
    supabase.from("orders").select("id, order_number, total_amount, status, created_at, restaurant_id, restaurants(name)").eq("student_id", user.id).order("created_at", {ascending:false}).limit(5)
      .then(({data}) => { if(data) setOrders(data); setLoadingOrders(false); });
  }, [user]);

  const firstName = profile?.full_name?.split(" ")[0] || "Student";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:24,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{color:G.whiteDim,fontSize:13}}>{greeting},</div>
          <div style={{fontFamily:"'Cormorant Garamond'",fontSize:34,fontWeight:700,color:G.white,lineHeight:1.1}}>{firstName} 👋</div>
        </div>
        <div onClick={()=>setTab("wallet")} style={{background:G.b3,border:`1px solid ${G.b5}`,borderRadius:12,padding:"10px 16px",textAlign:"right",cursor:"pointer"}}>
          <div style={{fontSize:10,color:G.whiteDim,letterSpacing:".05em"}}>WALLET</div>
          <div style={{fontSize:16,fontWeight:700,color:G.gold,fontFamily:"'DM Mono'"}}>₦{wallet.toLocaleString()}</div>
        </div>
      </div>
      <div onClick={()=>setTab("chow")} style={{background:`linear-gradient(135deg,${G.goldDark},${G.gold})`,borderRadius:20,padding:"26px 22px",position:"relative",overflow:"hidden",cursor:"pointer"}}>
        <div style={{position:"absolute",right:-30,top:-30,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
        <div style={{fontSize:11,fontWeight:700,color:G.black,opacity:0.7,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>🎉 Today Only</div>
        <div style={{fontSize:22,fontWeight:700,color:G.black,marginBottom:6}}>Free delivery on NexChow!</div>
        <div style={{fontSize:13,color:G.black,opacity:0.7}}>Order any meal, zero delivery fee</div>
      </div>
      <div>
        <STitle>Quick Actions</STitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:12}}>
          {[{icon:"🍽️",label:"NexChow",sub:"Food & drinks",tab:"chow"},{icon:"📦",label:"Dispatch",sub:"Send packages",tab:"dispatch"},{icon:"🚌",label:"NexTrip",sub:"Campus rides",tab:"trip"}].map((a: any)=>(
            <div key={a.label} onClick={()=>setTab(a.tab)} className="hover-gold" style={{...card({textAlign:"center",cursor:"pointer",padding:16,transition:"all .2s"})}}>
              <div style={{fontSize:30,marginBottom:6}}>{a.icon}</div>
              <div style={{fontWeight:700,fontSize:13,color:G.white}}>{a.label}</div>
              <div style={{fontSize:11,color:G.whiteDim,marginTop:3}}>{a.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <STitle>Recent Orders</STitle>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {loadingOrders ? <LoadingCard/> : orders.length===0 ? <div style={{...card({}),textAlign:"center",color:G.whiteDim,fontSize:14}}>No orders yet. Try NexChow!</div> :
          orders.map((o: any)=>(
            <div key={o.id} style={card({display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"})}>
              <div>
                <div style={{fontWeight:600,fontSize:14,color:G.white}}>{(o.restaurants as any)?.name || "Order"}</div>
                <div style={{fontSize:12,color:G.whiteDim,marginTop:2}}>{o.order_number} · {new Date(o.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:700,color:G.gold,fontFamily:"'DM Mono'",fontSize:13}}>₦{o.total_amount?.toLocaleString()}</div>
                <Badge status={o.status}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Student: NexChow ─────────────────────────────────────────────────────────
function NexChow({onSelect,cart,onCheckout}: any) {
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("All");
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from("restaurants").select("*").eq("is_open", true).order("rating", {ascending:false})
      .then(({data}) => { if(data) setRestaurants(data); setLoading(false); });
  }, []);

  const total=cart.reduce((a: number,c: any)=>a+c.price*c.qty,0);
  const qty=cart.reduce((a: number,c: any)=>a+c.qty,0);
  const cuisines = ["All", ...new Set(restaurants.map((r: any) => r.cuisine))];
  const list=restaurants.filter((r: any)=>{
    const ms=r.name.toLowerCase().includes(search.toLowerCase());
    const mf=filter==="All"||r.cuisine===filter;
    return ms&&mf;
  });
  return (
    <div style={{padding:"24px 16px",animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="NexChow" sub="Order food on campus" icon="🍽️"/>
      <input style={{...inp({marginTop:16,marginBottom:14})}} placeholder="🔍  Search restaurants…" value={search} onChange={e=>setSearch(e.target.value)}/>
      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {cuisines.map((c: any)=>(
          <button key={c} onClick={()=>setFilter(c)} style={{whiteSpace:"nowrap",padding:"8px 16px",borderRadius:20,fontSize:12,fontWeight:600,background:filter===c?G.goldGlow:G.b4,color:filter===c?G.gold:G.whiteDim,border:`1px solid ${filter===c?G.gold:G.b5}`,cursor:"pointer",transition:"all .2s"}}>{c}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14,paddingBottom:qty>0?80:0}}>
        {loading ? <LoadingCard/> : list.map((r: any)=>(
          <div key={r.id} onClick={()=>onSelect(r)} className="hover-gold" style={{...card({cursor:"pointer",display:"flex",gap:14,alignItems:"center",transition:"all .2s"})}}>
            <div style={{width:66,height:66,borderRadius:14,background:G.b4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0}}>{r.image}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontWeight:700,color:G.white,fontSize:15}}>{r.name}</div>
                {r.tag && <Chip>{r.tag}</Chip>}
              </div>
              <div style={{fontSize:12,color:G.whiteDim,marginTop:3}}>{r.cuisine} · {r.price_range||""}</div>
              <div style={{display:"flex",gap:12,marginTop:6,fontSize:12,color:G.whiteDim}}>
                <span>⭐ {r.rating}</span><span>🕐 {r.delivery_time}</span>
              </div>
            </div>
          </div>
        ))}
        {!loading && list.length===0 && <div style={{...card({}),textAlign:"center",color:G.whiteDim}}>No restaurants found</div>}
      </div>
      {qty>0&&(
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:500,zIndex:90}}>
          <button onClick={onCheckout} style={{...btn("gold",{width:"100%",padding:"16px",borderRadius:14,fontSize:15,justifyContent:"space-between",boxShadow:`0 8px 24px rgba(201,168,76,0.35)`,gap:0})}}>
            <span>🛒 {qty} item{qty!==1?"s":""}</span>
            <span>Cart · ₦{total.toLocaleString()}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Student: Restaurant Detail ───────────────────────────────────────────────
function RestaurantDetail({r,cart,setCart,onBack,onCheckout}: any) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from("menu_items").select("*").eq("restaurant_id", r.id).eq("available", true)
      .then(({data}) => { if(data) setMenuItems(data); setLoading(false); });
  }, [r.id]);

  const add=(item: any)=>setCart((p: any)=>{const ex=p.find((c: any)=>c.id===item.id);return ex?p.map((c: any)=>c.id===item.id?{...c,qty:c.qty+1}:c):[...p,{...item,qty:1}];});
  const dec=(item: any)=>setCart((p: any)=>p.map((c: any)=>c.id===item.id?{...c,qty:Math.max(0,c.qty-1)}:c).filter((c: any)=>c.qty>0));
  const qtyOf=(id: string)=>cart.find((c: any)=>c.id===id)?.qty||0;
  const total=cart.reduce((a: number,c: any)=>a+c.price*c.qty,0);
  return (
    <div style={{padding:"24px 16px",animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <button onClick={onBack} style={{...btn("ghost",{padding:"8px 16px",fontSize:13,marginBottom:16})}}>← Back</button>
      <div style={{...card({display:"flex",gap:16,alignItems:"center",marginBottom:20,background:G.b4})}}>
        <div style={{fontSize:52}}>{r.image}</div>
        <div>
          <div style={{fontFamily:"'Cormorant Garamond'",fontSize:24,fontWeight:700,color:G.white}}>{r.name}</div>
          <div style={{fontSize:13,color:G.whiteDim}}>{r.cuisine}</div>
          <div style={{display:"flex",gap:12,marginTop:6,fontSize:13,color:G.gold}}>
            <span>⭐ {r.rating}</span><span>🕐 {r.delivery_time}</span>
          </div>
        </div>
      </div>
      <STitle>Menu</STitle>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12,paddingBottom:total>0?80:0}}>
        {loading ? <LoadingCard/> : menuItems.map((item: any)=>(
          <div key={item.id} style={card({display:"flex",justifyContent:"space-between",alignItems:"center"})}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:32}}>{item.image}</span>
              <div>
                <div style={{fontWeight:600,color:G.white,fontSize:14}}>{item.name}</div>
                <div style={{fontSize:12,color:G.whiteDim}}>{item.description}</div>
                <div style={{color:G.gold,fontWeight:700,fontSize:13,marginTop:4,fontFamily:"'DM Mono'"}}>₦{item.price.toLocaleString()}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {qtyOf(item.id)>0&&(<>
                <button onClick={()=>dec(item)} style={{width:28,height:28,borderRadius:"50%",background:G.b5,color:G.white,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",border:"none",cursor:"pointer"}}>−</button>
                <span style={{color:G.gold,fontWeight:700,minWidth:16,textAlign:"center"}}>{qtyOf(item.id)}</span>
              </>)}
              <button onClick={()=>{add(item);toast(`Added ${item.name}`,"success");}} style={{width:28,height:28,borderRadius:"50%",background:G.gold,color:G.black,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",border:"none",cursor:"pointer",fontWeight:700}}>+</button>
            </div>
          </div>
        ))}
        {!loading && menuItems.length===0 && <div style={{...card({}),textAlign:"center",color:G.whiteDim}}>No menu items available</div>}
      </div>
      {total>0&&(
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:500,zIndex:90}}>
          <button onClick={onCheckout} style={{...btn("gold",{width:"100%",padding:"16px",borderRadius:14,fontSize:15,boxShadow:`0 8px 24px rgba(201,168,76,0.35)`})}}>
            Checkout · ₦{total.toLocaleString()} →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Student: Checkout ────────────────────────────────────────────────────────
function Checkout({cart,setCart,wallet,onBack,onDone,restaurantId}: any) {
  const { user, refreshWallet } = useAuth();
  const [pay,setPay] = useState("wallet");
  const [loading,setLoading] = useState(false);
  const [done,setDone] = useState(false);
  const [address,setAddress] = useState("Hostel B, Room 12");
  const [submittedRef, setSubmittedRef] = useState<string|null>(null);
  const sub=cart.reduce((a: number,c: any)=>a+c.price*c.qty,0);
  const fee=150; const total=sub+fee;

  const place=async()=>{
    if (!user) return;
    if (loading || submittedRef) return; // prevent double submit
    setLoading(true);

    if(pay==="wallet" && wallet<total){toast("Insufficient wallet balance","error");setLoading(false);return;}

    const orderNum = "NX-" + Date.now().toString(36).toUpperCase();
    setSubmittedRef(orderNum);

    const { data: order, error } = await supabase.from("orders").insert({
      order_number: orderNum,
      student_id: user.id,
      restaurant_id: restaurantId,
      total_amount: total,
      delivery_fee: fee,
      delivery_address: address,
      payment_method: pay,
      status: "pending",
    }).select().single();

    if (error) { toast("Failed to place order: " + error.message, "error"); setLoading(false); setSubmittedRef(null); return; }

    // Insert order items
    const items = cart.map((c: any) => ({
      order_id: order.id,
      menu_item_id: c.id,
      name: c.name,
      price: c.price,
      quantity: c.qty,
    }));
    await supabase.from("order_items").insert(items);

    // Deduct wallet if wallet pay
    if (pay === "wallet") {
      const { data: w } = await supabase.from("wallets").select("id, balance").eq("user_id", user.id).maybeSingle();
      if (w) {
        if (w.balance < total) { toast("Insufficient balance", "error"); setLoading(false); return; }
        await supabase.from("wallets").update({ balance: w.balance - total }).eq("id", w.id);
        await supabase.from("wallet_transactions").insert({
          wallet_id: w.id, user_id: user.id, amount: -total, label: `NexChow ${orderNum}`, icon: "🍽️"
        });
        refreshWallet();
      }
    }

    setLoading(false);setDone(true);setCart([]);
    setTimeout(onDone,2500);
  };

  if(done) return (
    <div style={{minHeight:"60vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:24}}>
      <div style={{fontSize:80,animation:"fadeUp .4s ease"}}>🎉</div>
      <div style={{fontFamily:"'Cormorant Garamond'",fontSize:30,fontWeight:700,color:G.gold}}>Order Placed!</div>
      <div style={{color:G.whiteDim,textAlign:"center",fontSize:14}}>Your food is being prepared</div>
    </div>
  );
  return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:18,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <button onClick={onBack} style={{...btn("ghost",{padding:"8px 16px",fontSize:13})}}>← Back</button>
      <PHeader title="Checkout" sub="Confirm your order" icon="🛒"/>
      <div style={card()}>
        <STitle>Order Summary</STitle>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:14}}>
          {cart.map((c: any)=>(
            <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:20}}>{c.image}</span>
                <div>
                  <div style={{fontWeight:600,fontSize:14,color:G.white}}>{c.name}</div>
                  <div style={{fontSize:12,color:G.whiteDim}}>x{c.qty}</div>
                </div>
              </div>
              <div style={{color:G.gold,fontFamily:"'DM Mono'",fontWeight:600}}>₦{(c.price*c.qty).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${G.b5}`,marginTop:16,paddingTop:14,display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:G.whiteDim}}><span>Subtotal</span><span>₦{sub.toLocaleString()}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:G.whiteDim}}><span>Delivery Fee</span><span>₦{fee.toLocaleString()}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:700,color:G.white,marginTop:4}}><span>Total</span><span style={{color:G.gold,fontFamily:"'DM Mono'"}}>₦{total.toLocaleString()}</span></div>
        </div>
      </div>
      <div style={card()}>
        <Lbl>Delivery Address</Lbl>
        <input style={{...inp({marginTop:8})}} value={address} onChange={e=>setAddress(e.target.value)} placeholder="Where should we deliver?"/>
      </div>
      <div style={card()}>
        <Lbl>Payment Method</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
          {[{id:"wallet",label:"💳 Wallet",sub:`₦${wallet.toLocaleString()}`},{id:"korapay",label:"🏦 KoraPay",sub:"Online Pay"}].map((m: any)=>(
            <button key={m.id} onClick={()=>setPay(m.id)} style={{...card({textAlign:"center",cursor:"pointer",border:`1.5px solid ${pay===m.id?G.gold:G.b5}`,background:pay===m.id?G.goldGlow:G.b3,transition:"all .2s"}),width:"100%"}}>
              <div style={{fontWeight:700,fontSize:14,color:G.white}}>{m.label}</div>
              <div style={{fontSize:12,color:G.whiteDim,marginTop:4}}>{m.sub}</div>
            </button>
          ))}
        </div>
      </div>
      <button onClick={place} disabled={loading || !!submittedRef} style={{...btn("gold",{width:"100%",padding:"16px",fontSize:16,borderRadius:14,opacity:(loading||submittedRef)?.6:1})}}>
        {loading?<><Spinner/> Placing Order…</>:"Confirm Order →"}
      </button>
    </div>
  );
}

// ─── Student: NexDispatch ─────────────────────────────────────────────────────
function NexDispatch() {
  const { user } = useAuth();
  const [view,setView] = useState("send");
  const [loading,setLoading] = useState(false);
  const [requested,setRequested] = useState(false);
  const [dispatchId, setDispatchId] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pkgDesc, setPkgDesc] = useState("");
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [loadingDispatches, setLoadingDispatches] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoadingDispatches(true);
    supabase.from("dispatches").select("*").eq("student_id", user.id).order("created_at", {ascending:false}).limit(10)
      .then(({data}) => { if(data) setDispatches(data); setLoadingDispatches(false); });
  }, [user, requested]);

  const doRequest=async()=>{
    if (!user || !pickup || !dropoff) { toast("Fill in pickup and dropoff locations","error"); return; }
    setLoading(true);
    const num = "DP-" + Math.floor(Math.random()*9000+1000);
    const { error } = await supabase.from("dispatches").insert({
      dispatch_number: num, student_id: user.id, pickup_location: pickup, dropoff_location: dropoff, package_description: pkgDesc,
    });
    setLoading(false);
    if (error) { toast(error.message, "error"); return; }
    setDispatchId(num); setRequested(true);
    toast("Rider requested!","success");
  };

  if(requested) return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:400,gap:16,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto"}}>
      <div style={{fontSize:72}}>🏍️</div>
      <div style={{fontFamily:"'Cormorant Garamond'",fontSize:30,fontWeight:700,color:G.gold}}>Rider on the way!</div>
      <div style={{color:G.whiteDim,textAlign:"center",fontSize:14}}>Your package will be picked up in ~8 minutes.</div>
      <div style={{background:`${G.success}22`,border:`1px solid ${G.success}`,borderRadius:14,padding:"16px 24px",textAlign:"center"}}>
        <div style={{fontSize:11,color:G.whiteDim,letterSpacing:".06em",textTransform:"uppercase",marginBottom:4}}>Tracking ID</div>
        <div style={{fontFamily:"'DM Mono'",fontSize:20,fontWeight:700,color:G.gold}}>#{dispatchId}</div>
      </div>
      <button onClick={()=>{setRequested(false);setPickup("");setDropoff("");setPkgDesc("");}} style={{...btn("outline")}}>Send Another</button>
    </div>
  );
  return (
    <div style={{padding:"24px 16px",animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="NexDispatch" sub="Send campus packages" icon="📦"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:20}}>
        {[{id:"send",icon:"📤",label:"Send Package",sub:"Request pickup"},{id:"track",icon:"📍",label:"Track Package",sub:"Live updates"}].map((v: any)=>(
          <button key={v.id} onClick={()=>setView(v.id)} style={{...card({cursor:"pointer",textAlign:"center",border:`1.5px solid ${view===v.id?G.gold:G.b5}`,background:view===v.id?G.goldGlow:G.b3,transition:"all .2s"}),width:"100%"}}>
            <div style={{fontSize:32,marginBottom:8}}>{v.icon}</div>
            <div style={{fontWeight:700,color:G.white}}>{v.label}</div>
            <div style={{fontSize:12,color:G.whiteDim,marginTop:4}}>{v.sub}</div>
          </button>
        ))}
      </div>
      {view==="send"&&(
        <div style={{marginTop:24,display:"flex",flexDirection:"column",gap:14}}>
          <Lbl>Pickup Location</Lbl><input style={inp()} placeholder="e.g. Library, Block A" value={pickup} onChange={e=>setPickup(e.target.value)}/>
          <Lbl>Delivery Location</Lbl><input style={inp()} placeholder="e.g. Hostel B, Room 12" value={dropoff} onChange={e=>setDropoff(e.target.value)}/>
          <Lbl>Package Description</Lbl><input style={inp()} placeholder="e.g. Textbooks x2" value={pkgDesc} onChange={e=>setPkgDesc(e.target.value)}/>
          <div style={{...card({background:G.goldGlow,border:`1px solid ${G.goldDark}`})}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{color:G.whiteDim,fontSize:14}}>Estimated Fee</span>
              <span style={{color:G.gold,fontWeight:700,fontFamily:"'DM Mono'"}}>₦250</span>
            </div>
          </div>
          <button onClick={doRequest} disabled={loading} style={{...btn("gold",{width:"100%",padding:"14px",opacity:loading?.6:1})}}>
            {loading?<><Spinner/> Requesting…</>:"Request Rider →"}
          </button>
        </div>
      )}
      {view==="track"&&(
        <div style={{marginTop:24,display:"flex",flexDirection:"column",gap:14}}>
          {loadingDispatches ? <LoadingCard/> : dispatches.length===0 ? <div style={{...card({}),textAlign:"center",color:G.whiteDim}}>No dispatches yet</div> :
          dispatches.map((d: any)=>(
            <div key={d.id} style={card({display:"flex",justifyContent:"space-between",alignItems:"center"})}>
              <div>
                <div style={{fontWeight:600,color:G.white,fontSize:14}}>{d.package_description || "Package"}</div>
                <div style={{fontSize:12,color:G.whiteDim,marginTop:2}}>{d.pickup_location} → {d.dropoff_location}</div>
                <div style={{fontSize:12,color:G.gold,fontFamily:"'DM Mono'",marginTop:4}}>₦{d.fee}</div>
              </div>
              <Badge status={d.status}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Student: NexTrip ─────────────────────────────────────────────────────────
function NexTrip({wallet}: any) {
  const { user, refreshWallet } = useAuth();
  const [routes, setRoutes] = useState<any[]>([]);
  const [sel,setSel] = useState<any>(null);
  const [booked,setBooked] = useState(false);
  const [loading,setLoading] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  useEffect(() => {
    setLoadingRoutes(true);
    supabase.from("trip_routes").select("*").eq("active", true).then(({data}) => { if(data) setRoutes(data); setLoadingRoutes(false); });
  }, []);

  const doBook=async()=>{
    if (!user || !sel) return;
    setLoading(true);
    if(wallet<sel.price){toast("Insufficient wallet balance","error");setLoading(false);return;}

    const code = "NX-" + Math.random().toString(36).substr(2,6).toUpperCase();
    const { error } = await supabase.from("trip_bookings").insert({
      route_id: sel.id, student_id: user.id, boarding_code: code,
    });
    if (error) { toast(error.message, "error"); setLoading(false); return; }

    // Deduct wallet
    const { data: w } = await supabase.from("wallets").select("id, balance").eq("user_id", user.id).maybeSingle();
    if (w) {
      if (w.balance < sel.price) { toast("Insufficient balance", "error"); setLoading(false); return; }
      await supabase.from("wallets").update({ balance: w.balance - sel.price }).eq("id", w.id);
      await supabase.from("wallet_transactions").insert({
        wallet_id: w.id, user_id: user.id, amount: -sel.price, label: `NexTrip ${sel.from_location} → ${sel.to_location}`, icon: "🚌"
      });
      refreshWallet();
    }

    setLoading(false);setBooked(true);
    toast("Seat booked!","success");
  };

  if(booked&&sel) return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:400,gap:16,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto"}}>
      <div style={{fontSize:72}}>🚌</div>
      <div style={{fontFamily:"'Cormorant Garamond'",fontSize:30,color:G.gold,fontWeight:700}}>Seat Reserved!</div>
      <div style={{color:G.whiteDim,textAlign:"center",fontSize:14}}>Your seat on <strong style={{color:G.white}}>{sel.from_location} → {sel.to_location}</strong> is confirmed.</div>
      <button onClick={()=>{setBooked(false);setSel(null);}} style={{...btn("outline")}}>Book Another</button>
    </div>
  );
  return (
    <div style={{padding:"24px 16px",animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="NexTrip" sub="Campus shuttle booking" icon="🚌"/>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:20}}>
        {loadingRoutes ? <LoadingCard/> : routes.map((r: any)=>(
          <div key={r.id} onClick={()=>setSel(r)} style={{...card({cursor:"pointer",border:`1.5px solid ${sel?.id===r.id?G.gold:G.b5}`,background:sel?.id===r.id?G.goldGlow:G.b3,transition:"all .2s"})}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontWeight:700,color:G.white,fontSize:15}}>{r.from_location}</div>
                <div style={{color:G.gold,fontSize:22,margin:"4px 0"}}>↓</div>
                <div style={{fontWeight:700,color:G.white,fontSize:15}}>{r.to_location}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:G.gold,fontWeight:700,fontFamily:"'DM Mono'",fontSize:18}}>₦{r.price}</div>
                <div style={{fontSize:12,color:G.whiteDim,marginTop:4}}>🚌 {r.seats_available} seats left</div>
                <div style={{fontSize:12,color:G.success,marginTop:2}}>Next: {r.next_departure}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sel&&<button onClick={doBook} disabled={loading} style={{...btn("gold",{width:"100%",padding:"15px",borderRadius:14,fontSize:15,marginTop:20,opacity:loading?.6:1})}}>
        {loading?<Spinner/> :`Book Seat · ₦${sel.price} →`}
      </button>}
    </div>
  );
}

// ─── Student: Wallet ──────────────────────────────────────────────────────────
function WalletScreen({wallet}: any) {
  const { user, profile, refreshWallet } = useAuth();
  const [amt,setAmt] = useState("");
  const [txns,setTxns] = useState<any[]>([]);
  const [fundLoading,setFundLoading] = useState(false);
  const [loadingTxns,setLoadingTxns] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoadingTxns(true);
    supabase.from("wallet_transactions").select("*").eq("user_id", user.id).order("created_at", {ascending:false}).limit(20)
      .then(({data}) => { if(data) setTxns(data); setLoadingTxns(false); });
  }, [user, wallet]);

  const fundWithKorapay = async () => {
    if (!user) return;
    const v = parseInt(amt);
    if (isNaN(v) || v <= 0) { toast("Enter a valid amount", "error"); return; }
    setFundLoading(true);
    const reference = `FUND-${user.id}-${Date.now()}`;
    try {
      const { data, error } = await supabase.functions.invoke("initialize-payment", {
        body: {
          amount: v,
          email: profile?.email || user.email,
          name: profile?.full_name || "User",
          reference,
          redirect_url: window.location.origin,
        },
      });
      if (error) { toast("Payment init failed: " + error.message, "error"); setFundLoading(false); return; }
      const checkoutUrl = data?.data?.checkout_url;
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");
        toast("Complete payment in the new tab", "info");
      } else {
        toast("Could not get checkout URL", "error");
      }
    } catch (e: any) {
      toast("Payment error: " + e.message, "error");
    }
    setFundLoading(false);
  };

  const fundWallet = async () => {
    if (!user) return;
    const v = parseInt(amt);
    if (isNaN(v) || v <= 0) { toast("Enter a valid amount", "error"); return; }
    setFundLoading(true);
    const { data: w } = await supabase.from("wallets").select("id, balance").eq("user_id", user.id).maybeSingle();
    if (!w) { toast("Wallet not found", "error"); setFundLoading(false); return; }
    await supabase.from("wallets").update({ balance: w.balance + v }).eq("id", w.id);
    await supabase.from("wallet_transactions").insert({
      wallet_id: w.id, user_id: user.id, amount: v, label: "Wallet Top-up", icon: "💳"
    });
    refreshWallet();
    setAmt("");
    toast(`₦${v.toLocaleString()} added!`, "success");
    setFundLoading(false);
  };

  return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:20,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="NexWallet" sub="Your campus money" icon="💳"/>
      <div style={{background:`linear-gradient(135deg,${G.goldDark},${G.gold})`,borderRadius:22,padding:"32px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-30,top:-30,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
        <div style={{fontSize:12,color:G.black,opacity:.7,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Total Balance</div>
        <div style={{fontFamily:"'Cormorant Garamond'",fontSize:52,fontWeight:700,color:G.black,lineHeight:1}}>₦{wallet.toLocaleString()}</div>
        <div style={{fontSize:13,color:G.black,opacity:.6,marginTop:8}}>{profile?.full_name}</div>
      </div>
      <div style={card()}>
        <STitle>Fund Wallet</STitle>
        <div style={{display:"flex",gap:8,marginTop:12,marginBottom:12,flexWrap:"wrap"}}>
          {[500,1000,2000,5000].map((v: number)=>(
            <button key={v} onClick={()=>setAmt(String(v))} style={{padding:"8px 14px",borderRadius:20,fontSize:13,fontWeight:600,background:amt===String(v)?G.goldGlow:G.b4,border:`1px solid ${amt===String(v)?G.gold:G.b5}`,color:amt===String(v)?G.gold:G.whiteDim,cursor:"pointer",transition:"all .2s"}}>₦{v.toLocaleString()}</button>
          ))}
        </div>
        <input style={{...inp({marginBottom:12})}} type="number" placeholder="Enter amount…" value={amt} onChange={e=>setAmt(e.target.value)}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <button onClick={fundWithKorapay} disabled={fundLoading} style={{...btn("gold",{width:"100%",padding:"13px",opacity:fundLoading?.6:1})}}>
            {fundLoading?<Spinner/>:"🏦 KoraPay"}
          </button>
          <button onClick={fundWallet} disabled={fundLoading} style={{...btn("outline",{width:"100%",padding:"13px",opacity:fundLoading?.6:1})}}>
            {fundLoading?<Spinner size={14} color={G.gold}/>:"💳 Direct Add"}
          </button>
        </div>
      </div>
      <div>
        <STitle>Transactions</STitle>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12}}>
          {loadingTxns ? <LoadingCard/> : txns.length===0 ? <div style={{...card({}),textAlign:"center",color:G.whiteDim}}>No transactions yet</div> :
          txns.map((tx: any)=>(
            <div key={tx.id} style={card({display:"flex",justifyContent:"space-between",alignItems:"center"})}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:G.b4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{tx.icon}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:G.white}}>{tx.label}</div>
                  <div style={{fontSize:11,color:G.whiteDim}}>{new Date(tx.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{fontWeight:700,fontFamily:"'DM Mono'",fontSize:14,color:tx.amount>0?G.success:G.danger}}>{tx.amount>0?"+":""}₦{Math.abs(tx.amount).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Student: Order Detail (with cancellation & dispute) ──────────────────────
function OrderDetail({order,onBack,onRefresh}: any) {
  const { user, refreshWallet } = useAuth();
  const [loading,setLoading] = useState(false);
  const [cancelReason,setCancelReason] = useState("");
  const [disputeReason,setDisputeReason] = useState("");
  const [showCancel,setShowCancel] = useState(false);
  const [showDispute,setShowDispute] = useState(false);

  const canCancel = order.status === "pending" || order.status === "Pending";
  const canDispute = order.status === "delivered" || order.status === "Delivered";
  const disputeWindow = canDispute && (Date.now() - new Date(order.updated_at || order.created_at).getTime()) < 30 * 60 * 1000;

  const doCancel = async () => {
    if (!user) return;
    setLoading(true);
    // Validate transition
    const { data: validation } = await supabase.rpc("validate_order_transition", {
      _order_id: order.id, _new_status: "cancelled", _user_id: user.id
    });
    if (validation && !(validation as any).valid) {
      toast((validation as any).message || "Cannot cancel this order", "error");
      setLoading(false); return;
    }
    await supabase.from("orders").update({
      status: "cancelled", cancellation_reason: cancelReason || "Student cancelled", cancelled_by: user.id
    }).eq("id", order.id);

    // Refund wallet if paid by wallet
    if (order.payment_method === "wallet") {
      const { data: w } = await supabase.from("wallets").select("id, balance").eq("user_id", user.id).maybeSingle();
      if (w) {
        await supabase.from("wallets").update({ balance: w.balance + order.total_amount }).eq("id", w.id);
        await supabase.from("wallet_transactions").insert({
          wallet_id: w.id, user_id: user.id, amount: order.total_amount, label: `Refund: ${order.order_number}`, icon: "↩️"
        });
        refreshWallet();
      }
    }
    toast("Order cancelled & refunded", "success");
    setLoading(false);
    onRefresh();
  };

  const doDispute = async () => {
    if (!user || !disputeReason) { toast("Please enter a reason", "error"); return; }
    setLoading(true);
    await supabase.from("orders").update({
      status: "under_review", dispute_reason: disputeReason, disputed_at: new Date().toISOString()
    }).eq("id", order.id);
    toast("Dispute filed. Admin will review.", "info");
    setLoading(false);
    onRefresh();
  };

  return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:16,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <button onClick={onBack} style={{...btn("ghost",{padding:"8px 16px",fontSize:13})}}>← Back</button>
      <div style={card()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontFamily:"'Cormorant Garamond'",fontSize:22,fontWeight:700,color:G.white}}>{order.order_number}</div>
          <Badge status={order.status}/>
        </div>
        <div style={{fontSize:14,color:G.whiteDim,marginBottom:8}}>📍 {order.delivery_address}</div>
        <div style={{fontSize:14,color:G.whiteDim,marginBottom:8}}>💳 {order.payment_method}</div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
          <span style={{color:G.whiteDim}}>Total</span>
          <span style={{color:G.gold,fontFamily:"'DM Mono'",fontWeight:700,fontSize:18}}>₦{order.total_amount?.toLocaleString()}</span>
        </div>
      </div>
      {canCancel && !showCancel && (
        <button onClick={()=>setShowCancel(true)} style={{...btn("danger",{width:"100%",padding:"14px"})}}>Cancel Order</button>
      )}
      {showCancel && (
        <div style={card()}>
          <Lbl>Reason for cancellation</Lbl>
          <input style={{...inp({marginTop:8,marginBottom:12})}} value={cancelReason} onChange={e=>setCancelReason(e.target.value)} placeholder="Why are you cancelling?"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <button onClick={()=>setShowCancel(false)} style={{...btn("ghost",{width:"100%"})}}>Back</button>
            <button onClick={doCancel} disabled={loading} style={{...btn("danger",{width:"100%",opacity:loading?.6:1})}}>{loading?<Spinner color={G.white}/>:"Confirm Cancel"}</button>
          </div>
        </div>
      )}
      {disputeWindow && !showDispute && (
        <button onClick={()=>setShowDispute(true)} style={{...btn("outline",{width:"100%",padding:"14px",color:G.danger,borderColor:G.danger})}}>🚩 Report Issue</button>
      )}
      {showDispute && (
        <div style={card()}>
          <Lbl>What went wrong?</Lbl>
          <input style={{...inp({marginTop:8,marginBottom:12})}} value={disputeReason} onChange={e=>setDisputeReason(e.target.value)} placeholder="Describe the issue"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <button onClick={()=>setShowDispute(false)} style={{...btn("ghost",{width:"100%"})}}>Back</button>
            <button onClick={doDispute} disabled={loading} style={{...btn("danger",{width:"100%",opacity:loading?.6:1})}}>{loading?<Spinner color={G.white}/>:"Submit Dispute"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Profile Screen (shared) ──────────────────────────────────────────────────
function ProfileScreen({onLogout}: any) {
  const { profile, role } = useAuth();
  return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:20,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <div style={{textAlign:"center",paddingTop:10}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,${G.goldDark},${G.gold})`,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,fontWeight:700,color:G.black}}>{profile?.full_name?.[0]||"?"}</div>
        <div style={{fontFamily:"'Cormorant Garamond'",fontSize:28,fontWeight:700,color:G.white}}>{profile?.full_name}</div>
        <div style={{color:G.gold,fontSize:12,marginTop:4,fontFamily:"'DM Mono'",textTransform:"capitalize"}}>{role}</div>
      </div>
      <div style={card()}>
        {[{icon:"👤",label:"Edit Profile"},{icon:"🔔",label:"Notifications"},{icon:"🔒",label:"Security & Privacy"},{icon:"❓",label:"Help & Support"}].map((item: any,i: number,arr: any[])=>(
          <div key={item.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:i<arr.length-1?`1px solid ${G.b5}`:"none",cursor:"pointer"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:20}}>{item.icon}</span>
              <span style={{color:G.white,fontWeight:500,fontSize:14}}>{item.label}</span>
            </div>
            <span style={{color:G.whiteDim}}>›</span>
          </div>
        ))}
      </div>
      <button onClick={onLogout} style={{...btn("ghost",{width:"100%",padding:"14px",color:G.danger,border:`1px solid ${G.danger}40`})}}>Sign Out</button>
    </div>
  );
}

// ─── Chat Screen ──────────────────────────────────────────────────────────────
function ChatScreen() {
  const [msgs,setMsgs] = useState([
    {id:1,from:"bot",text:"Hello! 👋 How can I help you today?",time:"Just now"},
  ]);
  const [input,setInput] = useState("");
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=()=>{
    if(!input.trim())return;
    setMsgs((p: any)=>[...p,{id:Date.now(),from:"user",text:input,time:"Now"}]);
    setInput("");
    setTimeout(()=>{setMsgs((p: any)=>[...p,{id:Date.now()+1,from:"bot",text:"Thanks for reaching out! Our team will get back to you shortly. 🙏",time:"Now"}]);},1000);
  };
  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 80px)",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <div style={{padding:"16px",borderBottom:`1px solid ${G.b4}`,display:"flex",gap:12,alignItems:"center",flexShrink:0}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${G.goldDark},${G.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💬</div>
        <div>
          <div style={{fontWeight:600,fontSize:15}}>NexGo Support</div>
          <div style={{fontSize:11,color:G.gold,display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:G.gold,display:"inline-block",animation:"pulse 2s ease infinite"}}/>Online
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
        {msgs.map((m: any)=>(
          <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:m.from==="user"?"flex-end":"flex-start",maxWidth:"80%",alignSelf:m.from==="user"?"flex-end":"flex-start"}}>
            <div style={{padding:"10px 14px",borderRadius:m.from==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.from==="user"?G.gold:G.b4,color:m.from==="user"?G.black:G.white,fontSize:14,lineHeight:1.5,fontWeight:m.from==="user"?500:400}}>{m.text}</div>
            <div style={{fontSize:10,color:G.whiteDim,marginTop:4,padding:"0 4px"}}>{m.time}</div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"12px 16px",borderTop:`1px solid ${G.b4}`,display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
        <input style={{...inp({flex:1})}} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message…"/>
        <button onClick={send} style={{...btn("gold",{padding:"10px 18px",borderRadius:10})}}>Send</button>
      </div>
    </div>
  );
}

// ─── Vendor App ───────────────────────────────────────────────────────────────
function VendorApp({tab,onLogout}: any) {
  const { user, profile } = useAuth();
  const [orders,setOrders] = useState<any[]>([]);
  const [menuItems,setMenuItems] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isOpen,setIsOpen] = useState(true);
  const [loadingData,setLoadingData] = useState(true);
  const [actionLoading,setActionLoading] = useState<string|null>(null);
  // Menu CRUD
  const [showAddMenu,setShowAddMenu] = useState(false);
  const [newItem,setNewItem] = useState({name:"",price:"",description:"",image:"🍚"});

  useEffect(() => {
    if (!user) return;
    supabase.from("restaurants").select("*").eq("owner_id", user.id).limit(1).maybeSingle()
      .then(({data}) => { if(data) { setRestaurant(data); setIsOpen(data.is_open); } });
  }, [user]);

  useEffect(() => {
    if (!restaurant) return;
    setLoadingData(true);
    Promise.all([
      supabase.from("orders").select("*, order_items(*)").eq("restaurant_id", restaurant.id).order("created_at", {ascending:false}).limit(20),
      supabase.from("menu_items").select("*").eq("restaurant_id", restaurant.id),
    ]).then(([ordersRes, menuRes]) => {
      if (ordersRes.data) setOrders(ordersRes.data);
      if (menuRes.data) setMenuItems(menuRes.data);
      setLoadingData(false);
    });

    // Realtime subscription for orders
    const channel = supabase.channel(`vendor-orders-${restaurant.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurant.id}` }, (payload) => {
        if (payload.eventType === "INSERT") {
          setOrders(p => [payload.new as any, ...p]);
          toast("📦 New order received!", "success");
        } else if (payload.eventType === "UPDATE") {
          setOrders(p => p.map(o => o.id === (payload.new as any).id ? {...o, ...(payload.new as any)} : o));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [restaurant]);

  const toggleOpen = async () => {
    if (!restaurant) return;
    const newState = !isOpen;
    await supabase.from("restaurants").update({ is_open: newState }).eq("id", restaurant.id);
    setIsOpen(newState);
    toast(newState ? "Restaurant is now open" : "Restaurant is now closed", "info");
  };

  const nextStatus = async (id: string, current: string) => {
    if (!user) return;
    setActionLoading(id);
    const statusMap: any = { pending: "accepted", accepted: "preparing", preparing: "ready" };
    const next = statusMap[current.toLowerCase()];
    if (!next) { setActionLoading(null); return; }

    const { data: validation } = await supabase.rpc("validate_order_transition", {
      _order_id: id, _new_status: next, _user_id: user.id
    });
    if (validation && !(validation as any).valid) {
      toast((validation as any).message || "Invalid transition", "error");
      setActionLoading(null); return;
    }

    await supabase.from("orders").update({ status: next }).eq("id", id);
    setOrders(p => p.map(o => o.id === id ? {...o, status: next} : o));

    // Generate OTP when marking ready
    if (next === "ready") {
      await supabase.rpc("generate_delivery_otp", { _order_id: id });
      toast("OTP generated for delivery", "info");
    }

    setActionLoading(null);
    toast(`Order moved to ${next}`, "success");
  };

  const cancelOrder = async (id: string) => {
    if (!user) return;
    setActionLoading(id);
    const { data: validation } = await supabase.rpc("validate_order_transition", {
      _order_id: id, _new_status: "cancelled", _user_id: user.id
    });
    if (validation && !(validation as any).valid) {
      toast((validation as any).message || "Cannot cancel", "error");
      setActionLoading(null); return;
    }
    await supabase.from("orders").update({ status: "cancelled", cancelled_by: user.id, cancellation_reason: "Vendor cancelled" }).eq("id", id);
    setOrders(p => p.map(o => o.id === id ? {...o, status: "cancelled"} : o));
    setActionLoading(null);
    toast("Order cancelled", "info");
  };

  const addMenuItem = async () => {
    if (!restaurant || !newItem.name || !newItem.price) { toast("Name and price required", "error"); return; }
    const { error } = await supabase.from("menu_items").insert({
      restaurant_id: restaurant.id, name: newItem.name, price: parseInt(newItem.price), description: newItem.description, image: newItem.image || "🍚",
    });
    if (error) { toast(error.message, "error"); return; }
    toast("Menu item added!", "success");
    setNewItem({name:"",price:"",description:"",image:"🍚"});
    setShowAddMenu(false);
    // Refresh
    const {data} = await supabase.from("menu_items").select("*").eq("restaurant_id", restaurant.id);
    if (data) setMenuItems(data);
  };

  const deleteMenuItem = async (id: string) => {
    await supabase.from("menu_items").delete().eq("id", id);
    setMenuItems(p => p.filter(i => i.id !== id));
    toast("Item removed", "info");
  };

  const restName = restaurant?.name || profile?.full_name || "Vendor";

  const statusLabel = (s: string) => {
    const l: any = {pending:"Accept",accepted:"Start Prep",preparing:"Mark Ready"};
    return l[s.toLowerCase()] || null;
  };

  if(tab==="orders") return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:14,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="Orders" sub="Manage incoming orders" icon="📦"/>
      {loadingData ? <LoadingCard/> : orders.length===0 ? <div style={{...card({}),textAlign:"center",color:G.whiteDim}}>No orders yet</div> :
      orders.map((o: any)=>(
        <div key={o.id} style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontWeight:700,color:G.white}}>{o.order_number}</span><Badge status={o.status}/>
          </div>
          <div style={{fontSize:13,color:G.whiteDim,marginBottom:3}}>{o.order_items?.map((i: any)=>`${i.name} x${i.quantity}`).join(", ")}</div>
          <div style={{fontSize:13,color:G.whiteDim,marginBottom:12}}>{new Date(o.created_at).toLocaleString()}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:G.gold,fontFamily:"'DM Mono'",fontWeight:700}}>₦{o.total_amount?.toLocaleString()}</span>
            <div style={{display:"flex",gap:8}}>
              {statusLabel(o.status) && (
                <button onClick={()=>nextStatus(o.id, o.status)} disabled={actionLoading===o.id} style={{...btn("gold",{padding:"8px 16px",fontSize:12,opacity:actionLoading===o.id?.6:1})}}>
                  {actionLoading===o.id?<Spinner/>:statusLabel(o.status)}
                </button>
              )}
              {["pending","accepted","preparing"].includes(o.status.toLowerCase()) && (
                <button onClick={()=>cancelOrder(o.id)} disabled={actionLoading===o.id} style={{...btn("ghost",{padding:"8px 12px",fontSize:12,color:G.danger})}}>✕</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if(tab==="menu") return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:14,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <PHeader title="Menu" sub="Manage your items" icon="🍽️"/>
        <button onClick={()=>setShowAddMenu(true)} style={{...btn("gold",{padding:"8px 16px",fontSize:12})}}>+ Add Item</button>
      </div>
      {showAddMenu && (
        <div style={card({border:`1.5px solid ${G.gold}`})}>
          <STitle>New Menu Item</STitle>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12}}>
            <input style={inp()} placeholder="Item name" value={newItem.name} onChange={e=>setNewItem(p=>({...p,name:e.target.value}))}/>
            <input style={inp()} type="number" placeholder="Price (₦)" value={newItem.price} onChange={e=>setNewItem(p=>({...p,price:e.target.value}))}/>
            <input style={inp()} placeholder="Description" value={newItem.description} onChange={e=>setNewItem(p=>({...p,description:e.target.value}))}/>
            <input style={inp()} placeholder="Emoji icon (e.g. 🍚)" value={newItem.image} onChange={e=>setNewItem(p=>({...p,image:e.target.value}))}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button onClick={()=>setShowAddMenu(false)} style={{...btn("ghost",{width:"100%"})}}>Cancel</button>
              <button onClick={addMenuItem} style={{...btn("gold",{width:"100%"})}}>Add Item</button>
            </div>
          </div>
        </div>
      )}
      {loadingData ? <LoadingCard/> : menuItems.length===0 ? <div style={{...card({}),textAlign:"center",color:G.whiteDim}}>No menu items yet</div> :
      menuItems.map((item: any)=>(
        <div key={item.id} style={card({display:"flex",justifyContent:"space-between",alignItems:"center"})}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <span style={{fontSize:28}}>{item.image}</span>
            <div>
              <div style={{fontWeight:600,color:G.white,fontSize:14}}>{item.name}</div>
              <div style={{fontSize:12,color:G.whiteDim}}>{item.description}</div>
              <div style={{color:G.gold,fontFamily:"'DM Mono'",fontSize:13,marginTop:3}}>₦{item.price.toLocaleString()}</div>
            </div>
          </div>
          <button onClick={()=>deleteMenuItem(item.id)} style={{background:"transparent",border:"none",color:G.danger,fontSize:18,cursor:"pointer"}}>🗑️</button>
        </div>
      ))}
    </div>
  );

  if(tab==="earnings") return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:20,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="Earnings" sub="Your restaurant income" icon="💰"/>
      <div style={{background:`linear-gradient(135deg,${G.goldDark},${G.gold})`,borderRadius:20,padding:"28px 24px",textAlign:"center"}}>
        <div style={{fontSize:12,color:G.black,opacity:.7,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Total Revenue</div>
        <div style={{fontFamily:"'Cormorant Garamond'",fontSize:48,fontWeight:700,color:G.black}}>₦{orders.reduce((a: number,o: any)=>a+(o.total_amount||0),0).toLocaleString()}</div>
        <div style={{fontSize:13,color:G.black,opacity:.6,marginTop:6}}>{orders.length} orders</div>
      </div>
    </div>
  );

  if(tab==="profile") return <ProfileScreen onLogout={onLogout}/>;
  if(tab==="chat") return <ChatScreen/>;

  // Vendor Dashboard (default)
  return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:20,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{color:G.whiteDim,fontSize:13}}>Welcome back,</div>
          <div style={{fontFamily:"'Cormorant Garamond'",fontSize:30,fontWeight:700,color:G.white}}>{restName} 🍲</div>
        </div>
        <div onClick={toggleOpen} style={{background:isOpen?`${G.success}22`:G.b4,border:`1px solid ${isOpen?G.success:G.b5}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,color:isOpen?G.success:G.whiteDim,cursor:"pointer",transition:"all .3s"}}>
          {isOpen?"🟢 Open":"⚫ Closed"}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[
          {l:"Today's Orders",v:String(orders.filter(o=>new Date(o.created_at).toDateString()===new Date().toDateString()).length),ic:"📦",c:G.gold},
          {l:"Pending",v:String(orders.filter(o=>o.status?.toLowerCase()==="pending").length),ic:"⏳",c:G.danger},
          {l:"Menu Items",v:String(menuItems.length),ic:"🍽️",c:G.goldLight},
          {l:"Avg Rating",v:restaurant?.rating ? `${restaurant.rating} ⭐` : "N/A",ic:"⭐",c:G.success},
        ].map((s: any)=>(
          <div key={s.l} style={card()}>
            <div style={{fontSize:24,marginBottom:6}}>{s.ic}</div>
            <div style={{fontFamily:"'DM Mono'",fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div>
            <div style={{fontSize:12,color:G.whiteDim,marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={card()}>
        <STitle>Recent Orders</STitle>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12}}>
          {loadingData ? <LoadingCard/> : orders.slice(0,3).map((o: any)=>(
            <div key={o.id} style={{padding:14,background:G.b4,borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:600,color:G.white,fontSize:14}}>{o.order_items?.map((i: any)=>i.name).join(", ") || o.order_number}</div>
                <div style={{fontSize:12,color:G.whiteDim}}>{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <Badge status={o.status}/>
                <div style={{color:G.gold,fontFamily:"'DM Mono'",fontSize:13,marginTop:4}}>₦{o.total_amount?.toLocaleString()}</div>
              </div>
            </div>
          ))}
          {!loadingData && orders.length===0 && <div style={{textAlign:"center",color:G.whiteDim,fontSize:13,padding:20}}>No orders yet</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Rider App ────────────────────────────────────────────────────────────────
function RiderApp({tab,onLogout}: any) {
  const { user } = useAuth();
  const [online,setOnline] = useState(true);
  const [deliveries,setDeliveries] = useState<any[]>([]);
  const [dispatches,setDispatches] = useState<any[]>([]);
  const [loadingData,setLoadingData] = useState(true);
  const [actionLoading,setActionLoading] = useState<string|null>(null);
  const [otpInput,setOtpInput] = useState<{[key:string]:string}>({});
  const [showOtp,setShowOtp] = useState<string|null>(null);

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    Promise.all([
      supabase.from("orders").select("*, restaurants(name)").eq("rider_id", user.id).order("created_at", {ascending:false}).limit(20),
      supabase.from("dispatches").select("*").eq("rider_id", user.id).order("created_at", {ascending:false}).limit(20),
    ]).then(([ordersRes, dispatchRes]) => {
      if (ordersRes.data) setDeliveries(ordersRes.data);
      if (dispatchRes.data) setDispatches(dispatchRes.data);
      setLoadingData(false);
    });

    // Realtime for rider assignments
    const channel = supabase.channel(`rider-${user.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `rider_id=eq.${user.id}` }, (payload) => {
        setDeliveries(p => {
          const exists = p.find(d => d.id === (payload.new as any).id);
          if (exists) return p.map(d => d.id === (payload.new as any).id ? {...d, ...(payload.new as any)} : d);
          return [payload.new as any, ...p];
        });
        toast("📦 Order updated!", "info");
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "dispatches", filter: `rider_id=eq.${user.id}` }, (payload) => {
        setDispatches(p => p.map(d => d.id === (payload.new as any).id ? {...d, ...(payload.new as any)} : d));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const updateOrder = async (id: string, newStatus: string) => {
    if (!user) return;
    setActionLoading(id);

    // For delivered, require OTP
    if (newStatus === "delivered") {
      const otp = otpInput[id];
      if (!otp) { setShowOtp(id); setActionLoading(null); return; }
      const { data: otpValid } = await supabase.rpc("verify_delivery_otp", { _order_id: id, _otp: otp });
      if (!otpValid) { toast("Invalid or expired OTP", "error"); setActionLoading(null); return; }
    }

    const { data: validation } = await supabase.rpc("validate_order_transition", {
      _order_id: id, _new_status: newStatus, _user_id: user.id
    });
    if (validation && !(validation as any).valid) {
      toast((validation as any).message || "Invalid transition", "error");
      setActionLoading(null); return;
    }

    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    setDeliveries(p => p.map(d => d.id === id ? {...d, status: newStatus} : d));
    setActionLoading(null);
    setShowOtp(null);
    toast(`Order marked as ${newStatus}`, "success");
  };

  const updateDispatch = async (id: string, status: string) => {
    setActionLoading(id);
    await supabase.from("dispatches").update({ status }).eq("id", id);
    setDispatches(p => p.map(d => d.id === id ? {...d, status} : d));
    setActionLoading(null);
    toast(`Dispatch ${status}`, "success");
  };

  if(tab==="profile") return <ProfileScreen onLogout={onLogout}/>;
  if(tab==="chat") return <ChatScreen/>;

  if(tab==="earnings") return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:20,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="Earnings" sub="Your delivery income" icon="💰"/>
      <div style={{background:`linear-gradient(135deg,${G.goldDark},${G.gold})`,borderRadius:20,padding:"28px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{fontSize:12,color:G.black,opacity:.7,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Deliveries</div>
        <div style={{fontFamily:"'Cormorant Garamond'",fontSize:48,fontWeight:700,color:G.black}}>{deliveries.length + dispatches.length}</div>
        <div style={{fontSize:13,color:G.black,opacity:.6,marginTop:6}}>total assignments</div>
      </div>
    </div>
  );

  // Rider Dashboard
  return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:20,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{color:G.whiteDim,fontSize:13}}>Rider Dashboard</div>
          <div style={{fontFamily:"'Cormorant Garamond'",fontSize:30,fontWeight:700,color:G.white}}>🏍️</div>
        </div>
        <div onClick={()=>setOnline(o=>!o)} style={{background:online?`${G.success}22`:G.b4,border:`1.5px solid ${online?G.success:G.b5}`,borderRadius:20,padding:"8px 16px",cursor:"pointer",fontSize:12,fontWeight:700,color:online?G.success:G.whiteDim,transition:"all .3s"}}>
          {online?"🟢 Online":"⚫ Offline"}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[{v:String(deliveries.length),l:"Orders"},{v:String(dispatches.length),l:"Dispatches"}].map((s: any)=>(
          <div key={s.l} style={card({textAlign:"center"})}>
            <div style={{fontFamily:"'DM Mono'",fontSize:18,fontWeight:700,color:G.gold}}>{s.v}</div>
            <div style={{fontSize:11,color:G.whiteDim,marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
      {loadingData ? <LoadingCard/> : <>
        <STitle>Active Orders</STitle>
        {deliveries.filter(d=>!["delivered","done","cancelled"].includes(d.status?.toLowerCase())).map((d: any)=>(
          <div key={d.id} style={card({border:`1.5px solid ${G.gold}`})}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <span style={{fontWeight:700,color:G.white}}>{d.order_number}</span><Badge status={d.status}/>
            </div>
            <div style={{fontSize:13,color:G.whiteDim,marginBottom:4}}>🏪 {(d.restaurants as any)?.name}</div>
            {d.delivery_address && <div style={{fontSize:13,color:G.whiteDim}}>🏠 {d.delivery_address}</div>}
            {showOtp===d.id && (
              <div style={{marginTop:12,display:"flex",gap:8}}>
                <input style={{...inp({flex:1})}} placeholder="Enter delivery OTP" value={otpInput[d.id]||""} onChange={e=>setOtpInput(p=>({...p,[d.id]:e.target.value}))}/>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
              <span style={{color:G.gold,fontFamily:"'DM Mono'",fontWeight:700}}>₦{d.delivery_fee}</span>
              <button onClick={()=>{
                const s = d.status?.toLowerCase();
                if (s==="ready") updateOrder(d.id, "out_for_delivery");
                else if (s==="out_for_delivery") updateOrder(d.id, "delivered");
              }} disabled={actionLoading===d.id} style={{...btn("gold",{padding:"8px 16px",fontSize:13,opacity:actionLoading===d.id?.6:1})}}>
                {actionLoading===d.id?<Spinner/>:d.status?.toLowerCase()==="ready"?"Pick Up":"Deliver"}
              </button>
            </div>
          </div>
        ))}
        <STitle>Dispatch Pickups</STitle>
        {dispatches.filter(d=>!["delivered","done"].includes(d.status?.toLowerCase())).map((d: any)=>(
          <div key={d.id} style={card()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontWeight:700,color:G.white}}>{d.dispatch_number}</span><Badge status={d.status}/>
            </div>
            <div style={{fontSize:13,color:G.whiteDim}}>📍 {d.pickup_location} → {d.dropoff_location}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
              <span style={{color:G.gold,fontFamily:"'DM Mono'"}}>₦{d.fee}</span>
              <button onClick={()=>updateDispatch(d.id, d.status?.toLowerCase()==="pending"?"In Transit":"Delivered")} disabled={actionLoading===d.id} style={{...btn("gold",{padding:"8px 16px",fontSize:12,opacity:actionLoading===d.id?.6:1})}}>
                {actionLoading===d.id?<Spinner/>:d.status?.toLowerCase()==="pending"?"Accept":"Complete"}
              </button>
            </div>
          </div>
        ))}
        {deliveries.length===0 && dispatches.length===0 && <div style={{...card({}),textAlign:"center",color:G.whiteDim}}>No active deliveries</div>}
      </>}
    </div>
  );
}

// ─── Admin App ────────────────────────────────────────────────────────────────
function AdminApp({tab,onLogout}: any) {
  const { user } = useAuth();
  const [users,setUsers] = useState<any[]>([]);
  const [search,setSearch] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loadingData,setLoadingData] = useState(true);
  // Fee settings
  const [settings,setSettings] = useState<any[]>([]);
  const [settingsLoading,setSettingsLoading] = useState(false);

  useEffect(() => {
    setLoadingData(true);
    Promise.all([
      supabase.from("profiles").select("id, full_name, created_at, avatar_url").order("created_at", {ascending:false}),
      supabase.from("orders").select("id, order_number, total_amount, status, created_at").order("created_at", {ascending:false}).limit(50),
      supabase.from("restaurants").select("*"),
      supabase.from("platform_settings").select("*"),
    ]).then(async ([profilesRes, ordersRes, restRes, settingsRes]) => {
      if (profilesRes.data) {
        const enriched = await Promise.all(profilesRes.data.map(async (p: any) => {
          const { data: roleData } = await supabase.rpc("get_user_role", { _user_id: p.id });
          return { ...p, role: roleData || "student" };
        }));
        setUsers(enriched);
      }
      if (ordersRes.data) setOrders(ordersRes.data);
      if (restRes.data) setRestaurants(restRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
      setLoadingData(false);
    });
  }, []);

  const updateSetting = async (key: string, value: number) => {
    setSettingsLoading(true);
    await supabase.from("platform_settings").update({ value, updated_by: user?.id }).eq("key", key);
    setSettings(p => p.map(s => s.key === key ? {...s, value} : s));
    setSettingsLoading(false);
    toast(`${key} updated to ${value}`, "success");
  };

  if(tab==="users") return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:14,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="Users" sub="Manage all users" icon="👥"/>
      <input style={inp()} placeholder="🔍  Search users…" value={search} onChange={e=>setSearch(e.target.value)}/>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {loadingData ? <LoadingCard/> :
        users.filter((u: any)=>u.full_name?.toLowerCase().includes(search.toLowerCase())||u.role?.toLowerCase().includes(search.toLowerCase())).map((u: any)=>(
          <div key={u.id} style={card()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${G.goldDark},${G.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:G.black}}>{u.full_name?.[0]||"?"}</div>
                <div>
                  <div style={{fontWeight:600,color:G.white,fontSize:14}}>{u.full_name}</div>
                  <div style={{fontSize:11,color:G.whiteDim,textTransform:"capitalize"}}>{u.role} · Joined {new Date(u.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if(tab==="analytics") return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:20,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="Analytics" sub="Platform insights" icon="📈"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[{l:"Total Users",v:String(users.length),ic:"👥"},{l:"Total Orders",v:String(orders.length),ic:"📦"},{l:"Restaurants",v:String(restaurants.length),ic:"🍽️"},{l:"Revenue",v:`₦${orders.reduce((a: number,o: any)=>a+(o.total_amount||0),0).toLocaleString()}`,ic:"💰"}].map((s: any)=>(
          <div key={s.l} style={card()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:12,color:G.whiteDim,marginBottom:6}}>{s.l}</div>
                <div style={{fontFamily:"'DM Mono'",fontSize:22,fontWeight:700,color:G.gold}}>{s.v}</div>
              </div>
              <span style={{fontSize:24}}>{s.ic}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if(tab==="settings") return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:16,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="Fee Settings" sub="Platform fee configuration" icon="⚙️"/>
      {settings.map((s: any)=>(
        <div key={s.id} style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:600,color:G.white,fontSize:14,textTransform:"capitalize"}}>{s.key.replace(/_/g," ")}</div>
              <div style={{fontSize:12,color:G.whiteDim,marginTop:2}}>Last updated: {new Date(s.updated_at).toLocaleDateString()}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <input
                type="number"
                style={{...inp({width:100,textAlign:"right"})}}
                value={s.value}
                onChange={e=>{
                  const newVal = parseInt(e.target.value) || 0;
                  setSettings(p => p.map(x => x.key === s.key ? {...x, value: newVal} : x));
                }}
              />
              <button onClick={()=>updateSetting(s.key, s.value)} disabled={settingsLoading} style={{...btn("gold",{padding:"8px 14px",fontSize:12})}}>Save</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if(tab==="profile") return <ProfileScreen onLogout={onLogout}/>;

  // Admin Dashboard
  return (
    <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:20,animation:"fadeUp .4s ease",maxWidth:800,margin:"0 auto",width:"100%"}}>
      <PHeader title="Admin Panel" sub="NexGo operations overview" icon="⚙️"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[{label:"Total Users",value:String(users.length),icon:"👥"},{label:"Orders",value:String(orders.length),icon:"📦"},{label:"Restaurants",value:String(restaurants.length),icon:"🍽️"},{label:"Revenue",value:`₦${orders.reduce((a: number,o: any)=>a+(o.total_amount||0),0).toLocaleString()}`,icon:"💰"}].map((s: any)=>(
          <div key={s.label} style={card()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:12,color:G.whiteDim,marginBottom:6}}>{s.label}</div>
                <div style={{fontFamily:"'DM Mono'",fontSize:22,fontWeight:700,color:G.gold}}>{s.value}</div>
              </div>
              <span style={{fontSize:24}}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={card()}>
        <STitle>Recent Users</STitle>
        {loadingData ? <LoadingCard/> :
        users.slice(0,5).map((u: any,i: number,arr: any[])=>(
          <div key={u.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<arr.length-1?`1px solid ${G.b5}`:"none"}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${G.goldDark},${G.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:G.black}}>{u.full_name?.[0]||"?"}</div>
              <div>
                <div style={{fontWeight:600,color:G.white,fontSize:14}}>{u.full_name}</div>
                <div style={{fontSize:11,color:G.whiteDim,textTransform:"capitalize"}}>{u.role} · {new Date(u.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Disputed orders */}
      <div style={card()}>
        <STitle>🚩 Disputed Orders</STitle>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12}}>
          {orders.filter(o=>o.status==="under_review").length===0 && <div style={{textAlign:"center",color:G.whiteDim,fontSize:13,padding:10}}>No disputed orders</div>}
          {orders.filter(o=>o.status==="under_review").map((o: any)=>(
            <div key={o.id} style={{padding:14,background:G.b4,borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:600,color:G.white,fontSize:14}}>{o.order_number}</div>
                <div style={{fontSize:12,color:G.danger}}>Under Review</div>
              </div>
              <span style={{color:G.gold,fontFamily:"'DM Mono'",fontSize:13}}>₦{o.total_amount?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App (inner, uses auth context) ──────────────────────────────────────
function NexGoInner() {
  useEffect(()=>{ injectStyles(); },[]);
  const { user, profile, role: authRole, walletBalance, loading: authLoading, signOut } = useAuth();
  const [screen,setScreen] = useState("splash");
  const [cart,setCart] = useState<any[]>([]);
  const [tab,setTab] = useState("home");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;
    if (user && authRole) {
      setTab({student:"home",vendor:"dashboard",rider:"rdashboard",admin:"adashboard"}[authRole] || "home");
      setScreen("app");
    } else if (!user && screen === "app") {
      setScreen("auth");
    }
  }, [user, authRole, authLoading]);

  const handleLogout = async () => {
    await signOut();
    setScreen("auth");
    setTab("home");
    setCart([]);
  };

  const role = authRole || "student";

  const StudentContent=()=>{
    const [restaurant,setRestaurant] = useState<any>(null);
    const [atCheckout,setAtCheckout] = useState(false);

    if (selectedOrder) return <OrderDetail order={selectedOrder} onBack={()=>setSelectedOrder(null)} onRefresh={()=>setSelectedOrder(null)}/>;
    if(tab==="chow"){
      if(atCheckout && restaurant) return <Checkout cart={cart} setCart={setCart} wallet={walletBalance} onBack={()=>setAtCheckout(false)} onDone={()=>{setAtCheckout(false);setTab("home");}} restaurantId={restaurant.id}/>;
      if(restaurant) return <RestaurantDetail r={restaurant} cart={cart} setCart={setCart} onBack={()=>setRestaurant(null)} onCheckout={()=>setAtCheckout(true)}/>;
      return <NexChow onSelect={setRestaurant} cart={cart} onCheckout={()=>setAtCheckout(true)}/>;
    }
    if(tab==="dispatch") return <NexDispatch/>;
    if(tab==="trip")     return <NexTrip wallet={walletBalance}/>;
    if(tab==="wallet")   return <WalletScreen wallet={walletBalance}/>;
    if(tab==="profile")  return <ProfileScreen onLogout={handleLogout}/>;
    if(tab==="chat")     return <ChatScreen/>;
    return <StudentHome wallet={walletBalance} setTab={setTab} profile={profile}/>;
  };

  const AppContent = (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:G.black,position:"relative"}}>
      <ToastContainer/>
      <div style={{flex:1,overflowY:"auto",paddingBottom:80}}>
        {role==="student"&&<StudentContent/>}
        {role==="vendor" &&<VendorApp tab={tab} onLogout={handleLogout}/>}
        {role==="rider"  &&<RiderApp tab={tab} onLogout={handleLogout}/>}
        {role==="admin"  &&<AdminApp tab={tab} onLogout={handleLogout}/>}
      </div>
      <BottomNav role={role} tab={tab} setTab={setTab} cartCount={cart.reduce((a: number,c: any)=>a+c.qty,0)}/>
    </div>
  );

  if(screen==="splash"){
    return <Splash onDone={()=>setScreen(user ? "app" : "auth")}/>;
  }

  if(screen==="auth"){
    if (authLoading) {
      return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:G.black}}>
        <Spinner size={32} color={G.gold}/>
      </div>;
    }
    return <Auth/>;
  }

  return AppContent;
}

// ─── Wrapped export ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <NexGoInner />
    </AuthProvider>
  );
}
