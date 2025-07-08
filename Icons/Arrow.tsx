const Arrow = {
  arrowDown: <path d="m13 16.172 5.364-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2z" />,
  arrowDownS: <path d="m12 13.171 4.95-4.95 1.414 1.415L12 16 5.636 9.636 7.05 8.222z" />,
  arrowGoBack: <path d="m5.828 7 2.536 2.535L6.95 10.95 2 6l4.95-4.95 1.414 1.415L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 0 0 0-12z" />,
  arrowGoForward: <path d="M18.172 7H11a6 6 0 0 0 0 12h9v2h-9a8 8 0 0 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.415z" />,
  arrowLeftDown: <path d="m9 13.589 8.607-8.607 1.414 1.415-8.607 8.606H18v2H7v-11h2z" />,
  arrowLeft: <path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z" />,
  arrowLeftRight: <path d="M16.05 12.05 21 17l-4.95 4.95-1.414-1.415L17.172 18H4v-2h13.172l-2.536-2.535zm-8.1-10 1.414 1.414-2.536 2.535H20v2H6.828l2.536 2.536L7.95 11.95 3 7z" />,
  arrowLeftS: <path d="m10.828 12 4.95 4.95-1.414 1.415L8 12l6.364-6.364 1.414 1.414z" />,
  arrowLeftUp: <path d="m9.414 8 8.607 8.607-1.414 1.414L8 9.414V17H6V6h11v2z" />,
  arrowRightDown: <path d="M14.59 16.003 5.983 7.397l1.414-1.415 8.607 8.607V7.003h2v11h-11v-2z" />,
  arrowRight: <path d="m16.172 11-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />,
  arrowRightS: <path d="m13.172 12-4.95-4.95 1.414-1.413L16 12l-6.364 6.364-1.414-1.415z" />,
  arrowRightUp: <path d="m16.004 9.414-8.607 8.607-1.414-1.414L14.59 8H7.003V6h11v11h-2z" />,
  arrowUpDown: <path d="m11.95 7.95-1.414 1.414L8 6.828 8 20H6V6.828L3.466 9.364 2.05 7.95 7 3zm10 8.1L17 21l-4.95-4.95 1.414-1.414 2.537 2.536L16 4h2v13.172l2.536-2.536z" />,
  arrowUp: <path d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414z" />,
  arrowUpS: <path d="m12 10.828-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z" />,
  collapseDiagonal: <path d="M15 4h-2v7h7V9h-3.586l4.293-4.293-1.414-1.414L15 7.586zM4 15h3.586l-4.293 4.293 1.414 1.414L9 16.414V20h2v-7H4z" />,
  collapseHorizontal: <path d="m13.5 12 4.95-4.95 1.414 1.415L17.328 11H23v2h-5.672l2.534 2.533-1.415 1.414zM1 13h5.67l-2.534 2.535 1.414 1.414L10.5 12 5.55 7.05 4.136 8.465 6.672 11H1z" />,
  collapseVertical: <path d="m12 13.5 4.95 4.95-1.415 1.413-2.536-2.535V23h-2v-5.672L8.467 19.86l-1.414-1.414zM11 1v5.67L8.464 4.135 7.05 5.55 12 10.5l4.95-4.95-1.414-1.414L13 6.672V1z" />,
  dragMove2: <path d="M11 11V5.828L9.172 7.657 7.757 6.243 12 2l4.243 4.243-1.415 1.414L13 5.828V11h5.172l-1.829-1.828 1.414-1.415L22 12l-4.243 4.243-1.414-1.415L18.172 13H13v5.172l1.828-1.829 1.415 1.414L12 22l-4.243-4.243 1.415-1.414L11 18.172V13H5.828l1.829 1.828-1.414 1.415L2 12l4.243-4.243 1.414 1.415L5.828 11z" />,
  expandDiagonal: <path d="M17.586 5H14V3h7v7h-2V6.414l-4.293 4.293-1.414-1.414zM3 14h2v3.586l4.293-4.293 1.414 1.414L6.414 19H10v2H3z" />,
  expandHorizontal: <path d="m.5 12 4.95-4.95 1.414 1.415L4.328 11H10v2H4.328l2.533 2.533-1.414 1.414zM14 13h5.67l-2.534 2.535 1.414 1.414L23.5 12l-4.95-4.95-1.414 1.415L19.672 11H14z" />,
  expandVertical: <path d="m12 .5 4.95 4.95-1.415 1.413-2.536-2.535V10h-2V4.328L8.467 6.86 7.052 5.447zM11 14v5.67l-2.536-2.535L7.05 18.55 12 23.5l4.95-4.95-1.414-1.414L13 19.672v-5.673z" />,
}
export default Arrow

export const IconNamesArrow = ['arrowDown', 'arrowDownS', 'arrowGoBack', 'arrowGoForward', 'arrowLeftDown', 'arrowLeft', 'arrowLeftRight', 'arrowLeftS', 'arrowLeftUp', 'arrowRightDown', 'arrowRight', 'arrowRightS', 'arrowRightUp', 'arrowUpDown', 'arrowUp', 'arrowUpS', 'collapseDiagonal', 'collapseHorizontal', 'collapseVertical', 'dragMove2', 'expandDiagonal', 'expandHorizontal', 'expandVertical',] as const;