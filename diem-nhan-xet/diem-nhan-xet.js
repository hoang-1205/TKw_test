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
const normalize = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replaceAll("đ","d");
$("#search").addEventListener("input", () => render());
function render(){
  const done=milestones.filter(submitted).length;
  const next=milestones.find(m=>!submitted(m));
  const pct=Math.round(done/milestones.length*100);
  $("#metrics").innerHTML=metric("★","Điểm trung bình",avg+" / 10")+metric("✓","Đã chấm",graded.length+" / 5")+metric("◷","Đang chờ chấm",done-graded.length);
  const bars = graded.map(m => `<div class="chart-row"><span>Mốc 0${m.id}</span><div><i style="width:${m.score*10}%"></i></div><b>${fmt(m.score)}</b></div>`).join("");
  $("#side").innerHTML = `<section class="panel summary"><div class="kicker">TỔNG QUAN</div><h3>Điểm theo cột mốc</h3><div class="chart">${bars}</div><p class="dim">Thang điểm 10 · ${graded.length} mốc đã chấm</p></section>
    <section class="panel"><h3>Tiến độ chấm điểm</h3><div class="row dim"><span>Đã có kết quả</span><b>${graded.length}/${milestones.length}</b></div><div class="meter"><i style="width:${100*graded.length/milestones.length}%"></i></div></section>`;
  const query = normalize($("#search").value.trim());
  const shown=milestones.filter(m=>normalize(m.name).includes(query) && ($("#filter").selectedIndex===0||$("#filter").value===(gradeState(m))));
  $("#list").innerHTML=shown.map(m=>{
    const top='<div class="row"><span class="kicker">MỐC 0'+m.id+'</span>'+badge(gradeState(m))+'</div><h3>'+m.name+'</h3>';
    return '<article id="m'+m.id+'" class="card grade">'+top+(m.score!==null?'<b class="score">'+fmt(m.score)+' / 10</b><div class="comment-label">Nhận xét của giảng viên</div><blockquote>'+m.comment+'</blockquote><small class="dim">Dữ liệu minh họa</small>':'<p class="dim">'+(submitted(m)?"Bài đã được ghi nhận, đang chờ giảng viên đánh giá.":"Điểm và nhận xét sẽ hiển thị sau khi bài được chấm.")+'</p>')+'</article>';
  }).join("") || '<div class="panel">Không tìm thấy cột mốc phù hợp. Hãy đổi từ khóa hoặc bộ lọc.</div>';
}

$("#filter").onchange=render;
render();
if(/^#m[1-5]$/.test(location.hash)){const target=$(location.hash);target.classList.add("selected");target.scrollIntoView({block:"center"});}

window.addEventListener("pageshow", refreshSaved);
window.addEventListener("storage", event => { if (event.key === key) refreshSaved(); });
function refreshSaved() {
  try {
    const latest = JSON.parse(localStorage.getItem(key));
    if (latest && Array.isArray(latest.entries)) saved.entries = latest.entries;
  } catch {}
  render();
}
