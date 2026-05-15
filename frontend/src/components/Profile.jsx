import React, { useState, useEffect } from 'react';
import { User, Book, Award, Target, Activity, FileText, ChevronRight, Clock } from 'lucide-react';

export default function ProfilePage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const savedConfig = localStorage.getItem('ktu_student_setup');
    const studentSettings = savedConfig ? JSON.parse(savedConfig) : { semester: 6, branch: 'CS-AIML' };

    const handleReset = () => {
        localStorage.removeItem('ktu_student_setup');
        window.location.reload();
    };

    const API_BASE = "http://127.0.0.1:8000/api/v1";

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch(`${API_BASE}/academics/profile/summary`);
                const data = await response.json();

                // If API returns empty subject_progress, let's inject mock data for preview display
                if (data.subject_progress && data.subject_progress.length === 0) {
                    data.subject_progress = [
                        {
                            code: "AMT302",
                            name: "Concepts in Natural Language Processing",
                            readiness: 78,
                            predicted_grade: "A",
                            pyq_coverage: 85,
                            weak_areas: ["Transformer Architecture", "Viterbi Algorithm"]
                        },
                        {
                            code: "AIT304",
                            name: "Robotics and Intelligent Systems",
                            readiness: 62,
                            predicted_grade: "B+",
                            pyq_coverage: 50,
                            weak_areas: ["Kinematics", "Sensors"]
                        }
                    ];
                }
                setSummary(data);
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!summary || summary.error) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
                Failed to load profile data.
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-gray-50 flex flex-col p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full space-y-8">

                {/* ── Profile Header ── */}
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex items-center gap-8">
                    <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shrink-0 shadow-lg border-4 border-white">
                        <User size={48} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{summary.username || "Student Profile"}</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold border border-indigo-100">
                                S{summary.academic_overview?.semester || studentSettings.semester}
                            </span>
                            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-bold border border-purple-100">
                                {summary.academic_overview?.branch || studentSettings.branch}
                            </span>
                            <span className="text-sm font-medium text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors" onClick={handleReset}>
                                Edit Curriculum Settings
                            </span>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="flex items-center justify-end gap-2 text-emerald-600 font-black text-2xl">
                            <Target size={24} /> A Grade Target
                        </div>
                        <p className="text-sm font-medium text-gray-400 mt-1">Overall Projection</p>
                    </div>
                </div>

                {/* ── Analytics Overview ── */}
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Activity size={24} className="text-indigo-600" /> Academic Readiness Center
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Subject Progress List */}
                    <div className="space-y-4">
                        {summary.subject_progress?.map((sub, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{sub.name}</h3>
                                        <p className="text-sm font-bold text-indigo-500">{sub.code}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-gray-900">{sub.readiness}%</div>
                                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Readiness</p>
                                    </div>
                                </div>

                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-5">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${sub.readiness > 75 ? 'bg-emerald-500' : sub.readiness > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        style={{ width: `${sub.readiness}%` }}
                                    ></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Pred. Grade</p>
                                        <p className="font-bold text-gray-800">{sub.predicted_grade || "N/A"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-400 uppercase">PYQ Coverage</p>
                                        <p className="font-bold text-gray-800">{sub.pyq_coverage || 0}%</p>
                                    </div>
                                </div>

                                {sub.weak_areas && sub.weak_areas.length > 0 && (
                                    <div className="mt-4 bg-rose-50 rounded-xl p-3 border border-rose-100">
                                        <p className="text-xs font-black text-rose-800 uppercase mb-1 flex items-center gap-1">
                                            <AlertCircle size={12} /> Focus Required
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {sub.weak_areas.map((wa, i) => (
                                                <span key={i} className="text-xs font-bold text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200">
                                                    {wa}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Stats & History Grid */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                                <Book size={64} className="absolute -bottom-4 -right-4 text-white opacity-10" />
                                <p className="text-sm font-bold text-indigo-200">Enrolled Subjects</p>
                                <p className="text-4xl font-black mt-2">{summary.subject_progress?.length || 0}</p>
                            </div>
                            <div className="bg-emerald-500 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                                <FileText size={64} className="absolute -bottom-4 -right-4 text-white opacity-10" />
                                <p className="text-sm font-bold text-emerald-100">Notes Generated</p>
                                <p className="text-4xl font-black mt-2">12</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-gray-400" /> Recent Activity
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Generated Notes: AMT302 Module 1</p>
                                        <p className="text-xs font-medium text-gray-400 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Award size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Completed Mock Exam: CST306</p>
                                        <p className="text-xs font-medium text-gray-400 mt-1">Score: 75/100 • 1 day ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">AI Tutor: Transformers architecture explanation</p>
                                        <p className="text-xs font-medium text-gray-400 mt-1">2 days ago</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                                View Full History
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Ensure icons like AlertCircle are imported or stubbed if missing from lucide-react above.
const AlertCircle = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
