'use client'
import { Suspense } from 'react'
import ResetPassword from '../../../src/page-components/auth/ResetPassword'

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  )
}
