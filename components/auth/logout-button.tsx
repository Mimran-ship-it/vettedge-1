"use client"

import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      window.location.href = '/auth/signin'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <Button onClick={handleLogout} variant="outline">
      Clear Token & Logout
    </Button>
  )
}
