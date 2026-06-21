'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    discountPrice: 0,
    category: '',
    thumbnail: '',
    status: 'draft'
  });

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/courses', formData);
      toast.success('Course created successfully');
      setShowModal(false);
      fetchCourses();
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/courses/${id}`);
        toast.success('Course deleted');
        fetchCourses();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Manage Courses</h2>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} /> Create Course
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-500 text-xs uppercase">
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {courses.map((course: any) => (
              <tr key={course._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={course.thumbnail} alt="" className="w-12 h-12 rounded object-cover" />
                    <div>
                      <p className="font-bold">{course.title}</p>
                      <p className="text-xs text-gray-500">{course.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">₹{course.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 text-gray-400">
                    <Link href={`/admin/courses/${course._id}/curriculum`} className="hover:text-blue-600" title="Manage Curriculum"><BookOpen size={18} /></Link>
                    <button className="hover:text-blue-600"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(course._id)} className="hover:text-red-600"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Create New Course</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input required className="w-full border rounded-lg px-4 py-2" onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Subtitle</label>
                <input className="w-full border rounded-lg px-4 py-2" onChange={(e) => setFormData({...formData, subtitle: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea required className="w-full border rounded-lg px-4 py-2 h-32" onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Price (INR)</label>
                  <input type="number" required className="w-full border rounded-lg px-4 py-2" onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <input className="w-full border rounded-lg px-4 py-2" onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Thumbnail URL</label>
                <input className="w-full border rounded-lg px-4 py-2" placeholder="Paste Cloudinary URL" onChange={(e) => setFormData({...formData, thumbnail: e.target.value})} />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
