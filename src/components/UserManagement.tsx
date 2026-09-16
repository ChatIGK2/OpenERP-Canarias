import { useState } from 'react';
import { Carrier } from '../types';
import { 
  Truck, Plus, Search, Edit2, Trash2, Pause, Play, 
  Phone, Mail, MapPin, X, Save 
} from 'lucide-react';

interface CarriersProps {
  carriers: Carrier[];
  setCarriers: (carriers: Carrier[]) => void;
}

export default function Carriers({ carriers, setCarriers }: CarriersProps) {
  const [showNew, setShowNew] = useState(false);
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const filteredCarriers = carriers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!formData.name) {
      alert('Il nome del trasportatore è obbligatorio');
      return;
    }
    const newCarrier: Carrier = {
      id: `carrier${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      active: true,
    };
    setCarriers([...carriers, newCarrier]);
    setFormData({ name: '', phone: '', email: '', address: '' });
    setShowNew(false);
  };

  const handleUpdate = () => {
    if (!editingCarrier || !formData.name) {
      alert('Il nome del trasportatore è obbligatorio');
      return;
    }
    const updatedCarriers = carriers.map(c =>
      c.id === editingCarrier.id
        ? { ...c, name: formData.name, phone: formData.phone, email: formData.email, address: formData.address }
        : c
    );
    setCarriers(updatedCarriers);
    setEditingCarrier(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
  };

  const handleToggleActive = (id: string) => {
    const updatedCarriers = carriers.map(c =>
      c.id === id ? { ...c, active: !c.active } : c
    );
    setCarriers(updatedCarriers);
  };

  const handleDelete = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo trasportatore?')) {
      setCarriers(carriers.filter(c => c.id !== id));
    }
  };

  const startEdit = (carrier: Carrier) => {
    setEditingCarrier(carrier);
    setFormData({
      name: carrier.name,
      phone: carrier.phone,
      email: carrier.email,
      address: carrier.address,
    });
  };

  const cancelEdit = () => {
    setEditingCarrier(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
          <Truck className="w-6 h-6 text-sky-600" />
          Gestione Trasportatori
        </h2>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all shadow-lg shadow-sky-500/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuovo Trasportatore
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-sky-100">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-gray-500">Totale Trasportatori</p>
          <p className="text-2xl font-bold text-sky-600">{carriers.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-emerald-100">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <Play className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-gray-500">Attivi</p>
          <p className="text-2xl font-bold text-emerald-600">{carriers.filter(c => c.active).length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <Pause className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-gray-500">Inattivi</p>
          <p className="text-2xl font-bold text-gray-600">{carriers.filter(c => !c.active).length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-sky-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cerca trasportatore..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all"
          />
        </div>
      </div>

      {/* Lista Trasportatori */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCarriers.map((carrier) => (
          <div
            key={carrier.id}
            className={`bg-white rounded-2xl shadow-lg p-5 border-2 ${
              carrier.active ? 'border-sky-100' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  carrier.active
                    ? 'bg-gradient-to-br from-sky-400 to-emerald-400'
                    : 'bg-gradient-to-br from-gray-400 to-gray-600'
                }`}>
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{carrier.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    carrier.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {carrier.active ? 'Attivo' : 'Inattivo'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-500" />
                {carrier.phone || '-'}
              </p>
              <p className="text-sm text-gray-600 truncate flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-500" />
                {carrier.email || '-'}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-500" />
                {carrier.address || '-'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(carrier)}
                className="flex-1 px-3 py-2 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-all text-sm flex items-center justify-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                Modifica
              </button>
              <button
                onClick={() => handleToggleActive(carrier.id)}
                className={`px-3 py-2 rounded-lg transition-all text-sm ${
                  carrier.active
                    ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {carrier.active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={() => handleDelete(carrier.id)}
                className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all text-sm"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCarriers.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nessun trasportatore trovato</p>
        </div>
      )}

      {/* Modal Nuovo/Modifica Trasportatore */}
      {(showNew || editingCarrier) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-sky-100">
              <h3 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-600" />
                {editingCarrier ? 'Modifica Trasportatore' : 'Nuovo Trasportatore'}
              </h3>
              <button
                onClick={() => { setShowNew(false); cancelEdit(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Trasportatore *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all"
                  placeholder="Es: Trasporti Veloci SRL"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all"
                  placeholder="+34 600 123 456"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all"
                  placeholder="info@trasportatore.es"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Indirizzo</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all"
                  placeholder="Calle Mayor 10, Las Palmas"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setShowNew(false); cancelEdit(); }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Annulla
                </button>
                <button
                  onClick={editingCarrier ? handleUpdate : handleCreate}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all shadow-lg shadow-sky-500/30 font-semibold flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingCarrier ? 'Aggiorna' : 'Crea'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}