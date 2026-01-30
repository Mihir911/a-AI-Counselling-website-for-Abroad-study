import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  getAnalysis
} from '../api/axios';
import ChatMessage from '../components/ChatMessage';

const Counsellor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  /* ================= VOICE OUTPUT ================= */
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === 'assistant') speak(last.content);
  }, [messages]);

  /* ================= VOICE INPUT ================= */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || listening) return;
    window.speechSynthesis.cancel();
    recognitionRef.current.start();
  };

  /* ================= PAGE LIFECYCLE ================= */
  useEffect(() => {
    if (!user?.onboardingComplete) {
      navigate('/onboarding');
      return;
    }
    fetchHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    const { data } = await getChatHistory();
    if (!data?.length) {
      setMessages([{
        role: 'assistant',
        content: `Hi ${user?.name?.split(' ')[0]} 👋\nI’m your AI Study Abroad Counsellor.\nWhat would you like to plan today?`,
        timestamp: new Date()
      }]);
    } else setMessages(data);
  };

  /* ================= SEND ================= */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input;
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, {
      role: 'user',
      content: text,
      timestamp: new Date()
    }]);

    try {
      const { data } = await sendMessage(text);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        actions: data.actions,
        timestamp: new Date()
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTIONS ================= */
  const handleAnalyze = async () => {
    setAnalysisLoading(true);
    const { data } = await getAnalysis();
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `📊 Profile Analysis\n\n${data.analysis}`,
      timestamp: new Date()
    }]);
    setAnalysisLoading(false);
  };

  const handleClear = async () => {
    if (!window.confirm('Clear chat history?')) return;
    await clearChatHistory();
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared. How can I help?',
      timestamp: new Date()
    }]);
  };

  /* ================= UI ================= */
  return (
    <div className="counsellor-page">
      <div className="counsellor-container">

        {/* HEADER */}
        <div className="counsellor-header">
          <div className="header-left">
            <div className="bot-avatar">🤖</div>
            <div>
              <h1>AI Counsellor</h1>
              <p>Study abroad guidance, 24/7</p>
            </div>
          </div>

          <div className="header-actions">
            <button className="btn btn-outline btn-sm" onClick={handleAnalyze}>
              📊 Analyze
            </button>
            <button className="btn btn-outline btn-sm btn-danger" onClick={handleClear}>
              🗑 Clear
            </button>
          </div>
        </div>

        {/* CHAT */}
        <div className="messages-area">
          {messages.map((m, i) => (
            <ChatMessage key={i} message={m} isUser={m.role === 'user'} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <form className="chat-input-form" onSubmit={handleSend}>
          <button type="button" className={`icon-btn ${listening ? 'active' : ''}`} onClick={startListening}>
            🎤
          </button>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about universities, exams, budget..."
            disabled={loading}
          />

          <button type="button" className="icon-btn" onClick={() => window.speechSynthesis.cancel()}>
            🛑
          </button>

          <button className="send-btn" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>

      </div>
    </div>
  );
};

export default Counsellor;
