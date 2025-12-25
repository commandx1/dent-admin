export type TechnicianType = 'Headquarter' | 'Member' | 'Individual';

export interface Technician {
  id: string;
  name: string;
  type: TechnicianType;
  email: string;
  phone: string;
  jobsCompleted: number;
  jobsThisMonth: number;
  rating: number;
  reviewsCount: number;
  status: 'Active' | 'Inactive';
  avatar: string;
}

export interface Company {
  id: string;
  companyName: string;
  type: 'Company';
  technicians: Technician[];
}

export type TableItem = Company | Technician;
