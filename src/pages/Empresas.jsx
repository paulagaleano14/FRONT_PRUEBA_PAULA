import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Empresas() {
  const [empresas, setEmpresas] = useState([])

  useEffect(() => {
    api.get('/empresas').then(res => setEmpresas(res.data))
  }, [])

  return (
    <div>
      <h2>Empresas</h2>
      <ul>
        {empresas.map(e => (
          <li key={e.nit}>{e.nit} - {e.nombre}</li>
        ))}
      </ul>
    </div>
  )
}
