import { useState } from 'react'
import { useBikes } from '../../context/BikeContext'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function nextYear(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().split('T')[0]
}

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  km: '',
  description: '',
  laborCost: '',
  notes: '',
}

export default function ServicesTab({ bike }) {
  const { addService, deleteService } = useBikes()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [parts, setParts] = useState([{ name: '', price: '' }])
  const [expanded, setExpanded] = useState(null)

  const services = [...(bike.services || [])].sort((a, b) => new Date(b.date) - new Date(a.date))

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handlePartChange(i, field, value) {
    setParts(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  function addPart() {
    setParts(prev => [...prev, { name: '', price: '' }])
  }

  function removePart(i) {
    setParts(prev => prev.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validParts = parts.filter(p => p.name.trim())
    const partsTotal = validParts.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
    const laborCost = Number(form.laborCost) || 0
    const totalCost = partsTotal + laborCost

    addService(bike.id, {
      date: form.date,
      km: Number(form.km) || 0,
      description: form.description,
      laborCost,
      parts: validParts.map(p => ({ name: p.name, price: Number(p.price) || 0 })),
      totalCost,
      notes: form.notes,
      nextServiceDate: nextYear(form.date),
      nextServiceKm: (Number(form.km) || 0) + 5000,
    })

    setForm(emptyForm)
    setParts([{ name: '', price: '' }])
    setShowForm(false)
  }

  const totalSpent = services.reduce((sum, s) => sum + (s.totalCost || 0), 0)

  return (
    <div className="tab-section">
      <div className="section-header">
        <div>
          <h3>Service History</h3>
          {services.length > 0 && (
            <p className="text-muted">{services.length} service{services.length !== 1 ? 's' : ''} · Total: €{totalSpent.toFixed(2)}</p>
          )}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(o => !o)}>
          {showForm ? 'Cancel' : '+ Add Service'}
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
              <label>KM at Service *</label>
              <input type="number" name="km" value={form.km} onChange={handleChange} min="0" placeholder="e.g. 15000" required />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input name="description" value={form.description} onChange={handleChange} placeholder="e.g. Full service, oil change, filter" />
          </div>

          <div className="form-group">
            <label>Parts Used</label>
            <div className="parts-list">
              {parts.map((p, i) => (
                <div key={i} className="part-row">
                  <input
                    value={p.name}
                    onChange={e => handlePartChange(i, 'name', e.target.value)}
                    placeholder="Part name (e.g. Oil filter)"
                    className="part-name"
                  />
                  <div className="part-price-wrap">
                    <span className="currency-prefix">€</span>
                    <input
                      type="number"
                      value={p.price}
                      onChange={e => handlePartChange(i, 'price', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="part-price"
                    />
                  </div>
                  {parts.length > 1 && (
                    <button type="button" className="btn-icon" onClick={() => removePart(i)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-ghost btn-sm" onClick={addPart}>+ Add Part</button>
            </div>
          </div>

          <div className="form-group">
            <label>Labor Cost</label>
            <div className="input-prefix-wrap">
              <span className="currency-prefix">€</span>
              <input type="number" name="laborCost" value={form.laborCost} onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Additional notes..." />
          </div>

          <div className="form-total">
            Total: €{(
              parts.reduce((s, p) => s + (Number(p.price) || 0), 0) + (Number(form.laborCost) || 0)
            ).toFixed(2)}
          </div>

          <button type="submit" className="btn btn-primary">Save Service</button>
        </form>
      )}

      {services.length === 0 ? (
        <div className="empty-state-sm">No services recorded yet.</div>
      ) : (
        <div className="services-list">
          {services.map(s => (
            <div key={s.id} className="service-item">
              <div className="service-header" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                <div className="service-header-left">
                  <span className="service-date">{formatDate(s.date)}</span>
                  <span className="service-km">{s.km?.toLocaleString()} km</span>
                  {s.description && <span className="service-desc">{s.description}</span>}
                </div>
                <div className="service-header-right">
                  <span className="service-cost">€{(s.totalCost || 0).toFixed(2)}</span>
                  <span className="service-chevron">{expanded === s.id ? '▴' : '▾'}</span>
                </div>
              </div>

              {expanded === s.id && (
                <div className="service-details">
                  {s.parts?.length > 0 && (
                    <table className="data-table">
                      <thead>
                        <tr><th>Part</th><th>Cost</th></tr>
                      </thead>
                      <tbody>
                        {s.parts.map((p, i) => (
                          <tr key={i}>
                            <td>{p.name}</td>
                            <td>€{Number(p.price).toFixed(2)}</td>
                          </tr>
                        ))}
                        {s.laborCost > 0 && (
                          <tr>
                            <td><em>Labor</em></td>
                            <td>€{Number(s.laborCost).toFixed(2)}</td>
                          </tr>
                        )}
                        <tr className="table-total">
                          <td><strong>Total</strong></td>
                          <td><strong>€{(s.totalCost || 0).toFixed(2)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  {s.notes && <p className="service-notes"><em>{s.notes}</em></p>}
                  <div className="service-next">
                    Next service due: <strong>{formatDate(s.nextServiceDate)}</strong> or at <strong>{s.nextServiceKm?.toLocaleString()} km</strong>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteService(bike.id, s.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
