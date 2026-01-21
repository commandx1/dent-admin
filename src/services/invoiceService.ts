import api from '@/lib/api';
import type { Invoice, InvoiceAPIItem, InvoiceStatistics } from '@/components/invoices/types';

interface InvoiceListResponse {
  content: InvoiceAPIItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const mapAPIItemToInvoice = (item: InvoiceAPIItem): Invoice => {
  const date = new Date(item.updatedAt);
  const statusMap: Record<string, 'Pending' | 'Completed' | 'Rejected'> = {
    'APPROVED': 'Completed',
    'PENDING': 'Pending',
    'REJECTED': 'Rejected',
  };

  const nyDateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  const nyTimeOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  return {
    id: item.invoiceId,
    invoiceId: item.invoiceNumber,
    dentist: {
      userId: item.serviceRecipientId || item.recipientUserId,
      name: item.recipientName,
      clinic: '', 
      avatar: '',
    },
    technician: {
      userId: item.serviceProviderId || item.issuerUserId,
      name: item.issuerFirstNameLastName,
      company: item.issuerName,
      avatar: '',
    },
    grossAmount: item.totalAmount,
    payoutAmount: item.transferredAmount,
    remainingAmount: item.totalAmount - item.transferredAmount,
    serviceFee: item.serviceFee,
    durationMinutes: item.durationMinutes,
    status: statusMap[item.invoiceStatus] || 'Pending',
    invoiceType: item.invoiceType,
    rejectedReason: item.rejectedReason,
    createdAt: date.toLocaleDateString('en-US', nyDateOptions),
    createdTime: date.toLocaleTimeString('en-US', nyTimeOptions),
    updatedAt: date.toLocaleDateString('en-US', nyDateOptions),
    updatedTime: date.toLocaleTimeString('en-US', nyTimeOptions),
  };
};

export const invoiceService = {
  getAll: async (page = 0, size = 10, sortBy = 'total_amount', sortDirection = 'DESC', searchTerm = '') => {
    const response = await api.get<InvoiceListResponse>('/api/v1/invoices', {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
        ...(searchTerm ? { searchTerm } : {}),
      },
    });
    
    return {
      ...response.data,
      content: response.data.content.map(mapAPIItemToInvoice),
    };
  },

  getStatistics: async (days = 30) => {
    const response = await api.get<InvoiceStatistics>('/api/v1/invoices/statistics', {
      params: { days }
    });
    return response.data;
  },
};
