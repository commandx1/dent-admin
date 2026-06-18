import api from '@/lib/api';
import type { VendorStatistics, VendorListResponse, VendorProductResponse } from '@/components/vendors/types';

export const vendorService = {
  getStatistics: async () => {
    const response = await api.get<VendorStatistics>('/api/v1/vendors/statistics');
    return response.data;
  },

  getAll: async (page = 0, size = 10, sortBy = 'createddate', sortDirection = 'DESC', searchTerm = '') => {
    const response = await api.get<VendorListResponse>('/api/v1/vendors/getAllVendor', {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
        ...(searchTerm ? { searchTerm } : {}),
      },
    });
    return response.data;
  },

  export: async (sortBy = 'createddate', sortDirection = 'DESC', searchTerm = '') => {
    const response = await api.get('/api/v1/vendors/export', {
      params: {
        sortBy,
        sortDirection,
        ...(searchTerm ? { searchTerm } : {}),
      },
      responseType: 'blob',
    });
    return response.data;
  },

  createSignupLink: async (email: string) => {
    const response = await api.post<{
      email: string;
      signupLink: string;
      message: string;
      userAlreadyExists: boolean;
    }>('/api/v1/vendors/create-signup-link', { email });
    return response.data;
  },

  getVendorProducts: async (vendorId: string, page = 0, size = 10, sortBy = 'sellcount', sortDirection = 'DESC') => {
    const response = await api.get<VendorProductResponse>(`/api/v1/vendors/getVendorProducts/${vendorId}`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
      },
    });
    return response.data;
  },

  importProducts: async (email: string, file: File) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file);
    const response = await api.post('/api/import-xlsx', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: false
    });
    return response.data;
  },

  exportVendorProducts: async (vendorId: string, sortBy = 'oldprice', sortDirection = 'DESC', searchTerm = '') => {
    const response = await api.get(`/api/v1/vendors/exportVendorProducts/${vendorId}`, {
      params: {
        sortBy,
        sortDirection,
        ...(searchTerm ? { searchTerm } : {}),
      },
      responseType: 'blob',
    });
    return response.data;
  },
};
