import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./ThemeContext";

import Signup from "./components/signup";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import ReportIssue from "./components/ReportIssue";
import Settings from "./components/Settings";

import Complaints from "./components/Complaints";

import ErrorBoundary from "./components/ErrorBoundary";

import { useState, useEffect } from "react";

function PrivateRoute({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
    setLoading(false);
  }, []);
 
  if (loading) return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', background: '#060e1c', color: '#2ECC71',
      fontFamily: "'Rajdhani', sans-serif", fontSize: 16, fontWeight: 600,
    }}>
      Loading...
    </div>
  );
  return isAuth ? children : <Navigate to="/login" replace />;
}
 
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/report" element={<PrivateRoute><ReportIssue /></PrivateRoute>} />
            <Route path="/my-complaints" element={<PrivateRoute><Complaints /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}
 
export default App;
