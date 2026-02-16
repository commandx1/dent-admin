import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DentistManagement } from './DentistManagement'
import { dentistService } from '@/services/dentistService'
import { useAppStore } from '@/store/useAppStore'
import { MemoryRouter } from 'react-router-dom'
import type { Dentist } from './types'

// Mock services
vi.mock('@/services/dentistService', () => ({
  dentistService: {
    getAll: vi.fn(),
    getRoleStatistics: vi.fn(),
  },
}))

// Mock store
vi.mock('@/store/useAppStore', () => ({
  useAppStore: vi.fn(),
}))

// Mock components that might be complex or have many dependencies
vi.mock('./DentistRow', () => ({
  DentistRow: ({ dentist }: { dentist: Dentist }) => (
    <tr data-testid="dentist-row">
      <td>{dentist.firstName}</td>
      <td>{dentist.lastName}</td>
    </tr>
  ),
}))

const mockRoleStats = {
  dentistAdminCount: 25,
  dentistManagerCount: 10,
}

const mockDentists = {
  content: [
    {
      userId: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123456789',
      companyName: 'Clinic A',
      lastLogin: '2026-01-20T10:00:00',
      createdAt: '2026-01-01T10:00:00',
      locationCount: 1,
      profilePhotoData: null,
    },
    {
      userId: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '987654321',
      companyName: 'Clinic B',
      lastLogin: '2026-01-21T10:00:00',
      createdAt: '2026-01-02T10:00:00',
      locationCount: 2,
      profilePhotoData: null,
    },
  ],
  page: 0,
  size: 10,
  totalElements: 2,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
}

describe('DentistManagement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAppStore).mockReturnValue('') // Default search query
    vi.mocked(dentistService.getRoleStatistics).mockResolvedValue(mockRoleStats)
    vi.mocked(dentistService.getAll).mockResolvedValue(mockDentists)
  })

  it('renders and fetches data correctly', async () => {
    render(
      <MemoryRouter>
        <DentistManagement />
      </MemoryRouter>
    )

    // Check stats
    await waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })

    // Check table content
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByText('Jane')).toBeInTheDocument()
    })

    expect(dentistService.getRoleStatistics).toHaveBeenCalled()
    expect(dentistService.getAll).toHaveBeenCalled()
  })

  it('switches between Clinic and Individual tabs', async () => {
    render(
      <MemoryRouter>
        <DentistManagement />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument()
    })

    const individualTab = screen.getByRole('button', { name: /individual/i })
    fireEvent.click(individualTab)

    await waitFor(() => {
      // should call getAll with haveSubValue = 0
      expect(dentistService.getAll).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
        expect.any(String),
        '',
        0
      )
    })
  })

  it('handles sorting', async () => {
    render(
      <MemoryRouter>
        <DentistManagement />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument()
    })

    const createdAtSort = screen.getByText('Created At')
    fireEvent.click(createdAtSort)

    await waitFor(() => {
      expect(dentistService.getAll).toHaveBeenCalledWith(
        0, // page reset to 0
        expect.any(Number),
        'createdAt',
        'DESC',
        '',
        1
      )
    })
  })

  it('displays empty state when no dentists found', async () => {
    vi.mocked(dentistService.getAll).mockResolvedValue({ 
      content: [], 
      page: 0, 
      size: 10, 
      totalElements: 0, 
      totalPages: 0, 
      hasNext: false, 
      hasPrevious: false 
    })
    
    render(
      <MemoryRouter>
        <DentistManagement />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No dentists found.')).toBeInTheDocument()
    })
  })
})
