'use client'

import React from 'react'
import { FiX, FiEdit3, FiGlobe, FiMail, FiSend, FiHash, FiLink } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface BrandSettings {
  voiceDescription: string
  defaultChannels: string[]
  toneAttributes: string[]
}

interface CampaignBriefProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (brief: { topic: string; channels: string[]; brandNotes: string; keywords: string[]; competitorUrls: string }) => void
  isGenerating: boolean
  generationStage: string
  brandSettings: BrandSettings
}

const CHANNEL_OPTIONS = [
  { key: 'Blog', icon: <FiEdit3 className="w-4 h-4" />, label: 'Blog Post' },
  { key: 'Social', icon: <FiGlobe className="w-4 h-4" />, label: 'Social Media' },
  { key: 'Email', icon: <FiMail className="w-4 h-4" />, label: 'Email Campaign' },
]

const PROGRESS_STAGES = [
  'Initializing campaign...',
  'Researching keywords...',
  'Analyzing competitors...',
  'Writing content...',
  'Scoring brand voice...',
  'Assembling campaign...',
]

export default function CampaignBrief({ isOpen, onClose, onSubmit, isGenerating, generationStage, brandSettings }: CampaignBriefProps) {
  const [topic, setTopic] = React.useState('')
  const [channels, setChannels] = React.useState<string[]>(brandSettings?.defaultChannels?.length ? brandSettings.defaultChannels : ['Blog', 'Social'])
  const [brandNotes, setBrandNotes] = React.useState(brandSettings?.voiceDescription ?? '')
  const [keywordInput, setKeywordInput] = React.useState('')
  const [keywords, setKeywords] = React.useState<string[]>([])
  const [competitorUrls, setCompetitorUrls] = React.useState('')

  const toggleChannel = (ch: string) => {
    setChannels((prev) => prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch])
  }

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const trimmed = keywordInput.trim().replace(/,+$/, '')
      if (trimmed && !keywords.includes(trimmed)) {
        setKeywords((prev) => [...prev, trimmed])
      }
      setKeywordInput('')
    }
  }

  const removeKeyword = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw))
  }

  const handleSubmit = () => {
    if (!topic.trim()) return
    onSubmit({ topic: topic.trim(), channels, brandNotes, keywords, competitorUrls })
  }

  const currentStageIndex = PROGRESS_STAGES.indexOf(generationStage)
  const progressPercent = currentStageIndex >= 0 ? ((currentStageIndex + 1) / PROGRESS_STAGES.length) * 100 : 10

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={isGenerating ? undefined : onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-card border-l border-border shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">New Campaign Brief</h2>
          {!isGenerating && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <FiX className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {isGenerating ? (
          <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, hsl(24, 95%, 53%), hsl(12, 80%, 50%))' }}>
                  <FiSend className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-center text-lg font-semibold text-foreground mb-2">Generating Campaign</h3>
              <p className="text-center text-sm text-muted-foreground mb-6">{generationStage || 'Initializing...'}</p>
              <div className="w-full bg-muted rounded-full h-2 mb-4 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, hsl(24, 95%, 53%), hsl(12, 80%, 50%))' }} />
              </div>
              <div className="space-y-2">
                {PROGRESS_STAGES.map((stage, i) => {
                  const isCurrent = stage === generationStage
                  const isDone = currentStageIndex > i
                  return (
                    <div key={stage} className={`flex items-center gap-2 text-xs transition-opacity ${isDone ? 'opacity-50' : isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-green-500' : isCurrent ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                      <span className={isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'}>{stage}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div>
              <Label htmlFor="topic" className="text-sm font-medium mb-1.5 block">Topic / Theme *</Label>
              <Input id="topic" placeholder="e.g., AI-Powered Customer Service Solutions" value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-background border-border" />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Target Channels *</Label>
              <div className="flex gap-2">
                {CHANNEL_OPTIONS.map((ch) => {
                  const isSelected = channels.includes(ch.key)
                  return (
                    <button key={ch.key} onClick={() => toggleChannel(ch.key)} className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${isSelected ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-border bg-background text-muted-foreground hover:border-primary/30'}`}>
                      {ch.icon}
                      {ch.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="brandNotes" className="text-sm font-medium mb-1.5 block">Brand Voice Notes</Label>
              <Textarea id="brandNotes" placeholder="Describe your brand voice, tone, and style preferences..." value={brandNotes} onChange={(e) => setBrandNotes(e.target.value)} rows={3} className="bg-background border-border resize-none" />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1.5 block">Target Keywords</Label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {keywords.map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-xs gap-1 pr-1">
                    <FiHash className="w-3 h-3" /> {kw}
                    <button onClick={() => removeKeyword(kw)} className="ml-0.5 p-0.5 rounded hover:bg-muted-foreground/20">
                      <FiX className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input placeholder="Type keyword and press Enter..." value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={addKeyword} className="bg-background border-border" />
            </div>

            <div>
              <Label htmlFor="competitors" className="text-sm font-medium mb-1.5 block">Competitor URLs (optional)</Label>
              <div className="relative">
                <FiLink className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea id="competitors" placeholder="https://competitor1.com&#10;https://competitor2.com" value={competitorUrls} onChange={(e) => setCompetitorUrls(e.target.value)} rows={3} className="bg-background border-border pl-9 resize-none" />
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={!topic.trim() || channels.length === 0} className="w-full text-primary-foreground font-medium py-5 shadow-lg hover:shadow-xl transition-all duration-300" style={{ background: 'linear-gradient(135deg, hsl(24, 95%, 53%), hsl(12, 80%, 50%))' }}>
              <FiSend className="w-4 h-4 mr-2" />
              Generate Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
