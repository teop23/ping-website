import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
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
    const particleCount = Math.min(8, Math.floor(window.innerWidth / 200)); // Fewer, larger particles
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 600 + 400, // Much larger sizes
        speedX: (Math.random() - 0.5) * 0.03, // Slower movement
        speedY: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.01 + 0.005 // Very low opacity
      });
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position with very slow movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around screen
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        
        // Draw extremely blurred circle
        ctx.beginPath();
        ctx.filter = 'blur(150px)'; // Increased blur
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, `rgba(0, 0, 0, ${particle.opacity})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';
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