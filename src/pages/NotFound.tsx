
import React from 'react';
import Layout from '@/components/Layout';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-24 w-24 rounded-full bg-destructive/20 flex items-center justify-center mb-6 animate-pulse-glow">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>
        
        <a 
          href="/" 
          className="px-6 py-3 bg-blue-purple-gradient rounded-lg hover:opacity-90 transition-opacity"
        >
          Return Home
        </a>
      </div>
    </Layout>
  );
};

export default NotFound;
