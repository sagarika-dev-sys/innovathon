/**
 * SkillBridge Student Team-Matching Algorithm
 *
 * Implements deterministic, optimal student team selection based on
 * lexicographical ranking of skill coverage, availability, team size,
 * and deterministic tie-breaking.
 */

export const MAX_COMBINATIONS = 500000;

/**
 * Rounds a number to two decimal places safely.
 *
 * @param {number} num
 * @returns {number}
 */
export function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Validates all input arguments thoroughly without mutating them.
 *
 * @param {unknown} students
 * @param {unknown} requiredSkills
 * @param {unknown} teamSize
 */
function validateInputs(students, requiredSkills, teamSize) {
  if (!Array.isArray(students)) {
    throw new TypeError("Invalid students: expected an array.");
  }

  const seenIds = new Set();
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    if (!student || typeof student !== "object" || Array.isArray(student)) {
      throw new TypeError(
        `Invalid student record at index ${i}: expected a student object.`
      );
    }

    if (
      student.id === undefined ||
      student.id === null ||
      (typeof student.id !== "string" && typeof student.id !== "number") ||
      (typeof student.id === "string" && student.id.trim() === "")
    ) {
      throw new Error(
        `Invalid student record at index ${i}: id must be a non-empty string or number.`
      );
    }

    const idKey = String(student.id);
    if (seenIds.has(idKey)) {
      throw new Error(`Duplicate student ID found: ${idKey}`);
    }
    seenIds.add(idKey);

    if (typeof student.name !== "string" || student.name.trim() === "") {
      throw new Error(
        `Invalid student record (${idKey}): name must be a non-empty string.`
      );
    }

    if (!Array.isArray(student.skills)) {
      throw new TypeError(
        `Invalid student record (${idKey}): skills must be an array.`
      );
    }

    for (let j = 0; j < student.skills.length; j++) {
      const skill = student.skills[j];
      if (typeof skill !== "string" || skill.trim() === "") {
        throw new Error(
          `Invalid student record (${idKey}): skill at index ${j} must be a non-empty string.`
        );
      }
    }

    if (
      typeof student.availability !== "number" ||
      Number.isNaN(student.availability) ||
      student.availability < 0 ||
      student.availability > 100
    ) {
      throw new RangeError(
        `Invalid student record (${idKey}): availability must be a number between 0 and 100.`
      );
    }
  }

  if (!Array.isArray(requiredSkills)) {
    throw new TypeError("Invalid requiredSkills: expected an array.");
  }

  for (let i = 0; i < requiredSkills.length; i++) {
    const skill = requiredSkills[i];
    if (typeof skill !== "string" || skill.trim() === "") {
      throw new Error(
        `Invalid required skill at index ${i}: skill must be a non-empty string.`
      );
    }
  }

  if (
    typeof teamSize !== "number" ||
    Number.isNaN(teamSize) ||
    !Number.isInteger(teamSize) ||
    teamSize < 0
  ) {
    throw new TypeError("Invalid teamSize: expected a non-negative integer.");
  }
}

/**
 * Deduplicates and normalizes required skills while preserving first-occurrence order and casing.
 *
 * @param {string[]} requiredSkills
 * @returns {{ dedupedReadable: string[], normalized: string[] }}
 */
function normalizeRequirements(requiredSkills) {
  const seen = new Set();
  const dedupedReadable = [];
  const normalized = [];

  for (const rawSkill of requiredSkills) {
    const trimmed = rawSkill.trim();
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      dedupedReadable.push(trimmed);
      normalized.push(lower);
    }
  }

  return { dedupedReadable, normalized };
}

/**
 * Calculates total combinations sum_{k=1..maxK} nCr(n, k)
 *
 * @param {number} n
 * @param {number} maxK
 * @returns {number}
 */
function countTotalCombinations(n, maxK) {
  let total = 0;
  for (let k = 1; k <= maxK; k++) {
    let c = 1;
    for (let i = 1; i <= k; i++) {
      c = (c * (n - i + 1)) / i;
    }
    total += c;
  }
  return total;
}

/**
 * Evaluates candidate team metrics according to required coverage, availability, and score rules.
 *
 * @param {Array<{ original: object, idStr: string, availability: number, skillSet: Set<string> }>} candidateMetaTeam
 * @param {string[]} dedupedReadable
 * @param {string[]} normalizedReqs
 */
function evaluateCandidate(candidateMetaTeam, dedupedReadable, normalizedReqs) {
  const coveredSkills = [];
  const missingSkills = [];

  for (let i = 0; i < normalizedReqs.length; i++) {
    const reqNorm = normalizedReqs[i];
    let isCovered = false;
    for (let j = 0; j < candidateMetaTeam.length; j++) {
      if (candidateMetaTeam[j].skillSet.has(reqNorm)) {
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
  const coveragePercentage = round2(
    (coveredCount / dedupedReadable.length) * 100
  );

  let sumAvailability = 0;
  for (let j = 0; j < candidateMetaTeam.length; j++) {
    sumAvailability += candidateMetaTeam[j].availability;
  }
  const rawAverageAvailability = sumAvailability / candidateMetaTeam.length;
  const averageAvailability = round2(rawAverageAvailability);

  const score = round2(
    0.90 * coveragePercentage + 0.10 * averageAvailability
  );

  const sortedIds = candidateMetaTeam.map((m) => m.idStr).sort();

  return {
    team: candidateMetaTeam.map((m) => m.original),
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
 * Compares two candidate teams lexicographically according to the exact 5 ranking rules:
 * 1. Maximum number of distinct required skills covered.
 * 2. Maximum coverage percentage.
 * 3. Highest average member availability.
 * 4. Smallest team size.
 * 5. Lexicographically sorted student IDs for deterministic tie-breaking.
 *
 * @param {object} cand
 * @param {object | null} best
 * @returns {boolean} True if cand strictly ranks higher than best
 */
function isCandidateBetter(cand, best) {
  if (!best) return true;

  // Rule 1: Maximum number of distinct required skills covered
  if (cand.coveredCount !== best.coveredCount) {
    return cand.coveredCount > best.coveredCount;
  }

  // Rule 2: Maximum coverage percentage
  if (cand.coveragePercentage !== best.coveragePercentage) {
    return cand.coveragePercentage > best.coveragePercentage;
  }

  // Rule 3: Highest average member availability
  if (cand.averageAvailability !== best.averageAvailability) {
    return cand.averageAvailability > best.averageAvailability;
  }
  if (cand.rawAverageAvailability !== best.rawAverageAvailability) {
    return cand.rawAverageAvailability > best.rawAverageAvailability;
  }

  // Rule 4: Smallest team size
  if (cand.team.length !== best.team.length) {
    return cand.team.length < best.team.length;
  }

  // Rule 5: Lexicographically sorted student IDs for deterministic tie-breaking
  for (let i = 0; i < cand.sortedIds.length; i++) {
    if (cand.sortedIds[i] < best.sortedIds[i]) return true;
    if (cand.sortedIds[i] > best.sortedIds[i]) return false;
  }

  return false;
}

/**
 * Generates the optimal team of students for a given set of required skills and team size limit.
 *
 * @param {Array<{ id: string | number, name: string, skills: string[], availability: number }>} students
 * @param {string[]} requiredSkills
 * @param {number} teamSize
 * @returns {{
 *   team: Array<object>,
 *   coveredSkills: string[],
 *   missingSkills: string[],
 *   coveragePercentage: number,
 *   averageAvailability: number,
 *   score: number
 * }}
 */
export function generateTeam(students, requiredSkills, teamSize) {
  validateInputs(students, requiredSkills, teamSize);

  const { dedupedReadable, normalized } = normalizeRequirements(requiredSkills);

  // Edge case: Empty requirements
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

  // Edge cases: teamSize 0 or empty students pool
  if (teamSize === 0 || students.length === 0) {
    return {
      team: [],
      coveredSkills: [],
      missingSkills: [...dedupedReadable],
      coveragePercentage: 0,
      averageAvailability: 0,
      score: 0,
    };
  }

  const maxTeamSize = Math.min(teamSize, students.length);

  // Safety limit check for exhaustive search
  const totalCombinations = countTotalCombinations(students.length, maxTeamSize);
  if (totalCombinations > MAX_COMBINATIONS) {
    throw new Error(
      `Exhaustive combination search exceeds safety limit: ${totalCombinations} combinations would be evaluated, exceeding MAX_COMBINATIONS (${MAX_COMBINATIONS}). To find an exact optimum, reduce the student pool or team size.`
    );
  }

  // Pre-process student metadata without mutating original objects
  const studentMeta = students.map((s) => ({
    original: s,
    idStr: String(s.id),
    availability: s.availability,
    skillSet: new Set(s.skills.map((sk) => sk.trim().toLowerCase())),
  }));

  let bestCandidate = null;

  // Enumerate all nonempty combinations with sizes from 1 through maxTeamSize
  for (let size = 1; size <= maxTeamSize; size++) {
    const currentCombo = [];

    function findCombos(startIndex) {
      if (currentCombo.length === size) {
        const evaluated = evaluateCandidate(currentCombo, dedupedReadable, normalized);
        if (isCandidateBetter(evaluated, bestCandidate)) {
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

  return {
    team: bestCandidate.team,
    coveredSkills: bestCandidate.coveredSkills,
    missingSkills: bestCandidate.missingSkills,
    coveragePercentage: bestCandidate.coveragePercentage,
    averageAvailability: bestCandidate.averageAvailability,
    score: bestCandidate.score,
  };
}
