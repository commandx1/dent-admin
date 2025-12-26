import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
} from 'lucide-react';
import { InvoiceRow } from './InvoiceRow';
import type { Invoice } from './types';
import { StatsCard } from '../common/StatsCard';
import { TablePagination } from '../common/TablePagination';
import { SortButton } from '../common/SortButton';

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceId: '#INV-2024-1247',
    dentist: {
      name: 'Dr. Sarah Mitchell',
      clinic: 'Smile Dental Clinic',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg'
    },
    technician: {
      name: 'John Smith',
      company: 'TechCare Solutions',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg'
    },
    grossAmount: 3450.00,
    payoutAmount: 3036.00,
    remainingAmount: 414.00,
    status: 'Pending',
    createdAt: 'Dec 8, 2024',
    createdTime: '2:30 PM'
  },
  {
    id: '2',
    invoiceId: '#INV-2024-1246',
    dentist: {
      name: 'Dr. Michael Chen',
      clinic: 'Advanced Dental Care',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg'
    },
    technician: {
      name: 'Robert Johnson',
      company: 'ProTech Services',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg'
    },
    grossAmount: 2890.00,
    payoutAmount: 2543.20,
    remainingAmount: 346.80,
    status: 'Pending',
    createdAt: 'Dec 8, 2024',
    createdTime: '11:15 AM'
  },
  {
    id: '3',
    invoiceId: '#INV-2024-1245',
    dentist: {
      name: 'Dr. Emily Rodriguez',
      clinic: 'Family Dental Group',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
    },
    technician: {
      name: 'David Martinez',
      company: 'Elite Dental Tech',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg'
    },
    grossAmount: 1240.00,
    payoutAmount: 1091.20,
    remainingAmount: 148.80,
    status: 'Completed',
    createdAt: 'Dec 7, 2024',
    createdTime: '4:45 PM'
  }
];

export const InvoiceManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <section id="invoice-stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Pending Invoices"
            value="45"
            description="Total: $38,450.00"
            icon={Clock}
            trend={{ value: '12.3%', isUp: true }}
            accentColor="warning"
            footer="Avg per invoice: $854.44"
          />
          <StatsCard 
            title="Completed Invoices"
            value="287"
            description="Total: $124,560.00"
            icon={CheckCircle2}
            trend={{ value: '18.7%', isUp: true }}
            accentColor="success"
            footer="Avg per invoice: $434.01"
          />
          <StatsCard 
            title="Rejected Invoices"
            value="10"
            description="Total: $8,920.00"
            icon={XCircle}
            trend={{ value: '5.2%', isUp: false, color: 'danger' }}
            accentColor="danger"
            footer="Avg per invoice: $892.00"
          />
        </div>
      </section>

      {/* Table Section */}
      <section id="invoice-table">
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-elevated border-b border-dark-border">
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Invoice ID" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Dentist" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Technician" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Gross Amount" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <span className="text-sm font-semibold text-gray-300">Payout (88%)</span>
                  </th>
                  <th className="py-4 px-4 text-left">
                    <span className="text-sm font-semibold text-gray-300">Remaining (12%)</span>
                  </th>
                  <th className="py-4 px-4 text-left">
                    <span className="text-sm font-semibold text-gray-300">Status</span>
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Created" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {mockInvoices.map((invoice) => (
                  <InvoiceRow key={invoice.id} invoice={invoice} />
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={35}
            totalItems={342}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemName="invoices"
          />
        </div>
      </section>
    </div>
  );
};

