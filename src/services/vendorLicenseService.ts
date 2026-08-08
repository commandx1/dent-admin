import api from '@/lib/api';
import type {
  ApproveVendorLicenseResponse,
  RejectVendorLicenseResponse,
  VendorLicenseListResponse,
} from '@/components/vendors/types';

export type VendorLicenseSortBy = 'createdDate' | 'updatedDate';
export type SortDirection = 'ASC' | 'DESC';

export interface GetVendorLicensesParams {
  page?: number;
  size?: number;
  sortBy?: VendorLicenseSortBy;
  sortDirection?: SortDirection;
  searchTerm?: string;
}

export const vendorLicenseService = {
  getVendorLicenses: async (params: GetVendorLicensesParams = {}): Promise<VendorLicenseListResponse> => {
    const {
      page = 0,
      size = 10,
      sortBy = 'createdDate',
      sortDirection = 'DESC',
      searchTerm = '',
    } = params;

    const queryParams: Record<string, string | number> = {
      page,
      size,
      sortBy,
      sortDirection,
    };

    if (searchTerm) queryParams.searchTerm = searchTerm;

    const response = await api.get<VendorLicenseListResponse>(
      '/api/v1/vendors/getVendorLicenses',
      { params: queryParams },
    );
    return response.data;
  },

  approveVendorLicense: async (licenseId: string): Promise<ApproveVendorLicenseResponse> => {
    const response = await api.post<ApproveVendorLicenseResponse>(
      '/api/v1/vendors/approveVendorLicense',
      { licenseId },
    );
    return response.data;
  },

  rejectVendorLicense: async (
    licenseId: string,
    rejectDescription: string,
  ): Promise<RejectVendorLicenseResponse> => {
    const response = await api.post<RejectVendorLicenseResponse>(
      '/api/v1/vendors/rejectVendorLicense',
      { licenseId, rejectDescription },
    );
    return response.data;
  },
};
