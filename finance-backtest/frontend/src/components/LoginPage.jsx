import React, { useState } from 'react'
import { Lock, User, Terminal, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react'

export default function LoginPage({ onLogin, onNavigate }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [logText, setLogText] = useState('')
  const [error, setError] = useState('')

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Error: Credentials must not be empty.')
      return
    }

    setError('')
    setLoading(true)
    setLogText('Establishing secure SSH connection...')

    // Simulated terminal authentication sequence
    setTimeout(() => {
      setLogText(prev => prev + '\nValidating cryptographic signature...')
      setTimeout(() => {
        setLogText(prev => prev + '\nAccess granted. Launching Phineus OS...')
        setTimeout(() => {
          setLoading(false)
          onLogin({ username, tier: 'Professional' })
        }, 800)
      }, 800)
    }, 700)
  }

  const handleBypass = () => {
    setLoading(true)
    setError('')
    setLogText('Connecting to sandbox cluster...\nInitializing public trial session...')
    setTimeout(() => {
      setLoading(false)
      onLogin({ username: 'guest_quanter', tier: 'Sandbox Free' })
    }, 1200)
  }

  return (
    <div className="login-layout min-h-screen bg-bg text-text font-sans flex items-center justify-center p-6 relative">
      {/* Back button */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 border border-border-3 font-mono text-[10px] uppercase tracking-wider px-3.5 py-1.5 hover:bg-surface-2 transition-all font-semibold"
      >
        <ArrowLeft size={12} /> Return to landing
      </button>

      <div className="w-full max-w-[420px] border border-border-2 bg-surface flex flex-col">
        {/* Terminal Header */}
        <div className="border-b border-border-2 px-4 py-2.5 bg-surface-2 flex items-center justify-between font-mono text-[10px] text-text-3 font-semibold">
          <span className="flex items-center gap-1.5">
            <Terminal size={12} className="text-green" /> auth_portal.sh
          </span>
          <span className="text-[9px] uppercase tracking-widest text-green border border-green/20 px-1 py-0.2 bg-green/5">SECURE</span>
        </div>

        {/* Form area */}
        <div className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-black uppercase text-text-strong tracking-wide font-mono m-0">Terminal Access Port</h2>
            <p className="text-[11px] text-text-3 font-mono m-0">Enter your credentials to boot into the strategy workspace.</p>
          </div>

          {error && (
            <div className="border border-red/20 bg-red/5 p-3 flex gap-2 items-start font-mono text-[10px] text-red leading-relaxed">
              <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="border border-border-2 bg-bg p-4 font-mono text-[10px] text-green h-[120px] whitespace-pre-line flex flex-col justify-between">
              <div>{logText}</div>
              <div className="flex gap-2 items-center">
                <span className="w-1.5 h-1.5 bg-green animate-ping rounded-full" />
                <span>Decrypting credentials...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 font-mono text-xs">
              {/* Username Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">Username / Email</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-3">
                    <User size={13} />
                  </span>
                  <input
                    type="text"
                    placeholder="quanter_101"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-bg border border-border-2 focus:border-green text-text-strong pl-9 pr-3 py-2 outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">Secret Key (Password)</label>
                  <a href="#reset" className="text-[9px] text-text-3 hover:text-green">Forgot Key?</a>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-3">
                    <Lock size={13} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-bg border border-border-2 focus:border-green text-text-strong pl-9 pr-3 py-2 outline-none"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <button
                type="submit"
                className="w-full bg-green text-bg font-black uppercase tracking-wider py-2.5 hover:bg-green-dim transition-all flex items-center justify-center gap-2 mt-2 border border-green"
              >
                Authenticate Access <ArrowRight size={13} />
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border-3"></div>
                <span className="flex-shrink mx-4 text-[9px] text-text-3 font-semibold uppercase tracking-wider">OR</span>
                <div className="flex-grow border-t border-border-3"></div>
              </div>

              {/* Fast access bypass */}
              <button
                type="button"
                onClick={handleBypass}
                className="w-full border border-border-3 hover:bg-surface-2 font-bold uppercase tracking-wider py-2 transition-all flex items-center justify-center gap-1.5"
              >
                Bypass to Demo Session
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-2 p-4 bg-surface-2 flex justify-between items-center font-mono text-[9px] text-text-3">
          <span>STRATUM OS INTEGRITY: VERIFIED</span>
          <button
            onClick={() => onNavigate('signup')}
            className="hover:text-green font-bold uppercase"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}
