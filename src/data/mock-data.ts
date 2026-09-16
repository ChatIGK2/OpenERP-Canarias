import { 
  Lead, HistoryEntry, LeadEmail, Meeting, Quotation, Order, Invoice, DDT, 
  EmailTemplate, Product, StockMove, JournalEntry, EmailCampaign, Agent, Carrier 
} from '../types';

// Current user ID (riferimento all'admin)
export const currentUserId = '1';
export const currentUser = 'admin';

// Company info
export const companyEmail = 'comercial@openerp-canarias.es';
export const companyName = 'OpenERP Canarias S.L.';
export const companyAddress = 'Calle León 25, 35001 Las Palmas de Gran Canaria';
export const companyNIF = 'B76123456';

// Dati aziendali completi per PDF
export interface CompanyData {
  name: string;
  nif: string;
  address: string;
  email: string;
  pec: string;
  phone: string;
  uniqueCode: string;
  vat: string;
  registerNumber: string;
  website: string;
  iban: string;
  bankName: string;
  swift: string;
  logo: string;
}

export let companyData: CompanyData = {
  name: 'OpenERP Canarias S.L.',
  nif: 'B76123456',
  address: 'Calle León 25, 35001 Las Palmas de Gran Canaria',
  email: 'comercial@openerp-canarias.es',
  pec: 'openerp@pec.es',
  phone: '+34 928 123 456',
  uniqueCode: 'A1B2C3D',
  vat: 'ESB76123456',
  registerNumber: 'GC-12345',
  website: 'www.openerp-canarias.es',
  iban: 'ES91 2100 0418 4502 0005 1332',
  bankName: 'CaixaBank',
  swift: 'CAIXESBBXXX',
  logo: '',
};

export function updateCompanyData(data: CompanyData): void {
  companyData = data;
}

// Email templates
export const emailTemplates: EmailTemplate[] = [
  { 
    id: 'tpl-first', 
    name: 'Primer Contacto', 
    subject: 'Presentación OpenERP Canarias', 
    body: 'Estimado/a {{CLIENTE}},\n\nNos complace contactarle.\n\nSaludos,\n{{UTENTE}}', 
    type: 'first_contact' 
  },
  { 
    id: 'tpl-quotation', 
    name: 'Envío Presupuesto', 
    subject: 'Presupuesto n. {{NUMERO}}', 
    body: 'Estimado/a {{CLIENTE}},\n\nLe adjuntamos el presupuesto.\n\nSaludos,\n{{UTENTE}}', 
    type: 'quotation' 
  },
];

// Initial agents
export const initialAgents: Agent[] = [
  { id: '1', name: 'Marco Bianchi', email: 'marco@openerp-canarias.es', phone: '+34 600 111 222', active: true, createdAt: '2024-01-01' },
  { id: '2', name: 'Ana García', email: 'ana@openerp-canarias.es', phone: '+34 600 333 444', active: true, createdAt: '2024-01-01' },
  { id: '3', name: 'Carlos Rodríguez', email: 'carlos@openerp-canarias.es', phone: '+34 600 555 666', active: true, createdAt: '2024-01-01' },
];

// Initial leads
export const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'Mario Rossi',
    firstName: 'Mario',
    lastName: 'Rossi',
    company: 'Rossi SRL',
    email: 'mario@rossi.it',
    phone: '+34 928 123 456',
    billingStreet: 'Calle León 25',
    billingCity: 'Las Palmas',
    billingZip: '35001',
    billingProvince: 'Las Palmas',
    billingCountry: 'España',
    shippingStreet: 'Calle León 25',
    shippingCity: 'Las Palmas',
    shippingZip: '35001',
    shippingProvince: 'Las Palmas',
    shippingCountry: 'España',
    shippingPhone: '+34 928 123 456',
    paymentTerms: 'Transferencia 30 días',
    nif: 'B12345678',
    nie: '',
    nieType: 'NIE',
    bankInfo: 'ES9121000418450200051332',
    igicRate: 7,
    stage: 'proposal',
    source: 'Web',
    assignedTo: 'Marco Bianchi',
    agentId: '1',
    notes: '',
    createdAt: '2024-01-15',
    expectedRevenue: 25000,
    probability: 70,
    linkedQuotations: [],
    linkedOrders: [],
    linkedInvoices: [],
    linkedDDTs: [],
    contactType: 'company',
    shippingDifferent: false,
    shippingPerson: 'Mario Rossi',
    shippingMobile: '+34 928 123 456',
    agreedPrice: 'Prezzo di listino',
    agreedPaymentTerms: 'Transferencia 30 días',
    agreedDiscount: 0,
    internalNotes: '',
    salesActivities: [],
    pec: 'rossi.srl@pec.it',
    uniqueCode: 'AZ001',
    secondEmail: 'info@rossi.it',
    secondPhone: '+34 928 987 654',
    taxCode: '',
    companyVAT: 'ESB12345678'
  },
  {
    id: '2',
    name: 'Laura Bianchi',
    firstName: 'Laura',
    lastName: 'Bianchi',
    company: 'Bianchi SpA',
    email: 'laura@bianchi.it',
    phone: '+34 922 765 432',
    billingStreet: 'Avenida Marítima 120',
    billingCity: 'Puerto de la Cruz',
    billingZip: '38400',
    billingProvince: 'Santa Cruz de Tenerife',
    billingCountry: 'España',
    shippingStreet: 'Avenida Marítima 120',
    shippingCity: 'Puerto de la Cruz',
    shippingZip: '38400',
    shippingProvince: 'Santa Cruz de Tenerife',
    shippingCountry: 'España',
    shippingPhone: '+34 922 765 432',
    paymentTerms: 'Transferencia 60 días',
    nif: 'A87654321',
    nie: '',
    nieType: 'NIE',
    bankInfo: 'ES7921000813610123456789',
    igicRate: 7,
    stage: 'meeting',
    source: 'Feria',
    assignedTo: 'Marco Bianchi',
    agentId: '2',
    notes: '',
    createdAt: '2024-02-20',
    expectedRevenue: 48000,
    probability: 50,
    linkedQuotations: [],
    linkedOrders: [],
    linkedInvoices: [],
    linkedDDTs: [],
    contactType: 'company',
    shippingDifferent: false,
    shippingPerson: 'Laura Bianchi',
    shippingMobile: '+34 922 765 432',
    agreedPrice: 'Da concordare',
    agreedPaymentTerms: 'Transferencia 60 días',
    agreedDiscount: 5,
    internalNotes: '',
    salesActivities: [],
    pec: 'bianchi.spa@pec.it',
    uniqueCode: 'AZ002',
    secondEmail: 'amministrazione@bianchi.it',
    secondPhone: '+34 922 111 222',
    taxCode: '',
    companyVAT: 'ESA87654321'
  },
];

// Initial data arrays
export const initialHistory: HistoryEntry[] = [];
export const initialLeadEmails: LeadEmail[] = [];
export const initialMeetings: Meeting[] = [];
export const initialQuotations: Quotation[] = [];
export const initialOrders: Order[] = [];
export const initialInvoices: Invoice[] = [];
export const initialDDTs: DDT[] = [];

// Initial products
export const initialProducts: Product[] = [
  { 
    id: '1', 
    name: 'Econanotherm', 
    lineas: 'Isolante termico ad alta densità per pareti', 
    sku: 'ECON-001', 
    price: 50, 
    cost: 25, 
    stock: 100, 
    minStock: 10, 
    category: 'Isolamento termico' 
  },
  { 
    id: '2', 
    name: 'Additivo Cemento', 
    lineas: 'Additivo per migliorare la lavorabilità del cemento', 
    sku: 'ADD-001', 
    price: 30, 
    cost: 15, 
    stock: 200, 
    minStock: 20, 
    category: 'Additivi edilizia' 
  },
];

export const initialStockMoves: StockMove[] = [];
export const initialJournalEntries: JournalEntry[] = [];
export const initialEmailCampaigns: EmailCampaign[] = [];

// Document counters
export const initialDocCounters = {
  quotation: 0,
  order: 0,
  invoice: 0,
  ddt: 0,
};

// Initial carriers
export const initialCarriers: Carrier[] = [
  { 
    id: '1', 
    name: 'Trasporti Veloci SRL', 
    phone: '+34 600 111 222', 
    email: 'info@trasportiveloci.es', 
    address: 'Calle Mayor 10, Las Palmas', 
    active: true 
  },
  { 
    id: '2', 
    name: 'Express Canarias', 
    phone: '+34 600 333 444', 
    email: 'contact@expresscanarias.es', 
    address: 'Avenida Marítima 50, Las Palmas', 
    active: true 
  },
  { 
    id: '3', 
    name: 'Logística Insular', 
    phone: '+34 600 555 666', 
    email: 'info@logisticainsular.es', 
    address: 'Polígono Industrial Zona Franca, Las Palmas', 
    active: true 
  },
];