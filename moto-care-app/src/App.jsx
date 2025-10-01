import { useState } from 'react'
import './App.css'
import CarInfo from './Hello'



function App() {
  const [bikes, setBikes] = useState([
    { id: 1, brand: "Honda", model: "CB500F", year: 2020 },
    { id: 2, brand: "Yamaha", model: "MT-07", year: 2022 },
  ])

  // State για τη φόρμα (controlled inputs)
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: ''
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleAdd(e) {
    e.preventDefault() // μη γίνει page refresh
    // Βασικός έλεγχος
    if (!form.brand || !form.model || !form.year) return

    const newBike = {
      id: Date.now(),
      brand: form.brand,
      model: form.model,
      year: Number(form.year) // κράτα το ως αριθμό
    }

    setBikes(prev => [...prev, newBike])
    setForm({ brand: '', model: '', year: '' }) // καθάρισε φόρμα
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Λίστα Μηχανών</h1>

      {/* Φόρμα εισαγωγής */}
      <form onSubmit={handleAdd} style={{ display: 'grid', gap: 8, maxWidth: 320, marginBottom: 16 }}>
        <input
          name="brand"
          placeholder="Μάρκα (π.χ. Honda)"
          value={form.brand}
          onChange={handleChange}
        />
        <input
          name="model"
          placeholder="Μοντέλο (π.χ. CB500F)"
          value={form.model}
          onChange={handleChange}
        />
        <input
          name="year"
          type="number"
          placeholder="Έτος (π.χ. 2020)"
          value={form.year}
          onChange={handleChange}
        />
        <button type="submit">Πρόσθεσε Μηχανή</button>
      </form>

      {bikes.map(bike => (
        <CarInfo
          key={bike.id}
          brand={bike.brand}
          model={bike.model}
          year={bike.year}
        />
      ))}
    </main>
  )
}

export default App
