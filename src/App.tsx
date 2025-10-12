import React from 'react'
import Navbar from './components/Navbar/navbar'
import Hero from './components/Hero/hero'
import AnimationEffect from './animations/fadein'


function App() {

  return (
    <div className="min-h-screen">
      <AnimationEffect reverse={true} delay={1.3}>
        <Navbar />
      </AnimationEffect>
      <Hero />
    </div>
  )
}

export default App
