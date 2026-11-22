(function () {
  "use strict";

  const data = window.ProjectMilestoneData;
  if (!data) throw new Error("Không tìm thấy dữ liệu demo Project Milestone.");

  const statusMeta = {
    submitted: { label: "Đã nộp", color: "#16A34A" },
    "not-submitted": { label: "Chưa nộp", color: "#F59E0B" },
    overdue: { label: "Trễ hạn", color: "#DC2626" }
  };
  const numberFormat = new Intl.NumberFormat("vi-VN");
  const percentFormat = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function validateDemoData() {
    const studentIds = new Set(data.students.map(student => student.id));
    if (studentIds.size !== data.students.length) {
      throw new Error("Danh sách sinh viên demo có mã bị trùng.");
    }
    const linkedStudents = new Set();
    const projectIds = new Set();

    data.projects.forEach(project => {
      if (!studentIds.has(project.studentId)) {
        throw new Error(`Đồ án ${project.id} đang liên kết tới sinh viên không tồn tại.`);
      }
      if (linkedStudents.has(project.studentId)) {
        throw new Error(`Sinh viên ${project.studentId} đang được liên kết với nhiều hơn một đồ án.`);
      }
      if (projectIds.has(project.id)) {
        throw new Error(`Mã đồ án ${project.id} bị trùng.`);
      }
      linkedStudents.add(project.studentId);
      projectIds.add(project.id);
    });
    if (linkedStudents.size !== studentIds.size) {
      throw new Error("Mỗi sinh viên demo cần có đúng một đồ án.");
    }
  }

  function getRole() {
    const requestedRole = new URLSearchParams(window.location.search).get("role");
    if (requestedRole === "student" || requestedRole === "lecturer") {
      try { localStorage.setItem("projectMilestoneDemoRole", requestedRole); } catch (_) {}
      return requestedRole;
    }
    try {
      const savedRole = localStorage.getItem("projectMilestoneDemoRole");
      if (savedRole === "lecturer" || savedRole === "student") return savedRole;
    } catch (_) {}
    return "student";
  }

  function renderRole(role) {
    const roleInfo = data.roles[role];
    document.getElementById("accountRole").textContent = roleInfo.label;
    document.getElementById("avatarInitial").textContent = roleInfo.initials;

    const icons = {
      home: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      timeline: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
      project: '<path d="M4 5h16v15H4z"/><path d="M8 9h8M8 13h8M8 17h4"/>',
      grade: '<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/>',
      people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-4 2-6 6-6s6 2 6 6M14 15c3 0 5 1.5 5 5"/>',
      review: '<path d="m5 3 14 9-14 9z"/>',
    };
    const roleItems = role === "lecturer"
      ? [
          { label: "Timeline dự án", icon: "timeline" },
          { label: "Danh sách sinh viên và đồ án", icon: "people" },
          { label: "Chấm điểm và nhận xét", icon: "review" },
          { label: "Hồ sơ sinh viên", icon: "project" }
        ]
      : [
          { label: "Timeline dự án", icon: "timeline" },
          { label: "Đồ án của tôi", icon: "project" },
          { label: "Điểm và nhận xét", icon: "grade" }
        ];

    const home = `<a class="nav-item active" href="index.html?role=${role}" aria-current="page"><svg viewBox="0 0 24 24" aria-hidden="true">${icons.home}</svg><span>Trang chủ</span></a>`;
    const items = roleItems.map(item =>
      `<button class="nav-item" type="button" data-unavailable="${escapeHtml(item.label)}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[item.icon]}</svg><span>${escapeHtml(item.label)}</span></button>`
    ).join("");
    document.getElementById("sidebarNav").innerHTML = home + items;
  }

  function formatDate(value, options) {
    return new Intl.DateTimeFormat("vi-VN", options || {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(new Date(value));
  }

  function renderDate() {
    const today = new Date();
    document.getElementById("currentDate").textContent = new Intl.DateTimeFormat("vi-VN", {
      weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    }).format(today);
  }

  function getCounts() {
    return data.projects.reduce((counts, project) => {
      if (!statusMeta[project.status]) {
        throw new Error(`Trạng thái đồ án không hợp lệ: ${project.status}.`);
      }
      counts[project.status] += 1;
      return counts;
    }, { submitted: 0, "not-submitted": 0, overdue: 0 });
  }

  function renderKpis(counts) {
    const entries = [
      { value: data.students.length, label: "Sinh viên tham gia", icon: "people" },
      { value: data.projects.length, label: "Tổng số đồ án", icon: "project" },
      { value: counts.submitted, label: "Đã nộp", icon: "submitted" },
      { value: counts["not-submitted"], label: "Chưa nộp", icon: "pending" },
      { value: counts.overdue, label: "Trễ hạn", icon: "overdue" }
    ];
    const paths = {
      people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-4 2-6 6-6s6 2 6 6M14 15c3 0 5 1.5 5 5"/>',
      project: '<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/>',
      submitted: '<path d="M20 6 9 17l-5-5"/>',
      pending: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      overdue: '<path d="M12 8v4M12 16h.01M10.3 3.7 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z"/>'
    };
    document.getElementById("kpiGrid").innerHTML = entries.map(entry =>
      `<article class="kpi-card"><span class="kpi-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${paths[entry.icon]}</svg></span><div class="kpi-value"><strong>${numberFormat.format(entry.value)}</strong><span>${entry.label}</span></div></article>`
    ).join("");
  }

  function polar(cx, cy, radius, angle) {
    const radians = (angle - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
  }

  function donutPath(startAngle, endAngle, inner = 62, outer = 82) {
    const startOuter = polar(110, 110, outer, endAngle);
    const endOuter = polar(110, 110, outer, startAngle);
    const startInner = polar(110, 110, inner, startAngle);
    const endInner = polar(110, 110, inner, endAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${startOuter.x} ${startOuter.y} A ${outer} ${outer} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y} L ${startInner.x} ${startInner.y} A ${inner} ${inner} 0 ${largeArc} 1 ${endInner.x} ${endInner.y} Z`;
  }

  function renderDonut(counts) {
    const total = data.projects.length;
    const entries = ["submitted", "not-submitted", "overdue"].map(key => ({
      label: statusMeta[key].label, value: counts[key], color: statusMeta[key].color
    }));
    const chart = document.getElementById("donutChart");
    chart.replaceChildren();

    if (!total) {
      chart.innerHTML = '<circle cx="110" cy="110" r="72" fill="#F5F7FF"/><text x="110" y="115" text-anchor="middle" fill="#64748B" font-size="13">Chưa có dữ liệu</text>';
    } else {
      let angle = 0;
      entries.forEach(entry => {
        const slice = entry.value / total * 360;
        if (slice > 0) {
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", donutPath(angle, angle + slice));
          path.setAttribute("fill", entry.color);
          path.setAttribute("stroke", "#fff");
          path.setAttribute("stroke-width", "3");
          chart.appendChild(path);
        }
        angle += slice;
      });
      const center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      center.setAttribute("cx", "110");
      center.setAttribute("cy", "110");
      center.setAttribute("r", "57");
      center.setAttribute("fill", "#fff");
      chart.appendChild(center);
      chart.insertAdjacentHTML("beforeend", `<text x="110" y="104" text-anchor="middle" fill="#64748B" font-size="12">Tổng đồ án</text><text x="110" y="132" text-anchor="middle" fill="#111827" font-size="28" font-weight="800">${numberFormat.format(total)}</text>`);
    }

    document.getElementById("donutLegend").innerHTML = entries.map(entry => {
      const percent = total ? percentFormat.format(entry.value / total * 100) : "0";
      return `<div class="legend-item"><span class="legend-dot" style="background:${entry.color}"></span><span>${entry.label}</span><strong>${numberFormat.format(entry.value)} · ${percent}%</strong></div>`;
    }).join("");
  }

  function renderBarChart() {
    const svg = document.getElementById("barChart");
    const milestones = data.milestones;
    if (!milestones.length) {
      svg.innerHTML = '<text x="300" y="130" text-anchor="middle" fill="#64748B" font-size="14">Chưa có dữ liệu báo cáo</text>';
      return;
    }

    const values = milestones.map(milestone =>
      data.projects.filter(project => project.submissions.some(submission => submission.milestoneId === milestone.id)).length
    );
    const max = Math.max(...values, 1);
    const width = 600, height = 260;
    const left = 44, right = 18, top = 22, bottom = 48;
    const chartWidth = width - left - right, chartHeight = height - top - bottom;
    const slot = chartWidth / milestones.length;
    let html = "";

    for (let i = 0; i <= 4; i++) {
      const value = Math.ceil(max / 4 * i);
      const y = top + chartHeight - (chartHeight / 4 * i);
      html += `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#EEF1F7" stroke-width="1"/>`;
      html += `<text x="${left - 9}" y="${y + 4}" text-anchor="end" fill="#94A3B8" font-size="10">${value}</text>`;
    }

    milestones.forEach((milestone, index) => {
      const barWidth = Math.min(46, slot * 0.54);
      const barHeight = values[index] / max * chartHeight;
      const x = left + slot * index + (slot - barWidth) / 2;
      const y = top + chartHeight - barHeight;
      const label = escapeHtml(milestone.title.replace("Báo cáo ", ""));
      html += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="7" fill="${milestone.state === "upcoming" ? "#8F93D9" : "#00008B"}"/>`;
      html += `<text x="${x + barWidth / 2}" y="${Math.max(y - 7, 14)}" text-anchor="middle" fill="#111827" font-size="11" font-weight="700">${values[index]}</text>`;
      html += `<text x="${x + barWidth / 2}" y="${height - 13}" text-anchor="middle" fill="#64748B" font-size="9">${label}</text>`;
    });
    svg.innerHTML = html;
  }

  function renderDeadline() {
    const upcoming = data.milestones
      .filter(milestone => new Date(milestone.date).getTime() > Date.now())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const title = document.getElementById("deadlineMilestone");
    const date = document.getElementById("deadlineDate");
    const countdown = document.getElementById("countdown");
    if (!upcoming) {
      title.textContent = "Chưa có deadline sắp tới";
      date.textContent = "Chưa cập nhật";
      countdown.innerHTML = '<strong class="countdown-message">Không có deadline sắp tới</strong>';
      return;
    }

    title.textContent = upcoming.title;
    date.textContent = formatDate(upcoming.date);
    const deadlineTime = new Date(upcoming.date).getTime();
    function update() {
      const remaining = deadlineTime - Date.now();
      if (remaining <= 0) {
        countdown.innerHTML = '<strong class="countdown-message">Đã quá hạn</strong>';
        return true;
      }
      const totalSeconds = Math.floor(remaining / 1000);
      document.getElementById("countDays").textContent = Math.floor(totalSeconds / 86400);
      document.getElementById("countHours").textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
      document.getElementById("countMinutes").textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      document.getElementById("countSeconds").textContent = String(totalSeconds % 60).padStart(2, "0");
      return false;
    }

    if (!update()) {
      const interval = window.setInterval(() => {
        if (update()) window.clearInterval(interval);
      }, 1000);
      window.addEventListener("beforeunload", () => window.clearInterval(interval), { once: true });
    }
  }

  function renderTimeline() {
    const timeline = document.getElementById("miniTimeline");
    if (!data.milestones.length) {
      timeline.innerHTML = '<li class="timeline-empty">Chưa có mốc báo cáo được công bố.</li>';
      return;
    }
    timeline.innerHTML = data.milestones.map(milestone => {
      const label = milestone.state === "complete" ? "Đã diễn ra" : "Sắp tới";
      const className = milestone.state === "complete" ? "complete" : "upcoming";
      return `<li class="timeline-item ${className}">
        <div class="timeline-copy"><strong>${escapeHtml(milestone.title)}</strong><time datetime="${escapeHtml(milestone.date)}">${formatDate(milestone.date)}</time></div>
        <span class="status-badge ${className === "complete" ? "status-submitted" : "status-not-submitted"}">${label}</span>
      </li>`;
    }).join("");
  }

  function renderAnnouncements() {
    const announcementList = document.getElementById("announcementList");
    announcementList.innerHTML = data.announcements.length
      ? data.announcements.map(announcement =>
          `<li class="announcement-item"><span class="announcement-marker" aria-hidden="true"></span><div><strong>${escapeHtml(announcement.title)}</strong><p>${escapeHtml(announcement.body)}</p></div></li>`
        ).join("")
      : '<li class="announcement-empty">Hiện chưa có thông báo chung.</li>';

    const guidanceList = document.getElementById("guidanceList");
    guidanceList.innerHTML = data.guidance.length
      ? data.guidance.map(item => `<li>${escapeHtml(item)}</li>`).join("")
      : '<li>Hướng dẫn sẽ được cập nhật.</li>';
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function setupInteractions() {
    document.querySelectorAll("[data-unavailable]").forEach(button => {
      button.addEventListener("click", () => showToast(`${button.dataset.unavailable}: Chưa triển khai`));
    });
    document.getElementById("notificationButton").addEventListener("click", () => {
      showToast(data.announcements.length ? `Có ${numberFormat.format(data.announcements.length)} thông báo chung mới.` : "Hiện chưa có thông báo chung.");
    });
    document.getElementById("logoutBtn").addEventListener("click", () => {
      try { localStorage.removeItem("projectMilestoneDemoRole"); } catch (_) {}
      window.location.href = "auth.html";
    });

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const menuButton = document.getElementById("menuButton");
    const mainColumn = document.querySelector(".main-column");
    const skipLink = document.querySelector(".skip-link");
    const mobileMenu = window.matchMedia("(max-width: 900px)");
    function setMenuOpen(open, restoreFocus) {
      if (!mobileMenu.matches) open = false;
      sidebar.classList.toggle("open", open);
      sidebar.inert = mobileMenu.matches && !open;
      sidebar.setAttribute("aria-hidden", String(mobileMenu.matches && !open));
      mainColumn.inert = open;
      skipLink.inert = open;
      overlay.hidden = !open;
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
      if (open) {
        const firstItem = sidebar.querySelector("a, button");
        if (firstItem) firstItem.focus();
      } else if (restoreFocus && mobileMenu.matches) {
        menuButton.focus();
      }
    }
    menuButton.addEventListener("click", () => {
      setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true", false);
    });
    overlay.addEventListener("click", () => setMenuOpen(false, true));
    sidebar.addEventListener("click", event => {
      if (mobileMenu.matches && event.target.closest(".nav-item")) setMenuOpen(false, true);
    });
    document.addEventListener("keydown", event => {
      if (menuButton.getAttribute("aria-expanded") !== "true") return;
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false, true);
        return;
      }
      if (event.key === "Tab") {
        const items = sidebar.querySelectorAll("a[href], button:not([disabled])");
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    mobileMenu.addEventListener("change", () => setMenuOpen(false, mobileMenu.matches));
    setMenuOpen(false, false);
  }

  const role = getRole();
  validateDemoData();
  renderRole(role);
  renderDate();
  const counts = getCounts();
  renderKpis(counts);
  renderDonut(counts);
  renderBarChart();
  renderDeadline();
  renderTimeline();
  renderAnnouncements();
  setupInteractions();
})();
