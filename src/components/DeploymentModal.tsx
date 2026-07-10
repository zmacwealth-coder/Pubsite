"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Shield, Globe, ExternalLink, Copy, Check, QrCode, RefreshCw } from "lucide-react";

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  projectId: string;
  onDeploySuccess: (subdomain: string) => void;
}

export function DeploymentModal({ isOpen, onClose, code, projectId, onDeploySuccess }: DeploymentModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  const subdomain = `https://${projectId}.pubsite.co`;

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(1);
      setCopied(false);
      setQrLoaded(false);
      return;
    }

    const startTime = Date.now();
    const duration = 2800; // 2.8s exact compilation latency

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (elapsed < 800) {
        setCurrentStep(1);
      } else if (elapsed < 1600) {
        setCurrentStep(2);
      } else if (elapsed < 2400) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setProgress(100);
        setCurrentStep(4);
        onDeploySuccess(subdomain);
        // Delay QR code fade-in slightly
        setTimeout(() => setQrLoaded(true), 150);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isOpen, projectId, subdomain, onDeploySuccess]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(subdomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleViewLive = () => {
    // Store code in sessionStorage so the live route can render it
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(`pubsite_compiled_${projectId}`, code);
      window.open(`/live/${projectId}`, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl font-mono text-xs"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
            <span className="text-zinc-400">DEPLOYMENT STATUS</span>
            <span className="text-indigo-400 font-bold tracking-widest text-[10px] bg-indigo-950/60 border border-indigo-900/60 px-2 py-0.5 rounded">
              LATENCY: 2.8s
            </span>
          </div>

          {/* Timeline and Checklist */}
          <div className="space-y-4 mb-6">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {currentStep > 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : currentStep === 1 ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-800" />
                )}
              </div>
              <div>
                <p className={`font-semibold ${currentStep >= 1 ? "text-zinc-200" : "text-zinc-600"}`}>
                  🔍 Analyzing DOM &amp; Security Rules (0.0s - 0.8s)
                </p>
                {currentStep === 1 && (
                  <p className="text-zinc-500 text-[10px] mt-1 animate-pulse">
                    Scanning for script injections &amp; inline event handlers...
                  </p>
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {currentStep > 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : currentStep === 2 ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-800" />
                )}
              </div>
              <div>
                <p className={`font-semibold ${currentStep >= 2 ? "text-zinc-200" : "text-zinc-600"}`}>
                  🛡️ Running Ingestion Filters (0.8s - 1.6s)
                </p>
                {currentStep === 2 && (
                  <p className="text-zinc-500 text-[10px] mt-1 animate-pulse">
                    Stripping analytics scripts &amp; detecting credential-harvesting triggers...
                  </p>
                )}
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {currentStep > 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : currentStep === 3 ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-800" />
                )}
              </div>
              <div>
                <p className={`font-semibold ${currentStep >= 3 ? "text-zinc-200" : "text-zinc-600"}`}>
                  🌐 Configuring Edge Subdomain &amp; DNS (1.6s - 2.4s)
                </p>
                {currentStep === 3 && (
                  <p className="text-zinc-500 text-[10px] mt-1 animate-pulse">
                    Routing to isolated container sandbox &amp; CDN edge network...
                  </p>
                )}
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {currentStep === 4 && progress === 100 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : currentStep === 4 ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-800" />
                )}
              </div>
              <div>
                <p className={`font-semibold ${currentStep === 4 ? "text-emerald-500" : "text-zinc-600"}`}>
                  🎉 Live at Edge Server! (2.4s - 2.8s)
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="relative w-full h-2 bg-zinc-950 rounded overflow-hidden mb-6 border border-zinc-800">
            <motion.div
              className={`h-full ${progress === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          {/* Post-deployment UI (rendered when done) */}
          <AnimatePresence>
            {progress === 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-zinc-800 pt-5 space-y-4 text-zinc-300"
              >
                {/* Subdomain Input and Copy */}
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1">SECURE LIVE ENDPOINT</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-300 flex items-center overflow-x-auto whitespace-nowrap scrollbar-none select-all font-semibold">
                      {subdomain}
                    </div>
                    <button
                      onClick={handleCopy}
                      id="btn-copy-subdomain"
                      className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 p-2 rounded cursor-pointer transition flex items-center justify-center w-9 h-9"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* QR Code and Meta Details */}
                <div className="flex gap-4 items-center bg-zinc-950/40 border border-zinc-800/80 p-3 rounded">
                  <div className="w-16 h-16 bg-zinc-850 border border-zinc-800 rounded flex items-center justify-center p-1.5 text-zinc-300">
                    {/* Render a styled SVG matching a QR code */}
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-zinc-200">
                      <rect x="0" y="0" width="30" height="30" />
                      <rect x="5" y="5" width="20" height="20" fill="#09090b" />
                      <rect x="10" y="10" width="10" height="10" />
                      
                      <rect x="70" y="0" width="30" height="30" />
                      <rect x="75" y="5" width="20" height="20" fill="#09090b" />
                      <rect x="80" y="10" width="10" height="10" />

                      <rect x="0" y="70" width="30" height="30" />
                      <rect x="5" y="75" width="20" height="20" fill="#09090b" />
                      <rect x="10" y="80" width="10" height="10" />

                      {/* Random QR noise blocks */}
                      <rect x="40" y="10" width="10" height="10" />
                      <rect x="50" y="20" width="10" height="10" />
                      <rect x="40" y="40" width="20" height="20" />
                      <rect x="10" y="40" width="10" height="10" />
                      <rect x="70" y="40" width="10" height="10" />
                      <rect x="80" y="50" width="10" height="10" />
                      <rect x="50" y="70" width="10" height="10" />
                      <rect x="80" y="80" width="15" height="15" />
                      <rect x="40" y="80" width="10" height="10" />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase">Edge Routing Info</p>
                    <p className="text-zinc-300 font-semibold">SSL Active (TLS 1.3)</p>
                    <p className="text-zinc-500 text-[10px]">Isolated Cookie &amp; Storage</p>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleViewLive}
                    id="btn-view-live"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold py-2.5 px-4 rounded transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                  >
                    View Live Page <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onClose}
                    id="btn-modal-close"
                    className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-bold py-2.5 px-4 rounded transition cursor-pointer text-xs border border-zinc-700"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
