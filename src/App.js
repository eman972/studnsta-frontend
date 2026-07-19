import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Connect from "./pages/Connect";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import ProgressDashboard from "./pages/ProgressDashboard";
import QuizSetup from "./pages/QuizSetup";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import QuizHistory from "./pages/QuizHistory";
import LiveQuizSetup from "./pages/LiveQuizSetup";
import LiveQuizPage from "./pages/LiveQuizPage";
import LiveQuizResult from "./pages/LiveQuizResult";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AiTutor from "./pages/AiTutor";
import Leaderboard from "./pages/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = {
        name: localStorage.getItem("userName") || "User",
        role: localStorage.getItem("userRole") || "guest",
        id: localStorage.getItem("userId"),
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }
    
    // Auto collapse on small screens
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "transparent" }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", position: "relative" }}>
                {/* Hamburger Menu Toggle */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  style={{
                    position: 'fixed',
                    top: '20px',
                    left: isSidebarOpen ? 'calc(var(--sidebar-width) - 60px)' : '20px',
                    zIndex: 2000,
                    background: 'rgba(26, 27, 46, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ fontSize: '1.2rem' }}>{isSidebarOpen ? '✕' : '☰'}</div>
                </button>

                {/* Sidebar Container */}
                <div style={{ 
                  transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'fixed',
                  height: '100vh',
                  zIndex: 1000,
                  width: 'var(--sidebar-width)'
                }}>
                  <Navigation />
                </div>

                {/* Main Content */}
                <main
                  style={{
                    flex: 1,
                    marginLeft: isSidebarOpen ? "var(--sidebar-width)" : "0",
                    padding: "0",
                    width: isSidebarOpen ? "calc(100% - var(--sidebar-width))" : "100%",
                    minHeight: "100vh",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div style={{ padding: "2rem", flex: 1 }}>
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/connect" element={<Connect />} />
                      <Route path="/notes" element={<Notes />} />
                      <Route path="/profile/:userId?" element={<Profile />} />
                      <Route path="/progress" element={<ProgressDashboard />} />
                      <Route path="/quiz-setup" element={<QuizSetup />} />
                      <Route path="/quiz" element={<QuizPage />} />
                      <Route path="/quiz-result" element={<ResultPage />} />
                      <Route path="/quiz-history" element={<QuizHistory />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/live-quiz-setup" element={<LiveQuizSetup />} />
                      <Route path="/quiz/live/:id" element={<LiveQuizPage />} />
                      <Route path="/live-quiz-result" element={<LiveQuizResult />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/ai-tutor" element={<AiTutor />} />
                    </Routes>
                  </div>
                  <Footer />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
