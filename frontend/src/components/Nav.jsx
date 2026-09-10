import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Home',    icon: '🏠' },
  { to: '/log',       label: 'Log',     icon: '➕' },
  { to: '/prs',       label: 'PRs',     icon: '🏆' },
  { to: '/photos',    label: 'Photos',  icon: '📷' },
  { to: '/friends',   label: 'Friends', icon: '👥' },
];

export default function Nav() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bottom-nav">
      {links.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">{icon}</span>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
      <button className="nav-item nav-logout" onClick={handleLogout}>
        <span className="nav-icon">🚪</span>
        <span className="nav-label">Out</span>
      </button>
    </nav>
  );
}
