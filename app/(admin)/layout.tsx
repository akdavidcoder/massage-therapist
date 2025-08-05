'use client';

// app/(admin)/layout.tsx
import type React from "react";
import { Inter } from "next/font/google";
import AdminNav from "@/components/admin-nav";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <AdminNav />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col lg:ml-0">
            {/* Page content - adjusted for mobile header */}
            <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-6">
              <div className="hidden lg:block mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, Admin</p>
              </div>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
