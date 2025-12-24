import { cn } from '@/lib/utils'

interface Invoice {
  id: string
  dentist: string
  technician: string
  amount: string
  status: 'Completed' | 'Pending' | 'Rejected'
  date: string
}

const invoices: Invoice[] = [
  { id: '#INV-2024-1247', dentist: 'Dr. Sarah Mitchell', technician: 'John Smith', amount: '$3,450', status: 'Completed', date: 'Dec 8, 2024' },
  { id: '#INV-2024-1246', dentist: 'Dr. Michael Chen', technician: 'Robert Johnson', amount: '$2,890', status: 'Pending', date: 'Dec 8, 2024' },
  { id: '#INV-2024-1245', dentist: 'Dr. Emily Rodriguez', technician: 'David Martinez', amount: '$4,120', status: 'Completed', date: 'Dec 7, 2024' },
  { id: '#INV-2024-1244', dentist: 'Dr. James Wilson', technician: 'Christopher Lee', amount: '$1,560', status: 'Rejected', date: 'Dec 7, 2024' },
]

export const InvoiceTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Invoice ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Dentist</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Technician</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-dark-elevated hover:bg-dark-elevated transition-all">
              <td className="py-3 px-4 text-sm text-white font-mono">{invoice.id}</td>
              <td className="py-3 px-4 text-sm text-gray-300">{invoice.dentist}</td>
              <td className="py-3 px-4 text-sm text-gray-300">{invoice.technician}</td>
              <td className="py-3 px-4 text-sm text-white font-semibold">{invoice.amount}</td>
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
              <td className="py-3 px-4 text-sm text-gray-400">{invoice.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
