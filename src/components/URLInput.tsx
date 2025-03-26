'use client';

import { useState } from 'react';

interface URLInputProps {
  onSubmit: (urls: string[]) => void;
}

export default function URLInput({ onSubmit }: URLInputProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Split by newline and filter out empty lines
    const urlList = inputValue
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    if (urlList.length === 0) return;
    
    onSubmit(urlList);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Enter URLs to Summarize</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="urls" className="block text-gray-700 mb-2">
            Enter one URL per line:
          </label>
          <textarea
            id="urls"
            className="input-field h-40"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="https://example.com&#10;https://another-example.com"
          />
        </div>
        <button 
          type="submit" 
          className="btn-primary w-full"
          disabled={!inputValue.trim()}
        >
          Generate Summary
        </button>
      </form>
    </div>
  );
} 