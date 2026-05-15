import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        KTU Nexus
                    </h1>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    {[
                        { name: 'Dashboard', href: '/' },
                        { name: 'My Subjects', href: '#' },
                        { name: 'PYQ Hub', href: '#' },
                        { name: 'Mock Exams', href: '/exam' },
                        { name: 'S-Grade Strategy', href: '#' }
                    ].map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-semibold text-blue-600 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                            S6 CSE AIML
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-500" />
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
