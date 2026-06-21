'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Search, Filter } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get('/payments');
        setPayments(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Payment Transactions</h2>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-500 text-xs uppercase">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((p: any) => (
              <tr key={p._id}>
                <td className="px-6 py-4 font-mono text-xs">{p.razorpayOrderId}</td>
                <td className="px-6 py-4">
                  <p className="font-bold">{p.user?.name}</p>
                  <p className="text-xs text-gray-500">{p.user?.email}</p>
                </td>
                <td className="px-6 py-4 capitalize">{p.productType}</td>
                <td className="px-6 py-4 font-bold">₹{p.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
