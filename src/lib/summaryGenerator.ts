import axios from 'axios';
import * as cheerio from 'cheerio';
// Import OpenAI conditionally to avoid errors when API key is not available
let OpenAI: any;
try {
  OpenAI = require('openai');
} catch (e) {
  console.warn('OpenAI package not available, using local summary only');
}

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY && OpenAI
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true, // Only for client-side use in this demo
    })
  : null;

/**
 * Fetches content from a given URL
 */
export async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Remove less important elements
    $('script, style, nav, footer, header, aside, iframe, noscript').remove();
    
    // Extract main content
    const title = $('title').text() || '';
    const mainContent = $('main, article, .content, #content, .main').text() || $('body').text() || '';
    
    // Clean up the text
    const text = (title + '\n\n' + mainContent)
      .replace(/\s+/g, ' ')
      .trim();
    
    return text;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return `Failed to fetch content from ${url}`;
  }
}

/**
 * Generates a summary for a list of URLs
 */
export async function generateSummary(urls: string[]): Promise<string> {
  // If OpenAI is not available, use local summary
  if (!openai) {
    console.log('OpenAI API key not available, using local summary');
    return generateLocalSummary(urls);
  }
  
  // Fetch content from all URLs
  const contentPromises = urls.map(url => fetchUrlContent(url));
  const contents = await Promise.all(contentPromises);
  
  // Combine URLs with their content
  const urlContents = urls.map((url, index) => `Source: ${url}\nContent: ${contents[index]}`).join('\n\n');
  
  try {
    // Use OpenAI to generate a summary
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates concise but comprehensive summaries of web content. Organize your summary by main topics found across the URLs. Include key points from each source and identify common themes."
        },
        {
          role: "user",
          content: `I need a comprehensive summary of content from the following URLs:\n\n${urlContents}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || 'Failed to generate summary';
  } catch (error) {
    console.error('Error generating summary with OpenAI:', error);
    // Fallback to local summary if OpenAI fails
    console.log('Falling back to local summary');
    return generateLocalSummary(urls);
  }
}

/**
 * Local function for generating summaries without OpenAI API
 */
export async function generateLocalSummary(urls: string[]): Promise<string> {
  // Fetch content from all URLs
  const contentPromises = urls.map(url => fetchUrlContent(url));
  const contents = await Promise.all(contentPromises);
  
  // Create a basic summary without AI
  let summary = `# Summary of ${urls.length} URLs\n\n`;
  
  // Add a section for each URL
  urls.forEach((url, index) => {
    const content = contents[index];
    
    // Extract title (first 100 chars max)
    const title = content.substring(0, 100).split('\n')[0] || url;
    
    // Get a preview (first 500 chars)
    const preview = content.substring(0, 500) + (content.length > 500 ? '...' : '');
    
    // Format key points (simple extraction)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20).slice(0, 5);
    const keyPoints = sentences.map(s => `- ${s.trim()}`).join('\n');
    
    summary += `## ${index + 1}. ${title}\n\n`;
    summary += `Source: ${url}\n\n`;
    summary += `### Key Points:\n${keyPoints || '- No key points extracted'}\n\n`;
    summary += `### Preview:\n${preview}\n\n`;
    summary += `---\n\n`;
  });
  
  // Add a simple conclusion
  summary += `## Overall Summary\n\n`;
  summary += `The above content was extracted from ${urls.length} URLs. This basic summary was generated without AI assistance.\n`;
  summary += `For better summaries, consider configuring an OpenAI API key.`;
  
  return summary;
} 