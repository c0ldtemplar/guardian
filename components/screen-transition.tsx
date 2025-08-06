"use client"

import { useEffect, useState } from 'react'
import { LoadingSpinner } from './loading-spinner'

interface ScreenTransitionProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
}

export function ScreenTransition({ isLoading, children, loadingText = "Cargando..." }: ScreenTransitionProps) {
  const [showContent, setShowContent] = useState(!isLoading)

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isLoading])

  if (isLoading || !showContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="xl" />
          <p className="text-2xl font-semibold text-gray-700">{loadingText}</p>
        </div>
      </div>
    )
  }

  return <div className="animate-in fade-in duration-300">{children}</div>
}
