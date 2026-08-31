import React from 'react';

export default function Logo({ size = 'md', showTagline = true, animate = false }) {
  const sizeMap = {
    sm: { icon: 28, text: '1.25rem', sub: '0.6rem' },
    md: { icon: 38, text: '1.65rem', sub: '0.7rem' },
    lg: { icon: 52, text: '2.35rem', sub: '0.8rem' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', userSelect: 'none' }}>
      {/* Colorful Modern Geometric X Glyph */}
      <div style={{ position: 'relative', width: currentSize.icon, height: currentSize.icon, flexShrink: 0 }}>
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          style={{
            filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 20px rgba(6, 182, 212, 0.4))',
            transition: 'transform 0.3s ease',
          }}
          className={animate ? 'animate-spin-slow' : ''}
        >
          <defs>
            {/* Primary Vibrant Multi-Stop Rainbow Gradient */}
            <linearGradient id="researchx-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />    {/* Electric Violet */}
              <stop offset="35%" stopColor="#EC4899" />   {/* Hot Magenta */}
              <stop offset="70%" stopColor="#F59E0B" />   {/* Amber Coral */}
              <stop offset="100%" stopColor="#06B6D4" />  {/* Cyber Cyan */}
            </linearGradient>

            <linearGradient id="researchx-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>

            <linearGradient id="researchx-stroke-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Ambient Radial Filter */}
            <radialGradient id="researchx-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0E1326" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Futuristic Hexagonal Shield Facet */}
          <polygon
            points="50,4 92,26 92,74 50,96 8,74 8,26"
            fill="url(#researchx-grad-1)"
            opacity="0.95"
          />

          {/* Inner Dimensional Facet */}
          <polygon
            points="50,14 82,31 82,69 50,86 18,69 18,31"
            fill="#0A0E20"
            opacity="0.88"
          />

          {/* Central Neural Glow */}
          <circle cx="50" cy="50" r="22" fill="url(#researchx-core-glow)" />

          {/* Stylized Modern Prismatic "X" */}
          <path
            d="M32 30 L68 70 M68 30 L32 70"
            stroke="url(#researchx-stroke-glow)"
            strokeWidth="8.5"
            strokeLinecap="round"
          />

          {/* Prismatic Intersect Nodes */}
          <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
          <circle cx="32" cy="30" r="3" fill="#67E8F9" />
          <circle cx="68" cy="30" r="3" fill="#F472B6" />
          <circle cx="32" cy="70" r="3" fill="#C4B5FD" />
          <circle cx="68" cy="70" r="3" fill="#FCD34D" />
        </svg>
      </div>

      {/* Brand Title & Tagline */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: currentSize.text, 
          fontWeight: 800, 
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.1rem'
        }}>
          <span style={{ color: 'var(--text-primary)' }}>Research</span>
          <span className="gradient-text-rainbow" style={{ fontSize: '1.15em', fontWeight: 900, textShadow: '0 0 20px rgba(236,72,153,0.5)' }}>X</span>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--brand-accent)',
            boxShadow: '0 0 8px #06B6D4',
            marginLeft: '2px'
          }}></span>
        </div>
        {showTagline && (
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: currentSize.sub, 
            fontWeight: 700, 
            letterSpacing: '0.18em', 
            textTransform: 'uppercase',
            color: 'var(--brand-accent)',
            opacity: 0.9,
            marginTop: '2px'
          }}>
            Autonomous Intelligence
          </span>
        )}
      </div>
    </div>
  );
}
