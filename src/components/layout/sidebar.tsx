import React from 'react';
import { ModuleType, UserRole } from '../../types';
import { 
  LayoutDashboard, Users, Warehouse, ShoppingCart, FileText, 
  Calculator, Mail, Settings, UsersRound, Truck, Building,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  collapsed: boolean;
  activeModules: ModuleType[];
  language: string;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  collapsed,
  activeModules,
  language,
  userRole
}) => {
  const allModules = [
    { id: 'dashboard' as ModuleType, name: { it: 'Dashboard', es: 'Dashboard', en: 'Dashboard' }, icon: LayoutDashboard, roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
    { id: 'contacts' as ModuleType, name: { it: 'Contatti', es: 'Contactos', en: 'Contacts' }, icon: Users, roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
    { id: 'inventory' as ModuleType, name: { it: 'Magazzino', es: 'Almacén', en: 'Inventory' }, icon: Warehouse, roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
    { id: 'orders' as ModuleType, name: { it: 'Ordini', es: 'Pedidos', en: 'Orders' }, icon: ShoppingCart, roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
    { id: 'invoicing' as ModuleType, name: { it: 'Fatturazione', es: 'Facturación', en: 'Invoicing' }, icon: FileText, roles: ['admin', 'manager', 'agent', 'viewer'] as UserRole[] },
    { id: 'accounting' as ModuleType, name: { it: 'Contabilità', es: 'Contabilidad', en: 'Accounting' }, icon: Calculator, roles: ['admin', 'manager'] as UserRole[] },
    { id: 'email' as ModuleType, name: { it: 'Email Marketing', es: 'Email Marketing', en: 'Email Marketing' }, icon: Mail, roles: ['admin', 'manager', 'agent'] as UserRole[] },
    { id: 'agents' as ModuleType, name: { it: 'Agenti', es: 'Agentes', en: 'Agents' }, icon: UsersRound, roles: ['admin', 'manager'] as UserRole[] },
    { id: 'carriers' as ModuleType, name: { it: 'Corrieri', es: 'Transportistas', en: 'Carriers' }, icon: Truck, roles: ['admin', 'manager'] as UserRole[] },
    { id: 'company' as ModuleType, name: { it: 'Azienda', es: 'Empresa', en: 'Company' }, icon: Building, roles: ['admin'] as UserRole[] },
    { id: 'users' as ModuleType, name: { it: 'Utenti', es: 'Usuarios', en: 'Users' }, icon: UsersRound, roles: ['admin'] as UserRole[] },
    { id: 'settings' as ModuleType, name: { it: 'Impostazioni', es: 'Configuración', en: 'Settings' }, icon: Settings, roles: ['admin', 'manager'] as UserRole[] },
  ];

  const visibleModules = allModules.filter(m =>
    activeModules.includes(m.id) &&
    m.roles.includes(userRole)
  );

  const currentLang = language || 'es';

  return (
    <aside className={`h-full flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-56'} bg-gradient-to-b from-sky-900 via-sky-800 to-emerald-900 shadow-2xl`}>
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-lg">
          OE
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-sm truncate">OpenERP</h1>
            <p className="text-sky-200 text-xs truncate">Canarias</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {visibleModules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-sky-100 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? module.name[currentLang] : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{module.name[currentLang]}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {!collapsed && (
          <div className="bg-white/10 rounded-lg p-3 mb-3">
            <p className="text-sky-200 text-xs">Versione 2.0</p>
            <p className="text-sky-300 text-xs">© 2026 OpenERP</p>
          </div>
        )}
        <button
          onClick={() => {}}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg text-sky-200 hover:bg-white/10 hover:text-white transition-colors`}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">Comprimi</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;