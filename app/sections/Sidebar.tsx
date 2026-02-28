'use client'

import React from 'react'
import { FiLayout, FiTarget, FiSettings, FiActivity, FiCircle } from 'react-icons/fi'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export type NavView = 'dashboard' | 'review' | 'settings'

interface AgentStatus {
  id: string
  name: string
  active: boolean
}

interface SidebarProps {
  currentView: NavView
  onNavigate: (view: NavView) => void
  agents: AgentStatus[]
  activeCampaignName: string | null
  recentCampaigns: { id: string; topic: string; status: string }[]
}

export default function Sidebar({ currentView, onNavigate, agents, activeCampaignName, recentCampaigns }: SidebarProps) {
  const navItems: { view: NavView; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <FiLayout className="w-4 h-4" /> },
    { view: 'review', label: 'Campaigns', icon: <FiTarget className="w-4 h-4" /> },
    { view: 'settings', label: 'Brand Settings', icon: <FiSettings className="w-4 h-4" /> },
  ]

  return (
    <div className="w-64 h-screen flex-shrink-0 border-r border-border flex flex-col" style={{ background: 'hsl(30, 38%, 95%)' }}>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(24, 95%, 53%), hsl(12, 80%, 50%))' }}>
            <FiTarget className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground tracking-tight">Marketing</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Command Center</p>
          </div>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${currentView === item.view ? 'text-primary-foreground shadow-md' : 'text-foreground/70 hover:bg-secondary hover:text-foreground'}`}
            style={currentView === item.view ? { background: 'linear-gradient(135deg, hsl(24, 95%, 53%), hsl(12, 80%, 50%))' } : undefined}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <Separator />

      <div className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Recent Campaigns</p>
        <ScrollArea className="h-32">
          <div className="space-y-1.5">
            {recentCampaigns.length === 0 && (
              <p className="text-xs text-muted-foreground italic">No campaigns yet</p>
            )}
            {recentCampaigns.map((c) => (
              <button
                key={c.id}
                onClick={() => onNavigate('review')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-foreground/80 hover:bg-secondary transition-colors text-left"
              >
                <FiCircle className={`w-2 h-2 flex-shrink-0 ${c.status === 'complete' ? 'text-green-500' : 'text-amber-500'}`} />
                <span className="truncate">{c.topic}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {activeCampaignName && (
        <>
          <div className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Active Campaign</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-foreground truncate">{activeCampaignName}</span>
            </div>
          </div>
          <Separator />
        </>
      )}

      <div className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Agents</p>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-2">
              <FiActivity className={`w-3 h-3 ${agent.active ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
              <span className="text-xs text-foreground/80 truncate">{agent.name}</span>
              {agent.active && <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/30 text-primary">Active</Badge>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
