import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TeamBuilder from './components/TeamBuilder'

function App() {
const [showBuilder, setShowBuilder] = useState(false)

return ( <div> <Navbar />


   {showBuilder ? (
  <TeamBuilder onBack={() => setShowBuilder(false)} />
) : (
  <Hero onBuildClick={() => setShowBuilder(true)} />
)}
</div>


)
}

export default App
