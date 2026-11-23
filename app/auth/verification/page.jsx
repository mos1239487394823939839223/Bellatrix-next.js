'use client'
import { Suspense } from 'react'
import Verification from '../../../src/views/auth/Verification'

export default function VerificationPage() {
  return (
    <Suspense>
      <Verification />
    </Suspense>
  )
}
