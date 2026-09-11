const common = { width: 20, height: 20, viewBox: '0 0 24 24' };

function FireIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 2.5c.5 3-2.5 4-2.5 7a2.5 2.5 0 0 0 5 0c0-1-.5-1.5-.5-1.5.8 1 1.5 2.3 1.5 3.7A4.5 4.5 0 0 1 11 16.2c0 0-5.5-2-5.5-7.3C5.5 5.5 8.5 4 12 2.5Z" fill="#E07A5F"/>
      <path d="M9.5 15.5a2.5 2.5 0 0 0 5 0c0-1.1-1-2-1-2s-.2.6-.7.9c.2-.9-.3-1.7-.8-2.2-.2 1.4-1.3 1.8-1.7 2.6-.3.5-.8.8-.8.7Z" fill="#F2CC8F"/>
    </svg>
  );
}

function FlexIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 15c0-2 1-3 2.5-3.3-.4-1.5.3-3 1.8-3.5 1.6-.5 3 .3 3.6 1.6.7-.7 1.8-1 2.9-.5 1.4.6 1.9 2.2 1.4 3.5 1.3.1 2.3 1 2.3 2.4 0 3-3 5.3-7.3 5.3S4 18 4 15Z"
        fill="#E07A5F" stroke="#E07A5F" strokeWidth="0.8"/>
      <circle cx="9" cy="10.5" r="1" fill="#3D405B"/>
    </svg>
  );
}

function ClapIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M9 13.5 6.5 9a1.4 1.4 0 0 1 2.4-1.4L11 11" stroke="#E07A5F" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M11 11.5 9.3 7.8a1.3 1.3 0 0 1 2.3-1.1l2 3.8" stroke="#8F5D5D" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M13.6 10.6 12.5 7.3a1.2 1.2 0 0 1 2.2-.9l1.8 3.6" stroke="#E07A5F" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M8.5 13c-1.5 1-2 2.8-1 4.4 1.2 1.9 3.6 2.4 5.6 1.2l3.4-2.1c1.6-1 2.1-3 1.2-4.6-.8-1.4-2.5-1.9-4-1.2"
        fill="#E07A5F" stroke="#8F5D5D" strokeWidth="0.8"/>
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
