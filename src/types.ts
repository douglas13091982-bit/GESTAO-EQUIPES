export type UserRole = 'guard' | 'admin';

export interface User {
  id: string;
  name: string;
  matricula: string;
  role: UserRole;
  phone: string;
  photo?: string;
  posto?: string;
  escala?: {
    turno: 'diurno' | 'noturno';
    entrada: string;
    saida: string;
    intervalo?: string;
  };
}

export interface Post {
  id: string;
  name: string;
  address: string;
  gpsCoords: { lat: number; lng: number };
  risk: 'low' | 'medium' | 'high';
  requiredGuards: number;
  roundInterval: number; // minutes
  status: 'ok' | 'warning' | 'critical';
}

export interface UniformItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  blocked: boolean;
  sizes: string[];
}

export interface UniformRequest {
  id: string;
  guardId: string;
  guardName: string;
  itemId: string;
  itemName: string;
  size: string;
  quantity: number;
  reason: string;
  status: 'pending' | 'approved' | 'delivered' | 'rejected';
  date: string;
}

export interface Ticket {
  id: string;
  guardId: string;
  guardName: string;
  postId: string;
  postName: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  date: string;
  hasPhoto: boolean;
}

export interface Coverage {
  id: string;
  postId: string;
  postName: string;
  titularId: string;
  titularName: string;
  coverageId: string;
  coverageName: string;
  type: 'substitution' | 'coverage';
  checkIn?: string;
  checkOut?: string;
  date: string;
  status: 'requested' | 'approved' | 'active' | 'completed';
}

export interface OvertimeRequest {
  id: string;
  guardId: string;
  guardName: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  authorized: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  date: string;
  read: boolean;
}
