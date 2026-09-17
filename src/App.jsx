import { Routes, Route } from 'react-router'
import Layout from './components/Layout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import CertificatesPage from './pages/CertificatesPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<AboutPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
