import { Link, NavLink } from 'react-router'
import { profile } from '../data/profile.js'
import './Header.css'

const navItems = [
  { to: '/', label: 'About', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/certificates', label: 'Certificates' },
]

function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand">
          {profile.name}
        </Link>
        <nav aria-label="Main">
          <ul className="site-header__nav">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className="site-header__link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
