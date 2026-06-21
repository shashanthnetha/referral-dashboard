import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <Link to="/">&larr; Back to Dashboard</Link>
    </div>
  )
}

export default NotFound