"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Clock, 
  Lock, 
  Terminal, 
  ArrowRight, 
  Sparkles,
  CloudLightning,
  EyeOff,
  Globe
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 font-sans text-zinc-300 overflow-x-hidden selection:bg-indigo-500/20">
      
      {/* Top Navbar */}
      <nav className="flex justify-between items-center bg-zinc-900/40 border-b border-zinc-800/80 px-6 py-4 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="font-mono text-base font-bold text-white tracking-tight flex items-center gap-1.5 select-none">
          <span className="text-indigo-400">&gt;</span> pubsite.co
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition"
          >
            [dashboard]
          </Link>
          <Link 
            href="/editor" 
            id="nav-btn-workspace"
            className="bg-indigo-650 hover:bg-indigo-600 active:bg-indigo-700 text-zinc-950 hover:text-zinc-950 font-bold px-4 py-1.5 rounded text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
          >
            Launch Workspace <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20 max-w-4xl mx-auto space-y-8 relative">
        {/* Subtle grid background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Release tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>v1.2.0 Ingestion Sandbox Active</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
          Secure, Instant <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">HTML hosting</span> at the edge
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Deploy clean, sandboxed static web pages in under 2.8 seconds. Features automated phishing prevention, telemetry stripping, and 100% cookie isolation.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <Link
            href="/editor"
            id="btn-hero-workspace"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-zinc-950 hover:text-zinc-950 font-bold px-8 py-3 rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-indigo-650/15"
          >
            <CloudLightning className="w-4 h-4 fill-current" /> Open Developer Workspace
          </Link>
          <Link
            href="/dashboard"
            id="btn-hero-dashboard"
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 hover:border-zinc-700 font-semibold px-8 py-3 rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            View Platform Metrics
          </Link>
        </div>

        {/* Mini Performance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-16 max-w-3xl">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-left font-mono">
            <div className="flex items-center gap-1.5 text-zinc-500 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] uppercase">Latency</span>
            </div>
            <p className="text-xl font-bold text-zinc-100">&lt; 2.8s</p>
            <p className="text-[10px] text-zinc-500 mt-1">Instant compiling &amp; DNS routing</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-left font-mono">
            <div className="flex items-center gap-1.5 text-zinc-500 mb-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] uppercase">Isolation</span>
            </div>
            <p className="text-xl font-bold text-zinc-100">100% Isolated</p>
            <p className="text-[10px] text-zinc-500 mt-1">Strict sandboxed storage contexts</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-left font-mono">
            <div className="flex items-center gap-1.5 text-zinc-500 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] uppercase">Sanitation</span>
            </div>
            <p className="text-xl font-bold text-zinc-100">Zero Trust</p>
            <p className="text-[10px] text-zinc-500 mt-1">Automated script &amp; phishing filter</p>
          </div>
        </div>
      </header>

      {/* Feature Section */}
      <section className="bg-zinc-900/20 border-t border-zinc-900 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl font-bold text-zinc-200">Engineered for Safe Hosting</h2>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">Every HTML deploy on pubsite.co undergoes high-security sanitation at the ingestion layer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-900 flex items-center justify-center text-indigo-400">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-sm font-bold text-zinc-200">Real-Time Sandbox Editor</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                An ultra-focused split-screen code editing layout with a sandboxed browser iframe. See rendering instantly as you type.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-900 flex items-center justify-center text-emerald-400">
                <EyeOff className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-sm font-bold text-zinc-200">Ingestion Telemetry Stripping</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automatically detects and comments out telemetry tracker scripts (e.g. Google Analytics) during edge server upload.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-900 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-sm font-bold text-zinc-200">Credentials Harvesting Shield</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Aggressively flags and blocks password inputs (`type="password"`) inside sandboxed subdomains to prevent phishing.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-900 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-sm font-bold text-zinc-200">AI Sidekick Optimizer</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Conversational assistant drawer with interactive code diff highlights. Review suggestions and apply them in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6 bg-zinc-950 text-center font-mono text-[10px] text-zinc-600 mt-auto">
        <p>&copy; 2026 pubsite.co. Built for portfolio showcase compilation challenges.</p>
      </footer>

    </div>
  );
}
