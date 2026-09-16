import React, { useState } from 'react';
import { Invoice, Lead, Quotation, Order, Product, DocCounters } from '../types';
import { 
  Search, Filter, Plus, Edit2, Trash2, Eye, X, Check, 
  FileText, Euro, Calendar, AlertCircle, Download, Send
} from 'lucide-react';

interface InvoicingProps {
  invoices: Invoice[];
  leads: Lead[];
  quotations: Quotation[];
  orders: Order[];
  products: Product[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setStockMoves: (moves: any[]) => void;
  docCounters: DocCounters;
  setDocCounters: React.Dispatch<React.SetStateAction<DocCounters>>;
  language: string;
}

const Invoicing: React.FC<InvoicingProps> = ({
  invoices, leads, quotations, orders, products,
  setInvoices, setProducts, setStockMoves,
  docCounters, setDocCounters, language
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const t: Record<string, any> = {
    es: { title: 'Facturación', newInvoice: 'Nueva Factura', search: 'Buscar...', all: 'Todas', draft: 'Borrador', sent: 'Enviada', paid: 'Pagada', cancelled: 'Cancelada', overdue: 'Vencida' },
    en: { title: 'Invoicing', newInvoice: 'New Invoice', search: 'Search...', all: 'All', draft: 'Draft', sent: 'Sent', paid: 'Paid', cancelled: 'Cancelled', overdue: 'Overdue' },
    it: { title: 'Fatturazione', newInvoice: 'Nuova Fattura', search: 'Cerca...', all: 'Tutte', draft: 'Bozza', sent: 'Inviata', paid: 'Pagata', cancelled: 'Annullata', overdue: 'Scaduta' }
  };
  const lang = t[language] || t.es;

  const filteredInvoices = invoices.filter(invoice => {
    const matchSearch = (invoice.number?.toLowerCase().includes(search.toLowerCase())) ||
                        (invoice.contactName?.toLowerCase().includes(search.toLowerCase())) ||
                        (invoice.contactCompany?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta factura?')) {
      setInvoices(invoices.filter(i => i.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      overdue: 'bg-orange-100 text-orange-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = filteredInvoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{lang.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{invoices.length} facturas totales • {filteredInvoices.length} filtradas</p>
        </div>
        <button
          onClick={() => { setEditingInvoice(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          {lang.newInvoice}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Facturado</p>
          <p className="text-2xl font-bold text-gray-800">€{totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Cobrado</p>
          <p className="text-2xl font-bold text-green-600">€{paidAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Pendiente</p>
          <p className="text-2xl font-bold text-orange-600">€{pendingAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtri */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={lang.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'draft', 'sent', 'paid', 'cancelled', 'overdue'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                statusFilter === status 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {lang[status] || status} ({status === 'all' ? invoices.length : invoices.filter(i => i.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Tabella */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-3">Número</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Vencimiento</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.length > 0 ? filteredInvoices.map((invoice) => {
                const isOverdue = invoice.status !== 'paid' && invoice.dueDate && new Date(invoice.dueDate) < new Date();
                return (
                  <tr key={invoice.id} className={`hover:bg-blue-50/50 transition-colors group ${isOverdue ? 'bg-orange-50' : ''}`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{invoice.number}</td>
                    <td className="px-6 py-4 text-gray-600">{invoice.contactName}</td>
                    <td className="px-6 py-4 text-gray-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-gray-600">{invoice.dueDate || '-'}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">€{invoice.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(isOverdue ? 'overdue' : invoice.status)}`}>
                        {isOverdue ? 'overdue' : invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewingInvoice(invoice)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Ver">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setEditingInvoice(invoice); setShowForm(true); }} className="p-1.5 hover:bg-amber-50 rounded text-amber-600" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(invoice.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-gray-300" />
                      <p>No se encontraron facturas</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dettaglio */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Factura {viewingInvoice.number}
              </h2>
              <button onClick={() => setViewingInvoice(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Cliente</label>
                  <p className="text-gray-900">{viewingInvoice.contactName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Empresa</label>
                  <p className="text-gray-900">{viewingInvoice.contactCompany}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha</label>
                  <p className="text-gray-900">{viewingInvoice.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vencimiento</label>
                  <p className="text-gray-900">{viewingInvoice.dueDate || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total</label>
                  <p className="text-gray-900 font-semibold text-lg">€{viewingInvoice.total.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewingInvoice.status)}`}>
                    {viewingInvoice.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Notas</label>
                <p className="text-gray-900 whitespace-pre-wrap">{viewingInvoice.notes || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoicing;