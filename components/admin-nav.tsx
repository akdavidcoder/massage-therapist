'use client';

// components/admin-nav.tsx
import Link from "next/link";
import { useState, useEffect } from "react";
import LogoutMenuItem from "@/components/LogoutMenuItem";
import { 
  BarChart3, 
  Calendar, 
  Users, 
  UserCheck, 
  Sparkles, 
  CreditCard, 
  Settings, 
  X,
  Menu
} from "lucide-react";

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => setIsOpen(false);
  const handleToggle = () => setIsOpen(!isOpen);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div>Loading...</div>
    );
  }
  return (
    <>
      {/* Mobile header with toggle button */}
      <header className="lg:hidden bg-white shadow-sm border-b p-4 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between">
          <button
            onClick={handleToggle}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleClose}
        />
      )}
      
      {/* Sidebar */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gray-800 text-white min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            {/* Close button for mobile */}
            <button 
              onClick={handleClose}
              className="lg:hidden p-2 hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <ul className="py-2">
          <li>
            <Link 
              href="/admin" 
              className="flex items-center px-4 py-2 hover:bg-gray-700"
              onClick={handleClose}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/bookings" 
              className="flex items-center px-4 py-2 hover:bg-gray-700"
              onClick={handleClose}
            >
              <Calendar className="w-5 h-5 mr-3" />
              Bookings
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/clients" 
              className="flex items-center px-4 py-2 hover:bg-gray-700"
              onClick={handleClose}
            >
              <Users className="w-5 h-5 mr-3" />
              Clients
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/therapists" 
              className="flex items-center px-4 py-2 hover:bg-gray-700"
              onClick={handleClose}
            >
              <UserCheck className="w-5 h-5 mr-3" />
              Therapists
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/services" 
              className="flex items-center px-4 py-2 hover:bg-gray-700"
              onClick={handleClose}
            >
              <Sparkles className="w-5 h-5 mr-3" />
              Services
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/payments" 
              className="flex items-center px-4 py-2 hover:bg-gray-700"
              onClick={handleClose}
            >
              <CreditCard className="w-5 h-5 mr-3" />
              Payments
            </Link>
          </li>
        </ul>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
          <LogoutMenuItem />
        </div>
      </nav>
    </>
  );
}
