const { chromium } = require('playwright');
const path = require('path');

(async () => {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] [${msg.type().toUpperCase()}]: ${msg.text()}`);
    });

    page.on('pageerror', err => {
      console.error(`[BROWSER EXCEPTION]: ${err.message}`);
    });

    console.log('Navigating to http://localhost:3000/ ...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    
    // Wait for the main page to load
    await page.waitForSelector('text="RISK RADAR"', { timeout: 5000 });
    
    // Find the scrollable container and scroll down inside it
    const scrollContainerSelector = '.content-scroll';
    await page.waitForSelector(scrollContainerSelector);
    
    console.log('Scrolling down the main panel...');
    await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (el) {
        el.scrollTop = 500; // Scroll down 500px to bring the bottom section into view
      }
    }, scrollContainerSelector);

    // Also scroll the Risk Radar container itself if it has overflow
    console.log('Scrolling down the Risk Radar container...');
    await page.evaluate(() => {
      const el = document.querySelector('.overflow-y-auto'); // first overflow container in page
      if (el) {
        // el.scrollTop = 500;
      }
    });

    // Wait a brief moment for layout/scroll to settle
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Capture screenshot of the whole page
    const screenshotPath = path.join(__dirname, 'screenshot_scrolled.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Scrolled screenshot saved successfully at: ${screenshotPath}`);
    
    // Check if the MUI RadarChart is in the DOM
    const hasMuiRadar = await page.evaluate(() => {
      // Look for the MUI chart SVG or element
      const svg = document.querySelector('.MuiResponsiveChart-container svg');
      return svg ? svg.outerHTML.slice(0, 500) : 'MUI SVG NOT FOUND';
    });
    
    console.log('\n--- MUI RadarChart element in DOM ---');
    console.log(hasMuiRadar);
    console.log('-------------------------------------\n');
    
  } catch (err) {
    console.error('Failed to capture scrolled screenshot:', err);
  } finally {
    if (browser) await browser.close();
    console.log('Done.');
  }
})();
