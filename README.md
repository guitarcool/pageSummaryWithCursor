# Page Summary App

A web application that allows users to enter multiple URLs, generates summaries of the content from those URLs, and provides options to view and save the summaries.

## Features

- Enter multiple URLs to summarize
- Crawl and extract content from the provided URLs
- Generate a comprehensive summary of all content
- Save the summary as a text file
- View the summary within the application

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Axios for HTTP requests
- Cheerio for HTML parsing
- OpenAI API for generating summaries

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pagesummary.git
   cd pagesummary
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter one URL per line in the text area
2. Click "Generate Summary"
3. View the generated summary
4. Click "Save Summary" to download the summary as a text file

## Deployment

This application can be deployed on Vercel:

```bash
npm run build
npm run start
```

For production deployment, follow the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## License

MIT