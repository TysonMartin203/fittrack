// Custom SVG art for every achievement — no emojis

const c = 'var(--teal)';
const r = 'var(--rose)';
const g = 'var(--sage)';

function Icon({ viewBox = '0 0 32 32', children, size = 36 }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

const ICONS = {
  // ── WORKOUT ACHIEVEMENTS ──
  first_workout: () => (
    <Icon>
      {/* Simple barbell */}
      <line x1="8" y1="16" x2="24" y2="16" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="4" y="12" width="4" height="8" rx="1.5" fill={c}/>
      <rect x="2" y="13.5" width="2" height="5" rx="1" fill={r}/>
      <rect x="24" y="12" width="4" height="8" rx="1.5" fill={c}/>
      <rect x="28" y="13.5" width="2" height="5" rx="1" fill={r}/>
    </Icon>
  ),
  five_workouts: () => (
    <Icon>
      {/* Barbell with motion lines */}
      <line x1="8" y1="16" x2="24" y2="16" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="4" y="12" width="4" height="8" rx="1.5" fill={c}/>
      <rect x="2" y="13.5" width="2" height="5" rx="1" fill={r}/>
      <rect x="24" y="12" width="4" height="8" rx="1.5" fill={c}/>
      <rect x="28" y="13.5" width="2" height="5" rx="1" fill={r}/>
      {/* Motion lines */}
      <line x1="5" y1="9" x2="7" y2="7" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="8" x2="16" y2="6" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="27" y1="9" x2="25" y2="7" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
    </Icon>
  ),
  ten_workouts: () => (
    <Icon>
      {/* Flame */}
      <path d="M16 28 C10 28 6 23 6 18 C6 14 9 11 11 9 C11 12 13 13 14 12 C14 9 16 6 18 4 C18 8 20 9 21 11 C23 9 23 7 22 5 C25 8 26 12 26 16 C26 22 22 28 16 28Z" fill={r} opacity="0.9"/>
      <path d="M16 25 C13 25 11 22 11 19 C11 17 13 15 14 14 C14 16 15.5 17 16 16.5 C16.5 14 17.5 12 19 11 C19 14 20 15 21 14 C22 16 22 18 21 20 C20 23 18 25 16 25Z" fill="#E07A5F" opacity="0.6"/>
    </Icon>
  ),
  twenty_workouts: () => (
    <Icon>
      {/* Lightning bolt */}
      <path d="M20 4 L12 17 L18 17 L12 28 L22 13 L16 13 Z" fill={g} stroke={c} strokeWidth="0.5"/>
    </Icon>
  ),
  fifty_workouts: () => (
    <Icon>
      {/* 6-point star burst */}
      <path d="M16 4 L18 12 L26 10 L20 16 L26 22 L18 20 L16 28 L14 20 L6 22 L12 16 L6 10 L14 12 Z" fill={r} stroke={r} strokeWidth="0.5"/>
      <circle cx="16" cy="16" r="4" fill={c}/>
    </Icon>
  ),
  hundred_workouts: () => (
    <Icon>
      {/* Crown */}
      <path d="M6 24 L6 14 L10 20 L16 10 L22 20 L26 14 L26 24 Z" fill={g} stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="5" y="23" width="22" height="4" rx="2" fill={c}/>
      <circle cx="6" cy="13" r="2" fill={r}/>
      <circle cx="16" cy="10" r="2" fill={r}/>
      <circle cx="26" cy="13" r="2" fill={r}/>
    </Icon>
  ),

  // ── PR ACHIEVEMENTS ──
  first_pr: () => (
    <Icon>
      {/* Trophy */}
      <path d="M10 4 H22 V16 A6 6 0 0 1 10 16 Z" fill={g} stroke={c} strokeWidth="1.5"/>
      <path d="M10 10 H7 A3 3 0 0 0 10 13" fill="none" stroke={c} strokeWidth="1.5"/>
      <path d="M22 10 H25 A3 3 0 0 1 22 13" fill="none" stroke={c} strokeWidth="1.5"/>
      <rect x="14" y="20" width="4" height="5" rx="1" fill={c}/>
      <rect x="11" y="25" width="10" height="3" rx="1.5" fill={c}/>
      <circle cx="16" cy="11" r="3" fill={r} opacity="0.7"/>
    </Icon>
  ),
  five_prs: () => (
    <Icon>
      {/* Medal */}
      <circle cx="16" cy="18" r="9" fill={g} stroke={c} strokeWidth="1.5"/>
      <circle cx="16" cy="18" r="6" fill={c} opacity="0.4"/>
      <path d="M12 4 L16 9 L20 4" stroke={r} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M12 4 L14 10 M20 4 L18 10" stroke={r} strokeWidth="2" strokeLinecap="round"/>
      <text x="16" y="22" textAnchor="middle" fontSize="8" fontWeight="700" fill="white" fontFamily="sans-serif">1st</text>
    </Icon>
  ),
  ten_prs: () => (
    <Icon>
      {/* Diamond */}
      <path d="M16 4 L26 13 L16 28 L6 13 Z" fill={c} opacity="0.8" stroke={c} strokeWidth="1"/>
      <path d="M6 13 L16 4 L26 13 L16 14 Z" fill={r} opacity="0.6"/>
      <path d="M16 14 L6 13 M16 14 L26 13 M16 14 L16 28" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    </Icon>
  ),

  // ── PHOTO ACHIEVEMENTS ──
  first_photo: () => (
    <Icon>
      {/* Camera */}
      <rect x="4" y="9" width="24" height="18" rx="3" fill={c} opacity="0.8"/>
      <circle cx="16" cy="18" r="5" fill="none" stroke="white" strokeWidth="2"/>
      <circle cx="16" cy="18" r="2.5" fill="white" opacity="0.6"/>
      <path d="M12 9 L14 6 L18 6 L20 9" fill={c} stroke="white" strokeWidth="1"/>
      <circle cx="23" cy="12" r="1.5" fill={r}/>
    </Icon>
  ),
  five_photos: () => (
    <Icon>
      {/* Stack of photos */}
      <rect x="4" y="12" width="18" height="14" rx="2" fill={c} opacity="0.4" transform="rotate(-8 4 12)"/>
      <rect x="6" y="10" width="18" height="14" rx="2" fill={c} opacity="0.6" transform="rotate(-3 6 10)"/>
      <rect x="8" y="8" width="18" height="14" rx="2" fill={c}/>
      <circle cx="17" cy="15" r="3" fill={r} opacity="0.7"/>
      <line x1="10" y1="20" x2="24" y2="20" stroke="white" strokeWidth="1" opacity="0.4"/>
    </Icon>
  ),

  // ── FRIEND ACHIEVEMENTS ──
  first_friend: () => (
    <Icon>
      {/* Two people connected */}
      <circle cx="11" cy="11" r="4" fill={c} opacity="0.8"/>
      <path d="M4 24 C4 20 7 18 11 18 C15 18 18 20 18 24" fill={c} opacity="0.8"/>
      <circle cx="22" cy="11" r="4" fill={g} opacity="0.8"/>
      <path d="M15 24 C15 20 18 18 22 18 C26 18 28 20 28 24" fill={g} opacity="0.8"/>
    </Icon>
  ),
  three_friends: () => (
    <Icon>
      {/* Three people */}
      <circle cx="16" cy="8" r="4" fill={r} opacity="0.9"/>
      <path d="M9 24 C9 19 12 17 16 17 C20 17 23 19 23 24" fill={r} opacity="0.9"/>
      <circle cx="7" cy="12" r="3" fill={c} opacity="0.7"/>
      <path d="M2 26 C2 22 4 21 7 21 C8.5 21 10 21.5 11 22.5" fill={c} opacity="0.7"/>
      <circle cx="25" cy="12" r="3" fill={g} opacity="0.7"/>
      <path d="M30 26 C30 22 28 21 25 21 C23.5 21 22 21.5 21 22.5" fill={g} opacity="0.7"/>
    </Icon>
  ),
  five_friends: () => (
    <Icon>
      {/* Five people as a star cluster */}
      <circle cx="16" cy="9"  r="3.5" fill={r}/>
      <circle cx="24" cy="14" r="3" fill={c}/>
      <circle cx="21" cy="23" r="3" fill={g}/>
      <circle cx="11" cy="23" r="3" fill={r} opacity="0.7"/>
      <circle cx="8"  cy="14" r="3" fill={c} opacity="0.7"/>
      <line x1="16" y1="9" x2="24" y2="14" stroke="white" strokeWidth="0.8" opacity="0.4"/>
      <line x1="24" y1="14" x2="21" y2="23" stroke="white" strokeWidth="0.8" opacity="0.4"/>
      <line x1="21" y1="23" x2="11" y2="23" stroke="white" strokeWidth="0.8" opacity="0.4"/>
      <line x1="11" y1="23" x2="8"  y2="14" stroke="white" strokeWidth="0.8" opacity="0.4"/>
      <line x1="8"  y1="14" x2="16" y2="9"  stroke="white" strokeWidth="0.8" opacity="0.4"/>
    </Icon>
  ),

  // ── MESSAGE ACHIEVEMENT ──
  first_message: () => (
    <Icon>
      {/* Chat bubble */}
      <path d="M4 6 H28 A2 2 0 0 1 30 8 V20 A2 2 0 0 1 28 22 H12 L6 28 L7 22 H4 A2 2 0 0 1 2 20 V8 A2 2 0 0 1 4 6Z" fill={c} opacity="0.8"/>
      <line x1="9"  y1="13" x2="23" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9"  y1="17" x2="18" y2="17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </Icon>
  ),

  // ── MEAL ACHIEVEMENTS ──
  first_meal: () => (
    <Icon>
      {/* Plate with fork and knife */}
      <circle cx="16" cy="17" r="10" fill={g} opacity="0.6" stroke={c} strokeWidth="1.5"/>
      <circle cx="16" cy="17" r="6" fill={c} opacity="0.3"/>
      {/* Fork */}
      <line x1="10" y1="7" x2="10" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="7" x2="9" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="11" y1="7" x2="11" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Knife */}
      <line x1="22" y1="7" x2="22" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 7 Q25 9 24 12 L22 13" stroke="white" strokeWidth="1" fill="none"/>
    </Icon>
  ),
  three_meals: () => (
    <Icon>
      {/* Apple with leaf */}
      <path d="M16 10 C12 10 8 14 8 19 C8 24 11 28 14 28 C15 28 15.5 27 16 27 C16.5 27 17 28 18 28 C21 28 24 24 24 19 C24 14 20 10 16 10Z" fill={g} opacity="0.8"/>
      <path d="M16 10 C18 6 22 4 24 6 C22 8 18 9 16 10Z" fill={c}/>
      <line x1="16" y1="10" x2="16" y2="7" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 18 C14 16 15 15 16 15 C17 15 18 16 18 18" stroke="white" strokeWidth="1" fill="none" opacity="0.5"/>
    </Icon>
  ),

  // ── PROFILE ACHIEVEMENT ──
  has_avatar: () => (
    <Icon>
      {/* Person portrait in decorative frame */}
      <rect x="4" y="4" width="24" height="24" rx="6" fill="none" stroke={r} strokeWidth="2"/>
      <rect x="7" y="7" width="18" height="18" rx="4" fill={c} opacity="0.2"/>
      <circle cx="16" cy="13" r="5" fill={c} opacity="0.9"/>
      <path d="M7 26 C7 21 11 18 16 18 C21 18 25 21 25 26" fill={c} opacity="0.7"/>
      {/* Star badge */}
      <circle cx="26" cy="6" r="4" fill={r}/>
      <path d="M26 3.5 L26.8 5.2 L28.7 5.4 L27.3 6.7 L27.7 8.5 L26 7.5 L24.3 8.5 L24.7 6.7 L23.3 5.4 L25.2 5.2 Z" fill="white" transform="scale(0.7) translate(11.5 3)"/>
    </Icon>
  ),
};

export default function AchievementIcon({ id, size = 36, active = true }) {
  const Render = ICONS[id];
  if (!Render) return null;
  return (
    <div style={{ opacity: active ? 1 : 0.35, filter: active ? 'none' : 'grayscale(80%)' }}>
      <Render />
    </div>
  );
}

export { ICONS };
