# Frontend Structure – u-select

> React (Vite) + JavaScript — Recruiter-facing dashboard

## About Umurava Select
**Umurava Select** is an AI-powered applicant screening and shortlisting platform designed to help recruiters process candidates more efficiently. 

**How it works:**
1. **Create Jobs:** Recruiters define job postings with detailed requirements.
2. **Collect Applicants:** Candidates can be added via manual structured profile entry or file uploads (CSV, PDF, etc.).
3. **AI Screening:** The system uses AI to evaluate each applicant against the job description, analyzing strengths, gaps, and relevance.
4. **Ranked Shortlist:** Recruiters receive a ranked list of the top candidates, complete with AI-generated reasoning to make informed hiring decisions.

---

## Folder Tree

```
src/
├── assets/                         # Static images, icons, logos
│
├── components/                     # Reusable UI pieces (no page logic)
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.css
│   │   ├── Modal/
│   │   │   ├── Modal.jsx
│   │   │   └── Modal.css
│   │   ├── Spinner/
│   │   │   ├── Spinner.jsx
│   │   │   └── Spinner.css
│   │   └── EmptyState/
│   │       ├── EmptyState.jsx
│   │       └── EmptyState.css
│   │
│   ├── jobs/
│   │   ├── JobCard/
│   │   │   ├── JobCard.jsx
│   │   │   └── JobCard.css
│   │   └── JobForm/
│   │       ├── JobForm.jsx
│   │       └── JobForm.css
│   │
│   ├── applicants/
│   │   ├── ApplicantCard/
│   │   │   ├── ApplicantCard.jsx
│   │   │   └── ApplicantCard.css
│   │   ├── UploadForm/
│   │   │   ├── UploadForm.jsx         # CSV / Excel / PDF upload (Scenario 2)
│   │   │   └── UploadForm.css
│   │   └── StructuredForm/
│   │       ├── StructuredForm.jsx     # Manual structured profile entry (Scenario 1)
│   │       └── StructuredForm.css
│   │
│   └── screening/
│       ├── ShortlistTable/
│       │   ├── ShortlistTable.jsx     # Ranked Top 10 / Top 20 table
│       │   └── ShortlistTable.css
│       └── CandidateReasoning/
│           ├── CandidateReasoning.jsx # AI strengths / gaps / relevance card
│           └── CandidateReasoning.css
│
├── pages/                          # One folder per route/page
│   ├── Dashboard/
│   │   ├── Dashboard.jsx           # Overview: active jobs, recent screenings
│   │   └── Dashboard.css
│   ├── Jobs/
│   │   ├── Jobs.jsx                # List of all jobs
│   │   └── Jobs.css
│   ├── JobDetail/
│   │   ├── JobDetail.jsx           # Single job view + trigger screening
│   │   └── JobDetail.css
│   ├── Applicants/
│   │   ├── Applicants.jsx          # Applicants for a specific job
│   │   └── Applicants.css
│   ├── Screening/
│   │   ├── Screening.jsx           # Ranked shortlist + AI reasoning per candidate
│   │   └── Screening.css
│   └── NotFound/
│       ├── NotFound.jsx
│       └── NotFound.css
│
├── services/
│   └── api.js                      # All fetch/axios calls to the backend (one place)
│                                   # Base URL read from VITE_API_URL env var
│
├── hooks/
│   ├── useJobs.js                  # Data fetching + state for jobs
│   ├── useApplicants.js            # Data fetching + state for applicants
│   └── useScreening.js             # Trigger screening + poll results
│
├── context/
│   └── AppContext.jsx              # Global state (e.g. active job, loading flags)
│
├── utils/
│   └── formatters.js              # Date formatting, score display helpers, etc.
│
├── App.jsx                         # Route definitions (React Router)
├── App.css                         # Layout-level styles only
├── main.jsx                        # Vite entry point
└── index.css                       # CSS variables + reset (global — allowed by RULE 304)
```

---

## Pages & Their Purpose

| Page | Route | What it does |
|---|---|---|
| `Dashboard` | `/` | Summary view: total jobs, pending screenings |
| `Jobs` | `/jobs` | List all jobs, link to create new |
| `JobDetail` | `/jobs/:id` | View job details, manage applicants, trigger AI screening |
| `Applicants` | `/jobs/:id/applicants` | See all applicants for a job, add structured or upload file |
| `Screening` | `/jobs/:id/screening` | View ranked shortlist + per-candidate AI reasoning |
| `NotFound` | `*` | 404 fallback |

---

## Data Flow

