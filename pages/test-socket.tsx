// pages/test-socket.tsx
"use client"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export default function TestSocketPage() {
  const [status, setStatus] = useState<string>("Not connected")
  const [logs, setLogs] = useState<string[]>([])
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
    console.log(message)
  }

  useEffect(() => {
    addLog("Initializing socket test...")
    
    // Get token from cookies
    const getAuthToken = () => {
      const cookies = document.cookie.split(';')
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
      return tokenCookie ? tokenCookie.split('=')[1] : null
    }

    const token = getAuthToken()
    addLog(`Token found: ${token ? "Yes" : "No"}`)

    if (!token) {
      setStatus("❌ No authentication token")
      addLog("❌ No authentication token found in cookies")
      return
    }

    addLog("Connecting to socket server...")
    setStatus("Connecting...")

    const socket = io("http://localhost:3000", {
      path: "/api/socket",
      transports: ["websocket", "polling"],
      timeout: 10000,
      auth: {
        token: token
      }
    })

    socket.on("connect", () => {
      setStatus("✅ Connected")
      addLog(`✅ Socket connected: ${socket.id}`)
    })

    socket.on("disconnect", (reason) => {
      setStatus(`❌ Disconnected: ${reason}`)
      addLog(`❌ Socket disconnected: ${reason}`)
    })

    socket.on("connect_error", (error) => {
      setStatus(`❌ Error: ${error.message}`)
      addLog(`❌ Connection error: ${error.message}`)
      addLog(`Error details: ${JSON.stringify(error)}`)
    })

    return () => {
      socket.disconnect()
      addLog("Socket disconnected (cleanup)")
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Socket Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
          <div className={`p-4 rounded ${status.includes("✅") ? "bg-green-100 text-green-800" : status.includes("❌") ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
            {status}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}