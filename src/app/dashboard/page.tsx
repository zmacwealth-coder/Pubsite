"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Clock, 
  Lock, 
  Eye, 
  ArrowUpRight, 
  ExternalLink,
  ChevronRight,
  Database,
  BarChart3,
  Calendar,
  Layers,
  FileCode,
  History,
  CloudLightning,
  Sparkles
} from "lucide-react";

interface Deployment {
  projectId: string;
  subdomain: string;
  timestamp: string;
  views: number;
  sizeBytes: number;
  status: "Clean" | "Flagged";
}

const MOCK_INITIAL_DEPLOYMENTS: Deployment[] = [
  {
    projectId: "vertex-815",
    subdomain: "https://vertex-815.pubsite.co",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hrs ago
    views: 142,
    sizeBytes: 1240,
    status: "Clean"
  },
  {
    projectId: "delta-309",
    subdomain: "https://delta-309.pubsite.co",
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(), // 1.2 days ago
    views: 89,
    sizeBytes: 2480,
    status: "Clean"
  },
  {
    projectId: "prism-492",
    subdomain: "https://prism-492.pubsite.co",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
    views: 412,
    sizeBytes: 890,
    status: "Clean"
  }
];

export default function DashboardPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pubsite_deployments");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Combine storage with defaults, filtering duplicates
        const combined = [...parsed];
        MOCK_INITIAL_DEPLOYMENTS.forEach(mock => {
          if (!combined.some(item => item.projectId === mock.projectId)) {
            combined.push(mock);
          }
        });
        setDeployments(combined);
      } else {
        localStorage.setItem("pubsite_deployments", JSON.stringify(MOCK_INITIAL_DEPLOYMENTS));
        setDeployments(MOCK_INITIAL_DEPLOYMENTS);
      }
    }
  }, []);

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 font-sans text-zinc-150">
      
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
              className="px-3 py-1 text-xs font-semibold rounded text-zinc-400 hover:text-zinc-200 font-mono flex items-center gap-1.5 transition"
            >
              <FileCode className="w-3.5 h-3.5" /> Workspace
            </Link>
            <Link 
              href="/dashboard" 
              className="px-3 py-1 text-xs font-semibold rounded bg-zinc-800 text-white font-mono flex items-center gap-1.5 transition"
            >
              <History className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </nav>

          <Link
            href="/editor"
            className="bg-indigo-650 hover:bg-indigo-600 text-white font-semibold px-4 py-1.5 rounded text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            Launch Editor
          </Link>
        </div>
      </header>

      {/* Main Dashboard Panel */}
      <main className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 className="text-xl font-bold font-mono text-zinc-150 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" /> Platform Metrics &amp; Analytics
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">Real-time status updates and edge isolation routing statistics.</p>
          </div>
          <div className="text-[10px] font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-500" /> All Systems Operational
          </div>
        </div>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Latency Metric */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">COMPILATION SPEED</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Average edge compilation latency</p>
              </div>
              <div className="p-2 rounded bg-indigo-950/80 border border-indigo-900 text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold font-mono text-white tracking-tight">2.8s</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-500 mt-1">
                <span>99.98% of compiles &lt; 3.0s</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600" />
          </div>

          {/* Cookie Isolation */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">SANDBOX ISOLATION</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Cookie &amp; Local Storage Isolation</p>
              </div>
              <div className="p-2 rounded bg-emerald-950/80 border border-emerald-900 text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold font-mono text-white tracking-tight">100%</p>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1">
                <span>Strict cross-origin block headers active</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
          </div>

          {/* Deployment Security Rate */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">THREAT PREVENTION</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Deployment Security Rate</p>
              </div>
              <div className="p-2 rounded bg-emerald-950/80 border border-emerald-900 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold font-mono text-emerald-500 tracking-tight">Clean / Safe</p>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1">
                <span>0 malicious bypasses in 30 days</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
          </div>

        </section>

        {/* Past Deployments Section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="font-mono text-sm text-zinc-200 font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-400" /> Edge Subdomain Registry
            </h2>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
              Total Builds: {deployments.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-950/40 text-zinc-500 border-b border-zinc-800 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-5 font-semibold">Edge Sandbox Address</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Deployment ID</th>
                  <th className="py-3 px-4 font-semibold">Security Status</th>
                  <th className="py-3 px-4 font-semibold">File Size</th>
                  <th className="py-3 px-4 font-semibold hidden sm:table-cell">Views</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {deployments.map((dep, idx) => (
                  <tr key={dep.projectId} className="hover:bg-zinc-850/40 transition">
                    
                    {/* Sandbox address */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        {/* Styled mini layout preview icon */}
                        <div className="w-9 h-7 bg-zinc-950 border border-zinc-800 rounded flex flex-col justify-between p-1 opacity-70">
                          <div className="w-full h-1 bg-zinc-800 rounded-full" />
                          <div className="flex justify-between items-center">
                            <div className="w-4 h-1 bg-zinc-800 rounded-full" />
                            <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-200">{dep.subdomain}</span>
                          <span className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-600" /> {formatDate(dep.timestamp)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Deployment ID */}
                    <td className="py-4 px-4 text-zinc-400 hidden md:table-cell">
                      {dep.projectId}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Clean
                      </span>
                    </td>

                    {/* File Size */}
                    <td className="py-4 px-4 text-zinc-400">
                      {formatSize(dep.sizeBytes)}
                    </td>

                    {/* Views */}
                    <td className="py-4 px-4 text-zinc-400 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-zinc-500" /> {dep.views}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/live/${dep.projectId}`}
                          target="_blank"
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded transition flex items-center gap-1 text-[10px]"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 mt-12 bg-zinc-900/10 shrink-0 font-mono text-[10px] text-zinc-600">
        <div className="max-w-6xl w-full mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 pubsite.co. Safe, instant sandboxed static page hosting.</p>
          <div className="flex gap-4">
            <span className="text-zinc-500">SSL: Active</span>
            <span className="text-zinc-500">Proxy: Cloudflare CDN</span>
            <span className="text-zinc-500">Ingestion: Safe v1.2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
