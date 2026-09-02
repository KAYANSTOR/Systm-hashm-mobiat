import express from 'express';
import puppeteer from 'puppeteer';
import { createServer as createViteServer } from 'vite';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  app.post('/api/pdf', async (req, res) => {
    try {
      const { html, styles } = req.body;
      
      const { exec } = await import('child_process');
      await new Promise(r => exec('chmod +x /root/.cache/puppeteer/chrome/*/chrome-linux64/chrome', r));

      const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'] 
      });
      const page = await browser.newPage();
      
      const fullHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
        ${styles || ''}
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; background: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-section {
            border: 4px solid #199b9e !important;
            border-radius: 20px !important;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
      `;

      await page.setContent(fullHtml, { waitUntil: 'networkidle2' as any });
      await page.evaluateHandle('document.fonts.ready');
      
      const pdf = await page.pdf({ 
        printBackground: true,
        preferCSSPageSize: true // This will use the @page size from the CSS
      });
      
      await browser.close();
      
      res.contentType('application/pdf');
      res.send(Buffer.from(pdf));
    } catch (e) {
      console.error(e);
      res.status(500).send(e.toString());
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
