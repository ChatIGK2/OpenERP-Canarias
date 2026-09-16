--- EXPORT_src_components_CompanySettings.tsx (原始)


+++ EXPORT_src_components_CompanySettings.tsx (修改后)
import { useState } from 'react';
import { companyData, updateCompanyData } from '../data';

export default function CompanySettings() {
  const [formData, setFormData] = useState(companyData);
  const [logoPreview, setLogoPreview] = useState<string | null>(companyData.logo);

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
    alert('Dati aziendali salvati con successo!');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          <i className="fas fa-building mr-2"></i>
          Dati Aziendali
        </h2>
        <p className="text-sm text-gray-600">
          Questi dati verranno utilizzati in tutti i documenti PDF generati dal sistema
        </p>
      </div>

      {/* Logo Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-image text-sky-600"></i>
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
                <i className="fas fa-image text-4xl mb-2"></i>
                <p className="text-xs text-center">Nessun logo caricato</p>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Carica Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
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
                className="px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 text-sm"
              >
                <i className="fas fa-trash mr-2"></i>Rimuovi Logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-info-circle text-sky-600"></i>
          Informazioni Azienda
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ragione Sociale *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="Es: OpenERP Canarias S.L."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              NIF/CIF *
            </label>
            <input
              type="text"
              value={formData.nif}
              onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="Es: B76123456"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Indirizzo Completo *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="Es: Calle León 25, 35001 Las Palmas de Gran Canaria"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="info@azienda.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PEC
            </label>
            <input
              type="email"
              value={formData.pec}
              onChange={(e) => setFormData({ ...formData, pec: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="azienda@pec.it"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Telefono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="+34 928 123 456"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Codice Univoco
            </label>
            <input
              type="text"
              value={formData.uniqueCode}
              onChange={(e) => setFormData({ ...formData, uniqueCode: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="Es: A1B2C3D"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Partita IVA
            </label>
            <input
              type="text"
              value={formData.vat}
              onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="Es: ES12345678"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Registro Imprese
            </label>
            <input
              type="text"
              value={formData.registerNumber}
              onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="Es: GC-12345"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sito Web
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="https://www.azienda.com"
            />
          </div>
        </div>
      </div>

      {/* Bank Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-university text-sky-600"></i>
          Dati Bancari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              IBAN
            </label>
            <input
              type="text"
              value={formData.iban}
              onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="Es: ES91 2100 0418 4502 0005 1332"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Banca
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="Es: CaixaBank"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SWIFT/BIC
            </label>
            <input
              type="text"
              value={formData.swift}
              onChange={(e) => setFormData({ ...formData, swift: e.target.value })}
              className="w-full px-4 py-2 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all duration-200"
              placeholder="Es: CAIXESBBXXX"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-sky-500/30 btn-hover font-semibold text-lg"
        >
          <i className="fas fa-save mr-2"></i>
          Salva Dati Aziendali
        </button>
      </div>
    </div>
  );
}
