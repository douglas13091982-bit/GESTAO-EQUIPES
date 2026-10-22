import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Post, UniformItem, UniformRequest, Ticket, Coverage, OvertimeRequest, Notification } from './types';
import * as data from './data';

interface AppState {
  currentUser: User | null;
  posts: Post[];
  uniformItems: UniformItem[];
  uniformRequests: UniformRequest[];
  tickets: Ticket[];
  coverages: Coverage[];
  overtimeRequests: OvertimeRequest[];
  notifications: Notification[];
  login: (matricula: string, password: string) => boolean;
  logout: () => void;
  addUniformRequest: (req: Omit<UniformRequest, 'id' | 'status' | 'date' | 'guardName'>) => void;
  updateUniformRequestStatus: (id: string, status: UniformRequest['status']) => void;
  addTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'date' | 'guardName'>) => void;
  updateTicketStatus: (id: string, status: Ticket['status']) => void;
  addCoverage: (cov: Omit<Coverage, 'id' | 'status'>) => void;
  updateCoverageStatus: (id: string, status: Coverage['status']) => void;
  checkInCoverage: (id: string) => void;
  checkOutCoverage: (id: string) => void;
  addOvertimeRequest: (req: Omit<OvertimeRequest, 'id' | 'status' | 'authorized'>) => void;
  updateOvertimeStatus: (id: string, status: OvertimeRequest['status']) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  updatePostStatus: (id: string, status: Post['status']) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(data.posts);
  const [uniformItems, setUniformItems] = useState<UniformItem[]>(data.uniformItems);
  const [uniformRequests, setUniformRequests] = useState<UniformRequest[]>(data.uniformRequests);
  const [tickets, setTickets] = useState<Ticket[]>(data.tickets);
  const [coverages, setCoverages] = useState<Coverage[]>(data.coverages);
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>(data.overtimeRequests);
  const [notifications, setNotifications] = useState<Notification[]>(data.notifications);

  const login = (matricula: string, _password: string): boolean => {
    const user = data.users.find(u => u.matricula === matricula);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addUniformRequest = (req: Omit<UniformRequest, 'id' | 'status' | 'date' | 'guardName'>) => {
    const guard = data.users.find(u => u.id === req.guardId);
    const newReq: UniformRequest = {
      ...req,
      id: `ur${Date.now()}`,
      guardName: guard?.name || '',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setUniformRequests(prev => [newReq, ...prev]);
  };

  const updateUniformRequestStatus = (id: string, status: UniformRequest['status']) => {
    setUniformRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const addTicket = (ticket: Omit<Ticket, 'id' | 'status' | 'date' | 'guardName'>) => {
    const guard = data.users.find(u => u.id === ticket.guardId);
    const newTicket: Ticket = {
      ...ticket,
      id: `t${Date.now()}`,
      guardName: guard?.name || '',
      status: 'open',
      date: new Date().toISOString().split('T')[0],
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const addCoverage = (cov: Omit<Coverage, 'id' | 'status'>) => {
    const newCov: Coverage = { ...cov, id: `c${Date.now()}`, status: 'requested' };
    setCoverages(prev => [newCov, ...prev]);
  };

  const updateCoverageStatus = (id: string, status: Coverage['status']) => {
    setCoverages(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const checkInCoverage = (id: string) => {
    setCoverages(prev => prev.map(c => c.id === id ? { ...c, checkIn: new Date().toISOString(), status: 'active' } : c));
  };

  const checkOutCoverage = (id: string) => {
    setCoverages(prev => prev.map(c => c.id === id ? { ...c, checkOut: new Date().toISOString(), status: 'completed' } : c));
  };

  const addOvertimeRequest = (req: Omit<OvertimeRequest, 'id' | 'status' | 'authorized'>) => {
    const newReq: OvertimeRequest = { ...req, id: `he${Date.now()}`, status: 'pending', authorized: false };
    setOvertimeRequests(prev => [newReq, ...prev]);
  };

  const updateOvertimeStatus = (id: string, status: OvertimeRequest['status']) => {
    setOvertimeRequests(prev => prev.map(r => r.id === id ? { ...r, status, authorized: status === 'approved' } : r));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotif: Notification = { ...notif, id: `n${Date.now()}`, date: new Date().toISOString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updatePostStatus = (id: string, status: Post['status']) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  return (
    <AppContext.Provider value={{
      currentUser, posts, uniformItems, uniformRequests, tickets, coverages, overtimeRequests, notifications,
      login, logout, addUniformRequest, updateUniformRequestStatus, addTicket, updateTicketStatus,
      addCoverage, updateCoverageStatus, checkInCoverage, checkOutCoverage,
      addOvertimeRequest, updateOvertimeStatus, addNotification, markNotificationRead, updatePostStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
