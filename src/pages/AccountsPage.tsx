
import SocialAccountsList from "@/components/accounts/SocialAccountsList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AccountsPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">
      <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading...
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Social Media Accounts</h1>
      <SocialAccountsList />
    </div>
  );
};

export default AccountsPage;
