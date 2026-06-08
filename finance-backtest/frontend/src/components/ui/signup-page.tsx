"use client"
import React, { useState, useId } from "react"
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
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from 'lucide-react'
import { DotLoader } from "@/components/ui/dot-loader"
import stratumLogo from "../../Phineus-Logo.jpg"

const loaderFrames = [
  [14, 7, 0, 8, 6, 13, 20],
  [14, 7, 13, 20, 16, 27, 21],
  [14, 20, 27, 21, 34, 24, 28],
  [27, 21, 34, 28, 41, 32, 35],
  [34, 28, 41, 35, 48, 40, 42],
  [34, 28, 41, 35, 48, 42, 46],
  [34, 28, 41, 35, 48, 42, 38],
  [34, 28, 41, 35, 48, 30, 21],
  [34, 28, 41, 48, 21, 22, 14],
  [34, 28, 41, 21, 14, 16, 27],
  [34, 28, 21, 14, 10, 20, 27],
  [28, 21, 14, 4, 13, 20, 27],
  [28, 21, 14, 12, 6, 13, 20],
  [28, 21, 14, 6, 13, 20, 11],
  [28, 21, 14, 6, 13, 20, 10],
  [14, 6, 13, 20, 9, 7, 21],
]

export function SignupPage({ onSignup, onNavigate }) {
  const id = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logText, setLogText] = useState('')
  const [error, setError] = useState('')

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please complete all fields.')
      return
    }
    setError('')
    setLoading(true)
    setLogText('Provisioning systematic strategy environment...')
    setTimeout(() => {
      setLogText(prev => prev + '\nBinding database headers & schema definitions...')
      setTimeout(() => {
        setLogText(prev => prev + '\nOptimizing factor vector workspace caches...')
        setTimeout(() => {
          setLoading(false)
          onSignup({ username: name.split(' ')[0] || 'stratum_quanter', tier: 'Professional' })
        }, 1500)
      }, 2000)
    }, 1500)
  }

  const handleGoogleSignup = () => {
    setLoading(true)
    setLogText('Connecting with Google Cloud IAM OAuth cluster...')
    setTimeout(() => {
      setLogText(prev => prev + '\nVerifying single sign-on authentication details...')
      setTimeout(() => {
        setLoading(false)
        onSignup({ username: 'google_quanter', tier: 'Professional' })
      }, 2500)
    }, 2500)
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
            <img src={stratumLogo} alt="Stratum Logo" className="h-10 w-auto object-contain invert mix-blend-screen brightness-150" />
          </a>
        </div>
        <div className="flex flex-1 w-full items-center justify-center">
          <div className="w-full max-w-[340px]">
            {loading ? (
              <div className="border border-border-2 bg-surface-2 p-5 font-mono text-[10px] text-text-strong flex flex-col gap-4 shadow-2xl rounded-none min-h-[160px]">
                <div className="flex items-center gap-4">
                  <DotLoader
                    frames={loaderFrames}
                    className="gap-0.5"
                    dotClassName="bg-text-strong/15 [&.active]:bg-text-strong w-1.5 h-1.5"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="uppercase tracking-widest font-black text-[11px]">Establishing Link</span>
                    <span className="text-text-3 text-[9px]">Please stand by...</span>
                  </div>
                </div>
                <div className="text-text-2 text-[9px] border-t border-border-2 pt-3 h-[70px] whitespace-pre-line leading-relaxed overflow-y-auto scrollbar-none">
                  {logText}
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                <FieldGroup className="rounded-none">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold text-text-strong font-mono uppercase tracking-wide">Sign Up for Stratum</h1>
                    <p className="text-muted-foreground text-xs text-balance font-mono">
                      We just need a few details to get you started.
                    </p>
                  </div>
                  {error && (
                    <div className="border border-red/20 bg-red/5 p-2.5 font-mono text-[10px] text-red text-center rounded-none">
                      {error}
                    </div>
                  )}
                  <Field className="rounded-none">
                    <Label htmlFor={`${id}-name`} className="font-mono text-[10px] uppercase tracking-wider text-text-3 font-semibold mb-1">Full name</Label>
                    <Input 
                      id={`${id}-name`} 
                      placeholder="Matt Welsh" 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                      className="rounded-none border-border-2"
                    />
                  </Field>
                  <Field className="rounded-none">
                    <Label htmlFor={`${id}-email`} className="font-mono text-[10px] uppercase tracking-wider text-text-3 font-semibold mb-1">Email</Label>
                    <Input 
                      id={`${id}-email`} 
                      placeholder="contact@stratum.ops" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="rounded-none border-border-2"
                    />
                  </Field>
                  <Field className="rounded-none">
                    <Label htmlFor={`${id}-password`} className="font-mono text-[10px] uppercase tracking-wider text-text-3 font-semibold mb-1">Password</Label>
                    <div className="relative flex items-center">
                      <Input
                        id={`${id}-password`}
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-none border-border-2 w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-text-3 hover:text-text-strong transition-colors cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>
                  <Field className="rounded-none">
                    <Button type="submit" className="w-full bg-text-strong text-bg font-black font-mono text-xs uppercase tracking-wider hover:bg-text-2 transition-colors py-2.5 rounded-md border border-text-strong">
                      Sign Up
                    </Button>
                  </Field>
                  <FieldSeparator className="rounded-none font-mono text-[9px] uppercase tracking-widest text-text-3">Or continue with</FieldSeparator>
                  <Field className="rounded-none">
                    <Button 
                      className="flex gap-2 w-full border border-border-2 hover:bg-surface-2 transition-colors py-2 rounded-md justify-center font-mono text-xs uppercase tracking-wider" 
                      variant="outline" 
                      type="button"
                      onClick={handleGoogleSignup}
                    >
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.357 2.72 1.5 6.7L5.266 9.765z"
                        />
                        <path
                          fill="#34A853"
                          d="M16.04 15.345c-1.07.728-2.455 1.164-4.04 1.164-2.955 0-5.46-1.99-6.355-4.664L1.87 14.88c2.045 4.055 6.24 6.82 11.13 6.82 3.1 0 5.92-.99 8.01-2.68l-3.97-3.675z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.49 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.445c-.277 1.482-1.12 2.736-2.405 3.582l3.97 3.675c2.31-2.136 3.48-5.28 3.48-9.393z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.645 11.845a7.07 7.07 0 0 1 0-2.09L1.87 6.7C1.19 8.1 0.82 9.68 0.82 11.3c0 1.62.37 3.2 1.05 4.6l3.775-3.055z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </Button>
                    <FieldDescription className="text-center mt-2 font-mono text-[10px]">
                      Already have an account?{" "}
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); onNavigate('login'); }} 
                        className="underline underline-offset-4 text-text-strong font-black uppercase tracking-wider hover:text-text-2"
                      >
                        Log In
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
