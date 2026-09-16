--- src/components/Inventory.tsx (原始)
import React, { useState } from 'react';
import { Product, User } from '../types';
import { Plus, Search, Edit2, Trash2, Package, AlertTriangle } from 'lucide-react';
import { generateId, logAudit } from '../utils/security';

interface InventoryProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  user: User;
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts, user }) => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const emptyProduct = { name: '', sku: '', price: 0, cost: 0, stock: 0, minStock: 0, category: '', unit: 'pz', taxRate: 21, active: true, description: '' };
  const [formData, setFormData] = useState(emptyProduct);

  const filtered = products.filter(p => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!formData.name || !formData.sku) { alert('Nombre y SKU son obligatorios'); return; }
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
      logAudit(user.id, user.name, 'UPDATE', 'Product', editingProduct.id, `Actualizado: ${formData.name}`);
    } else {
      const newProduct: Product = { ...formData, id: generateId(), createdAt: new Date().toISOString() };
      setProducts([...products, newProduct]);
      logAudit(user.id, user.name, 'CREATE', 'Product', newProduct.id, `Creado: ${formData.name}`);
    }
    setShowForm(false); setEditingProduct(null); setFormData(emptyProduct);
  };

  const handleStockAdjust = (id: string, delta: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
    logAudit(user.id, user.name, 'STOCK_ADJUST', 'Product', id, `Stock ajustado: ${delta > 0 ? '+' : ''}${delta}`);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventario</h2>
          <p className="text-gray-500">{products.length} productos</p>
        </div>
        <button onClick={() => { setEditingProduct(null); setFormData(emptyProduct); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-lg hover:from-sky-600 hover:to-emerald-600">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar productos..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="text-xs font-medium text-gray-500 uppercase hidden md:table-cell">SKU</th>
                <th className="text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Categoría</th>
                <th className="text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(product => (
                <tr key={product.id} className={`hover:bg-gray-50 ${product.stock <= product.minStock ? 'bg-amber-50' : ''}`}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        {product.stock <= product.minStock && <p className="text-xs text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Stock bajo</p>}
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell text-sm text-gray-600">{product.sku}</td>
                  <td className="hidden md:table-cell"><span className="badge badge-blue">{product.category}</span></td>
                  <td className="text-sm font-medium">€{product.price.toFixed(2)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleStockAdjust(product.id, -1)} className="w-6 h-6 bg-gray-100 rounded text-xs hover:bg-gray-200">-</button>
                      <span className="text-sm font-medium w-8 text-center">{product.stock}</span>
                      <button onClick={() => handleStockAdjust(product.id, 1)} className="w-6 h-6 bg-gray-100 rounded text-xs hover:bg-gray-200">+</button>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditingProduct(product); setFormData({ name: product.name, sku: product.sku, price: product.price, cost: product.cost, stock: product.stock, minStock: product.minStock, category: product.category, unit: product.unit, taxRate: product.taxRate, active: product.active, description: product.description || '' }); setShowForm(true); }} className="p-1.5 hover:bg-amber-50 rounded text-amber-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => { if (confirm('¿Eliminar?')) { setProducts(products.filter(p => p.id !== product.id)); logAudit(user.id, user.name, 'DELETE', 'Product', product.id, 'Producto eliminado'); }}} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label><input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label><input value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label><input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Precio</label><input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Coste</label><input type="number" step="0.01" value={formData.cost} onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock</label><input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label><input type="number" value={formData.minStock} onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label><select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="pz">Piezas</option><option value="kg">Kilogramos</option><option value="l">Litros</option><option value="m">Metros</option><option value="hora">Horas</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">IVA (%)</label><input type="number" value={formData.taxRate} onChange={(e) => setFormData({...formData, taxRate: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-lg text-sm font-medium">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;


+++ src/components/Inventory.tsx (修改后)
import React from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  lastUpdated: string;
  sku: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const Inventory: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([
    {
      id: '1',
      name: 'Laptop Dell XPS 13',
      category: 'Elettronica',
      price: 1299.99,
      stock: 15,
      supplier: 'Dell Italia',
      lastUpdated: '2026-09-14',
      sku: 'DELL-XPS13-2026',
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Max',
      category: 'Telefonia',
      price: 1399.00,
      stock: 3,
      supplier: 'Apple Store',
      lastUpdated: '2026-09-13',
      sku: 'IPHO-PRO-MAX-2026',
      status: 'low-stock'
    },
    {
      id: '3',
      name: 'Samsung Galaxy S24',
      category: 'Telefonia',
      price: 999.00,
      stock: 0,
      supplier: 'Samsung Electronics',
      lastUpdated: '2026-09-10',
      sku: 'SAMS-S24-2026',
      status: 'out-of-stock'
    },
    {
      id: '4',
      name: 'MacBook Air M3',
      category: 'Elettronica',
      price: 1199.00,
      stock: 8,
      supplier: 'Apple Store',
      lastUpdated: '2026-09-12',
      sku: 'MAC-AIR-M3-2026',
      status: 'in-stock'
    },
    {
      id: '5',
      name: 'Canon EOS R5',
      category: 'Fotografia',
      price: 2499.00,
      stock: 2,
      supplier: 'Canon Italia',
      lastUpdated: '2026-09-11',
      sku: 'CAN-EOS-R5-2026',
      status: 'low-stock'
    }
  ]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  const categories = [...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'lastUpdated'> & { id?: string }) => {
    const now = new Date().toISOString().split('T')[0];

    if (productData.id) {
      setProducts(products.map(p =>
        p.id === productData.id
          ? { ...productData as Product, id: productData.id, lastUpdated: now }
          : p
      ));
    } else {
      const newProduct: Product = {
        ...productData as Product,
        id: (products.length + 1).toString(),
        lastUpdated: now
      };
      setProducts([...products, newProduct]);
    }
    setShowAddForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">Gestione Inventario</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowAddForm(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-200 btn-hover"
        >
          + Nuovo Prodotto
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cerca prodotti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tutte le categorie</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tutti gli stati</option>
          <option value="in-stock">Disponibili</option>
          <option value="low-stock">Pochi disponibili</option>
          <option value="out-of-stock">Esauriti</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Nome</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Categoria</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">SKU</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Prezzo</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Stock</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Stato</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Fornitore</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{product.name}</td>
                  <td className="py-4 px-6 text-gray-600">{product.category}</td>
                  <td className="py-4 px-6 text-gray-600">{product.sku}</td>
                  <td className="py-4 px-6 text-gray-600">€{product.price.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' :
                      product.stock > 0 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'in-stock' ? 'bg-green-100 text-green-800' :
                      product.status === 'low-stock' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'in-stock' ? 'Disponibile' : product.status === 'low-stock' ? 'Poco Disponibile' : 'Esaurito'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{product.supplier}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
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
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nessun prodotto trovato</h3>
          <p className="text-gray-500">Prova a modificare i criteri di ricerca o aggiungi un nuovo prodotto.</p>
        </div>
      )}
    </div>
  );
};

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Omit<Product, 'id' | 'lastUpdated'> & { id?: string }) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState<Omit<Product, 'id' | 'lastUpdated'> & { id?: string }>({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    supplier: product?.supplier || '',
    sku: product?.sku || '',
    status: product?.status || 'in-stock'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {product ? 'Modifica Prodotto' : 'Aggiungi Nuovo Prodotto'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fornitore *</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
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
              <option value="in-stock">Disponibile</option>
              <option value="low-stock">Poco Disponibile</option>
              <option value="out-of-stock">Esaurito</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-200"
            >
              {product ? 'Salva Modifiche' : 'Aggiungi Prodotto'}
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

export default Inventory;
