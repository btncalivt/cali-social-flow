
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

const MobileHeader = ({ onMenuToggle }: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white border-b p-4 md:hidden">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onMenuToggle}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center justify-center flex-1">
        <h1 className="text-xl font-bold text-gray-900">
          <span className="text-cali-blue">BTN</span> Cali Social
        </h1>
      </div>
      <div className="w-10"></div> {/* Spacer to center title */}
    </header>
  );
};

export default MobileHeader;
