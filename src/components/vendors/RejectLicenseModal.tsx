import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { vendorLicenseService } from '@/services/vendorLicenseService';

interface RejectLicenseModalProps {
  licenseId: string;
  vendorName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function RejectLicenseModal({ licenseId, vendorName, onClose, onSuccess }: RejectLicenseModalProps) {
  const [rejectDescription, setRejectDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectDescription.trim()) return;
    setIsSubmitting(true);
    try {
      await vendorLicenseService.rejectVendorLicense(licenseId, rejectDescription.trim());
      toast.success('License rejected successfully');
      onSuccess();
    } catch {
      toast.error('Failed to reject license');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-dark-border bg-dark-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Reject License</h2>
            <p className="mt-0.5 text-xs text-slate-500">{vendorName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-dark-elevated hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Rejection reason <span className="text-accent-danger">*</span>
          </label>
          <textarea
            value={rejectDescription}
            onChange={(e) => setRejectDescription(e.target.value)}
            placeholder="Explain why this license is being rejected..."
            rows={4}
            className="w-full rounded-lg border border-dark-border bg-dark-elevated px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 resize-none"
          />

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-dark-border px-4 py-2 text-xs font-medium text-slate-600 hover:bg-dark-elevated disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!rejectDescription.trim() || isSubmitting}
              className="rounded-lg bg-accent-danger px-4 py-2 text-xs font-semibold text-white hover:bg-accent-danger/80 disabled:opacity-50"
            >
              {isSubmitting ? 'Rejecting...' : 'Reject License'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
