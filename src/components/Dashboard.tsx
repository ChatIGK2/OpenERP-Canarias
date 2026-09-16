import React from 'react';
import { Lead, Quotation, Invoice, Order, Agent, Product } from '../types';
import {
  TrendingUp, Users, FileText, Package, Truck, Euro,
  ArrowUp, ArrowDown, Activity, BarChart3, PieChart,
  ShoppingCart, FileCheck, AlertCircle, Calendar, Clock
} from 'lucide-react';

interface DashboardProps {
  leads?: Lead[];
  quotations?: Quotation[];
  invoices?: Invoice[];
  history?: any[];
  agents?: Agent[];
  orders?: Order[];
  products?: Product[];
  language: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  leads = [],
  quotations = [],
  invoices = [],
  history = [],
  agents = [],
  orders = [],
  products = [],
  language
}) => {
  const t: Record<string, any> = {
    es: {
      title: 'Panel de Control',
      totalLeads: 'Total Contactos',
      totalQuotations: 'Presupuestos',
      totalInvoices: 'Facturas',
      totalOrders: 'Pedidos',
      totalProducts: 'Productos',
      totalAgents: 'Agentes',
      revenue: 'Ingresos',
      pending: 'Pendientes',
      recentActivity: 'Actividad Reciente',
      topProducts: 'Productos Más Vendidos',
      noData: 'Sin datos'
    },
    en: {
      title: 'Dashboard',
      totalLeads: 'Total Contacts',
      totalQuotations: 'Quotations',
      totalInvoices: 'Invoices',
      totalOrders: 'Orders',
      totalProducts: 'Products',
      totalAgents: 'Agents',
      revenue: 'Revenue',
      pending: 'Pending',
      recentActivity: 'Recent Activity',
      topProducts: 'Top Products',
      noData: 'No data'
    },
    it: {
      title: 'Dashboard',
      totalLeads: 'Totale Contatti',
      totalQuotations: 'Preventivi',
      totalInvoices: 'Fatture',
      totalOrders: 'Ordini',
      totalProducts: 'Prodotti',
      totalAgents: 'Agenti',
      revenue: 'Fatturato',
      pending: 'In Attesa',
      recentActivity: 'Attività Recente',
      topProducts: 'Prodotti Più Venduti',
      noData: 'Nessun dato'
    }
  };
  const lang = t[language] || t.es;

  const totalRevenue = invoices
    .filter(i => i.type === 'out_invoice')
    .reduce((sum, i) => sum + i.total, 0);

  const pendingInvoices = invoices.filter(i => i.status === 'draft' || i.status === 'sent').length;
  const pendingOrders = orders.filter(o => o.status === 'draft' || o.status === 'confirmed').length;

  const kpis = [
    { label: lang.totalLeads, value: leads.length, icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { label: lang.totalQuotations, value: quotations.length, icon: FileText, color: 'bg-purple-500', trend: '+8%' },
    { label: lang.totalOrders, value: orders.length, icon: ShoppingCart, color: 'bg-green-500', trend: '+15%' },
    { label: lang.totalInvoices, value: invoices.length, icon: FileCheck, color: 'bg-orange-500', trend: '+5%' },
    { label: lang.revenue, value: `€${totalRevenue.toLocaleString()}`, icon: Euro, color: 'bg-emerald-500', trend: '+20%' },
    { label: lang.totalProducts, value: products.length, icon: Package, color: 'bg-cyan-500', trend: '+3%' },
  ];

  const recentActivities = (history || []).slice(0, 5).map((activity: any, index: number) => ({
    id: index,
    action: activity.action || 'Sin acción',
    target: activity.target || 'N/A',
    user: activity.user || 'Sistema',
    date: activity.date || new Date().toISOString().split('T')[0],
    icon: Activity
  }));

  const topProducts = (products || [])
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map((p, index) => ({
      id: index,
      name: p.name,
      stock: p.stock,
      category: p.category,
      icon: Package
    }));

  const recentOrders = (orders || []).slice(0, 5).map((o, index) => ({
    id: index,
    number: o.number,
    customer: o.contactName,
    total: o.total,
    status: o.status,
    date: o.date,
    icon: ShoppingCart
  }));

  const recentInvoices = (invoices || []).slice(0, 5).map((i, index) => ({
    id: index,
    number: i.number,
    customer: i.contactName,
    total: i.total,
    status: i.status,
    dueDate: i.dueDate,
    icon: FileText
  }));

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      confirmed: 'bg-indigo-100 text-indigo-700',
      paid: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      shipped: 'bg-purple-100 text-purple-700',
      completed: 'bg-emerald-100 text-emerald-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{lang.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general del sistema</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  {kpi.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 text-sm">Facturas Pendientes</h3>
            <p className="text-2xl font-bold text-amber-900 mt-1">{pendingInvoices}</p>
            <p className="text-xs text-amber-700 mt-1">Requieren atención</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 text-sm">Pedidos en Proceso</h3>
            <p className="text-2xl font-bold text-blue-900 mt-1">{pendingOrders}</p>
            <p className="text-xs text-blue-700 mt-1">Pendientes de envío</p>
          </div>
        </div>
      </div>

      {/* Gráficos y Tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              {lang.recentActivity}
            </h3>
          </div>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.target}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.user} • {activity.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{lang.noData}</p>
            </div>
          )}
        </div>

        {/* Top Productos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              {lang.topProducts}
            </h3>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product) => {
                const Icon = product.icon;
                return (
                  <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">{product.stock}</p>
                      <p className="text-xs text-gray-500">uds</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{lang.noData}</p>
            </div>
          )}
        </div>
      </div>

      {/* Pedidos Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-green-500" />
            Pedidos Recientes
          </h3>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Número</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{order.number}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.customer}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-gray-800">€{order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{lang.noData}</p>
          </div>
        )}
      </div>

      {/* Facturas Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            Facturas Recientes
          </h3>
        </div>
        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Número</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Vencimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{invoice.number}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{invoice.customer}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-gray-800">€{invoice.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{invoice.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{lang.noData}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;