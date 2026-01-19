import type { Invoice } from './types'
import { StatusBadge } from '../common/StatusBadge'
import { formatCurrency } from '@/lib/utils'

interface InvoiceRowProps {
  invoice: Invoice
}

export const InvoiceRow: React.FC<InvoiceRowProps> = ({ invoice }) => {
  return (
    <tr className='border-b truncate border-dark-border hover:bg-dark-elevated/30 transition-all'>
      <td className='py-4 px-4'>
        <span className='text-sm text-slate-800 font-mono'>{invoice.invoiceId}</span>
      </td>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full bg-dark-elevated flex items-center justify-center border border-dark-border'>
            <span className='text-[10px] text-slate-400 font-bold'>
              {invoice.dentist.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <p className='text-sm text-slate-800 font-medium'>{invoice.dentist.name}</p>
            {invoice.dentist.clinic && <p className='text-xs text-slate-500'>{invoice.dentist.clinic}</p>}
          </div>
        </div>
      </td>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full bg-dark-elevated flex items-center justify-center border border-dark-border'>
            <span className='text-[10px] text-slate-400 font-bold'>
              {invoice.technician.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <p className='text-sm text-slate-800 font-medium'>{invoice.technician.name}</p>
            <p className='text-xs text-slate-500'>{invoice.technician.company}</p>
          </div>
        </div>
      </td>
      <td className='py-4 px-4'>
        <span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-dark-elevated text-slate-500 border border-dark-border'>
          {invoice.invoiceType.replace('_', ' ')}
        </span>
      </td>
      <td className='py-4 px-4 text-sm text-slate-800 font-medium'>
        {invoice.durationMinutes} min
      </td>
      <td className='py-4 px-4 text-sm text-slate-800 font-medium'>
        {formatCurrency(invoice.serviceFee)}
      </td>
      <td className='py-4 px-4'>
        <span className='text-sm text-slate-800 font-semibold'>
          {formatCurrency(invoice.grossAmount)}
        </span>
      </td>
      <td className='py-4 px-4'>
        <span className='text-sm text-accent-success font-medium'>
          {formatCurrency(invoice.payoutAmount)}
        </span>
      </td>
      <td className='py-4 px-4'>
        <span className='text-sm text-accent-warning font-medium'>
          {formatCurrency(invoice.remainingAmount)}
        </span>
      </td>
      <td className='py-4 px-4'>
        <StatusBadge
          status={invoice.status}
          type={invoice.status === 'Completed' ? 'success' : invoice.status === 'Pending' ? 'warning' : 'danger'}
        />
      </td>
      <td className='py-4 px-4'>
        <span className='text-xs text-accent-danger max-w-[150px] truncate block' title={invoice.rejectedReason}>
          {invoice.rejectedReason || '-'}
        </span>
      </td>
      <td className='py-4 px-4 truncate'>
        <span className='text-sm text-slate-500'>{invoice.createdAt}</span>
        <p className='text-xs text-slate-500'>{invoice.createdTime}</p>
      </td>
      <td className='py-4 px-4 truncate'>
        <span className='text-sm text-slate-500'>{invoice.updatedAt}</span>
        <p className='text-xs text-slate-500'>{invoice.updatedTime}</p>
      </td>
    </tr>
  )
}
