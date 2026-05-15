import React, { useState, useEffect } from 'react';
import {
    BookOpen, FileText, MessageSquare, BarChart3,
    ChevronRight, ExternalLink, Download,
    BrainCircuit, Info, Target, AlertCircle
} from 'lucide-react';
import ChatInterface from './ChatInterface';

export default function SubjectPage({ subjectId, onBack }) {
    const [subject, setSubject] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Subject Details
                const subRes = await fetch(`http://localhost:8000/api/v1/academics/subjects/${subjectId}`);
                const subData = await subRes.json();
                setSubject(subData);

                // Fetch PYQ Analysis
                const anaRes = await fetch(`http://localhost:8000/api/v1/academics/subjects/${subjectId}/analysis`);
                const anaData = await anaRes.json();
                setAnalysis(anaData);
            } catch (err) {
                console.error("Error fetching subject data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [subjectId]);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header / Overview */}
            <div className="bg-gray-50 border-b border-gray-200 px-8 py-10">
                <div className="max-w-6xl mx-auto">
                    <button onClick={onBack} className="text-sm font-bold text-gray-400 hover:text-indigo-600 mb-6 flex items-center gap-1 group">
                        <ChevronRight className="rotate-180" size={16} /> Back to Dashboard
                    </button>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase">{subject.code}</span>
                                <span className="text-gray-400 font-bold">•</span>
                                <span className="text-gray-500 font-bold text-sm uppercase tracking-widest">{subject.credits} Credits</span>
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 leading-tight">{subject.name}</h2>
                            <p className="text-gray-600 font-medium max-w-2xl leading-relaxed">{subject.description}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 min-w-[280px]">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 font-bold uppercase">Exam Pattern</span>
                                <span className="text-gray-900 font-black">{subject.exam_pattern}</span>
                            </div>
                            <div className="h-px bg-gray-100 italic font-medium text-xs text-gray-400 text-center">Marks Distribution</div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <div className="text-center flex-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Part A</p>
                                    <p className="text-lg font-black text-indigo-600">30</p>
                                </div>
                                <div className="w-px h-8 bg-gray-200"></div>
                                <div className="text-center flex-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Part B</p>
                                    <p className="text-lg font-black text-indigo-600">70</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 px-8 sticky top-0 bg-white z-10">
                <div className="max-w-6xl mx-auto flex gap-8">
                    <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BookOpen size={18} />} label="Modules" />
                    <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<FileText size={18} />} label="University Notes" />
                    <TabButton active={activeTab === 'tutor'} onClick={() => setActiveTab('tutor')} icon={<MessageSquare size={18} />} label="AI Tutor" />
                    <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} icon={<BarChart3 size={18} />} label="PYQ Intelligence" />
                    <TabButton active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon={<Download size={18} />} label="Downloads" />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white">
                <div className="max-w-6xl mx-auto p-8 lg:p-12">
                    {activeTab === 'overview' && <ModulesTab modules={subject.modules} />}
                    {activeTab === 'notes' && <NotesTab subjectId={subjectId} />}
                    {activeTab === 'tutor' && <TutorTab subjectId={subjectId} />}
                    {activeTab === 'analysis' && <AnalysisTab analysis={analysis} />}
                    {activeTab === 'resources' && <ResourcesTab />}
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`py-5 flex items-center gap-2 border-b-4 transition-all text-sm font-bold uppercase tracking-widest ${active ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
            {icon}
            {label}
        </button>
    );
}

function ModulesTab({ modules }) {
    return (
        <div className="space-y-10">
            {modules.sort((a, b) => a.module_number - b.module_number).map((mod) => (
                <div key={mod.id} className="group">
                    <div className="flex items-start gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xl shadow-sm">
                                {mod.module_number}
                            </div>
                            <div className="w-0.5 h-full bg-indigo-50 group-last:hidden"></div>
                        </div>
                        <div className="flex-1 space-y-6 pb-12">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">{mod.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{mod.content_summary}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ContentBox title="Important Definitions" bg="bg-emerald-50" border="border-emerald-100" text="text-emerald-800" items={mod.important_definitions} />
                                <ContentBox title="Theory & Derivations" bg="bg-blue-50" border="border-blue-100" text="text-blue-800" items={[...mod.frequent_theory, ...mod.important_derivations]} />
                                <ContentBox title="Diagrams Required" bg="bg-amber-50" border="border-amber-100" text="text-amber-800" items={mod.diagram_refs} />
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 border-dashed flex items-center justify-center text-gray-400 font-bold text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                                    <Download size={20} className="mr-2" /> Download Module Notes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ContentBox({ title, bg, border, text, items }) {
    if (!items || items.length === 0) return null;
    return (
        <div className={`${bg} ${border} border p-5 rounded-2xl`}>
            <h4 className={`text-xs font-black uppercase tracking-widest ${text} mb-3 opacity-60`}>{title}</h4>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className={`text-sm font-bold flex items-start gap-2 ${text}`}>
                        <span className="mt-1 opacity-50 shrink-0">•</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TutorTab({ subjectId }) {
    return (
        <div className="h-[600px] border border-gray-200 rounded-3xl overflow-hidden shadow-2xl">
            <ChatInterface subjectId={subjectId} />
        </div>
    );
}

function AnalysisTab({ analysis }) {
    if (!analysis) return null;
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Target className="text-rose-500" size={16} /> Frequency Heatmap
                        </h4>
                        <div className="space-y-4">
                            {Object.entries(analysis.frequency_heatmap).map(([mod, count]) => (
                                <div key={mod} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold uppercase">
                                        <span>{mod}</span>
                                        <span className="text-indigo-600">{count} Questions</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${(count / analysis.total_analyzed_questions) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-lg">
                        <h4 className="font-bold flex items-center gap-2 mb-4">
                            <BrainCircuit size={20} className="text-indigo-300" /> S-Grade Strategy
                        </h4>
                        <p className="text-sm font-medium leading-relaxed text-indigo-100 mb-6">
                            Historical data suggests {analysis.s_grade_strategy.high_frequency_modules.map(m => `Module ${m[0]}`).join(' and ')} are crucial.
                        </p>
                        <div className="bg-white/10 p-4 rounded-xl text-xs font-bold">
                            💡 {analysis.s_grade_strategy.time_allocation_tip}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gray-900 rounded-3xl p-10 text-emerald-400 font-mono text-sm overflow-hidden relative group">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-indigo-400 font-black flex items-center gap-2 uppercase tracking-widest text-xs">
                            Expected 5 Questions for Upcoming Exam
                        </h4>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed opacity-90">
                        {analysis.most_expected_5}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Frequently Recurring Questions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.recurring_questions.map((q, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium text-gray-700 flex items-start gap-3">
                            <div className="bg-indigo-100 text-indigo-700 h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</div>
                            {q}
                        </div>
                    ))}
                    {analysis.recurring_questions.length === 0 && <p className="text-gray-400">No recurring questions detected in recent papers.</p>}
                </div>
            </div>
        </div>
    );
}

function ResourcesTab() {
    return (
        <div className="space-y-8">
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start gap-4">
                <Info className="text-amber-500 shrink-0" size={24} />
                <p className="text-sm font-medium text-amber-800">
                    Official PYQs from 2019 Scheme are prioritised. Our indexing system tags each question by year, module, and question type (Part A/B).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[2023, 2022, 2021, 2020].map(year => (
                    <div key={year} className="bg-white border border-gray-200 p-6 rounded-2xl flex items-center justify-between group hover:border-indigo-600 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-100 p-3 rounded-xl text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900">{year} University Paper</h5>
                                <p className="text-xs font-medium text-gray-400 tracking-widest uppercase">Full Paper • Solution Key Incl.</p>
                            </div>
                        </div>
                        <Download className="text-gray-400 group-hover:text-indigo-600 cursor-pointer" size={20} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function NotesTab({ subjectId }) {
    const [notes, setNotes] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);

    const fetchNotes = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/v1/notes/subjects/${subjectId}`);
            if (!res.ok) {
                console.warn("Notes not found or error. Setting empty list.");
                setNotes([]);
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setNotes(data);
                if (data.length > 0 && !selectedModule) {
                    setSelectedModule(data[0]);
                }
            } else {
                setNotes([]);
            }
        } catch {
            console.error("Error fetching notes");
            setNotes([]);
        }
    };

    useEffect(() => {
        fetchNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectId]);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            await fetch(`http://localhost:8000/api/v1/notes/subjects/${subjectId}/generate`, { method: 'POST' });
            alert("Notes generation started in background. Please refresh in a few minutes.");
        } catch {
            alert("Failed to start generation.");
        } finally {
            setGenerating(false);
        }
    };

    const handleDownloadPdf = () => {
        window.open(`http://localhost:8000/api/v1/notes/subjects/${subjectId}/download`, '_blank');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-indigo-900">University-Grade Study Notes</h3>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Strictly KTU Syllabus Aligned • Exam-Oriented</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-white text-indigo-600 border-2 border-indigo-200 px-5 py-2.5 rounded-xl font-bold text-sm hover:border-indigo-600 transition-all disabled:opacity-50"
                    >
                        {generating ? "Generating..." : "Generate/Update Notes"}
                    </button>
                    {notes.length > 0 && (
                        <button
                            onClick={handleDownloadPdf}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                        >
                            <Download size={16} /> Download Full PDF
                        </button>
                    )}
                </div>
            </div>

            {notes.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <FileText className="text-gray-300" size={40} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">No Notes Generated Yet</h4>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">Generate professional, long-form academic notes based on the official KTU syllabus for this subject.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Module Navigation */}
                    <div className="lg:col-span-1 space-y-2">
                        {notes.sort((a, b) => (a.module_id > b.module_id ? 1 : -1)).map((note, i) => (
                            <button
                                key={note.id}
                                onClick={() => setSelectedModule(note)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 ${selectedModule?.id === note.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 font-medium'}`}
                            >
                                <span className={`text-[10px] font-black h-5 w-5 rounded flex items-center justify-center shrink-0 ${selectedModule?.id === note.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                                    {i + 1}
                                </span>
                                <span className="text-xs font-black uppercase tracking-tight truncate">Module {i + 1}</span>
                            </button>
                        ))}
                    </div>

                    {/* Module Content Viewer */}
                    <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-sm space-y-10 min-h-[800px]">
                        {selectedModule && (
                            <>
                                <div className="border-b pb-8 space-y-4">
                                    <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                        {selectedModule.content.introduction.split('.')[0]}.
                                    </h2>
                                    <div className="flex gap-4">
                                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-emerald-100">KTU Verified</span>
                                        <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-gray-200">v{selectedModule.version}.0</span>
                                    </div>
                                </div>

                                <NoteSection title="1. Introduction & Background" content={selectedModule.content.introduction} />
                                <NoteSection title="2. Core Conceptual Framework" content={selectedModule.content.core_concepts} />
                                <NoteSection title="3. Mathematical Derivations & Algorithms" content={selectedModule.content.derivations_algorithms} />

                                <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl space-y-4">
                                    <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
                                        <BrainCircuit size={18} /> 4. Exam Diagram Guide
                                    </h4>
                                    <p className="text-sm text-amber-800 font-medium leading-relaxed">{selectedModule.content.diagrams_guide}</p>
                                </div>

                                <NoteSection title="5. Comprehensive Worked Examples" content={selectedModule.content.worked_examples} />

                                <div className="space-y-6">
                                    <h4 className="text-lg font-black text-gray-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">6. Structured Exam Answers</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                            <h5 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Part A - 5 Mark Short Answers</h5>
                                            <div className="text-sm text-gray-700 font-bold whitespace-pre-line leading-loose">{selectedModule.content.short_answers}</div>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                            <h5 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Part B - 15 Mark Long Answers</h5>
                                            <div className="text-sm text-gray-700 font-bold whitespace-pre-line leading-loose">{selectedModule.content.long_answers}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl space-y-4">
                                    <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest flex items-center gap-2">
                                        <AlertCircle size={18} /> 8. Common Exam Mistakes
                                    </h4>
                                    <p className="text-sm text-rose-800 font-bold leading-relaxed">{selectedModule.content.mistakes_to_avoid}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function NoteSection({ title, content }) {
    if (!content || content === 'N/A') return null;
    return (
        <div className="space-y-4">
            <h4 className="text-lg font-black text-gray-900 border-l-4 border-gray-200 pl-4 uppercase tracking-tighter">{title}</h4>
            <div className="text-base text-gray-600 font-medium leading-loose whitespace-pre-line">
                {content}
            </div>
        </div>
    );
}
