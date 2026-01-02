import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Clock, 
  CalendarPlus, 
  CalendarCheck, 
  PhoneCall, 
  Video, 
  Edit
} from 'lucide-react';
import { dentistService } from '@/services/dentistService';
import type { Dentist } from './types';

export const DentistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [dentist, setDentist] = useState<Dentist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDentistDetails(id);
    }
  }, [id]);

  const fetchDentistDetails = async (dentistId: string) => {
    setLoading(true);
    try {
      const data = await dentistService.getById(dentistId);
      setDentist(data);
    } catch (error) {
      console.error('Failed to fetch dentist details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-lg">Loading dentist details...</div>;
  }

  if (!dentist) {
    return <div className="p-8 text-center text-red-500 text-lg">Dentist not found.</div>;
  }

  const avatarSrc = dentist.profilePhotoData 
    ? `data:image/png;base64,${dentist.profilePhotoData}`
    : `https://ui-avatars.com/api/?name=${dentist.firstName}+${dentist.lastName}&background=random`;

  return (
    <div className="space-y-6">
      <section id="profile-overview">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <div className="flex flex-col items-center">
                <img
                  src={avatarSrc}
                  alt={`Dr. ${dentist.firstName} ${dentist.lastName}`}
                  className="w-32 h-32 rounded-full mb-4 object-cover border-2 border-accent-primary/20 shadow-lg"
                />
                <h3 className="text-xl font-bold text-slate-900 mb-1 text-center">Dr. {dentist.firstName} {dentist.lastName}</h3>
                <p className="text-sm text-slate-500 mb-4 text-center">{dentist.companyName}</p>
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="text-slate-400 w-5 h-5 shrink-0" />
                    <span className="text-slate-700 truncate">{dentist.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="text-slate-400 w-5 h-5 shrink-0" />
                    <span className="text-slate-700">{dentist.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="text-slate-400 w-5 h-5 shrink-0" />
                    <span className="text-slate-700">{dentist.companyName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="text-slate-400 w-5 h-5 shrink-0" />
                    <span className="text-slate-700">{dentist.locationCount} Locations</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="text-slate-400 w-5 h-5 shrink-0" />
                    <span className="text-slate-700">Last login: {new Date(dentist.lastLogin).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarPlus className="text-slate-400 w-5 h-5 shrink-0" />
                    <span className="text-slate-700">Member since: {new Date(dentist.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                    <CalendarCheck className="text-accent-primary h-6 w-6" />
                  </div>
                </div>
                <h4 className="text-slate-500 text-sm mb-1">Scheduled Appointments</h4>
                <p className="text-3xl font-bold text-slate-900">{dentist.appointmentStats?.scheduleCount || 0}</p>
                <p className="text-xs text-slate-500 mt-2">Total appointments</p>
              </div>
              <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-accent-danger/20 rounded-lg flex items-center justify-center">
                    <PhoneCall className="text-accent-danger h-6 w-6" />
                  </div>
                </div>
                <h4 className="text-slate-500 text-sm mb-1">Emergency Calls</h4>
                <p className="text-3xl font-bold text-slate-900">{dentist.appointmentStats?.emergencyCallCount || 0}</p>
                <p className="text-xs text-slate-500 mt-2">Urgent requests</p>
              </div>
              <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-accent-secondary/20 rounded-lg flex items-center justify-center">
                    <Video className="text-accent-secondary h-6 w-6" />
                  </div>
                </div>
                <h4 className="text-slate-500 text-sm mb-1">Remote Consultations</h4>
                <p className="text-3xl font-bold text-slate-900">{dentist.appointmentStats?.remoteAssistanceCount || 0}</p>
                <p className="text-xs text-slate-500 mt-2">Video assistance</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6 border-b border-dark-border pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Profile Information</h3>
                  <p className="text-sm text-slate-500 mt-1">Detailed contact and location credentials</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mt-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">First Name</label>
                  <p className="text-slate-800 font-medium text-base">{dentist.firstName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Last Name</label>
                  <p className="text-slate-800 font-medium text-base">{dentist.lastName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Company Name</label>
                  <p className="text-slate-800 font-medium text-base">{dentist.companyName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <p className="text-slate-800 font-medium text-base">{dentist.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                  <p className="text-slate-800 font-medium text-base">{dentist.phone}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Primary Address</label>
                  <p className="text-slate-800 font-medium text-base">{dentist.address || '--'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">City</label>
                  <p className="text-slate-800 font-medium text-base">{dentist.city || '--'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">State</label>
                  <p className="text-slate-800 font-medium text-base">{dentist.state || '--'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">ZIP Code</label>
                  <p className="text-slate-800 font-medium text-base">{dentist.zipCode || '--'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Country</label>
                  <p className="text-slate-800 font-medium text-base">{dentist.country || '--'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Registration Date</label>
                  <p className="text-slate-800 font-medium text-base">{new Date(dentist.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
