--- EXPORT_src_components_Dashboard.tsx (原始)


+++ EXPORT_src_components_Dashboard.tsx (修改后)
import { useState } from 'react';
import { Lead, Quotation, Invoice, HistoryEntry, Agent, Order } from '../types';
import { Language, t } from '../i18n';

interface DashboardProps {
  leads: Lead[];
  quotations: Quotation[];
  invoices: Invoice[];
  history: HistoryEntry[];
  agents: Agent[];
  orders: Order[];
  language: Language;
}

import WeeklyPlanner from './WeeklyPlanner';

export default function Dashboard({ leads, quotations, invoices, agents, orders, language }: DashboardProps) {
  const [searchClient, setSearchClient] = useState('');
  const [searchResults, setSearchResults] = useState<Lead | null>(null);
  const [showWeeklyPlanner, setShowWeeklyPlanner] = useState(false);

  const handleSearch = () => {
    if (!searchClient.trim()) {
      setSearchResults(null);
      return;
    }
    const found = leads.find(l =>
      l.name.toLowerCase().includes(searchClient.toLowerCase()) ||
      l.company.toLowerCase().includes(searchClient.toLowerCase()) ||
      l.email.toLowerCase().includes(searchClient.toLowerCase())
    );
    setSearchResults(found || null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Ricerca Cliente */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 card-hover animate-slide-in-right border border-sky-100">
        <h3 className="font-bold text-gray-800 mb-4 text-sm sm:text-base flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-search text-white text-sm"></i>
          </div>
          {t('searchClient', language)}
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder={t('searchPlaceholder', language)}
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 border-2 border-sky-200 rounded-xl px-4 py-3 text-sm focus:border-sky-400 transition-all duration-200"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-200 btn-hover shadow-lg shadow-sky-500/30"
          >
            <i className="fas fa-search mr-2"></i>{t('search', language)}
          </button>
        </div>

        {searchResults && (
          <div className="mt-4 pt-4 border-t border-sky-100 animate-scale-in">
            <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold">{searchResults.firstName[0]}{searchResults.lastName[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{searchResults.name}</h4>
                  <p className="text-xs text-gray-600 truncate">{searchResults.company} • {searchResults.email}</p>
                  <p className="text-[10px] text-gray-500 truncate">{searchResults.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-[10px] text-gray-500">Preventivi</p>
                  <p className="text-xl font-bold text-sky-600">{quotations.filter(q => q.leadId === searchResults.id).length}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-[10px] text-gray-500">Ordini</p>
                  <p className="text-xl font-bold text-emerald-600">{orders.filter(o => o.leadId === searchResults.id).length}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-[10px] text-gray-500">Fatture</p>
                  <p className="text-xl font-bold text-emerald-600">{invoices.filter(i => i.leadId === searchResults.id).length}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-[10px] text-gray-500">Agente</p>
                  <p className="text-xs font-semibold text-gray-800 truncate">{agents.find(a => a.id === searchResults.agentId)?.name || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Piano di Lavoro Settimanale */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 card-hover border border-sky-100 animate-slide-in-left">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 mb-0 text-sm sm:text-base flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-calendar-week text-white text-sm"></i>
            </div>
            Piano di Lavoro Settimanale
          </h3>
          <button
            onClick={() => setShowWeeklyPlanner(true)}
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 btn-hover shadow-lg shadow-sky-500/30"
          >
            <i className="fas fa-external-link-alt mr-2"></i>Apri Planner
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Visualizza e gestisci tutte le attività settimanali dei tuoi agenti in un'unica schermata
        </p>
      </div>

      {/* Statistiche Principali */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Lead Totali', value: leads.length, icon: 'fa-users', gradient: 'from-sky-400 to-sky-600', shadow: 'shadow-sky-500/30' },
          { label: 'Preventivi', value: quotations.length, icon: 'fa-file-invoice', gradient: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/30' },
          { label: 'Fatture', value: invoices.length, icon: 'fa-file-invoice-dollar', gradient: 'from-sky-500 to-emerald-500', shadow: 'shadow-sky-500/30' },
          { label: 'Pipeline', value: `€${leads.reduce((s, l) => s + l.expectedRevenue, 0).toLocaleString()}`, icon: 'fa-chart-line', gradient: 'from-emerald-500 to-sky-500', shadow: 'shadow-emerald-500/30' },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 card-hover border border-gray-100 animate-slide-in-right"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg ${stat.shadow}`}>
                <i className={`fas ${stat.icon} text-white`}></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Performance Agenti */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 card-hover border border-sky-100 animate-slide-in-left">
        <h3 className="font-bold text-gray-800 mb-4 text-sm sm:text-base flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-user-tie text-white text-sm"></i>
          </div>
          Performance Agenti
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, index) => {
            const agentLeads = leads.filter(l => l.agentId === agent.id);
            const agentQuotations = quotations.filter(q => q.agentId === agent.id);
            const agentInvoices = invoices.filter(i => i.agentId === agent.id);
            const agentRevenue = agentInvoices.reduce((s, i) => s + i.total, 0);

            return (
              <div
                key={agent.id}
                className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-xl p-4 border border-sky-100 card-hover animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">{agent.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agentLeads.length} lead</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <p className="text-lg font-bold text-sky-600">{agentQuotations.length}</p>
                    <p className="text-[10px] text-gray-500">Preventivi</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <p className="text-lg font-bold text-emerald-600">{agentInvoices.length}</p>
                    <p className="text-[10px] text-gray-500">Fatture</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <p className="text-sm font-bold text-emerald-600">€{(agentRevenue / 1000).toFixed(0)}k</p>
                    <p className="text-[10px] text-gray-500">Fatturato</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Weekly Planner */}
      {showWeeklyPlanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">
                <i className="fas fa-calendar-week mr-2 text-sky-600"></i>
                Piano di Lavoro Settimanale
              </h2>
              <button
                onClick={() => setShowWeeklyPlanner(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-4">
              <WeeklyPlanner leads={leads} agents={agents} currentAgentId={agents[0]?.id || ''} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
