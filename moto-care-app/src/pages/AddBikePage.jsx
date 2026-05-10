import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBikes } from '../context/BikeContext'

export default function AddBikePage() {
  const { addBike } = useBikes()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    brand: '', model: '', year: new Date().getFullYear(), plate: '', currentKm: 0, image: ''
  })
  const [preview, setPreview] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setForm(prev => ({ ...prev, image: ev.target.result }))
      setPreview(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.brand || !form.model || !form.year) return
    const id = addBike(form)
    navigate(`/bike/${id}`)
  }

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <h1>Add Bike</h1>
        <Link to="/" className="btn btn-ghost">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Brand *</label>
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Kawasaki" required />
          </div>
          <div className="form-group">
            <label>Model *</label>
            <input name="model" value={form.model} onChange={handleChange} placeholder="e.g. Versys 650" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Year *</label>
            <input name="year" type="number" min="1900" max="2100" value={form.year} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Plate</label>
            <input name="plate" value={form.plate} onChange={handleChange} placeholder="e.g. ABC-1234" />
          </div>
        </div>

        <div className="form-group">
          <label>Current KM</label>
          <input name="currentKm" type="number" min="0" value={form.currentKm} onChange={handleChange} placeholder="0" />
        </div>

        <div className="form-group">
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={handleImage} className="input-file" />
          {preview && (
            <div className="image-preview-wrap">
              <img src={preview} alt="preview" className="image-preview" />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-full">Save Bike</button>
      </form>
    </div>
  )
}
