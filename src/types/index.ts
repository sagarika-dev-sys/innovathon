export interface Student {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  skills: string[];
  availability: number; // 0-100
  bio?: string;
  github?: string;
  college?: string;
}

export interface MatchingResult {
  team: Student[];
  coveredSkills: string[];
  missingSkills: string[];
  coveragePercentage: number;
  averageAvailability: number;
  score: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  teamSize: number;
  currentMembers: number;
  ownerName: string;
  ownerAvatar?: string;
  category: 'AI / ML' | 'Web3 / DeFi' | 'HealthTech' | 'EdTech' | 'IoT / Hardware' | 'SaaS';
  deadline: string;
  status: 'Open' | 'In Progress' | 'Filled';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'invite' | 'match' | 'system' | 'success';
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  iconType: 'user-plus' | 'check-circle' | 'cpu' | 'sparkles';
}
