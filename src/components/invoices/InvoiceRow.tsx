import React from 'react';
import type { Invoice } from './types';
import { cn } from '@/lib/utils';
import { StatusBadge } from '../common/StatusBadge';

interface InvoiceRowProps {
  invoice: Invoice;
}

export const InvoiceRow: React.FC<InvoiceRowProps> = ({ invoice }) => {
  return (
    <tr className="border-b border-dark-border hover:bg-dark-elevated/30 transition-all">
      <td className="py-4 px-4">
        <span className="text-sm text-white font-mono">{invoice.invoiceId}</span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <img src={invoice.dentist.avatar} alt={invoice.dentist.name} className="w-8 h-8 rounded-full" />
          <div>
            <p className="text-sm text-white font-medium">{invoice.dentist.name}</p>
            <p className="text-xs text-gray-400">{invoice.dentist.clinic}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <img src={invoice.technician.avatar} alt={invoice.technician.name} className="w-8 h-8 rounded-full" />
          <div>
            <p className="text-sm text-white font-medium">{invoice.technician.name}</p>
            <p className="text-xs text-gray-400">{invoice.technician.company}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-white font-semibold">${invoice.grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-accent-success font-medium">${invoice.payoutAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-accent-warning font-medium">${invoice.remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </td>
      <td className="py-4 px-4">
        <StatusBadge 
          status={invoice.status}
          type={invoice.status === 'Completed' ? 'success' : invoice.status === 'Pending' ? 'warning' : 'danger'}
        />
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-gray-400">{invoice.createdAt}</span>
        <p className="text-xs text-gray-500">{invoice.createdTime}</p>
      </td>
    </tr>
  );
};

