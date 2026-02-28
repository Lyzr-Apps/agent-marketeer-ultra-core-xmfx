'use client'

import React, { useState, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import Sidebar, { NavView } from './sections/Sidebar'
import CampaignDashboard, { CampaignData } from './sections/CampaignDashboard'
import CampaignBrief from './sections/CampaignBrief'
import CampaignReview from './sections/CampaignReview'
import BrandSettings, { BrandSettingsData } from './sections/BrandSettings'

const MANAGER_AGENT_ID = '69a27ba3f18a4f26754c8ada'
const GRAPHIC_AGENT_ID = '69a27bb2d6fa89687c20af7b'

const THEME_CSS = `:root{--background:30 40% 98%;--foreground:20 40% 10%;--card:30 40% 96%;--card-foreground:20 40% 10%;--primary:24 95% 53%;--primary-foreground:30 40% 98%;--secondary:30 35% 92%;--secondary-foreground:20 40% 15%;--accent:12 80% 50%;--accent-foreground:30 40% 98%;--muted:30 30% 90%;--muted-foreground:20 25% 45%;--border:30 35% 88%;--input:30 30% 80%;--ring:24 95% 53%;--destructive:0 84% 60%;--radius:0.875rem;}`

const SAMPLE_CAMPAIGNS: CampaignData[] = [
  {
    id: 'sample-1',
    topic: 'AI-Powered Customer Service Solutions',
    channels: ['Blog', 'Social', 'Email'],
    status: 'complete',
    overallQualityScore: 87,
    seoScore: 82,
    brandVoiceScore: 91,
    createdAt: 'Feb 25, 2026',
    data: {
      campaignOverview: { topic: 'AI-Powered Customer Service Solutions', channels: ['Blog', 'Social', 'Email'], overallQualityScore: 87 },
      seoResults: {
        keywords: [
          { keyword: 'AI customer service', searchVolume: '12,100', difficulty: 65, intent: 'Informational' },
          { keyword: 'chatbot for business', searchVolume: '8,200', difficulty: 58, intent: 'Commercial' },
          { keyword: 'automated support tools', searchVolume: '3,600', difficulty: 42, intent: 'Transactional' },
        ],
        optimizationScore: 82,
        recommendations: ['Include comparison tables for top AI tools', 'Add FAQ schema markup', 'Target featured snippet with definition paragraph'],
        contentGaps: ['ROI calculator for AI support', 'Industry-specific use cases'],
        longTailKeywords: ['best AI customer service platform 2026', 'how to implement AI chatbot', 'AI vs human support comparison'],
      },
      contentResults: {
        blog: { headline: 'How AI is Revolutionizing Customer Service in 2026', metaDescription: 'Discover how AI-powered tools are transforming customer support with faster responses, lower costs, and higher satisfaction scores.', content: '## The Rise of AI in Customer Service\n\nArtificial intelligence is no longer a futuristic concept. Today, **over 67% of enterprises** have deployed some form of AI in their customer service operations.\n\n### Key Benefits\n\n- **24/7 availability** without additional staffing costs\n- **Instant response times** reducing customer wait from minutes to seconds\n- **Consistent quality** across all customer interactions\n- **Scalability** during peak demand periods\n\n### Implementation Guide\n\n1. Audit your current support workflow\n2. Identify repetitive queries suitable for automation\n3. Select an AI platform that integrates with your stack\n4. Train the model on your knowledge base\n5. Deploy with human escalation paths', cta: 'Start your free AI support trial today' },
        social: { twitter: 'AI is changing how businesses handle customer support. 67% of enterprises are already using AI tools. Are you? #AISupport #CustomerService', linkedin: 'The future of customer service is here. Our latest research shows how AI-powered tools can reduce response times by 80% while improving customer satisfaction scores. Read our comprehensive guide to implementing AI in your support workflow.', instagram: 'Imagine never waiting on hold again. AI customer service is making that a reality for millions. Swipe to see the top 5 benefits of AI-powered support.', facebook: 'Is your business ready for the AI customer service revolution? Our new guide breaks down everything you need to know about implementing AI support tools.', hashtags: ['AICustomerService', 'FutureOfSupport', 'CustomerExperience', 'TechInnovation', 'BusinessAutomation'] },
        email: { subjectLine: 'Your customers are waiting... but they should not have to', previewText: 'See how AI reduces wait times by 80%', body: '## Hi there,\n\nDid you know that **73% of customers** say that valuing their time is the most important thing a company can do?\n\nWith AI-powered customer service, you can:\n\n- Respond to queries in **under 3 seconds**\n- Handle **10x more conversations** simultaneously\n- Reduce support costs by **up to 40%**\n\nOur comprehensive guide walks you through every step of implementing AI in your support workflow.', ctaText: 'Download the Free Guide' },
        brandVoiceScore: 91,
        brandVoiceNotes: 'Content maintains professional yet approachable tone. Good use of data-driven claims with supporting statistics.',
      },
      competitorResults: {
        competitors: [
          { name: 'Zendesk', url: 'https://zendesk.com', strengths: 'Strong brand recognition, comprehensive platform', weaknesses: 'Complex pricing, steep learning curve', contentApproach: 'Enterprise-focused thought leadership' },
          { name: 'Intercom', url: 'https://intercom.com', strengths: 'Modern UI, strong messaging features', weaknesses: 'Expensive for small teams, limited AI depth', contentApproach: 'Product-led content with demos' },
        ],
        competitiveDifficulty: 72,
        contentGaps: ['Comparison of AI accuracy rates across platforms', 'Small business implementation playbook'],
        differentiationRecommendations: ['Focus on ease of implementation', 'Highlight cost savings with concrete ROI data', 'Create interactive AI readiness assessment'],
        uniqueAngles: ['AI ethics in customer service', 'Hybrid AI-human support models', 'Industry-specific AI training'],
      },
    },
    images: [],
  },
  {
    id: 'sample-2',
    topic: 'Sustainable Fashion Trends 2026',
    channels: ['Blog', 'Social'],
    status: 'complete',
    overallQualityScore: 79,
    seoScore: 74,
    brandVoiceScore: 85,
    createdAt: 'Feb 22, 2026',
    data: null,
    images: [],
  },
  {
    id: 'sample-3',
    topic: 'Remote Work Productivity Tools',
    channels: ['Email'],
    status: 'draft',
    overallQualityScore: 0,
    seoScore: 0,
    brandVoiceScore: 0,
    createdAt: 'Feb 20, 2026',
    data: null,
    images: [],
  },
]

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function Page() {
  const [currentView, setCurrentView] = useState<NavView>('dashboard')
  const [showSample, setShowSample] = useState(false)
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [briefOpen, setBriefOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStage, setGenerationStage] = useState('')
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [graphicsLoading, setGraphicsLoading] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [brandSettings, setBrandSettings] = useState<BrandSettingsData>({
    voiceDescription: 'Professional, data-driven, and approachable. We speak with authority while remaining accessible to all audiences.',
    defaultChannels: ['Blog', 'Social'],
    toneAttributes: ['Professional', 'Innovative'],
  })

  const displayCampaigns = showSample ? [...SAMPLE_CAMPAIGNS, ...campaigns] : campaigns
  const selectedCampaign = displayCampaigns.find((c) => c.id === selectedCampaignId) ?? null

  const agents = [
    { id: MANAGER_AGENT_ID, name: 'Campaign Coordinator', active: activeAgentId === MANAGER_AGENT_ID },
    { id: GRAPHIC_AGENT_ID, name: 'Graphic Design Agent', active: activeAgentId === GRAPHIC_AGENT_ID },
  ]

  const recentCampaigns = displayCampaigns.slice(0, 5).map((c) => ({
    id: c.id,
    topic: c.topic,
    status: c.status,
  }))

  const handleNewCampaign = useCallback(() => {
    setBriefOpen(true)
    setError(null)
  }, [])

  const handleSelectCampaign = useCallback((id: string) => {
    setSelectedCampaignId(id)
    setCurrentView('review')
    setError(null)
  }, [])

  const handleGenerateCampaign = useCallback(async (brief: { topic: string; channels: string[]; brandNotes: string; keywords: string[]; competitorUrls: string }) => {
    setIsGenerating(true)
    setError(null)
    setActiveAgentId(MANAGER_AGENT_ID)

    const newId = `campaign-${Date.now()}`
    const newCampaign: CampaignData = {
      id: newId,
      topic: brief.topic,
      channels: brief.channels,
      status: 'generating',
      overallQualityScore: 0,
      seoScore: 0,
      brandVoiceScore: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      data: null,
      images: [],
    }
    setCampaigns((prev) => [newCampaign, ...prev])

    const stages = ['Researching keywords...', 'Analyzing competitors...', 'Writing content...', 'Scoring brand voice...', 'Assembling campaign...']
    let stageIdx = 0
    setGenerationStage('Initializing campaign...')
    const stageInterval = setInterval(() => {
      if (stageIdx < stages.length) {
        setGenerationStage(stages[stageIdx])
        stageIdx++
      }
    }, 3000)

    const message = `Campaign Brief:\nTopic: ${brief.topic}\nTarget Channels: ${brief.channels.join(', ')}\nBrand Voice: ${brief.brandNotes}\nTarget Keywords: ${brief.keywords.join(', ')}\nCompetitor URLs: ${brief.competitorUrls}\n\nBrand Guidelines:\n${brandSettings.voiceDescription}\nTone: ${brandSettings.toneAttributes.join(', ')}`

    try {
      const result = await callAIAgent(message, MANAGER_AGENT_ID)
      clearInterval(stageInterval)
      setActiveAgentId(null)

      if (result.success) {
        const data = result?.response?.result ?? {}
        const qualityScore = data?.campaignOverview?.overallQualityScore ?? 0
        const seoScore = data?.seoResults?.optimizationScore ?? 0
        const bvScore = data?.contentResults?.brandVoiceScore ?? 0

        setCampaigns((prev) => prev.map((c) => c.id === newId ? { ...c, status: 'complete' as const, overallQualityScore: qualityScore, seoScore, brandVoiceScore: bvScore, data } : c))
        setSelectedCampaignId(newId)
        setCurrentView('review')
      } else {
        setError(result?.error ?? 'Campaign generation failed. Please try again.')
        setCampaigns((prev) => prev.map((c) => c.id === newId ? { ...c, status: 'draft' as const } : c))
      }
    } catch (e) {
      clearInterval(stageInterval)
      setActiveAgentId(null)
      setError('An unexpected error occurred. Please try again.')
      setCampaigns((prev) => prev.map((c) => c.id === newId ? { ...c, status: 'draft' as const } : c))
    }

    setIsGenerating(false)
    setGenerationStage('')
    setBriefOpen(false)
  }, [brandSettings])

  const handleGenerateGraphics = useCallback(async () => {
    if (!selectedCampaign?.data) return
    setGraphicsLoading(true)
    setError(null)
    setActiveAgentId(GRAPHIC_AGENT_ID)

    const cd = selectedCampaign.data
    const message = `Generate marketing graphics for the following campaign:\nTopic: ${cd?.campaignOverview?.topic ?? selectedCampaign.topic}\nChannels: ${Array.isArray(cd?.campaignOverview?.channels) ? cd.campaignOverview.channels.join(', ') : selectedCampaign.channels.join(', ')}\nBlog Headline: ${cd?.contentResults?.blog?.headline ?? ''}\nKey Message: ${cd?.contentResults?.blog?.metaDescription ?? ''}\nBrand Voice: ${brandSettings.voiceDescription}\n\nGenerate campaign graphics with dimensions appropriate for each channel.`

    try {
      const result = await callAIAgent(message, GRAPHIC_AGENT_ID)
      setActiveAgentId(null)

      if (result.success) {
        const artifactFiles = Array.isArray(result?.module_outputs?.artifact_files) ? result.module_outputs.artifact_files : []
        const urls = artifactFiles.map((f: Record<string, any>) => f?.file_url ?? '').filter((u: string) => u.length > 0)

        if (urls.length > 0 && selectedCampaignId) {
          setCampaigns((prev) => prev.map((c) => c.id === selectedCampaignId ? { ...c, images: [...(Array.isArray(c.images) ? c.images : []), ...urls] } : c))
        }
      } else {
        setError(result?.error ?? 'Graphics generation failed.')
      }
    } catch (e) {
      setActiveAgentId(null)
      setError('An unexpected error occurred generating graphics.')
    }

    setGraphicsLoading(false)
  }, [selectedCampaign, selectedCampaignId, brandSettings])

  const handleCopy = useCallback((text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
  }, [])

  const handleNavigate = useCallback((view: NavView) => {
    setCurrentView(view)
    setError(null)
    if (view === 'dashboard') {
      setSelectedCampaignId(null)
    }
  }, [])

  return (
    <ErrorBoundary>
      <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />
      <div className="min-h-screen bg-background text-foreground flex font-sans">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          agents={agents}
          activeCampaignName={isGenerating ? 'Generating...' : selectedCampaign?.topic ?? null}
          recentCampaigns={recentCampaigns}
        />

        <main className="flex-1 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(30, 50%, 97%) 0%, hsl(20, 45%, 95%) 35%, hsl(40, 40%, 96%) 70%, hsl(15, 35%, 97%) 100%)' }}>
          {error && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError(null)} className="text-xs text-red-500 hover:text-red-700 font-medium">Dismiss</button>
            </div>
          )}

          {currentView === 'dashboard' && (
            <CampaignDashboard
              campaigns={displayCampaigns}
              onNewCampaign={handleNewCampaign}
              onSelectCampaign={handleSelectCampaign}
              showSample={showSample}
              onToggleSample={setShowSample}
              loading={false}
            />
          )}

          {currentView === 'review' && selectedCampaign && (
            <CampaignReview
              campaignData={selectedCampaign.data}
              images={Array.isArray(selectedCampaign.images) ? selectedCampaign.images : []}
              onGenerateGraphics={handleGenerateGraphics}
              onBack={() => handleNavigate('dashboard')}
              graphicsLoading={graphicsLoading}
              onCopy={handleCopy}
            />
          )}

          {currentView === 'review' && !selectedCampaign && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-3">No campaign selected</p>
                <button onClick={() => handleNavigate('dashboard')} className="text-sm text-primary font-medium hover:underline">Go to Dashboard</button>
              </div>
            </div>
          )}

          {currentView === 'settings' && (
            <BrandSettings settings={brandSettings} onSave={setBrandSettings} />
          )}
        </main>

        <CampaignBrief
          isOpen={briefOpen}
          onClose={() => setBriefOpen(false)}
          onSubmit={handleGenerateCampaign}
          isGenerating={isGenerating}
          generationStage={generationStage}
          brandSettings={brandSettings}
        />
      </div>
    </ErrorBoundary>
  )
}
