import { Link } from 'react-router-dom'

export default function BikeCard({ bike }) {
  const lastService = bike.services?.length
    ? bike.services.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null

  const nextServiceKm = lastService ? lastService.nextServiceKm : null
  const kmLeft = nextServiceKm ? nextServiceKm - bike.currentKm : null
  const dueSoon = kmLeft !== null && kmLeft <= 500

  return (
    <Link to={`/bike/${bike.id}`} className="bike-card">
      <div className="bike-card-image">
        {bike.image
          ? <img src={bike.image} alt={`${bike.brand} ${bike.model}`} />
          : <div className="bike-card-placeholder">🏍️</div>
        }
      </div>
      <div className="bike-card-body">
        <div className="bike-card-header">
          <h2 className="bike-card-name">{bike.brand} {bike.model}</h2>
          <span className="bike-card-year">{bike.year}</span>
        </div>
        {bike.plate && <p className="bike-card-plate">{bike.plate}</p>}
        <p className="bike-card-km">{(bike.currentKm || 0).toLocaleString()} km</p>
        {nextServiceKm && (
          <p className={`bike-card-service ${dueSoon ? 'due-soon' : ''}`}>
            Next service: {nextServiceKm.toLocaleString()} km
            {dueSoon && ' ⚠️'}
          </p>
        )}
      </div>
    </Link>
  )
}
