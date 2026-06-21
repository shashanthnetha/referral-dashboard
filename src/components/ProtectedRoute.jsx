import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const token = Cookies.get('jwt_token')

  if (!token) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute