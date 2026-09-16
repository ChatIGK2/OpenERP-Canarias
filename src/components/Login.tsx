import React, { useState } from 'react';
import { authService, Session } from '../utils/auth';
import { Shield, User, Lock, Eye, EyeOff, LogIn, AlertCircle, Info, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (session: Session) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authService.login(
        username,
        password,
        window.location.hostname,
        navigator.userAgent
      );
      if (result.success && result.session) {
        onLogin(result.session);
      } else {
        setError(result.error || 'Errore di login');
      }
    } catch (err) {
      setError('Errore di connessione. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo e titolo */}
        <div className="text-center mb-8">
          <div className="inline-block p-5 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-3xl shadow-2xl mb-4">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            OpenERP Canarias
          </h1>
          <p className="text-gray-600">Sistema Gestionale Sicuro</p>
        </div>

        {/* Form di login */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-sky-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Accedi al tuo account</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span className="text-rose-800 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Nome utente
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all"
                  placeholder="Inserisci il tuo username"
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border-2 border-sky-200 rounded-xl focus:border-sky-400 transition-all"
                  placeholder="Inserisci la tua password"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:from-sky-600 hover:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Accesso in corso...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Accedi
                </>
              )}
            </button>
          </form>

          {/* Info sicurezza */}
          <div className="mt-6 pt-6 border-t border-sky-100">
            <div className="flex items-start gap-3 text-xs text-gray-600">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Connessione sicura</p>
                <p>Tutti i dati sono protetti con crittografia AES-256 e TLS 1.3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2026 OpenERP Canarias. Tutti i diritti riservati.</p>
          <p className="mt-1 text-xs">Versione 2.0 - Aggiornato alle normative 2026</p>
        </div>

        {/* Credenziali demo */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-amber-900 font-semibold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Credenziali di demo:
          </p>
          <div className="space-y-1">
            <p className="text-xs text-amber-800">
              Username: <code className="bg-white px-2 py-0.5 rounded font-mono">admin</code>
            </p>
            <p className="text-xs text-amber-800">
              Password: <code className="bg-white px-2 py-0.5 rounded font-mono">Admin@2026!</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}