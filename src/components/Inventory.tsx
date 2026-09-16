import { useState } from 'react';
import { Product, StockMove } from '../types';
import { currentUser } from '../data/mock-data';
import { Language } from '../i18n';
import { Plus, Search, Edit2, Trash2, Package, AlertTriangle, ArrowDown, ArrowUp, History } from 'lucide-react';

export default function Inventory({ products, stockMoves, setProducts, setStockMoves, language }: { 
  products: Product[]; 
  stockMoves: StockMove[]; 
  setProducts: (p: Product[]) => void; 
  setStockMoves: (m: StockMove[]) => void; 
  language: Language 
}) {
  const [showNew, setShowNew] = useState(false);
  const [showStockIn, setShowStockIn] = useState(false);
  const [showStockOut, setShowStockOut] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLineas, setNewLineas] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newMinStock, setNewMinStock] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newUnit, setNewUnit] = useState<'pz' | 'kg' | 'l' | 'm' | 'hora'>('pz');
  const [newTaxRate, setNewTaxRate] = useState('21');
  
  // Carico/Scarico manuale
  const [moveProduct, setMoveProduct] = useState('');
  const [moveQuantity, setMoveQuantity] = useState('');
  const [moveReason, setMoveReason] = useState('');
  const [isAdmin] = useState(true); // Simulazione admin

  const handleStockIn = () => {
    if (!moveProduct || !moveQuantity || !moveReason) {
      alert('Compila tutti i campi. La giustificazione è obbligatoria per movimenti manuali.');
      return;
    }
    const product = products.find(p => p.name === moveProduct);
    if (!product) return;
    
    const qty = parseInt(moveQuantity);
    const today = new Date().toISOString().split('T')[0];
    
    // Aggiorna stock
    setProducts(products.map(p => p.name === moveProduct ? { ...p, stock: p.stock + qty } : p));
    
    // Registra movimento
    const newMove: StockMove = {
      id: `sm${Date.now()}`,
      productId: product.id,
      productName: product.name,
      type: 'in',
      quantity: qty,
      date: today,
      reference: `CARICO-MANUALE-${Date.now().toString().slice(-6)}`,
      reason: moveReason,
      user: currentUser,
      moveType: 'manual_in',
    };
    setStockMoves([...stockMoves, newMove]);
    
    setMoveProduct('');
    setMoveQuantity('');
    setMoveReason('');
    setShowStockIn(false);
    alert(`Carico di ${qty} unità di ${moveProduct} registrato.`);
  };

  const handleStockOut = () => {
    if (!moveProduct || !moveQuantity || !moveReason) {
      alert('Compila tutti i campi. La giustificazione è obbligatoria per movimenti manuali.');
      return;
    }
    const product = products.find(p => p.name === moveProduct);
    if (!product) return;
    
    const qty = parseInt(moveQuantity);
    if (qty > product.stock) {
      alert(`Stock insufficiente! Disponibile: ${product.stock}`);
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Aggiorna stock
    setProducts(products.map(p => p.name === moveProduct ? { ...p, stock: p.stock - qty } : p));
    
    // Registra movimento
    const newMove: StockMove = {
      id: `sm${Date.now()}`,
      productId: product.id,
      productName: product.name,
      type: 'out',
      quantity: qty,
      date: today,
      reference: `SCARICO-MANUALE-${Date.now().toString().slice(-6)}`,
      reason: moveReason,
      user: currentUser,
      moveType: 'manual_out',
    };
    setStockMoves([...stockMoves, newMove]);
    
    setMoveProduct('');
    setMoveQuantity('');
    setMoveReason('');
    setShowStockOut(false);
    alert(`Scarico di ${qty} unità di ${moveProduct} registrato.`);
  };

  return (
    <div className="p-6 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Productos</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Valor Almacén</p>
          <p className="text-2xl font-bold text-blue-600">€{products.reduce((s, p) => s + p.stock * p.cost, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Stock Bajo</p>
          <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.stock <= p.minStock).length}</p>
        </div>
      </div>

      {/* Azioni Magazzino */}
      <div className="flex flex-wrap gap-2 justify-end">
        <button onClick={() => setShowStockIn(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
          <ArrowDown className="w-4 h-4" />
          Carico Magazzino
        </button>
        {isAdmin && (
          <button onClick={() => setShowStockOut(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
            <ArrowUp className="w-4 h-4" />
            Scarico Manuale (Admin)
          </button>
        )}
        <button onClick={() => setShowHistory(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700">
          <History className="w-4 h-4" />
          Storico Movimenti
        </button>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      {/* Tabella prodotti */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap">Lineas</th>
                <th className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap">Codice</th>
                <th className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap">Categoria</th>
                <th className="text-right px-4 py-3 text-xs font-semibold whitespace-nowrap">Precio</th>
                <th className="text-right px-4 py-3 text-xs font-semibold whitespace-nowrap">Costo</th>
                <th className="text-right px-4 py-3 text-xs font-semibold whitespace-nowrap">Stock</th>
                <th className="text-right px-4 py-3 text-xs font-semibold whitespace-nowrap">Min</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className={`hover:bg-gray-50 ${p.stock <= p.minStock ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <p>{p.name}</p>
                        {p.stock <= p.minStock && (
                          <p className="text-xs text-amber-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Stock bajo
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs" title={p.lineas}>
                    <div className="truncate">{p.lineas}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{p.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{p.category}</td>
                  <td className="px-4 py-3 text-sm text-right whitespace-nowrap">€{p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right whitespace-nowrap">€{p.cost.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold whitespace-nowrap ${p.stock <= p.minStock ? 'text-red-600' : 'text-green-600'}`}>{p.stock}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500 whitespace-nowrap">{p.minStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuovo Prodotto */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" />
                Nuevo Producto
              </h2>
              <button onClick={() => setShowNew(false)} className="text-gray-400 hover:text-gray-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nombre *</label><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Lineas (Descripción) *</label><textarea value={newLineas} onChange={(e) => setNewLineas(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Codice</label><input type="text" value={newSku} onChange={(e) => setNewSku(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1">Prezzo (€) *</label><input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} step="0.01" className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium mb-1">Costo (€)</label><input type="number" value={newCost} onChange={(e) => setNewCost(e.target.value)} step="0.01" className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1">Stock *</label><input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium mb-1">Stock Mínimo *</label><input type="number" value={newMinStock} onChange={(e) => setNewMinStock(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1">Categoría *</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">Seleccionar...</option>
                    <option value="Isolamento termico">Isolamento termico</option>
                    <option value="Additivi edilizia">Additivi edilizia</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Unidad *</label>
                  <select value={newUnit} onChange={(e) => setNewUnit(e.target.value as 'pz' | 'kg' | 'l' | 'm' | 'hora')} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="pz">Piezas</option>
                    <option value="kg">Kilogramos</option>
                    <option value="l">Litros</option>
                    <option value="m">Metros</option>
                    <option value="hora">Horas</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-sm font-medium mb-1">IVA (%)</label><input type="number" value={newTaxRate} onChange={(e) => setNewTaxRate(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div className="flex justify-end gap-3">
                <button onClick={() => { setNewName(''); setNewLineas(''); setNewSku(''); setNewPrice(''); setNewCost(''); setNewStock(''); setNewMinStock(''); setNewCategory(''); setNewUnit('pz'); setNewTaxRate('21'); setShowNew(false); }} className="px-4 py-2 text-sm text-gray-600">Cancelar</button>
                <button onClick={() => {
                  if (!newName || !newLineas || !newPrice || !newStock || !newMinStock || !newCategory) { alert('Completa todos los campos obligatorios'); return; }
                  const newProduct: Product = { 
                    id: `p${Date.now()}`, 
                    name: newName, 
                    lineas: newLineas, 
                    sku: newSku, 
                    price: parseFloat(newPrice) || 0, 
                    cost: parseFloat(newCost) || 0, 
                    stock: parseInt(newStock) || 0, 
                    minStock: parseInt(newMinStock) || 0, 
                    category: newCategory,
                    unit: newUnit,
                    taxRate: parseInt(newTaxRate) || 21,
                    active: true,
                    description: newLineas
                  };
                  setProducts([...products, newProduct]);
                  setNewName(''); setNewLineas(''); setNewSku(''); setNewPrice(''); setNewCost(''); setNewStock(''); setNewMinStock(''); setNewCategory(''); setNewUnit('pz'); setNewTaxRate('21'); setShowNew(false);
                }} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Carico Magazzino */}
      {showStockIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b bg-green-50">
              <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                <ArrowDown className="w-5 h-5" />
                Carico Magazzino
              </h2>
              <button onClick={() => setShowStockIn(false)} className="text-gray-400 hover:text-gray-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Il carico manuale richiede una giustificazione obbligatoria. Tutti i movimenti sono registrati nello storico.
              </div>
              <div><label className="block text-sm font-medium mb-1">Prodotto *</label>
                <select value={moveProduct} onChange={(e) => setMoveProduct(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">Seleziona prodotto...</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name} (Stock: {p.stock})</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1">Quantità *</label>
                <input type="number" min="1" value={moveQuantity} onChange={(e) => setMoveQuantity(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Quantità da caricare" />
              </div>
              <div><label className="block text-sm font-medium mb-1">Giustificazione / Motivo *</label>
                <textarea value={moveReason} onChange={(e) => setMoveReason(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Es: Reso fornitore, Errore conteggio precedente, Rifornimento straordinario..." />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowStockIn(false)} className="px-4 py-2 text-sm text-gray-600">Annulla</button>
                <button onClick={handleStockIn} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Conferma Carico
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Scarico Manuale (Admin) */}
      {showStockOut && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b bg-red-50">
              <h2 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                <ArrowUp className="w-5 h-5" />
                Scarico Manuale (Solo Admin)
              </h2>
              <button onClick={() => setShowStockOut(false)} className="text-gray-400 hover:text-gray-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                ATTENZIONE: Questa operazione è riservata all'amministratore. Lo scarico manuale sarà registrato con giustificazione obbligatoria.
              </div>
              <div><label className="block text-sm font-medium mb-1">Prodotto *</label>
                <select value={moveProduct} onChange={(e) => setMoveProduct(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">Seleziona prodotto...</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name} (Stock: {p.stock})</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1">Quantità *</label>
                <input type="number" min="1" value={moveQuantity} onChange={(e) => setMoveQuantity(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Quantità da scaricare" />
              </div>
              <div><label className="block text-sm font-medium mb-1">Giustificazione / Motivo *</label>
                <textarea value={moveReason} onChange={(e) => setMoveReason(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Es: Danno, Obsoleto, Campione gratuito, Errore..." />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowStockOut(false)} className="px-4 py-2 text-sm text-gray-600">Annulla</button>
                <button onClick={handleStockOut} className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center gap-2">
                  <ArrowUp className="w-4 h-4" />
                  Conferma Scarico
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Storico Movimenti */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-gray-500" />
                Storico Movimenti Magazzino
              </h2>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {stockMoves.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Package className="w-12 h-12 mx-auto mb-2" />
                  <p>Nessun movimento registrato</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-semibold">Data</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold">Tipo</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold">Prodotto</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold">Qtà</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold">Riferimento</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold">Giustificazione</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold">Utente</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stockMoves.sort((a, b) => b.date.localeCompare(a.date)).map(m => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">{m.date}</td>
                        <td className="px-3 py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            m.moveType === 'auto_invoice' ? 'bg-blue-100 text-blue-700' :
                            m.moveType === 'auto_credit_note' ? 'bg-red-100 text-red-700' :
                            m.moveType === 'manual_in' ? 'bg-green-100 text-green-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {m.moveType === 'auto_invoice' ? 'Scarico Fattura' :
                             m.moveType === 'auto_credit_note' ? 'Carico Nota Credito' :
                             m.moveType === 'manual_in' ? 'Carico Manuale' : 'Scarico Manuale'}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-medium">{m.productName}</td>
                        <td className={`px-3 py-2 text-right font-semibold ${m.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                          {m.type === 'in' ? '+' : '-'}{m.quantity}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-500 font-mono">{m.reference}</td>
                        <td className="px-3 py-2 text-xs">{m.reason}</td>
                        <td className="px-3 py-2 text-xs text-gray-500">{m.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}