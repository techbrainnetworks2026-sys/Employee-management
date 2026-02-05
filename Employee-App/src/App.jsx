import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmployeeDashboard from "./pages/employee_dashboard/EmployeeDashboard.jsx";
import SignIn from "./pages/auth/SignIn.jsx";
import SignUp from "./pages/auth/SignUp.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
