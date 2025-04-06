
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  // Redirect to dashboard
  useEffect(() => {
    navigate('/');
  }, [navigate]);

  // This is a fallback if the redirect doesn't happen
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-cali-blue">BTN</span> Cali Social Flow
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          All-in-one social media management for BTN Cali Official
        </p>
        <div className="animate-pulse text-muted-foreground">
          Loading dashboard...
        </div>
      </div>
    </div>
  );
};

export default Index;
