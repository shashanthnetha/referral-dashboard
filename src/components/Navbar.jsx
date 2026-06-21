import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <h2>Go Business</h2>
      <div className="nav-right">
        <Link to="/">Home</Link>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  )
}

export default Navbar
