import React from 'react';
import { FloatingText } from '../types';

interface FloatingTextLayerProps {
  texts: FloatingText[];
}

export const FloatingTextLayer: React.FC<FloatingTextLayerProps> = ({ texts }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {texts.map((text) => (
        <div
          key={text.id}
          className="absolute text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]"
          style={{
            left: text.x,
            top: text.y,
            animation: 'floatUp 0.8s ease-out forwards',
            color: '#00d4ff', // Cyan accent from original
          }}
        >
          <style>{`
            @keyframes floatUp {
              0% { transform: translateY(0) scale(1); opacity: 1; }
              100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
            }
          `}</style>
          +{text.value}
        </div>
      ))}
    </div>
  );
};