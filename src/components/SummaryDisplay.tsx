'use client';

import ReactMarkdown from 'react-markdown';

interface SummaryDisplayProps {
  summary: string;
}

export default function SummaryDisplay({ summary }: SummaryDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <div className="prose max-w-none">
        <ReactMarkdown>
          {summary}
        </ReactMarkdown>
      </div>
    </div>
  );
} 