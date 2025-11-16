import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Empresas from './pages/Empresas'
import Productos from './pages/Productos'
import Inventario from './pages/Inventario'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/empresas" element={
        <ProtectedRoute roles={['ADMIN','EXTERNO']}>
          <Empresas />
        </ProtectedRoute>
      }/>
      <Route path="/productos" element={
        <ProtectedRoute roles={['ADMIN']}>
          <Productos />
        </ProtectedRoute>
      }/>
      <Route path="/inventario" element={
        <ProtectedRoute roles={['ADMIN']}>
          <Inventario />
        </ProtectedRoute>
      }/>
    </Routes>
  )
}

export default App
