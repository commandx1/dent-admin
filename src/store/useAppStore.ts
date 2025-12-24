import { create } from 'zustand'

export type Page = 'dashboard' | 'dentists' | 'technicians' | 'vendors' | 'invoices'

interface AppState {
  activePage: Page
  setActivePage: (page: Page) => void
  
  // Örnek veri (Dashboard için)
  stats: {
    scheduled: number
    emergency: number
    remote: number
  }
  invoices: Array<{
    id: string
    dentist: string
    technician: string
    amount: string
    status: 'Completed' | 'Pending' | 'Rejected'
    date: string
  }>
}

export const useAppStore = create<AppState>((set) => ({
  activePage: 'dashboard',
  setActivePage: (activePage) => set({ activePage }),
  
  stats: {
    scheduled: 342,
    emergency: 87,
    remote: 156,
  },
  
  invoices: [
    { id: '#INV-2024-1247', dentist: 'Dr. Sarah Mitchell', technician: 'John Smith', amount: '$3,450', status: 'Completed', date: 'Dec 8, 2024' },
    { id: '#INV-2024-1246', dentist: 'Dr. Michael Chen', technician: 'Robert Johnson', amount: '$2,890', status: 'Pending', date: 'Dec 8, 2024' },
    { id: '#INV-2024-1245', dentist: 'Dr. Emily Rodriguez', technician: 'David Martinez', amount: '$4,120', status: 'Completed', date: 'Dec 7, 2024' },
    { id: '#INV-2024-1244', dentist: 'Dr. James Wilson', technician: 'Christopher Lee', amount: '$1,560', status: 'Rejected', date: 'Dec 7, 2024' },
    { id: '#INV-2024-1243', dentist: 'Dr. Lisa Thompson', technician: 'Daniel Brown', amount: '$2,340', status: 'Pending', date: 'Dec 6, 2024' },
  ]
}))

