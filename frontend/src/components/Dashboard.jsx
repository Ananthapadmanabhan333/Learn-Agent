import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Target, Brain, AlertTriangle,
    BookOpen, Clock, CheckCircle, ArrowRight,
    Trophy, Zap, Lightbulb
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const mockPerformance = {
    readiness: 82,
    studyTime: "42h 15m",
    pyqCoverage: 75,
    predictedGrade: "S",
    weakHeatmap: [
        { name: 'Mod 1', val: 90 },
        { name: 'Mod 2', val: 85 },
        { name: 'Mod 3', val: 45 },
        { name: 'Mod 4', val: 70 },
        { name: 'Mod 5', val: 95 },
    ]
};

export default function Dashboard({ onSelectSubject }) {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch profile data
                const profileRes = await fetch('http://127.0.0.1:8000/api/v1/academics/profile/summary');
                if (profileRes.ok) {
                    setProfileData(await profileRes.json());
                }

                // Fetch subjects based on user settings
                const savedConfig = localStorage.getItem('ktu_student_setup');
                const studentSettings = savedConfig ? JSON.parse(savedConfig) : { semester: 6, branch: 'CS-AIML' };
                const subRes = await fetch(`http://127.0.0.1:8000/api/v1/academics/subjects?semester=${studentSettings.semester}&branch=${studentSettings.branch}`);
                const data = await subRes.json();
                setSubjects(data);

                // Fetch analysis for the first subject if available
                if (data.length > 0) {
                    fetchAnalysis(data[0].id);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAnalysis = async (subjectId) => {
            setLoadingAnalysis(true);
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/academics/subjects/${subjectId}/analysis`);
                if (response.ok) {
                    setAnalysis(await response.json());
                }
            } catch (error) {
                console.error("Error fetching analysis:", error);
            } finally {
                setLoadingAnalysis(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleGenerateStrategy = () => {
        if (analysis && analysis.most_expected_5) {
            alert(`Most Expected Questions:\n\n${analysis.most_expected_5}`);
        } else {
            alert("S-Grade Strategy analysis is currently unavailable. Please ensure the backend is running and PYQs are seeded.");
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-50/50 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* 📊 S-GRADE DASHBOARD HEADER */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome back{profileData?.username ? `, ${profileData.username}` : ''}!</h2>
                                <p className="text-gray-500 font-medium">Your S-Grade path is 82% complete. Keep it up!</p>
                            </div>
                            <div className="hidden md:flex gap-4">
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Predicted Grade</p>
                                    <p className="text-4xl font-black text-indigo-600 tracking-tighter">{mockPerformance.predictedGrade}</p>
                                </div>
                            </div>
                        </div>

                        {/* Readiness Heatmap & Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MetricCard
                                icon={<Target className="text-indigo-600" />}
                                label="Subject Readiness"
                                value={`${mockPerformance.readiness}%`}
                                color="bg-indigo-50"
                            />
                            <MetricCard
                                icon={<Clock className="text-emerald-600" />}
                                label="Study Time"
                                value={mockPerformance.studyTime}
                                color="bg-emerald-50"
                            />
                            <MetricCard
                                icon={<CheckCircle className="text-amber-600" />}
                                label="PYQ Coverage"
                                value={`${mockPerformance.pyqCoverage}%`}
                                color="bg-amber-50"
                            />
                        </div>
                    </div>

                    {/* 🧠 S-GRADE STRATEGY PANEL */}
                    <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                                    <Zap size={20} className="text-indigo-100" />
                                </div>
                                <h3 className="font-bold text-lg">S-Grade Strategy</h3>
                            </div>
                            <ul className="space-y-4 text-sm font-medium text-indigo-100">
                                {loadingAnalysis ? (
                                    <li className="animate-pulse">Analyzing patterns...</li>
                                ) : analysis?.s_grade_strategy ? (
                                    <>
                                        <li className="flex items-start gap-3">
                                            <Lightbulb size={16} className="mt-1 shrink-0 text-amber-300" />
                                            <span>Focus on: {analysis.s_grade_strategy.high_frequency_modules.map(m => `Module ${m[0]}`).join(', ')} (High frequency).</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Lightbulb size={16} className="mt-1 shrink-0 text-amber-300" />
                                            <span>Alloc Tip: {analysis.s_grade_strategy.time_allocation_tip}</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle size={16} className="mt-1 shrink-0 text-emerald-400" />
                                            <span>PYQs Found: {analysis.recurring_questions?.length || 0} recurring topics.</span>
                                        </li>
                                    </>
                                ) : (
                                    <li>No strategy data available yet. Please check again later.</li>
                                )}
                            </ul>
                        </div>
                        <button
                            onClick={handleGenerateStrategy}
                            className="mt-8 bg-white text-indigo-800 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all disabled:opacity-50"
                            disabled={!analysis?.most_expected_5}
                        >
                            Full Strategy Plan
                        </button>
                    </div>
                </div>

                {/* 🔍 SUBJECT DISPLAY */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="text-indigo-600" size={24} />
                            Active Subjects
                        </h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold text-gray-600 uppercase">Semester {profileData?.academic_overview?.semester || JSON.parse(localStorage.getItem('ktu_student_setup') || '{}').semester || 6}</span>
                            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold text-gray-600 uppercase">{profileData?.academic_overview?.branch || JSON.parse(localStorage.getItem('ktu_student_setup') || '{}').branch || 'CS-AIML'}</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {subjects.map((sub) => (
                                <SubjectCard key={sub.id} subject={sub} onSelect={onSelectSubject} />
                            ))}
                            {subjects.length === 0 && <p className="text-gray-400 font-medium">No subjects found for this semester.</p>}
                        </div>
                    )}
                </div>

                {/* 📊 WEAK MODULE HEATMAP */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <AlertTriangle className="text-rose-500" size={24} />
                        Weak Module Heatmap
                    </h3>
                    <div className="grid grid-cols-5 gap-4">
                        {mockPerformance.weakHeatmap.map((mod) => (
                            <div key={mod.name} className="space-y-3 text-center">
                                <div
                                    className={`h-24 rounded-2xl flex items-center justify-center font-bold text-white shadow-inner transition-transform hover:scale-105 cursor-default ${mod.val < 50 ? 'bg-rose-500' : mod.val < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`}
                                >
                                    {mod.val}%
                                </div>
                                <p className="text-sm font-bold text-gray-500">{mod.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function MetricCard({ icon, label, value, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className={`p-4 ${color} rounded-2xl`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function SubjectCard({ subject, onSelect }) {
    return (
        <div
            onClick={() => onSelect(subject.id)}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        >
            <div className="h-2 bg-indigo-600 w-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {subject.code}
                    </div>
                    <div className="text-gray-400 font-bold text-sm">
                        {subject.credits} Credits
                    </div>
                </div>
                <h4 className="text-xl font-extrabold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-700 transition-colors">
                    {subject.name}
                </h4>
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Readiness</p>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <span className="text-xs font-bold text-indigo-600">65%</span>
                        </div>
                    </div>
                    <button className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
