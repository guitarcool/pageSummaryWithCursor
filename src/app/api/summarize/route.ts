import { NextResponse } from 'next/server';
import { generateSummary } from '@/lib/summaryGenerator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Please provide an array of URLs.' },
        { status: 400 }
      );
    }

    // Directly use generateSummary which now has fallback logic
    const summary = await generateSummary(urls);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in summarize API:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
} 