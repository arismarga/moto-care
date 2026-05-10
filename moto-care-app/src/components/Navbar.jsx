import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBikes } from '../context/BikeContext'

export default function Navbar() {
  const { bikes } = useBikes()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-logo">🏍️</span>
        <span>MotoCare</span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>

        <div className="dropdown" ref={dropdownRef}>
          <button className="nav-link dropdown-trigger" onClick={() => setOpen(o => !o)}>
            Bikes <span className="chevron">{open ? '▴' : '▾'}</span>
          </button>
          {open && (
            <div className="dropdown-menu">
              {bikes.length === 0 && (
                <span className="dropdown-empty">No bikes yet</span>
              )}
              {bikes.map(bike => (
                <Link
                  key={bike.id}
                  to={`/bike/${bike.id}`}
                  className="dropdown-item"
                  onClick={() => setOpen(false)}
                >
                  {bike.brand} {bike.model}
                  <span className="dropdown-item-year">{bike.year}</span>
                </Link>
              ))}
              <div className="dropdown-divider" />
              <Link
                to="/add-bike"
                className="dropdown-item dropdown-add"
                onClick={() => setOpen(false)}
              >
                + Add Bike
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
