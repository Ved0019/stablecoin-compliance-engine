'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  ShieldAlert,
  Terminal,
  XCircle,
  Zap,
  Server,
  Network
} from 'lucide-react';

// --- Glow Card Component (Cursor-Tracking Border) ---
const GlowCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl border border-white/5 bg-[#0D0E11] overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.12), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// --- SVG Area Spline Chart ---
const VelocityChart = () => {
  return (
    <div className="w-full h-full min-h-[160px] relative mt-4 flex flex-col justify-end">
      <svg viewBox="0 0 800 200" className="w-full h-full preserve-3d" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* Area path */}
        <path
          d="M 0 180 C 100 150, 200 190, 300 120 C 400 50, 500 140, 600 90 C 700 40, 750 80, 800 30 L 800 200 L 0 200 Z"
          fill="url(#gradient)"
        />
        {/* Line path */}
        <path
          d="M 0 180 C 100 150, 200 190, 300 120 C 400 50, 500 140, 600 90 C 700 40, 750 80, 800 30"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
        />
        
        {/* Data points */}
        <circle cx="300" cy="120" r="4" fill="#0D0E11" stroke="#3B82F6" strokeWidth="2" />
        <circle cx="600" cy="90" r="4" fill="#0D0E11" stroke="#3B82F6" strokeWidth="2" />
        <circle cx="800" cy="30" r="4" fill="#0D0E11" stroke="#3B82F6" strokeWidth="2" className="animate-pulse" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1 text-[10px] text-gray-500 font-mono tracking-wider">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span className="text-[#3B82F6]">Sun (Live)</span>
      </div>
    </div>
  );
};

// --- Terminal Feed ---
const terminalLines = [
  { msg: "[Gateway] Incoming payload: B2B_USDC_TRANSFER (id: 9a8b7)", time: "0.0ms", color: "text-gray-400" },
  { msg: "[C++ Sanctions Pre-Filter] Checked OFAC/PEP against 42K entities", time: "1.4µs", color: "text-[#10B981]" },
  { msg: "[C++ Sanctions Pre-Filter] Result: PASSED (No strict match)", time: "1.6µs", color: "text-[#10B981]" },
  { msg: "[LLM Router] Generating speculative routing plan...", time: "15.0ms", color: "text-[#8B5CF6]" },
  { msg: "[Groq LPU] Evaluated MiCA & GENIUS Act constraints", time: "220ms", color: "text-[#8B5CF6]" },
  { msg: "[Groq LPU] Output: Confidence 0.98. Route -> Solana USDC", time: "240ms", color: "text-[#3B82F6]" },
  { msg: "[Execution] Signed via MPC. Broadcasted to mempool.", time: "450ms", color: "text-gray-400" }
];

const TerminalFeed = () => {
  const [lines, setLines] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) => (prev < terminalLines.length ? prev + 1 : 0));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-xs space-y-1.5 h-full flex flex-col justify-end pt-4">
      {terminalLines.slice(0, lines).map((line, i) => (
        <div key={i} className="flex justify-between items-start animate-fade-in">
          <span className={`${line.color} break-all pr-4`}>{line.msg}</span>
          <span className="text-gray-500 shrink-0">{line.time}</span>
        </div>
      ))}
      <div className="animate-pulse flex space-x-2 items-center text-gray-500 mt-2">
        <div className="w-2 h-4 bg-gray-500"></div>
        <span>Awaiting next event...</span>
      </div>
    </div>
  );
};

// --- Radial Progress ---
const RadialProgress = ({ value, color }: { value: number, color: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          className="text-white/5"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
        <circle
          className="transition-all duration-1000 ease-out"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-mono text-white tracking-tighter">{value}%</span>
      </div>
    </div>
  );
};


// --- Main Dashboard Page ---
export default function LedgerGuardDashboard() {
  const [loading, setLoading] = useState(true);
  const [hitlStatus, setHitlStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    // Simulate 1s Progressive Loading Skeleton
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleManualApprove = () => {
    setHitlStatus('approved');
    setTxHash('0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''));
  };

  const handleManualReject = () => {
    setHitlStatus('rejected');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070708] p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-7xl grid grid-cols-12 gap-6 animate-pulse">
          <div className="col-span-12 lg:col-span-8 h-[340px] bg-[#0D0E11] rounded-xl border border-white/5"></div>
          <div className="col-span-12 lg:col-span-4 h-[160px] bg-[#0D0E11] rounded-xl border border-white/5"></div>
          <div className="col-span-12 lg:col-span-4 h-[160px] bg-[#0D0E11] rounded-xl border border-white/5"></div>
          <div className="col-span-12 h-[300px] bg-[#0D0E11] rounded-xl border border-white/5 mt-[-156px] lg:mt-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070708] text-gray-300 p-6 lg:p-8 font-sans selection:bg-[#3B82F6]/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">LedgerGuard<span className="text-gray-500 font-normal"> / Compliance Engine</span></h1>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
              <span>System Operational</span>
            </div>
          </div>
        </header>

        {/* 12-Column Bento Grid */}
        <div className="grid grid-cols-12 gap-6 auto-rows-[minmax(160px,auto)]">
          
          {/* Widget A: Hero Ticker & Velocity Chart (col-8, row-2) */}
          <GlowCard className="col-span-12 lg:col-span-8 row-span-2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-400">USDC Compliance Velocity (7D)</h2>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-4xl font-mono text-white tracking-tighter">$142.8M</span>
                    <span className="text-sm font-mono text-[#10B981] flex items-center"><ArrowRight className="w-3 h-3 -rotate-45 mr-1" /> +12.4%</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <Activity className="w-5 h-5 text-[#3B82F6]" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 max-w-sm">
                Real-time settlement throughput processed and cleared across regulatory boundaries.
              </p>
            </div>
            <div className="h-[200px] w-full">
              <VelocityChart />
            </div>
          </GlowCard>

          {/* Widget B: Live Pipeline Terminal (col-4, row-1) */}
          <GlowCard className="col-span-12 lg:col-span-4 row-span-1 p-5 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium text-gray-400 flex items-center">
                <Terminal className="w-4 h-4 mr-2 text-[#8B5CF6]" />
                Live Telemetry
              </h2>
              <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/5">WS: CONNECTED</span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <TerminalFeed />
              <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#0D0E11] to-transparent z-10 pointer-events-none"></div>
            </div>
          </GlowCard>

          {/* Widget C: AI Confidence Score & Nodes (col-4, row-1) */}
          <GlowCard className="col-span-12 lg:col-span-4 row-span-1 p-5 flex items-center justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">Global AI Confidence</h2>
                <p className="text-xs text-gray-500">Trailing 24h rolling average</p>
              </div>
              <div className="flex space-x-4">
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-400 font-mono"><Server className="w-3 h-3 mr-1" /> VASP Nodes</div>
                  <div className="text-lg font-mono text-white">12/12</div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-400 font-mono"><Network className="w-3 h-3 mr-1" /> Latency</div>
                  <div className="text-lg font-mono text-[#3B82F6]">42ms</div>
                </div>
              </div>
            </div>
            <div className="shrink-0 pl-4">
              <RadialProgress value={98} color="#3B82F6" />
            </div>
          </GlowCard>

          {/* Widget D: Interactive HITL Escalation Queue (col-12, row-auto) */}
          <GlowCard className={`col-span-12 row-span-3 p-0 transition-colors duration-500 ${
            hitlStatus === 'approved' ? 'bg-[#10B981]/5 border-[#10B981]/20' : 
            hitlStatus === 'rejected' ? 'bg-[#F87171]/5 border-[#F87171]/20' : ''
          }`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg border ${
                  hitlStatus === 'pending' ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-[#8B5CF6]' :
                  hitlStatus === 'approved' ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]' :
                  'bg-[#F87171]/10 border-[#F87171]/20 text-[#F87171]'
                }`}>
                  {hitlStatus === 'pending' ? <ShieldAlert className="w-5 h-5" /> : 
                   hitlStatus === 'approved' ? <CheckCircle className="w-5 h-5" /> : 
                   <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base font-medium text-white">Human-In-The-Loop (HITL) Queue</h2>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">Escalation ID: #TX-992B-4F1A</p>
                </div>
              </div>
              
              {hitlStatus === 'pending' && (
                <div className="flex space-x-3">
                  <button onClick={handleManualReject} className="px-4 py-2 text-xs font-mono font-medium text-[#F87171] bg-[#F87171]/10 border border-[#F87171]/20 rounded-lg hover:bg-[#F87171]/20 transition-colors">
                    Execute Reject
                  </button>
                  <button onClick={handleManualApprove} className="px-4 py-2 text-xs font-mono font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.4)] rounded-lg transition-all">
                    Approve Manual Clear
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Transaction Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Held Transaction Context</h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">Sender</span>
                      <span className="text-white">NeoTech Ventures (AE)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">Beneficiary</span>
                      <span className="text-white">Global Import DAO (CY)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">Amount</span>
                      <span className="text-[#3B82F6]">$125,000.00 USDC</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-500">AI Confidence</span>
                      <span className="text-[#F87171]">64.2% (Below Threshold)</span>
                    </div>
                  </div>
                </div>

                {hitlStatus === 'approved' && (
                  <div className="animate-fade-in bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg p-4 font-mono text-xs">
                    <div className="text-[#10B981] mb-1">✓ SEC/FEMA Manual Release Executed</div>
                    <div className="text-gray-400">TxHash: <span className="text-white break-all">{txHash}</span></div>
                  </div>
                )}
                {hitlStatus === 'rejected' && (
                  <div className="animate-fade-in bg-[#F87171]/10 border border-[#F87171]/20 rounded-lg p-4 font-mono text-xs">
                    <div className="text-[#F87171] mb-1">✗ Compliance Hold Executed</div>
                    <div className="text-gray-400">Funds returned to sender wallet. Prompt change control entry logged.</div>
                  </div>
                )}
              </div>

              {/* AI Speculative Decoding */}
              <div className="flex flex-col h-full">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                  Speculative Decoding Reason <Zap className="w-3 h-3 ml-2 text-[#8B5CF6]" />
                </h3>
                <div className="bg-black/40 rounded-lg border border-white/5 p-4 font-mono text-[11px] leading-relaxed text-gray-400 flex-1 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#8B5CF6]/50"></div>
                  <p className="mb-2">
                    <span className="text-white">{'>>'} RULE_EVAL (MiCA/Title_III):</span> The recipient entity "Global Import DAO" is registered in Cyprus, but the corporate footprint aligns with a heavily sanctioned shell cluster identified in recent FinCEN advisories.
                  </p>
                  <p className="mb-2">
                    <span className="text-white">{'>>'} FUZZY_MATCH_WARNING:</span> 82% Levenshtein similarity to blocked entity "Global Imports Syndicate".
                  </p>
                  <p className="text-[#8B5CF6]">
                    {'>>'} ACTION_REQUIRED: Manual officer override needed to verify ultimate beneficial ownership (UBO) documents before USDC unlock.
                  </p>
                  <div className="absolute bottom-2 right-4 text-[9px] text-gray-600">Llama-3.3-70B Evaluator</div>
                </div>
              </div>
            </div>
          </GlowCard>

        </div>
      </div>
    </div>
  );
}

// Add keyframes to global CSS if needed (assuming standard tailwind config includes basic fades)
// Or we can rely on standard tailwind utility classes for opacity and transitions.