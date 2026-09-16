--- EXPORT_src_components_SalesActivity.tsx (原始)


+++ EXPORT_src_components_SalesActivity.tsx (修改后)
import { useState } from 'react';
import { Lead, SalesActivity as SalesActivityType, Agent } from '../types';
import { currentUser } from '../data';

interface SalesActivityProps {
  lead: Lead;
  agents: Agent[];
  onUpdateLead: (lead: Lead) => void;
}

export default function SalesActivity({ lead, agents, onUpdateLead }: SalesActivityProps) {
  const [showNewActivity, setShowNewActivity] = useState(false);
  const [filter, setFilter] = useState<'all' | 'planned' | 'completed'>('all');
  const [newActivity, setNewActivity] = useState<Partial<SalesActivityType>>({
    type: 'call',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: 30,
    status: 'planned',
    priority: 'medium',
  });

  const activities = lead.salesActivities || [];
  const filteredActivities = activities.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCreateActivity = () => {
    if (!newActivity.title || !newActivity.date) {
      alert('Compila almeno titolo e data');
      return;
    }

    const activity: SalesActivityType = {
      id: `act${Date.now()}`,
      leadId: lead.id,
      agentId: lead.agentId,
      type: newActivity.type as SalesActivityType['type'],
      title: newActivity.title || '',
      description: newActivity.description || '',
      date: newActivity.date || '',
      time: newActivity.time,
      duration: newActivity.duration,
      status: newActivity.status as SalesActivityType['status'],
      priority: newActivity.priority as SalesActivityType['priority'],
      createdAt: new Date().toISOString(),
      createdBy: currentUser,
    };

    const updatedLead = {
      ...lead,
      salesActivities: [...(lead.salesActivities || []), activity],
    };

    onUpdateLead(updatedLead);
    setShowNewActivity(false);
    setNewActivity({
      type: 'call',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      duration: 30,
      status: 'planned',
      priority: 'medium',
    });
  };

  const handleStatusChange = (activityId: string, newStatus: SalesActivityType['status']) => {
    const updatedActivities = (lead.salesActivities || []).map(a =>
      a.id === activityId ? { ...a, status: newStatus } : a
    );
    onUpdateLead({ ...lead, salesActivities: updatedActivities });
  };

  const handleDelete = (activityId: string) => {
    if (!confirm('Eliminare questa attività?')) return;
    const updatedActivities = (lead.salesActivities || []).filter(a => a.id !== activityId);
    onUpdateLead({ ...lead, salesActivities: updatedActivities });
  };

  const getActivityIcon = (type: SalesActivityType['type']) => {
    switch (type) {
      case 'call': return 'fa-phone text-blue-500';
      case 'email': return 'fa-envelope text-purple-500';
      case 'note': return 'fa-sticky-note text-yellow-500';
      case 'reminder': return 'fa-bell text-orange-500';
      case 'meeting': return 'fa-calendar-check text-green-500';
      case 'visit': return 'fa-map-marker-alt text-red-500';
      default: return 'fa-circle text-gray-500';
    }
  };

  const getActivityLabel = (type: SalesActivityType['type']) => {
    switch (type) {
      case 'call': return 'Chiamata';
      case 'email': return 'Email';
      case 'note': return 'Nota';
      case 'reminder': return 'Promemoria';
      case 'meeting': return 'Riunione';
      case 'visit': return 'Visita';
      default: return type;
    }
  };

  const getPriorityColor = (priority: SalesActivityType['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: activities.length,
    planned: activities.filter(a => a.status === 'planned').length,
    completed: activities.filter(a => a.status === 'completed').length,
    calls: activities.filter(a => a.type === 'call').length,
    emails: activities.filter(a => a.type === 'email').length,
    meetings: activities.filter(a => a.type === 'meeting' || a.type === 'visit').length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">
          <i className="fas fa-tasks mr-2 text-sky-600"></i>
          Pro Vendita
        </h3>
        <button
          onClick={() => setShowNewActivity(true)}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm rounded-lg hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-md"
        >
          <i className="fas fa-plus mr-2"></i>Nuova Attività
        </button>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white rounded-lg border border-sky-100 p-3">
          <p className="text-xs text-gray-500">Totale</p>
          <p className="text-2xl font-bold text-sky-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-emerald-100 p-3">
          <p className="text-xs text-gray-500">Pianificate</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.planned}</p>
        </div>
        <div className="bg-white rounded-lg border border-green-100 p-3">
          <p className="text-xs text-gray-500">Completate</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg border border-blue-100 p-3">
          <p className="text-xs text-gray-500">Chiamate</p>
          <p className="text-2xl font-bold text-blue-600">{stats.calls}</p>
        </div>
        <div className="bg-white rounded-lg border border-purple-100 p-3">
          <p className="text-xs text-gray-500">Email</p>
          <p className="text-2xl font-bold text-purple-600">{stats.emails}</p>
        </div>
        <div className="bg-white rounded-lg border border-red-100 p-3">
          <p className="text-xs text-gray-500">Incontri</p>
          <p className="text-2xl font-bold text-red-600">{stats.meetings}</p>
        </div>
      </div>

      {/* Filtri */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
            filter === 'all'
              ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tutte ({activities.length})
        </button>
        <button
          onClick={() => setFilter('planned')}
          className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
            filter === 'planned'
              ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pianificate ({stats.planned})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
            filter === 'completed'
              ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completate ({stats.completed})
        </button>
      </div>

      {/* Lista Attività */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <i className="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500">Nessuna attività trovata</p>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <div
              key={activity.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <i className={`fas ${getActivityIcon(activity.type)} text-2xl`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      <p className="text-xs text-gray-500">
                        {getActivityLabel(activity.type)} • {new Date(activity.date).toLocaleDateString('it-IT')}
                        {activity.time && ` alle ${activity.time}`}
                        {activity.duration && ` (${activity.duration} min)`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(activity.priority)}`}>
                        {activity.priority === 'high' ? 'Alta' : activity.priority === 'medium' ? 'Media' : 'Bassa'}
                      </span>
                      <select
                        value={activity.status}
                        onChange={(e) => handleStatusChange(activity.id, e.target.value as SalesActivityType['status'])}
                        className={`text-xs px-2 py-1 rounded-full border-0 ${
                          activity.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : activity.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        <option value="planned">Pianificata</option>
                        <option value="completed">Completata</option>
                        <option value="cancelled">Annullata</option>
                      </select>
                    </div>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Creata da {activity.createdBy} il {new Date(activity.createdAt).toLocaleDateString('it-IT')}
                    </p>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nuova Attività */}
      {showNewActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                <i className="fas fa-plus-circle mr-2 text-sky-600"></i>Nuova Attività
              </h2>
              <button onClick={() => setShowNewActivity(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo Attività *</label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as SalesActivityType['type'] })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="call">Chiamata</option>
                  <option value="email">Email</option>
                  <option value="note">Nota</option>
                  <option value="reminder">Promemoria</option>
                  <option value="meeting">Riunione</option>
                  <option value="visit">Visita</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Titolo *</label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Es: Chiamata di follow-up"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrizione</label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Dettagli dell'attività..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Data *</label>
                  <input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ora</label>
                  <input
                    type="time"
                    value={newActivity.time}
                    onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Durata (minuti)</label>
                  <input
                    type="number"
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity({ ...newActivity, duration: parseInt(e.target.value) || 0 })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priorità</label>
                  <select
                    value={newActivity.priority}
                    onChange={(e) => setNewActivity({ ...newActivity, priority: e.target.value as SalesActivityType['priority'] })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="low">Bassa</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowNewActivity(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Annulla
                </button>
                <button
                  onClick={handleCreateActivity}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm rounded-lg hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-md"
                >
                  <i className="fas fa-save mr-2"></i>Crea Attività
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
