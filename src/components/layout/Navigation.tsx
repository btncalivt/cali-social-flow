
import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Calendar, Trello, ListTodo, 
  Share2, PlusCircle, X 
} from 'lucide-react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation = ({ isOpen, onClose }: NavigationProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen, onClose]);
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="mr-2 h-5 w-5" /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar className="mr-2 h-5 w-5" /> },
    { name: 'Board', path: '/board', icon: <Trello className="mr-2 h-5 w-5" /> },
    { name: 'Tasks', path: '/tasks', icon: <ListTodo className="mr-2 h-5 w-5" /> },
    { name: 'Accounts', path: '/accounts', icon: <Share2 className="mr-2 h-5 w-5" /> },
  ];
  
  // Desktop sidebar
  if (!isMobile) {
    return (
      <aside className="w-64 border-r bg-white p-4 flex flex-col h-screen">
        <div className="mb-6 flex items-center justify-center">
          <h1 className="text-xl font-bold">
            <span className="text-cali-blue">BTN</span> Cali Social
          </h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>
                  <Button 
                    variant={location.pathname === item.path ? "default" : "ghost"} 
                    className="w-full justify-start"
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Create New */}
        <div className="mt-auto pt-4">
          <Button className="w-full gap-2">
            <PlusCircle className="h-5 w-5" />
            Create New
          </Button>
        </div>
      </aside>
    );
  }
  
  // Mobile sidebar (drawer)
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      
      <div 
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-50 h-full w-[270px] bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">
            <span className="text-cali-blue">BTN</span> Cali Social
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} onClick={onClose}>
                  <Button 
                    variant={location.pathname === item.path ? "default" : "ghost"} 
                    className="w-full justify-start"
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Create New - Mobile */}
          <div className="mt-6">
            <Button className="w-full gap-2">
              <PlusCircle className="h-5 w-5" />
              Create New
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navigation;
