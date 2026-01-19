import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { invoiceService } from '@/services/invoiceService'
import type { Invoice } from '../invoices/types'
import { formatCurrency } from '@/lib/utils'

export const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true)
        const response = await invoiceService.getAll(0, 4, 'updated_at', 'DESC')
        setInvoices(response.content)
      } catch (error) {
        console.error('Failed to fetch dashboard invoices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Invoice ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Dentist</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Technician</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, i) => (
              <tr key={i} className="border-b border-dark-elevated animate-pulse">
                <td className="py-3 px-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                <td className="py-3 px-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                <td className="py-3 px-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                <td className="py-3 px-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                <td className="py-3 px-4"><div className="h-6 w-20 bg-slate-200 rounded-full" /></td>
                <td className="py-3 px-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Invoice ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Dentist</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Technician</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-slate-500">
                No invoices found.
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-dark-elevated hover:bg-dark-elevated transition-all">
                <td className="py-3 px-4 text-sm text-slate-800 font-mono">{invoice.invoiceId}</td>
                <td className="py-3 px-4 text-sm text-slate-700">{invoice.dentist.name}</td>
                <td className="py-3 px-4 text-sm text-slate-700">{invoice.technician.name}</td>
                <td className="py-3 px-4 text-sm text-slate-800 font-semibold">{formatCurrency(invoice.grossAmount)}</td>
                <td className="py-3 px-4">
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full",
                    invoice.status === 'Completed' && "bg-accent-success/20 text-accent-success",
                    invoice.status === 'Pending' && "bg-accent-warning/20 text-accent-warning",
                    invoice.status === 'Rejected' && "bg-accent-danger/20 text-accent-danger",
                  )}>
                    {invoice.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-slate-500">{invoice.createdAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
