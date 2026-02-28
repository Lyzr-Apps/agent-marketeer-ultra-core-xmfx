'use client'

import dynamic from 'next/dynamic'

const ClientApp = dynamic(() => import('./sections/ClientApp'), { ssr: false })

export default function Page() {
  return <ClientApp />
}
