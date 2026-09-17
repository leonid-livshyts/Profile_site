import './CertificateCard.css'

function CertificateCard({ certificate }) {
  return (
    <article className="cert-card">
      {certificate.image && (
        <img className="cert-card__image" src={certificate.image.src} alt={certificate.image.alt} loading="lazy" />
      )}
      <div className="cert-card__body">
        <h2 className="cert-card__title">{certificate.title}</h2>
        <dl className="cert-card__meta">
          <div>
            <dt>Issuer</dt>
            <dd>{certificate.issuer}</dd>
          </div>
          {certificate.result && (
            <div>
              <dt>Result</dt>
              <dd>{certificate.result}</dd>
            </div>
          )}
          {certificate.date && (
            <div>
              <dt>Issued</dt>
              <dd>{certificate.date}</dd>
            </div>
          )}
        </dl>
        {certificate.link && (
          <a
            className="button"
            href={certificate.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Verify ${certificate.title}`}
          >
            Verify
          </a>
        )}
      </div>
    </article>
  )
}

export default CertificateCard
