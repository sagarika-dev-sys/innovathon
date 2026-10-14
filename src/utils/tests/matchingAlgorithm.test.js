import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateTeam, round2, MAX_COMBINATIONS } from "../src/utils/matchingAlgorithm.js";
import { students as sampleStudents } from "../src/data/students.js";

describe("SkillBridge Student Team-Matching Algorithm", () => {
  // 1. Full skill coverage
  it("Scenario 1: Full skill coverage when complementary students satisfy all requirements", () => {
    const students = [
      { id: "s1", name: "Alice", skills: ["React", "CSS"], availability: 80 },
      { id: "s2", name: "Bob", skills: ["Node.js", "MongoDB"], availability: 85 },
      { id: "s3", name: "Charlie", skills: ["Python"], availability: 90 },
    ];
    const requirements = ["React", "Node.js", "MongoDB"];
    const result = generateTeam(students, requirements, 2);

    assert.strictEqual(result.coveragePercentage, 100);
    assert.deepStrictEqual(result.coveredSkills, ["React", "Node.js", "MongoDB"]);
    assert.deepStrictEqual(result.missingSkills, []);
    assert.strictEqual(result.team.length, 2);
    const selectedIds = result.team.map((s) => s.id);
    assert.deepStrictEqual(selectedIds, ["s1", "s2"]);
    assert.strictEqual(result.averageAvailability, 82.5);
    // score = 0.90 * 100 + 0.10 * 82.5 = 90 + 8.25 = 98.25
    assert.strictEqual(result.score, 98.25);
  });

  // 2. Partial coverage and missing skills
  it("Scenario 2: Partial coverage and identifying missing skills", () => {
    const students = [
      { id: "s1", name: "Alice", skills: ["React"], availability: 80 },
      { id: "s2", name: "Bob", skills: ["Python"], availability: 70 },
    ];
    const requirements = ["React", "Python", "Rust", "Golang"];
    const result = generateTeam(students, requirements, 2);

    assert.strictEqual(result.team.length, 2);
    assert.deepStrictEqual(result.coveredSkills, ["React", "Python"]);
    assert.deepStrictEqual(result.missingSkills, ["Rust", "Golang"]);
    // 2 / 4 = 50.0%
    assert.strictEqual(result.coveragePercentage, 50);
    assert.strictEqual(result.averageAvailability, 75);
    // score = 0.90 * 50 + 0.10 * 75 = 45 + 7.5 = 52.5
    assert.strictEqual(result.score, 52.5);
  });

  // 3. One student covers everything; avoid unnecessary members
  it("Scenario 3: One student covers everything; avoids unnecessary members", () => {
    const students = [
      { id: "s1", name: "Solo Star", skills: ["React", "Node.js", "MongoDB", "UI/UX"], availability: 85 },
      { id: "s2", name: "Extra Person", skills: ["React"], availability: 80 },
      { id: "s3", name: "Another Helper", skills: ["Node.js"], availability: 70 },
    ];
    const requirements = ["React", "Node.js", "MongoDB", "UI/UX"];
    // teamSize allows up to 3 members, but size 1 already achieves 100% coverage with highest availability
    const result = generateTeam(students, requirements, 3);

    assert.strictEqual(result.team.length, 1);
    assert.strictEqual(result.team[0].id, "s1");
    assert.strictEqual(result.coveragePercentage, 100);
    assert.deepStrictEqual(result.coveredSkills, ["React", "Node.js", "MongoDB", "UI/UX"]);
    assert.deepStrictEqual(result.missingSkills, []);
    assert.strictEqual(result.averageAvailability, 85);
    assert.strictEqual(result.score, 98.5);
  });

  // 4. Equal coverage, different availability
  it("Scenario 4: Equal coverage chooses higher availability", () => {
    const students = [
      { id: "s1", name: "Low Avail", skills: ["React", "Node.js"], availability: 60 },
      { id: "s2", name: "High Avail", skills: ["React", "Node.js"], availability: 95 },
    ];
    const requirements = ["React", "Node.js"];
    const result = generateTeam(students, requirements, 1);

    assert.strictEqual(result.team.length, 1);
    assert.strictEqual(result.team[0].id, "s2");
    assert.strictEqual(result.averageAvailability, 95);
    assert.strictEqual(result.coveragePercentage, 100);
  });

  // 5. Complete but less available team beats incomplete but highly available team
  it("Scenario 5: Complete but less available team beats incomplete but highly available team", () => {
    const students = [
      { id: "s1", name: "Full Coverage Low Avail", skills: ["React", "Node.js", "PostgreSQL"], availability: 20 },
      { id: "s2", name: "Partial High Avail", skills: ["React"], availability: 100 },
    ];
    const requirements = ["React", "Node.js", "PostgreSQL"];
    const result = generateTeam(students, requirements, 1);

    // Rule 1: Skill coverage strictly takes priority over availability
    assert.strictEqual(result.team.length, 1);
    assert.strictEqual(result.team[0].id, "s1");
    assert.strictEqual(result.coveragePercentage, 100);
    assert.strictEqual(result.averageAvailability, 20);
    // score: 0.90 * 100 + 0.10 * 20 = 92.0
    // (Note: weighted score for s2 would be 0.9*33.33 + 0.1*100 = 40.0)
    assert.strictEqual(result.score, 92);
  });

  // 6. Team-size limit of one
  it("Scenario 6: Team-size limit of one is strictly respected", () => {
    const students = [
      { id: "s1", name: "Frontend", skills: ["React"], availability: 80 },
      { id: "s2", name: "Backend", skills: ["Node.js"], availability: 80 },
    ];
    const requirements = ["React", "Node.js"];
    const result = generateTeam(students, requirements, 1);

    assert.strictEqual(result.team.length, 1);
    assert.strictEqual(result.coveragePercentage, 50);
  });

  // 7. Team-size zero
  it("Scenario 7: Team-size zero returns empty team and all requirements missing", () => {
    const students = [
      { id: "s1", name: "Alice", skills: ["React", "Node.js"], availability: 90 },
    ];
    const requirements = ["React", "Node.js"];
    const result = generateTeam(students, requirements, 0);

    assert.deepStrictEqual(result.team, []);
    assert.deepStrictEqual(result.coveredSkills, []);
    assert.deepStrictEqual(result.missingSkills, ["React", "Node.js"]);
    assert.strictEqual(result.coveragePercentage, 0);
    assert.strictEqual(result.averageAvailability, 0);
    assert.strictEqual(result.score, 0);
  });

  // 8. Team size exceeding student count
  it("Scenario 8: Team size exceeding student count uses at most all available students", () => {
    const students = [
      { id: "s1", name: "Alice", skills: ["React"], availability: 80 },
      { id: "s2", name: "Bob", skills: ["Node.js"], availability: 90 },
    ];
    const requirements = ["React", "Node.js", "Docker"];
    const result = generateTeam(students, requirements, 10);

    assert.strictEqual(result.team.length, 2);
    assert.deepStrictEqual(result.coveredSkills, ["React", "Node.js"]);
    assert.deepStrictEqual(result.missingSkills, ["Docker"]);
    // 2 / 3 = 66.67%
    assert.strictEqual(result.coveragePercentage, 66.67);
  });

  // 9. Empty student list
  it("Scenario 9: Empty student list returns empty team with every requirement missing", () => {
    const students = [];
    const requirements = ["React", "Python"];
    const result = generateTeam(students, requirements, 3);

    assert.deepStrictEqual(result.team, []);
    assert.deepStrictEqual(result.coveredSkills, []);
    assert.deepStrictEqual(result.missingSkills, ["React", "Python"]);
    assert.strictEqual(result.coveragePercentage, 0);
    assert.strictEqual(result.averageAvailability, 0);
    assert.strictEqual(result.score, 0);
  });

  // 10. Empty requirements
  it("Scenario 10: Empty requirements returns empty recommendation and zeroed metrics", () => {
    const students = [
      { id: "s1", name: "Alice", skills: ["React"], availability: 90 },
    ];
    const result = generateTeam(students, [], 2);

    assert.deepStrictEqual(result.team, []);
    assert.deepStrictEqual(result.coveredSkills, []);
    assert.deepStrictEqual(result.missingSkills, []);
    assert.strictEqual(result.coveragePercentage, 0);
    assert.strictEqual(result.averageAvailability, 0);
    assert.strictEqual(result.score, 0);
  });

  // 11. Duplicate requirements with different capitalization
  it("Scenario 11: Duplicate requirements with different capitalization are deduplicated", () => {
    const students = [
      { id: "s1", name: "Alice", skills: ["React", "node.js"], availability: 80 },
    ];
    const requirements = ["React", "REACT", "react", "Node.js", "NODE.JS", "node.js"];
    const result = generateTeam(students, requirements, 1);

    // Preserves first-occurrence order and readable casing: "React", "Node.js"
    assert.deepStrictEqual(result.coveredSkills, ["React", "Node.js"]);
    assert.deepStrictEqual(result.missingSkills, []);
    assert.strictEqual(result.coveragePercentage, 100);
  });

  // 12. Case-insensitive matching and whitespace trimming
  it("Scenario 12: Case-insensitive matching and whitespace trimming match equivalently", () => {
    const students = [
      { id: "s1", name: "Alice", skills: ["  rEaCt  ", " NODE.JS "], availability: 80 },
    ];
    const requirements = ["  React  ", "node.js "];
    const result = generateTeam(students, requirements, 1);

    assert.strictEqual(result.coveragePercentage, 100);
    assert.deepStrictEqual(result.coveredSkills, ["React", "node.js"]);
    assert.deepStrictEqual(result.missingSkills, []);
  });

  // 13. Duplicate student IDs
  it("Scenario 13: Duplicate student IDs throw a clear error", () => {
    const students = [
      { id: "dup-1", name: "Alice", skills: ["React"], availability: 80 },
      { id: "dup-1", name: "Bob", skills: ["Node.js"], availability: 85 },
    ];
    assert.throws(
      () => generateTeam(students, ["React"], 2),
      /Duplicate student ID found: dup-1/
    );
  });

  // 14. Availability below 0 or above 100
  it("Scenario 14: Availability below 0 or above 100 throws RangeError", () => {
    const lowAvail = [
      { id: "s1", name: "Alice", skills: ["React"], availability: -1 },
    ];
    assert.throws(
      () => generateTeam(lowAvail, ["React"], 1),
      (err) => err instanceof RangeError && err.message.includes("availability")
    );

    const highAvail = [
      { id: "s2", name: "Bob", skills: ["React"], availability: 101 },
    ];
    assert.throws(
      () => generateTeam(highAvail, ["React"], 1),
      (err) => err instanceof RangeError && err.message.includes("availability")
    );
  });

  // 15. Missing or malformed skills
  it("Scenario 15: Missing or malformed skills throw clear errors", () => {
    // Non-array skills
    assert.throws(
      () => generateTeam([{ id: "s1", name: "Alice", skills: "React", availability: 80 }], ["React"], 1),
      /skills must be an array/
    );

    // Skill containing non-string
    assert.throws(
      () => generateTeam([{ id: "s1", name: "Alice", skills: [123], availability: 80 }], ["React"], 1),
      /must be a non-empty string/
    );

    // Empty skill string in student
    assert.throws(
      () => generateTeam([{ id: "s1", name: "Alice", skills: ["  "], availability: 80 }], ["React"], 1),
      /must be a non-empty string/
    );

    // Malformed requiredSkills
    assert.throws(
      () => generateTeam([{ id: "s1", name: "Alice", skills: ["React"], availability: 80 }], ["React", 42], 1),
      /must be a non-empty string/
    );
  });

  // 16. Negative and non-integer team sizes
  it("Scenario 16: Negative and non-integer team sizes throw TypeError", () => {
    const students = [{ id: "s1", name: "Alice", skills: ["React"], availability: 80 }];

    assert.throws(() => generateTeam(students, ["React"], -1), TypeError);
    assert.throws(() => generateTeam(students, ["React"], 1.5), TypeError);
    assert.throws(() => generateTeam(students, ["React"], "2"), TypeError);
    assert.throws(() => generateTeam(students, ["React"], NaN), TypeError);
    assert.throws(() => generateTeam(students, ["React"], null), TypeError);
  });

  // 17. Input immutability
  it("Scenario 17: Input data is not mutated during team generation", () => {
    const originalStudents = [
      { id: "s1", name: "Alice", skills: [" React ", "CSS"], availability: 85 },
      { id: "s2", name: "Bob", skills: ["Node.js", " SQL "], availability: 90 },
    ];
    // Deep clone snapshot before call
    const snapshotBefore = JSON.stringify(originalStudents);
    const requirements = ["React", "Node.js"];
    const requirementsSnapshot = JSON.stringify(requirements);

    const result = generateTeam(originalStudents, requirements, 2);

    // Verify original arrays and objects are untouched
    assert.strictEqual(JSON.stringify(originalStudents), snapshotBefore);
    assert.strictEqual(JSON.stringify(requirements), requirementsSnapshot);

    // Verify selected team members are original object references
    assert.strictEqual(result.team[0], originalStudents[0]);
    assert.strictEqual(result.team[1], originalStudents[1]);
  });

  // 18. No duplicate students in a team
  it("Scenario 18: No duplicate students exist in the generated team", () => {
    const students = [
      { id: "s1", name: "Alice", skills: ["React", "TypeScript"], availability: 80 },
      { id: "s2", name: "Bob", skills: ["Node.js", "Express"], availability: 85 },
      { id: "s3", name: "Charlie", skills: ["MongoDB", "Docker"], availability: 90 },
    ];
    const result = generateTeam(students, ["React", "Node.js", "MongoDB"], 3);

    const idSet = new Set(result.team.map((s) => s.id));
    assert.strictEqual(idSet.size, result.team.length);
  });

  // 19. Correct coverage, availability, and score calculations
  it("Scenario 19: Mathematical correctness of coveragePercentage, averageAvailability, and score", () => {
    const students = [
      { id: "s1", name: "Aria", skills: ["React"], availability: 70 },
      { id: "s2", name: "Devon", skills: ["Node.js"], availability: 85 },
    ];
    // 2 covered out of 3 requirements: 2 / 3 * 100 = 66.6666... rounded to 66.67
    const requirements = ["React", "Node.js", "Rust"];
    const result = generateTeam(students, requirements, 2);

    assert.strictEqual(result.coveragePercentage, 66.67);
    // (70 + 85) / 2 = 77.5
    assert.strictEqual(result.averageAvailability, 77.5);
    // score = 0.90 * 66.67 + 0.10 * 77.5 = 60.003 + 7.75 = 67.753 -> rounded to 67.75
    assert.strictEqual(result.score, 67.75);
  });

  // 20. Deterministic repeated calls
  it("Scenario 20: Deterministic repeated calls always yield identical results", () => {
    const requirements = ["React", "Node.js", "UI/UX", "Python", "C++"];
    const firstResult = generateTeam(sampleStudents, requirements, 3);

    for (let i = 0; i < 5; i++) {
      const subsequentResult = generateTeam(sampleStudents, requirements, 3);
      assert.deepStrictEqual(subsequentResult.coveragePercentage, firstResult.coveragePercentage);
      assert.deepStrictEqual(subsequentResult.averageAvailability, firstResult.averageAvailability);
      assert.deepStrictEqual(subsequentResult.score, firstResult.score);
      assert.deepStrictEqual(
        subsequentResult.team.map((s) => s.id),
        firstResult.team.map((s) => s.id)
      );
      assert.deepStrictEqual(subsequentResult.coveredSkills, firstResult.coveredSkills);
      assert.deepStrictEqual(subsequentResult.missingSkills, firstResult.missingSkills);
    }
  });

  // 21. Stable tie-breaking
  it("Scenario 21: Stable tie-breaking by lexicographical student IDs", () => {
    // Two students with identical skills and availability
    const studentA = { id: "alpha-01", name: "Alpha", skills: ["Go"], availability: 80 };
    const studentB = { id: "beta-02", name: "Beta", skills: ["Go"], availability: 80 };

    // Regardless of insertion order, "alpha-01" comes before "beta-02" lexicographically
    const result1 = generateTeam([studentA, studentB], ["Go"], 1);
    assert.strictEqual(result1.team[0].id, "alpha-01");

    const result2 = generateTeam([studentB, studentA], ["Go"], 1);
    assert.strictEqual(result2.team[0].id, "alpha-01");
  });

  // 22. Complementary students required to cover different skills
  it("Scenario 22: Complementary students required to cover distinct skills across domains", () => {
    const students = [
      { id: "s1", name: "Frontend Lead", skills: ["React", "UI/UX"], availability: 80 },
      { id: "s2", name: "Backend Lead", skills: ["Java", "Spring Boot"], availability: 80 },
      { id: "s3", name: "Data Engineer", skills: ["Python", "Machine Learning"], availability: 80 },
    ];
    const requirements = ["React", "Spring Boot", "Machine Learning"];
    const result = generateTeam(students, requirements, 3);

    assert.strictEqual(result.coveragePercentage, 100);
    assert.strictEqual(result.team.length, 3);
    assert.deepStrictEqual(result.coveredSkills, ["React", "Spring Boot", "Machine Learning"]);
    assert.deepStrictEqual(result.missingSkills, []);
  });

  // Additional edge cases & validation tests
  describe("Extended validation & boundary tests", () => {
    it("throws when students argument is not an array", () => {
      assert.throws(() => generateTeam(null, ["React"], 2), TypeError);
      assert.throws(() => generateTeam("not-an-array", ["React"], 2), TypeError);
      assert.throws(() => generateTeam({}, ["React"], 2), TypeError);
    });

    it("throws when a student record is invalid or missing required properties", () => {
      assert.throws(() => generateTeam([null], ["React"], 1), TypeError);
      assert.throws(() => generateTeam([{ id: "", name: "Alice", skills: [], availability: 50 }], ["React"], 1), Error);
      assert.throws(() => generateTeam([{ id: "s1", name: "", skills: [], availability: 50 }], ["React"], 1), Error);
    });

    it("throws when requiredSkills argument is not an array", () => {
      assert.throws(() => generateTeam([], "React", 2), TypeError);
    });

    it("throws when combination count exceeds MAX_COMBINATIONS safety limit", () => {
      // 30 students, teamSize 15 has 30C15 = 155,117,520 > MAX_COMBINATIONS (500,000)
      const manyStudents = Array.from({ length: 30 }, (_, i) => ({
        id: `s-${i}`,
        name: `Student ${i}`,
        skills: ["SkillA"],
        availability: 80,
      }));
      assert.throws(
        () => generateTeam(manyStudents, ["SkillA"], 15),
        /Exhaustive combination search exceeds safety limit/
      );
    });

    it("works accurately with the 16 sample students dataset", () => {
      assert.ok(sampleStudents.length >= 15);

      // Search for a typical 4-skill stack
      const result = generateTeam(
        sampleStudents,
        ["React", "Node.js", "MongoDB", "UI/UX"],
        3
      );

      assert.strictEqual(result.coveragePercentage, 100);
      assert.strictEqual(result.missingSkills.length, 0);
      assert.ok(result.team.length <= 3);
      assert.ok(result.score > 90);

      // Test rare and unsatisfiable skills
      const rareResult = generateTeam(
        sampleStudents,
        ["Quantum Computing", "NonExistentSkillXYZ"],
        2
      );
      assert.ok(rareResult.coveredSkills.includes("Quantum Computing"));
      assert.ok(rareResult.missingSkills.includes("NonExistentSkillXYZ"));
      assert.strictEqual(rareResult.coveragePercentage, 50);
    });
  });
});
