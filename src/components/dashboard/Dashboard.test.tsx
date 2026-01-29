import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Dashboard } from './Dashboard'
import { appointmentService } from '@/services/appointmentService'
import { invoiceService } from '@/services/invoiceService'
import { technicianService } from '@/services/technicianService'
import { toast } from 'sonner'

// Mock services
vi.mock('@/services/appointmentService', () => ({
  appointmentService: {
    getStatistics: vi.fn(),
    getScheduled: vi.fn(),
    changeTechnician: vi.fn(),
  },
}))

vi.mock('@/services/invoiceService', () => ({
  invoiceService: {
    getStatistics: vi.fn(),
    getAll: vi.fn(),
  },
}))

vi.mock('@/services/technicianService', () => ({
  technicianService: {
    getAll: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock lucide icons
vi.mock('lucide-react', () => ({
  CalendarCheck: () => <div data-testid="calendar-icon" />,
  PhoneCall: () => <div data-testid="phone-icon" />,
  Video: () => <div data-testid="video-icon" />,
  CheckCircle2: () => <div data-testid="check-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  UserRound: () => <div data-testid="user-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Edit2: () => <div data-testid="edit-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  ArrowUp: () => <div data-testid="arrow-up" />,
  ArrowDown: () => <div data-testid="arrow-down" />,
}))

const mockAppointmentStats = {
  totalScheduleAppointments: 10,
  completedScheduleAppointments: 5,
  pendingScheduleAppointments: 2,
  cancelledScheduleAppointments: 3,
  totalEmergencyCallAppointments: 3,
  completedEmergencyCallAppointments: 2,
  expiredEmergencyCallAppointments: 1,
  cancelledEmergencyCallAppointments: 0,
  averageResponseTimeMinutes: 15.5,
  totalRemoteAssistanceAppointments: 2,
  completedRemoteAssistanceAppointments: 2,
  averageDurationMinutes: 20.2,
}

const mockInvoiceStats = {
  pendingCount: 3,
  pendingTotalAmount: 1500,
  approvedCount: 10,
  approvedTotalAmount: 5000,
  rejectedCount: 1,
  rejectedTotalAmount: 200,
  totalCount: 14,
  grandTotalAmount: 6700,
  daysPeriod: 30,
}

const mockScheduledAppointments = {
  content: [
    {
      appointmentId: '1',
      description: 'Test Appointment 1',
      locationAddress: 'Address 1',
      scheduledDate: '2026-02-01',
      scheduledTime: '10:00:00',
      createdAt: '2026-01-20T10:00:00',
      organizerName: 'Dr. Smith',
      serviceProviderName: 'Tech 1',
      serviceProviderId: 't1',
      appointmentStatus: 'APPROVED' as const,
    },
    {
      appointmentId: '2',
      description: 'Test Appointment 2',
      locationAddress: 'Address 2',
      scheduledDate: '2026-02-02',
      scheduledTime: '11:00:00',
      createdAt: '2026-01-21T10:00:00',
      organizerName: 'Dr. Jones',
      serviceProviderName: 'Tech 2',
      serviceProviderId: 't2',
      appointmentStatus: 'PENDING' as const,
    },
  ],
  page: 0,
  size: 10,
  totalElements: 2,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
}

const mockTechnicians = {
  content: [
    {
      companyId: 'c1',
      companyCode: 'CODE1',
      companyName: 'Corporate Tech',
      companyType: 'corporate' as const,
      companyCreatedAt: '2026-01-01',
      ownerCapabilityIds: [],
      ownerUserId: 'o1',
      ownerFirstName: 'Owner',
      ownerLastName: 'One',
      ownerFullName: 'Owner One',
      ownerEmail: 'owner@test.com',
      ownerTelephoneNumber: '123',
      companyRating: { averageRating: 5, totalRatingCount: 10 },
      companyJobStats: { totalCompletedJobs: 100, last30DaysCompletedJobs: 10 },
      status: 'ACTIVE',
      deleted: 'False' as const,
      ownerAccountStatus: 'ACTIVE' as const,
      employees: [
        { 
          userId: 't1', 
          fullName: 'Tech 1', 
          accountStatus: 'ACTIVE' as const,
          technicianId: 1,
          technicianCode: 'T1',
          firstName: 'Tech',
          lastName: '1',
          email: 't1@test.com',
          ownerCapabilityIds: [],
          telephoneNumber: '123',
          isHeadquarters: false,
          deleted: 'False' as const,
          createdAt: '2026-01-01',
          rating: { averageRating: 5, totalRatingCount: 10 },
          jobStats: { totalCompletedJobs: 50, last30DaysCompletedJobs: 5 },
          status: 'ACTIVE',
          ownerAccountStatus: 'ACTIVE' as const,
        },
        { 
          userId: 't2', 
          fullName: 'Tech 2', 
          accountStatus: 'ACTIVE' as const,
          technicianId: 2,
          technicianCode: 'T2',
          firstName: 'Tech',
          lastName: '2',
          email: 't2@test.com',
          ownerCapabilityIds: [],
          telephoneNumber: '456',
          isHeadquarters: false,
          deleted: 'False' as const,
          createdAt: '2026-01-01',
          rating: { averageRating: 4, totalRatingCount: 8 },
          jobStats: { totalCompletedJobs: 40, last30DaysCompletedJobs: 4 },
          status: 'ACTIVE',
          ownerAccountStatus: 'ACTIVE' as const,
        },
      ],
    },
  ],
  page: 0,
  size: 10,
  totalElements: 1,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
}

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    vi.mocked(appointmentService.getStatistics).mockResolvedValue(mockAppointmentStats)
    vi.mocked(invoiceService.getStatistics).mockResolvedValue(mockInvoiceStats)
    vi.mocked(appointmentService.getScheduled).mockResolvedValue(mockScheduledAppointments)
    vi.mocked(technicianService.getAll).mockResolvedValue(mockTechnicians)
    vi.mocked(invoiceService.getAll).mockResolvedValue({ 
      content: [], 
      page: 0, 
      size: 10, 
      totalElements: 0, 
      totalPages: 0, 
      hasNext: false, 
      hasPrevious: false 
    })
  })

  it('fetches and displays statistics correctly', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      // Check for Scheduled Appointments value
      const stats10 = screen.getAllByText('10')
      expect(stats10.length).toBeGreaterThanOrEqual(2)
    }, { timeout: 3000 })

    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(2) // Emergency Calls & Invoice Pending
    expect(screen.getByText('2')).toBeInTheDocument() // Remote Consultations
    expect(screen.getByText('$5,000')).toBeInTheDocument() // Invoice amount
    expect(screen.getByText('15.5 min')).toBeInTheDocument() // Avg response time
  })

  it('handles numeric input for invoice days', async () => {
    render(<Dashboard />)
    
    const input = screen.getByDisplayValue('30')
    fireEvent.change(input, { target: { value: '60' } })
    
    await waitFor(() => {
      expect(invoiceService.getStatistics).toHaveBeenLastCalledWith(60)
    }, { timeout: 3000 })
  })

  it('switches between Approved and Pending appointment tabs', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Appointment 1')).toBeInTheDocument()
    }, { timeout: 3000 })

    const pendingTab = screen.getByRole('button', { name: /pending/i })
    fireEvent.click(pendingTab)

    await waitFor(() => {
      expect(screen.getByText('Test Appointment 2')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    expect(screen.queryByText('Test Appointment 1')).not.toBeInTheDocument()
  })

  it('handles technician change', async () => {
    vi.mocked(appointmentService.changeTechnician).mockResolvedValue({})
    
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Appointment 1')).toBeInTheDocument()
    }, { timeout: 3000 })

    const editButtons = screen.getAllByTitle('Update Technician')
    fireEvent.click(editButtons[0])

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 't2' } })

    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(appointmentService.changeTechnician).toHaveBeenCalledWith('1', 't2')
      expect(toast.success).toHaveBeenCalledWith('Technician updated successfully')
    }, { timeout: 3000 })
  })
})
