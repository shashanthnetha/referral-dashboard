import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function ReferralDetails() {
  const { id } = useParams()
  const [referral, setReferral] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('jwt_token')
        const res = await fetch(
          'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=' + id,
          { headers: { Authorization: 'Bearer ' + token } }
        )
        const json = await res.json()

        if (res.ok && json.data) {
          setReferral(json.data)
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div>
        <Navbar />
        <p className="loading">Loading...</p>
        <Footer />
      </div>
    )
  }

  if (notFound) {
    return (
      <div>
        <Navbar />
        <div className="main-container">
          <p>Referral not found</p>
          <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const formatDate = (d) => {
    const dt = new Date(d)
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const day = String(dt.getDate()).padStart(2, '0')
    return y + '/' + m + '/' + day
  }

  return (
    <div>
      <Navbar />
      <div className="main-container">
        <div className="detail-box">
          <h1>Referral Details</h1>
          <div className="detail-item">
            <span>Partner Name</span>
            <span>{referral.name}</span>
          </div>
          <div className="detail-item">
            <span>Referral ID</span>
            <span>{referral.id}</span>
          </div>
          <div className="detail-item">
            <span>Service Name</span>
            <span>{referral.serviceName}</span>
          </div>
          <div className="detail-item">
            <span>Date</span>
            <span>{formatDate(referral.date)}</span>
          </div>
          <div className="detail-item">
            <span>Profit</span>
            <span>${Number(referral.profit).toLocaleString()}</span>
          </div>
          <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ReferralDetails
