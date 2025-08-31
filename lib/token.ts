// lib/token.ts
import { NextRequest } from "next/server"

/**
 * Extracts JWT token from a request, checking both Authorization header and cookies
 * @param request The incoming request object
 * @returns The JWT token string or null if not found
 */
export function getAuthToken(request: NextRequest): string | null {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    console.log("✅ Token found in Authorization header")
    return token
  }
  
  // Fall back to cookies
  const cookieHeader = request.headers.get("cookie")
  if (cookieHeader) {
    const cookies = cookieHeader.split(";")
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith("token="))
    if (tokenCookie) {
      const token = tokenCookie.split("=")[1].trim()
      console.log("✅ Token found in cookies")
      return token
    }
  }
  
  console.log("❌ No token found in request")
  return null
}

/**
 * Extracts JWT token from a socket handshake
 * @param handshake The socket handshake object
 * @returns The JWT token string or null if not found
 */
export function getSocketToken(handshake: any): string | null {
  // Socket.IO typically sends token in auth object
  if (handshake.auth && handshake.auth.token) {
    console.log("✅ Token found in socket handshake auth")
    return handshake.auth.token
  }
  
  // Fall back to headers (for long-polling)
  if (handshake.headers && handshake.headers.cookie) {
    const cookies = handshake.headers.cookie.split(";")
    const tokenCookie = cookies.find((cookie: string) => cookie.trim().startsWith("token="))
    if (tokenCookie) {
      const token = tokenCookie.split("=")[1].trim()
      console.log("✅ Token found in socket handshake cookies")
      return token
    }
  }
  
  console.log("❌ No token found in socket handshake")
  return null
}