
import { AppRole } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { roleOptions, roleLabelMap } from './RoleConfig';

interface EditRolesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoles: AppRole[];
  onRoleSelection: (role: AppRole) => void;
  onUpdateRoles: () => Promise<void>;
  isUpdating: boolean;
}

const EditRolesDialog = ({
  isOpen,
  onClose,
  selectedRoles,
  onRoleSelection,
  onUpdateRoles,
  isUpdating
}: EditRolesDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User Roles</DialogTitle>
          <DialogDescription>
            Select one or more roles for this user
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {roleOptions.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`edit-role-${role}`}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => onRoleSelection(role)}
                  />
                  <label
                    htmlFor={`edit-role-${role}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {roleLabelMap[role]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
            onClick={onUpdateRoles}
            disabled={isUpdating || selectedRoles.length === 0}
          >
            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRolesDialog;
