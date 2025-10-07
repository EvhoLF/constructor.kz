'use client'
import { IFunnelBlock } from '@/global'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT_COLORS = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00bcd4']
const MIN_WIDTH = 40
const DEFAULT_HEIGHT = 70

function getCyclicItem<T>(array: T[], index: number) {
  return array[index % array.length]
}

function getRandomColor(exclude1?: string, exclude2?: string): string {
  const filtered = DEFAULT_COLORS.filter(c => c !== exclude1 && c !== exclude2)
  return filtered.length ? filtered[Math.floor(Math.random() * filtered.length)] : DEFAULT_COLORS[0]
}

function getMinWidth(total: number, blockWidth: number, minWidth: number) {
  const factor = Math.min(1, (total - 1) / 6)
  const targetMin = blockWidth > minWidth ? minWidth : Math.max(5, blockWidth * 0.5)
  return blockWidth - (blockWidth - targetMin) * factor
}

export function useFunnel(initialBlocks?: IFunnelBlock[]) {
  const [blocksMap, setBlocksMap] = useState<Record<string, IFunnelBlock>>(() => {
    const blocks = initialBlocks ?? [
      { id: uuidv4(), order: 1, title: 'Шаг 1', description: 'Описание', color: DEFAULT_COLORS[0] },
      { id: uuidv4(), order: 2, title: 'Шаг 2', description: 'Описание', color: DEFAULT_COLORS[1] },
    ]
    return Object.fromEntries(blocks.map(b => [b.id, b]))
  })

  const [layoutMode, setLayoutMode] = useState<'equal' | 'topBig' | 'bottomBig'>('bottomBig')
  const [styleMode, setStyleMode] = useState<'filled' | 'outlined'>('filled')
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left')

  const [toggles, setToggles] = useState({ showNumber: true, colored: true, showDescription: true })
  const [blockWidth, setBlockWidth] = useState(100)
  const [blockHeight, setBlockHeight] = useState(DEFAULT_HEIGHT)

  const blocks = useMemo(() => Object.values(blocksMap).sort((a, b) => a.order - b.order), [blocksMap])

  const updateToggleStates = useCallback((active: string[]) => {
    setToggles(prev => ({
      ...prev,
      showNumber: active.includes('showNumber'),
      colored: active.includes('colored'),
      showDescription: active.includes('showDescription'),
    }))
  }, []);

  const OnToggleStates = useCallback(({ showNumber, colored, showDescription }: { showNumber?: boolean, colored?: boolean, showDescription?: boolean }) => {
    setToggles(prev => ({
      ...prev,
      showNumber: showNumber ?? prev.showNumber,
      colored: colored ?? prev.colored,
      showDescription: showDescription ?? prev.showDescription,
    }))
  }, []);

  const removeBlock = (id: string) => {
    const blockToRemove = blocksMap[id];
    if (!blockToRemove) return;
    if (blocks.length <= 1) return;
    setBlocksMap(prev => {
      const updatedMap: Record<string, IFunnelBlock> = {}
      let needReorder = false
      Object.values(prev).forEach(block => {
        if (block.id === id) return;
        let newOrder = block.order;
        if (block.order > blockToRemove.order) {
          newOrder = block.order - 1;
          needReorder = true;
        }
        updatedMap[block.id] = { ...block, order: newOrder }
      })
      return updatedMap
    })
  }

  const addBlockAfter = (afterId?: string) => {
    const idx = afterId ? blocks.findIndex(b => b.id === afterId) : blocks.length - 1
    const newBlock: IFunnelBlock = {
      id: uuidv4(),
      order: idx + 2,
      title: 'Новый шаг',
      description: '',
      color: DEFAULT_COLORS[blocks.length % DEFAULT_COLORS.length],
    }

    const updatedMap: Record<string, IFunnelBlock> = {}
    blocks.forEach((b, i) => {
      updatedMap[b.id] = { ...b }
      if (i > idx) updatedMap[b.id].order += 1
    })
    updatedMap[newBlock.id] = newBlock
    setBlocksMap(updatedMap)
  }

  const moveBlock = (oldIndex: number, newIndex: number) => {
    const movingBlock = blocks[oldIndex]
    if (!movingBlock) return
    const updatedMap: Record<string, IFunnelBlock> = {}
    blocks.forEach((b, i) => {
      if (b.id === movingBlock.id) return
      let newOrder = b.order
      if (oldIndex < newIndex && i > oldIndex && i <= newIndex) newOrder -= 1
      if (oldIndex > newIndex && i >= newIndex && i < oldIndex) newOrder += 1
      updatedMap[b.id] = { ...b, order: newOrder }
    })
    updatedMap[movingBlock.id] = { ...movingBlock, order: newIndex + 1 }
    setBlocksMap(updatedMap)
  }

  const updateBlock = (id: string, data: Partial<IFunnelBlock>) => {
    setBlocksMap(prev => ({ ...prev, [id]: { ...prev[id], ...data } }))
  }

  const resetColors = () => {
    setBlocksMap(prev => {
      const updated: Record<string, IFunnelBlock> = {}
      Object.values(prev).forEach(b => {
        updated[b.id] = { ...b, color: getCyclicItem(DEFAULT_COLORS, b.order) }
      })
      return updated
    })
  }

  const exportJSON = () => {
    const json = JSON.stringify(blocks, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'funnel.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const blocksWithStyle = useMemo(() => {
    const total = blocks.length
    const dynamicMinWidth = getMinWidth(total, blockWidth, MIN_WIDTH)

    return blocks.map((block, index) => {
      let width = blockWidth

      if (layoutMode === 'topBig') {
        width =
          index === 0
            ? blockWidth
            : Math.max(dynamicMinWidth, blockWidth - (index * (blockWidth - dynamicMinWidth)) / (total - 1))
      } else if (layoutMode === 'bottomBig') {
        width =
          index === total - 1
            ? blockWidth
            : Math.max(dynamicMinWidth, dynamicMinWidth + (index * (blockWidth - dynamicMinWidth)) / (total - 1))
      }

      return {
        ...block,
        blockStyle: {
          width: `${width}%`,
          height: `${blockHeight}px`,
          margin: 'auto',
          textAlign, // новое выравнивание текста
        },
      }
    })
  }, [blocks, layoutMode, blockWidth, blockHeight, textAlign])


  useEffect(() => {
    const shouldShow = blockHeight > 60;
    if (shouldShow !== toggles.showDescription) {
      OnToggleStates({ showDescription: shouldShow });
    }
  }, [blockHeight, toggles.showDescription]);
  return {
    blocks: blocksWithStyle,
    addBlockAfter,
    moveBlock,
    updateBlock,
    removeBlock,
    resetColors,
    exportJSON,
    layoutMode,
    setLayoutMode,
    styleMode,
    setStyleMode,
    textAlign,
    setTextAlign, // экспорт setter
    toggles,
    updateToggleStates,
    blockWidth,
    setBlockWidth,
    setBlocksMap,
    blockHeight,
    setBlockHeight,
  }
}
