import React, { useState, useEffect, useRef } from 'react';
import WAVES from 'vanta/dist/vanta.waves.min';
import * as THREE from 'three';

interface VantaWavesProps {
  children?: React.ReactNode;
}

export const VantaWaves = ({ children }: VantaWavesProps) => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        WAVES({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          shininess: 56.00,
          waveHeight: 31.00
        })
      );
    }
    
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
};