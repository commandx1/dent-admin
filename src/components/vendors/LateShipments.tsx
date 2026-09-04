import React, { useState, useEffect, useCallback } from 'react'
import { Store, Package, PackageX, ChevronRight, ChevronDown } from 'lucide-react'
import {
  lateShipmentService,
  type LateShipmentOrderItemSortBy,
  type SortDirection,
} from '@/services/lateShipmentService'
import type { LateShipmentCompany, LateShipmentOrderItem } from './types'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'
import { toast } from 'sonner'
import { getImageUrl, cn, formatCurrency } from '@/lib/utils'

const formatDateTime = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '—'

const formatDelay = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes <= 0) return '—'
  if (minutes >= 1440) {
    const d = Math.floor(minutes / 1440)
    const h = Math.floor((minutes % 1440) / 60)
    return `${d}d ${h}h`
  }
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }
  return `${minutes}m`
}

const delayToneClass = (minutes: number): string => {
  if (minutes > 4320) return 'bg-accent-danger/20 text-accent-danger font-bold'
  if (minutes >= 1440) return 'bg-accent-danger/10 text-accent-danger'
  return 'bg-accent-warning/10 text-accent-warning'
}

const LOWERCASE_WORDS = ['for', 'of', 'and', 'to', 'in']

const formatStatus = (status: string): string => {
  if (!status) return '—'
  return status
    .split('_')
    .map((word, i) => {
      const lower = word.toLowerCase()
      if (i > 0 && LOWERCASE_WORDS.includes(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

const statusToneClass = (status: string): string => {
  const upper = status.toUpperCase()
  if (upper.includes('WAITING') || upper.includes('PENDING')) return 'bg-accent-warning/10 text-accent-warning'
  if (upper.includes('CANCEL') || upper.includes('REJECT')) return 'bg-accent-danger/10 text-accent-danger'
  if (upper.includes('SHIPPED') || upper.includes('DELIVERED') || upper.includes('COMPLETE'))
    return 'bg-accent-success/10 text-accent-success'
  return 'bg-slate-100 text-slate-600'
}

const CompanyRowSkeleton = () => (
  <tr className="animate-pulse border-b border-dark-border">
    {Array.from({ length: 4 }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded" style={{ width: `${60 + (i % 3) * 20}%` }} />
      </td>
    ))}
  </tr>
)

const OrderItemRowSkeleton = () => (
  <tr className="animate-pulse border-b border-dark-border">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="py-3 px-3">
        <div className="h-4 bg-slate-200 rounded" style={{ width: `${60 + (i % 3) * 20}%` }} />
      </td>
    ))}
  </tr>
)

export const LateShipments: React.FC = () => {
  const [companies, setCompanies] = useState<LateShipmentCompany[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
  const [day, setDay] = useState<number | null>(7)
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null)

  const fetchCompanies = useCallback(async (): Promise<{
    content: LateShipmentCompany[]
    totalElements: number
    totalPages: number
  }> => {
    const data = await lateShipmentService.getCompanies({
      day,
      page: currentPage,
      size: itemsPerPage,
      sortDirection,
    })
    return data
  }, [day, currentPage, itemsPerPage, sortDirection])

  useEffect(() => {
    let ignore = false
    const timer = setTimeout(() => {
      void (async () => {
        try {
          setIsLoading(true)
          const data = await fetchCompanies()
          if (!ignore) {
            setCompanies(data.content)
            setTotalElements(data.totalElements)
            setTotalPages(data.totalPages)
          }
        } catch (error) {
          if (!ignore) {
            console.error('Failed to fetch late shipment companies:', error)
            toast.error('Failed to load late shipment companies')
          }
        } finally {
          if (!ignore) setIsLoading(false)
        }
      })()
    }, 300)
    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [fetchCompanies])

  const handleDayChange = (value: string) => {
    setDay(value === 'all' ? null : Number(value))
    setCurrentPage(0)
    setExpandedCompanyId(null)
  }

  const handleSortToggle = () => {
    setSortDirection((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    setCurrentPage(0)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">Time range</span>
          <select
            value={day === null ? 'all' : String(day)}
            onChange={(e) => handleDayChange(e.target.value)}
            className="bg-dark-elevated border border-dark-border rounded-lg text-sm px-3 py-2 text-slate-800 focus:outline-none focus:border-accent-primary"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-elevated">
                <th className="py-3 px-4 w-10" />
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Company</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Late Shipments</th>
                <th className="py-3 px-4 text-left">
                  <SortButton
                    label="Latest Late Order"
                    onClick={handleSortToggle}
                    isActive
                    direction={sortDirection.toLowerCase() as 'asc' | 'desc'}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: itemsPerPage > 5 ? 5 : itemsPerPage }).map((_, i) => (
                  <CompanyRowSkeleton key={i} />
                ))
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-500">
                    <PackageX className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                    <p className="font-medium">No late shipments</p>
                    <p className="text-sm text-slate-400 mt-1">Vendors that miss shipping deadlines will appear here</p>
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <LateShipmentCompanyGroup
                    key={company.id}
                    company={company}
                    isExpanded={expandedCompanyId === company.id}
                    onToggle={() =>
                      setExpandedCompanyId((prev) => (prev === company.id ? null : company.id))
                    }
                    day={day}
                  />
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
          onItemsPerPageChange={(n) => {
            setItemsPerPage(n)
            setCurrentPage(0)
          }}
          itemName="companies"
        />
      </div>
    </div>
  )
}

interface LateShipmentCompanyGroupProps {
  company: LateShipmentCompany
  isExpanded: boolean
  onToggle: () => void
  day: number | null
}

const LateShipmentCompanyGroup: React.FC<LateShipmentCompanyGroupProps> = ({
  company,
  isExpanded,
  onToggle,
  day,
}) => {
  const [items, setItems] = useState<LateShipmentOrderItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(5)
  const [sortBy, setSortBy] = useState<LateShipmentOrderItemSortBy>('createdDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
  const [notShippedOnly, setNotShippedOnly] = useState(false)
  const [totalElements, setTotalElements] = useState(company.lateShipmentCount)
  const [totalPages, setTotalPages] = useState(0)
  const [isImageError, setIsImageError] = useState(false)

  const fetchItems = useCallback(async () => {
    return lateShipmentService.getOrderItems({
      companyId: company.id,
      day,
      page,
      size,
      sortBy,
      sortDirection,
      notShippedOnly,
    })
  }, [company.id, day, page, size, sortBy, sortDirection, notShippedOnly])

  useEffect(() => {
    if (!isExpanded) return
    let ignore = false
    void (async () => {
      try {
        setIsLoading(true)
        const data = await fetchItems()
        if (!ignore) {
          setItems(data.content)
          setTotalElements(data.totalElements)
          setTotalPages(data.totalPages)
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to fetch late shipment order items:', error)
          toast.error('Failed to load late shipment order items')
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    })()
    return () => {
      ignore = true
    }
  }, [isExpanded, fetchItems])

  useEffect(() => {
    setPage(0)
  }, [day])

  const handleSort = (field: LateShipmentOrderItemSortBy) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    } else {
      setSortBy(field)
      setSortDirection('DESC')
    }
    setPage(0)
  }

  return (
    <>
      <tr
        className={cn(
          'border-b border-dark-border transition-colors cursor-pointer hover:bg-dark-elevated/50',
          isExpanded && 'bg-dark-elevated/30',
        )}
        onClick={onToggle}
      >
        <td className="py-4 px-4">
          <button type="button" className="text-slate-500 hover:text-slate-900 transition-colors">
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="min-w-9 h-9 bg-dark-elevated rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              {company.companyPhoto && !isImageError ? (
                <img
                  src={getImageUrl(company.companyPhoto)}
                  onError={() => setIsImageError(true)}
                  alt="no logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="text-slate-400 h-4 w-4" />
              )}
            </div>
            <p className="text-sm font-medium text-slate-800">{company.name}</p>
          </div>
        </td>
        <td className="py-3 px-4">
          <span className="inline-flex items-center rounded-full bg-accent-danger/10 text-accent-danger text-xs font-semibold px-2.5 py-1">
            {company.lateShipmentCount}
          </span>
        </td>
        <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
          {formatDateTime(company.latestLateOrderItemCreatedDate)}
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-b border-dark-border bg-dark-elevated/10">
          <td colSpan={4} className="p-0">
            <div className="px-4 py-3">
              <div className="flex items-center justify-end gap-2 pb-2 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notShippedOnly}
                    onChange={(e) => {
                      setNotShippedOnly(e.target.checked)
                      setPage(0)
                    }}
                    className="h-3.5 w-3.5 cursor-pointer accent-blue-500"
                  />
                  Not shipped yet only
                </label>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                    <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Qty</th>
                    <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                    <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      <SortButton
                        label="Created"
                        onClick={() => handleSort('createdDate')}
                        isActive={sortBy === 'createdDate'}
                        direction={sortDirection.toLowerCase() as 'asc' | 'desc'}
                        className="text-[11px] uppercase tracking-wide"
                      />
                    </th>
                    <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Deadline</th>
                    <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Shipped</th>
                    <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      <SortButton
                        label="Delay"
                        onClick={() => handleSort('delayTime')}
                        isActive={sortBy === 'delayTime'}
                        direction={sortDirection.toLowerCase() as 'asc' | 'desc'}
                        className="text-[11px] uppercase tracking-wide"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <OrderItemRowSkeleton key={i} />)
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-slate-400">
                        {notShippedOnly ? 'No unshipped late items' : 'No late shipments for this company'}
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => <OrderItemRow key={item.orderItemId} item={item} />)
                  )}
                </tbody>
              </table>

              <TablePagination
                currentPage={page + 1}
                totalPages={totalPages}
                totalItems={totalElements}
                itemsPerPage={size}
                onPageChange={(p) => setPage(p - 1)}
                onItemsPerPageChange={(n) => {
                  setSize(n)
                  setPage(0)
                }}
                itemName="order items"
              />
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

interface OrderItemRowProps {
  item: LateShipmentOrderItem
}

const OrderItemRow: React.FC<OrderItemRowProps> = ({ item }) => {
  const [isImageError, setIsImageError] = useState(false)
  return (
    <tr className="border-b border-dark-border hover:bg-dark-elevated/50 transition-colors">
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <div className="min-w-10 h-10 bg-dark-border rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
            {item.productCoverPhotoPath && !isImageError ? (
              <img
                src={getImageUrl(item.productCoverPhotoPath)}
                onError={() => setIsImageError(true)}
                alt="no cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="text-slate-400 h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{item.productName}</p>
            <p className="text-xs text-slate-400 font-mono">{item.skuCode ?? '—'}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-sm text-slate-700">{item.quantity}</td>
      <td className="py-3 px-3 text-sm text-slate-700">{formatCurrency(item.price)}</td>
      <td className="py-3 px-3">
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap', statusToneClass(item.status))}>
          {formatStatus(item.status)}
        </span>
      </td>
      <td className="py-3 px-3 text-xs text-slate-500 whitespace-nowrap">{formatDateTime(item.createdDate)}</td>
      <td className="py-3 px-3 text-xs text-slate-500 whitespace-nowrap">{formatDateTime(item.deadline)}</td>
      <td className="py-3 px-3 text-xs whitespace-nowrap">
        {/* `shipmentDate` can carry a planned date while the item is still unshipped,
            so the explicit `notShippedYet` flag wins over a mere null check. */}
        {item.notShippedYet || !item.shipmentDate ? (
          <span className="text-accent-warning text-xs font-medium">Not shipped</span>
        ) : (
          <span className="text-slate-500">{formatDateTime(item.shipmentDate)}</span>
        )}
      </td>
      <td className="py-3 px-3">
        <span
          className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap', delayToneClass(item.delayInMinutes))}
          title={`${item.delayInMinutes} minutes`}
        >
          {formatDelay(item.delayInMinutes)}
        </span>
      </td>
    </tr>
  )
}
