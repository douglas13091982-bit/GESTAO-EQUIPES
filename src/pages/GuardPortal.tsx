import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { uniformReasons, ticketCategories } from '../data';

type Tab = 'home' | 'uniform' | 'ticket' | 'coverage' | 'ponto';
type PontoView = 'tabela' | 'resumo';

interface TimeRecord {
  entrada1: string;
  saida1: string;
  entrada2: string;
  saida2: string;
  entradaHE: string;
  saidaHE: string;
}

type TimeRecords = Record<string, TimeRecord>;

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getLastDayOfMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

function getMonthName(): string {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return months[new Date().getMonth()];
}

function getYear(): number {
  return new Date().getFullYear();
}

export default function GuardPortal() {
  const { currentUser, logout, uniformItems, uniformRequests, tickets, coverages, addUniformRequest, addTicket, addCoverage, checkInCoverage, checkOutCoverage } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [pontoView, setPontoView] = useState<PontoView>('tabela');

  if (!currentUser) return null;

  const myRequests = uniformRequests.filter(r => r.guardId === currentUser.id);
  const myTickets = tickets.filter(t => t.guardId === currentUser.id);
  const myCoverages = coverages.filter(c => c.coverageId === currentUser.id || c.titularId === currentUser.id);

  // Se estiver na view resumo do ponto, renderiza em tela cheia
  if (activeTab === 'ponto' && pontoView === 'resumo') {
    return <PontoResumo onBack={() => setPontoView('tabela')} />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-lg mx-auto overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg shrink-0">
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
          <div className="flex items-center gap-2">
            {activeTab === 'ponto' && (
              <button
                onClick={() => setPontoView('resumo')}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1"
              >
                📊 Resumo
              </button>
            )}
            <button onClick={logout} className="text-blue-200 hover:text-white transition p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={`flex-1 overflow-hidden ${activeTab === 'ponto' ? '' : 'overflow-y-auto p-4'}`}>
        {activeTab === 'home' && <HomeTab myRequests={myRequests} myTickets={myTickets} myCoverages={myCoverages} />}
        {activeTab === 'uniform' && <UniformTab items={uniformItems} myRequests={myRequests} onSubmit={addUniformRequest} guardId={currentUser.id} />}
        {activeTab === 'ticket' && <TicketTab myTickets={myTickets} onSubmit={addTicket} guardId={currentUser.id} />}
        {activeTab === 'coverage' && <CoverageTab myCoverages={myCoverages} onCheckIn={checkInCoverage} onCheckOut={checkOutCoverage} guardId={currentUser.id} guardName={currentUser.name} />}
        {activeTab === 'ponto' && <PontoTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5">
          {[
            { id: 'home' as Tab, icon: '🏠', label: 'Início' },
            { id: 'uniform' as Tab, icon: '👔', label: 'Uniforme' },
            { id: 'ticket' as Tab, icon: '🔧', label: 'Chamados' },
            { id: 'coverage' as Tab, icon: '🔄', label: 'Cobertura' },
            { id: 'ponto' as Tab, icon: '⏱️', label: 'Ponto' },
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

/* ==================== PONTO ELETRÔNICO - TELA CHEIA ==================== */
function PontoTab() {
  const [timeRecords, setTimeRecords] = useState<TimeRecords>(() => {
    const saved = localStorage.getItem('ponto_records');
    return saved ? JSON.parse(saved) : {};
  });
  const [clockModal, setClockModal] = useState<{ day: number; field: keyof TimeRecord } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('ponto_records', JSON.stringify(timeRecords));
  }, [timeRecords]);

  const lastDay = getLastDayOfMonth();
  const startDay = 15;
  const days: number[] = [];
  for (let d = startDay; d <= lastDay; d++) {
    days.push(d);
  }

  const getDayOfWeek = (day: number): string => {
    const date = new Date(getYear(), new Date().getMonth(), day);
    return WEEKDAYS[date.getDay()];
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return day === today.getDate() && new Date().getMonth() === today.getMonth();
  };

  const isSunday = (day: number): boolean => {
    const date = new Date(getYear(), new Date().getMonth(), day);
    return date.getDay() === 0;
  };

  const handleFieldClick = (day: number, field: keyof TimeRecord) => {
    setClockModal({ day, field });
  };

  const handleSetTime = (time: string) => {
    if (!clockModal) return;
    const { day, field } = clockModal;
    const key = `${day}`;
    setTimeRecords(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { entrada1: '', saida1: '', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' }),
        [field]: time,
      }
    }));
    setClockModal(null);
  };

  const handleClearField = () => {
    if (!clockModal) return;
    const { day, field } = clockModal;
    const key = `${day}`;
    setTimeRecords(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { entrada1: '', saida1: '', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' }),
        [field]: '',
      }
    }));
    setClockModal(null);
  };

  const getFieldLabel = (field: keyof TimeRecord): string => {
    switch (field) {
      case 'entrada1': return 'Entrada';
      case 'saida1': return 'Saída';
      case 'entrada2': return 'Entrada';
      case 'saida2': return 'Saída';
      case 'entradaHE': return 'Entrada HE';
      case 'saidaHE': return 'Saída HE';
    }
  };

  const getFieldIndex = (field: keyof TimeRecord): number => {
    switch (field) {
      case 'entrada1': return 1;
      case 'saida1': return 2;
      case 'entrada2': return 3;
      case 'saida2': return 4;
      case 'entradaHE': return 5;
      case 'saidaHE': return 6;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header compacto do ponto */}
      <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium opacity-80">{getMonthName()} / {getYear()}</p>
          <p className="text-sm font-bold">Ponto Eletrônico</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono font-bold leading-tight">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-[10px] opacity-80">
            {WEEKDAYS[currentTime.getDay()]} {String(currentTime.getDate()).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Cabeçalho da tabela */}
      <div className="shrink-0 bg-gray-800 text-white grid grid-cols-[28px_1fr_1fr_1fr_1fr_1fr_1fr] gap-0.5 px-1 py-1.5 text-[8px] font-semibold text-center border-b border-gray-700">
        <div className="text-left pl-0.5">Dia</div>
        <div>1ª Ent.</div>
        <div>1ª Saída</div>
        <div>2ª Ent.</div>
        <div>2ª Saída</div>
        <div className="bg-orange-600/30">Ent. HE</div>
        <div className="bg-orange-600/30">Saí. HE</div>
      </div>

      {/* Linhas dos dias - ocupa todo espaço disponível */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {days.map(day => {
            const key = `${day}`;
            const record = timeRecords[key] || { entrada1: '', saida1: '', entrada2: '', saida2: '', entradaHE: '', saidaHE: '' };
            const today = isToday(day);
            const sunday = isSunday(day);
            const dayOfWeek = getDayOfWeek(day);

            return (
              <div
                key={day}
                className={`grid grid-cols-[28px_1fr_1fr_1fr_1fr_1fr_1fr] gap-0.5 px-1 py-1 items-center ${
                  today ? 'bg-yellow-50' : sunday ? 'bg-red-50/60' : ''
                }`}
              >
                {/* Dia da semana */}
                <div className="text-left pl-0.5">
                  <span className={`font-bold text-[11px] leading-none ${today ? 'text-yellow-700' : sunday ? 'text-red-500' : 'text-gray-700'}`}>
                    {String(day).padStart(2, '0')}
                  </span>
                  <span className={`block text-[8px] font-medium leading-tight ${
                    today ? 'text-yellow-600' : sunday ? 'text-red-400' : dayOfWeek === 'Dom' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {dayOfWeek}
                  </span>
                </div>

                {/* Campos de horário normais */}
                {(['entrada1', 'saida1', 'entrada2', 'saida2'] as const).map((field) => (
                  <button
                    key={field}
                    onClick={() => handleFieldClick(day, field)}
                    className={`py-1.5 px-0.5 rounded text-center font-mono text-[10px] transition-all active:scale-95 ${
                      record[field]
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : today
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 border-dashed'
                          : 'bg-gray-50 text-gray-400 border border-gray-200 border-dashed'
                    }`}
                  >
                    {record[field] || '--:--'}
                  </button>
                ))}

                {/* Campos de Horas Extras */}
                {(['entradaHE', 'saidaHE'] as const).map((field) => (
                  <button
                    key={field}
                    onClick={() => handleFieldClick(day, field)}
                    className={`py-1.5 px-0.5 rounded text-center font-mono text-[10px] transition-all active:scale-95 ${
                      record[field]
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : today
                          ? 'bg-yellow-50 text-orange-400 border border-orange-200 border-dashed'
                          : 'bg-orange-50/50 text-orange-300 border border-orange-200/50 border-dashed'
                    }`}
                  >
                    {record[field] || '--:--'}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal do Relógio */}
      {clockModal && (
        <ClockModal
          day={clockModal.day}
          field={clockModal.field}
          fieldLabel={getFieldLabel(clockModal.field)}
          fieldIndex={getFieldIndex(clockModal.field)}
          currentTime={currentTime}
          onSet={handleSetTime}
          onClear={handleClearField}
          onClose={() => setClockModal(null)}
        />
      )}
    </div>
  );
}

/* ==================== PONTO RESUMO - TELA SEPARADA ==================== */
function PontoResumo({ onBack }: { onBack: () => void }) {
  const [timeRecords] = useState<TimeRecords>(() => {
    const saved = localStorage.getItem('ponto_records');
    return saved ? JSON.parse(saved) : {};
  });

  const lastDay = getLastDayOfMonth();
  const startDay = 15;
  const days: number[] = [];
  for (let d = startDay; d <= lastDay; d++) days.push(d);

  const isSunday = (day: number): boolean => {
    const date = new Date(getYear(), new Date().getMonth(), day);
    return date.getDay() === 0;
  };

  // Calcula totais
  let totalDaysWorked = 0;
  let totalMinutes = 0;
  let totalMinutesHE = 0;
  let daysMissing = 0;

  const dailyTotals: Record<number, string> = {};
  const dailyHE: Record<number, string> = {};

  days.forEach(d => {
    const r = timeRecords[`${d}`];
    if (r?.entrada1 && r?.saida1) {
      totalDaysWorked++;
      const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
      let dayMin = toMin(r.saida1) - toMin(r.entrada1);
      if (r.entrada2 && r.saida2) dayMin += toMin(r.saida2) - toMin(r.entrada2);
      if (dayMin < 0) dayMin += 24 * 60;
      totalMinutes += dayMin;
      const hours = Math.floor(dayMin / 60);
      const mins = dayMin % 60;
      dailyTotals[d] = `${String(hours).padStart(2, '0')}h${String(mins).padStart(2, '0')}`;
      
      // Calcula Horas Extras
      if (r.entradaHE && r.saidaHE) {
        let heMin = toMin(r.saidaHE) - toMin(r.entradaHE);
        if (heMin < 0) heMin += 24 * 60;
        totalMinutesHE += heMin;
        const heHours = Math.floor(heMin / 60);
        const heMins = heMin % 60;
        dailyHE[d] = `${String(heHours).padStart(2, '0')}h${String(heMins).padStart(2, '0')}`;
      } else {
        dailyHE[d] = '--:--';
      }
    } else {
      dailyTotals[d] = '--:--';
      dailyHE[d] = '--:--';
      if (!isSunday(d)) daysMissing++;
    }
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;
  const totalHoursHE = Math.floor(totalMinutesHE / 60);
  const totalMinsHE = totalMinutesHE % 60;

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg shrink-0">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold">Resumo do Ponto</h1>
            <p className="text-xs text-indigo-200">{getMonthName()} / {getYear()}</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Cards de resumo */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg mb-2">✓</div>
            <p className="text-2xl font-bold text-green-700">{totalDaysWorked}</p>
            <p className="text-[10px] text-gray-500 mt-1">Dias Trabalhados</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg mb-2">⏱</div>
            <p className="text-2xl font-bold text-blue-700">{totalHours}h{String(totalMins).padStart(2, '0')}</p>
            <p className="text-[10px] text-gray-500 mt-1">Total de Horas</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-10 h-10 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-lg mb-2">⏰</div>
            <p className="text-2xl font-bold text-orange-700">{totalHoursHE}h{String(totalMinsHE).padStart(2, '0')}</p>
            <p className="text-[10px] text-gray-500 mt-1">Horas Extras</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-600 text-lg mb-2">⚠</div>
            <p className="text-2xl font-bold text-red-700">{daysMissing}</p>
            <p className="text-[10px] text-gray-500 mt-1">Pendências</p>
          </div>
        </div>

        {/* Média diária */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Média diária de trabalho</p>
              <p className="text-3xl font-bold font-mono">
                {totalDaysWorked > 0 ? `${Math.floor(totalMinutes / totalDaysWorked / 60)}h${String(Math.floor(totalMinutes / totalDaysWorked) % 60).padStart(2, '0')}` : '00h00'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">Período</p>
              <p className="text-sm font-semibold">15 a {lastDay}</p>
            </div>
          </div>
        </div>

        {/* Detalhamento por dia */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-700 text-sm">Detalhamento Diário</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[40vh] overflow-y-auto">
            {days.map(day => {
              const r = timeRecords[`${day}`];
              const sunday = isSunday(day);
              const hasRecord = r?.entrada1 && r?.saida1;
              const hasHE = r?.entradaHE && r?.saidaHE;
              const dayOfWeek = WEEKDAYS[new Date(getYear(), new Date().getMonth(), day).getDay()];

              return (
                <div key={day} className={`px-3 py-2 flex items-center justify-between ${sunday ? 'bg-red-50/50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="text-center w-8">
                      <p className={`text-sm font-bold ${sunday ? 'text-red-500' : 'text-gray-700'}`}>{String(day).padStart(2, '0')}</p>
                      <p className={`text-[9px] ${sunday ? 'text-red-400' : 'text-gray-400'}`}>{dayOfWeek}</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      {sunday ? (
                        <span className="text-red-500 font-medium">Folga</span>
                      ) : hasRecord ? (
                        <div className="space-y-0.5">
                          <div>
                            {r.entrada1} - {r.saida1}
                            {r.entrada2 && r.saida2 && <span> | {r.entrada2} - {r.saida2}</span>}
                          </div>
                          {hasHE && (
                            <div className="text-orange-600">
                              HE: {r.entradaHE} - {r.saidaHE}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-orange-500">Não registrado</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-mono font-semibold ${hasRecord ? 'text-green-700' : 'text-gray-300'}`}>
                      {dailyTotals[day]}
                    </div>
                    {hasHE && (
                      <div className="text-[10px] font-mono text-orange-600">
                        +{dailyHE[day]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ==================== MODAL RELÓGIO ==================== */
function ClockModal({
  day,
  fieldLabel,
  fieldIndex,
  currentTime,
  onSet,
  onClear,
  onClose,
}: {
  day: number;
  field: keyof TimeRecord;
  fieldLabel: string;
  fieldIndex: number;
  currentTime: Date;
  onSet: (time: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [hours, setHours] = useState(currentTime.getHours());
  const [minutes, setMinutes] = useState(currentTime.getMinutes());
  const [useCurrentTime, setUseCurrentTime] = useState(true);

  useEffect(() => {
    if (useCurrentTime) {
      setHours(currentTime.getHours());
      setMinutes(currentTime.getMinutes());
    }
  }, [currentTime, useCurrentTime]);

  const handleConfirm = () => {
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    onSet(time);
  };

  const dayOfWeek = WEEKDAYS[new Date(getYear(), new Date().getMonth(), day).getDay()];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header do modal */}
        <div className={`p-5 text-white text-center ${fieldIndex >= 5 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
          <p className={`text-xs font-medium uppercase tracking-wider ${fieldIndex >= 5 ? 'text-orange-100' : 'text-indigo-200'}`}>
            {fieldIndex >= 5 ? 'Registrar Hora Extra' : 'Registrar Ponto'}
          </p>
          <p className="text-xl font-bold mt-1">
            {String(day).padStart(2, '0')}/{String(new Date().getMonth() + 1).padStart(2, '0')} - {dayOfWeek}
          </p>
          <div className={`mt-2 inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${fieldIndex >= 5 ? 'bg-white/20' : 'bg-white/20'}`}>
            <span className="text-sm">
              {fieldIndex >= 5 ? '⏰' : fieldIndex <= 2 ? '🌅' : '🌆'}
            </span>
            <span className="font-semibold text-sm">
              {fieldIndex >= 5 ? fieldLabel : `${fieldIndex}º Registro - ${fieldLabel}`}
            </span>
          </div>
        </div>

        {/* Relógio Digital */}
        <div className="p-6">
          {/* Display do relógio */}
          <div className="bg-gray-900 rounded-2xl p-6 text-center mb-5 shadow-inner">
            <p className="text-gray-400 text-xs mb-2">Horário Atual</p>
            <p className="text-5xl font-mono font-bold text-green-400 tracking-wider">
              {String(currentTime.getHours()).padStart(2, '0')}
              <span className="animate-pulse">:</span>
              {String(currentTime.getMinutes()).padStart(2, '0')}
              <span className="text-2xl text-green-500/60">:{String(currentTime.getSeconds()).padStart(2, '0')}</span>
            </p>
          </div>

          {/* Toggle usar horário atual */}
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-4 cursor-pointer">
            <span className="text-sm font-medium text-gray-700">Usar horário atual</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={useCurrentTime}
                onChange={e => setUseCurrentTime(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
          </label>

          {/* Ajuste manual de hora */}
          {!useCurrentTime && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2 font-medium">Horas</p>
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setHours(h => (h + 1) % 24)}
                    className="w-10 h-8 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition text-lg font-bold"
                  >
                    ▲
                  </button>
                  <div className="w-16 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
                    <span className="text-3xl font-mono font-bold text-white">{String(hours).padStart(2, '0')}</span>
                  </div>
                  <button
                    onClick={() => setHours(h => (h - 1 + 24) % 24)}
                    className="w-10 h-8 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition text-lg font-bold"
                  >
                    ▼
                  </button>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2 font-medium">Minutos</p>
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setMinutes(m => (m + 1) % 60)}
                    className="w-10 h-8 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition text-lg font-bold"
                  >
                    ▲
                  </button>
                  <div className="w-16 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
                    <span className="text-3xl font-mono font-bold text-white">{String(minutes).padStart(2, '0')}</span>
                  </div>
                  <button
                    onClick={() => setMinutes(m => (m - 1 + 60) % 60)}
                    className="w-10 h-8 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition text-lg font-bold"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview do registro */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center mb-5">
            <p className="text-xs text-indigo-500">Horário que será registrado:</p>
            <p className="text-2xl font-mono font-bold text-indigo-700 mt-1">
              {String(useCurrentTime ? currentTime.getHours() : hours).padStart(2, '0')}:{String(useCurrentTime ? currentTime.getMinutes() : minutes).padStart(2, '0')}
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3">
            <button
              onClick={onClear}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-500 rounded-xl font-medium text-sm hover:bg-gray-50 transition"
            >
              Limpar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-[2] py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-[0.98] transition-all"
            >
              ✓ Confirmar Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== HOME TAB ==================== */
function HomeTab({ myRequests, myTickets, myCoverages }: any) {
  const pendingRequests = myRequests.filter((r: any) => r.status === 'pending').length;
  const openTickets = myTickets.filter((t: any) => t.status === 'open').length;
  const activeCoverage = myCoverages.find((c: any) => c.status === 'active');

  const today = new Date().getDate();
  const saved = localStorage.getItem('ponto_records');
  const records = saved ? JSON.parse(saved) : {};
  const todayRecord = records[`${today}`];
  const hasPontoToday = todayRecord?.entrada1;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg">
        <h2 className="text-lg font-bold">Bom dia, Vigilante!</h2>
        <p className="text-blue-100 text-sm mt-1">Resumo do seu dia</p>
      </div>

      <div className={`rounded-xl p-4 border ${hasPontoToday ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{hasPontoToday ? '✅' : '⚠️'}</span>
          <div>
            <p className={`font-semibold text-sm ${hasPontoToday ? 'text-green-700' : 'text-orange-700'}`}>
              {hasPontoToday ? 'Ponto registrado hoje' : 'Ponto pendente hoje'}
            </p>
            <p className={`text-xs ${hasPontoToday ? 'text-green-600' : 'text-orange-600'}`}>
              {hasPontoToday
                ? `Entrada: ${todayRecord.entrada1}${todayRecord.saida1 ? ` | Saída: ${todayRecord.saida1}` : ''}`
                : 'Clique em "Ponto" para registrar'}
            </p>
          </div>
        </div>
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
          <div className="text-2xl font-bold text-purple-500">
            {(() => {
              const s = localStorage.getItem('ponto_records');
              if (!s) return '0';
              const r = JSON.parse(s);
              return Object.values(r).filter((v: any) => v.entrada1).length;
            })()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Dias Registrados</div>
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

/* ==================== UNIFORM TAB ==================== */
function UniformTab({ items, myRequests, onSubmit, guardId }: any) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedItemData = items.find((i: any) => i.id === selectedItem);

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

  const closeModal = () => {
    setSelectedItem(null);
    setSize('');
    setQuantity(1);
    setReason('');
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
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.category} • Estoque: <span className={item.stock < 10 ? 'text-red-500 font-semibold' : 'text-gray-600'}>{item.stock}</span></p>
                <p className="text-xs text-gray-400 mt-1">Tamanhos: {item.sizes.join(', ')}</p>
              </div>
              <button
                onClick={() => setSelectedItem(item.id)}
                className="ml-3 px-3 py-1.5 rounded-lg text-xs font-medium transition bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm"
              >
                Solicitar
              </button>
            </div>
          </div>
        ))}
      </div>

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

      {/* POPUP MODAL */}
      {selectedItem && selectedItemData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closeModal}>
          <div
            className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Header do popup */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Solicitar Uniforme</p>
              <h3 className="text-xl font-bold mt-1">{selectedItemData.name}</h3>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="bg-white/20 rounded-full px-2 py-0.5">{selectedItemData.category}</span>
                <span className="bg-white/20 rounded-full px-2 py-0.5">Estoque: {selectedItemData.stock}</span>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Tamanho</label>
                <div className="grid grid-cols-4 gap-2">
                  {selectedItemData.sizes.map((s: string) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`py-2.5 rounded-lg text-sm font-semibold transition ${
                        size === s
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Quantidade</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold text-lg transition"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-gray-800">{quantity}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold text-lg transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Motivo</label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="">Selecione o motivo...</option>
                  {uniformReasons.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Resumo */}
              {size && reason && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">Resumo da solicitação:</p>
                  <p className="text-sm text-blue-800">
                    {selectedItemData.name} • Tam: <strong>{size}</strong> • Qtd: <strong>{quantity}</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">Motivo: {reason}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!size || !reason}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                ✓ Enviar Solicitação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== TICKET TAB ==================== */
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

/* ==================== COVERAGE TAB ==================== */
function CoverageTab({ myCoverages, onCheckIn, onCheckOut, guardId, guardName }: any) {
  const { addCoverage } = useApp();
  const [showRequest, setShowRequest] = useState(false);
  const [type, setType] = useState('');
  const [postId, setPostId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !postId) return;
    addCoverage({ postId, postName: postId, titularId: '1', titularName: 'Carlos Silva', coverageId: guardId, coverageName: guardName, type: type as 'substitution' | 'coverage', date: new Date().toISOString().split('T')[0] });
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
