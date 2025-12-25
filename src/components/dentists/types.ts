export interface Dentist {
  id: number;
  firstName: string;
  lastName: string;
  companyName: string;
  membership: 'Premium Member' | 'Standard Member';
  email: string;
  phone: string;
  locationsCount: number;
  lastLogin: string;
  lastLoginDate: string;
  avatar: string;
}

