'use client';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { BookOpen, FileText, Settings, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const [fullUserData, setFullUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setFullUserData(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user) fetchUserData();
  }, [user]);

  if (loading || !user) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Card */}
          <aside className="md:w-1/3">
            <div className="bg-white rounded-2xl border p-8 text-center">
              <img src={user.profilePhoto || 'https://via.placeholder.com/150'} alt="" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-50" />
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="mt-8 space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <span className="flex items-center gap-3"><Settings size={18}/> Settings</span>
                    <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <span className="flex items-center gap-3"><Bell size={18}/> Notifications</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">3</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Dashboard */}
          <main className="md:flex-1 space-y-8">
            <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="text-blue-600" /> My Courses
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {fullUserData?.purchasedCourses?.length > 0 ? (
                        fullUserData.purchasedCourses.map((course: any) => (
                            <Link key={course._id} href={`/courses/${course._id}/player`}>
                                <div className="bg-white p-4 rounded-2xl border flex gap-4 hover:shadow-md transition">
                                    <img src={course.thumbnail} alt="" className="w-24 h-24 rounded-lg object-cover" />
                                    <div>
                                        <h4 className="font-bold mb-1">{course.title}</h4>
                                        <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
                                            <div className="bg-blue-600 h-full rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">45% Completed</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No courses purchased yet.</p>
                    )}
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="text-blue-600" /> My PDFs
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {fullUserData?.purchasedPDFs?.length > 0 ? (
                        fullUserData.purchasedPDFs.map((pdf: any) => (
                            <div key={pdf._id} className="bg-white p-4 rounded-2xl border flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><FileText /></div>
                                    <p className="font-bold">{pdf.title}</p>
                                </div>
                                <a href={pdf.pdfFile} target="_blank" className="text-blue-600 hover:underline font-bold text-sm">Download</a>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No PDFs purchased yet.</p>
                    )}
                </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
