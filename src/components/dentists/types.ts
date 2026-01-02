export interface SubDentist {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  locationAddress?: string;
  locationName?: string;
  createdAt: string;
  lastLogin?: string;
  profilePhotoData: string | null;
}

export interface AppointmentStats {
  scheduleCount: number;
  remoteAssistanceCount: number;
  emergencyCallCount: number;
  totalCount: number;
}

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
  subDentists?: SubDentist[];
  accountStatus?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  appointmentStats?: AppointmentStats;
}
