'use client'
// Server-renderable section components for public pages, generated from the
// single section registry. next/dynamic keeps each section in its own chunk
// and still renders it into the server HTML (content for crawlers and first paint).
import dynamic from 'next/dynamic'
import { SECTIONS } from './sections'
import { pathForType } from './registry'

const ssrComponents = Object.fromEntries(SECTIONS.map((s) => [s.path, dynamic(s.load)]))

export const getSsrComponent = (componentType) => {
  const path = pathForType(componentType)
  return (path && ssrComponents[path]) || null
}
