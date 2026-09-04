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
  List
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
        await new Promise(r => setTimeout(r, 600));
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
          color: 'bg-green-50 text-green-600',
          iconColor: 'text-green-500',
          borderColor: 'border-green-200'
        };
      case 'ESCALATED':
        return {
          label: 'Requires Review',
          icon: Clock,
          color: 'bg-yellow-50 text-yellow-600',
          iconColor: 'text-yellow-500',
          borderColor: 'border-yellow-200'
        };
      case 'HARD_REJECT':
        return {
          label: 'Blocked',
          icon: XCircle,
          color: 'bg-red-50 text-red-600',
          iconColor: 'text-red-500',
          borderColor: 'border-red-200'
        };
      default:
        return {
          label: status,
          icon: AlertTriangle,
          color: 'bg-gray-50 text-gray-600',
          iconColor: 'text-gray-500',
          borderColor: 'border-gray-200'
        };
    }
  };

  const getRouteIcon = (route: string) => {
    if (route.includes('USDC') || route.includes('Base')) return Zap;
    if (route.includes('SWIFT')) return Bot;
    if (route.includes('SEPA')) return Layout;
    return Shield;
  };

  if (!results.length && !isRunning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              KinexysRoute AI
            </h1>
            <p className="text-xl text-slate-500 mb-6">
              Autonomous Compliance & Routing Engine for Cross-Border Stablecoin Transactions
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={runSimulation}
                className="btn-primary px-8 py-3 text-lg font-semibold flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" /> Run Compliance Simulation
              </button>

              <button
                onClick={() => window.location.reload()}
                className="btn-secondary px-8 py-3 text-lg font-semibold flex items-center space-x-2"
              >
                <AlertTriangle className="w-5 h-5" /> Reset System
              </button>
            </div>
          </div>

          {/* System Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="metric-card">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">AI Agents</p>
                  <p className="text-2xl font-bold text-slate-900">4 Active</p>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Compliance Score</p>
                  <p className="text-2xl font-bold text-slate-900">99.2%</p>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Avg Processing</p>
                  <p className="text-2xl font-bold text-slate-900">0.8s</p>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <List className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Transaction Volume</p>
                  <p className="text-2xl font-bold text-slate-900">Ready</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">How It Works</h2>
            <div className="space-y-4 text-slate-600">
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              KinexysRoute AI
            </h1>
            <p className="text-xl text-slate-500">
              Autonomous Compliance & Routing Engine for Cross-Border Stablecoin Transactions
            </p>
          </div>

          <div className="space-x-4">
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="btn-primary px-8 py-3 text-lg font-semibold flex items-center space-x-2"
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

            <button
              onClick={() => window.location.reload()}
              className="btn-secondary px-8 py-3 text-lg font-semibold flex items-center space-x-2"
            >
              <AlertTriangle className="w-5 h-5" /> Reset
            </button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="metric-card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Processed</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.total}</p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Auto-Approved</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.autoApproved}</p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Requires Review</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.escalated}</p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Blocked</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.hardRejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="metric-card">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">AI Confidence</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(metrics.avgConfidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Avg Latency</p>
                <p className="text-2xl font-bold text-slate-900">
                  {metrics.processingTime.toFixed(1)}s
                </p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-3 bg-teal-50 rounded-lg">
                <Shield className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Success Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {((metrics.autoApproved + metrics.escalated) / Math.max(metrics.total, 1) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="p-4 w-16">Status</th>
                  <th className="p-4">Transaction Details</th>
                  <th className="p-4">AI Analysis</th>
                  <th className="p-4">Routing Decision</th>
                  <th className="p-4 text-right w-20">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 transition-all duration-200 border-l-4"
                    style={{
                      borderLeftColor:
                        item.result.status === 'AUTO_APPROVED' ? '#10b981' :
                        item.result.status === 'ESCALATED' ? '#f59e0b' :
                        item.result.status === 'HARD_REJECT' ? '#ef4444' : '#6b7280'
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
                          <div className="p-2 rounded-md">
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
                            <p className="text-lg font-bold text-slate-900">
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
                            <div className="p-2 rounded-md">
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
                          </div>
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
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full bg-blue-500 rounded-full`}
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
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border-t border-slate-200">
            <div className="flex flex-wrap gap-4 text-slate-600 text-sm">
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
                <span>Blocked (less than 70% confidence)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>Routing: ⚡ Stablecoin | 🤖 Traditional | 🌐 Regional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}