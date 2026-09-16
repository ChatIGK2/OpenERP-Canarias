export type ModuleType = 'dashboard' | 'contacts' | 'inventory' | 'orders' | 'invoicing' | 'accounting' | 'email' | 'settings' | 'agents' | 'users' | 'carriers' | 'company';
export type ContactType = 'private' | 'company';
export type LeadStage = 'new' | 'contacted' | 'meeting' | 'proposal' | 'order' | 'negotiation' | 'won' | 'lost';

export interface Agent {
  id: string; name: string; email: string; phone: string; active: boolean; createdAt: string;
}

export interface Lead {
  id: string; name: string; firstName: string; lastName: string; company: string;
  email: string; phone: string;
  // Indirizzo fatturazione suddiviso
  billingStreet: string; billingCity: string; billingZip: string; billingProvince: string; billingCountry: string;
  // Indirizzo spedizione suddiviso
  shippingStreet: string; shippingCity: string; shippingZip: string; shippingProvince: string; shippingCountry: string;
  shippingPhone: string; paymentTerms: string;
  nif: string; nie: string; nieType: 'NIE' | 'DNI' | 'PASSAPORTO' | 'CARTA_DI_IDENTITA';
  bankInfo: string; igicRate: number;
  stage: LeadStage; source: string; assignedTo: string; agentId: string; notes: string;
  createdAt: string; expectedRevenue: number; probability: number;
  linkedQuotations: string[]; linkedOrders: string[]; linkedInvoices: string[]; linkedDDTs: string[];
  contactType: ContactType;
  shippingDifferent: boolean; shippingPerson: string; shippingMobile: string;
  agreedPrice: string; agreedPaymentTerms: string; agreedDiscount: number;
  internalNotes: string;
  salesActivities: SalesActivity[];
  // Nuovi campi
  pec: string; // Email PEC
  uniqueCode: string; // Codice univoco
  secondEmail: string; // Seconda email
  secondPhone: string; // Secondo telefono
  taxCode: string; // Codice fiscale (per privati)
  // Campi aziendali
  companyVAT: string; // Partita IVA
}

export interface HistoryEntry { id: string; leadId: string; date: string; user: string; type: string; title: string; description: string; }
export interface LeadEmail { id: string; leadId: string; from: string; to: string; subject: string; body: string; template: string; date: string; direction: 'outgoing' | 'incoming'; status: 'sent' | 'draft'; }
export interface Meeting { id: string; leadId: string; title: string; date: string; time: string; location: string; attendees: string; notes: string; type: 'presenziale' | 'telefonata' | 'videochiamata'; }

// Attività Pro Vendita
export interface SalesActivity {
  id: string;
  leadId: string;
  agentId: string;
  type: 'call' | 'email' | 'note' | 'reminder' | 'meeting' | 'visit';
  title: string;
  description: string;
  date: string;
  time?: string;
  duration?: number; // in minuti
  status: 'planned' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  createdBy: string;
}

export interface Quotation {
  id: string; number: string; leadId: string; contactName: string; contactEmail: string; contactCompany: string;
  date: string; validDate: string; lines: QuotationLine[];
  status: 'draft' | 'sent' | 'confirmed' | 'revised' | 'cancelled' | 'ordered';
  total: number; discount: number; notes: string; paymentTerms: string;
  revisionHistory: any[]; applyIGIC?: boolean; agentId: string; confirmedAt?: string;
  billingAddress?: string;
}
export interface QuotationLine { id: string; description: string; quantity: number; unitPrice: number; discount: number; subtotal: number; productName?: string; }

export interface Order {
  id: string; number: string; leadId: string; quotationId: string;
  contactName: string; contactEmail: string; contactCompany: string;
  date: string; deliveryDate: string; lines: OrderLine[];
  status: 'draft' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  total: number; discount: number; notes: string; paymentTerms: string;
  shippingAddress: string; shippingContact: string; shippingPhone: string; agentId: string;
  applyIGIC?: boolean;
}
export interface OrderLine { id: string; description: string; quantity: number; unitPrice: number; discount: number; subtotal: number; productName?: string; }

export interface Invoice {
  id: string; number: string; leadId: string; quotationId?: string; orderId?: string;
  contactName: string; contactEmail: string; contactCompany: string;
  date: string; dueDate: string; lines: InvoiceLine[];
  status: 'draft' | 'sent' | 'paid' | 'cancelled' | 'credit_note';
  total: number; type: 'out_invoice' | 'in_invoice' | 'credit_note'; notes: string; agentId: string;
  applyIGIC?: boolean; igicRate?: number;
  paymentTerms: string; // Modalità di pagamento
  installments?: Installment[]; // Rate di pagamento
}

export interface Installment {
  id: string;
  amount: number;
  percentage: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid';
}
export interface InvoiceLine { description: string; quantity: number; unitPrice: number; discount: number; subtotal: number; productName?: string; }

export interface Carrier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  active: boolean;
}

export interface DDT {
  id: string; number: string; leadId: string; quotationId?: string; orderId?: string;
  contactName: string; contactEmail: string; contactCompany: string; contactAddress: string;
  date: string; lines: DDTLine[];
  status: 'draft' | 'sent' | 'delivered' | 'cancelled';
  transportReason: string; carrier: string; carrierId?: string; trackingNumber: string; notes: string;
  // Nuovi campi DDT
  goodsQuantity: number;
  goodsUnit: 'kg' | 'litri' | 'pz';
  packagesPallets: number;
  packagesBuckets: number;
  transportCost?: number;
}
export interface DDTLine { description: string; quantity: number; unit: string; productName?: string; }

export interface Product { id: string; name: string; lineas: string; sku: string; price: number; cost: number; stock: number; minStock: number; category: string; }
export interface StockMove { id: string; productId: string; productName: string; type: 'in' | 'out'; quantity: number; date: string; reference: string; reason: string; user: string; moveType: 'auto_invoice' | 'auto_credit_note' | 'manual_in' | 'manual_out'; }
export interface JournalEntry { id: string; date: string; reference: string; journal: string; debit: number; credit: number; account: string; description: string; }
export interface EmailCampaign { id: string; name: string; subject: string; status: 'draft' | 'sent' | 'scheduled'; recipients: number; sentCount: number; openedCount: number; clickedCount: number; createdAt: string; }
export interface EmailTemplate { id: string; name: string; subject: string; body: string; type: string; }

export interface DocCounters {
  quotation: number;
  order: number;
  invoice: number;
  ddt: number;
}
