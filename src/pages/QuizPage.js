import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getQuestions, saveQuizResult } from "../services/quizApiService";
import "../styles/quizSecurity.css";

function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, topic, questionCount } = location.state || {};
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(questionCount * 60); // 1 minute per question
  const [startTime, setStartTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showFullscreenOverlay, setShowFullscreenOverlay] = useState(false);
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(false);
  const timerRef = useRef(null);
  const securityCleanupRef = useRef(null);

  // Security feature handlers
  const handleVisibilityChange = () => {
    if (document.hidden && isSecurityEnabled) {
      console.log('Tab switched - cancelling quiz');
      handleCancelQuiz('Tab switching detected');
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && isSecurityEnabled) {
      console.log('Fullscreen exited - cancelling quiz');
      handleCancelQuiz('Fullscreen mode exited');
    }
  };

  const handleContextMenu = (e) => {
    if (isSecurityEnabled) {
      e.preventDefault();
      return false;
    }
  };

  const handleCopy = (e) => {
    if (isSecurityEnabled) {
      e.preventDefault();
      return false;
    }
  };

  const handlePaste = (e) => {
    if (isSecurityEnabled) {
      e.preventDefault();
      return false;
    }
  };

  const handleCut = (e) => {
    if (isSecurityEnabled) {
      e.preventDefault();
      return false;
    }
  };

  const handleKeyDown = (e) => {
    if (isSecurityEnabled) {
      // Disable common shortcuts
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // DevTools
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // DevTools
        (e.ctrlKey && e.shiftKey && e.key === 'C') || // DevTools
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        return false;
      }
    }
  };

  // Request fullscreen and enable security features
  const enableSecurityFeatures = async () => {
    // Show fullscreen overlay first
    setShowFullscreenOverlay(true);
    
    try {
      // Request fullscreen
      await document.documentElement.requestFullscreen();
      
      // Hide overlay and enable security
      setShowFullscreenOverlay(false);
      setIsSecurityEnabled(true);
      
      // Add event listeners
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('copy', handleCopy);
      document.addEventListener('paste', handlePaste);
      document.addEventListener('cut', handleCut);
      document.addEventListener('keydown', handleKeyDown);
      
      // Store cleanup function
      securityCleanupRef.current = () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('copy', handleCopy);
        document.removeEventListener('paste', handlePaste);
        document.removeEventListener('cut', handleCut);
        document.removeEventListener('keydown', handleKeyDown);
        
        // Exit fullscreen if still in fullscreen
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        
        setIsSecurityEnabled(false);
      };
      
    } catch (error) {
      console.error('Failed to enable security features:', error);
      setShowFullscreenOverlay(false);
      // If fullscreen fails, still proceed with quiz but note the limitation
      setIsSecurityEnabled(true);
      alert('Fullscreen mode is not available. Quiz will proceed without enhanced security.');
    }
  };

  // Cancel quiz and save as cancelled
  const handleCancelQuiz = async (reason = 'Quiz cancelled') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate partial results if any answers exist
      const endTime = new Date();
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      let correctAnswers = 0;
      
      const answers = questions.map((question, index) => {
        const userAnswer = userAnswers[index];
        if (userAnswer) {
          const isCorrect = userAnswer === question.correctAnswer;
          if (isCorrect) correctAnswers++;
          
          return {
            questionId: question._id,
            selectedAnswer: userAnswer,
            isCorrect,
            timeSpent: 0
          };
        }
        
        return {
          questionId: question._id,
          selectedAnswer: "Not Answered",
          isCorrect: false,
          timeSpent: 0
        };
      });

      // Save quiz result with cancelled status
      await saveQuizResult({
        subject,
        topic,
        totalQuestions: questions.length,
        correctAnswers,
        timeTaken,
        answers,
        status: "cancelled"
      });

      // Show alert to user
      alert(`Quiz cancelled: ${reason}. Your progress has been saved.`);
      
      // Navigate back to setup
      navigate("/quiz-setup");
      
    } catch (error) {
      console.error('Error saving cancelled quiz:', error);
      // Even if saving fails, navigate away
      navigate("/quiz-setup");
    }
  };

  // Initialize quiz
  useEffect(() => {
    if (!subject || !topic) {
      navigate("/quiz-setup");
      return;
    }
    
    fetchQuestions();
    setStartTime(new Date());
    // Intentionally run when quiz params change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, topic, questionCount, navigate]);

  // Enable security features when quiz loads
  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      enableSecurityFeatures();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, questions]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isLoading) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isLoading]);

  // Cleanup security features on unmount
  useEffect(() => {
    return () => {
      if (securityCleanupRef.current) {
        securityCleanupRef.current();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await getQuestions({
        subject,
        topic,
        limit: questionCount
      });
      
      if (res.success && res.questions.length > 0) {
        setQuestions(res.questions);
        setUserAnswers(new Array(res.questions.length).fill(null));
      } else {
        alert("No questions available for this selection");
        navigate("/quiz-setup");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions");
      navigate("/quiz-setup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = questions[currentIndex].options[answerIndex];
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate results
      let correctAnswers = 0;
      const answers = questions.map((question, index) => {
        const userAnswer = userAnswers[index];
        
        let isCorrect = false;
        if (question.correctAnswer !== undefined) {
          if (typeof question.correctAnswer === 'number' || (typeof question.correctAnswer === 'string' && !isNaN(question.correctAnswer) && question.correctAnswer.length < 3)) {
            const correctIndex = parseInt(question.correctAnswer);
            isCorrect = userAnswer === question.options[correctIndex];
          } else {
            isCorrect = userAnswer === question.correctAnswer;
          }
        }

        if (isCorrect) correctAnswers++;
        
        return {
          questionId: question._id,
          selectedAnswer: userAnswer || "Not Answered",
          isCorrect,
          timeSpent: 0 // You can track per-question time if needed
        };
      });

      const endTime = new Date();
      const timeTaken = Math.floor((endTime - startTime) / 1000);

      // Save quiz result
      const result = await saveQuizResult({
        subject,
        topic,
        totalQuestions: questions.length,
        correctAnswers,
        timeTaken,
        answers,
        status: "completed"
      });

      if (result.success) {
        // Clean up security features before navigation
        if (securityCleanupRef.current) {
          securityCleanupRef.current();
        }
        
        // Navigate to results page with quiz data
        navigate("/quiz-result", {
          state: {
            quizResult: result.quizResult,
            questions: questions,
            userAnswers: userAnswers,
            timeTaken
          }
        });
      }
    } catch (error) {
      console.error("Error saving quiz result:", error);
      alert("Failed to save quiz result: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentIndex + 1) / questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return userAnswers.filter(answer => answer !== null).length;
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--midnight-velvet)'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--pure-pearl)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading Quiz...</div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="page-container" style={{ 
      margin: '-2rem',
      padding: '3rem',
      minHeight: '100vh', 
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '0 1rem'
      }}>
        <div style={{ color: 'var(--pure-pearl)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
            {subject} - {topic}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem',
          alignItems: 'center'
        }}>
          {/* Security Warning Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            backgroundColor: isSecurityEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${isSecurityEnabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            color: isSecurityEnabled ? '#10b981' : '#f59e0b',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isSecurityEnabled ? '#10b981' : '#f59e0b',
              animation: isSecurityEnabled ? 'pulse 2s infinite' : 'none'
            }} />
            {isSecurityEnabled ? 'Secure Mode' : 'Limited Security'}
          </div>
          
          <div style={{ color: 'var(--pure-pearl)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Answered</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
              {getAnsweredCount()}/{questions.length}
            </div>
          </div>
          
          <div style={{ 
            padding: '0.8rem 1.2rem',
            borderRadius: '12px',
            backgroundColor: timeLeft < 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            border: `1px solid ${timeLeft < 60 ? '#ef4444' : 'var(--glass-border)'}`,
            color: timeLeft < 60 ? '#ef4444' : 'var(--pure-pearl)',
            fontWeight: '600',
            fontSize: '1.1rem'
          }}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
        <div style={{ 
          width: '100%', 
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${getProgressPercentage()}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--rich-lavender), var(--rich-lilac))',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card" style={{ 
        flex: 1,
        padding: '2.5rem',
        marginBottom: '2rem',
        background: 'rgba(250, 250, 255, 0.02)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            color: 'var(--pure-pearl)',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '2rem',
            lineHeight: '1.4'
          }}>
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                style={{
                  width: '100%',
                  padding: '1.2rem 1.5rem',
                  border: userAnswers[currentIndex] === option 
                    ? '2px solid var(--rich-lilac)' 
                    : '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  backgroundColor: userAnswers[currentIndex] === option 
                    ? 'rgba(163, 100, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--pure-pearl)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
                onMouseOver={(e) => {
                  if (userAnswers[currentIndex] !== option) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.borderColor = 'var(--rich-lilac)';
                  }
                }}
                onMouseOut={(e) => {
                  if (userAnswers[currentIndex] !== option) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.borderColor = 'var(--glass-border)';
                  }
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: userAnswers[currentIndex] === option 
                    ? '2px solid var(--rich-lilac)' 
                    : '1px solid var(--glass-border)',
                  backgroundColor: userAnswers[currentIndex] === option 
                    ? 'var(--rich-lilac)' 
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {userAnswers[currentIndex] === option && '×'}
                </div>
                <span style={{ 
                  letterSpacing: '0.3px',
                  lineHeight: '1.4'
                }}>
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            style={{
              padding: '0.8rem 1.5rem',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              fontSize: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--pure-pearl)',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === 0 ? 0.5 : 1,
              transition: 'all 0.3s'
            }}
          >
            Previous
          </button>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Progress: {currentIndex + 1} / {questions.length}
          </div>

          <button
            onClick={handleNext}
            disabled={!userAnswers[currentIndex]}
            className="glow-button"
            style={{
              padding: '0.8rem 2rem',
              fontSize: '1rem',
              opacity: userAnswers[currentIndex] ? 1 : 0.6,
              cursor: userAnswers[currentIndex] ? 'pointer' : 'not-allowed'
            }}
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{
            padding: '2.5rem',
            maxWidth: '400px',
            textAlign: 'center',
            background: 'rgba(250, 250, 255, 0.02)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(30px)'
          }}>
            <h3 style={{ color: 'var(--pure-pearl)', marginBottom: '1rem' }}>
              Submit Quiz?
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              You have answered {getAnsweredCount()} out of {questions.length} questions.
              {getAnsweredCount() < questions.length && ' Unanswered questions will be marked as incorrect.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmDialog(false)}
                style={{
                  padding: '0.8rem 1.5rem',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--pure-pearl)',
                  cursor: 'pointer'
                }}
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="glow-button"
                style={{
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Request Overlay */}
      {showFullscreenOverlay && (
        <div className="quiz-fullscreen-overlay">
          <div>
            <h2>Security Mode Required</h2>
            <p>
              This quiz requires fullscreen mode to ensure academic integrity.<br />
              Please allow fullscreen to begin your quiz.
            </p>
            <button onClick={() => setShowFullscreenOverlay(false)}>
              Cancel Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
