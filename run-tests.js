const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${process.cwd()}/test_basic.html`);
  const text = await page.$eval('#resultado', el => el.textContent);
  console.log("Resultados del test:");
  console.log(text);
  await browser.close();
  if (text.includes("✘")) {
    process.exit(1); // falla el job si hay errores
  }
})();
