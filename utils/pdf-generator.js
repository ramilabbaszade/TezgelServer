import html_to_pdf from 'html-pdf-node'
import s3Uploader from './s3-uploader.js';

// Example of options with args //
// let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

const pdfGenerator = async (file, options) => {
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    return s3Uploader(pdfBuffer, file.name);
}

export default pdfGenerator;
