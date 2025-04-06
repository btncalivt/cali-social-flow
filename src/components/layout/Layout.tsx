
import { useState } from 'react';
import Navigation from './Navigation';
import MobileHeader from './MobileHeader';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobileHeader onMenuToggle={() => setShowSidebar(!showSidebar)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Navigation isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
        
        <main className={`flex-1 overflow-auto transition-all duration-300 
          ${isMobile ? 'p-4' : 'p-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
