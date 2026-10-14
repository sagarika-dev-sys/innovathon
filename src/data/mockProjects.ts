import { Project, NotificationItem, ActivityItem } from '@/types';

export const mockProjects: Project[] = [
  {
    id: "proj-101",
    title: "NeuroPulse: EEG Cognitive Load Tracker",
    description: "Building an edge-AI device and dashboard to monitor real-time student cognitive fatigue during coding hackathons.",
    requiredSkills: ["Python", "Machine Learning", "React", "TypeScript", "UI/UX"],
    teamSize: 4,
    currentMembers: 2,
    ownerName: "Elena Rostova",
    category: "AI / ML",
    deadline: "Nov 12, 2026",
    status: "Open"
  },
  {
    id: "proj-102",
    title: "DeFi Micro-Endowment Protocol",
    description: "Decentralized micro-grant fund for campus student researchers powered by automated milestone-based escrow contracts.",
    requiredSkills: ["Rust", "WebAssembly", "Solidity", "Node.js", "React"],
    teamSize: 4,
    currentMembers: 3,
    ownerName: "Zara Patel",
    category: "Web3 / DeFi",
    deadline: "Nov 18, 2026",
    status: "Open"
  },
  {
    id: "proj-103",
    title: "CampusFlow: Peer Sync & Lab Resource Allocator",
    description: "High-concurrency scheduler and queueing system for campus 3D printers, laser cutters, and GPU clusters.",
    requiredSkills: ["Node.js", "PostgreSQL", "Next.js", "Docker", "UI/UX"],
    teamSize: 3,
    currentMembers: 1,
    ownerName: "Marcus Johnson",
    category: "SaaS",
    deadline: "Dec 01, 2026",
    status: "Open"
  },
  {
    id: "proj-104",
    title: "MediEcho: Rural Ultrasound Tele-Diagnostics",
    description: "Lightweight diagnostic assistant compressing and streaming ultrasound signals over 2G/3G mobile networks.",
    requiredSkills: ["Python", "Testing", "C++", "Documentation", "UI/UX"],
    teamSize: 4,
    currentMembers: 2,
    ownerName: "Kai Takahashi",
    category: "HealthTech",
    deadline: "Nov 25, 2026",
    status: "Open"
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Match Found for NeuroPulse",
    message: "Aria Chen matches 100% of your frontend & UI/UX requirements for NeuroPulse.",
    timestamp: "12m ago",
    type: "match",
    read: false,
    actionLabel: "View Match",
    actionUrl: "/dashboard?tab=matcher",
    sender: { name: "Aria Chen" }
  },
  {
    id: "notif-2",
    title: "Collaboration Invitation",
    message: "Zara Patel invited you to join 'DeFi Micro-Endowment Protocol' as a Backend Engineer.",
    timestamp: "1h ago",
    type: "invite",
    read: false,
    actionLabel: "Respond",
    sender: { name: "Zara Patel" }
  },
  {
    id: "notif-3",
    title: "Skill Profile Verified",
    message: "Your profile has been indexed into the Campus PeerSync Engine with 92% availability.",
    timestamp: "3h ago",
    type: "system",
    read: true
  },
  {
    id: "notif-4",
    title: "Team Formed Successfully",
    message: "Team 'Quantum Vision' has met 100% skill coverage and locked roster.",
    timestamp: "Yesterday",
    type: "success",
    read: true
  }
];

export const initialActivities: ActivityItem[] = [
  {
    id: "act-1",
    actor: "Kai Takahashi",
    action: "formed team with",
    target: "Priya Sharma (MediEcho)",
    timestamp: "18m ago",
    iconType: "user-plus"
  },
  {
    id: "act-2",
    actor: "Campus Engine",
    action: "computed optimal match for",
    target: "DeFi Micro-Endowment",
    timestamp: "45m ago",
    iconType: "cpu"
  },
  {
    id: "act-3",
    actor: "Marcus Johnson",
    action: "published project",
    target: "CampusFlow Scheduler",
    timestamp: "2h ago",
    iconType: "sparkles"
  },
  {
    id: "act-4",
    actor: "Elena Rostova",
    action: "accepted invitation from",
    target: "NeuroPulse Core Team",
    timestamp: "4h ago",
    iconType: "check-circle"
  }
];
