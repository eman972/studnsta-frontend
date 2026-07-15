import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getLiveQuizById, submitLiveQuizResults } from "../services/liveQuizService";
import { getGradeFromScore, formatQuizTime } from "../services/quizApiService";

function LiveQuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const quizId = decodeURIComponent(location.pathname.split('/').pop()).trim(); // Extract and clean quiz ID
  
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, quizStarted]);

  const fetchQuizData = async () => {
    try {
      const res = await getLiveQuizById(quizId);
      
      if (res.success) {
        const validation = validateQuizAccess(res.quiz);
        if (!validation.valid) {
          alert(validation.message);
          navigate('/home');
          return;
        }

        setQuiz(res.quiz);
        setTimeLeft(res.quiz.duration * 60); // Convert minutes to seconds
        setUserAnswers(new Array(res.quiz.questions.length).fill(null));
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      const msg = error.response?.data?.message || error.message;
      alert(`Failed to load quiz: ${msg}`);
      navigate('/home');
    } finally {
      setIsLoading(false);
    }
  };

  const validateQuizAccess = (quiz) => {
    if (!quiz.isLive) {
      return { valid: false, message: "This is not a live quiz" };
    }
    
    if (!quiz.isPublished) {
      return { valid: false, message: "Quiz is not active" };
    }
    
    return { valid: true };
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(new Date());
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = quiz.questions[currentIndex].options[answerIndex];
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
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
      const endTime = new Date();
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      
      // Prepare answers for submission
      const answers = quiz.questions.map((question, index) => ({
        selectedAnswer: userAnswers[index] || "Not Answered",
        timeSpent: 0 // You can track per-question time if needed
      }));

      const result = await submitLiveQuizResults(quizId, {
        answers,
        timeTaken
      });

      if (result.success) {
        // Navigate to results page
        navigate('/live-quiz-result', {
          state: {
            quizResults: result.results,
            quiz: quiz,
            userAnswers: userAnswers,
            timeTaken
          }
        });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz results");
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
    return ((currentIndex + 1) / quiz.questions.length) * 100;
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

  if (!quizStarted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--midnight-velvet)',
        padding: '2rem'
      }}>
        <div className="glass-card" style={{ 
          padding: '3rem 2.5rem', 
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center',
          background: 'rgba(250, 250, 255, 0.02)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              filter: 'drop-shadow(0 4px 10px rgba(163, 100, 255, 0.3))'
            }}>Quiz</div>
            <h1 style={{ 
              margin: 0, 
              background: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '900', 
              fontSize: '2.2rem',
              letterSpacing: '-0.03em'
            }}>
              {quiz.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.6rem', fontWeight: '500' }}>
              {quiz.subject} - {quiz.topic}
            </p>
          </div>

          {quiz.description && (
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              marginBottom: '2rem',
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
              lineHeight: '1.4'
            }}>
              {quiz.description}
            </div>
          )}

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'rgba(163, 100, 255, 0.1)',
              border: '1px solid rgba(163, 100, 255, 0.3)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--rich-lavender)', fontSize: '1.5rem', fontWeight: '700' }}>
                {quiz.questionCount}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Questions
              </div>
            </div>
            
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: '700' }}>
                {quiz.duration} min
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Time Limit
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '1rem',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              color: '#f59e0b',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Quiz Instructions
            </div>
            <ul style={{ 
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              textAlign: 'left',
              paddingLeft: '1.5rem',
              margin: 0
            }}>
              <li>Read each question carefully before answering</li>
              <li>Once you start, the timer will begin counting down</li>
              <li>You cannot pause the quiz once started</li>
              <li>Make sure you have a stable internet connection</li>
            </ul>
          </div>

          <button
            onClick={startQuiz}
            className="glow-button"
            style={{ 
              width: '100%', 
              fontSize: '1.2rem',
              padding: '1.5rem'
            }}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];

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
            {quiz.title}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Question {currentIndex + 1} of {quiz.questions.length}
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div style={{ color: 'var(--pure-pearl)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Answered</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
              {getAnsweredCount()}/{quiz.questions.length}
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
            Progress: {currentIndex + 1} / {quiz.questions.length}
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
            {currentIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
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
              You have answered {getAnsweredCount()} out of {quiz.questions.length} questions.
              {getAnsweredCount() < quiz.questions.length && ' Unanswered questions will be marked as incorrect.'}
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
    </div>
  );
}

export default LiveQuizPage;
