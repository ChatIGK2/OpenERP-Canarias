--- EXPORT_src_components_Orders.tsx (原始)


+++ EXPORT_src_components_Orders.tsx (修改后)
import { useState } from 'react';
import { Order, Lead, Quotation } from '../types';
import { Language } from '../i18n';

interface OrdersProps {
  orders: Order[];
  leads: Lead[];
  quotations: Quotation[];
  setOrders: (o: Order[]) => void;
  language: Language;
}

export default function Orders({ orders, leads, quotations, setOrders, language }: OrdersProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = orders.filter(o => {
    const matchSearch = o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.contactName.toLowerCase().includes(search.toLowerCase()) ||
      o.contactCompany.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValue = orders.reduce((s, o) => s + o.total, 0);
  const confirmedValue = orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + o.total, 0);
  const completedValue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-6 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Ordini Totali</p>
          <p className="text-2xl font-bold text-amber-600">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Valore Totale</p>
          <p className="text-2xl font-bold text-blue-600">€{totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Confermati</p>
          <p className="text-2xl font-bold text-green-600">€{confirmedValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Completati</p>
          <p className="text-2xl font-bold text-purple-600">€{completedValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filtri */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 text-sm rounded-lg ${statusFilter === 'all' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`}>Tutti ({orders.length})</button>
          <button onClick={() => setStatusFilter('draft')} className={`px-4 py-2 text-sm rounded-lg ${statusFilter === 'draft' ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Bozza ({orders.filter(o => o.status === 'draft').length})</button>
          <button onClick={() => setStatusFilter('confirmed')} className={`px-4 py-2 text-sm rounded-lg ${statusFilter === 'confirmed' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>Confermati ({orders.filter(o => o.status === 'confirmed').length})</button>
          <button onClick={() => setStatusFilter('shipped')} className={`px-4 py-2 text-sm rounded-lg ${statusFilter === 'shipped' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>Spediti ({orders.filter(o => o.status === 'shipped').length})</button>
          <button onClick={() => setStatusFilter('completed')} className={`px-4 py-2 text-sm rounded-lg ${statusFilter === 'completed' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>Completati ({orders.filter(o => o.status === 'completed').length})</button>
        </div>
        <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
      </div>

      {/* Tabella */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold">Numero</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Cliente</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Consegna</th>
              <th className="text-center px-4 py-3 text-xs font-semibold">Stato</th>
              <th className="text-right px-4 py-3 text-xs font-semibold">Totale</th>
              <th className="text-center px-4 py-3 text-xs font-semibold">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Nessun ordine trovato</td></tr>
            ) : filtered.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-amber-600">{o.number}</td>
                <td className="px-4 py-3 text-sm">{o.contactName}{o.contactCompany ? ` - ${o.contactCompany}` : ''}</td>
                <td className="px-4 py-3 text-sm">{o.date}</td>
                <td className="px-4 py-3 text-sm">{o.deliveryDate}</td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={o.status}
                    onChange={(e) => setOrders(orders.map(x => x.id === o.id ? { ...x, status: e.target.value as any } : x))}
                    className={`text-xs px-2 py-1 rounded-full border-0 ${
                      o.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      o.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                      o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <option value="draft">Bozza</option>
                    <option value="confirmed">Confermato</option>
                    <option value="shipped">Spedito</option>
                    <option value="completed">Completato</option>
                    <option value="cancelled">Annullato</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold">€{o.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs text-gray-500">{o.lines.length} righe</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
