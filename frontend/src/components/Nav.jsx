import { NavLink } from 'react-router-dom';
import { IconHome, IconBarbell, IconTrophy, IconCamera, IconPeople, IconMeals } from './Icons';

const links = [
  { to: '/dashboard', label: 'Home',    Icon: IconHome },
  { to: '/log',       label: 'Log',     Icon: IconBarbell },
  { to: '/prs',       label: 'PRs',     Icon: IconTrophy },
  { to: '/photos',    label: 'Photos',  Icon: IconCamera },
  { to: '/friends',   label: 'Friends', Icon: IconPeople },
  { to: '/meals',     label: 'Meals',   Icon: IconMeals },
];

export default function Nav() {
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
    </nav>
  );
}
