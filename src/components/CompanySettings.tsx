import { useState } from 'react';
import { companyData, updateCompanyData } from '../data/mock-data';
import { 
  Building, Image, Info, Landmark, Save, Trash2, Upload 
} from 'lucide-react';

export default function CompanySettings() {
  const [formData, setFormData] = useState(companyData);
  const [logoPreview, setLogoPreview] = useState<string | null>(companyData.logo);
  const [saved, setSaved] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData({ ...formData, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateCompanyData(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass = "w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2 flex items-center gap-2">
          <Building className="w-6 h-6 text-sky-600" />
          Dati Aziendali
        </h2>
        <p className="text-sm text-gray-600">
          Questi dati verranno utilizzati in tutti i documenti PDF generati dal sistema
        </p>
      </div>

      {/* Logo Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5 text-sky-600" />
          Logo Aziendale
        </h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            {logoPreview ? (
              <div className="w-48 h-48 border-2 border-sky-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400">
                <Image className="w-12 h-12 mb-2" />
                <p className="text-xs text-center">Nessun logo caricato</p>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className={labelClass}>Carica Logo</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-xl hover:bg-sky-100 cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Seleziona file
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Formati supportati: PNG, JPG, SVG. Dimensione consigliata: 200x200px
              </p>
            </div>
            {logoPreview && (
              <button
                onClick={() => {
                  setLogoPreview(null);
                  setFormData({ ...formData, logo: '' });
                }}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Rimuovi Logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-sky-600" />
          Informazioni Azienda
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Ragione Sociale *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Es: OpenERP Canarias S.L." />
          </div>
          <div>
            <label className={labelClass}>NIF/CIF *</label>
            <input type="text" value={formData.nif} onChange={(e) => setFormData({ ...formData, nif: e.target.value })} className={inputClass} placeholder="Es: B76123456" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Indirizzo Completo *</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} placeholder="Es: Calle León 25, 35001 Las Palmas de Gran Canaria" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="info@azienda.com" />
          </div>
          <div>
            <label className={labelClass}>PEC</label>
            <input type="email" value={formData.pec} onChange={(e) => setFormData({ ...formData, pec: e.target.value })} className={inputClass} placeholder="azienda@pec.it" />
          </div>
          <div>
            <label className={labelClass}>Telefono</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="+34 928 123 456" />
          </div>
          <div>
            <label className={labelClass}>Codice Univoco</label>
            <input type="text" value={formData.uniqueCode} onChange={(e) => setFormData({ ...formData, uniqueCode: e.target.value })} className={inputClass} placeholder="Es: A1B2C3D" />
          </div>
          <div>
            <label className={labelClass}>Partita IVA</label>
            <input type="text" value={formData.vat} onChange={(e) => setFormData({ ...formData, vat: e.target.value })} className={inputClass} placeholder="Es: ES12345678" />
          </div>
          <div>
            <label className={labelClass}>Registro Imprese</label>
            <input type="text" value={formData.registerNumber} onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })} className={inputClass} placeholder="Es: GC-12345" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Sito Web</label>
            <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className={inputClass} placeholder="https://www.azienda.com" />
          </div>
        </div>
      </div>

      {/* Bank Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-sky-600" />
          Dati Bancari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>IBAN</label>
            <input type="text" value={formData.iban} onChange={(e) => setFormData({ ...formData, iban: e.target.value })} className={inputClass} placeholder="Es: ES91 2100 0418 4502 0005 1332" />
          </div>
          <div>
            <label className={labelClass}>Banca</label>
            <input type="text" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} className={inputClass} placeholder="Es: CaixaBank" />
          </div>
          <div>
            <label className={labelClass}>SWIFT/BIC</label>
            <input type="text" value={formData.swift} onChange={(e) => setFormData({ ...formData, swift: e.target.value })} className={inputClass} placeholder="Es: CAIXESBBXXX" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all shadow-lg shadow-sky-500/30 font-semibold text-lg flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saved ? 'Salvato!' : 'Salva Dati Aziendali'}
        </button>
      </div>
    </div>
  );
}