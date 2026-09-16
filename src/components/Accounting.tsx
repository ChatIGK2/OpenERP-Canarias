import { JournalEntry, Invoice } from '../types';
import { Language } from '../i18n';
import { Calculator, TrendingUp, TrendingDown, FileText } from 'lucide-react';

interface AccountingProps {
  journalEntries: JournalEntry[];
  invoices: Invoice[];
  language: Language;
}

export default function Accounting({ journalEntries, invoices, language }: AccountingProps) {
  const revenue = invoices.filter(i => i.type === 'out_invoice').reduce((s, i) => s + i.total, 0);
  const totalDebit = journalEntries.reduce((s, e) => s + e.debit, 0);
  const totalCredit = journalEntries.reduce((s, e) => s + e.credit, 0);

  const t: Record<string, any> = {
    es: { title: 'Contabilidad', revenue: 'Ingresos', debit: 'Total Debe', credit: 'Total Haber', date: 'Fecha', reference: 'Referencia', account: 'Cuenta', noEntries: 'Sin asientos contables' },
    en: { title: 'Accounting', revenue: 'Revenue', debit: 'Total Debit', credit: 'Total Credit', date: 'Date', reference: 'Reference', account: 'Account', noEntries: 'No journal entries' },
    it: { title: 'Contabilità', revenue: 'Fatturato', debit: 'Totale Dare', credit: 'Totale Avere', date: 'Data', reference: 'Riferimento', account: 'Conto', noEntries: 'Nessuna scrittura contabile' }
  };
  const lang = t[language] || t.es;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{lang.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen contable del sistema</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">{lang.revenue}</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">€{revenue.toLocaleString('it-ES', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">{lang.debit}</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">€{totalDebit.toLocaleString('it-ES', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">{lang.credit}</p>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600">€{totalCredit.toLocaleString('it-ES', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Tabella Scritture Contabili */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Libro Giornale</h3>
          <span className="text-xs text-gray-500 ml-2">({journalEntries.length} scritture)</span>
        </div>
        {journalEntries.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{lang.noEntries}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.date}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.reference}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{lang.account}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Descrizione</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Dare</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Avere</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {journalEntries.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{e.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-purple-600 font-mono">{e.reference}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{e.account}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{e.description}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
                      {e.debit > 0 ? `€${e.debit.toFixed(2)}` : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-orange-600">
                      {e.credit > 0 ? `€${e.credit.toFixed(2)}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bilancio di verifica */}
      {journalEntries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Bilancio di verifica:</span>
            <div className="flex gap-4">
              <span className={`text-sm font-bold ${Math.abs(totalDebit - totalCredit) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(totalDebit - totalCredit) < 0.01 ? '✓ In equilibrio' : '✗ Fuori bilancio'}
              </span>
              <span className="text-sm text-gray-600">
                Differenza: €{Math.abs(totalDebit - totalCredit).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}