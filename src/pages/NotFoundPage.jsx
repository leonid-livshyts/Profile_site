import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <div className="container">
      <title>Page not found · Leonid Livshyts</title>
      <h1>Page not found</h1>
      <p>
        This page doesn’t exist. <Link to="/">Go to the home page</Link>.
      </p>
    </div>
  )
}

export default NotFoundPage
