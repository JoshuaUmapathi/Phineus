import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap, Network, LineChart, ShieldCheck } from 'lucide-react'
import { IntegrationCarousel } from '@/components/ui/integration-carousel'

export function Features4() {
    return (
        <section className="py-12 md:py-20 bg-bg text-text">
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-strong font-semibold">INFRASTRUCTURE</span>
                    <h2 className="text-balance text-4xl font-black lg:text-5xl uppercase tracking-tight text-text-strong">The foundation for quantitative innovation</h2>
                    <p className="text-sm font-sans text-text-2">Stratum is evolving to be more than just models. It supports an entire ecosystem of APIs and platforms helping algorithmic traders and institutional funds innovate at scale.</p>
                </div>

                <div className="relative mx-auto grid max-w-5xl divide-x divide-y border border-border-2 *:p-12 sm:grid-cols-2 lg:grid-cols-3 bg-surface shadow-2xl">
                    <div className="space-y-3 group hover:bg-surface-2 transition-colors">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-text-strong" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-strong">Sub-second Speed</h3>
                        </div>
                        <p className="text-[11px] font-sans text-text-2 leading-relaxed">Run sub-second portfolio simulations over decades of tick data. Instantly audit allocations using streamlined active terminal prompts.</p>
                    </div>
                    <div className="space-y-3 group hover:bg-surface-2 transition-colors">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4 text-text-strong" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-strong">Institutional APIs</h3>
                        </div>
                        <p className="text-[11px] font-sans text-text-2 leading-relaxed">Access over 20 years of split- and dividend-adjusted US equity market data compiled straight from institutional-grade data nodes.</p>
                    </div>
                    <div className="space-y-3 group hover:bg-surface-2 transition-colors">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-text-strong" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-strong">Bank-grade Security</h3>
                        </div>
                        <p className="text-[11px] font-sans text-text-2 leading-relaxed">Integrate strictly read-only API connectors for Alpaca, Interactive Brokers, and Tradier. Compute allocations on secure decentralized nodes.</p>
                    </div>
                    <div className="space-y-3 group hover:bg-surface-2 transition-colors">
                        <div className="flex items-center gap-2">
                            <Pencil className="size-4 text-text-strong" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-strong">Custom Factor Logic</h3>
                        </div>
                        <p className="text-[11px] font-sans text-text-2 leading-relaxed">Use the Arbitrage Pricing Theory builder to define custom return expectations. Support for importing manual quantitative factor CSV sheets.</p>
                    </div>
                    <div className="space-y-3 group hover:bg-surface-2 transition-colors">
                        <div className="flex items-center gap-2">
                            <LineChart className="size-4 text-text-strong" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-strong">Advanced Analytics</h3>
                        </div>
                        <p className="text-[11px] font-sans text-text-2 leading-relaxed">Stress test against historical crisis shocks (2008, 2020), visualize 1,000-run Monte Carlo confidence cones, and utilize Walk-Forward Analysis.</p>
                    </div>
                    <div className="space-y-3 group hover:bg-surface-2 transition-colors">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-text-strong" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-strong">Built for AI</h3>
                        </div>
                        <p className="text-[11px] font-sans text-text-2 leading-relaxed">Leverage the Conversational Alpha Copilot to audit sector concentration limits and analyzes portfolio weight variations.</p>
                    </div>
                </div>
                <div className="mt-24 w-full">
                    <IntegrationCarousel />
                </div>
            </div>
        </section>
    )
}
