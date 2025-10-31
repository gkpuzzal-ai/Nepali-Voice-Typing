
import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { Message, Sentiment } from '../types';
import * as geminiService from '../services/geminiService';
import { Mic, MicOff, Send, Search, Wand2, Bot, Trash2, Star, EyeOff } from 'lucide-react';

export const Messaging: React.FC = () => {
  const { text, setText, isListening, startListening, stopListening } = useSpeechRecognition();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
        // Initial bot message
        setMessages([{
            id: crypto.randomUUID(),
            text: "नमस्ते! म तपाईंको सन्देश सहायक हुँ। केहि बोल्नुहोस् वा लेख्नुहोस्।",
            sender: 'bot',
            timestamp: Date.now()
        }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    setText('');
  };

  const handleGenerateReply = async (lastMessage: string) => {
    setIsLoadingAI(true);
    try {
      const reply = await geminiService.generateReply(lastMessage);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: reply,
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (e) {
      console.error("Failed to generate reply", e);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const toggleHighlight = (id: string) => {
    setMessages(messages.map(msg => msg.id === id ? { ...msg, highlighted: !msg.highlighted } : msg));
  };
  
  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const filteredMessages = messages.filter(msg => 
    msg.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
          />
        </div>
        <button onClick={clearHistory} className="flex items-center text-xs text-slate-500 hover:text-red-500 ml-4">
          <Trash2 size={14} className="mr-1" /> Clear History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredMessages.map(msg => (
          <ChatMessage key={msg.id} message={msg} onHighlight={() => toggleHighlight(msg.id)} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            placeholder="Type or speak a message..."
            className="w-full pr-24 pl-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-rose-400"
            rows={1}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button onClick={isListening ? stopListening : startListening} className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button onClick={handleSendMessage} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600">
              <Send size={20} />
            </button>
          </div>
        </div>
        <div className="mt-2 flex justify-end">
            <button
                onClick={() => {
                    const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
                    if(lastUserMessage) handleGenerateReply(lastUserMessage.text);
                }}
                disabled={isLoadingAI}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full transition-colors bg-rose-100 text-rose-600 hover:bg-rose-200 disabled:opacity-50 dark:bg-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-900"
            >
                {isLoadingAI ? <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div> : <Bot size={14} />}
                Generate Reply
            </button>
        </div>
      </div>
    </div>
  );
};

const ChatMessage: React.FC<{ message: Message; onHighlight: () => void; }> = ({ message, onHighlight }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white"><Bot size={20} /></div>}
      <div className={`group relative max-w-sm lg:max-w-md px-4 py-3 rounded-2xl ${isUser ? 'bg-rose-500 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 rounded-bl-none'} ${message.highlighted ? 'ring-2 ring-yellow-400' : ''}`}>
        <p className="text-sm break-words">{message.text}</p>
        <div className="absolute top-1/2 -translate-y-1/2 -left-10 hidden group-hover:flex items-center gap-1">
           <button onClick={onHighlight} className="p-1.5 rounded-full bg-white dark:bg-slate-600 hover:bg-yellow-100 dark:hover:bg-yellow-800 text-slate-500 dark:text-slate-300">
                <Star size={12} className={message.highlighted ? 'text-yellow-500 fill-current' : ''} />
           </button>
        </div>
      </div>
    </div>
  );
};

