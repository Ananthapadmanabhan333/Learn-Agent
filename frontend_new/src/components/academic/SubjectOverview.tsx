import React from 'react';

interface SubjectProps {
    code: string;
    name: string;
    credits: number;
    pattern: string;
}

const SubjectOverview = ({ code, name, credits, pattern }: SubjectProps) => {
    return (
        <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">{code}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-xs font-medium text-gray-500">{credits} Credits</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                        Master the core principles of {name}, strictly aligned with the KTU syllabus and optimized for S-Grade performance.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl text-right">
                        <span className="block text-xs font-semibold text-indigo-600 uppercase">Exam Pattern</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{pattern}</span>
                    </div>
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                        Start Learning
                    </button>
                </div>
            </div>

            {/* Mini Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-slate-800">
                {[
                    { label: 'Modules', value: '5' },
                    { label: 'Recorded PYQs', value: '42' },
                    { label: 'Readiness', value: '65%', color: 'text-green-500' },
                    { label: 'Predicted Grade', value: 'S', color: 'text-indigo-600' }
                ].map((stat) => (
                    <div key={stat.label}>
                        <span className="text-xs font-medium text-gray-500 block">{stat.label}</span>
                        <span className={`text-lg font-bold ${stat.color || 'text-gray-900 dark:text-gray-100'}`}>{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubjectOverview;
