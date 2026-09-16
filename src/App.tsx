import { useState } from 'react';
import Sidebar from './components/layout/sidebar';
import Topbar from './components/layout/topbar';
import Dashboard from './components/dashboard/dashboard';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;