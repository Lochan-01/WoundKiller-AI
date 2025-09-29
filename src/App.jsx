import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TakePhoto from "./pages/TakePhoto";
import ProgressTrends from "./pages/ProgressTrends";
import AskDoctor from "./pages/AskDoctor";
import FindHospitals from "./pages/FindHospitals";
import DoctorReview from "./pages/DoctorReview";
import { useNavigate } from "react-router-dom";
import LiveCamera from "./pages/LiveCamera";
import WoundAnalysis from "./components/WoundAnalysis";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      setLoggedIn(true);
    }
  }, []);

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
      <>
        <Navbar />
        <Sidebar />
        <div className="ml-64 mt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/take-photo" element={<TakePhoto />} />
            <Route path="/progress-trends" element={<ProgressTrends />} />
            <Route path="/ask-doctor" element={<AskDoctor />} />
            <Route path="/live-camera" element={<LiveCamera />} />
            <Route path="/find-hospitals" element={<FindHospitals />} />
            <Route path="/doctor-review" element={<DoctorReview />} />
            <Route path="/wound-analysis" element={<WoundAnalysis />} />
          </Routes>
          <div className="fixed bottom-4 right-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </>
  );
}

export default App;
