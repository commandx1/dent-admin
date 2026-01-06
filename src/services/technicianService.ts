import api from '@/lib/api';
import type { TechnicianResponse } from '@/components/technicians/types';

export const technicianService = {
  getAll: async (page = 0, size = 10) => {
    const response = await api.get<TechnicianResponse>(`/api/v1/technicians`, {
      params: { page, size }
    });
    return response.data;
  }
};

