import { Post, UniformItem, UniformRequest, Ticket, Coverage, OvertimeRequest, Notification, User } from './types';

export const users: User[] = [
  { id: '1', name: 'Carlos Silva', matricula: 'V001', role: 'guard', phone: '(11) 99999-0001', posto: 'Edifício Central' },
  { id: '2', name: 'João Santos', matricula: 'V002', role: 'guard', phone: '(11) 99999-0002', posto: 'Condomínio Parque Sul' },
  { id: '3', name: 'Pedro Oliveira', matricula: 'V003', role: 'guard', phone: '(11) 99999-0003', posto: 'Depósito Industrial' },
  { id: '4', name: 'Roberto Lima', matricula: 'V004', role: 'guard', phone: '(11) 99999-0004', posto: 'Shopping Center Norte' },
  { id: '5', name: 'Supervisor Admin', matricula: 'ADM01', role: 'admin', phone: '(11) 99999-0099' },
];

export const posts: Post[] = [
  { id: 'p1', name: 'Edifício Central', address: 'Av. Paulista, 1000', gpsCoords: { lat: -23.5614, lng: -46.6558 }, risk: 'high', requiredGuards: 2, roundInterval: 60, status: 'ok' },
  { id: 'p2', name: 'Condomínio Parque Sul', address: 'Rua das Flores, 250', gpsCoords: { lat: -23.5720, lng: -46.6390 }, risk: 'medium', requiredGuards: 1, roundInterval: 120, status: 'ok' },
  { id: 'p3', name: 'Depósito Industrial', address: 'Rod. Anhanguera, Km 15', gpsCoords: { lat: -23.4500, lng: -46.7200 }, risk: 'high', requiredGuards: 2, roundInterval: 45, status: 'warning' },
  { id: 'p4', name: 'Escola Municipal', address: 'Rua Educação, 88', gpsCoords: { lat: -23.5900, lng: -46.6800 }, risk: 'low', requiredGuards: 1, roundInterval: 180, status: 'critical' },
  { id: 'p5', name: 'Shopping Center Norte', address: 'Av. Norte, 5000', gpsCoords: { lat: -23.5100, lng: -46.6100 }, risk: 'medium', requiredGuards: 3, roundInterval: 90, status: 'ok' },
];

// Alocação de vigilantes por posto: postId -> array de user ids
export const postAllocations: Record<string, string[]> = {
  'p1': ['1', '2'], // Edifício Central: Carlos e João
  'p2': ['3'],      // Condomínio Parque Sul: Pedro
  'p3': ['4'],      // Depósito Industrial: Roberto (falta 1)
  'p4': [],         // Escola Municipal: vazio (posto descoberto)
  'p5': [],         // Shopping Center Norte: vazio (falta 3)
};

export const uniformItems: UniformItem[] = [
  { id: 'u1', name: 'Camisa Social Azul', category: 'Uniforme', stock: 45, blocked: false, sizes: ['P', 'M', 'G', 'GG'] },
  { id: 'u2', name: 'Calça Tática Preta', category: 'Uniforme', stock: 30, blocked: false, sizes: ['38', '40', '42', '44', '46'] },
  { id: 'u3', name: 'Botina de Segurança', category: 'Calçado', stock: 20, blocked: false, sizes: ['39', '40', '41', '42', '43', '44'] },
  { id: 'u4', name: 'Cinturão Tático', category: 'Equipamento', stock: 15, blocked: false, sizes: ['P', 'M', 'G'] },
  { id: 'u5', name: 'Colete Refletivo', category: 'EPI', stock: 8, blocked: false, sizes: ['M', 'G', 'GG'] },
  { id: 'u6', name: 'Capa de Chuva', category: 'EPI', stock: 3, blocked: true, sizes: ['M', 'G', 'GG'] },
];

export const uniformRequests: UniformRequest[] = [
  { id: 'ur1', guardId: '1', guardName: 'Carlos Silva', itemId: 'u1', itemName: 'Camisa Social Azul', size: 'G', quantity: 2, reason: 'Troca por desgaste', status: 'pending', date: '2026-01-15' },
  { id: 'ur2', guardId: '2', guardName: 'João Santos', itemId: 'u3', itemName: 'Botina de Segurança', size: '42', quantity: 1, reason: 'Nova admissão', status: 'approved', date: '2026-01-14' },
  { id: 'ur3', guardId: '3', guardName: 'Pedro Oliveira', itemId: 'u4', itemName: 'Cinturão Tático', size: 'M', quantity: 1, reason: 'Perda', status: 'pending', date: '2026-01-13' },
  { id: 'ur4', guardId: '4', guardName: 'Roberto Lima', itemId: 'u2', itemName: 'Calça Tática Preta', size: '42', quantity: 1, reason: 'Troca por desgaste', status: 'delivered', date: '2026-01-10' },
];

export const tickets: Ticket[] = [
  { id: 't1', guardId: '1', guardName: 'Carlos Silva', postId: 'p1', postName: 'Edifício Central', category: 'Infraestrutura', priority: 'high', description: 'Portão eletrônico da garagem não está funcionando', status: 'open', date: '2026-01-15', hasPhoto: true },
  { id: 't2', guardId: '2', guardName: 'João Santos', postId: 'p2', postName: 'Condomínio Parque Sul', category: 'Equipamento', priority: 'medium', description: 'Lanterna sem carga, não funciona', status: 'in_progress', date: '2026-01-14', hasPhoto: false },
  { id: 't3', guardId: '3', guardName: 'Pedro Oliveira', postId: 'p4', postName: 'Escola Municipal', category: 'Infraestrutura', priority: 'critical', description: 'Posto sem iluminação noturna - risco de segurança', status: 'open', date: '2026-01-15', hasPhoto: true },
  { id: 't4', guardId: '4', guardName: 'Roberto Lima', postId: 'p5', postName: 'Shopping Center Norte', category: 'Comunicação', priority: 'low', description: 'Rádio com interferência no canal 3', status: 'resolved', date: '2026-01-12', hasPhoto: false },
];

export const coverages: Coverage[] = [
  { id: 'c1', postId: 'p1', postName: 'Edifício Central', titularId: '1', titularName: 'Carlos Silva', coverageId: '2', coverageName: 'João Santos', type: 'substitution', checkIn: '2026-01-15T08:00', date: '2026-01-15', status: 'active' },
  { id: 'c2', postId: 'p3', postName: 'Depósito Industrial', titularId: '3', titularName: 'Pedro Oliveira', coverageId: '4', coverageName: 'Roberto Lima', type: 'coverage', checkIn: '2026-01-15T07:30', date: '2026-01-15', status: 'requested' },
  { id: 'c3', postId: 'p2', postName: 'Condomínio Parque Sul', titularId: '2', titularName: 'João Santos', coverageId: '3', coverageName: 'Pedro Oliveira', type: 'substitution', checkIn: '2026-01-14T18:00', checkOut: '2026-01-15T06:00', date: '2026-01-14', status: 'completed' },
];

export const overtimeRequests: OvertimeRequest[] = [
  { id: 'he1', guardId: '1', guardName: 'Carlos Silva', date: '2026-01-16', startTime: '18:00', endTime: '22:00', reason: 'Reunião de Segurança', status: 'pending', authorized: false },
  { id: 'he2', guardId: '2', guardName: 'João Santos', date: '2026-01-15', startTime: '06:00', endTime: '10:00', reason: 'Cobertura urgente - colega faltou', status: 'approved', authorized: true },
  { id: 'he3', guardId: '3', guardName: 'Pedro Oliveira', date: '2026-01-17', startTime: '18:00', endTime: '00:00', reason: 'Evento especial no posto', status: 'pending', authorized: false },
  { id: 'he4', guardId: '4', guardName: 'Roberto Lima', date: '2026-01-14', startTime: '22:00', endTime: '06:00', reason: 'Substituição emergencial', status: 'rejected', authorized: false },
];

export const notifications: Notification[] = [
  { id: 'n1', message: 'Posto Escola Municipal está DESCOBERTO!', type: 'alert', date: '2026-01-15T10:30', read: false },
  { id: 'n2', message: 'Carlos Silva solicitou 2 camisas (pendente)', type: 'info', date: '2026-01-15T09:15', read: false },
  { id: 'n3', message: 'HE aprovada para João Santos - 15/01', type: 'success', date: '2026-01-15T08:00', read: true },
  { id: 'n4', message: 'Chamado CRÍTICO aberto: Escola sem iluminação', type: 'alert', date: '2026-01-15T07:45', read: false },
  { id: 'n5', message: 'Roberto Lima não fez check-in no Depósito Industrial', type: 'alert', date: '2026-01-15T07:35', read: false },
];

export const ticketCategories = ['Infraestrutura', 'Equipamento', 'Comunicação', 'Veículo', 'EPI', 'Outros'];
export const overtimeReasons = ['Reunião de Segurança', 'Cobertura urgente', 'Evento especial', 'Substituição emergencial', 'Treinamento', 'Outros'];
export const uniformReasons = ['Troca por desgaste', 'Perda', 'Nova admissão', 'Danificado em serviço', 'Outros'];
