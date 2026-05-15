import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Youtube, Upload, Clock, BookOpen, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ChatInterface({ subjectId, initialPrompt, clearPrompt }) {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'agent', text: 'Welcome to A1 Engine. I am your specialized KTU Academic Tutor. How can I help you today?', source: null }
    ]);
    const [input, setInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [localSubjectId, setLocalSubjectId] = useState(subjectId || '');
    const [examMode, setExamMode] = useState(false);
    const fileInputRef = useRef(null);

    const API_BASE = "http://127.0.0.1:8000/api/v1";

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get(`${API_BASE}/academics/subjects`);
                setSubjects(res.data);
                if (!localSubjectId && res.data.length > 0) {
                    setLocalSubjectId(res.data[0].id);
                }
            } catch {
                console.error("Failed to fetch subjects for chat");
            }
        };
        fetchSubjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (initialPrompt) {
            setInput(initialPrompt);
            clearPrompt();
        }
    }, [initialPrompt, clearPrompt]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const query = input;
        setInput('');

        const newMsg = { id: Date.now(), sender: 'user', text: query, source: null };
        setMessages(prev => [...prev, newMsg]);

        setIsTyping(true);
        try {
            if (!localSubjectId) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    sender: 'agent',
                    text: "Please select a subject context first.",
                    source: null
                }]);
                setIsTyping(false);
                return;
            }

            const response = await axios.post(`${API_BASE}/ai/chat`, {
                message: query,
                session_id: "default",
                subject_id: localSubjectId,
                exam_mode: examMode
            });

            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'agent',
                text: response.data.response,
                source: response.data.sources?.length ? response.data.sources.join(', ') : null
            }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'agent',
                text: "I'm having trouble connecting to the A1 Engine. Ensure the backend is running.",
                source: null
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        if (subjectId) formData.append('subject_id', subjectId);

        try {
            await axios.post(`${API_BASE}/documents/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'agent',
                text: `Successfully processed document: ${file.name}. It has been added to your knowledge base.`,
                source: null
            }]);
        } catch (error) {
            console.error("Upload error:", error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'agent',
                text: `Failed to upload ${file.name}.`,
                source: null
            }]);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleYouTubeUpload = async () => {
        const url = window.prompt("Enter the YouTube Video URL:");
        if (!url) return;

        setIsUploading(true);
        try {
            await axios.post(`${API_BASE}/documents/youtube?url=${encodeURIComponent(url)}`);

            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'agent',
                text: `Successfully processed YouTube video. The transcript has been added to your knowledge base.`,
                source: null
            }]);
        } catch (error) {
            console.error("YouTube upload error:", error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'agent',
                text: `Failed to process YouTube link.`,
                source: null
            }]);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex h-full w-full max-w-7xl mx-auto overflow-hidden bg-white shadow-sm border-x border-gray-200">
            {/* Sidebar Tools */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-6 shrink-0 overflow-y-auto">
                <div>
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Context Settings</h3>
                    <div className="mb-4">
                        <label className="text-xs font-bold text-gray-600 mb-1 block">Subject Filter</label>
                        <select
                            value={localSubjectId}
                            onChange={(e) => setLocalSubjectId(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm text-gray-700 outline-none focus:border-indigo-500"
                        >
                            <option value="" disabled>Select subject...</option>
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.code} - {sub.name.substring(0, 15)}...</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-6 cursor-pointer" onClick={() => setExamMode(!examMode)}>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-indigo-700 flex items-center gap-1">
                                <BookOpen size={14} /> Exam Mode
                            </span>
                            <span className="text-[10px] text-gray-500">KTU Format Answers</span>
                        </div>
                        <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${examMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${examMode ? 'translate-x-4' : ''}`}></div>
                        </div>
                    </div>

                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Upload Sources</h3>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full flex items-center gap-3 bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-sm p-3 rounded-xl transition-all text-left mb-2 group disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 size={18} className="text-indigo-500 animate-spin" /> : <FileText size={18} className="text-indigo-500" />}
                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Upload PDF/DOC</span>
                        <Upload size={14} className="ml-auto text-gray-400 group-hover:text-indigo-400" />
                    </button>

                    <button
                        onClick={handleYouTubeUpload}
                        disabled={isUploading}
                        className="w-full flex items-center gap-3 bg-white border border-gray-200 hover:border-red-300 hover:shadow-sm p-3 rounded-xl transition-all text-left group disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 size={18} className="text-red-500 animate-spin" /> : <Youtube size={18} className="text-red-500" />}
                        <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">YouTube Link</span>
                        <Upload size={14} className="ml-auto text-gray-400 group-hover:text-red-400" />
                    </button>
                </div>

                <div className="mt-8">
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Session Memory</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                            <BookOpen size={16} className="text-purple-500" />
                            <span className="font-medium truncate">Compiler Design Subsets</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                            <Clock size={16} className="text-amber-500" />
                            <span className="font-medium truncate">Last Mock: 84%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl p-4 ${msg.sender === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                                : 'bg-gray-100 border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                }`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                {msg.source && (
                                    <div className="mt-2 text-xs text-indigo-700 bg-indigo-100 p-2 rounded-lg flex items-center gap-2 border border-indigo-200">
                                        <FileText size={12} /> Source: {msg.source}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isUploading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-3">
                                <Loader2 size={18} className="animate-spin text-indigo-500" />
                                <span className="text-sm font-medium">Processing your upload, please wait...</span>
                            </div>
                        </div>
                    )}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-3">
                                <Loader2 size={18} className="animate-spin text-indigo-500" />
                                <span className="text-sm font-medium">A1 Engine is thinking...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                    <div className="max-w-4xl mx-auto flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a question, upload a mock, or request a study plan..."
                                className="w-full bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 placeholder-gray-400 text-gray-900 outline-none transition-all shadow-inner"
                                disabled={isUploading || isTyping}
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!input.trim() || isUploading || isTyping}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
