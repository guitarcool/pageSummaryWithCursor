'use client';

import { useState } from 'react';
import URLInput from '@/components/URLInput';
import SummaryDisplay from '@/components/SummaryDisplay';
import axios from 'axios';

export default function Home() {
  const [urls, setUrls] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSubmit = async (urlList: string[]) => {
    setUrls(urlList);
    setLoading(true);
    setError(null);
    
    try {
      // Call the server API instead of directly using the summary generator
      const response = await axios.post('/api/summarize', { urls: urlList });
      
      if (response.data.notice) {
        console.warn(response.data.notice);
      }
      
      setSummary(response.data.summary);
    } catch (err) {
      const errorMessage = 
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : err instanceof Error 
            ? err.message 
            : 'An unknown error occurred';
      
      setError(errorMessage);
      setSummary('');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!summary) return;
    
    // Create a blob with the summary content
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `page-summary-${new Date().toISOString().split('T')[0]}.md`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <URLInput onSubmit={handleUrlSubmit} />
      
      {loading && (
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Generating summary...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {summary && !loading && (
        <>
          <SummaryDisplay summary={summary} />
          <div className="flex justify-center">
            <button 
              onClick={handleSave} 
              className="btn-primary"
            >
              Save Summary
            </button>
          </div>
        </>
      )}
    </div>
  );
} 