import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, BookOpen, GraduationCap, PlayCircle } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import SubjectPage from './components/SubjectPage';
import MockExamEngine from './components/MockExamEngine';
import Profile from './components/Profile';
import CoursesDashboard from './components/CoursesDashboard';
import CoursePlayer from './components/CoursePlayer';
import Onboarding from './components/Onboarding';

function App() {
    const [activeTab, setActiveTab] = useState('courses');
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [chatPrompt, setChatPrompt] = useState('');

    // Check if user has completed setup
    const savedConfig = localStorage.getItem('ktu_student_setup');
    const [isOnboarded, setIsOnboarded] = useState(!!savedConfig);
    const studentSettings = savedConfig ? JSON.parse(savedConfig) : null;

    if (!isOnboarded) {
        return <Onboarding onComplete={() => setIsOnboarded(true)} />;
    }

    // If watching a course:
    if (selectedCourseId) {
        return <CoursePlayer courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />;
    }

    return (
        <div className="flex h-screen w-full bg-gray-50 text-gray-900 font-sans">
            {/* Left Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
                        <GraduationCap size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                        A1 Academy
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'courses' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <PlayCircle size={20} className={activeTab === 'courses' ? 'text-indigo-600' : 'text-gray-400'} />
                        My Courses
                    </button>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'} />
                        University Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <MessageSquare size={20} className={activeTab === 'chat' ? 'text-indigo-600' : 'text-gray-400'} />
                        AI Tutor
                    </button>
                    <button
                        onClick={() => setActiveTab('mock-exam')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'mock-exam' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <BookOpen size={20} className={activeTab === 'mock-exam' ? 'text-indigo-600' : 'text-gray-400'} />
                        Mock Exams
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'profile' ? 'bg-indigo-50 border border-indigo-100 shadow-sm' : 'hover:bg-gray-100'}`}
                    >
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                            A
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Student</h4>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">KTU {studentSettings?.branch} ({studentSettings?.semester}th Sem)</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col bg-gray-50 h-screen overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm z-10 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 capitalize tracking-tight">
                            {activeTab.replace('-', ' ')}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">
                            {activeTab === 'courses' && "Manage your enrolled courses and discover new ones."}
                            {activeTab === 'dashboard' && "Overview of your academic progress."}
                            {activeTab === 'chat' && "Get instant help from your personalized AI tutor."}
                            {activeTab === 'mock-exam' && "Practice under strict exam conditions."}
                            {activeTab === 'profile' && "Manage your student account and academic settings."}
                        </p>
                    </div>
                </header>
                <div className="flex-1 overflow-auto relative">
                    {activeTab === 'courses' && (
                        <CoursesDashboard onOpenCourse={id => setSelectedCourseId(id)} />
                    )}
                    {activeTab === 'dashboard' && !selectedSubject && (
                        <Dashboard
                            onSelectSubject={(id) => {
                                setSelectedSubject(id);
                                // No need to change activeTab, just show SubjectPage
                            }}
                        />
                    )}
                    {activeTab === 'dashboard' && selectedSubject && (
                        <SubjectPage
                            subjectId={selectedSubject}
                            onBack={() => setSelectedSubject(null)}
                        />
                    )}
                    {activeTab === 'chat' && <ChatInterface initialPrompt={chatPrompt} clearPrompt={() => setChatPrompt('')} />}
                    {activeTab === 'mock-exam' && <MockExamEngine />}
                    {activeTab === 'profile' && <Profile setActiveTab={setActiveTab} setChatPrompt={setChatPrompt} />}
                </div>
            </main>
        </div>
    );
}

export default App;
