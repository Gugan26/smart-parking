import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ParkingDashboard } from "./components/ParkingDashboard";
import { MonthlyPassForm } from "./components/MonthlyPassForm";
import { YearlyPassForm } from "./components/YearlyPassForm";

export default function App() {
  return (
    // Intha <Router> thaan romba mukkiyam. Ithukkulla thaan ellamae irukanum.
    <Router>
      <Routes>
        {/* Main Dashboard (Inthukkulla thaan ReservationPanel irukku) */}
        <Route path="/" element={<ParkingDashboard />} />
        
        {/* Monthly Pass Page */}
        <Route path="/monthly-pass" element={<MonthlyPassForm />} />
        <Route path="/yearly-pass" element={<YearlyPassForm></YearlyPassForm>} />
      </Routes>
    </Router>
  );
}