'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubjectOverview from '@/components/academic/SubjectOverview';
import ModuleTimeline from '@/components/academic/ModuleTimeline';
import SGradeStrategy from '@/components/academic/SGradeStrategy';
import AITutorChat from '@/components/ai/AITutorChat';
import { academicService } from '@/services/api';
import { Subject, Module } from '@/types';

export default function Home() {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const subjectsRes = await academicService.getSubjects();
        if (subjectsRes.data.length > 0) {
          const firstSubject = subjectsRes.data[0];
          setSubject(firstSubject);

          // Fetch modules for this subject
          const modulesRes = await academicService.getModules(firstSubject.id);
          setModules(modulesRes.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium font-mono animate-pulse">Initializing KTU Intelligence...</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Banner Section */}
        {subject ? (
          <SubjectOverview
            code={subject.code}
            name={subject.name}
            credits={subject.credits}
            pattern={subject.exam_pattern || "3-0-0"}
          />
        ) : (
          <div className="p-12 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl text-center">
            <p className="text-gray-500">No subjects initialized. Please ingest data via Admin panel.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <ModuleTimeline modules={modules.length > 0 ? modules : []} />
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <SGradeStrategy />

            <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Exam Prep</h3>
              <div className="space-y-3">
                <a href="/exam" className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all font-medium">
                  <span>Practice Quiz</span>
                  <span className="text-xs text-blue-600">Start</span>
                </a>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all font-medium">
                  <span>Previous Year Papers</span>
                  <span className="text-xs text-gray-400">Locked</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {subject && <AITutorChat subjectId={subject.id} />}
    </DashboardLayout>
  );
}
