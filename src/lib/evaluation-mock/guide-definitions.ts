export type GuidePlacement = "top" | "bottom" | "left" | "right";

export interface GuideStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  placement?: GuidePlacement;
  roleContext?: "student" | "panelist" | "shared";
}

export interface RouteGuideConfig {
  routePattern: string;
  pageTitle: string;
  subtitle: string;
  autoShowOnFirstVisit?: boolean;
  steps: GuideStep[];
}

export const COMMON_STUDENT_SHELL_STEPS: GuideStep[] = [
  {
    id: "student-sidebar-nav",
    targetSelector: '[data-guide="student-sidebar-nav"]',
    title: "Student Portal Navigation",
    description:
      "Use this sidebar to navigate across your Dashboard, Academic Profile, Curriculum Checklist, Academic Journey timeline, and the Graduate Thesis Repository.",
    placement: "right",
    roleContext: "student",
  },
  {
    id: "student-thesis-journey-menu",
    targetSelector: '[data-guide="student-thesis-journey-menu"]',
    title: "Unlocked 5-Step Thesis Journey",
    description:
      "In this Evaluation Edition, all 5 Thesis Journey milestones (Title Defense, Adviser Request, Proposal Defense, STRIKE Plagiarism, and Final Defense) are unlocked so you can freely evaluate every workflow screen.",
    placement: "right",
    roleContext: "student",
  },
  {
    id: "role-switcher",
    targetSelector: '[data-guide="role-switcher"]',
    title: "Instant Role Switcher (Student ↔ Faculty)",
    description:
      "Switch between the Graduate Student view (Juan M. Dela Cruz) and the Faculty / Panelist view (Dr. Maria Clara R. Santos) in a single click at any time.",
    placement: "bottom",
    roleContext: "shared",
  },
];

export const COMMON_PANELIST_SHELL_STEPS: GuideStep[] = [
  {
    id: "role-switcher",
    targetSelector: '[data-guide="role-switcher"]',
    title: "Active Respondent Persona & Role Switcher",
    description:
      "You are currently viewing the system as Dr. Maria Clara R. Santos (Graduate Faculty, Thesis Adviser, & Defense Committee Chairperson). Click here anytime to switch back to the Student Portal.",
    placement: "bottom",
    roleContext: "shared",
  },
];

export const ROUTE_GUIDE_DEFINITIONS: RouteGuideConfig[] = [
  // ============================================================================
  // A. STUDENT PORTAL ROUTES (/student/*)
  // ============================================================================
  {
    routePattern: "/student/dashboard",
    pageTitle: "Student Dashboard Guide",
    subtitle:
      "Overview of your active graduate program, thesis milestone status, and scheduled oral defense.",
    autoShowOnFirstVisit: true,
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Preview Dashboard Across Journey Stages",
        description:
          "Use this Scenario Switcher to toggle the Student Dashboard between (1) Scheduled Proposal Defense, (2) Active Title Defense, and (3) Completed Thesis Journey.",
        placement: "bottom",
      },
      {
        id: "dashboard-welcome",
        targetSelector: '[data-guide="dashboard-welcome"]',
        title: "Student Status & Degree Banner",
        description:
          "Displays the enrolled graduate student's profile summary, active degree program (MAEd in Administration & Supervision), Comprehensive Exam standing, and current thesis stage.",
        placement: "bottom",
      },
      {
        id: "dashboard-next-step",
        targetSelector: '[data-guide="dashboard-next-step"]',
        title: "Your Immediate Next Step",
        description:
          "Highlights the exact action or waiting status for your active Thesis Journey milestone with a direct action button.",
        placement: "top",
      },
      {
        id: "dashboard-milestones",
        targetSelector: '[data-guide="dashboard-milestones"]',
        title: "5-Step Thesis Journey Progress",
        description:
          "Tracks real-time progress across all 5 institutional Thesis Journey stages (Title Defense, Adviser Request, Proposal Defense, STRIKE Plagiarism, and Final Defense).",
        placement: "top",
      },
      {
        id: "dashboard-upcoming-defense",
        targetSelector: '[data-guide="dashboard-upcoming-defense"]',
        title: "Scheduled Defense Quick View",
        description:
          "Shows upcoming or active oral defense details including date, wall-clock time, defense room or virtual link, and session status.",
        placement: "top",
      },
      ...COMMON_STUDENT_SHELL_STEPS,
    ],
  },
  {
    routePattern: "/student/profile",
    pageTitle: "Student Profile Guide",
    subtitle:
      "Personal demographics, contact information, and official EARIST Graduate School enrollment record.",
    steps: [
      {
        id: "profile-personal-info",
        targetSelector: '[data-guide="profile-personal-info"]',
        title: "Student Demographic & Contact Details",
        description:
          "Shows the student's verified personal information, institutional email address, and contact details on file with the Graduate School.",
        placement: "bottom",
      },
      {
        id: "profile-academic-info",
        targetSelector: '[data-guide="profile-academic-info"]',
        title: "Academic Program & Thesis Record",
        description:
          "Displays the student number, degree program, major/specialization, comprehensive examination status, and assigned Thesis Adviser.",
        placement: "top",
      },
      ...COMMON_STUDENT_SHELL_STEPS,
    ],
  },
  {
    routePattern: "/student/curriculum",
    pageTitle: "Curriculum & Coursework Checklist Guide",
    subtitle:
      "Track completed graduate units, GPA, and required courses across Core, Major, Cognate, and Thesis categories.",
    steps: [
      {
        id: "curriculum-summary",
        targetSelector: '[data-guide="curriculum-summary"]',
        title: "Earned Units vs. Required Units",
        description:
          "Summarizes total academic units earned, cumulative grade point average (GWA), and progress toward degree completion.",
        placement: "bottom",
      },
      {
        id: "curriculum-course-list",
        targetSelector: '[data-guide="curriculum-course-list"]',
        title: "Categorized Graduate Course Checklist",
        description:
          "Lists every required course grouped by Core Subjects, Major Specialization, Cognates/Electives, and Thesis Seminar I & II with final grades and enrollment status.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/journey",
    pageTitle: "Academic Journey Overview Guide",
    subtitle:
      "End-to-end visual milestone tracker from Admission and Coursework through Final Defense and Graduation Clearance.",
    steps: [
      {
        id: "journey-stepper",
        targetSelector: '[data-guide="journey-stepper"]',
        title: "End-to-End Academic Timeline",
        description:
          "Visualizes the entire graduate lifecycle—from Admission, Coursework, and Comprehensive Exam to the 5 Thesis Defense milestones and Research Databank archival.",
        placement: "bottom",
      },
      {
        id: "journey-action-cards",
        targetSelector: '[data-guide="journey-action-cards"]',
        title: "Direct Stage Navigation Cards",
        description:
          "Click any milestone card to jump directly into that stage's workspace, forms, and official PDF records.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/thesis/title-defense",
    pageTitle: "Step 1: Title Defense Guide",
    subtitle:
      "Evaluate all 5 workflow states of the Title Defense stage—from initial 3-title proposal submission to official RAP outcome.",
    autoShowOnFirstVisit: true,
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Scenario Switcher Bar (Preview All 5 States)",
        description:
          "Click any numbered stage pill here to immediately preview how this page looks when: (1) Ready to Submit, (2) Under Admin Review, (3) Defense Scheduled, (4) Completed with RAP Result, or (5) Returned for Correction.",
        placement: "bottom",
      },
      {
        id: "title-doc-slots",
        targetSelector: '[data-guide="title-doc-slots"], [data-guide="title-status-panel"]',
        title: "Title Proposal Package & Document Requirements",
        description:
          "Students submit three (3) proposed thesis titles along with their consolidated Title Proposal Package PDF, current Certificate of Registration (COR), and Defense-Fee Official Receipt.",
        placement: "top",
      },
      {
        id: "title-status-panel",
        targetSelector: '[data-guide="title-status-panel"], [data-guide="title-doc-slots"]',
        title: "Schedule, Committee & Official RAP Record",
        description:
          "Once scheduled or completed, students can view their Defense Committee roster, download the Official Defense Application PDF, and inspect the signed Report of Action Taken (RAP) with their approved title.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/thesis/adviser-request",
    pageTitle: "Step 2: Official GS-020 Adviser Request Guide",
    subtitle:
      "Select an eligible Graduate Faculty adviser and sign Official GS Form No. 020 digitally.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Preview Adviser Request Stages",
        description:
          "Toggle between (1) Selecting a Faculty Adviser & signing GS-020, (2) Awaiting Adviser CONFORME & Dean approval, and (3) Viewing the fully signed GS-020 PDF.",
        placement: "bottom",
      },
      {
        id: "adviser-selection",
        targetSelector: '[data-guide="adviser-selection"]',
        title: "Selecting a Qualified Graduate Faculty Adviser",
        description:
          "Students browse eligible faculty members from their Title Defense panel, review specializations and advisee load, and affix their digital signature to submit GS Form No. 020.",
        placement: "top",
      },
      {
        id: "gs020-preview",
        targetSelector: '[data-guide="gs020-preview"], [data-guide="adviser-selection"]',
        title: "Official GS-020 Form Routing & PDF Preview",
        description:
          "Tracks e-signature routing across the Student, Thesis Adviser (CONFORME), and Graduate School Dean, with inline preview of the official GS-020 PDF.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/thesis/proposal-defense",
    pageTitle: "Step 3: Proposal Defense Guide",
    subtitle:
      "Pre-defense Adviser manuscript review, Proposal Defense application, schedule, and RAP evaluation outcome.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Toggle Proposal Defense Workflow States",
        description:
          "Switch between (1) Pre-Defense Adviser Review, (2) Ready to Apply with issued certification, (3) Defense Scheduled, and (4) Completed with Proposal RAP Report.",
        placement: "bottom",
      },
      {
        id: "proposal-adviser-panel",
        targetSelector: '[data-guide="proposal-adviser-panel"]',
        title: "Pre-Defense Manuscript Review & Adviser Certification",
        description:
          "Before applying for Proposal Defense, the student uploads Chapters 1–3 for their Thesis Adviser to inspect and issue a signed Pre-Defense Certification PDF.",
        placement: "top",
      },
      {
        id: "proposal-defense-record",
        targetSelector: '[data-guide="proposal-defense-record"], [data-guide="proposal-adviser-panel"]',
        title: "Proposal Defense Schedule & RAP Result",
        description:
          "Displays the Proposal Defense schedule, committee assignments, Official Defense Application PDF, and finalized Committee RAP Report.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/thesis/strike",
    pageTitle: "Step 4: STRIKE / Plagiarism Clearance Guide",
    subtitle:
      "Institutional similarity check (<15% threshold) required prior to Final Oral Defense.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Toggle STRIKE Plagiarism Stages",
        description:
          "Switch between (1) Submitting the revised manuscript for scanning, (2) Verification in progress, and (3) STRIKE Cleared with certificate preview.",
        placement: "bottom",
      },
      {
        id: "strike-upload",
        targetSelector: '[data-guide="strike-upload"], [data-guide="strike-certificate"]',
        title: "Manuscript Submission for Similarity Scanning",
        description:
          "Students upload their complete revised manuscript so the Graduate School Research Unit can verify that the overall similarity index is below the 15% institutional limit.",
        placement: "top",
      },
      {
        id: "strike-certificate",
        targetSelector: '[data-guide="strike-certificate"], [data-guide="strike-upload"]',
        title: "Similarity Score & Official STRIKE Certificate",
        description:
          "Once cleared, the student can view their verified similarity percentage (8.4%) and preview/download the official STRIKE Plagiarism Clearance Certificate PDF.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/thesis/final-defense",
    pageTitle: "Step 5: Final Oral Defense Guide",
    subtitle:
      "Final Adviser endorsement, Final Oral Defense application, schedule, and graduation archival eligibility.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Toggle Final Defense Workflow States",
        description:
          "Preview (1) Final Adviser Endorsement, (2) Final Defense Application, (3) Scheduled Final Oral Defense, and (4) Completed & Passed with Repository archival link.",
        placement: "bottom",
      },
      {
        id: "final-adviser-panel",
        targetSelector: '[data-guide="final-adviser-panel"]',
        title: "Final Adviser Certification Before Oral Defense",
        description:
          "The Thesis Adviser reviews the complete Chapters 1–5 manuscript (with STRIKE clearance) and issues the signed Final Pre-Defense Certification.",
        placement: "top",
      },
      {
        id: "final-rap-panel",
        targetSelector: '[data-guide="final-rap-panel"], [data-guide="final-adviser-panel"]',
        title: "Final Oral Defense RAP Outcome & Archival Link",
        description:
          "Displays the finalized Final Defense Report of Action Taken (RAP) signed by the full Examination Committee and unlocks submission to the Research Databank.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/thesis",
    pageTitle: "Thesis Journey Hub Guide",
    subtitle:
      "Central overview of all 5 Thesis Journey milestones and their current completion status.",
    steps: [
      {
        id: "thesis-hub-overview",
        targetSelector: '[data-guide="thesis-hub-overview"], [data-guide="student-thesis-journey-menu"]',
        title: "Thesis Journey Overview Hub",
        description:
          "Provides a bird's-eye summary of your approved thesis title, assigned adviser, and overall progression through the 5 Graduate School defense milestones.",
        placement: "bottom",
      },
      {
        id: "thesis-step-cards",
        targetSelector: '[data-guide="thesis-step-cards"], [data-guide="student-thesis-journey-menu"]',
        title: "All 5 Milestone Workspaces Unlocked",
        description:
          "Click any of the 5 stages (Title Defense, Adviser Request, Proposal Defense, STRIKE Plagiarism, or Final Defense) to inspect its interactive forms and stage scenarios.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/repository/submit",
    pageTitle: "Research Databank Archival Submission Guide",
    subtitle:
      "Submit the approved final thesis manuscript, signed certifications, instruments, and dataset for graduation clearance.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Toggle Archival Submission States",
        description:
          "Preview the archival form when (1) Eligible after passing Final Defense, (2) Already Submitted & Registered in the Databank, or (3) Prerequisite Gate View.",
        placement: "bottom",
      },
      {
        id: "repo-submit-form",
        targetSelector: '[data-guide="repo-submit-form"]',
        title: "Archival Metadata & Abstract Entry",
        description:
          "Graduating students enter their comprehensive research abstract (150+ words) and indexed keywords, or click 'Fill Sample Evaluation Data' to test submission.",
        placement: "top",
      },
      {
        id: "repo-submit-files",
        targetSelector: '[data-guide="repo-submit-files"], [data-guide="repo-submit-form"]',
        title: "4 Required Archival Artifacts (DL-9)",
        description:
          "Upload or download the Approved Final Manuscript (Ch. 1–5), Signed Certifications, Research Instruments, and Data-Privacy-Restricted Respondent Dataset.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/repository",
    pageTitle: "Graduate Thesis Repository Guide",
    subtitle:
      "Search completed EARIST graduate theses and submit your own approved final manuscript.",
    steps: [
      {
        id: "repo-search-filters",
        targetSelector: '[data-guide="repo-search-filters"]',
        title: "Searching the EARIST Graduate Thesis Databank",
        description:
          "Filter published Master's theses and Doctoral dissertations by keyword, degree program, publication year, or author, and generate formatted academic citations.",
        placement: "bottom",
      },
      {
        id: "repo-submit-button",
        targetSelector: '[data-guide="repo-submit-button"]',
        title: "Archiving Your Approved Final Manuscript",
        description:
          "Once Final Oral Defense is passed, click here to upload your final approved manuscript package to the Graduate School Research Databank.",
        placement: "bottom",
      },
    ],
  },
  {
    routePattern: "/student/announcements",
    pageTitle: "Graduate School Announcements Guide",
    subtitle:
      "Official memoranda, academic policies, and defense filing deadlines issued by the Dean's Office.",
    steps: [
      {
        id: "announcements-list",
        targetSelector: '[data-guide="announcements-list"]',
        title: "Official Graduate School Memoranda",
        description:
          "Browse official EARIST Graduate School circulars covering digital defense guidelines, STRIKE similarity thresholds, and semester filing deadlines.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/notifications",
    pageTitle: "Student Notifications Guide",
    subtitle:
      "Real-time alerts for defense schedules, adviser endorsements, and finalized RAP reports.",
    steps: [
      {
        id: "notifications-list",
        targetSelector: '[data-guide="notifications-list"]',
        title: "Interactive Workflow Notifications",
        description:
          "Tracks every milestone update—from GS-020 Adviser approvals and Pre-Defense Certifications to defense schedules and finalized RAP outcomes.",
        placement: "top",
      },
    ],
  },

  // ============================================================================
  // B. FACULTY / PANELIST PORTAL ROUTES (/panelist/*)
  // ============================================================================
  {
    routePattern: "/panelist/dashboard",
    pageTitle: "Faculty / Panelist Dashboard Guide",
    subtitle:
      "Unified workload overview for Defense Committee Chairpersons, Panel Members, and Thesis Advisers.",
    autoShowOnFirstVisit: true,
    steps: [
      {
        id: "panelist-kpi-cards",
        targetSelector: '[data-guide="panelist-kpi-cards"]',
        title: "Faculty Workload & KPI Summary",
        description:
          "Summarizes active defense sessions, upcoming scheduled defenses, pending advisee manuscript reviews, and RAP reports awaiting your digital signature.",
        placement: "bottom",
      },
      {
        id: "panelist-upcoming-list",
        targetSelector: '[data-guide="panelist-upcoming-list"], [data-guide="panelist-attention-list"]',
        title: "Actionable Tasks & Upcoming Defense Sessions",
        description:
          "Provides 1-click access to live Defense Workspaces, incoming GS-020 Adviser Requests, and pre-defense advisee manuscript certifications.",
        placement: "top",
      },
      ...COMMON_PANELIST_SHELL_STEPS,
    ],
  },
  {
    routePattern: "/panelist/profile",
    pageTitle: "Faculty / Panelist Profile Guide",
    subtitle:
      "Academic rank, research specialization tags, and Thesis Adviser availability controls.",
    steps: [
      {
        id: "panelist-profile-card",
        targetSelector: '[data-guide="panelist-profile-card"]',
        title: "Faculty Credentials & Specializations",
        description:
          "Displays the faculty member's academic rank, Graduate School affiliation, research specialization areas, and current advisee load.",
        placement: "bottom",
      },
      {
        id: "panelist-availability-toggle",
        targetSelector: '[data-guide="panelist-availability-toggle"], [data-guide="panelist-profile-card"]',
        title: "Thesis Adviser Availability Toggle",
        description:
          "Allows faculty members to toggle whether they are currently accepting new GS-020 Thesis Adviser requests from graduate students.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/panelist/defenses",
    pageTitle: "My Defenses Assignment List Guide",
    subtitle:
      "Manage all Title, Proposal, and Final Defense committee assignments and launch the Collaborative Defense Workspace.",
    steps: [
      {
        id: "defenses-quick-filters",
        targetSelector: '[data-guide="defenses-quick-filters"]',
        title: "Filter by Stage, Role, or Session Status",
        description:
          "Quickly filter defense assignments across Title, Proposal, and Final stages or narrow down to sessions that are In Progress, Scheduled, or Awaiting Conclusion.",
        placement: "bottom",
      },
      {
        id: "defense-card-actions",
        targetSelector: '[data-guide="defense-card-actions"]',
        title: "Preview Manuscript PDF or Open Defense Workspace",
        description:
          "Click 'View Manuscript' to preview the candidate's PDF immediately, or click 'Open Defense Workspace' to launch the split-screen annotation, rubric scoring, and RAP deliberation environment.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/panelist/defense-workspace/",
    pageTitle: "Collaborative Defense Workspace Guide",
    subtitle:
      "Immersive split-screen environment for PDF manuscript annotation, institutional rubric scoring, RAP authoring, and verdict deliberation.",
    autoShowOnFirstVisit: true,
    steps: [
      {
        id: "workspace-role-toggle",
        targetSelector: '[data-guide="workspace-role-toggle"], [data-guide="scenario-switcher"]',
        title: "Switch Committee Role & Session Mode",
        description:
          "Use this bar to switch between (1) Committee Chairperson Mode (full rubric, RAP review, & verdict controls), (2) Panel Member / Rapporteur Mode (RAP rich-text authoring & scoring), and (3) Concluded Read-Only View.",
        placement: "bottom",
      },
      {
        id: "workspace-pdf-pane",
        targetSelector: '[data-guide="workspace-pdf-pane"]',
        title: "Interactive Split-Screen Manuscript PDF Viewer",
        description:
          "Read the candidate's thesis manuscript side-by-side with evaluation tools. Select text or regions on any PDF page to create shared highlight and comment annotations for the committee.",
        placement: "right",
      },
      {
        id: "workspace-rubric-tab",
        targetSelector: '[data-guide="workspace-rubric-tab"]',
        title: "Institutional Oral Evaluation Rubric (1.00–2.50 Scale)",
        description:
          "Score the candidate across Group I (Manuscript — 60%) and Group II (Oral Defense — 40%) criteria with automatic weighted computation, descriptive rating, and digital signature finalization.",
        placement: "left",
      },
      {
        id: "workspace-rap-tab",
        targetSelector: '[data-guide="workspace-rap-tab"]',
        title: "Collaborative Official RAP Report & Committee Verdict",
        description:
          "Draft or review the official Report of Action Taken (RAP), affix committee e-signatures, and (as Chairperson) record the formal defense verdict (Passed / Revisions Required / Re-Defense).",
        placement: "left",
      },
    ],
  },
  {
    routePattern: "/panelist/advisees",
    pageTitle: "My Advisees & Adviser Endorsements Guide",
    subtitle:
      "Approve incoming GS-020 Adviser Requests and issue signed Pre-Defense Manuscript Certifications.",
    steps: [
      {
        id: "advisees-tabs",
        targetSelector: '[data-guide="advisees-tabs"]',
        title: "Active Advisees, GS-020 Requests, & Manuscript Reviews",
        description:
          "Switch between your roster of Active Advisees, incoming GS Form No. 020 Adviser Requests awaiting CONFORME, and Pre-Defense Manuscript Review tasks.",
        placement: "bottom",
      },
      {
        id: "adviser-review-actions",
        targetSelector: '[data-guide="adviser-review-actions"], [data-guide="adviser-incoming-requests"], [data-guide="advisees-tabs"]',
        title: "Approve GS-020 or Issue Pre-Defense Certification",
        description:
          "Inspect an advisee's uploaded Proposal or Final manuscript PDF, leave revision feedback, or affix your digital signature to issue the official Pre-Defense Adviser Certification.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/panelist/signatures",
    pageTitle: "E-Signatures & Pending RAP Sign-Offs Guide",
    subtitle:
      "Manage your faculty digital signature specimen and sign pending Committee RAP Reports.",
    steps: [
      {
        id: "signature-specimen-card",
        targetSelector: '[data-guide="signature-specimen-card"]',
        title: "Faculty Digital Signature Specimen",
        description:
          "Draw or configure your digital signature specimen used when signing GS-020 Adviser forms, Pre-Defense Certifications, and Committee RAP Reports.",
        placement: "bottom",
      },
      {
        id: "pending-signatures-list",
        targetSelector: '[data-guide="pending-signatures-list"]',
        title: "One-Click Pending Document Sign-Off",
        description:
          "Review finalized Committee RAP Reports awaiting your signature and sign them in a single click with instant status confirmation.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/panelist/repository",
    pageTitle: "Faculty Thesis Repository Guide",
    subtitle:
      "Browse and cite completed EARIST Master's theses and Doctoral dissertations.",
    steps: [
      {
        id: "repo-search-filters",
        targetSelector: '[data-guide="repo-search-filters"]',
        title: "EARIST Graduate Research Databank",
        description:
          "Search completed graduate manuscripts by program, year, or keyword, preview full PDFs, and export formatted citations.",
        placement: "bottom",
      },
    ],
  },
  {
    routePattern: "/panelist/announcements",
    pageTitle: "Faculty Announcements & Memos Guide",
    subtitle:
      "Official Graduate School policies, defense schedules, and committee guidelines.",
    steps: [
      {
        id: "announcements-list",
        targetSelector: '[data-guide="announcements-list"]',
        title: "Graduate School Faculty Memoranda",
        description:
          "View institutional circulars and policy updates from the Office of the Graduate School Dean.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/panelist/notifications",
    pageTitle: "Faculty Notifications Guide",
    subtitle:
      "Alerts for live defense sessions, advisee manuscript uploads, and pending RAP signatures.",
    steps: [
      {
        id: "notifications-list",
        targetSelector: '[data-guide="notifications-list"]',
        title: "Committee & Adviser Alerts",
        description:
          "Stay updated on defense sessions in progress, new advisee manuscript submissions, and RAP documents ready for e-signature.",
        placement: "top",
      },
    ],
  },
];

export function getRouteGuideConfig(pathname: string | null): RouteGuideConfig {
  const cleanPath = (pathname || "/").split("?")[0];

  // Exact match first
  const exact = ROUTE_GUIDE_DEFINITIONS.find(
    (cfg) => cfg.routePattern === cleanPath,
  );
  if (exact) return exact;

  // Prefix match (longest pattern first, e.g., /panelist/defense-workspace/[scheduleId] or /panelist/advisees/[studentId])
  const sortedByLength = [...ROUTE_GUIDE_DEFINITIONS].sort(
    (a, b) => b.routePattern.length - a.routePattern.length,
  );
  const prefixMatch = sortedByLength.find((cfg) =>
    cleanPath.startsWith(cfg.routePattern),
  );
  if (prefixMatch) return prefixMatch;

  // Fallback for any other Student or Panelist route
  if (cleanPath.startsWith("/panelist")) {
    return {
      routePattern: cleanPath,
      pageTitle: "Faculty / Panelist Portal Guide",
      subtitle:
        "Explore Defense Committee workspaces, advisee manuscript reviews, and digital e-signatures.",
      steps: COMMON_PANELIST_SHELL_STEPS,
    };
  }

  return {
    routePattern: cleanPath,
    pageTitle: "Student Portal Evaluation Guide",
    subtitle:
      "Explore all unlocked Thesis Journey stages, scenario switchers, and official EARIST forms.",
    steps: COMMON_STUDENT_SHELL_STEPS,
  };
}
