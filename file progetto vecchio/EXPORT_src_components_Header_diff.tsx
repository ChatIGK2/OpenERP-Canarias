--- EXPORT_src_components_Header.tsx (原始)


+++ EXPORT_src_components_Header.tsx (修改后)
import { Language } from '../i18n';
import { User } from '../utils/auth';

interface HeaderProps {
  activeModule: string;
  toggleSidebar: () => void;
  collapsed: boolean;
  language: Language;
  setLanguage: (l: Language) => void;
  currentUser?: User;
  onLogout?: () => void;
}

const moduleNames: Record<string, { it: string; es: string }> = {
  dashboard: { it: 'Dashboard', es: 'Dashboard' },
  contacts: { it: 'Contatti', es: 'Contactos' },
  inventory: { it: 'Magazzino', es: 'Almacén' },
  orders: { it: 'Ordini', es: 'Pedidos' },
  invoicing: { it: 'Fatturazione', es: 'Facturación' },
  accounting: { it: 'Contabilità', es: 'Contabilidad' },
  email: { it: 'Email Marketing', es: 'Email Marketing' },
  settings: { it: 'Impostazioni', es: 'Configuración' },
  agents: { it: 'Agenti', es: 'Agentes' },
  users: { it: 'Utenti', es: 'Usuarios' },
  carriers: { it: 'Trasportatori', es: 'Transportistas' },
  company: { it: 'La Mia Azienda', es: 'Mi Empresa' },
};

export default function Header({ activeModule, toggleSidebar, collapsed, language, setLanguage, currentUser, onLogout }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-sky-100 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-sky-600 hover:text-sky-800 p-2 rounded-lg hover:bg-sky-50 transition-all duration-200 btn-hover"
        >
          <i className={`fas ${collapsed ? 'fa-indent' : 'fa-outdent'} text-lg`}></i>
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
            {moduleNames[activeModule]?.[language] || activeModule}
          </h1>
          <p className="text-[10px] text-gray-500 hidden sm:block">
            {language === 'it' ? 'Gestionale ERP' : 'Sistema de Gestión'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Info utente */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-sky-50 to-emerald-50 px-3 py-1.5 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs">{currentUser.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-800">{currentUser.username}</span>
              <span className="text-[10px] text-gray-500 capitalize">{currentUser.role}</span>
            </div>
          </div>
        )}

        {/* Selettore lingua */}
        <button
          onClick={() => setLanguage(language === 'it' ? 'es' : 'it')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm bg-gradient-to-r from-sky-50 to-emerald-50 hover:from-sky-100 hover:to-emerald-100 rounded-lg transition-all duration-200 btn-hover border border-sky-200"
        >
          <span className="text-base">{language === 'it' ? '🇪🇸' : '🇮🇹'}</span>
          <span className="hidden sm:inline font-medium text-gray-700">{language === 'it' ? 'ES' : 'IT'}</span>
        </button>

        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 hover:from-rose-100 hover:to-rose-200 rounded-lg transition-all duration-200 btn-hover border border-rose-200"
            title="Esci"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span className="hidden sm:inline font-medium">Esci</span>
          </button>
        )}
      </div>
    </header>
  );
}
