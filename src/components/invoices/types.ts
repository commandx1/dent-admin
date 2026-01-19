export interface Invoice {
  id: string;
  invoiceId: string;
  dentist: {
    userId?: string;
    name: string;
    clinic: string;
    avatar: string;
  };
  technician: {
    userId?: string;
    name: string;
    company: string;
    avatar: string;
  };
  grossAmount: number;
  payoutAmount: number; // 88%
  remainingAmount: number; // 12%
  serviceFee: number;
  durationMinutes: number;
  status: 'Pending' | 'Completed' | 'Rejected';
  invoiceType: string;
  rejectedReason: string;
  createdAt: string;
  createdTime: string;
  updatedAt: string;
  updatedTime: string;
}

export interface InvoiceAPIItem {
  invoiceId: string;
  invoiceNumber: string;
  issuerUserId?: string;
  recipientUserId?: string;
  serviceProviderId?: string;
  serviceRecipientId?: string;
  issuerName: string;
  issuerFirstNameLastName: string;
  recipientName: string;
  invoiceType: string;
  invoiceStatus: string;
  durationMinutes: number;
  serviceFee: number;
  totalAmount: number;
  description: string;
  rejectedReason: string;
  updatedAt: string;
  serviceProviderName: string;
  serviceProviderSurname: string;
  transferredAmount: number;
}

export interface InvoiceStatistics {
  pendingCount: number;
  pendingTotalAmount: number;
  approvedCount: number;
  approvedTotalAmount: number;
  rejectedCount: number;
  rejectedTotalAmount: number;
  totalCount: number;
  grandTotalAmount: number;
  daysPeriod: number;
}

