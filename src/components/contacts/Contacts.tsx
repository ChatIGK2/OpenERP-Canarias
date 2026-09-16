import { useState } from 'react';
import {
  Lead, HistoryEntry, LeadEmail, Meeting, Quotation, Order, Invoice, DDT,
  Product, ContactType, Agent, DocCounters, Carrier
} from '../../types';
import { currentUser } from '../../data/mock-data';
import { Language } from '../../i18n';
import SalesActivity from '../SalesActivity';
import { generateProfessionalPDF } from '../../utils/pdfTemplates';

interface Props {
  leads: Lead[]; history: HistoryEntry[]; emails: LeadEmail[]; meetings: Meeting[];
  quotations: Quotation[]; orders: Order[]; invoices: Invoice[]; ddts: DDT[]; products: Product[]; agents: Agent[]; carriers: Carrier[];
  docCounters: DocCounters; language: Language;
  setLeads: (l: Lead[]) => void; setHistory: (h: HistoryEntry[]) => void; setEmails: (e: LeadEmail[]) => void;
  setMeetings: (m: Meeting[]) => void; setQuotations: (q: Quotation[]) => void; setOrders: (o: Order[]) => void;
  setInvoices: (i: Invoice[]) => void; setDDTs: (d: DDT[]) => void; setDocCounters: (c: DocCounters) => void;
}

export default function Contacts({ leads, history, emails, meetings, quotations, orders, invoices, ddts, products, agents, carriers, docCounters, language, setLeads, setHistory, setEmails, setMeetings, setQuotations, setOrders, setInvoices, setDDTs, setDocCounters }: Props) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ContactType>('all');

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || l.contactType === typeFilter;
    return matchSearch && matchType;
  });

  if (selectedLead) {
    const currentLead = leads.find(l => l.id === selectedLead.id) || selectedLead;
    return <LeadDetailView lead={currentLead} history={history} emails={emails} meetings={meetings} quotations={quotations} orders={orders} invoices={invoices} ddts={ddts} products={products} agents={agents} carriers={carriers} docCounters={docCounters}
      onUpdateLead={(u: Lead) => { setLeads(leads.map(l => l.id === u.id ? u : l)); setSelectedLead(u); }}
      onAddHistory={(e: Omit<HistoryEntry, 'id'>) => setHistory([...history, { ...e, id: `h${Date.now()}` }])}
      onAddEmail={(e: Omit<LeadEmail, 'id'>) => setEmails([...emails, { ...e, id: `e${Date.now()}` }])}
      onAddMeeting={(m: Omit<Meeting, 'id'>) => setMeetings([...meetings, { ...m, id: `m${Date.now()}` }])}
      onAddQuotation={(q: Quotation) => setQuotations([...quotations, q])}
      onUpdateQuotation={(q: Quotation) => setQuotations(quotations.map(x => x.id === q.id ? q : x))}
      onAddOrder={(o: Order) => setOrders([...orders, o])}
      onUpdateOrder={(o: Order) => setOrders(orders.map(x => x.id === o.id ? o : x))}
      onAddInvoice={(i: Invoice) => { setInvoices([...invoices, i]); setLeads(leads.map(l => l.id === currentLead.id ? { ...l, linkedInvoices: [...l.linkedInvoices, i.number] } : l)); }}
      onAddDDT={(d: DDT) => { setDDTs([...ddts, d]); setLeads(leads.map(l => l.id === currentLead.id ? { ...l, linkedDDTs: [...l.linkedDDTs, d.number] } : l)); }}
      onBack={() => setSelectedLead(null)}
      onIncrementCounter={(type: keyof DocCounters) => setDocCounters({ ...docCounters, [type]: docCounters[type] + 1 })}
      setInvoices={setInvoices}
    />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-fade-in">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 card-hover border border-sky-100 animate-slide-in-right">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center mb-2 shadow-md">
            <i className="fas fa-users text-white text-xs"></i>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
          <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">{leads.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 card-hover border border-sky-100 animate-slide-in-right" style={{animationDelay: '100ms'}}>
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-lg flex items-center justify-center mb-2 shadow-md">
            <i className="fas fa-user text-white text-xs"></i>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500">Particulares</p>
          <p className="text-lg sm:text-2xl font-bold text-sky-600">{leads.filter(l => l.contactType === 'private').length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 card-hover border border-sky-100 animate-slide-in-right" style={{animationDelay: '200ms'}}>
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mb-2 shadow-md">
            <i className="fas fa-building text-white text-xs"></i>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500">Empresas</p>
          <p className="text-lg sm:text-2xl font-bold text-emerald-600">{leads.filter(l => l.contactType === 'company').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 border border-sky-100 animate-slide-in-left">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setTypeFilter('all')} className={`px-3 py-2 text-xs sm:text-sm rounded-xl font-medium transition-all duration-200 btn-hover ${typeFilter === 'all' ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/30' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'}`}>Todos ({leads.length})</button>
            <button onClick={() => setTypeFilter('private')} className={`px-3 py-2 text-xs sm:text-sm rounded-xl font-medium transition-all duration-200 btn-hover ${typeFilter === 'private' ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'}`}>Particulares ({leads.filter(l => l.contactType === 'private').length})</button>
            <button onClick={() => setTypeFilter('company')} className={`px-3 py-2 text-xs sm:text-sm rounded-xl font-medium transition-all duration-200 btn-hover ${typeFilter === 'company' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>Empresas ({leads.filter(l => l.contactType === 'company').length})</button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400"></i>
              <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border-2 border-sky-200 rounded-xl text-xs sm:text-sm focus:border-sky-400 transition-all duration-200" />
            </div>
            <button onClick={() => setShowNew(true)} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-xs sm:text-sm rounded-xl hover:from-sky-600 hover:to-emerald-600 whitespace-nowrap shadow-lg shadow-sky-500/30 btn-hover">
              <i className="fas fa-user-plus mr-1 sm:mr-2"></i> <span className="hidden sm:inline">Nuevo Contacto</span> <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-sky-100 overflow-hidden animate-scale-in">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-sky-50 to-emerald-50 border-b border-sky-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-sky-800 uppercase tracking-wider">Nombre</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-sky-800 uppercase tracking-wider">Empresa</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-sky-800 uppercase tracking-wider">Email</th>
                <th className="text-center px-6 py-4 text-xs font-bold text-sky-800 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {filtered.map((l, index) => (
                <tr key={l.id} className="hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 cursor-pointer transition-all duration-200" onClick={() => setSelectedLead(l)} style={{animationDelay: `${index * 50}ms`}}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {l.contactType === 'private' ? (
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center shadow-md">
                          <i className="fas fa-user text-white text-sm"></i>
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                          <i className="fas fa-building text-white text-sm"></i>
                        </div>
                      )}
                      <span className="text-sm font-semibold text-gray-900">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.company || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.email}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-xs rounded-lg hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 btn-hover shadow-md">
                      <i className="fas fa-eye mr-1"></i>Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-sky-50">
          {filtered.map((l, index) => (
            <div key={l.id} className="p-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 cursor-pointer active:bg-sky-100 transition-all duration-200" onClick={() => setSelectedLead(l)} style={{animationDelay: `${index * 50}ms`}}>
              <div className="flex items-center gap-3">
                {l.contactType === 'private' ? (
                  <div className="w-11 h-11 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <i className="fas fa-user text-white"></i>
                  </div>
                ) : (
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <i className="fas fa-building text-white"></i>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{l.name}</p>
                  <p className="text-xs text-gray-500 truncate">{l.company || '-'}</p>
                  <p className="text-xs text-sky-600 truncate">{l.email}</p>
                </div>
                <i className="fas fa-chevron-right text-sky-400"></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white z-10">
              <h2 className="text-sm sm:text-lg font-semibold"><i className="fas fa-user-plus mr-2 text-purple-500"></i>Nuevo Contacto</h2>
              <button onClick={() => setShowNew(false)} className="text-gray-400 hover:text-gray-600 p-2"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = e.target as HTMLFormElement;
              const g = (n: string) => (f.elements.namedItem(n) as HTMLInputElement)?.value || '';
              const ct = g('contactType') as ContactType;
              const nl: Lead = {
                id: `l${Date.now()}`, name: `${g('firstName')} ${g('lastName')}`, firstName: g('firstName'), lastName: g('lastName'),
                company: ct === 'company' ? g('company') : '', email: g('email'), phone: g('phone'),
                billingStreet: g('billingStreet'), billingCity: g('billingCity'), billingZip: g('billingZip'), billingProvince: g('billingProvince'), billingCountry: g('billingCountry'),
                shippingStreet: g('billingStreet'), shippingCity: g('billingCity'), shippingZip: g('billingZip'), shippingProvince: g('billingProvince'), shippingCountry: g('billingCountry'),
                shippingPhone: g('phone'), paymentTerms: 'Transferencia 30 días', nif: g('nif'), nie: g('nie'),
                nieType: (g('nieType') || 'NIE') as any, bankInfo: g('bank'), igicRate: 7, stage: 'new', source: 'Otro',
                assignedTo: 'Marco Bianchi', agentId: g('agentId'), notes: '', createdAt: new Date().toISOString().split('T')[0],
                expectedRevenue: 0, probability: 10, linkedQuotations: [], linkedOrders: [], linkedInvoices: [], linkedDDTs: [],
                contactType: ct, shippingDifferent: false, shippingPerson: `${g('firstName')} ${g('lastName')}`, shippingMobile: g('phone'),
                agreedPrice: '', agreedPaymentTerms: 'Transferencia 30 días', agreedDiscount: 0, internalNotes: '', salesActivities: [],
                pec: g('pec'), uniqueCode: g('uniqueCode'), secondEmail: g('secondEmail'), secondPhone: g('secondPhone'),
                taxCode: g('taxCode'), companyVAT: g('companyVAT')
              };
              setLeads([...leads, nl]);
              setHistory([...history, { id: `h${Date.now()}`, leadId: nl.id, date: new Date().toLocaleString(), user: 'Marco Bianchi', type: 'lead_created', title: 'Contacto creado', description: `Nuevo contacto ${nl.name}` }]);
              setShowNew(false);
            }} className="p-3 space-y-3">
              <div><label className="block text-xs font-medium mb-1">Tipo</label><select name="contactType" className="w-full border rounded-lg px-3 py-2 text-xs"><option value="private">Particular</option><option value="company">Empresa</option></select></div>
              <div className="grid grid-cols-1 gap-2">
                <div><label className="block text-xs font-medium mb-1">Nombre *</label><input type="text" name="firstName" required className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
                <div><label className="block text-xs font-medium mb-1">Apellidos *</label><input type="text" name="lastName" required className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
              </div>
              <div><label className="block text-xs font-medium mb-1">Empresa</label><input type="text" name="company" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
              <div className="grid grid-cols-1 gap-2">
                <div><label className="block text-xs font-medium mb-1">Email *</label><input type="email" name="email" required className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
                <div><label className="block text-xs font-medium mb-1">Teléfono</label><input type="text" name="phone" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
              </div>
              <div><label className="block text-xs font-medium mb-1">Dirección</label><input type="text" name="address" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
              <div className="grid grid-cols-1 gap-2">
                <div><label className="block text-xs font-medium mb-1">NIF/CIF</label><input type="text" name="nif" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
                <div>
                  <label className="block text-xs font-medium mb-1">Tipo Documento</label>
                  <select name="nieType" className="w-full border rounded-lg px-3 py-2 text-xs">
                    <option value="NIE">NIE</option><option value="DNI">DNI</option><option value="PASSAPORTO">PASSAPORTO</option><option value="CARTA_DI_IDENTITA">CARTA DI IDENTITÀ</option>
                  </select>
                </div>
                <div><label className="block text-xs font-medium mb-1">Numero Documento</label><input type="text" name="nie" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
              </div>
              <div><label className="block text-xs font-medium mb-1">IBAN</label><input type="text" name="bank" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
              <div className="grid grid-cols-1 gap-2">
                <div><label className="block text-xs font-medium mb-1">PEC</label><input type="email" name="pec" className="w-full border rounded-lg px-3 py-2 text-xs" placeholder="pec@dominio.it" /></div>
                <div><label className="block text-xs font-medium mb-1">Codice Univoco</label><input type="text" name="uniqueCode" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div><label className="block text-xs font-medium mb-1">Seconda Email</label><input type="email" name="secondEmail" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
                <div><label className="block text-xs font-medium mb-1">Secondo Telefono</label><input type="tel" name="secondPhone" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
              </div>
              <div><label className="block text-xs font-medium mb-1">Codice Fiscale (solo privati)</label><input type="text" name="taxCode" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-semibold text-gray-700 mb-2">Dati Aziendali (solo aziende)</p>
                <div className="grid grid-cols-1 gap-2">
                  <div><label className="block text-xs font-medium mb-1">Forma Giuridica</label><input type="text" name="companyLegalForm" className="w-full border rounded-lg px-3 py-2 text-xs" placeholder="SRL, SPA, SAS..." /></div>
                  <div><label className="block text-xs font-medium mb-1">Numero Registro Imprese</label><input type="text" name="companyRegisterNumber" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
                  <div><label className="block text-xs font-medium mb-1">Partita IVA</label><input type="text" name="companyVAT" className="w-full border rounded-lg px-3 py-2 text-xs" /></div>
                  <div><label className="block text-xs font-medium mb-1">Capitale Sociale</label><input type="text" name="companyCapital" className="w-full border rounded-lg px-3 py-2 text-xs" placeholder="Es: 10.000€" /></div>
                </div>
              </div>
              <div><label className="block text-xs font-medium mb-1">Agente Asignado</label><select name="agentId" className="w-full border rounded-lg px-3 py-2 text-xs"><option value="">Sin asignar</option>{agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
              <div className="flex gap-2 pt-2 sticky bottom-0 bg-white pb-3">
                <button type="button" onClick={() => setShowNew(false)} className="flex-1 px-3 py-2 text-xs text-gray-600 border rounded-lg">Cancelar</button>
                <button type="submit" className="flex-1 px-3 py-2 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700"><i className="fas fa-save mr-1"></i>Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ HELPER FORMATO NUMERI DOCUMENTI ============ */
function formatDocNumber(prefix: string, counter: number, clientName: string, date: string): string {
  const num = String(counter).padStart(4, '0');
  const dateStr = date.replace(/-/g, '').slice(2);
  return `${prefix}.${num}.${clientName.replace(/\s+/g, '_').slice(0, 15)}.${dateStr}`;
}

/* ============ LEAD DETAIL VIEW ============ */
function LeadDetailView({ lead, history, emails, meetings, quotations, orders, invoices, ddts, products, agents, carriers, docCounters, onUpdateLead, onAddHistory, onAddEmail, onAddMeeting, onAddQuotation, onUpdateQuotation, onAddOrder, onUpdateOrder, onAddInvoice, onAddDDT, onBack, onIncrementCounter, setInvoices }: any) {
  const [activeTab, setActiveTab] = useState<'anagrafica' | 'sales' | 'statistics' | 'quotations' | 'orders' | 'documents' | 'history' | 'emails'>('anagrafica');
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDDTModal, setShowDDTModal] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const leadQuotations = quotations.filter((q: Quotation) => q.leadId === lead.id);
  const leadOrders = orders.filter((o: Order) => o.leadId === lead.id);
  const leadInvoices = invoices.filter((i: Invoice) => i.leadId === lead.id);
  const leadDDTs = ddts.filter((d: DDT) => d.leadId === lead.id);
  const leadHistory = history.filter((h: HistoryEntry) => h.leadId === lead.id);
  const leadEmails = emails.filter((e: LeadEmail) => e.leadId === lead.id);

  const stageLabels: Record<string, string> = { new: 'Nuevo', contacted: 'Contactado', meeting: 'Reunión', proposal: 'Propuesta', order: 'Pedido', negotiation: 'Negociación', won: 'Ganado', lost: 'Perdido' };
  const stageColors: Record<string, string> = { new: 'bg-gray-500', contacted: 'bg-blue-500', meeting: 'bg-yellow-500', proposal: 'bg-purple-500', order: 'bg-amber-500', negotiation: 'bg-orange-500', won: 'bg-green-500', lost: 'bg-red-500' };

  return (
    <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 animate-fade-in">
      {/* Header contatto */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-sky-100 space-y-3 animate-slide-in-right">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sky-600 hover:text-sky-800 p-2 rounded-lg hover:bg-sky-50 flex-shrink-0 transition-all duration-200 btn-hover">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-base font-bold text-white">{lead.firstName[0]}{lead.lastName[0]}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent truncate">{lead.name}</h1>
            <p className="text-[10px] sm:text-sm text-gray-500 truncate">{lead.company ? `${lead.company} •` : ''}{lead.email}</p>
          </div>
          <span className={`text-[10px] sm:text-xs px-3 py-1 rounded-full font-semibold text-white flex-shrink-0 shadow-md ${stageColors[lead.stage]}`}>{stageLabels[lead.stage]}</span>
        </div>
        {/* Pulsanti azione */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <button onClick={() => setShowQuotationModal(true)} className="px-3 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[10px] sm:text-sm rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-200 btn-hover shadow-md">
            <i className="fas fa-file-invoice-dollar mr-1"></i> <span className="hidden sm:inline">Presupuesto</span> <span className="sm:hidden">Pres.</span>
          </button>
          <button onClick={() => { setSelectedQuotation(null); setEditingOrder(null); setShowOrderModal(true); }} className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] sm:text-sm rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 btn-hover shadow-md">
            <i className="fas fa-shopping-cart mr-1"></i> <span className="hidden sm:inline">Pedido</span> <span className="sm:hidden">Ped.</span>
          </button>
          <button onClick={() => { const o = leadOrders.find((o: Order) => o.status === 'confirmed'); if (o) { setSelectedOrder(o); } else { setSelectedOrder(null); } setShowInvoiceModal(true); }} className="px-3 py-2 bg-gradient-to-r from-sky-600 to-emerald-500 text-white text-[10px] sm:text-sm rounded-xl hover:from-sky-700 hover:to-emerald-600 transition-all duration-200 btn-hover shadow-md">
            <i className="fas fa-file-invoice mr-1"></i> <span className="hidden sm:inline">Factura</span> <span className="sm:hidden">Fat.</span>
          </button>
          <button onClick={() => { const o = leadOrders.find((o: Order) => o.status === 'confirmed'); if (o) { setSelectedOrder(o); setShowDDTModal(true); } else { setSelectedOrder(null); setShowDDTModal(true); } }} className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-sky-500 text-white text-[10px] sm:text-sm rounded-xl hover:from-emerald-700 hover:to-sky-600 transition-all duration-200 btn-hover shadow-md">
            <i className="fas fa-truck mr-1"></i> <span className="hidden sm:inline">Albarán</span> <span className="sm:hidden">Alb.</span>
          </button>
        </div>
      </div>

      {/* Tab */}
      <div className="bg-white rounded-2xl shadow-lg p-2 border border-sky-100">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'anagrafica', label: 'Anagrafica', icon: 'fa-id-card' },
            { id: 'sales', label: 'Pro Vendita', icon: 'fa-tasks' },
            { id: 'statistics', label: 'Statistiche', icon: 'fa-chart-pie' },
            { id: 'quotations', label: 'Preventivi', icon: 'fa-file-invoice-dollar' },
            { id: 'orders', label: 'Pedidos', icon: 'fa-shopping-cart' },
            { id: 'documents', label: 'Documenti', icon: 'fa-file-alt' },
            { id: 'history', label: 'Storico', icon: 'fa-clock-rotate-left' },
            { id: 'emails', label: 'Emails', icon: 'fa-envelope' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-3 sm:px-4 py-2 text-[10px] sm:text-sm font-medium flex items-center gap-1 sm:gap-2 rounded-xl whitespace-nowrap transition-all duration-200 ${activeTab === tab.id ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/30' : 'text-gray-600 hover:bg-sky-50'}`}>
              <i className={`fas ${tab.icon} text-[10px] sm:text-sm`}></i><span className="hidden sm:inline">{tab.label}</span><span className="sm:hidden">{tab.label.slice(0, 4)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-sky-100 p-3 sm:p-6 animate-scale-in">
        {activeTab === 'anagrafica' && <AnagraficaTab lead={lead} agents={agents} onUpdateLead={onUpdateLead} />}
        {activeTab === 'sales' && <SalesActivity lead={lead} agents={agents} onUpdateLead={onUpdateLead} />}
        {activeTab === 'statistics' && <OrderStatistics lead={lead} orders={orders} invoices={invoices} quotations={quotations} />}
        {activeTab === 'quotations' && (
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-800 text-xs sm:text-lg">Presupuestos</h3>
              <button onClick={() => { setEditingQuotation(null); setShowQuotationModal(true); }} className="px-2 sm:px-3 py-1 sm:py-2 bg-purple-600 text-white text-[10px] sm:text-sm rounded-lg hover:bg-purple-700"><i className="fas fa-plus mr-1 sm:mr-2"></i>Nuevo</button>
            </div>
            {leadQuotations.length === 0 ? <p className="text-gray-500 text-xs sm:text-sm">Ningún presupuesto</p> : leadQuotations.map((q: Quotation) => (
              <div key={q.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-2 sm:px-4 py-2 sm:py-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-purple-600 text-[10px] sm:text-xs font-mono truncate">{q.number}</span>
                      <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${q.status === 'confirmed' ? 'bg-green-100 text-green-700' : q.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{q.status}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0">{q.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => { setEditingQuotation(q); setShowQuotationModal(true); }} className="px-2 py-1 text-[10px] bg-yellow-600 text-white rounded hover:bg-yellow-700"><i className="fas fa-edit mr-1"></i>Editar</button>
                    <button onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`<html><head><title>Preventivo ${q.number}</title><style>body{font-family:Arial;padding:40px}h1{color:#6b21a8}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f3f4f6}.total{text-align:right;font-size:18px;font-weight:bold;color:#6b21a8}</style></head><body><h1>PREVENTIVO</h1><p><strong>Numero:</strong> ${q.number}</p><p><strong>Data:</strong> ${q.date}</p><p><strong>Cliente:</strong> ${q.contactName} ${q.contactCompany ? '- ' + q.contactCompany : ''}</p><p><strong>Pagamento:</strong> ${q.paymentTerms || '-'}</p><table><thead><tr><th>Descrizione</th><th>Qtà</th><th>Prezzo</th><th>Totale</th></tr></thead><tbody>${q.lines.map(l => `<tr><td>${l.description}</td><td>${l.quantity}</td><td>€${l.unitPrice.toFixed(2)}</td><td>€${l.subtotal.toFixed(2)}</td></tr>`).join('')}</tbody></table><p class="total">TOTALE: €${q.total.toFixed(2)}</p></body></html>`);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }} className="px-2 py-1 text-[10px] bg-green-600 text-white rounded hover:bg-green-700"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
                    {(q.status === 'draft' || q.status === 'revised') && <button onClick={() => { onUpdateQuotation({ ...q, status: 'sent' }); onAddHistory({ leadId: lead.id, date: new Date().toLocaleString(), user: currentUser, type: 'quotation_sent', title: `Presupuesto ${q.number} enviado`, description: 'Enviado por email' }); }} className="px-2 py-1 text-[10px] bg-blue-600 text-white rounded hover:bg-blue-700"><i className="fas fa-paper-plane mr-1"></i>Enviar</button>}
                    {q.status === 'sent' && <button onClick={() => { onUpdateQuotation({ ...q, status: 'confirmed', confirmedAt: new Date().toLocaleString() }); onAddHistory({ leadId: lead.id, date: new Date().toLocaleString(), user: currentUser, type: 'quotation_confirmed', title: `Presupuesto ${q.number} confirmado`, description: 'Confirmado por cliente' }); }} className="px-2 py-1 text-[10px] bg-green-600 text-white rounded hover:bg-green-700"><i className="fas fa-check mr-1"></i>Confirmar</button>}
                    <button onClick={() => { setSelectedQuotation(q); setEditingOrder(null); setShowOrderModal(true); }} className="px-2 py-1 text-[10px] bg-amber-600 text-white rounded hover:bg-amber-700"><i className="fas fa-shopping-cart mr-1"></i>Pedido</button>
                  </div>
                </div>
                <div className="p-2 sm:p-4 overflow-x-auto">
                  <table className="w-full text-[10px] sm:text-sm min-w-[400px]"><thead><tr className="border-b"><th className="text-left py-1 sm:py-2">Descripción</th><th className="text-right py-1 sm:py-2">Cant.</th><th className="text-right py-1 sm:py-2">Prezzo</th><th className="text-right py-1 sm:py-2">Total</th></tr></thead>
                    <tbody>{q.lines.map(l => <tr key={l.id} className="border-b border-gray-50"><td className="py-1 sm:py-2">{l.productName ? <span className="text-[10px] text-purple-500 mr-1">[{l.productName}]</span> : null}{l.description}</td><td className="py-1 sm:py-2 text-right">{l.quantity}</td><td className="py-1 sm:py-2 text-right">€{l.unitPrice.toFixed(2)}</td><td className="py-1 sm:py-2 text-right font-medium">€{l.subtotal.toFixed(2)}</td></tr>)}</tbody>
                  </table>
                  <div className="mt-2 sm:mt-3 text-right"><span className="text-sm sm:text-lg font-bold text-purple-600">€{q.total.toFixed(2)}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-800 text-xs sm:text-lg">Pedidos</h3>
              <button onClick={() => { setEditingOrder(null); setSelectedQuotation(null); setShowOrderModal(true); }} className="px-2 sm:px-3 py-1 sm:py-2 bg-amber-600 text-white text-[10px] sm:text-sm rounded-lg hover:bg-amber-700"><i className="fas fa-plus mr-1 sm:mr-2"></i>Nuevo</button>
            </div>
            {leadOrders.length === 0 ? <p className="text-gray-500 text-xs sm:text-sm">Ningún pedido</p> : leadOrders.map((o: Order) => (
              <div key={o.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-2 sm:px-4 py-2 sm:py-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-amber-600 text-[10px] sm:text-xs font-mono truncate">{o.number}</span>
                      <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${o.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0">{o.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => { setEditingOrder(o); setSelectedQuotation(null); setShowOrderModal(true); }} className="px-2 py-1 text-[10px] bg-yellow-600 text-white rounded hover:bg-yellow-700"><i className="fas fa-edit mr-1"></i>Editar</button>
                    <button onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`<html><head><title>Ordine ${o.number}</title><style>body{font-family:Arial;padding:40px}h1{color:#d97706}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f3f4f6}.total{text-align:right;font-size:18px;font-weight:bold;color:#d97706}</style></head><body><h1>ORDINE</h1><p><strong>Numero:</strong> ${o.number}</p><p><strong>Data:</strong> ${o.date}</p><p><strong>Consegna:</strong> ${o.deliveryDate}</p><p><strong>Cliente:</strong> ${o.contactName} ${o.contactCompany ? '- ' + o.contactCompany : ''}</p><p><strong>Pagamento:</strong> ${o.paymentTerms || '-'}</p><p><strong>Spedizione:</strong> ${o.shippingAddress}</p><table><thead><tr><th>Descrizione</th><th>Qtà</th><th>Prezzo</th><th>Totale</th></tr></thead><tbody>${o.lines.map(l => `<tr><td>${l.description}</td><td>${l.quantity}</td><td>€${l.unitPrice.toFixed(2)}</td><td>€${l.subtotal.toFixed(2)}</td></tr>`).join('')}</tbody></table><p class="total">TOTALE: €${o.total.toFixed(2)}</p></body></html>`);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }} className="px-2 py-1 text-[10px] bg-green-600 text-white rounded hover:bg-green-700"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
                    {o.status === 'confirmed' && <><button onClick={() => { setSelectedOrder(o); setShowInvoiceModal(true); }} className="px-2 py-1 text-[10px] bg-indigo-600 text-white rounded hover:bg-indigo-700"><i className="fas fa-file-invoice mr-1"></i>Factura</button><button onClick={() => { setSelectedOrder(o); setShowDDTModal(true); }} className="px-2 py-1 text-[10px] bg-teal-600 text-white rounded hover:bg-teal-700"><i className="fas fa-truck mr-1"></i>Albarán</button></>}
                  </div>
                </div>
                <div className="p-2 sm:p-4 overflow-x-auto">
                  <table className="w-full text-[10px] sm:text-sm min-w-[400px]"><thead><tr className="border-b"><th className="text-left py-1 sm:py-2">Descripción</th><th className="text-right py-1 sm:py-2">Cant.</th><th className="text-right py-1 sm:py-2">Prezzo</th><th className="text-right py-1 sm:py-2">Total</th></tr></thead>
                    <tbody>{o.lines.map(l => <tr key={l.id} className="border-b border-gray-50"><td className="py-1 sm:py-2">{l.productName ? <span className="text-[10px] text-purple-500 mr-1">[{l.productName}]</span> : null}{l.description}</td><td className="py-1 sm:py-2 text-right">{l.quantity}</td><td className="py-1 sm:py-2 text-right">€{l.unitPrice.toFixed(2)}</td><td className="py-1 sm:py-2 text-right font-medium">€{l.subtotal.toFixed(2)}</td></tr>)}</tbody>
                  </table>
                  <div className="mt-2 sm:mt-3 text-right"><span className="text-sm sm:text-lg font-bold text-amber-600">€{o.total.toFixed(2)}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="space-y-3 sm:space-y-6">
            <div><h3 className="font-semibold text-gray-800 text-xs sm:text-lg mb-2 sm:mb-3">Facturas</h3>
              {leadInvoices.length === 0 ? <p className="text-gray-500 text-xs sm:text-sm">Ninguna factura</p> : leadInvoices.map((inv: Invoice) => (
                <div key={inv.id} className="border border-gray-200 rounded-lg p-2 sm:p-4 mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-indigo-600 text-[10px] sm:text-xs font-mono truncate">{inv.number}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0">{inv.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm">€{inv.total.toFixed(2)}</span>
                      <select value={inv.status} onChange={(e) => { const newStatus = e.target.value as any; const updatedInvoices = invoices.map((i: Invoice) => i.id === inv.id ? { ...i, status: newStatus } : i); setInvoices(updatedInvoices); }} className={`text-[10px] sm:text-xs px-2 py-1 rounded-full border-0 ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'credit_note' ? 'bg-red-100 text-red-700' : inv.status === 'cancelled' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        <option value="sent">Non saldata</option><option value="paid">Saldata</option><option value="credit_note">Nota di credito</option><option value="cancelled">Annullata</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-2">
                    <span>Pagamento: {inv.paymentTerms || '-'}</span>
                    {inv.type === 'credit_note' && <span className="ml-2 text-red-600 font-semibold">NOTA DI CREDITO</span>}
                  </div>
                  {inv.installments && inv.installments.length > 0 && (
                    <div className="mt-2 bg-gray-50 rounded p-2">
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-1">Rate di pagamento:</p>
                      {inv.installments.map((inst, idx) => (
                        <div key={inst.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-xs py-1 border-b border-gray-200 last:border-0 gap-1">
                          <span>Rata {idx + 1} ({inst.percentage}%)</span>
                          <span>Scadenza: {inst.dueDate}</span>
                          <div className="flex items-center gap-2">
                            <input type="date" value={inst.paidDate || ''} onChange={(e) => { const updatedInvoices = invoices.map((i: Invoice) => { if (i.id === inv.id) { const updatedInstallments = i.installments?.map((ins, j) => j === idx ? { ...ins, paidDate: e.target.value, status: e.target.value ? 'paid' as const : 'pending' as const } : ins); return { ...i, installments: updatedInstallments }; } return i; }); setInvoices(updatedInvoices); }} className="border rounded px-1 py-0.5 text-[10px] sm:text-xs" />
                            <select value={inst.status} onChange={(e) => { const updatedInvoices = invoices.map((i: Invoice) => { if (i.id === inv.id) { const updatedInstallments = i.installments?.map((ins, j) => j === idx ? { ...ins, status: e.target.value as any, paidDate: e.target.value === 'paid' ? (ins.paidDate || new Date().toISOString().split('T')[0]) : ins.paidDate } : ins); return { ...i, installments: updatedInstallments }; } return i; }); setInvoices(updatedInvoices); }} className={`text-[10px] sm:text-xs px-1 py-0.5 rounded border-0 ${inst.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              <option value="pending">In attesa</option><option value="paid">Pagata</option>
                            </select>
                            <span className="font-semibold">€{inst.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div><h3 className="font-semibold text-gray-800 text-xs sm:text-lg mb-2 sm:mb-3">Albaranes</h3>
              {leadDDTs.length === 0 ? <p className="text-gray-500 text-xs sm:text-sm">Ningún albarán</p> : leadDDTs.map((ddt: DDT) => (
                <div key={ddt.id} className="border border-gray-200 rounded-lg p-2 sm:p-4 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-teal-600 text-[10px] sm:text-xs font-mono">{ddt.number}</span>
                    <span className="text-[10px] sm:text-xs text-gray-500">{ddt.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] sm:text-xs text-gray-600 mt-1">
                    <div><i className="fas fa-truck mr-1 text-teal-500"></i>{ddt.carrier || 'Non assegnato'}</div>
                    <div><i className="fas fa-weight mr-1 text-teal-500"></i>{ddt.goodsQuantity} {ddt.goodsUnit}</div>
                    <div><i className="fas fa-boxes mr-1 text-teal-500"></i>{ddt.packagesPallets} colli/pallet</div>
                    <div><i className="fas fa-archive mr-1 text-teal-500"></i>{ddt.packagesBuckets} secchi</div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1"><i className="fas fa-tag mr-1"></i>Causale: {ddt.transportReason}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'history' && (
          <div><h3 className="font-semibold text-gray-800 text-xs sm:text-lg mb-2 sm:mb-3">Historial</h3>
            {leadHistory.length === 0 ? <p className="text-gray-500 text-xs sm:text-sm">Sin actividad</p> : leadHistory.map((h: HistoryEntry) => (
              <div key={h.id} className="border-l-4 border-purple-500 pl-2 sm:pl-4 py-2 mb-2"><p className="text-[10px] sm:text-sm font-medium">{h.title}</p><p className="text-[10px] sm:text-xs text-gray-500">{h.date} - {h.user}</p></div>
            ))}
          </div>
        )}
        {activeTab === 'emails' && (
          <div><h3 className="font-semibold text-gray-800 text-xs sm:text-lg mb-2 sm:mb-3">Emails</h3>
            {leadEmails.length === 0 ? <p className="text-gray-500 text-xs sm:text-sm">Sin emails</p> : leadEmails.map((e: LeadEmail) => (
              <div key={e.id} className="border border-gray-200 rounded-lg p-2 sm:p-4 mb-2"><p className="text-[10px] sm:text-sm font-medium">{e.subject}</p><p className="text-[10px] sm:text-xs text-gray-500">{e.date}</p></div>
            ))}
          </div>
        )}
      </div>

      {showQuotationModal && <QuotationModal lead={lead} products={products} agents={agents} docCounters={docCounters} editQuotation={editingQuotation} onClose={() => { setShowQuotationModal(false); setEditingQuotation(null); }} onSave={(q: Quotation) => { if (editingQuotation) { onUpdateQuotation(q); } else { onAddQuotation(q); onUpdateLead({ ...lead, linkedQuotations: [...lead.linkedQuotations, q.number], stage: 'proposal' }); onIncrementCounter('quotation'); } setShowQuotationModal(false); setEditingQuotation(null); }} />}
      {showOrderModal && <OrderModal lead={lead} quotation={selectedQuotation} editingOrder={editingOrder} products={products} agents={agents} docCounters={docCounters} onClose={() => { setShowOrderModal(false); setSelectedQuotation(null); setEditingOrder(null); }} onSave={(o: Order) => { if (editingOrder) { onUpdateOrder(o); } else { onAddOrder(o); onUpdateLead({ ...lead, linkedOrders: [...lead.linkedOrders, o.number], stage: 'order' }); onIncrementCounter('order'); } setShowOrderModal(false); setSelectedQuotation(null); setEditingOrder(null); }} />}
      {showInvoiceModal && <InvoiceModal lead={lead} order={selectedOrder} docCounters={docCounters} onClose={() => { setShowInvoiceModal(false); setSelectedOrder(null); }} onSave={(i: Invoice) => { onAddInvoice(i); onIncrementCounter('invoice'); setShowInvoiceModal(false); setSelectedOrder(null); }} />}
      {showDDTModal && <DDTModal lead={lead} order={selectedOrder} docCounters={docCounters} carriers={carriers} onClose={() => { setShowDDTModal(false); setSelectedOrder(null); }} onSave={(d: DDT) => { onAddDDT(d); onIncrementCounter('ddt'); setShowDDTModal(false); setSelectedOrder(null); }} />}
    </div>
  );
}

/* ============ TAB ANAGRAFICA ============ */
function AnagraficaTab({ lead, agents, onUpdateLead }: { lead: Lead; agents: Agent[]; onUpdateLead: (l: Lead) => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Lead>({ ...lead });
  const save = () => { onUpdateLead({ ...form, name: `${form.firstName} ${form.lastName}` }); setEditing(null); };
  const isCompany = lead.contactType === 'company';

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* DATI ANAGRAFICI */}
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="font-semibold text-gray-800 text-xs sm:text-lg"><i className="fas fa-id-card mr-1 sm:mr-2 text-blue-500"></i>Dati Anagrafici</h3>
          <button onClick={() => { setEditing(editing === 'anag' ? null : 'anag'); setForm({ ...lead }); }} className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
            <i className={`fas ${editing === 'anag' ? 'fa-times' : 'fa-edit'} mr-1`}></i>{editing === 'anag' ? 'Chiudi' : 'Modifica'}
          </button>
        </div>
        {editing === 'anag' ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-4 space-y-3">
            <div className="border-b pb-2">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Dati Personali</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Nome</label><input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Cognome</label><input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
              </div>
              {isCompany && (<div className="mt-2"><label className="block text-[10px] sm:text-xs font-medium mb-1">Azienda</label><input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>)}
            </div>
            <div className="border-b pb-2">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Contatti</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Telefono</label><input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Seconda Email</label><input type="email" value={form.secondEmail} onChange={e => setForm({...form, secondEmail: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Secondo Telefono</label><input type="text" value={form.secondPhone} onChange={e => setForm({...form, secondPhone: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                <div className="sm:col-span-2"><label className="block text-[10px] sm:text-xs font-medium mb-1">PEC</label><input type="email" value={form.pec} onChange={e => setForm({...form, pec: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" placeholder="pec@dominio.it" /></div>
              </div>
            </div>
            <div className="border-b pb-2">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Documenti</h4>
              {isCompany ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">NIF/CIF</label><input type="text" value={form.nif} onChange={e => setForm({...form, nif: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Partita IVA</label><input type="text" value={form.companyVAT} onChange={e => setForm({...form, companyVAT: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                  <div className="sm:col-span-2"><label className="block text-[10px] sm:text-xs font-medium mb-1">Codice Univoco</label><input type="text" value={form.uniqueCode} onChange={e => setForm({...form, uniqueCode: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Codice Fiscale</label><input type="text" value={form.taxCode} onChange={e => setForm({...form, taxCode: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium mb-1">Tipo Documento</label>
                    <select value={form.nieType} onChange={e => setForm({...form, nieType: e.target.value as any})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs">
                      <option value="NIE">NIE</option><option value="DNI">DNI</option><option value="PASSAPORTO">PASSAPORTO</option><option value="CARTA_DI_IDENTITA">CARTA DI IDENTITÀ</option>
                    </select>
                  </div>
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Numero Documento</label><input type="text" value={form.nie} onChange={e => setForm({...form, nie: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Codice Univoco</label><input type="text" value={form.uniqueCode} onChange={e => setForm({...form, uniqueCode: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                </div>
              )}
            </div>
            {isCompany && (
              <div className="border-b pb-2">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Dati Aziendali</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Partita IVA</label><input type="text" value={form.companyVAT} onChange={e => setForm({...form, companyVAT: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" placeholder="ES: B12345678" /></div>
                </div>
              </div>
            )}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Dati Bancari e Indirizzo</h4>
              <div className="grid grid-cols-1 gap-2">
                <div><label className="block text-[10px] sm:text-xs font-medium mb-1">IBAN</label><input type="text" value={form.bankInfo} onChange={e => setForm({...form, bankInfo: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Via</label><input type="text" value={form.billingStreet} onChange={e => setForm({...form, billingStreet: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Città</label><input type="text" value={form.billingCity} onChange={e => setForm({...form, billingCity: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">CAP</label><input type="text" value={form.billingZip} onChange={e => setForm({...form, billingZip: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Provincia</label><input type="text" value={form.billingProvince} onChange={e => setForm({...form, billingProvince: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Stato</label><input type="text" value={form.billingCountry} onChange={e => setForm({...form, billingCountry: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Agente</label>
                    <select value={form.agentId} onChange={e => setForm({...form, agentId: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs">
                      <option value="">Sin asignar</option>{agents.map((a: Agent) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 px-3 py-1.5 text-xs text-gray-600 border rounded-lg">Annulla</button>
              <button onClick={save} className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"><i className="fas fa-save mr-1"></i>Salva</button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Dati Personali</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <InfoRow label="Nome" value={lead.firstName} />
                <InfoRow label="Cognome" value={lead.lastName} />
                {isCompany && <InfoRow label="Azienda" value={lead.company} />}
                <InfoRow label="Tipo" value={isCompany ? 'Azienda' : 'Privato'} />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Contatti</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <InfoRow label="Email" value={lead.email} />
                <InfoRow label="Telefono" value={lead.phone} />
                {lead.secondEmail && <InfoRow label="Seconda Email" value={lead.secondEmail} />}
                {lead.secondPhone && <InfoRow label="Secondo Telefono" value={lead.secondPhone} />}
                {lead.pec && <InfoRow label="PEC" value={lead.pec} />}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Documenti</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {isCompany ? (
                  <><InfoRow label="NIF/CIF" value={lead.nif || '-'} /><InfoRow label="Partita IVA" value={lead.companyVAT || '-'} /></>
                ) : (
                  <><InfoRow label="Codice Fiscale" value={lead.taxCode || '-'} /><InfoRow label={`${lead.nieType || 'Documento'}`} value={lead.nie || '-'} /></>
                )}
                <InfoRow label="Codice Univoco" value={lead.uniqueCode || '-'} />
              </div>
            </div>
            {isCompany && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Dati Aziendali</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                  <InfoRow label="Partita IVA" value={lead.companyVAT || '-'} />
                </div>
              </div>
            )}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Dati Bancari e Indirizzo</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <InfoRow label="IBAN" value={lead.bankInfo || '-'} />
                <InfoRow label="Indirizzo Fatt." value={`${lead.billingStreet || ''}, ${lead.billingCity || ''} ${lead.billingZip || ''}, ${lead.billingProvince || ''}, ${lead.billingCountry || ''}`} />
                <InfoRow label="Agente" value={agents.find((a: Agent) => a.id === lead.agentId)?.name || 'Sin asignar'} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DATI SPEDIZIONE */}
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="font-semibold text-gray-800 text-xs sm:text-lg"><i className="fas fa-truck-fast mr-1 sm:mr-2 text-teal-500"></i>Dati Spedizione</h3>
          <button onClick={() => { setEditing(editing === 'ship' ? null : 'ship'); setForm({ ...lead }); }} className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100">
            <i className={`fas ${editing === 'ship' ? 'fa-times' : 'fa-edit'} mr-1`}></i>{editing === 'ship' ? 'Chiudi' : 'Modifica'}
          </button>
        </div>
        {editing === 'ship' ? (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-2 sm:p-4 space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="shipDiff" checked={form.shippingDifferent} onChange={e => setForm({...form, shippingDifferent: e.target.checked})} className="w-4 h-4" />
              <label htmlFor="shipDiff" className="text-xs font-medium">Indirizzo diverso da fatturazione</label>
            </div>
            {form.shippingDifferent && (
              <div>
                <label className="block text-[10px] sm:text-xs font-medium mb-1">Via Spedizione</label>
                <input type="text" value={form.shippingStreet} onChange={e => setForm({...form, shippingStreet: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Città</label><input type="text" value={form.shippingCity} onChange={e => setForm({...form, shippingCity: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">CAP</label><input type="text" value={form.shippingZip} onChange={e => setForm({...form, shippingZip: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Provincia</label><input type="text" value={form.shippingProvince} onChange={e => setForm({...form, shippingProvince: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                  <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Stato</label><input type="text" value={form.shippingCountry} onChange={e => setForm({...form, shippingCountry: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Persona di Riferimento</label><input type="text" value={form.shippingPerson} onChange={e => setForm({...form, shippingPerson: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
              <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Cellulare</label><input type="text" value={form.shippingMobile} onChange={e => setForm({...form, shippingMobile: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 px-3 py-1.5 text-xs text-gray-600 border rounded-lg">Annulla</button>
              <button onClick={save} className="flex-1 px-3 py-1.5 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700"><i className="fas fa-save mr-1"></i>Salva</button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              <InfoRow label="Indirizzo Spedizione" value={lead.shippingDifferent ? `${lead.shippingStreet || ''}, ${lead.shippingCity || ''} ${lead.shippingZip || ''}` : '(Uguale a fatturazione)'} />
              <InfoRow label="Referente Spedizione" value={lead.shippingPerson || '-'} />
              <InfoRow label="Cellulare Spedizione" value={lead.shippingMobile || '-'} />
            </div>
          </div>
        )}
      </div>

      {/* CONDIZIONI ECONOMICHE */}
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="font-semibold text-gray-800 text-xs sm:text-lg"><i className="fas fa-handshake mr-1 sm:mr-2 text-amber-500"></i>Condizioni Economiche</h3>
          <button onClick={() => { setEditing(editing === 'econ' ? null : 'econ'); setForm({ ...lead }); }} className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100">
            <i className={`fas ${editing === 'econ' ? 'fa-times' : 'fa-edit'} mr-1`}></i>{editing === 'econ' ? 'Chiudi' : 'Modifica'}
          </button>
        </div>
        {editing === 'econ' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-4 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Prezzo Concordato</label><input type="text" value={form.agreedPrice} onChange={e => setForm({...form, agreedPrice: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" placeholder="Es: Listino, Speciale..." /></div>
              <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Sconto Concordato (%)</label><input type="number" min="0" max="100" value={form.agreedDiscount} onChange={e => setForm({...form, agreedDiscount: parseFloat(e.target.value) || 0})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" /></div>
            </div>
            <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Modalità Pagamento</label>
              <select value={form.agreedPaymentTerms} onChange={e => setForm({...form, agreedPaymentTerms: e.target.value})} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs">
                <option value="">Seleziona...</option>
                <option value="Transferencia 30 días">Bonifico 30 giorni</option>
                <option value="Transferencia 60 días">Bonifico 60 giorni</option>
                <option value="Transferencia 90 días">Bonifico 90 giorni</option>
                <option value="Pago anticipado">Pagamento anticipato</option>
                <option value="50% subito + 50% a 30 días">50% subito + 50% a 30gg</option>
                <option value="30% acconto + 70% alla consegna">30% acconto + 70% alla consegna</option>
                <option value="30% subito 35% a 30gg 35% a 60gg">30% subito + 35% a 30gg + 35% a 60gg</option>
                <option value="Personalizzato">Personalizzato</option>
              </select>
            </div>
            <div><label className="block text-[10px] sm:text-xs font-medium mb-1">Note Interne</label>
              <textarea value={form.internalNotes} onChange={e => setForm({...form, internalNotes: e.target.value})} rows={2} className="w-full border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs" placeholder="Note riservate..." />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 px-3 py-1.5 text-xs text-gray-600 border rounded-lg">Annulla</button>
              <button onClick={save} className="flex-1 px-3 py-1.5 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700"><i className="fas fa-save mr-1"></i>Salva</button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              <InfoRow label="Prezzo Concordato" value={lead.agreedPrice || 'Non definito'} />
              <InfoRow label="Sconto Concordato" value={lead.agreedDiscount > 0 ? `${lead.agreedDiscount}%` : 'Nessuno'} />
              <InfoRow label="Pagamento" value={lead.agreedPaymentTerms || lead.paymentTerms} />
              <InfoRow label="IGIC" value={`${lead.igicRate}%`} />
            </div>
            {lead.internalNotes && <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-2"><p className="text-[10px] sm:text-xs text-yellow-800"><i className="fas fa-sticky-note mr-1"></i>{lead.internalNotes}</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ STATISTICHE ORDINI ============ */
function OrderStatistics({ lead, orders, invoices, quotations }: { lead: Lead; orders: Order[]; invoices: Invoice[]; quotations: Quotation[] }) {
  const leadOrders = orders.filter((o: Order) => o.leadId === lead.id);
  const leadInvoices = invoices.filter((i: Invoice) => i.leadId === lead.id);
  const leadQuotations = quotations.filter((q: Quotation) => q.leadId === lead.id);
  const totalOrdered = leadOrders.reduce((s, o) => s + o.total, 0);
  const totalInvoiced = leadInvoices.reduce((s, i) => s + i.total, 0);
  const totalQuoted = leadQuotations.reduce((s, q) => s + q.total, 0);
  const avgOrderValue = leadOrders.length > 0 ? totalOrdered / leadOrders.length : 0;

  return (
    <div className="space-y-3 sm:space-y-6">
      <h3 className="font-semibold text-gray-800 text-xs sm:text-lg"><i className="fas fa-chart-pie mr-1 sm:mr-2 text-indigo-500"></i>Statistiche Commerciali</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-2 sm:p-4 border border-purple-200">
          <p className="text-[10px] sm:text-xs text-purple-600 font-medium uppercase">Preventivi</p>
          <p className="text-lg sm:text-2xl font-bold text-purple-700">{leadQuotations.length}</p>
          <p className="text-[10px] sm:text-xs text-purple-500">€{totalQuoted.toFixed(0)} totale</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-2 sm:p-4 border border-amber-200">
          <p className="text-[10px] sm:text-xs text-amber-600 font-medium uppercase">Ordini</p>
          <p className="text-lg sm:text-2xl font-bold text-amber-700">{leadOrders.length}</p>
          <p className="text-[10px] sm:text-xs text-amber-500">€{totalOrdered.toFixed(0)} totale</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-2 sm:p-4 border border-green-200">
          <p className="text-[10px] sm:text-xs text-green-600 font-medium uppercase">Fatturato</p>
          <p className="text-lg sm:text-2xl font-bold text-green-700">€{totalInvoiced.toFixed(0)}</p>
          <p className="text-[10px] sm:text-xs text-green-500">{leadInvoices.length} fatture</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-2 sm:p-4 border border-blue-200">
          <p className="text-[10px] sm:text-xs text-blue-600 font-medium uppercase">Media Ordine</p>
          <p className="text-lg sm:text-2xl font-bold text-blue-700">€{avgOrderValue.toFixed(0)}</p>
          <p className="text-[10px] sm:text-xs text-blue-500">per ordine</p>
        </div>
      </div>
      {leadOrders.length > 0 && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-2 sm:px-4 py-2 sm:py-3 border-b"><h4 className="text-[10px] sm:text-sm font-semibold text-gray-700"><i className="fas fa-list mr-1 sm:mr-2"></i>Storico Ordini</h4></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] sm:text-sm min-w-[400px]">
              <thead className="bg-gray-50 border-b"><tr><th className="text-left px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-xs font-semibold">N° Ordine</th><th className="text-left px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-xs font-semibold">Data</th><th className="text-center px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-xs font-semibold">Stato</th><th className="text-right px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-xs font-semibold">Importo</th></tr></thead>
              <tbody className="divide-y">
                {leadOrders.sort((a, b) => b.date.localeCompare(a.date)).map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-1 sm:py-2 font-medium text-amber-600 text-[10px] sm:text-xs font-mono">{o.number}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-2">{o.date}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-2 text-center"><span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${o.status === 'confirmed' ? 'bg-green-100 text-green-700' : o.status === 'completed' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{o.status}</span></td>
                    <td className="px-2 sm:px-4 py-1 sm:py-2 text-right font-semibold">€{o.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ HELPER ============ */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-1.5 sm:py-2 border-b border-gray-100">
      <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5">{label}</div>
      <div className="text-xs sm:text-sm font-medium break-words">{value}</div>
    </div>
  );
}

/* ============ QUOTATION MODAL ============ */
function QuotationModal({ lead, products, agents, docCounters, editQuotation, onClose, onSave }: { lead: Lead; products: Product[]; agents: Agent[]; docCounters: DocCounters; editQuotation?: Quotation | null; onClose: () => void; onSave: (q: Quotation) => void }) {
  const [lines, setLines] = useState(() => editQuotation?.lines.map(l => ({ ...l, selectedProduct: l.productName || '' })) || [{ id: '', description: '', quantity: 1, unitPrice: 0, discount: 0, subtotal: 0, selectedProduct: '' }]);
  const [globalDiscount, setGlobalDiscount] = useState(editQuotation?.discount || 0);
  const [applyIGIC, setApplyIGIC] = useState(editQuotation?.applyIGIC !== false);
  const [agentId, setAgentId] = useState(editQuotation?.agentId || lead.agentId || '');
  const [paymentTerm, setPaymentTerm] = useState(editQuotation?.paymentTerms || lead.agreedPaymentTerms || lead.paymentTerms || 'Transferencia 30 días');
  const [notes, setNotes] = useState(editQuotation?.notes || '');
  const [billingAddress, setBillingAddress] = useState(`${lead.billingStreet || ''}, ${lead.billingCity || ''} ${lead.billingZip || ''}, ${lead.billingProvince || ''}, ${lead.billingCountry || ''}`);

  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice * (1 - l.discount / 100), 0) * (1 - globalDiscount / 100);
  const igicAmount = applyIGIC ? subtotal * (lead.igicRate / 100) : 0;
  const total = subtotal + igicAmount;
  const today = new Date().toISOString().split('T')[0];
  const docNumber = editQuotation?.number || formatDocNumber('PRES', docCounters.quotation + 1, lead.name, today);

  const updateLine = (idx: number, field: string, value: any) => setLines(lines.map((l, i) => i === idx ? { ...l, [field]: value } : l));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white z-10">
          <h2 className="text-sm font-semibold"><i className="fas fa-file-invoice-dollar mr-2 text-purple-500"></i>{editQuotation ? 'Editar' : 'Nuevo'} Presupuesto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2"><i className="fas fa-times"></i></button>
        </div>
        <div className="p-3 space-y-3">
          <div className="bg-purple-50 rounded-lg p-2 grid grid-cols-1 gap-2 text-[10px] sm:text-sm">
            <div><strong>Numero:</strong> <span className="font-mono text-purple-700">{docNumber}</span></div>
            <div><strong>Cliente:</strong> {lead.name} {lead.company ? `- ${lead.company}` : ''}</div>
            <div><strong>Data:</strong> {editQuotation?.date || today}</div>
            <div><strong>Valido fino al:</strong> {new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]}</div>
            <div><strong>Email:</strong> {lead.email}</div>
            <div><strong>Tel:</strong> {lead.phone}</div>
            <div><strong>NIF:</strong> {lead.nif || '-'}</div>
            <div><strong>IGIC:</strong> {lead.igicRate}%</div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1"><strong>Indirizzo Fatturazione:</strong></label>
              <input type="text" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="w-full border border-purple-200 rounded px-2 py-1 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div><label className="block text-[10px] sm:text-sm font-medium mb-1">Agente</label>
              <select value={agentId} onChange={(e) => setAgentId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] sm:text-xs">
                <option value="">Sin asignar</option>{agents.map((a: Agent) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div><label className="block text-[10px] sm:text-sm font-medium mb-1">Pagamento</label>
              <select value={paymentTerm} onChange={(e) => setPaymentTerm(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] sm:text-xs">
                <option value="Transferencia 30 días">Bonifico 30 giorni</option>
                <option value="Transferencia 60 días">Bonifico 60 giorni</option>
                <option value="Transferencia 90 días">Bonifico 90 giorni</option>
                <option value="Pago anticipado">Pagamento anticipato</option>
                <option value="50% subito + 50% a 30 días">50% + 50% a 30gg</option>
                <option value="30% acconto + 70% alla consegna">30% + 70% consegna</option>
                <option value="30% subito 35% a 30gg 35% a 60gg">30% + 35% a 30gg + 35% a 60gg</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700">Linee Preventivo</h4>
            <div className="hidden sm:flex items-center gap-2 px-2 text-xs font-semibold text-gray-600">
              <div className="w-36">Prodotto</div><div className="flex-1">Descrizione</div><div className="w-16 text-center">Quantità</div><div className="w-20 text-center">Prezzo €</div><div className="w-24 text-right">Totale</div><div className="w-6"></div>
            </div>
            {lines.map((line, idx) => (
              <div key={idx} className="bg-gray-50 p-2 rounded-lg space-y-2">
                <div className="sm:hidden space-y-2">
                  <select value={line.selectedProduct || ''} onChange={(e) => { const productName = e.target.value; const product = products.find(p => p.name === productName); if (product) { setLines(lines.map((l, i) => i === idx ? { ...l, description: product.lineas, unitPrice: product.price, selectedProduct: productName, productName: product.name } : l)); } else { setLines(lines.map((l, i) => i === idx ? { ...l, selectedProduct: '', description: '', unitPrice: 0, productName: undefined } : l)); } }} className="w-full border border-gray-200 rounded px-2 py-1.5 text-[10px] bg-white">
                    <option value="">-- Magazzino --</option>{products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  <input type="text" value={line.description} onChange={(e) => updateLine(idx, 'description', e.target.value)} placeholder="Descrizione..." className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs" />
                  <div className="grid grid-cols-3 gap-2">
                    <div><label className="text-[10px] text-gray-600">Qtà</label><input type="number" min="1" value={line.quantity} onChange={(e) => updateLine(idx, 'quantity', parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-center" /></div>
                    <div><label className="text-[10px] text-gray-600">Prezzo</label><input type="number" step="0.01" value={line.unitPrice} onChange={(e) => updateLine(idx, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-center" /></div>
                    <div><label className="text-[10px] text-gray-600">Totale</label><div className="text-xs font-medium py-1.5 text-right">€{(line.quantity * line.unitPrice * (1 - line.discount / 100)).toFixed(2)}</div></div>
                  </div>
                  {lines.length > 1 && <button onClick={() => setLines(lines.filter((_, i) => i !== idx))} className="w-full text-red-400 hover:text-red-600 text-xs py-1"><i className="fas fa-trash mr-1"></i>Elimina</button>}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <select value={line.selectedProduct || ''} onChange={(e) => { const productName = e.target.value; const product = products.find(p => p.name === productName); if (product) { setLines(lines.map((l, i) => i === idx ? { ...l, description: product.lineas, unitPrice: product.price, selectedProduct: productName, productName: product.name } : l)); } else { setLines(lines.map((l, i) => i === idx ? { ...l, selectedProduct: '', description: '', unitPrice: 0, productName: undefined } : l)); } }} className="w-36 border border-gray-200 rounded px-2 py-1.5 text-xs bg-white">
                    <option value="">-- Magazzino --</option>{products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  <input type="text" value={line.description} onChange={(e) => updateLine(idx, 'description', e.target.value)} placeholder="Descrizione..." className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm" />
                  <input type="number" min="1" value={line.quantity} onChange={(e) => updateLine(idx, 'quantity', parseInt(e.target.value) || 0)} className="w-16 border border-gray-200 rounded px-2 py-1.5 text-sm text-center" />
                  <input type="number" step="0.01" value={line.unitPrice} onChange={(e) => updateLine(idx, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-20 border border-gray-200 rounded px-2 py-1.5 text-sm text-center" />
                  <span className="text-sm font-medium w-24 text-right">€{(line.quantity * line.unitPrice * (1 - line.discount / 100)).toFixed(2)}</span>
                  {lines.length > 1 && <button onClick={() => setLines(lines.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600"><i className="fas fa-trash"></i></button>}
                </div>
              </div>
            ))}
            <button onClick={() => setLines([...lines, { id: '', description: '', quantity: 1, unitPrice: 0, discount: 0, subtotal: 0, selectedProduct: '' }])} className="w-full sm:w-auto text-xs text-purple-600 hover:text-purple-800 py-2 border border-purple-200 rounded-lg"><i className="fas fa-plus mr-1"></i>Añadir línea</button>
          </div>
          <div><label className="block text-sm font-medium mb-1">Note</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Note per il cliente..." /></div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-xs sm:text-sm"><span>Imponibile:</span><span>€{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs sm:text-sm"><span>Sconto:</span>
              <div className="flex items-center gap-1"><input type="number" min="0" max="100" value={globalDiscount} onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)} className="w-16 border border-gray-200 rounded px-2 py-1 text-xs text-right" /><span className="text-xs">%</span></div>
            </div>
            <div className="flex items-center gap-2"><input type="checkbox" id="applyIGIC_q" checked={applyIGIC} onChange={(e) => setApplyIGIC(e.target.checked)} className="w-4 h-4" /><label htmlFor="applyIGIC_q" className="text-xs sm:text-sm">Applicare IGIC ({lead.igicRate}%)</label></div>
            {applyIGIC ? (<>
              <div className="flex justify-between text-xs sm:text-sm"><span>IGIC ({lead.igicRate}%):</span><span>€{igicAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2"><span>Totale:</span><span className="text-purple-600">€{total.toFixed(2)}</span></div>
            </>) : (<>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-[10px] sm:text-xs text-yellow-800">Esenzione IGIC</div>
              <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2"><span>Totale:</span><span className="text-purple-600">€{subtotal.toFixed(2)}</span></div>
            </>)}
          </div>
          <div className="flex gap-2 pt-2 sticky bottom-0 bg-white pb-3 border-t">
            <button onClick={onClose} className="flex-1 px-3 py-2 text-xs text-gray-600 border rounded-lg">Cancelar</button>
            {editQuotation && (
              <button onClick={() => { const printWindow = window.open('', '_blank'); if (printWindow) { const html = generateProfessionalPDF('PREVENTIVO', docNumber, editQuotation?.date || today, { name: lead.name, company: lead.company, address: billingAddress, email: lead.email, phone: lead.phone, nif: lead.nif }, lines.map(l => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, total: l.quantity * l.unitPrice * (1 - l.discount / 100) })), { subtotal: subtotal, igic: applyIGIC ? igicAmount : undefined, igicRate: applyIGIC ? lead.igicRate : undefined, total: total }, { paymentTerms: paymentTerm, notes: notes }); printWindow.document.write(html); printWindow.document.close(); printWindow.print(); } }} className="flex-1 px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
            )}
            <button onClick={() => { onSave({ id: editQuotation?.id || `q${Date.now()}`, number: docNumber, leadId: lead.id, contactName: lead.name, contactEmail: lead.email, contactCompany: lead.company, date: editQuotation?.date || today, validDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], lines: lines.map((l, i) => ({ id: l.id || `l${i}`, description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, discount: l.discount, subtotal: l.quantity * l.unitPrice * (1 - l.discount / 100), productName: l.selectedProduct || undefined })), status: editQuotation?.status || 'draft', total, discount: globalDiscount, notes, paymentTerms: paymentTerm, revisionHistory: editQuotation?.revisionHistory || [], applyIGIC, agentId, billingAddress: billingAddress }); }} className="flex-1 px-3 py-2 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700"><i className="fas fa-save mr-1"></i>{editQuotation ? 'Actualizar' : 'Crear'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ ORDER MODAL ============ */
function OrderModal({ lead, quotation, editingOrder, products, agents, docCounters, onClose, onSave }: { lead: Lead; quotation: Quotation | null; editingOrder?: Order | null; products: Product[]; agents: Agent[]; docCounters: DocCounters; onClose: () => void; onSave: (o: Order) => void }) {
  const [lines, setLines] = useState(() => { if (editingOrder) return editingOrder.lines.map(l => ({ ...l, selectedProduct: l.productName || '' })); if (quotation) return quotation.lines.map(l => ({ ...l, selectedProduct: l.productName || '', productName: l.productName })); return [{ id: '', description: '', quantity: 1, unitPrice: 0, discount: 0, subtotal: 0, selectedProduct: '' }]; });
  const [applyIGIC, setApplyIGIC] = useState(true);
  const [agentId, setAgentId] = useState(editingOrder?.agentId || lead.agentId || '');
  const [paymentTerm, setPaymentTerm] = useState(editingOrder?.paymentTerms || quotation?.paymentTerms || lead.agreedPaymentTerms || lead.paymentTerms || 'Transferencia 30 días');
  const [notes, setNotes] = useState(editingOrder?.notes || '');
  const [shippingAddress, setShippingAddress] = useState(editingOrder?.shippingAddress || (lead.shippingDifferent ? `${lead.shippingStreet || ''}, ${lead.shippingCity || ''} ${lead.shippingZip || ''}` : `${lead.billingStreet || ''}, ${lead.billingCity || ''} ${lead.billingZip || ''}`) || '');
  const [shippingContact, setShippingContact] = useState(editingOrder?.shippingContact || lead.shippingPerson || lead.name || '');
  const [shippingPhone, setShippingPhone] = useState(editingOrder?.shippingPhone || lead.shippingMobile || lead.phone || '');
  const [deliveryDate, setDeliveryDate] = useState(editingOrder?.deliveryDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);

  const updateLine = (idx: number, field: string, value: any) => setLines(lines.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice * (1 - l.discount / 100), 0);
  const igicAmount = applyIGIC ? subtotal * (lead.igicRate / 100) : 0;
  const total = subtotal + igicAmount;
  const today = new Date().toISOString().split('T')[0];
  const docNumber = editingOrder?.number || formatDocNumber('PED', docCounters.order + 1, lead.name, today);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b bg-amber-50"><h2 className="text-lg font-semibold text-amber-800"><i className="fas fa-shopping-cart mr-2"></i>{editingOrder ? 'Editar' : 'Nuevo'} Pedido</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button></div>
        <div className="p-4 space-y-4">
          <div className="bg-amber-50 rounded-lg p-3 grid grid-cols-2 gap-3 text-sm border border-amber-200">
            <div><strong>Numero:</strong> <span className="font-mono text-amber-700">{docNumber}</span></div>
            <div><strong>Cliente:</strong> {lead.name} {lead.company ? `- ${lead.company}` : ''}</div>
            <div><strong>Data:</strong> {editingOrder?.date || today}</div>
            <div><label className="block text-xs font-medium mb-1"><strong>Consegna:</strong></label><input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full border border-amber-200 rounded px-2 py-1 text-sm" /></div>
            {quotation && <div className="col-span-2"><strong>Da Preventivo:</strong> <span className="font-mono">{quotation.number}</span></div>}
            <div className="col-span-2"><label className="block text-xs font-medium mb-1"><strong>Indirizzo Spedizione:</strong></label><input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="w-full border border-amber-200 rounded px-2 py-1 text-sm" /></div>
            <div><label className="block text-xs font-medium mb-1"><strong>Referente:</strong></label><input type="text" value={shippingContact} onChange={(e) => setShippingContact(e.target.value)} className="w-full border border-amber-200 rounded px-2 py-1 text-sm" /></div>
            <div><label className="block text-xs font-medium mb-1"><strong>Telefono:</strong></label><input type="text" value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} className="w-full border border-amber-200 rounded px-2 py-1 text-sm" /></div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-36"><label className="block text-sm font-medium mb-1">Agente</label>
              <select value={agentId} onChange={(e) => setAgentId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs">
                <option value="">Sin asignar</option>{agents.map((a: Agent) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="w-48"><label className="block text-sm font-medium mb-1">Pagamento</label>
              <select value={paymentTerm} onChange={(e) => setPaymentTerm(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs">
                <option value="Transferencia 30 días">Bonifico 30 giorni</option><option value="Transferencia 60 días">Bonifico 60 giorni</option><option value="Transferencia 90 días">Bonifico 90 giorni</option><option value="Pago anticipado">Pagamento anticipato</option><option value="50% subito + 50% a 30 días">50% + 50% a 30gg</option><option value="30% acconto + 70% alla consegna">30% + 70% consegna</option><option value="30% subito 35% a 30gg 35% a 60gg">30% + 35% a 30gg + 35% a 60gg</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Linee Ordine</h4>
            <div className="flex items-center gap-2 px-2 text-xs font-semibold text-gray-600">
              <div className="w-36">Prodotto</div><div className="flex-1">Descrizione</div><div className="w-16 text-center">Quantità</div><div className="w-20 text-center">Prezzo €</div><div className="w-24 text-right">Totale</div><div className="w-6"></div>
            </div>
            {lines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                <select value={line.selectedProduct || ''} onChange={(e) => { const productName = e.target.value; const product = products.find(p => p.name === productName); if (product) { setLines(lines.map((l, i) => i === idx ? { ...l, description: product.lineas, unitPrice: product.price, selectedProduct: productName, productName: product.name } : l)); } else { setLines(lines.map((l, i) => i === idx ? { ...l, selectedProduct: '', description: '', unitPrice: 0, productName: undefined } : l)); } }} className="w-36 border border-gray-200 rounded px-2 py-1.5 text-xs bg-white">
                  <option value="">-- Magazzino --</option>{products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <input type="text" value={line.description} onChange={(e) => updateLine(idx, 'description', e.target.value)} placeholder="Descrizione..." className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm" />
                <input type="number" min="1" value={line.quantity} onChange={(e) => updateLine(idx, 'quantity', parseInt(e.target.value) || 0)} className="w-16 border border-gray-200 rounded px-2 py-1.5 text-sm text-center" />
                <input type="number" step="0.01" value={line.unitPrice} onChange={(e) => updateLine(idx, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-20 border border-gray-200 rounded px-2 py-1.5 text-sm text-center" />
                <span className="text-sm font-medium w-24 text-right">€{(line.quantity * line.unitPrice * (1 - line.discount / 100)).toFixed(2)}</span>
                {lines.length > 1 && <button onClick={() => setLines(lines.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600"><i className="fas fa-trash"></i></button>}
              </div>
            ))}
            <button onClick={() => setLines([...lines, { id: '', description: '', quantity: 1, unitPrice: 0, discount: 0, subtotal: 0, selectedProduct: '' }])} className="text-xs text-amber-600 hover:text-amber-800"><i className="fas fa-plus mr-1"></i>Añadir línea</button>
          </div>
          <div><label className="block text-sm font-medium mb-1">Note</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm"><span>Imponibile:</span><span>€{subtotal.toFixed(2)}</span></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="applyIGIC_o" checked={applyIGIC} onChange={(e) => setApplyIGIC(e.target.checked)} className="w-4 h-4" /><label htmlFor="applyIGIC_o" className="text-sm">Applicare IGIC ({lead.igicRate}%)</label></div>
            {applyIGIC ? (<>
              <div className="flex justify-between text-sm"><span>IGIC ({lead.igicRate}%):</span><span>€{igicAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Totale:</span><span className="text-amber-600">€{total.toFixed(2)}</span></div>
            </>) : (<>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">Esenzione IGIC</div>
              <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Totale:</span><span className="text-amber-600">€{subtotal.toFixed(2)}</span></div>
            </>)}
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancelar</button>
            {editingOrder && (
              <button onClick={() => { const printWindow = window.open('', '_blank'); if (printWindow) { const html = generateProfessionalPDF('ORDINE', docNumber, editingOrder?.date || today, { name: lead.name, company: lead.company, address: shippingAddress, email: lead.email, phone: lead.phone, nif: lead.nif }, lines.map(l => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, total: l.quantity * l.unitPrice * (1 - l.discount / 100) })), { subtotal: subtotal, igic: applyIGIC ? igicAmount : undefined, igicRate: applyIGIC ? lead.igicRate : undefined, total: total }, { paymentTerms: paymentTerm, deliveryDate: deliveryDate, notes: notes }); printWindow.document.write(html); printWindow.document.close(); printWindow.print(); } }} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"><i className="fas fa-file-pdf mr-2"></i>Stampa PDF</button>
            )}
            <button onClick={() => { onSave({ id: editingOrder?.id || `o${Date.now()}`, number: docNumber, leadId: lead.id, quotationId: editingOrder?.quotationId || quotation?.id || '', contactName: lead.name, contactEmail: lead.email, contactCompany: lead.company, date: editingOrder?.date || today, deliveryDate: deliveryDate, lines: lines.map((l, i) => ({ id: l.id || `ol${i}`, description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, discount: l.discount, subtotal: l.quantity * l.unitPrice * (1 - l.discount / 100), productName: l.selectedProduct || undefined })), status: editingOrder?.status || 'confirmed', total, discount: editingOrder?.discount || 0, notes, paymentTerms: paymentTerm, shippingAddress: shippingAddress, shippingContact: shippingContact, shippingPhone: shippingPhone, agentId, applyIGIC }); }} className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700"><i className="fas fa-check mr-2"></i>{editingOrder ? 'Actualizar' : 'Confirmar'} Pedido</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ INVOICE MODAL ============ */
function InvoiceModal({ lead, order, docCounters, onClose, onSave }: { lead: Lead; order: Order | null; docCounters: DocCounters; onClose: () => void; onSave: (i: Invoice) => void }) {
  const [applyIGIC, setApplyIGIC] = useState(true);
  const [paymentTerm, setPaymentTerm] = useState(lead.agreedPaymentTerms || lead.paymentTerms || 'Transferencia 30 días');
  const [billingAddress, setBillingAddress] = useState(`${lead.billingStreet || ''}, ${lead.billingCity || ''} ${lead.billingZip || ''}, ${lead.billingProvince || ''}, ${lead.billingCountry || ''}`);
  const lines = order?.lines || [{ description: '', quantity: 1, unitPrice: 0, discount: 0, subtotal: 0 }];
  const subtotal = lines.reduce((s, l) => s + l.subtotal, 0);
  const igicAmount = applyIGIC ? subtotal * (lead.igicRate / 100) : 0;
  const total = subtotal + igicAmount;
  const today = new Date().toISOString().split('T')[0];
  const docNumber = formatDocNumber('FAT', docCounters.invoice + 1, lead.name, today);

  const generateInstallments = (term: string, totalAmount: number, baseDate: string): any[] => {
    const base = new Date(baseDate);
    if (term === '50% subito + 50% a 30 días') {
      const due2 = new Date(base); due2.setDate(due2.getDate() + 30);
      return [{ id: `inst1_${Date.now()}`, amount: totalAmount * 0.5, percentage: 50, dueDate: baseDate, status: 'pending' as const }, { id: `inst2_${Date.now()}`, amount: totalAmount * 0.5, percentage: 50, dueDate: due2.toISOString().split('T')[0], status: 'pending' as const }];
    }
    if (term === '30% acconto + 70% alla consegna') {
      const due2 = new Date(base); due2.setDate(due2.getDate() + 14);
      return [{ id: `inst1_${Date.now()}`, amount: totalAmount * 0.3, percentage: 30, dueDate: baseDate, status: 'pending' as const }, { id: `inst2_${Date.now()}`, amount: totalAmount * 0.7, percentage: 70, dueDate: due2.toISOString().split('T')[0], status: 'pending' as const }];
    }
    if (term === '30% subito 35% a 30gg 35% a 60gg') {
      const due2 = new Date(base); due2.setDate(due2.getDate() + 30); const due3 = new Date(base); due3.setDate(due3.getDate() + 60);
      return [{ id: `inst1_${Date.now()}`, amount: totalAmount * 0.30, percentage: 30, dueDate: baseDate, status: 'pending' as const }, { id: `inst2_${Date.now()}`, amount: totalAmount * 0.35, percentage: 35, dueDate: due2.toISOString().split('T')[0], status: 'pending' as const }, { id: `inst3_${Date.now()}`, amount: totalAmount * 0.35, percentage: 35, dueDate: due3.toISOString().split('T')[0], status: 'pending' as const }];
    }
    const days = term.includes('30') ? 30 : term.includes('60') ? 60 : term.includes('90') ? 90 : 0; const due = new Date(base); due.setDate(due.getDate() + days);
    return [{ id: `inst1_${Date.now()}`, amount: totalAmount, percentage: 100, dueDate: due.toISOString().split('T')[0], status: 'pending' as const }];
  };
  const installments = generateInstallments(paymentTerm, total, today);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b bg-indigo-50"><h2 className="text-lg font-semibold text-indigo-800"><i className="fas fa-file-invoice mr-2"></i>Nueva Factura</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button></div>
        <div className="p-4 space-y-4">
          <div className="bg-indigo-50 rounded-lg p-3 grid grid-cols-2 gap-3 text-sm border border-indigo-200">
            <div><strong>Numero:</strong> <span className="font-mono text-indigo-700">{docNumber}</span></div>
            <div><strong>Cliente:</strong> {lead.name} {lead.company ? `- ${lead.company}` : ''}</div>
            <div><strong>Data:</strong> {today}</div>
            <div><strong>Pagamento:</strong> {paymentTerm}</div>
            {order && <div className="col-span-2"><strong>Da Ordine:</strong> <span className="font-mono">{order.number}</span></div>}
            <div className="col-span-2"><label className="block text-xs font-medium mb-1"><strong>Indirizzo Fatturazione:</strong></label><input type="text" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="w-full border border-indigo-200 rounded px-2 py-1 text-sm" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Modalità di Pagamento</label>
            <select value={paymentTerm} onChange={(e) => setPaymentTerm(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="Transferencia 30 días">Bonifico 30 giorni</option><option value="Transferencia 60 días">Bonifico 60 giorni</option><option value="Transferencia 90 días">Bonifico 90 giorni</option><option value="Pago anticipado">Pagamento anticipato</option><option value="50% subito + 50% a 30 días">50% subito + 50% a 30 giorni</option><option value="30% acconto + 70% alla consegna">30% acconto + 70% alla consegna</option><option value="30% subito 35% a 30gg 35% a 60gg">30% + 35% a 30gg + 35% a 60gg</option>
            </select>
          </div>
          <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Prodotto</th><th className="text-left px-3 py-2">Descrizione</th><th className="text-right px-3 py-2">Cant.</th><th className="text-right px-3 py-2">Prezzo</th><th className="text-right px-3 py-2">Total</th></tr></thead>
            <tbody>{lines.map((l: any, i) => <tr key={i} className="border-b"><td className="px-3 py-2 text-purple-600 text-xs">{l.productName || '-'}</td><td className="px-3 py-2">{l.description}</td><td className="px-3 py-2 text-right">{l.quantity}</td><td className="px-3 py-2 text-right">€{l.unitPrice?.toFixed(2)}</td><td className="px-3 py-2 text-right">€{l.subtotal.toFixed(2)}</td></tr>)}</tbody>
          </table>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm"><span>Imponibile:</span><span>€{subtotal.toFixed(2)}</span></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="applyIGIC_i" checked={applyIGIC} onChange={(e) => setApplyIGIC(e.target.checked)} className="w-4 h-4" /><label htmlFor="applyIGIC_i" className="text-sm">Applicare IGIC ({lead.igicRate}%)</label></div>
            {applyIGIC ? (<>
              <div className="flex justify-between text-sm"><span>IGIC ({lead.igicRate}%):</span><span>€{igicAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Totale:</span><span className="text-indigo-600">€{total.toFixed(2)}</span></div>
            </>) : (<>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">Esenzione IGIC</div>
              <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Totale:</span><span className="text-indigo-600">€{subtotal.toFixed(2)}</span></div>
            </>)}
          </div>
          {installments.length > 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-3"><i className="fas fa-calendar-alt mr-2"></i>Piano di Pagamento - {paymentTerm}</h4>
              <div className="space-y-2">
                {installments.map((inst, idx) => (
                  <div key={inst.id} className="flex items-center justify-between bg-white rounded p-2 border">
                    <span className="text-sm font-medium">Rata {idx + 1} ({inst.percentage}%)</span>
                    <span className="text-sm">Scadenza: <strong>{inst.dueDate}</strong></span>
                    <span className="text-sm font-bold text-blue-700">€{inst.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancelar</button>
            <button onClick={() => { const printWindow = window.open('', '_blank'); if (printWindow) { const html = generateProfessionalPDF('FATTURA', docNumber, today, { name: lead.name, company: lead.company, address: billingAddress, email: lead.email, phone: lead.phone, nif: lead.nif }, lines.map((l: any) => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, total: l.subtotal })), { subtotal: subtotal, igic: applyIGIC ? igicAmount : undefined, igicRate: applyIGIC ? lead.igicRate : undefined, total: total }, { paymentTerms: paymentTerm, installments: installments.length > 1 ? installments.map(inst => ({ percentage: inst.percentage, amount: inst.amount, dueDate: inst.dueDate })) : undefined }); printWindow.document.write(html); printWindow.document.close(); printWindow.print(); } }} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"><i className="fas fa-file-pdf mr-2"></i>Stampa PDF</button>
            <button onClick={() => { onSave({ id: `i${Date.now()}`, number: docNumber, leadId: lead.id, orderId: order?.id, contactName: lead.name, contactEmail: lead.email, contactCompany: lead.company, date: today, dueDate: installments[installments.length - 1].dueDate, lines: lines.map((l: any) => ({ ...l })), status: 'sent', total, type: 'out_invoice', notes: '', agentId: lead.agentId, applyIGIC, igicRate: lead.igicRate, paymentTerms: paymentTerm, installments }); }} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"><i className="fas fa-paper-plane mr-2"></i>Emitir</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ DDT MODAL ============ */
function DDTModal({ lead, order, docCounters, carriers, onClose, onSave }: { lead: Lead; order: Order | null; docCounters: DocCounters; carriers: any[]; onClose: () => void; onSave: (d: DDT) => void }) {
  const [shippingAddress, setShippingAddress] = useState(lead.shippingDifferent ? `${lead.shippingStreet || ''}, ${lead.shippingCity || ''} ${lead.shippingZip || ''}, ${lead.shippingProvince || ''}, ${lead.shippingCountry || ''}` : `${lead.billingStreet || ''}, ${lead.billingCity || ''} ${lead.billingZip || ''}, ${lead.billingProvince || ''}, ${lead.billingCountry || ''}`);
  const lines = order?.lines.map(l => ({ description: l.description, quantity: l.quantity, unit: 'ud', productName: l.productName })) || [{ description: '', quantity: 1, unit: 'ud' }];
  const today = new Date().toISOString().split('T')[0];
  const docNumber = formatDocNumber('DDT', docCounters.ddt + 1, lead.name, today);
  const [goodsQuantity, setGoodsQuantity] = useState(0);
  const [goodsUnit, setGoodsUnit] = useState<'kg' | 'litri' | 'pz'>('kg');
  const [packagesPallets, setPackagesPallets] = useState(0);
  const [packagesBuckets, setPackagesBuckets] = useState(0);
  const [selectedCarrierId, setSelectedCarrierId] = useState('');
  const [customCarrier, setCustomCarrier] = useState('');
  const [transportReason, setTransportReason] = useState('Venta');
  const carrierName = selectedCarrierId === 'custom' ? customCarrier : (carriers.find(c => c.id === selectedCarrierId)?.name || '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b bg-teal-50"><h2 className="text-lg font-semibold text-teal-800"><i className="fas fa-truck mr-2"></i>Nuevo Albarán (DDT)</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button></div>
        <div className="p-4 space-y-4">
          <div className="bg-teal-50 rounded-lg p-3 grid grid-cols-2 gap-3 text-sm border border-teal-200">
            <div><strong>Numero:</strong> <span className="font-mono text-teal-700">{docNumber}</span></div>
            <div><strong>Cliente:</strong> {lead.name}</div>
            <div><strong>Data:</strong> {today}</div>
            <div><strong>Causale Trasporto:</strong>
              <select value={transportReason} onChange={(e) => setTransportReason(e.target.value)} className="ml-2 border border-teal-200 rounded px-2 py-1 text-xs">
                <option value="Venta">Vendita</option><option value="Conto visione">Conto visione</option><option value="Reso">Reso</option><option value="Riparazione">Riparazione</option><option value="Omaggio">Omaggio</option>
              </select>
            </div>
            {order && <div className="col-span-2"><strong>Da Ordine:</strong> <span className="font-mono">{order.number}</span></div>}
            <div className="col-span-2"><label className="block text-xs font-medium mb-1"><strong>Indirizzo Spedizione:</strong></label><input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="w-full border border-teal-200 rounded px-2 py-1 text-sm" /></div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3"><i className="fas fa-boxes mr-2 text-teal-600"></i>Dati Merce e Imballaggio</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="flex-1"><label className="block text-xs font-medium mb-1 text-gray-600">Quantità Merce</label><input type="number" min="0" value={goodsQuantity} onChange={(e) => setGoodsQuantity(parseFloat(e.target.value) || 0)} className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm" /></div>
                <div className="w-24 pt-5"><select value={goodsUnit} onChange={(e) => setGoodsUnit(e.target.value as any)} className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"><option value="kg">kg</option><option value="litri">litri</option><option value="pz">pz</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs font-medium mb-1 text-gray-600">Colli / Pallet</label><input type="number" min="0" value={packagesPallets} onChange={(e) => setPackagesPallets(parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm" /></div>
                <div><label className="block text-xs font-medium mb-1 text-gray-600">Secchi</label><input type="number" min="0" value={packagesBuckets} onChange={(e) => setPackagesBuckets(parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm" /></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3"><i className="fas fa-truck mr-2 text-teal-600"></i>Trasportatore</h4>
            <div className="space-y-2">
              <select value={selectedCarrierId} onChange={(e) => setSelectedCarrierId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="">Seleziona trasportatore...</option>
                {carriers.filter((c: any) => c.active).map((c: any) => (<option key={c.id} value={c.id}>{c.name} - {c.phone}</option>))}
                <option value="custom">✏️ Altro (inserisci manualmente)</option>
              </select>
              {selectedCarrierId === 'custom' && (<input type="text" value={customCarrier} onChange={(e) => setCustomCarrier(e.target.value)} placeholder="Nome trasportatore..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3"><i className="fas fa-list mr-2 text-teal-600"></i>Merce in Trasporto</h4>
            <table className="w-full text-sm">
              <thead className="bg-gray-100"><tr><th className="text-left px-3 py-2 text-xs font-semibold">Prodotto</th><th className="text-left px-3 py-2 text-xs font-semibold">Descripción</th><th className="text-right px-3 py-2 text-xs font-semibold">Cantidad</th><th className="text-left px-3 py-2 text-xs font-semibold">Unidad</th></tr></thead>
              <tbody>{lines.map((l, i) => <tr key={i} className="border-b border-gray-200"><td className="px-3 py-2 text-purple-600 text-xs">{(l as any).productName || '-'}</td><td className="px-3 py-2">{l.description}</td><td className="px-3 py-2 text-right">{l.quantity}</td><td className="px-3 py-2">{l.unit}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-teal-800"><i className="fas fa-truck mr-2"></i>Trasporto</span>
              <span className="font-medium">{carrierName || 'Non assegnato'}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border rounded-lg">Cancelar</button>
            <button onClick={() => { const printWindow = window.open('', '_blank'); if (printWindow) { const html = generateProfessionalPDF('DDT', docNumber, today, { name: lead.name, company: lead.company, address: shippingAddress, email: lead.email, phone: lead.phone, nif: lead.nif }, lines.map(l => ({ description: l.description, quantity: l.quantity, total: l.quantity, unit: l.unit })), { subtotal: 0, total: 0 }, { carrier: carrierName, goodsQuantity: goodsQuantity, goodsUnit: goodsUnit, packagesPallets: packagesPallets, packagesBuckets: packagesBuckets, transportReason: transportReason, orderRef: order?.number }); printWindow.document.write(html); printWindow.document.close(); printWindow.print(); } }} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"><i className="fas fa-file-pdf mr-2"></i>Stampa PDF</button>
            <button onClick={() => { onSave({ id: `d${Date.now()}`, number: docNumber, leadId: lead.id, orderId: order?.id, contactName: lead.name, contactEmail: lead.email, contactCompany: lead.company, contactAddress: shippingAddress, date: today, lines, status: 'sent', transportReason: transportReason, carrier: carrierName, carrierId: selectedCarrierId === 'custom' ? undefined : selectedCarrierId, trackingNumber: '', notes: '', goodsQuantity, goodsUnit, packagesPallets, packagesBuckets }); }} className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700"><i className="fas fa-paper-plane mr-2"></i>Emitir</button>
          </div>
        </div>
      </div>
    </div>
  );
}