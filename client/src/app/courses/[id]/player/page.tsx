'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Play, CheckCircle, ChevronRight, Menu, X } from 'lucide-react';

export default function CoursePlayer() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        const isPurchased = user?.purchasedCourses.includes(id as string);
        if (!isPurchased && user?.role !== 'admin') {
           router.push(`/courses/${id}`);
           return;
        }
        setCourse(data);
        if (data.modules[0]?.lessons[0]) {
          setActiveLesson(data.modules[0].lessons[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (user) fetchCourse();
  }, [id, user]);

  if (!course || !activeLesson) return <div className="p-10 text-center">Loading Course Content...</div>;

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-gray-800 transition-all duration-300 flex flex-col border-r border-gray-700`}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-bold truncate">{course.title}</h2>
          <button onClick={() => setSidebarOpen(false)}><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {course.modules.map((module: any) => (
            <div key={module._id}>
              <div className="px-6 py-3 bg-gray-900 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-700">
                {module.title}
              </div>
              <div className="divide-y divide-gray-700">
                {module.lessons.map((lesson: any) => (
                  <button
                    key={lesson._id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full text-left px-6 py-4 flex items-center gap-3 hover:bg-gray-700 transition ${activeLesson._id === lesson._id ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                  >
                    <Play size={14} />
                    <span className="text-sm font-medium">{lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Player */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-700 flex items-center px-6 gap-4">
          {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg"><Menu size={20}/></button>}
          <h1 className="font-semibold">{activeLesson.title}</h1>
        </header>
        
        <div className="flex-1 bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-5xl aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-2xl relative group">
                {/* Cloudinary Video Player (Standard Video Tag) */}
                <video 
                    key={activeLesson.videoUrl}
                    controls 
                    className="w-full h-full"
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <source src={activeLesson.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>

        <div className="p-8 bg-gray-800 max-h-60 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">About this lesson</h2>
            <p className="text-gray-400 leading-relaxed">{activeLesson.description}</p>
        </div>
      </main>
    </div>
  );
}
