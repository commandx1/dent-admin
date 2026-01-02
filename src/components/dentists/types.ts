export interface Dentist {
  userId: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  locationCount: number;
  lastLogin: string;
  createdAt: string;
  profilePhotoData: string | null;
  accountStatus?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

