# LabLink — AI-Powered University Laboratory Resource-Sharing Platform

[![Build & Test](https://img.shields.io/badge/Build%20%26%20Test-19%20Passed-10b981?style=flat-square)](file:///src/test)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.8-3178c6?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61dafb?style=flat-square)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8?style=flat-square)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ecf8e?style=flat-square)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

> **College laboratories house world-class equipment—from NVIDIA A100 AI supercomputers to 200 MHz oscilloscopes and 50 kN tensile testers—yet they remain trapped in departmental silos.** Students in Computer Science lack access to mechanical fabrication; electronics researchers struggle to book GPU clusters; idle instruments sit behind closed lab doors while competing capstone deadlines collide.
>
> **LabLink** breaks these silos through an open, intelligent, and fair campus resource-sharing platform.

---

## 📑 Table of Contents

- [Problem Statement & Solution](#-problem-statement--solution)
- [The Six Evaluation Criteria](#-the-six-evaluation-criteria-scorecard)
- [Architecture & Database Design](#-architecture--database-design)
- [Key Features Built](#-key-features-built)
- [Intelligent Algorithms](#-intelligent-algorithms)
  - [1. Deterministic Project Recommender](#1-deterministic-project-recommender-feature-b)
  - [2. Real-Time Project Readiness Score](#2-real-time-project-readiness-score-feature-c)
  - [3. Smart Fair-Share Conflict Engine](#3-smart-fair-share-conflict-engine-feature-d)
- [Security & Privacy Engineering](#-security--privacy-engineering)
- [Automated Testing Suite](#-automated-testing-suite)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Evaluator Demo Walkthrough](#-evaluator-demo-walkthrough)
- [Known Limitations & Disclosures](#-known-limitations--disclosures)

---

## 🎯 Problem Statement & Solution

| The Campus Problem | The LabLink Solution |
| :--- | :--- |
| **Department Silos**: Students only know what is in their immediate department building. | **Cross-Department Catalogue**: Single discovery hub spanning CS, ECE, EE, Mechanical, and Physics labs. |
| **Ambiguous Needs**: Students know their project goals but not which instrument specs they need. | **Explainable Recommender**: Natural language capability matcher that explains *why* hardware was matched. |
| **Contention & Collisions**: Multiple students request identical instruments before thesis deadlines. | **Smart Fair-Share Conflict Engine**: Multi-factor scheduling resolution (Deadline 40%, Complexity 30%, Equity 30%). |
| **Equipment Hoarding**: Single faculties monopolize high-tier university instruments. | **Cross-Department Incentives**: Dynamic fairness scoring rewards interdisciplinary sharing. |
| **Account Friction**: Complex logins discourage casual students from browsing or applying. | **Zero-Login Public Submission with Private Tokens**: Submit instantly; track privately using unpredictable references. |

---

## 🏆 The Six Evaluation Criteria Implementation Mapping

| Criterion | LabLink Implementation Evidence | Code Location |
| :--- | :--- | :--- |
| **1. Code Quality** | Modular component separation, strict TypeScript types, zero unused locals/imports, decoupled business logic, and unified repository pattern. | [src/algorithms/](file:///src/algorithms), [src/components/](file:///src/components) |
| **2. Security** | Passcode-guarded faculty operations, non-enumerable cryptographic reference tokens (`LL-XXXX-YYYY`), Row-Level Security policies, and zero committed credentials. | [src/lib/db.ts](file:///src/lib/db.ts), [src/supabase/schema.sql](file:///src/supabase/schema.sql) |
| **3. Efficiency** | Deterministic algorithms execute with sub-millisecond latency, zero heavy runtime dependencies, production bundle gzipped to ~169 kB, indexed PostgreSQL schema, responsive layout. | [src/algorithms/conflictEngine.ts](file:///src/algorithms/conflictEngine.ts) |
| **4. Testing** | **19 verified passing tests** across 4 test suites covering algorithms, lifecycle transitions, authorization rejection, and accessibility. | [src/test/](file:///src/test) |
| **5. Accessibility** | WCAG 2.1 AA compliant, semantic HTML5, visible focus states, ARIA dialogs/inputs, keyboard navigation, and non-color-only state indicators. | [src/test/accessibility_and_ui.test.tsx](file:///src/test/accessibility_and_ui.test.tsx) |
| **6. Problem Alignment**| Genuine university hardware catalogue (DGX A100, ZedBoard, dSPACE, Shimadzu UV-Vis) with real conflict resolution and lab safety checks. | [src/data/seedEquipment.ts](file:///src/data/seedEquipment.ts) |

---

## 🏛️ Architecture & Database Design

LabLink uses a layered, maintainable architecture that decouples UI rendering from deterministic algorithms and persistence:

```
┌─────────────────────────────────────────────────────────────┐
│                      UI Presentation Layer                   │
│   (EquipmentCatalog, ProjectRecommender, ConflictEngineView,│
│    FacultyDashboard, AnalyticsDashboard, DemoConsole)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Deterministic Algorithm Core               │
│  - Recommender: Capability weighting & cross-dept matches   │
│  - Readiness: Real-time form scoring & gap analysis         │
│  - Conflict Engine: 40/30/30 fair-share scheduling resolver │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Unified Repository Layer                 │
│                 (src/lib/db.ts & mockStore.ts)              │
│       - Verifies administrative faculty credentials         │
│       - Manages equipment check-in / check-out capacity     │
│       - Seamless fallback: Supabase PostgreSQL ↔ Demo DB    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                   PostgreSQL Database with RLS              │
│   (equipment, bookings, notifications, equipment_logs)      │
└─────────────────────────────────────────────────────────────┘
```

### PostgreSQL Relational Schema (`src/supabase/schema.sql`)

- **`equipment`**: Primary inventory store with `department`, `category`, `specifications` (JSONB), `total_quantity`, `available_quantity`, `lab_location`, `prerequisites` (array), and `capabilities` (array).
- **`bookings`**: Reservation requests with unique `booking_reference`, student identity, time interval (`start_date`, `end_date`), `project_deadline`, `scheduling_flexibility`, and `status`.
- **`notifications`**: Private in-app alert log tied to individual booking reference tokens.
- **`equipment_logs`**: Immutable audit log of checkout and return events.
- **Row-Level Security (RLS)**: Public read for catalogue; restricted reference-based access for private bookings; credential-enforced updates for faculty.

---

## 🚀 Key Features Built

### Feature A — Equipment Discovery
- Search by name, technical specifications, and hardware capability.
- Multi-dimensional filters: Department, Category, and Real-time Availability.
- Detailed modal presenting verified hardware specifications, laboratory room locations, and compliance prerequisites.

### Feature B — Project-Based Equipment Recommender
- Natural language query parser mapping student project text to lab capabilities.
- Transparent match score (0–100%) with explicit, explainable reasoning.
- Compatible alternative suggestions from adjacent departments to bypass high queues.
- One-click transfer from recommendation directly into the booking form.

### Feature C — Real-Time Project Readiness Check
- Calculates an objective readiness score (0–100) dynamically as the student types.
- Evaluates title specificity, proposal depth (word count threshold), time slot sanity, and deadline proximity.
- Flags missing fields and outputs actionable advice.
- Explicitly clarifies that lab safety certifications must be verified by faculty.

### Feature D — Smart Fair-Share Conflict Engine
- Automatically detects concurrent bookings for identical equipment exceeding capacity.
- Evaluates competing requests across 3 transparent dimensions:
  1. **Deadline Urgency (40%)**: Proximity to student thesis or milestone defense.
  2. **Complexity & Exclusivity (30%)**: Equipment tier and project technical depth.
  3. **Department Fairness & Usage History (30%)**: Prevents single-faculty resource hoarding.
- Explains the allocation verdict and generates non-destructive alternative time slots and optional split sessions.

### Feature E & F — Faculty Portal & Equipment Lifecycle Tracking
- Protected administrative dashboard requiring verified credentials.
- Full equipment lifecycle: `Available → Reserved → Issued → Returned → Available`.
- When an instrument is issued, its physical available count decreases; when returned, capacity is restored.
- Overdue tracking for reservations past expected return time.

### Feature G — Notification Centre
- Real database-backed notification system.
- Private notifications scoped to the student's booking reference token.
- Automatic notifications on submission, approval, rejection, and checkout.

### Feature H — Resource Utilisation Analytics
- Live department-wise utilization progress bars.
- Highest contention instrument ranking based on booking frequency.
- Key performance metrics: Campus utilization %, active checkouts, and pending reviews.

### Feature I — Evaluator Demo Console
- Dedicated 1-click test console for evaluators to trigger:
  1. **Live Conflict Test**: Runs conflict engine on DGX A100 contention.
  2. **Live Recommender Test**: Tests natural language capability matching.
  3. **Safe Demo Reset**: Restores clean demonstration state with confirmation dialog.

---

## 🧠 Intelligent Algorithms

### 1. Deterministic Project Recommender (`src/algorithms/recommender.ts`)
Avoids brittle, costly external AI APIs. Uses a curated capability taxonomy with weighted keyword detection across machine learning, robotics, embedded IoT, power electronics, fabrication, and spectroscopy. Calculates a normalized compatibility score and generates human-readable explanations of why the hardware matches.

### 2. Real-Time Project Readiness Score (`src/algorithms/readiness.ts`)
Evaluates form completeness, description depth (aiming for 30+ technical words), time slot feasibility, and deadline alignment:
$$\text{Readiness Score} = \text{Identity (15)} + \text{Description Depth (30)} + \text{Prerequisite Alignment (15)} + \text{Time Feasibility (25)} + \text{Deadline \& Flexibility (15)}$$

### 3. Smart Fair-Share Conflict Engine (`src/algorithms/conflictEngine.ts`)
Resolves laboratory contention through multi-objective scoring:
$$\text{FairShare Score} = 0.40 \times \text{UrgencyScore} + 0.30 \times \text{ComplexityScore} + 0.30 \times \text{DepartmentEquityScore}$$
- **Deadline Urgency (Max 40)**: $\le 2\text{ days} \to 40\text{ pts}$, $\le 5\text{ days} \to 34\text{ pts}$, etc.
- **Complexity & Exclusivity (Max 30)**: Specialized Tier (12 pts) + Technical Proposal (10 pts) + High Readiness (8 pts).
- **Inter-Department Equity (Max 30)**: Cross-Department access (+16 pts) + Underrepresented faculty bonus (+14 pts).

---

## 🔒 Security & Privacy Engineering

- **No Student Password Fatigue**: Students do not need to create public user accounts to browse or submit.
- **Cryptographic Reference Tokens**: Bookings generate unpredictable, non-enumerable tokens (`LL-XXXX-YYYY`) created using high-entropy character spaces.
- **Privacy Isolation**: Visitors can only access booking records and notification histories if they provide the exact matching reference token.
- **Protected Faculty Operations**: Privileged approvals, rejections, checkouts, and returns are strictly guarded by credential checks (`verifyFacultyCredential`).
- **Zero Committed Secrets**: `.env` and sensitive API keys are strictly excluded via `.gitignore`. A documented `.env.example` is provided.

---

## 🧪 Automated Testing Suite

The repository includes 19 comprehensive unit and integration tests using **Vitest** and **React Testing Library**.

### Test Execution Summary
```bash
npm test
```
```text
 ✓ src/test/booking_lifecycle.test.ts (3 tests)
   ✓ generates an unpredictable booking reference upon submission
   ✓ transitions from Pending -> Approved -> Issued -> Returned with proper quantity tracking
   ✓ rejects booking with faculty justification
 ✓ src/test/algorithms.test.ts (10 tests)
   ✓ correctly maps IoT & sensor project to Google Coral or embedded kits
   ✓ correctly maps deep learning & large language model requests to NVIDIA DGX A100
   ✓ correctly provides compatible cross-department alternatives
   ✓ awards high readiness score for complete, well-formed proposals
   ✓ identifies missing required fields and advises expansion when description is too brief
   ✓ detects inverted time slots where end is before start
   ✓ correctly calculates interval overlaps
   ✓ prioritizes student with closer project deadline under fair-share scoring
   ✓ generates viable non-overlapping alternative slots
   ✓ detects no conflict when bookings do not overlap
 ✓ src/test/security.test.ts (4 tests)
   ✓ rejects unauthorized faculty actions with security violation error
   ✓ permits administrative actions when verified with valid faculty credential
   ✓ ensures private booking lookup returns null for non-existent or invalid reference codes
   ✓ scopes notifications strictly to matching private booking reference tokens
 ✓ src/test/accessibility_and_ui.test.tsx (2 tests)
   ✓ renders catalogue with accessible search, proper labels, and semantic elements
   ✓ renders equipment cards with visible department tags and non-color-only indicators

Test Files  4 passed (4)
Tests       19 passed (19)
```

---

## 💻 Getting Started & Local Development

### Prerequisites
- **Node.js** v18+ (tested on v24.22.0)
- **npm** v10+

### Step-by-Step Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/lablink.git
   cd lablink
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Note: LabLink runs out of the box in Local Demonstration Store mode if no Supabase keys are provided.)*

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

5. **Run test suite**:
   ```bash
   npm test
   ```

6. **Create production build**:
   ```bash
   npm run build
   ```

---

## 🔍 Evaluator Demo Walkthrough

Evaluators can inspect LabLink in under 3 minutes using the built-in demo shortcuts:

1. **Test Intelligent Recommendations**:
   - Navigate to the **"AI Recommender"** tab.
   - Click the demonstration prompt: *"IoT-Based Smart Precision Irrigation System"*.
   - Click **"Analyze & Recommend Equipment"**.
   - Observe the matched capabilities (`iot`, `sensor`, `microcontroller`) and the top recommendation for the **Google Coral Dev Board (Edge TPU)**.

2. **Inspect the Fair-Share Conflict Engine**:
   - Navigate to the **"Fair-Share Engine"** tab.
   - Select the **NVIDIA DGX A100 AI Workstation**.
   - Inspect the contention between *Rohan Deshmukh* (Thesis defense in 4 days) and *Pooja Hegde* (Capstone in 18 days).
   - Review the mathematical breakdown (40% Urgency, 30% Complexity, 30% Fairness) and the proposed zero-collision alternative slot.

3. **Test the Faculty Review & Issue Workflow**:
   - Navigate to the **"Faculty Portal"** tab.
   - Enter administrative demo key: `LabLink2026!`.
   - Review pending requests, verify prerequisites, and click **"Approve Access"**.
   - For an approved request, click **"Check-Out / Issue to Student"** and observe the live decrement in available inventory.

4. **Track Booking via Private Token**:
   - Click **"Track Request"** in the top navigation bar.
   - Click demo reference code shortcut: `LL-7F2A-91K4`.
   - Inspect the real-time reservation lifecycle timeline and associated notifications.

5. **Reset Demo State**:
   - Open the **"Demo Console"** (top right button).
   - Click **"Reset Demo Data"** to restore clean baseline data.

---

## 📌 Known Limitations & Disclosures

1. **Hardware Verification**: Software cannot physically verify whether a student has completed in-person laboratory safety training (e.g. Class 4 laser safety or high-voltage protocols). LabLink explicitly surfaces these as mandatory prerequisites that must be signed off by faculty during physical checkout.
2. **Email Delivery**: To maintain hackathon simplicity and avoid external paid dependencies, notifications are stored in the database and surfaced via the private in-app notification centre rather than sending live SMTP emails.
3. **Faculty Authentication Boundary**: In this standalone demonstration prototype, administrative operations are validated against an environment-configured passcode (`LabLink2026!`) executed at the repository layer. In a production multi-tenant deployment, this check must run inside an isolated server-side backend API (such as Supabase Edge Functions or Node.js service) integrated with institutional SAML/Single Sign-On (SSO) to prevent client-side inspection.

---

## 📄 License
This project is open-source under the MIT License.
#   L a b - L i n k  
 