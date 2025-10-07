'use client'
import { IFunnelBlock } from '@/global'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'


function getCyclicItem(array: any[], index: number) {
  return array[index % array.length];
}

const DEFAULT_COLORS = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00bcd4'];


export function useFunnel(initialBlocks?: IFunnelBlock[]) {
  const [blocks, setBlocks] = useState<IFunnelBlock[]>(
    initialBlocks ?? [
      { id: uuidv4(), order: 1, title: 'Шаг 1', description: 'Описание', color: '#2196f3' },
      { id: uuidv4(), order: 2, title: 'Шаг 2', description: 'Описание', color: '#4caf50' },
    ]
  )

  const recalcOrder = (arr: IFunnelBlock[]) => arr.map((b, i) => ({ ...b, order: i + 1 }));

  const setBlocksWithOrder = (arr: IFunnelBlock[]) => { setBlocks(recalcOrder(arr)); }

  const addBlockAfter = (afterId?: string) => {
    const idx = blocks.findIndex(b => b.id === afterId);
    const order = blocks.length + 1;
    const newBlock: IFunnelBlock = {
      id: uuidv4(),
      order: order,
      title: 'Новый шаг',
      description: '',
      color: getCyclicItem(DEFAULT_COLORS, order)
    }
    const newBlocks = [...blocks]
    newBlocks.splice(idx + 1, 0, newBlock)
    setBlocks(newBlocks)
  }

  const moveBlock = (oldIndex: number, newIndex: number) => {
    const updated = [...blocks];
    const [removed] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, removed);
    setBlocksWithOrder(updated);
  }

  const updateBlock = (id: string, data: Partial<IFunnelBlock>) => {
    setBlocks(prev =>
      prev.map(b => (b.id === id ? { ...b, ...data } : b))
    )
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

  const resetColors = () => {
    setBlocks(pre => pre.map(el => ({ ...el, color: getCyclicItem(DEFAULT_COLORS, el.order) })))
  }

  return { blocks, setBlocks, addBlockAfter, moveBlock, updateBlock, exportJSON, resetColors }
}
