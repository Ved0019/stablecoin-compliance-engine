'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  ShieldAlert,
  Terminal,
  TrendingUp,
  Zap,
  Bot,
  Layout,
  List,
  Search,
  Settings,
  Download,
  Upload,
  Server,
  Network,
  Moon,
  Sun
} from 'lucide-react';
import Globe3D from '@/components/ui/3d-globe';

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
        <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="4 4" />

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
        <circle cx="800" cy="30" r="4" fill="#0D0E11" stroke="#3B82F6" strokeWidth="2" className="fade-in" />
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
  { msg: "[Gateway] Incoming payload: B2B_USDC_TRANSFER (id: 9a8b7)", time: "0.0ms", color: "text-gray-500" },
  { msg: "[C++ Sanctions Pre-Filter] Checked OFAC/PEP against 42K entities", time: "1.4µs", color: "text-[#10B981]" },
  { msg: "[C++ Sanctions Pre-Filter] Result: PASSED (No strict match)", time: "1.6µs", color: "text-[#10B981]" },
  { msg: "[LLM Router] Generating speculative routing plan...", time: "15.0ms", color: "text-[#8B5CF6]" },
  { msg: "[Groq LPU] Evaluated MiCA & GENIUS Act constraints", time: "220ms", color: "text-[#8B5CF6]" },
  { msg: "[Groq LPU] Output: Confidence 0.98. Route -> Solana USDC", time: "240ms", color: "text-[#3B82F6]" },
  { msg: "[Execution] Signed via MPC. Broadcasted to mempool.", time: "450ms", color: "text-gray-500" }
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
        <div key={i} className="flex justify-between items-start fade-in">
          <span className={`${line.color} break-all pr-4`}>{line.msg}</span>
          <span className="text-gray-400 shrink-0">{line.time}</span>
        </div>
      ))}
      <div className="fade-in flex space-x-2 items-center text-gray-400 mt-2">
        <div className="w-2 h-4 bg-gray-300"></div>
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
          className="transition duration-1000 ease-out"
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
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState({
    total: 0,
    autoApproved: 0,
    escalated: 0,
    hardRejected: 0,
    avgConfidence: 0,
    processingTime: 0
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Set theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    // Simulate 1s Progressive Loading Skeleton
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [theme]);

  useEffect(() => {
    if (results.length > 0) {
      const total = results.length;
      const autoApproved = results.filter(r => r.result.status === 'AUTO_APPROVED').length;
      const escalated = results.filter(r => r.result.status === 'ESCALATED').length;
      const hardRejected = results.filter(r => r.result.status === 'HARD_REJECT').length;
      const avgConfidence = results.reduce((sum, r) => sum + r.result.confidence, 0) / total;

      setMetrics({
        total,
        autoApproved,
        escalated,
        hardRejected,
        avgConfidence,
        processingTime: total * 0.8 // Simulated
      });
    }
  }, [results]);

  const runSimulation = async () => {
    setIsRunning(true);
    setResults([]);

    // Reset metrics
    setMetrics({
      total: 0,
      autoApproved: 0,
      escalated: 0,
      hardRejected: 0,
      avgConfidence: 0,
      processingTime: 0
    });

    // Mock test data for simulation
    const testCases = [
      {
        id: "1",
        sender_name: "Global Tech Solutions Inc",
        sender_country: "US",
        receiver_name: "EuroTech Distribution GmbH",
        receiver_country: "DE",
        amount_usd: 450.00,
        iso_postal_code: "10115"
      },
      {
        id: "2",
        sender_name: "Pacific Rim Trading Co",
        sender_country: "US",
        receiver_name: "Asia Pacific Logistics Ltd",
        receiver_country: "SG",
        amount_usd: 450.00,
        iso_postal_code: null
      },
      {
        id: "3",
        sender_name: "Multinational Corp Holdings",
        sender_country: "US",
        receiver_name: "European Manufacturing SA",
        receiver_country: "FR",
        amount_usd: 15000.00,
        iso_postal_code: "75001"
      },
      {
        id: "4",
        sender_name: "Shady Offshore LLC",
        sender_country: "PA",
        receiver_name: "O.S.A.M.A. bin Laden",
        receiver_country: "SY",
        amount_usd: 100.00,
        iso_postal_code: "12345"
      },
      {
        id: "5",
        sender_name: "Domestic Supplies Inc",
        sender_country: "GB",
        receiver_name: "Local Retail Chain Ltd",
        receiver_country: "GB",
        amount_usd: 750.00,
        iso_postal_code: "SW1A 1AA"
      },
      {
        id: "6",
        sender_name: "International Consulting Group",
        sender_country: "AU",
        receiver_name: "Global Advisory Services KK",
        receiver_country: "JP",
        amount_usd: 3200.00,
        iso_postal_code: "100-0005"
      }
    ];

    for (let i = 0; i < testCases.length; i++) {
      const tx = testCases[i];
      try {
        const startTime = Date.now();
        // Mock API response
        const data = {
          status: Math.random() > 0.7 ? 'AUTO_APPROVED' : Math.random() > 0.3 ? 'ESCALATED' : 'HARD_REJECT',
          reason: 'Compliance check passed',
          confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
          route: Math.random() > 0.5 ? 'Solana USDC' : 'Ethereum USDC',
          fee_estimated: '$0.25'
        };
        const endTime = Date.now();

        setResults(prev => [...prev, {
          tx,
          result: data,
          latency: endTime - startTime
        }]);

        // Small delay for visual effect
        await new Promise(r => setTimeout(r, 400));
      } catch (error) {
        console.error("API Error:", error);
        setResults(prev => [...prev, {
          tx,
          result: {
            status: 'ERROR',
            reason: 'API Connection Failed',
            confidence: 0,
            route: 'N/A',
            fee_estimated: '$0.00'
          },
          latency: 0
        }]);
      }
    }
    setIsRunning(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'AUTO_APPROVED':
        return {
          label: 'Auto-Approved',
          icon: CheckCircle,
          color: 'bg-green-50 text-green-600 border border-green-200',
          iconColor: 'text-green-500',
          borderColor: 'border-green-200',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600'
        };
      case 'ESCALATED':
        return {
          label: 'Requires Review',
          icon: Clock,
          color: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
          iconColor: 'text-yellow-500',
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600'
        };
      case 'HARD_REJECT':
        return {
          label: 'Blocked',
          icon: XCircle,
          color: 'bg-red-50 text-red-600 border border-red-200',
          iconColor: 'text-red-500',
          borderColor: 'border-red-200',
          bgColor: 'bg-red-50',
          textColor: 'text-red-600'
        };
      default:
        return {
          label: status,
          icon: AlertTriangle,
          color: 'bg-gray-50 text-gray-600 border border-gray-200',
          iconColor: 'text-gray-500',
          borderColor: 'border-gray-200',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600'
        };
    }
  };

  const getRouteIcon = (route: string) => {
    if (route.includes('USDC') || route.includes('Base')) return Zap;
    if (route.includes('SWIFT')) return Bot;
    if (route.includes('SEPA')) return Layout;
    return Shield;
  };

  // Filter results based on status and search term
  const filteredResults = results.filter(result => {
    const statusMatch = filter === 'all' || result.result.status === filter;
    const searchMatch = !searchTerm ||
      result.tx.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.tx.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.tx.sender_country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.tx.receiver_country.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleManualApprove = () => {
    setHitlStatus('approved');
    setTxHash('0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''));
  };

  const handleManualReject = () => {
    setHitlStatus('rejected');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-7xl grid grid-cols-12 gap-6 fade-in">
          <div className="col-span-12 lg:col-span-8 h-[340px] bg-card rounded-xl border border-white/5"></div>
          <div className="col-span-12 lg:col-span-4 h-[160px] bg-card rounded-xl border border-white/5"></div>
          <div className="col-span-12 lg:col-span-4 h-[160px] bg-card rounded-xl border border-white/5"></div>
          <div className="col-span-12 h-[300px] bg-card rounded-xl border border-white/5 mt-[-156px] lg:mt-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-8 font-sans selection:bg-primary/20">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Shield className="w-4 h-4 text-white" />
            </div>

            <p className="text-sm text-muted-foreground max-w-md">
              Processing stablecoin transactions with AI-powered compliance screening and optimal routing
            </p>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">LedgerGuard<span className="text-muted-foreground font-normal"> / Compliance Engine</span></h1>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span>System Operational</span>
            </div>

            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input input-lg w-32"
              >
                <option value="all">All Transactions</option>
                <option value="AUTO_APPROVED">Auto-Approved</option>
                <option value="ESCALATED">Requires Review</option>
                <option value="HARD_REJECT">Blocked</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="btn-outline hover-lift"
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="btn-primary px-6 py-3 text-lg font-semibold flex items-center space-x-3 hover-lift transition duration-200"
              >
                {isRunning ? (
                  <>
                    <AlertTriangle className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" /> Run Simulation
                  </>
                )}
              </button>
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
                  <h2 className="text-sm font-medium text-muted-foreground">USDC Compliance Velocity (7D)</h2>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-4xl font-mono text-foreground tracking-tighter">$142.8M</span>
                    <span className="text-sm font-mono text-success flex items-center"><ArrowRight className="w-3 h-3 -rotate-45 mr-1" /> +12.4%</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="space-y-0">
                <p className="text-sm font-medium text-muted-foreground">Total Processed</p>
                <p className="text-2xl font-bold text-foreground">{metrics.total}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 max-w-sm">
                Real-time settlement throughput processed and cleared across regulatory boundaries.
              </p>
            </div>
            <div className="h-[200px] w-full">
              <VelocityChart />
            </div>
          </GlowCard>

          {/* Widget B: Live Connection Stats / Active VASP Nodes (col-4, row-1) */}
          <GlowCard className="col-span-12 lg:col-span-4 row-span-1 p-5 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium text-muted-foreground flex items-center">
                <Server className="w-4 h-4 mr-2 text-primary" />
                Active VASP Nodes
              </h2>
              <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-muted-foreground border border-white/5">WS: CONNECTED</span>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Connected Counterparties</div>
              <p className="text-2xl font-bold text-foreground">42</p>
              <p className="text-xs text-muted-foreground">+7 today</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Daily Volume</span>
                <span className="text-2xl font-mono text-foreground">$2.1B</span>
              </div>
            </div>
          </GlowCard>

          {/* Widget C: AI Confidence Score Radial Meter (col-4, row-1) */}
          <GlowCard className="col-span-12 lg:col-span-4 row-span-1 p-5 flex items-center justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-1">Global AI Confidence</h2>
                <p className="text-xs text-muted-foreground">Trailing 24h rolling average</p>
              </div>
              <div className="space-y-0">
                <p className="text-sm font-medium text-muted-foreground">AI Confidence</p>
                <p className="text-2xl font-bold text-foreground">
                  {(metrics.avgConfidence * 100).toFixed(1)}%
                </p>
                <div className="flex space-x-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-muted-foreground font-mono"><Server className="w-3 h-3 mr-1" /> VASP Nodes</div>
                    <div className="text-lg font-mono text-foreground">12/12</div>
                  </div>
                  <div className="w-px bg-white/10"></div>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-muted-foreground font-mono"><Network className="w-3 h-3 mr-1" /> Latency</div>
                    <div className="text-lg font-mono text-primary">42ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Widget D: Interactive Sanctions Escalation Queue (col-12, row-3) */}
          <GlowCard className={`col-span-12 row-span-3 p-0 transition-colors duration-500 ${
            hitlStatus === 'approved' ? 'bg-success/5 border-success/20' :
            hitlStatus === 'rejected' ? 'bg-destructive/5 border-destructive/20' : ''
          }`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg border ${
                  hitlStatus === 'pending' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                  hitlStatus === 'approved' ? 'bg-success/10 border-success/20 text-success' :
                  'bg-destructive/10 border-destructive/20 text-destructive'
                }`}>
                  {hitlStatus === 'pending' ? <ShieldAlert className="w-5 h-5" /> :
                   hitlStatus === 'approved' ? <CheckCircle className="w-5 h-5" /> :
                   <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base font-medium text-foreground">Human-In-The-Loop (HITL) Queue</h2>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">Escalation ID: #TX-992B-4F1A</p>
                </div>
              </div>
              <div className="space-y-0">
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {((metrics.autoApproved + metrics.escalated) / Math.max(metrics.total, 1) * 100).toFixed(1)}%
                </p>
              </div>

              {hitlStatus === 'pending' && (
                <div className="flex space-x-3">
                  <button onClick={handleManualReject} className="px-4 py-2 text-xs font-mono font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 transition duration-200">
                    Execute Reject
                  </button>
                  <button onClick={handleManualApprove} className="px-4 py-2 text-xs font-mono font-medium text-white bg-primary hover:bg-primary/80 shadow-[0_0_15px_rgba(59,130,246,0.4)] rounded-lg transition-all duration-200">
                    Approve Manual Clear
                  </button>
                </div>
              )}

              {hitlStatus === 'approved' && (
                <div className="fade-in bg-success/10 border border-success/20 rounded-lg p-4 font-mono text-xs">
                  <div className="text-success mb-1">✓ SEC/FEMA Manual Release Executed</div>
                  <div className="text-muted-foreground">TxHash: <span className="text-foreground break-all">{txHash}</span></div>
                </div>
              )}

              {hitlStatus === 'rejected' && (
                <div className="fade-in bg-destructive/10 border border-destructive/20 rounded-lg p-4 font-mono text-xs">
                  <div className="text-destructive mb-1">✗ Compliance Hold Executed</div>
                  <div className="text-muted-foreground">Funds returned to sender wallet. Prompt change control entry logged.</div>
                </div>
              )}
            </div>
          </GlowCard>
        </div>

        {/* Transaction Ledger */}
        <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
          {filteredResults.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-sm font-medium text-muted-foreground border-b border-white/5 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 w-16">Status</th>
                      <th className="p-4 min-w-0">Transaction Details</th>
                      <th className="p-4 min-w-0">AI Analysis</th>
                      <th className="p-4 min-w-0">Routing Decision</th>
                      <th className="p-4 text-right w-20">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredResults.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-white/5 transition duration-200 ease-in-out border-l-4"
                        style={{
                          borderLeftColor:
                            item.result.status === 'AUTO_APPROVED' ? '#10B981' :
                            item.result.status === 'ESCALATED' ? '#FBBF24' :
                            item.result.status === 'HARD_REJECT' ? '#F87171' : '#6B7280'
                        }}
                      >
                        <td className="p-4 flex items-center space-x-3">
                          {getStatusConfig(item.result.status).icon && (
                            <>
                              {React.createElement(getStatusConfig(item.result.status).icon, {
                                className: `w-5 h-5 ${getStatusConfig(item.result.status).iconColor}`}
                              })}
                            </>
                          )}
                          <span className="font-medium text-foreground">
                            {getStatusConfig(item.result.status).label}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="space-y-2">
                            <p className="flex items-center space-x-2 text-foreground font-medium">
                              ${item.tx.amount_usd.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              From: {item.tx.sender_name} ({item.tx.sender_country})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              To: {item.tx.receiver_name} ({item.tx.receiver_country})
                            </p>
                            {item.tx.iso_postal_code && (
                              <p className="text-sm text-muted-foreground">
                                Postal: {item.tx.iso_postal_code}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 rounded-md flex items-center justify-center">
                                {item.result.confidence >= 0.95 ? (
                                  <CheckCircle className="w-4 h-4 text-success" />
                                ) : item.result.confidence >= 0.70 ? (
                                  <AlertTriangle className="w-4 h-4 text-warning" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-destructive" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">Confidence Score</p>
                                <p className="text-lg font-bold text-foreground tracking-tight">
                                  {(item.result.confidence * 100).toFixed(1)}%
                                </p>
                              </div>
                            </div>

                            <div className="confidence-bar">
                              <div
                                className={`confidence-fill ${item.result.confidence >= 0.95 ? 'bg-success/500' : item.result.confidence >= 0.70 ? 'bg-warning/500' : 'bg-destructive/500'}`}
                                style={{ width: `${item.result.confidence * 100}%` }}
                              />
                            </div>

                            {item.result.reason && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {item.result.reason}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="space-y-2">
                            {item.result.route ? (
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-md flex items-center justify-center">
                                  {React.createElement(getRouteIcon(item.result.route), {
                                    className: "w-4 h-4 text-muted-foreground"
                                  })}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-foreground">
                                    {item.result.route}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Fee: {item.result.fee_estimated}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center">
                                Transaction Blocked
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right space-y-2">
                          <div className="text-sm font-medium text-foreground">
                            Latency: {item.latency?.toFixed(0) ?? 0}ms
                          </div>
                          {item.latency && (
                            <div className="w-16 h-2 bg-muted/50 rounded-full overflow-hidden mt-2">
                              <div
                                className={`h-full bg-primary/20 rounded-full`}
                                style={{
                                  width: `${Math.min(item.latency / 2000 * 100, 100)}%`
                                }}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hitlStatus === 'approved' && (
                  <div className="fade-in bg-success/10 border border-success/20 rounded-lg p-4 font-mono text-xs">
                    <div className="text-success mb-1">✓ SEC/FEMA Manual Release Executed</div>
                    <div className="text-muted-foreground">TxHash: <span className="text-foreground break-all">{txHash}</span></div>
                  </div>
                )}
                {hitlStatus === 'rejected' && (
                  <div className="fade-in bg-destructive/10 border border-destructive/20 rounded-lg p-4 font-mono text-xs">
                    <div className="text-destructive mb-1">✗ Compliance Hold Executed</div>
                    <div className="text-muted-foreground">Funds returned to sender wallet. Prompt change control entry logged.</div>
                  </div>
                )}
              </>
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground font-medium mb-3">
                  No transactions to display
                </p>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                  Click "Run Simulation" to process transactions through the AI compliance engine
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}