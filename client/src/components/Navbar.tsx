'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            LIFE WITH AI
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/courses" className="text-gray-700 hover:text-blue-600">Courses</Link>
            <Link href="/pdf-store" className="text-gray-700 hover:text-blue-600">PDF Store</Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600">Admin Panel</Link>
                )}
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                  <User size={18} /> Dashboard
                </Link>
                <button onClick={logout} className="text-gray-700 hover:text-red-600 flex items-center gap-1">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
