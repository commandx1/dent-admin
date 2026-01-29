import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DentistDetails } from './DentistDetails'
import { dentistService } from '@/services/dentistService'
import { technicianService } from '@/services/technicianService'
import { useAppStore } from '@/store/useAppStore'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// Mock services
vi.mock('@/services/dentistService', () => ({
  dentistService: {
    getById: vi.fn(),
  },
}))

vi.mock('@/services/technicianService', () => ({
  technicianService: {
    getProfilePhoto: vi.fn(),
  },
}))

// Mock store
const mockSetSelectedDentist = vi.fn()
vi.mock('@/store/useAppStore', () => ({
  useAppStore: () => ({
    setSelectedDentist: mockSetSelectedDentist,
  }),
}))

const mockDentist = {
  userId: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '123456789',
  companyName: 'Dental Care Clinic',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'USA',
  lastLogin: '2026-01-20T10:00:00Z',
  createdAt: '2026-01-01T10:00:00Z',
  locationCount: 3,
  appointmentStats: {
    scheduleCount: 50,
    emergencyCallCount: 5,
    remoteAssistanceCount: 10,
  },
}

describe('DentistDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(dentistService.getById).mockResolvedValue(mockDentist)
    vi.mocked(technicianService.getProfilePhoto).mockResolvedValue(null)
  })

  const renderComponent = (id = '1') => {
    return render(
      <MemoryRouter initialEntries={[`/dentists/${id}`]}>
        <Routes>
          <Route path="/dentists/:id" element={<DentistDetails />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders dentist details correctly', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Dr. John Doe')).toBeInTheDocument()
    })

    expect(screen.getAllByText('john@example.com').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('123456789').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Dental Care Clinic').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('3 Locations')).toBeInTheDocument()
    
    // Check stats
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()

    // Check store update
    expect(mockSetSelectedDentist).toHaveBeenCalledWith({
      name: 'Dr. John Doe',
      companyName: 'Dental Care Clinic',
    })
  })

  it('handles dentist not found', async () => {
    vi.mocked(dentistService.getById).mockRejectedValue(new Error('Not found'))
    
    renderComponent('999')

    await waitFor(() => {
      expect(screen.getByText('Dentist not found.')).toBeInTheDocument()
    })
  })

  it('fetches and displays profile photo', async () => {
    vi.mocked(technicianService.getProfilePhoto).mockResolvedValue('base64photodata')
    
    renderComponent()

    await waitFor(() => {
      const img = screen.getByAltText('Dr. John Doe')
      expect(img).toHaveAttribute('src', 'data:image/jpeg;base64,base64photodata')
    })
  })
})
