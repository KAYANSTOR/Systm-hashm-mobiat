import { jsPDF } from 'jspdf';
import { readFileSync } from 'fs';

const doc = new jsPDF();
doc.text("Hello", 10, 10);
const pdf = doc.output('arraybuffer');
console.log("PDF size:", pdf.byteLength);
