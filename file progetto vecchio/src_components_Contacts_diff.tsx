--- src/components/Contacts.tsx (原始)
import React, { useState } from 'react';
import { Lead, User } from '../types';
import { Plus, Search, Edit2, Trash2, Eye, X, Filter } from 'lucide-react';
import { generateId, formatDate } from '../utils/security';
import { logAudit } from '../utils/security';

interface ContactsProps {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  user: User;
}

const Contacts: React.FC<ContactsProps> = ({ leads, setLeads, user }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'private' | 'company'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'prospect'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'billing' | 'shipping' | 'notes'>('general');

  const emptyLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
    type: 'private', firstName: '', lastName: '', companyName: '',
    email: '', phone: '', mobile: '', fiscalCode: '', vatNumber: '',
    sdiCode: '', pec: '',
    billingStreet: '', billingCity: '', billingZip: '', billingProvince: '', billingCountry: 'España',
    shippingStreet: '', shippingCity: '', shippingZip: '', shippingProvince: '', shippingCountry: 'España',
    notes: '', tags: [], status: 'active'
  };

  const [formData, setFormData] = useState(emptyLead);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = `${lead.firstName} ${lead.lastName} ${lead.companyName || ''} ${lead.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || lead.type === filterType;
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const g = (field: string) => (formData as Record<string, unknown>)[field] as string;
  const set = (field: string, value: string | string[]) => setFormData({ ...formData, [field]: value });

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Nombre, apellidos y email son obligatorios');
      return;
    }

    if (editingLead) {
      const updated = leads.map(l => l.id === editingLead.id ? { ...l, ...formData, updatedAt: new Date().toISOString() } : l);
      setLeads(updated);
      logAudit(user.id, user.name, 'UPDATE', 'Lead', editingLead.id, `Actualizado: ${formData.firstName} ${formData.lastName}`);
    } else {
      const newLead: Lead = {
        ...formData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLeads([...leads, newLead]);
      logAudit(user.id, user.name, 'CREATE', 'Lead', newLead.id, `Creado: ${formData.firstName} ${formData.lastName}`);
    }
    setShowForm(false);
    setEditingLead(null);
    setFormData(emptyLead);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData(lead);
    setShowForm(true);
    setActiveTab('general');
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este contacto?')) {
      setLeads(leads.filter(l => l.id !== id));
      logAudit(user.id, user.name, 'DELETE', 'Lead', id, 'Contacto eliminado');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = { active: 'badge-green', inactive: 'badge-red', prospect: 'badge-yellow' };
    return <span className={`badge ${colors[status] || 'badge-gray'}`}>{status}</span>;
  };

  if (viewingLead) {
    const fullBillingAddress = `${viewingLead.billingStreet}, ${viewingLead.billingCity} ${viewingLead.billingZip}, ${viewingLead.billingProvince}, ${viewingLead.billingCountry}`;
    const fullShippingAddress = `${viewingLead.shippingStreet}, ${viewingLead.shippingCity} ${viewingLead.shippingZip}, ${viewingLead.shippingProvince}, ${viewingLead.shippingCountry}`;

    return (
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{viewingLead.firstName} {viewingLead.lastName}</h2>
          <button onClick={() => setViewingLead(null)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {(['general', 'billing', 'shipping', 'notes'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'general' ? 'General' : tab === 'billing' ? 'Facturación' : tab === 'shipping' ? 'Envío' : 'Notas'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500">Tipo</label><p className="font-medium">{viewingLead.type === 'company' ? 'Empresa' : 'Particular'}</p></div>
                <div><label className="text-xs text-gray-500">Estado</label><div className="mt-1">{getStatusBadge(viewingLead.status)}</div></div>
                {viewingLead.companyName && <div><label className="text-xs text-gray-500">Empresa</label><p className="font-medium">{viewingLead.companyName}</p></div>}
                <div><label className="text-xs text-gray-500">Email</label><p className="font-medium">{viewingLead.email}</p></div>
                <div><label className="text-xs text-gray-500">Teléfono</label><p className="font-medium">{viewingLead.phone}</p></div>
                {viewingLead.mobile && <div><label className="text-xs text-gray-500">Móvil</label><p className="font-medium">{viewingLead.mobile}</p></div>}
                {viewingLead.fiscalCode && <div><label className="text-xs text-gray-500">NIF/CIF</label><p className="font-medium">{viewingLead.fiscalCode}</p></div>}
                {viewingLead.vatNumber && <div><label className="text-xs text-gray-500">NIF-IVA</label><p className="font-medium">{viewingLead.vatNumber}</p></div>}
                {viewingLead.sdiCode && <div><label className="text-xs text-gray-500">Código SDI</label><p className="font-medium">{viewingLead.sdiCode}</p></div>}
                {viewingLead.pec && <div><label className="text-xs text-gray-500">PEC</label><p className="font-medium">{viewingLead.pec}</p></div>}
                <div><label className="text-xs text-gray-500">Creado</label><p className="font-medium">{formatDate(viewingLead.createdAt)}</p></div>
                <div><label className="text-xs text-gray-500">Actualizado</label><p className="font-medium">{formatDate(viewingLead.updatedAt)}</p></div>
              </div>
            )}
            {activeTab === 'billing' && (
              <div className="space-y-3">
                <p className="font-medium text-gray-800">{fullBillingAddress}</p>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <p className="font-medium text-gray-800">{fullShippingAddress}</p>
              </div>
            )}
            {activeTab === 'notes' && (
              <p className="text-gray-600">{viewingLead.notes || 'Sin notas'}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contactos</h2>
          <p className="text-gray-500">{filteredLeads.length} contactos encontrados</p>
        </div>
        <button
          onClick={() => { setEditingLead(null); setFormData(emptyLead); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-lg hover:from-sky-600 hover:to-emerald-600 transition-all"
        >
          <Plus className="w-4 h-4" /> Nuevo Contacto
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar contactos..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as 'all' | 'private' | 'company')} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="all">Todos los tipos</option>
              <option value="private">Particular</option>
              <option value="company">Empresa</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'prospect')} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="all">Todos</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="prospect">Prospecto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Email</th>
                <th className="text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Teléfono</th>
                <th className="text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Ciudad</th>
                <th className="text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{lead.firstName} {lead.lastName}</p>
                      {lead.companyName && <p className="text-xs text-gray-500">{lead.companyName}</p>}
                    </div>
                  </td>
                  <td className="hidden md:table-cell text-sm text-gray-600">{lead.email}</td>
                  <td className="hidden lg:table-cell text-sm text-gray-600">{lead.phone}</td>
                  <td className="hidden lg:table-cell text-sm text-gray-600">{lead.billingCity}</td>
                  <td>{getStatusBadge(lead.status)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewingLead(lead)} className="p-1.5 hover:bg-sky-50 rounded text-sky-600" title="Ver"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleEdit(lead)} className="p-1.5 hover:bg-amber-50 rounded text-amber-600" title="Editar"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(lead.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLeads.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Filter className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No se encontraron contactos</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingLead ? 'Editar Contacto' : 'Nuevo Contacto'}</h3>
              <button onClick={() => { setShowForm(false); setEditingLead(null); }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Type */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.type === 'private'} onChange={() => set('type', 'private')} className="text-sky-500" />
                  <span className="text-sm">Particular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.type === 'company'} onChange={() => set('type', 'company')} className="text-sky-500" />
                  <span className="text-sm">Empresa</span>
                </label>
              </div>

              {/* General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input value={g('firstName')} onChange={(e) => set('firstName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                  <input value={g('lastName')} onChange={(e) => set('lastName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                {formData.type === 'company' && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                    <input value={g('companyName')} onChange={(e) => set('companyName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={g('email')} onChange={(e) => set('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input value={g('phone')} onChange={(e) => set('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Móvil</label>
                  <input value={g('mobile')} onChange={(e) => set('mobile', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIF/CIF</label>
                  <input value={g('fiscalCode')} onChange={(e) => set('fiscalCode', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIF-IVA</label>
                  <input value={g('vatNumber')} onChange={(e) => set('vatNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código SDI</label>
                  <input value={g('sdiCode')} onChange={(e) => set('sdiCode', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PEC</label>
                  <input value={g('pec')} onChange={(e) => set('pec', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Dirección de Facturación</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calle</label>
                    <input value={g('billingStreet')} onChange={(e) => set('billingStreet', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                    <input value={g('billingCity')} onChange={(e) => set('billingCity', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                    <input value={g('billingZip')} onChange={(e) => set('billingZip', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                    <input value={g('billingProvince')} onChange={(e) => set('billingProvince', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <input value={g('billingCountry')} onChange={(e) => set('billingCountry', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Dirección de Envío</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calle</label>
                    <input value={g('shippingStreet')} onChange={(e) => set('shippingStreet', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                    <input value={g('shippingCity')} onChange={(e) => set('shippingCity', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                    <input value={g('shippingZip')} onChange={(e) => set('shippingZip', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                    <input value={g('shippingProvince')} onChange={(e) => set('shippingProvince', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <input value={g('shippingCountry')} onChange={(e) => set('shippingCountry', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              {/* Notes & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select value={g('status')} onChange={(e) => set('status', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="prospect">Prospecto</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                  <textarea value={g('notes')} onChange={(e) => set('notes', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
              <button onClick={() => { setShowForm(false); setEditingLead(null); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:from-sky-600 hover:to-emerald-600">
                {editingLead ? 'Actualizar' : 'Crear'} Contacto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;


+++ src/components/Contacts.tsx (修改后)
import React from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  tags: string[];
}

const Contacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [contacts, setContacts] = React.useState<Contact[]>([
    {
      id: '1',
      name: 'Mario Rossi',
      email: 'mario.rossi@azienda1.it',
      phone: '+39 02 1234 5678',
      company: 'Azienda S.r.l.',
      role: 'CEO',
      status: 'active',
      lastContact: '2026-09-14',
      tags: ['cliente', 'importante']
    },
    {
      id: '2',
      name: 'Anna Verdi',
      email: 'anna.verdi@azienda2.it',
      phone: '+39 06 9876 5432',
      company: 'Startup S.n.c.',
      role: 'CTO',
      status: 'active',
      lastContact: '2026-09-13',
      tags: ['prospect', 'tecnologia']
    },
    {
      id: '3',
      name: 'Luca Bianchi',
      email: 'luca.bianchi@azienda3.it',
      phone: '+39 011 555 6667',
      company: 'Gruppo Industriale',
      role: 'Direttore',
      status: 'inactive',
      lastContact: '2026-08-29',
      tags: ['vecchio cliente', 'inattivo']
    },
    {
      id: '4',
      name: 'Paola Neri',
      email: 'paola.neri@azienda4.it',
      phone: '+39 02 444 3332',
      company: 'Studio Legale',
      role: 'Avvocato',
      status: 'pending',
      lastContact: '2026-09-10',
      tags: ['legale', 'nuovo']
    },
    {
      id: '5',
      name: 'Giuseppe Gialli',
      email: 'giuseppe.gialli@azienda5.it',
      phone: '+39 081 777 8889',
      company: 'Consulenza S.r.l.',
      role: 'Partner',
      status: 'active',
      lastContact: '2026-09-12',
      tags: ['consulente', 'strategico']
    },
    {
      id: '6',
      name: 'Francesca Blu',
      email: 'francesca.blu@azienda6.it',
      phone: '+39 051 222 3334',
      company: 'Fornitore S.p.A.',
      role: 'Acquisti',
      status: 'active',
      lastContact: '2026-09-11',
      tags: ['fornitore', 'logistica']
    }
  ]);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowAddForm(true);
  };

  const handleSaveContact = (contactData: Omit<Contact, 'id'> & { id?: string }) => {
    if (contactData.id) {
      setContacts(contacts.map(c => c.id === contactData.id ? { ...contactData as Contact, id: contactData.id } : c));
    } else {
      const newContact: Contact = {
        ...contactData as Contact,
        id: (contacts.length + 1).toString()
      };
      setContacts([...contacts, newContact]);
    }
    setShowAddForm(false);
    setSelectedContact(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">Gestione Contatti</h2>
        <button
          onClick={() => {
            setSelectedContact(null);
            setShowAddForm(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-200 btn-hover"
        >
          + Nuovo Contatto
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cerca contatti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tutti gli stati</option>
          <option value="active">Attivi</option>
          <option value="inactive">Inattivi</option>
          <option value="pending">In attesa</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Nome</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Email</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Azienda</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Ruolo</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Stato</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{contact.email}</td>
                  <td className="py-4 px-6 text-gray-600">{contact.company}</td>
                  <td className="py-4 px-6 text-gray-600">{contact.role}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      contact.status === 'active' ? 'bg-green-100 text-green-800' :
                      contact.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contact.status === 'active' ? 'Attivo' : contact.status === 'inactive' ? 'Inattivo' : 'In attesa'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <ContactForm
          contact={selectedContact}
          onSave={handleSaveContact}
          onCancel={() => {
            setShowAddForm(false);
            setSelectedContact(null);
          }}
        />
      )}

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nessun contatto trovato</h3>
          <p className="text-gray-500">Prova a modificare i criteri di ricerca o aggiungi un nuovo contatto.</p>
        </div>
      )}
    </div>
  );
};

interface ContactFormProps {
  contact?: Contact | null;
  onSave: (contact: Omit<Contact, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState<Omit<Contact, 'id' | 'lastContact' | 'tags'> & { id?: string }>({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    role: contact?.role || '',
    status: contact?.status || 'active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      lastContact: new Date().toISOString().split('T')[0],
      tags: contact?.tags || []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {contact ? 'Modifica Contatto' : 'Aggiungi Nuovo Contatto'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Azienda *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ruolo</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Attivo</option>
              <option value="inactive">Inattivo</option>
              <option value="pending">In attesa</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-200"
            >
              {contact ? 'Salva Modifiche' : 'Aggiungi Contatto'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contacts;
