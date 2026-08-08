import api from '@/lib/api';
import type {
  ApproveProductReviewResponse,
  PendingProductDetailsResponse,
  PendingProductReviewListResponse,
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
