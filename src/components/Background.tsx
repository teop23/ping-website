import React, { useEffect, useRef } from 'react';

interface Blob {
  x: number;
  y: number;
  radius: number;
  angle: number;
  velocity: number;
  opacity: number;
}

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Create animated blobs
    const blobs: Blob[] = Array.from({ length: 3 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 400 + 300,
      angle: Math.random() * Math.PI * 2,
      velocity: 0.0002,
      opacity: Math.random() * 0.03 + 0.01
    }));

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Clear with solid background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw blobs
      blobs.forEach(blob => {
        // Orbital movement
        blob.angle += blob.velocity;
        const orbitRadius = Math.min(canvas.width, canvas.height) * 0.2;
        blob.x = canvas.width/2 + Math.cos(blob.angle) * orbitRadius;
        blob.y = canvas.height/2 + Math.sin(blob.angle) * orbitRadius;

        // Draw with extreme blur
        ctx.save();
        ctx.filter = 'blur(150px)';
        
        const blobGradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        blobGradient.addColorStop(0, `rgba(0, 0, 0, ${blob.opacity})`);
        blobGradient.addColorStop(0.6, `rgba(0, 0, 0, ${blob.opacity * 0.3})`);
        blobGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = blobGradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
};

export default Background;