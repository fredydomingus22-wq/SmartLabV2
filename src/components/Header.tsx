import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex-1">
        {/* Plant Selector could go here */}
        <h1 className="text-lg font-semibold">Plant A</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* User Name */}
        <span className="text-sm font-medium">Domingos Cambongo</span>
        {/* Notifications Button */}
        <button className="p-2 rounded-full hover:bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
