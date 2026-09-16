--- EXPORT_src_App.tsx (原始)


+++ EXPORT_src_App.tsx (修改后)
import { useState, useEffect } from 'react';
import { ModuleType, Lead, HistoryEntry, LeadEmail, Meeting, Quotation, Order, Invoice, DDT, Product, StockMove, JournalEntry, EmailCampaign, Agent, DocCounters } from './types';
import { Language } from './i18n';
import { initialLeads, initialHistory, initialLeadEmails, initialMeetings, initialQuotations, initialOrders, initialInvoices, initialDDTs, initialProducts, initialStockMoves, initialJournalEntries, initialEmailCampaigns, initialAgents, initialDocCounters, initialCarriers } from './data';
import { Carrier } from './types';
import Carriers from './components/Carriers';
import { authService, Session, User } from './utils/auth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Invoicing from './components/Invoicing';
import Accounting from './components/Accounting';
import EmailMarketing from './components/EmailMarketing';
import Settings from './components/Settings';
import Agents from './components/Agents';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import CompanySettings from './components/CompanySettings';

export default function App() {
  // TUTTI gli hooks devono essere prima di qualsiasi return condizionale
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState<Language>('es');
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);
  const [emails, setEmails] = useState<LeadEmail[]>(initialLeadEmails);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [ddts, setDDTs] = useState<DDT[]>(initialDDTs);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [stockMoves, setStockMoves] = useState<StockMove[]>(initialStockMoves);
  const [journalEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>(initialEmailCampaigns);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [docCounters, setDocCounters] = useState<DocCounters>(initialDocCounters);
  const [carriers, setCarriers] = useState<Carrier[]>(initialCarriers);

  // Check for existing session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      const validation = authService.validateSession(parsedSession.token);
      if (validation.valid && validation.user) {
        setSession(parsedSession);
        setCurrentUser(validation.user);
      } else {
        localStorage.removeItem('session');
      }
    }
  }, []);

  const handleLogin = (newSession: Session) => {
    setSession(newSession);
    localStorage.setItem('session', JSON.stringify(newSession));
    const validation = authService.validateSession(newSession.token);
    if (validation.user) {
      setCurrentUser(validation.user);
    }
  };

  const handleLogout = () => {
    if (session) {
      authService.logout(session.token);
    }
    setSession(null);
    setCurrentUser(null);
    localStorage.removeItem('session');
  };

  // Show login if not authenticated - ORA è dopo tutti gli hooks
  if (!session || !currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const activeModules: ModuleType[] = ['dashboard', 'contacts', 'inventory', 'orders', 'invoicing', 'accounting', 'email', 'settings', 'agents', 'carriers', 'company'];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard leads={leads} quotations={quotations} invoices={invoices} history={history} agents={agents} orders={orders} language={language} />;
      case 'contacts':
        return (
          <Contacts
            leads={leads}
            history={history}
            emails={emails}
            meetings={meetings}
            quotations={quotations}
            orders={orders}
            invoices={invoices}
            ddts={ddts}
            products={products}
            agents={agents}
            carriers={carriers}
            docCounters={docCounters}
            language={language}
            setLeads={setLeads}
            setHistory={setHistory}
            setEmails={setEmails}
            setMeetings={setMeetings}
            setQuotations={setQuotations}
            setOrders={setOrders}
            setInvoices={setInvoices}
            setDDTs={setDDTs}
            setDocCounters={setDocCounters}
          />
        );
      case 'inventory':
        return <Inventory products={products} stockMoves={stockMoves} setProducts={setProducts} setStockMoves={setStockMoves} language={language} />;
      case 'orders':
        return <Orders orders={orders} leads={leads} quotations={quotations} setOrders={setOrders} language={language} />;
      case 'invoicing':
        return <Invoicing invoices={invoices} leads={leads} quotations={quotations} orders={orders} products={products} setInvoices={setInvoices} setProducts={setProducts} setStockMoves={setStockMoves} docCounters={docCounters} setDocCounters={setDocCounters} language={language} />;
      case 'accounting':
        return <Accounting journalEntries={journalEntries} invoices={invoices} language={language} />;
      case 'email':
        return <EmailMarketing campaigns={emailCampaigns} setCampaigns={setEmailCampaigns} emails={emails} leads={leads} language={language} />;
      case 'settings':
        return <Settings language={language} />;
      case 'agents':
        return <Agents agents={agents} setAgents={setAgents} leads={leads} quotations={quotations} orders={orders} invoices={invoices} language={language} />;
      case 'users':
        return <UserManagement currentUserId={currentUser.id} currentUserRole={currentUser.role} />;
      case 'carriers':
        return <Carriers carriers={carriers} setCarriers={setCarriers} />;
      case 'company':
        return <CompanySettings />;
      default:
        return <Dashboard leads={leads} quotations={quotations} invoices={invoices} history={history} agents={agents} orders={orders} language={language} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        collapsed={sidebarCollapsed}
        activeModules={activeModules}
        language={language}
        userRole={currentUser.role}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeModule={activeModule}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          collapsed={sidebarCollapsed}
          language={language}
          setLanguage={setLanguage}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}
