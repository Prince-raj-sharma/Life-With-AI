'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">All Courses</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course: any) => (
            <Link key={course._id} href={`/courses/${course._id}`}>
              <div className="bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition group">
                <div className="relative h-48 overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{course.category}</span>
                  <h3 className="text-xl font-bold mt-2 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{course.subtitle}</p>
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
                    <span className="text-blue-600 font-bold text-sm">View Details →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
