import { readFileSync } from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const buf = readFileSync('TOMASTEED-doc-a lire.pdf');
const data = await pdf(buf);
console.log('Pages:', data.numpages);
console.log(data.text.substring(0, 12000));
