import React from 'react';

/**
 * Helper function to parse active muscle groups from exercise category & muscle array
 */
const getActiveMuscleGroups = (categoryInput, musclesInput = [], secondaryMusclesInput = []) => {
  const catName = (typeof categoryInput === 'object' ? categoryInput?.name : categoryInput || '').toLowerCase();
  
  const primaryNames = musclesInput.map(m => (typeof m === 'object' ? m.name_en || m.name || '' : String(m)).toLowerCase());
  const secondaryNames = secondaryMusclesInput.map(m => (typeof m === 'object' ? m.name_en || m.name || '' : String(m)).toLowerCase());
  
  const allNamesStr = [...primaryNames, ...secondaryNames, catName].join(' ');

  const active = {
    abs: false,
    chest: false,
    arms: false,
    shoulders: false,
    back: false,
    quads: false,
    glutes: false,
    hamstrings: false,
    calves: false,
  };

  // Check Abs / Core
  if (allNamesStr.includes('abs') || allNamesStr.includes('abdominis') || allNamesStr.includes('core') || catName.includes('abs')) {
    active.abs = true;
  }
  // Check Chest
  if (allNamesStr.includes('chest') || allNamesStr.includes('pectoralis') || catName.includes('chest')) {
    active.chest = true;
  }
  // Check Arms
  if (allNamesStr.includes('biceps') || allNamesStr.includes('triceps') || allNamesStr.includes('arm') || allNamesStr.includes('forearm') || catName.includes('arms')) {
    active.arms = true;
  }
  // Check Shoulders
  if (allNamesStr.includes('shoulder') || allNamesStr.includes('deltoid') || catName.includes('shoulders')) {
    active.shoulders = true;
  }
  // Check Back
  if (allNamesStr.includes('back') || allNamesStr.includes('lats') || allNamesStr.includes('latissimus') || allNamesStr.includes('trapezius') || allNamesStr.includes('spinae') || catName.includes('back')) {
    active.back = true;
  }
  // Check Legs / Quads / Glutes / Hamstrings
  if (allNamesStr.includes('quad') || allNamesStr.includes('thigh') || allNamesStr.includes('leg') || catName.includes('legs')) {
    active.quads = true;
  }
  if (allNamesStr.includes('glute') || allNamesStr.includes('hip') || allNamesStr.includes('kettlebell') || catName.includes('legs')) {
    active.glutes = true;
  }
  if (allNamesStr.includes('hamstring') || allNamesStr.includes('biceps femoris') || catName.includes('legs')) {
    active.hamstrings = true;
  }
  if (allNamesStr.includes('calf') || allNamesStr.includes('gastrocnemius') || allNamesStr.includes('soleus')) {
    active.calves = true;
  }

  // If nothing matched specifically, fallback by category or kettlebell/swing keywords
  if (!Object.values(active).some(Boolean)) {
    if (allNamesStr.includes('kettlebell') || allNamesStr.includes('swing')) {
      active.glutes = true;
      active.hamstrings = true;
      active.abs = true;
      active.back = true;
    } else {
      active.abs = true; // default highlight for full body
    }
  }

  return active;
};

const AnatomicalTargetMap = ({ category, muscles = [], secondaryMuscles = [], compact = false, primaryLabel = '' }) => {
  const active = getActiveMuscleGroups(category, muscles, secondaryMuscles);

  // Determine primary highlight color vs default
  const activeColor = '#F97316'; // Glowing Coral Orange
  const inactiveColor = 'rgba(148, 163, 184, 0.15)';
  const strokeColor = '#475569';

  // Get list of highlighted muscle names for text label display
  const highlightedNames = [];
  if (active.glutes || active.hamstrings) highlightedNames.push('Glutes & Hamstrings');
  if (active.abs) highlightedNames.push('Core & Abs');
  if (active.chest) highlightedNames.push('Chest');
  if (active.arms) highlightedNames.push('Arms / Biceps');
  if (active.shoulders) highlightedNames.push('Shoulders');
  if (active.back) highlightedNames.push('Erector Spinae & Back');
  if (active.quads) highlightedNames.push('Quadriceps');

  const mainTargetText = primaryLabel || highlightedNames.slice(0, 2).join(' • ') || 'Full Body Engagement';

  return (
    <div className={`anatomical-map-container ${compact ? 'compact' : 'full'}`}>
      <div className="anatomical-glow-bg" />
      
      {/* SVG Body Silhouette */}
      <svg
        viewBox="0 0 160 220"
        className="anatomical-svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Target Muscle Anatomy Map"
      >
        <defs>
          <radialGradient id="orangeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.4" />
          </radialGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- FRONT BODY SILHOUETTE --- */}
        <g className="body-silhouette" transform="translate(10, 0)">
          {/* Head & Neck */}
          <circle cx="50" cy="18" r="10" fill={strokeColor} opacity="0.6" />
          <rect x="47" y="27" width="6" height="8" rx="2" fill={strokeColor} opacity="0.6" />

          {/* Shoulders */}
          <path
            d="M 32 36 Q 50 33 68 36 Q 74 44 72 52 Q 68 54 62 48 Q 50 46 38 48 Q 32 54 28 52 Q 26 44 32 36 Z"
            fill={active.shoulders ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.shoulders ? activeColor : strokeColor}
            strokeWidth="1.2"
            filter={active.shoulders ? "url(#neonGlow)" : "none"}
          />

          {/* Chest */}
          <path
            d="M 37 45 Q 50 43 63 45 Q 65 58 50 62 Q 35 58 37 45 Z"
            fill={active.chest ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.chest ? activeColor : strokeColor}
            strokeWidth="1.2"
            filter={active.chest ? "url(#neonGlow)" : "none"}
          />

          {/* Biceps / Arms Left & Right */}
          <path
            d="M 27 50 Q 22 62 25 78 Q 29 78 32 64 Q 31 54 27 50 Z"
            fill={active.arms ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.arms ? activeColor : strokeColor}
            strokeWidth="1"
            filter={active.arms ? "url(#neonGlow)" : "none"}
          />
          <path
            d="M 73 50 Q 78 62 75 78 Q 71 78 68 64 Q 69 54 73 50 Z"
            fill={active.arms ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.arms ? activeColor : strokeColor}
            strokeWidth="1"
            filter={active.arms ? "url(#neonGlow)" : "none"}
          />

          {/* Abs / Core */}
          <path
            d="M 40 63 L 60 63 L 58 92 Q 50 97 42 92 Z"
            fill={active.abs ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.abs ? activeColor : strokeColor}
            strokeWidth="1.2"
            filter={active.abs ? "url(#neonGlow)" : "none"}
          />
          {/* Abs Grid Lines */}
          {active.abs && (
            <g stroke="#FFEDD5" strokeWidth="0.8" opacity="0.8">
              <line x1="50" y1="64" x2="50" y2="92" />
              <line x1="42" y1="72" x2="58" y2="72" />
              <line x1="42" y1="81" x2="58" y2="81" />
            </g>
          )}

          {/* Hips / Glutes */}
          <path
            d="M 38 92 Q 50 97 62 92 Q 67 106 62 118 Q 50 120 38 118 Q 33 106 38 92 Z"
            fill={active.glutes ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.glutes ? activeColor : strokeColor}
            strokeWidth="1.2"
            filter={active.glutes ? "url(#neonGlow)" : "none"}
          />

          {/* Quads / Upper Thighs */}
          <path
            d="M 38 118 Q 48 119 49 155 Q 39 153 34 128 Z"
            fill={active.quads || active.hamstrings ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.quads || active.hamstrings ? activeColor : strokeColor}
            strokeWidth="1.2"
            filter={active.quads || active.hamstrings ? "url(#neonGlow)" : "none"}
          />
          <path
            d="M 62 118 Q 52 119 51 155 Q 61 153 66 128 Z"
            fill={active.quads || active.hamstrings ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.quads || active.hamstrings ? activeColor : strokeColor}
            strokeWidth="1.2"
            filter={active.quads || active.hamstrings ? "url(#neonGlow)" : "none"}
          />

          {/* Calves / Lower Legs */}
          <path
            d="M 37 160 Q 45 160 43 195 L 36 195 Q 33 175 37 160 Z"
            fill={active.calves ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.calves ? activeColor : strokeColor}
            strokeWidth="1"
            filter={active.calves ? "url(#neonGlow)" : "none"}
          />
          <path
            d="M 63 160 Q 55 160 57 195 L 64 195 Q 67 175 63 160 Z"
            fill={active.calves ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.calves ? activeColor : strokeColor}
            strokeWidth="1"
            filter={active.calves ? "url(#neonGlow)" : "none"}
          />
        </g>

        {/* --- BACK VIEW BODY SILHOUETTE (SIDE PROFILE / POSTERIOR) --- */}
        <g className="body-posterior" transform="translate(95, 0)">
          {/* Head */}
          <circle cx="25" cy="18" r="9" fill={strokeColor} opacity="0.5" />
          
          {/* Back & Erector Spinae */}
          <path
            d="M 18 36 Q 26 33 33 36 Q 36 50 32 90 Q 24 93 17 88 Q 14 55 18 36 Z"
            fill={active.back ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.back ? activeColor : strokeColor}
            strokeWidth="1.2"
            filter={active.back ? "url(#neonGlow)" : "none"}
          />

          {/* Glutes & Posterior Chain */}
          <path
            d="M 16 88 Q 24 93 32 90 Q 36 115 31 126 Q 22 130 14 122 Z"
            fill={active.glutes || active.hamstrings ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.glutes || active.hamstrings ? activeColor : strokeColor}
            strokeWidth="1.5"
            filter={active.glutes || active.hamstrings ? "url(#neonGlow)" : "none"}
          />

          {/* Hamstrings */}
          <path
            d="M 14 122 Q 22 130 31 126 Q 29 155 19 156 Z"
            fill={active.hamstrings ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.hamstrings ? activeColor : strokeColor}
            strokeWidth="1.2"
            filter={active.hamstrings ? "url(#neonGlow)" : "none"}
          />

          {/* Calf Posterior */}
          <path
            d="M 18 160 Q 27 160 24 195 L 17 195 Z"
            fill={active.calves ? "url(#orangeGlow)" : inactiveColor}
            stroke={active.calves ? activeColor : strokeColor}
            strokeWidth="1"
            filter={active.calves ? "url(#neonGlow)" : "none"}
          />
        </g>

        {/* Callout Indicator Lines & Pointers */}
        {(active.glutes || active.hamstrings) && (
          <g className="callout-pointer" opacity="0.9">
            <path d="M 45 125 Q 25 125 15 135" stroke="#F97316" strokeWidth="1" fill="none" strokeDasharray="2,2" />
            <circle cx="45" cy="125" r="2.5" fill="#F97316" />
          </g>
        )}
        {active.abs && (
          <g className="callout-pointer" opacity="0.9">
            <path d="M 60 78 Q 75 78 85 72" stroke="#F97316" strokeWidth="1" fill="none" strokeDasharray="2,2" />
            <circle cx="60" cy="78" r="2.5" fill="#F97316" />
          </g>
        )}
      </svg>

      {/* Target Area Text Badge overlay */}
      <div className="target-area-tag font-mono">
        <span className="target-dot" />
        <span className="target-text">TARGET: {mainTargetText.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default AnatomicalTargetMap;
