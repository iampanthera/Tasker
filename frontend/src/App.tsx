// App.tsx

import React from "react";

import { useCookies } from "react-cookie";

import "react-toastify/dist/ReactToastify.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/task";

interface ProtectedRouteProps {
  children: React.ReactNode;
}
const PrivateRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [cookies] = useCookies(["authToken"]);

  const isAuthenticated = () => {
    return !!cookies.authToken;
  };

  console.log("isAuth", isAuthenticated());

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
