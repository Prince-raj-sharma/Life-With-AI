'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Play, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourse();
  }, [id]);

  const handleBuy = async () => {
    if (!user) return router.push('/login');
    
    try {
      const { data: order } = await api.post('/payments/create-order', {
        amount: course.discountPrice || course.price,
        productId: course._id,
        productType: 'course'
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LIFE WITH AI",
        description: `Purchase ${course.title}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', response);
            toast.success('Course unlocked!');
            router.push(`/courses/${id}/player`);
          } catch (err) {
            toast.error('Verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    }
  };

  if (!course) return <div className="p-10">Loading...</div>;

  const isPurchased = user?.purchasedCourses.includes(course._id as string);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-gray-400 mb-6">{course.subtitle}</p>
            <div className="flex gap-4 items-center">
              <span className="bg-blue-600 px-3 py-1 rounded text-sm">{course.category}</span>
              <span className="text-gray-400">{course.studentsEnrolled} students enrolled</span>
            </div>
          </div>
          <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl">
            <img src={course.thumbnail} alt="" className="w-full h-48 object-cover rounded-xl mb-6" />
            <div className="text-3xl font-bold mb-6">₹{course.price}</div>
            {isPurchased ? (
              <button 
                onClick={() => router.push(`/courses/${id}/player`)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold"
              >
                Go to Course
              </button>
            ) : (
              <button 
                onClick={handleBuy}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
              >
                Buy Now
              </button>
            )}
            <p className="text-xs text-gray-500 text-center mt-4 italic">30-Day Money-Back Guarantee</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Course Description</h2>
          <div className="bg-white p-8 rounded-2xl border mb-12 prose max-w-none">
            {course.description}
          </div>

          <h2 className="text-2xl font-bold mb-6">Curriculum</h2>
          <div className="space-y-4">
            {course.modules.map((module: any) => (
              <div key={module._id} className="bg-white border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b font-bold">
                  {module.title}
                </div>
                <div className="divide-y">
                  {module.lessons.map((lesson: any) => (
                    <div key={lesson._id} className="px-6 py-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Play size={16} className="text-gray-400" />
                        <span>{lesson.title}</span>
                      </div>
                      {lesson.isPreview ? (
                        <span className="text-blue-600 text-sm font-medium cursor-pointer">Preview</span>
                      ) : (
                        <Lock size={16} className="text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
