import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Rule } from '@/lib/rules';

interface LayoutProps {
  children: ReactNode;
  rules?: Rule[];
  currentId?: string;
  activeCategory?: 'common' | 'cpp';
}

export default function Layout({
  children,
  rules = [],
  currentId,
  activeCategory
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          features={rules}
          currentId={currentId}
          activeCategory={activeCategory}
        />
        
        {/* Added ml-64 to add margin equal to sidebar width */}
        <main className="flex-1 overflow-auto p-6 bg-white shadow-sm ml-64">
          <div className="container mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}