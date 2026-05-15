'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { aiService } from '@/services/api';

const MockExamPage = () => {
    const [timeLeft, setTimeLeft] = useState(10800); // 3 hours
    const [cheatingAttempts, setCheatingAttempts] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);

        // Cheating Detection (Tab Switch)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setCheatingAttempts(prev => prev + 1);
                alert("Warning: Tab switching is monitored during exams.");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const handleSubmission = async () => {
        setIsSubmitting(true);
        try {
            const sampleQ = "Discuss the phases of a compiler with a neat block diagram.";
            const sampleA = answers['q12'] || "";
            const sampleScheme = "1. Lexical Analysis (2) 2. Syntax (2) 3. Semantic (2) 4. Intermediate (2) 5. Optimization (2) 6. Code Gen (2) 7. Diagram (2) Total: 14";

            const res = await aiService.evaluate(sampleQ, sampleA, sampleScheme);
            setResult(res.data);
        } catch (err) {
            console.error("Evaluation failed", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (result) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-3xl space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold">Exam Submitted!</h1>
                        <p className="text-gray-500">Your AI-generated feedback is ready below.</p>
                    </div>
                    <div className="prose dark:prose-invert max-w-none p-6 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 whitespace-pre-wrap">
                        {result.feedback}
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
                {/* Exam Header */}
                <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold">Mock Exam: Compiler Design</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Official KTU Format • 100 Marks</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <span className="text-xs font-bold text-gray-400 block uppercase">Time Remaining</span>
                            <span className={`text-2xl font-mono font-bold ${timeLeft < 600 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <button
                            onClick={handleSubmission}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Evaluating...' : 'Submit Paper'}
                        </button>
                    </div>
                </div>

                {/* Part A */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-bold">Part A (Compulsory)</h2>
                        <span className="text-xs font-medium bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-gray-600 dark:text-gray-400">
                            10 Questions × 3 Marks = 30 Marks
                        </span>
                    </div>
                    {[1, 2, 3].map(q => (
                        <div key={q} className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                            <p className="font-medium text-gray-900 dark:text-gray-100">Q{q}. Explain the difference between NFA and DFA in the context of lexical analysis.</p>
                            <textarea
                                placeholder="Write your answer here..."
                                className="w-full h-32 p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>
                    ))}
                </section>

                {/* Part B */}
                <section className="space-y-4 pb-20">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-bold">Part B (Module-wise OR Choice)</h2>
                        <span className="text-xs font-medium bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-gray-600 dark:text-gray-400">
                            5 Modules × 14 Marks = 70 Marks
                        </span>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 mb-4">
                        <h3 className="font-bold text-blue-800 dark:text-blue-300">Module 1 Choice</h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">Answer either Q11 or Q12</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 opacity-50 cursor-not-allowed">
                            <span className="text-xs font-bold text-gray-400">QUESTION 11</span>
                            <p className="mt-2 font-medium">Coming soon...</p>
                        </div>
                        <div className="bg-white dark:bg-slate-950 border-2 border-blue-500 rounded-2xl p-6 ring-4 ring-blue-50 dark:ring-blue-900/20">
                            <span className="text-xs font-bold text-blue-600">QUESTION 12 (SELECTED)</span>
                            <p className="mt-2 font-medium text-gray-900 dark:text-gray-100">Discuss the phases of a compiler with a neat block diagram.</p>
                            <textarea
                                value={answers['q12'] || ""}
                                onChange={(e) => setAnswers(prev => ({ ...prev, q12: e.target.value }))}
                                placeholder="Write your answer here..."
                                className="w-full h-64 p-4 mt-4 bg-gray-50 dark:bg-slate-900 border-none rounded-xl text-sm outline-none resize-none"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default MockExamPage;
