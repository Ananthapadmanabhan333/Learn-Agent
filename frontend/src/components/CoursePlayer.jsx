import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, CheckCircle2, MessageSquare, Download, Menu, FileText } from 'lucide-react';

const MOCK_COURSE_DATA = {
    id: '1',
    title: 'Machine Learning Specialization',
    instructor: 'Andrew Ng',
    modules: [
        {
            id: 'm1',
            title: 'Week 1: Introduction to Machine Learning',
            lessons: [
                { id: 'l1', title: 'Welcome to the Course', type: 'video', duration: '5:20', completed: true },
                { id: 'l2', title: 'What is Machine Learning?', type: 'video', duration: '12:45', completed: true },
                { id: 'l3', title: 'Supervised Learning', type: 'video', duration: '18:10', completed: false },
                { id: 'l4', title: 'Unsupervised Learning', type: 'video', duration: '14:30', completed: false },
                { id: 'l5', title: 'Reading: ML Notation', type: 'reading', duration: '10 min', completed: false },
            ]
        },
        {
            id: 'm2',
            title: 'Week 2: Linear Regression with One Variable',
            lessons: [
                { id: 'l6', title: 'Model Representation', type: 'video', duration: '8:10', completed: false },
                { id: 'l7', title: 'Cost Function', type: 'video', duration: '11:20', completed: false },
                { id: 'l8', title: 'Gradient Descent', type: 'video', duration: '22:15', completed: false },
            ]
        }
    ]
};

const CoursePlayer = ({ onBack }) => {
    const [activeLesson, setActiveLesson] = useState(MOCK_COURSE_DATA.modules[0].lessons[2]); // Default to first uncompleted
    const [activeTab, setActiveTab] = useState('overview'); // overview, notes, forum

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <header className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-gray-900 text-white shrink-0">
                <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold">{MOCK_COURSE_DATA.title}</h1>
                    <p className="text-sm text-gray-400">{activeLesson.title}</p>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {/* Video Player Mockup */}
                    <div className="bg-black aspect-video flex-shrink-0 flex flex-col items-center justify-center relative group">
                        {activeLesson.type === 'video' ? (
                            <>
                                <img src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80" alt="Video frame" className="w-full h-full object-cover opacity-50" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center cursor-pointer">
                                    <div className="bg-indigo-600/90 p-4 rounded-full text-white backdrop-blur-sm shadow-xl transform group-hover:scale-110 transition-all">
                                        <PlayCircle size={48} />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-white">
                                    <div className="w-full bg-white/30 h-1.5 rounded-full cursor-pointer relative">
                                        <div className="absolute bg-indigo-500 w-1/3 h-full rounded-full"></div>
                                        <div className="absolute bg-white w-3 h-3 rounded-full top-1/2 -translate-y-1/2 -ml-1.5 left-1/3 shadow-sm"></div>
                                    </div>
                                    <span className="text-xs font-medium space-x-1 shrink-0">
                                        <span>4:15</span><span className="text-gray-400">/</span><span>{activeLesson.duration}</span>
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full bg-white text-gray-800 p-12 overflow-y-auto">
                                <h1 className="text-3xl font-bold mb-6">{activeLesson.title}</h1>
                                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                    This is a reading assignment. In Coursera, this contains rich text, formulas, and diagrams describing key concepts.
                                </p>
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                    <p className="font-bold text-blue-800">Key Takeaway</p>
                                    <p className="text-blue-900 mt-1">Machine learning is the science of getting computers to act without being explicitly programmed.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-white">
                        <button onClick={() => setActiveTab('overview')} className={`px-6 py-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Overview</button>
                        <button onClick={() => setActiveTab('notes')} className={`px-6 py-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'notes' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Notes</button>
                        <button onClick={() => setActiveTab('forum')} className={`px-6 py-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'forum' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Discussion Forum</button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8 flex-1 bg-gray-50">
                        {activeTab === 'overview' && (
                            <div className="max-w-3xl space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">About this lesson</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    In this video, we'll dive deep into the mechanics of {activeLesson.title.toLowerCase()}. Understanding this concept is fundamental to mastering the curriculum for this week and being successful in the programming assignments.
                                </p>
                                <div className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded-lg text-green-700">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Download Slides</h4>
                                            <p className="text-xs text-gray-500">PDF Document (1.2 MB)</p>
                                        </div>
                                    </div>
                                    <button className="text-indigo-600 font-bold p-2 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <Download size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeTab === 'notes' && (
                            <div className="max-w-3xl">
                                <textarea className="w-full h-64 border border-gray-200 rounded-xl p-4 text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none" placeholder="Take your personal notes here. They will be saved automatically..."></textarea>
                            </div>
                        )}
                        {activeTab === 'forum' && (
                            <div className="max-w-4xl space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2"><MessageSquare /> Discussions</h3>
                                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700">New Thread</button>
                                </div>

                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0">S{i}</div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 hover:text-indigo-600">Question about {activeLesson.title} concept around 10:20</h4>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">I am having trouble understanding the matrix multiplication step shown at 10:20. Can someone explain why we transpose the second matrix?</p>
                                                    <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-gray-500">
                                                        <span>Student User</span>
                                                        <span>•</span>
                                                        <span>2 hours ago</span>
                                                        <span>•</span>
                                                        <span className="text-indigo-600">14 Replies</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Course Structure */}
                <div className="w-80 border-l border-gray-200 bg-white flex flex-col shrink-0">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between font-bold text-gray-900 bg-gray-50">
                        Course Content
                        <Menu size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1 overflow-y-auto w-full">
                        {MOCK_COURSE_DATA.modules.map(module => (
                            <div key={module.id} className="border-b border-gray-100 last:border-0">
                                <div className="px-5 py-4 bg-white sticky top-0 font-bold text-sm text-gray-900 select-none shadow-sm z-10 w-full">
                                    {module.title}
                                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-500">
                                        <span>{module.lessons.filter(l => l.completed).length}/{module.lessons.length}</span>
                                        <span>•</span>
                                        <span>2h 15m</span>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-50 w-full">
                                    {module.lessons.map(lesson => {
                                        const isActive = activeLesson.id === lesson.id;
                                        return (
                                            <div
                                                key={lesson.id}
                                                onClick={() => setActiveLesson(lesson)}
                                                className={`px-5 py-3 w-full flex items-start gap-3 cursor-pointer transition-colors ${isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                                            >
                                                <div className="mt-0.5 shrink-0">
                                                    {lesson.completed ? (
                                                        <CheckCircle2 size={18} className="text-green-500" />
                                                    ) : lesson.type === 'video' ? (
                                                        <PlayCircle size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                                                    ) : (
                                                        <FileText size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                                                    )}
                                                </div>
                                                <div className="min-w-0 pr-2">
                                                    <p className={`text-sm tracking-tight break-words ${isActive ? 'font-bold text-indigo-900' : 'font-medium text-gray-700'}`}>
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 font-medium tracking-tight">
                                                        <span className="capitalize">{lesson.type}</span>
                                                        <span>•</span>
                                                        <span>{lesson.duration}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
