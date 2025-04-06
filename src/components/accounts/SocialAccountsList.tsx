
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  url: string;
  created_at: string;
  updated_at: string;
}

const SocialAccountsList = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('social_accounts')
          .select('*')
          .order('platform');

        if (error) throw error;
        setAccounts(data || []);
      } catch (error) {
        console.error('Error fetching social accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const platformColors: Record<string, string> = {
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    facebook: 'bg-blue-600',
    twitter: 'bg-blue-500',
    tiktok: 'bg-black',
    youtube: 'bg-red-600',
    pinterest: 'bg-red-500',
    threads: 'bg-black',
  };

  const platformIcons: Record<string, React.ReactNode> = {
    instagram: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.64c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.736-.9 10.125-5.864 10.125-11.854z" />
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
        <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    pinterest: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
        <path d="M12 0a12 12 0 0 0-4.373 23.194c-.035-.87-.006-1.912.217-2.852l1.58-6.7s-.395-.79-.395-1.96c0-1.833 1.065-3.2 2.395-3.2 1.11 0 1.654.84 1.654 1.84 0 1.128-.72 2.8-1.09 4.353-.31 1.312.656 2.38 1.948 2.38 2.34 0 3.92-3 3.92-6.56 0-2.71-1.83-4.74-5.154-4.74-3.754 0-6.1 2.8-6.1 5.93 0 1.08.32 1.84.82 2.42.23.28.26.39.18.71-.59.23-.2.8-.25 1.02-.08.3-.33.41-.607.3-1.69-.69-2.48-2.54-2.48-4.62 0-3.44 2.9-7.57 8.68-7.57 4.635 0 7.67 3.35 7.67 6.95 0 4.76-2.65 8.32-6.55 8.32-1.31 0-2.54-.71-2.97-1.52l-.8 3.1c-.29 1.05-1.08 2.372-1.61 3.177C10.1 23.87 11.04 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
    threads: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.043-8.184-3.042-1.852-2-2.883-4.895-3.066-8.61-.088-1.81-.019-3.29.206-4.405a9.437 9.437 0 0 1 1.543-3.569c.764-1.11 1.752-1.9 2.853-2.285 1.1-.386 2.34-.387 3.583-.004 1.243.384 2.54 1.168 3.793 2.33l-.004-2.057a1.62 1.62 0 0 1 .471-1.144 1.62 1.62 0 0 1 1.18-.5c.34 0 .66.13.9.37s.37.56.37.9v5.007a1.55 1.55 0 0 1-.453 1.09 1.55 1.55 0 0 1-1.09.453h-5.007a1.62 1.62 0 0 1-1.144-.471 1.62 1.62 0 0 1-.5-1.18c0-.34.13-.66.37-.9s.56-.37.9-.37h2.104c-.917-.857-1.839-1.457-2.77-1.788-.93-.331-1.78-.41-2.552-.212-.772.197-1.43.683-2 1.442a6.71 6.71 0 0 0-1.2 2.552c-.192.911-.264 2.205-.186 3.875.156 3.16.995 5.509 2.516 7.066 1.521 1.558 3.767 2.354 6.739 2.372 2.999.019 5.252-.734 6.739-2.24 1.486-1.507 2.299-3.836 2.436-6.992.07-1.61.012-2.875-.19-3.758a6.893 6.893 0 0 0-1.205-2.567c-.557-.758-1.209-1.243-1.962-1.435-.754-.192-1.597-.119-2.535.217l-.36.136a1.41 1.41 0 0 1-.946.101 1.41 1.41 0 0 1-.772-.548 1.624 1.624 0 0 1-.269-1.4 1.624 1.624 0 0 1 .999-.982c1.252-.426 2.503-.421 3.761.014 1.258.435 2.285 1.253 3.078 2.382a9.771 9.771 0 0 1 1.59 3.64c.26 1.196.336 2.707.225 4.529-.163 3.714-1.207 6.604-3.126 8.674C18.51 22.99 15.764 24 12.186 24z" />
      </svg>
    ),
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Official Social Media Accounts</CardTitle>
        <CardDescription>
          Follow us on our official accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <a 
                key={account.id}
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <div 
                  className={`flex items-center p-4 rounded-lg ${
                    platformColors[account.platform] || 'bg-gray-700'
                  } text-white hover:opacity-90 transition-opacity`}
                >
                  {platformIcons[account.platform] || (
                    <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {account.platform.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="ml-3 flex-1">
                    <Badge variant="outline" className="bg-white/10 text-white">
                      {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
                    </Badge>
                    <p className="mt-1 font-medium">@{account.username}</p>
                  </div>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialAccountsList;
