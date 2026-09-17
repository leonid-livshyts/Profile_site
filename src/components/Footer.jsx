import { profile } from '../data/profile.js'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <ul className="site-footer__contacts">
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          {profile.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
          <li>{profile.location}</li>
        </ul>
        <p className="site-footer__copy">
          © {year} {profile.name}
        </p>
      </div>
    </footer>
  )
}

export default Footer
