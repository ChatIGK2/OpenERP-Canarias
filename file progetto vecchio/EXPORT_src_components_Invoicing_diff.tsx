--- EXPORT_src_components_Invoicing.tsx (原始)


+++ EXPORT_src_components_Invoicing.tsx (修改后)
import { useState } from 'react';
import { Invoice, Lead, Quotation, Order, Product, StockMove, DocCounters } from '../types';
import { currentUser } from '../data';
import { Language } from '../i18n';

interface InvoicingProps {
  invoices: Invoice[];
  leads: Lead[];
  quotations: Quotation[];
  orders: Order[];
  products: Product[];
  setInvoices: (i: Invoice[]) => void;
  setProducts: (p: Product[]) => void;
  setStockMoves: (m: StockMove[]) => void;
  docCounters: DocCounters;
  setDocCounters: (c: DocCounters) => void;
  language: Language;
}

export default function Invoicing({ invoices, leads, orders, products, setInvoices, setProducts, setStockMoves, docCounters, setDocCounters, language }: InvoicingProps) {
  const [showCreditNote, setShowCreditNote] = useState(false);
  const [showEInvoice, setShowEInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const formatDocNumber = (prefix: string, counter: number, clientName: string, date: string): string => {
    const num = String(counter).padStart(4, '0');
    const dateStr = date.replace(/-/g, '').slice(2);
    return `${prefix}.${num}.${clientName.replace(/\s+/g, '_').slice(0, 15)}.${dateStr}`;
  };

  const handleCreditNote = (invoice: Invoice) => {
    const today = new Date().toISOString().split('T')[0];
    const creditNumber = formatDocNumber('NC', docCounters.invoice + 1, invoice.contactName, today);

    // Crea nota di credito
    const creditNote: Invoice = {
      ...invoice,
      id: `cn${Date.now()}`,
      number: creditNumber,
      date: today,
      dueDate: today,
      type: 'credit_note',
      status: 'sent',
      total: -invoice.total, // Negativo
    };

    setInvoices([...invoices, creditNote]);
    setDocCounters({ ...docCounters, invoice: docCounters.invoice + 1 });

    // Ricarica magazzino
    const newMoves: StockMove[] = invoice.lines.map((l, i) => ({
      id: `sm${Date.now()}_${i}`,
      productId: products.find(p => p.name === l.productName)?.id || '',
      productName: l.productName || '',
      type: 'in',
      quantity: l.quantity,
      date: today,
      reference: creditNumber,
      reason: `Nota di credito per fattura ${invoice.number}`,
      user: currentUser,
      moveType: 'auto_credit_note',
    }));

    setStockMoves([...newMoves]);

    // Aggiorna stock
    const updatedProducts = products.map(p => {
      const line = invoice.lines.find(l => l.productName === p.name);
      if (line) {
        return { ...p, stock: p.stock + line.quantity };
      }
      return p;
    });
    setProducts(updatedProducts);

    alert(`Nota di credito ${creditNumber} emessa. Magazzino ricaricato.`);
    setShowCreditNote(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-gray-500">Total Facturado</p><p className="text-2xl font-bold text-blue-600">€{invoices.filter(i => i.type !== 'credit_note').reduce((s, i) => s + i.total, 0).toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-gray-500">Pagadas</p><p className="text-2xl font-bold text-green-600">€{invoices.filter(i => i.status === 'paid' && i.type !== 'credit_note').reduce((s, i) => s + i.total, 0).toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-gray-500">Por Cobrar</p><p className="text-2xl font-bold text-orange-600">€{invoices.filter(i => i.status === 'sent' && i.type !== 'credit_note').reduce((s, i) => s + i.total, 0).toLocaleString()}</p></div>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => setShowEInvoice(true)} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
          <i className="fas fa-file-invoice mr-2"></i>Fattura Elettronica
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold">Numero</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Cliente</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Fecha</th>
              <th className="text-right px-4 py-3 text-xs font-semibold">Total</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Estado</th>
              <th className="text-center px-4 py-3 text-xs font-semibold">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoices.map(i => (
              <tr key={i.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-purple-600 font-mono text-xs">{i.number}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`text-xs px-2 py-1 rounded-full ${i.type === 'credit_note' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {i.type === 'credit_note' ? 'Nota Credito' : 'Fattura'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{i.contactName}</td>
                <td className="px-4 py-3 text-sm">{i.date}</td>
                <td className={`px-4 py-3 text-sm text-right font-semibold ${i.type === 'credit_note' ? 'text-red-600' : ''}`}>
                  {i.type === 'credit_note' ? '-' : ''}€{Math.abs(i.total).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={i.status}
                    onChange={(e) => setInvoices(invoices.map(x => x.id === i.id ? { ...x, status: e.target.value as any } : x))}
                    className={`text-xs px-2 py-1 rounded-full border-0 ${
                      i.status === 'paid' ? 'bg-green-100 text-green-700' :
                      i.status === 'credit_note' ? 'bg-red-100 text-red-700' :
                      i.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    <option value="sent">Non saldata</option>
                    <option value="paid">Saldata</option>
                    <option value="credit_note">Nota di credito</option>
                    <option value="cancelled">Annullata</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  {i.type !== 'credit_note' && (
                    <button onClick={() => { setSelectedInvoice(i); setShowCreditNote(true); }} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100">
                      <i className="fas fa-undo mr-1"></i>Nota Credito
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nota di Credito */}
      {showCreditNote && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b bg-red-50">
              <h2 className="text-lg font-semibold text-red-800"><i className="fas fa-undo mr-2"></i>Emetti Nota di Credito</h2>
              <button onClick={() => { setShowCreditNote(false); setSelectedInvoice(null); }} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                <p><strong>Fattura originale:</strong> {selectedInvoice.number}</p>
                <p><strong>Cliente:</strong> {selectedInvoice.contactName}</p>
                <p><strong>Importo:</strong> €{selectedInvoice.total.toFixed(2)}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Questa operazione emetterà una nota di credito e ricaricherà automaticamente il magazzino con i prodotti della fattura.
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => { setShowCreditNote(false); setSelectedInvoice(null); }} className="px-4 py-2 text-sm text-gray-600">Annulla</button>
                <button onClick={() => handleCreditNote(selectedInvoice)} className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                  <i className="fas fa-check mr-2"></i>Conferma Nota di Credito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Fattura Elettronica */}
      {showEInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b bg-indigo-50">
              <h2 className="text-lg font-semibold text-indigo-800"><i className="fas fa-file-invoice mr-2"></i>Fatturazione Elettronica</h2>
              <button onClick={() => setShowEInvoice(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2"><i className="fas fa-info-circle mr-2"></i>Sistema di Fatturazione Elettronica</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Il sistema si connette tramite API al servizio di fatturazione elettronica per l'invio delle fatture all'Agenzia delle Entrate / Sistema SdI.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><strong>Provider:</strong> Aruba PEC / InfoCert</div>
                  <div><strong>Formato:</strong> FPA12 (XML)</div>
                  <div><strong>Codice Destinatario:</strong> Configurabile</div>
                  <div><strong>Stato:</strong> <span className="text-green-600">Connesso</span></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Seleziona Fatture da Inviare</label>
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  {invoices.filter(i => i.status === 'sent' && i.type !== 'credit_note').length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Nessuna fattura da inviare</div>
                  ) : (
                    invoices.filter(i => i.status === 'sent' && i.type !== 'credit_note').map(inv => (
                      <div key={inv.id} className="flex items-center justify-between p-3 border-b hover:bg-gray-50">
                        <div>
                          <p className="text-sm font-medium font-mono">{inv.number}</p>
                          <p className="text-xs text-gray-500">{inv.contactName} - €{inv.total.toFixed(2)}</p>
                        </div>
                        <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                          <i className="fas fa-paper-plane mr-1"></i>Invia
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-2">Configurazione API</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium mb-1">Endpoint API</label><input type="text" defaultValue="https://api.fatturapa.gov.it/v1" className="w-full border rounded px-2 py-1.5 text-xs" /></div>
                  <div><label className="block text-xs font-medium mb-1">API Key</label><input type="password" defaultValue="••••••••" className="w-full border rounded px-2 py-1.5 text-xs" /></div>
                  <div><label className="block text-xs font-medium mb-1">Codice Destinatario</label><input type="text" defaultValue="0000000" className="w-full border rounded px-2 py-1.5 text-xs" /></div>
                  <div><label className="block text-xs font-medium mb-1">PEC</label><input type="text" defaultValue="azienda@pec.it" className="w-full border rounded px-2 py-1.5 text-xs" /></div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowEInvoice(false)} className="px-4 py-2 text-sm text-gray-600">Chiudi</button>
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                  <i className="fas fa-sync mr-2"></i>Invia Selezionate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
