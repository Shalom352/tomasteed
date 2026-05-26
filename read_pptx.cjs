// Robust PPTX text extractor — handles all text node variants
const AdmZip = require('adm-zip');
const zip = new AdmZip('Tomasteed_doc-\u00e0-lire.pptx');
const entries = zip.getEntries();

// Get only slide XML (not masters/layouts)
const slideEntries = entries
  .filter(e => /ppt\/slides\/slide\d+\.xml$/.test(e.entryName))
  .sort((a, b) => {
    const na = parseInt(a.entryName.match(/slide(\d+)/)[1]);
    const nb = parseInt(b.entryName.match(/slide(\d+)/)[1]);
    return na - nb;
  });

console.log(`Slides to parse: ${slideEntries.length}`);

for (const entry of slideEntries) {
  const slideNum = entry.entryName.match(/slide(\d+)/)[1];
  const rawXml = entry.getData().toString('utf8');
  
  // Method 1: standard <a:t> tags
  const standard = [];
  let m;
  const re1 = /<a:t[^>]*>([\s\S]*?)<\/a:t>/g;
  while ((m = re1.exec(rawXml)) !== null) {
    const t = m[1].replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
    if (t) standard.push(t);
  }
  
  // Method 2: any element ending in :t with content
  const reGeneric = /<[a-z]+:t(?:\s[^>]*)?>([^<]{1,500})<\/[a-z]+:t>/g;
  const generic = [];
  while ((m = reGeneric.exec(rawXml)) !== null) {
    const t = m[1].replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
    if (t && t.length > 1 && !/^\s*$/.test(t)) generic.push(t);
  }
  
  // Method 3: scan raw bytes for UTF-8 strings after common PPTX text markers
  const allStrings = [];
  // Extract strings from drawing:txBody content
  const txBodyMatch = rawXml.match(/<p:txBody>[\s\S]*?<\/p:txBody>/g) || [];
  for (const body of txBodyMatch) {
    const innerTexts = body.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) || [];
    for (const t of innerTexts) {
      const clean = t.replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
      if (clean) allStrings.push(clean);
    }
  }
  
  const allFound = [...new Set([...standard, ...generic, ...allStrings])];
  
  if (allFound.length > 0) {
    console.log(`\n======== SLIDE ${slideNum} ========`);
    console.log(allFound.join('\n'));
  } else {
    // Last resort: find readable strings >= 4 chars in the raw XML bytes (excluding XML tags)
    const stripped = rawXml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const readable = stripped.match(/[A-Za-z\u00C0-\u024F\u0600-\u06FF]{4,}/g) || [];
    if (readable.length > 3) {
      console.log(`\n======== SLIDE ${slideNum} [stripped] ========`);
      console.log(readable.join(' '));
    } else {
      console.log(`\n======== SLIDE ${slideNum} — NO TEXT FOUND ========`);
    }
  }
}
