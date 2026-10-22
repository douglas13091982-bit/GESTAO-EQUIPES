import React, { useState } from 'react';
import { useApp } from '../context';
import { uniformReasons, ticketCategories, overtimeReasons } from '../data';

type Tab = 'home' | 'uniform' | 'ticket' | 'coverage' | 'overtime';

export default function GuardPortal() {
  const { currentUser, logout, uniformItems, uniformRequests, tickets, coverages, overtimeRequests, addUniformRequest, addTicket, addCoverage, checkInCoverage, checkOutCoverage, addOvertimeRequest } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('home');

  if (!currentUser) return null;

  const myRequests = uniformRequests.filter(r => r.guardId === currentUser.id);
  const myTickets = tickets.filter(t => t.guardId === currentUser.id);
  const myCoverages = coverages.filter(c => c.coverageId === currentUser.id || c.titularId === currentUser.id);
  const myOvertime = overtimeRequests.filter(o => o.guardId === currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm">{currentUser.name}</p>
              <p className="text-blue-200 text-xs">Mat: {currentUser.matricula}</p>
            </div>
          </div>
          <button onClick={logout} className="text-blue-200 hover:text-white transition p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === 'home' && <HomeTab myRequests={myRequests} myTickets={myTickets} myCoverages={myCoverages} myOvertime={myOvertime} />}
        {activeTab === 'uniform' && <UniformTab items={uniformItems} myRequests={myRequests} onSubmit={addUniformRequest} guardId={currentUser.id} />}
        {activeTab === 'ticket' && <TicketTab myTickets={myTickets} onSubmit={addTicket} guardId={currentUser.id} />}
        {activeTab === 'coverage' && <CoverageTab myCoverages={myCoverages} onCheckIn={checkInCoverage} onCheckOut={checkOutCoverage} onRequest={addCoverage} guardId={currentUser.id} guardName={currentUser.name} />}
        {activeTab === 'overtime' && <OvertimeTab myOvertime={myOvertime} onSubmit={addOvertimeRequest} guardId={currentUser.id} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5">
          {[
            { id: 'home' as Tab, icon: '🏠', label: 'Início' },
            { id: 'uniform' as Tab, icon: '👔', label: 'Uniforme' },
            { id: 'ticket' as Tab, icon: '🔧', label: 'Chamados' },
            { id: 'coverage' as Tab, icon: '🔄', label: 'Cobertura' },
            { id: 'overtime' as Tab, icon: '⏰', label: 'HE' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-1 transition ${activeTab === tab.id ? 'text-blue-600 border-t-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function HomeTab({ myRequests, myTickets, myCoverages, myOvertime }: any) {
  const pendingRequests = myRequests.filter((r: any) => r.status === 'pending').length;
  const openTickets = myTickets.filter((t: any) => t.status === 'open').length;
  const activeCoverage = myCoverages.find((c: any) => c.status === 'active');
  const pendingHE = myOvertime.filter((o: any) => o.status === 'pending').length;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg">
        <h2 className="text-lg font-bold">Bom dia, Vigilante!</h2>
        <p className="text-blue-100 text-sm mt-1">Resumo do seu dia</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{pendingRequests}</div>
          <div className="text-xs text-gray-500 mt-1">Uniformes Pendentes</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-orange-500">{openTickets}</div>
          <div className="text-xs text-gray-500 mt-1">Chamados Abertos</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-500">{activeCoverage ? '1' : '0'}</div>
          <div className="text-xs text-gray-500 mt-1">Cobertura Ativa</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-500">{pendingHE}</div>
          <div className="text-xs text-gray-500 mt-1">HE Pendentes</div>
        </div>
      </div>

      {activeCoverage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-green-700">Cobertura Ativa</span>
          </div>
          <p className="text-sm text-green-600">Posto: {activeCoverage.postName}</p>
          <p className="text-xs text-green-500 mt-1">Check-in: {activeCoverage.checkIn ? new Date(activeCoverage.checkIn).toLocaleTimeString('pt-BR') : '--:--'}</p>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-3">Acesso Rápido</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-blue-50 text-blue-700 rounded-lg p-3 text-sm font-medium hover:bg-blue-100 transition text-left">
            📋 Minha Escala
          </button>
          <button className="bg-purple-50 text-purple-700 rounded-lg p-3 text-sm font-medium hover:bg-purple-100 transition text-left">
            📍 Meus Postos
          </button>
          <button className="bg-green-50 text-green-700 rounded-lg p-3 text-sm font-medium hover:bg-green-100 transition text-left">
            📊 Meu Histórico
          </button>
          <button className="bg-orange-50 text-orange-700 rounded-lg p-3 text-sm font-medium hover:bg-orange-100 transition text-left">
            📞 Contato Supervisor
          </button>
        </div>
      </div>
    </div>
  );
}

function UniformTab({ items, myRequests, onSubmit, guardId }: any) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !size || !reason) return;
    const item = items.find((i: any) => i.id === selectedItem);
    onSubmit({ guardId, itemId: selectedItem, itemName: item.name, size, quantity, reason });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedItem(null);
      setSize('');
      setQuantity(1);
      setReason('');
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Solicitar Uniforme</h2>
      
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
          ✅ Solicitação enviada com sucesso!
        </div>
      )}

      <div className="space-y-3">
        {items.filter((i: any) => !i.blocked).map((item: any) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.category} • Estoque: {item.stock}</p>
                <p className="text-xs text-gray-400 mt-1">Tamanhos: {item.sizes.join(', ')}</p>
              </div>
              <button
                onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedItem === item.id ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
              >
                {selectedItem === item.id ? '✓ Selecionado' : 'Solicitar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-semibold text-gray-700">Detalhes da Solicitação</h3>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tamanho</label>
            <select value={size} onChange={e => setSize(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              {items.find((i: any) => i.id === selectedItem)?.sizes.map((s: string) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Quantidade</label>
            <input type="number" min="1" max="5" value={quantity} onChange={e => setQuantity(+e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Motivo</label>
            <select value={reason} onChange={e => setReason(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              {uniformReasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition">
            Enviar Solicitação
          </button>
        </form>
      )}

      {/* History */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-3">Minhas Solicitações</h3>
        <div className="space-y-2">
          {myRequests.map((req: any) => (
            <div key={req.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-800">{req.itemName} ({req.size})</p>
                <p className="text-xs text-gray-500">{req.date}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                req.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                req.status === 'delivered' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {req.status === 'pending' ? 'Pendente' : req.status === 'approved' ? 'Aprovado' : req.status === 'delivered' ? 'Entregue' : 'Recusado'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TicketTab({ myTickets, onSubmit, guardId }: any) {
  const [showForm, setShowForm] = useState(false);
  const [post, setPost] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !category || !priority || !description) return;
    onSubmit({ guardId, postId: post, postName: post, category, priority, description, hasPhoto: false });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setPost('');
      setCategory('');
      setPriority('');
      setDescription('');
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Chamados</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition">
          + Novo Chamado
        </button>
      </div>

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
          ✅ Chamado aberto com sucesso!
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-semibold text-gray-700">Novo Chamado</h3>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Posto</label>
            <select value={post} onChange={e => setPost(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Selecione o posto...</option>
              <option value="p1">Edifício Central</option>
              <option value="p2">Condomínio Parque Sul</option>
              <option value="p3">Depósito Industrial</option>
              <option value="p4">Escola Municipal</option>
              <option value="p5">Shopping Center Norte</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Categoria</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              {ticketCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Prioridade</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Descrição</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Descreva o problema..." />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Foto (opcional)</label>
            <button type="button" className="w-full border-2 border-dashed border-gray-200 rounded-lg px-3 py-4 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition">
              📷 Anexar Foto/Vídeo
            </button>
          </div>
          <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition">
            Abrir Chamado
          </button>
        </form>
      )}

      {/* Tickets List */}
      <div className="space-y-2">
        {myTickets.map((ticket: any) => (
          <div key={ticket.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                ticket.priority === 'critical' ? 'bg-red-100 text-red-700' :
                ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {ticket.priority === 'critical' ? '🔴 Crítica' : ticket.priority === 'high' ? '🟠 Alta' : ticket.priority === 'medium' ? '🟡 Média' : '⚪ Baixa'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {ticket.status === 'open' ? 'Aberto' : ticket.status === 'in_progress' ? 'Em andamento' : 'Resolvido'}
              </span>
            </div>
            <p className="text-sm text-gray-800 font-medium">{ticket.description}</p>
            <p className="text-xs text-gray-500 mt-2">{ticket.category} • {ticket.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoverageTab({ myCoverages, onCheckIn, onCheckOut, onRequest, guardId, guardName }: any) {
  const [showRequest, setShowRequest] = useState(false);
  const [type, setType] = useState('');
  const [postId, setPostId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !postId) return;
    onRequest({ postId, postName: postId, titularId: '1', titularName: 'Carlos Silva', coverageId: guardId, coverageName: guardName, type, date: new Date().toISOString().split('T')[0] });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowRequest(false); setType(''); setPostId(''); }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Cobertura</h2>
        <button onClick={() => setShowRequest(!showRequest)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition">
          + Solicitar
        </button>
      </div>

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
          ✅ Solicitação de cobertura enviada!
        </div>
      )}

      {showRequest && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-semibold text-gray-700">Solicitar Cobertura</h3>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              <option value="substitution">Troca de Posto</option>
              <option value="coverage">Cobertura (folga do colega)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Posto</label>
            <select value={postId} onChange={e => setPostId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              <option value="Edifício Central">Edifício Central</option>
              <option value="Condomínio Parque Sul">Condomínio Parque Sul</option>
              <option value="Depósito Industrial">Depósito Industrial</option>
              <option value="Escola Municipal">Escola Municipal</option>
              <option value="Shopping Center Norte">Shopping Center Norte</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition">
            Solicitar Cobertura
          </button>
        </form>
      )}

      {/* QR Code Scanner */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📱</span>
          <div>
            <h3 className="font-semibold">Check-in via QR Code</h3>
            <p className="text-purple-200 text-xs">Escaneie o QR Code do posto</p>
          </div>
        </div>
        <button className="w-full py-2.5 bg-white/20 backdrop-blur rounded-lg text-sm font-medium hover:bg-white/30 transition border border-white/30">
          Abrir Câmera
        </button>
      </div>

      {/* Coverages */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">Minhas Coberturas</h3>
        {myCoverages.map((cov: any) => (
          <div key={cov.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{cov.postName}</p>
                <p className="text-xs text-gray-500">{cov.type === 'substitution' ? 'Troca de Posto' : 'Cobertura'}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                cov.status === 'active' ? 'bg-green-100 text-green-700' :
                cov.status === 'requested' ? 'bg-yellow-100 text-yellow-700' :
                cov.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {cov.status === 'active' ? '🟢 Ativa' : cov.status === 'requested' ? '⏳ Solicitada' : cov.status === 'approved' ? '✓ Aprovada' : '✓ Concluída'}
              </span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Titular: {cov.titularName}</p>
              {cov.checkIn && <p>Check-in: {new Date(cov.checkIn).toLocaleString('pt-BR')}</p>}
              {cov.checkOut && <p>Check-out: {new Date(cov.checkOut).toLocaleString('pt-BR')}</p>}
            </div>
            {cov.status === 'active' && (
              <button onClick={() => onCheckOut(cov.id)} className="mt-3 w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                Fazer Check-out
              </button>
            )}
            {cov.status === 'approved' && !cov.checkIn && (
              <button onClick={() => onCheckIn(cov.id)} className="mt-3 w-full py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition">
                Fazer Check-in
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OvertimeTab({ myOvertime, onSubmit, guardId }: any) {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime || !reason) return;
    onSubmit({ guardId, date, startTime, endTime, reason });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); setDate(''); setStartTime(''); setEndTime(''); setReason(''); }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Banco de Horas / HE</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition">
          + Registrar HE
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-5 text-white">
        <h3 className="font-semibold text-sm">Saldo de Horas</h3>
        <div className="flex justify-between mt-3">
          <div className="text-center">
            <p className="text-2xl font-bold">12h</p>
            <p className="text-purple-200 text-xs">A fazer</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">8h</p>
            <p className="text-purple-200 text-xs">Feitas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">4h</p>
            <p className="text-purple-200 text-xs">Saldo</p>
          </div>
        </div>
      </div>

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
          ✅ Solicitação de HE enviada!
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-semibold text-gray-700">Registrar Hora Extra</h3>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Data</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Início</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Fim</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Motivo</label>
            <select value={reason} onChange={e => setReason(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              {overtimeReasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition">
            Enviar Solicitação
          </button>
        </form>
      )}

      {/* Overtime List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Minhas Solicitações</h3>
        {myOvertime.map((ot: any) => (
          <div key={ot.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-800">{ot.startTime} - {ot.endTime}</p>
                <p className="text-xs text-gray-500">{ot.date} • {ot.reason}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                ot.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                ot.status === 'approved' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {ot.status === 'pending' ? '⏳ Pendente' : ot.status === 'approved' ? '✅ Aprovada' : '❌ Recusada'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
