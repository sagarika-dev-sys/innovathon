# SkillBridge Team-Matching Algorithm

A deterministic, dependency-free JavaScript student team-matching engine that pairs students into optimal project teams based on complementary skill coverage, member availability, and team-size efficiency.

---

## 1. Overview & Problem Statement

Students frequently encounter obstacles finding campus peers with complementary skills for academic projects, hackathons, and capstone collaborations. 

SkillBridge solves this with a deterministic combinatorial matching algorithm that identifies the optimal student team from an available applicant pool for any set of project requirements, guaranteeing:
- **Maximum skill coverage**: Project requirements are prioritized above all else.
- **High member availability**: Among candidate teams that maximize skill coverage, teams with higher availability are favored.
- **Lean team sizing**: Teams do not needlessly fill slots if fewer students can satisfy the project needs.
- **100% Deterministic output**: Given identical inputs, the algorithm always produces identical selections and stable tie-breaking.
- **Zero external dependencies**: Built in pure modern JavaScript (ES Modules) using Node.js built-ins (`node:test` and `node:assert/strict`).

---

## 2. Module Exports & Import Signature

The algorithm is exported as an independent ES module with `.js` extensions:

```javascript
import { generateTeam, MAX_COMBINATIONS, round2 } from "./src/utils/matchingAlgorithm.js";
import { students } from "./src/data/students.js";
```

### Function Signature

```javascript
generateTeam(students, requiredSkills, teamSize)
```

- **`students`** (`Array<Object>`): Array of student profile records.
- **`requiredSkills`** (`Array<string>`): Target skill names required for the project.
- **`teamSize`** (`number`): Maximum allowed team members (non-negative integer).

Returns a match result object synchronously.

---

## 3. Schemas

### Input: Student Profile Record

Each element in `students` must conform to:

```typescript
{
  id: string | number;        // Unique, non-empty identifier
  name: string;               // Non-empty student name
  skills: string[];           // Array of non-empty skill strings
  availability: number;       // Availability score between 0 and 100 inclusive
}
```

### Output: Matching Result Contract

```typescript
{
  team: Object[];             // Original student objects from input array
  coveredSkills: string[];    // Readable required skill names covered (first-occurrence order)
  missingSkills: string[];    // Readable required skill names not covered (first-occurrence order)
  coveragePercentage: number; // Percentage of required skills covered (0.00 – 100.00)
  averageAvailability: number;// Mean availability score of selected team members (0.00 – 100.00)
  score: number;              // Informational weighted score (0.00 – 100.00)
}
```

---

## 4. Input Validation & Skill Normalization

### Validation Rules
- **`students`**: Must be a valid JavaScript Array.
- **Student Records**: Must be plain objects with:
  - `id`: Non-empty string or number, unique across the pool (throws `Error` if duplicate IDs exist).
  - `name`: Non-empty string.
  - `skills`: Array containing only non-empty strings.
  - `availability`: Numeric value in range `[0, 100]` (throws `RangeError` if out of bounds).
- **`requiredSkills`**: Must be a valid JavaScript Array containing only non-empty strings.
- **`teamSize`**: Must be a non-negative integer (`0, 1, 2, ...`). Throws `TypeError` for floats, negatives, or non-numeric types.
- **Input Immutability**: Input arrays and student objects are **never mutated**. Original student object references are preserved in the returned team.

### Skill Normalization & Deduplication
- Matching is **case-insensitive** and **trims surrounding whitespace**. For example, `"React"`, `"react"`, and `" REACT "` match equivalently.
- `requiredSkills` are deduplicated while preserving their **first-occurrence order and readable casing**.
- Both `coveredSkills` and `missingSkills` in the output strictly preserve this first-occurrence deduplicated order.

---

## 5. Team Generation & Optimization Logic

### Exhaustive Combinatorial Search
Rather than using a greedy heuristic or random selection, the algorithm exhaustively evaluates all candidate combinations of distinct students of sizes:

$$\text{size} \in [1, \min(\text{teamSize}, N)]$$

where $N$ is the count of available students.

> **Note:** The algorithm does **not** blindly fill every slot up to `teamSize`. If a single student or a pair covers all required skills with superior availability, redundant members are omitted.

### Lexicographical Ranking Hierarchy
Candidate teams are ranked lexicographically by these exact criteria in descending priority:

1. **Maximum number of distinct required skills covered**
2. **Maximum coverage percentage**
3. **Highest average member availability**
4. **Smallest team size** (prefers leaner teams when coverage and availability tie)
5. **Lexicographically sorted student IDs** for deterministic tie-breaking

> **Critical Guarantee:** Availability **never** outweighs skill coverage. A team covering 100% of skills with 30% availability will always beat a team covering 80% of skills with 100% availability.

### Informational Score Calculation
The output provides an informational score:

$$\text{score} = \text{round}_2(0.90 \times \text{coveragePercentage} + 0.10 \times \text{averageAvailability})$$

Both `score` and `averageAvailability` are rounded to two decimal places. This score is informational only; winning team selection strictly follows the 5-tier ranking hierarchy above.

---

## 6. Edge Cases Handled

| Edge Case | `team` | `coveredSkills` | `missingSkills` | `coveragePercentage` | `averageAvailability` | `score` |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Empty requirements** (`[]`) | `[]` | `[]` | `[]` | `0` | `0` | `0` |
| **`teamSize` = 0** | `[]` | `[]` | All deduplicated requirements | `0` | `0` | `0` |
| **Empty student pool** (`[]`) | `[]` | `[]` | All deduplicated requirements | `0` | `0` | `0` |
| **Partially satisfiable** | Best team | Covered subset | Missing subset | `(covered/total)*100` | Team mean | Calculated |
| **`teamSize` > student count** | Best team ($\le N$) | Based on selection | Based on selection | Based on selection | Team mean | Calculated |

---

## 7. Complexity & Computational Limits

- **Combinatorial Space**: For $N$ students and max team size $K = \min(\text{teamSize}, N)$, the number of evaluated candidate teams is:

  $$\sum_{k=1}^K \binom{N}{k}$$

- **Time Complexity**: $O\left(\sum_{k=1}^K \binom{N}{k} \cdot (R \cdot k)\right)$, where $R$ is the number of distinct required skills.
- **Space Complexity**: $O(N \cdot S + R + K)$ where $S$ is average skills per student. Candidates are traversed depth-first in-place, keeping only the current best candidate in memory.
- **Explicit Safety Limit**: To protect against runaway combinatorial explosion on large inputs, an explicit threshold is enforced:
  
  $$\text{MAX\_COMBINATIONS} = 500,000$$

  If the total candidate combinations exceed `MAX_COMBINATIONS`, an explicit error is thrown explaining the computational limit rather than silently returning an approximate or suboptimal result.

---

## 8. Runnable Usage Example

Create a file (e.g. `example.js`) or execute directly in Node:

```javascript
import { generateTeam } from "./src/utils/matchingAlgorithm.js";
import { students } from "./src/data/students.js";

// Define project requirements
const requiredSkills = ["React", "Node.js", "MongoDB", "UI/UX"];
const maxTeamSize = 3;

// Execute matching
const result = generateTeam(students, requiredSkills, maxTeamSize);

console.log("=== Selected Team ===");
console.log(result.team.map((s) => `- ${s.name} (${s.id}) [Availability: ${s.availability}%]`).join("\n"));

console.log("\n=== Match Metrics ===");
console.log(`Coverage: ${result.coveragePercentage}%`);
console.log(`Covered Skills: ${result.coveredSkills.join(", ")}`);
console.log(`Missing Skills: ${result.missingSkills.length > 0 ? result.missingSkills.join(", ") : "None"}`);
console.log(`Average Availability: ${result.averageAvailability}%`);
console.log(`Overall Score: ${result.score}`);
```

---

## 9. Integrating Real Student Profiles

To use real student profiles from your database, API, or user input:

1. Map your records to conform to the `{ id, name, skills, availability }` schema.
2. Ensure `availability` is a number from `0` to `100`.
3. Pass the array directly into `generateTeam`.

```javascript
// Example: Mapping database models or API payloads
const dbUsers = await fetchCampusStudents();

const students = dbUsers.map((user) => ({
  id: user._id.toString(),
  name: `${user.firstName} ${user.lastName}`,
  skills: user.profile.skillsList || [],
  availability: Math.min(100, Math.max(0, user.weeklyAvailableHours * 5)), // e.g., 20 hrs/wk = 100%
}));

const match = generateTeam(students, ["Python", "Machine Learning", "Documentation"], 3);
```

---

## 10. Automated Testing

The algorithm is backed by 27 unit tests using Node's built-in test runner (`node:test` and `node:assert/strict`), covering:

1. Full skill coverage
2. Partial coverage and missing skills
3. Single-student full coverage (omitting redundant members)
4. Equal coverage with different availability
5. Skill priority over availability
6. Team-size limit of one
7. Team-size zero
8. Team size exceeding student count
9. Empty student list
10. Empty requirements
11. Duplicate requirements with varying casing
12. Case-insensitive matching and whitespace trimming
13. Duplicate student IDs
14. Availability below 0 or above 100
15. Missing or malformed skills
16. Negative and non-integer team sizes
17. Input immutability
18. Absence of duplicate students in teams
19. Exact mathematical calculations (coverage, availability, score)
20. Deterministic repeated executions
21. Stable lexicographical tie-breaking
22. Complementary students covering disparate domains
23. Non-array and malformed input arguments
24. Combination count exceeding safety limit
25. End-to-end matching on the sample dataset

### Running the Tests

To run the test suite with standard Node.js:

```bash
npm test
```

Or run directly:

```bash
node --test tests/matchingAlgorithm.test.js
```
