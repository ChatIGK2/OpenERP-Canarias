--- EXPORT_src_components_Agents.tsx (原始)


+++ EXPORT_src_components_Agents.tsx (修改后)
import { useState } from 'react';
import { Agent, Lead, Quotation, Order, Invoice } from '../types';
import { Language } from '../i18n';

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
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedAgent(null)} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-purple-600">{selectedAgent.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{selectedAgent.name}</h1>
            <p className="text-sm text-gray-500">{selectedAgent.email} • {selectedAgent.phone}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${selectedAgent.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {selectedAgent.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {/* Statistiche */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Leads</p>
            <p className="text-2xl font-bold text-purple-600">{agentLeads.length}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Preventivi</p>
            <p className="text-2xl font-bold text-blue-600">{agentQuotations.length}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Ordini</p>
            <p className="text-2xl font-bold text-amber-600">{agentOrders.length}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Fatturato</p>
            <p className="text-2xl font-bold text-green-600">€{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Pipeline</p>
            <p className="text-2xl font-bold text-orange-600">€{pipelineValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Tabella leads dell'agente */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b"><h3 className="font-semibold text-gray-800"><i className="fas fa-address-book mr-2 text-purple-500"></i>Contatti Assegnati</h3></div>
          {agentLeads.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Nessun contatto assegnato</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Nome</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Azienda</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Stage</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold">Revenue Previsto</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold">Probabilità</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {agentLeads.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{l.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{l.company || '-'}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">{l.stage}</span></td>
                    <td className="px-4 py-3 text-sm text-right">€{l.expectedRevenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right">{l.probability}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Tabella preventivi */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b"><h3 className="font-semibold text-gray-800"><i className="fas fa-file-invoice-dollar mr-2 text-blue-500"></i>Preventivi</h3></div>
          {agentQuotations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Nessun preventivo</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Numero</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Stato</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold">Totale</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {agentQuotations.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-purple-600">{q.number}</td>
                    <td className="px-4 py-3 text-sm">{q.contactName}</td>
                    <td className="px-4 py-3 text-sm">{q.date}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${q.status === 'confirmed' ? 'bg-green-100 text-green-700' : q.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{q.status}</span></td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">€{q.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Statistiche generali */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Agenti Totali</p>
          <p className="text-2xl font-bold text-purple-600">{agents.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Attivi</p>
          <p className="text-2xl font-bold text-green-600">{agents.filter(a => a.active).length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Fatturato Totale</p>
          <p className="text-2xl font-bold text-blue-600">€{invoices.reduce((s, i) => s + i.total, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Pipeline Totale</p>
          <p className="text-2xl font-bold text-orange-600">€{leads.reduce((s, l) => s + l.expectedRevenue * (l.probability / 100), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Header con bottone nuovo agente */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800"><i className="fas fa-user-tie mr-2 text-purple-500"></i>Gestione Agenti</h2>
        <button onClick={() => setShowNew(true)} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
          <i className="fas fa-user-plus mr-2"></i>Nuevo Agente
        </button>
      </div>

      {/* Lista agenti */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => {
          const agentLeads = leads.filter(l => l.agentId === agent.id);
          const agentQuotations = quotations.filter(q => q.agentId === agent.id);
          const agentInvoices = invoices.filter(i => i.agentId === agent.id);
          const agentRevenue = agentInvoices.reduce((s, i) => s + i.total, 0);

          return (
            <div key={agent.id} className="bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">{agent.name.split(' ').map(n => n[0]).join('')}</span>
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
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-lg font-bold text-purple-600">{agentLeads.length}</p>
                  <p className="text-xs text-gray-500">Leads</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-lg font-bold text-blue-600">{agentQuotations.length}</p>
                  <p className="text-xs text-gray-500">Preventivi</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-lg font-bold text-green-600">€{agentRevenue > 0 ? (agentRevenue / 1000).toFixed(0) + 'k' : '0'}</p>
                  <p className="text-xs text-gray-500">Fatturato</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedAgent(agent)} className="flex-1 px-3 py-2 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 font-medium">
                  <i className="fas fa-chart-bar mr-1"></i>Dettaglio
                </button>
                <button onClick={() => setEditingAgent(agent)} className="px-3 py-2 text-xs bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100">
                  <i className="fas fa-edit"></i>
                </button>
                <button onClick={() => handleToggleActive(agent.id)} className={`px-3 py-2 text-xs rounded-lg ${agent.active ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                  <i className={`fas ${agent.active ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                <button onClick={() => handleDelete(agent.id)} className="px-3 py-2 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {agents.length === 0 && (
        <div className="bg-white rounded-xl border p-12 text-center">
          <i className="fas fa-user-tie text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Nessun agente registrato</p>
          <button onClick={() => setShowNew(true)} className="mt-4 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
            <i className="fas fa-user-plus mr-2"></i>Crear Primer Agente
          </button>
        </div>
      )}

      {/* Modal Nuovo Agente */}
      {showNew && <AgentModal onClose={() => setShowNew(false)} onSave={handleCreate} />}

      {/* Modal Modifica Agente */}
      {editingAgent && <AgentModal agent={editingAgent} onClose={() => setEditingAgent(null)} onSave={handleUpdate} />}
    </div>
  );
}

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
          <h2 className="text-lg font-semibold">
            <i className="fas fa-user-tie mr-2 text-purple-500"></i>
            {agent ? 'Editar' : 'Nuevo'} Agente
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ej: Juan Pérez" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ej: juan@empresa.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ej: +34 600 123 456" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="agentActive" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="agentActive" className="text-sm">Agente Activo</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancelar</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
              <i className="fas fa-save mr-2"></i>{agent ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
