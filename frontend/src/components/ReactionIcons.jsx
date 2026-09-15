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
      {/* Bicep flex: bigger, clearer muscle bulge with a highlight contour for definition */}
      <g transform="rotate(12 15 18)">
        <rect x="12" y="7" width="6" height="15" rx="3" fill="#E07A5F" stroke="#B85C43" strokeWidth="0.6"/>
      </g>
      <g transform="rotate(-62 8.5 12)">
        <rect x="6.2" y="3.5" width="4.6" height="11.5" rx="2.3" fill="#E07A5F" stroke="#B85C43" strokeWidth="0.6"/>
      </g>
      <circle cx="5.8" cy="6.5" r="2.9" fill="#E9A98C" stroke="#B85C43" strokeWidth="0.6"/>
      <circle cx="12.8" cy="11.5" r="5.6" fill="#E07A5F" stroke="#B85C43" strokeWidth="0.7"/>
      <path d="M9.3 9.2 C10.5 8 12.8 7.7 14.7 8.8" stroke="#F2CC8F" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.85"/>
    </svg>
  );
}

function ClapIcon(props) {
  return (
    <svg {...common} {...props}>
      {/* Fist bump: two clenched fists with knuckle lines, meeting with impact lines */}
      <g transform="rotate(-20 7 13)">
        <rect x="3" y="8" width="9" height="9" rx="2.5" fill="#E9A98C" stroke="#B85C43" strokeWidth="0.7"/>
        <line x1="6" y1="8.5" x2="6" y2="16.5" stroke="#B85C43" strokeWidth="0.6"/>
        <line x1="9" y1="8.5" x2="9" y2="16.5" stroke="#B85C43" strokeWidth="0.6"/>
        <rect x="1.5" y="12" width="3" height="4" rx="1.4" fill="#E9A98C" stroke="#B85C43" strokeWidth="0.6"/>
      </g>
      <g transform="rotate(20 17 13)">
        <rect x="12" y="8" width="9" height="9" rx="2.5" fill="#E07A5F" stroke="#B85C43" strokeWidth="0.7"/>
        <line x1="15" y1="8.5" x2="15" y2="16.5" stroke="#B85C43" strokeWidth="0.6"/>
        <line x1="18" y1="8.5" x2="18" y2="16.5" stroke="#B85C43" strokeWidth="0.6"/>
        <rect x="19.5" y="12" width="3" height="4" rx="1.4" fill="#E07A5F" stroke="#B85C43" strokeWidth="0.6"/>
      </g>
      <path d="M12 5 L12.5 7.2 M9.5 4.7 L10.3 6.8 M14.5 4.7 L13.7 6.8" stroke="#8F5D5D" strokeWidth="1.1" strokeLinecap="round"/>
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
