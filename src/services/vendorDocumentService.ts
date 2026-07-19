import api from '@/lib/api';
import type {
  ApproveDocumentResponse,
  RejectDocumentResponse,
  VendorDocumentListResponse,
} from '@/components/vendors/types';

export type DocumentSortBy = 'createdDate' | 'updatedDate';
export type SortDirection = 'ASC' | 'DESC';

export interface GetVendorDocumentsParams {
  page?: number;
  size?: number;
  sortBy?: DocumentSortBy;
  sortDirection?: SortDirection;
  isDeleted?: boolean;
  approved?: boolean | null;
  revisionRequested?: boolean | null;
  searchTerm?: string;
}

export const vendorDocumentService = {
  getDocuments: async (params: GetVendorDocumentsParams = {}): Promise<VendorDocumentListResponse> => {
    const {
      page = 0,
      size = 10,
      sortBy = 'createdDate',
      sortDirection = 'DESC',
      isDeleted = false,
      approved = null,
      revisionRequested = null,
      searchTerm = '',
    } = params;

    const queryParams: Record<string, string | number | boolean> = {
      page,
      size,
      sortBy,
      sortDirection,
      isDeleted,
    };

    if (approved !== null) queryParams.approved = approved;
    if (revisionRequested !== null) queryParams.revisionRequested = revisionRequested;
    if (searchTerm) queryParams.searchTerm = searchTerm;

    const response = await api.get<VendorDocumentListResponse>(
      '/api/v1/vendors/getVendorDocuments',
      { params: queryParams },
    );
    return response.data;
  },

  downloadFile: async (
    id: string,
    fileType: 'original' | 'revised' | 'invalid',
  ): Promise<Blob> => {
    const response = await api.get<Blob>(
      `/api/v1/vendors/getDocumentFile/${id}`,
      { params: { fileType }, responseType: 'blob' },
    );
    return response.data;
  },

  rejectDocument: async (
    vendorDocumentId: string,
    requestedEdits: string,
  ): Promise<RejectDocumentResponse> => {
    const response = await api.post<RejectDocumentResponse>(
      '/api/v1/vendors/rejectVendorDocument',
      { vendorDocumentId, requestedEdits },
    );
    return response.data;
  },

  approveDocument: async (vendorDocumentId: string): Promise<ApproveDocumentResponse> => {
    const response = await api.post<ApproveDocumentResponse>(
      '/api/v1/vendors/approveVendorDocument',
      { vendorDocumentId },
    );
    return response.data;
  },

  extractFileName: (filePath: string): string => {
    const parts = filePath.split('/');
    const raw = parts[parts.length - 1] ?? filePath;
    const underscoreIdx = raw.indexOf('_');
    return underscoreIdx !== -1 ? raw.slice(underscoreIdx + 1) : raw;
  },
};
