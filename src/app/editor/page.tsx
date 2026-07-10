"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Play, 
  CloudLightning, 
  Sparkles, 
  Terminal, 
  History, 
  Monitor, 
  FileCode, 
  Info,
  Maximize2,
  Lock,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import { SecurityShield } from "@/components/SecurityShield";
import { DeploymentModal } from "@/components/DeploymentModal";
import { AISidePanel } from "@/components/AISidePanel";

const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Alex River | Developer Portfolio</title>
  <style>
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: system-ui, sans-serif;
      padding: 2rem;
      text-align: center;
    }
    h1 { color: #38bdf8; font-size: 2.5rem; margin-bottom: 0.5rem; }
    p { color: #94a3b8; font-size: 1.1rem; }
    .btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1.5rem;
    }
  </style>
</head>
<body>
  <h1>Alex River</h1>
  <p>Building high-performance interactive interfaces</p>
  
  <!-- Phishing alert: Password input -->
  <input type="password" placeholder="Enter dashboard password..." style="display:none;" />

  <!-- Unsafe inline click handler -->
  <button class="btn" onclick="alert('Demo launched!')">Pre-Order Now</button>

  <!-- Google Analytics Tracking Script -->
  <script src="https://www.google-analytics.com/analytics.js"></script>
</body>
</html>`;

const SAMPLE_LANDING = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aura — Next-Gen Audio</title>
  <style>
    body {
      background: #000;
      color: #fff;
      font-family: system-ui, sans-serif;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
    .hero {
      background: linear-gradient(135deg, #a855f7, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }
    .sub {
      color: #a1a1aa;
      font-size: 1.1rem;
      max-width: 500px;
      margin-bottom: 2rem;
    }
    button {
      background: #fff;
      color: #000;
      border: none;
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <div class="hero">Aura Audio</div>
  <p class="sub">Immersive spacial sound design engineered for modern workspaces.</p>
  <button id="cta-btn">Pre-Order Now</button>
</body>
</html>`;

const SAMPLE_PORTFOLIO = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jane Doe | Systems Architect</title>
  <style>
    body {
      background: #09090b;
      color: #fafafa;
      font-family: monospace;
      padding: 3rem 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }
    h1 { color: #10b981; font-size: 1.8rem; margin-bottom: 1.5rem; }
    .section { margin-bottom: 2.5rem; border-left: 2px solid #27272a; padding-left: 1.5rem; }
    .title { font-weight: bold; color: #e4e4e7; }
    .meta { color: #71717a; font-size: 0.8rem; margin-bottom: 0.5rem; }
    a { color: #6366f1; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>&gt; JANE_DOE.SYS</h1>
  
  <div class="section">
    <div class="title">Systems Design Engineer</div>
    <div class="meta">Location: Edge Network // Seattle</div>
    <p>Specializing in container-isolated hosting architecture, distributed database clustering, and sub-3ms routing filters.</p>
  </div>

  <div class="section">
    <div class="title">Core Tech Stack</div>
    <p>Rust / Go / WebAssembly / Next.js / Linux</p>
  </div>

  <div class="section">
    <div class="title">Active Deployments</div>
    <p>Currently optimizing CDN dns filters on <a href="https://pubsite.co">pubsite.co</a></p>
  </div>
</body>
</html>`;

export default function EditorPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [projectId, setProjectId] = useState("");
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Generate random Project ID on mount
  useEffect(() => {
    const words = ["alpha", "prism", "nexus", "vertex", "delta", "sand", "edge", "cloud", "core", "spark"];
    const word = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    setProjectId(`${word}-${num}`);
  }, []);

  // Update iframe preview dynamically as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      // Ingestion simulation: we strip tracking tags from the preview iframe to simulate sandbox
      let sanitized = code;
      const trackerPatterns = [
        /<script\b[^>]*src=["'][^"']*google-analytics\.com[^"']*["'][^>]*><\/script>/gi,
        /<script\b[^>]*src=["'][^"']*googletagmanager\.com[^"']*["'][^>]*><\/script>/gi,
        /<script\b[^>]*src=["'][^"']*mixpanel\.com[^"']*["'][^>]*><\/script>/gi
      ];
      trackerPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, "<!-- Tracker Stripped By Pubsite Ingestion Sandbox -->");
      });
      setSrcDoc(sanitized);
    }, 400);

    return () => clearTimeout(timer);
  }, [code]);

  const syncScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Drag and drop HTML file logic
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/html" || file.name.endsWith(".html")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCode(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeploySuccess = (subdomain: string) => {
    // Record deployment details in local storage for Dashboard to pick up
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pubsite_deployments");
      const list = stored ? JSON.parse(stored) : [];
      const isDuplicate = list.some((dep: any) => dep.projectId === projectId);
      
      if (!isDuplicate) {
        list.unshift({
          projectId,
          subdomain,
          timestamp: new Date().toISOString(),
          views: Math.floor(Math.random() * 25) + 1,
          sizeBytes: new Blob([code]).size
        });
        localStorage.setItem("pubsite_deployments", JSON.stringify(list));
      }
    }
  };

  const handleApplyChanges = (newCode: string) => {
    setCode(newCode);
  };

  const loadPreset = (preset: "sample" | "landing" | "portfolio") => {
    if (preset === "sample") {
      setCode(DEFAULT_CODE);
    } else if (preset === "landing") {
      setCode(SAMPLE_LANDING);
    } else {
      setCode(SAMPLE_PORTFOLIO);
    }
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="flex flex-col h-screen bg-zinc-950 font-sans overflow-hidden">
      
      {/* Header Navigation */}
      <header className="flex justify-between items-center bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 z-10 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/editor" className="font-mono text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            <span className="text-indigo-400">&gt;</span> pubsite.co
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-950/60 border border-zinc-800/80 font-mono text-[10px] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Latency: &lt; 2.8s
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1.5 bg-zinc-950/50 border border-zinc-800/80 p-0.5 rounded">
            <Link 
              href="/editor" 
              className="px-3 py-1 text-xs font-semibold rounded bg-zinc-800 text-white font-mono flex items-center gap-1.5 transition"
            >
              <FileCode className="w-3.5 h-3.5" /> Workspace
            </Link>
            <Link 
              href="/dashboard" 
              className="px-3 py-1 text-xs font-semibold rounded text-zinc-400 hover:text-zinc-200 font-mono flex items-center gap-1.5 transition"
            >
              <History className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </nav>

          <button
            onClick={() => setIsDeployModalOpen(true)}
            id="btn-go-live"
            className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-zinc-950 hover:text-zinc-950 font-bold px-4 py-1.5 rounded text-xs transition flex items-center gap-1.5 shadow-lg shadow-indigo-650/10 cursor-pointer"
          >
            <CloudLightning className="w-3.5 h-3.5 fill-current" /> Go Live
          </button>
        </div>
      </header>

      {/* Main Split-Screen Workspace Container */}
      <main className="flex-1 flex overflow-hidden relative">
        <div className={`flex-1 flex flex-col md:flex-row overflow-hidden transition-all duration-300 ${isAiOpen ? "md:pr-96" : "pr-0"}`}>
          
          {/* Left Pane (Code Editor) */}
          <div 
            className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-zinc-800 relative bg-zinc-900/10 h-1/2 md:h-full"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/40 px-4 py-2 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <span className="font-mono text-xs text-zinc-400 font-semibold uppercase tracking-wider">notepad.html</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Presets */}
                <span className="text-[10px] text-zinc-600 font-mono hidden sm:inline">PRESETS:</span>
                <button
                  onClick={() => loadPreset("sample")}
                  className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-[10px] text-zinc-300 font-mono transition cursor-pointer"
                >
                  Buggy Sample
                </button>
                <button
                  onClick={() => loadPreset("portfolio")}
                  className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-[10px] text-zinc-300 font-mono transition cursor-pointer"
                >
                  Jane Doe
                </button>
                <button
                  onClick={() => loadPreset("landing")}
                  className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-[10px] text-zinc-300 font-mono transition cursor-pointer"
                >
                  Landing Page
                </button>
              </div>
            </div>

            {/* Code Field with Gutter Line Numbers */}
            <div className="flex-1 flex overflow-hidden relative">
              <div 
                ref={gutterRef}
                className="select-none text-right pr-3 pl-2 py-4 bg-zinc-950/40 text-zinc-600 border-r border-zinc-800/40 min-w-[3rem] overflow-hidden font-mono text-xs leading-5"
              >
                {Array.from({ length: lineCount }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={syncScroll}
                className="flex-1 p-4 bg-zinc-950/10 text-zinc-100 font-mono text-xs resize-none focus:outline-none h-full overflow-y-auto whitespace-pre leading-5"
                placeholder="Write your HTML here or drag and drop an .html file..."
                style={{ caretColor: "#6366f1" }}
              />

              {/* Drag and Drop Cover State */}
              {dragOver && (
                <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm border-2 border-dashed border-indigo-500 m-3 rounded-lg flex flex-col items-center justify-center pointer-events-none transition duration-200">
                  <FolderOpen className="w-10 h-10 text-indigo-400 mb-2 animate-bounce" />
                  <p className="font-mono text-sm text-indigo-300 font-bold">DROP HTML FILE TO LOAD</p>
                  <p className="font-sans text-xs text-indigo-400/80 mt-1">Updates editor in real-time</p>
                </div>
              )}
            </div>

            {/* Security Shield Component Docked Below */}
            <div className="border-t border-zinc-800 p-3 shrink-0 bg-zinc-950/60">
              <SecurityShield code={code} />
            </div>
          </div>

          {/* Right Pane (Live Sandbox Browser) */}
          <div className="flex-1 flex flex-col bg-zinc-950 p-4 h-1/2 md:h-full">
            {/* Browser Wrapper */}
            <div className="flex-1 flex flex-col bg-white rounded-lg border border-zinc-800 shadow-2xl overflow-hidden min-h-0">
              
              {/* Browser Header Bar */}
              <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center gap-3 shrink-0">
                {/* Mac buttons */}
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                </div>
                
                {/* Address Bar */}
                <div className="flex-1 bg-zinc-950/80 border border-zinc-800/80 rounded px-3 py-1 flex items-center gap-2 font-mono text-[10px] text-zinc-400 select-all">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span className="text-zinc-600">https://</span>
                  <span className="text-zinc-200 font-semibold">{projectId}</span>
                  <span className="text-zinc-500">.pubsite.co</span>
                </div>

                <div className="flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Sandboxed iframe sandbox rendering */}
              <div className="flex-1 bg-zinc-100 relative min-h-0">
                <iframe
                  srcDoc={srcDoc}
                  title="Sandbox Live Browser"
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Conversations Side Panel */}
        <AISidePanel 
          isOpen={isAiOpen} 
          onClose={() => setIsAiOpen(false)} 
          code={code}
          onApplyChanges={handleApplyChanges}
        />

        {/* Toggle Button for AI Assistant (only visible when AI panel is closed) */}
        {!isAiOpen && (
          <button
            onClick={() => setIsAiOpen(true)}
            id="btn-toggle-ai"
            className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-zinc-950 p-3 rounded-full shadow-lg shadow-indigo-650/20 cursor-pointer border border-indigo-550 transition transform hover:scale-105"
            title="Open AI Assistant"
          >
            <Sparkles className="w-5 h-5 fill-current" />
          </button>
        )}
      </main>

      {/* 2.8s Real-Time Deployment Progress Timeline Modal */}
      <DeploymentModal 
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        code={code}
        projectId={projectId}
        onDeploySuccess={handleDeploySuccess}
      />
    </div>
  );
}
