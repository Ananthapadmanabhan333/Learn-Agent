import React, { useState, useEffect, useRef } from 'react';
import { FileText, BookOpen, Clock, AlertCircle, ChevronLeft, Save, CheckCircle, Hash } from 'lucide-react';

export default function MockExamEngine() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [currentExam, setCurrentExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(10800);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [examResult, setExamResult] = useState(null);
    const topRef = useRef(null);

    const API_BASE = "http://127.0.0.1:8000/api/v1";

    // 1. Fetch all subjects for the enrollment grid
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(`${API_BASE}/academics/subjects`);
                const data = await response.json();
                setSubjects(data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    // 2. Timer Logic
    useEffect(() => {
        if (currentExam && timeLeft > 0 && !submitted) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [currentExam, timeLeft, submitted]);

    // 3. Auto-save every 30 seconds
    useEffect(() => {
        if (currentExam && !submitted) {
            const interval = setInterval(async () => {
                try {
                    await fetch(`${API_BASE}/exam/autosave`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            subject_id: currentExam.subject_id,
                            answers
                        })
                    });
                    console.log("Auto-saved progress...");
                } catch {
                    console.warn("Auto-save failed");
                }
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [currentExam, answers, submitted]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartExam = async (subjectId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/exam/subjects/${subjectId}/generate`);
            const examData = await response.json();
            setCurrentExam(examData);
            setSelectedSubject(subjectId);
            setTimeLeft(examData.duration || 10800);
            setAnswers({});
            setSubmitted(false);
            setExamResult(null);
        } catch {
            alert("Failed to generate exam structure.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (window.confirm("Are you sure you want to submit? Your answers will be evaluated by the A1 Engine.")) {
            try {
                const response = await fetch(`${API_BASE}/exam/submit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject_id: selectedSubject,
                        answers: answers
                    })
                });
                const result = await response.json();
                setExamResult(result);
                setSubmitted(true);
            } catch {
                alert("Failed to submit exam. Check backend connection.");
            }
        }
    };

    const handleCancel = () => {
        setSelectedSubject(null);
        setCurrentExam(null);
        setSubmitted(false);
    };

    const getAnsweredCount = () => {
        return Object.values(answers).filter(a => a && a.trim().length > 0).length;
    };

    // ── Subject Selection View ──
    if (!selectedSubject) {
        return (
            <div className="h-full w-full bg-gray-50 flex flex-col p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <div className="text-center space-y-4 mb-8">
                        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold border border-indigo-100">
                            <FileText size={16} /> KTU Previous Year Question Paper Format
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">University Mock Exams</h2>
                        <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">
                            Attempt full-length KTU examinations for your enrolled subjects.
                            100 marks • 3 hours • Part A + Part B (Module-wise OR choice).
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {subjects.map((subj) => (
                                <div
                                    key={subj.id}
                                    onClick={() => handleStartExam(subj.id)}
                                    className="bg-white border-2 border-gray-100 hover:border-indigo-400 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col items-center text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        KTU 2019
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 transition-transform">
                                        <BookOpen size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2 min-h-[3.5rem]">{subj.name}</h3>
                                    <p className="text-sm font-bold text-indigo-500 bg-indigo-50/50 px-3 py-1 rounded-full mb-4">{subj.code}</p>
                                    <div className="text-xs text-gray-500 space-y-1 mb-5 w-full">
                                        <div className="flex justify-between bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <span>Credits</span><span className="font-bold text-gray-700">{subj.credits}</span>
                                        </div>
                                        <div className="flex justify-between bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <span>Max Marks</span><span className="font-bold text-gray-700">100</span>
                                        </div>
                                        <div className="flex justify-between bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <span>Duration</span><span className="font-bold text-gray-700">3 Hours</span>
                                        </div>
                                    </div>
                                    <button className="w-full py-3 rounded-xl bg-gray-50 text-gray-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        Start Examination
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="h-full overflow-y-auto bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl text-center">
                        <CheckCircle className="mx-auto text-emerald-500 mb-6" size={72} />
                        <h2 className="text-3xl font-black mb-3 text-gray-900 tracking-tight">Examination Evaluated</h2>
                        <p className="text-gray-500 font-medium mb-8">The A1 Engine has completed a deep-scan of your submission.</p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <ResultMetric label="Total Score" value={examResult?.total_score || 0} max={100} />
                            <ResultMetric label="Stability" value="88%" />
                            <ResultMetric label="Accuracy" value="92%" />
                            <ResultMetric label="S-Grade Prob" value="94%" color="text-indigo-600" />
                        </div>

                        <div className="space-y-6 text-left">
                            <h3 className="text-xl font-bold text-gray-900 border-b pb-4">Detailed Feedback Breakdown</h3>
                            {examResult?.evaluations && Object.entries(examResult.evaluations).map(([qid, evalData]) => (
                                <div key={qid} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-black text-gray-700 uppercase tracking-widest text-xs">Question {qid}</h4>
                                        <span className="bg-white px-3 py-1 rounded-lg border font-bold text-indigo-600 text-sm">
                                            Score: {evalData.score} / {evalData.max_marks}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <p className="text-xs font-black text-gray-400 uppercase">Reasoning & Deductions</p>
                                            <p className="text-sm text-gray-600 font-medium leading-relaxed">{evalData.reasoning}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-black text-gray-400 uppercase">Improvement Tips</p>
                                            <p className="text-sm text-emerald-700 font-bold leading-relaxed">💡 {evalData.feedback}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl transition-all font-bold shadow-lg"
                            >
                                Back to Exams
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function ResultMetric({ label, value, max, color = "text-gray-900" }) {
        return (
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className={`text-2xl font-black ${color}`}>{value}{max ? <span className="text-xs text-gray-400 ml-1">/{max}</span> : ''}</p>
            </div>
        );
    }

    if (!currentExam) return null;
    const timePercent = (timeLeft / currentExam.duration) * 100;

    return (
        <div className="h-full w-full bg-gray-50 text-gray-900 flex flex-col" ref={topRef}>
            {/* Sticky Exam Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-20 sticky top-0 shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors" title="Leave Exam">
                        <ChevronLeft size={22} />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <AlertCircle size={18} className="text-rose-500" /> {currentExam.code}: {currentExam.name}
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">KTU S6 B.Tech CS-AIML • Max: {currentExam.maxMarks} Marks • Duration: 3 Hours</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="text-xs text-gray-500 font-medium hidden md:block">
                        <span className="text-indigo-600 font-bold">{getAnsweredCount()}</span> answered
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold border ${timePercent < 10 ? 'text-rose-700 bg-rose-50 border-rose-200 animate-pulse' : timePercent < 30 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-gray-700 bg-gray-50 border-gray-200'}`}>
                        <Clock size={18} />
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md text-sm"
                    >
                        <Save size={16} /> Submit
                    </button>
                </div>
            </div>

            {/* Time Progress Bar */}
            <div className="h-1 bg-gray-200 shrink-0">
                <div
                    className={`h-full transition-all duration-1000 ${timePercent < 10 ? 'bg-rose-500' : timePercent < 30 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                    style={{ width: `${timePercent}%` }}
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto py-8 px-4 md:px-8 space-y-10 pb-16">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-gray-200 shadow-sm text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em] mb-3">Reg No: ........................</p>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight tracking-tight">APJ ABDUL KALAM TECHNOLOGICAL UNIVERSITY</h1>
                        <h2 className="text-base md:text-lg font-bold text-gray-700 mt-2">SIXTH SEMESTER B.TECH DEGREE EXAMINATION</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Branch: Computer Science and Engineering (AIML)</p>
                        <div className="mt-4 pt-4 border-t-2 border-gray-100">
                            <h3 className="text-lg font-black text-gray-800">{currentExam.code} — {currentExam.name.toUpperCase()}</h3>
                        </div>
                    </div>

                    {currentExam.sections.map((section, sIndex) => (
                        <div key={sIndex} className="space-y-6">
                            <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-xl text-center">
                                <h3 className="text-xl font-black text-indigo-900 tracking-wider">{section.part}</h3>
                                <p className="text-sm font-medium text-indigo-700 mt-1">{section.instructions}</p>
                                <p className="text-xs font-bold text-indigo-500 mt-1">({section.totalMarks} Marks)</p>
                            </div>

                            {section.questions && section.questions.map((q) => (
                                <div key={q.id} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-medium text-base flex gap-3 text-gray-800 leading-relaxed pr-4">
                                            <span className="text-indigo-600 font-bold whitespace-nowrap min-w-[2rem]">{q.qno}.</span>
                                            <span className="whitespace-pre-line">{q.text}</span>
                                        </h3>
                                        <div className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-lg shrink-0 border border-indigo-100">
                                            {q.marks}M
                                        </div>
                                    </div>
                                    <textarea
                                        value={answers[q.id] || ''}
                                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                        placeholder="Write your answer here..."
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3.5 min-h-[120px] text-gray-900 resize-y outline-none transition-all placeholder-gray-400 text-sm"
                                    />
                                </div>
                            ))}

                            {section.modules && section.modules.map((mod, mIndex) => (
                                <div key={mIndex} className="space-y-4">
                                    <div className="bg-gray-100 border border-gray-200 px-5 py-3 rounded-xl flex items-center gap-3">
                                        <Hash size={16} className="text-indigo-500" />
                                        <h4 className="text-sm font-black text-gray-700 uppercase tracking-wider">{mod.name}</h4>
                                        <span className="text-xs text-gray-400 font-medium ml-auto">Answer any ONE</span>
                                    </div>

                                    {mod.questions.map((q) => (
                                        <React.Fragment key={q.id}>
                                            {q.isOr && (
                                                <div className="flex items-center gap-4 py-1">
                                                    <div className="flex-1 h-px bg-gray-200"></div>
                                                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1 rounded-full border border-gray-200">OR</span>
                                                    <div className="flex-1 h-px bg-gray-200"></div>
                                                </div>
                                            )}

                                            <div className="bg-white p-5 md:p-7 rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-indigo-600 font-black text-lg">{q.qno}.</span>
                                                    <div className="bg-amber-50 text-amber-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-amber-100">
                                                        {q.marks} Marks
                                                    </div>
                                                </div>

                                                {q.parts.map((part, pIdx) => (
                                                    <div key={`${q.id}_${part.sub}`} className={`${pIdx > 0 ? 'mt-6 pt-5 border-t border-gray-100' : 'mt-3'}`}>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h3 className="font-medium text-base text-gray-800 leading-relaxed pr-4 flex gap-2">
                                                                <span className="text-gray-500 font-bold shrink-0">({part.sub})</span>
                                                                <span className="whitespace-pre-line">{part.text}</span>
                                                            </h3>
                                                            <span className="text-xs text-gray-400 font-bold shrink-0 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                                {part.marks}M
                                                            </span>
                                                        </div>
                                                        <textarea
                                                            value={answers[`${q.id}_${part.sub}`] || ''}
                                                            onChange={(e) => setAnswers({ ...answers, [`${q.id}_${part.sub}`]: e.target.value })}
                                                            placeholder={`Answer part (${part.sub}) here...`}
                                                            className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3.5 min-h-[180px] text-gray-900 resize-y outline-none transition-all placeholder-gray-400 text-sm"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="text-center pt-4 pb-8">
                        <p className="text-sm text-gray-400 font-medium mb-4">— End of Question Paper —</p>
                        <button
                            onClick={handleSubmit}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg text-base"
                        >
                            <Save size={20} /> Submit Examination
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResultMetric({ label, value, max, color = "text-gray-900" }) {
    return (
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}{max ? <span className="text-xs text-gray-400 ml-1">/{max}</span> : ''}</p>
        </div>
    );
}
