import puppeteer from 'puppeteer';
(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent('<h1>Hello</h1>');
    const pdf = await page.pdf();
    console.log('PDF generated, size:', pdf.length);
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
