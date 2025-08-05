'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutMenuItem() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 disabled:opacity-50"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
