# Metadata Extractor Pro

A fast Node.js application that extracts metadata from web pages using Puppeteer.

## Features

- Extract title, description, keywords, H1-H3 tags, canonical URL, and robots meta tag
- Process multiple URLs simultaneously
- Copy results to clipboard in table format
- Download as CSV or Excel file
- Clean web interface with table output
- Canonical URL issue detection

## Live Demo

Deploy to Vercel: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/metadata-extractor)

## Local Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/metadata-extractor.git
cd metadata-extractor
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open http://localhost:3000 in your browser

## Usage

1. Enter URLs (one per line) in the textarea
2. Click "Extract Metadata"
3. View results in table format below
4. Copy to clipboard or download as CSV/Excel

## Extracted Data

- URL
- Title
- Description
- Keywords
- H1, H2, H3 headings
- Canonical URL
- Canonical URL issues (Yes/No)
- Robots meta tag

## Deployment

### Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
The app works on any Node.js hosting platform (Heroku, Railway, etc.)

## Tech Stack

- Node.js
- Express.js
- Puppeteer
- Vanilla JavaScript
- CSS3