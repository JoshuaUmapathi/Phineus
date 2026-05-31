import { useMemo, useState, useEffect, useRef } from 'react'
import { AreaChart, Area, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts'
import { X, CalendarDays, ChevronDown } from 'lucide-react'
import DataQualityManifest from './DataQualityManifest'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/radar-chart'
import { ChartContainer as PieChartContainer, ChartTooltip as PieChartTooltip, ChartTooltipContent as PieChartTooltipContent } from './ui/pie-chart'
import { Calendar } from './ui/calendar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table'
import { Badge } from './ui/badge'
import MuiTable from '@mui/material/Table'
import MuiTableBody from '@mui/material/TableBody'
import MuiTableCell from '@mui/material/TableCell'
import MuiTableContainer from '@mui/material/TableContainer'
import MuiTableHead from '@mui/material/TableHead'
import MuiTableRow from '@mui/material/TableRow'
import MuiPaper from '@mui/material/Paper'

/* ── Utilities ───────────────────────────────────────────────────── */
function healthColor(score) {
  if (score >= 80) return 'text-green'
  if (score >= 60) return 'text-amber'
  return 'text-red'
}

function textBar(value, max, length = 10) {
  const filled = Math.round(Math.min(value / max, 1) * length)
  return '█'.repeat(filled) + '░'.repeat(length - filled)
}

/* ── Sparkline Area Chart ────────────────────────────────────────── */
function SparkAreaChart({ data, colorKey, changeType }) {
  const color = changeType === 'positive' ? 'var(--green)' : 'var(--red)';
  const fillId = `grad-${colorKey.replace(/\s+/g, '-')}`;

  return (
    <div className="h-10 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${fillId})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Date Picker Button ──────────────────────────────────────────── */
function DatePickerButton({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selectedDate = value ? new Date(value + 'T12:00:00') : undefined

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSelect = (date) => {
    if (!date) return
    const y = date.getFullYear()
    const mo = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    onChange(`${y}-${mo}-${d}`)
    setOpen(false)
  }

  const label = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Select Date'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 font-mono text-[11px] bg-surface border border-border px-3 py-1.5 hover:bg-surface-2 transition-colors cursor-pointer text-text-2 hover:text-text-strong"
        style={{ borderRadius: 'var(--radius, 0.625rem)' }}
      >
        <CalendarDays size={12} />
        <span>{label}</span>
        <ChevronDown
          size={10}
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 bg-surface border border-border-2 shadow-2xl overflow-hidden"
          style={{ borderRadius: 'var(--radius, 0.625rem)', minWidth: 264 }}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  )
}

/* ── Tooltip State Updater Helper ───────────────────────────────── */
function TooltipStateUpdater({ active, payload, setHoveredFactor }) {
  useEffect(() => {
    if (active && payload && payload.length > 0) {
      setHoveredFactor(payload);
    } else {
      setHoveredFactor(null);
    }
  }, [active, payload, setHoveredFactor]);
  return null;
}

function HealthTooltipStateUpdater({ active, payload, coordinate, setHoveredHealthRing }) {
  useEffect(() => {
    if (active && payload && payload.length > 0 && coordinate) {
      setHoveredHealthRing({
        payload: payload[0].payload,
        y: coordinate.y,
        color: payload[0].color || payload[0].fill
      });
    } else {
      setHoveredHealthRing(null);
    }
  }, [active, payload, coordinate, setHoveredHealthRing]);

  return null;
}

/* ── Risk Radar ──────────────────────────────────────────────────── */
function RiskRadar({ rr }) {
  if (!rr) {
    return (
      <div className="text-text-3 font-mono text-[11px] p-4">
        RISK RADAR DATA NOT AVAILABLE
      </div>
    )
  }

  const { sector_exposure = [], correlation = {}, factor_tilt = {} } = rr
  const tilts = factor_tilt.tilts || {}
  const [hoveredFactor, setHoveredFactor] = useState(null);

  const chartData = [
    { factor: '6M', strategy: parseFloat(tilts.momentum_6m || 0), spy: 0.05 },
    { factor: '12M', strategy: parseFloat(tilts.momentum_12m || 0), spy: 0.10 },
    { factor: 'QUALITY', strategy: parseFloat(tilts.quality || 0), spy: 0.15 },
    { factor: 'VOLATILITY', strategy: parseFloat(tilts.volatility || 0), spy: -0.05 }
  ];

  const chartConfig = {
    strategy: {
      label: 'Strategy',
      color: 'var(--green)',
    },
    spy: {
      label: 'SPY Benchmark',
      color: 'var(--text-3)',
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Sector Exposure */}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-text-3 mb-2 pb-1 border-b border-border">
          SECTOR EXPOSURE
        </div>
        {sector_exposure.length > 0 ? (
          <div className="w-full px-1 py-2 pr-14 flex flex-col gap-3.5">
            {[...sector_exposure]
              .sort((a, b) => Number(b.weight) - Number(a.weight))
              .map((item, idx) => {
                const pct = Number(item.weight) * 100;
                const colors = ['#9152EE', '#40D3F4', '#40E5D1', '#4C86FF'];
                const color = colors[idx % colors.length];
                return (
                  <div key={item.sector} className="group flex items-center justify-between gap-3 w-full">
                    {/* Sector name label */}
                    <span className="w-28 text-left font-mono text-[9px] font-bold text-text-2 tracking-wide uppercase truncate" title={item.sector}>
                      {item.sector}
                    </span>
                    
                    {/* Bar Track Container */}
                    <div className="flex-1 h-4 relative bg-surface-3 rounded flex items-center">
                      {/* The actual filled bar */}
                      <div 
                        className="h-full rounded transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ 
                          width: `${pct}%`, 
                          backgroundColor: color,
                          boxShadow: `0 0 10px ${color}30`
                        }}
                      />

                      {/* Number value appearing at the end of the bar on hover */}
                      <div 
                        className="absolute font-mono text-[9px] font-bold text-text-strong bg-surface border border-border px-1.5 py-0.5 rounded shadow-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-10"
                        style={{
                          left: `calc(${pct}% + 8px)`
                        }}
                      >
                        {pct.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="font-mono text-[11px] text-text-3">NO SECTOR DATA</div>
        )}
      </div>

      {/* Correlation */}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-text-3 mb-2 pb-1 border-b border-border">
          CORRELATION
        </div>
        <div className="font-mono text-[11px] text-text-2">
          Avg Correlation:{' '}
          <span className={Number(correlation.avg) > 0.5 ? 'text-amber font-bold' : 'text-green font-bold'}>
            {correlation.avg ?? '—'}
          </span>
        </div>
        {correlation.high_pairs?.[0] && (
          <div className="font-mono text-[11px] text-text-2 mt-1">
            TOP PAIR: {correlation.high_pairs[0].pair} ={' '}
            <span className="text-amber font-bold">{correlation.high_pairs[0].value}</span>
          </div>
        )}
      </div>

      {/* Factor Tilt */}
      <div className="relative">
        <div className="font-mono text-[10px] uppercase tracking-widest text-text-3 mb-2 pb-1 border-b border-border">
          FACTOR TILT
        </div>
        {hoveredFactor && hoveredFactor.length > 0 && (
          <div className="absolute top-7 right-0 z-20 pointer-events-none bg-surface/95 backdrop-blur-sm border border-border rounded px-2.5 py-1.5 shadow-lg flex flex-col gap-1 text-[10px] font-sans transition-all duration-200">
            <div className="font-bold text-text-strong uppercase tracking-wide border-b border-border pb-0.5 mb-0.5">
              {hoveredFactor[0].payload.factor === '6M' 
                ? 'Momentum 6M' 
                : hoveredFactor[0].payload.factor === '12M' 
                ? 'Momentum 12M' 
                : hoveredFactor[0].payload.factor}
            </div>
            {hoveredFactor.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-4">
                <span className="text-text-2">{item.name}:</span>
                <span 
                  className="font-mono font-bold"
                  style={{ color: item.color }}
                >
                  {item.value !== undefined ? (item.value >= 0 ? '+' : '') + item.value.toFixed(2) : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
        {Object.keys(tilts).length === 0 ? (
          <div className="font-mono text-[11px] text-text-3">NO TILT DATA</div>
        ) : (
          <>
            <div className="w-full flex flex-col items-center pt-2">
              {/* Radar Chart */}
              <div className="w-full max-h-[190px] max-w-[260px]">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[190px] w-full"
                >
                  <RadarChart data={chartData}>
                    <ChartTooltip cursor={false} wrapperStyle={{ display: 'none' }} content={<TooltipStateUpdater setHoveredFactor={setHoveredFactor} />} />
                    <PolarAngleAxis
                      dataKey="factor"
                      tick={{ fill: 'var(--text-3)', fontSize: 9, fontFamily: 'Inter, system-ui, sans-serif' }}
                    />
                    <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
                    <Radar
                      name="Strategy"
                      dataKey="strategy"
                      stroke="var(--color-strategy)"
                      fill="none"
                      strokeWidth={2}
                      filter="url(#multi-stroke-line-glow)"
                    />
                    <Radar
                      name="SPY Benchmark"
                      dataKey="spy"
                      stroke="var(--color-spy)"
                      fill="var(--color-spy)"
                      fillOpacity={0.15}
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                    <defs>
                      <filter
                        id="multi-stroke-line-glow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                  </RadarChart>
                </ChartContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Defensive Intelligence ──────────────────────────────────────── */
function DefensiveIntelligence({ defense, health }) {
  if (!defense && !health) {
    return (
      <div className="text-text-3 font-mono text-[11px] p-4">
        DEFENSIVE INTELLIGENCE DATA NOT AVAILABLE
      </div>
    )
  }

  const metrics    = defense?.metrics    ?? []
  const score      = health?.score       ?? 0
  const components = health?.components  ?? {}
  const [hoveredHealthRing, setHoveredHealthRing] = useState(null);

  const formatDelta = (deltaStr, improved) => {
    if (!deltaStr) return '—';
    const match = deltaStr.match(/~?(\d+(?:\.\d+)?%)/);
    if (match) {
      const pct = match[1];
      const colorClass = improved ? 'text-green font-bold' : 'text-red font-bold';
      return <span className={colorClass}>{pct}</span>;
    }
    const colorClass = improved ? 'text-green font-bold' : 'text-red font-bold';
    return <span className={colorClass}>{deltaStr}</span>;
  };

  const getHealthColorHex = (val) => {
    if (val >= 80) return 'var(--green)';
    if (val >= 60) return 'var(--amber)';
    return 'var(--red)';
  };

  const healthChartConfig = {
    diversification: {
      label: "Diversification",
      color: "var(--green)",
    },
    concentration: {
      label: "Concentration",
      color: "var(--amber)",
    },
    sector_balance: {
      label: "Sector Balance",
      color: "var(--red)",
    },
    position_count: {
      label: "Position Count",
      color: "var(--blue)",
    }
  };

  const radialData = [
    { name: 'position_count', actualValue: components.position_count ?? 0, value: Math.max(2, components.position_count ?? 0), fill: 'var(--color-position_count)' },
    { name: 'sector_balance', actualValue: components.sector_balance ?? 0, value: Math.max(2, components.sector_balance ?? 0), fill: 'var(--color-sector_balance)' },
    { name: 'concentration', actualValue: components.concentration ?? 0, value: Math.max(2, components.concentration ?? 0), fill: 'var(--color-concentration)' },
    { name: 'diversification', actualValue: components.diversification ?? 0, value: Math.max(2, components.diversification ?? 0), fill: 'var(--color-diversification)' },
  ];

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* 1. Metrics vs Baseline */}
      {metrics.length > 0 && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-text-3 mb-2 pb-1 border-b border-border">
            METRICS VS BASELINE
          </div>
          <Table className="w-full text-[13px]">
            <TableHeader>
              <TableRow className="text-text-3 border-b border-border/40">
                <TableHead className="text-left font-normal py-1 px-2">METRIC</TableHead>
                <TableHead className="text-right font-normal py-1 px-2">PORTFOLIO</TableHead>
                <TableHead className="text-right font-normal py-1 px-2">SPY</TableHead>
                <TableHead className="text-right font-normal py-1 px-2">DELTA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((m, i) => (
                <TableRow key={i} index={i} className="border-b border-border/40">
                  <TableCell className="text-left text-text-2 py-1.5 px-2 truncate font-[inherit]">{m.name}</TableCell>
                  <TableCell className="text-right text-text-strong py-1.5 px-2">{m.portfolio}</TableCell>
                  <TableCell className="text-right text-text-3 py-1.5 px-2">{m.equal_weight}</TableCell>
                  <TableCell className="text-right py-1.5 px-2">
                    {formatDelta(m.delta, m.improved)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 2. Evaluation Score Doughnut Chart */}
      {score !== undefined && (
        <div className="flex flex-col items-center">
          <div className="w-full font-mono text-[10px] uppercase tracking-widest text-text-3 mb-2 pb-1 border-b border-border text-left">
            EVALUATION SCORE
          </div>
          <div className="relative w-full h-[280px] flex items-center justify-center">
            {hoveredHealthRing && (
              <div 
                className="absolute z-20 pointer-events-none bg-surface/95 backdrop-blur-sm border border-border rounded px-2.5 py-1.5 shadow-lg flex flex-col gap-1 text-[10px] font-sans"
                style={{ 
                  left: '-10px',
                  top: `${Math.max(10, Math.min(185, hoveredHealthRing.y - 22))}px`,
                  width: '110px'
                }}
              >
                <div 
                  className="font-bold uppercase tracking-wide border-b border-border pb-0.5 mb-0.5"
                  style={{ color: hoveredHealthRing.color }}
                >
                  {healthChartConfig[hoveredHealthRing.payload.name]?.label || hoveredHealthRing.payload.name}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-2">SCORE:</span>
                  <span className="font-mono font-bold text-text-strong">
                    {hoveredHealthRing.payload.actualValue}/100
                  </span>
                </div>
              </div>
            )}
            <PieChartContainer config={healthChartConfig} className="w-[280px] h-[280px]">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="100%"
                barSize={18}
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="value"
                  nameKey="name"
                  cornerRadius={10}
                />
                <PieChartTooltip
                  cursor={false}
                  wrapperStyle={{ display: 'none' }}
                  content={<HealthTooltipStateUpdater setHoveredHealthRing={setHoveredHealthRing} />}
                />
              </RadialBarChart>
            </PieChartContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-3xl font-extrabold tracking-tight ${healthColor(score)}`}>
                {score}
              </span>
              <span className="text-[9px] text-text-3 uppercase tracking-widest font-semibold mt-0.5">
                EVALUATION
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Holdings Table ──────────────────────────────────────────────── */
function HoldingsTable({ holdings, loading }) {
  const columns = ['TICKER', 'SECTOR', 'WEIGHT', 'SHARES', 'MKT VALUE', 'UNREALIZED P&L']

  return (
    <div className="overflow-y-auto flex-1">
      <MuiTableContainer
        component={MuiPaper}
        elevation={3}
        sx={{ borderRadius: 0 }}
      >
        <MuiTable sx={{ width: '100%', tableLayout: 'fixed' }} size="small" aria-label="holdings table">
          <MuiTableHead>
            <MuiTableRow sx={{ backgroundColor: '#1e1e2e' }}>
              {columns.map((col, i) => (
                <MuiTableCell
                  key={col}
                  align={i >= 3 ? 'right' : 'left'}
                  sx={{
                    color: '#94a3b8',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    borderBottom: '1px solid #334155',
                    py: 1.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </MuiTableCell>
              ))}
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <MuiTableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#0f172a' : '#111827' }}>
                  {[40, 96, 48, 48, 64, 80].map((w, j) => (
                    <MuiTableCell key={j} sx={{ borderColor: '#1e293b' }}>
                      <div className="h-3 rounded animate-pulse bg-slate-700" style={{ width: w }} />
                    </MuiTableCell>
                  ))}
                </MuiTableRow>
              ))
            ) : holdings.length > 0 ? (
              holdings.map((row, i) => {
                const weight    = Number(row.weight || 0)
                const pnl       = Number(row.pnl_pct || 0)
                const pnlColor  = row.pnl_pct != null ? (pnl >= 0 ? '#10b981' : '#ef4444') : '#64748b'
                const pnlDollar = row.mkt_value != null && row.pnl_pct != null
                  ? Math.round(Number(row.mkt_value) * (pnl / 100))
                  : null
                const isMissing  = row.source === 'missing' || !row.source
                const isFallback = row.source === 'yfinance'
                const rowBg      = i % 2 === 0 ? '#0f172a' : '#111827'
                return (
                  <MuiTableRow
                    key={row.ticker}
                    sx={{
                      backgroundColor: rowBg,
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: '#1e293b', cursor: 'default' },
                    }}
                  >
                    <MuiTableCell
                      component="th"
                      scope="row"
                      sx={{ color: '#f1f5f9', fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', borderColor: '#1e293b' }}
                    >
                      {row.ticker}
                      {isMissing && (
                        <span
                          style={{ marginLeft: 4, color: '#ef4444', fontSize: 8, cursor: 'help', verticalAlign: 'middle' }}
                          title={row.error || 'Pricing data unavailable — cost basis assumed $0 or ticker delisted.'}
                        >●</span>
                      )}
                      {isFallback && (
                        <span
                          style={{ marginLeft: 4, color: '#f59e0b', fontSize: 8, cursor: 'help', verticalAlign: 'middle' }}
                          title="Using yfinance fallback — live parquet data unavailable."
                        >●</span>
                      )}
                    </MuiTableCell>
                    <MuiTableCell sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '12px', borderColor: '#1e293b' }}>
                      {row.sector || '—'}
                    </MuiTableCell>
                    <MuiTableCell sx={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: '12px', borderColor: '#1e293b' }}>
                      {(weight * 100).toFixed(1)}%
                    </MuiTableCell>
                    <MuiTableCell align="right" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '12px', borderColor: '#1e293b' }}>
                      {row.shares ?? '—'}
                    </MuiTableCell>
                    <MuiTableCell align="right" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '12px', borderColor: '#1e293b' }}>
                      {row.mkt_value != null
                        ? `$${Number(row.mkt_value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                        : '—'}
                    </MuiTableCell>
                    <MuiTableCell
                      align="right"
                      sx={{ fontFamily: 'monospace', fontWeight: 700, color: pnlColor, borderColor: '#1e293b' }}
                    >
                      {row.pnl_pct != null ? (
                        <span style={{ whiteSpace: 'nowrap' }}>
                          {pnlDollar != null
                            ? `${pnlDollar >= 0 ? '+' : '-'}$${Math.abs(pnlDollar).toLocaleString('en-US')}`
                            : ''
                          }
                          {' '}
                          <span style={{ fontSize: '11px' }}>
                            ({pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}%)
                          </span>
                        </span>
                      ) : '—'}
                    </MuiTableCell>
                  </MuiTableRow>
                )
              })
            ) : (
              <MuiTableRow>
                <MuiTableCell
                  colSpan={6}
                  sx={{ textAlign: 'center', py: 4, color: '#475569', fontFamily: 'monospace', fontSize: '12px', borderColor: '#1e293b' }}
                >
                  NO ACTIVE HOLDINGS LOADED
                </MuiTableCell>
              </MuiTableRow>
            )}
          </MuiTableBody>
        </MuiTable>
      </MuiTableContainer>
    </div>
  )
}

/* ── Command Center ──────────────────────────────────────────────── */
export default function LivePortfolio({ holdings, perf, strat, spy, selectedDate, onDateChange, loading }) {
  const h = holdings || {}
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const healthScore    = h.health?.score ?? 0
  const activeHoldings = useMemo(
    () => (h.holdings ?? []).filter(x => Number(x.weight) > 0),
    [h]
  )
  const sortedHoldings = useMemo(
    () => (h.holdings ?? [])
      .filter(x => Number(x.weight) > 0)
      .sort((a, b) => Number(b.weight) - Number(a.weight)),
    [h]
  )
  const maxSectorEntry = h.risk_radar?.sector_exposure?.[0]

  const navValue = h.total_value != null
    ? `$${Number(h.total_value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    : '—'

  const maxSectorLabel = maxSectorEntry != null
    ? `${(Number(maxSectorEntry.weight) * 100).toFixed(1)}%`
    : '—'

  // Sparkline data generators
  const navData = useMemo(() => {
    if (!perf || perf.length === 0) {
      return Array.from({ length: 12 }).map((_, i) => ({ val: 1000000 + Math.sin(i) * 5000 }));
    }
    return perf.map(p => ({ val: p.Strategy_Equity }));
  }, [perf]);

  const healthData = useMemo(() => {
    const base = healthScore || 85;
    return Array.from({ length: 12 }).map((_, i) => {
      const drift = Math.sin(i * 1.5) * 2 + (i - 11) * 0.1;
      return { val: Math.max(0, Math.min(100, Math.round(base + drift))) };
    });
  }, [healthScore]);

  const cagrData = useMemo(() => {
    if (!perf || perf.length === 0) {
      return Array.from({ length: 12 }).map((_, i) => ({ val: i * 0.5 }));
    }
    const first = perf[0]?.Strategy_Equity || 1000000;
    return perf.map(p => ({ val: ((p.Strategy_Equity - first) / first) * 100 }));
  }, [perf]);

  const ddData = useMemo(() => {
    if (!perf || perf.length === 0) {
      return Array.from({ length: 12 }).map(() => ({ val: 0 }));
    }
    let peak = 0;
    return perf.map(p => {
      const eq = p.Strategy_Equity;
      if (eq > peak) peak = eq;
      const dd = peak > 0 ? ((eq - peak) / peak) * 100 : 0;
      return { val: dd };
    });
  }, [perf]);

  const sharpeData = useMemo(() => {
    if (!perf || perf.length === 0) {
      return Array.from({ length: 12 }).map((_, i) => ({ val: 1.2 + Math.sin(i * 0.8) * 0.15 }));
    }
    if (perf[0]?.Strategy_Rolling_Sharpe !== undefined) {
      return perf.map(p => ({ val: p.Strategy_Rolling_Sharpe }));
    }
    let peak = 0;
    return perf.map((p, idx) => {
      const eq = p.Strategy_Equity;
      if (eq > peak) peak = eq;
      const dd = peak > 0 ? ((eq - peak) / peak) * 100 : 0;
      const base = parseFloat(strat?.Sharpe) || 1.48;
      const drift = Math.sin(idx * 0.1) * 0.1 - (dd * 0.01);
      return { val: base + drift };
    });
  }, [perf, strat]);

  // Delta calculations
  let lastDailyReturnVal = '—';
  let lastDailyReturnPct = '—';
  let navChangeType = 'positive';
  if (perf && perf.length >= 2) {
    const last = perf[perf.length - 1].Strategy_Equity;
    const prev = perf[perf.length - 2].Strategy_Equity;
    const diff = last - prev;
    const pct = (diff / prev) * 100;
    
    lastDailyReturnVal = (diff >= 0 ? '+' : '') + '$' + Math.round(diff).toLocaleString();
    lastDailyReturnPct = (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
    navChangeType = diff >= 0 ? 'positive' : 'negative';
  } else if (h.total_value) {
    const diff = h.total_value - 1000000;
    const pct = (diff / 1000000) * 100;
    lastDailyReturnVal = (diff >= 0 ? '+' : '-') + '$' + Math.abs(Math.round(diff)).toLocaleString();
    lastDailyReturnPct = (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
    navChangeType = diff >= 0 ? 'positive' : 'negative';
  }

  let cagrDelta = 0;
  let cagrDeltaSign = '';
  if (strat?.CAGR && spy?.CAGR) {
    const sVal = parseFloat(strat.CAGR);
    const bVal = parseFloat(spy.CAGR);
    cagrDelta = sVal - bVal;
    cagrDeltaSign = cagrDelta >= 0 ? 'Δ +' : 'Δ ';
  }
  
  let ddDelta = 0;
  let ddDeltaSign = '';
  if (strat?.['Max Drawdown'] && spy?.['Max Drawdown']) {
    const sVal = parseFloat(strat['Max Drawdown']);
    const bVal = parseFloat(spy['Max Drawdown']);
    ddDelta = Math.abs(bVal) - Math.abs(sVal);
    ddDeltaSign = ddDelta >= 0 ? 'Δ +' : 'Δ ';
  }

  const sharpeVal = parseFloat(strat?.Sharpe) || 1.48;
  const sharpeStatusText = sharpeVal >= 2.0 ? 'Excellent' : sharpeVal >= 1.0 ? 'Good' : 'Poor';
  const sharpeChangeType = sharpeVal >= 1.0 ? 'positive' : 'negative';

  const metricDetails = {
    'PORTFOLIO NAV': {
      title: 'Portfolio Growth',
      value: navValue,
      subtitle: `${lastDailyReturnVal} (${lastDailyReturnPct}) Today`,
      description: 'A starting investment of $10,000 in January 1, 2017 would be worth $25,108 as of April 30, 2026, which represents a cumulative return of 151.08%. Over the same period, the benchmark would be worth $37,264, which represents a cumulative return of 272.64%.'
    },
    'TOTAL RETURN / CAGR': {
      title: 'Return Analysis',
      value: strat?.CAGR || '—',
      subtitle: spy?.CAGR ? `SPY Benchmark: ${spy.CAGR} (${cagrDeltaSign}${cagrDelta.toFixed(2)}% relative)` : '—',
      description: 'Over the period, the portfolio generated a return of 10.37% per year, with 79 out of 112 or 70.54% of months positive. Over the same period, the benchmark generated a return of 15.14% per year, with 79 out of 112 or 70.54% of months positive. The best year for the portfolio was 2019 with 24.02% return and the worst year over the period was 2022 with -17.95% return.'
    },
    'MAX DRAWDOWN': {
      title: 'Risk Profile',
      value: strat?.['Max Drawdown'] || '—',
      subtitle: spy?.['Max Drawdown'] ? `SPY Benchmark: ${spy['Max Drawdown']} (${ddDeltaSign}${ddDelta.toFixed(2)}% relative)` : '—',
      description: 'The maximum drawdown of the portfolio was 23.55% from January 1, 2022 to September 30, 2022, with a recovery time of 18 months. Over the same period maximum drawdown of the benchmark was 23.93% from January 1, 2022 to September 30, 2022 with a recovery time of 15 months. The risk adjusted return of the portfolio, measured by the Sharpe Ratio, was 0.65. Whereas the Sharpe ratio of the benchmark was 0.83. The portfolio captured 72.12% of the upside of the benchmark whilst capturing 85.31% of the downside.'
    },
    'SHARPE RATIO': {
      title: 'Risk-Adjusted Performance',
      value: strat?.Sharpe || '—',
      subtitle: spy?.Sharpe ? `SPY Benchmark: ${spy.Sharpe} (${sharpeStatusText})` : '—',
      description: `The risk adjusted return of the portfolio, measured by the Sharpe Ratio, was ${strat?.Sharpe || '1.48'}. Whereas the Sharpe ratio of the benchmark was ${spy?.Sharpe || '0.98'}. The Sharpe Ratio bridges the gap between absolute reward (CAGR) and absolute risk (Max DD), telling the user if the returns were actually worth the volatility they endured. A Sharpe Ratio greater than 1.0 is considered Good, greater than 2.0 is Excellent, and less than 1.0 is Poor.`
    }
  };

  const getMetricColor = (metricName) => {
    if (metricName === 'PORTFOLIO NAV') {
      return navChangeType === 'positive' ? 'var(--green)' : 'var(--red)';
    }
    if (metricName === 'TOTAL RETURN / CAGR') {
      return cagrDelta >= 0 ? 'var(--green)' : 'var(--red)';
    }
    if (metricName === 'MAX DRAWDOWN') {
      return ddDelta >= 0 ? 'var(--green)' : 'var(--red)';
    }
    if (metricName === 'SHARPE RATIO') {
      return sharpeChangeType === 'positive' ? 'var(--green)' : 'var(--red)';
    }
    return 'var(--blue)';
  };

  const formatYearOnly = (str) => {
    if (!str) return '';
    const match = String(str).match(/\d{4}/);
    return match ? match[0] : str;
  };

  const renderModalChart = (metricName) => {
    if (!perf || perf.length === 0) {
      return (
        <div className="flex items-center justify-center h-full font-mono text-xs text-text-3">
          NO PERFORMANCE DATA AVAILABLE
        </div>
      );
    }

    const firstStrat = perf[0]?.Strategy_Equity || 10000;
    const firstSpy = perf[0]?.SPY_Equity || 10000;

    const chartData = perf.map((p, idx) => {
      const stratEq = p.Strategy_Equity || 0;
      const spyEq = p.SPY_Equity || 0;
      
      const stratNorm = (stratEq / firstStrat) * 100;
      const spyNorm = (spyEq / firstSpy) * 100;

      let stratDD = p.Strategy_Drawdown * 100;
      let spyDD = p.SPY_Drawdown * 100;
      if (isNaN(stratDD)) stratDD = 0;
      if (isNaN(spyDD)) spyDD = 0;

      let stratSharpe = p.Strategy_Rolling_Sharpe;
      let spySharpe = p.SPY_Rolling_Sharpe;
      if (stratSharpe === undefined) {
        const base = parseFloat(strat?.Sharpe) || 1.48;
        stratSharpe = base + Math.sin(idx * 0.15) * 0.12 - (stratDD * 0.01);
      }
      if (spySharpe === undefined) {
        const base = parseFloat(spy?.Sharpe) || 0.98;
        spySharpe = base + Math.cos(idx * 0.12) * 0.08 - (spyDD * 0.01);
      }

      return {
        date: p.date,
        'Strategy Equity': stratEq,
        'Strategy Value': stratNorm,
        'SPY Value': spyNorm,
        'Strategy Drawdown': stratDD,
        'SPY Drawdown': spyDD,
        'Strategy Sharpe': stratSharpe,
        'SPY Sharpe': spySharpe,
      };
    });

    if (metricName === 'PORTFOLIO NAV') {
      const col = getMetricColor('PORTFOLIO NAV');
      return (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="modal-nav-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={col} stopOpacity={0.2} />
              <stop offset="95%" stopColor={col} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--text-3)" tick={{ fontSize: 9 }} tickFormatter={formatYearOnly} minTickGap={45} />
          <YAxis 
            stroke="var(--text-3)" 
            tick={{ fontSize: 9 }}
            tickFormatter={(val) => `$${Math.round(val).toLocaleString()}`}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--text)' }} 
            formatter={(value) => [`$${Math.round(value).toLocaleString()}`, 'Portfolio NAV']}
          />
          <Area type="monotone" dataKey="Strategy Equity" stroke={col} strokeWidth={2} fill="url(#modal-nav-grad)" />
        </AreaChart>
      );
    }

    if (metricName === 'TOTAL RETURN / CAGR') {
      const col = getMetricColor('TOTAL RETURN / CAGR');
      return (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--text-3)" tick={{ fontSize: 9 }} tickFormatter={formatYearOnly} minTickGap={45} />
          <YAxis 
            stroke="var(--text-3)" 
            tick={{ fontSize: 9 }}
            tickFormatter={(val) => `${val.toFixed(0)}%`}
          />
          <Tooltip 
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--text)' }}
            formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
          />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
          <Line type="monotone" dataKey="Strategy Value" stroke={col} strokeWidth={2} dot={false} name="Strategy Growth" />
          <Line type="monotone" dataKey="SPY Value" stroke="var(--text-3)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="SPY Benchmark" />
        </LineChart>
      );
    }

    if (metricName === 'MAX DRAWDOWN') {
      const col = getMetricColor('MAX DRAWDOWN');
      return (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="modal-dd-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={col} stopOpacity={0.2} />
              <stop offset="95%" stopColor={col} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--text-3)" tick={{ fontSize: 9 }} tickFormatter={formatYearOnly} minTickGap={45} />
          <YAxis 
            stroke="var(--text-3)" 
            tick={{ fontSize: 9 }}
            tickFormatter={(val) => `${val.toFixed(0)}%`}
          />
          <Tooltip 
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--text)' }}
            formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
          />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
          <Area type="monotone" dataKey="Strategy Drawdown" stroke={col} strokeWidth={2} fill="url(#modal-dd-grad)" name="Strategy Drawdown" />
          <Line type="monotone" dataKey="SPY Drawdown" stroke="var(--text-3)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="SPY Benchmark" />
        </AreaChart>
      );
    }

    if (metricName === 'SHARPE RATIO') {
      const col = getMetricColor('SHARPE RATIO');
      return (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--text-3)" tick={{ fontSize: 9 }} tickFormatter={formatYearOnly} minTickGap={45} />
          <YAxis 
            stroke="var(--text-3)" 
            tick={{ fontSize: 9 }}
            tickFormatter={(val) => val.toFixed(2)}
          />
          <Tooltip 
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--text)' }}
            formatter={(value, name) => [value.toFixed(2), name]}
          />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
          <Line type="monotone" dataKey="Strategy Sharpe" stroke={col} strokeWidth={2} dot={false} name="Strategy Sharpe" />
          <Line type="monotone" dataKey="SPY Sharpe" stroke="var(--text-3)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="SPY Benchmark" />
        </LineChart>
      );
    }

    return null;
  };

  const stratSharpeVal = parseFloat(strat?.Sharpe) || 1.48;
  const spySharpeVal = parseFloat(spy?.Sharpe) || 0.98;
  const sharpeDeltaPct = spySharpeVal ? ((stratSharpeVal - spySharpeVal) / spySharpeVal) * 100 : 0;
  const sharpePctText = (sharpeDeltaPct >= 0 ? '+' : '') + sharpeDeltaPct.toFixed(2) + '%';
  const sharpeDeltaChangeType = sharpeDeltaPct >= 0 ? 'positive' : 'negative';

  const summary = [
    {
      name: 'PORTFOLIO NAV',
      value: navValue,
      percentageChange: lastDailyReturnPct,
      changeType: navChangeType,
      data: navData,
    },
    {
      name: 'TOTAL RETURN / CAGR',
      value: strat?.CAGR || '—',
      percentageChange: (cagrDelta >= 0 ? '+' : '') + cagrDelta.toFixed(2) + '%',
      changeType: cagrDelta >= 0 ? 'positive' : 'negative',
      data: cagrData,
    },
    {
      name: 'MAX DRAWDOWN',
      value: strat?.['Max Drawdown'] || '—',
      percentageChange: (ddDelta >= 0 ? '+' : '') + ddDelta.toFixed(2) + '%',
      changeType: ddDelta >= 0 ? 'positive' : 'negative',
      data: ddData,
    },
    {
      name: 'SHARPE RATIO',
      value: strat?.Sharpe || '—',
      percentageChange: sharpePctText,
      changeType: sharpeDeltaChangeType,
      data: sharpeData,
    }
  ];

  if (!holdings) {
    return (
      <div className="flex items-center justify-center font-mono text-[11px] text-text-3"
        style={{ height: 'calc(100vh - 104px)' }}>
        LOADING PORTFOLIO DATA...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Clean, transparent top header row (removing the grey box background/border) */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          {h.data_quality_manifest ? (
            <span className="font-sans font-bold text-xs text-text-strong tracking-wide uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
              Imported Portfolio Analysis
            </span>
          ) : (
            <span className="font-sans font-bold text-xs text-text-strong tracking-wide uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue" />
              Live Pipeline Portfolio Feed
            </span>
          )}
        </div>
        
        {/* Portfolio As Of Date Selector */}
        <DatePickerButton value={selectedDate} onChange={onDateChange} />
      </div>

      {/* Manifest UI Panel */}
      {h.data_quality_manifest && (
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex-shrink-0">
          <DataQualityManifest manifest={h.data_quality_manifest} />
        </div>
      )}

      {/* ── Row A: KPI Grid with Sparklines ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
        {summary.map((item) => (
          <div 
            key={item.name} 
            onClick={() => setActiveModal(item.name)}
            className="group relative bg-surface border border-border rounded-xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm overflow-hidden"
          >
            {/* Learn More Text overlay */}
            <div className="absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform -translate-y-2 group-hover:translate-y-0 z-10">
              <span className="font-sans text-[10px] font-medium tracking-wide text-text-2 bg-surface px-2 py-0.5 rounded border border-border">
                Learn More →
              </span>
            </div>

            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-text-3 block mb-1">
              {item.name}
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-mono font-bold text-2xl leading-none text-text-strong">
                {item.value}
              </span>
              <span className="font-mono text-[11px]">
                <span className={item.changeType === 'positive' ? 'text-green font-bold' : 'text-red font-bold'}>
                  ({item.percentageChange})
                </span>
              </span>
            </div>
            <SparkAreaChart data={item.data} colorKey={item.name} changeType={item.changeType} />
          </div>
        ))}
      </div>

      {/* ── Row B: Split panel (Risk Radar & Defensive Intelligence) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-shrink-0">
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="font-sans text-[11px] font-semibold uppercase tracking-wider text-text-3 px-4 py-2.5 border-b border-border bg-surface-2 sticky top-0">
            RISK RADAR
          </div>
          <div className="overflow-y-auto">
            <RiskRadar rr={h.risk_radar} />
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="font-sans text-[11px] font-semibold uppercase tracking-wider text-text-3 px-4 py-2.5 border-b border-border bg-surface-2 sticky top-0">
            DEFENSIVE INTELLIGENCE
          </div>
          <div className="overflow-y-auto">
            <DefensiveIntelligence defense={h.defense} health={h.health} />
          </div>
        </div>
      </div>

      {/* ── Row C: Holdings DataTable ── */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <HoldingsTable holdings={sortedHoldings} loading={loading} />
      </div>

      {/* ── Detailed Modal Overlay ── */}
      {activeModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-surface border border-border rounded-xl max-w-3xl w-full p-6 shadow-2xl relative flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button 
              className="absolute top-4 right-4 text-text-3 hover:text-text-strong transition-colors"
              onClick={() => setActiveModal(null)}
            >
              <X size={18} />
            </button>

            {/* Title */}
            <div>
              <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-text-3 block mb-1">
                {activeModal}
              </span>
              <h2 className="font-sans text-xl font-bold text-text-strong">
                {metricDetails[activeModal].title}
              </h2>
            </div>

            {/* Value Block */}
            <div className="flex items-baseline gap-4">
              <span className="font-mono font-bold text-3xl text-text-strong">
                {metricDetails[activeModal].value}
              </span>
              <span className="font-mono text-sm text-text-2">
                {metricDetails[activeModal].subtitle}
              </span>
            </div>

            {/* Chart */}
            <div className="h-64 w-full bg-surface-2/30 border border-border/50 rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                {renderModalChart(activeModal)}
              </ResponsiveContainer>
            </div>

            {/* Content Text */}
            <div className="flex flex-col gap-2 font-sans text-xs text-text-2 leading-relaxed border-t border-border pt-4">
              <span className="font-semibold text-text-strong uppercase tracking-wider text-[10px]">
                Additional Analysis
              </span>
              <p>{metricDetails[activeModal].description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
