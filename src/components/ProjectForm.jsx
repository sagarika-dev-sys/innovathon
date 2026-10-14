import { useState } from 'react'

function ProjectForm() {
const [projectName, setProjectName] = useState('')
const [teamSize, setTeamSize] = useState('3')
const [selectedSkills, setSelectedSkills] = useState([])

const skills = [
'React',
'JavaScript',
'HTML/CSS',
'Node.js',
'Python',
'Java',
'C++',
'UI/UX Design'
]

const toggleSkill = (skill) => {
if (selectedSkills.includes(skill)) {
setSelectedSkills(selectedSkills.filter((s) => s !== skill))
} else {
setSelectedSkills([...selectedSkills, skill])
}
}

const handleSubmit = async (e) => {
  e.preventDefault();

  if (selectedSkills.length === 0) {
    alert('Please select at least one skill!');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectName,
        selectedSkills,
        teamSize: Number(teamSize) // Ensure it sends as a number, not a string
      })
    });

    if (response.ok) {
      alert('Project successfully saved to the database! 🚀');
      setProjectName('');
      setSelectedSkills([]);
      setTeamSize('3');
    } else {
      alert('Error saving project.');
    }
  } catch (error) {
    console.error('Failed to create project:', error);
  }
};
return (
<section className="project-section" id="projects">
<div className="form-card">
<h2>Build Your Dream Team</h2>

    <p className="form-description">
      Tell us about your project and choose the skills you need.
    </p>

    <form onSubmit={handleSubmit}>
      <label htmlFor="projectName">Project Name</label>

      <input
        id="projectName"
        type="text"
        placeholder="Enter your project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        required
      />

      <label>Required Skills</label>

      <div className="skills-container">
        {skills.map((skill) => (
          <button
            type="button"
            key={skill}
            className={`skill-btn ${
              selectedSkills.includes(skill) ? 'selected' : ''
            }`}
            onClick={() => toggleSkill(skill)}
          >
            {selectedSkills.includes(skill) ? '✓ ' : '+ '}
            {skill}
          </button>
        ))}
      </div>

      <label htmlFor="teamSize">Team Size</label>

      <select
        id="teamSize"
        value={teamSize}
        onChange={(e) => setTeamSize(e.target.value)}
      >
        <option value="2">2 Members</option>
        <option value="3">3 Members</option>
        <option value="4">4 Members</option>
        <option value="5">5 Members</option>
        <option value="6">6 Members</option>
      </select>

      <button type="submit" className="generate-btn">
        Generate Best Team →
      </button>
    </form>
  </div>
</section>

)
}

export default ProjectForm
