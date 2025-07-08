import jsPDF from "jspdf";
import '@/public/fonts/Roboto-normal'; // путь до файла (скорее всего /src/fonts)

const createPDF = async (imgSrc: string | undefined = '', descriptionLines: string[] = []) => {
  if (!imgSrc) return;

  const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
  pdf.setFont('Roboto', 'normal'); // имя и стиль — как в addFont
  const pageWidth = pdf.internal.pageSize.getWidth();

  const image = new window.Image();
  image.src = imgSrc;

  image.onload = () => {
    const ratio = image.width / image.height;
    const pdfWidth = pageWidth - 20;
    const pdfHeight = pdfWidth / ratio;

    pdf.addImage(imgSrc, 'PNG', 10, 10, pdfWidth, pdfHeight);

    let y = 10 + pdfHeight + 10;
    descriptionLines.forEach(line => {
      if (y < 290) { // ограничение по высоте A4
        pdf.text(line, 8, y);
        y += 7;
      }
    });

    pdf.save('react-flow-map.pdf');
  };
}

export default createPDF