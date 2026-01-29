export interface Rating {
  averageRating: number;
  totalRatingCount: number;
}

export interface JobStats {
  totalCompletedJobs: number;
  last30DaysCompletedJobs: number;
}

export interface Employee {
  technicianId: number;
  userId: string;
  technicianCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  ownerCapabilityIds: number[];
  telephoneNumber: string;
  isHeadquarters: boolean;
  deleted: 'True' | 'False';
  createdAt: string;
  rating: Rating;
  jobStats: JobStats;
  status: string;
  ownerAccountStatus: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'UNLOCKED' | 'PASSIVE' | 'REVOKED';
  accountStatus: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'UNLOCKED' | 'PASSIVE' | 'REVOKED';
}

export interface Company {
  companyId: string;
  companyCode: string;
  companyName: string;
  companyType: 'corporate' | 'individual';
  companyCreatedAt: string;
  ownerCapabilityIds: number[];
  ownerUserId: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  ownerFullName: string | null;
  ownerEmail: string | null;
  ownerTelephoneNumber: string | null;
  ownerTechnicianId?: number | null;
  companyRating: Rating;
  companyJobStats: JobStats;
  status: string;
  deleted: 'True' | 'False';
  ownerAccountStatus: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'UNLOCKED' | 'PASSIVE' | 'REVOKED';
  employees: Employee[];
}

export interface TechnicianResponse {
  content: Company[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CompanyMember {
  company_id?: string
  user_first_name: string
  user_last_name: string
  email: string
  address: string
  city: string
  state: string
  zip_code: string
  capabilityIds?: number[]
  country: string
  latitude: number
  longitude: number
  is_headquarters: boolean
  capability_ids?: number[]
}

export const CAPABILITIES = [
  { id: 1, label: 'Panoramic 2D/3D CBCT' },
  {
    id: 2,
    label:
      'General Equipment'
  },
  { id: 3, label: 'Hand Pieces' }
]

// For compatibility with existing components if needed, 
// though it might be better to update them.
export type TableItem = Company;

export interface TechnicianStatistics {
  totalCorporateCompanies: number;
  totalIndividualCompanies: number;
  totalTechnicians: number;
}
