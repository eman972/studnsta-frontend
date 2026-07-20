import { useEffect, useState } from "react";
import { getMyQuizResults, getUserPerformanceOverview } from "../services/quizResultService";
import { getGradeFromScore, formatQuizTime } from "../services/quizApiService";
import { BarChart, LineChart, StatCard } from "../components/Charts";
import TeacherQuizResults from "../components/TeacherQuizResults";
import SkeletonLoader from "../components/SkeletonLoader";

function ProgressDashboard() {
  const [quizResults, setQuizResults] = useState([]);
  const [performanceOverview, setPerformanceOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // all, month, week

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      
      // Fetch quiz results and performance overview
      const [resultsRes, overviewRes] = await Promise.all([
        getMyQuizResults({ limit: 100 }),
        getUserPerformanceOverview(userId)
      ]);

      if (resultsRes && resultsRes.data) {
        setQuizResults(resultsRes.data.quizResults || []);
      }
      
      if (overviewRes && overviewRes.data) {
        setPerformanceOverview(overviewRes.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredResults = () => {
    if (timeRange === 'all') return quizResults;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (timeRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    }
    
    return quizResults.filter(result => 
      new Date(result.completedAt) >= cutoffDate
    );
  };

  const getSubjectStats = () => {
    const subjectMap = {};
    const filteredResults = getFilteredResults();
    
    filteredResults.forEach(result => {
      if (!subjectMap[result.subject]) {
        subjectMap[result.subject] = {
          scores: [],
          total: 0,
          best: 0
        };
      }
      subjectMap[result.subject].scores.push(result.score);
      subjectMap[result.subject].total++;
      subjectMap[result.subject].best = Math.max(subjectMap[result.subject].best, result.score);
    });
    
    // Calculate averages and sort
    const subjectStats = Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      average: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
      best: data.best,
      total: data.total
    })).sort((a, b) => a.average - b.average); // Sort by worst to best
    
    return subjectStats;
  };

  const getProgressTrend = () => {
    const filteredResults = getFilteredResults();
    if (filteredResults.length === 0) return { scores: [], labels: [] };
    
    // Take last 10 results for trend
    const recentResults = filteredResults.slice(-10);
    const scores = recentResults.map(result => result.score);
    const labels = recentResults.map((result, index) => `Quiz ${index + 1}`);
    return { scores, labels };
  };

  if (isLoading) {
    return (
      <div className="page-container" style={{ margin: '-2rem', padding: '3rem', minHeight: '100vh' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <SkeletonLoader height="3rem" width="350px" style={{ margin: '0 auto 1rem' }} />
          <SkeletonLoader height="1.5rem" width="220px" style={{ margin: '0 auto' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <SkeletonLoader height="2.5rem" width="100px" count={3} inline style={{ margin: '0 0.5rem' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <SkeletonLoader height="120px" count={4} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          <SkeletonLoader height="300px" count={2} />
        </div>
      </div>
    );
  }

  const filteredResults = getFilteredResults();
  const subjectStats = getSubjectStats();
  const progressTrend = getProgressTrend();
  const overview = performanceOverview?.overview || {};

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
          Progress Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Track your learning journey
        </p>
      </div>

      {/* Time Range Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        {[
          { value: 'all', label: 'All Time' },
          { value: 'month', label: 'Last Month' },
          { value: 'week', label: 'Last Week' }
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            style={{
              padding: '0.6rem 1.2rem',
              border: timeRange === range.value ? '1px solid var(--rich-lilac)' : '1px solid var(--glass-border)',
              borderRadius: '12px',
              fontSize: '0.9rem',
              backgroundColor: timeRange === range.value ? 'rgba(163, 100, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              color: 'var(--pure-pearl)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Total Quizzes"
          value={filteredResults.length}
          subtitle="Completed"
          color="var(--rich-lavender)"
          icon="📝"
        />
        
        <StatCard
          title="Average Score"
          value={`${Math.round(overview.avgScore || 0)}%`}
          subtitle="Across all subjects"
          color="#10b981"
          icon="📈"
        />
        
        <StatCard
          title="Best Score"
          value={`${overview.bestScore || 0}%`}
          subtitle="Personal best"
          color="#3b82f6"
          icon="🏆"
        />
        
        <StatCard
          title="Weakest Subject"
          value={subjectStats.length > 0 ? subjectStats[0].subject : 'N/A'}
          subtitle="Needs improvement"
          color="#f59e0b"
          icon="⚠️"
        />
      </div>

      {/* Charts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Subject Performance Chart */}
        <BarChart
          title="Subject Performance"
          labels={subjectStats.map(stat => stat.subject)}
          data={subjectStats.map(stat => stat.average)}
          color="linear-gradient(90deg, #3b82f6, #8b5cf6)"
        />
        
        {/* Progress Trend Chart */}
        <LineChart
          title="Score Trend (Last 10 Quizzes)"
          labels={progressTrend.labels}
          data={progressTrend.scores}
          color="#10b981"
        />
      </div>

      {/* Weak Subjects Detail */}
      {subjectStats.length > 0 && (
        <div className="glass-card" style={{ 
          padding: '2rem',
          background: 'rgba(250, 250, 255, 0.02)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ 
            color: 'var(--pure-pearl)',
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            Subject Analysis
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {subjectStats.slice(0, 3).map((stat, index) => {
              const gradeInfo = getGradeFromScore(stat.average);
              const isWeak = index === 0; // First one is weakest
              
              return (
                <div
                  key={stat.subject}
                  style={{
                    padding: '1.5rem',
                    border: `1px solid ${isWeak ? 'rgba(239, 68, 68, 0.3)' : 'var(--glass-border)'}`,
                    borderRadius: '12px',
                    backgroundColor: isWeak ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ 
                      color: 'var(--pure-pearl)',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      {stat.subject}
                    </div>
                    <div style={{ 
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem'
                    }}>
                      {stat.total} quizzes taken
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: gradeInfo.color,
                      marginBottom: '0.25rem'
                    }}>
                      {stat.average}%
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem',
                      color: gradeInfo.color,
                      fontWeight: '600'
                    }}>
                      {gradeInfo.level}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {subjectStats.length > 0 && subjectStats[0].average < 70 && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ 
                color: '#f59e0b',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Recommendation
              </div>
              <div style={{ 
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                lineHeight: '1.4'
              }}>
                Focus on improving your performance in {subjectStats[0].subject}. Consider reviewing fundamentals and practicing more questions in this subject.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quiz History List */}
      <div className="glass-card" style={{ 
        marginTop: '2rem',
        padding: '2rem',
        background: 'rgba(250, 250, 255, 0.02)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{ 
          color: 'var(--pure-pearl)',
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>📜</span> Quiz History
        </h3>
        
        {filteredResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No quizzes found for the selected time range.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredResults.map((result) => {
              const gradeInfo = getGradeFromScore(result.score);
              return (
                <div key={result._id || result.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{ flex: 2 }}>
                    <div style={{ 
                      color: 'var(--pure-pearl)', 
                      fontSize: '1.15rem', 
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      {result.subject}
                    </div>
                    <div style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      {result.topic}
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ color: 'var(--pure-pearl)', fontSize: '0.95rem' }}>
                      <span style={{ opacity: 0.7 }}>Accuracy:</span> {result.correctAnswers}/{result.totalQuestions}
                    </div>
                    <div style={{ color: 'var(--pure-pearl)', fontSize: '0.95rem' }}>
                      <span style={{ opacity: 0.7 }}>Time:</span> {formatQuizTime(result.timeTaken)}
                    </div>
                  </div>

                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      {new Date(result.completedAt).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </div>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      backgroundColor: `${gradeInfo.color}20`,
                      color: gradeInfo.color,
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      border: `1px solid ${gradeInfo.color}40`
                    }}>
                      {result.score}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Teacher View - Live Quiz Results */}
      {localStorage.getItem('userRole') === 'teacher' && (
        <TeacherQuizResults />
      )}
    </div>
  );
}

export default ProgressDashboard;
