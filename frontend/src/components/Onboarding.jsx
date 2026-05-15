import React, { useState } from 'react';
import { GraduationCap, BookOpen, Target, Sparkles, ArrowRight } from 'lucide-react';

export default function Onboarding({ onComplete }) {
    const [step, setStep] = useState(1);
    const [semester, setSemester] = useState('');
    const [branch, setBranch] = useState('');

    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
    const branches = [
        { id: 'CS-AIML', name: 'Computer Science (AI & ML)' },
        { id: 'CSE', name: 'Computer Science & Engineering' },
        { id: 'ECE', name: 'Electronics & Communication' },
        { id: 'EEE', name: 'Electrical & Electronics' },
        { id: 'ME', name: 'Mechanical Engineering' },
        { id: 'CE', name: 'Civil Engineering' }
    ];

    const handleSubmit = () => {
        // Save to local storage or backend
        localStorage.setItem('ktu_student_setup', JSON.stringify({ semester, branch }));
        onComplete({ semester, branch });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Panel - Branding */}
                <div className="bg-indigo-600 text-white p-12 md:w-2/5 flex flex-col justify-between">
                    <div>
                        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 shadow-inner">
                            <GraduationCap size={32} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-4">A1 Academy</h1>
                        <p className="text-indigo-100 font-medium text-lg leading-relaxed">
                            Your intelligent AI companion designed exclusively for Kerala Technological University (KTU).
                        </p>
                    </div>

                    <div className="mt-12 space-y-6">
                        <div className="flex items-center gap-4 text-indigo-50">
                            <div className="bg-indigo-500/50 p-3 rounded-full"><BookOpen size={20} /></div>
                            <span className="font-semibold text-sm">Curated Notes & Video Lessons</span>
                        </div>
                        <div className="flex items-center gap-4 text-indigo-50">
                            <div className="bg-indigo-500/50 p-3 rounded-full"><Target size={20} /></div>
                            <span className="font-semibold text-sm">AI Study Planner & Tracker</span>
                        </div>
                        <div className="flex items-center gap-4 text-indigo-50">
                            <div className="bg-indigo-500/50 p-3 rounded-full"><Sparkles size={20} /></div>
                            <span className="font-semibold text-sm">Instant KTU PYQ Insights</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Setup Flow */}
                <div className="p-12 md:w-3/5 flex flex-col justify-center bg-gray-50/50">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Personalize Your Learning</h2>
                        <p className="text-gray-500 font-medium text-sm mt-2">Let's tailor your dashboard to your exact curriculum.</p>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Select Your Semester</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {semesters.map(sem => (
                                        <button
                                            key={sem}
                                            onClick={() => setSemester(sem)}
                                            className={`p-4 rounded-xl border-2 font-black transition-all text-center
                                                ${semester === sem
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md transform scale-105'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-gray-50'}`}
                                        >
                                            S{sem}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!semester}
                                className="w-full mt-8 bg-indigo-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                Continue <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in relative">
                            <button onClick={() => setStep(1)} className="absolute -top-12 left-0 text-sm font-bold text-indigo-600 hover:underline">← Back</button>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Select Your Branch</label>
                                <div className="space-y-3">
                                    {branches.map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => setBranch(b.id)}
                                            className={`w-full text-left p-4 rounded-xl border-2 font-bold transition-all flex justify-between items-center
                                                ${branch === b.id
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-gray-50'}`}
                                        >
                                            <span>{b.name}</span>
                                            <span className={`text-xs px-2 py-1 rounded-md ${branch === b.id ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-500'}`}>{b.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={!branch}
                                className="w-full mt-8 bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                Enter A1 Academy
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
