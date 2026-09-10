import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconHome, IconBarbell, IconTrophy, IconCamera, IconPeople, IconLogout } from './Icons';

const links = [
  { to: '/dashboard', label: 'Home',    Icon: IconHome },
  { to: '/log',       label: 'Log',     Icon: IconBarbell },
  { to: '/prs',       label: 'PRs',     Icon: IconTrophy },
  { to: '/photos',    label: 'Photos',  Icon: IconCamera },
  { to: '/friends',   label: 'Friends', Icon: IconPeople },
];

export default function Nav() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  return (
    <nav className="bottom-nav">
      {links.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <div className="nav-icon-wrap">
            <Icon className="nav-icon" />
          </div>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
      <button className="nav-item nav-logout" onClick={() => { logout(); navigate('/'); }}>
        <div className="nav-icon-wrap">
          <IconLogout className="nav-icon" />
        </div>
        <span className="nav-label">Out</span>
      </button>
    </nav>
  );
}
