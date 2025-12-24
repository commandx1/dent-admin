import { create } from 'zustand'

interface DashboardStats {
  scheduled: number
  emergency: number
  remote: number
  pendingInvoices: number
  completedInvoices: number
  rejectedInvoices: number
  totalRevenue: number
}

interface DashboardState {
  stats: DashboardStats
}

export const useDashboardStore = create<DashboardState>(() => ({
  stats: {
    scheduled: 342,
    emergency: 87,
    remote: 156,
    pendingInvoices: 45,
    completedInvoices: 287,
    rejectedInvoices: 10,
    totalRevenue: 124560,
  },
}))

