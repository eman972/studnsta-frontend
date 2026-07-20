import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects, getTopicsBySubject, getQuestions } from "../services/quizApiService";
import { createLiveQuiz, generateQuizLink } from "../services/liveQuizService";

function LiveQuizSetup() {
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [quizLink, setQuizLink] = useState("");
  const [showLink, setShowLink] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    topic: "",
    timer: 30, // in minutes
    liveSettings: {
      allowRetake: false,
      showResults: true,
      randomizeQuestions: false,
      randomizeOptions: true
    }
  });

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getQuestions({
        subject: formData.subject,
        topic: formData.topic,
        limit: 50
      });
      
      if (res.success) {
        setAvailableQuestions(res.questions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formData.subject, formData.topic]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (formData.subject) {
      fetchTopics(formData.subject);
      setSelectedQuestions([]);
      setAvailableQuestions([]);
    } else {
      setTopics([]);
      setSelectedQuestions([]);
      setAvailableQuestions([]);
    }
  }, [formData.subject]);

  useEffect(() => {
    if (formData.subject && formData.topic) {
      fetchQuestions();
    }
  }, [formData.subject, formData.topic, fetchQuestions]);

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects();
      if (res.success) {
        setSubjects(res.subjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchTopics = async (subject) => {
    try {
      const res = await getTopicsBySubject(subject);
      if (res.success) {
        setTopics(res.topics);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleQuestionToggle = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleCreateQuiz = async () => {
    if (!formData.title || !formData.subject || !formData.topic || selectedQuestions.length === 0) {
      alert("Please fill all required fields and select at least one question");
      return;
    }

    if (formData.timer < 1 || formData.timer > 180) {
      alert("Timer must be between 1 and 180 minutes");
      return;
    }

    setIsCreating(true);
    try {
      const quizData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        topic: formData.topic,
        timer: formData.timer,
        questionIds: selectedQuestions,
        liveSettings: formData.liveSettings
      };

      const res = await createLiveQuiz(quizData);
      
      if (res.success) {
        const link = generateQuizLink(res.quiz.id);
        setQuizLink(link);
        setShowLink(true);
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          subject: "",
          topic: "",
          timer: 30,
          liveSettings: {
            allowRetake: false,
            showResults: true,
            randomizeQuestions: false,
            randomizeOptions: true
          }
        });
        setSelectedQuestions([]);
      }
    } catch (error) {
      console.error("Error creating live quiz:", error);
      alert(`Failed to create live quiz: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quizLink);
    alert("Quiz link copied to clipboard!");
  };

  if (showLink) {
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
              Live Quiz Created!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.6rem', fontWeight: '500' }}>
              Share this link with your students
            </p>
          </div>

          <div style={{ 
            padding: '1.5rem',
            backgroundColor: 'rgba(163, 100, 255, 0.1)',
            border: '1px solid rgba(163, 100, 255, 0.3)',
            borderRadius: '16px',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              color: 'var(--pure-pearl)',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Quiz Link
            </div>
            <div style={{ 
              wordBreak: 'break-all',
              color: 'var(--rich-lilac)',
              fontSize: '1rem',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px'
            }}>
              {quizLink}
            </div>
            <button
              onClick={copyToClipboard}
              className="glow-button"
              style={{ width: '100%', fontSize: '1rem' }}
            >
              Copy Link
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setShowLink(false)}
              style={{
                padding: '1rem 2rem',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                fontSize: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--pure-pearl)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                flex: 1
              }}
            >
              Create Another Quiz
            </button>
            <button
              onClick={() => navigate('/teacher-quizzes')}
              className="glow-button"
              style={{ flex: 1, fontSize: '1rem' }}
            >
              View My Quizzes
            </button>
          </div>
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
          Create Live Quiz
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Create an interactive quiz for your students
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Quiz Settings */}
        <div className="glass-card" style={{ 
          padding: '2rem',
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
            Quiz Settings
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: 'var(--pure-pearl)',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                Quiz Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter quiz title"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--pure-pearl)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: 'var(--pure-pearl)',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter quiz description"
                rows="3"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--pure-pearl)',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: 'var(--pure-pearl)',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--pure-pearl)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: 'var(--pure-pearl)',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Topic
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  disabled={!formData.subject}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--pure-pearl)',
                    cursor: formData.subject ? 'pointer' : 'not-allowed',
                    opacity: formData.subject ? 1 : 0.6
                  }}
                >
                  <option value="">Select Topic</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: 'var(--pure-pearl)',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                Timer (minutes): {formData.timer}
              </label>
              <input
                type="range"
                min="1"
                max="180"
                value={formData.timer}
                onChange={(e) => setFormData({...formData, timer: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: 'var(--glass-border)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginTop: '0.5rem'
              }}>
                <span>1 min</span>
                <span>90 min</span>
                <span>180 min</span>
              </div>
            </div>

            <div>
              <h3 style={{ 
                color: 'var(--pure-pearl)',
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                Quiz Options
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.8rem',
                  color: 'var(--pure-pearl)',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.liveSettings.showResults}
                    onChange={(e) => setFormData({
                      ...formData,
                      liveSettings: {
                        ...formData.liveSettings,
                        showResults: e.target.checked
                      }
                    })}
                    style={{ cursor: 'pointer' }}
                  />
                  Show results to students after completion
                </label>

                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.8rem',
                  color: 'var(--pure-pearl)',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.liveSettings.randomizeOptions}
                    onChange={(e) => setFormData({
                      ...formData,
                      liveSettings: {
                        ...formData.liveSettings,
                        randomizeOptions: e.target.checked
                      }
                    })}
                    style={{ cursor: 'pointer' }}
                  />
                  Randomize answer options
                </label>

                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.8rem',
                  color: 'var(--pure-pearl)',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.liveSettings.allowRetake}
                    onChange={(e) => setFormData({
                      ...formData,
                      liveSettings: {
                        ...formData.liveSettings,
                        allowRetake: e.target.checked
                      }
                    })}
                    style={{ cursor: 'pointer' }}
                  />
                  Allow students to retake quiz
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Question Selection */}
        <div className="glass-card" style={{ 
          padding: '2rem',
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
            Select Questions
          </h2>

          <div style={{ 
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: 'rgba(163, 100, 255, 0.1)',
            border: '1px solid rgba(163, 100, 255, 0.3)',
            borderRadius: '12px'
          }}>
            <div style={{ 
              color: 'var(--pure-pearl)',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              Selected: {selectedQuestions.length} questions
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Loading questions...
            </div>
          ) : availableQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              {formData.subject && formData.topic 
                ? 'No questions available for this subject/topic'
                : 'Select subject and topic to load questions'
              }
            </div>
          ) : (
            <div style={{ 
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '1rem'
            }}>
              {availableQuestions.map((question, index) => (
                <div
                  key={question._id}
                  style={{
                    padding: '1rem',
                    border: `1px solid ${selectedQuestions.includes(question._id) ? 'var(--rich-lilac)' : 'var(--glass-border)'}`,
                    borderRadius: '12px',
                    backgroundColor: selectedQuestions.includes(question._id) 
                      ? 'rgba(163, 100, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.02)',
                    marginBottom: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => handleQuestionToggle(question._id)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: `2px solid ${selectedQuestions.includes(question._id) ? 'var(--rich-lilac)' : 'var(--glass-border)'}`,
                      backgroundColor: selectedQuestions.includes(question._id) ? 'var(--rich-lilac)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                      flexShrink: 0
                    }}>
                      {selectedQuestions.includes(question._id) && (
                        <span style={{ color: 'white', fontSize: '12px' }}>×</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        color: 'var(--pure-pearl)',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        marginBottom: '0.3rem',
                        lineHeight: '1.4'
                      }}>
                        {question.question}
                      </div>
                      <div style={{ 
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem'
                      }}>
                        Difficulty: {question.difficulty} | Options: {question.options.length}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleCreateQuiz}
            disabled={selectedQuestions.length === 0 || isCreating}
            className="glow-button"
            style={{ 
              width: '100%', 
              fontSize: '1.1rem',
              padding: '1.2rem',
              marginTop: '1.5rem',
              opacity: selectedQuestions.length > 0 && !isCreating ? 1 : 0.6,
              cursor: selectedQuestions.length > 0 && !isCreating ? 'pointer' : 'not-allowed'
            }}
          >
            {isCreating ? 'Creating Quiz...' : `Create Live Quiz (${selectedQuestions.length} questions)`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LiveQuizSetup;
