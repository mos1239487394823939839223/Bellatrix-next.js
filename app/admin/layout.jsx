'use client'
import { useEffect, useState } from 'react'
import { AdminProvider } from '../../src/contexts/AdminContext'
import ProtectedRoute from '../../src/components/ProtectedRoute'
import ModernAdminLayout from '../../src/components/Admin/ModernAdminLayout'

export default function AdminLayout({ children }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <AdminProvider>
      <ProtectedRoute>
        <ModernAdminLayout>{children}</ModernAdminLayout>
      </ProtectedRoute>
    </AdminProvider>
  )
}
