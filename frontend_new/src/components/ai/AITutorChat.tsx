import React, { useState } from 'react';
import { aiService } from '@/services/api';

const AITutorChat = ({ subjectId }: { subjectId: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([
        { role: 'ai', content: "Hello! I'm your KTU AI Tutor. Ask me anything about this subject or S-Grade strategies." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const res = await aiService.chat(subjectId, userMsg);
            setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting to the intelligence engine." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform active:scale-95"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-96 h-[520px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                                <span className="font-bold">K</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-none">AI Study Tutor</p>
                                <p className="text-[10px] text-indigo-100 mt-1 flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                                    {isTyping ? 'Expert is thinking...' : 'KTU Nexus Intelligence'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-slate-900/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm border ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-gray-100 dark:border-slate-700 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="bg-gray-200 dark:bg-slate-800 w-12 h-6 flex items-center justify-center rounded-full animate-pulse ml-2">
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-gray-500 rounded-full" />
                                    <div className="w-1 h-1 bg-gray-500 rounded-full" />
                                    <div className="w-1 h-1 bg-gray-500 rounded-full" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a question..."
                                className="w-full pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isTyping}
                                className="absolute right-2 top-1.5 p-1.5 text-indigo-600 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AITutorChat;
