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
    const blobs: Blob[] = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 300 + 200,
      angle: Math.random() * Math.PI * 2,
      velocity: 0.0003,
      opacity: Math.random() * 0.04 + 0.02
    }));

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw blobs
      blobs.forEach(blob => {
        // Orbital movement
        blob.angle += blob.velocity;
        blob.x = canvas.width/2 + Math.cos(blob.angle) * 100;
        blob.y = canvas.height/2 + Math.sin(blob.angle) * 100;

        // Draw with extreme blur
        ctx.save();
        ctx.filter = 'blur(100px)';
        
        const blobGradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        blobGradient.addColorStop(0, `rgba(0, 0, 0, ${blob.opacity})`);
        blobGradient.addColorStop(0.5, `rgba(0, 0, 0, ${blob.opacity * 0.5})`);
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
      style={{ opacity: 0.7 }}
    />
  );
};

export default Background;