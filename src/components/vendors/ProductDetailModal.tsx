import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Package,
  CheckCircle2,
  XCircle,
  Star,
  Users,
  MessageSquare,
  Ruler,
  Weight,
  ExternalLink,
  ChevronRight,
  ScanBarcode,
  RefreshCw,
} from 'lucide-react';
import { productReviewService } from '@/services/productReviewService';
import type { ProductDetail } from './types';
import { getImageUrl } from '@/lib/utils';

interface ProductDetailModalProps {
  productId: string;
  productName: string;
  isApproving: boolean;
  onApprove: () => void | Promise<void>;
  onReject: () => void;
  onClose: () => void;
}

export function ProductDetailModal({
  productId,
  productName,
  isApproving,
  onApprove,
  onReject,
  onClose,
}: ProductDetailModalProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    productReviewService
      .getProductDetail(productId)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setActivePhoto(data.coverPhotoPath || data.photoPhats?.[0] || null);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId, reloadKey]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const photos = product
    ? [
        ...(product.coverPhotoPath ? [product.coverPhotoPath] : []),
        ...(product.photoPhats ?? []).filter((p) => p && p !== product.coverPhotoPath),
      ]
    : [];

  const categoryPath = product
    ? [
        product.categoryLevel1,
        product.categoryLevel2,
        product.categoryLevel3,
        product.categoryLevel4,
        product.categoryLevel5,
      ].filter((c): c is string => Boolean(c && c.trim()))
    : [];

  const manufacturerPageUrl =
    product?.manufacturerSiteProductPage && /^https?:\/\//i.test(product.manufacturerSiteProductPage)
      ? product.manufacturerSiteProductPage
      : null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-3xl max-h-[88vh] flex-col overflow-hidden rounded-2xl border border-dark-border bg-dark-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-dark-border bg-dark-elevated/60 px-6 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-primary">
              Product review · Details
            </p>
            <h2 className="mt-0.5 truncate text-lg font-semibold text-slate-800">
              {product?.name || productName}
            </h2>
            {product?.detailedName && (
              <p className="mt-0.5 truncate text-xs text-slate-500">{product.detailedName}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {product && (
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  product.active
                    ? 'bg-accent-success/10 text-accent-success'
                    : 'bg-slate-500/10 text-slate-500'
                }`}
              >
                {product.active ? 'Active' : 'Inactive'}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-dark-elevated hover:text-slate-600"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5">
          {isLoading ? (
            <DetailSkeleton />
          ) : hasError || !product ? (
            <div className="py-16 text-center">
              <Package className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="font-medium text-slate-600">Failed to load product details</p>
              <p className="mt-1 text-sm text-slate-400">
                Please check that the ecommerce API is reachable
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setHasError(false);
                  setReloadKey((k) => k + 1);
                }}
                className="mx-auto mt-4 flex items-center gap-1.5 rounded-lg bg-accent-primary/10 px-3 py-1.5 text-xs font-semibold text-accent-primary transition-colors hover:bg-accent-primary/20"
              >
                <RefreshCw size={12} />
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Gallery + key facts */}
              <div className="grid gap-5 sm:grid-cols-[240px_1fr]">
                <div>
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-dark-border bg-dark-elevated">
                    {activePhoto ? (
                      <img
                        src={getImageUrl(activePhoto)}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={() => setActivePhoto(null)}
                      />
                    ) : (
                      <Package className="h-12 w-12 text-slate-300" />
                    )}
                  </div>
                  {photos.length > 1 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                      {photos.map((photo) => (
                        <button
                          key={photo}
                          type="button"
                          onClick={() => setActivePhoto(photo)}
                          className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                            activePhoto === photo
                              ? 'border-accent-primary'
                              : 'border-dark-border hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={getImageUrl(photo)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {categoryPath.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
                      {categoryPath.map((cat, i) => (
                        <span key={`${cat}-${i}`} className="flex items-center gap-1">
                          {i > 0 && <ChevronRight size={12} className="text-slate-300" />}
                          <span
                            className={
                              i === categoryPath.length - 1 ? 'font-medium text-slate-700' : ''
                            }
                          >
                            {cat}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <StatCard
                      icon={<Star size={14} className="text-amber-500" />}
                      label="Rating"
                      value={product.overallStar ? product.overallStar.toFixed(1) : '—'}
                    />
                    <StatCard
                      icon={<MessageSquare size={14} className="text-accent-primary" />}
                      label="Reviews"
                      value={String(product.reviewCount ?? 0)}
                    />
                    <StatCard
                      icon={<Users size={14} className="text-accent-success" />}
                      label="Vendors"
                      value={String(product.vendorsCount ?? 0)}
                    />
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    <SpecItem label="Brand" value={product.brand} />
                    <SpecItem label="Manufacturer" value={product.manufacturer} />
                    <SpecItem label="Manufacturer code" value={product.manufacturerCode} mono />
                    <SpecItem
                      label="Barcode"
                      value={product.barcode != null ? String(product.barcode) : null}
                      mono
                      icon={<ScanBarcode size={12} className="text-slate-400" />}
                    />
                    <SpecItem label="Packaging" value={product.packaging} />
                    <SpecItem label="Size" value={product.size} />
                    <SpecItem label="Type" value={product.type} />
                    <SpecItem label="Scent" value={product.scent} />
                    <SpecItem label="Primary market" value={product.primaryMarket} />
                    <SpecItem label="License required" value={product.dentalLicenseRequired} />
                    <SpecItem label="Reorder ID" value={product.reorderId} mono />
                    <SpecItem label="Reference no." value={product.referanceNumber} mono />
                  </dl>
                </div>
              </div>

              {/* Description */}
              {(product.description || product.aboutProduct) && (
                <div className="space-y-3">
                  {product.description && (
                    <Section title="Description">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                        {product.description}
                      </p>
                    </Section>
                  )}
                  {product.aboutProduct && (
                    <Section title="About this product">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                        {product.aboutProduct}
                      </p>
                    </Section>
                  )}
                </div>
              )}

              {/* Shipping */}
              <Section title="Shipping & dimensions">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <MetricCard
                    icon={<Ruler size={14} />}
                    label="Length"
                    value={formatMetric(product.length, product.distanceUnit)}
                  />
                  <MetricCard
                    icon={<Ruler size={14} />}
                    label="Width"
                    value={formatMetric(product.width, product.distanceUnit)}
                  />
                  <MetricCard
                    icon={<Ruler size={14} />}
                    label="Height"
                    value={formatMetric(product.height, product.distanceUnit)}
                  />
                  <MetricCard
                    icon={<Weight size={14} />}
                    label="Weight"
                    value={formatMetric(product.weight, product.massUnit)}
                  />
                </div>
              </Section>

              {/* Links & meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dark-border pt-4">
                <div className="text-[11px] text-slate-400">
                  <span className="font-medium text-slate-500">Product ID:</span>{' '}
                  <span className="font-mono">{product.id}</span>
                  {product.createdDate && (
                    <>
                      {' · '}
                      <span className="font-medium text-slate-500">Created:</span>{' '}
                      {new Date(product.createdDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </>
                  )}
                </div>
                {manufacturerPageUrl && (
                  <a
                    href={manufacturerPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-accent-primary/10 px-3 py-1.5 text-xs font-semibold text-accent-primary transition-colors hover:bg-accent-primary/20"
                  >
                    <ExternalLink size={12} />
                    Manufacturer page
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 border-t border-dark-border bg-dark-elevated/60 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-dark-border px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-dark-elevated"
          >
            Close
          </button>
          <button
            type="button"
            disabled={isApproving}
            onClick={() => void onApprove()}
            className="flex items-center gap-1.5 rounded-lg bg-accent-success/10 hover:bg-accent-success/20 text-accent-success px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isApproving ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-accent-success border-t-transparent" />
            ) : (
              <CheckCircle2 size={12} />
            )}
            Approve
          </button>
          <button
            type="button"
            disabled={isApproving}
            onClick={onReject}
            className="flex items-center gap-1.5 rounded-lg bg-accent-danger/10 hover:bg-accent-danger/20 text-accent-danger px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <XCircle size={12} />
            Reject
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
      {title}
    </h3>
    {children}
  </div>
);

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="rounded-xl border border-dark-border bg-dark-elevated/60 px-3 py-2.5">
    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
      {icon}
      {label}
    </div>
    <p className="mt-1 text-base font-semibold text-slate-800">{value}</p>
  </div>
);

const SpecItem = ({
  label,
  value,
  mono,
  icon,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
  icon?: React.ReactNode;
}) => (
  <div className="min-w-0">
    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</dt>
    <dd
      className={`mt-0.5 flex items-center gap-1 truncate text-sm ${
        value ? 'text-slate-700' : 'text-slate-300'
      } ${mono && value ? 'font-mono text-[13px]' : ''}`}
      title={value ?? undefined}
    >
      {icon}
      {value || '—'}
    </dd>
  </div>
);

const MetricCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2.5 rounded-xl border border-dark-border bg-dark-elevated/60 px-3 py-2.5">
    <span className="text-slate-400">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

const formatMetric = (value: number, unit: string | null): string =>
  value ? `${value} ${unit ?? ''}`.trim() : '—';

const DetailSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="grid gap-5 sm:grid-cols-[240px_1fr]">
      <div className="aspect-square rounded-xl bg-slate-200" />
      <div className="space-y-4">
        <div className="h-3 w-2/3 rounded bg-slate-200" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-200" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
    <div className="h-20 rounded-xl bg-slate-200" />
  </div>
);
