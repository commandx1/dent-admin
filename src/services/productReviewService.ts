import api from '@/lib/api';
import type {
  ApproveProductReviewResponse,
  PendingProductReviewListResponse,
  ProductDetail,
  RejectProductReviewResponse,
} from '@/components/vendors/types';

export type ProductReviewSortBy = 'createdDate' | 'updatedDate';
export type SortDirection = 'ASC' | 'DESC';

export interface GetPendingProductReviewsParams {
  page?: number;
  size?: number;
  sortBy?: ProductReviewSortBy;
  sortDirection?: SortDirection;
}

export const productReviewService = {
  getPendingReviews: async (
    params: GetPendingProductReviewsParams = {},
  ): Promise<PendingProductReviewListResponse> => {
    const { page = 0, size = 10, sortBy = 'createdDate', sortDirection = 'DESC' } = params;

    const response = await api.get<PendingProductReviewListResponse>(
      '/api/v1/vendors/getPendingProductReviews',
      { params: { page, size, sortBy, sortDirection } },
    );
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
   * Fetches full product details from ecommerce-api (GET /api/products/{id}/admin).
   * Uses the admin-only variant since products pending review are not yet `active`,
   * and the regular GET /api/products/{id} only returns active products.
   * The endpoint requires an Admin/Vendor JWT (@PreAuthorize on the controller),
   * so this uses the shared `api` instance to attach the Authorization header via
   * its request interceptor. The URL is absolute, so axios ignores `api`'s own
   * baseURL (dt-admin-api) and hits ecommerce-api directly. `withCredentials` is
   * disabled for this call since ecommerce-api's CORS config uses allowedOrigins
   * "*" with allowCredentials(false), which rejects credentialed requests.
   */
  getProductDetail: async (productId: string): Promise<ProductDetail> => {
    const baseUrl = import.meta.env.VITE_ECOMMERCE_API_URL || '';
    const response = await api.get<ProductDetail>(`${baseUrl}/api/products/${productId}/admin`, {
      withCredentials: false,
    });
    return response.data;
  },
};
