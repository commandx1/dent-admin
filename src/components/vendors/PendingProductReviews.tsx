import React, { useState, useEffect, useCallback } from 'react'
import { Package, CheckCircle2, XCircle, ClipboardList, Eye } from 'lucide-react'
import {
  productReviewService,
  type ProductReviewSortBy,
  type SortDirection,
} from '@/services/productReviewService'
import type { PendingProductReview } from './types'
import { RejectProductReviewModal } from './RejectProductReviewModal'
import { ProductDetailModal } from './ProductDetailModal'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'
import { toast } from 'sonner'
import { getImageUrl } from '@/lib/utils'

const ReviewRowSkeleton = () => (
  <tr className="animate-pulse border-b border-dark-border">
    {Array.from({ length: 4 }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded" style={{ width: `${60 + (i % 3) * 20}%` }} />
      </td>
    ))}
  </tr>
)

export const PendingProductReviews: React.FC = () => {
  const [reviews, setReviews] = useState<PendingProductReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState<ProductReviewSortBy>('createdDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
  const [rejectModal, setRejectModal] = useState<{ productId: string; productName: string } | null>(null)
  const [detailModal, setDetailModal] = useState<{ productId: string; productName: string; userId: string } | null>(null)
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set())

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await productReviewService.getPendingReviews({
        page: currentPage,
        size: itemsPerPage,
        sortBy,
        sortDirection,
      })
      setReviews(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch pending product reviews:', error)
      toast.error('Failed to load pending product reviews')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, itemsPerPage, sortBy, sortDirection])

  useEffect(() => {
    const timer = setTimeout(() => { void fetchReviews() }, 300)
    return () => clearTimeout(timer)
  }, [fetchReviews])

  const handleSort = (field: ProductReviewSortBy) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    } else {
      setSortBy(field)
      setSortDirection('ASC')
    }
    setCurrentPage(0)
  }

  const handleApprove = async (productId: string): Promise<boolean> => {
    setApprovingIds((prev) => new Set(prev).add(productId))
    try {
      const result = await productReviewService.approveProduct(productId)
      if (result.success) {
        toast.success(result.message || 'Product approved successfully')
      } else {
        toast.error(result.message || 'Failed to approve product')
      }
      void fetchReviews()
      return result.success
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to approve product')
      return false
    } finally {
      setApprovingIds((prev) => { const next = new Set(prev); next.delete(productId); return next })
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-elevated">
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Vendor</th>
                <th className="py-3 px-4 text-left">
                  <SortButton
                    label="Submitted"
                    onClick={() => handleSort('createdDate')}
                    isActive={sortBy === 'createdDate'}
                    direction={sortDirection.toLowerCase() as 'asc' | 'desc'}
                  />
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: itemsPerPage > 5 ? 5 : itemsPerPage }).map((_, i) => (
                  <ReviewRowSkeleton key={i} />
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-500">
                    <ClipboardList className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                    <p className="font-medium">No pending product reviews</p>
                    <p className="text-sm text-slate-400 mt-1">New vendor submissions will show up here</p>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <ReviewRow
                    key={review.productId}
                    review={review}
                    isApproving={approvingIds.has(review.productId)}
                    onApprove={() => void handleApprove(review.productId)}
                    onReject={() => setRejectModal({ productId: review.productId, productName: review.productName })}
                    onShowDetails={() => setDetailModal({ productId: review.productId, productName: review.productName, userId: review.userId })}
                    formatDate={formatDate}
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
          onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(0) }}
          itemName="reviews"
        />
      </div>

      {detailModal && (
        <ProductDetailModal
          productId={detailModal.productId}
          userId={detailModal.userId}
          productName={detailModal.productName}
          isApproving={approvingIds.has(detailModal.productId)}
          onApprove={async () => {
            const success = await handleApprove(detailModal.productId)
            if (success) setDetailModal(null)
          }}
          onReject={() => setRejectModal({ productId: detailModal.productId, productName: detailModal.productName })}
          onClose={() => setDetailModal(null)}
        />
      )}

      {rejectModal && (
        <RejectProductReviewModal
          productId={rejectModal.productId}
          productName={rejectModal.productName}
          onClose={() => setRejectModal(null)}
          onSuccess={() => {
            setRejectModal(null)
            setDetailModal(null)
            void fetchReviews()
          }}
        />
      )}
    </div>
  )
}

interface ReviewRowProps {
  review: PendingProductReview
  isApproving: boolean
  onApprove: () => void
  onReject: () => void
  onShowDetails: () => void
  formatDate: (iso: string) => string
}

const ReviewRow: React.FC<ReviewRowProps> = ({ review, isApproving, onApprove, onReject, onShowDetails, formatDate }) => {
  const [isImageError, setIsImageError] = useState(false)
  return (
    <tr className="border-b border-dark-border hover:bg-dark-elevated/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="min-w-10 h-10 bg-dark-border rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
            {review.coverPhotoPath && !isImageError ? (
              <img
                src={getImageUrl(review.coverPhotoPath)}
                onError={() => setIsImageError(true)}
                alt="no cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="text-slate-400 h-5 w-5" />
            )}
          </div>
          <p className="text-sm font-medium text-slate-800">{review.productName}</p>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-slate-700">{review.ownerName}</td>
      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">{formatDate(review.createdDate)}</td>
      <td className="py-3 px-4">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onShowDetails}
            className="flex items-center gap-1 rounded-lg bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary px-2.5 py-1.5 text-xs font-semibold transition-colors"
          >
            <Eye size={12} />
            Details
          </button>
          <button
            type="button"
            disabled={isApproving}
            onClick={onApprove}
            className="flex items-center gap-1 rounded-lg bg-accent-success/10 hover:bg-accent-success/20 text-accent-success px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isApproving ? (
              <div className="w-3 h-3 border-2 border-accent-success border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle2 size={12} />
            )}
            Approve
          </button>
          <button
            type="button"
            onClick={onReject}
            className="flex items-center gap-1 rounded-lg bg-accent-danger/10 hover:bg-accent-danger/20 text-accent-danger px-2.5 py-1.5 text-xs font-semibold transition-colors"
          >
            <XCircle size={12} />
            Reject
          </button>
        </div>
      </td>
    </tr>
  )
}
