--- EXPORT_src_components_WeeklyPlanner.tsx (原始)


+++ EXPORT_src_components_WeeklyPlanner.tsx (修改后)
import { useState } from 'react';
import { Lead, SalesActivity, Agent } from '../types';

interface WeeklyPlannerProps {
  leads: Lead[];
  agents: Agent[];
  currentAgentId: string;
}

export default function WeeklyPlanner({ leads, agents, currentAgentId }: WeeklyPlannerProps) {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = questa settimana, 1 = prossima, -1 = scorsa
  const [selectedAgent, setSelectedAgent] = useState(currentAgentId);

  // Calcola i giorni della settimana
  const getWeekDays = (weekOffset: number) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(selectedWeek);

  // Filtra lead per agente
  const agentLeads = leads.filter(l => l.agentId === selectedAgent);

  // Raccogli tutte le attività della settimana
  const getActivitiesForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const activities: Array<SalesActivity & { leadName: string; leadCompany: string }> = [];

    agentLeads.forEach(lead => {
      (lead.salesActivities || []).forEach(activity => {
        if (activity.date === dateStr) {
          activities.push({
            ...activity,
            leadName: lead.name,
            leadCompany: lead.company,
          });
        }
      });
    });

    return activities.sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return 0;
    });
  };

  const getActivityIcon = (type: SalesActivity['type']) => {
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

  const getWeekLabel = () => {
    if (selectedWeek === 0) return 'Questa Settimana';
    if (selectedWeek === 1) return 'Prossima Settimana';
    if (selectedWeek === -1) return 'Settimana Scorsa';
    return `Settimana ${selectedWeek > 0 ? '+' : ''}${selectedWeek}`;
  };

  const totalActivities = weekDays.reduce((sum, day) => sum + getActivitiesForDay(day).length, 0);
  const selectedAgentInfo = agents.find(a => a.id === selectedAgent);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              <i className="fas fa-calendar-week mr-2"></i>
              Piano di Lavoro Settimanale
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedAgentInfo?.name || 'Agente'} - {getWeekLabel()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="border-2 border-sky-200 rounded-xl px-4 py-2 text-sm focus:border-sky-400"
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigazione settimane */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedWeek(selectedWeek - 1)}
            className="px-4 py-2 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-all duration-200"
          >
            <i className="fas fa-chevron-left mr-2"></i>Settimana Precedente
          </button>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">{getWeekLabel()}</p>
            <p className="text-xs text-gray-500">
              {weekDays[0].toLocaleDateString('it-IT')} - {weekDays[6].toLocaleDateString('it-IT')}
            </p>
          </div>
          <button
            onClick={() => setSelectedWeek(selectedWeek + 1)}
            className="px-4 py-2 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-all duration-200"
          >
            Settimana Successiva<i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>

      {/* Statistiche settimana */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-sky-100">
          <p className="text-xs text-gray-500">Totale Attività</p>
          <p className="text-2xl font-bold text-sky-600">{totalActivities}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-emerald-100">
          <p className="text-xs text-gray-500">Contatti Gestiti</p>
          <p className="text-2xl font-bold text-emerald-600">{agentLeads.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-blue-100">
          <p className="text-xs text-gray-500">Chiamate</p>
          <p className="text-2xl font-bold text-blue-600">
            {weekDays.reduce((sum, day) => sum + getActivitiesForDay(day).filter(a => a.type === 'call').length, 0)}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-red-100">
          <p className="text-xs text-gray-500">Incontri</p>
          <p className="text-2xl font-bold text-red-600">
            {weekDays.reduce((sum, day) => sum + getActivitiesForDay(day).filter(a => a.type === 'meeting' || a.type === 'visit').length, 0)}
          </p>
        </div>
      </div>

      {/* Calendario settimanale */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const activities = getActivitiesForDay(day);
          const isToday = day.toDateString() === new Date().toDateString();
          const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

          return (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
                isToday ? 'border-sky-500' : 'border-gray-100'
              }`}
            >
              {/* Header giorno */}
              <div className={`p-3 ${isToday ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold ${isToday ? 'text-white/80' : 'text-gray-500'}`}>
                  {dayNames[index]}
                </p>
                <p className={`text-2xl font-bold ${isToday ? 'text-white' : 'text-gray-800'}`}>
                  {day.getDate()}
                </p>
                <p className={`text-xs ${isToday ? 'text-white/80' : 'text-gray-500'}`}>
                  {activities.length} attività
                </p>
              </div>

              {/* Lista attività */}
              <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">Nessuna attività</p>
                ) : (
                  activities.map(activity => (
                    <div
                      key={activity.id}
                      className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="flex items-start gap-2">
                        <i className={`fas ${getActivityIcon(activity.type)} text-sm mt-0.5`}></i>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {activity.leadName}
                          </p>
                          {activity.time && (
                            <p className="text-[10px] text-sky-600 font-medium">
                              {activity.time}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
