'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';

interface Stats {
  revenue: number;
  students: number;
  courses: number;
  pdfs: number;
  orders: number;
  recentPayments: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="text-black font-bold text-xl">Loading Stats...</div>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.revenue}`} icon={<DollarSign className="text-green-600"/>} bg="bg-green-50" />
        <StatCard title="Total Students" value={stats.students} icon={<Users className="text-blue-600"/>} bg="bg-blue-50" />
        <StatCard title="Total Courses" value={stats.courses} icon={<BookOpen className="text-purple-600"/>} bg="bg-purple-50" />
        <StatCard title="Total PDFs" value={stats.pdfs} icon={<FileText className="text-orange-600"/>} bg="bg-orange-50" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600"/> Recent Payments
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-800 font-bold uppercase text-xs">
                <th className="pb-4">Student</th>
                <th className="pb-4">Product</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentPayments.map((payment: any) => (
                <tr key={payment._id}>
                  <td className="py-4">
                    <p className="font-medium">{payment.user?.name}</p>
                    <p className="text-xs text-gray-700 font-medium">{payment.user?.email}</p>
                  </td>
                  <td className="py-4 capitalize">{payment.productType}</td>
                  <td className="py-4 font-bold text-blue-600">₹{payment.amount}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-800 font-medium text-sm">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg }: any) {
  return (
    <div className={`p-6 rounded-2xl border ${bg} flex items-center justify-between`}>
      <div>
        <p className="text-gray-900 font-semibold text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-black">{value}</h3>
      </div>
      <div className="p-3 bg-white rounded-xl shadow-sm">
        {icon}
      </div>
    </div>
  );
}
