import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects, getTopicsBySubject } from "../services/quizApiService";

function QuizSetup() {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
   const [questionCount, setQuestionCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const navigate = useNavigate();

  // Fetch subjects on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch topics when subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchTopics(selectedSubject);
      setSelectedTopic(""); // Reset topic when subject changes
    } else {
      setTopics([]);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects();
      if (res.success) {
        setSubjects(res.subjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      alert("Failed to load subjects");
    }
  };

  const fetchTopics = async (subject) => {
    setIsLoadingTopics(true);
    try {
      const res = await getTopicsBySubject(subject);
      if (res.success) {
        setTopics(res.topics);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      setTopics([]);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const handleStartQuiz = () => {
    if (!selectedSubject || !selectedTopic) {
      alert("Please select both subject and topic");
      return;
    }

    if (![5, 10, 15].includes(questionCount)) {
      alert("Please select 5, 10, or 15 questions");
      return;
    }

    // Navigate to quiz page with parameters
    navigate("/quiz", {
      state: {
        subject: selectedSubject,
        topic: selectedTopic,
        questionCount: questionCount
      }
    });
  };

  return (
    <div className="page-container" style={{ 
      margin: '-2rem',
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'transparent',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{ 
        padding: '3rem 2.5rem', 
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
        background: 'rgba(250, 250, 255, 0.02)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
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
            Setup Quiz
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.6rem', fontWeight: '500' }}>
            Choose your quiz parameters
          </p>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          {/* Subject Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: 'var(--pure-pearl)',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--pure-pearl)',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--rich-lilac)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: 'var(--pure-pearl)',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Select Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              required
              disabled={!selectedSubject || isLoadingTopics}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--pure-pearl)',
                cursor: selectedSubject && !isLoadingTopics ? 'pointer' : 'not-allowed',
                opacity: selectedSubject && !isLoadingTopics ? 1 : 0.6
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--rich-lilac)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            >
              <option value="">
                {isLoadingTopics ? 'Loading topics...' : 'Select Topic'}
              </option>
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Questions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: 'var(--pure-pearl)',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Number of Questions
            </label>
            <div style={{ 
              display: 'flex', 
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              {[5, 10, 15].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)',
                    backgroundColor: questionCount === count ? 'var(--rich-lavender)' : 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleStartQuiz}
          disabled={!selectedSubject || !selectedTopic}
          className="glow-button"
          style={{ 
            width: '100%', 
            fontSize: '1.1rem',
            padding: '1.2rem',
            opacity: selectedSubject && selectedTopic ? 1 : 0.6,
            cursor: selectedSubject && selectedTopic ? 'pointer' : 'not-allowed'
          }}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizSetup;
