import { useState } from 'react';
import { EmailCampaign, LeadEmail, Lead } from '../types';
import { Language } from '../i18n';
import { Mail, Send, Eye, MousePointer, Plus, BarChart3, TrendingUp } from 'lucide-react';

interface EmailMarketingProps {
  campaigns: EmailCampaign[];
  setCampaigns: (c: EmailCampaign[]) => void;
  emails: LeadEmail[];
  leads: Lead[];
  language: Language;
}

export default function EmailMarketing({ campaigns, setCampaigns, emails, leads, language }: EmailMarketingProps) {
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');

  const t: Record<string, any> = {
    es: { title: 'Email Marketing', emails: 'Emails CRM', campaigns: 'Campañas', openRate: 'Tasa Apertura', newCampaign: 'Nueva Campaña', recipients: 'Destinatarios', opened: 'Abiertos', clicks: 'Clics', noCampaigns: 'Sin campañas' },
    en: { title: 'Email Marketing', emails: 'CRM Emails', campaigns: 'Campaigns', openRate: 'Open Rate', newCampaign: 'New Campaign', recipients: 'Recipients', opened: 'Opened', clicks: 'Clicks', noCampaigns: 'No campaigns' },
    it: { title: 'Email Marketing', emails: 'Email CRM', campaigns: 'Campagne', openRate: 'Tasso Apertura', newCampaign: 'Nuova Campagna', recipients: 'Destinatari', opened: 'Aperte', clicks: 'Click', noCampaigns: 'Nessuna campagna' }
  };
  const lang = t[language] || t.es;

  const outgoingEmails = emails.filter(e => e.direction === 'outgoing').length;
  const totalSent = campaigns.reduce((s, c) => s + c.sentCount, 0);
  const totalOpened = campaigns.reduce((s, c) => s + c.openedCount, 0);
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  const handleCreateCampaign = () => {
    if (!newName || !newSubject) {
      alert('Nome e oggetto sono obbligatori');
      return;
    }
    const newCampaign: EmailCampaign = {
      id: `camp${Date.now()}`,
      name: newName,
      subject: newSubject,
      content: newContent,
      recipients: leads.length,
      status: 'draft',
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCampaigns([...campaigns, newCampaign]);
    setNewName('');
    setNewSubject('');
    setNewContent('');
    setShowNew(false);
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-green-100 text-green-700',
      scheduled: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{lang.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Gestione campagne email e comunicazioni</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          {lang.newCampaign}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">{lang.emails}</p>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600">{outgoingEmails}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">{lang.campaigns}</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">{campaigns.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">{lang.openRate}</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{openRate}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Click Totali</p>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600">{campaigns.reduce((s, c) => s + c.clickedCount, 0)}</p>
        </div>
      </div>

      {/* Lista Campagne */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Campagne Email</h3>
          <span className="text-xs text-gray-500 ml-2">({campaigns.length})</span>
        </div>
        {campaigns.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{lang.noCampaigns}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {campaigns.map(c => (
              <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800 flex-1">{c.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{c.subject}</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{c.recipients}</p>
                    <p className="text-xs text-gray-500">{lang.recipients}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{c.openedCount}</p>
                    <p className="text-xs text-gray-500">{lang.opened}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-600">{c.clickedCount}</p>
                    <p className="text-xs text-gray-500">{lang.clicks}</p>
                  </div>
                </div>
                {c.sentCount > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>Inviati: {c.sentCount}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Nuova Campagna */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                {lang.newCampaign}
              </h2>
              <button onClick={() => setShowNew(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Campagna *</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Es: Newsletter Settembre" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Oggetto Email *</label>
                <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Es: Novità del mese" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contenuto</label>
                <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Testo dell'email..." />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                <Mail className="w-4 h-4 inline mr-1" />
                Destinatari: {leads.length} contatti disponibili
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-gray-600">Annulla</button>
                <button onClick={handleCreateCampaign} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                  Crea Campagna
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}