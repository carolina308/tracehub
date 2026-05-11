import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./layout/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import RegistrarRequisito from "./pages/RegistrarRequisito";
import Historial from "./pages/Historial";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import QA from "./pages/QA";
import AsignarRequisitos from "./pages/AsignarRequisitos";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PRIVATE ROUTES */}
        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/register-requirement"
            element={<RegistrarRequisito />}
          />

          <Route
            path="/asignar-requisitos"
            element={<AsignarRequisitos />}
          />

          <Route
            path="/historial"
            element={<Historial />}
          />

        <Route
          path="/team"
          element={<Team />}
        />
        
        <Route
          path="/qa"
          element={<QA />}
        />
        
        <Route
          path="/settings"
          element={<Settings />}
        />

        </Route>

        {/* DEFAULT */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;