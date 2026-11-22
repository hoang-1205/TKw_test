"use strict";
const $ = selector => document.querySelector(selector);
const day = 86400000;
const key = "milestone-lhu-v1";
let saved;
try { saved = JSON.parse(localStorage.getItem(key)); } catch {}
if (!saved || !Number.isFinite(saved.start) || !Array.isArray(saved.entries)) {
  saved = {start:new Date().setHours(0,0,0,0), entries:[]};
  try {localStorage.setItem(key,JSON.stringify(saved));} catch {}
}
const milestones = [
  ["Đăng ký đề tài","Xác định vấn đề, mục tiêu và phạm vi của đồ án.",-14,9,"Đề tài sát với nhu cầu của sinh viên. Nhóm đã xác định rõ người dùng và mục tiêu sản phẩm."],
  ["Phân tích yêu cầu","Mô tả các chức năng và luồng sử dụng của hệ thống.",-7,8.5,"Luồng nộp bài rõ ràng. Nhóm nên bổ sung trường hợp sinh viên nộp lại sau hạn."],
  ["Thiết kế giao diện","Nộp bản thiết kế các màn hình và luồng tương tác chính.",3,null,""],
  ["Xây dựng sản phẩm","Hoàn thiện chức năng, kiểm thử và nộp liên kết demo.",10,null,""],
  ["Báo cáo cuối kỳ","Nộp slide, báo cáo tổng kết và trình bày sản phẩm.",17,null,""]
].map(([name,desc,offset,score,comment],i)=>({id:i+1,name,desc,score,comment,due:saved.start+(offset+1)*day-1}));
const date = time => new Date(time).toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"});
const fmt = n => n.toLocaleString("vi-VN",{maximumFractionDigits:2});
const entries = m => saved.entries.filter(e=>e.id===m.id);
const submitted = m => m.score!==null || entries(m).length>0;
const status = m => submitted(m) ? (entries(m).some(e=>e.time<=m.due)||m.score!==null ? "Đã nộp" : "Nộp trễ") : Date.now()>m.due ? "Trễ hạn" : "Chưa nộp";
const gradeState = m => m.score!==null ? "Đã chấm" : submitted(m) ? "Chờ chấm" : "Chưa nộp";
const badge = s => '<span class="badge '+({"Đã nộp":"good","Đã chấm":"good","Nộp trễ":"bad","Trễ hạn":"bad","Chờ chấm":"warn"}[s]||"")+'">'+s+'</span>';
const metric = (icon,name,value) => '<div class="metric"><span class="symbol" aria-hidden="true">'+icon+'</span><div><small>'+name+'</small><b>'+value+'</b></div></div>';
const graded = milestones.filter(m=>m.score!==null);
const avg = fmt(graded.reduce((a,m)=>a+m.score,0)/graded.length);
const modal = $("#modal");
let editing;
const normalize = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replaceAll("đ","d");
$("#search").addEventListener("input", () => render());
function render(){
  const done=milestones.filter(submitted).length;
  const next=milestones.find(m=>!submitted(m));
  const pct=Math.round(done/milestones.length*100);
  $("#metrics").innerHTML=metric("⚑","Tổng cột mốc","05")+metric("✓","Đã nộp bài",String(done).padStart(2,"0"))+metric("◷","Tiến độ nộp bài",pct+"%");
  const report = milestones[milestones.length-1];
  const focus = next ? `<section class="panel next"><div class="kicker">MỐC CẦN NỘP</div><h3>${next.name}</h3><p class="dim">Hạn nộp · ${date(next.due)}</p><button class="btn" data-open="${next.id}">Mở chi tiết mốc</button></section>` : "";
  $("#side").innerHTML = focus + `<section class="panel countdown"><div class="kicker">LỊCH BÁO CÁO</div><h3>Báo cáo cuối kỳ</h3><p class="dim">${date(report.due)} · 23:59</p><div id="clock" role="timer"></div></section>
    <section class="panel"><h3>Tiến độ dự án</h3><div class="row dim"><span>Cột mốc đã nộp</span><b>${done}/${milestones.length}</b></div><div class="meter"><i style="width:${pct}%"></i></div></section>`;
  updateClock();
  const query = normalize($("#search").value.trim());
  const shown=milestones.filter(m=>normalize(m.name).includes(query) && ($("#filter").selectedIndex===0||$("#filter").value===(status(m))));
  $("#list").innerHTML=shown.map(m=>{
    const top='<div class="row"><span class="kicker">MỐC 0'+m.id+'</span>'+badge(status(m))+'</div><h3>'+m.name+'</h3>';
    return '<div class="timeline '+(submitted(m)?"done":m===next?"current":"")+'"><article class="card">'+top+'<p class="dim">'+m.desc+'</p><div class="row foot"><span class="dim">Hạn nộp · '+date(m.due)+'</span><button class="'+(m===next?"primary":"plain")+'" data-open="'+m.id+'">'+(m===next?"Nộp bài":"Xem chi tiết")+'</button></div></article></div>';
  }).join("") || '<div class="panel">Không tìm thấy cột mốc phù hợp. Hãy đổi từ khóa hoặc bộ lọc.</div>';
}
function openDetail(id){
  editing=milestones.find(m=>m.id===id);
  const m=editing;
  $("#dialogTitle").textContent="Mốc 0"+m.id+" · "+m.name;
  $("#detail").innerHTML='<p>'+m.desc+'</p><p class="dim">Hạn nộp · '+date(m.due)+' lúc 23:59</p>'+badge(status(m))+
  (m.score===null?'<label class="field">Liên kết bài nộp<input type="url" required placeholder="https://..." id="url"></label><button class="primary" type="submit">'+(submitted(m)?"Nộp phiên bản mới":"Xác nhận nộp bài")+'</button><p class="dim">Bài nộp được lưu trên trình duyệt này.</p>':'<p><a class="btn" href="../diem-nhan-xet/index.html#m'+m.id+'">Xem điểm và nhận xét</a></p>')+
  '<h3>Lịch sử nộp bài</h3><ol class="history"></ol>';
  const history=$("#detail ol");
  for(const [i,e] of entries(m).entries()){
    const li=document.createElement("li"),a=document.createElement("a");
    a.href=e.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Phiên bản "+(i+1);
    li.append(a," · "+new Date(e.time).toLocaleString("vi-VN"));history.prepend(li);
  }
  if(!history.children.length) history.outerHTML='<p class="dim">'+(m.score!==null?'Phiên bản 1 · '+date(m.due-day)+' · Bài mẫu':'Chưa có bài nộp.')+'</p>';
  modal.showModal();
}
document.addEventListener("click",event=>{
  const btn=event.target.closest("[data-open]");
  if(btn) openDetail(Number(btn.dataset.open));
});
$(".close").onclick=()=>modal.close();
$("#filter").onchange=render;
$("#form").onsubmit=event=>{
  event.preventDefault();
  const input=$("#url");
  if(!input)return;
  let link;
  try{link=new URL(input.value);}catch{}
  if(!link||!["https:","http:"].includes(link.protocol)){input.setCustomValidity("Hãy nhập liên kết bắt đầu bằng https:// hoặc http://.");input.reportValidity();input.oninput=()=>input.setCustomValidity("");return;}
  saved.entries.push({id:editing.id,url:link.href,time:Date.now()});
  try{localStorage.setItem(key,JSON.stringify(saved));}catch{saved.entries.pop();input.setCustomValidity("Trình duyệt chưa cho phép lưu bài.");input.reportValidity();input.oninput=()=>input.setCustomValidity("");return;}
  modal.close();render();$("#toast").textContent="Đã lưu phiên bản bài nộp.";setTimeout(()=>$("#toast").textContent="",3200);
};
render();

window.addEventListener("pageshow", refreshSaved);
window.addEventListener("storage", event => { if (event.key === key) refreshSaved(); });
function refreshSaved() {
  try {
    const latest = JSON.parse(localStorage.getItem(key));
    if (latest && Array.isArray(latest.entries)) saved.entries = latest.entries;
  } catch {}
  render();
}

function updateClock() {
  const target = $("#clock");
  if (!target) return;
  const remaining = Math.max(0, milestones[milestones.length-1].due-Date.now());
  const parts = [Math.floor(remaining/day), Math.floor(remaining/3600000)%24, Math.floor(remaining/60000)%60];
  target.innerHTML = remaining ? parts.map((v,i) => `<div><b>${String(v).padStart(2,"0")}</b><small>${["ngày","giờ","phút"][i]}</small></div>`).join("") : "Đã đến hạn báo cáo";
}
setInterval(updateClock, 15000);
