export interface Technician {
  id: string;
  name: string;
  type: 'Company' | 'Individual';
  companyName?: string;
  ein?: string;
  email: string;
  phone: string;
  jobsCompleted: number;
  jobsThisMonth: number;
  rating: number;
  reviewsCount: number;
  status: 'Active' | 'Inactive';
  avatar: string;
  mobileAdded?: boolean;
  subTechnicians?: Technician[];
}

