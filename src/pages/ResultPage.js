import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getGradeFromScore, formatQuizTime } from "../services/quizApiService";
import { explainWrong } from "../services/aiService";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizResult, questions, userAnswers, timeTaken } = location.state || {};

  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [explanations, setExplanations] = useState({});

  useEffect(() => {
    if (!quizResult) {
      navigate("/quiz-setup");
      return;
    }

    const targetScore = quizResult.score;
    const duration = 2000;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setAnimatedScore(targetScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [quizResult, navigate]);

  if (!quizResult) {
    return null;
  }

  const gradeInfo = getGradeFromScore(quizResult.score);
  const correctAnswers = quizResult.correctAnswers;
  const incorrectAnswers = quizResult.totalQuestions - correctAnswers;
  const accuracy = Math.round((correctAnswers / quizResult.totalQuestions) * 100);

  const wrongItems = (questions || [])
    .map((q, i) => ({ q, i, answer: userAnswers?.[i] }))
    .filter(({ q, answer }) => answer && answer !== q.correctAnswer);

  const handleExplain = async (item) => {
    try {
      const res = await explainWrong({
        question: item.q.question,
        correctAnswer: item.q.correctAnswer,
        userAnswer: item.answer,
        explanation: item.q.explanation,
      });
      setExplanations((prev) => ({ ...prev, [item.i]: res.data.reply }));
    } catch (e) {
      setExplanations((prev) => ({
        ...prev,
        [item.i]: e.response?.data?.message || "Could not load explanation",
      }));
    }
  };

  const handleRetakeQuiz = () => {
    navigate("/quiz-setup", { 
      state: { 
        subject: quizResult.subject, 
        topic: quizResult.topic 
      } 
    });
  };

  const handleViewHistory = () => {
    navigate("/quiz-history");
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div className="page-container" style={{ 
      margin: '-2rem',
      padding: '3rem',
      minHeight: '100vh', 
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          color: 'var(--pure-pearl)',
          fontSize: '2.5rem',
          fontWeight: '900',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Quiz Completed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          {quizResult.subject} - {quizResult.topic}
        </p>
      </div>

      {/* Score Card */}
      <div className="glass-card" style={{ 
        padding: '3rem',
        marginBottom: '2rem',
        textAlign: 'center',
        background: 'rgba(250, 250, 255, 0.02)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        minWidth: '350px'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '4rem', 
            fontWeight: '900',
            color: gradeInfo.color,
            marginBottom: '0.5rem',
            lineHeight: '1'
          }}>
            {animatedScore}%
          </div>
          <div style={{ 
            fontSize: '1.5rem',
            color: gradeInfo.color,
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            {gradeInfo.level}
          </div>
          <div style={{ 
            fontSize: '1rem',
            color: 'var(--text-muted)'
          }}>
            Grade: {gradeInfo.grade}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            padding: '1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px'
          }}>
            <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: '700' }}>
              {correctAnswers}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Correct
            </div>
          </div>
          
          <div style={{ 
            padding: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px'
          }}>
            <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: '700' }}>
              {incorrectAnswers}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Incorrect
            </div>
          </div>
          
          <div style={{ 
            padding: '1rem',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px'
          }}>
            <div style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: '700' }}>
              {accuracy}%
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Accuracy
            </div>
          </div>
          
          <div style={{ 
            padding: '1rem',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px'
          }}>
            <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700' }}>
              {formatQuizTime(timeTaken)}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Time Taken
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={handleRetakeQuiz}
          className="glow-button"
          style={{ 
            padding: '1rem 2rem',
            fontSize: '1rem'
          }}
        >
          Retake Quiz
        </button>

        <button
          onClick={() => setReviewMode(!reviewMode)}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            borderRadius: '12px',
            border: '1px solid rgba(163, 100, 255, 0.4)',
            background: 'rgba(163, 100, 255, 0.15)',
            color: 'var(--pure-pearl)',
            cursor: 'pointer',
          }}
        >
          {reviewMode ? "Hide wrong-answer review" : "Review wrong answers"}
        </button>
        
        <button
          onClick={() => setShowDetailedResults(!showDetailedResults)}
          style={{
            padding: '1rem 2rem',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            fontSize: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--pure-pearl)',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {showDetailedResults ? 'Hide' : 'Show'} Detailed Results
        </button>
        
        <button
          onClick={handleViewHistory}
          style={{
            padding: '1rem 2rem',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            fontSize: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--pure-pearl)',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          View History
        </button>
      </div>

      {reviewMode && (
        <div className="glass-card" style={{ padding: "1.5rem", maxWidth: 800, width: "100%", marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--pure-pearl)", marginTop: 0 }}>Wrong answer review</h3>
          {wrongItems.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No wrong answers — nice work!</p>
          ) : (
            wrongItems.map((item) => (
              <div key={item.i} style={{ marginBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1rem" }}>
                <div style={{ color: "var(--pure-pearl)", fontWeight: 600 }}>{item.q.question}</div>
                <div style={{ color: "#f87171", marginTop: 6 }}>Your answer: {item.answer}</div>
                <div style={{ color: "#34d399", marginTop: 4 }}>Correct: {item.q.correctAnswer}</div>
                <button
                  onClick={() => handleExplain(item)}
                  style={{
                    marginTop: 8,
                    padding: "0.5rem 1rem",
                    borderRadius: 10,
                    border: "1px solid rgba(163,100,255,0.4)",
                    background: "rgba(163,100,255,0.12)",
                    color: "var(--pure-pearl)",
                    cursor: "pointer",
                  }}
                >
                  Explain with AI
                </button>
                {explanations[item.i] && (
                  <p style={{ color: "var(--text-muted)", marginTop: 8, whiteSpace: "pre-wrap" }}>
                    {explanations[item.i]}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Detailed Results */}
      {showDetailedResults && questions && (
        <div className="glass-card" style={{ 
          padding: '2rem',
          maxWidth: '800px',
          width: '100%',
          background: 'rgba(250, 250, 255, 0.02)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <h3 style={{ 
            color: 'var(--pure-pearl)',
            marginBottom: '1.5rem',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            Detailed Results
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((question, index) => {
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
              
              return (
                <div
                  key={index}
                  style={{
                    padding: '1.5rem',
                    border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    borderRadius: '12px',
                    backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        color: 'var(--pure-pearl)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}>
                        Question {index + 1}
                      </div>
                      <div style={{ 
                        color: 'var(--text-muted)',
                        fontSize: '1rem',
                        lineHeight: '1.4'
                      }}>
                        {question.question}
                      </div>
                    </div>
                    
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isCorrect ? '#10b981' : '#ef4444',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      flexShrink: 0,
                      marginLeft: '1rem'
                    }}>
                      {isCorrect ? '×' : '×'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {question.options.map((option, optIndex) => {
                      let isCorrectAnswer = false;
                      if (question.correctAnswer !== undefined) {
                        if (typeof question.correctAnswer === 'number' || (typeof question.correctAnswer === 'string' && !isNaN(question.correctAnswer) && question.correctAnswer.length < 3)) {
                          isCorrectAnswer = optIndex === parseInt(question.correctAnswer);
                        } else {
                          isCorrectAnswer = option === question.correctAnswer;
                        }
                      }
                      const isSelectedOption = option === userAnswer;
                      
                      return (
                        <div
                          key={optIndex}
                          style={{
                            padding: '0.5rem 1rem',
                            border: `1px solid ${
                              isCorrectAnswer ? '#10b981' : 
                              isSelectedOption && !isCorrect ? '#ef4444' : 
                              'var(--glass-border)'
                            }`,
                            borderRadius: '8px',
                            backgroundColor: isCorrectAnswer ? 'rgba(16, 185, 129, 0.1)' : 
                                            isSelectedOption && !isCorrect ? 'rgba(239, 68, 68, 0.1)' : 
                                            'transparent',
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <span style={{ 
                            color: isCorrectAnswer ? '#10b981' : 
                                   isSelectedOption && !isCorrect ? '#ef4444' : 
                                   'inherit',
                            fontWeight: '600'
                          }}>
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span>{option}</span>
                          {isCorrectAnswer && (
                            <span style={{ 
                              color: '#10b981', 
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              marginLeft: 'auto'
                            }}>
                              CORRECT
                            </span>
                          )}
                          {isSelectedOption && !isCorrect && (
                            <span style={{ 
                              color: '#ef4444', 
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              marginLeft: 'auto'
                            }}>
                              YOUR ANSWER
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Home Button */}
      <button
        onClick={handleGoHome}
        style={{
          padding: '0.8rem 2rem',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          fontSize: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          transition: 'all 0.3s',
          marginTop: 'auto'
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default ResultPage;
