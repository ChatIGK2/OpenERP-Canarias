import { useState } from 'react';
import { companyName, companyEmail, companyAddress, companyNIF } from '../data/mock-data';
import { Language } from '../i18n';
import { Building, Mail, Phone, MapPin, Save, FileText, Globe } from 'lucide-react';

interface SettingsProps {
  language: Language;
}

export default function Settings({ language }: SettingsProps) {
  const [formData, setFormData] = useState({
    companyName,
    companyNIF,
    companyEmail,
    companyAddress,
    phone: '+34 928 123 456',
    taxRegime: 'igic'
  });

  const t: Record<string, any> = {
    es: { title: 'Configuración', companyData: 'Datos Empresa', socialName: 'Razón Social', nif: 'NIF', email: 'Email', phone: 'Teléfono', address: 'Dirección', taxRegime: 'Régimen Fiscal', igic: 'IGIC - Impuesto General Indirecto Canario (Canarias)', iva: 'IVA - Impuesto sobre el Valor Añadido (Península)', save: 'Guardar', saved: '¡Guardado!' },
    en: { title: 'Settings', companyData: 'Company Data', socialName: 'Company Name', nif: 'VAT Number', email: 'Email', phone: 'Phone', address: 'Address', taxRegime: 'Tax Regime', igic: 'IGIC - Canary Islands Indirect Tax', iva: 'VAT - Value Added Tax (Mainland)', save: 'Save', saved: 'Saved!' },
    it: { title: 'Impostazioni', companyData: 'Dati Azienda', socialName: 'Ragione Sociale', nif: 'P.IVA', email: 'Email', phone: 'Telefono', address: 'Indirizzo', taxRegime: 'Regime Fiscale', igic: 'IGIC - Imposta Generale Indiretta Canarie', iva: 'IVA - Imposta sul Valore Aggiunto (Penisola)', save: 'Salva', saved: 'Salvato!' }
  };
  const lang = t[language] || t.es;

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{lang.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Configurazione del sistema</p>
      </div>

      {/* Dati Azienda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <Building className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">{lang.companyData}</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{lang.socialName}</label>
              <input type="text" value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{lang.nif}</label>
              <input type="text" value={formData.companyNIF} onChange={(e) => handleChange('companyNIF', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{lang.email}</label>
              <input type="email" value={formData.companyEmail} onChange={(e) => handleChange('companyEmail', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{lang.phone}</label>
              <input type="text" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>{lang.address}</label>
            <input type="text" value={formData.companyAddress} onChange={(e) => handleChange('companyAddress', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{lang.taxRegime}</label>
            <select value={formData.taxRegime} onChange={(e) => handleChange('taxRegime', e.target.value)} className={inputClass}>
              <option value="igic">{lang.igic}</option>
              <option value="iva">{lang.iva}</option>
            </select>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
              <Save className="w-4 h-4" />
              {saved ? lang.saved : lang.save}
            </button>
          </div>
        </div>
      </div>

      {/* Informazioni Sistema */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Informazioni Sistema</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Versione</p>
            <p className="font-semibold text-gray-800">2.0.0</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Ultimo aggiornamento</p>
            <p className="font-semibold text-gray-800">15/09/2026</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Lingua</p>
            <p className="font-semibold text-gray-800">{language.toUpperCase()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Regime Fiscale</p>
            <p className="font-semibold text-gray-800">{formData.taxRegime.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}