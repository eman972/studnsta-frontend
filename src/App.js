import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
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
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

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
              <div style={{ display: "flex" }}>
                <Navigation />
                <main
                  style={{
                    flex: 1,
                    marginLeft: "var(--sidebar-width)",
                    padding: "0",
                    width: "calc(100% - var(--sidebar-width))",
                    minHeight: "100vh",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ padding: "2rem", flex: 1 }}>
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/notes" element={<Notes />} />
                      <Route path="/profile/:userId?" element={<Profile />} />
                      <Route path="/progress" element={<ProgressDashboard />} />
                      <Route path="/quiz-setup" element={<QuizSetup />} />
                      <Route path="/quiz" element={<QuizPage />} />
                      <Route path="/quiz-result" element={<ResultPage />} />
                      <Route path="/quiz-history" element={<QuizHistory />} />
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
