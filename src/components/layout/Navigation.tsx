
import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, Calendar, Trello, ListTodo, 
  Share2, PlusCircle, X, User, Settings, LogOut, Shield
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation = ({ isOpen, onClose }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, profile, isAdmin, signOut } = useAuth();
  
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

  const getUserInitials = () => {
    if (!profile?.full_name) return user?.email?.substring(0, 2).toUpperCase() || 'U';
    return profile.full_name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
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
        
        {/* User profile */}
        <div className="mb-6 px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-start gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || ''} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{profile?.full_name || user?.email}</span>
                  <span className="text-xs text-muted-foreground">{isAdmin ? 'Admin' : 'Team Member'}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        
        {/* User profile */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || ''} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{profile?.full_name || user?.email}</span>
              <span className="text-xs text-muted-foreground">{isAdmin ? 'Admin' : 'Team Member'}</span>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                navigate('/profile');
                onClose();
              }}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  navigate('/admin');
                  onClose();
                }}
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            )}
          </div>
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
          
          {/* Sign Out - Mobile */}
          <div className="mt-6 pt-6 border-t">
            <Button 
              variant="outline" 
              className="w-full gap-2 text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navigation;
