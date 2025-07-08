
const Buildings = {
  bank: <path d="M2 20h20v2H2zm2-8h2v7H4zm5 0h2v7H9zm4 0h2v7h-2zm5 0h2v7h-2zM2 7l10-5 10 5v4H2zm2 1.236V9h16v-.764l-8-4zM12 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />,
  building: <path d="M3 19V5.7a1 1 0 0 1 .658-.94l9.671-3.516a.5.5 0 0 1 .671.47v4.953l6.316 2.105a1 1 0 0 1 .684.949V19h2v2H1v-2zm2 0h7V3.855L5 6.401zm14 0v-8.558l-5-1.667V19z" />,
  building2: <path d="M21 20h2v2H1v-2h2V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1zm-2 0V4H5v16zM8 11h3v2H8zm0-4h3v2H8zm0 8h3v2H8zm5 0h3v2h-3zm0-4h3v2h-3zm0-4h3v2h-3z" />,
  building3: <path d="M21 19h2v2H1v-2h2V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v15h4v-8h-2V9h3a1 1 0 0 1 1 1zM5 5v14h8V5zm2 6h4v2H7zm0-4h4v2H7z" />,
  government: <path d="M20 6h3v2h-1v11h1v2H1v-2h1V8H1V6h3V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1zm0 2H4v11h3v-7h2v7h2v-7h2v7h2v-7h2v7h3zM6 5v1h12V5z" />,
  home: <path d="M13 19h6V9.978l-7-5.444-7 5.444V19h6v-6h2zm8 1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.49a1 1 0 0 1 .386-.79l8-6.223a1 1 0 0 1 1.228 0l8 6.223a1 1 0 0 1 .386.79z" />,
  hospital: <path d="M8 20v-6h8v6h3V4H5v16zm2 0h4v-4h-4zm11 0h2v2H1v-2h2V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1zM11 8V6h2v2h2v2h-2v2h-2v-2H9V8z" />,
  hotel: <path d="M22 21H2v-2h1V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v5h2v10h1zm-5-2h2v-8h-6v8h2v-6h2zm0-10V5H5v14h6V9zM7 11h2v2H7zm0 4h2v2H7zm0-8h2v2H7z" />,
  school: <path d="m12 .586 6 6V9h4v10h1v2H1v-2h1V9h4V6.586zM18 19h2v-8h-2zM6 11H4v8h2zm2-3.586V19h3v-7h2v7h3V7.414l-4-4z" />,
  store: <path d="M21 13.242V20h1v2H2v-2h1v-6.758A4.5 4.5 0 0 1 1 9.5c0-.827.224-1.624.633-2.303L4.345 2.5a1 1 0 0 1 .866-.5H18.79a1 1 0 0 1 .866.5l2.703 4.682c.418.694.642 1.49.642 2.318 0 1.56-.794 2.935-2 3.742m-2 .73a4.496 4.496 0 0 1-3.75-1.36A4.5 4.5 0 0 1 12 14.001a4.5 4.5 0 0 1-3.25-1.387A4.5 4.5 0 0 1 5 13.973V20h14zM5.789 4 3.356 8.213a2.5 2.5 0 1 0 4.466 2.216c.335-.837 1.52-.837 1.856 0a2.5 2.5 0 0 0 4.644 0c.335-.837 1.52-.837 1.856 0a2.5 2.5 0 1 0 4.457-2.232L18.21 4z" />,

}
export default Buildings

export const IconNamesBuildings = ['bank', 'building', 'building2', 'building3', 'government', 'home', 'hospital', 'hotel', 'school', 'store',] as const;