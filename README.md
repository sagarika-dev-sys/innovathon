# PeerSync Engine 🚀
> **Autonomous Campus Teaming & Skill Matching Platform**  
> *Innovathon Project — Integrated Application by Member 4 (Product Experience, UI/UX & Integration)*

---

## 🌟 Executive Overview
**PeerSync Engine** is a high-concurrency campus teaming platform designed to assemble Pareto-optimal student hackathon squads with mathematical precision. 

Rather than relying on ad-hoc networking or random team selection, PeerSync combines:
1. **Interactive UI/UX & Design System** (Member 4 / Member 1)
2. **Exhaustive Deterministic Combinatorial Matching Algorithm** (Member 2)
3. **Campus Projects Hub & Peer Directory** (Member 3 / Member 4)
4. **Live Activity & Notification Stream** (Member 4)

---

## 🏗️ Module Integration Architecture

| Module | Contributor | Integration Role in `member4` |
| :--- | :--- | :--- |
| **Module 1: Team & Project Forms** | Member 1 | Interactive skill selection chips, target squad size controls, and project specifications. |
| **Module 2: Matching Core Engine** | Member 2 | Integrated directly into `src/lib/matchingAlgorithm.ts` and `/api/match`. Calculates exact skill coverage (90%) + availability (10%) lexicographical ranking across the 16 student dataset. |
| **Module 3: Project Feed** | Member 3 | Integrated into `src/features/projects/ProjectExplorer.tsx` with live project creation, open-slot counters, and instant application dispatch. |
| **Module 4: UI/UX, Dashboard & Shared Layouts** | Member 4 | Responsive glassmorphic design system (`Button`, `Card`, `Badge`, `Avatar`, `Input`, `Modal`, `Tabs`, `Navbar`, `NotificationFeed`), full multi-tab Dashboard, Landing Page with live hero simulation, loading/error states, and API endpoints. |

---

## 📂 Folder Ownership & Structure

```
innovathon/
├── client/                               # Suggested Ownership Re-exports
│   └── src/
│       ├── components/ui/index.ts        # UI primitives export
│       ├── layouts/index.ts              # Shared layout export
│       ├── pages/Dashboard.tsx           # Dashboard export
│       └── features/notifications/       # Notification center export
├── src/
│   ├── app/
│   │   ├── api/match/route.ts            # GET/POST Team Matching API
│   │   ├── dashboard/page.tsx            # Multi-Tab Dashboard (Overview, Matcher, Projects, Peers, Notifs)
│   │   ├── globals.css                   # Tailwind v4, glassmorphism & design tokens
│   │   ├── layout.tsx                    # Shared RootLayout with sticky Navbar
│   │   ├── loading.tsx                   # Pulse loading spinner state
│   │   ├── error.tsx                     # Error boundary with retry
│   │   └── page.tsx                      # Landing Page with live interactive hero preview
│   ├── components/
│   │   ├── ui/                           # Button, Card, Badge, Avatar, Input, Modal, Tabs, Navbar, NotificationFeed
│   │   └── layouts/AppLayout.tsx         # Unified container layout
│   ├── data/
│   │   ├── students.ts                   # 16 verified campus student profiles
│   │   └── mockProjects.ts               # Active hackathon initiatives & notification feed data
│   ├── features/
│   │   ├── matching/TeamMatcher.tsx      # Integrated combinatorial team matcher
│   │   ├── projects/ProjectExplorer.tsx  # Campus Project Hub & Creator
│   │   ├── peers/PeerDirectory.tsx       # Searchable student directory
│   │   └── notifications/                # Real-time alert feed & privacy settings
│   ├── lib/
│   │   └── matchingAlgorithm.ts          # Member 2's algorithm ported to TypeScript
│   └── types/index.ts                    # TypeScript contracts
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with the landing page and `http://localhost:3000/dashboard` for the collaboration control center.

### 3. Run Production Build Verification
```bash
npm run build
```

---

## 🔌 API Documentation: `/api/match`

### `POST /api/match`
Synthesize the optimal team for your requirements:

**Request Body:**
```json
{
  "requiredSkills": ["React", "Node.js", "Machine Learning", "UI/UX"],
  "teamSize": 3
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "result": {
    "team": [
      {
        "id": "stu-001",
        "name": "Aria Chen",
        "role": "Full-Stack Engineer & UI Lead",
        "skills": ["React", "JavaScript", "TypeScript", "UI/UX", "CSS", "Frontend"],
        "availability": 90
      },
      {
        "id": "stu-002",
        "name": "Marcus Johnson",
        "role": "Backend Architect",
        "skills": ["Node.js", "Express", "MongoDB", "Backend", "Databases"],
        "availability": 85
      },
      {
        "id": "stu-003",
        "name": "Elena Rostova",
        "role": "ML Researcher & Data Scientist",
        "skills": ["Python", "Machine Learning", "ML", "Data Analysis", "Testing"],
        "availability": 80
      }
    ],
    "coveredSkills": ["React", "UI/UX", "Node.js", "Machine Learning"],
    "missingSkills": [],
    "coveragePercentage": 100,
    "averageAvailability": 85,
    "score": 98.5
  },
  "meta": {
    "totalEvaluatedStudents": 16,
    "timestamp": "2026-10-14T14:40:00.000Z"
  }
}
```
