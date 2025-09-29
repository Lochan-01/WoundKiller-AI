import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Mic, Paperclip, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI wound care assistant. I can help you with wound assessment, healing progress, care instructions, and answer any questions about your recovery. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Assess my wound photo', 'Healing timeline questions', 'Pain management tips', 'Signs of infection']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiResponses = {
    wound_assessment: [
      "I can help analyze your wound photo. Please upload a clear, well-lit image of your wound. I'll assess healing progress, identify any concerning signs, and provide care recommendations.",
      "For accurate wound assessment, ensure the photo shows the entire wound area with good lighting. I'll evaluate size, color, drainage, and healing indicators."
    ],
    healing_progress: [
      "Wound healing typically occurs in 4 stages: hemostasis, inflammation, proliferation, and remodeling. Most wounds show significant improvement within 2-3 weeks with proper care.",
      "Your healing progress looks encouraging! Continue following your care routine. I recommend taking photos every 2-3 days to track changes and monitor for any complications."
    ],
    pain_management: [
      "For wound pain management, follow your prescribed medications. You can also try elevation, cold therapy (if approved by your doctor), and gentle movement as tolerated.",
      "Pain levels should gradually decrease as healing progresses. If pain increases or becomes severe, contact your healthcare provider immediately."
    ],
    infection_signs: [
      "Watch for these infection warning signs: increased redness spreading from the wound, warmth, swelling, pus or unusual discharge, red streaking, fever, or worsening pain.",
      "If you notice any signs of infection, contact your healthcare provider immediately. Early treatment is crucial for preventing complications."
    ],
    general: [
      "I'm here to support your wound healing journey. Remember to keep your wound clean and dry, follow your care instructions, and don't hesitate to reach out with any concerns.",
      "Based on your wound care history, continue your current treatment routine. Proper nutrition, hydration, and rest are also important for optimal healing.",
      "That's a great question! For optimal wound healing, maintain good hygiene, follow medication schedules, and attend all follow-up appointments with your healthcare provider."
    ]
  };

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('photo') || message.includes('picture') || message.includes('image') || message.includes('assess')) {
      return aiResponses.wound_assessment[Math.floor(Math.random() * aiResponses.wound_assessment.length)];
    } else if (message.includes('heal') || message.includes('progress') || message.includes('time')) {
      return aiResponses.healing_progress[Math.floor(Math.random() * aiResponses.healing_progress.length)];
    } else if (message.includes('pain') || message.includes('hurt') || message.includes('sore')) {
      return aiResponses.pain_management[Math.floor(Math.random() * aiResponses.pain_management.length)];
    } else if (message.includes('infection') || message.includes('red') || message.includes('swollen') || message.includes('pus')) {
      return aiResponses.infection_signs[Math.floor(Math.random() * aiResponses.infection_signs.length)];
    } else {
      return aiResponses.general[Math.floor(Math.random() * aiResponses.general.length)];
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = getAIResponse(currentMessage);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Chat Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 font-heading">AI Wound Care Assistant</h1>
              <p className="text-sm text-green-600 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Online • Ready to help
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-xs lg:max-w-md`}>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-auto'
                      : 'bg-white text-gray-900 border border-gray-100'
                  }`}
                >
                  <p className="text-sm font-body leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
                
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-600 font-medium">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-full transition-colors border border-blue-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-t border-gray-200 p-4 shadow-lg"
      >
        <div className="flex items-end space-x-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about wound care, symptoms, healing progress, or upload a photo for analysis..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 font-body"
              rows="1"
              style={{ minHeight: '48px' }}
            />
          </div>
          
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-3 flex items-center justify-center">
          <p className="text-xs text-gray-500 text-center max-w-md">
            🔒 This AI provides guidance but doesn't replace professional medical care. Urgent concerns will be flagged for immediate doctor review.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInterface;