import React, { useEffect, useRef } from 'react';

const wrapperStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 0,
  background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)'
};

const canvasStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  height: '100%'
};

interface Stream {
  yOffset: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  color: string;
  thickness: number;
  opacity: number;
}

export function HomeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    let width: number;
    let height: number;
    let streams: Stream[] = [];
    let animationFrameId: number;

    const initStreams = () => {
      streams = [];
      const numStreams = 6;
      const colors = ['#60A5FA', '#93C5FD', '#BFDBFE', '#FFFFFF', '#818CF8'];
      
      for (let i = 0; i < numStreams; i++) {
        streams.push({
          yOffset: (Math.random() * height * 0.8) + height * 0.1,
          amplitude: 50 + Math.random() * 150,
          frequency: 0.001 + Math.random() * 0.002,
          speed: 0.005 + Math.random() * 0.015,
          phase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          thickness: 2 + Math.random() * 6,
          opacity: 0.1 + Math.random() * 0.4
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStreams();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      streams.forEach(stream => {
        ctx.beginPath();
        ctx.moveTo(0, stream.yOffset);

        for (let x = 0; x < width; x += 20) {
          const dynamicAmplitude = stream.amplitude * Math.sin(stream.phase * 0.5 + x * 0.001);
          const y = stream.yOffset + Math.sin(x * stream.frequency + stream.phase) * dynamicAmplitude;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = stream.color;
        ctx.lineWidth = stream.thickness;
        ctx.globalAlpha = stream.opacity;
        ctx.shadowBlur = 30;
        ctx.shadowColor = stream.color;
        
        ctx.stroke();
        
        stream.phase += stream.speed;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={wrapperStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
    </div>
  );
}

export default function App() {
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <HomeBackground />
    </main>
  );
}