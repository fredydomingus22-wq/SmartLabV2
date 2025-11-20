import React from 'react';

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-64 flex-col border-r bg-background hidden sm:flex">
      <div className="flex h-16 items-center border-b px-6">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <span>SMARTLIMS 4.0</span>
        </a>
      </div>
      <nav className="flex flex-col gap-4 p-6 text-sm font-medium">
        {/* Navigation links will be added here */}
        <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Dashboard</a>
        <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Samples</a>
        <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">NC & CAPA</a>
        <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">HACCP</a>
      </nav>
    </aside>
  );
};

export default Sidebar;
