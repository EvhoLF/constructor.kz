export interface IFunnelBlock {
  id: string
  order: number
  title: string
  description: string
  color: string
  blockStyle?: {
    width: string
    height: string
    margin: string
    textAlign: 'left' | 'center' | 'right'
  }
}

export interface IFunnelToggles {
  showNumber: boolean
  colored: boolean
  showDescription: boolean
}

export type LayoutMode = 'equal' | 'topBig' | 'bottomBig'
export type StyleMode = 'filled' | 'outlined'
export type TextAlign = 'left' | 'center' | 'right'

// Для данных из Prisma (JSON как string)
export interface IFunnelFromDB {
  id: number
  title: string
  blocks: string | null  // JSON string
  layoutMode: string
  styleMode: string
  textAlign: string
  toggles: string | null // JSON string
  blockWidth: number
  blockHeight: number
  createdAt: Date
  updatedAt: Date
  userId: number
  user?: any // Опционально, если include user
}

// Для клиентского использования (разобранный JSON)
export interface IFunnel {
  id: number
  title: string
  blocks: IFunnelBlock[] | null
  layoutMode: LayoutMode
  styleMode: StyleMode
  textAlign: TextAlign
  toggles: IFunnelToggles | null
  blockWidth: number
  blockHeight: number
  createdAt: Date
  updatedAt: Date
  userId: number
}

export interface CreateFunnelData {
  title: string
  blocks?: IFunnelBlock[]
  layoutMode?: LayoutMode
  styleMode?: StyleMode
  textAlign?: TextAlign
  toggles?: IFunnelToggles
  blockWidth?: number
  blockHeight?: number
  userId: number
}

export interface UpdateFunnelData {
  title?: string
  blocks?: IFunnelBlock[]
  layoutMode?: LayoutMode
  styleMode?: StyleMode
  textAlign?: TextAlign
  toggles?: IFunnelToggles
  blockWidth?: number
  blockHeight?: number
}

// Утилиты для преобразования
export function parseFunnelFromDB(funnel: IFunnelFromDB): IFunnel {
  return {
    ...funnel,
    blocks: funnel.blocks ? JSON.parse(funnel.blocks) : null,
    layoutMode: funnel.layoutMode as LayoutMode,
    styleMode: funnel.styleMode as StyleMode,
    textAlign: funnel.textAlign as TextAlign,
    toggles: funnel.toggles ? JSON.parse(funnel.toggles) : null,
  }
}

export function prepareFunnelForDB(funnel: Partial<IFunnel>): any {
  const data: any = { ...funnel }
  
  if (funnel.blocks !== undefined) {
    data.blocks = funnel.blocks ? JSON.stringify(funnel.blocks) : null
  }
  
  if (funnel.toggles !== undefined) {
    data.toggles = funnel.toggles ? JSON.stringify(funnel.toggles) : null
  }
  
  return data
}