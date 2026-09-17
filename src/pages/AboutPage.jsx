import { profile } from '../data/profile.js'
import './AboutPage.css'

function AboutPage() {
  return (
    <div className="container about">
      <title>{profile.name}</title>

      <section className="about__hero">
        <div className="about__hero-text">
          <p className="about__eyebrow">{profile.location}</p>
          <h1>{profile.name}</h1>
          <p className="about__fullname">{profile.fullName}</p>
          <p className="about__tagline">{profile.tagline}</p>
          <div className="about__actions">
            <a className="button button--primary" href={`mailto:${profile.email}`}>
              Email me
            </a>
            {profile.links.map((link) => (
              <a key={link.href} className="button" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <img
          className="about__photo"
          src={profile.photo.src}
          alt={profile.photo.alt}
          width="300"
          height="400"
        />
      </section>

      <section className="about__section" aria-labelledby="about-me">
        <h2 id="about-me">About me</h2>
        {profile.intro.map((text) => (
          <p key={text} className="about__intro">
            {text}
          </p>
        ))}
      </section>

      <section className="about__section" aria-labelledby="skills">
        <h2 id="skills">Skills</h2>
        <div className="about__skills">
          {profile.skillGroups.map((group) => {
            const headingId = `skill-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            return (
            <div key={group.title} role="group" aria-labelledby={headingId} className="about__skill-group">
              <h3 id={headingId}>{group.title}</h3>
              <ul className="chips">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            )
          })}
        </div>
      </section>

      <section className="about__section" aria-labelledby="languages">
        <h2 id="languages">Languages</h2>
        <dl className="about__languages">
          {profile.spokenLanguages.map((lang) => (
            <div key={lang.name}>
              <dt>{lang.name}</dt>
              <dd>{lang.level}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

export default AboutPage
