import { useState } from 'react'
import { useBikes } from '../../context/BikeContext'

const MAINTENANCE_TYPES = [
  'Oil Change',
  'Front Brake Pads',
  'Rear Brake Pads',
  'Front Brake Disc',
  'Rear Brake Disc',
  'Brake Fluid',
  'Front Tire',
  'Rear Tire',
  'Chain & Sprockets',
  'Air Filter',
  'Spark Plugs',
  'Coolant',
  'Clutch Cable',
  'Throttle Cable',
  'Battery',
  'Fork Oil',
  'Other',
]

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
}

const emptyForm = {
  type: MAINTENANCE_TYPES[0],
  customType: '',
  date: new Date().toISOString().split('T')[0],
  km: '',
  price: '',
  notes: '',
  nextDate: '',
  nextKm: '',
}

export default function MaintenanceTab({ bike }) {
  const { addMaintenance, deleteMaintenance } = useBikes()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [filterType, setFilterType] = useState('All')

  const maintenance = [...(bike.maintenance || [])].sort((a, b) => new Date(b.date) - new Date(a.date))
  const types = ['All', ...new Set(maintenance.map(m => m.type))]
  const filtered = filterType === 'All' ? maintenance : maintenance.filter(m => m.type === filterType)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const type = form.type === 'Other' && form.customType ? form.customType : form.type
    addMaintenance(bike.id, {
      type,
      date: form.date,
      km: Number(form.km) || 0,
      price: Number(form.price) || 0,
      notes: form.notes,
      nextDate: form.nextDate || null,
      nextKm: form.nextKm ? Number(form.nextKm) : null,
    })
    setForm(emptyForm)
    setShowForm(false)
  }

  const totalCost = maintenance.reduce((sum, m) => sum + (m.price || 0), 0)

  return (
    <div className="tab-section">
      <div className="section-header">
        <div>
          <h3>Maintenance Records</h3>
          {maintenance.length > 0 && (
            <p className="text-muted">{maintenance.length} record{maintenance.length !== 1 ? 's' : ''} · Total: €{totalCost.toFixed(2)}</p>
          )}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(o => !o)}>
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select name="type" value={form.type} onChange={handleChange}>
                {MAINTENANCE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {form.type === 'Other' && (
              <div className="form-group">
                <label>Custom Type *</label>
                <input name="customType" value={form.customType} onChange={handleChange} placeholder="e.g. Valve clearance" required />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>KM at Change</label>
              <input type="number" name="km" value={form.km} onChange={handleChange} min="0" placeholder="e.g. 15000" />
            </div>
          </div>

          <div className="form-group">
            <label>Cost (€)</label>
            <div className="input-prefix-wrap">
              <span className="currency-prefix">€</span>
              <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" placeholder="0.00" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Next Due Date</label>
              <input type="date" name="nextDate" value={form.nextDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Next Due KM</label>
              <input type="number" name="nextKm" value={form.nextKm} onChange={handleChange} min="0" placeholder="e.g. 20000" />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Brand, model, any notes..." />
          </div>

          <button type="submit" className="btn btn-primary">Save Record</button>
        </form>
      )}

      {maintenance.length > 1 && (
        <div className="filter-bar">
          {types.map(t => (
            <button
              key={t}
              className={`filter-btn ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state-sm">No maintenance records yet.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>KM</th>
              <th>Cost</th>
              <th>Next Date</th>
              <th>Next KM</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const days = daysUntil(m.nextDate)
              const dueSoon = days !== null && days <= 30
              return (
                <tr key={m.id}>
                  <td><strong>{m.type}</strong></td>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.km ? m.km.toLocaleString() : '—'}</td>
                  <td>{m.price ? `€${Number(m.price).toFixed(2)}` : '—'}</td>
                  <td className={dueSoon ? 'text-warn' : ''}>
                    {formatDate(m.nextDate)}
                    {dueSoon && ' ⚠️'}
                  </td>
                  <td>{m.nextKm ? m.nextKm.toLocaleString() + ' km' : '—'}</td>
                  <td className="text-muted">{m.notes || '—'}</td>
                  <td>
                    <button className="btn-icon btn-danger-icon" onClick={() => deleteMaintenance(bike.id, m.id)}>✕</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
