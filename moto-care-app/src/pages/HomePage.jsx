import { Link } from 'react-router-dom'
import { useBikes } from '../context/BikeContext'
import BikeCard from '../components/BikeCard'

export default function HomePage() {
  const { bikes } = useBikes()

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Bikes</h1>
        <Link to="/add-bike" className="btn btn-primary">+ Add Bike</Link>
      </div>

      {bikes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏍️</div>
          <h2>No bikes yet</h2>
          <p>Add your first bike to start tracking services, maintenance and fuel.</p>
          <Link to="/add-bike" className="btn btn-primary">Add your first bike</Link>
        </div>
      ) : (
        <div className="bikes-grid">
          {bikes.map(bike => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      )}
    </div>
  )
}
