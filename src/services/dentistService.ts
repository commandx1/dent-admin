import api from '@/lib/api';
import type { Dentist } from '@/components/dentists/types';

interface DentistListResponse {
  content: Dentist[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const dentistService = {
  getAll: async (page = 0, size = 10, sortBy = 'lastLogin', sortDirection = 'DESC', searchTerm = '', dentistHaveSub?: number) => {
    const response = await api.get<DentistListResponse>('/api/v1/dentists', {
      params: { 
        page, 
        size, 
        sortBy, 
        sortDirection,
        ...(searchTerm ? { searchTerm } : {}),
        ...(dentistHaveSub !== undefined ? { dentistHaveSub } : {})
      }
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Dentist>(`/api/v1/dentists/${id}`);
    return response.data;
  },

  getRoleStatistics: async () => {
    const response = await api.get<{ dentistAdminCount: number; dentistManagerCount: number }>('/api/v1/dentists/role-statistics');
    return response.data;
  }
};
