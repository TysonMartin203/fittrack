const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none' };

function Dumbbell(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 9v6M2 10.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M6 7v10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 7v10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M21 9v6M22 10.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function PushArrow(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 12h7M12 8l3 4-3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function PullArrow(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 12H9M12 8l-3 4 3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function Legs(props) {
  return (
    <svg {...common} {...props}>
      <path d="M9 3v6l-2.5 12h3l1.5-9 1.5 9h3L14 9V3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
      <rect x="8" y="2" width="7" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function UpperLower(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 9h16" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8" cy="6" r="1.4" fill="currentColor"/>
      <path d="M5 8.5l3-1.5 3 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <path d="M8 15v6M6 21h4M6 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M16 13l2 2 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function FullBody(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="4.5" r="2.2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 7v7M8 10l4-1.5L16 10M9 21l3-7 3 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}
function BroSplit(props) {
  return (
    <svg {...common} {...props}>
      <rect x="3" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="14" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function Core(props) {
  return (
    <svg {...common} {...props}>
      <path d="M6 4c1 3 1 13 0 16M18 4c-1 3-1 13 0 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M6 9c3 1.5 9 1.5 12 0M6 15c3-1.5 9-1.5 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function Lightning(props) {
  return (
    <svg {...common} {...props}>
      <path d="M13 3 6 13h5l-1 8 8-11h-5l1-7Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}
function CardioRun(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="14.5" cy="4.5" r="1.6" fill="currentColor"/>
      <path d="M9 20l2.5-4.5-1.5-4 3-2 2 3 3.5 1M11.5 15.5 8 17.5M13.5 9.5 10 11l-2.5 3.5"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

const ICONS = {
  ppl: Dumbbell,
  'upper-lower': UpperLower,
  'full-body': FullBody,
  'bro-split': BroSplit,
  push: PushArrow,
  pull: PullArrow,
  legs: Legs,
  core: Core,
  quick: Lightning,
  cardio: CardioRun,
};

export default function WorkoutPlanIcon({ id, size = 22, style, ...rest }) {
  const Cmp = ICONS[id] || Dumbbell;
  return <Cmp width={size} height={size} style={style} {...rest} />;
}
