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

function Flame(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 2.5c.5 3-2.5 4-2.5 7a2.5 2.5 0 0 0 5 0c0-1-.5-1.5-.5-1.5.8 1 1.5 2.3 1.5 3.7A4.5 4.5 0 0 1 11 16.2c0 0-5.5-2-5.5-7.3C5.5 5.5 8.5 4 12 2.5Z"
        fill="currentColor" opacity="0.9"/>
      <path d="M9.5 15.5a2.5 2.5 0 0 0 5 0c0-1.1-1-2-1-2s-.2.6-.7.9c.2-.9-.3-1.7-.8-2.2-.2 1.4-1.3 1.8-1.7 2.6-.3.5-.8.8-.8.7Z"
        fill="currentColor"/>
    </svg>
  );
}

function PiggyBank(props) {
  return (
    <svg {...common} {...props}>
      <ellipse cx="11" cy="13" rx="8" ry="6" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M17 10.5 20 9v4l-2.3-1" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="7.5" cy="12" r="1" fill="currentColor"/>
      <path d="M9 8.5 8 6M13 8 12.5 6.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M8 19v1.5M14 19v1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M11.5 13h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function Drumstick(props) {
  return (
    <svg {...common} {...props}>
      <path d="M13 4c2.5-.5 5 1 5.5 3.5.5 2.3-1 4-2.8 5-1.2.6-1.7 1-2.2 2l-3 5.3a2.2 2.2 0 0 1-3.8-2.2l3-5.3c.6-1 .6-1.6.5-2.9C10 6.8 10.7 4.5 13 4Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="7" cy="18.3" r="1.6" fill="currentColor" opacity="0.85"/>
    </svg>
  );
}

function CowHead(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 6.5c.5-1.5 2-1.5 2.3.3M20 6.5c-.5-1.5-2-1.5-2.3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6.5 7C6 10 7 12 9 13c1 .5 1.5 1.5 1.5 2.7v2a1.3 1.3 0 0 0 2.6 0v-.6a1.1 1.1 0 0 1 2.2 0v.6a1.3 1.3 0 0 0 2.6 0v-2c0-1.2.5-2.2 1.5-2.7 2-1 3-3 2.5-6"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="9.5" cy="10" r="0.9" fill="currentColor"/>
      <circle cx="14.5" cy="10" r="0.9" fill="currentColor"/>
    </svg>
  );
}

function Steak(props) {
  return (
    <svg {...common} {...props}>
      <path d="M5 9c1-3 4-5 8-4.5 4 .5 6.5 3.7 6 7.3-.5 3.8-4 6.7-8 6.2-3.6-.5-6.2-3-6.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M7 9.5c1.3-.3 2.4.6 2.2 1.9-.2 1.2-1.6 1.6-2.5.8M12 7.3c1.4-.3 2.5.7 2.2 2-.2 1.2-1.7 1.6-2.6.7M15.5 11c1.3-.2 2.3.8 2 2.1-.3 1.1-1.6 1.5-2.5.6"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function ComboPlate(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8.5 9c1.6-1 3.4-1 4.6.6.4 1-.2 1.5-1.2 1.9-1 .3-1.4.8-1.8 1.7l-1.4 2.8a1.5 1.5 0 0 1-2.6-1.4l1.4-2.8c.4-.8.4-1.2.3-2.1 0-.4.2-.5.7-.7Z"
        fill="currentColor" opacity="0.85"/>
      <path d="M15 10.5c.9-.2 1.6.6 1.4 1.5-.2.8-1.1 1-1.7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M4 13a8 8 0 0 1 .3-2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function Leaf(props) {
  return (
    <svg {...common} {...props}>
      <path d="M19 5c-8 0-14 4-14 11.5 0 .3 0 .7.1 1C6 12 10 8.5 16 7c-5 2-8.5 5.5-9.5 10 6.5.3 12.5-3.5 12.5-12Z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="currentColor" fillOpacity="0.12"/>
    </svg>
  );
}

function VeggieBowl(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 12h16a8 8 0 0 1-16 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M8 12c-.2-1.6.8-2.6 2-2.3M12 12c-.3-2 .9-3.4 2.6-3M16 12c0-1.4.7-2.2 1.8-2.2"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="9.5" cy="8" r="1" fill="currentColor"/>
      <circle cx="14.5" cy="7.3" r="1" fill="currentColor"/>
    </svg>
  );
}

function Fish(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 13c3-4 8-6 12-4.5 2 .7 3.5 2.3 4.5 4.5-1 2.2-2.5 3.8-4.5 4.5-4 1.5-9-.5-12-4.5Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M19.5 13 22 10.5v5L19.5 13Z" fill="currentColor"/>
      <circle cx="8" cy="12" r="0.9" fill="currentColor"/>
      <path d="M7 13.5c1.5 1 3 1.4 5 1.2M7 12.3c1.6-1 3.2-1.3 5.3-1"
        stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

function Avocado(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 3c4 0 6.5 4 6.5 9s-2.9 9-6.5 9-6.5-4.5-6.5-9S8 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="12" cy="14" r="3" fill="currentColor" opacity="0.85"/>
    </svg>
  );
}

function Acorn(props) {
  return (
    <svg {...common} {...props}>
      <path d="M7 10c0-2.5 2-4.5 5-4.5s5 2 5 4.5c0 4-2.3 8.5-5 8.5s-5-4.5-5-8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7.3 9c-.5-2 .5-4 2-4.8 1-1 3.3-1.4 4.7-.6 1.6.8 2.4 2.6 2 5.4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
    </svg>
  );
}

function OliveBranch(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 18c5-9 11-13 16-14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="8" cy="14.5" r="1.8" fill="currentColor"/>
      <circle cx="11.5" cy="11" r="1.8" fill="currentColor"/>
      <circle cx="15" cy="8" r="1.8" fill="currentColor"/>
    </svg>
  );
}

function Broccoli(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="9" cy="8" r="3.4" fill="currentColor" opacity="0.85"/>
      <circle cx="14" cy="7" r="3" fill="currentColor" opacity="0.85"/>
      <circle cx="12" cy="10.5" r="3" fill="currentColor" opacity="0.85"/>
      <path d="M12 12v8M12 20l-2 1M12 20l2 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function WheatSlash(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 6c1.5-1 2.5-1 3.5 0M12 6c-1.5-1-2.5-1-3.5 0M12 10c1.5-1 2.5-1 3.5 0M12 10c-1.5-1-2.5-1-3.5 0M12 14c1.5-1 2.5-1 3.5 0M12 14c-1.5-1-2.5-1-3.5 0"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M4 20 20 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function MilkSlash(props) {
  return (
    <svg {...common} {...props}>
      <path d="M9 3h6v3l1.5 3v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-9L9 6V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M4 20 20 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function WheatStalk(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 21V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 7c1.6-1.1 2.7-1.1 3.8 0M12 7c-1.6-1.1-2.7-1.1-3.8 0M12 11c1.6-1.1 2.7-1.1 3.8 0M12 11c-1.6-1.1-2.7-1.1-3.8 0M12 15c1.6-1.1 2.7-1.1 3.8 0M12 15c-1.6-1.1-2.7-1.1-3.8 0"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="12" cy="4" r="1.1" fill="currentColor"/>
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

function Family(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="8" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="16" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 19c0-3 1.8-5 4-5s4 2 4 5M12 19c0-3 1.8-5 4-5s4 2 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function RunningFigure(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="14.5" cy="4.5" r="1.6" fill="currentColor"/>
      <path d="M9 20l2.5-4.5-1.5-4 3-2 2 3 3.5 1M11.5 15.5 8 17.5M13.5 9.5 10 11l-2.5 3.5"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function ClockFast(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="11" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M11 7.5V12l3.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 6 20 4.5M20.5 8l1.5-.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function ShieldLeaf(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9.5 12.5c1.8-2.5 4-3 6-2.7-.5 2.3-1.7 4-4.3 4.7-1 .3-1.7-.7-1.7-2Z" fill="currentColor" opacity="0.85"/>
    </svg>
  );
}

const ICONS = {
  'muscle-gain': Dumbbell,
  'fat-loss': Flame,
  'budget': PiggyBank,
  'chicken': Drumstick,
  'beef': CowHead,
  'steak': Steak,
  'combo': ComboPlate,
  'vegan': Leaf,
  'vegetarian': VeggieBowl,
  'seafood': Fish,
  'keto': Avocado,
  'paleo': Acorn,
  'mediterranean': OliveBranch,
  'low-carb': Broccoli,
  'gluten-free': WheatSlash,
  'dairy-free': MilkSlash,
  'fiber': WheatStalk,
  'quick': Lightning,
  'family': Family,
  'endurance': RunningFigure,
  'fasting': ClockFast,
  'anti-inflammatory': ShieldLeaf,
};

export default function MealPlanIcon({ id, size = 22, style, ...rest }) {
  const Cmp = ICONS[id] || Dumbbell;
  return <Cmp width={size} height={size} style={style} {...rest} />;
}
