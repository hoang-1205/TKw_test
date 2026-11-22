(function () {
  "use strict";

  const now = new Date();
  const addDays = (days, hour = 23, minute = 59) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  };
  const submissionAt = (days, hour = 15) => addDays(days, hour, 0);

  window.ProjectMilestoneData = {
    roles: {
      student: { label: "Sinh viên", initials: "SV" },
      lecturer: { label: "Giảng viên", initials: "GV" }
    },
    students: [
      { id: "SV001" },
      { id: "SV002" },
      { id: "SV003" },
      { id: "SV004" },
      { id: "SV005" },
      { id: "SV006" },
      { id: "SV007" },
      { id: "SV008" }
    ],
    projects: [
      {
        id: "DA001", studentId: "SV001", title: "Hệ thống quản lý thư viện", status: "submitted",
        submissions: [
          { version: 1, milestoneId: "proposal", submittedAt: submissionAt(-29) },
          { version: 2, milestoneId: "progress", submittedAt: submissionAt(-17) }
        ]
      },
      {
        id: "DA002", studentId: "SV002", title: "Ứng dụng chăm sóc sức khỏe", status: "submitted",
        submissions: [
          { version: 1, milestoneId: "proposal", submittedAt: submissionAt(-29) },
          { version: 2, milestoneId: "progress", submittedAt: submissionAt(-17) }
        ]
      },
      {
        id: "DA003", studentId: "SV003", title: "Nền tảng học trực tuyến", status: "submitted",
        submissions: [
          { version: 1, milestoneId: "proposal", submittedAt: submissionAt(-29) },
          { version: 2, milestoneId: "progress", submittedAt: submissionAt(-17) }
        ]
      },
      {
        id: "DA004", studentId: "SV004", title: "Phân tích dữ liệu bán hàng", status: "not-submitted",
        submissions: []
      },
      {
        id: "DA005", studentId: "SV005", title: "Website du lịch thông minh", status: "not-submitted",
        submissions: []
      },
      {
        id: "DA006", studentId: "SV006", title: "Cổng thông tin sự kiện", status: "overdue",
        submissions: [{ version: 1, milestoneId: "proposal", submittedAt: submissionAt(-22) }]
      },
      {
        id: "DA007", studentId: "SV007", title: "Hệ thống quản lý nhân sự", status: "overdue",
        submissions: []
      },
      {
        id: "DA008", studentId: "SV008", title: "Ứng dụng đặt lịch khám", status: "overdue",
        submissions: []
      }
    ],
    milestones: [
      { id: "proposal", title: "Đăng ký đề tài", date: addDays(-28, 12, 0), state: "complete" },
      { id: "progress", title: "Báo cáo tiến độ lần 1", date: addDays(-16, 23, 59), state: "complete" },
      { id: "midterm", title: "Báo cáo giữa kỳ", date: addDays(3, 23, 59), state: "upcoming" },
      { id: "final", title: "Nộp đồ án cuối kỳ", date: addDays(21, 17, 0), state: "upcoming" }
    ],
    announcements: [
      {
        title: "Lịch báo cáo giữa kỳ",
        body: "Các nhóm theo dõi mốc báo cáo giữa kỳ trên Timeline dự án trước hạn nộp."
      },
      {
        title: "Quy cách phiên bản",
        body: "Mỗi lần nộp cần ghi rõ phiên bản để giảng viên tiện theo dõi thay đổi."
      }
    ],
    guidance: [
      "Theo dõi các mốc và thời hạn chung trên Timeline dự án.",
      "Mỗi sinh viên đăng ký một đồ án; các lần nộp tiếp theo được ghi nhận thành phiên bản.",
      "Trao đổi với giảng viên phụ trách nếu cần cập nhật đề cương hoặc lịch báo cáo."
    ]
  };
})();
