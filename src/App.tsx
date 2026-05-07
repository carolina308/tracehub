import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/Layout";

import Dashboard from "./pages/Dashboard";
import RegistrarRequisito from "./pages/RegistrarRequisito";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Historial from "./pages/Historial";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* REDIRECT INICIAL */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* LAYOUT */}
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
            path="/historial"
            element={<Historial />}
          />

          <Route
            path="/team"
            element={<Team />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;