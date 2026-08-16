import { Routes, Route, Navigate } from "react-router-dom";
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

import TeacherQuizzes from "./pages/TeacherQuizzes";
import PeopleDirectory from "./pages/PeopleDirectory";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Calendar from "./pages/Calendar";
import StudyGroups from "./pages/StudyGroups";
import Flashcards from "./pages/Flashcards";
import Assignments from "./pages/Assignments";
import Mastery from "./pages/Mastery";

import Settings from "./pages/Settings";
import SearchPage from "./pages/SearchPage";
import Clubs from "./pages/Clubs";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import OfflineBanner from "./components/OfflineBanner";
import { useEffect, useState } from "react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const existingUser = localStorage.getItem("user");
    if (token && !existingUser) {
      const userData = {
        name: localStorage.getItem("userName") || "User",
        role: localStorage.getItem("userRole") || "guest",
        id: localStorage.getItem("userId"),
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "transparent" }}>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", position: "relative" }}>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
                  style={{
                    position: "fixed",
                    top: "20px",
                    left: isSidebarOpen ? "calc(var(--sidebar-width) - 60px)" : "20px",
                    zIndex: 2000,
                    background: "rgba(26, 27, 46, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ fontSize: "1.2rem" }}>{isSidebarOpen ? "✕" : "☰"}</div>
                </button>

                <div
                  style={{
                    transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "fixed",
                    height: "100vh",
                    zIndex: 1000,
                    width: "var(--sidebar-width)",
                  }}
                >
                  <Navigation />
                </div>

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
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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

                      <Route path="/teacher-quizzes" element={<TeacherQuizzes />} />
                      <Route path="/people" element={<PeopleDirectory />} />
                      <Route path="/classes" element={<Classes />} />
                      <Route path="/classes/:id" element={<ClassDetail />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/messages/:userId" element={<Messages />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/study-groups" element={<StudyGroups />} />
                      <Route path="/flashcards" element={<Flashcards />} />
                      <Route path="/assignments" element={<Assignments />} />
                      <Route path="/mastery" element={<Mastery />} />

                      <Route path="/settings" element={<Settings />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/clubs" element={<Clubs />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="*" element={<Navigate to="/home" replace />} />
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
