--- EXPORT_src_i18n.ts (原始)


+++ EXPORT_src_i18n.ts (修改后)
export type Language = 'it' | 'es';

export const translations = {
  it: {
    // Sidebar
    dashboard: 'Dashboard',
    contacts: 'Contatti',
    inventory: 'Magazzino',
    orders: 'Ordini',
    invoicing: 'Fatturazione',
    accounting: 'Contabilità',
    email: 'Email Marketing',
    agents: 'Agenti',
    settings: 'Impostazioni',

    // Common
    search: 'Cerca',
    save: 'Salva',
    cancel: 'Annulla',
    edit: 'Modifica',
    delete: 'Elimina',
    create: 'Crea',
    close: 'Chiudi',
    print: 'Stampa',
    total: 'Totale',

    // Dashboard
    searchClient: 'Cerca Cliente',
    searchPlaceholder: 'Cerca per nome, azienda o email...',

    // Contacts
    totalContacts: 'Totale Contatti',
    individuals: 'Particolari',
    companies: 'Aziende',
    newContact: 'Nuovo Contatto',
    viewCard: 'Vedi Scheda',

    // Documents
    quotation: 'Preventivo',
    order: 'Ordine',
    invoice: 'Fattura',
    ddt: 'DDT',

    // Status
    draft: 'Bozza',
    sent: 'Inviato',
    confirmed: 'Confermato',
    paid: 'Pagato',
    pending: 'In attesa',

    // Actions
    newQuotation: 'Nuovo Preventivo',
    newOrder: 'Nuovo Ordine',
    newInvoice: 'Nuova Fattura',
    newDDT: 'Nuovo DDT',
  },
  es: {
    // Sidebar
    dashboard: 'Dashboard',
    contacts: 'Contactos',
    inventory: 'Almacén',
    orders: 'Pedidos',
    invoicing: 'Facturación',
    accounting: 'Contabilidad',
    email: 'Email Marketing',
    agents: 'Agentes',
    settings: 'Configuración',

    // Common
    search: 'Buscar',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    create: 'Crear',
    close: 'Cerrar',
    print: 'Imprimir',
    total: 'Total',

    // Dashboard
    searchClient: 'Buscar Cliente',
    searchPlaceholder: 'Buscar por nombre, empresa o email...',

    // Contacts
    totalContacts: 'Total Contactos',
    individuals: 'Particulares',
    companies: 'Empresas',
    newContact: 'Nuevo Contacto',
    viewCard: 'Ver Ficha',

    // Documents
    quotation: 'Presupuesto',
    order: 'Pedido',
    invoice: 'Factura',
    ddt: 'Albarán',

    // Status
    draft: 'Borrador',
    sent: 'Enviado',
    confirmed: 'Confirmado',
    paid: 'Pagado',
    pending: 'Pendiente',

    // Actions
    newQuotation: 'Nuevo Presupuesto',
    newOrder: 'Nuevo Pedido',
    newInvoice: 'Nueva Factura',
    newDDT: 'Nuevo Albarán',
  },
};

export function t(key: keyof typeof translations.it, lang: Language): string {
  return translations[lang][key] || key;
}
