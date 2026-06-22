'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Trash2, Video, GripVertical } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ManageCurriculum() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  
  const [moduleTitle, setModuleTitle] = useState('');
  const [lessonData, setLessonData] = useState({ title: '', description: '', videoUrl: '', isPreview: false });

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const addModule = async () => {
    try {
      await api.post('/courses/module', { title: moduleTitle, courseId: id });
      setModuleTitle('');
      setShowModuleModal(false);
      fetchCourse();
      toast.success('Module added');
    } catch (err) {
      toast.error('Failed to add module');
    }
  };

  const addLesson = async () => {
    try {
      await api.post('/courses/lesson', { ...lessonData, moduleId: selectedModule });
      setLessonData({ title: '', description: '', videoUrl: '', isPreview: false });
      setShowLessonModal(false);
      fetchCourse();
      toast.success('Lesson added');
    } catch (err) {
      toast.error('Failed to add lesson');
    }
  };

  const deleteModule = async (moduleId: string) => {
    if(confirm('Delete module and all lessons?')) {
        await api.delete(`/courses/module/${moduleId}`);
        fetchCourse();
    }
  };
  const deleteLesson = async (lessonId: string) => {
    if (confirm('Delete this lesson?')) {
      try {
        await api.delete(`/courses/lesson/${lessonId}`);
        fetchCourse();
        toast.success('Lesson deleted');
      } catch (error) {
        toast.error('Failed to delete lesson');
      }
    }
  };

  if (!course) return <div className="p-10">Loading Curriculum...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">{course.title}</h2>
          <p className="text-gray-500 text-lg">Manage Modules & Lessons</p>
        </div>
        <button 
            onClick={() => setShowModuleModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
        >
          <Plus size={20} /> Add Module
        </button>
      </div>

      <div className="space-y-6">
        {course.modules.map((module: any) => (
          <div key={module._id} className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
              <div className="flex items-center gap-3">
                <GripVertical className="text-gray-400" />
                <h3 className="font-bold text-lg">{module.title}</h3>
              </div>
              <div className="flex gap-2">
                <button 
                    onClick={() => { setSelectedModule(module._id); setShowLessonModal(true); }}
                    className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg text-sm font-bold"
                >
                    + Lesson
                </button>
                <button onClick={() => deleteModule(module._id)} className="text-red-600 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
              </div>
            </div>
            <div className="divide-y">
              {module.lessons.map((lesson: any) => (
                <div key={lesson._id} className="px-8 py-4 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Video size={18} className="text-blue-600" />
                    <div>
                        <p className="font-medium">{lesson.title}</p>
                        {lesson.isPreview && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Free Preview</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteLesson(lesson._id)}
                    className="text-gray-400 hover:text-red-600">

                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modals for Add Module / Add Lesson */}
      {showModuleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 w-full max-w-md">
                  <h4 className="text-xl font-bold mb-4">Add New Module</h4>
                  <input className="w-full border rounded-xl px-4 py-3 mb-6" placeholder="Module Title (e.g. Introduction to AI)" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowModuleModal(false)} className="px-6 py-2 border rounded-xl">Cancel</button>
                      <button onClick={addModule} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Save Module</button>
                  </div>
              </div>
          </div>
      )}

      {showLessonModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
                  <h4 className="text-xl font-bold mb-4">Add Lesson</h4>
                  <div className="space-y-4">
                    <input className="w-full border rounded-xl px-4 py-3" placeholder="Lesson Title" value={lessonData.title} onChange={(e) => setLessonData({...lessonData, title: e.target.value})} />
                    <textarea className="w-full border rounded-xl px-4 py-3" placeholder="Description" value={lessonData.description} onChange={(e) => setLessonData({...lessonData, description: e.target.value})} />
                    <input className="w-full border rounded-xl px-4 py-3" placeholder="Cloudinary Video URL" value={lessonData.videoUrl} onChange={(e) => setLessonData({...lessonData, videoUrl: e.target.value})} />
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={lessonData.isPreview} onChange={(e) => setLessonData({...lessonData, isPreview: e.target.checked})} />
                        <span className="text-sm">Set as Free Preview</span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                      <button onClick={() => setShowLessonModal(false)} className="px-6 py-2 border rounded-xl">Cancel</button>
                      <button onClick={addLesson} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Save Lesson</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
