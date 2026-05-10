function addYears(dateStr, years) {
  const d = new Date(dateStr)
  d.setFullYear(d.getFullYear() + years)
  return d
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function OverviewTab({ bike }) {
  const services = [...(bike.services || [])].sort((a, b) => new Date(b.date) - new Date(a.date))
  const lastService = services[0] || null

  const nextServiceDate = lastService ? addYears(lastService.date, 1) : null
  const nextServiceKm = lastService ? lastService.nextServiceKm : null
  const daysLeft = nextServiceDate ? daysUntil(nextServiceDate) : null
  const kmLeft = nextServiceKm ? nextServiceKm - (bike.currentKm || 0) : null

  const dateWarn = daysLeft !== null && daysLeft <= 30
  const kmWarn = kmLeft !== null && kmLeft <= 500

  const totalServiceCost = (bike.services || []).reduce((sum, s) => sum + (s.totalCost || 0), 0)
  const totalGasSpend = (bike.gasLogs || []).reduce((sum, g) => sum + (g.totalPrice || 0), 0)
  const totalMaintenanceCost = (bike.maintenance || []).reduce((sum, m) => sum + (m.price || 0), 0)

  const recentMaintenance = [...(bike.maintenance || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="overview-tab">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Services</div>
          <div className="stat-value">{(bike.services || []).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Service Cost</div>
          <div className="stat-value">€{totalServiceCost.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Gas Spent</div>
          <div className="stat-value">€{totalGasSpend.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Maintenance Cost</div>
          <div className="stat-value">€{totalMaintenanceCost.toFixed(2)}</div>
        </div>
      </div>

      <div className="section">
        <h3>Next Service</h3>
        {!lastService ? (
          <p className="text-muted">No services recorded yet. Add your first service in the Services tab.</p>
        ) : (
          <div className="next-service-grid">
            <div className={`next-service-card ${dateWarn ? 'warn' : ''}`}>
              <div className="next-service-label">By Date</div>
              <div className="next-service-value">{formatDate(nextServiceDate)}</div>
              <div className="next-service-sub">
                {daysLeft !== null && (
                  daysLeft < 0
                    ? <span className="badge badge-danger">Overdue by {Math.abs(daysLeft)} days</span>
                    : daysLeft <= 30
                      ? <span className="badge badge-warn">In {daysLeft} days ⚠️</span>
                      : <span className="badge badge-ok">In {daysLeft} days</span>
                )}
              </div>
            </div>
            <div className={`next-service-card ${kmWarn ? 'warn' : ''}`}>
              <div className="next-service-label">By KM</div>
              <div className="next-service-value">{nextServiceKm?.toLocaleString() || '—'} km</div>
              <div className="next-service-sub">
                {kmLeft !== null && (
                  kmLeft < 0
                    ? <span className="badge badge-danger">{Math.abs(kmLeft).toLocaleString()} km overdue</span>
                    : kmLeft <= 500
                      ? <span className="badge badge-warn">{kmLeft.toLocaleString()} km left ⚠️</span>
                      : <span className="badge badge-ok">{kmLeft.toLocaleString()} km left</span>
                )}
              </div>
            </div>
          </div>
        )}
        {lastService && (
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>
            Last service: {formatDate(lastService.date)} at {lastService.km?.toLocaleString()} km
          </p>
        )}
      </div>

      <div className="section">
        <h3>Recent Maintenance</h3>
        {recentMaintenance.length === 0 ? (
          <p className="text-muted">No maintenance records yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>KM</th>
                <th>Cost</th>
                <th>Next Due</th>
              </tr>
            </thead>
            <tbody>
              {recentMaintenance.map(m => (
                <tr key={m.id}>
                  <td>{m.type}</td>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.km?.toLocaleString() || '—'}</td>
                  <td>{m.price ? `€${Number(m.price).toFixed(2)}` : '—'}</td>
                  <td>
                    {m.nextDate
                      ? <span className={daysUntil(m.nextDate) <= 30 ? 'text-warn' : ''}>
                          {formatDate(m.nextDate)}
                        </span>
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
