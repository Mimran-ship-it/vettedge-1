"use client"

import dynamic from 'next/dynamic'

// Dynamically import the dashboard component with no SSR
const UserDashboard = dynamic(() => import('@/components/user-dashboard-professional').then(mod => mod.UserDashboardProfessional), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin full h-12 w-12 border-t-2 border-b-2 border-[#33BDC7]"></div>
    </div>
  )
})

export default function DashboardPage() {
  return <UserDashboard />
}