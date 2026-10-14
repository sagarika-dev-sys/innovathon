import { Student, MatchingResult } from '@/types';

function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Normalizes and deduplicates skills while preserving original readable casing.
 */
export function normalizeSkills(skills: string[]): { dedupedReadable: string[]; normalized: string[] } {
  const seen = new Set<string>();
  const dedupedReadable: string[] = [];
  const normalized: string[] = [];

  for (const s of skills) {
    const trimmed = s.trim();
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower) && trimmed.length > 0) {
      seen.add(lower);
      dedupedReadable.push(trimmed);
      normalized.push(lower);
    }
  }

  return { dedupedReadable, normalized };
}

interface CandidateEvaluation {
  team: Student[];
  coveredSkills: string[];
  missingSkills: string[];
  coveredCount: number;
  coveragePercentage: number;
  rawAverageAvailability: number;
  averageAvailability: number;
  score: number;
  sortedIds: string[];
}

function evaluateCandidate(
  teamMembers: Array<{ original: Student; idStr: string; availability: number; skillSet: Set<string> }>,
  dedupedReadable: string[],
  normalizedReqs: string[]
): CandidateEvaluation {
  const coveredSkills: string[] = [];
  const missingSkills: string[] = [];

  for (let i = 0; i < normalizedReqs.length; i++) {
    const req = normalizedReqs[i];
    let isCovered = false;
    for (const member of teamMembers) {
      if (member.skillSet.has(req)) {
        isCovered = true;
        break;
      }
    }
    if (isCovered) {
      coveredSkills.push(dedupedReadable[i]);
    } else {
      missingSkills.push(dedupedReadable[i]);
    }
  }

  const coveredCount = coveredSkills.length;
  const coveragePercentage = round2((coveredCount / dedupedReadable.length) * 100);

  let sumAvailability = 0;
  for (const m of teamMembers) {
    sumAvailability += m.availability;
  }
  const rawAverageAvailability = teamMembers.length > 0 ? sumAvailability / teamMembers.length : 0;
  const averageAvailability = round2(rawAverageAvailability);

  // 90% coverage weighting + 10% availability weighting
  const score = round2(0.9 * coveragePercentage + 0.1 * averageAvailability);
  const sortedIds = teamMembers.map((m) => m.idStr).sort();

  return {
    team: teamMembers.map((m) => m.original),
    coveredSkills,
    missingSkills,
    coveredCount,
    coveragePercentage,
    rawAverageAvailability,
    averageAvailability,
    score,
    sortedIds,
  };
}

/**
 * Multi-tier lexicographical ranking hierarchy:
 * 1. Covered count
 * 2. Coverage %
 * 3. Average availability
 * 4. Smaller team size
 * 5. Lexicographical ID tie-breaking
 */
function isBetter(cand: CandidateEvaluation, best: CandidateEvaluation | null): boolean {
  if (!best) return true;
  if (cand.coveredCount !== best.coveredCount) {
    return cand.coveredCount > best.coveredCount;
  }
  if (cand.coveragePercentage !== best.coveragePercentage) {
    return cand.coveragePercentage > best.coveragePercentage;
  }
  if (cand.averageAvailability !== best.averageAvailability) {
    return cand.averageAvailability > best.averageAvailability;
  }
  if (cand.rawAverageAvailability !== best.rawAverageAvailability) {
    return cand.rawAverageAvailability > best.rawAverageAvailability;
  }
  if (cand.team.length !== best.team.length) {
    return cand.team.length < best.team.length;
  }
  for (let i = 0; i < cand.sortedIds.length; i++) {
    if (cand.sortedIds[i] < best.sortedIds[i]) return true;
    if (cand.sortedIds[i] > best.sortedIds[i]) return false;
  }
  return false;
}

/**
 * Core Matching Algorithm from Member 2, integrated with full type safety
 * and safe combinatorial boundaries.
 */
export function generateTeam(
  students: Student[],
  requiredSkills: string[],
  teamSize: number
): MatchingResult {
  if (!Array.isArray(students) || students.length === 0 || teamSize <= 0 || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
    const { dedupedReadable } = normalizeSkills(requiredSkills || []);
    return {
      team: [],
      coveredSkills: [],
      missingSkills: dedupedReadable,
      coveragePercentage: 0,
      averageAvailability: 0,
      score: 0,
    };
  }

  const { dedupedReadable, normalized } = normalizeSkills(requiredSkills);

  if (dedupedReadable.length === 0) {
    return {
      team: [],
      coveredSkills: [],
      missingSkills: [],
      coveragePercentage: 0,
      averageAvailability: 0,
      score: 0,
    };
  }

  const maxTeamSize = Math.min(teamSize, students.length);

  const studentMeta = students.map((s) => ({
    original: s,
    idStr: String(s.id),
    availability: s.availability,
    skillSet: new Set(s.skills.map((sk) => sk.trim().toLowerCase())),
  }));

  let bestCandidate: CandidateEvaluation | null = null;

  // Enumerate candidate combinations
  for (let size = 1; size <= maxTeamSize; size++) {
    const currentCombo: typeof studentMeta = [];

    function findCombos(startIndex: number) {
      if (currentCombo.length === size) {
        const evaluated = evaluateCandidate(currentCombo, dedupedReadable, normalized);
        if (isBetter(evaluated, bestCandidate)) {
          bestCandidate = evaluated;
        }
        return;
      }

      const needed = size - currentCombo.length;
      const limit = studentMeta.length - needed;
      for (let i = startIndex; i <= limit; i++) {
        currentCombo.push(studentMeta[i]);
        findCombos(i + 1);
        currentCombo.pop();
      }
    }

    findCombos(0);
  }

  if (!bestCandidate) {
    return {
      team: [],
      coveredSkills: [],
      missingSkills: dedupedReadable,
      coveragePercentage: 0,
      averageAvailability: 0,
      score: 0,
    };
  }

  return {
    team: (bestCandidate as CandidateEvaluation).team,
    coveredSkills: (bestCandidate as CandidateEvaluation).coveredSkills,
    missingSkills: (bestCandidate as CandidateEvaluation).missingSkills,
    coveragePercentage: (bestCandidate as CandidateEvaluation).coveragePercentage,
    averageAvailability: (bestCandidate as CandidateEvaluation).averageAvailability,
    score: (bestCandidate as CandidateEvaluation).score,
  };
}
