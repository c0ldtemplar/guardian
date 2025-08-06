"use client"

import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "./loading-spinner"
import { cn } from '@/lib/utils'

interface LoadingButtonProps {
  loading?: boolean
  loadingText?: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  className,
  variant = "default",
  size = "default",
  onClick,
  disabled,
  type = "button",
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={cn(className)}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          {loadingText || 'Cargando...'}
        </div>
      ) : (
        children
      )}
    </Button>
  )
}
