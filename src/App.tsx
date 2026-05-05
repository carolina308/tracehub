import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RegistrarRequisito from './pages/RegistrarRequisito';
import RegistrarCambios from './pages/RegistrarCambios';
import AsignarRequisitos from './pages/AsignarRequisitos';
import ValidarCalidad from './pages/ValidarCalidad';
import TableroKanban from './pages/TableroKanban';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tablerokanban" element={<TableroKanban />} />
        <Route path="/registrar-requisito" element={<RegistrarRequisito />} />
        <Route path="/registrar-cambios" element={<RegistrarCambios />} />
        <Route path="/asignar-requisitos" element={<AsignarRequisitos />} />
        <Route path="/validar-calidad" element={<ValidarCalidad />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
