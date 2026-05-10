import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AddBikePage from './pages/AddBikePage'
import BikeDetailPage from './pages/BikeDetailPage'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-bike" element={<AddBikePage />} />
          <Route path="/bike/:id" element={<BikeDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}
