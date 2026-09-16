--- EXPORT_src_components_Settings.tsx (原始)


+++ EXPORT_src_components_Settings.tsx (修改后)
import { companyName, companyEmail, companyAddress, companyNIF } from '../data';
import { Language } from '../i18n';
export default function Settings({ language }: { language: Language }) {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl border p-6 max-w-2xl">
        <h3 className="text-lg font-semibold mb-4"><i className="fas fa-building mr-2 text-purple-500"></i>Datos Empresa</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Razón Social</label><input type="text" defaultValue={companyName} className="w-full border rounded-lg px-3 py-2 text-sm" /></div><div><label className="block text-sm font-medium mb-1">NIF</label><input type="text" defaultValue={companyNIF} className="w-full border rounded-lg px-3 py-2 text-sm" /></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Email</label><input type="email" defaultValue={companyEmail} className="w-full border rounded-lg px-3 py-2 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Teléfono</label><input type="text" defaultValue="+34 928 123 456" className="w-full border rounded-lg px-3 py-2 text-sm" /></div></div>
          <div><label className="block text-sm font-medium mb-1">Dirección</label><input type="text" defaultValue={companyAddress} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Régimen Fiscal</label><select defaultValue="igic" className="w-full border rounded-lg px-3 py-2 text-sm"><option value="igic">IGIC - Impuesto General Indirecto Canario (Canarias)</option><option value="iva">IVA - Impuesto sobre el Valor Añadido (Península)</option></select></div>
          <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"><i className="fas fa-save mr-2"></i>Guardar</button>
        </div>
      </div>
    </div>
  );
}
