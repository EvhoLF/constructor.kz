import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const exportBoardPNG = async (ref: HTMLElement | null) => {
  if (!ref) return
  const canvas = await html2canvas(ref)
  const link = document.createElement('a')
  link.download = 'board.png'
  link.href = canvas.toDataURL()
  link.click()
}

export const exportBoardPDF = async (ref: HTMLElement | null) => {
  if (!ref) return
  const canvas = await html2canvas(ref)
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height])
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
  pdf.save('board.pdf')
}
