const common = { width: 20, height: 20, viewBox: '0 0 24 24' };

function FireIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12.5 1.8c1.2 3.4-1.1 5-2.7 6.8-1.7 1.9-2.6 3.9-2.6 6.1a4.8 4.8 0 0 0 9.6 0c0-1.6-.6-2.7-1.2-3.6-.2 1.3-.9 2-1.6 2.4.6-2.2-.3-3.6-1.2-4.9-.7-1-1.3-2-1.1-3.3-.6.5-1.1 1.2-1.1 2.1 0 1.1.7 1.7 1.2 2.5-1.4-.3-2.4-1.4-2.6-3.1-.2-1.7.5-3.3 2.3-5Z" fill="#E07A5F"/>
      <path d="M12.2 21.2a3.3 3.3 0 0 1-3.3-3.3c0-1.5.9-2.3 1.5-3.3.1 1 .5 1.6 1 2 .1-1.2.7-1.9 1.3-2.6.4 1.1.1 1.9-.1 2.7.5-.2.9-.6 1.1-1.1.5.7.8 1.4.8 2.3a3.3 3.3 0 0 1-3.3 3.3Z" fill="#F2CC8F"/>
    </svg>
  );
}

function FlexIcon(props) {
  return (
    <svg {...common} {...props}>
      {/* Bent arm: upper arm/shoulder, forearm bending up to a fist, bicep bulge at the elbow */}
      <g transform="rotate(15 15 18)">
        <rect x="12.5" y="8" width="5.5" height="14" rx="2.75" fill="#E07A5F" stroke="#B85C43" strokeWidth="0.6"/>
      </g>
      <g transform="rotate(-60 9 12)">
        <rect x="7" y="4" width="4.4" height="11" rx="2.2" fill="#E07A5F" stroke="#B85C43" strokeWidth="0.6"/>
      </g>
      <circle cx="6.3" cy="7.3" r="3" fill="#E9A98C" stroke="#B85C43" strokeWidth="0.6"/>
      <circle cx="12.5" cy="11.5" r="4.8" fill="#E07A5F" stroke="#B85C43" strokeWidth="0.6"/>
    </svg>
  );
}

function ClapIcon(props) {
  return (
    <svg {...common} {...props}>
      {/* Two hands meeting with motion lines above, reading as a clap */}
      <g transform="rotate(-15 8 12)">
        <rect x="4.5" y="8" width="7" height="9" rx="3.2" fill="#E9A98C" stroke="#B85C43" strokeWidth="0.6"/>
        <rect x="3" y="10.5" width="3" height="4.5" rx="1.5" fill="#E9A98C" stroke="#B85C43" strokeWidth="0.6"/>
      </g>
      <g transform="rotate(15 16 12)">
        <rect x="12.5" y="8" width="7" height="9" rx="3.2" fill="#E07A5F" stroke="#B85C43" strokeWidth="0.6"/>
        <rect x="18" y="10.5" width="3" height="4.5" rx="1.5" fill="#E07A5F" stroke="#B85C43" strokeWidth="0.6"/>
      </g>
      <path d="M9 4.5 L9.6 6.3 M12 3.8 L12 5.7 M15 4.5 L14.4 6.3" stroke="#8F5D5D" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

function WhoaIcon(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="8.5" fill="#81B29A" stroke="#E07A5F" strokeWidth="0.8"/>
      <circle cx="9" cy="10.5" r="1.3" fill="#3D405B"/>
      <circle cx="15" cy="10.5" r="1.3" fill="#3D405B"/>
      <ellipse cx="12" cy="15.5" rx="2" ry="2.4" fill="#3D405B"/>
    </svg>
  );
}

function HeartIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 20s-7-4.4-9.3-8.8C1.3 8 2.7 5 5.8 4.6c1.8-.2 3.4.7 4.2 2.2.8-1.5 2.4-2.4 4.2-2.2C17.3 5 18.7 8 17.3 11.2 15 15.6 12 20 12 20Z"
        fill="#8F5D5D"/>
    </svg>
  );
}

export const REACTIONS = [
  { id: 'fire', label: 'Fire', Icon: FireIcon },
  { id: 'flex', label: 'Strong', Icon: FlexIcon },
  { id: 'clap', label: 'Nice', Icon: ClapIcon },
  { id: 'whoa', label: 'Whoa', Icon: WhoaIcon },
  { id: 'heart', label: 'Love it', Icon: HeartIcon },
];

export default function ReactionIcon({ id, size = 18, style, ...rest }) {
  const found = REACTIONS.find(r => r.id === id);
  if (!found) return null;
  const { Icon } = found;
  return <Icon width={size} height={size} style={style} {...rest} />;
}
