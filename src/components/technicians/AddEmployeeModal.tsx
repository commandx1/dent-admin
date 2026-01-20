import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, MapPin, CheckCircle2, AlertCircle, Wrench } from 'lucide-react';
import api from '@/lib/api';
import AddressAutocomplete from './AddressAutocomplete';
import type { ParsedAddress } from '@/lib/utils';
import { type CompanyMember, CAPABILITIES } from './types';
import { cn } from '@/lib/utils';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId?: string;
  companyName: string;
  onAdd?: (member: CompanyMember) => void;
  onSuccess?: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  companyId,
  companyName,
  onAdd,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    latitude: 0,
    longitude: 0,
  });
  const [selectedCapabilities, setSelectedCapabilities] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const toggleCapability = (id: number) => {
    setSelectedCapabilities([id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: CompanyMember = {
      company_id: companyId,
      user_first_name: formData.firstName,
      user_last_name: formData.lastName,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zipCode,
      country: formData.country,
      latitude: formData.latitude,
      longitude: formData.longitude,
      is_headquarters: false,
      capability_ids: selectedCapabilities
    };

    if (onAdd) {
      onAdd(payload);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        latitude: 0,
        longitude: 0,
      });
      setSelectedCapabilities([]);
      onClose();
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await api.post('/api/dentypro/technician/technician', payload, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TECHNICIAN_USER_ACCESS_TOKEN}`,
          'X-Refresh-Token': import.meta.env.VITE_TECHNICIAN_USER_REFRESH_TOKEN
        }
      });

      if (response.status === 200 || response.status === 201) {
        // Send capabilities if any
        const userId = response.data?.user_id || response.data?.id;
        if (userId && selectedCapabilities.length > 0) {
          try {
            await api.post('/api/dentypro/technician/technician/capabilities', {
              capability_ids: selectedCapabilities,
              user_id: userId
            }, {
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_TECHNICIAN_USER_ACCESS_TOKEN}`,
                'X-Refresh-Token': import.meta.env.VITE_TECHNICIAN_USER_REFRESH_TOKEN
              }
            });
          } catch (capError) {
            console.error('Error saving member capabilities:', capError);
          }
        }

        setStatus('success');
        setMessage('Member added successfully!');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
          setStatus(null);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            latitude: 0,
            longitude: 0,
          });
          setSelectedCapabilities([]);
        }, 2000);
      }
    } catch (error: unknown) {
      setStatus('error');
      const axiosError = error as { response?: { data?: { message?: string } } };
      setMessage(axiosError.response?.data?.message || 'Failed to add member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressSelect = (parsed: ParsedAddress) => {
    setFormData(prev => ({
      ...prev,
      address: parsed.addressLine,
      city: parsed.city,
      state: parsed.state,
      zipCode: parsed.postalCode,
      country: parsed.country,
      latitude: parsed.latitude,
      longitude: parsed.longitude
    }));
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Add Company Member</h2>
            <p className="text-slate-500 font-medium">{companyName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all font-medium"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Last Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all font-medium"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="email"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all font-medium"
                placeholder="member@company.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Location</label>
            <AddressAutocomplete 
              onSelect={handleAddressSelect}
              selectedAddress={null}
            />
          </div>

          {formData.address && (
            <div className="p-4 bg-accent-primary/5 rounded-2xl border border-accent-primary/10 flex gap-4">
              <MapPin className="text-accent-primary shrink-0" size={20} />
              <div className="text-sm text-slate-600 font-medium">
                {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1 flex items-center gap-2">
              <Wrench size={16} className="text-accent-primary" />
              Capabilities
            </label>
            <div className="flex flex-wrap gap-2">
              {CAPABILITIES.map((cap) => (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => toggleCapability(cap.id)}
                  className={cn(
                    "px-4 py-3 rounded-xl border-2 transition-all text-left flex items-start gap-3 group relative",
                    selectedCapabilities.includes(cap.id)
                      ? "bg-accent-primary/5 border-accent-primary text-slate-900 shadow-sm"
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "min-w-[18px] h-[18px] rounded-full border-2 mt-0.5 flex items-center justify-center transition-all",
                    selectedCapabilities.includes(cap.id)
                      ? "bg-accent-primary border-accent-primary text-white"
                      : "bg-white border-slate-300 group-hover:border-slate-400"
                  )}>
                    {selectedCapabilities.includes(cap.id) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="font-bold text-xs leading-tight">{cap.label}</span>
                </button>
              ))}
            </div>
          </div>

          {status && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
              status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {status === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="font-bold">{message}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all uppercase tracking-widest text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 px-6 py-4 bg-accent-primary hover:opacity-90 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-sm shadow-lg shadow-accent-primary/25 disabled:opacity-50 min-w-[140px]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75" />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150" />
                </div>
              ) : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

