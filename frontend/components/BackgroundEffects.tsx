'use client'

import Aurora from './Aurora'
import Particles from './Particles'

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Aurora Background */}
      <div className="absolute inset-0 w-full h-full -z-30">
        <Aurora
          colorStops={["#4B0082", "#800080", "#FF69B4"]}
          speed={0.3}
          amplitude={1.2}
        />
      </div>

      {/* Particles Overlay */}
      <div className="absolute inset-0 w-full h-full -z-20">
        <Particles
          particleColors={['#B794F4', '#ED64A6', '#F687B3', '#9F7AEA']}
          particleCount={250}
          particleSpread={15}
          speed={0.15}
          particleBaseSize={150}
          moveParticlesOnHover={true}
          particleHoverFactor={1.2}
          alphaParticles={true}
          sizeRandomness={1.2}
          cameraDistance={15}
          disableRotation={false}
            
        />
      </div>
    </div>
  )
}
