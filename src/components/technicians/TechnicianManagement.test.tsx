import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TechnicianManagement } from './TechnicianManagement'
import { technicianService } from '@/services/technicianService'
import { useAppStore } from '@/store/useAppStore'
import { MemoryRouter } from 'react-router-dom'

// Mock services
vi.mock('@/services/technicianService', () => ({
  technicianService: {
    getAll: vi.fn(),
    getStatistics: vi.fn(),
    updateCompanyStatus: vi.fn(),
    updateTechnicianStatus: vi.fn(),
    deleteUser: vi.fn(),
    getProfilePhoto: vi.fn(),
  },
}))

// Mock store
vi.mock('@/store/useAppStore', () => ({
  useAppStore: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Users: () => <div data-testid="users-icon" />,
  Building: () => <div data-testid="building-icon" />,
  User: () => <div data-testid="user-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Search: () => <div data-testid="search-icon" />,
  ChevronRight: () => <div data-testid="chevron-right" />,
  ChevronLeft: () => <div data-testid="chevron-left" />,
  ChevronDown: () => <div data-testid="chevron-down" />,
  Star: () => <div data-testid="star-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  UserPlus: () => <div data-testid="user-plus-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  ArrowUp: () => <div data-testid="arrow-up" />,
  ArrowDown: () => <div data-testid="arrow-down" />,
  ArrowUpDown: () => <div data-testid="arrow-up-down" />,
}))

const mockStats = {
  totalTechnicians: 15,
  totalCorporateCompanies: 5,
  totalIndividualCompanies: 10,
}

const mockCorporateData = {
  content: [
    {
      companyId: 'c1',
      companyCode: 'C1',
      companyName: 'Tech Corp',
      companyType: 'corporate' as const,
      companyCreatedAt: '2026-01-01',
      ownerUserId: 'o1',
      ownerFirstName: 'John',
      ownerLastName: 'Owner',
      ownerFullName: 'John Owner',
      ownerEmail: 'john@corp.com',
      ownerTelephoneNumber: '123456789',
      ownerCapabilityIds: [1, 2],
      companyRating: { averageRating: 4.5, totalRatingCount: 10 },
      companyJobStats: { totalCompletedJobs: 50, last30DaysCompletedJobs: 5 },
      status: 'ACTIVE',
      deleted: 'False' as const,
      ownerAccountStatus: 'ACTIVE' as const,
      employees: [
        {
          technicianId: 1,
          technicianCode: 'E1',
          firstName: 'Employee',
          lastName: 'One',
          userId: 'e1',
          fullName: 'Employee One',
          email: 'emp1@corp.com',
          telephoneNumber: '123',
          ownerCapabilityIds: [],
          accountStatus: 'ACTIVE' as const,
          isHeadquarters: true,
          deleted: 'False' as const,
          createdAt: '2026-01-01',
          rating: { averageRating: 5, totalRatingCount: 1 },
          jobStats: { totalCompletedJobs: 1, last30DaysCompletedJobs: 1 },
          status: 'ACTIVE',
          ownerAccountStatus: 'ACTIVE' as const,
        }
      ],
    },
  ],
  totalElements: 1,
  totalPages: 1,
  page: 0,
  size: 10,
  hasNext: false,
  hasPrevious: false,
}

const mockIndividualData = {
  content: [
    {
      companyId: 'i1',
      companyCode: 'I1',
      companyName: 'Solo Tech',
      companyType: 'individual' as const,
      companyCreatedAt: '2026-01-01',
      ownerUserId: 'o2',
      ownerFirstName: 'Solo',
      ownerLastName: 'Worker',
      ownerFullName: 'Solo Worker',
      ownerEmail: 'solo@test.com',
      ownerTelephoneNumber: '987654321',
      ownerCapabilityIds: [3],
      companyRating: { averageRating: 4.8, totalRatingCount: 5 },
      companyJobStats: { totalCompletedJobs: 20, last30DaysCompletedJobs: 2 },
      status: 'ACTIVE',
      deleted: 'False' as const,
      ownerAccountStatus: 'ACTIVE' as const,
      employees: [],
    },
  ],
  totalElements: 1,
  totalPages: 1,
  page: 0,
  size: 10,
  hasNext: false,
  hasPrevious: false,
}

describe('TechnicianManagement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock implementations
    vi.mocked(useAppStore).mockReturnValue({ searchQuery: '' })
    vi.mocked(technicianService.getStatistics).mockResolvedValue(mockStats)
    vi.mocked(technicianService.getAll).mockImplementation((_p, _s, _sb, _sd, _search, corporate) => {
      if (corporate === 1) return Promise.resolve(mockCorporateData)
      return Promise.resolve(mockIndividualData)
    })
    vi.mocked(technicianService.getProfilePhoto).mockResolvedValue(new Blob())
    vi.mocked(technicianService.deleteUser).mockResolvedValue({})
    vi.mocked(technicianService.updateTechnicianStatus).mockResolvedValue({})
  })

  it('renders stats correctly', async () => {
    render(
      <MemoryRouter>
        <TechnicianManagement />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument() // Total
      expect(screen.getByText('5')).toBeInTheDocument()  // Corporate
      // 10 might appear in stats and in pagination page size select
      const tens = screen.getAllByText('10')
      expect(tens.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('fetches and displays corporate technicians by default', async () => {
    render(
      <MemoryRouter>
        <TechnicianManagement />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Tech Corp')).toBeInTheDocument()
      expect(technicianService.getAll).toHaveBeenCalledWith(
        0, 10, 'companyName', 'ASC', '', 1
      )
    })
  })

  it('switches to individual tab and fetches data', async () => {
    render(
      <MemoryRouter>
        <TechnicianManagement />
      </MemoryRouter>
    )

    const individualTab = screen.getByRole('button', { name: /individual/i })
    fireEvent.click(individualTab)

    await waitFor(() => {
      expect(screen.getByText('Solo Tech')).toBeInTheDocument()
      expect(technicianService.getAll).toHaveBeenCalledWith(
        0, 10, 'companyName', 'ASC', '', 0
      )
    })
  })

  it('integrates with global search query', async () => {
    vi.mocked(useAppStore).mockReturnValue({ searchQuery: 'SearchTerm' })
    
    render(
      <MemoryRouter>
        <TechnicianManagement />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(technicianService.getAll).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
        expect.any(String),
        'SearchTerm',
        expect.any(Number)
      )
    }, { timeout: 3000 })
  })

  it('handles sorting', async () => {
    render(
      <MemoryRouter>
        <TechnicianManagement />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Tech Corp')).toBeInTheDocument()
    })

    const ratingSort = screen.getByText('Rating')
    fireEvent.click(ratingSort)

    await waitFor(() => {
      expect(technicianService.getAll).toHaveBeenLastCalledWith(
        0, 10, 'averageRating', 'ASC', '', 1
      )
    })
  })
})
