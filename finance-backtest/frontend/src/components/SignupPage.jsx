import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Key, ShieldCheck, Database, Sliders, Play, Terminal } from 'lucide-react'

export default function SignupPage({ onSignup, onNavigate }) {
  const [step, setStep] = useState(1)

  // Step 1: Account
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Step 2: Strategy Configuration
  const [universe, setUniverse] = useState('large-cap')
  const [initialCapital, setInitialCapital] = useState('100000')

  // Step 3: Broker Credentials (Mock)
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [usePaperTrading, setUsePaperTrading] = useState(true)

  const [loading, setLoading] = useState(false)
  const [setupLog, setSetupLog] = useState('')

  const handleNext = () => {
    if (step === 1 && (!email || !username || !password)) {
      alert('Error: Please complete all account credentials.')
      return
    }
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleComplete = () => {
    setLoading(true)
    setSetupLog('Allocating cloud database clusters for workspace...')

    setTimeout(() => {
      setSetupLog(prev => prev + '\nCaching price history files for standard universe...')
      setTimeout(() => {
        setSetupLog(prev => prev + '\nConnecting to sandbox broker instance...')
        setTimeout(() => {
          setSetupLog(prev => prev + '\nConfiguration successfully written. Welcome to Stratum.')
          setTimeout(() => {
            setLoading(false)
            onSignup({
              username,
              tier: 'Standard Suite',
              universe,
              capital: initialCapital,
              apiConnected: apiKey ? true : false
            })
          }, 800)
        }, 800)
      }, 850)
    }, 750)
  }

  return (
    <div className="signup-layout min-h-screen bg-bg text-text font-sans flex items-center justify-center p-6 relative rounded-none">
      {/* Return Button */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 border border-border-3 font-mono text-[10px] uppercase tracking-wider px-3.5 py-1.5 hover:bg-surface-2 transition-all font-semibold rounded-none"
      >
        <ArrowLeft size={12} /> Return to landing
      </button>

      <div className="w-full max-w-[500px] border border-border-2 bg-surface flex flex-col rounded-none">
        {/* Terminal top header */}
        <div className="border-b border-border-2 px-4 py-2.5 bg-surface-2 flex items-center justify-between font-mono text-[10px] text-text-3 font-semibold rounded-none">
          <span className="flex items-center gap-1.5">
            <Terminal size={12} className="text-text-strong" /> setup_wizard.sh
          </span>
          <div className="flex gap-2">
            <span className={`px-1.5 py-0.2 border rounded-none ${step === 1 ? 'border-text-strong text-text-strong bg-surface-2' : 'border-border-3 text-text-3'}`}>01. ACCOUNT</span>
            <span className={`px-1.5 py-0.2 border rounded-none ${step === 2 ? 'border-text-strong text-text-strong bg-surface-2' : 'border-border-3 text-text-3'}`}>02. FACTORS</span>
            <span className={`px-1.5 py-0.2 border rounded-none ${step === 3 ? 'border-text-strong text-text-strong bg-surface-2' : 'border-border-3 text-text-3'}`}>03. API</span>
          </div>
        </div>

        {/* Wizard Panel content */}
        <div className="p-8 flex flex-col gap-6 rounded-none">
          {loading ? (
            <div className="border border-border-2 bg-bg p-4 font-mono text-[10px] text-text-strong h-[160px] whitespace-pre-line flex flex-col justify-between rounded-none">
              <div>{setupLog}</div>
              <div className="flex gap-2 items-center">
                <span className="w-2.5 h-2.5 bg-text-strong animate-ping rounded-none" />
                <span>Writing environment headers...</span>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Account setup */}
              {step === 1 && (
                <div className="flex flex-col gap-5 rounded-none">
                  <div className="flex flex-col gap-1 rounded-none">
                    <h2 className="text-lg font-black uppercase text-text-strong tracking-wide font-mono m-0">Initialize Account</h2>
                    <p className="text-[11px] text-text-3 font-mono m-0">Build your credential files to store portfolio strategies.</p>
                  </div>

                  <div className="flex flex-col gap-3 font-mono text-xs rounded-none">
                    <div className="flex flex-col gap-1 rounded-none">
                      <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">Email Address</label>
                      <input
                        type="email"
                        placeholder="john.doe@stratops.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-bg border border-border-2 focus:border-text-strong text-text-strong px-3 py-2 outline-none rounded-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 rounded-none">
                      <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">Workspace Handle (Username)</label>
                      <input
                        type="text"
                        placeholder="quanter_pro"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-bg border border-border-2 focus:border-text-strong text-text-strong px-3 py-2 outline-none rounded-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 rounded-none">
                      <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">Secret Key (Password)</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-bg border border-border-2 focus:border-text-strong text-text-strong px-3 py-2 outline-none rounded-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full bg-text-strong text-bg font-black uppercase tracking-wider py-2.5 hover:bg-text-2 transition-all flex items-center justify-center gap-2 border border-text-strong mt-2 font-mono text-xs rounded-none"
                  >
                    Next Onboarding Step <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* STEP 2: Customization */}
              {step === 2 && (
                <div className="flex flex-col gap-5 rounded-none">
                  <div className="flex flex-col gap-1 rounded-none">
                    <h2 className="text-lg font-black uppercase text-text-strong tracking-wide font-mono m-0">Universe & Customization</h2>
                    <p className="text-[11px] text-text-3 font-mono m-0">Configure your default testing nodes and capital metrics.</p>
                  </div>

                  <div className="flex flex-col gap-4 font-mono text-xs rounded-none">
                    <div className="flex flex-col gap-2 rounded-none">
                      <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">Trading Asset Universe</label>
                      <div className="grid grid-cols-1 gap-2 rounded-none">
                        <div
                          onClick={() => setUniverse('large-cap')}
                          className={`border p-3 cursor-pointer transition-all rounded-none ${universe === 'large-cap' ? 'border-text-strong bg-surface-2' : 'border-border-2 bg-bg hover:bg-surface-2'}`}
                        >
                          <div className="flex justify-between items-center mb-1 rounded-none">
                            <span className="font-bold text-text-strong">S&P 500 Core Portfolio</span>
                            {universe === 'large-cap' && <Check size={12} className="text-text-strong" />}
                          </div>
                          <span className="text-[10px] text-text-2">Runs testing over leading tech, finance, and industrial indices.</span>
                        </div>

                        <div
                          onClick={() => setUniverse('tech-heavy')}
                          className={`border p-3 cursor-pointer transition-all rounded-none ${universe === 'tech-heavy' ? 'border-text-strong bg-surface-2' : 'border-border-2 bg-bg hover:bg-surface-2'}`}
                        >
                          <div className="flex justify-between items-center mb-1 rounded-none">
                            <span className="font-bold text-text-strong">NASDAQ Innovation Tilt</span>
                            {universe === 'tech-heavy' && <Check size={12} className="text-text-strong" />}
                          </div>
                          <span className="text-[10px] text-text-2">High momentum variance factor. Focuses heavily on high-growth assets.</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 rounded-none">
                      <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">Simulated Cash Balance ($ USD)</label>
                      <input
                        type="number"
                        value={initialCapital}
                        onChange={(e) => setInitialCapital(e.target.value)}
                        className="bg-bg border border-border-2 focus:border-text-strong text-text-strong px-3 py-2 outline-none rounded-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-2 font-mono text-xs rounded-none">
                    <button
                      onClick={handleBack}
                      className="border border-border-3 py-2.5 font-bold uppercase tracking-wider hover:bg-surface-2 transition-all flex items-center justify-center gap-1.5 rounded-none"
                    >
                      <ArrowLeft size={13} /> Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="bg-text-strong text-bg py-2.5 font-black uppercase tracking-wider hover:bg-text-2 transition-all flex items-center justify-center gap-1.5 border border-text-strong rounded-none"
                    >
                      Next Step <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: API Integration */}
              {step === 3 && (
                <div className="flex flex-col gap-5 rounded-none">
                  <div className="flex flex-col gap-1 rounded-none">
                    <h2 className="text-lg font-black uppercase text-text-strong tracking-wide font-mono m-0">Connect Broker API</h2>
                    <p className="text-[11px] text-text-3 font-mono m-0">Optional: Bind credentials to simulate real-time paper positions.</p>
                  </div>

                  <div className="flex flex-col gap-3 font-mono text-xs rounded-none">
                    <div className="border border-border-2 bg-bg p-3.5 flex flex-col gap-1.5 rounded-none">
                      <span className="text-[10px] text-text-strong font-bold uppercase tracking-wider flex items-center gap-1 rounded-none">
                        <Database size={11} /> Alpaca API Connection (Simulated)
                      </span>
                      <p className="text-[9px] text-text-3 m-0 leading-relaxed">
                        Phineus can read live market pricing logs and send orders to Alpaca paper systems. You can leave these blank and configure later.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 rounded-none">
                      <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">Alpaca Key ID</label>
                      <input
                        type="text"
                        placeholder="PK..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="bg-bg border border-border-2 focus:border-text-strong text-text-strong px-3 py-2 outline-none font-mono rounded-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1 rounded-none">
                      <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">Alpaca Secret Key</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••••••••••••••••••"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        className="bg-bg border border-border-2 focus:border-text-strong text-text-strong px-3 py-2 outline-none font-mono rounded-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-1 rounded-none">
                      <input
                        type="checkbox"
                        id="paper"
                        checked={usePaperTrading}
                        onChange={(e) => setUsePaperTrading(e.target.checked)}
                        className="accent-text-strong cursor-pointer rounded-none"
                      />
                      <label htmlFor="paper" className="text-[10px] text-text-2 uppercase tracking-wide cursor-pointer font-semibold rounded-none">
                        Default to Sandbox / Paper Trade mode
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-2 font-mono text-xs rounded-none">
                    <button
                      onClick={handleBack}
                      className="border border-border-3 py-2.5 font-bold uppercase tracking-wider hover:bg-surface-2 transition-all flex items-center justify-center gap-1.5 rounded-none"
                    >
                      <ArrowLeft size={13} /> Back
                    </button>
                    <button
                      onClick={handleComplete}
                      className="bg-text-strong text-bg py-2.5 font-black uppercase tracking-wider hover:bg-text-2 transition-all flex items-center justify-center gap-1.5 border border-text-strong rounded-none"
                    >
                      Initialize Workspace <Play size={11} className="fill-bg" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-2 p-4 bg-surface-2 flex justify-between items-center font-mono text-[9px] text-text-3 rounded-none">
          <span>ALGO REGISTRATION PORT</span>
          <button
            onClick={() => onNavigate('login')}
            className="hover:text-text-strong font-bold uppercase rounded-none"
          >
            I have an account
          </button>
        </div>
      </div>
    </div>
  )
}
