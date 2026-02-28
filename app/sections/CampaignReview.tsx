'use client'

import React from 'react'
import { FiBarChart2, FiTrendingUp, FiTarget, FiUsers, FiImage, FiRefreshCw, FiDownload, FiCopy, FiChevronDown, FiChevronUp, FiHash, FiEdit3, FiGlobe, FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface CampaignReviewProps {
  campaignData: Record<string, any> | null
  images: string[]
  onGenerateGraphics: () => void
  onBack: () => void
  graphicsLoading: boolean
  onCopy: (text: string) => void
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)
}

function ScoreGauge({ score, label, size = 'md' }: { score: number; label: string; size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 80 : 56
  const strokeW = size === 'md' ? 6 : 4
  const r = (dim - strokeW) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(score, 100) / 100) * circ
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444'

  return (
    <div className="flex flex-col items-center">
      <svg width={dim} height={dim} className="-rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="hsl(30 30% 90%)" strokeWidth={strokeW} />
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke={color} strokeWidth={strokeW} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <span className="text-lg font-bold text-foreground -mt-[calc(50%+0.5rem)] mb-4">{score}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function DifficultyBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-red-500' : value >= 50 ? 'bg-amber-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-7 text-right">{value}</span>
    </div>
  )
}

export default function CampaignReview({ campaignData, images, onGenerateGraphics, onBack, graphicsLoading, onCopy }: CampaignReviewProps) {
  const d = campaignData ?? {}
  const overview = d?.campaignOverview ?? {}
  const seo = d?.seoResults ?? {}
  const content = d?.contentResults ?? {}
  const competitor = d?.competitorResults ?? {}
  const keywords = Array.isArray(seo?.keywords) ? seo.keywords : []
  const recommendations = Array.isArray(seo?.recommendations) ? seo.recommendations : []
  const contentGapsSeo = Array.isArray(seo?.contentGaps) ? seo.contentGaps : []
  const longTailKws = Array.isArray(seo?.longTailKeywords) ? seo.longTailKeywords : []
  const competitors = Array.isArray(competitor?.competitors) ? competitor.competitors : []
  const compGaps = Array.isArray(competitor?.contentGaps) ? competitor.contentGaps : []
  const diffRecs = Array.isArray(competitor?.differentiationRecommendations) ? competitor.differentiationRecommendations : []
  const uniqueAngles = Array.isArray(competitor?.uniqueAngles) ? competitor.uniqueAngles : []
  const hashtags = Array.isArray(content?.social?.hashtags) ? content.social.hashtags : []
  const brandScore = content?.brandVoiceScore ?? 0
  const brandScoreOk = brandScore >= 70
  const safeImages = Array.isArray(images) ? images : []

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <FiArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">{overview?.topic ?? 'Campaign Review'}</h2>
            <p className="text-xs text-muted-foreground">Channels: {Array.isArray(overview?.channels) ? overview.channels.join(', ') : 'N/A'}</p>
          </div>
        </div>

        <div className={`rounded-xl p-3 mb-5 flex items-center gap-3 border ${brandScoreOk ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          {brandScoreOk ? <FiCheckCircle className="w-5 h-5 text-green-600" /> : <FiAlertCircle className="w-5 h-5 text-amber-600" />}
          <div>
            <span className={`text-sm font-semibold ${brandScoreOk ? 'text-green-700' : 'text-amber-700'}`}>Brand Voice Score: {brandScore}/100</span>
            {content?.brandVoiceNotes && <p className="text-xs text-muted-foreground mt-0.5">{content.brandVoiceNotes}</p>}
          </div>
          <Badge variant="outline" className="ml-auto">{brandScoreOk ? 'Pass' : 'Needs Review'}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* SEO Panel */}
          <Card className="border-border bg-card/80 backdrop-blur-md shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm"><FiTrendingUp className="w-4 h-4 text-primary" /> SEO Research</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <ScoreGauge score={seo?.optimizationScore ?? 0} label="SEO Score" />
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Keywords ({keywords.length})</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {keywords.map((kw, i) => (
                    <div key={i} className="p-2 rounded-lg bg-background border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{kw?.keyword ?? ''}</span>
                        <Badge variant="outline" className="text-[10px]">{kw?.intent ?? ''}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Vol: {kw?.searchVolume ?? 'N/A'}</span>
                      </div>
                      <DifficultyBar value={kw?.difficulty ?? 0} />
                    </div>
                  ))}
                </div>
              </div>
              {longTailKws.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Long-Tail Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {longTailKws.map((lt, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]"><FiHash className="w-2.5 h-2.5 mr-0.5" />{lt}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {recommendations.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {recommendations.map((r, i) => (
                      <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5"><FiCheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {contentGapsSeo.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Content Gaps</p>
                  <ul className="space-y-1">
                    {contentGapsSeo.map((g, i) => (
                      <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5"><FiAlertCircle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />{g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Panel */}
          <Card className="border-border bg-card/80 backdrop-blur-md shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm"><FiEdit3 className="w-4 h-4 text-primary" /> Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="blog" className="w-full">
                <TabsList className="w-full mb-3 grid grid-cols-3">
                  <TabsTrigger value="blog" className="text-xs"><FiEdit3 className="w-3 h-3 mr-1" />Blog</TabsTrigger>
                  <TabsTrigger value="social" className="text-xs"><FiGlobe className="w-3 h-3 mr-1" />Social</TabsTrigger>
                  <TabsTrigger value="email" className="text-xs"><FiMail className="w-3 h-3 mr-1" />Email</TabsTrigger>
                </TabsList>
                <TabsContent value="blog">
                  <ScrollArea className="h-[400px] pr-2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Headline</p>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{content?.blog?.headline ?? ''}</p>
                          <button onClick={() => onCopy(content?.blog?.headline ?? '')} className="p-1 rounded hover:bg-secondary flex-shrink-0"><FiCopy className="w-3 h-3 text-muted-foreground" /></button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Meta Description</p>
                        <p className="text-xs text-foreground/80 bg-background p-2 rounded-lg border border-border">{content?.blog?.metaDescription ?? ''}</p>
                      </div>
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-muted-foreground uppercase">Content</p>
                          <button onClick={() => onCopy(content?.blog?.content ?? '')} className="p-1 rounded hover:bg-secondary"><FiCopy className="w-3 h-3 text-muted-foreground" /></button>
                        </div>
                        <div className="prose prose-sm max-w-none">{renderMarkdown(content?.blog?.content ?? '')}</div>
                      </div>
                      {content?.blog?.cta && (
                        <div className="p-3 rounded-xl border-2 border-primary/20 bg-primary/5">
                          <p className="text-xs text-muted-foreground uppercase mb-1">Call to Action</p>
                          <p className="text-sm font-medium text-primary">{content.blog.cta}</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="social">
                  <ScrollArea className="h-[400px] pr-2">
                    <div className="space-y-3">
                      {[
                        { key: 'twitter', label: 'Twitter / X', icon: <FiGlobe className="w-3 h-3" /> },
                        { key: 'linkedin', label: 'LinkedIn', icon: <FiUsers className="w-3 h-3" /> },
                        { key: 'instagram', label: 'Instagram', icon: <FiImage className="w-3 h-3" /> },
                        { key: 'facebook', label: 'Facebook', icon: <FiGlobe className="w-3 h-3" /> },
                      ].map((platform) => {
                        const txt = content?.social?.[platform.key] ?? ''
                        if (!txt) return null
                        return (
                          <div key={platform.key} className="p-3 rounded-xl bg-background border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                {platform.icon}
                                <span className="text-xs font-medium">{platform.label}</span>
                              </div>
                              <button onClick={() => onCopy(txt)} className="p-1 rounded hover:bg-secondary"><FiCopy className="w-3 h-3 text-muted-foreground" /></button>
                            </div>
                            <p className="text-xs text-foreground/80 whitespace-pre-wrap">{txt}</p>
                          </div>
                        )
                      })}
                      {hashtags.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase mb-1.5">Hashtags</p>
                          <div className="flex flex-wrap gap-1">
                            {hashtags.map((h, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] cursor-pointer hover:bg-primary/10" onClick={() => onCopy(h)}>#{h}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="email">
                  <ScrollArea className="h-[400px] pr-2">
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-background border border-border">
                        <p className="text-xs text-muted-foreground uppercase mb-1">Subject Line</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">{content?.email?.subjectLine ?? ''}</p>
                          <button onClick={() => onCopy(content?.email?.subjectLine ?? '')} className="p-1 rounded hover:bg-secondary"><FiCopy className="w-3 h-3 text-muted-foreground" /></button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Preview Text</p>
                        <p className="text-xs text-foreground/80 italic">{content?.email?.previewText ?? ''}</p>
                      </div>
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-muted-foreground uppercase">Email Body</p>
                          <button onClick={() => onCopy(content?.email?.body ?? '')} className="p-1 rounded hover:bg-secondary"><FiCopy className="w-3 h-3 text-muted-foreground" /></button>
                        </div>
                        <div className="prose prose-sm max-w-none">{renderMarkdown(content?.email?.body ?? '')}</div>
                      </div>
                      {content?.email?.ctaText && (
                        <div className="p-3 rounded-xl border-2 border-primary/20 bg-primary/5 text-center">
                          <p className="text-sm font-medium text-primary">{content.email.ctaText}</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Competitor Panel */}
          <Card className="border-border bg-card/80 backdrop-blur-md shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm"><FiUsers className="w-4 h-4 text-primary" /> Competitor Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <ScoreGauge score={competitor?.competitiveDifficulty ?? 0} label="Difficulty" />
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Competitors ({competitors.length})</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {competitors.map((comp, i) => (
                    <CompetitorCard key={i} competitor={comp} />
                  ))}
                </div>
              </div>
              {compGaps.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Content Gaps</p>
                  <ul className="space-y-1">
                    {compGaps.map((g, i) => <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5"><FiTarget className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />{g}</li>)}
                  </ul>
                </div>
              )}
              {diffRecs.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Differentiation</p>
                  <ul className="space-y-1">
                    {diffRecs.map((r, i) => <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5"><FiCheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />{r}</li>)}
                  </ul>
                </div>
              )}
              {uniqueAngles.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Unique Angles</p>
                  <div className="flex flex-wrap gap-1">
                    {uniqueAngles.map((a, i) => <Badge key={i} variant="secondary" className="text-[10px]">{a}</Badge>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Graphics Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiImage className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Campaign Graphics</h3>
            </div>
            <Button onClick={onGenerateGraphics} disabled={graphicsLoading} className="text-primary-foreground" style={{ background: 'linear-gradient(135deg, hsl(24 95% 53%), hsl(12 80% 50%))' }}>
              {graphicsLoading ? <><FiRefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><FiImage className="w-4 h-4 mr-2" /> Generate Graphics</>}
            </Button>
          </div>
          {graphicsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-border bg-card/80">
                  <CardContent className="p-4">
                    <Skeleton className="w-full h-48 rounded-lg mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!graphicsLoading && safeImages.length === 0 && (
            <Card className="border-border border-dashed bg-card/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FiImage className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No graphics generated yet. Click above to create campaign visuals.</p>
              </CardContent>
            </Card>
          )}
          {!graphicsLoading && safeImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeImages.map((url, i) => (
                <Card key={i} className="border-border bg-card/80 backdrop-blur-md overflow-hidden group">
                  <div className="relative">
                    <img src={url} alt={`Campaign graphic ${i + 1}`} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={onGenerateGraphics} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"><FiRefreshCw className="w-4 h-4 text-white" /></button>
                      <a href={url} target="_blank" rel="noopener noreferrer" download className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"><FiDownload className="w-4 h-4 text-white" /></a>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Graphic {i + 1}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CompetitorCard({ competitor }: { competitor: Record<string, any> }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border border-border bg-background p-2">
        <CollapsibleTrigger className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiUsers className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">{competitor?.name ?? 'Unknown'}</span>
          </div>
          {open ? <FiChevronUp className="w-3 h-3 text-muted-foreground" /> : <FiChevronDown className="w-3 h-3 text-muted-foreground" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 space-y-1.5 text-[11px]">
            {competitor?.url && (
              <p className="text-primary truncate"><a href={competitor.url} target="_blank" rel="noopener noreferrer">{competitor.url}</a></p>
            )}
            {competitor?.strengths && <div><span className="text-muted-foreground">Strengths:</span> <span className="text-foreground/80">{competitor.strengths}</span></div>}
            {competitor?.weaknesses && <div><span className="text-muted-foreground">Weaknesses:</span> <span className="text-foreground/80">{competitor.weaknesses}</span></div>}
            {competitor?.contentApproach && <div><span className="text-muted-foreground">Approach:</span> <span className="text-foreground/80">{competitor.contentApproach}</span></div>}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
