'use client'

import React from 'react'
import { FiCheck, FiEdit3, FiGlobe, FiMail } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export interface BrandSettingsData {
  voiceDescription: string
  defaultChannels: string[]
  toneAttributes: string[]
}

interface BrandSettingsProps {
  settings: BrandSettingsData
  onSave: (settings: BrandSettingsData) => void
}

const TONE_OPTIONS = ['Professional', 'Casual', 'Bold', 'Friendly', 'Authoritative', 'Innovative', 'Playful', 'Empathetic', 'Minimalist', 'Luxury']
const CHANNEL_OPTIONS = [
  { key: 'Blog', icon: <FiEdit3 className="w-4 h-4" />, label: 'Blog' },
  { key: 'Social', icon: <FiGlobe className="w-4 h-4" />, label: 'Social' },
  { key: 'Email', icon: <FiMail className="w-4 h-4" />, label: 'Email' },
]

export default function BrandSettings({ settings, onSave }: BrandSettingsProps) {
  const [voiceDesc, setVoiceDesc] = React.useState(settings.voiceDescription)
  const [channels, setChannels] = React.useState<string[]>(settings.defaultChannels)
  const [tones, setTones] = React.useState<string[]>(settings.toneAttributes)
  const [saved, setSaved] = React.useState(false)

  const toggleChannel = (ch: string) => {
    setChannels((prev) => prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch])
  }

  const toggleTone = (tone: string) => {
    setTones((prev) => prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone])
  }

  const handleSave = () => {
    onSave({ voiceDescription: voiceDesc, defaultChannels: channels, toneAttributes: tones })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">Brand Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure your brand voice and defaults for all campaigns</p>
        </div>

        <div className="space-y-6">
          <Card className="border-border bg-card/80 backdrop-blur-md shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Brand Voice Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={voiceDesc} onChange={(e) => setVoiceDesc(e.target.value)} placeholder="Describe your brand's voice, personality, and communication style..." rows={4} className="bg-background border-border resize-none" />
              <p className="text-xs text-muted-foreground mt-2">This will be included in every campaign brief to maintain consistency.</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 backdrop-blur-md shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Default Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {CHANNEL_OPTIONS.map((ch) => {
                  const isSelected = channels.includes(ch.key)
                  return (
                    <button key={ch.key} onClick={() => toggleChannel(ch.key)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/30'}`}>
                      {ch.icon}
                      {ch.label}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 backdrop-blur-md shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tone Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((tone) => {
                  const isSelected = tones.includes(tone)
                  return (
                    <button key={tone} onClick={() => toggleTone(tone)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/30'}`}>
                      {tone}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Select attributes that describe your brand's tone of voice.</p>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} className="bg-gradient-sunset text-primary-foreground font-medium px-8 shadow-lg">
              {saved ? <><FiCheck className="w-4 h-4 mr-2" /> Saved</> : 'Save Settings'}
            </Button>
            {saved && <span className="text-sm text-green-600 font-medium">Settings saved successfully</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
