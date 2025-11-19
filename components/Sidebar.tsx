// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">SMARTLIMS</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link href="/" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 dark:text-gray-200 dark:bg-gray-700 rounded-md">
            Dashboard
        </Link>
        <Link href="/lab" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 rounded-md">
            Laboratório & Amostras
        </Link>
        {/* Adicionar outros links de navegação aqui */}
      </nav>
    </div>
  );
};

export default Sidebar;
