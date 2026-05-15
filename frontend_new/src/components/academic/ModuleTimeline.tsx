import React from 'react';

import { Module } from '@/types';

const ModuleTimeline = ({ modules }: { modules: Module[] }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Course Content
                <span className="text-xs font-normal text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {modules.filter(m => m.completed).length}/{modules.length} Complete
                </span>
            </h2>

            <div className="relative space-y-1">
                {modules.map((mod, idx) => (
                    <div
                        key={mod.number}
                        className={`group relative pl-8 py-4 transition-all ${mod.active ? 'bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl' : ''}`}
                    >
                        {/* Vertical Line */}
                        {idx !== modules.length - 1 && (
                            <div className="absolute left-[13px] top-[24px] bottom-[-24px] w-[2px] bg-gray-200 dark:bg-slate-800" />
                        )}

                        {/* Dot/Icon */}
                        <div className={`absolute left-0 top-6 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 
              ${mod.completed
                                ? 'bg-green-500 border-green-500'
                                : mod.active
                                    ? 'bg-blue-600 border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/30'
                                    : 'bg-white dark:bg-slate-950 border-gray-300 dark:border-slate-700'}`}
                        >
                            {mod.completed ? (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className={`text-[10px] font-bold ${mod.active ? 'text-white' : 'text-gray-400'}`}>0{mod.number}</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`font-bold transition-colors ${mod.active ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                    Module {mod.number}: {mod.title}
                                </h3>
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 uppercase font-medium">
                                    <span>NOTES</span>
                                    <span>•</span>
                                    <span>PYQ ANALYSIS</span>
                                    <span>•</span>
                                    <span>AI TUTOR</span>
                                </div>
                            </div>

                            <button className="opacity-0 group-hover:opacity-100 px-4 py-1.5 border border-gray-200 dark:border-slate-700 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                                Continue
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModuleTimeline;
