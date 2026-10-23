import React, { useState } from 'react';
import { useApp } from '../context';

type AdminTab = 'dashboard' | 'posts' | 'uniforms' | 'approvals' | 'coverage' | 'ponto' | 'settings';

export default function AdminDashboard() {
  const { currentUser, logout, notifications } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">SecurOps</h1>
              <p className="text-xs text-gray-500 -mt-0.5">Painel do Supervisor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
              )}
            </button>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
                <p className="text-xs text-gray-400">Supervisor</p>
              </div>
            </div>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition" title="Sair">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Dropdown */}
      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 space-y-1 sticky top-20">
            {[
              { id: 'dashboard' as AdminTab, icon: '📊', label: 'Dashboard' },
              { id: 'posts' as AdminTab, icon: '📍', label: 'Postos' },
              { id: 'uniforms' as AdminTab, icon: '👔', label: 'Uniformes' },
              { id: 'approvals' as AdminTab, icon: '✅', label: 'Aprovações' },
              { id: 'coverage' as AdminTab, icon: '🔄', label: 'Coberturas' },
              { id: 'ponto' as AdminTab, icon: '⏱️', label: 'Ponto' },
              { id: 'settings' as AdminTab, icon: '⚙️', label: 'Configurações' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
          <div className="grid grid-cols-7">
            {[
              { id: 'dashboard' as AdminTab, icon: '📊', label: 'Painel' },
              { id: 'posts' as AdminTab, icon: '📍', label: 'Postos' },
              { id: 'uniforms' as AdminTab, icon: '👔', label: 'Unif.' },
              { id: 'approvals' as AdminTab, icon: '✅', label: 'Aprov.' },
              { id: 'coverage' as AdminTab, icon: '🔄', label: 'Cobert.' },
              { id: 'ponto' as AdminTab, icon: '⏱️', label: 'Ponto' },
              { id: 'settings' as AdminTab, icon: '⚙️', label: 'Config.' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-1 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-[9px] mt-0.5">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'posts' && <PostsView />}
          {activeTab === 'uniforms' && <UniformsView />}
          {activeTab === 'approvals' && <ApprovalsView />}
          {activeTab === 'coverage' && <CoverageView />}
          {activeTab === 'ponto' && <PontoView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead } = useApp();
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute top-16 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Notificações</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {notifications.map(n => (
            <div key={n.id} className={`p-3 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`} onClick={() => markNotificationRead(n.id)}>
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5">
                  {n.type === 'alert' ? '🚨' : n.type === 'success' ? '✅' : 'ℹ️'}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(n.date).toLocaleString('pt-BR')}</p>
                </div>
                {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const { posts, uniformRequests, tickets, coverages, overtimeRequests } = useApp();
  
  const okPosts = posts.filter(p => p.status === 'ok').length;
  const warningPosts = posts.filter(p => p.status === 'warning').length;
  const criticalPosts = posts.filter(p => p.status === 'critical').length;
  const pendingUniforms = uniformRequests.filter(r => r.status === 'pending').length;
  const pontoAlerts = 2; // Simulated: guards without today's record
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const pendingHE = overtimeRequests.filter(o => o.status === 'pending').length;
  const activeCoverages = coverages.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Operacional</h2>
        <p className="text-gray-500 text-sm">Visão geral em tempo real</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Postos OK</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{okPosts}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">✓</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Alertas</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">{warningPosts + criticalPosts}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500">⚠</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Pendências</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{pendingUniforms + pendingHE}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">📋</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Sem Registro Hoje</p>
              <p className="text-3xl font-bold text-red-500 mt-1">{pontoAlerts}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500">⏱️</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Coberturas Ativas</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{activeCoverages}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">🔄</div>
          </div>
        </div>
      </div>

      {/* Status Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Status dos Postos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {posts.map(post => (
            <div key={post.id} className={`rounded-lg p-4 border-l-4 ${
              post.status === 'ok' ? 'bg-green-50 border-green-500' :
              post.status === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              'bg-red-50 border-red-500'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{post.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{post.address}</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${
                  post.status === 'ok' ? 'bg-green-500' :
                  post.status === 'warning' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500 animate-pulse'
                }`}></span>
              </div>
              <div className="flex gap-3 mt-3 text-xs text-gray-600">
                <span>Risco: <strong className={post.risk === 'high' ? 'text-red-600' : post.risk === 'medium' ? 'text-yellow-600' : 'text-green-600'}>{post.risk === 'high' ? 'Alto' : post.risk === 'medium' ? 'Médio' : 'Baixo'}</strong></span>
                <span>Vigilantes: <strong>{post.requiredGuards}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Chamados Recentes</h3>
          <div className="space-y-3">
            {tickets.slice(0, 4).map(t => (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className={`w-2 h-2 rounded-full ${t.priority === 'critical' ? 'bg-red-500' : t.priority === 'high' ? 'bg-orange-500' : t.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{t.description}</p>
                  <p className="text-xs text-gray-400">{t.postName} • {t.date}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'open' ? 'bg-blue-100 text-blue-700' : t.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {t.status === 'open' ? 'Aberto' : t.status === 'in_progress' ? 'Andamento' : 'Resolvido'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Fila de Aprovação</h3>
          <div className="space-y-3">
            {uniformRequests.filter(r => r.status === 'pending').map(r => (
              <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className="text-lg">👔</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{r.guardName}</p>
                  <p className="text-xs text-gray-400">{r.itemName} ({r.size}) x{r.quantity}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Pendente</span>
              </div>
            ))}
            {overtimeRequests.filter(o => o.status === 'pending').map(o => (
              <div key={o.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className="text-lg">⏰</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{o.guardName}</p>
                  <p className="text-xs text-gray-400">{o.date} {o.startTime}-{o.endTime}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Pendente</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PostsView() {
  const { posts, postAllocations, allocateGuardToPost, removeGuardFromPost } = useApp();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);

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
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
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
              <div className={`p-4 text-white ${
                isEmpty ? 'bg-gradient-to-r from-red-500 to-red-600' :
                isPartial ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}>
                <div className="flex justify-between items-start">
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
                      <p className="text-red-500 text-sm font-medium">⚠️ Posto descoberto</p>
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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
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
                          {isAllocatedElsewhere && <p className="text-[10px] text-yellow-600">📍 Em: {otherPost?.name}</p>}
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
                {item.stock < 10 ? '⚠️' : item.stock < 20 ? '📦' : '✅'}
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
  
  const pendingUniforms = uniformRequests.filter(r => r.status === 'pending');
  const pendingHE = overtimeRequests.filter(o => o.status === 'pending');
  const openTickets = tickets.filter(t => t.status === 'open');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Central de Aprovações</h2>
        <p className="text-gray-500 text-sm">Aprove ou recuse solicitações pendentes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{pendingUniforms.length}</p>
          <p className="text-xs text-yellow-700 mt-1">Uniformes</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{pendingHE.length}</p>
          <p className="text-xs text-purple-700 mt-1">Horas Extra</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{openTickets.length}</p>
          <p className="text-xs text-blue-700 mt-1">Chamados</p>
        </div>
      </div>

      {/* Uniform Requests */}
      {pendingUniforms.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-yellow-50">
            <h3 className="font-semibold text-gray-800">👔 Solicitações de Uniforme Pendentes</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingUniforms.map(req => (
              <div key={req.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                    {req.guardName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{req.guardName}</p>
                    <p className="text-xs text-gray-500">{req.itemName} • Tam: {req.size} • Qtd: {req.quantity}</p>
                    <p className="text-xs text-gray-400">Motivo: {req.reason}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateUniformRequestStatus(req.id, 'approved')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition">
                    ✓ Aprovar
                  </button>
                  <button onClick={() => updateUniformRequestStatus(req.id, 'rejected')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition">
                    ✗ Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overtime Requests */}
      {pendingHE.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-purple-50">
            <h3 className="font-semibold text-gray-800">⏰ Horas Extra Pendentes</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingHE.map(ot => (
              <div key={ot.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                    {ot.guardName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{ot.guardName}</p>
                    <p className="text-xs text-gray-500">{ot.date} • {ot.startTime} às {ot.endTime}</p>
                    <p className="text-xs text-gray-400">Motivo: {ot.reason}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateOvertimeStatus(ot.id, 'approved')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition">
                    ✓ Aprovar
                  </button>
                  <button onClick={() => updateOvertimeStatus(ot.id, 'rejected')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition">
                    ✗ Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Tickets */}
      {openTickets.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-blue-50">
            <h3 className="font-semibold text-gray-800">🔧 Chamados Abertos</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {openTickets.map(t => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${t.priority === 'critical' ? 'bg-red-500' : t.priority === 'high' ? 'bg-orange-500' : t.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.description}</p>
                    <p className="text-xs text-gray-500">{t.guardName} • {t.postName} • {t.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateTicketStatus(t.id, 'in_progress')} className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-xs font-medium hover:bg-yellow-600 transition">
                    Em Andamento
                  </button>
                  <button onClick={() => updateTicketStatus(t.id, 'resolved')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition">
                    Resolver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
                  {cov.status === 'active' ? '🟢 Ativa' : cov.status === 'requested' ? '⏳ Aguardando' : cov.status === 'approved' ? '✓ Aprovada' : '✓ Concluída'}
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
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
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
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
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
        <h3 className="font-semibold text-gray-800 mb-4">🔧 Categorias de Chamados</h3>
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
        <h3 className="font-semibold text-gray-800 mb-4">⏰ Motivos de Hora Extra</h3>
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
        <h3 className="font-semibold text-gray-800 mb-4">⚙️ Configurações Gerais</h3>
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
        <h3 className="font-semibold text-gray-800 mb-4">📅 Modelos de Escala</h3>
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
