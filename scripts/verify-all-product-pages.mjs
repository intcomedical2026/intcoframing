import { spawn } from 'child_process';
import json from 'fs/promises';

const BASE_URL = 'http://localhost:3001';
const OUTPUT_FILE = '.omx/state/all-product-pages-verification.json';

async function main() {
  // Read seed data
  const seedData = JSON.parse(await readFile('sanity/seed/intcoframing.seed.json', 'utf8'));
  const products = seedData.products || [];
  
  const results = { success: [], failed: [], total: products.length };
  
  console.log(`Verifying ${products.length} product pages...\n`);
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const path = product.path;
    const url = `${BASE_URL}${path}`;
    
    process.stdout.write(`[${i + 1}/${products.length}] ${path}... `);
    
    try {
      const response = await fetch(url, { 
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        console.log('✓ 200');
        results.success.push({
          slug: product.slug,
          title: product.title,
          path: path,
          status: response.status
        });
      } else {
        console.log(`✗ ${response.status}`);
        results.failed.push({
          slug: product.slug,
          title: product.title,
          path: path,
          status: response.status
        });
      }
    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`);
      results.failed.push({
        slug: product.slug,
        title: product.title,
        path: path,
        error: err.message
      });
    }
  }
  
  // Save results
  await writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));
  
  console.log(`\n=== Verification Complete ===`);
  console.log(`Total: ${results.total}`);
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log(`Results saved to: ${OUTPUT_FILE}`);
}

async function readFile(path, encoding) {
  const { readFile: _readFile } = await import('fs/promises');
  return _readFile(path, encoding);
}

main().catch(console.error);
