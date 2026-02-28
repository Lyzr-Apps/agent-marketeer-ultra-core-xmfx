'use client'

import dynamic from 'next/dynamic'

const ClientApp = dynamic(() => import('./sections/ClientApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-sunset animate-pulse" />
        <p className="text-sm text-muted-foreground">Loading Marketing Command Center...</p>
      </div>
    </div>
  ),
})

export default function Page() {
  return <ClientApp />
}
