'use client'
import { useEffect, useState } from 'react'
import ProtectedRoute from '../../src/components/ProtectedRoute'
import AdminLayout from '../../src/components/Admin/AdminLayout'

export default function AdminLegacyLayout({ children }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}
