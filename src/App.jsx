import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Empresas from './pages/Empresas';
import Productos from './pages/Productos';
import Inventario from './pages/Inventario';
import Forbbiden from './pages/Forbbiden';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './js/const';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/empresas" element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.EXTERNO]}>
            <Empresas />
          </ProtectedRoute>
        }/>

        <Route path="/productos" element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <Productos />
          </ProtectedRoute>
        }/>

        <Route path="/inventario" element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <Inventario />
          </ProtectedRoute>
        }/>

        <Route path="/forbidden" element={<Forbbiden />} />

      </Routes>
    </>
  );
}

export default App;
