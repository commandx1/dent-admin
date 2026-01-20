import { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
} from 'lucide-react';
import { InvoiceRow } from './InvoiceRow';
import type { Invoice, InvoiceStatistics } from './types';
import { StatsCard } from '../common/StatsCard';
import { TablePagination } from '../common/TablePagination';
import { SortButton } from '../common/SortButton';
import { invoiceService } from '@/services/invoiceService';
import { useAppStore } from '@/store/useAppStore';
import { formatCurrency } from '@/lib/utils'

const InvoiceRowSkeleton = () => (
  <tr className='border-b border-dark-border animate-pulse'>
    <td className='py-4 px-4'><div className='h-4 w-24 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-32 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-32 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-20 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-12 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-16 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-16 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-16 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-16 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-6 w-20 bg-slate-200 rounded-full' /></td>
    <td className='py-4 px-4'><div className='h-4 w-24 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-20 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-20 bg-slate-200 rounded' /></td>
  </tr>
)

export const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statistics, setStatistics] = useState<InvoiceStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  const { searchQuery } = useAppStore();

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await invoiceService.getAll(currentPage - 1, itemsPerPage, sortBy, sortDirection, searchQuery);
      setInvoices(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, sortBy, sortDirection, searchQuery]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortDirection('ASC');
    }
    setCurrentPage(1);
  };

  const fetchStatistics = useCallback(async () => {
    try {
      const data = await invoiceService.getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvoices();
    }, 500); // Add debounce like in technicians
    return () => clearTimeout(timer);
  }, [fetchInvoices]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <section id="invoice-stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Pending Invoices"
            value={statistics?.pendingCount || 0}
            description={`Total: ${formatCurrency(statistics?.pendingTotalAmount || 0)}`}
            icon={Clock}
            accentColor="warning"
            footer={statistics ? `Avg: ${formatCurrency((statistics.pendingTotalAmount || 0) / (statistics.pendingCount || 1))}` : ""}
          />
          <StatsCard 
            title="Completed Invoices"
            value={statistics?.approvedCount || 0}
            description={`Total: ${formatCurrency(statistics?.approvedTotalAmount || 0)}`}
            icon={CheckCircle2}
            accentColor="success"
            footer={statistics ? `Avg: $${((statistics.approvedTotalAmount || 0) / (statistics.approvedCount || 1)).toFixed(2)}` : ""}
          />
          <StatsCard 
            title="Rejected Invoices"
            value={statistics?.rejectedCount || 0}
            description={`Total: ${formatCurrency(statistics?.rejectedTotalAmount || 0)}`}
            icon={XCircle}
            accentColor="danger"
            footer={statistics ? `Avg: $${((statistics.rejectedTotalAmount || 0) / (statistics.rejectedCount || 1)).toFixed(2)}` : ""}
          />
        </div>
      </section>

      {/* Table Section */}
      <section id="invoice-table">
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className='truncate'>
                <tr className="bg-dark-elevated border-b border-dark-border">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-slate-700">
                    Invoice ID
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-slate-700">
                    Dentist
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-slate-700">
                    Technician
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-slate-700">
                    Type
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton 
                      label="Duration (Min)" 
                      isActive={sortBy === 'duration_minutes'} 
                      direction={sortBy === 'duration_minutes' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                      onClick={() => handleSort('duration_minutes')}
                    />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton 
                      label="Service Fee" 
                      isActive={sortBy === 'service_fee'} 
                      direction={sortBy === 'service_fee' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                      onClick={() => handleSort('service_fee')}
                    />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton 
                      label="Gross Amount" 
                      isActive={sortBy === 'total_amount'} 
                      direction={sortBy === 'total_amount' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                      onClick={() => handleSort('total_amount')}
                    />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton 
                      label="Payout" 
                      isActive={sortBy === 'transferred_amount'} 
                      direction={sortBy === 'transferred_amount' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                      onClick={() => handleSort('transferred_amount')}
                    />
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-slate-700">
                    Remaining
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-slate-700">
                    Rejected Reason
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-slate-700">
                    Created
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton 
                      label="Updated At" 
                      isActive={sortBy === 'updated_at'} 
                      direction={sortBy === 'updated_at' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                      onClick={() => handleSort('updated_at')}
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {isLoading ? (
                  [...Array(itemsPerPage)].map((_, i) => <InvoiceRowSkeleton key={i} />)
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-10 text-center text-slate-500">
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <InvoiceRow key={invoice.id} invoice={invoice} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalElements}
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
