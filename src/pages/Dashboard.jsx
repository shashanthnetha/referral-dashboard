import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      try {
        const token = Cookies.get('jwt_token')
        let url = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

        const params = []
        if (search) params.push('search=' + search)
        if (sort) params.push('sort=' + sort)
        if (params.length > 0) url = url + '?' + params.join('&')

        const res = await fetch(url, {
          headers: { Authorization: 'Bearer ' + token },
        })
        const json = await res.json()

        if (res.ok) {
          setData(json.data)
          setPage(1)
        } else {
          setError(json.message || 'Failed to load')
        }
      } catch {
        setError('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [search, sort])

  if (loading) {
    return (
      <div>
        <Navbar />
        <p className="loading">Loading...</p>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <p className="error">{error}</p>
        <Footer />
      </div>
    )
  }

  const referrals = data.referrals || []
  const perPage = 10
  const totalPages = Math.ceil(referrals.length / perPage)
  const start = (page - 1) * perPage
  const end = start + perPage
  const rows = referrals.slice(start, end)

  const pageNums = []
  for (let i = 1; i <= totalPages; i++) {
    pageNums.push(i)
  }

  const formatDate = (d) => {
    const dt = new Date(d)
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const day = String(dt.getDate()).padStart(2, '0')
    return y + '/' + m + '/' + day
  }

  const formatMoney = (val) => {
    return '$' + Number(val).toLocaleString()
  }

  return (
    <div>
      <Navbar />
      <div className="main-container">
        <h1 style={{ marginBottom: '15px', fontSize: '22px' }}>Referral Dashboard</h1>

        <div className="section">
          <h2>Overview</h2>
          <div className="overview-grid">
            {data.metrics.map((m) => (
              <div key={m.id} className="overview-card">
                <h3>{m.label}</h3>
                <p>{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Service Summary</h2>
          <div className="summary-info">
            <p><strong>Service:</strong> {data.serviceSummary.service}</p>
            <p><strong>Your Referrals:</strong> {data.serviceSummary.yourReferrals}</p>
            <p><strong>Active Referrals:</strong> {data.serviceSummary.activeReferrals}</p>
            <p><strong>Total Ref. Earnings:</strong> {data.serviceSummary.totalRefEarnings}</p>
          </div>
        </div>

        <div className="section">
          <h2>Refer Friends and Earn More</h2>
          <div className="share-row">
            <label>Referral Link</label>
            <div>
              <input type="text" readOnly value={data.referral.link} />
              <button onClick={() => navigator.clipboard.writeText(data.referral.link)}>Copy</button>
            </div>
          </div>
          <div className="share-row">
            <label>Referral Code</label>
            <div>
              <input type="text" readOnly value={data.referral.code} />
              <button onClick={() => navigator.clipboard.writeText(data.referral.code)}>Copy</button>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>All Referrals</h2>

          <div className="controls">
            <input
              type="text"
              placeholder="Name or service…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Date</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => navigate('/referral/' + r.id)}>
                  <td>{r.name}</td>
                  <td>{r.serviceName}</td>
                  <td>{formatDate(r.date)}</td>
                  <td>{formatMoney(r.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {referrals.length > 0 && (
            <div>
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                {pageNums.map((n) => (
                  <button
                    key={n}
                    className={n === page ? 'active' : ''}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
              <p className="showing-text">
                Showing {referrals.length === 0 ? 0 : start + 1}–{Math.min(end, referrals.length)} of {referrals.length} entries
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
