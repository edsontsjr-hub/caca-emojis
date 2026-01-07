import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  speedX: number;
  speedY: number;
}

const COLORS = ['#FF69B4', '#FFD700', '#00BFFF', '#32CD32', '#FF4500'];

export const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Spawn particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: 50, // Start center
        y: 50,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random(),
        speedX: (Math.random() - 0.5) * 2, // Random spread X
        speedY: (Math.random() - 1) * 2 - 1, // Upwards initial velocity
      });
    }
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.speedX,
          y: p.y + p.speedY,
          speedY: p.speedY + 0.1, // Gravity
          rotation: p.rotation + 10,
        })).filter(p => p.y < 110) // Remove if off screen bottom
      );
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-4 h-4 rounded-full opacity-80"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
          }}
        />
      ))}
    </div>
  );
};