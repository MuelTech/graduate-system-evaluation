import type {
  NotificationItem,
  PanelistAssignmentData,
  RapReportSignatureDoc,
  RepositoryPublication,
} from "@/types";
import type {
  AdviserAdviseeDetailDto,
  AdviserWorkspaceDto,
} from "@/types/adviser-workspace";
import type {
  DefenseHistory,
  DefenseHistoryAttemptDetail,
} from "@/types/defense-history";
import type {
  DefenseWorkspace,
  OralEvaluation,
} from "@/types/defense-workspace";
import type { ProposalAdviserReview } from "@/types/proposal-adviser-review";
import type {
  DefenseSessionSummary,
  JourneyStepKey,
  StudentThesisJourney,
} from "@/types/student-thesis-journey";
import type { AdviserReviewTaskDetail } from "@/lib/adviser-reviews";
import type { PanelistDashboard } from "@/lib/panelist-dashboard";
import type { CollaborationAnnotation } from "@/lib/pdf-annotation/annotations";

export const OFFICIAL_APPROVED_TITLE =
  "Data-Driven Instructional Supervision and Digital Readiness of Public Secondary School Heads in the Division of Manila";

export const PROPOSED_TITLES = [
  {
    id: "title-opt-01",
    titleText: OFFICIAL_APPROVED_TITLE,
    isSelected: true,
  },
  {
    id: "title-opt-02",
    titleText:
      "School-Based Management Practices and Faculty Instructional Competence in Public High Schools in Manila",
    isSelected: false,
  },
  {
    id: "title-opt-03",
    titleText:
      "Leadership Resiliency and Administrative Decision-Making of Public Secondary Principals in NCR",
    isSelected: false,
  },
];

export const MOCK_MEMOS = [
  {
    id: "memo-2026-01",
    title:
      "GS Memorandum No. 2026-04: Guidelines on Digital Thesis Defense & E-Signature Routing (AY 2025–2026)",
    content:
      "All Master's and Doctoral candidates scheduled for Title, Proposal, and Final Oral Defense shall upload their consolidated PDF packages through the Graduate School Information System at least seven (7) calendar days prior to the defense date. Committee members shall record rubric evaluations and sign the Report of Action Taken (RAP) digitally within the Collaborative Defense Workspace.",
    category: "Academic Policy",
    createdAt: "2026-02-15T08:30:00.000Z",
  },
  {
    id: "memo-2026-02",
    title:
      "GS Memorandum No. 2026-03: Mandatory STRIKE / Plagiarism Similarity Threshold (<15%) Prior to Final Defense",
    content:
      "In accordance with the EARIST Research Ethics and Quality Assurance Policy, all graduate candidates must secure a STRIKE Similarity Clearance Certificate showing an overall similarity index below 15% before their Thesis Adviser issues the Final Pre-Defense Certification.",
    category: "Research & Ethics",
    createdAt: "2026-02-02T09:00:00.000Z",
  },
  {
    id: "memo-2026-03",
    title:
      "Schedule of Comprehensive Examinations and Defense Filing Deadlines for 2nd Semester AY 2025–2026",
    content:
      "Filing of Proposal and Final Defense applications closes on March 28, 2026. Ensure that your current semester Certificate of Registration (COR), Official Defense Fee Receipt, and signed Adviser Pre-Defense Certification are complete.",
    category: "Calendar & Deadlines",
    createdAt: "2026-01-20T10:15:00.000Z",
  },
  {
    id: "memo-2026-04",
    title:
      "Controlled Research Databank (DL-9) Archival Submission Requirements for Graduating Students",
    content:
      "Candidates who have passed the Final Oral Defense and completed all panel revisions must submit their final manuscript (Chapters 1–5), signed certifications, research instruments, and anonymized respondent datasets to the Graduate School Research Databank for graduation clearance.",
    category: "Graduation Clearance",
    createdAt: "2026-01-10T14:00:00.000Z",
  },
];

export const INITIAL_STUDENT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-stu-01",
    title: "Proposal Defense Schedule Confirmed",
    message:
      "Your Proposal Defense has been scheduled for March 24, 2026 at 9:00 AM (GS Defense Room 302 / Hybrid). Please review your committee assignment.",
    type: "DEFENSE_SCHEDULE",
    relatedRecordType: "DEFENSE_SCHEDULE",
    relatedRecordId: "sched-proposal-01",
    isRead: false,
    createdAt: "2026-03-10T09:15:00.000Z",
  },
  {
    id: "notif-stu-02",
    title: "Adviser Pre-Defense Certification Issued",
    message:
      "Dr. Maria Clara R. Santos has certified your Proposal Manuscript (Chapters 1–3) for Proposal Defense application.",
    type: "ADVISER_CERTIFICATION",
    relatedRecordType: "ADVISER_CERTIFICATION",
    relatedRecordId: "cert-prop-01",
    isRead: false,
    createdAt: "2026-03-08T14:20:00.000Z",
  },
  {
    id: "notif-stu-03",
    title: "GS Form No. 020 Adviser Request Approved",
    message:
      "Your official Adviser Request for Dr. Maria Clara R. Santos, EdD has been confirmed by the Adviser and approved by the Graduate School Dean.",
    type: "ADVISER_REQUEST",
    relatedRecordType: "ADVISER_REQUEST",
    relatedRecordId: "adv-req-01",
    isRead: true,
    createdAt: "2026-02-18T11:00:00.000Z",
  },
  {
    id: "notif-stu-04",
    title: "Title Defense RAP Finalized — PASSED",
    message:
      "Your Title Defense Report of Action Taken (RAP) is now finalized. Approved Title: 'Data-Driven Instructional Supervision and Digital Readiness of Public Secondary School Heads in the Division of Manila'.",
    type: "RAP_FINALIZED",
    relatedRecordType: "DEFENSE_SCHEDULE",
    relatedRecordId: "sched-title-01",
    isRead: true,
    createdAt: "2026-02-05T16:45:00.000Z",
  },
];

export const INITIAL_PANELIST_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-pan-01",
    title: "Defense Session In Progress — Action Required",
    message:
      "You are assigned as Committee Chairperson for Juan M. Dela Cruz's defense session. Open the Collaborative Defense Workspace to score and deliberate.",
    type: "DEFENSE_WORKSPACE",
    relatedRecordType: "DEFENSE_SCHEDULE",
    relatedRecordId: "sched-title-01",
    isRead: false,
    createdAt: "2026-03-11T08:00:00.000Z",
  },
  {
    id: "notif-pan-02",
    title: "New Pre-Defense Manuscript Uploaded by Advisee",
    message:
      "Your advisee Mark Anthony P. Villanueva uploaded a Proposal Manuscript for your review and pre-defense certification.",
    type: "ADVISER_REVIEW",
    relatedRecordType: "THESIS_RECORD",
    relatedRecordId: "thesis-eval-02",
    isRead: false,
    createdAt: "2026-03-09T15:30:00.000Z",
  },
  {
    id: "notif-pan-03",
    title: "Pending GS-020 Adviser Request Awaiting CONFORME",
    message:
      "Catherine L. Mendoza (MAEd-AS) has requested you as Thesis Adviser following her Title Defense. Review and record your CONFORME in My Advisees.",
    type: "ADVISER_REQUEST",
    relatedRecordType: "ADVISER_REQUEST",
    relatedRecordId: "req-incoming-01",
    isRead: false,
    createdAt: "2026-03-07T10:00:00.000Z",
  },
  {
    id: "notif-pan-04",
    title: "Committee RAP Report Ready for E-Signature",
    message:
      "The Rapporteur has frozen the Committee RAP Report for Paolo R. Evangelista (Final Defense). Please affix your digital signature.",
    type: "RAP_SIGNATURE",
    relatedRecordType: "RAP_SIGNATURE",
    relatedRecordId: "rap-sig-pending-01",
    isRead: true,
    createdAt: "2026-03-05T13:10:00.000Z",
  },
];

export const MOCK_PUBLICATIONS: RepositoryPublication[] = [
  {
    id: "pub-2026-01",
    title:
      "Instructional Leadership Digitalization and Teacher Self-Efficacy in Public Secondary Schools of Manila",
    author: "Elena G. Macaraeg, MAEd",
    program:
      "Master of Arts in Education Major in Administration and Supervision",
    abstract:
      "This study investigated the extent of instructional leadership digitalization among public secondary school heads and its relationship with teacher self-efficacy across 28 public high schools in the Division of Manila during AY 2024–2025. Using a descriptive-correlational research design with 312 teachers and 28 department heads, findings revealed a strong positive correlation (r = 0.74, p < 0.001) between digital supervisory feedback practices and classroom pedagogical innovation. An institutional Digital Instructional Supervision Toolkit was developed based on the findings.",
    keywords: [
      "Instructional Leadership",
      "Digital Supervision",
      "Teacher Self-Efficacy",
      "Educational Administration",
      "Public Secondary Schools",
    ],
    publishedAt: "2026-01-18T00:00:00.000Z",
    hasManuscript: true,
    hasRespondentData: false,
    downloadUrl: "/sample-docs/sample-manuscript.pdf",
    canDownloadManuscript: true,
    canDownloadRespondentData: false,
    artifact: { available: false, policyResolved: false },
  },
  {
    id: "pub-2026-02",
    title:
      "Predictive Analytics for Graduate Student Retention and Timely Thesis Completion Using Ensemble Machine Learning",
    author: "Engr. Lorenzo V. Bautista, MSCS",
    program: "Master of Science in Computer Science",
    abstract:
      "Timely completion of graduate thesis milestones remains a critical challenge in state universities. This research developed and validated a Gradient Boosted Decision Tree and Random Forest ensemble model trained on anonymized academic progression milestones to identify early risk indicators during the coursework-to-proposal transition. The proposed model achieved an F1-score of 0.89 and informed early advising intervention protocols.",
    keywords: [
      "Predictive Analytics",
      "Machine Learning",
      "Graduate Education",
      "Student Retention",
      "Thesis Completion",
    ],
    publishedAt: "2025-11-24T00:00:00.000Z",
    hasManuscript: true,
    hasRespondentData: false,
    downloadUrl: "/sample-docs/sample-manuscript.pdf",
    canDownloadManuscript: true,
    canDownloadRespondentData: false,
    artifact: { available: false, policyResolved: false },
  },
  {
    id: "pub-2025-03",
    title:
      "Participatory Governance and Barangay Disaster Risk Reduction Preparedness in Metro Manila Local Government Units",
    author: "Ronald C. Pangilinan, DPA",
    program: "Doctor of Public Administration",
    abstract:
      "This dissertation examined the institutional mechanisms of participatory governance and fiscal utilization in Barangay Disaster Risk Reduction and Management (BDRRM) councils across four cities in Metro Manila. Mixed-methods evaluation demonstrated that community-led hazard mapping and transparent digital procurement tracking significantly improved emergency response readiness.",
    keywords: [
      "Public Administration",
      "Disaster Risk Reduction",
      "Participatory Governance",
      "Local Government",
    ],
    publishedAt: "2025-10-12T00:00:00.000Z",
    hasManuscript: true,
    hasRespondentData: false,
    downloadUrl: "/sample-docs/sample-manuscript.pdf",
    canDownloadManuscript: true,
    canDownloadRespondentData: false,
    artifact: { available: false, policyResolved: false },
  },
  {
    id: "pub-2025-04",
    title:
      "Lean Six Sigma Process Optimization in Semiconductor Wafer Testing Facilities in CALABARZON",
    author: "Engr. Patricia Mae D. Soriano, MSIE",
    program: "Master of Science in Industrial Engineering",
    abstract:
      "Applying DMAIC methodology and value-stream mapping, this study addressed equipment changeover bottlenecks in back-end semiconductor test cells. Implementation of standardized single-minute exchange of die (SMED) procedures reduced setup downtime by 31.4% and increased overall equipment effectiveness (OEE) by 11.8 percentage points.",
    keywords: [
      "Lean Six Sigma",
      "Industrial Engineering",
      "Overall Equipment Effectiveness",
      "SMED",
      "Semiconductor Manufacturing",
    ],
    publishedAt: "2025-08-30T00:00:00.000Z",
    hasManuscript: true,
    hasRespondentData: false,
    downloadUrl: "/sample-docs/sample-manuscript.pdf",
    canDownloadManuscript: true,
    canDownloadRespondentData: false,
    artifact: { available: false, policyResolved: false },
  },
  {
    id: "pub-2025-05",
    title:
      "Mathematical Modeling of Urban Traffic Flow Optimization Along Radial Road 10 and España Boulevard Corridors",
    author: "Jerome A. Tolentino, MSMath",
    program: "Master of Science in Mathematics",
    abstract:
      "This thesis formulated a macroscopic Lighthill-Whitham-Richards (LWR) partial differential equation model coupled with adaptive signal timing constraints for high-density arterial intersections in Manila. Numerical simulations showed a 19.2% reduction in peak-hour queue lengths under coordinated green-wave phase allocation.",
    keywords: [
      "Mathematical Modeling",
      "Traffic Flow Optimization",
      "Partial Differential Equations",
      "Operations Research",
    ],
    publishedAt: "2025-06-15T00:00:00.000Z",
    hasManuscript: true,
    hasRespondentData: false,
    downloadUrl: "/sample-docs/sample-manuscript.pdf",
    canDownloadManuscript: true,
    canDownloadRespondentData: false,
    artifact: { available: false, policyResolved: false },
  },
  {
    id: "pub-2025-06",
    title:
      "Strategic Human Resource Agile Practices and Organizational Commitment in State Universities and Colleges",
    author: "Dr. Maricar S. Navarro, EdD",
    program: "Doctor of Education Major in Educational Management",
    abstract:
      "An investigation of agile human resource development frameworks, faculty mentoring programs, and institutional research productivity across State Universities and Colleges (SUCs) in the National Capital Region. Structural equation modeling confirmed that continuous research capability-building mediates the link between administrative support and faculty retention.",
    keywords: [
      "Educational Management",
      "Human Resource Development",
      "State Universities and Colleges",
      "Research Productivity",
    ],
    publishedAt: "2025-05-04T00:00:00.000Z",
    hasManuscript: true,
    hasRespondentData: false,
    downloadUrl: "/sample-docs/sample-manuscript.pdf",
    canDownloadManuscript: true,
    canDownloadRespondentData: false,
    artifact: { available: false, policyResolved: false },
  },
];

export const MOCK_STUDENT_OVERVIEW = {
  id: "student-eval-01",
  studentNumber: "2025-GS-00142",
  admissionStatus: "ENROLLED",
  enrollmentDate: "2024-08-12T00:00:00.000Z",
  curriculumType: "THESIS_TRACK",
  alignmentStatus: "ALIGNED",
  cellphone: "+63 917 842 5109",
  dateOfBirth: "1996-05-14",
  address: "Sampaloc, Manila, Metro Manila",
  user: {
    id: "student-eval-01",
    firstName: "Juan",
    middleName: "Mercado",
    lastName: "Dela Cruz",
    email: "jmdelacruz.gs@earist.edu.ph",
  },
  program: {
    id: "prog-maed-as",
    programName:
      "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)",
    programType: "MASTERS",
    totalUnits: 36,
  },
  undergraduateProgram: {
    id: "ug-bsed",
    programName: "Bachelor of Secondary Education Major in Mathematics",
  },
  residency: {
    startDate: "2024-08-12",
    maxYears: 5,
    elapsedSemesters: 3,
  },
  compExamRecords: [
    {
      id: "comp-exam-01",
      status: "PASSED",
      recordedAt: "2025-11-18T00:00:00.000Z",
      rating: "Passed (First Take — 88.50%)",
    },
  ],
  adviserAssignment: {
    adviserId: "panelist-eval-01",
    adviserName: "Dr. Maria Clara R. Santos, EdD",
    assignedDate: "2026-02-18T00:00:00.000Z",
  },
  curriculumSummary: {
    requiredUnits: 36,
    earnedUnits: 30,
    inProgressUnits: 6,
    gwa: "1.32",
    courses: [
      {
        code: "EDUC 501",
        title: "Methods of Educational Research",
        category: "Core Courses",
        units: 3,
        grade: "1.25",
        status: "COMPLETED",
        semester: "1st Sem AY 2024–2025",
      },
      {
        code: "EDUC 502",
        title: "Statistical Methods Applied to Education",
        category: "Core Courses",
        units: 3,
        grade: "1.25",
        status: "COMPLETED",
        semester: "1st Sem AY 2024–2025",
      },
      {
        code: "EDUC 503",
        title: "Philosophical & Sociological Foundations of Education",
        category: "Core Courses",
        units: 3,
        grade: "1.50",
        status: "COMPLETED",
        semester: "1st Sem AY 2024–2025",
      },
      {
        code: "EDAS 511",
        title: "Principles and Theory of Educational Administration",
        category: "Major Courses",
        units: 3,
        grade: "1.25",
        status: "COMPLETED",
        semester: "2nd Sem AY 2024–2025",
      },
      {
        code: "EDAS 512",
        title: "Instructional Supervision and Curriculum Leadership",
        category: "Major Courses",
        units: 3,
        grade: "1.25",
        status: "COMPLETED",
        semester: "2nd Sem AY 2024–2025",
      },
      {
        code: "EDAS 513",
        title: "Educational Planning, Policy & Legal Foundations",
        category: "Major Courses",
        units: 3,
        grade: "1.50",
        status: "COMPLETED",
        semester: "2nd Sem AY 2024–2025",
      },
      {
        code: "EDAS 514",
        title: "Public School Finance and Fiscal Management",
        category: "Major Courses",
        units: 3,
        grade: "1.25",
        status: "COMPLETED",
        semester: "2nd Sem AY 2024–2025",
      },
      {
        code: "EDAS 515",
        title: "Human Resource Management in Educational Institutions",
        category: "Major Courses",
        units: 3,
        grade: "1.25",
        status: "COMPLETED",
        semester: "1st Sem AY 2025–2026",
      },
      {
        code: "COGN 521",
        title: "Educational Technology and Digital Learning Systems",
        category: "Cognate Courses",
        units: 3,
        grade: "1.25",
        status: "COMPLETED",
        semester: "1st Sem AY 2025–2026",
      },
      {
        code: "COGN 522",
        title: "Organizational Behavior and Change Management",
        category: "Cognate Courses",
        units: 3,
        grade: "1.50",
        status: "COMPLETED",
        semester: "1st Sem AY 2025–2026",
      },
      {
        code: "THES 601",
        title: "Thesis Writing I (Title & Proposal Defense)",
        category: "Thesis / Research",
        units: 3,
        grade: "IN PROGRESS",
        status: "ENROLLED",
        semester: "2nd Sem AY 2025–2026",
      },
      {
        code: "THES 602",
        title: "Thesis Writing II (Final Defense & Archival)",
        category: "Thesis / Research",
        units: 3,
        grade: "IN PROGRESS",
        status: "ENROLLED",
        semester: "2nd Sem AY 2025–2026",
      },
    ],
  },
};

export const TITLE_SESSION_SUMMARY: DefenseSessionSummary = {
  scheduleId: "sched-title-01",
  defenseType: "TITLE_DEFENSE",
  defenseDate: "2026-02-05",
  defenseTime: "09:00:00",
  venueOrLink: "EARIST Graduate School Defense Room 301",
  sessionStatus: "SCHEDULED",
};

export const PROPOSAL_SESSION_SUMMARY: DefenseSessionSummary = {
  scheduleId: "sched-proposal-01",
  defenseType: "PROPOSAL_DEFENSE",
  defenseDate: "2026-03-24",
  defenseTime: "09:00:00",
  venueOrLink: "EARIST Graduate School Defense Room 302",
  sessionStatus: "SCHEDULED",
};

export const FINAL_SESSION_SUMMARY: DefenseSessionSummary = {
  scheduleId: "sched-final-01",
  defenseType: "FINAL_DEFENSE",
  defenseDate: "2026-04-15",
  defenseTime: "13:30:00",
  venueOrLink: "EARIST Graduate School Audio-Visual Room (AVR)",
  sessionStatus: "SCHEDULED",
};

/**
 * Dynamically builds `StudentThesisJourney` based on active page scenario overrides
 * while keeping all 5 steps navigable and realistic.
 */
export function buildStudentThesisJourney(scenarios: {
  titleDefense: string;
  adviserRequest: string;
  proposalDefense: string;
  strike: string;
  finalDefense: string;
  activePathname?: string;
}): StudentThesisJourney {
  const path = scenarios.activePathname ?? "";

  // Determine Title Defense step view from `title-defense` scenario
  const titleScenario = scenarios.titleDefense;
  const titleStep: StudentThesisJourney["steps"][number] = (() => {
    switch (titleScenario) {
      case "NOT_SUBMITTED":
        return {
          key: "TITLE_DEFENSE",
          label: "Title Defense",
          state: "CURRENT",
          lockReason: null,
          nextAction:
            "Submit your 3 proposed thesis titles, Proposal Package PDF, current COR, and defense-fee receipt.",
          detail: "Ready for Title Defense application submission.",
          defenseStatus: "NOT_SUBMITTED",
          defenseSession: null,
        };
      case "APPLICATION_UNDER_REVIEW":
        return {
          key: "TITLE_DEFENSE",
          label: "Title Defense",
          state: "WAITING",
          lockReason:
            "Your Title Defense application is currently under Graduate School administrative review.",
          nextAction: null,
          detail:
            "Submitted documents are being verified by the Graduate School Office.",
          defenseStatus: "APPLICATION_UNDER_REVIEW",
          defenseSession: null,
        };
      case "SCHEDULED":
        return {
          key: "TITLE_DEFENSE",
          label: "Title Defense",
          state: "WAITING",
          lockReason: "Your Title Defense is scheduled. Prepare to attend.",
          nextAction: "Attend your scheduled Title Defense session.",
          detail: "Scheduled for February 5, 2026 at 9:00 AM.",
          defenseStatus: "SCHEDULED",
          defenseSession: {
            ...TITLE_SESSION_SUMMARY,
            sessionStatus: "SCHEDULED",
          },
        };
      case "REJECTED":
        return {
          key: "TITLE_DEFENSE",
          label: "Title Defense",
          state: "CURRENT",
          lockReason: null,
          nextAction: "Review the administrative remarks and resubmit.",
          detail:
            "Please upload a clearer scan of your Official Defense Fee Receipt (OR #884120) and ensure your COR reflects 2nd Semester AY 2025–2026.",
          defenseStatus: "REJECTED",
          defenseSession: null,
        };
      case "COMPLETED":
      default:
        return {
          key: "TITLE_DEFENSE",
          label: "Title Defense",
          state: "COMPLETED",
          lockReason: null,
          nextAction: null,
          detail: `Approved Title: "${OFFICIAL_APPROVED_TITLE}"`,
          defenseStatus: "COMPLETED",
          defenseSession: {
            ...TITLE_SESSION_SUMMARY,
            sessionStatus: "CONCLUDED",
          },
        };
    }
  })();

  // Determine Adviser Request step view from `adviser-request` scenario
  const advScenario = scenarios.adviserRequest;
  const adviserStep: StudentThesisJourney["steps"][number] = (() => {
    switch (advScenario) {
      case "SELECT_ADVISER":
        return {
          key: "ADVISER_REQUEST",
          label: "Adviser Request",
          state: "CURRENT",
          lockReason: null,
          nextAction:
            "Select an eligible Graduate Faculty member from your Title Defense panel and sign GS Form No. 020.",
          detail:
            "Choose your preferred Thesis Adviser and affix your e-signature.",
          defenseStatus: null,
          defenseSession: null,
        };
      case "PENDING_SIGNATURES":
        return {
          key: "ADVISER_REQUEST",
          label: "Adviser Request",
          state: "WAITING",
          lockReason:
            "Waiting for Adviser CONFORME and Graduate School Dean approval on GS Form No. 020.",
          nextAction: null,
          detail:
            "Requested Adviser: Dr. Maria Clara R. Santos, EdD (CONFORME recorded — awaiting Dean sign-off).",
          defenseStatus: null,
          defenseSession: null,
        };
      case "APPROVED":
      default:
        return {
          key: "ADVISER_REQUEST",
          label: "Adviser Request",
          state: "COMPLETED",
          lockReason: null,
          nextAction: null,
          detail: "Assigned Adviser: Dr. Maria Clara R. Santos, EdD",
          defenseStatus: null,
          defenseSession: null,
        };
    }
  })();

  // Determine Proposal Defense step view
  const propScenario = scenarios.proposalDefense;
  const proposalStep: StudentThesisJourney["steps"][number] = (() => {
    switch (propScenario) {
      case "ADVISER_REVIEW":
        return {
          key: "PROPOSAL_DEFENSE",
          label: "Proposal Defense",
          state: "CURRENT",
          lockReason: null,
          nextAction:
            "Upload your Proposal Manuscript (Chapters 1–3) for Adviser Pre-Defense Certification.",
          detail:
            "Adviser Pre-Defense Certification is required before submitting the Proposal Defense application.",
          defenseStatus: "NOT_SUBMITTED",
          defenseSession: null,
        };
      case "READY_TO_APPLY":
        return {
          key: "PROPOSAL_DEFENSE",
          label: "Proposal Defense",
          state: "CURRENT",
          lockReason: null,
          nextAction:
            "Adviser Certification issued! Upload your current COR and defense-fee receipt to apply for Proposal Defense.",
          detail:
            "Certified by Dr. Maria Clara R. Santos, EdD. Ready for Proposal Defense application.",
          defenseStatus: "NOT_SUBMITTED",
          defenseSession: null,
        };
      case "SCHEDULED":
        return {
          key: "PROPOSAL_DEFENSE",
          label: "Proposal Defense",
          state: "WAITING",
          lockReason:
            "Your Proposal Defense is scheduled for March 24, 2026 at 9:00 AM.",
          nextAction: "Attend your scheduled Proposal Defense.",
          detail:
            "Proposal Defense scheduled at EARIST GS Defense Room 302.",
          defenseStatus: "SCHEDULED",
          defenseSession: {
            ...PROPOSAL_SESSION_SUMMARY,
            sessionStatus: "SCHEDULED",
          },
        };
      case "COMPLETED":
      default:
        return {
          key: "PROPOSAL_DEFENSE",
          label: "Proposal Defense",
          state: "COMPLETED",
          lockReason: null,
          nextAction: null,
          detail: "Proposal Defense Passed — Official RAP Report finalized.",
          defenseStatus: "COMPLETED",
          defenseSession: {
            ...PROPOSAL_SESSION_SUMMARY,
            sessionStatus: "CONCLUDED",
          },
        };
    }
  })();

  // Determine STRIKE step view
  const strikeScenario = scenarios.strike;
  const strikeStep: StudentThesisJourney["steps"][number] = (() => {
    switch (strikeScenario) {
      case "SUBMIT_MANUSCRIPT":
        return {
          key: "STRIKE",
          label: "STRIKE / Plagiarism",
          state: "CURRENT",
          lockReason: null,
          nextAction:
            "Upload your complete manuscript for institutional STRIKE similarity scanning (<15% threshold).",
          detail: "Required before Final Defense endorsement.",
          defenseStatus: null,
          defenseSession: null,
        };
      case "UNDER_VERIFICATION":
        return {
          key: "STRIKE",
          label: "STRIKE / Plagiarism",
          state: "WAITING",
          lockReason:
            "Your manuscript is currently undergoing Turnitin / STRIKE similarity verification.",
          nextAction: null,
          detail: "Submitted on March 26, 2026 — Verification in progress.",
          defenseStatus: null,
          defenseSession: null,
        };
      case "CLEARED":
      default:
        return {
          key: "STRIKE",
          label: "STRIKE / Plagiarism",
          state: "COMPLETED",
          lockReason: null,
          nextAction: null,
          detail:
            "STRIKE Similarity Clearance Issued — 8.4% Overall Similarity Index (Passed).",
          defenseStatus: null,
          defenseSession: null,
        };
    }
  })();

  // Determine Final Defense step view
  const finalScenario = scenarios.finalDefense;
  const finalStep: StudentThesisJourney["steps"][number] = (() => {
    switch (finalScenario) {
      case "FINAL_ADVISER_REVIEW":
        return {
          key: "FINAL_DEFENSE",
          label: "Final Defense",
          state: "CURRENT",
          lockReason: null,
          nextAction:
            "Submit your Final Manuscript (Chapters 1–5) for Final Adviser Pre-Defense Certification.",
          detail: "Awaiting Final Adviser endorsement before application.",
          defenseStatus: "NOT_SUBMITTED",
          defenseSession: null,
        };
      case "READY_TO_APPLY":
        return {
          key: "FINAL_DEFENSE",
          label: "Final Defense",
          state: "CURRENT",
          lockReason: null,
          nextAction:
            "Final Adviser Certification issued! Upload your COR and receipt to file for Final Oral Defense.",
          detail: "Certified by Dr. Maria Clara R. Santos, EdD.",
          defenseStatus: "NOT_SUBMITTED",
          defenseSession: null,
        };
      case "SCHEDULED":
        return {
          key: "FINAL_DEFENSE",
          label: "Final Defense",
          state: "WAITING",
          lockReason:
            "Your Final Oral Defense is scheduled for April 15, 2026 at 1:30 PM.",
          nextAction: "Attend your scheduled Final Oral Defense.",
          detail: "Scheduled at EARIST Graduate School Audio-Visual Room.",
          defenseStatus: "SCHEDULED",
          defenseSession: {
            ...FINAL_SESSION_SUMMARY,
            sessionStatus: "SCHEDULED",
          },
        };
      case "COMPLETED":
      default:
        return {
          key: "FINAL_DEFENSE",
          label: "Final Defense",
          state: "COMPLETED",
          lockReason: null,
          nextAction: null,
          detail:
            "Final Oral Defense Passed — Eligible for Research Databank archival.",
          defenseStatus: "COMPLETED",
          defenseSession: {
            ...FINAL_SESSION_SUMMARY,
            sessionStatus: "CONCLUDED",
          },
        };
    }
  })();

  let currentStep: JourneyStepKey | null = "PROPOSAL_DEFENSE";
  if (path.includes("/title-defense")) currentStep = "TITLE_DEFENSE";
  else if (path.includes("/adviser-request")) currentStep = "ADVISER_REQUEST";
  else if (path.includes("/proposal-defense")) currentStep = "PROPOSAL_DEFENSE";
  else if (path.includes("/strike")) currentStep = "STRIKE";
  else if (path.includes("/final-defense")) currentStep = "FINAL_DEFENSE";

  const adviserRequestObj =
    advScenario === "SELECT_ADVISER"
      ? null
      : advScenario === "PENDING_SIGNATURES"
        ? {
            id: "adv-req-01",
            status: "PENDING",
            adviserStatus: "CONFORMED",
            deanStatus: "PENDING",
            requestedAdviserId: "panelist-eval-01",
            requestedAdviserName: "Dr. Maria Clara R. Santos, EdD",
          }
        : {
            id: "adv-req-01",
            status: "APPROVED",
            adviserStatus: "CONFORMED",
            deanStatus: "APPROVED",
            requestedAdviserId: "panelist-eval-01",
            requestedAdviserName: "Dr. Maria Clara R. Santos, EdD",
          };

  const activeAdviserObj =
    path.includes("/adviser-request") && advScenario !== "APPROVED"
      ? null
      : {
          userId: "panelist-eval-01",
          name: "Dr. Maria Clara R. Santos, EdD",
        };

  return {
    currentStep,
    selectedTitle:
      path.includes("/title-defense") &&
      titleScenario !== "COMPLETED"
        ? null
        : {
            id: "title-opt-01",
            titleText: OFFICIAL_APPROVED_TITLE,
          },
    activeAdviser: activeAdviserObj,
    adviserRequest: adviserRequestObj,
    policy: {
      strikeRequired: true,
    },
    steps: [titleStep, adviserStep, proposalStep, strikeStep, finalStep],
  };
}

export function buildCurrentDefenseApplication(titleScenario: string) {
  return {
    thesisId: "thesis-eval-01",
    stage: "TITLE",
    status:
      titleScenario === "REJECTED"
        ? "REJECTED"
        : titleScenario === "APPLICATION_UNDER_REVIEW"
          ? "PENDING_REVIEW"
          : "APPROVED",
    rejectionReason:
      titleScenario === "REJECTED"
        ? "Please upload a clearer scan of your Official Defense Fee Receipt (OR #884120) and ensure your COR reflects 2nd Semester AY 2025–2026."
        : null,
    evidence: [
      {
        id: "doc-title-pkg-01",
        docType: "TITLE_PROPOSAL",
        defenseStage: "TITLE",
        originalFilename: "DelaCruz_MAEd_Title_Proposal_Package.pdf",
        verifiedMimeType: "application/pdf",
        sizeBytes: 1845200,
        uploadedAt: "2026-01-25T10:15:00.000Z",
        isCurrent: true,
        supersedesDocumentId: null,
      },
      {
        id: "doc-cor-01",
        docType: "COR",
        defenseStage: "TITLE",
        originalFilename: "DelaCruz_COR_2ndSem_AY2025-2026.pdf",
        verifiedMimeType: "application/pdf",
        sizeBytes: 425900,
        uploadedAt: "2026-01-25T10:15:30.000Z",
        isCurrent: true,
        supersedesDocumentId: null,
      },
      {
        id: "doc-receipt-01",
        docType: "RECEIPT",
        defenseStage: "TITLE",
        originalFilename: "DelaCruz_Defense_Fee_Receipt_OR884120.pdf",
        verifiedMimeType: "application/pdf",
        sizeBytes: 312400,
        uploadedAt: "2026-01-25T10:16:00.000Z",
        isCurrent: true,
        supersedesDocumentId: null,
      },
    ],
  };
}

export const MOCK_ADVISER_CANDIDATES_RESPONSE = {
  sourceDefenseScheduleId: "sched-title-01",
  selectedTitle: {
    id: "title-opt-01",
    titleText: OFFICIAL_APPROVED_TITLE,
  },
  student: {
    studentId: "student-eval-01",
    studentName: "Juan M. Dela Cruz",
    studentNumber: "2025-GS-00142",
    programName:
      "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)",
  },
  candidates: [
    {
      userId: "panelist-eval-01",
      name: "Dr. Maria Clara R. Santos, EdD",
      defenseRole: "CHAIRMAN",
      specialization:
        "Educational Leadership, Curriculum Development, & Policy Research",
      officeAffiliation: "EARIST Graduate School — College of Education",
      isExternal: false,
      isAvailableAsAdviser: true,
    },
    {
      userId: "panelist-eval-02",
      name: "Dr. Roberto A. Villanueva, PhD",
      defenseRole: "PANELIST",
      specialization:
        "Educational Supervision, Quantitative Research, & Psychometrics",
      officeAffiliation: "EARIST Graduate School — College of Education",
      isExternal: false,
      isAvailableAsAdviser: true,
    },
    {
      userId: "panelist-eval-03",
      name: "Dr. Teresita M. Reyes, EdD",
      defenseRole: "PANELIST",
      specialization:
        "Instructional Technology, Digital Pedagogy, & School Management",
      officeAffiliation: "EARIST Graduate School — Department of Education",
      isExternal: false,
      isAvailableAsAdviser: true,
    },
    {
      userId: "panelist-eval-04",
      name: "Dr. Emmanuel S. Dizon, PhD",
      defenseRole: "PANELIST",
      specialization: "External Panelist — CHED NCR Quality Assurance",
      officeAffiliation: "Philippine Normal University (External)",
      isExternal: true,
      isAvailableAsAdviser: false,
    },
  ],
};

export const MOCK_ADVISER_REQUEST_RECORDS = [
  {
    id: "adv-req-01",
    studentName: "Juan M. Dela Cruz",
    requestedAdviserName: "Dr. Maria Clara R. Santos, EdD",
    requestDate: "February 12, 2026",
    finalizedAt: "2026-02-18T11:00:00.000Z",
    status: "APPROVED" as const,
    pdfAvailable: true,
  },
];

export function buildProposalAdviserReview(
  proposalScenario: string,
): ProposalAdviserReview {
  const isIssued =
    proposalScenario === "READY_TO_APPLY" ||
    proposalScenario === "SCHEDULED" ||
    proposalScenario === "COMPLETED";

  return {
    thesisId: "thesis-eval-01",
    student: {
      id: "student-eval-01",
      name: "Juan M. Dela Cruz",
      studentNumber: "2025-GS-00142",
    },
    officialTitle: OFFICIAL_APPROVED_TITLE,
    activeAdviser: {
      userId: "panelist-eval-01",
      name: "Dr. Maria Clara R. Santos, EdD",
    },
    reviewStatus: isIssued ? "ISSUED" : "NONE",
    reviewRemarks: isIssued
      ? "Chapters 1 to 3 are well-structured and aligned with the approved research instruments. Cleared and endorsed for Proposal Oral Defense."
      : null,
    manuscript: {
      documentId: "doc-prop-ms-01",
      manuscriptTitle: OFFICIAL_APPROVED_TITLE,
      originalFilename: "DelaCruz_MAEd_Proposal_Manuscript_Ch1-3.pdf",
      uploadedAt: "2026-03-06T09:30:00.000Z",
    },
    certification: isIssued
      ? {
          issued: true,
          adviserName: "Dr. Maria Clara R. Santos, EdD",
          signedAt: "2026-03-08T14:20:00.000Z",
          defenseStage: "PROPOSAL",
        }
      : null,
    isAuthorizedAdviser: true,
  };
}

export function buildFinalAdviserReview(finalScenario: string) {
  const isIssued =
    finalScenario === "READY_TO_APPLY" ||
    finalScenario === "SCHEDULED" ||
    finalScenario === "COMPLETED";

  return {
    thesisId: "thesis-eval-01",
    reviewStatus: isIssued ? ("ISSUED" as const) : ("NONE" as const),
    reviewRemarks: isIssued
      ? "Complete Chapters 1 to 5 incorporate all Proposal Defense recommendations and statistical tables. Endorsed for Final Oral Defense."
      : null,
    manuscript: {
      documentId: "doc-final-ms-01",
      manuscriptTitle: OFFICIAL_APPROVED_TITLE,
      originalFilename: "DelaCruz_MAEd_Final_Manuscript_Ch1-5.pdf",
      uploadedAt: "2026-04-02T11:00:00.000Z",
    },
    certification: isIssued
      ? {
          issued: true,
          adviserName: "Dr. Maria Clara R. Santos, EdD",
          signedAt: "2026-04-04T15:45:00.000Z",
        }
      : null,
    strikeRequired: true,
    strikeEligible: true,
    proposalStageComplete: true,
  };
}

export const MOCK_ADVISER_CERTIFICATION_RECORDS = [
  {
    id: "cert-prop-01",
    thesisId: "thesis-eval-01",
    stage: "PROPOSAL" as const,
    status: "ISSUED" as const,
    studentName: "Juan M. Dela Cruz",
    adviserName: "Dr. Maria Clara R. Santos, EdD",
    issuedAt: "2026-03-08T14:20:00.000Z",
    manuscriptTitle: OFFICIAL_APPROVED_TITLE,
    originalFilename: "DelaCruz_MAEd_Proposal_Manuscript_Ch1-3.pdf",
    manuscriptDocumentId: "doc-prop-ms-01",
    pdfAvailable: true,
    unavailableReason: null,
  },
  {
    id: "cert-final-01",
    thesisId: "thesis-eval-01",
    stage: "FINAL" as const,
    status: "ISSUED" as const,
    studentName: "Juan M. Dela Cruz",
    adviserName: "Dr. Maria Clara R. Santos, EdD",
    issuedAt: "2026-04-04T15:45:00.000Z",
    manuscriptTitle: OFFICIAL_APPROVED_TITLE,
    originalFilename: "DelaCruz_MAEd_Final_Manuscript_Ch1-5.pdf",
    manuscriptDocumentId: "doc-final-ms-01",
    pdfAvailable: true,
    unavailableReason: null,
  },
];

export function buildStudentRapAccess(scheduleId: string) {
  const isTitle = scheduleId.includes("title");
  const isFinal = scheduleId.includes("final");
  const defenseType = isTitle
    ? "TITLE_DEFENSE"
    : isFinal
      ? "FINAL_DEFENSE"
      : "PROPOSAL_DEFENSE";

  return {
    scheduleId,
    defenseType,
    formalOutcome: "PASSED",
    rapStatus: "FINALIZED",
    finalizedAt: isTitle
      ? "2026-02-05T16:45:00.000Z"
      : isFinal
        ? "2026-04-15T17:30:00.000Z"
        : "2026-03-24T15:00:00.000Z",
    officialContent: {
      selectedTitle: OFFICIAL_APPROVED_TITLE,
      decisionsAndRecommendations: isTitle
        ? "1. The Defense Committee unanimously approves Topic #1: 'Data-Driven Instructional Supervision and Digital Readiness of Public Secondary School Heads in the Division of Manila'.\n2. Focus the respondent scope on the 32 public secondary schools in the Division of Manila.\n3. Proceed to GS Form No. 020 Thesis Adviser Request."
        : isFinal
          ? "1. The candidate successfully defended the Final Manuscript (Chapters 1–5) with an overall institutional matrix rating of 1.25 (High Distinction / Passed).\n2. Incorporate minor formatting refinements on Table 14 (Regression Summary) and Appendix C (Supervisory Toolkit).\n3. Cleared for final binding and submission to the Controlled Research Databank (DL-9)."
          : "1. The Proposal Manuscript (Chapters 1–3) is approved for data gathering.\n2. Secure formal Division Office permit from DepEd Manila prior to survey administration.\n3. Include Cronbach's alpha reliability pilot results in Chapter 3 before proceeding to STRIKE clearance.",
      venue: isFinal
        ? "EARIST Graduate School Audio-Visual Room (AVR)"
        : "EARIST Graduate School Defense Room 301",
      reportDate: isTitle
        ? "February 5, 2026"
        : isFinal
          ? "April 15, 2026"
          : "March 24, 2026",
      signatories: [
        {
          name: "Dr. Maria Clara R. Santos, EdD",
          roleAtDefense: "CHAIRMAN",
          isSigned: true,
          signedAt: "2026-03-24T14:30:00.000Z",
        },
        {
          name: "Dr. Roberto A. Villanueva, PhD",
          roleAtDefense: "PANELIST",
          isSigned: true,
          signedAt: "2026-03-24T14:40:00.000Z",
        },
        {
          name: "Dr. Teresita M. Reyes, EdD",
          roleAtDefense: "RAPPORTEUR",
          isSigned: true,
          signedAt: "2026-03-24T14:45:00.000Z",
        },
      ],
    },
    message:
      "The official Report of Action Taken (RAP) has been finalized and signed by the Defense Committee.",
  };
}

export function buildDatabankArchiveContext(repoScenario: string) {
  if (repoScenario === "INELIGIBLE") {
    return {
      eligible: false,
      reasons: ["FINAL_DEFENSE_NOT_PASSED", "FINAL_RAP_NOT_FINALIZED"],
      researchContext: null,
      archive: null,
      artifactPolicy: { archivalArtifactLinked: false, policyResolved: false },
    };
  }

  return {
    eligible: true,
    reasons: [],
    researchContext: {
      thesisId: "thesis-eval-01",
      officialTitle: OFFICIAL_APPROVED_TITLE,
      finalDefenseConcludedAt: "2026-04-15T16:30:00.000Z",
      finalRapFinalizedAt: "2026-04-15T17:30:00.000Z",
    },
    archive:
      repoScenario === "SUBMITTED_ARCHIVE"
        ? {
            id: "archive-eval-01",
            officialTitle: OFFICIAL_APPROVED_TITLE,
            abstract:
              "This study assessed the extent of data-driven instructional supervision and digital readiness among public secondary school heads in the Division of Manila during Academic Year 2025–2026. Employing a descriptive-correlational and developmental research design across 32 public secondary schools involving 32 principals and 340 master teachers, the study examined five domains of supervisory analytics and four dimensions of digital readiness. Findings indicated a high level of digital readiness (M = 4.18, SD = 0.42) and a significant positive relationship (r = 0.78, p < 0.001) between data-informed classroom observation feedback and instructional quality. Based on the empirical findings, a Data-Driven Instructional Supervision Guidebook was developed and validated by education specialists.",
            keywords:
              "Instructional Supervision, Digital Readiness, School Heads, Division of Manila, Educational Administration",
            registeredAt: "2026-04-18T10:00:00.000Z",
            hasManuscript: true,
            hasRespondentData: true,
          }
        : null,
    artifactPolicy: { archivalArtifactLinked: true, policyResolved: true },
  };
}

export const MOCK_PANELIST_DASHBOARD: PanelistDashboard = {
  kpis: {
    upcomingDefenses: 4,
    pendingTasks: 5,
  },
  needsAttention: [
    {
      id: "attn-01",
      category: "EVALUATION",
      title: "Live Oral Defense Evaluation & Verdict",
      studentName: "Juan M. Dela Cruz",
      scheduleId: "sched-title-01",
      stage: "Proposal Defense",
      responsibility: "Committee Chairperson",
      statusText: "Session in progress — Rubric & RAP open",
      date: "2026-03-24",
      actionLabel: "Open Defense Workspace",
      href: "/panelist/defense-workspace/sched-title-01",
      priority: 1,
    },
    {
      id: "attn-02",
      category: "ADVISER_REQUEST",
      title: "GS-020 Adviser Request Awaiting CONFORME",
      studentName: "Catherine L. Mendoza",
      scheduleId: null,
      stage: "Adviser Request",
      responsibility: "Requested Thesis Adviser",
      statusText: "Awaiting your CONFORME response",
      date: "2026-03-07",
      actionLabel: "Review Request",
      href: "/panelist/advisees",
      priority: 1,
    },
    {
      id: "attn-03",
      category: "ADVISER_MANUSCRIPT_REVIEW",
      title: "Pre-Defense Manuscript Endorsement",
      studentName: "Mark Anthony P. Villanueva",
      scheduleId: null,
      stage: "Proposal Defense",
      responsibility: "Thesis Adviser",
      statusText: "Manuscript uploaded — awaiting certification",
      date: "2026-03-09",
      actionLabel: "Review Manuscript",
      href: "/panelist/advisees/student-adv-01",
      priority: 2,
    },
    {
      id: "attn-04",
      category: "RAP_SIGNATURE",
      title: "Committee RAP Report Ready for Signature",
      studentName: "Paolo R. Evangelista",
      scheduleId: "sched-final-02",
      stage: "Final Defense",
      responsibility: "Panel Member",
      statusText: "Frozen by Rapporteur — awaiting your e-signature",
      date: "2026-03-05",
      actionLabel: "Sign RAP Report",
      href: "/panelist/signatures",
      priority: 2,
    },
  ],
  activeDefenses: [
    {
      scheduleId: "sched-title-01",
      studentName: "Juan M. Dela Cruz",
      studentNumber: "2025-GS-00142",
      programName:
        "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)",
      defenseType: "PROPOSAL_DEFENSE",
      stageLabel: "Proposal Defense",
      sessionStatusLabel: "In Progress",
      roleLabel: "Chairman",
      href: "/panelist/defense-workspace/sched-title-01",
    },
  ],
  upcomingDefenses: [
    {
      scheduleId: "sched-proposal-01",
      studentName: "Mark Anthony P. Villanueva",
      studentNumber: "2025-GS-00188",
      programName: "Master of Arts in Education Major in Educational Management",
      defenseType: "PROPOSAL_DEFENSE",
      stageLabel: "Proposal Defense",
      defenseDate: "2026-03-28",
      defenseTime: "10:00:00",
      venueOrLink: "EARIST GS Defense Room 302",
      roleLabel: "Adviser",
      sessionStatusLabel: "Scheduled",
      href: "/panelist/defense-workspace/sched-proposal-01",
    },
    {
      scheduleId: "sched-final-01",
      studentName: "Engr. Clarissa T. Soriano",
      studentNumber: "2024-GS-00094",
      programName: "Master of Science in Computer Science (MSCS)",
      defenseType: "FINAL_DEFENSE",
      stageLabel: "Final Defense",
      defenseDate: "2026-04-02",
      defenseTime: "13:30:00",
      venueOrLink: "EARIST Graduate School AVR",
      roleLabel: "Panelist",
      sessionStatusLabel: "Scheduled",
      href: "/panelist/defense-workspace/sched-final-01",
    },
  ],
  waitingOnOthers: [
    {
      id: "wait-01",
      studentName: "Catherine L. Mendoza",
      studentNumber: "2025-GS-00210",
      recordLabel: "Title Defense RAP Report",
      requirement: "Remaining Panel Member Signature",
      responsibleRole: "Dr. Roberto A. Villanueva",
      statusText: "2 of 3 signatures completed",
      date: "2026-03-10",
      href: "/panelist/defense-workspace/sched-title-01",
    },
  ],
};

export const MOCK_PANELIST_ASSIGNMENTS: PanelistAssignmentData[] = [
  {
    id: "assign-01",
    role: "CHAIRMAN",
    evaluationStatus: "DRAFT",
    schedule: {
      id: "sched-title-01",
      defenseDate: "2026-03-24",
      defenseTime: "09:00:00",
      venueOrLink: "EARIST Graduate School Defense Room 301",
      defenseType: "PROPOSAL_DEFENSE",
      sessionStatus: "IN_PROGRESS",
      status: "IN_PROGRESS",
      thesis: {
        student: {
          programId: "prog-maed-as",
          studentNumber: "2025-GS-00142",
          program: {
            programName:
              "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)",
          },
          user: {
            firstName: "Juan",
            lastName: "Dela Cruz",
          },
        },
        thesisDocuments: [
          {
            id: "doc-prop-ms-01",
            docType: "PROPOSAL_MANUSCRIPT",
            filePath: "/sample-docs/sample-manuscript.pdf",
            uploadedAt: "2026-03-06T09:30:00.000Z",
          },
        ],
      },
    },
  },
  {
    id: "assign-02",
    role: "RAPPORTEUR",
    evaluationStatus: "NOT_STARTED",
    schedule: {
      id: "sched-proposal-01",
      defenseDate: "2026-03-28",
      defenseTime: "10:00:00",
      venueOrLink: "EARIST Graduate School Defense Room 302",
      defenseType: "TITLE_DEFENSE",
      sessionStatus: "SCHEDULED",
      status: "SCHEDULED",
      thesis: {
        student: {
          programId: "prog-maed-em",
          studentNumber: "2025-GS-00188",
          program: {
            programName:
              "Master of Arts in Education Major in Educational Management",
          },
          user: {
            firstName: "Mark Anthony",
            lastName: "Villanueva",
          },
        },
        thesisDocuments: [
          {
            id: "doc-title-pkg-02",
            docType: "TITLE_PROPOSAL",
            filePath: "/sample-docs/sample-manuscript.pdf",
            uploadedAt: "2026-03-10T11:00:00.000Z",
          },
        ],
      },
    },
  },
  {
    id: "assign-03",
    role: "CHAIRMAN",
    evaluationStatus: "FINALIZED",
    schedule: {
      id: "sched-final-01",
      defenseDate: "2026-03-18",
      defenseTime: "13:30:00",
      venueOrLink: "EARIST Graduate School Audio-Visual Room (AVR)",
      defenseType: "FINAL_DEFENSE",
      sessionStatus: "AWAITING_CONCLUSION",
      status: "AWAITING_CONCLUSION",
      thesis: {
        student: {
          programId: "prog-dpa",
          studentNumber: "2024-GS-00051",
          program: {
            programName: "Doctor of Public Administration (DPA)",
          },
          user: {
            firstName: "Paolo",
            lastName: "Evangelista",
          },
        },
        thesisDocuments: [
          {
            id: "doc-final-ms-02",
            docType: "FINAL_MANUSCRIPT",
            filePath: "/sample-docs/sample-manuscript.pdf",
            uploadedAt: "2026-03-01T08:00:00.000Z",
          },
        ],
      },
    },
  },
  {
    id: "assign-04",
    role: "PANELIST",
    evaluationStatus: "FINALIZED",
    schedule: {
      id: "sched-final-02",
      defenseDate: "2026-02-20",
      defenseTime: "14:00:00",
      venueOrLink: "EARIST Graduate School Defense Room 301",
      defenseType: "FINAL_DEFENSE",
      sessionStatus: "CONCLUDED",
      status: "CONCLUDED",
      thesis: {
        student: {
          programId: "prog-mscs",
          studentNumber: "2024-GS-00094",
          program: {
            programName: "Master of Science in Computer Science (MSCS)",
          },
          user: {
            firstName: "Clarissa",
            lastName: "Soriano",
          },
        },
        thesisDocuments: [
          {
            id: "doc-final-ms-03",
            docType: "FINAL_MANUSCRIPT",
            filePath: "/sample-docs/sample-manuscript.pdf",
            uploadedAt: "2026-02-10T09:00:00.000Z",
          },
        ],
      },
    },
  },
];

export function buildDefenseWorkspace(
  scheduleId: string,
  workspaceScenario: string,
): DefenseWorkspace {
  const isConcluded =
    workspaceScenario === "CONCLUDED_READONLY" ||
    scheduleId === "sched-final-02";
  const isRapporteurMode = workspaceScenario === "PANELIST_ACTIVE";
  const role = isRapporteurMode ? "RAPPORTEUR" : "CHAIRMAN";

  const studentMap: Record<
    string,
    { id: string; studentNumber: string; name: string; program: string; defenseType: string }
  > = {
    "sched-title-01": {
      id: "student-eval-01",
      studentNumber: "2025-GS-00142",
      name: "Juan M. Dela Cruz",
      program:
        "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)",
      defenseType: "PROPOSAL_DEFENSE",
    },
    "sched-proposal-01": {
      id: "student-adv-01",
      studentNumber: "2025-GS-00188",
      name: "Mark Anthony P. Villanueva",
      program: "Master of Arts in Education Major in Educational Management",
      defenseType: "TITLE_DEFENSE",
    },
    "sched-final-01": {
      id: "student-adv-02",
      studentNumber: "2024-GS-00051",
      name: "Paolo R. Evangelista",
      program: "Doctor of Public Administration (DPA)",
      defenseType: "FINAL_DEFENSE",
    },
    "sched-final-02": {
      id: "student-adv-03",
      studentNumber: "2024-GS-00094",
      name: "Engr. Clarissa T. Soriano",
      program: "Master of Science in Computer Science (MSCS)",
      defenseType: "FINAL_DEFENSE",
    },
  };

  const info = studentMap[scheduleId] ?? studentMap["sched-title-01"];

  return {
    schedule: {
      id: scheduleId,
      defenseType: info.defenseType,
      sessionStatus: isConcluded ? "CONCLUDED" : "IN_PROGRESS",
      defenseDate: "2026-03-24",
      defenseTime: "09:00:00",
      venueOrLink: "EARIST Graduate School Defense Room 301",
    },
    student: {
      id: info.id,
      studentNumber: info.studentNumber,
      name: info.name,
      program: info.program,
    },
    myAssignment: {
      panelAssignmentId: "assign-01",
      role,
    },
    capabilities: {
      canEvaluate: true,
      evaluationOpen: !isConcluded,
      canEditRapporteurNotes: !isConcluded,
      canViewTitleDeliberation: true,
      canViewTitleChairmanResult: true,
      canFinalizeRapporteurNotes: !isConcluded,
      canRecordFormalResult: role === "CHAIRMAN" && !isConcluded,
      canViewFinalizedRapporteurNotes: true,
      canStartDefense: role === "CHAIRMAN" && !isConcluded,
    },
    documents: [
      {
        id: "doc-prop-ms-01",
        docType: "PROPOSAL_MANUSCRIPT",
        defenseStage: "PROPOSAL",
        uploadedAt: "2026-03-06T09:30:00.000Z",
        displayName: `${info.name} — Defense Manuscript (PDF)`,
      },
    ],
    proposedTitles: PROPOSED_TITLES.map(({ id, titleText }) => ({
      id,
      titleText,
    })),
    roster: [
      {
        userId: "panelist-eval-01",
        name: "Dr. Maria Clara R. Santos, EdD",
        role: isRapporteurMode ? "RAPPORTEUR" : "CHAIRMAN",
        evaluationStatus: isConcluded ? "FINALIZED" : "DRAFT",
      },
      {
        userId: "panelist-eval-02",
        name: "Dr. Roberto A. Villanueva, PhD",
        role: "PANELIST",
        evaluationStatus: "FINALIZED",
      },
      {
        userId: "panelist-eval-03",
        name: "Dr. Teresita M. Reyes, EdD",
        role: isRapporteurMode ? "CHAIRMAN" : "RAPPORTEUR",
        evaluationStatus: "FINALIZED",
      },
    ],
    rapporteurDraft: {
      notes:
        "1. Strengthen the operational definition of data-driven instructional supervision in Chapter 1.\n2. Include reliability validation tables (Cronbach's alpha >= 0.85) in Chapter 3.\n3. Ensure DepEd Division of Manila research ethics clearance is attached in Appendix B.",
    },
    rapporteurNotesFinalizedAt: isConcluded
      ? "2026-03-24T11:30:00.000Z"
      : null,
    evaluationStatus: isConcluded ? "FINALIZED" : "DRAFT",
    sessionStatus: isConcluded ? "CONCLUDED" : "IN_PROGRESS",
    conclusionsPresent: isConcluded,
    evaluationProgress: {
      evaluatorAssignments: 3,
      finalizedEvaluations: isConcluded ? 3 : 2,
    },
    formalResult: isConcluded ? "PASSED" : null,
    rapStatus: isConcluded ? "FINALIZED" : "FOR_SIGNATURE",
  };
}

export function buildOralEvaluation(
  scheduleId: string,
  workspaceScenario: string,
): OralEvaluation {
  const isConcluded = workspaceScenario === "CONCLUDED_READONLY";
  return {
    scheduleId,
    defenseType: "PROPOSAL_DEFENSE",
    panelAssignmentId: "assign-01",
    assignmentRole:
      workspaceScenario === "PANELIST_ACTIVE" ? "RAPPORTEUR" : "CHAIRMAN",
    status: isConcluded ? "FINALIZED" : "DRAFT",
    criteria: {
      topic_clarity: 1.25,
      literature_depth: 1.25,
      methodology_rigor: 1.5,
      organization_format: 1.25,
      oral_presentation: 1.25,
      ability_to_answer: 1.25,
      mastery_of_subject: 1.25,
      openness_to_suggestions: 1.0,
    },
    groupIValue: 1.31,
    groupIIValue: 1.19,
    overallValue: 1.25,
    scoringVersion: "INSTITUTIONAL_MATRIX_V2",
    rating: "1.25 — Very Satisfactory / Passed",
    recommendations:
      "The candidate demonstrated strong command of the theoretical framework and statistical methodology. Incorporate the committee's refinement on the stratified random sampling table across the 32 public secondary schools in Manila.",
    signedAt: isConcluded ? "2026-03-24T11:15:00.000Z" : null,
    finalizedAt: isConcluded ? "2026-03-24T11:15:00.000Z" : null,
    updatedAt: "2026-03-24T10:30:00.000Z",
    isLocked: isConcluded,
  };
}

export const INITIAL_ANNOTATIONS: CollaborationAnnotation[] = [
  {
    id: "annot-eval-01",
    scheduleId: "sched-title-01",
    thesisDocumentId: "doc-prop-ms-01",
    pageNumber: 1,
    selectedText:
      "Data-Driven Instructional Supervision and Digital Readiness of Public Secondary School Heads",
    anchor: {
      anchorVersion: 1,
      pageNumber: 1,
      rects: [{ x: 0.12, y: 0.22, width: 0.76, height: 0.045 }],
      selectedText:
        "Data-Driven Instructional Supervision and Digital Readiness of Public Secondary School Heads",
      prefix: "",
      suffix: "",
    },
    author: {
      assignmentId: "assign-01",
      userId: "panelist-eval-01",
      name: "Dr. Maria Clara R. Santos, EdD",
      role: "CHAIRMAN",
    },
    createdAt: "2026-03-24T09:20:00.000Z",
    updatedAt: "2026-03-24T09:20:00.000Z",
    comments: [
      {
        id: "comment-eval-01",
        annotationId: "annot-eval-01",
        parentCommentId: null,
        body: "Specify the Academic Year (AY 2025–2026) in the scope and delimitation paragraph on Page 1 so the timeframe is explicit.",
        author: {
          assignmentId: "assign-01",
          userId: "panelist-eval-01",
          name: "Dr. Maria Clara R. Santos, EdD",
          role: "CHAIRMAN",
        },
        createdAt: "2026-03-24T09:20:00.000Z",
        updatedAt: "2026-03-24T09:20:00.000Z",
      },
    ],
  },
  {
    id: "annot-eval-02",
    scheduleId: "sched-title-01",
    thesisDocumentId: "doc-prop-ms-01",
    pageNumber: 2,
    selectedText:
      "stratified proportional sampling of 340 master teachers and head teachers",
    anchor: {
      anchorVersion: 1,
      pageNumber: 2,
      rects: [{ x: 0.14, y: 0.45, width: 0.72, height: 0.038 }],
      selectedText:
        "stratified proportional sampling of 340 master teachers and head teachers",
      prefix: "",
      suffix: "",
    },
    author: {
      assignmentId: "assign-02",
      userId: "panelist-eval-02",
      name: "Dr. Roberto A. Villanueva, PhD",
      role: "PANELIST",
    },
    createdAt: "2026-03-24T09:32:00.000Z",
    updatedAt: "2026-03-24T09:35:00.000Z",
    comments: [
      {
        id: "comment-eval-02",
        annotationId: "annot-eval-02",
        parentCommentId: null,
        body: "Please include the Cochran / Slovin computation breakdown per congressional district in Table 2.",
        author: {
          assignmentId: "assign-02",
          userId: "panelist-eval-02",
          name: "Dr. Roberto A. Villanueva, PhD",
          role: "PANELIST",
        },
        createdAt: "2026-03-24T09:32:00.000Z",
        updatedAt: "2026-03-24T09:32:00.000Z",
      },
      {
        id: "comment-eval-03",
        annotationId: "annot-eval-02",
        parentCommentId: "comment-eval-02",
        body: "Agreed — this will also strengthen the multiple regression assumptions in Chapter 3.",
        author: {
          assignmentId: "assign-03",
          userId: "panelist-eval-03",
          name: "Dr. Teresita M. Reyes, EdD",
          role: "RAPPORTEUR",
        },
        createdAt: "2026-03-24T09:35:00.000Z",
        updatedAt: "2026-03-24T09:35:00.000Z",
      },
    ],
  },
];

export function buildCommitteeReport(
  scheduleId: string,
  workspaceScenario: string,
) {
  const isConcluded = workspaceScenario === "CONCLUDED_READONLY";
  const isRapporteur = workspaceScenario === "PANELIST_ACTIVE";

  return {
    scheduleId,
    defenseType: "PROPOSAL_DEFENSE",
    sessionStatus: isConcluded ? "CONCLUDED" : "IN_PROGRESS",
    reportId: "rap-eval-01",
    studentName: "Juan M. Dela Cruz",
    studentNumber: "2025-GS-00142",
    program:
      "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)",
    defenseDate: "2026-03-24T09:00:00.000Z",
    reportDate: "2026-03-24T11:00:00.000Z",
    venue: "EARIST Graduate School Defense Room 301",
    reportStatus: isConcluded
      ? "FINALIZED"
      : isRapporteur
        ? "DRAFT"
        : "FOR_SIGNATURE",
    bodyVersion: 3,
    body: {
      version: 1 as const,
      blocks: [
        {
          type: "heading" as const,
          level: 2 as const,
          align: "left" as const,
          indent: 0,
          children: [
            {
              text: "I. Summary of Committee Findings & Deliberation",
              bold: true,
            },
          ],
        },
        {
          type: "paragraph" as const,
          align: "left" as const,
          indent: 0,
          children: [
            {
              text: "The candidate, Mr. Juan M. Dela Cruz (MAEd-AS), presented the research proposal titled \"Data-Driven Instructional Supervision and Digital Readiness of Public Secondary School Heads in the Division of Manila\". The Oral Examination Committee found the conceptual model grounded in current DepEd supervisory standards and educational administration literature.",
            },
          ],
        },
        {
          type: "heading" as const,
          level: 2 as const,
          align: "left" as const,
          indent: 0,
          children: [
            {
              text: "II. Required Revisions and Action Items",
              bold: true,
            },
          ],
        },
        {
          type: "bulletList" as const,
          items: [
            [
              {
                text: "Include the stratified proportional sampling distribution across all six (6) legislative districts of Manila in Table 2 (Chapter 3).",
              },
            ],
            [
              {
                text: "Append the content validity index (CVI) evaluation sheet signed by five (5) educational administration experts in Appendix D.",
              },
            ],
            [
              {
                text: "Ensure ethical informed consent clauses explicitly cite the Data Privacy Act of 2012 (RA 10173) prior to questionnaire distribution.",
              },
            ],
          ],
        },
      ],
    },
    hasCollaborativeBody: true,
    legacyContent: {
      decisionsAndRecommendations:
        "1. Include the stratified proportional sampling distribution across all six districts of Manila.\n2. Append the content validity index (CVI) sheet in Appendix D.\n3. Proceed to data gathering upon Adviser verification of minor revisions.",
      rapporteurNotes: null,
    },
    freeze: {
      frozenAt: isRapporteur ? null : "2026-03-24T10:50:00.000Z",
    },
    canEditBody: isRapporteur && !isConcluded,
    canFreeze: isRapporteur && !isConcluded,
    signatures: [
      {
        userId: "panelist-eval-01",
        name: "Dr. Maria Clara R. Santos, EdD",
        roleAtDefense: "CHAIRMAN",
        isSigned: isConcluded,
        signedAt: isConcluded ? "2026-03-24T11:20:00.000Z" : null,
      },
      {
        userId: "panelist-eval-02",
        name: "Dr. Roberto A. Villanueva, PhD",
        roleAtDefense: "PANELIST",
        isSigned: true,
        signedAt: "2026-03-24T11:05:00.000Z",
      },
      {
        userId: "panelist-eval-03",
        name: "Dr. Teresita M. Reyes, EdD",
        roleAtDefense: "RAPPORTEUR",
        isSigned: true,
        signedAt: "2026-03-24T10:55:00.000Z",
      },
    ],
    signatureProgress: {
      required: 3,
      signed: isConcluded ? 3 : 2,
    },
    mySignature: {
      userId: "panelist-eval-01",
      name: "Dr. Maria Clara R. Santos, EdD",
      roleAtDefense: isRapporteur ? "RAPPORTEUR" : "CHAIRMAN",
      isSigned: isConcluded,
      signedAt: isConcluded ? "2026-03-24T11:20:00.000Z" : null,
    },
    canSign: !isConcluded && !isRapporteur,
  };
}

export function buildConclusionReadiness(
  scheduleId: string,
  workspaceScenario: string,
) {
  const isConcluded = workspaceScenario === "CONCLUDED_READONLY";
  const isChairman = workspaceScenario !== "PANELIST_ACTIVE";
  return {
    scheduleId,
    isChairman,
    concluded: isConcluded,
    evaluatorAssignments: 3,
    finalizedEvaluations: 3,
    allEvaluationsFinalized: true,
    oralSummaryExists: true,
    reportExists: true,
    reportFrozen: true,
    reportFinalized: true,
    requiredSignatures: 3,
    signedSignatures: 3,
    allSignaturesSigned: true,
    blockers: [],
    readyForConclusion: true,
  };
}

export function buildDefenseHistory(scheduleId: string): DefenseHistory {
  return {
    scheduleId,
    defenseType: "PROPOSAL_DEFENSE",
    items: [
      {
        scheduleId: "sched-title-hist-01",
        defenseType: "TITLE_DEFENSE",
        stage: "TITLE",
        relationship: "PREVIOUS_STAGE",
        defenseDate: "2026-02-05",
        defenseTime: "09:00:00",
        venueOrLink: "EARIST Graduate School Defense Room 301",
        sessionStatus: "CONCLUDED",
        verdict: "PASSED",
        concludedAt: "2026-02-05T11:30:00.000Z",
        manuscript: {
          id: "doc-title-pkg-01",
          docType: "TITLE_PROPOSAL",
          defenseStage: "TITLE",
          displayName: "DelaCruz_MAEd_Title_Proposal_Package.pdf",
          uploadedAt: "2026-01-25T10:15:00.000Z",
        },
        reportAvailable: true,
        reportSource: "STRUCTURED_RAP",
        annotationCount: 2,
        commentCount: 3,
        committee: [
          {
            userId: "panelist-eval-01",
            name: "Dr. Maria Clara R. Santos, EdD",
            role: "CHAIRMAN",
          },
          {
            userId: "panelist-eval-02",
            name: "Dr. Roberto A. Villanueva, PhD",
            role: "PANELIST",
          },
          {
            userId: "panelist-eval-03",
            name: "Dr. Teresita M. Reyes, EdD",
            role: "RAPPORTEUR",
          },
        ],
      },
    ],
  };
}

export function buildDefenseHistoryAttempt(
  scheduleId: string,
  historicalScheduleId: string,
): DefenseHistoryAttemptDetail {
  const base = buildDefenseHistory(scheduleId).items[0];
  return {
    ...base,
    scheduleId: historicalScheduleId || base.scheduleId,
    report: {
      source: "STRUCTURED_RAP",
      rapId: "rap-hist-01",
      status: "FINALIZED",
      finalizedAt: "2026-02-05T16:45:00.000Z",
      rapporteurNotesFinalizedAt: "2026-02-05T11:20:00.000Z",
      bodyDocument: null,
      text: "The Defense Committee unanimously approved Title #1: 'Data-Driven Instructional Supervision and Digital Readiness of Public Secondary School Heads in the Division of Manila'. The candidate is advised to focus on the 32 public secondary schools in Manila and proceed to Adviser selection.",
      contentVersion: 1,
      signatureProgress: { required: 3, signed: 3 },
    },
    annotations: INITIAL_ANNOTATIONS,
  };
}

export function buildAdviserWorkspace(
  adviseesScenario: string,
): AdviserWorkspaceDto {
  const isChangesRequested = adviseesScenario === "MANUSCRIPT_REVIEW";

  return {
    activeAdvisees: [
      {
        assignmentId: "adv-assign-01",
        assignedDate: "2026-02-18T00:00:00.000Z",
        student: {
          id: "student-eval-01",
          name: "Juan M. Dela Cruz",
          studentNumber: "2025-GS-00142",
          program:
            "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)",
        },
        research: {
          thesisId: "thesis-eval-01",
          currentStage: "PROPOSAL",
          currentStatus: "SCHEDULED",
          workingTitle: OFFICIAL_APPROVED_TITLE,
        },
        review: {
          hasOpenTask: true,
          stages: ["PROPOSAL"],
        },
      },
      {
        assignmentId: "adv-assign-02",
        assignedDate: "2026-01-15T00:00:00.000Z",
        student: {
          id: "student-adv-01",
          name: "Mark Anthony P. Villanueva",
          studentNumber: "2025-GS-00188",
          program:
            "Master of Arts in Education Major in Educational Management",
        },
        research: {
          thesisId: "thesis-eval-02",
          currentStage: "PROPOSAL",
          currentStatus: "AWAITING_ADVISER_REVIEW",
          workingTitle:
            "School Disaster Preparedness and Instructional Continuity Management in Public Elementary Schools",
        },
        review: {
          hasOpenTask: true,
          stages: ["PROPOSAL"],
        },
      },
      {
        assignmentId: "adv-assign-03",
        assignedDate: "2025-09-10T00:00:00.000Z",
        student: {
          id: "student-adv-02",
          name: "Paolo R. Evangelista",
          studentNumber: "2024-GS-00051",
          program: "Doctor of Public Administration (DPA)",
        },
        research: {
          thesisId: "thesis-eval-03",
          currentStage: "FINAL",
          currentStatus: "IN_PROGRESS",
          workingTitle:
            "Digital Fiscal Transparency and Citizen Trust in Local Government Units of Metro Manila",
        },
        review: {
          hasOpenTask: true,
          stages: ["FINAL"],
        },
      },
    ],
    incomingRequests: [
      {
        id: "req-incoming-01",
        student: {
          id: "student-req-01",
          name: "Catherine L. Mendoza",
          studentNumber: "2025-GS-00210",
          program:
            "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)",
        },
        officialTitle:
          "Transformational Leadership of School Principals and Teacher Retention in Public High Schools",
        sourceDefenseScheduleId: "sched-title-09",
        titleDefenseRole: "CHAIRMAN",
        reason:
          "Dr. Santos served as Committee Chairperson during my Title Defense and her expertise in educational leadership directly aligns with my approved thesis topic.",
        requestDate: "2026-03-07T10:00:00.000Z",
        status: "PENDING",
        adviserStatus: isChangesRequested ? "CONFORMED" : "PENDING",
        adviserRespondedAt: isChangesRequested
          ? "2026-03-08T09:00:00.000Z"
          : null,
        adviserRemarks: isChangesRequested
          ? "I accept to serve as Thesis Adviser for Ms. Mendoza."
          : null,
        deanStatus: "PENDING",
        deanReviewedAt: null,
        deanRemarks: null,
      },
    ],
    reviewTasks: [
      {
        stage: "PROPOSAL",
        thesisId: "thesis-eval-01",
        student: {
          id: "student-eval-01",
          name: "Juan M. Dela Cruz",
          studentNumber: "2025-GS-00142",
        },
        officialTitle: OFFICIAL_APPROVED_TITLE,
        reviewStatus: isChangesRequested
          ? "CHANGES_REQUESTED"
          : "AWAITING_REVIEW",
        reviewRemarks: isChangesRequested
          ? "Please include the validation matrix in Chapter 3 before I issue the pre-defense certification."
          : null,
        manuscriptDocumentId: "doc-prop-ms-01",
        manuscriptTitle: OFFICIAL_APPROVED_TITLE,
        originalFilename: "DelaCruz_MAEd_Proposal_Manuscript_Ch1-3.pdf",
        manuscriptUploadedAt: "2026-03-06T09:30:00.000Z",
      },
      {
        stage: "PROPOSAL",
        thesisId: "thesis-eval-02",
        student: {
          id: "student-adv-01",
          name: "Mark Anthony P. Villanueva",
          studentNumber: "2025-GS-00188",
        },
        officialTitle:
          "School Disaster Preparedness and Instructional Continuity Management in Public Elementary Schools",
        reviewStatus: "AWAITING_REVIEW",
        reviewRemarks: null,
        manuscriptDocumentId: "doc-prop-ms-02",
        manuscriptTitle:
          "School Disaster Preparedness and Instructional Continuity Management in Public Elementary Schools",
        originalFilename: "Villanueva_MAEd_Proposal_Manuscript_Ch1-3.pdf",
        manuscriptUploadedAt: "2026-03-09T15:30:00.000Z",
      },
      {
        stage: "FINAL",
        thesisId: "thesis-eval-03",
        student: {
          id: "student-adv-02",
          name: "Paolo R. Evangelista",
          studentNumber: "2024-GS-00051",
        },
        officialTitle:
          "Digital Fiscal Transparency and Citizen Trust in Local Government Units of Metro Manila",
        reviewStatus: isChangesRequested ? "ISSUED" : "AWAITING_REVIEW",
        reviewRemarks: isChangesRequested
          ? "All chapters verified and cleared for Final Oral Defense."
          : null,
        manuscriptDocumentId: "doc-final-ms-02",
        manuscriptTitle:
          "Digital Fiscal Transparency and Citizen Trust in Local Government Units of Metro Manila",
        originalFilename: "Evangelista_DPA_Final_Dissertation_Ch1-5.pdf",
        manuscriptUploadedAt: "2026-03-01T08:00:00.000Z",
      },
    ],
  };
}

export function buildAdviseeDetail(
  studentId: string,
  adviseesScenario: string,
): AdviserAdviseeDetailDto {
  const workspace = buildAdviserWorkspace(adviseesScenario);
  const found =
    workspace.activeAdvisees.find((a) => a.student.id === studentId) ??
    workspace.activeAdvisees[0];
  const tasks = workspace.reviewTasks.filter(
    (t) => t.student.id === found.student.id,
  );

  return {
    assignment: {
      assignmentId: found.assignmentId,
      assignedDate: found.assignedDate,
    },
    student: found.student,
    research: found.research,
    reviewContext: {
      stages: ["PROPOSAL", "FINAL"],
      tasks:
        tasks.length > 0
          ? tasks
          : [
              {
                stage: "PROPOSAL",
                thesisId: found.research.thesisId ?? "thesis-eval-01",
                student: {
                  id: found.student.id,
                  name: found.student.name,
                  studentNumber: found.student.studentNumber,
                },
                officialTitle: found.research.workingTitle,
                reviewStatus: "AWAITING_REVIEW",
                reviewRemarks: null,
                manuscriptDocumentId: "doc-prop-ms-01",
                manuscriptTitle: found.research.workingTitle,
                originalFilename:
                  "Advisee_Proposal_Manuscript_Chapters1-3.pdf",
                manuscriptUploadedAt: "2026-03-06T09:30:00.000Z",
              },
            ],
    },
    researchDocuments: [
      {
        id: "doc-prop-ms-01",
        stage: "PROPOSAL",
        kind: "PROPOSAL_MANUSCRIPT",
        uploadedAt: "2026-03-06T09:30:00.000Z",
        isCurrent: true,
        supersedesDocumentId: null,
      },
      {
        id: "doc-title-pkg-01",
        stage: "TITLE",
        kind: "TITLE_PROPOSAL_PACKAGE",
        uploadedAt: "2026-01-25T10:15:00.000Z",
        isCurrent: true,
        supersedesDocumentId: null,
      },
    ],
    defenseHistory: [
      {
        scheduleId: "sched-title-01",
        stage: "TITLE",
        defenseDate: "2026-02-05",
        concludedAt: "2026-02-05T11:30:00.000Z",
        verdict: "PASSED",
        manuscript: {
          id: "doc-title-pkg-01",
          stage: "TITLE",
          kind: "TITLE_PROPOSAL_PACKAGE",
          uploadedAt: "2026-01-25T10:15:00.000Z",
        },
        committeeReport: {
          finalizedAt: "2026-02-05T16:45:00.000Z",
          bodyDocument: null,
          text: "Title #1 unanimously approved by the Title Defense Committee. Proceed to GS-020 Adviser Request and Proposal Manuscript preparation.",
        },
      },
    ],
  };
}

export function buildAdviserReviewTaskDetail(
  stage: "PROPOSAL" | "FINAL",
  thesisId: string,
): AdviserReviewTaskDetail {
  return {
    thesisId,
    stage,
    student: {
      id: "student-eval-01",
      name:
        thesisId === "thesis-eval-02"
          ? "Mark Anthony P. Villanueva"
          : thesisId === "thesis-eval-03"
            ? "Paolo R. Evangelista"
            : "Juan M. Dela Cruz",
      studentNumber:
        thesisId === "thesis-eval-02"
          ? "2025-GS-00188"
          : thesisId === "thesis-eval-03"
            ? "2024-GS-00051"
            : "2025-GS-00142",
    },
    officialTitle:
      thesisId === "thesis-eval-02"
        ? "School Disaster Preparedness and Instructional Continuity Management in Public Elementary Schools"
        : thesisId === "thesis-eval-03"
          ? "Digital Fiscal Transparency and Citizen Trust in Local Government Units of Metro Manila"
          : OFFICIAL_APPROVED_TITLE,
    activeAdviser: {
      userId: "panelist-eval-01",
      name: "Dr. Maria Clara R. Santos, EdD",
    },
    reviewStatus: "AWAITING_REVIEW",
    reviewRemarks: null,
    manuscript: {
      documentId: "doc-prop-ms-01",
      manuscriptTitle: OFFICIAL_APPROVED_TITLE,
      originalFilename:
        stage === "FINAL"
          ? "DelaCruz_MAEd_Final_Manuscript_Ch1-5.pdf"
          : "DelaCruz_MAEd_Proposal_Manuscript_Ch1-3.pdf",
      uploadedAt: "2026-03-06T09:30:00.000Z",
    },
    certification: null,
    isAuthorizedAdviser: true,
    strikeRequired: stage === "FINAL",
    strikeEligible: true,
    actionBlockedReason: null,
  };
}

export const INITIAL_PENDING_RAP_SIGNATURES: RapReportSignatureDoc[] = [
  {
    id: "rap-sig-pending-01",
    rapReport: {
      defenseType: "FINAL_DEFENSE",
      generatedAt: "2026-03-05T13:00:00.000Z",
      thesis: {
        student: {
          user: {
            firstName: "Paolo",
            lastName: "Evangelista",
          },
        },
      },
    },
  },
  {
    id: "rap-sig-pending-02",
    rapReport: {
      defenseType: "PROPOSAL_DEFENSE",
      generatedAt: "2026-03-10T15:30:00.000Z",
      thesis: {
        student: {
          user: {
            firstName: "Juan",
            lastName: "Dela Cruz",
          },
        },
      },
    },
  },
];
