/**
 * ==========================================================================
 * JAVASCRIPT CHO TRANG 3: NỘP ĐỒ ÁN & XEM CHI TIẾT ĐỒ ÁN (DÀNH CHO SINH VIÊN)
 * Hệ thống: Quản lý Đồ án & Tiến độ Báo cáo
 * Thuần Vanilla JavaScript, không phụ thuộc thư viện bên ngoài
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. CẤU HÌNH & KHỞI TẠO DỮ LIỆU
    // --------------------------------------------------------------------------
    const STORAGE_KEY = 'sp_project_submissions';
    
    // Thiết lập hạn nộp (Deadline): 5 ngày tới tính từ ngày hiện tại để đồng hồ luôn chạy sống động
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 5);
    deadlineDate.setHours(23, 59, 59, 999);

    // Dữ liệu mẫu ban đầu khi localStorage chưa có dữ liệu (Yêu cầu 2 dữ liệu mẫu)
    const initialSampleSubmissions = [
        {
            id: 'sample-2',
            version: 'v1.0 - Báo cáo tiến độ tuần 3',
            url: 'https://drive.google.com/drive/folders/sample-demo-tuan-3',
            note: 'Đã hoàn thành module Đăng nhập, Phân quyền và Thiết kế CSDL quan hệ trên PostgreSQL. Link bao gồm slide thuyết trình.',
            submitTime: '15:20:45 15/11/2026',
            timestamp: new Date(Date.now() - 7 * 86400000).getTime(),
            status: 'Đã nộp'
        },
        {
            id: 'sample-1',
            version: 'v0.9 - Đề cương & Thiết kế CSDL',
            url: 'https://github.com/hieu-project/student-management-report',
            note: 'Nộp bản phác thảo kiến trúc hệ thống, sơ đồ Use-Case và đặc tả 12 bảng cơ sở dữ liệu ban đầu.',
            submitTime: '09:15:30 08/11/2026',
            timestamp: new Date(Date.now() - 14 * 86400000).getTime(),
            status: 'Đã nộp'
        }
    ];

    // Trạng thái hiện tại
    let submissions = loadSubmissions();
    let currentSelectedId = submissions.length > 0 ? submissions[0].id : null;
    let isEditingMode = false;

    // --------------------------------------------------------------------------
    // 2. DOM ELEMENTS
    // --------------------------------------------------------------------------
    // Countdown
    const elDeadlineText = document.getElementById('spDeadlineText');
    const elTimerDays = document.getElementById('spTimerDays');
    const elTimerHours = document.getElementById('spTimerHours');
    const elTimerMinutes = document.getElementById('spTimerMinutes');
    const elTimerSeconds = document.getElementById('spTimerSeconds');
    const elCountdownStatus = document.getElementById('spCountdownStatus');

    // Form
    const elProjectForm = document.getElementById('spProjectForm');
    const elVersionInput = document.getElementById('spVersionInput');
    const elUrlInput = document.getElementById('spUrlInput');
    const elNoteInput = document.getElementById('spNoteInput');
    const elVersionError = document.getElementById('spVersionError');
    const elUrlError = document.getElementById('spUrlError');
    const elBtnSubmit = document.getElementById('spBtnSubmit');
    const elSubmitBtnText = document.getElementById('spSubmitBtnText');
    const elBtnResetForm = document.getElementById('spBtnResetForm');

    // Detail section (Phần 2)
    const elDetailSection = document.getElementById('spDetailSection');
    const elDetailVersionName = document.getElementById('spDetailVersionName');
    const elDetailStatusBadge = document.getElementById('spDetailStatusBadge');
    const elDetailSubmitTime = document.getElementById('spDetailSubmitTime');
    const elDetailUrlContainer = document.getElementById('spDetailUrlContainer');
    const elDetailNote = document.getElementById('spDetailNote');
    const elBtnEditSubmission = document.getElementById('spBtnEditSubmission');

    // History section (Phần 3)
    const elHistoryTableBody = document.getElementById('spHistoryTableBody');
    const elHistoryCount = document.getElementById('spHistoryCount');
    const elEmptyState = document.getElementById('spEmptyState');
    const elHistoryTable = document.getElementById('spHistoryTable');

    // Toast
    const elToast = document.getElementById('spToast');
    const elToastTitle = document.getElementById('spToastTitle');
    const elToastMessage = document.getElementById('spToastMessage');
    let toastTimeout = null;

    // --------------------------------------------------------------------------
    // 3. ĐỒNG HỒ ĐẾM NGƯỢC (COUNTDOWN REAL-TIME)
    // --------------------------------------------------------------------------
    function formatTwoDigits(num) {
        return num < 10 ? '0' + num : num;
    }

    function initCountdown() {
        const d = deadlineDate;
        elDeadlineText.textContent = `${formatTwoDigits(d.getHours())}:${formatTwoDigits(d.getMinutes())}:${formatTwoDigits(d.getSeconds())} - ${formatTwoDigits(d.getDate())}/${formatTwoDigits(d.getMonth() + 1)}/${d.getFullYear()}`;

        function updateTimer() {
            const now = new Date().getTime();
            const distance = deadlineDate.getTime() - now;

            if (distance < 0) {
                elTimerDays.textContent = '00';
                elTimerHours.textContent = '00';
                elTimerMinutes.textContent = '00';
                elTimerSeconds.textContent = '00';
                elCountdownStatus.textContent = '✖ Đã kết thúc thời gian nộp bài cho đợt này!';
                elCountdownStatus.classList.add('is-expired');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            elTimerDays.textContent = formatTwoDigits(days);
            elTimerHours.textContent = formatTwoDigits(hours);
            elTimerMinutes.textContent = formatTwoDigits(minutes);
            elTimerSeconds.textContent = formatTwoDigits(seconds);
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // --------------------------------------------------------------------------
    // 4. TIỆN ÍCH LƯU TRỮ (LOCALSTORAGE)
    // --------------------------------------------------------------------------
    function loadSubmissions() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleSubmissions));
                return initialSampleSubmissions;
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : initialSampleSubmissions;
        } catch (error) {
            console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
            return initialSampleSubmissions;
        }
    }

    function saveSubmissions(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Lỗi khi lưu dữ liệu vào localStorage:', error);
        }
    }

    function getCurrentFormattedTime() {
        const now = new Date();
        const timeStr = `${formatTwoDigits(now.getHours())}:${formatTwoDigits(now.getMinutes())}:${formatTwoDigits(now.getSeconds())}`;
        const dateStr = `${formatTwoDigits(now.getDate())}/${formatTwoDigits(now.getMonth() + 1)}/${now.getFullYear()}`;
        return `${timeStr} ${dateStr}`;
    }

    // --------------------------------------------------------------------------
    // 5. VALIDATION FORM & KIỂM TRA ĐỊNH DẠNG URL
    // --------------------------------------------------------------------------
    function isValidUrl(urlString) {
        if (!urlString) return false;
        const trimmed = urlString.trim();
        
        // Bắt buộc bắt đầu bằng http:// hoặc https://
        const urlPattern = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(\?.*)?(#.*)?$/i;
        
        if (urlPattern.test(trimmed)) {
            return true;
        }
        
        try {
            const parsed = new URL(trimmed);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    elVersionInput.addEventListener('input', () => {
        if (elVersionInput.value.trim() !== '') {
            elVersionInput.classList.remove('is-invalid');
            elVersionError.classList.remove('show');
        }
    });

    elUrlInput.addEventListener('input', () => {
        if (isValidUrl(elUrlInput.value)) {
            elUrlInput.classList.remove('is-invalid');
            elUrlError.classList.remove('show');
        }
    });

    // --------------------------------------------------------------------------
    // 6. THÔNG BÁO TOAST
    // --------------------------------------------------------------------------
    function showToast(title, message, isError = false) {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        elToastTitle.textContent = title;
        elToastMessage.textContent = message;

        if (isError) {
            elToast.style.borderLeftColor = 'var(--sp-danger-color)';
            elToast.querySelector('.sp-toast-icon').style.backgroundColor = 'var(--sp-danger-color)';
            elToast.querySelector('.sp-toast-icon').textContent = '✕';
        } else {
            elToast.style.borderLeftColor = 'var(--sp-success-color)';
            elToast.querySelector('.sp-toast-icon').style.backgroundColor = 'var(--sp-success-color)';
            elToast.querySelector('.sp-toast-icon').textContent = '✓';
        }

        elToast.classList.add('show');
        toastTimeout = setTimeout(() => {
            elToast.classList.remove('show');
        }, 3500);
    }

    // --------------------------------------------------------------------------
    // 7. XỬ LÝ SUBMIT FORM (PHẦN 1)
    // --------------------------------------------------------------------------
    elProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const version = elVersionInput.value.trim();
        const url = elUrlInput.value.trim();
        const note = elNoteInput.value.trim();

        let hasError = false;

        // Validate Version
        if (!version) {
            elVersionInput.classList.add('is-invalid');
            elVersionError.classList.add('show');
            hasError = true;
        } else {
            elVersionInput.classList.remove('is-invalid');
            elVersionError.classList.remove('show');
        }

        // Validate URL (Bắt buộc http:// hoặc https://)
        if (!isValidUrl(url)) {
            elUrlInput.classList.add('is-invalid');
            elUrlError.classList.add('show');
            hasError = true;
        } else {
            elUrlInput.classList.remove('is-invalid');
            elUrlError.classList.remove('show');
        }

        if (hasError) {
            showToast('Lỗi nhập liệu', 'Vui lòng kiểm tra lại thông tin và định dạng URL!', true);
            return;
        }

        const isLate = new Date().getTime() > deadlineDate.getTime();
        const submissionStatus = isLate ? 'Trễ hạn' : 'Đã nộp';

        const newSubmission = {
            id: 'sub-' + Date.now(),
            version: version,
            url: url,
            note: note || '(Không có ghi chú)',
            submitTime: getCurrentFormattedTime(),
            timestamp: Date.now(),
            status: submissionStatus
        };

        submissions.unshift(newSubmission);
        saveSubmissions(submissions);

        currentSelectedId = newSubmission.id;

        renderDetailSection(newSubmission);
        renderHistoryTable();

        resetFormState();

        showToast(
            'Nộp đồ án thành công!', 
            `Đã lưu phiên bản "${version}" vào lịch sử hệ thống.`
        );

        elDetailSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    elBtnResetForm.addEventListener('click', () => {
        resetFormState();
    });

    function resetFormState() {
        elProjectForm.reset();
        elVersionInput.classList.remove('is-invalid');
        elVersionError.classList.remove('show');
        elUrlInput.classList.remove('is-invalid');
        elUrlError.classList.remove('show');

        isEditingMode = false;
        elSubmitBtnText.textContent = 'Nộp đồ án';
        elBtnResetForm.style.display = 'none';
    }

    // --------------------------------------------------------------------------
    // 8. HIỂN THỊ PHẦN 2: XEM CHI TIẾT & KIỂM TRA SAI SÓT
    // --------------------------------------------------------------------------
    function renderDetailSection(item) {
        if (!item) {
            elDetailVersionName.textContent = 'Chưa có bài nộp nào';
            elDetailStatusBadge.className = 'sp-badge sp-badge-warning';
            elDetailStatusBadge.textContent = 'Chưa nộp';
            elDetailSubmitTime.textContent = '--:--:-- --/--/----';
            elDetailUrlContainer.innerHTML = '<span class="sp-text-muted">Chưa có liên kết</span>';
            elDetailNote.textContent = 'Chưa có dữ liệu ghi chú.';
            elBtnEditSubmission.disabled = true;
            return;
        }

        elBtnEditSubmission.disabled = false;
        elDetailVersionName.textContent = item.version;
        elDetailSubmitTime.textContent = item.submitTime;

        if (item.status === 'Đã nộp') {
            elDetailStatusBadge.className = 'sp-badge sp-badge-success';
            elDetailStatusBadge.textContent = 'Đã nộp';
        } else if (item.status === 'Trễ hạn') {
            elDetailStatusBadge.className = 'sp-badge sp-badge-danger';
            elDetailStatusBadge.textContent = 'Trễ hạn';
        } else {
            elDetailStatusBadge.className = 'sp-badge sp-badge-warning';
            elDetailStatusBadge.textContent = 'Chưa nộp';
        }

        elDetailUrlContainer.innerHTML = `
            <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="sp-detail-link" title="Mở liên kết trong tab mới">
                <span>${escapeHtml(item.url)}</span>
                <span style="font-size: 11px;">↗</span>
            </a>
        `;

        elDetailNote.textContent = item.note || '(Không có ghi chú)';
    }

    // Nút "Chỉnh sửa / Nộp lại" ở Phần 2 -> Đổ dữ liệu lên Form Phần 1
    elBtnEditSubmission.addEventListener('click', () => {
        const item = submissions.find(s => s.id === currentSelectedId);
        if (!item) {
            showToast('Thông báo', 'Không tìm thấy dữ liệu bản nộp để chỉnh sửa.', true);
            return;
        }

        elVersionInput.value = item.version;
        elUrlInput.value = item.url;
        elNoteInput.value = item.note === '(Không có ghi chú)' ? '' : item.note;

        isEditingMode = true;
        elSubmitBtnText.textContent = 'Cập nhật / Nộp lại đồ án';
        elBtnResetForm.style.display = 'inline-flex';

        const submitSection = document.getElementById('spSubmitSection');
        submitSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
            elVersionInput.focus();
        }, 400);

        showToast('Đã tải dữ liệu lên Form', 'Bạn có thể chỉnh sửa liên kết hoặc phiên bản rồi bấm Nộp lại.');
    });

    // --------------------------------------------------------------------------
    // 9. HIỂN THỊ PHẦN 3: LỊCH SỬ NỘP BÀI (TABLE) & XỬ LÝ NÚT XÓA
    // --------------------------------------------------------------------------
    function renderHistoryTable() {
        elHistoryCount.textContent = submissions.length;

        if (submissions.length === 0) {
            elHistoryTable.style.display = 'none';
            elEmptyState.style.display = 'block';
            renderDetailSection(null);
            return;
        }

        elHistoryTable.style.display = 'table';
        elEmptyState.style.display = 'none';
        elHistoryTableBody.innerHTML = '';

        submissions.forEach((sub, index) => {
            const tr = document.createElement('tr');
            if (sub.id === currentSelectedId) {
                tr.classList.add('is-selected');
            }

            let badgeClass = 'sp-badge-success';
            if (sub.status === 'Trễ hạn') badgeClass = 'sp-badge-danger';
            if (sub.status === 'Chưa nộp') badgeClass = 'sp-badge-warning';

            tr.innerHTML = `
                <td style="text-align: center; font-weight: 600; color: var(--sp-text-muted);">${index + 1}</td>
                <td>
                    <strong style="color: var(--sp-primary); font-size: 13.5px;">${escapeHtml(sub.version)}</strong>
                </td>
                <td style="color: var(--sp-text-muted); white-space: nowrap;">${escapeHtml(sub.submitTime)}</td>
                <td style="text-align: center;">
                    <span class="sp-badge ${badgeClass}">${escapeHtml(sub.status)}</span>
                </td>
                <td>
                    <a href="${escapeHtml(sub.url)}" target="_blank" rel="noopener noreferrer" class="sp-history-url" title="${escapeHtml(sub.url)}">
                        ${escapeHtml(sub.url)}
                    </a>
                </td>
                <td style="text-align: center;">
                    <div class="sp-action-btns">
                        <button type="button" class="sp-btn sp-btn-outline sp-btn-sm sp-btn-view" data-id="${sub.id}" title="Xem chi tiết bản này">
                            👁 Xem chi tiết
                        </button>
                        <button type="button" class="sp-btn sp-btn-danger-outline sp-btn-sm sp-btn-delete" data-id="${sub.id}" title="Xóa bản nộp này">
                            🗑 Xóa
                        </button>
                    </div>
                </td>
            `;

            elHistoryTableBody.appendChild(tr);
        });

        // Gắn sự kiện click nút "Xem chi tiết"
        const viewButtons = elHistoryTableBody.querySelectorAll('.sp-btn-view');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const selected = submissions.find(s => s.id === id);
                if (selected) {
                    currentSelectedId = selected.id;
                    renderDetailSection(selected);
                    
                    const rows = elHistoryTableBody.querySelectorAll('tr');
                    rows.forEach(r => r.classList.remove('is-selected'));
                    e.currentTarget.closest('tr').classList.add('is-selected');

                    elDetailSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    showToast('Đang xem chi tiết', `Phiên bản: ${selected.version}`);
                }
            });
        });

        // Gắn sự kiện click nút "Xóa"
        const deleteButtons = elHistoryTableBody.querySelectorAll('.sp-btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                handleDeleteSubmission(id);
            });
        });
    }

    /**
     * Xử lý xóa bản nộp:
     * 1. Xác nhận qua confirm()
     * 2. Xóa khỏi mảng submissions và cập nhật localStorage
     * 3. Nếu đang hiển thị ở Phần 2, chuyển sang bản mới nhất còn lại hoặc trạng thái "Chưa nộp"
     * 4. Render lại bảng lịch sử và hiện toast thông báo
     */
    function handleDeleteSubmission(id) {
        const itemToDelete = submissions.find(s => s.id === id);
        if (!itemToDelete) return;

        const isConfirmed = confirm('Bạn có chắc chắn muốn xóa bản nộp này không?');
        if (!isConfirmed) return;

        // Xóa khỏi danh sách
        submissions = submissions.filter(s => s.id !== id);
        saveSubmissions(submissions);

        // Nếu bản đang xem ở Phần 2 chính là bản vừa bị xóa
        if (currentSelectedId === id) {
            if (submissions.length > 0) {
                currentSelectedId = submissions[0].id;
                renderDetailSection(submissions[0]);
            } else {
                currentSelectedId = null;
                renderDetailSection(null);
            }
        }

        // Render lại bảng
        renderHistoryTable();

        // Thông báo Toast thành công
        showToast('Đã xóa thành công!', `Bản nộp "${itemToDelete.version}" đã được xóa khỏi lịch sử.`);
    }

    // Tiện ích escape tránh XSS
    function escapeHtml(string) {
        if (!string) return '';
        return String(string)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // --------------------------------------------------------------------------
    // 10. KHỞI CHẠY LẦN ĐẦU
    // --------------------------------------------------------------------------
    initCountdown();
    renderHistoryTable();

    if (submissions.length > 0) {
        renderDetailSection(submissions[0]);
    } else {
        renderDetailSection(null);
    }
});
