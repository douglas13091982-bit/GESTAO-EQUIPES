import React, { useState } from 'react';
import { ShieldCheck, UserRound, LockKeyhole, Eye, EyeOff, HardHat, ClipboardList } from 'lucide-react';
import { useApp } from '../context';

const sampleBoard = [
  { name: 'Edifício Central', note: '2 de 2 vigilantes', tone: 'ok' },
  { name: 'Depósito Industrial', note: '1 de 2 vigilantes', tone: 'warning' },
  { name: 'Escola Municipal', note: 'Posto descoberto', tone: 'critical' },
] as const;

const toneStyles = {
  ok: { dot: 'bg-emerald-400', beacon: 'rgb(52 211 153 / 0.5)', label: 'Coberto' },
  warning: { dot: 'bg-amber-400', beacon: 'rgb(251 191 36 / 0.55)', label: 'Atenção' },
  critical: { dot: 'bg-red-500', beacon: 'rgb(239 68 68 / 0.6)', label: 'Crítico' },
};

export default function Login() {
  const { login } = useApp();
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(matricula.trim(), password);
    if (!success) {
      setError('Matrícula não encontrada. Confira o número ou use uma conta de demonstração.');
    }
  };

  const fillDemo = (value: string) => {
    setMatricula(value);
    setError('');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-ink">
      {/* Painel de marca */}
      <section className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white">
        <div className="grid-ink absolute inset-0" aria-hidden />
        <div
          className="absolute -left-32 -bottom-40 w-[520px] h-[520px] rounded-full bg-blue-600/25 blur-3xl"
          aria-hidden
        />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-signal" strokeWidth={2.2} />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">SecurOps</span>
        </div>

        <div className="relative max-w-xl">
          <h1 className="font-display text-5xl xl:text-6xl font-semibold leading-[1.02] tracking-tight">
            Cada posto coberto.
            <br />
            Cada ronda registrada.
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-md leading-relaxed">
            Escalas, ponto, uniformes e chamados da sua equipe de segurança em um só painel.
          </p>

          {/* Mini painel ilustrativo */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm divide-y divide-white/10 max-w-md">
            {sampleBoard.map((p) => {
              const t = toneStyles[p.tone];
              return (
                <div key={p.name} className="flex items-center gap-4 px-5 py-4">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${t.dot} ${p.tone === 'ok' ? '' : 'beacon'}`}
                    style={{ ['--beacon' as string]: t.beacon }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.note}</p>
                  </div>
                  <span className="text-xs text-gray-300">{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative text-xs text-gray-500">Gestão de segurança operacional</p>
      </section>

      {/* Formulário */}
      <section className="flex items-center justify-center bg-canvas lg:rounded-l-[2rem] p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-signal" strokeWidth={2.2} />
            </div>
            <span className="font-display text-xl font-semibold text-ink">SecurOps</span>
          </div>

          <h2 className="font-display text-3xl font-semibold text-ink">Entrar</h2>
          <p className="mt-2 text-gray-500">Use sua matrícula para acessar o painel.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1.5">
                Matrícula ou CPF
              </label>
              <div className="relative">
                <UserRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="matricula"
                  type="text"
                  autoComplete="username"
                  value={matricula}
                  onChange={(e) => {
                    setMatricula(e.target.value);
                    setError('');
                  }}
                  placeholder="V001"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <LockKeyhole className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-ink text-white font-semibold rounded-xl shadow-md hover:bg-ink-3 active:scale-[0.99] transition"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700">Contas de demonstração</p>
            <p className="text-xs text-gray-500 mt-0.5">Toque para preencher. Qualquer senha funciona.</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={() => fillDemo('V001')}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl text-left hover:border-blue-400 hover:shadow-sm transition"
              >
                <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <HardHat className="w-4.5 h-4.5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-800">Vigilante</span>
                  <span className="block text-xs text-gray-500 font-mono">V001</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('ADM01')}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl text-left hover:border-blue-400 hover:shadow-sm transition"
              >
                <span className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ClipboardList className="w-4.5 h-4.5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-800">Supervisor</span>
                  <span className="block text-xs text-gray-500 font-mono">ADM01</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
