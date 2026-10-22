import React, { useState } from 'react';
import { useApp } from '../context';

export default function Login() {
  const { login } = useApp();
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(matricula, password);
    if (!success) {
      setError('Matrícula não encontrada. Tente: V001, V002, V003, V004 ou ADM01');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30 mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">SecurOps</h1>
          <p className="text-blue-200 mt-1">Sistema de Gestão de Segurança Operacional</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Acesso ao Sistema</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Matrícula / CPF</label>
              <input
                type="text"
                value={matricula}
                onChange={(e) => { setMatricula(e.target.value); setError(''); }}
                placeholder="Ex: V001 ou ADM01"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-blue-200/70 text-xs text-center mb-3">Contas de demonstração:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <span className="text-blue-300">Vigilante:</span>
                <span className="text-white ml-1 font-mono">V001</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <span className="text-blue-300">Supervisor:</span>
                <span className="text-white ml-1 font-mono">ADM01</span>
              </div>
            </div>
            <p className="text-blue-200/50 text-xs text-center mt-2">Qualquer senha funciona na demo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
