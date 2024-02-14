import express from 'express';
const app = express();
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { open, readFile } from 'node:fs/promises';
import fields from '/app/files/fields.js';

async function start() {
  const pdf = await readFile('/app/files/ub-40-P.pdf');
  const pdfDoc = await PDFDocument.load(pdf);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const page = pdfDoc.getPage(0);
  const form = pdfDoc.getForm();
  fields.forEach(field => {
    const textField = form.createTextField(field['name']);
    textField.setText(field['text']);
    textField.addToPage(page, field['prop']);
    textField.defaultUpdateAppearances(helvetica);
    textField.setFontSize(10);
    field['multiline'] && textField.enableMultiline();
    field['align'] && textField.setAlignment(field['align']);
  });
  return await pdfDoc.save()
}

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('filename', 'ub-40-p.Pdf');
  res.setHeader('Content-Disposition', 'inline');
  start().then(pdf => {
    res.send(Buffer.from(pdf));
  });
});

app.listen(3000);
