import React from 'react';

const SGradeStrategy = () => {
    return (
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
            <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-lg font-bold">S-Grade Strategy</h2>
            </div>

            <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <span className="text-xs font-semibold text-indigo-100 uppercase tracking-widest">Priority Focus</span>
                    <p className="text-sm mt-1 font-medium italic">
                        &quot;Module 3 &amp; 5 contribute to 45% of historical marks. Master them first.&quot;
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-indigo-100 uppercase">Master Ratio</span>
                        <span className="block text-xl font-bold">85%</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-indigo-100 uppercase">Effort Req.</span>
                        <span className="block text-xl font-bold">High</span>
                    </div>
                </div>

                <div className="pt-2">
                    <h4 className="text-xs font-bold mb-2 uppercase text-indigo-100">Quick Tips:</h4>
                    <ul className="text-xs space-y-2 text-indigo-50">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            Use standard symbols for Automata
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            Focus on numericals in Module 2
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SGradeStrategy;
