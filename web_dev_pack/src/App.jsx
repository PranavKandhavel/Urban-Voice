import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import ReportIssue from "./components/ReportIssue";
import MyComplaints from "./components/MyComplaints";

function PrivateRoute({ children }) {
  const user = localStorage.getItem("loggedInUser");
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/report" element={<PrivateRoute><ReportIssue /></PrivateRoute>} />
        <Route path="/my-complaints" element={<PrivateRoute><MyComplaints /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
