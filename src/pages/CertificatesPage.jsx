import CertificateCard from '../components/CertificateCard.jsx'
import { certificates } from '../data/certificates.js'
import './CardGridPage.css'

function CertificatesPage() {
  return (
    <div className="container">
      <title>Certificates · Leonid Livshyts</title>
      <h1>Certificates</h1>
      <p className="card-page__lead">Exams and courses I have completed.</p>
      <ul className="card-grid">
        {certificates.map((certificate) => (
          <li key={certificate.id}>
            <CertificateCard certificate={certificate} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CertificatesPage
