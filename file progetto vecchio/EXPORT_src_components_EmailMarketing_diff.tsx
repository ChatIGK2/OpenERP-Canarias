--- EXPORT_src_components_EmailMarketing.tsx (原始)


+++ EXPORT_src_components_EmailMarketing.tsx (修改后)
import { EmailCampaign, LeadEmail, Lead } from '../types';
import { Language } from '../i18n';
export default function EmailMarketing({ campaigns, emails, language }: { campaigns: EmailCampaign[]; setCampaigns: (c: EmailCampaign[]) => void; emails: LeadEmail[]; leads: Lead[]; language: Language }) {
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-gray-500">Emails CRM</p><p className="text-2xl font-bold text-purple-600">{emails.filter(e => e.direction === 'outgoing').length}</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-gray-500">Campañas</p><p className="text-2xl font-bold text-blue-600">{campaigns.length}</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-gray-500">Tasa Apertura</p><p className="text-2xl font-bold text-green-600">{campaigns.length > 0 ? Math.round(campaigns.reduce((s, c) => s + c.openedCount, 0) / campaigns.reduce((s, c) => s + c.sentCount, 0) * 100) : 0}%</p></div>
      </div>
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Campañas Email</h3>
        <div className="grid grid-cols-3 gap-4">{campaigns.map(c => <div key={c.id} className="border rounded-lg p-4"><h4 className="font-medium">{c.name}</h4><p className="text-xs text-gray-500">{c.subject}</p><div className="grid grid-cols-3 gap-2 mt-3"><div className="text-center"><p className="text-lg font-bold text-blue-600">{c.recipients}</p><p className="text-xs text-gray-500">Dest.</p></div><div className="text-center"><p className="text-lg font-bold text-green-600">{c.openedCount}</p><p className="text-xs text-gray-500">Abiertos</p></div><div className="text-center"><p className="text-lg font-bold text-orange-600">{c.clickedCount}</p><p className="text-xs text-gray-500">Clicks</p></div></div></div>)}</div>
      </div>
    </div>
  );
}
