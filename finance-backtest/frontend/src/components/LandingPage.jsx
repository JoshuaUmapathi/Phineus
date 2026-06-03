import React, { useState, useEffect, useMemo } from 'react'
import {
  Terminal, Sliders, Sparkles, LineChart as ChartIcon,
  Activity, ShieldAlert, ArrowRight, Lock, Eye,
  RefreshCw, Play, Check, Server, Layers, Cpu,
  Database, HelpCircle
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts'

// Pre-defined deterministic noise array to ensure smooth, stable slider transitions without visual stutter
const BASE_NOISE = [
  -0.1, 0.25, -0.15, 0.3, -0.05, 0.12, -0.22, 0.35, -0.08, 0.18,
  -0.3, 0.42, -0.05, 0.15, -0.12, 0.28, -0.18, 0.05, -0.02, 0.22,
  -0.15, 0.32, -0.25, 0.45, -0.1, 0.2, -0.05, 0.15, -0.28, 0.38,
  -0.12, 0.24, -0.18, 0.08, -0.05, 0.32, -0.15, 0.22, -0.35, 0.48,
  -0.08, 0.16, -0.12, 0.28, -0.22, 0.38, -0.05, 0.12, -0.18, 0.25,
  -0.1, 0.32, -0.15, 0.22, -0.08, 0.18, -0.25, 0.35, -0.12, 0.42
]

export default function LandingPage({ onNavigate }) {
  // Simulator State
  const [momentum, setMomentum] = useState(50)
  const [value, setValue] = useState(30)
  const [volatility, setVolatility] = useState(20)

  // Animated Terminal State
  const [logs, setLogs] = useState([])
  const logQueue = useMemo(() => [
    'Initializing Stratum OS kernel...',
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
  const triggerSimulationLog = (factorName, value) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMsg = `[${timestamp}] REBALANCING: Factor '${factorName.toUpperCase()}' adjusted to ${value}%. Re-running multi-factor backtest...`
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

    // Calculations derived from factor weights
    const momWeight = momentum / 100
    const valWeight = value / 100
    const volWeight = volatility / 100
    const totalWeight = momWeight + valWeight + volWeight || 1

    // Normalize weights
    const nMom = momWeight / totalWeight
    const nVal = valWeight / totalWeight
    const nVol = volWeight / totalWeight

    // Expected annualized values
    const expectedCagr = 0.05 + (nMom * 0.18) + (nVal * 0.10) - (nVol * 0.03)
    const expectedVol = 0.08 + (nMom * 0.14) - (nVal * 0.03) + (nVol * 0.07)
    
    // SPY Baseline parameters
    const spyCagr = 0.09
    const spyVol = 0.15

    const months = 60
    const startDate = new Date(2021, 0, 1)

    for (let i = 0; i < months; i++) {
      const dateLabel = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
        .toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

      const noiseFactor = BASE_NOISE[i % BASE_NOISE.length]

      // Monthly returns simulation
      const monthlyReturn = (expectedCagr / 12) + (noiseFactor * (expectedVol / Math.sqrt(12)))
      balance = balance * (1 + monthlyReturn)

      const spyMonthlyReturn = (spyCagr / 12) + (noiseFactor * (spyVol / Math.sqrt(12)))
      spyBalance = spyBalance * (1 + spyMonthlyReturn)

      dataPoints.push({
        date: dateLabel,
        Strategy: Math.round(balance),
        SPY: Math.round(spyBalance)
      })
    }

    return dataPoints
  }, [momentum, value, volatility])

  // Calculate final KPIs for display
  const metrics = useMemo(() => {
    const momWeight = momentum / 100
    const valWeight = value / 100
    const volWeight = volatility / 100
    const totalWeight = momWeight + valWeight + volWeight || 1

    const nMom = momWeight / totalWeight
    const nVal = valWeight / totalWeight
    const nVol = volWeight / totalWeight

    const cagrVal = (0.05 + (nMom * 0.18) + (nVal * 0.10) - (nVol * 0.03)) * 100
    const sharpeVal = 0.5 + (nMom * 0.6) + (nVal * 0.8) - (nVol * 0.2)
    const maxDdVal = 8 + (nMom * 24) + (nVol * 15) - (nVal * 6)

    return {
      cagr: cagrVal.toFixed(2) + '%',
      sharpe: sharpeVal.toFixed(2),
      drawdown: '-' + maxDdVal.toFixed(1) + '%'
    }
  }, [momentum, value, volatility])

  return (
    <div className="landing-layout min-h-screen bg-bg text-text font-sans">
      {/* ── HEADER NAVBAR ────────────────────────────────────────── */}
      <header className="w-full border-b border-border-2 bg-surface px-6 py-4 flex items-center justify-between sticky top-0 z-50 rounded-none">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 bg-text-strong border border-text-strong rounded-none" />
          <span className="font-mono text-base font-black tracking-widest text-text-strong">STRATUM OS</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider font-semibold">
          <a href="#features" className="text-text-2 hover:text-text-strong transition-colors">Features</a>
          <a href="#sandbox" className="text-text-2 hover:text-text-strong transition-colors">Simulation Sandbox</a>
          <a href="#pricing" className="text-text-2 hover:text-text-strong transition-colors">Pricing</a>
          <a href="#docs" className="text-text-2 hover:text-text-strong transition-colors">Docs</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('login')}
            className="border border-border-3 font-mono text-xs uppercase tracking-wider px-4 py-2 hover:bg-surface-2 transition-all font-semibold rounded-none"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="bg-text-strong text-bg font-mono text-xs uppercase tracking-wider px-5 py-2 hover:bg-text-2 transition-all font-black border border-text-strong rounded-none"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative border-b border-border-2 py-20 px-6 overflow-hidden bg-gradient-to-b from-surface to-bg rounded-none">
        {/* Glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-text-strong/5 blur-[120px] pointer-events-none rounded-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 border border-border-3 px-3 py-1 self-start font-mono text-[10px] tracking-widest text-text-strong uppercase font-semibold rounded-none">
              <span className="w-1.5 h-1.5 bg-text-strong animate-pulse rounded-none" />
              Next-Gen Quantitative Engine
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-text-strong leading-[1.05] tracking-tight uppercase">
              The Quantitative <br />
              <span className="text-text-strong underline decoration-2 decoration-border-3">Operating System</span> <br />
              For Factor Investing
            </h1>
            <p className="text-sm md:text-base text-text-2 max-w-xl leading-relaxed font-sans">
              Test factor theories, backtest custom systematic strategies, stress test portfolio vulnerabilities, and let our interactive AI financial Copilot audit your investment decisions—all under a single high-performance console.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <button
                onClick={() => onNavigate('signup')}
                className="flex items-center gap-2 bg-text-strong text-bg border border-text-strong px-6 py-3 font-mono text-xs font-black uppercase tracking-wider hover:bg-text-2 transition-all rounded-none"
              >
                Create Free Account <ArrowRight size={14} />
              </button>
              <a
                href="#sandbox"
                className="flex items-center gap-2 border border-border-3 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider hover:bg-surface-2 transition-all text-text-2 hover:text-text-strong rounded-none"
              >
                Try Interactive Sandbox
              </a>
            </div>
          </div>

          {/* Interactive Shell Graphic */}
          <div className="lg:col-span-5 border border-border-2 bg-surface font-mono text-[11px] leading-relaxed shadow-xl flex flex-col h-[320px] rounded-none">
            <div className="border-b border-border-2 px-4 py-2 bg-surface-2 flex items-center justify-between rounded-none">
              <span className="text-text-3 font-semibold flex items-center gap-1.5">
                <Terminal size={12} className="text-text-strong" /> system_terminal.sh
              </span>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 bg-border-3 rounded-none" />
                <span className="w-2.5 h-2.5 bg-border-3 rounded-none" />
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
                <span className="w-2 h-4 bg-text animate-pulse rounded-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES SECTION ─────────────────────────────────── */}
      <section id="features" className="py-20 px-6 border-b border-border-2 max-w-7xl mx-auto rounded-none">
        <div className="flex flex-col gap-4 mb-16">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-strong font-semibold">FEATURES & CAPABILITIES</span>
          <h2 className="text-3xl font-black uppercase text-text-strong tracking-tight">Built for Institutional Quantitative Execution</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="border border-border-2 p-6 bg-surface flex flex-col gap-4 rounded-none">
            <div className="w-10 h-10 border border-border-3 flex items-center justify-center text-text-strong bg-bg rounded-none">
              <Sliders size={18} />
            </div>
            <h3 className="text-sm font-bold uppercase text-text-strong tracking-wider m-0">Multi-Factor Screener</h3>
            <p className="text-[12px] text-text-2 leading-relaxed m-0 font-sans">
              Scan across customizable factor libraries (momentum, value, volatility) to find assets matching quantitative criteria with granular backtest logs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="border border-border-2 p-6 bg-surface flex flex-col gap-4 rounded-none">
            <div className="w-10 h-10 border border-border-3 flex items-center justify-center text-text-strong bg-bg rounded-none">
              <ChartIcon size={18} />
            </div>
            <h3 className="text-sm font-bold uppercase text-text-strong tracking-wider m-0">Backtesting Simulator</h3>
            <p className="text-[12px] text-text-2 leading-relaxed m-0 font-sans">
              Run sub-second portfolio simulations over decades of data, modeling transaction costs, compound growth rates (CAGR), and drawdowns.
            </p>
          </div>

          {/* Card 3 */}
          <div className="border border-border-2 p-6 bg-surface flex flex-col gap-4 rounded-none">
            <div className="w-10 h-10 border border-border-3 flex items-center justify-center text-text-strong bg-bg rounded-none">
              <Sparkles size={18} />
            </div>
            <h3 className="text-sm font-bold uppercase text-text-strong tracking-wider m-0">AI Copilot Analyst</h3>
            <p className="text-[12px] text-text-2 leading-relaxed m-0 font-sans">
              An immersive chat copilot that inspects portfolio sector exposures, flags stock concentration, and triggers diagnostic health score assessments.
            </p>
          </div>

          {/* Card 4 */}
          <div className="border border-border-2 p-6 bg-surface flex flex-col gap-4 rounded-none">
            <div className="w-10 h-10 border border-border-3 flex items-center justify-center text-text-strong bg-bg rounded-none">
              <Activity size={18} />
            </div>
            <h3 className="text-sm font-bold uppercase text-text-strong tracking-wider m-0">Stress-Test Robustness</h3>
            <p className="text-[12px] text-text-2 leading-relaxed m-0 font-sans">
              Run strategic robustness audits, simulate historical market crashes, and examine how your portfolio responds under real-world distress.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE SANDBOX SECTION ──────────────────────────── */}
      <section id="sandbox" className="py-20 px-6 border-b border-border-2 bg-surface rounded-none">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-12">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-strong font-semibold">INTERACTIVE PREVIEW</span>
            <h2 className="text-3xl font-black uppercase text-text-strong tracking-tight">Factor Backtest Sandbox</h2>
            <p className="text-sm text-text-2 max-w-xl font-sans leading-relaxed">
              Tweak alpha factor variables in real-time below to generate a dynamic backtest equity curve simulation comparing Stratum to the S&P 500 (SPY).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Sliders Controls */}
            <div className="lg:col-span-4 border border-border-2 bg-bg p-6 flex flex-col justify-between rounded-none">
              <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-wider font-mono text-text-strong m-0 border-b border-border-2 pb-3 flex items-center justify-between rounded-none">
                  Factor Weights Configuration
                  <span className="text-[9px] bg-text-strong/10 text-text-strong px-1.5 py-0.5 border border-text-strong/20">LIVE ENGINE</span>
                </h3>

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
                  <span className="text-[9px] text-text-3 font-mono">Targets assets displaying strong 3-12 month trends. High volatility.</span>
                </div>

                {/* Value */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-text-2 font-semibold">Value (B/M)</span>
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
                  <span className="text-[9px] text-text-3 font-mono">Targets low price-to-book ratios. Steady returns, low drawdowns.</span>
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
                  <span className="text-[9px] text-text-3 font-mono">Prioritizes market beta defense. Smooths performance curve.</span>
                </div>
              </div>

              {/* Sandbox Metrics Summary */}
              <div className="grid grid-cols-3 gap-2 border-t border-border-2 pt-6 mt-8 font-mono">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-text-3 font-semibold uppercase">EST. CAGR</span>
                  <span className="text-sm font-black text-text-strong">{metrics.cagr}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-text-3 font-semibold uppercase">SHARPE</span>
                  <span className="text-sm font-black text-text-strong">{metrics.sharpe}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-text-3 font-semibold uppercase">MAX DD</span>
                  <span className="text-sm font-black text-text-strong text-red">{metrics.drawdown}</span>
                </div>
              </div>
            </div>

            {/* Right Chart Visualization */}
            <div className="lg:col-span-8 border border-border-2 bg-bg p-6 flex flex-col justify-between rounded-none">
              <div className="flex items-center justify-between border-b border-border-2 pb-4 mb-4 rounded-none">
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

              <div className="font-mono text-[9px] text-text-3 leading-relaxed mt-4 pt-4 border-t border-border-2 rounded-none">
                *SIMULATION DISCLAIMER: Simulated backtest results computed via mock vector projections using deterministic historical noise. Returns do not account for slippage or tax implications. Past behavior does not guarantee future market yields.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ──────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-6 border-b border-border-2 max-w-7xl mx-auto rounded-none">
        <div className="flex flex-col gap-4 mb-16 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-strong font-semibold">ACCESS TIERS</span>
          <h2 className="text-3xl font-black uppercase text-text-strong tracking-tight">Flexible License Models</h2>
          <p className="text-sm text-text-2 max-w-md mx-auto font-sans leading-relaxed">
            Gain immediate terminal access. Deploy quantitative agents built to model portfolios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="border border-border-2 p-8 bg-surface flex flex-col justify-between h-[420px] rounded-none">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-text-3 uppercase tracking-wider font-semibold">Sandbox Terminal</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-text-strong font-mono">$0</span>
                <span className="text-[10px] font-mono text-text-3 uppercase font-semibold">/ forever</span>
              </div>
              <p className="text-[12px] text-text-2 font-sans leading-relaxed">
                Test framework features using simulated local mock assets. Access backtester libraries, screaming filters, and standard KPIs.
              </p>
              <div className="border-t border-border-3 pt-4 flex flex-col gap-2 font-mono text-[11px] text-text-2 rounded-none">
                <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> 15 Preset Tick Universe</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Dynamic Factor Sliders</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> AI Copilot (15 prompts/day)</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('signup')}
              className="w-full py-2 border border-border-3 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-surface-2 transition-all mt-4 rounded-none"
            >
              Sign Up Free
            </button>
          </div>

          {/* Plan 2 */}
          <div className="border-2 border-text-strong p-8 bg-surface flex flex-col justify-between h-[420px] relative rounded-none">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-text-strong text-bg font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 font-black rounded-none">
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
              <div className="border-t border-border-3 pt-4 flex flex-col gap-2 font-mono text-[11px] text-text-2 rounded-none">
                <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Full US Market Universe</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Unlimited Daily Backtesting</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Immersive AI Copilot Audit</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Custom Factor Importer</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('signup')}
              className="w-full py-2 bg-text-strong text-bg font-mono text-xs uppercase tracking-wider font-black hover:bg-text-2 transition-all mt-4 border border-text-strong rounded-none"
            >
              Start Free Trial
            </button>
          </div>

          {/* Plan 3 */}
          <div className="border border-border-2 p-8 bg-surface flex flex-col justify-between h-[420px] rounded-none">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-text-3 uppercase tracking-wider font-semibold">Institutional API</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-text-strong font-mono">$450</span>
                <span className="text-[10px] font-mono text-text-3 uppercase font-semibold">/ month</span>
              </div>
              <p className="text-[12px] text-text-2 font-sans leading-relaxed">
                Designed for algorithmic quantitative desks requiring low latency API data connectors, sub-second latency, and premium SLA.
              </p>
              <div className="border-t border-border-3 pt-4 flex flex-col gap-2 font-mono text-[11px] text-text-2 rounded-none">
                <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Direct Broker-Dealer Pipelines</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Multi-threading Engine Nodes</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-text-strong" /> Custom SLA & Dedicated Support</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('signup')}
              className="w-full py-2 border border-border-3 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-surface-2 transition-all mt-4 rounded-none"
            >
              Contact Desk
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="w-full border-t border-border-2 bg-surface px-6 py-12 rounded-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[10px] text-text-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-text-strong rounded-none" />
            <span className="font-bold tracking-wider uppercase text-text-strong">STRATUM OS V1.2.0</span>
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
