import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match window
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.min(40, Math.floor(window.innerWidth / 35));
    const colors = [
      'rgba(255, 0, 0, 0.015)',
      'rgba(255, 0, 0, 0.02)',
      'rgba(255, 0, 0, 0.03)'
    ];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 200 + 100,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around screen
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        // Draw particle
        // Draw rounded rectangle instead of circle
        ctx.beginPath();
        const radius = particle.size / 4;
        ctx.moveTo(particle.x + radius, particle.y);
        ctx.lineTo(particle.x + particle.size - radius, particle.y);
        ctx.quadraticCurveTo(particle.x + particle.size, particle.y, particle.x + particle.size, particle.y + radius);
        ctx.lineTo(particle.x + particle.size, particle.y + particle.size - radius);
        ctx.quadraticCurveTo(particle.x + particle.size, particle.y + particle.size, particle.x + particle.size - radius, particle.y + particle.size);
        ctx.lineTo(particle.x + radius, particle.y + particle.size);
        ctx.quadraticCurveTo(particle.x, particle.y + particle.size, particle.x, particle.y + particle.size - radius);
        ctx.lineTo(particle.x, particle.y + radius);
        ctx.quadraticCurveTo(particle.x, particle.y, particle.x + radius, particle.y);
        ctx.closePath();
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
    };
    
    const animationId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default ParticleBackground;