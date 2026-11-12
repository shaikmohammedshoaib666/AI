import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquareText, 
  Send, 
  Bot, 
  User, 
  Volume2, 
  RefreshCw, 
  Sparkles, 
  Phone,
  HelpCircle
} from 'lucide-react';
import { sendChatMessage } from '../services/api';

export default function AssistantPage({ language, setLanguage }) {
  const isTe = language === 'te';
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: isTe
        ? 'నమస్కారం రైతు సోదరులారా! నేను మీ అగ్రిస్మార్ట్ ఏఐ వ్యవసాయ సహాయకుడిని. మీ పంటలు, నేల, ఆకులు పసుపు రంగులోకి మారడం, లేదా ఎరువుల వాడకం గురించి ఏదైనా ప్రశ్న అడగండి.'
        : 'Hello Farmer friend! I am your AgriSmart AI Assistant. Ask me anything about crop suitability, leaf yellowing, soil fertility, fertilizer dosage, or irrigation timing.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const starterPrompts = isTe ? [
    'నా నేలకు ఏ పంట అనుకూలం?',
    'నా పంట ఆకులు ఎందుకు పసుపుగా మారుతున్నాయి?',
    'భూసారాన్ని ఎలా పెంచుకోవాలి?',
    'ఏ ఎరువులు ఎంత మోతాదులో వాడాలి?',
    'పంటకు నీరు ఎప్పుడు పెట్టాలి?',
    'తెగుళ్ళు రాకుండా ఎలాంటి జాగ్రత్తలు తీసుకోవాలి?'
  ] : [
    'Which crop is suitable for my soil?',
    'Why are my leaves turning yellow?',
    'How can I improve soil fertility?',
    'Which fertilizer should I use?',
    'When should I irrigate?',
    'How can I prevent crop diseases?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'farmer',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await sendChatMessage(textToSend, language);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: isTe
          ? 'క్షమించండి, సమాధానం పొందడంలో సమస్య ఎదురైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
          : 'Sorry, I encountered an issue retrieving that advice. Please try again or call the Kisan Helpline at 1800-180-1551.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Text-to-speech for accessibility (farmer read-out)
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove markdown bolding stars for clean speech
      const clean = text.replace(/[*#•_]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = isTe ? 'te-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-agri-700 text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">
                {isTe ? 'రైతు ఏఐ సహాయకుడు' : 'AgriSmart AI Assistant'}
              </h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                {isTe ? 'ఆన్‌లైన్' : 'Online'}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              {isTe ? 'తెలుగు మరియు ఇంగ్లీషులో 24/7 వ్యవసాయ సలహాలు' : 'Bilingual Agronomic Q&A in English & Telugu'}
            </p>
          </div>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-semibold text-stone-500">{isTe ? 'భాష:' : 'Language:'}</span>
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                language === 'en' ? 'bg-white text-agri-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                language === 'te' ? 'bg-agri-700 text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Starter Prompt Pills */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{isTe ? 'తరచుగా అడిగే ప్రశ్నలు (క్లిక్ చేయండి):' : 'Suggested Farmer Questions (Click to Ask):'}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {starterPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs bg-white hover:bg-agri-50 hover:text-agri-900 hover:border-agri-300 text-stone-700 px-3 py-1.5 rounded-xl border border-stone-200/90 transition shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isFarmer = msg.sender === 'farmer';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isFarmer ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                    isFarmer ? 'bg-earth-600' : 'bg-agri-700'
                  }`}
                >
                  {isFarmer ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[82%] sm:max-w-[75%] space-y-1`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                      isFarmer
                        ? 'bg-agri-700 text-white rounded-tr-none'
                        : 'bg-stone-50 border border-stone-200 text-stone-900 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div className={`flex items-center gap-2 text-[10px] text-stone-400 px-1 ${isFarmer ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.timestamp}</span>
                    {!isFarmer && (
                      <button
                        onClick={() => speakText(msg.text)}
                        title="Read aloud"
                        className="hover:text-agri-700 transition"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-agri-700 flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl rounded-tl-none border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-agri-600" />
                <span>{isTe ? 'సలహాను సిద్ధం చేస్తోంది...' : 'Consulting agricultural knowledge base...'}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-50/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isTe ? 'మీ వ్యవసాయ ప్రశ్నను ఇక్కడ టైప్ చేయండి...' : 'Type your agriculture question here...'}
              className="flex-1 px-4 py-3 bg-white border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className={`p-3 rounded-2xl font-bold transition shadow-sm ${
                !inputValue.trim() || loading
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-agri-700 hover:bg-agri-800 text-white'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
