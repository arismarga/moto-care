import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { useBikes } from '../../context/BikeContext'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  liters: '',
  totalPrice: '',
  currentKm: '',
  station: '',
}

export default function GasTab({ bike }) {
  const { addGasLog, deleteGasLog } = useBikes()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [chartYear, setChartYear] = useState(new Date().getFullYear())

  const logs = [...(bike.gasLogs || [])].sort((a, b) => new Date(b.date) - new Date(a.date))

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    addGasLog(bike.id, {
      date: form.date,
      liters: Number(form.liters) || 0,
      totalPrice: Number(form.totalPrice) || 0,
      currentKm: Number(form.currentKm) || 0,
      station: form.station,
    })
    setForm(emptyForm)
    setShowForm(false)
  }

  const years = useMemo(() => {
    const ys = new Set(logs.map(g => new Date(g.date).getFullYear()))
    return [...ys].sort((a, b) => b - a)
  }, [logs])

  const monthlyData = useMemo(() => {
    return MONTH_NAMES.map((month, i) => {
      const entries = logs.filter(g => {
        const d = new Date(g.date)
        return d.getFullYear() === chartYear && d.getMonth() === i
      })
      return {
        month,
        spent: entries.reduce((sum, g) => sum + (g.totalPrice || 0), 0),
        liters: entries.reduce((sum, g) => sum + (g.liters || 0), 0),
        fills: entries.length,
      }
    })
  }, [logs, chartYear])

  const yearTotal = monthlyData.reduce((sum, m) => sum + m.spent, 0)
  const yearLiters = monthlyData.reduce((sum, m) => sum + m.liters, 0)

  const totalSpent = logs.reduce((sum, g) => sum + (g.totalPrice || 0), 0)
  const totalLiters = logs.reduce((sum, g) => sum + (g.liters || 0), 0)

  const logsChronological = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date))
  const avgConsumption = useMemo(() => {
    const withKm = logsChronological.filter(g => g.currentKm > 0)
    if (withKm.length < 2) return null
    const totalKm = withKm[withKm.length - 1].currentKm - withKm[0].currentKm
    const litersInBetween = withKm.slice(1).reduce((s, g) => s + g.liters, 0)
    if (totalKm <= 0 || litersInBetween <= 0) return null
    return (litersInBetween / totalKm) * 100
  }, [logsChronological])

  return (
    <div className="tab-section">
      <div className="section-header">
        <div>
          <h3>Gas Log</h3>
          {logs.length > 0 && (
            <p className="text-muted">
              {logs.length} fill{logs.length !== 1 ? 's' : ''} · {totalLiters.toFixed(1)} L · €{totalSpent.toFixed(2)}
              {avgConsumption && ` · ~${avgConsumption.toFixed(1)} L/100km`}
            </p>
          )}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(o => !o)}>
          {showForm ? 'Cancel' : '+ Add Fill'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Liters *</label>
              <input type="number" name="liters" value={form.liters} onChange={handleChange} min="0" step="0.01" placeholder="e.g. 14.5" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Total Cost (€) *</label>
              <div className="input-prefix-wrap">
                <span className="currency-prefix">€</span>
                <input type="number" name="totalPrice" value={form.totalPrice} onChange={handleChange} min="0" step="0.01" placeholder="0.00" required />
              </div>
            </div>
            <div className="form-group">
              <label>Current KM</label>
              <input type="number" name="currentKm" value={form.currentKm} onChange={handleChange} min="0" placeholder="e.g. 15500" />
            </div>
          </div>
          <div className="form-group">
            <label>Station (optional)</label>
            <input name="station" value={form.station} onChange={handleChange} placeholder="e.g. Shell, BP..." />
          </div>
          {form.liters && form.totalPrice && (
            <div className="form-total">
              Price/Liter: €{(Number(form.totalPrice) / Number(form.liters)).toFixed(3)}
            </div>
          )}
          <button type="submit" className="btn btn-primary">Save Fill</button>
        </form>
      )}

      {logs.length > 0 && (
        <>
          <div className="section">
            <div className="chart-header">
              <h3>Monthly Spending</h3>
              <div className="year-selector">
                {years.map(y => (
                  <button
                    key={y}
                    className={`filter-btn ${chartYear === y ? 'active' : ''}`}
                    onClick={() => setChartYear(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-summary">
              <span>Year total: <strong>€{yearTotal.toFixed(2)}</strong></span>
              <span>{yearLiters.toFixed(1)} L</span>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                  <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#888', fontSize: 12 }} tickFormatter={v => `€${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }}
                    labelStyle={{ color: '#e0e0e0' }}
                    formatter={(value, name) => [
                      name === 'spent' ? `€${value.toFixed(2)}` : `${value.toFixed(1)} L`,
                      name === 'spent' ? 'Cost' : 'Liters'
                    ]}
                  />
                  <Legend formatter={name => name === 'spent' ? 'Cost (€)' : 'Liters'} />
                  <Bar dataKey="spent" fill="#ff6b35" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="liters" fill="#4a9eff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="section">
            <h3>Fill History</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Liters</th>
                  <th>Total</th>
                  <th>€/L</th>
                  <th>KM</th>
                  <th>Station</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {logs.map(g => (
                  <tr key={g.id}>
                    <td>{formatDate(g.date)}</td>
                    <td>{g.liters?.toFixed(2)} L</td>
                    <td>€{g.totalPrice?.toFixed(2)}</td>
                    <td>{g.liters ? `€${(g.totalPrice / g.liters).toFixed(3)}` : '—'}</td>
                    <td>{g.currentKm ? g.currentKm.toLocaleString() : '—'}</td>
                    <td className="text-muted">{g.station || '—'}</td>
                    <td>
                      <button className="btn-icon btn-danger-icon" onClick={() => deleteGasLog(bike.id, g.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {logs.length === 0 && (
        <div className="empty-state-sm">No gas fills recorded yet.</div>
      )}
    </div>
  )
}
