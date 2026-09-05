'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Bot,
  Layout,
  List,
  Search,
  Settings,
  Download,
  Upload,
} from 'lucide-react';

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

interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label: string;
}

const sampleMarkers: GlobeMarker[] = [
  {
    lat: 40.7128,
    lng: -74.006,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "New York",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "London",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Tokyo",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Sydney",
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Paris",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "New Delhi",
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "Moscow",
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Rio de Janeiro",
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    src: "https://assets.aceternity.com/avatars/9.webp",
    label: "Shanghai",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    src: "https://assets.aceternity.com/avatars/10.webp",
    label: "Dubai",
  },
  {
    lat: -34.6037,
    lng: -58.3816,
    src: "https://assets.aceternity.com/avatars/11.webp",
    label: "Buenos Aires",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: "https://assets.aceternity.com/avatars/12.webp",
    label: "Singapore",
  },
  {
    lat: 37.5665,
    lng: 126.978,
    src: "https://assets.aceternity.com/avatars/13.webp",
    label: "Seoul",
  };

export default function Dashboard() {
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

    for (let i = 0; i < testCases.length; i++) {
      const tx = testCases[i];
      try {
        const startTime = Date.now();
        const response = await fetch('http://127.0.0.1:8080/api/v1/route-transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tx),
        });
        const data = await response.json();
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

  if (!results.length && !isRunning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-white p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  KinexysRoute AI
                </h1>
                <p className="text-xl text-slate-500 font-medium">
                  Autonomous Compliance & Routing Engine
                </p>
              </div>
            </div>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Intelligent stablecoin transaction processing with real-time AI-powered compliance screening and optimal routing decisions.
            </p>

            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={runSimulation}
                className="btn-primary px-8 py-3 text-lg font-semibold flex items-center space-x-3 hover-lift"
              >
                <Zap className="w-5 h-5" /> Run Compliance Simulation
              </button>

              <button
                onClick={() => window.location.reload()}
                className="btn-outline px-8 py-3 text-lg font-semibold flex items-center space-x-3 hover-lift"
              >
                <AlertTriangle className="w-5 h-5" /> Reset System
              </button>
            </div>
          </div>

          {/* System Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="metric-card hover-lift">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-0">
                  <p className="text-sm font-medium text-slate-500">AI Agents</p>
                  <p className="text-2xl font-bold text-slate-900">4 Active</p>
                </div>
              </div>
            </div>

            <div className="metric-card hover-lift">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-0">
                  <p className="text-sm font-medium text-slate-500">Compliance Score</p>
                  <p className="text-2xl font-bold text-slate-900">99.2%</p>
                </div>
              </div>
            </div>

            <div className="metric-card hover-lift">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="space-y-0">
                  <p className="text-sm font-medium text-slate-500">Avg Processing</p>
                  <p className="text-2xl font-bold text-slate-900">0.8s</p>
                </div>
              </div>
            </div>

            <div className="metric-card hover-lift">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <List className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="space-y-0">
                  <p className="text-sm font-medium text-slate-500">Transaction Volume</p>
                  <p className="text-2xl font-bold text-slate-900">Ready</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover-lift">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mt-0.5">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">How It Works</h2>
                <div className="space-y-3 text-slate-600">
                  <p className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Click "Run Compliance Simulation" to process test transactions through the AI compliance engine</span>
                  </p>
                  <p className="flex items-center space-x-3">
                    <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span>Watch as transactions are automatically screened, analyzed, and routed based on compliance policies</span>
                  </p>
                  <p className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>Results show real-time decisions with confidence scores and routing recommendations</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Globe Section */}
        <div className="mb-10">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 text-center">
              Global Transaction Network
            </div>
            <p className="text-base text-slate-500 max-w-3xl mx-auto text-center">
              Real-time visualization of cross-border stablecoin flows across major financial hubs
            </p>
            <div className="relative">
              <div className="aspect-[1/1] w-[400px] mx-auto">
                <Globe3D
                  markers={sampleMarkers}
                  config={{
                    atmosphereColor: "#4da6ff",
                    atmosphereIntensity: 20,
                    bumpScale: 5,
                    autoRotateSpeed: 0.3,
                  }}
                  onMarkerClick={(marker) => {
                    console.log("Clicked marker:", marker.label);
                  }}
                  onMarkerHover={(marker) => {
                    if (marker) {
                      console.log("Hovering:", marker.label);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  KinexysRoute AI
                </h1>
                <p className="text-xl text-slate-500 font-medium">
                  Autonomous Compliance & Routing Engine
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500 max-w-md">
              Processing stablecoin transactions with AI-powered compliance screening and optimal routing
            </p>
          </div>

          <div className="flex items-end space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-lg w-48 pl-10 pr-4"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
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

            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="btn-primary px-6 py-3 text-lg font-semibold flex items-center space-x-3 hover-lift transition-all duration-200"
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

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="metric-card hover-lift">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-0">
                <p className="text-sm font-medium text-slate-500">Total Processed</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.total}</p>
              </div>
            </div>
          </div>

          <div className="metric-card hover-lift">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-0">
                <p className="text-sm font-medium text-slate-500">Auto-Approved</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.autoApproved}</p>
              </div>
            </div>
          </div>

          <div className="metric-card hover-lift">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="space-y-0">
                <p className="text-sm font-medium text-slate-500">Requires Review</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.escalated}</p>
              </div>
            </div>
          </div>

          <div className="metric-card hover-lift">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="space-y-0">
                <p className="text-sm font-medium text-slate-500">Blocked</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.hardRejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          <div className="metric-card hover-lift">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="space-y-0">
                <p className="text-sm font-medium text-slate-500">AI Confidence</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(metrics.avgConfidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="metric-card hover-lift">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div className="space-y-0">
                <p className="text-sm font-medium text-slate-500">Avg Latency</p>
                <p className="text-2xl font-bold text-slate-900">
                  {metrics.processingTime.toFixed(1)}s
                </p>
              </div>
            </div>
          </div>

          <div className="metric-card hover-lift">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal-600" />
              </div>
              <div className="space-y-0">
                <p className="text-sm font-medium text-slate-500">Success Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {((metrics.autoApproved + metrics.escalated) / Math.max(metrics.total, 1) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover-lift">
          {filteredResults.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-slate-600 font-medium border-b border-border sticky top-0 z-10">
                    <tr>
                      <th className="p-4 w-16">Status</th>
                      <th className="p-4 min-w-0">Transaction Details</th>
                      <th className="p-4 min-w-0">AI Analysis</th>
                      <th className="p-4 min-w-0">Routing Decision</th>
                      <th className="p-4 text-right w-20">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredResults.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-muted/50 transition-all duration-200 ease-in-out border-l-4"
                        style={{
                          borderLeftColor:
                            item.result.status === 'AUTO_APPROVED' ? '#388e3c' :
                            item.result.status === 'ESCALATED' ? '#f57c00' :
                            item.result.status === 'HARD_REJECT' ? '#d32f2f' : '#6c757d'
                        }}
                      >
                        <td className="p-4 flex items-center space-x-3">
                          {getStatusConfig(item.result.status).icon && (
                            <>
                              {React.createElement(getStatusConfig(item.result.status).icon, {
                                className: `w-5 h-5 ${getStatusConfig(item.result.status).iconColor}`
                              })}
                            </>
                          )}
                          <span className="font-medium text-slate-900">
                            {getStatusConfig(item.result.status).label}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="space-y-2">
                            <p className="flex items-center space-x-2 text-slate-900 font-medium">
                              ${item.tx.amount_usd.toLocaleString()}
                            </p>
                            <p className="text-slate-500 text-xs">
                              From: {item.tx.sender_name} ({item.tx.sender_country})
                            </p>
                            <p className="text-slate-500 text-xs">
                              To: {item.tx.receiver_name} ({item.tx.receiver_country})
                            </p>
                            {item.tx.iso_postal_code && (
                              <p className="text-slate-500 text-xs">
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
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : item.result.confidence >= 0.70 ? (
                                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">Confidence Score</p>
                                <p className="text-lg font-bold text-slate-900 tracking-tight">
                                  {(item.result.confidence * 100).toFixed(1)}%
                                </p>
                              </div>
                            </div>

                            <div className="confidence-bar">
                              <div
                                className={`confidence-fill ${item.result.confidence >= 0.95 ? 'bg-green-500' : item.result.confidence >= 0.70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${item.result.confidence * 100}%` }}
                              />
                            </div>

                            {item.result.reason && (
                              <p className="text-slate-500 text-xs mt-2">
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
                                    className: "w-4 h-4 text-slate-600"
                                  })}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-slate-900">
                                    {item.result.route}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Fee: {item.result.fee_estimated}
                                  </p>
                                </div>
                              )
                            ) : (
                              <p className="text-slate-500 text-xs text-center">
                                Transaction Blocked
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right space-y-2">
                          <div className="text-sm font-medium text-slate-900">
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
              </div>

              {/* Legend */}
              <div className="mt-5 p-4 bg-muted/50 rounded-lg border-t border-border">
                <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Auto-Approved (≥95% confidence)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span>Requires Review (70-94% confidence)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Blocked (<70% confidence)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span>Routing: ⚡ Stablecoin | 🤖 Traditional | 🌐 Regional</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-lg text-slate-500 font-medium mb-3">
                No transactions to display
              </p>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Click "Run Simulation" to process transactions through the AI compliance engine
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}