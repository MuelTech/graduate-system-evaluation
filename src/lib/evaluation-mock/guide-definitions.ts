export type GuidePlacement = "top" | "bottom" | "left" | "right";

export interface GuideStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  placement?: GuidePlacement;
  roleContext?: "applicant" | "student" | "panelist" | "shared";
}

export interface RouteGuideConfig {
  routePattern: string;
  pageTitle: string;
  subtitle: string;
  autoShowOnFirstVisit?: boolean;
  steps: GuideStep[];
}

export const COMMON_APPLICANT_SHELL_STEPS: GuideStep[] = [
  {
    id: "applicant-sidebar-nav",
    targetSelector:
      '[data-guide="applicant-sidebar-nav"], [data-guide="applicant-sidebar"], [data-guide="mobile-sidebar-toggle"]',
    title: "Applicant Portal Navigation",
    description:
      "Use this sidebar (or tap the ≡ menu on mobile) to track your application from Program Alignment, Exam Scheduling, and Entrance Examination to Exam Results and COR Upload.",
    placement: "right",
    roleContext: "applicant",
  },
];

export const COMMON_STUDENT_SHELL_STEPS: GuideStep[] = [
  {
    id: "student-sidebar-nav",
    targetSelector:
      '[data-guide="student-sidebar-nav"], [data-guide="mobile-sidebar-toggle"]',
    title: "Student Portal Navigation",
    description:
      "Use this sidebar (or tap the ≡ menu on mobile) to navigate across your Dashboard, Academic Profile, Curriculum Checklist, Academic Journey timeline, and the Graduate Thesis Repository.",
    placement: "right",
    roleContext: "student",
  },
  {
    id: "student-thesis-journey-menu",
    targetSelector:
      '[data-guide="student-thesis-journey-menu"], [data-guide="student-sidebar-nav"], [data-guide="mobile-sidebar-toggle"]',
    title: "Unlocked 5-Step Thesis Journey",
    description:
      "In this Evaluation Edition, all 5 Thesis Journey milestones (Title Defense, Thesis Adviser Request, Proposal Defense, Plagiarism & Similarity Check, and Final Defense) are unlocked so you can freely evaluate every workflow screen.",
    placement: "right",
    roleContext: "student",
  },
];

export const COMMON_PANELIST_SHELL_STEPS: GuideStep[] = [
  {
    id: "faculty-sidebar-nav",
    targetSelector:
      '[data-guide="faculty-sidebar-nav"], [data-guide="mobile-sidebar-toggle"]',
    title: "Faculty Portal Navigation",
    description:
      "Use this sidebar (or tap the ≡ menu on mobile) to manage assigned oral defenses, supervise advisees, grade applicant entrance exam essays, and digitally sign official documents.",
    placement: "right",
    roleContext: "panelist",
  },
];

export const ROUTE_GUIDE_DEFINITIONS: RouteGuideConfig[] = [
  // ============================================================================
  // A. APPLICANT PORTAL ROUTES (/applicant/*)
  // ============================================================================
  {
    routePattern: "/applicant/dashboard",
    pageTitle: "Applicant Dashboard Guide",
    subtitle:
      "Track your Graduate School application progress from registration to enrollment.",
    autoShowOnFirstVisit: true,
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Admission Milestone Scenario Preview",
        description:
          "Use this bar to toggle the Applicant Dashboard between (1) New Applicant Alignment, (2) Exam Scheduled & Ready, and (3) Exam Passed & COR Upload.",
        placement: "bottom",
      },
      {
        id: "applicant-welcome",
        targetSelector: '[data-guide="applicant-welcome"]',
        title: "Applicant Status & Degree Banner",
        description:
          "Shows your applicant reference number, target graduate degree program, and active admission standing.",
        placement: "bottom",
      },
      {
        id: "applicant-progress-stepper",
        targetSelector: '[data-guide="applicant-progress-stepper"]',
        title: "3-Step Admission Progress Tracker",
        description:
          "Visualizes your progression across (1) Register & Align, (2) Schedule & Take Exam, and (3) Upload Certificate of Registration (COR).",
        placement: "bottom",
      },
      {
        id: "applicant-status-cards",
        targetSelector: '[data-guide="applicant-status-cards"]',
        title: "Application Status & Examination Bento Grid",
        description:
          "Direct access cards to review Program Alignment, view your Exam Schedule, inspect Exam Results, and upload your COR.",
        placement: "top",
      },
      ...COMMON_APPLICANT_SHELL_STEPS,
    ],
  },
  {
    routePattern: "/applicant/profile",
    pageTitle: "Applicant Profile Guide",
    subtitle:
      "Personal demographic information, undergraduate academic background, and target graduate program.",
    steps: [
      {
        id: "applicant-personal-info",
        targetSelector: '[data-guide="applicant-personal-info"]',
        title: "Applicant Demographic & Contact Details",
        description:
          "Displays and allows updating of your verified contact details, email address, and home address.",
        placement: "bottom",
      },
      {
        id: "applicant-academic-background",
        targetSelector: '[data-guide="applicant-academic-background"]',
        title: "Undergraduate Degree & Target Graduate Program",
        description:
          "Shows your previous bachelor's degree, undergraduate GPA, graduated institution, and target Master's or Doctoral program.",
        placement: "top",
      },
      ...COMMON_APPLICANT_SHELL_STEPS,
    ],
  },
  {
    routePattern: "/applicant/alignment",
    pageTitle: "Program Alignment Guide",
    subtitle:
      "Degree alignment verification and Bridging Course Waiver requirements.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Toggle Program Alignment Scenarios",
        description:
          "Switch between (1) Program Aligned (cleared for exam scheduling) and (2) Non-Aligned (Bridging Course Waiver required).",
        placement: "bottom",
      },
      {
        id: "alignment-status-card",
        targetSelector: '[data-guide="alignment-status-card"]',
        title: "Degree Alignment Assessment & Waiver Download",
        description:
          "Informs you if your undergraduate degree directly aligns with the graduate program. Non-aligned applicants can download the official Bridging Course Waiver PDF here.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/applicant/schedule",
    pageTitle: "Entrance Exam Scheduling Guide",
    subtitle:
      "Browse and book available Graduate School Entrance Examination slots.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Toggle Examination Scheduling Scenarios",
        description:
          "Preview (1) Selecting an available exam slot, (2) Confirmed exam appointment, and (3) Locked gate while pending Bridging Waiver.",
        placement: "bottom",
      },
      {
        id: "schedule-view-toggle",
        targetSelector: '[data-guide="schedule-view-toggle"]',
        title: "Table and Calendar Schedule Views",
        description:
          "Switch between a tabular list of examination dates and an interactive calendar view to find your preferred date and time.",
        placement: "bottom",
      },
      {
        id: "schedule-slots-card",
        targetSelector: '[data-guide="schedule-slots-card"]',
        title: "Book Available Examination Slot",
        description:
          "Inspect available seat capacities across morning and afternoon sessions, click 'Book Slot', and confirm your exam schedule.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/applicant/exam",
    pageTitle: "Interactive Entrance Examination Guide",
    subtitle:
      "Complete the 72 Multiple-Choice Questions and Graduate Essay with auto-save and live timer.",
    autoShowOnFirstVisit: true,
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Preview Entrance Examination Stages",
        description:
          "Switch between (1) Ready to Begin Instructions, (2) Active Exam (72 MCQs & Essay), (3) Final Submission Receipt, and (4) Missed Exam Appeal Gate.",
        placement: "bottom",
      },
      {
        id: "exam-timer-bar",
        targetSelector: '[data-guide="exam-timer-bar"]',
        title: "Live Examination Countdown Timer & Autosave Status",
        description:
          "Tracks remaining examination time with visual warnings and continuously auto-saves your MCQ selections and essay drafts.",
        placement: "bottom",
      },
      {
        id: "exam-question-workspace",
        targetSelector: '[data-guide="exam-question-workspace"]',
        title: "Interactive 72 MCQs & Graduate Essay Workspace",
        description:
          "Read passages and figures, choose answer options, and click 'Proceed to Essay Section' to compose your Graduate Leadership Essay with live word count.",
        placement: "right",
      },
      {
        id: "exam-question-navigator",
        targetSelector: '[data-guide="exam-question-navigator"]',
        title: "72-Item Question Navigator & Final Submission",
        description:
          "Quick-jump to any question (green = answered, red = active, gray = unanswered), jump to the Essay prompt, or click 'Submit Examination'.",
        placement: "left",
      },
    ],
  },
  {
    routePattern: "/applicant/results",
    pageTitle: "Entrance Examination Results Guide",
    subtitle:
      "Review your Multiple-Choice and Essay scores, overall percentage, and enrollment next steps.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Preview Examination Outcome Scenarios",
        description:
          "Toggle between (1) Passed Examination, (2) Awaiting Faculty Essay Evaluation, (3) Passed Reconsidered, and (4) Did Not Meet Threshold.",
        placement: "bottom",
      },
      {
        id: "results-score-breakdown",
        targetSelector: '[data-guide="results-score-breakdown"]',
        title: "MCQ, Essay & Combined Score Breakdown",
        description:
          "Displays your exact scores across the Multiple-Choice section and Faculty-evaluated Essay section compared against the passing threshold.",
        placement: "bottom",
      },
      {
        id: "results-next-steps",
        targetSelector: '[data-guide="results-next-steps"]',
        title: "Official Enrollment Next Steps & COR Upload",
        description:
          "Passed applicants receive instructions to complete registration in the university student portal (Pinnacle) and upload their Certificate of Registration (COR).",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/applicant/cor-upload",
    pageTitle: "Certificate of Registration (COR) Upload Guide",
    subtitle:
      "Submit your official Certificate of Registration to upgrade your account to Graduate Student status.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Preview COR Verification Scenarios",
        description:
          "Toggle between (1) Ready to Upload COR, (2) Under Verification by Graduate School Office, and (3) Verified Enrolled Student.",
        placement: "bottom",
      },
      {
        id: "cor-upload-dropzone",
        targetSelector: '[data-guide="cor-upload-dropzone"]',
        title: "Upload Official Certificate of Registration",
        description:
          "Drag and drop your official COR PDF or image file (max 5MB). Once verified, your account is upgraded to the Student Portal.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/applicant/notifications",
    pageTitle: "Applicant Notifications Guide",
    subtitle:
      "Real-time alerts for application milestones, exam schedules, results, and verification updates.",
    steps: [
      {
        id: "notifications-list",
        targetSelector: '[data-guide="notifications-list"]',
        title: "Admission & Examination Alerts",
        description:
          "Review all official notifications regarding your application status, confirmed exam schedules, and COR verification.",
        placement: "top",
      },
    ],
  },

  // ============================================================================
  // B. STUDENT PORTAL ROUTES (/student/*)
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
          "Tracks real-time progress across all 5 institutional Thesis Journey stages (Title Defense, Thesis Adviser Request, Proposal Defense, Plagiarism Check, and Final Defense).",
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
      "Evaluate all 5 workflow states of the Title Defense stage—from initial 3-title proposal submission to official Rapporteur Report outcome.",
    autoShowOnFirstVisit: true,
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Scenario Switcher Bar (Preview All 5 States)",
        description:
          "Click any numbered stage pill here to immediately preview how this page looks when: (1) Ready to Submit, (2) Under Graduate School Review, (3) Defense Scheduled, (4) Completed with Rapporteur Report, or (5) Returned for Correction.",
        placement: "bottom",
      },
      {
        id: "thesis-journey-stepper",
        targetSelector: '[data-guide="thesis-journey-stepper"]',
        title: "5-Step Thesis Journey Stepper & Approved Title Banner",
        description:
          "Displays overall thesis progression and your approved research title and official adviser once assigned.",
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
        title: "Schedule, Committee & Official Rapporteur Report",
        description:
          "Once scheduled or completed, students can view their Defense Committee roster, download the Official Defense Application PDF, and inspect the signed Rapporteur Report with their approved title.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/thesis/adviser-request",
    pageTitle: "Step 2: Thesis Adviser Request Form Guide",
    subtitle:
      "Select an eligible Graduate Faculty adviser and sign the official Thesis Adviser Request Form digitally.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Preview Adviser Request Stages",
        description:
          "Toggle between (1) Selecting an Adviser & signing the Request Form, (2) Awaiting Adviser & Dean approval, (3) Adviser Officially Assigned, and (4) Declined / Re-select Adviser.",
        placement: "bottom",
      },
      {
        id: "thesis-journey-stepper",
        targetSelector: '[data-guide="thesis-journey-stepper"]',
        title: "5-Step Thesis Journey Stepper",
        description:
          "Tracks progress across all 5 milestones. Click any step pill to navigate directly to its page.",
        placement: "bottom",
      },
      {
        id: "adviser-selection",
        targetSelector: '[data-guide="adviser-selection"], [data-guide="gs020-preview"]',
        title: "Selecting a Qualified Graduate Faculty Adviser",
        description:
          "Students browse eligible faculty members from their Title Defense panel, review specializations and advisee load, and affix their digital signature to submit the Thesis Adviser Request Form.",
        placement: "top",
      },
      {
        id: "gs020-preview",
        targetSelector: '[data-guide="gs020-preview"], [data-guide="adviser-selection"]',
        title: "Official Adviser Request Form Routing & PDF Preview",
        description:
          "Tracks e-signature routing across the Student, Thesis Adviser, and Graduate School Dean, with inline preview of the signed official Adviser Request Form PDF.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/thesis/proposal-defense",
    pageTitle: "Step 3: Proposal Defense Guide",
    subtitle:
      "Pre-defense Adviser manuscript review, Proposal Defense application, schedule, and Rapporteur Report outcome.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Toggle Proposal Defense Workflow States",
        description:
          "Switch between (1) Pre-Defense Adviser Review, (2) Submit Proposal Application, (3) Defense Scheduled, (4) Completed with Rapporteur Report, and (5) Revisions Required.",
        placement: "bottom",
      },
      {
        id: "thesis-journey-stepper",
        targetSelector: '[data-guide="thesis-journey-stepper"]',
        title: "5-Step Thesis Journey Stepper",
        description:
          "Click any step pill in the horizontal stepper to navigate to any stage of the journey.",
        placement: "bottom",
      },
      {
        id: "proposal-adviser-panel",
        targetSelector: '[data-guide="proposal-adviser-panel"], [data-guide="proposal-defense-record"]',
        title: "Step 1: Pre-Defense Manuscript Review & Adviser Certification",
        description:
          "Before applying for Proposal Defense, the student uploads Chapters 1–3 for their Thesis Adviser to inspect and issue a signed Pre-Defense Certification PDF.",
        placement: "top",
      },
      {
        id: "proposal-application-step",
        targetSelector: '[data-guide="proposal-application-step"], [data-guide="proposal-defense-record"]',
        title: "Step 2: Defense Application Requirements (COR & Receipt)",
        description:
          "Unlocks once the Adviser issues certification, allowing the student to submit their COR and payment receipt to schedule the defense.",
        placement: "top",
      },
      {
        id: "proposal-defense-record",
        targetSelector: '[data-guide="proposal-defense-record"], [data-guide="proposal-adviser-panel"]',
        title: "3-Card Status Tracker, Schedule & Rapporteur Report",
        description:
          "Displays the 4-step status tracker, Proposal Defense schedule, committee assignments, Official Defense Application PDF, and finalized Rapporteur Report.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/thesis/strike",
    pageTitle: "Step 4: Plagiarism & Similarity Check Guide",
    subtitle:
      "Institutional similarity check (<15% threshold) required prior to Final Oral Defense.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Toggle Plagiarism Check Stages",
        description:
          "Switch between (1) Submitting the revised manuscript for scanning, (2) Verification in progress, and (3) Cleared (9% Similarity Index) with certificate preview.",
        placement: "bottom",
      },
      {
        id: "thesis-journey-stepper",
        targetSelector: '[data-guide="thesis-journey-stepper"]',
        title: "5-Step Thesis Journey Stepper",
        description:
          "Visualizes progress across all 5 milestones. Step 4 ensures research integrity before the final oral defense.",
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
        title: "Similarity Score & Official Clearance Certificate",
        description:
          "Once cleared, the student can view their verified similarity percentage (9%) and preview/download the official Plagiarism Clearance Certificate PDF.",
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
          "Preview (1) Final Adviser Endorsement, (2) Submit Final Defense Application, (3) Scheduled Final Oral Defense, and (4) Completed & Passed with Repository archival link.",
        placement: "bottom",
      },
      {
        id: "thesis-journey-stepper",
        targetSelector: '[data-guide="thesis-journey-stepper"]',
        title: "5-Step Thesis Journey Stepper",
        description:
          "The final milestone before submitting your approved thesis package to the Graduate Research Repository.",
        placement: "bottom",
      },
      {
        id: "final-adviser-panel",
        targetSelector: '[data-guide="final-adviser-panel"], [data-guide="final-rap-panel"]',
        title: "Step 1: Final Adviser Certification Before Oral Defense",
        description:
          "The Thesis Adviser reviews the complete Chapters 1–5 manuscript (with Plagiarism clearance) and issues the signed Final Pre-Defense Certification.",
        placement: "top",
      },
      {
        id: "final-application-step",
        targetSelector: '[data-guide="final-application-step"], [data-guide="final-rap-panel"]',
        title: "Step 2: Final Defense Application Requirements",
        description:
          "Upload your COR and defense-fee payment receipt to request scheduling by the Graduate School Office.",
        placement: "top",
      },
      {
        id: "final-rap-panel",
        targetSelector: '[data-guide="final-rap-panel"], [data-guide="final-adviser-panel"]',
        title: "Final Oral Defense Rapporteur Report & Archival Link",
        description:
          "Displays the finalized Final Defense Rapporteur Report signed by the full Examination Committee and unlocks submission to the Research Databank.",
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
          "Click any of the 5 stages (Title Defense, Thesis Adviser Request, Proposal Defense, Plagiarism Check, or Final Defense) to inspect its interactive forms and stage scenarios.",
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
        title: "Final Thesis Archival Documents",
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
          "Browse official EARIST Graduate School circulars covering digital defense guidelines, plagiarism similarity thresholds, and semester filing deadlines.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/student/notifications",
    pageTitle: "Student Notifications Guide",
    subtitle:
      "Real-time alerts for defense schedules, adviser endorsements, and finalized Rapporteur Reports.",
    steps: [
      {
        id: "notifications-list",
        targetSelector: '[data-guide="notifications-list"]',
        title: "Interactive Workflow Notifications",
        description:
          "Tracks every milestone update—from Adviser approvals and Pre-Defense Certifications to defense schedules and finalized Rapporteur Report outcomes.",
        placement: "top",
      },
    ],
  },

  // ============================================================================
  // C. FACULTY PORTAL ROUTES (/faculty/* & /panelist/*)
  // ============================================================================
  {
    routePattern: "/panelist/dashboard",
    pageTitle: "Faculty Dashboard Guide",
    subtitle:
      "Unified workload overview for Defense Committee Chairpersons, Panel Members, Thesis Advisers, and Entrance Exam Evaluators.",
    autoShowOnFirstVisit: true,
    steps: [
      {
        id: "panelist-kpi-cards",
        targetSelector: '[data-guide="panelist-kpi-cards"]',
        title: "Faculty Workload & KPI Summary",
        description:
          "Summarizes active defense sessions, upcoming scheduled defenses, pending advisee manuscript reviews, and pending Entrance Exam Essay Evaluations.",
        placement: "bottom",
      },
      {
        id: "panelist-attention-list",
        targetSelector: '[data-guide="panelist-attention-list"]',
        title: "Actionable Tasks Needing Your Attention",
        description:
          "Direct access to pending essay grading tasks, adviser requests, and documents awaiting your digital signature.",
        placement: "top",
      },
      {
        id: "panelist-upcoming-list",
        targetSelector: '[data-guide="panelist-upcoming-list"]',
        title: "Upcoming Defense Sessions",
        description:
          "Provides 1-click access to launch live Defense Workspaces for scheduled Title, Proposal, and Final oral defenses.",
        placement: "top",
      },
      ...COMMON_PANELIST_SHELL_STEPS,
    ],
  },
  {
    routePattern: "/panelist/profile",
    pageTitle: "Faculty Profile Guide",
    subtitle:
      "Academic rank, research specialization tags, and Graduate School faculty classifications.",
    steps: [
      {
        id: "panelist-profile-card",
        targetSelector: '[data-guide="panelist-profile-card"]',
        title: "Faculty Credentials & Specializations",
        description:
          "Displays the faculty member's academic rank, Graduate School department affiliation, research specialization areas, and current advisee capacity.",
        placement: "bottom",
      },
      {
        id: "faculty-access-badges",
        targetSelector: '[data-guide="faculty-access-badges"]',
        title: "Classification & Academic Access Badges",
        description:
          "Displays verified institutional privileges: Internal/External faculty status, Thesis Adviser eligibility, and Entrance Exam Essay Evaluation clearance.",
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
          "Quickly filter defense assignments across Title, Proposal, and Final stages or narrow down to sessions that are In Progress, Scheduled, or Concluded.",
        placement: "bottom",
      },
      {
        id: "defense-card-actions",
        targetSelector: '[data-guide="defense-card-actions"]',
        title: "Preview Manuscript PDF or Open Defense Workspace",
        description:
          "Click 'View Manuscript' to preview the candidate's PDF immediately, or click 'Open Defense Workspace' to launch the split-screen annotation, rubric scoring, and Rapporteur Report deliberation environment.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/panelist/defense-workspace/",
    pageTitle: "Collaborative Defense Workspace Guide",
    subtitle:
      "Immersive split-screen environment for PDF manuscript annotation, institutional rubric scoring, Rapporteur Report authoring, and verdict deliberation.",
    autoShowOnFirstVisit: true,
    steps: [
      {
        id: "workspace-role-toggle",
        targetSelector: '[data-guide="workspace-role-toggle"], [data-guide="scenario-switcher"]',
        title: "Switch Committee Role & Session Mode",
        description:
          "Use this bar to switch between (1) Committee Chairperson Mode (full rubric, Rapporteur Report review, & verdict controls), (2) Panel Member / Rapporteur Mode (Rapporteur Report rich-text authoring & scoring), and (3) Concluded Read-Only View.",
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
        title: "Collaborative Rapporteur Report & Committee Verdict",
        description:
          "Draft or review the official Rapporteur Report, affix committee e-signatures, and (as Chairperson) record the formal defense verdict (Passed / Revisions Required / Re-Defense).",
        placement: "left",
      },
    ],
  },
  {
    routePattern: "/panelist/advisees/",
    pageTitle: "Advisee Supervision & Pre-Defense Review Guide",
    subtitle:
      "Inspect an advisee's thesis progress, issue Pre-Defense Certifications, and review historical defense records.",
    steps: [
      {
        id: "advisee-detail-overview",
        targetSelector: '[data-guide="advisee-detail-overview"]',
        title: "Advisee Academic & Supervision Overview",
        description:
          "Displays the advisee's active thesis stage, working research title, and official adviser assignment date.",
        placement: "bottom",
      },
      {
        id: "adviser-review-actions",
        targetSelector: '[data-guide="adviser-review-actions"]',
        title: "Pre-Defense Manuscript Review & Certification",
        description:
          "Click 'Review manuscript' to inspect the uploaded PDF, request revisions, or affix your digital signature to issue the official Pre-Defense Certification.",
        placement: "top",
      },
      {
        id: "advisee-research-docs",
        targetSelector: '[data-guide="advisee-research-docs"]',
        title: "Stage Manuscripts & Defense History",
        description:
          "View all uploaded manuscripts across Title, Proposal, and Final stages as well as finalized Committee Rapporteur Reports.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/panelist/advisees",
    pageTitle: "My Advisees & Adviser Endorsements Guide",
    subtitle:
      "Approve incoming Thesis Adviser Requests and issue signed Pre-Defense Manuscript Certifications.",
    steps: [
      {
        id: "advisees-tabs",
        targetSelector: '[data-guide="advisees-tabs"]',
        title: "Active Advisees, Adviser Requests, & Manuscript Reviews",
        description:
          "Switch between your roster of Active Advisees, incoming Thesis Adviser Requests awaiting CONFORME, and Pre-Defense Manuscript Review tasks.",
        placement: "bottom",
      },
      {
        id: "adviser-review-actions",
        targetSelector: '[data-guide="adviser-review-actions"], [data-guide="adviser-incoming-requests"], [data-guide="advisees-tabs"]',
        title: "Approve Adviser Request or Issue Pre-Defense Certification",
        description:
          "Inspect an advisee's uploaded Proposal or Final manuscript PDF, leave revision feedback, or affix your digital signature to issue the official Pre-Defense Adviser Certification.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/panelist/essay-evaluations/",
    pageTitle: "Entrance Exam Essay Grading Guide",
    subtitle:
      "Read applicant written responses, score according to graduate rubrics, and finalize Entrance Exam scores.",
    steps: [
      {
        id: "scenario-switcher",
        targetSelector: '[data-guide="scenario-switcher"]',
        title: "Toggle Essay Evaluation Scenario",
        description:
          "Switch between (1) Pending Essay Grading and (2) Graded & Final Score Computed.",
        placement: "bottom",
      },
      {
        id: "essay-applicant-summary",
        targetSelector: '[data-guide="essay-applicant-summary"]',
        title: "Applicant & Exam Session Details",
        description:
          "Displays the applicant's name, target degree program, exam session date, and Multiple-Choice section score.",
        placement: "bottom",
      },
      {
        id: "essay-grading-panel",
        targetSelector: '[data-guide="essay-grading-panel"]',
        title: "Applicant Essay Response & Score Input",
        description:
          "Read the prompt and the applicant's written essay, enter an evaluation score (0–38 points), and submit to compute the final exam result.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/panelist/essay-evaluations",
    pageTitle: "Entrance Exam Essay Evaluations Guide",
    subtitle:
      "Review and grade written essays from applicants who took the Graduate School Entrance Examination.",
    steps: [
      {
        id: "essay-eval-filters",
        targetSelector: '[data-guide="essay-eval-filters"]',
        title: "Filter by Program & Evaluation Status",
        description:
          "Search applicants by name, filter by graduate program, or view submissions that are Pending Evaluation vs. already Evaluated.",
        placement: "bottom",
      },
      {
        id: "essay-eval-table",
        targetSelector: '[data-guide="essay-eval-table"]',
        title: "Applicant Exam Submissions & Essay Actions",
        description:
          "Click 'Evaluate Essay' on any pending applicant to open their written response and assign a score.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/panelist/signatures",
    pageTitle: "E-Signatures & Pending Rapporteur Report Sign-Offs Guide",
    subtitle:
      "Manage your faculty digital signature specimen and sign pending Committee Rapporteur Reports.",
    steps: [
      {
        id: "signature-specimen-card",
        targetSelector: '[data-guide="signature-specimen-card"]',
        title: "Faculty Digital Signature Specimen",
        description:
          "Draw or configure your digital signature specimen used when signing Adviser Request forms, Pre-Defense Certifications, and Committee Rapporteur Reports.",
        placement: "bottom",
      },
      {
        id: "pending-signatures-list",
        targetSelector: '[data-guide="pending-signatures-list"]',
        title: "One-Click Pending Document Sign-Off",
        description:
          "Review finalized Committee Rapporteur Reports awaiting your signature and sign them in a single click with instant status confirmation.",
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
      "Alerts for live defense sessions, advisee manuscript uploads, and pending Rapporteur Report signatures.",
    steps: [
      {
        id: "notifications-list",
        targetSelector: '[data-guide="notifications-list"]',
        title: "Committee & Adviser Alerts",
        description:
          "Stay updated on defense sessions in progress, new advisee manuscript submissions, and Rapporteur Report documents ready for e-signature.",
        placement: "top",
      },
    ],
  },

  // ============================================================================
  // D. PUBLIC & AUTHENTICATION ROUTES (/, /login, /register, /about, etc.)
  // ============================================================================
  {
    routePattern: "/login",
    pageTitle: "Portal Sign-In & Role Selection Guide",
    subtitle:
      "Choose between Applicant, Graduate Student, and Faculty roles with zero login friction.",
    steps: [
      {
        id: "login-eval-notice",
        targetSelector: '[data-guide="login-eval-notice"]',
        title: "System Evaluation & Testing Environment Notice",
        description:
          "Explains that this environment is pre-configured with sample academic records for testing and does not require a password.",
        placement: "bottom",
      },
      {
        id: "login-role-selector",
        targetSelector: '[data-guide="login-role-selector"]',
        title: "Select Your Participant Role",
        description:
          "Choose between (1) Applicant, (2) Graduate Student, or (3) Faculty. Selecting a role loads that persona's pre-configured credentials and portal view.",
        placement: "bottom",
      },
      {
        id: "login-eval-tips",
        targetSelector: '[data-guide="login-eval-tips"]',
        title: "Three Built-In Evaluation Tools",
        description:
          "Every portal screen includes (1) Interactive Arrow Page Guides, (2) Multi-Stage Scenario Switchers, and (3) Pre-loaded Sample Institutional PDFs.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/register",
    pageTitle: "Applicant Registration Guide",
    subtitle:
      "2-step registration wizard with automated undergraduate degree alignment checking.",
    steps: [
      {
        id: "register-stepper",
        targetSelector: '[data-guide="register-stepper"]',
        title: "2-Step Registration Progress",
        description:
          "Tracks progress across Step 1 (Personal Details) and Step 2 (Academic Background & Program Alignment).",
        placement: "bottom",
      },
      {
        id: "register-form",
        targetSelector: '[data-guide="register-form"]',
        title: "Interactive Registration Form & Alignment Check",
        description:
          "Fill out demographic details, select your previous undergraduate degree and target graduate program, and automatically evaluate program alignment.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/repository",
    pageTitle: "Public Graduate Research Repository Guide",
    subtitle:
      "Explore published Master's theses and Doctoral dissertations from EARIST Graduate School.",
    steps: [
      {
        id: "repo-search-filters",
        targetSelector: '[data-guide="repo-search-filters"]',
        title: "Search & Filter Published Research",
        description:
          "Search by title, author, keyword, or degree program and generate APA/MLA/Chicago academic citations.",
        placement: "bottom",
      },
    ],
  },
  {
    routePattern: "/about",
    pageTitle: "About the Graduate School Guide",
    subtitle:
      "Institutional mandate, academic leadership, and published Graduate School goals.",
    steps: [
      {
        id: "about-header",
        targetSelector: '[data-guide="about-header"]',
        title: "Graduate School Overview",
        description:
          "Learn about the EARIST Graduate School's mission in preparing educators, researchers, and public leaders.",
        placement: "bottom",
      },
      {
        id: "about-goals",
        targetSelector: '[data-guide="about-goals"]',
        title: "Published Graduate School Goals",
        description:
          "Review the core institutional goals guiding Master's and Doctoral degree programs at EARIST.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/programs",
    pageTitle: "Graduate Programs Directory Guide",
    subtitle:
      "Browse all Doctoral and Master's degree offerings and published majors at EARIST.",
    steps: [
      {
        id: "programs-header",
        targetSelector: '[data-guide="programs-header"]',
        title: "Academic Degree Groups",
        description:
          "Jump between Doctoral Programs and Master's Programs offered by the EARIST Graduate School.",
        placement: "bottom",
      },
      {
        id: "programs-directory",
        targetSelector: '[data-guide="programs-directory"]',
        title: "Complete Degree & Major Listing",
        description:
          "Inspect each graduate degree program and its specialized majors.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/faq",
    pageTitle: "FAQ & Help Center Guide",
    subtitle:
      "Frequently asked questions covering Admissions, Enrollment, Thesis Defense, and System Access.",
    steps: [
      {
        id: "faq-search",
        targetSelector: '[data-guide="faq-search"]',
        title: "Search Help Topics",
        description:
          "Filter questions across admissions, program alignment, entrance examinations, and thesis defense workflows.",
        placement: "bottom",
      },
      {
        id: "faq-categories",
        targetSelector: '[data-guide="faq-categories"]',
        title: "Categorized Answers",
        description:
          "Expand any question to read step-by-step guidance for applicants, students, and faculty.",
        placement: "top",
      },
    ],
  },
  {
    routePattern: "/",
    pageTitle: "EARIST Graduate School — Public Portal Guide",
    subtitle:
      "Explore official Graduate School announcements, academic programs, research repository, and portal sign-in.",
    steps: [
      {
        id: "public-navbar-signin",
        targetSelector:
          '[data-guide="public-navbar-signin"], [data-guide="public-navbar-mobile"], [data-guide="page-guide-trigger"]',
        title: "Sign In or Create an Applicant Account",
        description:
          "Click 'Sign In' to select your evaluation role (Applicant, Graduate Student, or Faculty) or 'Create Account' to test the Applicant Registration workflow.",
        placement: "bottom",
      },
      {
        id: "landing-hero-carousel",
        targetSelector: '[data-guide="landing-hero-carousel"]',
        title: "Featured Graduate School Highlights",
        description:
          "Full-screen interactive carousel showcasing admissions, graduate degree offerings, and institutional announcements.",
        placement: "bottom",
      },
      {
        id: "landing-news-section",
        targetSelector: '[data-guide="landing-news-section"]',
        title: "News & Announcements Feed",
        description:
          "Read official Graduate School advisories, entrance examination schedules, and photo announcements with a built-in image lightbox.",
        placement: "top",
      },
      {
        id: "landing-about-section",
        targetSelector: '[data-guide="landing-about-section"]',
        title: "About the Graduate School & Goals",
        description:
          "Overview of the EARIST Graduate School's mandate and five institutional goals across Master's and Doctoral education.",
        placement: "top",
      },
      {
        id: "landing-programs-section",
        targetSelector: '[data-guide="landing-programs-section"]',
        title: "Master's & Doctoral Programs Directory",
        description:
          "Browse all four Doctoral programs and seven Master's degree programs with their respective majors.",
        placement: "top",
      },
      {
        id: "landing-repository-section",
        targetSelector: '[data-guide="landing-repository-section"]',
        title: "Graduate Research Repository",
        description:
          "Discover published graduate theses and dissertations, abstracts, and citation tools.",
        placement: "top",
      },
      {
        id: "landing-contact-section",
        targetSelector: '[data-guide="landing-contact-section"]',
        title: "Campus Contact & Inquiry Form",
        description:
          "View official Graduate School contact details, campus address, and send direct academic inquiries.",
        placement: "top",
      },
    ],
  },
];

export function getRouteGuideConfig(pathname: string | null): RouteGuideConfig {
  const cleanPath = (pathname || "/").split("?")[0];
  // Normalize /faculty to /panelist for lookup against defined routes
  const normalizedPath = cleanPath.replace(/^\/faculty(?=\/|$)/, "/panelist");

  // 1. Exact match against cleanPath or normalizedPath
  const exact =
    ROUTE_GUIDE_DEFINITIONS.find((cfg) => cfg.routePattern === cleanPath) ??
    ROUTE_GUIDE_DEFINITIONS.find((cfg) => cfg.routePattern === normalizedPath);
  if (exact) return exact;

  // 2. Prefix match (longest pattern first, exclude "/" from prefix matching everything)
  const sortedByLength = [...ROUTE_GUIDE_DEFINITIONS]
    .filter((cfg) => cfg.routePattern !== "/")
    .sort((a, b) => b.routePattern.length - a.routePattern.length);

  const prefixMatch =
    sortedByLength.find((cfg) => cleanPath.startsWith(cfg.routePattern)) ??
    sortedByLength.find((cfg) => normalizedPath.startsWith(cfg.routePattern));
  if (prefixMatch) return prefixMatch;

  // 3. Fallbacks by portal
  if (cleanPath.startsWith("/applicant")) {
    return {
      routePattern: cleanPath,
      pageTitle: "Applicant Portal Guide",
      subtitle:
        "Track program alignment, entrance examination scheduling, exam results, and enrollment.",
      steps: COMMON_APPLICANT_SHELL_STEPS,
    };
  }

  if (cleanPath.startsWith("/panelist") || cleanPath.startsWith("/faculty")) {
    return {
      routePattern: cleanPath,
      pageTitle: "Faculty Portal Guide",
      subtitle:
        "Explore Defense Committee workspaces, advisee manuscript reviews, entrance exam essay grading, and digital e-signatures.",
      steps: COMMON_PANELIST_SHELL_STEPS,
    };
  }

  if (cleanPath.startsWith("/student")) {
    return {
      routePattern: cleanPath,
      pageTitle: "Student Portal Evaluation Guide",
      subtitle:
        "Explore all unlocked Thesis Journey stages, scenario switchers, and official EARIST forms.",
      steps: COMMON_STUDENT_SHELL_STEPS,
    };
  }

  return {
    routePattern: cleanPath,
    pageTitle: "EARIST Graduate School Portal Guide",
    subtitle:
      "Use the top navigation bar to Sign In as an Applicant, Graduate Student, or Faculty member.",
    steps: [
      {
        id: "public-navbar-signin",
        targetSelector: '[data-guide="public-navbar-signin"]',
        title: "Sign In to Your Portal",
        description:
          "Click 'Sign In' in the navigation bar to select your participant role (Applicant, Graduate Student, or Faculty).",
        placement: "bottom",
      },
    ],
  };
}
