import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlayCircle, Award, BookOpen, Clock, Users } from 'lucide-react';

const CoursesDashboard = ({ onOpenCourse }) => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000"; // Mock for now

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Read user's chosen semester from onboarding info
                const savedConfig = localStorage.getItem('ktu_student_setup');
                const studentSettings = savedConfig ? JSON.parse(savedConfig) : { semester: 6 };

                // Fetch all courses (represented as subjects in A1) filtering by the selected semester and branch
                const subjectsRes = await axios.get(`http://localhost:8000/api/v1/academics/subjects?semester=${studentSettings.semester}&branch=${studentSettings.branch}`).catch(() => ({ data: [] }));

                // Fetch user enrollments from new Coursera-style route
                const enrollsRes = await axios.get(`http://localhost:8000/api/v1/coursera/enrollments?user_id=${MOCK_USER_ID}`).catch(() => ({ data: [] }));

                const realCourses = (subjectsRes.data || []).map(subj => {
                    const enrollment = (enrollsRes.data || []).find(e => e.subject_id === subj.id);
                    return {
                        id: subj.id,
                        title: subj.name,
                        instructor: 'A1 Engine AI',
                        rating: 4.8,
                        students: 'Active',
                        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80',
                        originalPrice: 'Included',
                        isEnrolled: !!enrollment,
                        progress: enrollment ? Math.floor(enrollment.progress_percentage) : 0
                    };
                });

                // Mock data to ensure a great UI if the local DB is empty
                const mockCourses = [
                    { id: '1', title: 'Machine Learning Specialization', instructor: 'Andrew Ng', rating: 4.9, students: '1.2m', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&q=80', originalPrice: '$49', isEnrolled: true, progress: 45 },
                    { id: '2', title: 'Full-Stack Web Development', instructor: 'Angela Yu', rating: 4.8, students: '850k', image: 'https://images.unsplash.com/photo-1627398240306-2292b462719d?w=500&q=80', originalPrice: '$89', isEnrolled: false, progress: 0 },
                    { id: '3', title: 'Data Science with Python', instructor: 'Jose Portilla', rating: 4.7, students: '600k', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80', originalPrice: '$59', isEnrolled: true, progress: 12 },
                    { id: '4', title: 'Advanced Cloud Computing architectures', instructor: 'IBM', rating: 4.6, students: '320k', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80', originalPrice: '$199', isEnrolled: false, progress: 0 },
                ];

                const combinedCourses = [...realCourses, ...mockCourses];

                setEnrolledCourses(combinedCourses.filter(c => c.isEnrolled));
                setAllCourses(combinedCourses);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load courses", error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading your learning dashboard...</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            {/* IN PROGRESS COURSES */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="text-indigo-600" />
                    Continue Learning
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map(course => (
                        <div key={course.id} onClick={() => onOpenCourse(course.id)} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col">
                            <div className="h-40 overflow-hidden relative">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle size={48} className="text-white drop-shadow-md" />
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{course.instructor}</p>
                                <div className="mt-auto">
                                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                                        <span>Progress</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CATALOG */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="text-indigo-600" />
                            Recommended for You
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Based on your recent activity and degree program.</p>
                    </div>
                    <button className="text-indigo-600 font-semibold text-sm hover:underline">View All</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {allCourses.filter(c => !c.isEnrolled).map(course => (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col">
                            <div className="h-36 overflow-hidden">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{course.title}</h3>
                                <p className="text-xs text-gray-500 mb-2">{course.instructor}</p>
                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold mb-3">
                                    <span>★ {course.rating}</span>
                                    <span className="text-gray-400 font-normal">({course.students})</span>
                                </div>
                                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">{course.originalPrice}</span>
                                    <button className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CoursesDashboard;
