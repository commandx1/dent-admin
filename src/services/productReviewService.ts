import api from '@/lib/api';
import type {
  ApproveProductReviewResponse,
  PendingProductDetailsResponse,
  PendingProductReviewListResponse,
  PendingProductVendorListResponse,
  RejectProductReviewResponse,
} from '@/components/vendors/types';

export type ProductReviewSortBy = 'createdDate' | 'updatedDate';
export type ProductVendorSortBy = 'pendingProductCount' | 'createdDate' | 'updatedDate';
export type SortDirection = 'ASC' | 'DESC';

export interface GetPendingProductReviewsParams {
  /** When provided, scopes the list to a single vendor's pending products. */
  userId?: string;
  page?: number;
  size?: number;
  sortBy?: ProductReviewSortBy;
  sortDirection?: SortDirection;
}

export interface GetPendingProductVendorsParams {
  page?: number;
  size?: number;
  sortBy?: ProductVendorSortBy;
  sortDirection?: SortDirection;
  searchTerm?: string;
}

export const productReviewService = {
  /** Vendors grouped with their pending-product counts, for the outer Product Reviews table. */
  getPendingVendors: async (
    params: GetPendingProductVendorsParams = {},
  ): Promise<PendingProductVendorListResponse> => {
    const { page = 0, size = 10, sortBy = 'pendingProductCount', sortDirection = 'DESC', searchTerm } = params;

    const response = await api.get<PendingProductVendorListResponse>(
      '/api/v1/vendors/getPendingProductVendors',
      { params: { page, size, sortBy, sortDirection, ...(searchTerm ? { searchTerm } : {}) } },
    );
    return response.data;
  },

  getPendingReviews: async (
    params: GetPendingProductReviewsParams = {},
  ): Promise<PendingProductReviewListResponse> => {
    const { userId, page = 0, size = 10, sortBy = 'createdDate', sortDirection = 'DESC' } = params;

    const url = userId
      ? `/api/v1/vendors/getPendingProductReviews/${userId}`
      : '/api/v1/vendors/getPendingProductReviews';

    const response = await api.get<PendingProductReviewListResponse>(url, {
      params: { page, size, sortBy, sortDirection },
    });
    return response.data;
  },

  approveProduct: async (productId: string): Promise<ApproveProductReviewResponse> => {
    const response = await api.post<ApproveProductReviewResponse>(
      '/api/v1/vendors/approveProduct',
      { productId },
    );
    return response.data;
  },

  rejectProduct: async (
    productId: string,
    rejectedReason: string,
  ): Promise<RejectProductReviewResponse> => {
    const response = await api.post<RejectProductReviewResponse>(
      '/api/v1/vendors/rejectProduct',
      { productId, rejectedReason },
    );
    return response.data;
  },

  /**
   * Fetches full product details from dt-admin-api's own `dentb2b` datasource
   * (GET /api/v1/vendors/getPendingProductDetails/{productId}/{userId}), which
   * works for products pending review even though they aren't `active` yet.
   * `userId` identifies the vendor's UserProduct listing for this product.
   */
  getProductDetail: async (
    productId: string,
    userId: string,
  ): Promise<PendingProductDetailsResponse> => {
    const response = await api.get<PendingProductDetailsResponse>(
      `/api/v1/vendors/getPendingProductDetails/${productId}/${userId}`,
    );
    return response.data;
  },
};
