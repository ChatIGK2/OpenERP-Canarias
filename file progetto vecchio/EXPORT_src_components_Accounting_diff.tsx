--- EXPORT_src_components_Accounting.tsx (原始)


+++ EXPORT_src_components_Accounting.tsx (修改后)
import { JournalEntry, Invoice } from '../types';
import { Language } from '../i18n';
export default function Accounting({ journalEntries, invoices, language }: { journalEntries: JournalEntry[]; invoices: Invoice[]; language: Language }) {
  const revenue = invoices.filter(i => i.type === 'out_invoice').reduce((s, i) => s + i.total, 0);
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-gray-500">Ingresos</p><p className="text-2xl font-bold text-green-600">€{revenue.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-gray-500">Total Debe</p><p className="text-2xl font-bold text-blue-600">€{journalEntries.reduce((s, e) => s + e.debit, 0).toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-gray-500">Total Haber</p><p className="text-2xl font-bold text-orange-600">€{journalEntries.reduce((s, e) => s + e.credit, 0).toLocaleString()}</p></div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 text-xs font-semibold">Fecha</th><th className="text-left px-4 py-3 text-xs font-semibold">Referencia</th><th className="text-left px-4 py-3 text-xs font-semibold">Cuenta</th><th className="text-right px-4 py-3 text-xs font-semibold">Debe</th><th className="text-right px-4 py-3 text-xs font-semibold">Haber</th></tr></thead>
          <tbody className="divide-y">{journalEntries.map(e => <tr key={e.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm">{e.date}</td><td className="px-4 py-3 text-sm font-medium text-purple-600">{e.reference}</td><td className="px-4 py-3 text-sm">{e.account}</td><td className="px-4 py-3 text-sm text-right text-blue-600">{e.debit > 0 ? `€${e.debit.toFixed(2)}` : ''}</td><td className="px-4 py-3 text-sm text-right text-orange-600">{e.credit > 0 ? `€${e.credit.toFixed(2)}` : ''}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
