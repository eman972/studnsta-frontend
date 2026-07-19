import React, { useState, useEffect } from 'react';
import { getTeacherLiveQuizzes, getLiveQuizResults } from '../services/liveQuizService';

const TeacherQuizResults = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [expandedQuizId, setExpandedQuizId] = useState(null);
  const [quizResultsData, setQuizResultsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await getTeacherLiveQuizzes({ limit: 50 });
      if (res && res.success) {
        setQuizzes(res.quizzes);
      }
    } catch (error) {
      console.error("Error fetching teacher quizzes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleQuiz = async (quizId) => {
    if (expandedQuizId === quizId) {
      setExpandedQuizId(null);
      return;
    }
    
    setExpandedQuizId(quizId);
    
    // Fetch if not already fetched
    if (!quizResultsData[quizId]) {
      try {
        const res = await getLiveQuizResults(quizId, { limit: 100 });
        if (res && res.success) {
          setQuizResultsData(prev => ({
            ...prev,
            [quizId]: {
              results: res.results,
              stats: res.statistics
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        Loading Teacher Dashboard...
      </div>
    );
  }

  if (quizzes.length === 0) {
    return null; // Don't show anything if teacher has no quizzes
  }

  return (
    <div className="glass-card" style={{ 
      marginTop: '3rem',
      padding: '2rem',
      background: 'rgba(250, 250, 255, 0.02)',
      border: '1px solid var(--glass-border)',
      backdropFilter: 'blur(30px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
    }}>
      <h3 style={{ 
        color: 'var(--pure-pearl)',
        fontSize: '1.8rem',
        fontWeight: '800',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <span>👨‍🏫</span> Live Quizzes Teacher View
      </h3>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Track student performance across all your shared live quizzes.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {quizzes.map((quiz) => {
          const isExpanded = expandedQuizId === quiz.id;
          const data = quizResultsData[quiz.id];

          return (
            <div key={quiz.id} style={{
              backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${isExpanded ? 'var(--rich-lilac)' : 'var(--glass-border)'}`,
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              {/* Quiz Header (Clickable) */}
              <div 
                onClick={() => handleToggleQuiz(quiz.id)}
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ color: 'var(--pure-pearl)', fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {quiz.title}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {quiz.subject} - {quiz.topic} • {quiz.participants} Participants
                  </div>
                </div>
                
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--pure-pearl)',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease'
                }}>
                  ▼
                </div>
              </div>

              {/* Expanded Results Section */}
              {isExpanded && (
                <div style={{
                  padding: '0 1.5rem 1.5rem 1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  {!data ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Loading results...
                    </div>
                  ) : data.results.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No students have submitted this quiz yet.
                    </div>
                  ) : (
                    <>
                      {/* Stats Overview */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1rem',
                        margin: '1.5rem 0',
                        padding: '1rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '12px'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Avg Score</div>
                          <div style={{ color: 'var(--rich-lavender)', fontSize: '1.2rem', fontWeight: '700' }}>{data.stats.averageScore}%</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Highest</div>
                          <div style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: '700' }}>{data.stats.bestScore}%</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Lowest</div>
                          <div style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: '700' }}>{data.stats.worstScore}%</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Avg Time</div>
                          <div style={{ color: '#3b82f6', fontSize: '1.2rem', fontWeight: '700' }}>{formatTime(data.stats.averageTime)}</div>
                        </div>
                      </div>

                      {/* Student Table */}
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '500' }}>Student</th>
                              <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '500' }}>Score</th>
                              <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '500' }}>Correct</th>
                              <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '500' }}>Time</th>
                              <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '500' }}>Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.results.map((result) => (
                              <tr key={result.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>
                                  <div style={{ color: 'var(--pure-pearl)', fontWeight: '500' }}>{result.student?.name || 'Unknown'}</div>
                                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{result.student?.email || 'N/A'}</div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--pure-pearl)', fontWeight: '600' }}>
                                  {result.score}%
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                  {result.correctAnswers} / {result.totalQuestions}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                  {formatTime(result.timeTaken)}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                  <span style={{
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '20px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    color: result.score >= 60 ? '#10b981' : '#ef4444',
                                    fontWeight: '700',
                                    fontSize: '0.9rem'
                                  }}>
                                    {result.grade}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherQuizResults;
