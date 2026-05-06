import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RegistrarRequisito from './pages/RegistrarRequisito';
import RegistrarCambios from './pages/RegistrarCambios';
import AsignarRequisitos from './pages/AsignarRequisitos';
import ValidarCalidad from './pages/ValidarCalidad';
import TableroKanban from './pages/TableroKanban';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Layout from './layout/Layout';

function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE + LAYOUT */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>

            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<TableroKanban />} />
            <Route path="/registrar-requisito" element={<RegistrarRequisito />} />
            <Route path="/registrar-cambios" element={<RegistrarCambios />} />
            <Route path="/asignar-requisitos" element={<AsignarRequisitos />} />
            <Route path="/validar-calidad" element={<ValidarCalidad />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Settings />} />

          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={
          localStorage.getItem('token')
            ? <Navigate to="/" replace />
            : <Navigate to="/login" replace />
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;