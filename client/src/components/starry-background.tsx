import { useTheme } from "./theme-provider";
import { useEffect, useRef } from "react";

interface StarryBackgroundProps {
  className?: string;
}

export function StarryBackground({ className = "" }: StarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!canvasRef.current || theme !== "dark") return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Resize canvas to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawStars();
    };
    
    // Create stars
    const stars: { x: number; y: number; size: number; flickerSpeed: number; flicker: number; }[] = [];
    const createStars = () => {
      const numberOfStars = Math.floor(canvas.width * canvas.height / 1000);
      
      for (let i = 0; i < numberOfStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          flickerSpeed: 0.01 + Math.random() * 0.04,
          flicker: Math.random() * Math.PI
        });
      }
    };
    
    // Draw stars
    const drawStars = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.length = 0;
      createStars();
    };
    
    // Animate stars
    let animationFrameId: number;
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars with flickering
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.flicker += star.flickerSpeed;
        
        // Change star brightness
        const brightness = Math.sin(star.flicker) * 0.3 + 0.7;
        const opacity = brightness.toFixed(2);
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    resizeCanvas();
    animate();
    
    // Handle window resize
    window.addEventListener("resize", resizeCanvas);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);
  
  // Only show in dark mode
  if (theme !== "dark") return null;
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none z-0 opacity-70 ${className}`}
    />
  );
}