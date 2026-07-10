"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, Send, Check, AlertCircle, ArrowLeftRight, CornerDownLeft } from "lucide-react";

interface DiffBlock {
  original: string;
  replacement: string;
  lines: { type: "add" | "remove" | "normal"; text: string }[];
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
  diff?: DiffBlock;
}

interface AISidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  onApplyChanges: (newCode: string) => void;
}

export function AISidePanel({ isOpen, onClose, code, onApplyChanges }: AISidePanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "msg-init",
          sender: "assistant",
          text: "Welcome to Pubsite! I am your security and optimization sidekick. I analyze your HTML for best practices, accessibility, and security compliance. Pick one of the presets below to try a sandboxed code optimization:",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const triggerOptimization = (type: "viewport" | "handler" | "style") => {
    setIsTyping(true);

    let userMsgText = "";
    let assistantMsgText = "";
    let diff: DiffBlock | undefined;

    if (type === "viewport") {
      userMsgText = "Optimize the viewport meta tags for mobile compatibility.";
      assistantMsgText = "I found that your head section lacks a responsive viewport definition. This will cause layout scaling issues on mobile devices. I've compiled a clean meta tags layout for you:";
      
      // Look for charset tag to insert viewport after
      const originalPattern = "<meta charset=\"UTF-8\">";
      const replacementPattern = '<meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">';
      
      diff = {
        original: originalPattern,
        replacement: replacementPattern,
        lines: [
          { type: "normal", text: '  <meta charset="UTF-8">' },
          { type: "add", text: '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' }
        ]
      };
    } else if (type === "handler") {
      userMsgText = "Sanitize inline event handlers (XSS sanitation).";
      assistantMsgText = "I detected inline 'onclick' HTML handlers which violate high-security CSP (Content Security Policy) standards and increase XSS risk. Let's move the logic into a sandboxed EventListener instead:";

      const originalPattern = `<button onclick="alert('Demo launched!')">Pre-Order Now</button>`;
      const replacementPattern = `<button id="cta-btn" class="modern-btn">Pre-Order Now</button>\n  <script>\n    document.getElementById('cta-btn').addEventListener('click', () => {\n      console.log('Action securely recorded in sandboxed environment');\n      alert('Demo launched via secure event listener!');\n    });\n  </script>`;

      diff = {
        original: originalPattern,
        replacement: replacementPattern,
        lines: [
          { type: "remove", text: `  <button onclick="alert('Demo launched!')">Pre-Order Now</button>` },
          { type: "add", text: `  <button id="cta-btn" class="modern-btn">Pre-Order Now</button>` },
          { type: "add", text: "  <script>" },
          { type: "add", text: "    document.getElementById('cta-btn').addEventListener('click', () => {" },
          { type: "add", text: "      console.log('Action securely recorded in sandboxed environment');" },
          { type: "add", text: "      alert('Demo launched via secure event listener!');" },
          { type: "add", text: "    });" },
          { type: "add", text: "  </script>" }
        ]
      };
    } else {
      userMsgText = "Apply modern developer dark aesthetics.";
      assistantMsgText = "Let's overhaul the default browser light styles to a curated, high-contrast developer theme matching the Pubsite aesthetic:";

      const originalPattern = `<style>\n    body {\n      background: #0f172a;\n      color: #f8fafc;`;
      const replacementPattern = `<style>\n    body {\n      background: #09090b;\n      color: #fafafa;\n      border: 1px solid #27272a;\n      box-shadow: 0 0 20px rgba(16, 185, 129, 0.05);`;

      diff = {
        original: originalPattern,
        replacement: replacementPattern,
        lines: [
          { type: "normal", text: "    body {" },
          { type: "remove", text: "      background: #0f172a;" },
          { type: "remove", text: "      color: #f8fafc;" },
          { type: "add", text: "      background: #09090b;" },
          { type: "add", text: "      color: #fafafa;" },
          { type: "add", text: "      border: 1px solid #27272a;" },
          { type: "add", text: "      box-shadow: 0 0 20px rgba(16, 185, 129, 0.05);" }
        ]
      };
    }

    const newUserMsg: Message = {
      id: `msg-${Date.now()}-u`,
      sender: "user",
      text: userMsgText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newUserMsg]);

    setTimeout(() => {
      setIsTyping(false);
      const newAiMsg: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: "assistant",
        text: assistantMsgText,
        timestamp: new Date(),
        diff
      };
      setMessages((prev) => [...prev, newAiMsg]);
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");

    const newUserMsg: Message = {
      id: `msg-${Date.now()}-u`,
      sender: "user",
      text: userText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      // Fallback assistant response
      let replyText = `I analyzed your query: "${userText}". Since I am running inside a sandboxed portfolio, you can choose one of the structured compiler modifications below to optimize your workspace.`;
      
      const newAiMsg: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: "assistant",
        text: replyText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, newAiMsg]);
    }, 1000);
  };

  const applyDiff = (diff: DiffBlock) => {
    if (code.includes(diff.original)) {
      const updatedCode = code.replace(diff.original, diff.replacement);
      onApplyChanges(updatedCode);
    } else {
      // Fallback: If target doesn't match perfectly, append/replace where possible
      alert("Note: Code structure changed. Appending/updating template...");
      if (diff.original.includes("<meta charset")) {
        const headIdx = code.indexOf("<head>");
        if (headIdx !== -1) {
          const insertIdx = headIdx + 6;
          const updatedCode = code.slice(0, insertIdx) + "\n  " + diff.replacement + code.slice(insertIdx);
          onApplyChanges(updatedCode);
          return;
        }
      }
      onApplyChanges(code + "\n" + diff.replacement);
    }
  };

  return (
    <div
      className={`fixed top-[57px] right-0 bottom-0 z-40 w-80 md:w-96 bg-zinc-950 border-l border-zinc-800 flex flex-col transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-indigo-950/80 border border-indigo-900 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs font-semibold text-zinc-100">AI Sandbox Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300 font-mono text-xs cursor-pointer"
        >
          [hide]
        </button>
      </div>

      {/* Conversations Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                  : "bg-indigo-950/20 text-zinc-200 border border-indigo-900/50"
              }`}
            >
              <div className="flex items-center gap-1 mb-1 text-[9px] text-zinc-500 font-mono">
                {msg.sender === "assistant" ? (
                  <>
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>PUBSITE AI</span>
                  </>
                ) : (
                  <span>DEVELOPER</span>
                )}
                <span>•</span>
                <span>{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p className="font-sans">{msg.text}</p>

              {/* Code Diff Display */}
              {msg.diff && (
                <div className="mt-3 border border-zinc-800 rounded bg-zinc-950 overflow-hidden font-mono text-[10px]">
                  <div className="bg-zinc-900 px-2 py-1.5 text-[9px] text-zinc-500 flex justify-between items-center border-b border-zinc-800">
                    <span>SUGGESTED COMPILER DIFF</span>
                    <span className="text-indigo-400">Ready</span>
                  </div>
                  <div className="p-2 space-y-0.5 overflow-x-auto whitespace-pre leading-5">
                    {msg.diff.lines.map((line, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2 ${
                          line.type === "add"
                            ? "bg-emerald-950/20 text-emerald-400 border-l border-emerald-500/80 -mx-2 px-2"
                            : line.type === "remove"
                            ? "bg-rose-950/20 text-rose-400 border-l border-rose-500/80 -mx-2 px-2 line-through"
                            : "text-zinc-500"
                        }`}
                      >
                        <span className="w-3 select-none text-zinc-600">
                          {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                        </span>
                        <span>{line.text}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => msg.diff && applyDiff(msg.diff)}
                    className="w-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border-t border-zinc-800 hover:text-indigo-300 transition py-1.5 font-bold cursor-pointer text-center"
                  >
                    Apply Optimization
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-indigo-950/20 border border-indigo-900/50 rounded-lg p-3 text-xs text-zinc-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Analyzing DOM elements...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Preset Action Suggestions */}
      <div className="border-t border-zinc-800 p-2.5 space-y-1 bg-zinc-900/20">
        <p className="text-[9px] text-zinc-500 font-mono mb-1.5 px-1 uppercase tracking-wider">
          Suggested Optimizations
        </p>
        <button
          onClick={() => triggerOptimization("viewport")}
          className="w-full text-left bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-2 py-1.5 rounded transition text-[10px] font-mono cursor-pointer flex justify-between items-center"
        >
          <span>1. Viewport scaling meta</span>
          <span className="text-zinc-500 text-[8px]">[Run]</span>
        </button>
        <button
          onClick={() => triggerOptimization("handler")}
          className="w-full text-left bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-2 py-1.5 rounded transition text-[10px] font-mono cursor-pointer flex justify-between items-center"
        >
          <span>2. Sanitize XSS inline script</span>
          <span className="text-zinc-500 text-[8px]">[Run]</span>
        </button>
        <button
          onClick={() => triggerOptimization("style")}
          className="w-full text-left bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-2 py-1.5 rounded transition text-[10px] font-mono cursor-pointer flex justify-between items-center"
        >
          <span>3. Apply obsidian CSS dark theme</span>
          <span className="text-zinc-500 text-[8px]">[Run]</span>
        </button>
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="border-t border-zinc-800 p-3 bg-zinc-900/40 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask AI assistant..."
          className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded px-2.5 py-1.5 text-zinc-300 font-sans text-xs focus:outline-none"
        />
        <button
          type="submit"
          className="bg-indigo-650 hover:bg-indigo-600 text-zinc-200 hover:text-white p-1.5 rounded transition flex items-center justify-center cursor-pointer border border-indigo-750"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

// Simple loader helper
function Loader2({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`animate-spin ${className}`}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
