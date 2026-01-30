import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TechnicianRow } from './TechnicianRow'
import { technicianService } from '@/services/technicianService'
import { toast } from 'sonner'
import { MemoryRouter } from 'react-router-dom'
import type { Company } from './types'

// Mock services
vi.mock('@/services/technicianService', () => ({
  technicianService: {
    getProfilePhoto: vi.fn(),
    updateCompanyStatus: vi.fn(),
    updateTechnicianStatus: vi.fn(),
    deleteUser: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock components
vi.mock('./AddEmployeeModal', () => ({
  AddEmployeeModal: () => <div data-testid="add-employee-modal" />,
}))

const mockCompany: Company = {
  companyId: 'c1',
  companyCode: 'C1',
  companyCreatedAt: '2026-01-01',
  ownerFirstName: 'John',
  ownerLastName: 'Owner',
  companyName: 'Tech Corp',
  companyType: 'corporate' as const,
  ownerUserId: 'o1',
  ownerFullName: 'John Owner',
  ownerEmail: 'john@corp.com',
  ownerTelephoneNumber: '123456789',
  ownerCapabilityIds: [1],
  companyRating: { averageRating: 4, totalRatingCount: 5 },
  companyJobStats: { totalCompletedJobs: 10, last30DaysCompletedJobs: 1 },
  status: 'ACTIVE',
  deleted: 'False' as const,
  ownerAccountStatus: 'ACTIVE' as const,
  employees: [],
}

describe('TechnicianRow Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(technicianService.getProfilePhoto).mockResolvedValue(new Blob())
  })

  it('renders company information correctly', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TechnicianRow item={mockCompany} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    expect(screen.getByText('Tech Corp')).toBeInTheDocument()
    expect(screen.getByText('john@corp.com')).toBeInTheDocument()
  })

  it('handles permanent delete flow', async () => {
    vi.mocked(technicianService.deleteUser).mockResolvedValue({})
    
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TechnicianRow item={mockCompany} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    const deleteButton = screen.getByTitle('Delete Technician User')
    fireEvent.click(deleteButton)

    // Modal should appear
    expect(screen.getByText(/Are you sure you want to permanently delete/i)).toBeInTheDocument()
    
    const confirmButton = screen.getByText('Yes, Delete Permanently')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(technicianService.deleteUser).toHaveBeenCalledWith('o1')
      expect(toast.success).toHaveBeenCalledWith('Technician user deleted permanently')
    })
  })

  it('handles status change flow', async () => {
    vi.mocked(technicianService.updateCompanyStatus).mockResolvedValue({})
    
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TechnicianRow item={mockCompany} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    const statusSelect = screen.getByRole('combobox')
    fireEvent.change(statusSelect, { target: { value: 'PASSIVE' } })

    // Confirmation modal should appear
    expect(screen.getByText(/Are you sure you want to change this technician's status to/i)).toBeInTheDocument()
    
    const confirmButton = screen.getByText('Yes, Update')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(technicianService.updateCompanyStatus).toHaveBeenCalledWith('c1', false)
    })
  })
})
