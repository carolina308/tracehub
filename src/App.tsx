import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";

import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Historial from "./pages/Historial";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/register-requirement"
            element={<Register />}
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