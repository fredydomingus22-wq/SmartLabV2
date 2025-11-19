// components/Topbar.tsx
import React from 'react';

const Topbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div>
        {/* Planta selecionada pode vir aqui */}
      </div>
      <div className="flex items-center">
        <div className="mr-4">
            {/* Botão de notificações */}
        </div>
        <div>
          <span className="text-gray-800 dark:text-white">Nome do Utilizador</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
