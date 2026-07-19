import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Download,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  AlertCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'
import {
  vendorDocumentService,
  type GetVendorDocumentsParams,
  type DocumentSortBy,
  type SortDirection,
} from '@/services/vendorDocumentService'
import type { AdminVendorDocument } from './types'
import { RejectDocumentModal } from './RejectDocumentModal'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'
import { useAppStore } from '@/store/useAppStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'pending' | 'approved' | 'revision'

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Revision Requested', value: 'revision' },
]

function statusFilterToParams(filter: StatusFilter): Pick<GetVendorDocumentsParams, 'approved' | 'revisionRequested'> {
  switch (filter) {
    case 'approved':
      return { approved: true, revisionRequested: null }
    case 'revision':
      return { approved: null, revisionRequested: true }
    case 'pending':
      return { approved: false, revisionRequested: false }
    default:
      return { approved: null, revisionRequested: null }
  }
}

// Vendor submitted a revision but auto-approval failed (system validation error)
function isRevisionAutoFailed(doc: AdminVendorDocument): boolean {
  return (
    doc.revisionRequested &&
    !doc.approved &&
    !!doc.revisedFilePath &&
    (doc.requestedEdits?.startsWith('Revision approval failed:') ?? false)
  )
}

function DocumentStatusBadge({ doc }: { doc: AdminVendorDocument }) {
  if (doc.approved) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-success/10 px-2.5 py-0.5 text-xs font-semibold text-accent-success">
        <CheckCircle2 size={11} className="shrink-0" />
        Approved
      </span>
    )
  }
  if (isRevisionAutoFailed(doc)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-danger/10 px-2.5 py-0.5 text-xs font-semibold text-accent-danger">
        <AlertCircle size={11} className="shrink-0" />
        Revision Failed
      </span>
    )
  }
  if (doc.revisionRequested && doc.revisedFilePath) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-primary/10 px-2.5 py-0.5 text-xs font-semibold text-accent-primary">
        <Clock size={11} className="shrink-0" />
        Revision Uploaded
      </span>
    )
  }
  if (doc.revisionRequested) {
    return (
      <span className="inline-flex whitespace-nowrap items-center gap-1 rounded-full bg-accent-warning/10 px-2.5 py-0.5 text-xs font-semibold text-accent-warning">
        <XCircle size={11} className="shrink-0" />
        Revision Requested
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
      <FileText size={11} className="shrink-0" />
      Pending
    </span>
  )
}

function SystemRejectedBadge({ systemRejected }: { systemRejected: boolean }) {
  if (systemRejected) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-danger/10 px-2.5 py-0.5 text-xs font-semibold text-accent-danger">
        <XCircle size={11} className="shrink-0" />
        Rejected
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
      No
    </span>
  )
}

function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => setVisible(false), 120)
  }

  const show = () => {
    cancelHide()
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setCoords({ top: rect.bottom + 8, left: rect.left })
    setVisible(true)
  }

  return (
    <>
      <div ref={triggerRef} onMouseEnter={show} onMouseLeave={scheduleHide}>
        {children}
      </div>
      {visible && createPortal(
        <div
          style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 9999 }}
          className="max-h-64 w-80 overflow-y-auto rounded-lg border border-dark-border bg-dark-elevated p-3 text-xs text-slate-600 shadow-xl whitespace-pre-line"
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  )
}

const DocumentRowSkeleton = () => (
  <tr className="animate-pulse border-b border-dark-border">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded" style={{ width: `${60 + (i % 3) * 20}%` }} />
      </td>
    ))}
  </tr>
)

export const VendorDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<AdminVendorDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState<DocumentSortBy>('createdDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [localSearch, setLocalSearch] = useState('')
  const [rejectModal, setRejectModal] = useState<{ docId: string; vendorName: string } | null>(null)
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set())
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const { searchQuery } = useAppStore()
  const effectiveSearch = localSearch || searchQuery

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      const statusParams = statusFilterToParams(statusFilter)
      const data = await vendorDocumentService.getDocuments({
        page: currentPage,
        size: itemsPerPage,
        sortBy,
        sortDirection,
        isDeleted: false,
        ...statusParams,
        ...(effectiveSearch ? { searchTerm: effectiveSearch } : {}),
      })
      setDocuments(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      toast.error('Failed to load vendor documents')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, itemsPerPage, sortBy, sortDirection, statusFilter, effectiveSearch])

  useEffect(() => {
    setCurrentPage(0)
  }, [statusFilter, effectiveSearch])

  useEffect(() => {
    const timer = setTimeout(() => { void fetchDocuments() }, 300)
    return () => clearTimeout(timer)
  }, [fetchDocuments])

  const handleSort = (field: DocumentSortBy) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    } else {
      setSortBy(field)
      setSortDirection('ASC')
    }
    setCurrentPage(0)
  }

  const handleApprove = async (doc: AdminVendorDocument) => {
    setApprovingIds((prev) => new Set(prev).add(doc.id))
    try {
      const result = await vendorDocumentService.approveDocument(doc.id)
      if (result.success) {
        const msg =
          result.failedCount > 0
            ? `Imported ${result.importedCount}, failed ${result.failedCount}`
            : `${result.importedCount} products imported successfully`
        toast.success(msg)
        if (result.invalidRecordsFilePath) {
          toast.info('Invalid records file available — download from the document row')
        }
      } else {
        toast.error(result.message)
      }
      void fetchDocuments()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to approve document')
    } finally {
      setApprovingIds((prev) => { const next = new Set(prev); next.delete(doc.id); return next })
    }
  }

  const handleDownload = async (
    doc: AdminVendorDocument,
    fileType: 'original' | 'revised' | 'invalid',
  ) => {
    const key = `${doc.id}-${fileType}`
    setDownloadingId(key)
    try {
      const blob = await vendorDocumentService.downloadFile(doc.id, fileType)
      const filePath =
        fileType === 'revised' ? doc.revisedFilePath :
        fileType === 'invalid' ? doc.invalidRecordsFilePath :
        doc.filePath
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = vendorDocumentService.extractFileName(filePath ?? doc.filePath)
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to download file')
    } finally {
      setDownloadingId(null)
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by vendor name..."
              value={localSearch}
              onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(0) }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-dark-elevated border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                  statusFilter === opt.value
                    ? 'bg-accent-primary text-white border-accent-primary'
                    : 'bg-dark-elevated text-slate-600 border-dark-border hover:bg-dark-border',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-elevated">
                <th className="py-3 px-4 text-left">
                  <SortButton label="Vendor" onClick={() => {}} isActive={false} direction="ASC" />
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">File</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">System Rejected</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Requested Edits</th>
                <th className="py-3 px-4 text-left">
                  <SortButton
                    label="Date"
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
                  <DocumentRowSkeleton key={i} />
                ))
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500">
                    <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                    <p className="font-medium">No documents found</p>
                    <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-dark-border hover:bg-dark-elevated/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{doc.ownerId.slice(0, 8)}…</p>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={downloadingId === `${doc.id}-original`}
                          onClick={() => handleDownload(doc, 'original')}
                          className="flex items-center gap-1 text-xs text-accent-primary hover:underline disabled:opacity-50"
                          title={vendorDocumentService.extractFileName(doc.filePath)}
                        >
                          <Download size={12} />
                          Original
                        </button>
                        {doc.revisedFilePath && (
                          <>
                            <span className="text-slate-300">·</span>
                            <button
                              type="button"
                              disabled={downloadingId === `${doc.id}-revised`}
                              onClick={() => handleDownload(doc, 'revised')}
                              className="flex items-center gap-1 text-xs text-accent-secondary hover:underline disabled:opacity-50"
                            >
                              <Download size={12} />
                              Revised
                            </button>
                          </>
                        )}
                        {doc.invalidRecordsFilePath && (
                          <>
                            <span className="text-slate-300">·</span>
                            <button
                              type="button"
                              disabled={downloadingId === `${doc.id}-invalid`}
                              onClick={() => handleDownload(doc, 'invalid')}
                              className="flex items-center gap-1 text-xs text-accent-danger hover:underline disabled:opacity-50"
                            >
                              <Download size={12} />
                              Invalid
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <DocumentStatusBadge doc={doc} />
                    </td>

                    <td className="py-3 px-4">
                      <SystemRejectedBadge systemRejected={doc.systemRejected} />
                    </td>

                    <td className="py-3 px-4 max-w-48">
                      {doc.requestedEdits ? (
                        <Tooltip content={doc.requestedEdits}>
                          <p className="cursor-default truncate text-xs text-slate-600">
                            {doc.requestedEdits}
                          </p>
                        </Tooltip>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(doc.createdDate)}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(doc.updatedDate)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {doc.approved ? (
                          <span className="text-xs text-slate-400 italic">Processed</span>
                        ) : isRevisionAutoFailed(doc) ? (
                          <button
                            type="button"
                            onClick={() => setRejectModal({ docId: doc.id, vendorName: doc.name })}
                            className="flex items-center gap-1 rounded-lg bg-accent-warning/10 hover:bg-accent-warning/20 text-accent-warning px-2.5 py-1.5 text-xs font-semibold transition-colors"
                          >
                            <RefreshCw size={12} />
                            Re-request Revision
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={approvingIds.has(doc.id)}
                              onClick={() => handleApprove(doc)}
                              className="flex items-center gap-1 rounded-lg bg-accent-success/10 hover:bg-accent-success/20 text-accent-success px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              {approvingIds.has(doc.id) ? (
                                <div className="w-3 h-3 border-2 border-accent-success border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <CheckCircle2 size={12} />
                              )}
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectModal({ docId: doc.id, vendorName: doc.name })}
                              className="flex items-center gap-1 rounded-lg bg-accent-danger/10 hover:bg-accent-danger/20 text-accent-danger px-2.5 py-1.5 text-xs font-semibold transition-colors"
                            >
                              <XCircle size={12} />
                              Reject
                            </button>
                          </>
                        )}
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
          itemName="documents"
        />
      </div>

      {rejectModal && (
        <RejectDocumentModal
          documentId={rejectModal.docId}
          vendorName={rejectModal.vendorName}
          onClose={() => setRejectModal(null)}
          onSuccess={() => {
            setRejectModal(null)
            void fetchDocuments()
          }}
        />
      )}
    </div>
  )
}
