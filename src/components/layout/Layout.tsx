import type { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  onClearData?: () => void;
  hasData: boolean;
}

export function Layout({ children, onClearData, hasData }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onClearData={onClearData} hasData={hasData} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
