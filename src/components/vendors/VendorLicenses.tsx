import React, { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, XCircle, FileBadge2, Search } from 'lucide-react'
import {
  vendorLicenseService,
  type VendorLicenseSortBy,
  type SortDirection,
} from '@/services/vendorLicenseService'
import type { VendorLicense } from './types'
import { RejectLicenseModal } from './RejectLicenseModal'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'
import { useAppStore } from '@/store/useAppStore'
import { toast } from 'sonner'

const LICENSE_TYPE_LABELS: Record<VendorLicense['licenseType'], string> = {
  DEA: 'DEA',
  STATE_DENTAL: 'State Dental',
}

function isExpired(license: VendorLicense): boolean {
  const expiration = new Date(license.year, license.month - 1, license.day)
  return expiration.getTime() < Date.now()
}

const LicenseRowSkeleton = () => (
  <tr className="animate-pulse border-b border-dark-border">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded" style={{ width: `${60 + (i % 3) * 20}%` }} />
      </td>
    ))}
  </tr>
)

export const VendorLicenses: React.FC = () => {
  const [licenses, setLicenses] = useState<VendorLicense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState<VendorLicenseSortBy>('createdDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
  const [localSearch, setLocalSearch] = useState('')
  const [rejectModal, setRejectModal] = useState<{ licenseId: string; vendorName: string } | null>(null)
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set())

  const { searchQuery } = useAppStore()
  const effectiveSearch = localSearch || searchQuery

  const fetchLicenses = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await vendorLicenseService.getVendorLicenses({
        page: currentPage,
        size: itemsPerPage,
        sortBy,
        sortDirection,
        ...(effectiveSearch ? { searchTerm: effectiveSearch } : {}),
      })
      setLicenses(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch vendor licenses:', error)
      toast.error('Failed to load vendor licenses')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, itemsPerPage, sortBy, sortDirection, effectiveSearch])

  useEffect(() => {
    setCurrentPage(0)
  }, [effectiveSearch])

  useEffect(() => {
    const timer = setTimeout(() => { void fetchLicenses() }, 300)
    return () => clearTimeout(timer)
  }, [fetchLicenses])

  const handleSort = (field: VendorLicenseSortBy) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    } else {
      setSortBy(field)
      setSortDirection('ASC')
    }
    setCurrentPage(0)
  }

  const handleApprove = async (license: VendorLicense) => {
    setApprovingIds((prev) => new Set(prev).add(license.id))
    try {
      const result = await vendorLicenseService.approveVendorLicense(license.id)
      if (result.success) {
        toast.success('License approved successfully')
      } else {
        toast.error(result.message)
      }
      void fetchLicenses()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to approve license')
    } finally {
      setApprovingIds((prev) => { const next = new Set(prev); next.delete(license.id); return next })
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const formatExpiration = (license: VendorLicense) =>
    new Date(license.year, license.month - 1, license.day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by vendor name..."
            value={localSearch}
            onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(0) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-dark-elevated border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-elevated">
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Vendor</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">License</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Expires</th>
                <th className="py-3 px-4 text-left">
                  <SortButton
                    label="Submitted"
                    onClick={() => handleSort('createdDate')}
                    isActive={sortBy === 'createdDate'}
                    direction={sortDirection.toLowerCase() as 'asc' | 'desc'}
                  />
                </th>
                <th className="py-3 px-4 text-left">
                  <SortButton
                    label="Updated"
                    onClick={() => handleSort('updatedDate')}
                    isActive={sortBy === 'updatedDate'}
                    direction={sortDirection.toLowerCase() as 'asc' | 'desc'}
                  />
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: itemsPerPage > 5 ? 5 : itemsPerPage }).map((_, i) => (
                  <LicenseRowSkeleton key={i} />
                ))
              ) : licenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <FileBadge2 className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                    <p className="font-medium">No pending licenses</p>
                    <p className="text-sm text-slate-400 mt-1">Try adjusting your search or check back later</p>
                  </td>
                </tr>
              ) : (
                licenses.map((license) => (
                  <tr key={license.id} className="border-b border-dark-border hover:bg-dark-elevated/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-slate-800">{license.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{license.ownerId.slice(0, 8)}…</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-700">
                        {LICENSE_TYPE_LABELS[license.licenseType]}
                        {license.stateOfLicense ? ` · ${license.stateOfLicense}` : ''}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">#{license.licenseNumber}</p>
                    </td>

                    <td className="py-3 px-4 text-xs whitespace-nowrap">
                      <span className={isExpired(license) ? 'font-semibold text-accent-danger' : 'text-slate-500'}>
                        {formatExpiration(license)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(license.createdDate)}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(license.updatedDate)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          disabled={approvingIds.has(license.id)}
                          onClick={() => handleApprove(license)}
                          className="flex items-center gap-1 rounded-lg bg-accent-success/10 hover:bg-accent-success/20 text-accent-success px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          {approvingIds.has(license.id) ? (
                            <div className="w-3 h-3 border-2 border-accent-success border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle2 size={12} />
                          )}
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectModal({ licenseId: license.id, vendorName: license.name })}
                          className="flex items-center gap-1 rounded-lg bg-accent-danger/10 hover:bg-accent-danger/20 text-accent-danger px-2.5 py-1.5 text-xs font-semibold transition-colors"
                        >
                          <XCircle size={12} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          totalItems={totalElements}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page - 1)}
          onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(0) }}
          itemName="licenses"
        />
      </div>

      {rejectModal && (
        <RejectLicenseModal
          licenseId={rejectModal.licenseId}
          vendorName={rejectModal.vendorName}
          onClose={() => setRejectModal(null)}
          onSuccess={() => {
            setRejectModal(null)
            void fetchLicenses()
          }}
        />
      )}
    </div>
  )
}
