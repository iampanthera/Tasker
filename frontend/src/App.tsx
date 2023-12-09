// App.tsx

import React from 'react';

import { useCookies } from 'react-cookie';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import Auth from './pages/Auth';
import Home from './pages/Task';

interface ProtectedRouteProps {
  children: React.ReactNode;
}
const PrivateRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [cookies] = useCookies(['authToken']);

  const isAuthenticated = () => {
    return !!cookies.authToken;
  };

  if (!isAuthenticated()) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Auth isLogin={true} />} />

          <Route path='/register' element={<Auth />} />

          <Route
            path='/'
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
