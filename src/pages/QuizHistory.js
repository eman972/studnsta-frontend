import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizHistory, getSubjects, getTopicsBySubject } from "../services/quizApiService";
import { getGradeFromScore, formatQuizTime } from "../services/quizApiService";
import SkeletonLoader from "../components/SkeletonLoader";

function QuizHistory() {
  const navigate = useNavigate();
  const [quizHistory, setQuizHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    subject: '',
    topic: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchAvailableSubjects();
  }, []);

  useEffect(() => {
    fetchQuizHistory();
  }, [currentPage, filters.subject, filters.topic]);

  useEffect(() => {
    if (filters.subject) {
      fetchTopics(filters.subject);
    } else {
      setTopics([]);
      if (filters.topic) {
        handleFilterChange('topic', '');
      }
    }
  }, [filters.subject]);

  const fetchAvailableSubjects = async () => {
    try {
      const res = await getSubjects();
      if (res && res.success) {
        setSubjects(res.subjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchTopics = async (subject) => {
    try {
      const res = await getTopicsBySubject(subject);
      if (res && res.success) {
        setTopics(res.topics);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchQuizHistory = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const res = await getQuizHistory(userId, {
        page: currentPage,
        limit: 10,
        ...filters
      });

      if (res.success) {
        setQuizHistory(res.quizHistory);
        setStatistics(res.statistics);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching quiz history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRetakeQuiz = (quiz) => {
    navigate("/quiz-setup", { 
      state: { 
        subject: quiz.subject, 
        topic: quiz.topic 
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="page-container" style={{ margin: '-2rem', padding: '3rem', minHeight: '100vh' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <SkeletonLoader height="3rem" width="300px" style={{ margin: '0 auto 1rem' }} />
          <SkeletonLoader height="1.5rem" width="200px" style={{ margin: '0 auto' }} />
        </div>
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <SkeletonLoader height="2rem" width="250px" style={{ marginBottom: '1.5rem' }} />
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <SkeletonLoader height="4rem" width="100px" count={4} inline style={{ flex: 1 }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SkeletonLoader height="100px" count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ 
      margin: '-2rem',
      padding: '3rem',
      minHeight: '100vh', 
      backgroundColor: 'transparent',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ 
          color: 'var(--pure-pearl)',
          fontSize: '2.5rem',
          fontWeight: '900',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Quiz History
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Your quiz performance over time
        </p>
      </div>

      {/* Statistics Overview */}
      {statistics && (
        <div className="glass-card" style={{ 
          padding: '2rem',
          marginBottom: '2rem',
          background: 'rgba(250, 250, 255, 0.02)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{ 
            color: 'var(--pure-pearl)',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            Performance Overview
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: 'var(--rich-lavender)',
                marginBottom: '0.5rem'
              }}>
                {statistics.totalQuizzes}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Total Quizzes
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: '#10b981',
                marginBottom: '0.5rem'
              }}>
                {statistics.averageScore}%
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Average Score
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: '#3b82f6',
                marginBottom: '0.5rem'
              }}>
                {statistics.bestScore}%
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Best Score
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: '#f59e0b',
                marginBottom: '0.5rem'
              }}>
                {statistics.completionRate}%
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Completion Rate
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card" style={{ 
        padding: '1.5rem',
        marginBottom: '2rem',
        background: 'rgba(250, 250, 255, 0.02)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'end',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: 'var(--pure-pearl)',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Subject
            </label>
            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--pure-pearl)',
                cursor: 'pointer'
              }}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: 'var(--pure-pearl)',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Topic
            </label>
            <select
              value={filters.topic}
              onChange={(e) => handleFilterChange('topic', e.target.value)}
              disabled={!filters.subject}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--pure-pearl)',
                cursor: !filters.subject ? 'not-allowed' : 'pointer',
                opacity: !filters.subject ? 0.5 : 1
              }}
            >
              <option value="">{filters.subject ? "All Topics" : "Select a subject first"}</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => navigate('/quiz-setup')}
            className="glow-button"
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem' }}
          >
            New Quiz
          </button>
        </div>
      </div>

      {/* Quiz History List */}
      <div style={{ marginBottom: '2rem' }}>
        {quizHistory.length === 0 ? (
          <div className="glass-card" style={{ 
            padding: '3rem',
            textAlign: 'center',
            background: 'rgba(250, 250, 255, 0.02)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ 
              fontSize: '1.2rem', 
              color: 'var(--text-muted)',
              marginBottom: '1.5rem'
            }}>
              No quiz history found
            </div>
            <button
              onClick={() => navigate('/quiz-setup')}
              className="glow-button"
              style={{ padding: '1rem 2rem', fontSize: '1rem' }}
            >
              Take Your First Quiz
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quizHistory.map((quiz) => {
              const gradeInfo = getGradeFromScore(quiz.score);
              
              return (
                <div
                  key={quiz.id}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    background: 'rgba(250, 250, 255, 0.02)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(30px)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => handleRetakeQuiz(quiz)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '0.5rem'
                    }}>
                      <h3 style={{ 
                        color: 'var(--pure-pearl)',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        margin: 0
                      }}>
                        {quiz.subject} - {quiz.topic}
                      </h3>
                      <span style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: `${gradeInfo.color}20`,
                        color: gradeInfo.color,
                        border: `1px solid ${gradeInfo.color}40`
                      }}>
                        {gradeInfo.grade}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '2rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem'
                    }}>
                      <span>Score: {quiz.score}%</span>
                      <span>{quiz.correctAnswers}/{quiz.totalQuestions} correct</span>
                      <span>{formatQuizTime(quiz.timeTaken)}</span>
                      <span>{new Date(quiz.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '700',
                    color: gradeInfo.color,
                    marginRight: '1rem'
                  }}>
                    {quiz.score}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--pure-pearl)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            Previous
          </button>
          
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--pure-pearl)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizHistory;
