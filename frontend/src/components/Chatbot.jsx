import React, { useState, useEffect, useRef } from 'react';
import { Send, Minus, Plus } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // New state for minimize/expand
  const messagesEndRef = useRef(null);
  const chatSessionId = useRef(null);

  useEffect(() => {
    // Generate a unique session ID when component mounts
    if (!chatSessionId.current) {
      chatSessionId.current = `session_${Date.now()}`;
    }

    const savedMessages = sessionStorage.getItem(`chat_${chatSessionId.current}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(
        `chat_${chatSessionId.current}`,
        JSON.stringify(messages)
      );
    }
    // scrollToBottom();
  }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

  const handleSubmit = async (e) => {
    console.log(input)
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    console.log("chatSessionId",chatSessionId.current)
    console.log("KANN",messages)
    try {
      const response = await axios.post('http://localhost:3000/chat', {
        message: input,
        sessionId: chatSessionId.current,
        history: messages
      });
      const data = response.data;

      if (response.status === 200&& data.response) {
        const assistantMessage = data.response.parts?.[0]?.text || "Error: Invalid response format"; 
        setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

    } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Minimized View (Circle Button) */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      ) : (
        // Expanded View (Chatbot UI)
        <div className="w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-xl font-semibold">IIIT Buy-Sell Support</h2>
            <button onClick={() => setIsMinimized(true)} className="text-white">
              <Minus className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="typing-indicator space-x-1">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
