"use client"
import React, { useState } from "react"
import { GradientMesh } from "@/components/ui/gradient-mesh"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field-1"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Github } from "@aliimam/logos"
import { cn } from "@/lib/utils"

export function DemoPage({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [logText, setLogText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please complete all credentials.')
      return
    }
    setError('')
    setLoading(true)
    setLogText('Establishing secure SSH connection...')
    setTimeout(() => {
      setLogText('Validating signature & booting environment...')
      setTimeout(() => {
        setLoading(false)
        onLogin({ username: email.split('@')[0] || 'stratum_quanter', tier: 'Professional' })
      }, 700)
    }, 800)
  }

  const handleGithubLogin = () => {
    setLoading(true)
    setLogText('Connecting with GitHub OAuth cluster...')
    setTimeout(() => {
      setLoading(false)
      onLogin({ username: 'git_quanter', tier: 'Professional' })
    }, 1200)
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-bg text-text rounded-none">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate('landing'); }} 
            aria-label="home" 
            className="flex gap-2 items-center"
          >
            <div className="w-4 h-4 bg-text-strong border border-text-strong rounded-none" />
            <span className="font-mono text-xs font-black tracking-widest text-text-strong uppercase">STRATUM OS</span>
          </a>
        </div>
        <div className="flex flex-1 w-full items-center justify-center">
          <div className="w-full max-w-[340px]">
            {loading ? (
              <div className="border border-border-2 bg-bg p-4 font-mono text-[10px] text-text-strong h-[120px] whitespace-pre-line flex flex-col justify-between rounded-none">
                <div>{logText}</div>
                <div className="flex gap-2 items-center">
                  <span className="w-1.5 h-1.5 bg-text-strong animate-ping rounded-none" />
                  <span>Configuring workspace console...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <FieldGroup className="rounded-none">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold text-text-strong font-mono uppercase tracking-wide">Login to your account</h1>
                    <p className="text-muted-foreground text-xs text-balance font-mono">
                      Enter your credentials below to access the node
                    </p>
                  </div>
                  {error && (
                    <div className="border border-red/20 bg-red/5 p-2.5 font-mono text-[10px] text-red text-center rounded-none">
                      {error}
                    </div>
                  )}
                  <Field className="rounded-none">
                    <FieldLabel htmlFor="email" className="font-mono text-[10px] uppercase tracking-wider text-text-3">Email</FieldLabel>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="contact@stratum.ops" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="rounded-none border-border-2 focus-visible:ring-text-strong"
                    />
                  </Field>
                  <Field className="rounded-none">
                    <div className="flex items-center w-full">
                      <FieldLabel htmlFor="password" className="font-mono text-[10px] uppercase tracking-wider text-text-3">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto text-[10px] font-mono uppercase tracking-wider underline-offset-4 hover:underline text-text-3 hover:text-text-strong"
                      >
                        Forgot Key?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      placeholder="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="rounded-none border-border-2 focus-visible:ring-text-strong"
                    />
                  </Field>
                  <Field className="rounded-none">
                    <Button type="submit" className="w-full bg-text-strong text-bg font-black font-mono text-xs uppercase tracking-wider hover:bg-text-2 transition-colors py-2.5 rounded-none border border-text-strong">
                      Authenticate Access
                    </Button>
                  </Field>
                  <FieldSeparator className="rounded-none font-mono text-[9px] uppercase tracking-widest text-text-3">Or continue with</FieldSeparator>
                  <Field className="rounded-none">
                    <Button 
                      className="flex gap-2 w-full border border-border-2 hover:bg-surface-2 transition-colors py-2 rounded-none justify-center font-mono text-xs uppercase tracking-wider" 
                      variant="outline" 
                      type="button"
                      onClick={handleGithubLogin}
                    >
                      <Github /> <span>Login with GitHub</span>
                    </Button>
                    <FieldDescription className="text-center mt-2 font-mono text-[10px]">
                      Don&apos;t have an account?{" "}
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); onNavigate('signup'); }} 
                        className="underline underline-offset-4 text-text-strong font-black uppercase tracking-wider hover:text-text-2"
                      >
                        Sign up
                      </a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden rounded-none border-l border-border-2">
        <GradientMesh
          colors={["#555555", "#1c1c1c", "#080808"]}
          distortion={8}
          swirl={0.2}
          speed={0.4}
          rotation={90}
          waveAmp={0.2}
          waveFreq={20}
          waveSpeed={0.2}
          grain={0.06}
        />
        {/* Overlay a subtle, high-quality stock chart to make it topical */}
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay grayscale bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&auto=format&fit=crop&q=80")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-10 left-10 z-10 flex flex-col gap-2 font-mono rounded-none">
          <span className="text-[10px] text-text-strong uppercase tracking-widest font-black">STRATUM KERNEL SECURE SHIELD</span>
          <span className="text-xs text-text-2 font-semibold">Active Node Connection: verified (TLS 1.3)</span>
        </div>
      </div>
    </div>
  )
}
