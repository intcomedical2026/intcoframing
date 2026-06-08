import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.join(process.cwd(), '.omx', 'artifacts', 'product-detail-comparison', 'screenshots');
const LOCAL_BASE = 'http://localhost:3000';
const SOURCE_BASE = 'https://www.intcoframing-us.com';

// Chrome path for macOS
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const products = [
  { slug: 'classic-led-mirror', path: '/mirror/led-mirror/classic-led-mirror' },
];

async function captureScreenshot(url, outputPath) {
  try {
    // Using Chrome headless for screenshot
    const cmd = `"${CHROME_PATH}" --headless --disable-gpu --screenshot="${outputPath}" --window-size=1440,900 "${url}"`;
    execSync(cmd, { timeout: 30000 });
    console.log(`  ✓ Captured: ${outputPath}`);
    return true;
  } catch (err) {
    console.log(`  ✗ Failed to capture: ${err.message}`);
    return false;
  }
}

async function main() {
  if (!existsSync(SCREENSHOT_DIR)) {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
  
  // Check if Chrome is available
  if (!existsSync(CHROME_PATH)) {
    console.log('Chrome not found at:', CHROME_PATH);
    console.log('Skipping screenshots. Will use HTTP response as evidence.');
    return;
  }
  
  for (const product of products) {
    console.log(`\nCapturing: ${product.title || product.slug}`);
    
    // Capture local
    const localUrl = `${LOCAL_BASE}${product.path}`;
    const localOutput = path.join(SCREENSHOT_DIR, `${product.slug}-local.png`);
    await captureScreenshot(localUrl, localOutput);
    
    // Capture source
    const sourceUrl = `${SOURCE_BASE}${product.path}/`;
    const sourceOutput = path.join(SCREENSHOT_DIR, `${product.slug}-source.png`);
    await captureScreenshot(sourceUrl, sourceOutput);
  }
  
  console.log('\nScreenshot capture complete!');
}

main().catch(console.error);
