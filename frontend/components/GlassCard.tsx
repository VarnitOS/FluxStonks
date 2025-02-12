'use client'

import React, { useRef, useState } from "react";

interface GlassCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  stats: {
    value: string;
    change: number;
    additionalValue?: string;
  };
  spotlightColor: string;
}

export default function GlassCard({ 
  title, 
  description, 
  icon, 
  href, 
  stats, 
  spotlightColor 
}: GlassCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl overflow-hidden cursor-pointer"
    >
      <div className="relative bg-[#1E1F25]/30 rounded-3xl p-6 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-500 ease-in-out shadow-[0_0_15px_rgba(255,255,255,0.07)]">
        {/* Spotlight Effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
          style={{
            opacity,
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-white/70">{icon}</div>
            <div>
              <h3 className="text-lg text-white font-medium">{title}</h3>
              <p className="text-sm text-white/50">{description}</p>
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl text-white font-medium">{stats.value}</span>
            <span className={`text-sm ${stats.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.change >= 0 ? '+' : ''}{stats.change}%
            </span>
            {stats.additionalValue && (
              <span className={`text-sm ${stats.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.additionalValue}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}