// components/FormLayout.tsx
import React from 'react';

interface FormLayoutProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const FormLayout: React.FC<FormLayoutProps> = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
    </form>
  );
};

export default FormLayout;
