"use client"

import dynamic from 'next/dynamic'

// Dynamically import the professional account settings component with no SSR
const AccountSettingsProfessional = dynamic(() => import('@/components/account-settings-professional').then(mod => mod.AccountSettingsProfessional), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-4 w-96 bg-slate-800 rounded animate-pulse"></div>
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-slate-800 rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-slate-800 rounded animate-pulse"></div>
              <div className="space-y-3 pt-4">
                <div className="h-10 w-full bg-slate-800 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-slate-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default function AccountSettingsPage() {
  return <AccountSettingsProfessional />
}
