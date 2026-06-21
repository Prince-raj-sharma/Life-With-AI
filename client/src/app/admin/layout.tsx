'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users, 
  CreditCard, 
  Ticket, 
  Settings,
  ArrowLeft
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') return <div className="p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 py-4">
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <AdminNavLink href="/admin/courses" icon={<BookOpen size={20}/>} label="Courses" />
          <AdminNavLink href="/admin/pdf-store" icon={<FileText size={20}/>} label="PDF Store" />
          <AdminNavLink href="/admin/payments" icon={<CreditCard size={20}/>} label="Payments" />
          <AdminNavLink href="/admin/users" icon={<Users size={20}/>} label="Users" />
          <AdminNavLink href="/admin/coupons" icon={<Ticket size={20}/>} label="Coupons" />
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft size={18} /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b h-16 flex items-center px-8 justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Control Center</h1>
            <div className="flex items-center gap-4">
                <span className="text-gray-600">{user.email}</span>
            </div>
        </header>
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, label }: any) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
      {icon}
      <span>{label}</span>
    </Link>
  );
}
