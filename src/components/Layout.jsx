import { Outlet } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import './Layout.css'

function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
