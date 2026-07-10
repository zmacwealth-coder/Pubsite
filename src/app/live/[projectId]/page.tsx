"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, Lock, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LivePage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && projectId) {
      const storedCode = window.sessionStorage.getItem(`pubsite_compiled_${projectId}`);
      if (storedCode) {
        setCode(storedCode);
      } else {
        // Fallback placeholder if accessed directly or refreshed without cache
        setCode(`<!DOCTYPE html>
<html>
<head>
  <title>Pubsite Sandbox Cache Expired</title>
  <style>
    body { background: #09090b; color: #71717a; font-family: monospace; text-align: center; padding-top: 5rem; }
    h1 { color: #fafafa; }
    a { color: #6366f1; text-decoration: none; }
  </style>
</head>
<body>
  <h1>Sandbox Cache Expired</h1>
  <p>To view this page, please compile it again from the Workspace Editor.</p>
  <p><a href="/editor">&larr; Return to Workspace</a></p>
</body>
</html>`);
      }
      setLoading(false);
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-400 font-mono text-xs">
        Connecting to edge server node...
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-zinc-950 overflow-hidden select-none">
      {/* Tiny developer utilities top bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between font-mono text-[10px] text-zinc-400 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/editor" className="flex items-center gap-1.5 hover:text-zinc-200 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Editor
          </Link>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure Edge Sandbox</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-emerald-500 font-bold bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded text-[9px]">
            STATUS: ACTIVE
          </span>
          <span className="text-zinc-500">
            Node: US-WEST-2
          </span>
        </div>
      </div>

      {/* Frame container */}
      <div className="flex-1 bg-white">
        <iframe
          srcDoc={code}
          title={`Compiled Sandbox Live ${projectId}`}
          className="w-full h-full border-none"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
