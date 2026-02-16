import api from '@/lib/api';
import type { TechnicianResponse, TechnicianStatistics } from '@/components/technicians/types';

export const technicianService = {
  getAll: async (page = 0, size = 10, sortBy = 'companyName', sortDirection = 'ASC', searchTerm = '', companyTypeCorporate?: number) => {
    const response = await api.get<TechnicianResponse>(`/api/v1/technicians`, {
      params: { 
        page, 
        size, 
        sortBy, 
        sortDirection,
        ...(searchTerm ? { searchTerm } : {}),
        ...(companyTypeCorporate !== undefined ? { companyTypeCorporate } : {})
      }
    });
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get<TechnicianStatistics>(`/api/v1/technicians/statistics`);
    return response.data;
  },

  getProfilePhoto: async (userId: string) => {
    const response = await api.get(`/api/v1/dentists/${userId}/profile-photo`, {
      responseType: 'blob'
    });
    return response.data;
  },

  updateCompanyStatus: async (companyId: string, isActive: boolean) => {
    const response = await api.patch(`/api/v1/technicians/companies/${companyId}/status`, null, {
      params: { isActive: isActive ? 1 : 0 }
    });
    return response.data;
  },

  updateTechnicianStatus: async (userId: string, status: string) => {
    const response = await api.patch(`/api/v1/technicians/users/${userId}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/api/v1/technicians/users/${userId}/delete`);
    return response.data;
  }
};

