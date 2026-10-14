function Hero({ onBuildClick }) {
return ( <section className="hero" id="home"> <h1>
Find Your Perfect <span>Team</span> </h1>


  <p>
    Connect skills, discover talent, and build your dream team
    for your next big project.
  </p>

  <button className="hero-btn" onClick={onBuildClick}>
    Build Your Team →
  </button>
</section>

)
}

export default Hero
