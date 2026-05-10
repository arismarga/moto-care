import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useBikes } from '../context/BikeContext'
import OverviewTab from '../components/tabs/OverviewTab'
import ServicesTab from '../components/tabs/ServicesTab'
import MaintenanceTab from '../components/tabs/MaintenanceTab'
import GasTab from '../components/tabs/GasTab'

const TABS = ['Overview', 'Services', 'Maintenance', 'Gas']

export default function BikeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBike, updateBike, deleteBike } = useBikes()
  const [activeTab, setActiveTab] = useState('Overview')
  const [editingKm, setEditingKm] = useState(false)
  const [kmInput, setKmInput] = useState('')

  const bike = getBike(id)

  if (!bike) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Bike not found</h2>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  function handleDelete() {
    if (!confirm(`Delete ${bike.brand} ${bike.model}? This cannot be undone.`)) return
    deleteBike(id)
    navigate('/')
  }

  function handleUpdateKm() {
    const val = Number(kmInput)
    if (!isNaN(val) && val >= 0) {
      updateBike(id, { currentKm: val })
    }
    setEditingKm(false)
    setKmInput('')
  }

  return (
    <div className="page">
      <div className="bike-detail-hero">
        {bike.image && (
          <div className="bike-detail-image">
            <img src={bike.image} alt={`${bike.brand} ${bike.model}`} />
          </div>
        )}
        <div className="bike-detail-info">
          <div className="bike-detail-title">
            <div>
              <h1>{bike.brand} {bike.model}</h1>
              <div className="bike-detail-meta">
                <span>{bike.year}</span>
                {bike.plate && <span className="plate-badge">{bike.plate}</span>}
              </div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete Bike</button>
          </div>

          <div className="km-display">
            {editingKm ? (
              <div className="km-edit">
                <input
                  type="number"
                  value={kmInput}
                  onChange={e => setKmInput(e.target.value)}
                  autoFocus
                  min="0"
                  placeholder={bike.currentKm}
                />
                <button className="btn btn-primary btn-sm" onClick={handleUpdateKm}>Save</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingKm(false)}>Cancel</button>
              </div>
            ) : (
              <div className="km-value" onClick={() => { setEditingKm(true); setKmInput(bike.currentKm) }}>
                <span className="km-number">{(bike.currentKm || 0).toLocaleString()}</span>
                <span className="km-label">km  ✎</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'Overview'    && <OverviewTab bike={bike} updateBike={updateBike} />}
        {activeTab === 'Services'    && <ServicesTab bike={bike} />}
        {activeTab === 'Maintenance' && <MaintenanceTab bike={bike} />}
        {activeTab === 'Gas'         && <GasTab bike={bike} />}
      </div>
    </div>
  )
}
