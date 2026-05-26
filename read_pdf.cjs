// Try pdf-parse which handles more PDF types
const fs = require('fs');
const path = require('path');

async function tryExtract() {
  // Try pdf-parse
  try {
    const pdfParse = require('pdf-parse');
    const data = fs.readFileSync('TOMASTEED-doc-a lire.pdf');
    const result = await pdfParse(data);
    console.log('=== PDF-PARSE RESULT ===');
    console.log('Pages:', result.numpages);
    console.log('Text:', result.text);
  } catch(e) {
    console.log('pdf-parse error:', e.message);
    
    // Fallback: try to read raw text strings from binary
    try {
      const buf = fs.readFileSync('TOMASTEED-doc-a lire.pdf');
      const str = buf.toString('latin1');
      // Extract text between BT and ET (PDF text blocks)
      const matches = str.match(/BT[\s\S]*?ET/g) || [];
      let texts = [];
      for (const block of matches) {
        const tjMatches = block.match(/\((.*?)\)\s*Tj/g) || [];
        for (const m of tjMatches) {
          const txt = m.replace(/^\(/, '').replace(/\)\s*Tj$/, '').trim();
          if (txt.length > 2) texts.push(txt);
        }
      }
      console.log('\n=== RAW TEXT BLOCKS ===');
      console.log(texts.join('\n'));
    } catch(e2) {
      console.log('Raw extraction error:', e2.message);
    }
  }
}

tryExtract();
