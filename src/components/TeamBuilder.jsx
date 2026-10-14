import ProjectForm from './ProjectForm'

function TeamBuilder({ onBack }) {
return ( <div className="team-builder"> <button className="back-btn" onClick={onBack}>
← Back to Home </button>


  <div className="team-builder-header">
    <h1>Build Your Dream Team 🚀</h1>
    <p>
      Tell us about your project, select the skills you need,
      and let SkillBridge find your perfect team!
    </p>
  </div>

  <ProjectForm />
</div>


)
}

export default TeamBuilder
