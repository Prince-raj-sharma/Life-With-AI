'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (id: string, isBlocked: boolean) => {
    try {
      await api.put(`/users/${id}`, { isBlocked: !isBlocked });
      toast.success(`User ${!isBlocked ? 'blocked' : 'unblocked'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">User Management</h2>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-500 text-xs uppercase">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u: any) => (
              <tr key={u._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={u.profilePhoto} className="w-8 h-8 rounded-full" alt=""/>
                    <div>
                        <p className="font-bold">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">{u.role}</td>
                <td className="px-6 py-4 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <button 
                        onClick={() => toggleBlock(u._id, u.isBlocked)}
                        className={`hover:text-red-600 ${u.isBlocked ? 'text-red-600' : 'text-gray-400'}`}
                        title={u.isBlocked ? 'Unblock' : 'Block'}
                    >
                      {u.isBlocked ? <ShieldCheck size={18}/> : <ShieldAlert size={18} />}
                    </button>
                    <button className="text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
