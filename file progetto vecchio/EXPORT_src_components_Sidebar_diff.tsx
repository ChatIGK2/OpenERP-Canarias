--- EXPORT_src_components_Sidebar.tsx (原始)


+++ EXPORT_src_components_Sidebar.tsx (修改后)
import { ModuleType } from '../types';
import { Language } from '../i18n';
import { UserRole } from '../utils/auth';

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (m: ModuleType) => void;
  collapsed: boolean;
  activeModules: ModuleType[];
  language: Language;
  userRole?: UserRole;
}

const allModules = [
  { id: 'dashboard' as ModuleType, name: { it: 'Dashboard', es: 'Dashboard' }, icon: 'fa-chart-line', roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
  { id: 'contacts' as ModuleType, name: { it: 'Contatti', es: 'Contactos' }, icon: 'fa-address-book', roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
  { id: 'inventory' as ModuleType, name: { it: 'Magazzino', es: 'Almacén' }, icon: 'fa-warehouse', roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
  { id: 'orders' as ModuleType, name: { it: 'Ordini', es: 'Pedidos' }, icon: 'fa-shopping-cart', roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
  { id: 'invoicing' as ModuleType, name: { it: 'Fatturazione', es: 'Facturación' }, icon: 'fa-file-invoice', roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
  { id: 'accounting' as ModuleType, name: { it: 'Contabilità', es: 'Contabilidad' }, icon: 'fa-calculator', roles: ['admin', 'manager', 'viewer'] as UserRole[] },
  { id: 'email' as ModuleType, name: { it: 'Email Marketing', es: 'Email Marketing' }, icon: 'fa-envelope-open-text', roles: ['admin', 'manager'] as UserRole[] },
  { id: 'agents' as ModuleType, name: { it: 'Agenti', es: 'Agentes' }, icon: 'fa-user-tie', roles: ['admin', 'manager'] as UserRole[] },
  { id: 'users' as ModuleType, name: { it: 'Utenti', es: 'Usuarios' }, icon: 'fa-users-cog', roles: ['admin'] as UserRole[] },
  { id: 'carriers' as ModuleType, name: { it: 'Trasportatori', es: 'Transportistas' }, icon: 'fa-truck', roles: ['admin', 'manager', 'agent'] as UserRole[] },
  { id: 'company' as ModuleType, name: { it: 'La Mia Azienda', es: 'Mi Empresa' }, icon: 'fa-building', roles: ['admin'] as UserRole[] },
  { id: 'settings' as ModuleType, name: { it: 'Impostazioni', es: 'Configuración' }, icon: 'fa-gear', roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
];

export default function Sidebar({ activeModule, setActiveModule, collapsed, activeModules, language, userRole }: SidebarProps) {
  const visibleModules = allModules.filter(m =>
    activeModules.includes(m.id) &&
    (!userRole || m.roles.includes(userRole))
  );

  return (
    <aside className={`
      h-full flex flex-col transition-all duration-300 ease-in-out
      ${collapsed ? 'w-16' : 'w-56'}
      bg-gradient-to-b from-sky-900 via-sky-800 to-emerald-900
      shadow-2xl
    `}>
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-lg">
          OE
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <span className="font-bold text-lg text-white">OpenERP</span>
            <p className="text-[10px] text-sky-200">Canarias</p>
          </div>
        )}
      </div>

      {/* Navigazione */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {visibleModules.map((module, index) => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200
              relative group
              ${activeModule === module.id
                ? 'bg-white/15 text-white border-r-4 border-emerald-400'
                : 'text-sky-100 hover:bg-white/10 hover:text-white'
              }
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Indicatore attivo */}
            {activeModule === module.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 to-emerald-400 animate-scale-in"></div>
            )}

            <i className={`fas ${module.icon} w-5 text-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}></i>
            {!collapsed && (
              <span className="animate-fade-in font-medium">{module.name[language]}</span>
            )}

            {/* Tooltip per versione collassata */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {module.name[language]}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10 animate-fade-in">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-[10px] text-sky-200 mb-1">Versione 2.0</p>
            <p className="text-[10px] text-emerald-200">© 2026 OpenERP</p>
          </div>
        </div>
      )}
    </aside>
  );
}
