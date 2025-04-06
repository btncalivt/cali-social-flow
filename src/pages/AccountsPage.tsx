
import SocialAccountsList from "@/components/accounts/SocialAccountsList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AccountsPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
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
