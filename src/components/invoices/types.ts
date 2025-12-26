export interface Invoice {
  id: string;
  invoiceId: string;
  dentist: {
    name: string;
    clinic: string;
    avatar: string;
  };
  technician: {
    name: string;
    company: string;
    avatar: string;
  };
  grossAmount: number;
  payoutAmount: number; // 88%
  remainingAmount: number; // 12%
  status: 'Pending' | 'Completed' | 'Rejected';
  createdAt: string;
  createdTime: string;
}

