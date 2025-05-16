
import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useRole } from '@/context/RoleContext';
import { cn } from '@/lib/utils';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, showSidebar = true }) => {
  const { connected } = useSolanaWallet();
  const { role } = useRole();

  return (
    <div className="min-h-screen bg-white bg-gradient-to-t from-[#fff5e0] to-[#f8e5ff]">
      <div className="flex justify-center py-4 px-4 sm:px-6 lg:px-8">
        <Header />
      </div>
      
      <div className="flex flex-1">
        {connected && showSidebar && (
          <div className={cn("transition-all duration-300", 
            role ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          )}>
            <Sidebar />
          </div>
        )}
        
        <main className={cn(
          "flex-1 w-full transition-all duration-300",
          connected && showSidebar && role ? "pl-0 md:pl-4" : "pl-0"
        )}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
