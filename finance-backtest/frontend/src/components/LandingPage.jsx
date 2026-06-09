import React, { useState, useEffect, useMemo } from 'react'
import {
  Terminal, Sliders, Sparkles, LineChart as ChartIcon,
  Activity, ShieldAlert, ArrowRight, Lock, Eye,
  RefreshCw, Play, Check, Server, Layers, Cpu,
  Database, HelpCircle, Menu, X, ChevronRight,
  Building2, Landmark, Wallet, Twitter, Github
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceArea
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { TextEffect } from '@/components/ui/text-effect'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import FUIBentoGridDark from '@/components/ui/bento'
import { BackgroundPaths } from '@/components/ui/background-paths'
import { Features8 } from '@/components/ui/features-8'
import { MissionStatement } from '@/components/ui/mission-statement'
import { Footer } from '@/components/ui/footer'
import appScreenshot from '../screenshot_full.png'
import stratumLogo from '../Phineus-Logo.jpg'

const BASE_NOISE = [
  -0.1, 0.25, -0.15, 0.3, -0.05, 0.12, -0.22, 0.35, -0.08, 0.18,
  -0.3, 0.42, -0.05, 0.15, -0.12, 0.28, -0.18, 0.05, -0.02, 0.22,
  -0.15, 0.32, -0.25, 0.45, -0.1, 0.2, -0.05, 0.15, -0.28, 0.38,
  -0.12, 0.24, -0.18, 0.08, -0.05, 0.32, -0.15, 0.22, -0.35, 0.48,
  -0.08, 0.16, -0.12, 0.28, -0.22, 0.38, -0.05, 0.12, -0.18, 0.25,
  -0.1, 0.32, -0.15, 0.22, -0.08, 0.18, -0.25, 0.35, -0.12, 0.42
]

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export default function LandingPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Simulator State
  const [momentum, setMomentum] = useState(50)
  const [value, setValue] = useState(30)
  const [volatility, setVolatility] = useState(20)
  const [quality, setQuality] = useState(0)
  const [hasQualityFactor, setHasQualityFactor] = useState(false)

  // Additional Advanced Features States
  const [copilotPrompt, setCopilotPrompt] = useState("")
  const [copilotLogs, setCopilotLogs] = useState([
    "Copilot online. Ready to synthesize alpha formulas...",
    "Supported keywords: ROIC, debt-to-equity, free-cash-flow, PE-ratio."
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [shockMode, setShockMode] = useState("none")
  const [isMonteCarlo, setIsMonteCarlo] = useState(false)
  const [isWfaActive, setIsWfaActive] = useState(false)
  const [formula, setFormula] = useState("0.4 * MOM + 0.3 * VAL + 0.3 * VOL")
  const [formulaStatus, setFormulaStatus] = useState("")

  // Animated Terminal State (Home Tab)
  const [logs, setLogs] = useState([])
  const logQueue = useMemo(() => [
    'Initializing Stratum kernel...',
    'Connecting to factor market data pipelines (IEX, AlphaVantage, Quandl)...',
    'Loading fundamental and technical factor databases... OK (12,450 tickers)',
    'Compiling vector space for Momentum (MOM), Value (B/M), and Volatility (VOL)...',
    'Pre-heating evaluation clusters...',
    'System ready. Standing by for quantitative strategy parameters...'
  ], [])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < logQueue.length) {
        setLogs(prev => [...prev, logQueue[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 800)
    return () => clearInterval(interval)
  }, [logQueue])

  // Periodic log simulator when sliders are adjusted
  const triggerSimulationLog = (factorName, val) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMsg = `[${timestamp}] REBALANCING: Factor '${factorName.toUpperCase()}' adjusted to ${val}%. Re-running multi-factor evaluation...`
    setLogs(prev => {
      const next = [...prev, logMsg]
      if (next.length > 8) next.shift() // keep terminal readable
      return next
    })
  }

  // Dynamic Portfolio Equity Curve calculations
  const chartData = useMemo(() => {
    const dataPoints = []
    let balance = 100000 // Initial capital: $100k
    let spyBalance = 100000
    let balanceMin = 100000
    let balanceMax = 100000

    const momWeight = momentum / 100
    const valWeight = value / 100
    const volWeight = volatility / 100
    const qualWeight = hasQualityFactor ? quality / 100 : 0
    const totalWeight = momWeight + valWeight + volWeight + qualWeight || 1

    const nMom = momWeight / totalWeight
    const nVal = valWeight / totalWeight
    const nVol = volWeight / totalWeight
    const nQual = qualWeight / totalWeight

    const expectedCagr = 0.05 + (nMom * 0.18) + (nVal * 0.10) - (nVol * 0.03) + (nQual * 0.15)
    const expectedVol = 0.08 + (nMom * 0.14) - (nVal * 0.03) + (nVol * 0.07) + (nQual * 0.05)
    
    const spyCagr = 0.09
    const spyVol = 0.15

    const months = 60
    const startDate = new Date(2021, 0, 1)

    for (let i = 0; i < months; i++) {
      const dateLabel = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
        .toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

      const noiseFactor = BASE_NOISE[i % BASE_NOISE.length]

      let shockVal = 0
      let spyShock = 0

      if (shockMode === '2008') {
        if (i >= 20 && i <= 32) {
          shockVal = -(expectedVol * 0.16 + 0.025)
          spyShock = -0.045
        }
      } else if (shockMode === '2020') {
        if (i >= 42 && i <= 44) {
          shockVal = -0.11
          spyShock = -0.12
        } else if (i >= 45 && i <= 48) {
          shockVal = 0.12
          spyShock = 0.11
        }
      }

      const monthlyReturn = (expectedCagr / 12) + (noiseFactor * (expectedVol / Math.sqrt(12))) + shockVal
      balance = balance * (1 + monthlyReturn)

      const spyMonthlyReturn = (spyCagr / 12) + (noiseFactor * (spyVol / Math.sqrt(12))) + spyShock
      spyBalance = spyBalance * (1 + spyMonthlyReturn)

      let minVal = Math.round(balance)
      let maxVal = Math.round(balance)

      if (isMonteCarlo) {
        const minMonthlyReturn = (expectedCagr * 0.5 / 12) + (noiseFactor * (expectedVol * 1.3 / Math.sqrt(12))) + shockVal - 0.004
        balanceMin = balanceMin * (1 + minMonthlyReturn)
        minVal = Math.round(balanceMin)

        const maxMonthlyReturn = (expectedCagr * 1.4 / 12) + (noiseFactor * (expectedVol * 0.7 / Math.sqrt(12))) + shockVal + 0.004
        balanceMax = balanceMax * (1 + maxMonthlyReturn)
        maxVal = Math.round(balanceMax)
      } else {
        balanceMin = balance
        balanceMax = balance
      }

      dataPoints.push({
        date: dateLabel,
        Strategy: Math.round(balance),
        SPY: Math.round(spyBalance),
        StrategyMin: minVal,
        StrategyMax: maxVal
      })
    }

    return dataPoints
  }, [momentum, value, volatility, quality, hasQualityFactor, shockMode, isMonteCarlo])

  // Calculate final KPIs for display
  const metrics = useMemo(() => {
    const momWeight = momentum / 100
    const valWeight = value / 100
    const volWeight = volatility / 100
    const qualWeight = hasQualityFactor ? quality / 100 : 0
    const totalWeight = momWeight + valWeight + volWeight + qualWeight || 1

    const nMom = momWeight / totalWeight
    const nVal = valWeight / totalWeight
    const nVol = volWeight / totalWeight
    const nQual = qualWeight / totalWeight

    let cagrVal = (0.05 + (nMom * 0.18) + (nVal * 0.10) - (nVol * 0.03) + (nQual * 0.15)) * 100
    let sharpeVal = 0.5 + (nMom * 0.6) + (nVal * 0.8) - (nVol * 0.2) + (nQual * 0.5)
    let maxDdVal = 8 + (nMom * 24) + (nVol * 15) - (nVal * 6) - (nQual * 3)

    if (shockMode === '2008') {
      cagrVal -= 4.2
      sharpeVal -= 0.35
      maxDdVal += 28.5
    } else if (shockMode === '2020') {
      cagrVal -= 1.8
      sharpeVal -= 0.15
      maxDdVal += 19.8
    }

    return {
      cagr: cagrVal.toFixed(2) + '%',
      sharpe: Math.max(0.1, sharpeVal).toFixed(2),
      drawdown: '-' + maxDdVal.toFixed(1) + '%'
    }
  }, [momentum, value, volatility, quality, hasQualityFactor, shockMode])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Conversational Alpha Prompt submit handler
  const handleCopilotSubmit = (e) => {
    e.preventDefault()
    if (!copilotPrompt.trim() || isGenerating) return
    
    const promptText = copilotPrompt
    setCopilotPrompt("")
    setIsGenerating(true)
    setCopilotLogs(prev => [...prev, `> Prompt: "${promptText}"`])

    setTimeout(() => {
      setCopilotLogs(prev => [...prev, `[PARSE] Extracting factor parameters: high ROIC & low Debt-to-Equity...`])
      setTimeout(() => {
        setCopilotLogs(prev => [...prev, `[MATH] Formulating vector logic: Qual = ROIC * 1.25 - (DE) * 0.70`])
        setTimeout(() => {
          setCopilotLogs(prev => [
            ...prev,
            `[COMPILE] PineScript / Python vector compilation... OK`,
            `[SYSTEM] Dynamic slider 'Quality Factor (QUAL)' linked successfully.`
          ])
          setIsGenerating(false)
          setHasQualityFactor(true)
          setQuality(40) // Default starting weight
        }, 600)
      }, 600)
    }, 600)
  }

  // Custom Formula Builder parser & apply action
  const parsedFormula = useMemo(() => {
    let momCoef = 0, valCoef = 0, volCoef = 0, qualCoef = 0
    const matches = [...formula.matchAll(/([0-9.-]+)\s*\*\s*(MOM|VAL|VOL|QUAL)/gi)]
    matches.forEach(m => {
      const val = parseFloat(m[1])
      const factor = m[2].toUpperCase()
      if (factor === 'MOM') momCoef = val
      if (factor === 'VAL') valCoef = val
      if (factor === 'VOL') volCoef = val
      if (factor === 'QUAL') qualCoef = val
    })
    const sum = momCoef + valCoef + volCoef + (hasQualityFactor ? qualCoef : 0)
    return { momCoef, valCoef, volCoef, qualCoef, sum }
  }, [formula, hasQualityFactor])

  const handleApplyFormula = () => {
    const { momCoef, valCoef, volCoef, qualCoef, sum } = parsedFormula
    if (sum === 0) {
      setFormulaStatus("Error: Could not parse any factor weights.")
      return
    }

    const normMom = Math.round((momCoef / sum) * 100)
    const normVal = Math.round((valCoef / sum) * 100)
    const normVol = Math.round((volCoef / sum) * 100)
    const normQual = hasQualityFactor ? Math.round((qualCoef / sum) * 100) : 0

    setMomentum(normMom)
    setValue(normVal)
    setVolatility(normVol)
    if (hasQualityFactor) setQuality(normQual)

    setFormulaStatus("Formula weights applied to sliders successfully.")
    setTimeout(() => setFormulaStatus(""), 3000)
  }

  // Heatmap correlation matrix calculations
  const correlationMatrix = useMemo(() => {
    const factors = hasQualityFactor ? ['MOM', 'VAL', 'VOL', 'QUAL'] : ['MOM', 'VAL', 'VOL']
    const matrix = hasQualityFactor 
      ? [
          [1.00, -0.12, 0.72, 0.24],
          [-0.12, 1.00, 0.18, 0.45],
          [0.72, 0.18, 1.00, -0.08],
          [0.24, 0.45, -0.08, 1.00]
        ]
      : [
          [1.00, -0.12, 0.72],
          [-0.12, 1.00, 0.18],
          [0.72, 0.18, 1.00]
        ]
    return { factors, matrix }
  }, [hasQualityFactor])

  const menuItems = [
    { name: 'Home', tab: 'home' },
    { name: 'Features', tab: 'features' },
    { name: 'Solutions', tab: 'solutions' },
    { name: 'Pricing', tab: 'pricing' },
    { name: 'About', tab: 'about' },
    { name: 'FAQ', tab: 'faq' },
  ]

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-text-strong selection:text-bg">
      {/* ── HEADER NAVBAR ────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full px-2 mt-2">
        <div 
          className={`mx-auto max-w-6xl px-6 py-3 transition-all duration-300 rounded-none border-b border-border-2 bg-surface/80 backdrop-blur-lg flex items-center justify-between ${
            isScrolled ? 'max-w-4xl border rounded-2xl bg-surface/90 shadow-2xl' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveTab('home'); setMenuOpen(false); }} 
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <img src={stratumLogo} alt="Stratum Logo" className="h-9 w-auto object-contain invert mix-blend-screen brightness-150" />
            </button>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider font-semibold">
            {menuItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`transition-colors duration-150 cursor-pointer focus:outline-none ${
                  activeTab === item.tab 
                    ? 'text-text-strong font-black border-b-2 border-text-strong pb-0.5' 
                    : 'text-text-2 hover:text-text-strong'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="block md:hidden cursor-pointer text-text-strong p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mx-auto mt-2 max-w-sm border border-border-2 bg-surface p-6 flex flex-col gap-6 shadow-2xl font-mono text-xs uppercase tracking-wider font-semibold"
            >
              {menuItems.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => { setActiveTab(item.tab); setMenuOpen(false); }}
                  className={`text-left w-full py-1.5 ${
                    activeTab === item.tab ? 'text-text-strong font-black border-l-2 border-text-strong pl-3' : 'text-text-2'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              {/* Auth buttons removed from mobile menu */}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MAIN BODY CONTENT ────────────────────────────────────── */}
      <main className="overflow-hidden">
        {/* Ambient Glow Graphics */}
        <div className="absolute inset-0 pointer-events-none isolate opacity-40 z-0">
          <div className="w-[30rem] h-[60rem] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.01)_70%,transparent_100%)] [translate:-10%_-30%]" />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="relative z-10"
            >
              {/* Hero Copy */}
              <BackgroundPaths title="Stratum" onNavigate={() => onNavigate('login')}>
                {/* Customer Logobar */}
                <section className="py-8">
                  <div className="max-w-5xl mx-auto px-6">
                    <p className="text-center font-mono text-[9px] uppercase tracking-widest text-text-3 mb-8">Integrated Brokerages & Desk Connections</p>
                    <div className="flex flex-wrap justify-center gap-12 items-center opacity-60 hover:opacity-100 transition-opacity duration-300 text-text-strong">
                      <div className="flex items-center gap-2 font-black font-mono text-xs tracking-widest"><Building2 size={20} /> ALPACA</div>
                      <div className="flex items-center gap-2 font-black font-mono text-xs tracking-widest"><Landmark size={20} /> INTERACTIVE BROKERS</div>
                      <div className="flex items-center gap-2 font-black font-mono text-xs tracking-widest"><Wallet size={20} /> SNAPTRADE</div>
                      <div className="flex items-center gap-2 font-black font-mono text-xs tracking-widest"><Building2 size={20} /> PLAID</div>
                    </div>
                  </div>
                </section>
              </BackgroundPaths>
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto px-6 pt-28 md:pt-36 pb-24"
            >
              {/* Scrolling Mockup Animation */}
              <div className="flex flex-col overflow-hidden -mt-20 md:-mt-36">
                <ContainerScroll
                  titleComponent={
                    <div className="flex flex-col gap-4 mb-8">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-text-strong font-semibold">THE QUANTITATIVE CONSOLE</span>
                      <h1 className="text-3xl sm:text-5xl font-black uppercase text-text-strong tracking-tight">
                        Unleash Stratum <br />
                        <span className="text-4xl sm:text-6xl md:text-7xl font-bold mt-1 leading-none text-text-strong underline decoration-border-3">
                          Factor Workspaces
                        </span>
                      </h1>
                    </div>
                  }
                >
                  <div className="w-full h-full overflow-hidden rounded-2xl relative bg-zinc-950">
                    <img
                      src={appScreenshot}
                      alt="Stratum Workspace Console"
                      className="absolute rounded-none object-cover max-w-none origin-top-left scale-[1.22] translate-x-[-19%] translate-y-[-5%] w-full h-full filter invert-[0.92] hue-rotate-[180deg] brightness-[1.15] contrast-[1.15]"
                      draggable={false}
                    />
                  </div>
                </ContainerScroll>
              </div>

              <div className="flex flex-col gap-4 mb-16 text-center -mt-32">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-strong font-semibold font-bold">CORE ARCHITECTURE</span>
                <h2 className="text-3xl font-black uppercase text-text-strong tracking-tight">Built for Institutional Quantitative Execution</h2>
                <p className="text-sm text-text-2 max-w-md mx-auto font-sans leading-relaxed">
                  A high-performance research pipeline built to compile, evaluate, and deploy systematic factor portfolios.
                </p>
              </div>

              <FUIBentoGridDark />
            </motion.div>
          )}

          {activeTab === 'solutions' && (
            <motion.div
              key="solutions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="pt-28 md:pt-36"
            >
              <Features8 />
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto px-6 pt-28 md:pt-36 pb-24"
            >
              <div className="flex flex-col gap-4 mb-16 text-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-strong font-semibold">ACCESS TIERS</span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase text-text-strong tracking-tight">Flexible License Models</h2>
                <p className="text-sm text-text-2 max-w-md mx-auto font-sans leading-relaxed">
                  Gain immediate terminal access. Deploy quantitative agents built to model portfolios.
                </p>
              </div>

              <AnimatedGroup preset="slide" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Plan 1 */}
                <div className="border border-border-2 p-8 bg-surface flex flex-col justify-between h-[420px]">
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] text-text-3 uppercase tracking-wider font-semibold">Sandbox Terminal</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-text-strong font-mono">$0</span>
                      <span className="text-[10px] font-mono text-text-3 uppercase font-semibold">/ forever</span>
                    </div>
                    <p className="text-[12px] text-text-2 font-sans leading-relaxed">
                      Test framework features using simulated local mock assets. Access evaluation libraries, screaming filters, and standard KPIs.
                    </p>
                    <div className="border-t border-border-3 pt-4 flex flex-col gap-2 font-mono text-[11px] text-text-2">
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> 15 Preset Tick Universe</div>
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Dynamic Factor Sliders</div>
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> AI Copilot (15 prompts/day)</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate('login')}
                    variant="outline"
                    className="w-full py-2 border border-border-3 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-surface-2 transition-all mt-4 rounded-md"
                  >
                    Sign Up Free
                  </Button>
                </div>

                {/* Plan 2 */}
                <div className="border-2 border-text-strong p-8 bg-surface flex flex-col justify-between h-[420px] relative">
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-text-strong text-bg font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 font-black">
                    MOST POPULAR
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] text-text-strong uppercase tracking-wider font-semibold">Quantitative Suite</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-text-strong font-mono">$79</span>
                      <span className="text-[10px] font-mono text-text-3 uppercase font-semibold">/ month</span>
                    </div>
                    <p className="text-[12px] text-text-2 font-sans leading-relaxed">
                      Unlock active broker API setups. Integrate custom live position streams and build factor-based trading portfolios.
                    </p>
                    <div className="border-t border-border-3 pt-4 flex flex-col gap-2 font-mono text-[11px] text-text-2">
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Full US Market Universe</div>
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Unlimited Daily Evaluations</div>
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Immersive AI Copilot Audit</div>
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Custom Factor Importer</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate('login')}
                    className="w-full py-2 bg-text-strong text-bg font-mono text-xs uppercase tracking-wider font-black hover:bg-text-2 transition-all mt-4 border border-text-strong rounded-md"
                  >
                    Start Free Trial
                  </Button>
                </div>

                {/* Plan 3 */}
                <div className="border border-border-2 p-8 bg-surface flex flex-col justify-between h-[420px]">
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] text-text-3 uppercase tracking-wider font-semibold">Institutional API</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-text-strong font-mono">$450</span>
                      <span className="text-[10px] font-mono text-text-3 uppercase font-semibold">/ month</span>
                    </div>
                    <p className="text-[12px] text-text-2 font-sans leading-relaxed">
                      Designed for algorithmic quantitative desks requiring low latency API data connectors, sub-second latency, and premium SLA.
                    </p>
                    <div className="border-t border-border-3 pt-4 flex flex-col gap-2 font-mono text-[11px] text-text-2">
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Direct Broker-Dealer Pipelines</div>
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Multi-threading Engine Nodes</div>
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Custom SLA & Dedicated Support</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate('login')}
                    variant="outline"
                    className="w-full py-2 border border-border-3 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-surface-2 transition-all mt-4 rounded-md"
                  >
                    Contact Desk
                  </Button>
                </div>
              </AnimatedGroup>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="pt-28 md:pt-36 pb-24"
            >
              <MissionStatement />
            </motion.div>
          )}
          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto px-6 pt-28 md:pt-36 pb-24"
            >
              <div className="flex flex-col gap-4 mb-12 text-center mt-12">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-strong font-semibold">QUESTIONS & ANSWERS</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-text-strong tracking-tight">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1" className="border-border-2">
              <AccordionTrigger>What brokerages are supported?</AccordionTrigger>
              <AccordionContent>
                Stratum supports standard read-only API connectors for Alpaca, Interactive Brokers, and Tradier. Additional integrations can be connected manually via CSV brokerage templates.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2" className="border-border-2">
              <AccordionTrigger>Is my brokerage capital safe?</AccordionTrigger>
              <AccordionContent>
                Absolutely. All brokerage connections are strictly read-only. Stratum nodes are architected without trading access, meaning we cannot execute trades, withdraw funds, or change your brokerage settings.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4" className="border-border-2">
              <AccordionTrigger>Can I import custom factor metrics?</AccordionTrigger>
              <AccordionContent>
                Yes. The Quantitative Suite and Institutional API tiers support importing custom factor CSV sheets. Once uploaded, your factors are parsed into our vector space simulator immediately.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-5" className="border-border-2">
              <AccordionTrigger>How does the AI Copilot analyst operate?</AccordionTrigger>
              <AccordionContent>
                The AI Copilot uses our secure fine-tuned LLM console to audit your allocations. It inspects sector concentration limits, flags correlation anomalies, and analyzes portfolio weight variations based on historical covariance.
              </AccordionContent>
            </AccordionItem>
              </Accordion>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <Footer
        logo={<img src={stratumLogo} alt="Stratum Logo" className="h-6 w-auto object-contain invert mix-blend-screen brightness-150" />}
        brandName="STRATUM V1.2.0"
        socialLinks={[
          {
            icon: <Twitter className="h-5 w-5" />,
            href: "https://twitter.com",
            label: "Twitter",
          },
          {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com",
            label: "GitHub",
          },
        ]}
        mainLinks={[
          { href: "#features", label: "Features" },
          { href: "#solutions", label: "Solutions" },
          { href: "#pricing", label: "Pricing" },
          { href: "#about", label: "About" },
        ]}
        legalLinks={[
          { href: "#privacy", label: "Privacy Policy" },
          { href: "#terms", label: "Terms of Service" },
          { href: "#support", label: "Desk Support" },
        ]}
        copyright={{
          text: `© ${new Date().getFullYear()} STRATUM OPERATIONS.`,
          license: "ALL RIGHTS RESERVED.",
        }}
      />
    </div>
  )
}
