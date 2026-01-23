import React, { useState, useRef } from 'react'
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react'
import { vendorService } from '@/services/vendorService'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ImportProductsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ImportProductsModal: React.FC<ImportProductsModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile)
      } else {
        toast.error('Please select a valid Excel file (.xlsx or .xls)')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !file) {
      toast.error('Please provide both email and products file')
      return
    }

    try {
      setIsSubmitting(true)
      await vendorService.importProducts(email, file)
      toast.success('Products imported successfully')
      onClose()
      setEmail('')
      setFile(null)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to import products')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Import Products</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Vendor Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. vendor@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Products File (Excel)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                file ? "border-accent-success/50 bg-accent-success/5" : "border-slate-200 hover:border-accent-primary/50 hover:bg-slate-50"
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                className="hidden"
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-2 text-accent-success">
                  <CheckCircle2 size={32} />
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-slate-500">Click to change file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Upload size={32} />
                  <p className="font-medium text-sm text-slate-600">Click to upload products file</p>
                  <p className="text-xs text-slate-400">Supports .xlsx and .xls formats</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <FileText className="text-blue-500 shrink-0" size={20} />
            <p className="text-xs text-blue-700 leading-relaxed">
              Make sure your Excel file follows the required format (Sku, Name, Category, Manufacture, Image).
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !file || !email}
              style={{ flex: 2 }}
              className="bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all shadow-lg shadow-accent-primary/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
              ) : (
                <>Import Products</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
