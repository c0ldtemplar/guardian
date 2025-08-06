"use client"

import { LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  onLogout: () => void
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('guardian-session')
    onLogout()
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      className="h-10 w-10 text-gray-600 hover:text-red-600"
      title="Cerrar Sesión"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  )
}
