import React, { useState } from 'react';
import { Order, Lead, Quotation } from '../types';
import { 
  Search, Filter, Plus, Edit2, Trash2, Eye, X, Check, 
  Truck, Package, FileText, Calendar, Euro, User
} from 'lucide-react';

interface OrdersProps {
  orders: Order[];
  leads: Lead[];
  quotations: Quotation[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  language: string;
}

const Orders: React.FC<OrdersProps> = ({ orders, leads, quotations, setOrders, language }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const t: Record<string, any> = {
    es: { title: 'Pedidos', newOrder: 'Nuevo Pedido', search: 'Buscar...', all: 'Todos', draft: 'Borrador', confirmed: 'Confirmado', shipped: 'Enviado', completed: 'Completado', cancelled: 'Cancelado' },
    en: { title: 'Orders', newOrder: 'New Order', search: 'Search...', all: 'All', draft: 'Draft', confirmed: 'Confirmed', shipped: 'Shipped', completed: 'Completed', cancelled: 'Cancelled' },
    it: { title: 'Ordini', newOrder: 'Nuovo Ordine', search: 'Cerca...', all: 'Tutti', draft: 'Bozza', confirmed: 'Confermato', shipped: 'Spedito', completed: 'Completato', cancelled: 'Annullato' }
  };
  const lang = t[language] || t.es;

  const filteredOrders = orders.filter(order => {
    const matchSearch = (order.number?.toLowerCase().includes(search.toLowerCase())) ||
                        (order.contactName?.toLowerCase().includes(search.toLowerCase())) ||
                        (order.contactCompany?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este pedido?')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
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
          <p className="text-sm text-gray-500 mt-1">{orders.length} pedidos totales • {filteredOrders.length} filtrados</p>
        </div>
        <button
          onClick={() => { setEditingOrder(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          {lang.newOrder}
        </button>
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
          {['all', 'draft', 'confirmed', 'shipped', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                statusFilter === status 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {lang[status] || status} ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
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
                <th className="px-6 py-3">Entrega</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const lead = leads.find(l => l.id === order.leadId);
                return (
                  <tr key={order.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.number}</td>
                    <td className="px-6 py-4 text-gray-600">{order.contactName}</td>
                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 text-gray-600">{order.deliveryDate || '-'}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">€{order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewingOrder(order)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Ver">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setEditingOrder(order); setShowForm(true); }} className="p-1.5 hover:bg-amber-50 rounded text-amber-600" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(order.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Eliminar">
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
                      <Package className="w-8 h-8 text-gray-300" />
                      <p>No se encontraron pedidos</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dettaglio */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Pedido {viewingOrder.number}
              </h2>
              <button onClick={() => setViewingOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Cliente</label>
                  <p className="text-gray-900">{viewingOrder.contactName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Empresa</label>
                  <p className="text-gray-900">{viewingOrder.contactCompany}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha</label>
                  <p className="text-gray-900">{viewingOrder.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Entrega</label>
                  <p className="text-gray-900">{viewingOrder.deliveryDate || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total</label>
                  <p className="text-gray-900 font-semibold">€{viewingOrder.total.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewingOrder.status)}`}>
                    {viewingOrder.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Dirección de Envío</label>
                <p className="text-gray-900">{viewingOrder.shippingAddress || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Notas</label>
                <p className="text-gray-900 whitespace-pre-wrap">{viewingOrder.notes || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;