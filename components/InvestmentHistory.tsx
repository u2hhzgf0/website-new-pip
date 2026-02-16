'use client'

import React from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';

const InvestmentHistory = () => {
  const history = [
    { id: 'INV-8821', plan: 'Premier', invested: 1000, profit: 800, status: 'Active', start: 'Oct 22, 2023', end: 'Nov 05, 2023' },
    { id: 'INV-8815', plan: 'Starter', invested: 200, profit: 40, status: 'Completed', start: 'Oct 10, 2023', end: 'Oct 17, 2023' },
    { id: 'INV-8802', plan: 'Starter', invested: 50, profit: 10, status: 'Completed', start: 'Sep 25, 2023', end: 'Oct 02, 2023' },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-blue-500/10 text-blue-500';
    if (status === 'Active') return 'bg-green-500/10 text-green-500';
    return 'bg-slate-700 text-slate-400';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Investment History</h2>
          <p className="text-slate-400 text-xs sm:text-sm">A comprehensive record of your investment journey.</p>
        </div>
        <div className="flex space-x-2">
           <div className="relative w-full sm:w-auto">
             <input type="text" placeholder="Search ID..." className="w-full sm:w-auto bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500" />
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
           </div>
           <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white">
             <Filter size={20} />
           </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">ROI Profit</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <span className="block font-bold text-white text-base">{item.plan}</span>
                      <span className="text-xs text-slate-500 font-mono">{item.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    ${item.invested.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-green-400">
                    +${item.profit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    <div className="text-xs">
                      <span className="block">Start: {item.start}</span>
                      <span className="block">End: {item.end}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-slate-800">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No investment records found.
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="p-3 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="bg-gold-500/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-gold-500">
                      <TrendingUp size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white">{item.plan}</p>
                      <p className="text-[10px] text-slate-500">{item.start} - {item.end}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-bold text-white">${item.invested.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-[10px] text-green-400 font-bold">+${item.profit}</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-3 sm:p-4 border-t border-slate-800 flex justify-between items-center text-xs sm:text-sm text-slate-500">
          <span>Showing {history.length} records</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentHistory;