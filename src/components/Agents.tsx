import { useState } from 'react';
import { Agent, Lead, Quotation, Order, Invoice } from '../types';
import { Language } from '../i18n';
import { 
  User, Users, FileText, ShoppingCart, Euro, TrendingUp, 
  Plus, Edit2, Trash2, Pause, Play, ArrowLeft, Phone, Mail,
  BarChart3, Award
} from 'lucide-react';

interface AgentsProps {
  agents: Agent[];
  setAgents: (a: Agent[]) => void;
  leads: Lead[];
  quotations: Quotation[];
  orders: Order[];
  invoices: Invoice[];
  language: Language;
}

export default function Agents({ agents, setAgents, leads, quotations, orders, invoices, language }: AgentsProps) {
  const [showNew, setShowNew] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const t: Record<string, any> = {
    es: { title: 'Agentes', total: 'Agentes Totali', active: 'Attivi', revenue: 'Fatturato Totale', pipeline: 'Pipeline Totale', newAgent: 'Nuevo Agente', leads: 'Leads', quotes: 'Preventivi', orders: 'Ordini', detail: 'Dettaglio', edit: 'Modifica', delete: 'Elimina', noAgents: 'Nessun agente registrato', createFirst: 'Crear Primer Agente', assignedContacts: 'Contatti Assegnati', quotesTitle: 'Preventivi', number: 'Numero', client: 'Cliente', date: 'Data', status: 'Stato', total: 'Totale', name: 'Nome', company: 'Azienda', stage: 'Stage', expectedRevenue: 'Revenue Previsto', probability: 'Probabilità' },
    en: { title: 'Agents', total: 'Total Agents', active: 'Active', revenue: 'Total Revenue', pipeline: 'Total Pipeline', newAgent: 'New Agent', leads: 'Leads', quotes: 'Quotations', orders: 'Orders', detail: 'Detail', edit: 'Edit', delete: 'Delete', noAgents: 'No agents registered', createFirst: 'Create First Agent', assignedContacts: 'Assigned Contacts', quotesTitle: 'Quotations', number: 'Number', client: 'Client', date: 'Date', status: 'Status', total: 'Total', name: 'Name', company: 'Company', stage: 'Stage', expectedRevenue: 'Expected Revenue', probability: 'Probability' },
    it: { title: 'Agenti', total: 'Agenti Totali', active: 'Attivi', revenue: 'Fatturato Totale', pipeline: 'Pipeline Totale', newAgent: 'Nuovo Agente', leads: 'Lead', quotes: 'Preventivi', orders: 'Ordini', detail: 'Dettaglio', edit: 'Modifica', delete: 'Elimina', noAgents: 'Nessun agente registrato', createFirst: 'Crea Primo Agente', assignedContacts: 'Contatti Assegnati', quotesTitle: 'Preventivi', number: 'Numero', client: 'Cliente', date: 'Data', status: 'Stato', total: 'Totale', name: 'Nome', company: 'Azienda', stage: 'Stage', expectedRevenue: 'Fatturato Previsto', probability: 'Probabilità' }
  };
  const lang = t[language] || t.es;

  const handleCreate = (agent: Agent) => {
    setAgents([...agents, agent]);
    setShowNew(false);
  };

  const handleUpdate = (agent: Agent) => {
    setAgents(agents.map(a => a.id === agent.id ? agent : a));
    setEditingAgent(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este agente?')) {
      setAgents(agents.filter(a => a.id !== id));
      if (selectedAgent?.id === id) setSelectedAgent(null);
    }
  };

  const handleToggleActive = (id: string) => {
    setAgents(agents.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  // Vista dettaglio agente
  if (selectedAgent) {
    const agentLeads = leads.filter(l => l.agentId === selectedAgent.id);
    const agentQuotations = quotations.filter(q => q.agentId === selectedAgent.id);
    const agentOrders = orders.filter(o => o.agentId === selectedAgent.id);
    const agentInvoices = invoices.filter(i => i.agentId === selectedAgent.id);
    const totalRevenue = agentInvoices.reduce((s, i) => s + i.total, 0);
    const pipelineValue = agentLeads.reduce((s, l) => s + l.expectedRevenue * (l.probability / 100), 0);

    return (
      <div className="p-6 bg-gray-50 min-h-screen space-y-6">
        {/* Header Dettaglio */}
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedAgent(null)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white">{selectedAgent.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">{selectedAgent.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{selectedAgent.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{selectedAgent.phone}</span>
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${selectedAgent.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {selectedAgent.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {/* Statistiche Agente */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{lang.leads}</p>
            <p className="text-2xl font-bold text-purple-600">{agentLeads.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{lang.quotes}</p>
            <p className="text-2xl font-bold text-blue-600">{agentQuotations.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{lang.orders}</p>
            <p className="text-2xl font-bold text-amber-600">{agentOrders.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{lang.revenue}</p>
            <p className="text-2xl font-bold text-green-600">€{totalRevenue.toLocaleString('it-ES', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{lang.pipeline}</p>
            <p className="text-2xl font-bold text-orange-600">€{pipelineValue.toLocaleString('it-ES', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Contatti Assegnati */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">{lang.assignedContacts}</h3>
            <span className="text-xs text-gray-500 ml-2">({agentLeads.length})</span>
          </div>
          {agentLeads.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Nessun contatto assegnato</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.name}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.company}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.stage}</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.expectedRevenue}</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.probability}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {agentLeads.map(l => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{l.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{l.company || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">{l.stage}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">€{l.expectedRevenue.toLocaleString('it-ES')}</td>
                      <td className="px-4 py-3 text-sm text-right">{l.probability}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Preventivi Agente */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">{lang.quotesTitle}</h3>
            <span className="text-xs text-gray-500 ml-2">({agentQuotations.length})</span>
          </div>
          {agentQuotations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Nessun preventivo</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.number}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.client}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.date}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.status}</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.total}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {agentQuotations.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-purple-600 font-mono">{q.number}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{q.contactName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{q.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          q.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          q.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">€{q.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista lista agenti
  const totalRevenue = invoices.reduce((s, i) => s + i.total, 0);
  const totalPipeline = leads.reduce((s, l) => s + l.expectedRevenue * (l.probability / 100), 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{lang.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Gestione agenti commerciali</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          {lang.newAgent}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">{lang.total}</p>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600">{agents.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">{lang.active}</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{agents.filter(a => a.active).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">{lang.revenue}</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Euro className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">€{totalRevenue.toLocaleString('it-ES', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">{lang.pipeline}</p>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600">€{totalPipeline.toLocaleString('it-ES', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Lista Agenti */}
      {agents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">{lang.noAgents}</p>
          <button onClick={() => setShowNew(true)} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
            {lang.createFirst}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => {
            const agentLeads = leads.filter(l => l.agentId === agent.id);
            const agentQuotations = quotations.filter(q => q.agentId === agent.id);
            const agentInvoices = invoices.filter(i => i.agentId === agent.id);
            const agentRevenue = agentInvoices.reduce((s, i) => s + i.total, 0);
            return (
              <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{agent.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{agent.name}</h3>
                      <p className="text-xs text-gray-500">{agent.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${agent.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {agent.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-purple-600">{agentLeads.length}</p>
                    <p className="text-xs text-gray-500">{lang.leads}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-blue-600">{agentQuotations.length}</p>
                    <p className="text-xs text-gray-500">{lang.quotes}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-green-600">€{agentRevenue > 0 ? (agentRevenue / 1000).toFixed(0) + 'k' : '0'}</p>
                    <p className="text-xs text-gray-500">{lang.revenue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedAgent(agent)} className="flex-1 px-3 py-2 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 font-medium flex items-center justify-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    {lang.detail}
                  </button>
                  <button onClick={() => setEditingAgent(agent)} className="px-3 py-2 text-xs bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleToggleActive(agent.id)} className={`px-3 py-2 text-xs rounded-lg ${agent.active ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                    {agent.active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <button onClick={() => handleDelete(agent.id)} className="px-3 py-2 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nuovo/Modifica Agente */}
      {(showNew || editingAgent) && (
        <AgentModal
          agent={editingAgent}
          onClose={() => { setShowNew(false); setEditingAgent(null); }}
          onSave={editingAgent ? handleUpdate : handleCreate}
        />
      )}
    </div>
  );
}

// Modal Agente
function AgentModal({ agent, onClose, onSave }: { agent?: Agent; onClose: () => void; onSave: (a: Agent) => void }) {
  const [name, setName] = useState(agent?.name || '');
  const [email, setEmail] = useState(agent?.email || '');
  const [phone, setPhone] = useState(agent?.phone || '');
  const [active, setActive] = useState(agent?.active !== false);

  const handleSubmit = () => {
    if (!name || !email) {
      alert('Por favor, completa al menos nombre y email');
      return;
    }
    onSave({
      id: agent?.id || `ag${Date.now()}`,
      name,
      email,
      phone,
      active,
      createdAt: agent?.createdAt || new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            {agent ? 'Editar' : 'Nuevo'} Agente
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Ej: Juan Pérez" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Ej: juan@empresa.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Ej: +34 600 123 456" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="agentActive" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="agentActive" className="text-sm">Agente Activo</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancelar</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
              {agent ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}