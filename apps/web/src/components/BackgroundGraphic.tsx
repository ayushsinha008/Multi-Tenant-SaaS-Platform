'use client';

import React from 'react';

export function BackgroundGraphic({ type = 'stripes', children }: { type?: 'stripes' | 'number' | 'grid' | 'type' | 'outline-circle' | 'diagonal-bars' | 'geo-block' | 'composition', children?: React.ReactNode }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {type === 'stripes' && (
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 40px, transparent 40px, transparent 80px)' }}></div>
      )}
      {type === 'number' && (
        <div className="absolute opacity-[0.08] text-[40vw] font-black text-black leading-none select-none tracking-tighter mix-blend-multiply">
          01
        </div>
      )}
      {type === 'grid' && (
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      )}
      {type === 'type' && (
        <div className="absolute opacity-[0.05] text-[30vw] font-black text-black leading-none select-none tracking-tighter transform -rotate-1 whitespace-nowrap mix-blend-multiply">
          SYSTEM
        </div>
      )}
      {type === 'outline-circle' && (
        <div className="absolute w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] border-[2px] border-black opacity-10 rounded-full mix-blend-multiply" />
      )}
      {type === 'diagonal-bars' && (
        <div className="absolute w-[150vw] h-[20vw] bg-black opacity-[0.05] transform -rotate-45 mix-blend-multiply" />
      )}
      {type === 'geo-block' && (
        <div className="absolute w-[60vw] h-[60vw] bg-black opacity-[0.05] transform rotate-12 mix-blend-multiply" />
      )}
      
      {/* FINAL MAXIMALIST COMPOSITION */}
      {type === 'composition' && (
        <div className="absolute inset-0 hidden md:block">
          {/* Base Grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
          
          {/* Giant Outlined Number */}
          <div className="absolute -top-[10%] -left-[5%] text-[40vw] font-black leading-none tracking-tighter text-transparent mix-blend-multiply" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.08)' }}>
            01
          </div>
          
          {/* Oversized Circle */}
          <div className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] border-[2px] border-black opacity-[0.06] rounded-full mix-blend-multiply" />
          
          {/* Cropped Rectangles */}
          <div className="absolute bottom-0 right-[10%] w-[30vw] h-[40vh] bg-black opacity-[0.03] mix-blend-multiply" />
          <div className="absolute top-[10%] left-[20%] w-[10vw] h-[80vh] border-l-[2px] border-r-[2px] border-black opacity-[0.05] mix-blend-multiply" />
          
          {/* Abstract SVG Composition (Micro graphics / Diagonal Bars) */}
          <svg className="absolute top-1/4 right-1/3 w-64 h-64 opacity-[0.08] mix-blend-multiply" viewBox="0 0 100 100">
            <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="2" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="2" />
            <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="2" fill="none" />
          </svg>
          
          <svg className="absolute bottom-[20%] left-[5%] w-32 h-32 opacity-[0.08] mix-blend-multiply transform rotate-12" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" stroke="black" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="20" fill="black" />
          </svg>
          
          {/* Floating Editorial Block Outline */}
          <div className="absolute top-[40%] left-[60%] w-[20vw] h-[15vw] border-[1px] border-black opacity-[0.06] transform -rotate-1" />
        </div>
      )}

      {children && (
        <div className="absolute opacity-[0.06] text-[20vw] md:text-[30vw] font-black text-black leading-none select-none tracking-tighter mix-blend-multiply" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.5)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
