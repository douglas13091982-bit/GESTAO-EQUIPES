import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Shirt,
  ClipboardCheck,
  Repeat2,
  Clock,
  Settings,
  Bell,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Hourglass,
  Wrench,
  Package,
  Timer,
  FileText,
  Sun,
  Moon,
  type LucideIcon,
} from 'lucide-react';
import { useApp } from '../context';

type AdminTab = 'dashboard' | 'posts' | 'uniforms' | 'approvals' | 'coverage' | 'ponto' | 'settings';

const NAV: { id: AdminTab; icon: LucideIcon; label: string; short: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', short: 'Painel' },
  { id: 'posts', icon: MapPin, label: 'Postos', short: 'Postos' },
  { id: 'uniforms', icon: Shirt, label: 'Uniformes', short: 'Unif.' },
  { id: 'approvals', icon: ClipboardCheck, label: 'Aprovações', short: 'Aprov.' },
  { id: 'coverage', icon: Repeat2, label: 'Coberturas', short: 'Cobert.' },
  { id: 'ponto', icon: Clock, label: 'Ponto', short: 'Ponto' },
  { id: 'settings', icon: Settings, label: 'Configurações', short: 'Config.' },
];

export default function AdminDashboard() {
  const { currentUser, logout, notifications, uniformRequests, overtimeRequests, tickets } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!currentUser) return null;

  const pendingApprovals =
    uniformRequests.filter(r => r.status === 'pending').length +
    overtimeRequests.filter(o => o.status === 'pending').length +
    tickets.filter(t => t.status === 'open').length;
  const badges: Partial<Record<AdminTab, number>> = { approvals: pendingApprovals };
  const current = NAV.find(n => n.id === activeTab)!;
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-canvas">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-ink text-gray-300 z-40">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-signal" strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-white">SecurOps</p>
            <p className="text-[11px] text-gray-500">Painel do supervisor</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1" aria-label="Menu principal">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            const badge = badges[item.id];
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
                }`}
              >
                {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-signal" />}
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={active ? 2.3 : 1.9} />
                <span className="flex-1 text-left">{item.label}</span>
                {badge ? (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-signal text-ink text-[11px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500">Supervisor</p>
            </div>
            <button
              onClick={logout}
              title="Sair"
              aria-label="Sair"
              className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-md border-b border-gray-200/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="lg:hidden w-9 h-9 rounded-xl bg-ink flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-signal" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-lg sm:text-xl font-semibold text-gray-900 truncate">{current.label}</h1>
                <p className="text-xs text-gray-500 first-letter:uppercase hidden sm:block">{today}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notificações"
                className="relative p-2.5 text-gray-600 hover:bg-white hover:shadow-sm rounded-xl transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={logout}
                aria-label="Sair"
                className="lg:hidden p-2.5 text-gray-500 hover:text-red-600 hover:bg-white rounded-xl transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}

        <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 pb-28 lg:pb-10">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'posts' && <PostsView />}
          {activeTab === 'uniforms' && <UniformsView />}
          {activeTab === 'approvals' && <ApprovalsView />}
          {activeTab === 'coverage' && <CoverageView />}
          {activeTab === 'ponto' && <PontoView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Navegação inferior (mobile) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink text-gray-400 border-t border-white/10"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Menu principal"
      >
        <div className="grid grid-cols-7">
          {NAV.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const badge = badges[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-col items-center py-2.5 px-1 transition ${active ? 'text-white' : 'hover:text-gray-200'}`}
              >
                {active && <span className="absolute top-0 left-3 right-3 h-0.5 rounded-b-full bg-signal" />}
                <span className="relative">
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.3 : 1.8} />
                  {badge ? <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-signal" /> : null}
                </span>
                <span className="text-[10px] mt-1 font-medium">{tab.short}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead } = useApp();
  const iconFor = (type: string) =>
    type === 'alert' ? (
      <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></span>
    ) : type === 'success' ? (
      <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></span>
    ) : (
      <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Info className="w-4 h-4" /></span>
    );

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="animate-slide-up absolute top-16 right-3 sm:right-8 w-[calc(100vw-1.5rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[28rem] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="font-semibold text-gray-900">Notificações</h3>
          <span className="text-xs text-gray-500">{notifications.filter(n => !n.read).length} não lidas</span>
        </div>
        {notifications.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">Nenhuma notificação por aqui.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`px-5 py-3.5 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/40' : ''}`}
                onClick={() => markNotificationRead(n.id)}
              >
                <div className="flex items-start gap-3">
                  {iconFor(n.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString('pt-BR')}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const statusMeta = {
  ok: { label: 'Coberto', dot: 'bg-emerald-500', bar: 'bg-emerald-400', beacon: 'rgb(16 185 129 / 0.5)', text: 'text-emerald-700', chip: 'bg-emerald-50 text-emerald-700' },
  warning: { label: 'Atenção', dot: 'bg-amber-500', bar: 'bg-amber-400', beacon: 'rgb(245 158 11 / 0.55)', text: 'text-amber-700', chip: 'bg-amber-50 text-amber-700' },
  critical: { label: 'Crítico', dot: 'bg-red-600', bar: 'bg-red-600', beacon: 'rgb(239 68 68 / 0.55)', text: 'text-red-700', chip: 'bg-red-50 text-red-700' },
} as const;

const riskMeta = {
  high: { label: 'Risco alto', cls: 'bg-red-50 text-red-700' },
  medium: { label: 'Risco médio', cls: 'bg-amber-50 text-amber-700' },
  low: { label: 'Risco baixo', cls: 'bg-emerald-50 text-emerald-700' },
} as const;

function MetricTile({ label, value, hint, icon: Icon, tone }: { label: string; value: number; hint: string; icon: LucideIcon; tone: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${tone}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <p className="font-display text-4xl font-semibold text-gray-900 mt-3 tabular-nums">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{hint}</p>
    </div>
  );
}

function DashboardView() {
  const { posts, postAllocations, uniformRequests, tickets, coverages, overtimeRequests } = useApp();

  // O status vem da alocação real de vigilantes (mesma regra da tela Postos)
  const stateOf = (p: (typeof posts)[number]): 'ok' | 'warning' | 'critical' => {
    const n = (postAllocations[p.id] || []).length;
    return n === 0 ? 'critical' : n < p.requiredGuards ? 'warning' : 'ok';
  };
  const okPosts = posts.filter(p => stateOf(p) === 'ok').length;
  const warningPosts = posts.filter(p => stateOf(p) === 'warning').length;
  const criticalPosts = posts.filter(p => stateOf(p) === 'critical').length;
  const pendingUniforms = uniformRequests.filter(r => r.status === 'pending').length;
  const pontoAlerts = 2; // Simulated: guards without today's record
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const pendingHE = overtimeRequests.filter(o => o.status === 'pending').length;
  const activeCoverages = coverages.filter(c => c.status === 'active').length;
  const total = posts.length || 1;

  return (
    <div className="space-y-6">
      {/* Situação geral */}
      <section className="relative overflow-hidden rounded-3xl bg-ink text-white p-6 sm:p-8">
        <div className="grid-ink absolute inset-0 opacity-70" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] lg:items-end">
          <div>
            <p className="text-sm text-gray-400">Postos cobertos agora</p>
            <p className="font-display mt-2 flex items-baseline gap-2">
              <span className="text-7xl font-semibold tabular-nums leading-none">{okPosts}</span>
              <span className="text-2xl text-gray-400">de {posts.length}</span>
            </p>
          </div>

          <div>
            <div className="flex h-3 rounded-full overflow-hidden bg-white/10 gap-0.5" role="img" aria-label={`${okPosts} cobertos, ${warningPosts} em atenção, ${criticalPosts} críticos`}>
              {okPosts > 0 && <div className="bg-emerald-400" style={{ width: `${(okPosts / total) * 100}%` }} />}
              {warningPosts > 0 && <div className="bg-amber-400" style={{ width: `${(warningPosts / total) * 100}%` }} />}
              {criticalPosts > 0 && <div className="bg-red-500" style={{ width: `${(criticalPosts / total) * 100}%` }} />}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <span className="flex items-center gap-2 text-gray-300"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />{okPosts} cobertos</span>
              <span className="flex items-center gap-2 text-gray-300"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />{warningPosts} em atenção</span>
              <span className="flex items-center gap-2 text-gray-300"><span className="w-2.5 h-2.5 rounded-full bg-red-500" />{criticalPosts} críticos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile label="Pendências" value={pendingUniforms + pendingHE} hint="Uniformes e horas extras" icon={ClipboardCheck} tone="bg-blue-50 text-blue-600" />
        <MetricTile label="Chamados abertos" value={openTickets} hint="Aguardando atendimento" icon={Wrench} tone="bg-amber-50 text-amber-600" />
        <MetricTile label="Sem registro hoje" value={pontoAlerts} hint="Vigilantes sem ponto" icon={Clock} tone="bg-red-50 text-red-600" />
        <MetricTile label="Coberturas ativas" value={activeCoverages} hint="Substituições em andamento" icon={Repeat2} tone="bg-violet-50 text-violet-600" />
      </section>

      {/* Painel de postos */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display text-xl font-semibold text-gray-900">Postos</h2>
          <p className="text-xs text-gray-500">Vigilantes alocados / necessários</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {posts.map(post => {
            const state = stateOf(post);
            const s = statusMeta[state];
            const r = riskMeta[post.risk];
            const allocated = (postAllocations[post.id] || []).length;
            const pct = Math.min(100, (allocated / Math.max(post.requiredGuards, 1)) * 100);
            return (
              <article key={post.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-gray-900 truncate">{post.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{post.address}</p>
                  </div>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${s.dot} ${state === 'ok' ? '' : 'beacon'}`}
                      style={{ ['--beacon' as string]: s.beacon }}
                    />
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-gray-500">Vigilantes</span>
                    <span className="font-semibold text-gray-900 tabular-nums">{allocated} / {post.requiredGuards}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-md font-medium ${r.cls}`}>{r.label}</span>
                  <span className="text-gray-500">Ronda a cada {post.roundInterval} min</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Atividade */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-display font-semibold text-gray-900 mb-3">Chamados recentes</h3>
          {tickets.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">Nenhum chamado aberto até agora.</p>
          ) : (
            <div className="space-y-1">
              {tickets.slice(0, 4).map(t => (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${t.priority === 'critical' ? 'bg-red-600' : t.priority === 'high' ? 'bg-orange-500' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-gray-300'}`}></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{t.description}</p>
                    <p className="text-xs text-gray-400">{t.postName} · {t.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${t.status === 'open' ? 'bg-blue-50 text-blue-700' : t.status === 'in_progress' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                    {t.status === 'open' ? 'Aberto' : t.status === 'in_progress' ? 'Andamento' : 'Resolvido'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-display font-semibold text-gray-900 mb-3">Fila de aprovação</h3>
          {pendingUniforms + pendingHE === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">Tudo em dia. Nenhuma aprovação pendente.</p>
          ) : (
            <div className="space-y-1">
              {uniformRequests.filter(r => r.status === 'pending').map(r => (
                <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50">
                  <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Shirt className="w-4 h-4" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{r.guardName}</p>
                    <p className="text-xs text-gray-400">{r.itemName} ({r.size}) × {r.quantity}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-700 font-medium">Pendente</span>
                </div>
              ))}
              {overtimeRequests.filter(o => o.status === 'pending').map(o => (
                <div key={o.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50">
                  <span className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0"><Hourglass className="w-4 h-4" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{o.guardName}</p>
                    <p className="text-xs text-gray-400">{o.date} · {o.startTime}–{o.endTime}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-700 font-medium">Pendente</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PostsView() {
  const { posts, postAllocations, allocateGuardToPost, removeGuardFromPost, addPost, removePost, updatePost } = useApp();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);

  // Estado do formulário de novo posto
  const [newPost, setNewPost] = useState({
    name: '',
    address: '',
    risk: 'medium' as 'low' | 'medium' | 'high',
    requiredGuards: 1,
    roundInterval: 60,
    gpsCoords: { lat: 0, lng: 0 },
  });

  const handleCreatePost = () => {
    if (!newPost.name || !newPost.address) return;
    addPost(newPost);
    setNewPost({ name: '', address: '', risk: 'medium', requiredGuards: 1, roundInterval: 60, gpsCoords: { lat: 0, lng: 0 } });
    setShowNewPostModal(false);
  };

  // Lista de todos os vigilantes
  const guards = [
    { id: '1', name: 'Carlos Silva', matricula: 'V001' },
    { id: '2', name: 'João Santos', matricula: 'V002' },
    { id: '3', name: 'Pedro Oliveira', matricula: 'V003' },
    { id: '4', name: 'Roberto Lima', matricula: 'V004' },
  ];

  // Função para descobrir em qual posto um vigilante está alocado
  const getGuardPost = (guardId: string): string | null => {
    for (const [postId, guardIds] of Object.entries(postAllocations)) {
      if (guardIds.includes(guardId)) return postId;
    }
    return null;
  };

  const selectedPostData = posts.find(p => p.id === selectedPost);
  const selectedPostGuards = selectedPost ? (postAllocations[selectedPost] || []) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Postos</h2>
          <p className="text-gray-500 text-sm">Cadastre postos e aloque vigilantes</p>
        </div>
        <button
          onClick={() => setShowNewPostModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>+</span> Novo Posto
        </button>
      </div>

      {/* Resumo de status */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-700">{posts.filter(p => (postAllocations[p.id] || []).length >= p.requiredGuards).length}</p>
          <p className="text-xs text-green-600 mt-1">Postos Completos</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-700">{posts.filter(p => { const a = (postAllocations[p.id] || []).length; return a > 0 && a < p.requiredGuards; }).length}</p>
          <p className="text-xs text-yellow-600 mt-1">Postos Incompletos</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-700">{posts.filter(p => (postAllocations[p.id] || []).length === 0).length}</p>
          <p className="text-xs text-red-600 mt-1">Postos Descobertos</p>
        </div>
      </div>

      {/* Cards de Postos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {posts.map(post => {
          const allocatedGuards = postAllocations[post.id] || [];
          const isComplete = allocatedGuards.length >= post.requiredGuards;
          const isEmpty = allocatedGuards.length === 0;
          const isPartial = !isEmpty && !isComplete;

          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post.id === selectedPost ? null : post.id)}
              className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] ${
                post.id === selectedPost ? 'border-blue-500 shadow-blue-100' :
                isEmpty ? 'border-red-300' :
                isPartial ? 'border-yellow-300' :
                'border-green-300'
              }`}
            >
              {/* Header do card */}
              <div className={`p-4 text-white relative ${
                isEmpty ? 'bg-red-600' :
                isPartial ? 'bg-amber-500' :
                'bg-emerald-600'
              }`}>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingPost(post.id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                  title="Editar posto"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <div className="flex justify-between items-start pr-8">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{post.name}</h3>
                    <p className="text-xs opacity-90 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {post.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{allocatedGuards.length}/{post.requiredGuards}</div>
                    <div className="text-[10px] opacity-90">vigilantes</div>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (allocatedGuards.length / post.requiredGuards) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Corpo do card */}
              <div className="p-4">
                {/* Info do posto */}
                <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b border-gray-100">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    post.risk === 'high' ? 'bg-red-100 text-red-700' :
                    post.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Risco {post.risk === 'high' ? 'Alto' : post.risk === 'medium' ? 'Médio' : 'Baixo'}
                  </span>
                  <span className="text-gray-500">Ronda: {post.roundInterval}min</span>
                </div>

                {/* Lista de vigilantes alocados */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Vigilantes Alocados</p>
                  {allocatedGuards.length === 0 ? (
                    <div className="text-center py-4 bg-red-50 rounded-lg border border-dashed border-red-200">
                      <p className="text-red-500 text-sm font-medium">Posto descoberto</p>
                      <p className="text-red-400 text-xs mt-1">Nenhum vigilante alocado</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {allocatedGuards.map(guardId => {
                        const guard = guards.find(g => g.id === guardId);
                        if (!guard) return null;
                        return (
                          <div key={guardId} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                {guard.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{guard.name}</p>
                                <p className="text-[10px] text-gray-500">{guard.matricula}</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeGuardFromPost(post.id, guardId); }}
                              className="text-gray-400 hover:text-red-500 transition p-1"
                              title="Remover vigilante"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Botão para alocar mais */}
                  {allocatedGuards.length < post.requiredGuards && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedPost(post.id); setShowAllocateModal(true); }}
                      className="w-full mt-2 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 hover:border-blue-400 transition flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Alocar Vigilante ({post.requiredGuards - allocatedGuards.length} vaga{post.requiredGuards - allocatedGuards.length > 1 ? 's' : ''})
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Alocação */}
      {showAllocateModal && selectedPostData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAllocateModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-ink p-5 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Alocar Vigilante</p>
                  <h3 className="text-xl font-bold mt-1">{selectedPostData.name}</h3>
                  <p className="text-xs text-blue-200 mt-1">
                    Faltam {selectedPostData.requiredGuards - selectedPostGuards.length} vigilante{(selectedPostData.requiredGuards - selectedPostGuards.length) > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowAllocateModal(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Lista de vigilantes disponíveis */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Vigilantes Disponíveis</p>
              <div className="space-y-2">
                {guards.map(guard => {
                  const currentPost = getGuardPost(guard.id);
                  const isAllocatedHere = currentPost === selectedPost;
                  const isAllocatedElsewhere = currentPost !== null && currentPost !== selectedPost;
                  const otherPost = isAllocatedElsewhere ? posts.find(p => p.id === currentPost) : null;

                  return (
                    <div
                      key={guard.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition ${
                        isAllocatedHere
                          ? 'bg-green-50 border-green-200'
                          : isAllocatedElsewhere
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          isAllocatedHere ? 'bg-green-100 text-green-600' :
                          isAllocatedElsewhere ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {guard.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{guard.name}</p>
                          <p className="text-xs text-gray-500">{guard.matricula}</p>
                          {isAllocatedHere && <p className="text-[10px] text-green-600 font-medium">✓ Já alocado aqui</p>}
                          {isAllocatedElsewhere && <p className="text-[10px] text-yellow-600">Em: {otherPost?.name}</p>}
                          {!isAllocatedHere && !isAllocatedElsewhere && <p className="text-[10px] text-gray-400">Sem posto atribuído</p>}
                        </div>
                      </div>
                      {!isAllocatedHere && (
                        <button
                          onClick={() => {
                            allocateGuardToPost(selectedPost!, guard.id);
                            if (selectedPostGuards.length + 1 >= selectedPostData.requiredGuards) {
                              setShowAllocateModal(false);
                            }
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition active:scale-95"
                        >
                          {isAllocatedElsewhere ? 'Transferir' : 'Alocar'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Posto */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowNewPostModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-ink p-5 text-white sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Cadastro</p>
                  <h3 className="text-xl font-bold mt-1">Novo Posto de Serviço</h3>
                  <p className="text-xs text-blue-200 mt-1">Preencha os dados do novo posto</p>
                </div>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Formulário */}
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Nome do Posto *</label>
                <input
                  type="text"
                  value={newPost.name}
                  onChange={e => setNewPost({ ...newPost, name: e.target.value })}
                  placeholder="Ex: Edifício Comercial ABC"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Endereço Completo *</label>
                <input
                  type="text"
                  value={newPost.address}
                  onChange={e => setNewPost({ ...newPost, address: e.target.value })}
                  placeholder="Ex: Rua das Flores, 123 - Bairro"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Nível de Risco</label>
                  <select
                    value={newPost.risk}
                    onChange={e => setNewPost({ ...newPost, risk: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="low">Baixo</option>
                    <option value="medium">Médio</option>
                    <option value="high">Alto</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Vigilantes Necessários</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNewPost({ ...newPost, requiredGuards: Math.max(1, newPost.requiredGuards - 1) })}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold text-lg transition"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center bg-gray-50 rounded-lg py-2">
                      <span className="text-xl font-bold text-gray-800">{newPost.requiredGuards}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewPost({ ...newPost, requiredGuards: Math.min(10, newPost.requiredGuards + 1) })}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold text-lg transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Intervalo de Ronda (minutos)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 90, 120].map(min => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setNewPost({ ...newPost, roundInterval: min })}
                      className={`py-2.5 rounded-lg text-sm font-semibold transition ${
                        newPost.roundInterval === min
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {min}min
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newPost.gpsCoords.lat || ''}
                    onChange={e => setNewPost({ ...newPost, gpsCoords: { ...newPost.gpsCoords, lat: parseFloat(e.target.value) || 0 } })}
                    placeholder="-23.5614"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newPost.gpsCoords.lng || ''}
                    onChange={e => setNewPost({ ...newPost, gpsCoords: { ...newPost.gpsCoords, lng: parseFloat(e.target.value) || 0 } })}
                    placeholder="-46.6558"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 -mt-2">Coordenadas opcionais - usadas para geolocalização do check-in</p>

              {/* Preview */}
              {newPost.name && newPost.address && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">Pré-visualização:</p>
                  <p className="text-sm font-semibold text-blue-800">{newPost.name}</p>
                  <p className="text-xs text-blue-600">{newPost.address}</p>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="text-blue-700">Risco: <strong>{newPost.risk === 'high' ? 'Alto' : newPost.risk === 'medium' ? 'Médio' : 'Baixo'}</strong></span>
                    <span className="text-blue-700">Vigilantes: <strong>{newPost.requiredGuards}</strong></span>
                    <span className="text-blue-700">Ronda: <strong>{newPost.roundInterval}min</strong></span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-500 rounded-xl font-medium text-sm hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.name || !newPost.address}
                  className="flex-[2] py-3 bg-ink text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  ✓ Cadastrar Posto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Posto */}
      {editingPost && (() => {
        const post = posts.find(p => p.id === editingPost);
        if (!post) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setEditingPost(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="bg-amber-500 p-5 text-white sticky top-0 z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-orange-100 text-xs font-medium uppercase tracking-wider">Editar</p>
                    <h3 className="text-xl font-bold mt-1">{post.name}</h3>
                  </div>
                  <button
                    onClick={() => setEditingPost(null)}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <EditPostForm
                post={post}
                onSave={(data) => { updatePost(post.id, data); setEditingPost(null); }}
                onDelete={() => { removePost(post.id); setEditingPost(null); }}
                onCancel={() => setEditingPost(null)}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* Componente auxiliar para edição de posto */
function EditPostForm({ post, onSave, onDelete, onCancel }: {
  post: any;
  onSave: (data: any) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(post.name);
  const [address, setAddress] = useState(post.address);
  const [risk, setRisk] = useState(post.risk);
  const [requiredGuards, setRequiredGuards] = useState(post.requiredGuards);
  const [roundInterval, setRoundInterval] = useState(post.roundInterval);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="p-5 space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Nome do Posto</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Endereço</label>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Nível de Risco</label>
          <select
            value={risk}
            onChange={e => setRisk(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="low">Baixo</option>
            <option value="medium">Médio</option>
            <option value="high">Alto</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Vigilantes</label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setRequiredGuards(Math.max(1, requiredGuards - 1))} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold">−</button>
            <div className="flex-1 text-center bg-gray-50 rounded-lg py-2"><span className="text-xl font-bold">{requiredGuards}</span></div>
            <button type="button" onClick={() => setRequiredGuards(Math.min(10, requiredGuards + 1))} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold">+</button>
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Intervalo de Ronda (min)</label>
        <div className="grid grid-cols-4 gap-2">
          {[30, 60, 90, 120].map(min => (
            <button
              key={min}
              type="button"
              onClick={() => setRoundInterval(min)}
              className={`py-2.5 rounded-lg text-sm font-semibold transition ${
                roundInterval === min ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {min}min
            </button>
          ))}
        </div>
      </div>

      {!confirmDelete ? (
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setConfirmDelete(true)}
            className="py-3 px-4 border-2 border-red-200 text-red-500 rounded-xl font-medium text-sm hover:bg-red-50 transition"
          >
            Excluir
          </button>
          <button onClick={onCancel} className="flex-1 py-3 border-2 border-gray-200 text-gray-500 rounded-xl font-medium text-sm hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            onClick={() => onSave({ name, address, risk, requiredGuards, roundInterval })}
            disabled={!name || !address}
            className="flex-[2] py-3 bg-amber-500 text-white rounded-xl font-semibold text-sm shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
          >
            ✓ Salvar
          </button>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700 font-medium mb-2">Confirmar exclusão do posto "{post.name}"?</p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-sm">Cancelar</button>
            <button onClick={onDelete} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">Confirmar Exclusão</button>
          </div>
        </div>
      )}
    </div>
  );
}

function UniformsView() {
  const { uniformItems, uniformRequests, updateUniformRequestStatus } = useApp();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Uniformes</h2>
          <p className="text-gray-500 text-sm">Controle de estoque e solicitações</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
          <span>+</span> Novo Item
        </button>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {uniformItems.map(item => (
          <div key={item.id} className={`bg-white rounded-xl p-4 shadow-sm border ${item.blocked ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
              {item.blocked && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">Bloqueado</span>}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{item.stock}</p>
                <p className="text-xs text-gray-500">em estoque</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.stock < 10 ? 'bg-red-100 text-red-600' : item.stock < 20 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                {item.stock < 10 ? <AlertTriangle className="w-5 h-5" /> : item.stock < 20 ? <Package className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Solicitações de Uniforme</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Vigilante</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Item</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Tam.</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Qtd.</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Motivo</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {uniformRequests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{req.guardName}</td>
                  <td className="px-4 py-3 text-gray-600">{req.itemName}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{req.size}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{req.quantity}</td>
                  <td className="px-4 py-3 text-gray-600">{req.reason}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      req.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                      req.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {req.status === 'pending' ? 'Pendente' : req.status === 'approved' ? 'Aprovado' : req.status === 'delivered' ? 'Entregue' : 'Recusado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {req.status === 'pending' && (
                      <div className="flex justify-center gap-1">
                        <button onClick={() => updateUniformRequestStatus(req.id, 'approved')} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition">Aprovar</button>
                        <button onClick={() => updateUniformRequestStatus(req.id, 'rejected')} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition">Recusar</button>
                      </div>
                    )}
                    {req.status === 'approved' && (
                      <button onClick={() => updateUniformRequestStatus(req.id, 'delivered')} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition">Marcar Entregue</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ApprovalsView() {
  const { uniformRequests, overtimeRequests, tickets, updateUniformRequestStatus, updateOvertimeStatus, updateTicketStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'uniforms' | 'overtime' | 'tickets' | 'justifications'>('uniforms');
  
  const pendingUniforms = uniformRequests.filter(r => r.status === 'pending');
  const pendingHE = overtimeRequests.filter(o => o.status === 'pending');
  const openTickets = tickets.filter(t => t.status === 'open');
  
  // Buscar todas as justificativas pendentes do localStorage
  const getPendingJustifications = () => {
    const saved = localStorage.getItem('ponto_records');
    if (!saved) return [];
    
    const records = JSON.parse(saved);
    const justifications: Array<{
      day: number;
      field: string;
      motivo: string;
      guardName: string;
    }> = [];
    
    Object.entries(records).forEach(([dayStr, record]: [string, any]) => {
      if (record.justificativas) {
        Object.entries(record.justificativas).forEach(([field, just]: [string, any]) => {
          if (just.status === 'pending') {
            justifications.push({
              day: parseInt(dayStr),
              field,
              motivo: just.motivo,
              guardName: 'Vigilante' // Em produção, buscar do usuário logado
            });
          }
        });
      }
    });
    
    return justifications;
  };
  
  const pendingJustifications = getPendingJustifications();

  const tabs = [
    { id: 'uniforms' as const, label: 'Uniformes', count: pendingUniforms.length, icon: Shirt, color: 'yellow' },
    { id: 'overtime' as const, label: 'Horas Extra', count: pendingHE.length, icon: Timer, color: 'purple' },
    { id: 'tickets' as const, label: 'Chamados', count: openTickets.length, icon: Wrench, color: 'blue' },
    { id: 'justifications' as const, label: 'Justificativas', count: pendingJustifications.length, icon: FileText, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Central de Aprovações</h2>
        <p className="text-gray-500 text-sm">Aprove ou recuse solicitações pendentes</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-4 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-gray-800 bg-gray-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className="w-[18px] h-[18px]" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    tab.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                    tab.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
              {activeTab === tab.id && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  tab.color === 'yellow' ? 'bg-yellow-500' :
                  tab.color === 'purple' ? 'bg-purple-500' :
                  'bg-blue-500'
                }`}></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Uniforms Tab */}
          {activeTab === 'uniforms' && (
            <div>
              {pendingUniforms.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500" strokeWidth={1.5} />
                  <p className="text-gray-500 text-lg font-medium">Nenhuma solicitação pendente</p>
                  <p className="text-gray-400 text-sm mt-1">Todas as solicitações de uniforme foram processadas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingUniforms.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {req.guardName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{req.guardName}</p>
                          <p className="text-sm text-gray-600">{req.itemName} • Tam: {req.size} • Qtd: {req.quantity}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Motivo: {req.reason}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateUniformRequestStatus(req.id, 'approved')} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition shadow-sm">
                          ✓ Aprovar
                        </button>
                        <button onClick={() => updateUniformRequestStatus(req.id, 'rejected')} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition shadow-sm">
                          ✗ Recusar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Overtime Tab */}
          {activeTab === 'overtime' && (
            <div>
              {pendingHE.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500" strokeWidth={1.5} />
                  <p className="text-gray-500 text-lg font-medium">Nenhuma hora extra pendente</p>
                  <p className="text-gray-400 text-sm mt-1">Todas as solicitações de HE foram processadas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingHE.map(ot => (
                    <div key={ot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                          {ot.guardName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{ot.guardName}</p>
                          <p className="text-sm text-gray-600">{ot.date} • {ot.startTime} às {ot.endTime}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Motivo: {ot.reason}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateOvertimeStatus(ot.id, 'approved')} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition shadow-sm">
                          ✓ Aprovar
                        </button>
                        <button onClick={() => updateOvertimeStatus(ot.id, 'rejected')} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition shadow-sm">
                          ✗ Recusar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div>
              {openTickets.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500" strokeWidth={1.5} />
                  <p className="text-gray-500 text-lg font-medium">Nenhum chamado aberto</p>
                  <p className="text-gray-400 text-sm mt-1">Todos os chamados foram resolvidos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {openTickets.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded-full ${
                          t.priority === 'critical' ? 'bg-red-600' :
                          t.priority === 'high' ? 'bg-orange-500' :
                          t.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}></span>
                        <div>
                          <p className="font-semibold text-gray-800">{t.description}</p>
                          <p className="text-sm text-gray-600">{t.guardName} • {t.postName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Categoria: {t.category}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateTicketStatus(t.id, 'in_progress')} className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition shadow-sm">
                          Em Andamento
                        </button>
                        <button onClick={() => updateTicketStatus(t.id, 'resolved')} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition shadow-sm">
                          Resolver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Justifications Tab */}
          {activeTab === 'justifications' && (
            <div>
              {pendingJustifications.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500" strokeWidth={1.5} />
                  <p className="text-gray-500 text-lg font-medium">Nenhuma justificativa pendente</p>
                  <p className="text-gray-400 text-sm mt-1">Todas as justificativas foram processadas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingJustifications.map((just, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                          ⚠️
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Dia {String(just.day).padStart(2, '0')} - {just.field}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Motivo:</span> {just.motivo}
                          </p>
                          <p className="text-xs text-orange-600 mt-1">Status: Pendente de aprovação</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const saved = localStorage.getItem('ponto_records');
                            if (saved) {
                              const records = JSON.parse(saved);
                              if (records[just.day]?.justificativas?.[just.field]) {
                                records[just.day].justificativas[just.field].status = 'approved';
                                localStorage.setItem('ponto_records', JSON.stringify(records));
                                window.location.reload();
                              }
                            }
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition shadow-sm"
                        >
                          ✓ Aprovar
                        </button>
                        <button
                          onClick={() => {
                            const saved = localStorage.getItem('ponto_records');
                            if (saved) {
                              const records = JSON.parse(saved);
                              if (records[just.day]?.justificativas?.[just.field]) {
                                records[just.day].justificativas[just.field].status = 'rejected';
                                localStorage.setItem('ponto_records', JSON.stringify(records));
                                window.location.reload();
                              }
                            }
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition shadow-sm"
                        >
                          ✗ Rejeitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CoverageView() {
  const { coverages, updateCoverageStatus } = useApp();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Gestão de Coberturas</h2>
        <p className="text-gray-500 text-sm">Controle de coberturas e substituições</p>
      </div>

      {/* Coverage Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Mapa de Cobertura - Hoje</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coverages.map(cov => (
            <div key={cov.id} className={`rounded-xl p-4 border-2 ${
              cov.status === 'active' ? 'border-green-300 bg-green-50' :
              cov.status === 'requested' ? 'border-yellow-300 bg-yellow-50' :
              cov.status === 'approved' ? 'border-blue-300 bg-blue-50' :
              'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <p className="font-semibold text-gray-800 text-sm">{cov.postName}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  cov.status === 'active' ? 'bg-green-200 text-green-800' :
                  cov.status === 'requested' ? 'bg-yellow-200 text-yellow-800' :
                  cov.status === 'approved' ? 'bg-blue-200 text-blue-800' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {cov.status === 'active' ? 'Ativa' : cov.status === 'requested' ? 'Aguardando' : cov.status === 'approved' ? '✓ Aprovada' : '✓ Concluída'}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">→</span>
                  <div>
                    <p className="text-xs text-gray-500">Titular</p>
                    <p className="text-gray-700 font-medium">{cov.titularName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">→</span>
                  <div>
                    <p className="text-xs text-gray-500">Cobertura</p>
                    <p className="text-gray-700 font-medium">{cov.coverageName}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200/50 text-xs text-gray-500">
                <p>Tipo: {cov.type === 'substitution' ? 'Troca' : 'Cobertura'}</p>
                {cov.checkIn && <p>Check-in: {new Date(cov.checkIn).toLocaleTimeString('pt-BR')}</p>}
                {cov.checkOut && <p>Check-out: {new Date(cov.checkOut).toLocaleTimeString('pt-BR')}</p>}
              </div>
              {cov.status === 'requested' && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => updateCoverageStatus(cov.id, 'approved')} className="flex-1 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition">Aprovar</button>
                  <button onClick={() => updateCoverageStatus(cov.id, 'completed')} className="flex-1 py-1.5 bg-gray-400 text-white rounded-lg text-xs font-medium hover:bg-gray-500 transition">Recusar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PontoView() {
  const { currentUser } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedGuardId, setSelectedGuardId] = useState<string | null>(null);
  const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Simulated guard time records for admin view
  const guardRecords: Record<string, Record<string, { entrada1: string; saida1: string; entrada2: string; saida2: string; entradaHE: string; saidaHE: string }>> = {
    '1': { // Carlos Silva
      '15': { entrada1: '07:00', saida1: '12:00', entrada2: '13:00', saida2: '19:00', entradaHE: '', saidaHE: '' },
      '16': { entrada1: '06:55', saida1: '12:02', entrada2: '13:05', saida2: '19:00', entradaHE: '19:00', saidaHE: '22:00' },
      '17': { entrada1: '07:02', saida1: '12:00', entrada2: '13:00', saida2: '19:05', entradaHE: '', saidaHE: '' },
      '18': { entrada1: '07:00', saida1: '12:00', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
      '19': { entrada1: '07:10', saida1: '12:00', entrada2: '13:00', saida2: '19:00', entradaHE: '19:30', saidaHE: '23:00' },
      '20': { entrada1: '', saida1: '', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
      '21': { entrada1: '06:58', saida1: '12:00', entrada2: '13:02', saida2: '19:00', entradaHE: '', saidaHE: '' },
    },
    '2': { // João Santos
      '15': { entrada1: '19:00', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '00:00', saidaHE: '03:00' },
      '16': { entrada1: '19:05', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
      '17': { entrada1: '19:00', saida1: '00:05', entrada2: '', saida2: '', entradaHE: '00:30', saidaHE: '04:00' },
      '18': { entrada1: '19:00', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
      '19': { entrada1: '19:00', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
      '20': { entrada1: '19:02', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '01:00', saidaHE: '04:30' },
      '21': { entrada1: '', saida1: '', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
    },
    '3': { // Pedro Oliveira
      '15': { entrada1: '07:00', saida1: '12:00', entrada2: '13:00', saida2: '19:00', entradaHE: '', saidaHE: '' },
      '16': { entrada1: '07:05', saida1: '12:00', entrada2: '13:00', saida2: '19:00', entradaHE: '19:00', saidaHE: '23:00' },
      '17': { entrada1: '', saida1: '', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
      '18': { entrada1: '07:00', saida1: '12:00', entrada2: '13:00', saida2: '19:00', entradaHE: '', saidaHE: '' },
      '19': { entrada1: '07:00', saida1: '12:00', entrada2: '13:00', saida2: '19:00', entradaHE: '19:00', saidaHE: '22:30' },
      '20': { entrada1: '07:00', saida1: '12:00', entrada2: '13:00', saida2: '19:00', entradaHE: '', saidaHE: '' },
      '21': { entrada1: '07:00', saida1: '12:00', entrada2: '13:00', saida2: '19:00', entradaHE: '', saidaHE: '' },
    },
    '4': { // Roberto Lima
      '15': { entrada1: '19:00', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
      '16': { entrada1: '19:00', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '00:00', saidaHE: '04:00' },
      '17': { entrada1: '19:00', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
      '18': { entrada1: '19:00', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '01:00', saidaHE: '05:00' },
      '19': { entrada1: '', saida1: '', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
      '20': { entrada1: '19:05', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' },
      '21': { entrada1: '19:00', saida1: '00:00', entrada2: '', saida2: '', entradaHE: '00:30', saidaHE: '04:00' },
    },
  };

  const guards = [
    { id: '1', name: 'Carlos Silva', matricula: 'V001', posto: 'Edifício Central' },
    { id: '2', name: 'João Santos', matricula: 'V002', posto: 'Condomínio Parque Sul' },
    { id: '3', name: 'Pedro Oliveira', matricula: 'V003', posto: 'Depósito Industrial' },
    { id: '4', name: 'Roberto Lima', matricula: 'V004', posto: 'Shopping Center Norte' },
  ];

  const selectedGuard = guards.find(g => g.id === selectedGuardId);

  const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const startDay = 15;
  const days: number[] = [];
  for (let d = startDay; d <= lastDay; d++) days.push(d);

  const getDayOfWeek = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    return WEEKDAYS_SHORT[date.getDay()];
  };

  const isSunday = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    return date.getDay() === 0;
  };

  const calcDayTotal = (record: { entrada1: string; saida1: string; entrada2: string; saida2: string; entradaHE?: string; saidaHE?: string } | undefined): string => {
    if (!record || !record.entrada1 || !record.saida1) return '--:--';
    const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    let total = toMin(record.saida1) - toMin(record.entrada1);
    if (record.entrada2 && record.saida2) total += toMin(record.saida2) - toMin(record.entrada2);
    if (total < 0) total += 24 * 60;
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    return `${String(hours).padStart(2, '0')}h${String(mins).padStart(2, '0')}`;
  };

  const calcHETotal = (record: { entradaHE?: string; saidaHE?: string } | undefined): string => {
    if (!record || !record.entradaHE || !record.saidaHE) return '';
    const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    let heMin = toMin(record.saidaHE) - toMin(record.entradaHE);
    if (heMin < 0) heMin += 24 * 60;
    const hours = Math.floor(heMin / 60);
    const mins = heMin % 60;
    return `${String(hours).padStart(2, '0')}h${String(mins).padStart(2, '0')}`;
  };

  const getGuardStats = (guardId: string) => {
    const records = guardRecords[guardId] || {};
    let worked = 0, totalMinutes = 0, absent = 0;
    days.forEach(d => {
      const r = records[`${d}`];
      if (r?.entrada1 && r?.saida1) {
        worked++;
        const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
        let dayMin = toMin(r.saida1) - toMin(r.entrada1);
        if (r.entrada2 && r.saida2) dayMin += toMin(r.saida2) - toMin(r.entrada2);
        if (dayMin < 0) dayMin += 24 * 60;
        totalMinutes += dayMin;
      } else if (!isSunday(d)) {
        absent++;
      }
    });
    return { worked, totalHours: Math.floor(totalMinutes / 60), absent };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Relatório de Ponto Eletrônico</h2>
          <p className="text-gray-500 text-sm">Acompanhe os registros de ponto de todos os vigilantes</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(+e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <span className="text-sm font-medium text-gray-600">{selectedYear}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {guards.map(guard => {
          const stats = getGuardStats(guard.id);
          const isSelected = selectedGuardId === guard.id;
          return (
            <div
              key={guard.id}
              onClick={() => setSelectedGuardId(isSelected ? null : guard.id)}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                isSelected ? 'border-indigo-500 shadow-indigo-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {guard.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{guard.name}</p>
                  <p className="text-xs text-gray-500">{guard.matricula}</p>
                  <p className="text-[10px] text-indigo-600 flex items-center gap-0.5 mt-0.5 truncate">
                    <svg className="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {guard.posto}
                  </p>
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-green-700">{stats.worked}</p>
                  <p className="text-[9px] text-green-600">Dias</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-blue-700">{stats.totalHours}h</p>
                  <p className="text-[9px] text-blue-600">Total</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-red-700">{stats.absent}</p>
                  <p className="text-[9px] text-red-600">Faltas</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed View for Selected Guard */}
      {selectedGuard && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-300 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-ink text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {selectedGuard.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{selectedGuard.name}</h3>
                <div className="flex items-center gap-3 text-xs opacity-90">
                  <span>Mat: {selectedGuard.matricula}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedGuard.posto}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedGuardId(null)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats do vigilante selecionado */}
          {(() => {
            const records = guardRecords[selectedGuard.id] || {};
            let worked = 0, totalMin = 0, totalHE = 0, absent = 0;
            days.forEach(d => {
              const r = records[`${d}`];
              if (r?.entrada1 && r?.saida1) {
                worked++;
                const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
                let dayMin = toMin(r.saida1) - toMin(r.entrada1);
                if (r.entrada2 && r.saida2) dayMin += toMin(r.saida2) - toMin(r.entrada2);
                if (dayMin < 0) dayMin += 24 * 60;
                totalMin += dayMin;
                if (r.entradaHE && r.saidaHE) {
                  let heMin = toMin(r.saidaHE) - toMin(r.entradaHE);
                  if (heMin < 0) heMin += 24 * 60;
                  totalHE += heMin;
                }
              } else if (!isSunday(d)) {
                absent++;
              }
            });
            return (
              <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 border-b border-gray-200">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">{worked}</p>
                  <p className="text-[10px] text-gray-500">Dias Trabalhados</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">{Math.floor(totalMin / 60)}h{String(totalMin % 60).padStart(2, '0')}</p>
                  <p className="text-[10px] text-gray-500">Total Horas</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-orange-600">{Math.floor(totalHE / 60)}h{String(totalHE % 60).padStart(2, '0')}</p>
                  <p className="text-[10px] text-gray-500">Horas Extras</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-red-600">{absent}</p>
                  <p className="text-[10px] text-gray-500">Faltas</p>
                </div>
              </div>
            );
          })()}

          {/* Tabela detalhada do vigilante */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Dia</th>
                  <th className="px-2 py-2 text-center font-medium">1ª Ent.</th>
                  <th className="px-2 py-2 text-center font-medium">1ª Saída</th>
                  <th className="px-2 py-2 text-center font-medium">2ª Ent.</th>
                  <th className="px-2 py-2 text-center font-medium">2ª Saída</th>
                  <th className="px-2 py-2 text-center font-medium bg-orange-700">Ent. HE</th>
                  <th className="px-2 py-2 text-center font-medium bg-orange-700">Saí. HE</th>
                  <th className="px-2 py-2 text-center font-medium">Total</th>
                  <th className="px-2 py-2 text-center font-medium">HE</th>
                  <th className="px-2 py-2 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {days.map(day => {
                  const record = (guardRecords[selectedGuard.id] || {})[`${day}`];
                  const sunday = isSunday(day);
                  const hasRecord = record?.entrada1 && record?.saida1;
                  const hasHE = record?.entradaHE && record?.saidaHE;
                  return (
                    <tr key={day} className={`${sunday ? 'bg-red-50/50' : hasRecord ? '' : 'bg-yellow-50/30'}`}>
                      <td className="px-3 py-2">
                        <span className="font-bold text-gray-700">{String(day).padStart(2, '0')}</span>
                        <span className={`ml-1.5 text-gray-400 ${sunday ? 'text-red-400' : ''}`}>{getDayOfWeek(day)}</span>
                      </td>
                      <td className="px-2 py-2 text-center font-mono">{record?.entrada1 || <span className="text-gray-300">--:--</span>}</td>
                      <td className="px-2 py-2 text-center font-mono">{record?.saida1 || <span className="text-gray-300">--:--</span>}</td>
                      <td className="px-2 py-2 text-center font-mono">{record?.entrada2 || <span className="text-gray-300">--:--</span>}</td>
                      <td className="px-2 py-2 text-center font-mono">{record?.saida2 || <span className="text-gray-300">--:--</span>}</td>
                      <td className="px-2 py-2 text-center font-mono bg-orange-50/50">{record?.entradaHE || <span className="text-gray-300">--:--</span>}</td>
                      <td className="px-2 py-2 text-center font-mono bg-orange-50/50">{record?.saidaHE || <span className="text-gray-300">--:--</span>}</td>
                      <td className="px-2 py-2 text-center font-mono font-semibold text-green-700">{calcDayTotal(record)}</td>
                      <td className="px-2 py-2 text-center font-mono font-semibold text-orange-600">{calcHETotal(record) || <span className="text-gray-300">--:--</span>}</td>
                      <td className="px-2 py-2 text-center">
                        {sunday ? (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px]">Folga</span>
                        ) : hasRecord ? (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-600 rounded text-[10px]">✓ OK</span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-600 rounded text-[10px]">⚠ Pend.</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Table per Guard - Only show when no guard is selected */}
      {!selectedGuardId && guards.map(guard => {
        const records = guardRecords[guard.id] || {};
        return (
          <div key={guard.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                  {guard.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{guard.name}</h3>
                  <p className="text-xs text-gray-500">Matrícula: {guard.matricula}</p>
                </div>
              </div>
              <button className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition">
                Exportar PDF →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Dia</th>
                    <th className="px-2 py-2 text-center font-medium">1ª Ent.</th>
                    <th className="px-2 py-2 text-center font-medium">1ª Saída</th>
                    <th className="px-2 py-2 text-center font-medium">2ª Ent.</th>
                    <th className="px-2 py-2 text-center font-medium">2ª Saída</th>
                    <th className="px-2 py-2 text-center font-medium">Total</th>
                    <th className="px-2 py-2 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {days.map(day => {
                    const record = records[`${day}`];
                    const sunday = isSunday(day);
                    const hasRecord = record?.entrada1 && record?.saida1;
                    return (
                      <tr key={day} className={`${sunday ? 'bg-red-50/50' : hasRecord ? '' : 'bg-yellow-50/30'}`}>
                        <td className="px-3 py-2">
                          <span className="font-bold text-gray-700">{String(day).padStart(2, '0')}</span>
                          <span className={`ml-1.5 text-gray-400 ${sunday ? 'text-red-400' : ''}`}>{getDayOfWeek(day)}</span>
                        </td>
                        <td className="px-2 py-2 text-center font-mono">{record?.entrada1 || <span className="text-gray-300">--:--</span>}</td>
                        <td className="px-2 py-2 text-center font-mono">{record?.saida1 || <span className="text-gray-300">--:--</span>}</td>
                        <td className="px-2 py-2 text-center font-mono">{record?.entrada2 || <span className="text-gray-300">--:--</span>}</td>
                        <td className="px-2 py-2 text-center font-mono">{record?.saida2 || <span className="text-gray-300">--:--</span>}</td>
                        <td className="px-2 py-2 text-center font-mono font-semibold text-green-700">{calcDayTotal(record)}</td>
                        <td className="px-2 py-2 text-center">
                          {sunday ? (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px]">Folga</span>
                          ) : hasRecord ? (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-600 rounded text-[10px]">✓ OK</span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-600 rounded text-[10px]">⚠ Pend.</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SettingsView() {
  const [categories, setCategories] = useState(['Infraestrutura', 'Equipamento', 'Comunicação', 'Veículo', 'EPI', 'Outros']);
  const [heReasons, setHeReasons] = useState(['Reunião de Segurança', 'Cobertura urgente', 'Evento especial', 'Substituição emergencial', 'Treinamento', 'Outros']);
  const [newCategory, setNewCategory] = useState('');
  const [newReason, setNewReason] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
        <p className="text-gray-500 text-sm">Personalize o sistema sem precisar de um programador</p>
      </div>

      {/* Ticket Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Categorias de Chamados</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">
              {cat}
              <button onClick={() => setCategories(categories.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 transition">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Nova categoria..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => { if (newCategory) { setCategories([...categories, newCategory]); setNewCategory(''); } }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* HE Reasons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Motivos de Hora Extra</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {heReasons.map((reason, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 rounded-lg text-sm text-purple-700">
              {reason}
              <button onClick={() => setHeReasons(heReasons.filter((_, idx) => idx !== i))} className="text-purple-400 hover:text-red-500 transition">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newReason}
            onChange={e => setNewReason(e.target.value)}
            placeholder="Novo motivo..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => { if (newReason) { setHeReasons([...heReasons, newReason]); setNewReason(''); } }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Configurações Gerais</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Notificações Push</p>
              <p className="text-xs text-gray-500">Receber alertas em tempo real</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Alerta de Estoque Baixo</p>
              <p className="text-xs text-gray-500">Notificar quando item tiver menos de 10 unidades</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Check-in por GPS</p>
              <p className="text-xs text-gray-500">Validar presença por geolocalização</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">QR Code nos Postos</p>
              <p className="text-xs text-gray-500">Habilitar check-in via QR Code</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Scale Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Modelos de Escala</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-blue-300 bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800">12x36</h4>
            <p className="text-xs text-blue-600 mt-1">12h trabalho / 36h descanso</p>
            <p className="text-xs text-blue-500 mt-2">Padrão para postos contínuos</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700">5x2</h4>
            <p className="text-xs text-gray-500 mt-1">5 dias trabalho / 2 dias folga</p>
            <p className="text-xs text-gray-400 mt-2">Escala comercial</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700">6x1</h4>
            <p className="text-xs text-gray-500 mt-1">6 dias trabalho / 1 dia folga</p>
            <p className="text-xs text-gray-400 mt-2">Escala intensiva</p>
          </div>
        </div>
      </div>
    </div>
  );
}
