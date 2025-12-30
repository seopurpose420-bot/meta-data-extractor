const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());

async function extractMetadata(urls) {
  const browser = await puppeteer.launch({ 
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless
  });
  
  const results = await Promise.all(urls.map(async (url) => {
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      const metadata = await page.evaluate(() => {
        const getMetaContent = (name) => {
          const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
          return meta ? meta.getAttribute('content') : '';
        };
        
        const canonical = document.querySelector('link[rel="canonical"]')?.href || '';
        const currentUrl = window.location.href;
        
        return {
          url: currentUrl,
          title: document.title || '',
          description: getMetaContent('description'),
          keywords: getMetaContent('keywords'),
          h1: document.querySelector('h1')?.textContent?.trim() || '',
          h2: document.querySelector('h2')?.textContent?.trim() || '',
          h3: document.querySelector('h3')?.textContent?.trim() || '',
          canonical: canonical,
          canonicalIssue: canonical && canonical !== currentUrl ? 'Yes' : 'No',
          robots: getMetaContent('robots')
        };
      });
      
      return metadata;
    } catch (error) {
      return { url, title: 'ERROR', description: error.message, keywords: '', h1: '', h2: '', h3: '', canonical: '', canonicalIssue: 'No', robots: '' };
    } finally {
      await page.close();
    }
  }));
  
  await browser.close();
  return results;
}

app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  res.send(html);
});

app.post('/extract', async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'URLs array is required' });
    }
    
    const results = await extractMetadata(urls);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/download-csv', async (req, res) => {
  try {
    const { data } = req.body;
    
    const headers = ['url', 'title', 'description', 'keywords', 'h1', 'h2', 'h3', 'canonical', 'canonicalIssue', 'robots'];
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });
    
    const csv = csvRows.join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="metadata.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
