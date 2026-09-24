import React, { useState, useEffect } from 'react';

export default function HalfGaugeChart({ score = 0, topScore = 100, label = "Overall Score" }) {
  const radius = 85;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // ~267.035

  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const normalizedTop = Math.min(Math.max(topScore, 0), 100);

  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrameId = null;
    const duration = 1100; // ms

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: ease-out cubic
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      setAnimProgress(easeOutProgress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    setAnimProgress(0);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [score, topScore]);

  // Current interpolated values during animation
  const currentScore = normalizedScore * animProgress;
  const currentTop = normalizedTop * animProgress;

  // Dash offset calculations
  const studentOffset = circumference - (currentScore / 100) * circumference;
  const topOffset = circumference - (currentTop / 100) * circumference;

  // Calculate student score indicator marker position (moves as arc fills up)
  const studentAngleDeg = 180 - (currentScore / 100) * 180;
  const studentAngleRad = (studentAngleDeg * Math.PI) / 180;
  const studentX = 100 + radius * Math.cos(studentAngleRad);
  const studentY = 100 - radius * Math.sin(studentAngleRad);

  // Calculate top score indicator marker position
  const angleDeg = 180 - (currentTop / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const markerX = 100 + radius * Math.cos(angleRad);
  const markerY = 100 - radius * Math.sin(angleRad);

  // Proximity detection between student and benchmark markers
  const angleDiff = Math.abs(studentAngleDeg - angleDeg);
  const isClose = angleDiff < 25;

  // Tiered radial label positions to prevent text collision
  const studentRadius = isClose ? 114 : 102;
  const topRadius = isClose ? 95 : 102;

  // Radially outward label positions
  const studentLabelX = 100 + studentRadius * Math.cos(studentAngleRad);
  const studentLabelY = 100 - studentRadius * Math.sin(studentAngleRad);

  const topLabelX = 100 + topRadius * Math.cos(angleRad) + (isClose ? 12 : 0);
  const topLabelY = 100 - topRadius * Math.sin(angleRad);

  // Marker and label opacity based on progress
  const markerOpacity = Math.min(1, animProgress * 1.5);

  return (
    <div className="flex flex-col items-center justify-center relative w-full pt-2 animate-chart-fade">
      <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 115">
        <defs>
          {/* Main Student Score Gradient */}
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          {/* Ghost Benchmark Gradient */}
          <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Arc Shadow Filter */}
          <filter id="arcShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4F46E5" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Base Background Track */}
        <path
          d="M 15,100 A 85,85 0 0,1 185,100"
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Top Performer Benchmark Shadow Arc */}
        <path
          d="M 15,100 A 85,85 0 0,1 185,100"
          fill="none"
          stroke="url(#topGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={topOffset}
          strokeLinecap="round"
          opacity={0.4}
        />

        {/* Student Score Solid Arc with Fill Animation */}
        <path
          d="M 15,100 A 85,85 0 0,1 185,100"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={studentOffset}
          strokeLinecap="round"
          filter="url(#arcShadow)"
        />

        {/* Student Score Pin Marker & "You" Label */}
        {normalizedScore > 0 && (
          <g style={{ opacity: markerOpacity, transition: 'opacity 0.3s ease-out' }}>
            <circle
              cx={studentX}
              cy={studentY}
              r="5.5"
              fill="#4338CA"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="drop-shadow-xs"
            />
            <text
              x={studentLabelX}
              y={studentLabelY}
              textAnchor={studentLabelX < 90 ? 'end' : studentLabelX > 110 ? 'start' : 'middle'}
              className="fill-indigo-600 text-[10px] font-bold tracking-tight pointer-events-none drop-shadow-2xs select-none"
            >
              You
            </text>
          </g>
        )}

        {/* Subtle Benchmark Shadow Pin Marker & Label */}
        {normalizedTop > 0 && (
          <g style={{ opacity: markerOpacity, transition: 'opacity 0.3s ease-out' }}>
            <circle
              cx={markerX}
              cy={markerY}
              r="5"
              fill="#64748B"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text
              x={topLabelX}
              y={topLabelY}
              textAnchor={topLabelX < 90 ? 'end' : topLabelX > 110 ? 'start' : 'middle'}
              className="fill-slate-500 text-[10px] font-medium tracking-tight pointer-events-none select-none"
            >
              Top Performer ({topScore}%)
            </text>
          </g>
        )}
      </svg>

      {/* Score Text Overlay with Live Counter and Fade In */}
      <div className="absolute top-14 flex flex-col items-center select-none">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight transition-all">
          {Math.round(score * animProgress)}%
        </span>
        <span className="text-[11px] font-medium text-slate-500 mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}
