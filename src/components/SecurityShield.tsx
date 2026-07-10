"use client";

import React, { useMemo } from "react";
import { Shield, ShieldAlert, ShieldCheck, EyeOff, Lock, Bug, HelpCircle } from "lucide-react";

export interface SecurityReport {
  trackersStripped: number;
  formSafety: "Clean" | "Warning: Passwords Blocked" | "Warning: Unsafe Form Action";
  xssSanitationCount: number;
  issues: string[];
}

export function performSecurityScan(html: string): SecurityReport {
  const issues: string[] = [];
  let trackersStripped = 0;
  let xssCount = 0;
  let formSafety: "Clean" | "Warning: Passwords Blocked" | "Warning: Unsafe Form Action" = "Clean";

  if (!html) {
    return { trackersStripped: 0, formSafety: "Clean", xssSanitationCount: 0, issues: [] };
  }

  // 1. Tracker checks
  const trackerPatterns = [
    /google-analytics\.com/gi,
    /googletagmanager\.com/gi,
    /mixpanel\.com/gi,
    /hotjar\.com/gi,
    /amplitude\.com/gi,
    /connect\.facebook\.net/gi
  ];
  trackerPatterns.forEach((pattern) => {
    const matches = html.match(pattern);
    if (matches) {
      trackersStripped += matches.length;
    }
  });
  if (trackersStripped > 0) {
    issues.push(`Strip ${trackersStripped} telemetry tracking script${trackersStripped > 1 ? "s" : ""} on upload.`);
  }

  // 2. Form safety
  if (html.includes('type="password"') || html.includes("type='password'") || /type\s*=\s*["']?password["']?/i.test(html)) {
    formSafety = "Warning: Passwords Blocked";
    issues.push("Phishing Filter: Password input detected. Credentials cannot be collected on pubsite.co.");
  } else if (/<form[^>]*action=["']\s*http/i.test(html)) {
    formSafety = "Warning: Unsafe Form Action";
    issues.push("DNS Security: External form actions are routed through local sandbox proxies.");
  }

  // 3. XSS sanitation
  const inlineEventHandlers = /on(load|error|click|focus|blur|change|submit|keydown|keypress|keyup|mouseover|mouseout|mouseenter|mouseleave)\s*=/gi;
  const javascriptUris = /javascript:/gi;
  const scriptTags = /<script\b[^>]*>/gi;

  const matchesInline = html.match(inlineEventHandlers);
  const matchesJs = html.match(javascriptUris);
  const matchesScript = html.match(scriptTags);

  xssCount += matchesInline ? matchesInline.length : 0;
  xssCount += matchesJs ? matchesJs.length : 0;
  xssCount += matchesScript ? matchesScript.length : 0;

  if (xssCount > 0) {
    issues.push(`XSS Protection: Neutralize ${xssCount} inline script${xssCount > 1 ? "s/handlers" : " or handler"} on compilation.`);
  }

  return {
    trackersStripped,
    formSafety,
    xssSanitationCount: xssCount,
    issues
  };
}

interface SecurityShieldProps {
  code: string;
}

export function SecurityShield({ code }: SecurityShieldProps) {
  const report = useMemo(() => performSecurityScan(code), [code]);
  const hasWarnings = report.trackersStripped > 0 || report.xssSanitationCount > 0 || report.formSafety !== "Clean";

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-lg p-4 font-mono text-xs w-full shadow-lg">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          {hasWarnings ? (
            <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          )}
          <span className="font-semibold text-zinc-200 text-sm">Security Analysis Shield</span>
        </div>
        <div className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase tracking-widest border border-zinc-700/50">
          Sandbox v1.2.0
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Metric 1 */}
        <div className="bg-zinc-950/50 border border-zinc-800/80 rounded p-3 flex flex-col gap-1 relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Trackers Stripped</span>
          </div>
          <span className={`text-lg font-bold ${report.trackersStripped > 0 ? "text-amber-500" : "text-zinc-200"}`}>
            {report.trackersStripped}
          </span>
          {report.trackersStripped > 0 && (
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-amber-500" />
          )}
        </div>

        {/* Metric 2 */}
        <div className="bg-zinc-950/50 border border-zinc-800/80 rounded p-3 flex flex-col gap-1 relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Form Safety</span>
          </div>
          <span
            className={`text-lg font-bold ${
              report.formSafety === "Clean"
                ? "text-emerald-500"
                : report.formSafety === "Warning: Passwords Blocked"
                ? "text-rose-500"
                : "text-amber-500"
            }`}
          >
            {report.formSafety === "Clean" ? "Safe" : "Flagged"}
          </span>
          <div
            className={`absolute right-0 bottom-0 top-0 w-1 ${
              report.formSafety === "Clean"
                ? "bg-emerald-500"
                : report.formSafety === "Warning: Passwords Blocked"
                ? "bg-rose-500"
                : "bg-amber-500"
            }`}
          />
        </div>

        {/* Metric 3 */}
        <div className="bg-zinc-950/50 border border-zinc-800/80 rounded p-3 flex flex-col gap-1 relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Bug className="w-3.5 h-3.5" />
            <span>XSS Sanitation</span>
          </div>
          <span className={`text-lg font-bold ${report.xssSanitationCount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
            {report.xssSanitationCount > 0 ? `${report.xssSanitationCount} Flagged` : "0 Detected"}
          </span>
          {report.xssSanitationCount > 0 && (
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-rose-500" />
          )}
        </div>
      </div>

      <div className="bg-zinc-950/80 rounded p-3 border border-zinc-800/60 max-h-36 overflow-y-auto">
        <div className="text-[10px] text-zinc-500 font-semibold mb-2 uppercase tracking-wide">
          Sandboxing Log Output
        </div>
        {report.issues.length === 0 ? (
          <div className="text-zinc-500 italic flex items-center gap-1.5 py-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
            No threats detected. HTML sandbox status: Clean. Ready for instant deploy.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {report.issues.map((issue, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 py-0.5 leading-relaxed ${
                  issue.includes("Phishing") || issue.includes("XSS") ? "text-rose-400" : "text-amber-400"
                }`}
              >
                <span className="select-none font-bold text-zinc-600">&gt;</span>
                <span>{issue}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
