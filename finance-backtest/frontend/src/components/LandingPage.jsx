import React, { useState, useEffect, useMemo } from 'react'
import {
  Terminal, Sliders, Sparkles, LineChart as ChartIcon,
  Activity, ShieldAlert, ArrowRight, Lock, Eye,
  RefreshCw, Play, Check, Server, Layers, Cpu,
  Database, HelpCircle, Menu, X, ChevronRight
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
import appScreenshot from '../screenshot_full.png'

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
    'Pre-heating backtesting simulator clusters...',
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
    const logMsg = `[${timestamp}] REBALANCING: Factor '${factorName.toUpperCase()}' adjusted to ${val}%. Re-running multi-factor backtest...`
    setLogs(prev => {
      const next = [...prev, logMsg]
      if (next.length > 8) next.shift() // keep terminal readable
      return next
    })
  }

  // Dynamic Backtest Equity Curve calculations
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
    { name: 'Features', tab: 'features' },
    { name: 'Solutions', tab: 'solutions' },
    { name: 'Pricing', tab: 'pricing' },
    { name: 'About', tab: 'about' },
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
              <div className="w-3.5 h-3.5 bg-text-strong border border-text-strong rounded-none" />
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

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs uppercase tracking-wider rounded-md"
              onClick={() => onNavigate('login')}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-text-strong text-bg hover:bg-text-2 font-mono text-xs uppercase tracking-wider rounded-md font-black border border-text-strong"
              onClick={() => onNavigate('login')}
            >
              Get Started
            </Button>
          </div>

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
              <div className="flex flex-col gap-3 pt-4 border-t border-border-2">
                <Button
                  variant="outline"
                  className="w-full text-xs uppercase tracking-wider rounded-md py-2"
                  onClick={() => { setMenuOpen(false); onNavigate('login'); }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full bg-text-strong text-bg hover:bg-text-2 text-xs uppercase tracking-wider rounded-md py-2 font-black"
                  onClick={() => { setMenuOpen(false); onNavigate('login'); }}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MAIN BODY CONTENT ────────────────────────────────────── */}
      <main className="pt-28 md:pt-36 overflow-hidden">
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
              <section className="px-6 text-center max-w-4xl mx-auto flex flex-col items-center gap-8 mb-20">
                <AnimatedGroup variants={transitionVariants}>
                  <div className="inline-flex items-center gap-2 border border-border-3 px-3 py-1 font-mono text-[9px] tracking-widest text-text-strong uppercase font-semibold">
                    <span className="w-1.5 h-1.5 bg-text-strong animate-pulse" />
                    Next-Gen Quantitative Engine
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-text-strong leading-[1.05] tracking-tight uppercase mt-6 max-w-3xl mx-auto">
                    The Quantitative <br />
                    Operating System <br />
                    For Factor Investing
                  </h1>
                  
                  <p className="text-sm md:text-base text-text-2 max-w-xl leading-relaxed mt-4 font-sans">
                    Test factor theories, backtest custom systematic strategies, stress test portfolio vulnerabilities, and let our interactive AI financial Copilot audit your investment decisions—all under a single high-performance console.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.5,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="flex flex-col sm:flex-row items-center gap-4 mt-2"
                >
                  <Button
                    onClick={() => setActiveTab('solutions')}
                    className="flex items-center gap-2 bg-text-strong text-bg border border-text-strong px-6 py-3 font-mono text-xs font-black uppercase tracking-wider hover:bg-text-2 transition-all rounded-md"
                  >
                    Try Interactive Sandbox <ArrowRight size={14} />
                  </Button>
                  <Button
                    onClick={() => onNavigate('login')}
                    variant="outline"
                    className="border border-border-3 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider hover:bg-surface-2 transition-all text-text-2 hover:text-text-strong rounded-md"
                  >
                    Request Console Demo
                  </Button>
                </AnimatedGroup>
              </section>

              {/* Shell Terminal Mockup */}
              <section className="px-6 max-w-4xl mx-auto mb-24">
                <div className="border border-border-2 bg-surface font-mono text-[11px] leading-relaxed shadow-2xl flex flex-col h-[300px]">
                  <div className="border-b border-border-2 px-4 py-2 bg-surface-2 flex items-center justify-between">
                    <span className="text-text-3 font-semibold flex items-center gap-1.5">
                      <Terminal size={12} className="text-text-strong" /> system_terminal.sh
                    </span>
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 bg-border-3" />
                      <span className="w-2.5 h-2.5 bg-border-3" />
                    </div>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto text-text-2 flex flex-col gap-1.5 scrollbar-thin">
                    {logs.map((log, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-text-strong select-none">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <span className="text-text-strong select-none">&gt;</span>
                      <span className="w-2 h-4 bg-text animate-pulse" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Customer Logobar */}
              <section className="bg-surface/50 border-t border-b border-border-2 py-12 mb-16">
                <div className="max-w-5xl mx-auto px-6">
                  <p className="text-center font-mono text-[9px] uppercase tracking-widest text-text-3 mb-8">Integrated Brokerages & Desk Connections</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-45 grayscale hover:opacity-75 transition-opacity duration-300">
                    <img className="mx-auto h-5 dark:invert" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia" />
                    <img className="mx-auto h-4 dark:invert" src="https://html.tailus.io/blocks/customers/github.svg" alt="GitHub" />
                    <img className="mx-auto h-4 dark:invert" src="https://html.tailus.io/blocks/customers/openai.svg" alt="OpenAI" />
                    <img className="mx-auto h-5 dark:invert" src="https://html.tailus.io/blocks/customers/nike.svg" alt="Nike" />
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto px-6 pb-24"
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
                  A high-performance research pipeline built to compile, backtest, and deploy systematic factor strategies.
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
              className="max-w-6xl mx-auto px-6 pb-24"
            >
              <div className="flex flex-col gap-4 mb-12 text-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-strong font-semibold">INTERACTIVE SIMULATION</span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase text-text-strong tracking-tight">Factor Backtest Sandbox</h2>
                <p className="text-sm text-text-2 max-w-xl mx-auto font-sans leading-relaxed">
                  Tweak alpha factor variables in real-time below to generate a dynamic backtest equity curve simulation comparing Stratum to the S&P 500 (SPY).
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Sliders Controls */}
                <div className="lg:col-span-4 border border-border-2 bg-surface p-6 flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-6">
                    <h3 className="text-xs font-black uppercase tracking-wider font-mono text-text-strong m-0 border-b border-border-2 pb-3 flex items-center justify-between">
                      Factor Weights Configuration
                      <span className="text-[9px] bg-text-strong/10 text-text-strong px-1.5 py-0.5 border border-text-strong/20">LIVE ENGINE</span>
                    </h3>

                    {/* Risk overlap warning banner */}
                    {momentum > 30 && volatility > 30 && (
                      <div className="border border-text-strong/20 bg-text-strong/5 p-3 font-mono text-[9px] text-text-strong leading-normal rounded-none">
                        ⚠️ <strong>RISK OVERLAP WARNING</strong>: Momentum & Volatility weights both exceed 30%. These factors exhibit high correlation (&rho; = 0.72), which might compound exposure to macro trend volatility.
                      </div>
                    )}

                    {/* Momentum */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-text-2 font-semibold">Momentum (MOM)</span>
                        <span className="text-text-strong font-bold">{momentum}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={momentum}
                        onChange={(e) => {
                          setMomentum(Number(e.target.value))
                          triggerSimulationLog('momentum', e.target.value)
                        }}
                        className="w-full accent-text-strong bg-border border border-border cursor-pointer h-1 rounded-none"
                      />
                    </div>

                    {/* Value */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-text-2 font-semibold">Value (VAL)</span>
                        <span className="text-text-strong font-bold">{value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => {
                          setValue(Number(e.target.value))
                          triggerSimulationLog('value', e.target.value)
                        }}
                        className="w-full accent-text-strong bg-border border border-border cursor-pointer h-1 rounded-none"
                      />
                    </div>

                    {/* Low Volatility */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-text-2 font-semibold">Low Volatility (VOL)</span>
                        <span className="text-text-strong font-bold">{volatility}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volatility}
                        onChange={(e) => {
                          setVolatility(Number(e.target.value))
                          triggerSimulationLog('volatility', e.target.value)
                        }}
                        className="w-full accent-text-strong bg-border border border-border cursor-pointer h-1 rounded-none"
                      />
                    </div>

                    {/* Quality Factor - Dynamic Slider */}
                    {hasQualityFactor && (
                      <div className="flex flex-col gap-2 border-t border-border/20 pt-4">
                        <div className="flex justify-between font-mono text-xs">
                          <span className="text-text-strong font-semibold">Quality Factor (QUAL)</span>
                          <span className="text-text-strong font-bold">{quality}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={quality}
                          onChange={(e) => {
                            setQuality(Number(e.target.value))
                            triggerSimulationLog('quality', e.target.value)
                          }}
                          className="w-full accent-text-strong bg-border border border-border cursor-pointer h-1 rounded-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Terminal Conversational Alpha Panel */}
                  <div className="border border-border bg-bg p-4 flex flex-col gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-text-3 font-semibold">Conversational Alpha Copilot</span>
                    <div className="h-[100px] overflow-y-auto font-mono text-[9px] text-text-2 flex flex-col gap-1.5 border-b border-border/20 pb-2 scrollbar-thin">
                      {copilotLogs.map((log, i) => (
                        <div key={i} className="leading-relaxed">
                          {log}
                        </div>
                      ))}
                      {isGenerating && (
                        <div className="flex items-center gap-1.5 text-text-strong">
                          <span className="w-1.5 h-1.5 bg-text-strong animate-ping" />
                          <span>Generating metric AST structure...</span>
                        </div>
                      )}
                    </div>
                    <form onSubmit={handleCopilotSubmit} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Create a quality factor..."
                        value={copilotPrompt}
                        onChange={(e) => setCopilotPrompt(e.target.value)}
                        disabled={isGenerating}
                        className="flex-1 bg-surface border border-border-2 px-3 py-1 font-mono text-[10px] focus:outline-none rounded-none"
                      />
                      <button
                        type="submit"
                        disabled={isGenerating}
                        className="bg-text-strong text-bg px-2.5 py-1 font-mono text-[9px] uppercase font-black hover:bg-text-2 transition-colors cursor-pointer"
                      >
                        Compile
                      </button>
                    </form>
                  </div>

                  {/* Simulation Modeling Settings */}
                  <div className="border-t border-border-2 pt-6 flex flex-col gap-4">
                    <h4 className="font-mono text-[10px] uppercase font-bold text-text-strong m-0">Stochastic & Macro Controls</h4>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] text-text-2 uppercase">Historical Crisis Shock</label>
                      <select 
                        value={shockMode} 
                        onChange={(e) => setShockMode(e.target.value)}
                        className="bg-surface border border-border-2 font-mono text-[10px] px-3 py-1.5 focus:outline-none rounded-none text-text-strong cursor-pointer"
                      >
                        <option value="none">None (Standard Drift)</option>
                        <option value="2008">2008 Great Financial Crisis</option>
                        <option value="2020">2020 COVID Market Shock</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-text-2 uppercase">Monte Carlo Cone (1,000 runs)</span>
                      <button
                        type="button"
                        onClick={() => setIsMonteCarlo(!isMonteCarlo)}
                        className={`w-9 h-5 border flex items-center p-0.5 cursor-pointer transition-colors duration-200 ${
                          isMonteCarlo ? 'bg-text-strong border-text-strong justify-end' : 'bg-surface border-border-2 justify-start'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 ${isMonteCarlo ? 'bg-bg' : 'bg-text-strong'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-text-2 uppercase">Shade WFA Periods</span>
                      <button
                        type="button"
                        onClick={() => setIsWfaActive(!isWfaActive)}
                        className={`w-9 h-5 border flex items-center p-0.5 cursor-pointer transition-colors duration-200 ${
                          isWfaActive ? 'bg-text-strong border-text-strong justify-end' : 'bg-surface border-border-2 justify-start'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 ${isWfaActive ? 'bg-bg' : 'bg-text-strong'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Chart Visualization */}
                <div className="lg:col-span-8 border border-border-2 bg-surface p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-border-2 pb-4 mb-4">
                    <span className="font-mono text-xs font-bold text-text-strong uppercase">Simulated Equity Curve (5-Year Growth of $100k)</span>
                    <div className="flex items-center gap-4 font-mono text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-text-strong" />
                        <span className="text-text-2 font-semibold">Stratum Strategy</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-border-3" />
                        <span className="text-text-2 font-semibold">S&P 500 Benchmark</span>
                      </div>
                    </div>
                  </div>

                  {/* Recharts Performance Area */}
                  <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--text-strong)" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="var(--text-strong)" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorSpy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--border-3)" stopOpacity={0.05}/>
                            <stop offset="95%" stopColor="var(--border-3)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          stroke="var(--border-3)"
                          tick={{ fill: 'var(--text-3)', fontSize: 9, fontFamily: 'monospace' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="var(--border-3)"
                          tickFormatter={(val) => `$${val/1000}k`}
                          tick={{ fill: 'var(--text-3)', fontSize: 9, fontFamily: 'monospace' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--surface)',
                            borderColor: 'var(--border-2)',
                            borderRadius: '0px',
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            color: 'var(--text)'
                          }}
                          itemStyle={{ color: 'var(--text)' }}
                          labelStyle={{ color: 'var(--text-strong)', fontWeight: 'bold' }}
                        />
                        
                        {/* WFA Training vs Testing shading blocks */}
                        {isWfaActive && (
                          <ReferenceArea 
                            x1={chartData[0]?.date} 
                            x2={chartData[35]?.date} 
                            fill="var(--text-strong)" 
                            fillOpacity={0.02} 
                            label={{ 
                              value: "IN-SAMPLE (TRAINING)", 
                              fill: "var(--text-3)", 
                              fontSize: 8, 
                              position: "insideTopLeft", 
                              fontFamily: "monospace" 
                            }} 
                          />
                        )}
                        {isWfaActive && (
                          <ReferenceArea 
                            x1={chartData[36]?.date} 
                            x2={chartData[59]?.date} 
                            fill="var(--border)" 
                            fillOpacity={0.05} 
                            label={{ 
                              value: "OUT-OF-SAMPLE (TESTING)", 
                              fill: "var(--text-3)", 
                              fontSize: 8, 
                              position: "insideTopRight", 
                              fontFamily: "monospace" 
                            }} 
                          />
                        )}

                        {/* Monte Carlo Shaded Confidence Cone */}
                        {isMonteCarlo && (
                          <Area
                            type="monotone"
                            dataKey={['StrategyMin', 'StrategyMax']}
                            stroke="none"
                            fill="var(--text-strong)"
                            fillOpacity={0.07}
                            name="90% Confidence Interval"
                          />
                        )}

                        <Area
                          type="monotone"
                          dataKey="Strategy"
                          stroke="var(--text-strong)"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorStrategy)"
                        />
                        <Area
                          type="monotone"
                          dataKey="SPY"
                          stroke="var(--border-3)"
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          fillOpacity={1}
                          fill="url(#colorSpy)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Sandbox Metrics Summary */}
                  <div className="grid grid-cols-3 gap-2 border-t border-border-2 pt-6 mt-8 font-mono">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-text-3 font-semibold uppercase">EST. CAGR</span>
                      <span className="text-sm font-black text-text-strong">{metrics.cagr}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-text-3 font-semibold uppercase">SHARPE RATIO</span>
                      <span className="text-sm font-black text-text-strong">{metrics.sharpe}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-text-3 font-semibold uppercase">MAX DRAWDOWN</span>
                      <span className="text-sm font-black text-text-strong text-red">{metrics.drawdown}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Solutions Grid Panels (Correlation Heatmap & Custom Formula) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 items-stretch">
                {/* Correlation Heatmap Grid */}
                <div className="border border-border-2 bg-surface p-6 flex flex-col gap-4">
                  <div>
                    <h3 className="font-mono text-xs font-black uppercase tracking-wider text-text-strong m-0">Factor Correlation Heatmap</h3>
                    <p className="text-[10px] text-text-3 font-mono mt-1 leading-relaxed">
                      Pearson correlation coefficients (&rho;) between parameters. Orthogonal profiles ensure optimal risk diversification.
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-2">
                    <div className="grid grid-cols-5 gap-1.5 font-mono text-[9px] w-full max-w-sm">
                      {/* Grid Corner */}
                      <div className="h-7" />
                      {correlationMatrix.factors.map((f) => (
                        <div key={f} className="flex items-center justify-center h-7 font-black text-text-strong border-b border-border/20 uppercase tracking-widest">{f}</div>
                      ))}

                      {correlationMatrix.factors.map((row, rowIndex) => (
                        <React.Fragment key={row}>
                          {/* Row Header */}
                          <div className="flex items-center font-black text-text-strong justify-end pr-2.5 h-7 uppercase tracking-widest">{row}</div>
                          {correlationMatrix.matrix[rowIndex].map((val, colIndex) => {
                            const isHigh = Math.abs(val) > 0.7 && val !== 1.0
                            const isDiag = rowIndex === colIndex
                            return (
                              <div
                                key={colIndex}
                                className={`flex flex-col items-center justify-center h-7 text-[10px] border transition-colors ${
                                  isDiag 
                                    ? 'bg-text-strong text-bg font-black border-text-strong' 
                                    : isHigh 
                                      ? 'bg-red/10 border-red/30 text-red font-bold' 
                                      : 'bg-bg border-border/30 text-text-2'
                                }`}
                              >
                                {val.toFixed(2)}
                              </div>
                            )
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Formula Builder Console */}
                <div className="border border-border-2 bg-surface p-6 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-mono text-xs font-black uppercase tracking-wider text-text-strong m-0">Arbitrage Pricing Theory Builder</h3>
                    <p className="text-[10px] text-text-3 font-mono mt-1 leading-relaxed">
                      Custom factor returns computed based on asset pricing theory: E(R) = Rf + &sum; &beta;<sub>i</sub>(RP<sub>i</sub>)
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col gap-2.5 font-mono">
                    <div className="flex items-center justify-between text-[9px] text-text-3 border-b border-border/20 pb-2">
                      <span>Formula Input: Monaco_Console_v1.0</span>
                      <span>Syntax: verified (APT standard)</span>
                    </div>
                    <textarea
                      value={formula}
                      onChange={(e) => setFormula(e.target.value)}
                      placeholder="0.4 * MOM + 0.3 * VAL + 0.3 * VOL"
                      rows={3}
                      className="w-full bg-bg border border-border-2 p-3 font-mono text-[11px] leading-relaxed text-text-strong resize-none focus:outline-none focus:border-text-strong"
                    />
                    
                    <div className="flex flex-col gap-1 text-[9px] text-text-2 bg-bg/50 p-2.5 border border-border/10">
                      <div>Baseline Rate (Rf) = 4.25%</div>
                      <div>Expected Return = 4.25% + (MOM * 11.20%) + (VAL * 6.50%) + (VOL * -1.80%){hasQualityFactor && " + (QUAL * 9.80%)"}</div>
                      <div className="font-black text-text-strong mt-1">Expected APT Yield (E(Rp)): {(4.25 + (parsedFormula.momCoef * 11.20) + (parsedFormula.valCoef * 6.50) + (parsedFormula.volCoef * -1.80) + (hasQualityFactor ? parsedFormula.qualCoef * 9.80 : 0)).toFixed(2)}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[9px] text-text-strong/85">{formulaStatus}</span>
                    <button
                      onClick={handleApplyFormula}
                      className="bg-text-strong text-bg font-mono text-[9px] uppercase tracking-wider font-black px-4 py-2 hover:bg-text-2 border border-text-strong transition-colors cursor-pointer"
                    >
                      Apply Formula
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto px-6 pb-24"
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
                      Test framework features using simulated local mock assets. Access backtester libraries, screaming filters, and standard KPIs.
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
                      <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Unlimited Daily Backtesting</div>
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
              className="max-w-4xl mx-auto px-6 pb-24"
            >
              <div className="flex flex-col gap-4 mb-16 text-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-strong font-semibold">ABOUT THE PLATFORM</span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase text-text-strong tracking-tight font-sans">Quantitative Strategy Core</h2>
                <p className="text-sm text-text-2 max-w-md mx-auto font-sans leading-relaxed">
                  Stratum operations represent the next stage of open-architecture quantitative execution systems.
                </p>
              </div>

              <AnimatedGroup preset="slide" className="flex flex-col gap-8">
                <div className="border border-border-2 p-8 bg-surface">
                  <h3 className="font-mono text-xs font-black uppercase tracking-wider text-text-strong mb-3">Our Mission</h3>
                  <p className="text-xs text-text-2 leading-relaxed font-sans">
                    We aim to democratize institutional-grade quantitative strategies. By combining granular vector models, real-time factor weightings, and AI-assisted explainability models, we bridge the gap between high-level theory and actual execution.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-border-2 p-8 bg-surface flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-3">Encryption & Access</span>
                    <span className="text-xs font-bold text-text-strong uppercase tracking-wide">Security Guarantee</span>
                    <p className="text-[11px] text-text-2 leading-relaxed font-sans mt-2">
                      All connection nodes operate under TLS 1.3 protocol guidelines. System APIs require read-only credentials, ensuring your brokerage assets cannot be traded or modified.
                    </p>
                  </div>

                  <div className="border border-border-2 p-8 bg-surface flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-3">Active Infrastructure</span>
                    <span className="text-xs font-bold text-text-strong uppercase tracking-wide">Node Deployment</span>
                    <p className="text-[11px] text-text-2 leading-relaxed font-sans mt-2">
                      Our computations run on decentralized backtesting nodes, returning strategy simulations within 200ms without clogging client threads.
                    </p>
                  </div>
                </div>
              </AnimatedGroup>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FAQ SECTION ─────────────────────────────────────────── */}
        <section className="py-20 px-6 max-w-4xl mx-auto border-t border-border-2">
          <div className="flex flex-col gap-4 mb-12 text-center">
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
            <AccordionItem value="faq-3" className="border-border-2">
              <AccordionTrigger>What historical data is used for backtesting?</AccordionTrigger>
              <AccordionContent>
                We compile up to 20 years of split- and dividend-adjusted US equity market data from institutional data nodes. Backtest calculations include transaction cost simulations and beta adjustments.
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
                The AI Copilot uses our secure fine-tuned LLM console to audit your allocations. It inspects sector concentration limits, flags correlation anomalies, and proposes optimal strategy weight adjustments based on historical covariance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="w-full border-t border-border-2 bg-surface px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[10px] text-text-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-text-strong" />
            <span className="font-bold tracking-wider uppercase text-text-strong font-black">STRATUM V1.2.0</span>
          </div>
          <div className="flex gap-6 font-semibold uppercase tracking-wider">
            <a href="#privacy" className="hover:text-text-strong transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-text-strong transition-colors">Terms of Service</a>
            <a href="#support" className="hover:text-text-strong transition-colors">Desk Support</a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} STRATUM OPERATIONS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  )
}
