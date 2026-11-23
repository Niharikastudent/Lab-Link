LabLink
A university laboratory resource discovery and booking platform.
LabLink is a web application concept built to make shared laboratory equipment easier for students to discover and request, while giving faculty a central place to review booking activity and equipment usage.
Open the live demo  ·  View the source code 

The problem
University laboratories may have useful equipment spread across departments. Students can find it difficult to know what is available, understand which equipment suits a project, or coordinate requests when several people need the same resource.
LabLink brings equipment discovery, booking requests, and resource-management views into one application.
What LabLink includes
Equipment catalogue — browse and filter equipment by details such as department, category, and availability.
Project recommender — enter a project description to see equipment suggestions with matching explanations.
Booking requests — submit equipment requests with project and scheduling details.
Conflict analysis — review overlapping requests and scheduling considerations.
Project readiness feedback — receive a readiness score and suggestions based on the request information.
Faculty dashboard — review booking requests and their status.
Analytics view — inspect booking and resource information.
Booking status lookup — look up a request using its booking reference.
Evaluator demo console — explore selected application flows in a demo-oriented interface.
The repository contains both a Supabase integration and a local mock-data store. The experience available in a particular deployment depends on its environment configuration and database setup.
How it works
A student browses the equipment catalogue or uses the project recommender.
The student submits a booking request with project and scheduling information.
LabLink evaluates the request information and provides readiness feedback.
Booking and scheduling views help surface request status and potential conflicts.
Faculty-facing screens provide a place to review requests and resource activity.
Technology
Area
Technology
Frontend
React 19, TypeScript
Development/build
Vite 6
Styling
Tailwind CSS
Icons
Lucide React
Backend integration
Supabase JavaScript client
Database
Supabase / PostgreSQL schema
Tests
Vitest, Testing Library, jsdom
Project structure
src/
├── algorithms/       # Conflict, readiness, and recommendation logic
├── components/       # Catalogue, booking, dashboards, and interface views
├── data/             # Seed equipment data
├── lib/              # Database access, Supabase client, and mock store
├── supabase/         # PostgreSQL schema
├── test/             # Automated test files
└── types/            # Shared TypeScript types
Run locally
Requirements
Node.js (LTS recommended)
npm
1. Clone the repository
git clone https://github.com/Niharikastudent/Lab-Link.git
cd Lab-Link
2. Install dependencies
npm install
3. Configure environment variables (optional for local demo mode)
Create a .env file in the project root if you want to connect the app to your own Supabase project:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
The frontend reads these values to determine whether Supabase is configured. Never put a Supabase service-role key, database password, or other private secret in a VITE_ variable or commit it to the repository.
If you configure Supabase, review and apply the schema in src/supabase/schema.sql to your own project. Review and correct the included Row Level Security policies before using real student or institutional data. The current schema includes permissive demo policies and is not a production-ready security configuration.
4. Start the development server
npm run dev
Vite will print a local URL (usually http://localhost:5173). Open that URL in your browser.
Useful commands
npm run dev       # Start local development server
npm run build     # Type-check and create a production build
npm run preview   # Preview the production build locally
npm test          # Run the test suite once
npm run test:watch # Run tests in watch mode
Test files are located in src/test/. Run npm test in your environment to see the current results; this README does not claim a passing test count.
Security and deployment notes
LabLink is a hackathon/demo project. Before deploying it for real institutional use:
Replace demo authorization with authenticated, server-verified roles.
Review every Supabase Row Level Security policy, especially booking and notification access.
Do not rely on frontend-only checks to authorize faculty actions.
Keep private keys and service-role credentials out of browser code and Git history.
Test access boundaries using separate student and faculty accounts before storing real data.
The schema currently contains permissive demo access rules. A public deployment should therefore be treated as a demonstration unless and until those policies and the authorization flow are hardened and independently tested.
Project links
Live demo: https://radiant-sfogliatella-638a3b.netlify.app/
GitHub repository: https://github.com/Niharikastudent/Lab-Link
Built as a student hackathon project for PromptWars × Cynergy on Hack2Skill.
