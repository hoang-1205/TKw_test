(function () {
  "use strict";

  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const formTitle = document.getElementById("formTitle");
  const formSubtitle = document.getElementById("formSubtitle");
  const status = document.getElementById("authStatus");
  const lightStatus = document.getElementById("lightStatus");
  const lampStage = document.querySelector(".lamp-stage");
  const lampCord = document.getElementById("lampCord");
  const lampControl = document.getElementById("lampPull");
  const lampStatus = document.getElementById("lampStatus");
  const lampHint = document.getElementById("lampHint");
  const lightOptions = document.querySelectorAll(".light-option");
  const lightNames = {
    blue: "xanh dương",
    amber: "hổ phách",
    violet: "tím"
  };
  let activePull = null;
  let maxPullDistance = 0;
  let suppressClickUntil = 0;
  let lampSwitchTimer = 0;

  function setLampState(isOn) {
    document.body.dataset.lamp = isOn ? "on" : "off";
    lampControl.setAttribute("aria-pressed", String(isOn));
    lampControl.setAttribute(
      "aria-label",
      `Đèn đang ${isOn ? "bật" : "tắt"}. Kéo dây hoặc nhấn Enter hay phím cách để ${isOn ? "tắt" : "bật"} đèn.`
    );
    lampHint.textContent = isOn ? "Kéo dây lần nữa để tắt đèn" : "Kéo dây để bắt đầu";
    lampStatus.textContent = isOn ? "Đèn đã bật." : "Đèn đã tắt.";
    lampStage.classList.remove("is-switching");
    window.requestAnimationFrame(() => lampStage.classList.add("is-switching"));
    window.clearTimeout(lampSwitchTimer);
    lampSwitchTimer = window.setTimeout(() => {
      lampStage.classList.remove("is-switching");
    }, 300);
  }

  function finishLampPull(cancelled) {
    if (!activePull) return;
    const shouldToggle = !cancelled && maxPullDistance >= 32;
    activePull = null;
    lampCord.classList.remove("is-pulling");
    lampCord.style.setProperty("--pull-distance", "0px");

    if (shouldToggle) {
      suppressClickUntil = Date.now() + 500;
      setLampState(document.body.dataset.lamp !== "on");
    }
  }

  lampControl.addEventListener("pointerdown", event => {
    if (event.button !== 0 || activePull) return;
    event.preventDefault();
    activePull = { pointerId: event.pointerId, startY: event.clientY };
    maxPullDistance = 0;
    lampCord.classList.add("is-pulling");
    lampControl.setPointerCapture(event.pointerId);
  });

  lampControl.addEventListener("pointermove", event => {
    if (!activePull || activePull.pointerId !== event.pointerId) return;
    const distance = Math.max(0, Math.min(110, event.clientY - activePull.startY));
    maxPullDistance = Math.max(maxPullDistance, distance);
    lampCord.style.setProperty("--pull-distance", `${distance}px`);
  });

  lampControl.addEventListener("pointerup", event => {
    if (activePull && activePull.pointerId === event.pointerId) finishLampPull(false);
  });
  lampControl.addEventListener("pointercancel", event => {
    if (activePull && activePull.pointerId === event.pointerId) finishLampPull(true);
  });
  lampControl.addEventListener("click", event => {
    if (event.detail > 0 && Date.now() < suppressClickUntil) {
      event.preventDefault();
      return;
    }
    setLampState(document.body.dataset.lamp !== "on");
  });

  function switchMode(mode) {
    const loginMode = mode === "login";
    loginTab.classList.toggle("active", loginMode);
    registerTab.classList.toggle("active", !loginMode);
    loginTab.setAttribute("aria-selected", String(loginMode));
    registerTab.setAttribute("aria-selected", String(!loginMode));
    loginTab.tabIndex = loginMode ? 0 : -1;
    registerTab.tabIndex = loginMode ? -1 : 0;
    loginForm.hidden = !loginMode;
    registerForm.hidden = loginMode;
    formTitle.textContent = loginMode ? "Chào mừng trở lại" : "Tạo tài khoản sinh viên";
    formSubtitle.textContent = loginMode ? "Đăng nhập để tiếp tục theo dõi học phần." : "Điền thông tin để mô phỏng đăng ký.";
    status.textContent = "";
    status.className = "auth-status";
  }

  lightOptions.forEach(button => {
    button.addEventListener("click", () => {
      const light = button.dataset.light;
      document.body.dataset.light = light;
      lightOptions.forEach(option => {
        const selected = option === button;
        option.classList.toggle("active", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
      lightStatus.textContent = `Đã chọn ánh sáng ${lightNames[light]}.`;
    });
  });

  loginTab.addEventListener("click", () => switchMode("login"));
  registerTab.addEventListener("click", () => switchMode("register"));
  [loginTab, registerTab].forEach(tab => tab.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const target = tab === loginTab ? registerTab : loginTab;
      target.focus();
      target.click();
    }
  }));

  document.querySelectorAll(".password-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.setAttribute("aria-label", show ? "Ẩn mật khẩu" : "Hiện mật khẩu");
    });
  });

  function setFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    error.textContent = message;
    input.classList.toggle("invalid", Boolean(message));
    input.classList.toggle("valid", !message);
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");
    let emailError = "";
    let passwordError = "";
    if (!email.value.trim()) emailError = "Nhập email để tiếp tục.";
    else if (!isValidEmail(email.value.trim())) emailError = "Email không đúng định dạng.";
    if (!password.value) passwordError = "Nhập mật khẩu.";
    setFieldError("loginEmail", "loginEmailError", emailError);
    setFieldError("loginPassword", "loginPasswordError", passwordError);
    if (emailError) { email.focus(); return; }
    if (passwordError) { password.focus(); return; }
    status.className = "auth-status";
    status.textContent = "Thông tin hợp lệ. Chọn vai trò dùng thử để vào trang chủ.";
  });

  document.querySelectorAll(".role-button").forEach(button => {
    button.addEventListener("click", () => {
      const role = button.dataset.role;
      try { localStorage.setItem("projectMilestoneDemoRole", role); } catch (_) {}
      window.location.href = `index.html?role=${encodeURIComponent(role)}`;
    });
  });

  registerForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("registerName");
    const code = document.getElementById("registerCode");
    const email = document.getElementById("registerEmail");
    const password = document.getElementById("registerPassword");
    const confirm = document.getElementById("registerConfirm");
    const terms = document.getElementById("registerTerms");
    const nameError = name.value.trim() ? "" : "Nhập họ và tên.";
    const codeError = code.value.trim() ? "" : "Nhập mã số sinh viên.";
    let emailError = "";
    if (!email.value.trim()) emailError = "Nhập email.";
    else if (!isValidEmail(email.value.trim())) emailError = "Email không đúng định dạng.";
    const passwordError = !password.value ? "Nhập mật khẩu." : password.value.length < 8 ? "Mật khẩu tối thiểu 8 ký tự." : "";
    const confirmError = !confirm.value ? "Nhập lại mật khẩu." : confirm.value !== password.value ? "Mật khẩu xác nhận không khớp." : "";
    const termsError = terms.checked ? "" : "Chọn để đồng ý điều khoản.";
    setFieldError("registerName", "registerNameError", nameError);
    setFieldError("registerCode", "registerCodeError", codeError);
    setFieldError("registerEmail", "registerEmailError", emailError);
    setFieldError("registerPassword", "registerPasswordError", passwordError);
    setFieldError("registerConfirm", "registerConfirmError", confirmError);
    document.getElementById("registerTermsError").textContent = termsError;
    terms.setAttribute("aria-invalid", String(Boolean(termsError)));
    const firstInvalid = [
      [name, nameError], [code, codeError], [email, emailError],
      [password, passwordError], [confirm, confirmError]
    ].find(entry => entry[1]);
    if (firstInvalid) { firstInvalid[0].focus(); status.textContent = ""; return; }
    if (termsError) { terms.focus(); status.textContent = ""; return; }
    status.className = "auth-status";
    status.textContent = "Đăng ký mô phỏng thành công. Tài khoản chưa được lưu trên máy chủ.";
  });

  document.querySelectorAll("[data-unavailable]").forEach(button => {
    button.addEventListener("click", () => {
      status.className = "auth-status";
      status.textContent = `${button.dataset.unavailable}: Chưa triển khai.`;
    });
  });

  switchMode("login");
})();
