"use strict";
/* ---------- constants ---------- */
const DOCS=["event","guests","tables","vendors","budget","tasks","schedule"];
const VIEWS=[["home","לוח בקרה"],["guests","מוזמנים"],["rsvp","אישורי הגעה"],["seating","הושבה"],["gifts","מתנות"],["vendors","ספקים וחוזים"],["budget","תקציב"],["tasks","משימות"],["day","יום האירוע"],["settings","הגדרות"]];
const SIDES={groom:"צד החתן",bride:"צד הכלה",shared:"משותף"};
const STATUS={pending:"לא ענה",yes:"מגיע",maybe:"אולי",no:"לא מגיע"};
const MEALS=["רגיל","צמחוני","טבעוני","ללא גלוטן","ילדים"];
const CATS=["אולם וקייטרינג","צילום ווידאו","מוזיקה ודיג'יי","שמלה וחליפה","איפור ושיער","עיצוב ופרחים","הזמנות ומדיה","טבעות","רב ורבנות","בר ואלכוהול","הסעות","שונות"];
const CAT_PCT=[45,9,6,6,2,7,1,5,2,4,2,11];
const VSTATUS={lead:"בבדיקה",offer:"התקבלה הצעה",closed:"נסגר",rejected:"ירד מהפרק"};
const PAYERS={couple:"הזוג",bride_p:"הורי הכלה",groom_p:"הורי החתן"};
const payerSel=(name,id,val,act,dataAttrs)=>`<select name="${name}" id="${id}" ${act?`data-act="${act}"`:""} ${dataAttrs||""} aria-label="מי שילם"><option value="">מי משלם?</option>${Object.entries(PAYERS).map(([k,l])=>`<option value="${k}" ${val===k?"selected":""}>${l}</option>`).join("")}</select>`;
const GIFT_TYPES=["מזומן","צ'ק","ביט / פייבוקס","העברה בנקאית","שובר","מתנה"];
const CONTRACT=["מחיר סופי כולל מע\"מ","מה כלול ומה לא כלול","מינימום מנות / שעות עבודה","לוח תשלומים מוסכם","תנאי ביטול ודחייה","עלות שעות נוספות","סעיף כוח עליון","איש קשר ביום האירוע"];
const TASKS_TPL=[
 ["יסודות","קביעת תקציב כולל ומי מממן מה",360],["יסודות","הערכת כמות מוזמנים ראשונית מכל צד",350],["יסודות","בחירת תאריך ותאריכי גיבוי",345],["יסודות","סיור ב-3 אולמות לפחות והשוואת הצעות",330],["יסודות","חתימה על חוזה עם האולם",300],
 ["ספקים מרכזיים","סגירת צלם ווידאו",280],["ספקים מרכזיים","סגירת דיג'יי / להקה",270],["ספקים מרכזיים","בחירת רב / עורך טקס",250],["ספקים מרכזיים","סגירת מעצב/ת אירוע ופרחים",220],
 ["רשימת מוזמנים","כל צד מעביר רשימת מוזמנים מלאה",200],["רשימת מוזמנים","ניקוי כפילויות וסימון עדיפויות א/ב/ג",180],["רשימת מוזמנים","קיצוץ לפי מכסה וסגירת רשימה",160],
 ["עיצוב ושאר הספקים","בחירת שמלה ומדידות",180],["עיצוב ושאר הספקים","בחירת חליפה",120],["עיצוב ושאר הספקים","ניסיון איפור ושיער",60],["עיצוב ושאר הספקים","הזמנת טבעות",90],["עיצוב ושאר הספקים","סגירת הסעות למוזמנים",75],["עיצוב ושאר הספקים","פתיחת תיק נישואין ברבנות",90],["עיצוב ושאר הספקים","בחירת שירים לחופה ולכניסה",40],
 ["הזמנות ואישורים","עיצוב הזמנה דיגיטלית",60],["הזמנות ואישורים","שליחת הזמנות לכל המוזמנים",42],["הזמנות ואישורים","סבב תזכורת ראשון למי שלא ענה",21],["הזמנות ואישורים","סבב תזכורת שני",14],["הזמנות ואישורים","טלפונים אישיים למי שעדיין לא ענה",9],
 ["הושבה וסגירה","סידור הושבה ראשון",14],["הושבה וסגירה","מסירת מספר מנות סופי לאולם",5],["הושבה וסגירה","מסירת דו\"ח מנות מיוחדות",5],["הושבה וסגירה","הדפסת רשימת כניסה לפי א-ב",3],["הושבה וסגירה","אישור לו\"ז סופי עם כל הספקים",3],["הושבה וסגירה","הכנת מעטפות תשלום לספקים",2],
 ["אחרי החתונה","רישום כל המתנות",-3],["אחרי החתונה","תשלומי יתרה לספקים",-7],["אחרי החתונה","שליחת תודות לאורחים",-30],["אחרי החתונה","סיכום מאזן האירוע",-30]
];
const SCHED_TPL=[["16:00","הגעת צלם להתארגנות","צלם"],["17:30","צילומי זוג ומשפחה","צלם"],["19:00","קבלת פנים","אולם"],["20:15","קבלת פנים לכלה","מפיקה"],["20:45","חופה","רב"],["21:15","כניסה לאולם וריקוד ראשון","דיג'יי"],["21:30","מנה ראשונה","אולם"],["22:00","סבב ריקודים ראשון","דיג'יי"],["22:45","מנה עיקרית","אולם"],["23:15","סבב ריקודים שני","דיג'יי"],["00:30","סיום ותשלום לספקים","הורים"]];

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid=()=>(window.crypto&&crypto.randomUUID)?crypto.randomUUID():Math.random().toString(36).slice(2,10)+Date.now().toString(36);
const nf=new Intl.NumberFormat("he-IL",{maximumFractionDigits:0});
const money=n=>"₪"+nf.format(Math.round(n||0));
const num=v=>{const n=parseFloat(String(v).replace(/[^\d.\-]/g,""));return isFinite(n)?n:0};
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const parseD=s=>{if(!s)return null;const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const fdate=s=>{const d=parseD(s);return d?d.toLocaleDateString("he-IL",{day:"numeric",month:"short",year:"numeric"}):"—"};
const daysTo=s=>{const d=parseD(s);return d?Math.round((d-today())/864e5):null};
const normPhone=p=>{let d=String(p||"").replace(/\D/g,"");if(d.startsWith("972"))return d;if(d.startsWith("0"))return "972"+d.slice(1);return d};
const addDays=(s,n)=>{const d=parseD(s);if(!d)return null;d.setDate(d.getDate()+n);return iso(d)};

/* ---------- state & store ---------- */
let S=blank();
function blank(){return{event:{},guests:{items:[]},tables:{items:[]},vendors:{items:[]},budget:{plans:{},expenses:[],pledges:{}},tasks:{items:[]},schedule:{items:[]}}}
const CFG=window.CHUPPAH_CONFIG||{};
let sb=null, session=null, eventId=null, myRole="owner", memberships=[], loaded=false, anyDoc=false, view="home", pendingRender=false;
let dirty={}, writing={}, timers={}, synced={}, refetchQueued={};
const LS="chuppah-local-v1";
const cloud=()=>!!sb;
function lsSave(){if(cloud())return;try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
function lsLoad(){try{const v=JSON.parse(localStorage.getItem(LS)||"null");if(v&&v.event)return v}catch(e){}return null}
function setSync(t){$("#sync").textContent=t}
const nz=v=>v===""||v==null?null:v;

/* row mappers: app shape <-> database rows */
const T={
  guests:{
    rows:()=>S.guests.items.map(g=>{const gf=g.gift||{};return{id:g.id,name:g.name||"",phone:g.phone||"",side:g.side||"shared",grp:g.group||"",invited:num(g.invited),status:g.status||"pending",coming:g.coming==null||g.coming===""?null:num(g.coming),priority:g.priority||"A",meal:g.meal||"רגיל",table_id:g.table||null,arrived:!!g.arrived,sent_at:nz(g.sentAt),reminders:num(g.reminders),notes:g.notes||"",gift_type:gf.type||"",gift_amount:num(gf.amount),gift_note:gf.note||"",gift_thanked:!!gf.thanked}}),
    apply:rs=>{S.guests.items=rs.map(r=>({id:r.id,name:r.name,phone:r.phone,side:r.side,group:r.grp,invited:r.invited,status:r.status,coming:r.coming,priority:r.priority,meal:r.meal,table:r.table_id,arrived:r.arrived,sentAt:r.sent_at||"",reminders:r.reminders,notes:r.notes,gift:{type:r.gift_type,amount:num(r.gift_amount)||"",note:r.gift_note,thanked:r.gift_thanked}}))}},
  seating_tables:{
    rows:()=>S.tables.items.map(t=>({id:t.id,name:String(t.name||""),seats:num(t.seats)})),
    apply:rs=>{S.tables.items=rs.map(r=>({id:r.id,name:r.name,seats:r.seats}))}},
  vendors:{
    rows:()=>S.vendors.items.map(v=>({id:v.id,name:v.name||"",cat:v.cat||"שונות",status:v.status||"lead",price:num(v.price),contact:v.contact||"",phone:v.phone||"",notes:v.notes||"",contract_signed:!!(v.contract&&v.contract.signed),contract_checks:(v.contract&&v.contract.checks)||{}})),
    apply:rs=>{const old=Object.fromEntries(S.vendors.items.map(v=>[v.id,v.payments||[]]));S.vendors.items=rs.map(r=>({id:r.id,name:r.name,cat:r.cat,status:r.status,price:num(r.price),contact:r.contact,phone:r.phone,notes:r.notes,contract:{signed:r.contract_signed,checks:r.contract_checks||{}},payments:old[r.id]||[]}))}},
  vendor_payments:{
    rows:()=>S.vendors.items.flatMap(v=>(v.payments||[]).map(p=>({id:p.id,vendor_id:v.id,label:p.label||"תשלום",amount:num(p.amount),due:nz(p.due),paid:!!p.paid,payer:p.payer||""}))),
    apply:rs=>{const by={};rs.forEach(r=>(by[r.vendor_id]=by[r.vendor_id]||[]).push({id:r.id,label:r.label,amount:num(r.amount),due:r.due||"",paid:r.paid,payer:r.payer}));S.vendors.items.forEach(v=>v.payments=(by[v.id]||[]).sort((a,b)=>(a.due||"9").localeCompare(b.due||"9")))}},
  expenses:{
    rows:()=>S.budget.expenses.map(x=>({id:x.id,title:x.title||"",cat:x.cat||"שונות",amount:num(x.amount),paid:!!x.paid,payer:x.payer||""})),
    apply:rs=>{S.budget.expenses=rs.map(r=>({id:r.id,title:r.title,cat:r.cat,amount:num(r.amount),paid:r.paid,payer:r.payer}))}},
  tasks:{
    rows:()=>S.tasks.items.map(t=>({id:t.id,phase:t.phase||"כללי",title:t.title||"",days_before:t.days==null?null:num(t.days),due:nz(t.due),done:!!t.done,owner:t.owner||""})),
    apply:rs=>{S.tasks.items=rs.map(r=>({id:r.id,phase:r.phase,title:r.title,days:r.days_before,due:r.due||"",done:r.done,owner:r.owner}))}},
  schedule_items:{
    rows:()=>S.schedule.items.map(x=>({id:x.id,time:x.time||"",title:x.title||"",owner:x.owner||""})),
    apply:rs=>{S.schedule.items=rs.map(r=>({id:r.id,time:r.time,title:r.title,owner:r.owner}))}}
};
const MODULE_TABLES={guests:["guests"],tables:["seating_tables"],vendors:["vendors","vendor_payments"],budget:["expenses"],tasks:["tasks"],schedule:["schedule_items"],event:[]};
const TABLE_MODULE={guests:"guests",seating_tables:"tables",vendors:"vendors",vendor_payments:"vendors",expenses:"budget",tasks:"tasks",schedule_items:"schedule"};
function eventRow(){const e=S.event;return{groom:e.groom||"",bride:e.bride||"",date:nz(e.date),time:e.time||"",venue:e.venue||"",address:e.address||"",budget:num(e.budget),guest_quota:num(e.guestQuota),price_per_plate:num(e.pricePerPlate),min_plates:num(e.minPlates),avg_gift:num(e.avgGift),pending_rate:num(e.pendingRate===""||e.pendingRate==null?75:e.pendingRate),invite_text:e.inviteText||"",sample:!!e.sample,budget_plans:S.budget.plans||{},pledges:S.budget.pledges||{}}}
function applyEvent(r){S.event={groom:r.groom,bride:r.bride,date:r.date||"",time:r.time,venue:r.venue,address:r.address,budget:num(r.budget),guestQuota:r.guest_quota,pricePerPlate:num(r.price_per_plate),minPlates:r.min_plates,avgGift:num(r.avg_gift),pendingRate:r.pending_rate,inviteText:r.invite_text,sample:r.sample};S.budget.plans=r.budget_plans||{};S.budget.pledges=r.pledges||{}}

function save(k){
  lsSave();
  if(!cloud()){setSync("נשמר במכשיר הזה");return}
  if(readOnly()){setSync("צפייה בלבד: השינוי לא נשמר");return}
  clearTimeout(timers[k]);
  timers[k]=setTimeout(()=>{timers[k]=null;flush(k)},400);
  setSync("שומר…");
}
function saveAll(){DOCS.forEach(save)}
async function syncTable(t){
  const rows=T[t].rows().map(r=>Object.assign(r,{event_id:eventId}));
  const prev=synced[t]||new Map();const next=new Map();const up=[];
  rows.forEach(r=>{const j=JSON.stringify(r);next.set(r.id,j);if(prev.get(r.id)!==j)up.push(r)});
  const del=[...prev.keys()].filter(id=>!next.has(id));
  for(let i=0;i<up.length;i+=500){const {error}=await sb.from(t).upsert(up.slice(i,i+500));if(error)throw error}
  if(del.length){const {error}=await sb.from(t).delete().in("id",del);if(error)throw error}
  synced[t]=next;
}
async function flush(k){
  if(writing[k]){dirty[k]=true;return}
  writing[k]=true;
  try{
    if(k==="event"||k==="budget"){const {error}=await sb.from("events").update(eventRow()).eq("id",eventId);if(error)throw error}
    for(const t of MODULE_TABLES[k])await syncTable(t);
    setSync("נשמר ✓");
  }catch(e){console.error(e);setSync("השמירה נכשלה. בדקו חיבור והרשאות");}
  writing[k]=false;
  if(dirty[k]){dirty[k]=false;flush(k)}
  else if(refetchQueued[k]){refetchQueued[k]=false;refetch(k)}
}

async function fetchTable(t){
  const {data,error}=await sb.from(t).select("*").eq("event_id",eventId).limit(5000);
  if(error)throw error;
  const clean=data.map(r=>{const o={};Object.keys(r).forEach(c=>{if(c!=="updated_at")o[c]=r[c]});return o});
  return clean;
}
function remember(t,rows){
  // keep the snapshot in the exact shape T[t].rows() will produce, so unchanged rows are not re-sent
  const m=new Map();T[t].rows().forEach(r=>{Object.assign(r,{event_id:eventId});m.set(r.id,JSON.stringify(r))});synced[t]=m;
}
async function refetch(k){
  if(timers[k]||writing[k]){refetchQueued[k]=true;return}
  try{
    if(k==="event"||k==="budget"){const {data,error}=await sb.from("events").select("*").eq("id",eventId).single();if(error)throw error;applyEvent(data)}
    for(const t of MODULE_TABLES[k]){const rs=await fetchTable(t);T[t].apply(rs);}
    for(const t of MODULE_TABLES[k])remember(t);
    safeRender();
  }catch(e){console.error(e)}
}
let channel=null;
function subscribe(){
  if(channel)sb.removeChannel(channel);
  channel=sb.channel("event-"+eventId);
  const rq={};const later=k=>{clearTimeout(rq[k]);rq[k]=setTimeout(()=>refetch(k),300)};
  Object.keys(TABLE_MODULE).forEach(t=>{
    channel.on("postgres_changes",{event:"INSERT",schema:"public",table:t,filter:"event_id=eq."+eventId},()=>later(TABLE_MODULE[t]));
    channel.on("postgres_changes",{event:"UPDATE",schema:"public",table:t,filter:"event_id=eq."+eventId},()=>later(TABLE_MODULE[t]));
    channel.on("postgres_changes",{event:"DELETE",schema:"public",table:t},p=>{const id=p.old&&p.old.id;if(id&&synced[t]&&synced[t].has(id))later(TABLE_MODULE[t])});
  });
  channel.on("postgres_changes",{event:"UPDATE",schema:"public",table:"events",filter:"id=eq."+eventId},()=>{later("event")});
  channel.subscribe();
}
async function loadEvent(id){
  eventId=id;synced={};S=blank();
  try{localStorage.setItem("chuppah-event",id)}catch(e){}
  const m=memberships.find(x=>x.event_id===id);myRole=m?m.role:"viewer";
  const {data,error}=await sb.from("events").select("*").eq("id",id).single();
  if(error){setSync("לא הצלחנו לטעון את האירוע");console.error(error);return}
  applyEvent(data);
  const tabs=Object.keys(T);const res=await Promise.all(tabs.map(fetchTable));
  // apply vendors before payments so payments attach to vendors
  tabs.forEach((t,i)=>{if(t!=="vendor_payments")T[t].apply(res[i])});
  T.vendor_payments.apply(res[tabs.indexOf("vendor_payments")]);
  tabs.forEach(t=>remember(t));
  anyDoc=true;loaded=true;subscribe();
  setSync(myRole==="viewer"?"צפייה בלבד":"מסונכרן");
  render();
}
async function loadMemberships(){
  const uidv=session.user.id;
  const {data,error}=await sb.from("event_members").select("event_id,role,events(groom,bride,date)").eq("user_id",uidv);
  if(error){console.error(error);memberships=[];return}
  memberships=data||[];
}
async function afterLogin(){
  try{await sb.rpc("claim_invites")}catch(e){}
  await loadMemberships();
  let want=null;try{want=localStorage.getItem("chuppah-event")}catch(e){}
  const pick=memberships.find(m=>m.event_id===want)||memberships[0];
  if(pick)await loadEvent(pick.event_id);
  else{loaded=true;anyDoc=false;S=blank();setSync("מחובר");render()}
}
async function newCloudEvent(st){
  const {data,error}=await sb.from("events").insert({groom:st.event.groom||""}).select("id").single();
  if(error){toast("יצירת האירוע נכשלה");console.error(error);return false}
  eventId=data.id;synced={};S=st;myRole="owner";
  if(CFG.parentsEmail){await sb.from("event_invites").insert({event_id:eventId,email:CFG.parentsEmail.toLowerCase(),role:"viewer"})}
  await loadMemberships();
  try{localStorage.setItem("chuppah-event",eventId)}catch(e){}
  anyDoc=true;subscribe();
  await flush("event");for(const k of DOCS)if(k!=="event")await flush(k);
  return true;
}

async function boot(){
  try{const t=localStorage.getItem("chuppah-view");if(t&&VIEWS.some(v=>v[0]===t))view=t}catch(e){}
  const h=location.hash.slice(1);if(VIEWS.some(v=>v[0]===h))view=h;
  if(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase){
    sb=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey);
    const {data}=await sb.auth.getSession();session=data.session;
    sb.auth.onAuthStateChange((ev,s)=>{const was=session;session=s;
      if(ev==="SIGNED_IN"&&!was){afterLogin()}
      if(ev==="SIGNED_OUT"){eventId=null;S=blank();anyDoc=false;render()}});
    if(session)await afterLogin();else{loaded=true;setSync("");render()}
    return;
  }
  const l=lsLoad(); if(l){S=Object.assign(blank(),l);anyDoc=true}
  loaded=true; setSync("מצב מקומי: נשמר במכשיר הזה"); render();
}
function safeRender(){
  const a=document.activeElement;
  if(a&&$("#view").contains(a)&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)){pendingRender=true;return}
  if($("#modal-root").firstChild){pendingRender=true;return}
  render();
}
document.addEventListener("focusout",()=>setTimeout(()=>{if(pendingRender){pendingRender=false;safeRender()}},50));

function loginView(){return `<div class="welcome">
  <h1>חופה</h1><p class="lead" style="font-size:18px">כל הדרך לחופה.</p>
  <div class="panel" style="max-width:420px"><h2>כניסה</h2><p class="small muted">הקלידו את הסיסמה שקיבלתם מהזוג.</p>
  <form id="login" class="row"><input type="password" id="l-pw" name="pw" required autocomplete="current-password" placeholder="סיסמה" dir="ltr" style="flex:1;min-width:160px"><button class="btn pri" type="submit">כניסה</button></form>
  <p class="small" id="l-msg" style="margin:10px 0 0"></p></div></div>`}
document.addEventListener("submit",async ev=>{if(ev.target.id!=="login")return;ev.preventDefault();
  const pw=String(new FormData(ev.target).get("pw"));const msg=$("#l-msg");msg.textContent="בודק…";
  for(const email of [CFG.coupleEmail,CFG.parentsEmail].filter(Boolean)){
    const {error}=await sb.auth.signInWithPassword({email,password:pw});
    if(!error){msg.textContent="";return}
  }
  msg.textContent="הסיסמה לא נכונה. נסו שוב.";});
const isParents=()=>cloud()&&session&&CFG.parentsEmail&&session.user.email&&session.user.email.toLowerCase()===CFG.parentsEmail.toLowerCase();
const readOnly=()=>cloud()&&(myRole==="viewer"||isParents());
const RO_OK=new Set(["nav","rfilter","vfilter","entry-list","entry-copy","guest-copy","logout","modal-close","modal-bg","export","switch-event","t-showdone","gift-came"]);
function lockForViewer(){
  if(!readOnly())return;
  document.querySelectorAll("#view button,#view input,#view select,#view textarea").forEach(el=>{
    if(el.dataset.filter||RO_OK.has(el.dataset.act))return;
    el.disabled=true;
  });
  document.querySelectorAll('#view a[data-act="sent"],#view a[data-act="remind"]').forEach(a=>a.hidden=true);
}
async function sharingPanel(){
  const box=$("#share-box");if(!box||!cloud())return;
  const [{data:mem},{data:inv}]=await Promise.all([sb.from("event_members").select("user_id,role,email").eq("event_id",eventId),sb.from("event_invites").select("id,email,role").eq("event_id",eventId)]);
  const RL={owner:"בעלים",editor:"עריכה",viewer:"צפייה"};
  box.innerHTML=`${(mem||[]).map(m=>`<div class="pay"><span dir="ltr">${esc(m.email||"")}</span><span class="pill p-acc">${RL[m.role]}</span>${myRole==="owner"&&m.role!=="owner"?`<button class="btn sm ghost" data-act="mem-del" data-id="${m.user_id}">הסרה</button>`:""}</div>`).join("")}
  ${(inv||[]).map(i=>`<div class="pay"><span dir="ltr">${esc(i.email)}</span><span class="pill p-pending">הוזמן · ${RL[i.role]}</span>${myRole==="owner"?`<button class="btn sm ghost" data-act="inv-del" data-id="${i.id}">ביטול</button>`:""}</div>`).join("")}
  ${myRole==="owner"?`<form class="row" data-form="invite" style="margin-top:10px"><input type="email" name="email" id="inv-e" required placeholder="מייל של בן משפחה" dir="ltr" style="flex:1;min-width:180px"><select name="role" id="inv-r"><option value="editor">עריכה</option><option value="viewer">צפייה</option></select><button class="btn sm" type="submit">הזמנה</button></form><p class="small muted">שלחו להם את כתובת האתר. כשהם ייכנסו עם המייל הזה, האירוע יופיע אצלם.</p>`:""}`;
}
document.addEventListener("submit",async ev=>{if(ev.target.dataset.form!=="invite")return;ev.preventDefault();
  const fd=new FormData(ev.target);const {error}=await sb.from("event_invites").insert({event_id:eventId,email:String(fd.get("email")).toLowerCase().trim(),role:fd.get("role")});
  toast(error?"ההזמנה נכשלה":"ההזמנה נשמרה");sharingPanel();});
document.addEventListener("click",async ev=>{const el=ev.target.closest("[data-act]");if(!el)return;const a=el.dataset.act;
  if(a==="inv-del"){await sb.from("event_invites").delete().eq("id",el.dataset.id);sharingPanel()}
  if(a==="mem-del"){await sb.from("event_members").delete().eq("event_id",eventId).eq("user_id",el.dataset.id);sharingPanel()}
  if(a==="logout"){await sb.auth.signOut();try{localStorage.removeItem("chuppah-event")}catch(e){}}
  if(a==="switch-event"){await loadEvent(el.dataset.id);view="home";render()}
  if(a==="new-event"){if(channel)sb.removeChannel(channel);eventId=null;S=blank();anyDoc=false;render()}
});
/* ---------- derived ---------- */
const E=()=>S.event;
const G=()=>S.guests.items;
function expectedOf(g){const r=num(E().pendingRate||75)/100;
  if(g.status==="yes")return num(g.coming||g.invited);
  if(g.status==="no")return 0;
  if(g.status==="maybe")return num(g.invited)*.5;
  return num(g.invited)*r}
function seatsOf(g){return g.status==="yes"?num(g.coming||g.invited):g.status==="no"?0:num(g.invited)}
function stats(){
  const gs=G();let invited=0,yes=0,no=0,pend=0,maybe=0,exp=0,people=0;
  gs.forEach(g=>{invited+=num(g.invited);exp+=expectedOf(g);
    if(g.status==="yes")yes+=num(g.coming||g.invited);else if(g.status==="no")no+=num(g.invited);else if(g.status==="maybe")maybe+=num(g.invited);else pend+=num(g.invited)});
  const answeredHH=gs.filter(g=>g.status!=="pending").length;
  return{invited,yes,no,pend,maybe,exp:Math.round(exp),hh:gs.length,answeredHH};
}
function cateringCost(){const e=E();const s=stats();const plates=Math.max(s.exp,num(e.minPlates));return plates*num(e.pricePerPlate)}
function budgetRows(){
  const rows=CATS.map(c=>({cat:c,plan:num(S.budget.plans[c]),committed:0,paid:0}));
  const by=Object.fromEntries(rows.map(r=>[r.cat,r]));
  S.vendors.items.forEach(v=>{if(v.status!=="closed")return;const r=by[v.cat]||by["שונות"];r.committed+=num(v.price);(v.payments||[]).forEach(p=>{if(p.paid)r.paid+=num(p.amount)})});
  S.budget.expenses.forEach(x=>{const r=by[x.cat]||by["שונות"];r.committed+=num(x.amount);if(x.paid)r.paid+=num(x.amount)});
  by["אולם וקייטרינג"].committed+=cateringCost();
  return rows;
}
function payments(){const out=[];S.vendors.items.forEach(v=>{if(v.status!=="closed")return;(v.payments||[]).forEach(p=>out.push({v,p}))});return out.sort((a,b)=>(a.p.due||"9").localeCompare(b.p.due||"9"))}
function taskDue(t){return t.due||(E().date&&t.days!=null?addDays(E().date,-t.days):null)}
function giftsTotal(){return G().reduce((a,g)=>a+num(g.gift&&g.gift.amount),0)}
function alerts(){
  const out=[];const s=stats();const e=E();const dl=daysTo(e.date);
  payments().forEach(({v,p})=>{if(p.paid||!p.due)return;const d=daysTo(p.due);
    if(d<0)out.push(["bad",`תשלום באיחור: ${p.label} ל${v.name} (${money(p.amount)}), היה אמור לצאת ב-${fdate(p.due)}`,"vendors"]);
    else if(d<=30)out.push(["",`תשלום מתקרב: ${p.label} ל${v.name}, ${money(p.amount)} ב-${fdate(p.due)}`,"vendors"])});
  const late=S.tasks.items.filter(t=>!t.done&&taskDue(t)&&daysTo(taskDue(t))<0);
  if(late.length)out.push(["bad",`${late.length} משימות באיחור, למשל "${late[0].title}"`,"tasks"]);
  const unseated=G().filter(g=>g.status==="yes"&&!g.table);
  if(unseated.length)out.push(["",`${unseated.length} מוזמנים שאישרו הגעה עדיין לא הושבו`,"seating"]);
  const over=S.tables.items.filter(t=>seatedCount(t.id)>num(t.seats));
  if(over.length)out.push(["bad",`${over.length} שולחנות בעומס יתר (${over.map(t=>t.name).join(", ")})`,"seating"]);
  const tot=budgetRows().reduce((a,r)=>a+r.committed,0);
  if(num(e.budget)&&tot>num(e.budget))out.push(["bad",`התחזית (${money(tot)}) גבוהה ב-${money(tot-num(e.budget))} מהתקציב`,"budget"]);
  if(dl!=null&&dl<=45&&s.pend>0)out.push(["",`${s.pend} מוזמנים עוד לא ענו, ונשארו ${dl} ימים`,"rsvp"]);
  if(num(e.minPlates)&&s.exp<num(e.minPlates))out.push(["",`התחזית (${s.exp} מגיעים) נמוכה ממינימום המנות באולם (${e.minPlates}). תשלמו על ${num(e.minPlates)-s.exp} מנות ריקות`,"budget"]);
  S.vendors.items.filter(v=>v.status==="closed"&&!(v.contract&&v.contract.signed)).forEach(v=>out.push(["",`ל${v.name} אין עדיין חוזה חתום`,"vendors"]));
  return out;
}
function seatedCount(tid){return G().filter(g=>g.table===tid).reduce((a,g)=>a+seatsOf(g),0)}

/* ---------- rendering ---------- */
function render(){
  if(!loaded)return;
  if(cloud()&&!session){$("#nav").innerHTML="";$("#couple").textContent="";$("#count").innerHTML="";$("#view").innerHTML=loginView();return}
  const e=E();
  $("#couple").textContent=e.groom||e.bride?`${e.groom||""} ו${e.bride||""}`:"";
  const d=daysTo(e.date);
  $("#count").innerHTML=d==null?"":d>0?`עוד <b>${d}</b> ימים`:d===0?`<b>היום!</b> מזל טוב`:`<b>${-d}</b> ימים אחרי`;
  if(!anyDoc||!e.date){$("#nav").innerHTML="";
    if(cloud()&&readOnly()){$("#view").innerHTML=`<div class="welcome"><h1>חופה</h1><p class="lead">האירוע עוד לא הוקם. בקשו מהזוג להיכנס עם הסיסמה שלהם וליצור אותו.</p><button class="btn" data-act="logout">יציאה</button></div>`;return}
    $("#view").innerHTML=welcome();return}
  const al=alerts();
  $("#nav").innerHTML=VIEWS.map(([k,l])=>{let b="";
    if(k==="home"&&al.length)b=al.length;
    if(k==="rsvp"){const p=G().filter(g=>g.status==="pending").length;if(p)b=p}
    return `<button data-act="nav" data-v="${k}" ${k===view?'aria-current="page"':""}><span>${l}</span>${b?`<span class="badge">${b}</span>`:""}</button>`}).join("");
  const fn={home:vHome,guests:vGuests,rsvp:vRsvp,seating:vSeating,gifts:vGifts,vendors:vVendors,budget:vBudget,tasks:vTasks,day:vDay,settings:vSettings}[view]||vHome;
  $("#view").innerHTML=(readOnly()?`<div class="banner"><span>מצב צפייה בלבד. כל השינויים נעשים על ידי הזוג.</span><button class="btn sm" data-act="logout" style="margin-inline-start:auto">יציאה</button></div>`:"")+(e.sample&&!readOnly()?`<div class="banner"><span>אתם צופים בנתוני דוגמה. נסו הכול בחופשיות.</span><button class="btn sm pri" data-act="fresh">התחילו עם החתונה שלכם</button></div>`:"")+fn();
  if(view==="settings")sharingPanel();
  lockForViewer();
}

function welcome(){return `<div class="welcome">
  <h1>חופה</h1>
  <p class="lead" style="font-size:18px">כל הדרך לחופה. מוזמנים, אישורי הגעה, הושבה, מתנות, ספקים וחוזים, תקציב, משימות ויום האירוע, כשכל חלק מעדכן את האחרים.</p>
  <div class="mods">
    <div><b>מוזמנים ואישורים</b>רשימה אחת לשני הצדדים, הודעת וואטסאפ אישית לכל מוזמן</div>
    <div><b>הושבה</b>שולחנות שמתעדכנים לפי האישורים, הושבה אוטומטית לפי קבוצות</div>
    <div><b>תקציב וספקים</b>חוזים, לוח תשלומים, ומחיר מנה כפול מספר המגיעים בפועל</div>
    <div><b>מתנות</b>רישום מהיר מתוך רשימת המוזמנים ומאזן מול עלות האירוע</div>
  </div>
  <div class="panel"><h2>בואו נתחיל</h2>
  <form id="onb" class="form">
    <label class="field">שם החתן<input type="text" id="o-groom" name="groom" required></label>
    <label class="field">שם הכלה<input type="text" id="o-bride" name="bride" required></label>
    <label class="field">תאריך החתונה<input type="date" id="o-date" name="date" required></label>
    <label class="field">תקציב כולל (₪)<input type="number" id="o-budget" name="budget" value="180000"></label>
    <label class="field">מחיר למנה באולם (₪)<input type="number" id="o-ppp" name="pricePerPlate" value="320"></label>
    <label class="field">מתנה ממוצעת לאורח (₪)<input type="number" id="o-gift" name="avgGift" value="400"></label>
    <div class="row wide"><button class="btn pri" type="submit">צרו את החתונה</button><button class="btn" type="button" data-act="sample">הציגו לי עם נתוני דוגמה</button></div>
  </form></div></div>`}

function kpi(l,v,s){return `<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div>${s?`<div class="s">${s}</div>`:""}</div>`}
function bar(p,cls){p=Math.max(0,Math.min(100,p||0));return `<div class="bar ${cls||""}"><i style="width:${p}%"></i></div>`}

function vHome(){
  const s=stats(),e=E(),rows=budgetRows();
  const committed=rows.reduce((a,r)=>a+r.committed,0),paid=rows.reduce((a,r)=>a+r.paid,0);
  const tasks=S.tasks.items,done=tasks.filter(t=>t.done).length;
  const seated=G().filter(g=>g.table&&g.status!=="no").reduce((a,g)=>a+seatsOf(g),0);
  const al=alerts();
  const next=tasks.filter(t=>!t.done).map(t=>({t,d:taskDue(t)})).sort((a,b)=>(a.d||"9").localeCompare(b.d||"9")).slice(0,5);
  const pays=payments().filter(x=>!x.p.paid).slice(0,5);
  return `<h1>לוח בקרה</h1><p class="lead">${esc(e.venue||"")}${e.venue?" · ":""}${fdate(e.date)}${e.time?" · "+esc(e.time):""}</p>
  <div class="stack">
  <div class="kpis">
    ${kpi("הוזמנו",nf.format(s.invited),`${s.hh} הזמנות · ${s.answeredHH} ענו`)}
    ${kpi("אישרו הגעה",nf.format(s.yes),`${s.pend} לא ענו · ${s.no} לא מגיעים`)}
    ${kpi("תחזית מגיעים",nf.format(s.exp),"מאשרים + הערכה למי שלא ענה")}
    ${kpi("תחזית עלות",money(committed),num(e.budget)?`מתוך ${money(e.budget)}`:"")}
    ${kpi("שולם",money(paid),`נותר לשלם ${money(committed-paid)}`)}
    ${kpi("משימות",`${done}/${tasks.length}`,bar(tasks.length?done/tasks.length*100:0,"ok"))}
  </div>
  <section class="panel"><h2>דורש תשומת לב</h2>${al.length?`<div class="alerts">${al.map(([c,t,v])=>`<div class="alert ${c}"><span>${esc(t)}</span><button class="btn sm go" data-act="nav" data-v="${v}">לטיפול</button></div>`).join("")}</div>`:`<div class="alert ok">הכול בשליטה. אין כרגע משהו דחוף.</div>`}</section>
  <div class="split">
   <section class="panel"><h2>המשימות הבאות</h2>${next.length?next.map(({t,d})=>`<div class="task ${d&&daysTo(d)<0?"late":""}"><input type="checkbox" data-act="task-toggle" data-id="${t.id}" aria-label="סמן כבוצע"><span class="t">${esc(t.title)}</span><span class="due">${fdate(d)}</span></div>`).join(""):`<p class="muted">אין משימות פתוחות.</p>`}</section>
   <section class="panel"><h2>תשלומים קרובים</h2>${pays.length?pays.map(({v,p})=>`<div class="pay ${p.due&&daysTo(p.due)<0?"overdue":""}"><span>${esc(v.name)} · ${esc(p.label)}</span><span class="muted small">${fdate(p.due)}</span><span class="amt">${money(p.amount)}</span></div>`).join(""):`<p class="muted">אין תשלומים פתוחים.</p>`}</section>
  </div>
  <section class="panel"><h2>התקדמות</h2><div class="stack">
    <div><div class="row small"><span>אישורי הגעה</span><span class="muted" style="margin-inline-start:auto">${s.hh?Math.round(s.answeredHH/s.hh*100):0}%</span></div>${bar(s.hh?s.answeredHH/s.hh*100:0)}</div>
    <div><div class="row small"><span>הושבה (מקומות שהוקצו מתוך המגיעים)</span><span class="muted" style="margin-inline-start:auto">${seated}/${s.yes+s.pend+s.maybe}</span></div>${bar((s.yes+s.pend+s.maybe)?seated/(s.yes+s.pend+s.maybe)*100:0)}</div>
    <div><div class="row small"><span>תקציב</span><span class="muted" style="margin-inline-start:auto">${money(committed)} / ${money(e.budget)}</span></div>${bar(num(e.budget)?committed/num(e.budget)*100:0,committed>num(e.budget)?"over":"")}</div>
  </div></section>
  </div>`;
}

let gFilter={q:"",side:"",status:""};
function vGuests(){
  const s=stats();
  const by=k=>G().filter(g=>g.side===k).reduce((a,g)=>a+num(g.invited),0);
  const list=G().filter(g=>(!gFilter.side||g.side===gFilter.side)&&(!gFilter.status||g.status===gFilter.status)&&(!gFilter.q||(g.name+" "+(g.group||"")+" "+(g.phone||"")).includes(gFilter.q)));
  const quota=num(E().guestQuota);
  return `<h1>מוזמנים</h1><p class="lead">רשימה אחת לשני הצדדים. מספר טלפון שחוזר פעמיים מסומן ככפילות.</p>
  <div class="stack">
  <div class="kpis">${kpi("צד החתן",nf.format(by("groom")),quota?`מכסה: ${nf.format(quota/2)}`:"")}${kpi("צד הכלה",nf.format(by("bride")),quota?`מכסה: ${nf.format(quota/2)}`:"")}${kpi("משותף",nf.format(by("shared")))}${kpi("סה\"כ",nf.format(s.invited),quota?(s.invited>quota?`<span style="color:var(--bad)">חריגה של ${s.invited-quota}</span>`:`נשארו ${quota-s.invited} מקומות`):"")}</div>
  <div class="row">
    <input type="search" id="g-q" placeholder="חיפוש שם, קבוצה או טלפון" value="${esc(gFilter.q)}" data-filter="q" style="flex:1;min-width:180px">
    <select id="g-side" data-filter="side"><option value="">כל הצדדים</option>${Object.entries(SIDES).map(([k,v])=>`<option value="${k}" ${gFilter.side===k?"selected":""}>${v}</option>`).join("")}</select>
    <select id="g-st" data-filter="status"><option value="">כל הסטטוסים</option>${Object.entries(STATUS).map(([k,v])=>`<option value="${k}" ${gFilter.status===k?"selected":""}>${v}</option>`).join("")}</select>
    <button class="btn pri" data-act="guest-add">הוספת מוזמן</button>
    <button class="btn" data-act="guest-import">ייבוא מאקסל</button>
    <button class="btn" data-act="guest-copy">העתקה לאקסל</button>
  </div>
  <div class="panel flush tbl-wrap"><table><thead><tr><th>שם</th><th>טלפון</th><th>צד</th><th>קבוצה</th><th class="num">הוזמנו</th><th>עדיפות</th><th>סטטוס</th><th>מנה</th><th></th></tr></thead><tbody>
  ${list.map(g=>{const dup=g.phone&&G().filter(x=>normPhone(x.phone)===normPhone(g.phone)).length>1;
   return `<tr><td><b>${esc(g.name)}</b>${dup?` <span class="pill p-no">כפילות?</span>`:""}</td><td dir="ltr" style="text-align:right">${esc(g.phone||"")}</td><td>${SIDES[g.side]||""}</td><td>${esc(g.group||"")}</td><td class="num">${num(g.invited)}</td><td>${esc(g.priority||"")}</td><td><span class="pill p-${g.status}">${STATUS[g.status]}${g.status==="yes"?" · "+num(g.coming||g.invited):""}</span></td><td>${esc(g.meal||"")}</td><td><button class="btn sm ghost" data-act="guest-edit" data-id="${g.id}">עריכה</button></td></tr>`}).join("")||`<tr><td colspan="9" class="muted">אין מוזמנים שמתאימים לסינון.</td></tr>`}
  </tbody></table></div>
  <p class="muted small">מוצגים ${list.length} מתוך ${G().length} הזמנות.</p></div>`;
}

function inviteText(g){const e=E();
  const t=e.inviteText||DEFAULT_INVITE;
  return t.replaceAll("{שם}",g.name).replaceAll("{חתן}",e.groom||"").replaceAll("{כלה}",e.bride||"").replaceAll("{תאריך}",fdate(e.date)).replaceAll("{אולם}",e.venue||"").replaceAll("{כתובת}",e.address||"").replaceAll("{שעה}",e.time||"");
}
const DEFAULT_INVITE="היי {שם}! 💍\n{חתן} ו{כלה} מתחתנים ושמחים להזמין אתכם לחגוג איתם.\n📅 {תאריך} בשעה {שעה}\n📍 {אולם}, {כתובת}\n\nנשמח לאישור הגעה בתשובה להודעה:\n1 = מגיעים (וכמה)\n2 = לא נוכל להגיע\n3 = עוד לא יודעים";
const REMIND="היי {שם}, מזכירים בחיבה את החתונה של {חתן} ו{כלה} ב-{תאריך}. נשמח לדעת אם תגיעו כדי שנוכל לסגור מקומות 🙏";
let rFilter="pending";
function waLink(g,txt){return `https://wa.me/${normPhone(g.phone)}?text=${encodeURIComponent(txt)}`}
function vRsvp(){
  const s=stats();
  const list=G().filter(g=>rFilter==="all"||g.status===rFilter);
  const e=E();
  return `<h1>אישורי הגעה</h1><p class="lead">שולחים לכל מוזמן הודעת וואטסאפ אישית בלחיצה, ומסמנים את התשובה כאן. תזכורות יוצאות רק למי שלא ענה.</p>
  <div class="stack">
  <div class="kpis">${kpi("מגיעים",nf.format(s.yes))}${kpi("לא ענו",nf.format(s.pend))}${kpi("אולי",nf.format(s.maybe))}${kpi("לא מגיעים",nf.format(s.no))}${kpi("תחזית",nf.format(s.exp),`לפי ${num(e.pendingRate||75)}% הגעה ממי שלא ענה`)}</div>
  <details class="panel"><summary>נוסח ההזמנה</summary><div class="stack" style="margin-top:10px">
    <p class="small muted">אפשר להשתמש ב: {שם} {חתן} {כלה} {תאריך} {שעה} {אולם} {כתובת}</p>
    <textarea id="invite-text" data-bind="event.inviteText" rows="8">${esc(e.inviteText||DEFAULT_INVITE)}</textarea></div></details>
  <div class="row"><span class="muted small">הצג:</span>${[["pending","לא ענו"],["maybe","אולי"],["yes","מגיעים"],["no","לא מגיעים"],["all","כולם"]].map(([k,l])=>`<button class="btn sm ${rFilter===k?"pri":""}" data-act="rfilter" data-v="${k}">${l}</button>`).join("")}</div>
  <div class="panel flush tbl-wrap"><table><thead><tr><th>שם</th><th class="num">הוזמנו</th><th>נשלח</th><th>שליחה</th><th>תשובה</th><th class="num">כמה מגיעים</th></tr></thead><tbody>
  ${list.map(g=>`<tr><td><b>${esc(g.name)}</b><div class="small muted">${SIDES[g.side]||""}${g.group?" · "+esc(g.group):""}</div></td><td class="num">${num(g.invited)}</td>
    <td class="small">${g.sentAt?`${fdate(g.sentAt)}${g.reminders?` · ${g.reminders} תזכורות`:""}`:`<span class="muted">טרם</span>`}</td>
    <td>${g.phone?`<div class="row"><a class="btn sm" href="${esc(waLink(g,inviteText(g)))}" target="_blank" rel="noopener" data-act="sent" data-id="${g.id}">הזמנה</a>${g.status==="pending"&&g.sentAt?`<a class="btn sm" href="${esc(waLink(g,REMIND.replaceAll("{שם}",g.name).replaceAll("{חתן}",e.groom||"").replaceAll("{כלה}",e.bride||"").replaceAll("{תאריך}",fdate(e.date))))}" target="_blank" rel="noopener" data-act="remind" data-id="${g.id}">תזכורת</a>`:""}</div>`:`<span class="small muted">אין טלפון</span>`}</td>
    <td><div class="row">${["yes","maybe","no"].map(k=>`<button class="btn sm ${g.status===k?"pri":""}" data-act="rsvp" data-id="${g.id}" data-v="${k}">${STATUS[k]}</button>`).join("")}</div></td>
    <td class="num">${g.status==="yes"?`<input class="inl" style="width:64px" type="number" min="0" id="c-${g.id}" data-guest="${g.id}" data-gf="coming" value="${num(g.coming||g.invited)}">`:"—"}</td></tr>`).join("")||`<tr><td colspan="6" class="muted">אין מוזמנים בקטגוריה הזו.</td></tr>`}
  </tbody></table></div>
  ${rFilter==="pending"&&list.length?`<p class="small muted">טיפ: שבוע לפני החתונה, התקשרו בעצמכם לכל מי שנשאר ברשימה הזו. כל מקום ריק עולה ${money(E().pricePerPlate)}.</p>`:""}
  <section class="panel"><h2>דו"ח מנות לאולם</h2>${mealReport()}</section>
  </div>`;
}
function mealReport(){const m={};G().filter(g=>g.status==="yes").forEach(g=>{const k=g.meal||"רגיל";m[k]=(m[k]||0)+num(g.coming||g.invited)});
  const s=stats();return `<div class="row">${MEALS.map(k=>`<span class="tag">${k}: <b>${m[k]||0}</b></span>`).join("")}</div><p class="small muted" style="margin:8px 0 0">מנות למסירה לאולם: <b>${Math.max(s.exp,num(E().minPlates))}</b> (התחזית או מינימום המנות, הגבוה מביניהם).</p>`}

let selGuests=new Set();
function vSeating(){
  const tables=S.tables.items;
  const un=G().filter(g=>g.status!=="no"&&!g.table);
  const totalSeats=tables.reduce((a,t)=>a+num(t.seats),0);
  const need=G().reduce((a,g)=>a+seatsOf(g),0);
  return `<h1>סידור הושבה</h1><p class="lead">סמנו מוזמנים ברשימה ולחצו "הושבה כאן" על שולחן. מי שמסומן "לא מגיע" יוצא מההושבה אוטומטית.</p>
  <div class="stack">
  <div class="kpis">${kpi("שולחנות",tables.length)}${kpi("מקומות",nf.format(totalSeats),`צריך ${nf.format(need)}`)}${kpi("לא הושבו",nf.format(un.reduce((a,g)=>a+seatsOf(g),0)),"אנשים")}</div>
  <div class="row"><button class="btn pri" data-act="table-add">הוספת שולחן</button><button class="btn" data-act="tables-bulk">הוספת כמה שולחנות</button><button class="btn" data-act="autoseat">הושבה אוטומטית לפי קבוצות</button><button class="btn" data-act="entry-list">רשימת כניסה לפי א-ב</button></div>
  <div class="seat-layout">
    <section class="panel"><h3>ממתינים להושבה (${un.length})</h3>
      <div class="ulist">${un.sort((a,b)=>(a.group||"").localeCompare(b.group||"")||a.name.localeCompare(b.name)).map(g=>`<label><input type="checkbox" data-act="sel" data-id="${g.id}" ${selGuests.has(g.id)?"checked":""}><span>${esc(g.name)}</span><span class="small muted" style="margin-inline-start:auto">${esc(g.group||"")} · ${seatsOf(g)}</span></label>`).join("")||`<p class="muted small">כולם הושבו.</p>`}</div>
    </section>
    <div class="grid">${tables.map(t=>{const c=seatedCount(t.id),cap=num(t.seats);const gs=G().filter(g=>g.table===t.id);
      return `<div class="tcard ${c>cap?"over":c===cap?"full":""}"><div class="hd"><b>${esc(t.name)}</b><span class="small ${c>cap?"":"muted"}" style="${c>cap?"color:var(--bad);font-weight:700":""}">${c}/${cap}</span></div>
      ${bar(cap?c/cap*100:0,c>cap?"over":c===cap?"ok":"")}
      <div class="chips">${gs.map(g=>`<span class="chip">${esc(g.name)}${seatsOf(g)>1?` (${seatsOf(g)})`:""}${g.status!=="yes"?` <span class="pill p-${g.status}">${STATUS[g.status]}</span>`:""}<button data-act="unseat" data-id="${g.id}" aria-label="הסר מהשולחן">×</button></span>`).join("")||`<span class="small muted">ריק</span>`}</div>
      <div class="row"><button class="btn sm pri" data-act="seat" data-id="${t.id}">הושבה כאן${selGuests.size?` (${selGuests.size})`:""}</button><button class="btn sm ghost" data-act="table-edit" data-id="${t.id}">עריכה</button></div></div>`}).join("")||`<p class="muted">עוד אין שולחנות. הוסיפו שולחן כדי להתחיל.</p>`}</div>
  </div></div>`;
}

let giftOnlyCame=false;
function vGifts(){
  const total=giftsTotal();const rows=budgetRows();const cost=rows.reduce((a,r)=>a+r.committed,0);
  const s=stats();const expG=s.exp*num(E().avgGift);
  const list=G().filter(g=>g.status!=="no"&&(!giftOnlyCame||g.arrived)).sort((a,b)=>a.name.localeCompare(b.name));
  const withGift=G().filter(g=>num(g.gift&&g.gift.amount)>0);
  const thanked=withGift.filter(g=>g.gift.thanked).length;
  return `<h1>מתנות</h1><p class="lead">רושמים כל מתנה ישירות על המוזמן. כך נשמרת רשימה מסודרת של מי נתן כמה, ומאזן מול עלות האירוע.</p>
  <div class="stack"><div class="kpis">${kpi("התקבלו",money(total),`${withGift.length} מתנות`)}${kpi("צפי מתנות",money(expG),`${s.exp} מגיעים × ${money(E().avgGift)}`)}${kpi("עלות האירוע",money(cost))}${kpi("מאזן",`<span style="color:${(total||expG)-cost>=0?"var(--sage)":"var(--bad)"}">${money((total||expG)-cost)}</span>`,total?"לפי מתנות בפועל":"לפי צפי")}${kpi("תודות נשלחו",`${thanked}/${withGift.length}`)}</div>
  <div class="row"><label class="row small"><input type="checkbox" data-act="gift-came" ${giftOnlyCame?"checked":""}> רק מי שסומן "הגיע" ביום האירוע</label></div>
  <div class="panel flush tbl-wrap"><table><thead><tr><th>שם</th><th>סוג</th><th class="num">סכום (₪)</th><th>הערה</th><th>תודה</th></tr></thead><tbody>
  ${list.map(g=>{const gf=g.gift||{};return `<tr><td><b>${esc(g.name)}</b><div class="small muted">${esc(g.group||"")}</div></td>
  <td><select id="gt-${g.id}" data-guest="${g.id}" data-gf="gift.type"><option value=""></option>${GIFT_TYPES.map(t=>`<option ${gf.type===t?"selected":""}>${t}</option>`).join("")}</select></td>
  <td class="num"><input class="inl" type="number" min="0" id="ga-${g.id}" data-guest="${g.id}" data-gf="gift.amount" value="${gf.amount||""}"></td>
  <td><input class="inl" style="width:150px" type="text" id="gn-${g.id}" data-guest="${g.id}" data-gf="gift.note" value="${esc(gf.note||"")}"></td>
  <td><input type="checkbox" id="gk-${g.id}" data-guest="${g.id}" data-gf="gift.thanked" ${gf.thanked?"checked":""} aria-label="נשלחה תודה"></td></tr>`}).join("")}
  </tbody></table></div></div>`;
}

let vFilter="";
function vVendors(){
  const list=S.vendors.items.filter(v=>!vFilter||v.status===vFilter);
  return `<h1>ספקים וחוזים</h1><p class="lead">כל ספק עם הצעת המחיר, החוזה ולוח התשלומים שלו. ספק שנסגר נכנס אוטומטית לתקציב.</p>
  <div class="stack"><div class="row"><button class="btn pri" data-act="vendor-add">הוספת ספק</button><span class="muted small">סינון:</span>${[["","הכול"],...Object.entries(VSTATUS)].map(([k,l])=>`<button class="btn sm ${vFilter===k?"pri":""}" data-act="vfilter" data-v="${k}">${l}</button>`).join("")}</div>
  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${list.map(v=>{const pays=v.payments||[];const paid=pays.filter(p=>p.paid).reduce((a,p)=>a+num(p.amount),0);const ck=(v.contract&&v.contract.checks)||{};const nck=CONTRACT.filter(c=>ck[c]).length;
  return `<article class="vcard"><div class="hd"><div><div class="name">${esc(v.name)}</div><div class="small muted">${esc(v.cat)}${v.contact?" · "+esc(v.contact):""}${v.phone?` · <span dir="ltr">${esc(v.phone)}</span>`:""}</div></div><span class="pill ${v.status==="closed"?"p-yes":v.status==="rejected"?"p-no":v.status==="offer"?"p-maybe":"p-pending"}">${VSTATUS[v.status]}</span></div>
  <div class="row"><b style="font-size:18px">${money(v.price)}</b>${v.status==="closed"?`<span class="small muted">שולם ${money(paid)} · נותר ${money(num(v.price)-paid)}</span>`:""}</div>
  ${v.status==="closed"?bar(num(v.price)?paid/num(v.price)*100:0,"ok"):""}
  ${v.notes?`<div class="small">${esc(v.notes)}</div>`:""}
  <details><summary>חוזה ${v.contract&&v.contract.signed?'<span class="pill p-yes">חתום</span>':'<span class="pill p-pending">לא חתום</span>'} <span class="small muted">${nck}/${CONTRACT.length} סעיפים נבדקו</span></summary>
    <div style="margin-top:8px;display:flex;flex-direction:column;gap:4px">
    <label class="row small"><input type="checkbox" data-act="v-signed" data-id="${v.id}" ${v.contract&&v.contract.signed?"checked":""}> <b>החוזה נחתם</b></label>
    ${CONTRACT.map((c,i)=>`<label class="row small"><input type="checkbox" data-act="v-check" data-id="${v.id}" data-i="${i}" ${ck[c]?"checked":""}> ${esc(c)}</label>`).join("")}</div></details>
  <details ${pays.length?"open":""}><summary>לוח תשלומים (${pays.length})</summary><div style="margin-top:6px">
    ${pays.map(p=>`<div class="pay ${!p.paid&&p.due&&daysTo(p.due)<0?"overdue":""}"><input type="checkbox" data-act="pay-toggle" data-id="${v.id}" data-p="${p.id}" ${p.paid?"checked":""} aria-label="שולם"><span>${esc(p.label)}</span><span class="small muted">${fdate(p.due)}</span>${payerSel("payer","pp-"+p.id,p.payer,"pay-payer",`data-id="${v.id}" data-p="${p.id}" style="padding:2px 4px;font-size:12px"`)}<span class="amt">${money(p.amount)}</span><button class="btn sm ghost" data-act="pay-del" data-id="${v.id}" data-p="${p.id}" aria-label="מחק תשלום">×</button></div>`).join("")}
    <form class="row" data-form="pay" data-id="${v.id}" style="margin-top:8px"><input type="text" name="label" id="pl-${v.id}" placeholder="מקדמה / יתרה" style="width:110px"><input type="number" name="amount" id="pa-${v.id}" placeholder="סכום" style="width:90px"><input type="date" name="due" id="pd-${v.id}">${payerSel("payer","pw-"+v.id,"")}<button class="btn sm" type="submit">הוספה</button></form>
  </div></details>
  <div class="row"><button class="btn sm" data-act="vendor-edit" data-id="${v.id}">עריכה</button>${v.phone?`<a class="btn sm ghost" href="https://wa.me/${normPhone(v.phone)}" target="_blank" rel="noopener">וואטסאפ</a>`:""}</div></article>`}).join("")||`<p class="muted">אין ספקים בקטגוריה הזו.</p>`}</div></div>`;
}

function vBudget(){
  const e=E(),rows=budgetRows();const plan=rows.reduce((a,r)=>a+r.plan,0),com=rows.reduce((a,r)=>a+r.committed,0),paid=rows.reduce((a,r)=>a+r.paid,0);
  const s=stats();const plates=Math.max(s.exp,num(e.minPlates));
  return `<h1>תקציב</h1><p class="lead">התחזית מחברת את הספקים שנסגרו, הוצאות נוספות, ועלות המנות לפי מספר המגיעים הצפוי.</p>
  <div class="stack"><div class="kpis">${kpi("תקציב כולל",money(e.budget))}${kpi("מתוכנן בקטגוריות",money(plan))}${kpi("תחזית עלות",money(com),num(e.budget)?(com>num(e.budget)?`<span style="color:var(--bad)">חריגה ${money(com-num(e.budget))}</span>`:`נשארו ${money(num(e.budget)-com)}`):"")}${kpi("שולם",money(paid))}${kpi("עלות מנות",money(cateringCost()),`${plates} מנות × ${money(e.pricePerPlate)}`)}</div>
  <div class="panel flush tbl-wrap"><table><thead><tr><th>קטגוריה</th><th class="num">מתוכנן</th><th class="num">תחזית</th><th class="num">שולם</th><th style="min-width:140px">ניצול</th></tr></thead><tbody>
  ${rows.map(r=>`<tr><td>${esc(r.cat)}${r.cat==="אולם וקייטרינג"?`<div class="small muted">כולל ${money(cateringCost())} מנות</div>`:""}</td><td class="num"><input class="inl" type="number" id="bp-${CATS.indexOf(r.cat)}" data-plan="${esc(r.cat)}" value="${r.plan||""}"></td><td class="num" style="${r.plan&&r.committed>r.plan?"color:var(--bad);font-weight:700":""}">${money(r.committed)}</td><td class="num">${money(r.paid)}</td><td>${bar(r.plan?r.committed/r.plan*100:0,r.plan&&r.committed>r.plan?"over":"")}</td></tr>`).join("")}
  <tr><td><b>סה"כ</b></td><td class="num"><b>${money(plan)}</b></td><td class="num"><b>${money(com)}</b></td><td class="num"><b>${money(paid)}</b></td><td></td></tr></tbody></table></div>
  <section class="panel"><h2>מי שילם כמה</h2><p class="small muted">לכל תשלום שסומן "שולם" בוחרים מי שילם. כאן רואים את ההשוואה מול מה שכל צד התחייב.</p>${payerTable()}</section>
  <div>
  <section class="panel"><h2>הוצאות נוספות</h2><p class="small muted">דברים שאינם ספק: אלכוהול שקניתם, מתנות להורים, טיפים.</p>
   ${S.budget.expenses.map(x=>`<div class="pay"><input type="checkbox" data-act="exp-paid" data-id="${x.id}" ${x.paid?"checked":""} aria-label="שולם"><span>${esc(x.title)}</span><span class="small muted">${esc(x.cat)}</span>${payerSel("payer","xp-"+x.id,x.payer,"exp-payer",`data-id="${x.id}" style="padding:2px 4px;font-size:12px"`)}<span class="amt">${money(x.amount)}</span><button class="btn sm ghost" data-act="exp-del" data-id="${x.id}" aria-label="מחק">×</button></div>`).join("")||`<p class="muted small">אין עדיין.</p>`}
   <form class="row" data-form="exp" style="margin-top:10px"><input type="text" name="title" id="ex-t" placeholder="תיאור" style="flex:1;min-width:120px"><select name="cat" id="ex-c">${CATS.map(c=>`<option>${c}</option>`).join("")}</select><input type="number" name="amount" id="ex-a" placeholder="סכום" style="width:90px">${payerSel("payer","ex-p","")}<button class="btn sm" type="submit">הוספה</button></form></section>

  </div></div>`;
}

function payerStats(){
  const keys=[...Object.keys(PAYERS),""];const by={};keys.forEach(k=>by[k]={paid:0,planned:0,cats:{}});
  const add=(payer,cat,amt,paid)=>{const r=by[payer in PAYERS?payer:""];if(paid){r.paid+=amt;r.cats[cat]=(r.cats[cat]||0)+amt}else r.planned+=amt};
  S.vendors.items.forEach(v=>{if(v.status!=="closed")return;(v.payments||[]).forEach(p=>add(p.payer,v.cat,num(p.amount),p.paid))});
  S.budget.expenses.forEach(x=>add(x.payer,x.cat,num(x.amount),x.paid));
  return by;
}
function payerTable(){
  const by=payerStats();const pl=S.budget.pledges||{};const tot=Object.values(by).reduce((a,r)=>a+r.paid,0);
  const ks=Object.keys(PAYERS);
  const cats=CATS.filter(c=>Object.values(by).some(r=>r.cats[c]));
  const un=by[""];
  return `<div class="tbl-wrap"><table><thead><tr><th>מי</th><th class="num">התחייב</th><th class="num">שילם</th><th class="num">מתוכנן לשלם</th><th class="num">נותר מההתחייבות</th><th class="num">חלק מהתשלומים</th></tr></thead><tbody>
  ${ks.map(k=>{const r=by[k];const p=num(pl[k]);return `<tr><td><b>${PAYERS[k]}</b></td><td class="num"><input class="inl" type="number" id="pl-${k}" data-pledge="${k}" value="${p||""}" style="width:100px"></td><td class="num"><b>${money(r.paid)}</b></td><td class="num">${money(r.planned)}</td><td class="num" style="${p&&r.paid>p?"color:var(--bad)":""}">${p?money(p-r.paid):"—"}</td><td class="num">${tot?Math.round(r.paid/tot*100):0}%</td></tr>`}).join("")}
  ${un.paid||un.planned?`<tr><td class="muted">לא שויך</td><td></td><td class="num">${money(un.paid)}</td><td class="num">${money(un.planned)}</td><td></td><td class="num">${tot?Math.round(un.paid/tot*100):0}%</td></tr>`:""}
  </tbody></table></div>
  <div style="margin-top:10px">${ks.map(k=>`<div class="row small" style="margin-top:6px"><span style="width:90px">${PAYERS[k]}</span><div style="flex:1">${bar(tot?by[k].paid/tot*100:0)}</div></div>`).join("")}</div>
  ${cats.length?`<details style="margin-top:12px"><summary>פירוט לפי שלב / קטגוריה</summary><div class="tbl-wrap" style="margin-top:8px"><table><thead><tr><th>קטגוריה</th>${ks.map(k=>`<th class="num">${PAYERS[k]}</th>`).join("")}${un.paid?`<th class="num">לא שויך</th>`:""}</tr></thead><tbody>${cats.map(c=>`<tr><td>${esc(c)}</td>${ks.map(k=>`<td class="num">${by[k].cats[c]?money(by[k].cats[c]):"—"}</td>`).join("")}${un.paid?`<td class="num">${un.cats[c]?money(un.cats[c]):"—"}</td>`:""}</tr>`).join("")}</tbody></table></div></details>`:""}
  ${un.paid?`<p class="small muted">יש תשלומים ששולמו בלי לסמן מי שילם. בחרו את המשלם ליד כל תשלום בלשונית ספקים או בהוצאות הנוספות.</p>`:""}`;
}
let tShowDone=true;
function vTasks(){
  const items=S.tasks.items.map(t=>({t,d:taskDue(t)}));
  const phases=[...new Set(items.map(x=>x.t.phase||"כללי"))];
  return `<h1>משימות וציר זמן</h1><p class="lead">הצ'קליסט מתוזמן לפי תאריך החתונה. שינוי התאריך מזיז את כל המשימות.</p>
  <div class="stack"><div class="row"><button class="btn pri" data-act="task-add">הוספת משימה</button><label class="row small"><input type="checkbox" data-act="t-showdone" ${tShowDone?"checked":""}> הצג משימות שבוצעו</label></div>
  <div class="panel flush">${phases.map(ph=>{const xs=items.filter(x=>(x.t.phase||"כללי")===ph).sort((a,b)=>(a.d||"9").localeCompare(b.d||"9"));const dn=xs.filter(x=>x.t.done).length;
   const vis=xs.filter(x=>tShowDone||!x.t.done);
   return `<div class="phase"><span>${esc(ph)}</span><span class="muted">${dn}/${xs.length}</span></div>${vis.map(({t,d})=>`<div class="task ${t.done?"done":""} ${!t.done&&d&&daysTo(d)<0?"late":""}"><input type="checkbox" data-act="task-toggle" data-id="${t.id}" ${t.done?"checked":""} aria-label="בוצע"><span class="t">${esc(t.title)}</span>${t.owner?`<span class="tag">${esc(t.owner)}</span>`:""}<span class="due">${fdate(d)}${!t.done&&d&&daysTo(d)<0?" · באיחור":""}</span><button class="btn sm ghost" data-act="task-edit" data-id="${t.id}">עריכה</button></div>`).join("")}`}).join("")}</div></div>`;
}

let ciQ="";
function vDay(){
  const sch=[...S.schedule.items].sort((a,b)=>(a.time<"06:00"?"3"+a.time:a.time).localeCompare(b.time<"06:00"?"3"+b.time:b.time));
  const came=G().filter(g=>g.arrived).reduce((a,g)=>a+num(g.coming||g.invited),0);
  const s=stats();
  const res=ciQ?G().filter(g=>g.status!=="no"&&g.name.includes(ciQ)).slice(0,12):[];
  const tname=id=>{const t=S.tables.items.find(t=>t.id===id);return t?t.name:"—"};
  return `<h1>יום האירוע</h1><p class="lead">לו"ז, אנשי קשר של הספקים, ועמדת כניסה שמראה לכל אורח את מספר השולחן.</p>
  <div class="stack">
  <section class="panel"><h2>עמדת כניסה</h2><div class="row small muted" style="margin-bottom:8px">הגיעו ${came} מתוך ${s.yes} שאישרו</div>
   <input type="search" class="big-search" id="ci-q" placeholder="הקלידו שם אורח" value="${esc(ciQ)}" data-filter="ci">
   <div id="ci-res">${ciRes(res,tname)}</div></section>
  <div class="split">
  <section class="panel"><h2>לו"ז הערב</h2><div class="sched">${sch.map(x=>`<span class="tm">${esc(x.time)}</span><span>${esc(x.title)}${x.owner?` <span class="tag">${esc(x.owner)}</span>`:""}</span><button class="btn sm ghost" data-act="sch-del" data-id="${x.id}" aria-label="מחק">×</button>`).join("")}</div>
   <form class="row" data-form="sch" style="margin-top:12px"><input type="time" name="time" id="sc-t" required><input type="text" name="title" id="sc-ti" placeholder="מה קורה" required style="flex:1;min-width:120px"><input type="text" name="owner" id="sc-o" placeholder="אחראי" style="width:90px"><button class="btn sm" type="submit">הוספה</button></form></section>
  <section class="panel"><h2>אנשי קשר לספקים</h2>${S.vendors.items.filter(v=>v.status==="closed").map(v=>`<div class="pay"><span><b>${esc(v.name)}</b> <span class="small muted">${esc(v.cat)}${v.contact?" · "+esc(v.contact):""}</span></span><span class="amt" dir="ltr">${esc(v.phone||"")}</span></div>`).join("")||`<p class="muted small">אין ספקים סגורים.</p>`}
   <p class="small muted" style="margin-top:10px">את התשלומים שנשארו לערב עצמו תמצאו בלשונית ספקים.</p></section>
  </div></div>`;
}
function ciRes(res,tname){return res.map(g=>`<div class="ci"><span class="tb">${esc(tname(g.table))}</span><span><span class="nm">${esc(g.name)}</span><div class="small muted">${num(g.coming||g.invited)} אורחים · ${esc(g.group||"")}</div></span><button class="btn go ${g.arrived?"":"pri"}" data-act="arrive" data-id="${g.id}">${g.arrived?"הגיע ✓":"סמן שהגיע"}</button></div>`).join("")||(ciQ?`<p class="muted">לא נמצא אורח בשם הזה.</p>`:"")}

function vSettings(){const e=E();
  const f=(k,l,t="text")=>`<label class="field">${l}<input type="${t}" id="s-${k}" data-bind="event.${k}" value="${esc(e[k]??"")}"></label>`;
  return `<h1>הגדרות האירוע</h1><p class="lead">הפרטים כאן מזינים את ההזמנה, התקציב והצ'קליסט.</p>
  <div class="stack"><section class="panel"><div class="form">
  ${f("groom","שם החתן")}${f("bride","שם הכלה")}${f("date","תאריך","date")}${f("time","שעת קבלת פנים","time")}${f("venue","אולם")}${f("address","כתובת")}
  ${f("budget","תקציב כולל (₪)","number")}${f("guestQuota","מכסת מוזמנים כוללת","number")}${f("pricePerPlate","מחיר למנה (₪)","number")}${f("minPlates","מינימום מנות בחוזה","number")}${f("avgGift","מתנה ממוצעת לאורח (₪)","number")}${f("pendingRate","% הגעה צפוי ממי שלא ענה","number")}
  </div></section>
  ${cloud()?`<section class="panel"><h2>שיתוף עם המשפחה</h2><p class="small muted">כל מי שמוזמן כאן רואה את אותו אירוע ומתעדכן בזמן אמת.</p><div id="share-box"><p class="muted small">טוען…</p></div></section>
  <section class="panel"><h2>החשבון שלי</h2><div class="pay"><span dir="ltr">${esc(session&&session.user.email)}</span><button class="btn sm" data-act="logout" style="margin-inline-start:auto">יציאה</button></div>
  ${memberships.length>1?`<h3 style="margin-top:12px">האירועים שלי</h3>${memberships.map(m=>`<div class="pay"><span>${esc((m.events&&(m.events.groom+" ו"+m.events.bride))||"אירוע")}</span><span class="small muted">${fdate(m.events&&m.events.date)}</span>${m.event_id===eventId?`<span class="pill p-acc" style="margin-inline-start:auto">פתוח</span>`:`<button class="btn sm" style="margin-inline-start:auto" data-act="switch-event" data-id="${m.event_id}">מעבר</button>`}</div>`).join("")}`:""}
  <div class="row" style="margin-top:10px"><button class="btn sm" data-act="new-event">יצירת אירוע נוסף</button></div></section>`:`<section class="panel"><h2>מצב מקומי</h2><p class="small muted">האתר עדיין לא מחובר למסד נתונים, ולכן הנתונים נשמרים רק בדפדפן הזה. אחרי חיבור ל-Supabase (ראו README) תקבלו התחברות, שיתוף וסנכרון.</p></section>`}
  <section class="panel"><h2>גיבוי והעברה</h2><p class="small muted">הנתונים נשמרים אוטומטית. לגיבוי נוסף אפשר להעתיק את כל הנתונים.</p>
  <div class="row"><button class="btn" data-act="export">העתקת כל הנתונים</button><button class="btn" data-act="import">שחזור מגיבוי</button></div></section>
  <section class="panel"><h2>התחלה מחדש</h2><div class="row"><button class="btn" data-act="sample">טעינת נתוני דוגמה</button><button class="btn danger" data-act="fresh">${cloud()?"מחיקת האירוע":"מחיקת הכול והתחלה מאפס"}</button></div></section></div>`;
}

/* ---------- modal ---------- */
function modal(title,body,onSave,extra){
  const root=$("#modal-root");
  root.innerHTML=`<div class="modal-bg" data-act="modal-bg"><form class="modal" id="modal-form" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h2>${esc(title)}</h2>${body}<div class="foot">${onSave?`<button class="btn pri" type="submit">שמירה</button>`:""}<button class="btn" type="button" data-act="modal-close">${onSave?"ביטול":"סגירה"}</button>${extra||""}</div></form></div>`;
  const form=$("#modal-form");
  form.addEventListener("submit",ev=>{ev.preventDefault();if(onSave){const r=onSave(new FormData(form),form);if(r===false)return}closeModal()});
  const first=form.querySelector("input,select,textarea");if(first)first.focus();
}
function closeModal(){$("#modal-root").innerHTML="";render()}
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}

function guestForm(g){g=g||{side:"shared",invited:2,status:"pending",priority:"A",meal:"רגיל"};
  const groups=[...new Set(G().map(x=>x.group).filter(Boolean))];
  return `<div class="form">
  <label class="field wide">שם (כפי שיופיע בהזמנה)<input type="text" name="name" id="m-name" required value="${esc(g.name||"")}"></label>
  <label class="field">טלפון<input type="tel" name="phone" id="m-phone" dir="ltr" value="${esc(g.phone||"")}"></label>
  <label class="field">צד<select name="side" id="m-side">${Object.entries(SIDES).map(([k,v])=>`<option value="${k}" ${g.side===k?"selected":""}>${v}</option>`).join("")}</select></label>
  <label class="field">קבוצה<input type="text" name="group" id="m-group" list="groups" value="${esc(g.group||"")}"><datalist id="groups">${groups.map(x=>`<option value="${esc(x)}">`).join("")}</datalist></label>
  <label class="field">כמה מוזמנים בהזמנה<input type="number" min="1" name="invited" id="m-inv" value="${num(g.invited)||1}"></label>
  <label class="field">עדיפות<select name="priority" id="m-pri">${["A","B","C"].map(k=>`<option ${g.priority===k?"selected":""}>${k}</option>`).join("")}</select></label>
  <label class="field">סטטוס<select name="status" id="m-st">${Object.entries(STATUS).map(([k,v])=>`<option value="${k}" ${g.status===k?"selected":""}>${v}</option>`).join("")}</select></label>
  <label class="field">כמה מגיעים בפועל<input type="number" min="0" name="coming" id="m-com" value="${g.coming??""}"></label>
  <label class="field">מנה<select name="meal" id="m-meal">${MEALS.map(k=>`<option ${g.meal===k?"selected":""}>${k}</option>`).join("")}</select></label>
  <label class="field wide">הערות<input type="text" name="notes" id="m-notes" value="${esc(g.notes||"")}"></label></div>`}
function readGuest(fd,g){["name","phone","side","group","priority","status","meal","notes"].forEach(k=>g[k]=(fd.get(k)||"").toString().trim());g.invited=num(fd.get("invited"))||1;g.coming=fd.get("coming")===""?null:num(fd.get("coming"));if(g.status==="no")g.table=null;return g}

function vendorForm(v){v=v||{cat:CATS[0],status:"lead"};
 return `<div class="form"><label class="field wide">שם הספק<input type="text" name="name" id="v-name" required value="${esc(v.name||"")}"></label>
 <label class="field">קטגוריה<select name="cat" id="v-cat">${CATS.map(c=>`<option ${v.cat===c?"selected":""}>${c}</option>`).join("")}</select></label>
 <label class="field">סטטוס<select name="status" id="v-st">${Object.entries(VSTATUS).map(([k,l])=>`<option value="${k}" ${v.status===k?"selected":""}>${l}</option>`).join("")}</select></label>
 <label class="field">מחיר כולל מע"מ (₪)<input type="number" name="price" id="v-price" value="${v.price||""}"></label>
 <label class="field">איש קשר<input type="text" name="contact" id="v-contact" value="${esc(v.contact||"")}"></label>
 <label class="field">טלפון<input type="tel" name="phone" id="v-phone" dir="ltr" value="${esc(v.phone||"")}"></label>
 <label class="field wide">הערות<textarea name="notes" id="v-notes" rows="3">${esc(v.notes||"")}</textarea></label></div>`}

/* ---------- actions ---------- */
function findG(id){return G().find(g=>g.id===id)}
function findV(id){return S.vendors.items.find(v=>v.id===id)}
document.addEventListener("click",ev=>{
  const el=ev.target.closest("[data-act]");if(!el)return;
  const a=el.dataset.act,id=el.dataset.id;
  if(el.tagName==="INPUT"&&el.type==="checkbox"){return} // handled on change
  switch(a){
  case "nav":view=el.dataset.v;try{localStorage.setItem("chuppah-view",view)}catch(e){};if(location.hash!=="#"+view)history.replaceState(null,"","#"+view);render();window.scrollTo(0,0);break;
  case "modal-bg":if(ev.target===el)closeModal();break;
  case "modal-close":closeModal();break;
  case "sample":loadSample();break;
  case "fresh":modal("להתחיל מאפס?",`<p>כל הנתונים של האירוע (מוזמנים, ספקים, תקציב ומשימות) יימחקו לכל מי ששותף בו. אי אפשר לבטל.</p>`,()=>{wipe()});$("#modal-form .btn.pri").textContent="מחיקה";break;
  case "guest-add":modal("מוזמן חדש",guestForm(),fd=>{const g=readGuest(fd,{id:uid(),table:null,arrived:false,gift:{}});const d=g.phone&&G().find(x=>normPhone(x.phone)===normPhone(g.phone));G().push(g);save("guests");if(d)toast(`שימו לב: אותו טלפון כמו ${d.name}`)});break;
  case "guest-edit":{const g=findG(id);modal("עריכת מוזמן",guestForm(g),fd=>{readGuest(fd,g);save("guests")},`<button class="btn danger" type="button" data-act="guest-del" data-id="${id}" style="margin-inline-start:auto">מחיקה</button>`);break}
  case "guest-del":S.guests.items=G().filter(g=>g.id!==id);save("guests");closeModal();break;
  case "guest-import":modal("ייבוא מוזמנים",`<p class="small muted">העתיקו עמודות מאקסל והדביקו כאן. סדר העמודות: שם, טלפון, צד (חתן / כלה / משותף), קבוצה, כמות.</p><textarea name="csv" id="m-csv" rows="10" placeholder="משפחת כהן	050-1234567	כלה	משפחה	4"></textarea>`,fd=>{const r=importGuests(fd.get("csv"));toast(`נוספו ${r.added}, דולגו ${r.dup} כפילויות`)});break;
  case "guest-copy":{const rows=[["שם","טלפון","צד","קבוצה","הוזמנו","סטטוס","מגיעים","מנה","שולחן"],...G().map(g=>[g.name,g.phone,SIDES[g.side],g.group,g.invited,STATUS[g.status],g.coming??"",g.meal,(S.tables.items.find(t=>t.id===g.table)||{}).name||""])].map(r=>r.join("\t")).join("\n");copy(rows,"הרשימה הועתקה. הדביקו באקסל");break}
  case "rfilter":rFilter=el.dataset.v;render();break;
  case "sent":{const g=findG(id);if(!g.sentAt)g.sentAt=iso(today());save("guests");setTimeout(render,100);break}
  case "remind":{const g=findG(id);g.reminders=(g.reminders||0)+1;save("guests");setTimeout(render,100);break}
  case "rsvp":{const g=findG(id);g.status=el.dataset.v;if(g.status==="yes"&&g.coming==null)g.coming=g.invited;if(g.status==="no")g.table=null;save("guests");render();break}
  case "table-add":modal("שולחן חדש",`<div class="form"><label class="field">שם / מספר<input type="text" name="name" id="t-name" required value="${S.tables.items.length+1}"></label><label class="field">מקומות<input type="number" name="seats" id="t-seats" value="12"></label></div>`,fd=>{S.tables.items.push({id:uid(),name:fd.get("name"),seats:num(fd.get("seats"))});save("tables")});break;
  case "tables-bulk":modal("הוספת כמה שולחנות",`<div class="form"><label class="field">כמה שולחנות<input type="number" name="n" id="tb-n" value="10"></label><label class="field">מקומות בכל שולחן<input type="number" name="seats" id="tb-s" value="12"></label></div>`,fd=>{let n=num(fd.get("n")),st=S.tables.items.length;for(let i=1;i<=n;i++)S.tables.items.push({id:uid(),name:String(st+i),seats:num(fd.get("seats"))});save("tables")});break;
  case "table-edit":{const t=S.tables.items.find(t=>t.id===id);modal("עריכת שולחן",`<div class="form"><label class="field">שם / מספר<input type="text" name="name" id="te-name" value="${esc(t.name)}"></label><label class="field">מקומות<input type="number" name="seats" id="te-seats" value="${t.seats}"></label></div>`,fd=>{t.name=fd.get("name");t.seats=num(fd.get("seats"));save("tables")},`<button class="btn danger" type="button" data-act="table-del" data-id="${id}" style="margin-inline-start:auto">מחיקת השולחן</button>`);break}
  case "table-del":S.tables.items=S.tables.items.filter(t=>t.id!==id);G().forEach(g=>{if(g.table===id)g.table=null});save("tables");save("guests");closeModal();break;
  case "seat":if(!selGuests.size){toast("סמנו קודם מוזמנים ברשימה");break}selGuests.forEach(gid=>{const g=findG(gid);if(g)g.table=id});selGuests.clear();save("guests");render();break;
  case "unseat":findG(id).table=null;save("guests");render();break;
  case "autoseat":{const r=autoSeat();save("guests");render();toast(r?`הושבו ${r} הזמנות`:"אין מקום פנוי או שאין מי להושיב");break}
  case "entry-list":{const list=G().filter(g=>g.table&&g.status!=="no").sort((a,b)=>a.name.localeCompare(b.name));const tn=id=>(S.tables.items.find(t=>t.id===id)||{}).name;
    modal("רשימת כניסה לפי א-ב",`<div class="tbl-wrap" style="max-height:60vh"><table><thead><tr><th>שם</th><th class="num">אורחים</th><th class="num">שולחן</th></tr></thead><tbody>${list.map(g=>`<tr><td>${esc(g.name)}</td><td class="num">${seatsOf(g)}</td><td class="num"><b>${esc(tn(g.table))}</b></td></tr>`).join("")}</tbody></table></div>`,null,`<button class="btn" type="button" data-act="entry-copy">העתקה</button>`);break}
  case "entry-copy":{const tn=id=>(S.tables.items.find(t=>t.id===id)||{}).name;copy(G().filter(g=>g.table&&g.status!=="no").sort((a,b)=>a.name.localeCompare(b.name)).map(g=>`${g.name}\t${seatsOf(g)}\t${tn(g.table)}`).join("\n"),"הרשימה הועתקה");break}
  case "vfilter":vFilter=el.dataset.v;render();break;
  case "vendor-add":modal("ספק חדש",vendorForm(),fd=>{const v={id:uid(),payments:[],contract:{signed:false,checks:{}}};["name","cat","status","contact","phone","notes"].forEach(k=>v[k]=(fd.get(k)||"").toString());v.price=num(fd.get("price"));S.vendors.items.push(v);save("vendors")});break;
  case "vendor-edit":{const v=findV(id);modal("עריכת ספק",vendorForm(v),fd=>{["name","cat","status","contact","phone","notes"].forEach(k=>v[k]=(fd.get(k)||"").toString());v.price=num(fd.get("price"));save("vendors")},`<button class="btn danger" type="button" data-act="vendor-del" data-id="${id}" style="margin-inline-start:auto">מחיקה</button>`);break}
  case "vendor-del":S.vendors.items=S.vendors.items.filter(v=>v.id!==id);save("vendors");closeModal();break;
  case "pay-del":{const v=findV(id);v.payments=v.payments.filter(p=>p.id!==el.dataset.p);save("vendors");render();break}
  case "exp-del":S.budget.expenses=S.budget.expenses.filter(x=>x.id!==id);save("budget");render();break;
  case "task-add":modal("משימה חדשה",taskForm(),fd=>{S.tasks.items.push(readTask(fd,{id:uid(),done:false}));save("tasks")});break;
  case "task-edit":{const t=S.tasks.items.find(t=>t.id===id);modal("עריכת משימה",taskForm(t),fd=>{readTask(fd,t);save("tasks")},`<button class="btn danger" type="button" data-act="task-del" data-id="${id}" style="margin-inline-start:auto">מחיקה</button>`);break}
  case "task-del":S.tasks.items=S.tasks.items.filter(t=>t.id!==id);save("tasks");closeModal();break;
  case "arrive":{const g=findG(id);g.arrived=!g.arrived;save("guests");render();const q=$("#ci-q");if(q){q.focus();q.select()}break}
  case "sch-del":S.schedule.items=S.schedule.items.filter(x=>x.id!==id);save("schedule");render();break;
  case "export":copy(JSON.stringify(S),"כל הנתונים הועתקו. שמרו אותם בקובץ או בהודעה לעצמכם");break;
  case "import":modal("שחזור מגיבוי",`<p class="small muted">הדביקו כאן טקסט גיבוי שהעתקתם קודם. הנתונים הנוכחיים יוחלפו.</p><textarea name="json" id="m-json" rows="8"></textarea><p class="small" id="imp-err" style="color:var(--bad)"></p>`,fd=>{try{const v=JSON.parse(fd.get("json"));if(!v.event)throw 0;S=Object.assign(blank(),v);anyDoc=true;saveAll();toast("הנתונים שוחזרו")}catch(e){$("#imp-err").textContent="הטקסט לא נראה כמו גיבוי של האפליקציה. העתיקו אותו שוב במלואו.";return false}});break;
  }
});
document.addEventListener("change",ev=>{
  const el=ev.target;const a=el.dataset.act,id=el.dataset.id;
  if(a==="task-toggle"){const t=S.tasks.items.find(t=>t.id===id);t.done=el.checked;save("tasks");render();return}
  if(a==="sel"){el.checked?selGuests.add(id):selGuests.delete(id);render();return}
  if(a==="v-signed"){const v=findV(id);v.contract=v.contract||{checks:{}};v.contract.signed=el.checked;save("vendors");render();return}
  if(a==="v-check"){const v=findV(id);v.contract=v.contract||{checks:{}};v.contract.checks=v.contract.checks||{};v.contract.checks[CONTRACT[num(el.dataset.i)]]=el.checked;save("vendors");return}
  if(a==="pay-toggle"){const p=findV(id).payments.find(p=>p.id===el.dataset.p);p.paid=el.checked;save("vendors");render();return}
  if(a==="pay-payer"){const p=findV(id).payments.find(p=>p.id===el.dataset.p);p.payer=el.value;save("vendors");pendingRender=true;return}
  if(a==="exp-payer"){const x=S.budget.expenses.find(x=>x.id===id);x.payer=el.value;save("budget");pendingRender=true;return}
  if(el.dataset.pledge){S.budget.pledges=S.budget.pledges||{};S.budget.pledges[el.dataset.pledge]=num(el.value);save("budget");pendingRender=true;return}
  if(a==="exp-paid"){const x=S.budget.expenses.find(x=>x.id===id);x.paid=el.checked;save("budget");render();return}
  if(a==="gift-came"){giftOnlyCame=el.checked;render();return}
  if(a==="t-showdone"){tShowDone=el.checked;render();return}
  if(el.dataset.bind){const k=el.dataset.bind.split(".")[1];let v=el.value;if(el.type==="number")v=v===""?"":num(v);S.event[k]=v;save("event");pendingRender=true;return}
  if(el.dataset.plan){S.budget.plans[el.dataset.plan]=num(el.value);save("budget");pendingRender=true;return}
  if(el.dataset.guest){const g=findG(el.dataset.guest);const f=el.dataset.gf;let v=el.type==="checkbox"?el.checked:el.type==="number"?num(el.value):el.value;
    if(f.startsWith("gift.")){g.gift=g.gift||{};g.gift[f.slice(5)]=v}else g[f]=v;save("guests");pendingRender=true;return}
});
document.addEventListener("input",ev=>{
  const el=ev.target;const f=el.dataset.filter;if(!f)return;
  if(f==="ci"){ciQ=el.value.trim();const tname=id=>{const t=S.tables.items.find(t=>t.id===id);return t?t.name:"—"};$("#ci-res").innerHTML=ciRes(ciQ?G().filter(g=>g.status!=="no"&&g.name.includes(ciQ)).slice(0,12):[],tname);return}
  gFilter[f]=el.value.trim();
  const pos=el.selectionStart;render();const n=document.getElementById(el.id);if(n){n.focus();if(pos!=null&&n.setSelectionRange)try{n.setSelectionRange(pos,pos)}catch(e){}}
});
document.addEventListener("submit",ev=>{
  const f=ev.target;const k=f.dataset.form;if(!k)return;ev.preventDefault();const fd=new FormData(f);
  if(k==="pay"){const v=findV(f.dataset.id);if(!num(fd.get("amount")))return;v.payments=v.payments||[];v.payments.push({id:uid(),label:fd.get("label")||"תשלום",amount:num(fd.get("amount")),due:fd.get("due")||"",payer:fd.get("payer")||"",paid:false});save("vendors")}
  if(k==="exp"){if(!fd.get("title"))return;S.budget.expenses.push({id:uid(),title:fd.get("title"),cat:fd.get("cat"),amount:num(fd.get("amount")),payer:fd.get("payer")||"",paid:false});save("budget")}
  if(k==="sch"){S.schedule.items.push({id:uid(),time:fd.get("time"),title:fd.get("title"),owner:fd.get("owner")});save("schedule")}
  if(f.id==="onb")return;
  render();
});
document.addEventListener("submit",ev=>{if(ev.target.id!=="onb")return;ev.preventDefault();const fd=new FormData(ev.target);createWedding({groom:fd.get("groom"),bride:fd.get("bride"),date:fd.get("date"),budget:num(fd.get("budget")),pricePerPlate:num(fd.get("pricePerPlate")),avgGift:num(fd.get("avgGift"))})});

function taskForm(t){t=t||{phase:"כללי"};const phases=[...new Set(S.tasks.items.map(x=>x.phase))];
  return `<div class="form"><label class="field wide">משימה<input type="text" name="title" id="tk-t" required value="${esc(t.title||"")}"></label>
  <label class="field">שלב<input type="text" name="phase" id="tk-p" list="phases" value="${esc(t.phase||"")}"><datalist id="phases">${phases.map(p=>`<option value="${esc(p)}">`).join("")}</datalist></label>
  <label class="field">תאריך יעד<input type="date" name="due" id="tk-d" value="${esc(taskDue(t)||"")}"></label>
  <label class="field">אחראי<input type="text" name="owner" id="tk-o" value="${esc(t.owner||"")}"></label></div>`}
function readTask(fd,t){t.title=fd.get("title");t.phase=fd.get("phase")||"כללי";t.owner=fd.get("owner");const d=fd.get("due");if(d&&d!==taskDue(t)){t.due=d}return t}

function copy(text,msg){
  const ok=()=>toast(msg);
  try{navigator.clipboard.writeText(text).then(ok,()=>fallbackCopy(text,msg))}catch(e){fallbackCopy(text,msg)}
}
function fallbackCopy(text,msg){modal("העתיקו ידנית",`<p class="small muted">סמנו את הטקסט והעתיקו (Ctrl+C).</p><textarea id="m-copy" rows="10">${esc(text)}</textarea>`,null);const t=$("#m-copy");t.focus();t.select()}

function importGuests(txt){let added=0,dup=0;const sideMap=s=>/חתן/.test(s)?"groom":/כלה/.test(s)?"bride":"shared";
  String(txt||"").split(/\r?\n/).forEach(line=>{const c=line.split(/\t|,/).map(x=>x.trim());if(!c[0])return;
    const ph=c[1]||"";if((ph&&G().some(g=>normPhone(g.phone)===normPhone(ph)))||G().some(g=>g.name===c[0])){dup++;return}
    G().push({id:uid(),name:c[0],phone:ph,side:sideMap(c[2]||""),group:c[3]||"",invited:num(c[4])||1,status:"pending",priority:"A",meal:"רגיל",table:null,arrived:false,gift:{}});added++});
  save("guests");return{added,dup}}

function autoSeat(){
  const free={};S.tables.items.forEach(t=>free[t.id]=num(t.seats)-seatedCount(t.id));
  const un=G().filter(g=>g.status!=="no"&&!g.table);
  const groups={};un.forEach(g=>{const k=g.side+"|"+(g.group||"");(groups[k]=groups[k]||[]).push(g)});
  const order=Object.values(groups).sort((a,b)=>b.reduce((s,g)=>s+seatsOf(g),0)-a.reduce((s,g)=>s+seatsOf(g),0));
  let n=0;
  order.forEach(gr=>{
    const need=gr.reduce((s,g)=>s+seatsOf(g),0);
    // prefer a table already holding this group
    const k=gr[0].side+"|"+(gr[0].group||"");
    const home=S.tables.items.filter(t=>G().some(g=>g.table===t.id&&(g.side+"|"+(g.group||""))===k)).map(t=>t.id);
    let fit=home.find(id=>free[id]>=need)||S.tables.items.map(t=>t.id).filter(id=>free[id]>=need).sort((a,b)=>free[a]-free[b])[0];
    if(fit){gr.forEach(g=>{g.table=fit;n++});free[fit]-=need;return}
    gr.sort((a,b)=>seatsOf(b)-seatsOf(a)).forEach(g=>{const ids=[...home,...S.tables.items.map(t=>t.id)];const t=ids.find(id=>free[id]>=seatsOf(g));if(t){g.table=t;free[t]-=seatsOf(g);n++}});
  });
  return n;
}

/* ---------- create / sample ---------- */
async function wipe(){
  if(cloud()){
    if(myRole!=="owner"){toast("רק בעלי האירוע יכולים למחוק אותו");return}
    const {error}=await sb.from("events").delete().eq("id",eventId);
    if(error){toast("המחיקה נכשלה");return}
    if(channel)sb.removeChannel(channel);eventId=null;S=blank();anyDoc=false;synced={};
    try{localStorage.removeItem("chuppah-event")}catch(e){}
    await loadMemberships();render();toast("האירוע נמחק");return}
  S=blank();anyDoc=false;try{localStorage.removeItem(LS)}catch(e){};render();toast("הנתונים נמחקו")}
function baseFor(ev){
  const st=blank();st.event=Object.assign({time:"19:30",pendingRate:75,minPlates:0,guestQuota:0,inviteText:""},ev);
  CATS.forEach((c,i)=>st.budget.plans[c]=Math.round(num(ev.budget)*CAT_PCT[i]/100/100)*100);
  st.tasks.items=TASKS_TPL.map(([phase,title,days])=>({id:uid(),phase,title,days,done:false,owner:""}));
  st.schedule.items=SCHED_TPL.map(([time,title,owner])=>({id:uid(),time,title,owner}));
  return st;
}
async function putState(st,msg){
  view="home";
  if(cloud()&&!eventId){if(!(await newCloudEvent(st)))return}
  else{S=st;anyDoc=true;saveAll()}
  render();toast(msg)}
function createWedding(ev){putState(baseFor(ev),"החתונה נוצרה. מזל טוב!")}
function loadSample(){putState(makeSample(),"נטענו נתוני דוגמה")}
function makeSample(){
  const date=iso(new Date(today().getTime()+226*864e5));
  const st=baseFor({groom:"נועם",bride:"מאיה",date,time:"19:30",venue:"גני התערוכה",address:"רוקח 101, תל אביב",budget:210000,pricePerPlate:340,minPlates:300,avgGift:450,pendingRate:75,guestQuota:400,sample:true});
  const fam=["כהן","לוי","מזרחי","פרץ","ביטון","אברהם","פרידמן","אזולאי","דהן","שפירא","גבאי","חדד","אוחיון","יוסף","רוזן","קליין","בן דוד","עמר","גולן","נחום","שטרן","ברק","טל","אלון","סויסה","מלכה","זילברמן","אדלר","חזן","שרעבי"];
  const first=["דנה","יואב","שירה","איתי","רוני","עומר","נועה","אלון","תמר","גיא","ליאור","מיכל","עידו","הילה","אורי","יעל","דור","שני","אסף","קרן","רועי","ענבל","ניר","מורן","טל","עדי","בן","גלי","אביב","ליה"];
  const groups={groom:[["משפחה",14,3],["חברים מהצבא",9,2],["עבודה",8,2],["חברים מהתיכון",7,2]],bride:[["משפחה",16,3],["חברות מהאוניברסיטה",9,2],["עבודה",8,2],["שכנים",4,2]],shared:[["חברים משותפים",10,2]]};
  let i=0;const rnd=(n)=>{i=(i*9301+49297)%233280;return Math.floor(i/233280*n)};
  const statuses=["yes","yes","yes","yes","yes","pending","pending","pending","no","maybe"];
  Object.entries(groups).forEach(([side,gs])=>gs.forEach(([grp,n,avg])=>{for(let k=0;k<n;k++){
    const isFam=grp==="משפחה";const name=isFam?`משפחת ${fam[rnd(fam.length)]}`:`${first[rnd(first.length)]} ${fam[rnd(fam.length)]}${rnd(3)?" + בן/בת זוג":""}`;
    const inv=isFam?2+rnd(4):name.includes("+")?2:1;const status=statuses[rnd(statuses.length)];
    st.guests.items.push({id:uid(),name,phone:"05"+(2+rnd(7))+"-"+String(1000000+rnd(8999999)),side,group:grp,invited:inv,status,coming:status==="yes"?Math.max(1,inv-(rnd(5)===0?1:0)):null,priority:rnd(5)===0?"B":"A",meal:rnd(9)===0?"צמחוני":rnd(14)===0?"טבעוני":"רגיל",table:null,arrived:false,gift:{},sentAt:status!=="pending"||rnd(2)?iso(new Date(today().getTime()-12*864e5)):"",reminders:status==="pending"?rnd(2):0,notes:""});
  }}));
  // dedupe names
  const seen={};st.guests.items=st.guests.items.filter(g=>seen[g.name]?false:(seen[g.name]=1));
  for(let t=1;t<=14;t++)st.tables.items.push({id:uid(),name:t===1?"משפחה קרובה":String(t),seats:t===1?14:12});
  const S0=S;S=st;autoSeat();
  // leave some unseated to show the flow
  st.guests.items.filter(g=>g.table).slice(-8).forEach(g=>g.table=null);
  S=S0;
  const d=n=>iso(new Date(today().getTime()+n*864e5));
  const V=(name,cat,status,price,contact,phone,signed,pays,notes)=>({id:uid(),name,cat,status,price,contact,phone,notes:notes||"",contract:{signed,checks:signed?Object.fromEntries(CONTRACT.slice(0,6).map(c=>[c,true])):{}},payments:pays.map(([label,amount,due,paid,payer])=>({id:uid(),label,amount,due,paid,payer:payer||""}))});
  st.vendors.items=[
    V("גני התערוכה","אולם וקייטרינג","closed",15000,"שרית, מנהלת אירועים","054-7001122",true,[["מקדמה",15000,d(-60),true,"groom_p"],["תשלום ביניים",40000,d(150),false,"bride_p"],["יתרה לפי כמות מנות",0,d(226),false,"couple"]],"דמי הזמנת אולם, המנות מחושבות בנפרד. מינימום 300 מנות."),
    V("סטודיו אור ויובל","צילום ווידאו","closed",17500,"יובל","052-3344556",true,[["מקדמה",3500,d(-40),true,"couple"],["יתרה",14000,d(226),false,"couple"]]),
    V("DJ עמית","מוזיקה ודיג'יי","closed",9800,"עמית","050-9988776",false,[["מקדמה",2000,d(12),false],["יתרה",7800,d(226),false]],"צריך לחתום ולהעביר מקדמה"),
    V("פרחי השרון","עיצוב ופרחים","offer",14000,"רונית","053-1212121",false,[],"כולל חופה ומרכזי שולחן"),
    V("בית הכלות של גלית","שמלה וחליפה","closed",8500,"גלית","054-5656565",true,[["מקדמה",2500,d(-20),true,"bride_p"],["תשלום שני",3000,d(25),false,"bride_p"],["יתרה",3000,d(200),false,"bride_p"]]),
    V("אלה מייקאפ","איפור ושיער","lead",2800,"אלה","050-1717171",false,[]),
    V("הרב יוסף","רב ורבנות","closed",2500,"הרב יוסף","052-8080808",true,[["תשלום ביום האירוע",2500,d(226),false,"groom_p"]]),
    V("אוטובוסים צפון","הסעות","offer",3200,"משה","054-2323232",false,[],"שני אוטובוסים מחיפה")
  ];
  st.budget.expenses=[{id:uid(),title:"אלכוהול לבר (קנינו לבד)",cat:"בר ואלכוהול",amount:6200,paid:true,payer:"groom_p"},{id:uid(),title:"טבעות",cat:"טבעות",amount:9000,paid:true,payer:"couple"},{id:uid(),title:"הזמנה דיגיטלית ועיצוב",cat:"הזמנות ומדיה",amount:600,paid:true,payer:"couple"}];
  st.budget.pledges={couple:90000,groom_p:60000,bride_p:60000};
  st.tasks.items.forEach(t=>{const due=addDays(date,-t.days);if(daysTo(due)<-5)t.done=true});
  const late=st.tasks.items.find(t=>t.title.startsWith("סגירת מעצב"));if(late)late.done=false;
  return st;
}

boot();
