function Navbar() {
  return (
    <nav className="navbar">
      <h2>SkillBridge</h2>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#projects">Find Team</a>
        <a href="#about">About</a>
      </div>

      <button className="login-btn">Get Started</button>
    </nav>
  )
}

export default Navbar