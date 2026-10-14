import { generateTeam } from "./src/utils/matchingAlgorithm.js";
import { students } from "./src/data/students.js";

// Example project requirements
const requiredSkills = ["React", "Node.js", "MongoDB", "UI/UX"];
const maxTeamSize = 3;

console.log("=== Running SkillBridge Team-Matching Algorithm ===");
console.log(`Required Skills: ${requiredSkills.join(", ")}`);
console.log(`Maximum Team Size: ${maxTeamSize}\n`);

const result = generateTeam(students, requiredSkills, maxTeamSize);

console.log("=== Selected Optimal Team ===");
result.team.forEach((member, index) => {
  console.log(`${index + 1}. ${member.name} (${member.id})`);
  console.log(`   Skills: ${member.skills.join(", ")}`);
  console.log(`   Availability: ${member.availability}%\n`);
});

console.log("=== Match Metrics ===");
console.log(`Covered Skills: ${result.coveredSkills.join(", ")}`);
console.log(`Missing Skills: ${result.missingSkills.length > 0 ? result.missingSkills.join(", ") : "None"}`);
console.log(`Coverage Percentage: ${result.coveragePercentage}%`);
console.log(`Average Availability: ${result.averageAvailability}%`);
console.log(`Informational Score: ${result.score}`);
