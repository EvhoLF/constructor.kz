import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const filterNoExport = (node: any) => {
  return node instanceof HTMLElement ? !node.classList.contains('no-export') : true;
};

export const exportFunnelPNG = async (element: HTMLElement | null, fileName = 'funnel.png') => {
  if (!element) return;
  try {
    const dataUrl = await toPng(element, { cacheBust: true, filter: filterNoExport });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    a.click();
  } catch (err) {
    console.error('Ошибка при экспорте PNG:', err);
  }
};

export const exportFunnelPDF = async (element: HTMLElement | null, fileName = 'funnel.pdf') => {
  if (!element) return;
  try {
    const dataUrl = await toPng(element, { cacheBust: true, filter: filterNoExport });
    const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const ratio = img.width / img.height;
      let pdfWidth = pageWidth - 20; // отступ
      let pdfHeight = pdfWidth / ratio;

      if (pdfHeight > pageHeight - 20) {
        pdfHeight = pageHeight - 20;
        pdfWidth = pdfHeight * ratio;
      }

      pdf.addImage(dataUrl, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save(fileName);
    };
  } catch (err) {
    console.error('Ошибка при экспорте PDF:', err);
  }
};
