import { useLocation, useNavigate } from "react-router-dom";
import { getGradeFromScore, formatQuizTime } from "../services/quizApiService";

function LiveQuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizResults, quiz, timeTaken } = location.state || {};

  if (!quizResults) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--midnight-velvet)'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--pure-pearl)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Results Found</div>
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '1rem 2rem',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              fontSize: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--pure-pearl)',
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const gradeInfo = getGradeFromScore(quizResults.score);
  const correctAnswers = quizResults.correctAnswers;
  const incorrectAnswers = quizResults.totalQuestions - correctAnswers;
  const accuracy = Math.round((correctAnswers / quizResults.totalQuestions) * 100);

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleRetakeQuiz = () => {
    if (quiz.liveSettings.allowRetake) {
      navigate(`/quiz/live/${quiz.id}`);
    } else {
      alert("This quiz does not allow retakes");
    }
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
          {quiz.title} - {quiz.subject} - {quiz.topic}
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
            {quizResults.score}%
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

      {/* Quiz Info */}
      <div className="glass-card" style={{ 
        padding: '2rem',
        marginBottom: '2rem',
        background: 'rgba(250, 250, 255, 0.02)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h3 style={{ 
          color: 'var(--pure-pearl)',
          fontSize: '1.3rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Quiz Information
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Quiz Title:</span>
            <span style={{ color: 'var(--pure-pearl)' }}>{quiz.title}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Subject:</span>
            <span style={{ color: 'var(--pure-pearl)' }}>{quiz.subject}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Topic:</span>
            <span style={{ color: 'var(--pure-pearl)' }}>{quiz.topic}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Time Limit:</span>
            <span style={{ color: 'var(--pure-pearl)' }}>{quiz.duration} minutes</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Completed At:</span>
            <span style={{ color: 'var(--pure-pearl)' }}>
              {new Date(quizResults.completedAt).toLocaleString()}
            </span>
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
        {quiz.liveSettings.allowRetake && (
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
        )}
        
        <button
          onClick={handleGoHome}
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
          Back to Home
        </button>
      </div>

      {/* Performance Message */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'rgba(163, 100, 255, 0.1)',
        border: '1px solid rgba(163, 100, 255, 0.3)',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ 
          color: 'var(--rich-lavender)',
          fontSize: '1.1rem',
          fontWeight: '600',
          marginBottom: '0.5rem'
        }}>
          Great job! {gradeInfo.level} performance
        </div>
        <div style={{ 
          color: 'var(--text-muted)',
          fontSize: '0.95rem',
          lineHeight: '1.4'
        }}>
          {quizResults.score >= 80 
            ? "Excellent work! You've mastered this topic."
            : quizResults.score >= 60
            ? "Good job! Keep practicing to improve further."
            : "Keep learning! Review the material and try again."}
        </div>
      </div>
    </div>
  );
}

export default LiveQuizResult;
