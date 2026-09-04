import api from '@/lib/api';
import type {
  LateShipmentCompanyListResponse,
  LateShipmentOrderItemListResponse,
} from '@/components/vendors/types';

export type LateShipmentOrderItemSortBy = 'createdDate' | 'delayTime';
export type SortDirection = 'ASC' | 'DESC';

export interface GetLateShipmentCompaniesParams {
  /** Look-back window in days. `null`/omitted means all time. */
  day?: number | null;
  page?: number;
  size?: number;
  sortDirection?: SortDirection;
}

export interface GetLateShipmentOrderItemsParams {
  companyId: string;
  day?: number | null;
  page?: number;
  size?: number;
  sortBy?: LateShipmentOrderItemSortBy;
  sortDirection?: SortDirection;
  notShippedOnly?: boolean;
}

export const lateShipmentService = {
  getCompanies: async (
    params: GetLateShipmentCompaniesParams = {},
  ): Promise<LateShipmentCompanyListResponse> => {
    const { day, page = 0, size = 10, sortDirection = 'DESC' } = params;

    const response = await api.get<LateShipmentCompanyListResponse>(
      '/api/v1/vendors/getLateShipmentCompanies',
      { params: { page, size, sortDirection, ...(day != null ? { day } : {}) } },
    );
    return response.data;
  },

  getOrderItems: async (
    params: GetLateShipmentOrderItemsParams,
  ): Promise<LateShipmentOrderItemListResponse> => {
    const {
      companyId,
      day,
      page = 0,
      size = 10,
      sortBy = 'createdDate',
      sortDirection = 'DESC',
      notShippedOnly = false,
    } = params;

    const response = await api.get<LateShipmentOrderItemListResponse>(
      `/api/v1/vendors/getLateShipmentOrderItems/${companyId}`,
      { params: { page, size, sortBy, sortDirection, notShippedOnly, ...(day != null ? { day } : {}) } },
    );
    return response.data;
  },
};
