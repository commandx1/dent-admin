import {
  Store,
  Box,
  ShoppingCart,
  AlertTriangle,
  ArrowUp,
  Link as LinkIcon,
  Import,
  Download,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorRow } from './VendorRow'
import type { Vendor } from './types'
import { StatsCard } from '../common/StatsCard'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'
import { useState } from 'react'

const vendorsData: Vendor[] = [
  {
    id: '1',
    name: 'DentalSupply Co.',
    vendorId: 'VEN-1001',
    contactPerson: 'Michael Anderson',
    email: 'm.anderson@dentalsupply.com',
    phone: '+1 (555) 123-4567',
    totalProducts: 247,
    activeProducts: 234,
    soldCount: 1847,
    memberSince: 'Jan 15, 2023',
    status: 'Approved'
  },
  {
    id: '2',
    name: 'ProDental Supplies',
    vendorId: 'VEN-1002',
    contactPerson: 'Sarah Martinez',
    email: 'sarah.m@prodental.com',
    phone: '+1 (555) 234-5678',
    totalProducts: 189,
    activeProducts: 176,
    soldCount: 1523,
    memberSince: 'Mar 22, 2023',
    status: 'Approved'
  },
  {
    id: '3',
    name: 'Elite Dental Tech',
    vendorId: 'VEN-1003',
    contactPerson: 'James Wilson',
    email: 'j.wilson@elitedental.com',
    phone: '+1 (555) 345-6789',
    totalProducts: 156,
    activeProducts: 142,
    soldCount: 987,
    memberSince: 'May 8, 2023',
    status: 'Pending'
  },
  {
    id: '4',
    name: 'MediDental Supply',
    vendorId: 'VEN-1004',
    contactPerson: 'Emily Rodriguez',
    email: 'e.rodriguez@medidental.com',
    phone: '+1 (555) 456-7890',
    totalProducts: 203,
    activeProducts: 198,
    soldCount: 1342,
    memberSince: 'Jul 12, 2023',
    status: 'Approved'
  }
]

export const VendorManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <div className='space-y-8'>
      {/* Stats Cards */}
      <section id='vendor-stats'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <StatsCard 
            title="Total Vendors"
            value="89"
            description="67 approved, 15 pending, 7 rejected"
            icon={Store}
            trend={{ value: '15.8%', isUp: true }}
            accentColor="warning"
          />
          <StatsCard 
            title="Total Products"
            value="1,456"
            description="1,289 active, 167 inactive"
            icon={Box}
            trend={{ value: '22.4%', isUp: true }}
            accentColor="primary"
          />
          <StatsCard 
            title="Total Sales"
            value="8,942"
            description="This month: 1,247 orders"
            icon={ShoppingCart}
            trend={{ value: '18.7%', isUp: true }}
            accentColor="success"
          />
          <StatsCard 
            title="Low Stock Alert"
            value="23"
            description="Products below threshold"
            icon={AlertTriangle}
            trend={{ value: '5 items', isUp: true, color: 'danger' }}
            accentColor="danger"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section id='vendor-actions'>
        <div className='bg-dark-surface border border-dark-border rounded-xl p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-white'>Quick Actions</h3>
              <p className='text-sm text-gray-400 mt-1'>Manage vendors and products efficiently</p>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <button className='bg-linear-to-br from-accent-primary to-accent-primary/80 hover:from-accent-primary/90 hover:to-accent-primary/70 text-white rounded-lg p-4 flex items-center gap-3 transition-all group'>
              <div className='w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center'>
                <LinkIcon className='h-6 w-6' />
              </div>
              <div className='text-left'>
                <p className='font-semibold'>Create Signup Link</p>
                <p className='text-xs opacity-90'>Generate vendor registration</p>
              </div>
            </button>
            <button className='bg-dark-elevated hover:bg-dark-border border border-dark-border text-white rounded-lg p-4 flex items-center gap-3 transition-all'>
              <div className='w-12 h-12 bg-accent-secondary/20 rounded-lg flex items-center justify-center'>
                <Import className='text-accent-secondary h-6 w-6' />
              </div>
              <div className='text-left'>
                <p className='font-semibold'>Import Products</p>
                <p className='text-xs text-gray-400'>Upload Excel/CSV</p>
              </div>
            </button>
            <button className='bg-dark-elevated hover:bg-dark-border border border-dark-border text-white rounded-lg p-4 flex items-center gap-3 transition-all'>
              <div className='w-12 h-12 bg-accent-success/20 rounded-lg flex items-center justify-center'>
                <Download className='text-accent-success h-6 w-6' />
              </div>
              <div className='text-left'>
                <p className='font-semibold'>Export Data</p>
                <p className='text-xs text-gray-400'>Download vendor list</p>
              </div>
            </button>
            <button className='bg-dark-elevated hover:bg-dark-border border border-dark-border text-white rounded-lg p-4 flex items-center gap-3 transition-all'>
              <div className='w-12 h-12 bg-accent-warning/20 rounded-lg flex items-center justify-center'>
                <Eye className='text-accent-warning h-6 w-6' />
              </div>
              <div className='text-left'>
                <p className='font-semibold'>Impersonate Vendor</p>
                <p className='text-xs text-gray-400'>View as vendor</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Vendor List */}
      <section id='vendor-list'>
        <div className='bg-dark-surface border border-dark-border rounded-xl overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-dark-elevated border-b border-dark-border'>
                  <th className='py-4 px-4 text-left'>
                    <SortButton label="Vendor Name" isActive />
                  </th>
                  <th className='py-4 px-4 text-left'>
                    <span className='text-sm font-semibold text-gray-300'>Contact Person</span>
                  </th>
                  <th className='py-4 px-4 text-left'>
                    <span className='text-sm font-semibold text-gray-300'>Email</span>
                  </th>
                  <th className='py-4 px-4 text-left'>
                    <span className='text-sm font-semibold text-gray-300'>Phone</span>
                  </th>
                  <th className='py-4 px-4 text-left'>
                    <SortButton label="Total Products" />
                  </th>
                  <th className='py-4 px-4 text-left'>
                    <span className='text-sm font-semibold text-gray-300'>Active Products</span>
                  </th>
                  <th className='py-4 px-4 text-left'>
                    <SortButton label="Sold Count" />
                  </th>
                  <th className='py-4 px-4 text-left'>
                    <span className='text-sm font-semibold text-gray-300'>Member Since</span>
                  </th>
                  <th className='py-4 px-4 text-left'>
                    <span className='text-sm font-semibold text-gray-300'>Status</span>
                  </th>
                  <th className='py-4 px-4 text-left'>
                    <span className='text-sm font-semibold text-gray-300'>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-dark-border'>
                {vendorsData.map(vendor => (
                  <VendorRow key={vendor.id} vendor={vendor} />
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={12}
            totalItems={89}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemName="vendors"
          />
        </div>
      </section>
    </div>
  )
}
