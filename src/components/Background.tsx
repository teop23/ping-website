import React, { useEffect, useRef } from 'react';

interface Blob {
  x: number;
  y: number;
  radius: number;
  angle: number;
  velocity: number;
  opacity: number;
  hue: number;
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

    // Create animated blobs with colors
    const blobs: Blob[] = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 300 + 200,
      angle: Math.random() * Math.PI * 2,
      velocity: 0.0003 + Math.random() * 0.0002,
      opacity: Math.random() * 0.02 + 0.01,
      hue: i * 90 + Math.random() * 60 // Different hues for each blob
    }));

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.5, '#fafafa');
      gradient.addColorStop(1, '#f8fafc');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw blobs
      blobs.forEach((blob, index) => {
        // Orbital movement with different patterns
        blob.angle += blob.velocity;
        const orbitRadius = Math.min(canvas.width, canvas.height) * (0.15 + index * 0.05);
        const centerX = canvas.width / 2 + Math.sin(blob.angle * 0.5) * 100;
        const centerY = canvas.height / 2 + Math.cos(blob.angle * 0.3) * 50;
        
        blob.x = centerX + Math.cos(blob.angle) * orbitRadius;
        blob.y = centerY + Math.sin(blob.angle) * orbitRadius;

        // Draw with colorful blur
        ctx.save();
        ctx.filter = 'blur(120px)';
        
        const blobGradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        
        // Create HSL color with the blob's hue
        const color = `hsl(${blob.hue}, 70%, 60%)`;
        blobGradient.addColorStop(0, `hsla(${blob.hue}, 70%, 60%, ${blob.opacity})`);
        blobGradient.addColorStop(0.6, `hsla(${blob.hue}, 70%, 60%, ${blob.opacity * 0.3})`);
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
      style={{ opacity: 0.6 }}
    />
  );
};

export default Background;