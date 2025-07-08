// hooks/useFunnel.ts
'use client'
import { IFunnelBlock } from '@/types/global'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

export const useFunnel = () => {
  const [blocks, setBlocks] = useState<IFunnelBlock[]>([
    { id: uuid(), title: 'Шаг 1', order: 1 },
    { id: uuid(), title: 'Шаг 2', order: 2 },
  ])

  const addBlockAfter = (id: string) => {
    const index = blocks.findIndex(b => b.id === id)
    const newBlock: IFunnelBlock = {
      id: uuid(),
      title: 'Новый шаг',
      order: 0, // временно
    }
    const updated = [...blocks]
    updated.splice(index + 1, 0, newBlock)
    renumberBlocks(updated)
  }

  const updateBlockTitle = (id: string, title: string) => {
    setBlocks(prev =>
      prev.map(b => (b.id === id ? { ...b, title } : b))
    )
  }

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const updated = [...blocks]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    renumberBlocks(updated)
  }

  const renumberBlocks = (arr: IFunnelBlock[]) => {
    setBlocks(arr.map((b, i) => ({ ...b, order: i + 1 })))
  }

  const exportJSON = () => {
    const json = JSON.stringify(blocks, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'funnel.json'
    link.click()
  }

  return {
    blocks,
    addBlockAfter,
    updateBlockTitle,
    moveBlock,
    exportJSON,
  }
}
