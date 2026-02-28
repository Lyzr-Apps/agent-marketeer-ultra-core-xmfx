'use client'

import React from 'react'
import { FiPlus, FiSearch, FiBarChart2, FiGlobe, FiMail, FiEdit3, FiFilter, FiTarget } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export interface CampaignData {
  id: string
  topic: string
  channels: string[]
  status: 'draft' | 'generating' | 'complete'
  overallQualityScore: number
  seoScore: number
  brandVoiceScore: number
  createdAt: string
  data?: Record<string, any>
  images?: string[]
}

interface CampaignDashboardProps {
  campaigns: CampaignData[]
  onNewCampaign: () => void
  onSelectCampaign: (id: string) => void
  showSample: boolean
  onToggleSample: (val: boolean) => void
  loading: boolean
}

function getChannelIcon(channel: string) {
  const lower = channel.toLowerCase()
  if (lower.includes('blog')) return <FiEdit3 className="w-3 h-3" />
  if (lower.includes('social')) return <FiGlobe className="w-3 h-3" />
  if (lower.includes('email')) return <FiMail className="w-3 h-3" />
  return <FiBarChart2 className="w-3 h-3" />
}

function ScoreChip({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? 'text-green-600 bg-green-50 border-green-200' : score >= 60 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-200'
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${color}`}>
      <FiBarChart2 className="w-3 h-3" />
      {label}: {score}
    </span>
  )
}

export default function CampaignDashboard({ campaigns, onNewCampaign, onSelectCampaign, showSample, onToggleSample, loading }: CampaignDashboardProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterStatus, setFilterStatus] = React.useState<string>('all')

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Campaign Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">Create and manage your marketing campaigns</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="sample-toggle" checked={showSample} onCheckedChange={onToggleSample} />
              <Label htmlFor="sample-toggle" className="text-sm text-muted-foreground">Sample Data</Label>
            </div>
            <Button onClick={onNewCampaign} className="text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300" style={{ background: 'linear-gradient(135deg, hsl(24 95% 53%), hsl(12 80% 50%))' }}>
              <FiPlus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search campaigns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-card border-border" />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="w-4 h-4 text-muted-foreground" />
            {['all', 'draft', 'generating', 'complete'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border bg-card/80 backdrop-blur-md">
                <CardContent className="p-5">
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <Card className="border-border bg-card/60 backdrop-blur-md border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-primary/10">
                <FiTarget className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No campaigns yet</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                Create your first marketing campaign to generate SEO-optimized content, social posts, and competitor analysis.
              </p>
              <Button onClick={onNewCampaign} className="text-primary-foreground" style={{ background: 'linear-gradient(135deg, hsl(24 95% 53%), hsl(12 80% 50%))' }}>
                <FiPlus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((campaign) => (
              <Card key={campaign.id} onClick={() => onSelectCampaign(campaign.id)} className="border-border bg-card/80 backdrop-blur-md cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate pr-2">{campaign.topic}</h3>
                    <Badge variant={campaign.status === 'complete' ? 'default' : campaign.status === 'generating' ? 'secondary' : 'outline'} className="text-[10px] flex-shrink-0">
                      {campaign.status === 'complete' ? 'Complete' : campaign.status === 'generating' ? 'Generating' : 'Draft'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {Array.isArray(campaign.channels) && campaign.channels.map((ch, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {getChannelIcon(ch)} {ch}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {campaign.overallQualityScore > 0 && <ScoreChip score={campaign.overallQualityScore} label="Quality" />}
                    {campaign.seoScore > 0 && <ScoreChip score={campaign.seoScore} label="SEO" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3">{campaign.createdAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
