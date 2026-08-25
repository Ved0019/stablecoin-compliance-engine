'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

// The exact test cases from our backend script
const testCases = [
  { id: "1", sender_name: "Tech Corp", sender_country: "US", receiver_name: "Dev Agency", receiver_country: "UK", amount_usd: 450.00, iso_postal_code: "SW1A 1AA" },
  { id: "2", sender_name: "Tech Corp", sender_country: "US", receiver_name: "Dev Agency", receiver_country: "UK", amount_usd: 450.00, iso_postal_code: null },
  { id: "3", sender_name: "Global Inc", sender_country: "US", receiver_name: "Euro Parts", receiver_country: "FR", amount_usd: 15000.00, iso_postal_code: "75001" },
  { id: "4", sender_name: "Shady LLC", sender_country: "US", receiver_name: "Osama Bin Ladden", receiver_country: "SY", amount_usd: 100.00, iso_postal_code: "12345" }
];

export default function Dashboard() {
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setResults([]);
    
    for (const tx of testCases) {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/v1/route-transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tx),
        });
        const data = await response.json();
        setResults(prev => [...prev, { tx, result: data }]);
      } catch (error) {
        console.error("API Error:", error);
      }
      // Small delay for visual effect
      await new Promise(r => setTimeout(r, 800));
    }
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'AUTO_APPROVED') return <CheckCircle className="text-green-500 w-6 h-6" />;
    if (status === 'ESCALATED') return <Clock className="text-yellow-500 w-6 h-6" />;
    return <XCircle className="text-red-500 w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Compliance Routing Engine</h1>
            <p className="text-slate-500">Human-in-the-Loop (HITL) Operations Dashboard</p>
          </div>
          <button 
            onClick={runSimulation}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isRunning ? 'Processing Batch...' : 'Run Simulation Batch'}
          </button>
        </div>

        {/* Transaction Ledger */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Transaction</th>
                <th className="p-4">AI Decision / Reason</th>
                <th className="p-4">Selected Rail</th>
                <th className="p-4 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No transactions processed. Click 'Run Simulation Batch' to begin.
                  </td>
                </tr>
              )}
              {results.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">{getStatusIcon(item.result.status)}</td>
                  <td className="p-4">
                    <p className="font-medium text-slate-900">${item.tx.amount_usd}</p>
                    <p className="text-slate-500 text-xs">To: {item.tx.receiver_name}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.result.status === 'HARD_REJECT' ? 'bg-red-100 text-red-700' :
                      item.result.status === 'ESCALATED' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.result.status}
                    </span>
                    {item.result.reason && <p className="text-xs text-slate-500 mt-1">{item.result.reason}</p>}
                  </td>
                  <td className="p-4 text-slate-700 font-medium">
                    {item.result.route || 'Blocked'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-mono">{item.result.confidence.toFixed(2)}</span>
                      {/* Visual progress bar */}
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full ${item.result.confidence < 0.7 ? 'bg-red-500' : item.result.confidence < 0.95 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${item.result.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}