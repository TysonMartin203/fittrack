import { NavLink } from 'react-router-dom';
import { IconBarbell, IconCamera, IconFeed, IconPeople, IconMeals } from './Icons';

const links = [
  { to: '/log',     label: 'Workouts', Icon: IconBarbell },
  { to: '/photos',  label: 'Photos', Icon: IconCamera },
  { to: '/feed',    label: 'Feed',   Icon: IconFeed },
  { to: '/social',  label: 'Social', Icon: IconPeople },
  { to: '/meals',   label: 'Meals',  Icon: IconMeals },
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
