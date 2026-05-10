import { createContext, useContext, useState, useEffect } from 'react'

const BikeContext = createContext()

export function BikeProvider({ children }) {
  const [bikes, setBikes] = useState(() => {
    const saved = localStorage.getItem('moto-care-bikes')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('moto-care-bikes', JSON.stringify(bikes))
  }, [bikes])

  function addBike(bike) {
    const newBike = {
      ...bike,
      id: Date.now().toString(),
      currentKm: Number(bike.currentKm) || 0,
      services: [],
      maintenance: [],
      gasLogs: [],
    }
    setBikes(prev => [...prev, newBike])
    return newBike.id
  }

  function updateBike(id, updates) {
    setBikes(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  function deleteBike(id) {
    setBikes(prev => prev.filter(b => b.id !== id))
  }

  function getBike(id) {
    return bikes.find(b => b.id === id)
  }

  function addService(bikeId, service) {
    const bike = getBike(bikeId)
    if (!bike) return
    const newService = { ...service, id: Date.now().toString() }
    updateBike(bikeId, { services: [...bike.services, newService] })
  }

  function deleteService(bikeId, serviceId) {
    const bike = getBike(bikeId)
    if (!bike) return
    updateBike(bikeId, { services: bike.services.filter(s => s.id !== serviceId) })
  }

  function addMaintenance(bikeId, item) {
    const bike = getBike(bikeId)
    if (!bike) return
    const newItem = { ...item, id: Date.now().toString() }
    updateBike(bikeId, { maintenance: [...bike.maintenance, newItem] })
  }

  function deleteMaintenance(bikeId, itemId) {
    const bike = getBike(bikeId)
    if (!bike) return
    updateBike(bikeId, { maintenance: bike.maintenance.filter(m => m.id !== itemId) })
  }

  function addGasLog(bikeId, log) {
    const bike = getBike(bikeId)
    if (!bike) return
    const newLog = { ...log, id: Date.now().toString() }
    updateBike(bikeId, { gasLogs: [...bike.gasLogs, newLog] })
  }

  function deleteGasLog(bikeId, logId) {
    const bike = getBike(bikeId)
    if (!bike) return
    updateBike(bikeId, { gasLogs: bike.gasLogs.filter(g => g.id !== logId) })
  }

  return (
    <BikeContext.Provider value={{
      bikes, addBike, updateBike, deleteBike, getBike,
      addService, deleteService,
      addMaintenance, deleteMaintenance,
      addGasLog, deleteGasLog,
    }}>
      {children}
    </BikeContext.Provider>
  )
}

export function useBikes() {
  return useContext(BikeContext)
}
