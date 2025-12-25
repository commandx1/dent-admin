import React from 'react';
import { useParams } from 'react-router-dom';
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

export const DentistDetails = () => {
  const { id } = useParams();

  // Mock data - in a real app this would be fetched based on id
  const dentist = {
    // ... same mock data ...
    id: id || 'DNT-2024-0847',
    firstName: "Sarah",
    lastName: "Mitchell",
    specialization: "General Dentistry",
    clinic: "Smile Dental Clinic",
    status: "Active",
    verified: true,
    email: "sarah.mitchell@smiledental.com",
    phone: "+1 (555) 123-4567",
    locationsCount: 3,
    lastLogin: "2 hours ago",
    memberSince: "Jan 15, 2023",
    licenseNumber: "DDS-NY-847562",
    address: "789 Dental Avenue, Suite 200",
    cityStateZip: "New York, NY 10001",
    specializations: "General Dentistry, Cosmetic",
    experience: "12 years",
    stats: {
      scheduled: 89,
      emergency: 24,
      remote: 43
    }
  };

  return (
    <div className="space-y-6">
      <section id="profile-overview">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <div className="flex flex-col items-center">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                  alt={`Dr. ${dentist.firstName} ${dentist.lastName}`}
                  className="w-32 h-32 rounded-full mb-4"
                />
                <h3 className="text-xl font-bold text-white mb-1">Dr. {dentist.firstName} {dentist.lastName}</h3>
                <p className="text-sm text-gray-400 mb-4">{dentist.specialization}</p>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-accent-success/20 text-accent-success text-xs rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-accent-success rounded-full"></span>
                    {dentist.status}
                  </span>
                  {dentist.verified && (
                    <span className="px-3 py-1 bg-accent-primary/20 text-accent-primary text-xs rounded-full">Verified</span>
                  )}
                </div>
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="text-gray-400 w-5 h-5 shrink-0" />
                    <span className="text-gray-300 truncate">{dentist.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="text-gray-400 w-5 h-5 shrink-0" />
                    <span className="text-gray-300">{dentist.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="text-gray-400 w-5 h-5 shrink-0" />
                    <span className="text-gray-300">{dentist.clinic}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="text-gray-400 w-5 h-5 shrink-0" />
                    <span className="text-gray-300">{dentist.locationsCount} Locations</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="text-gray-400 w-5 h-5 shrink-0" />
                    <span className="text-gray-300">Last login: {dentist.lastLogin}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarPlus className="text-gray-400 w-5 h-5 shrink-0" />
                    <span className="text-gray-300">Member since: {dentist.memberSince}</span>
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
                <h4 className="text-gray-400 text-sm mb-1">Scheduled Appointments</h4>
                <p className="text-3xl font-bold text-white">{dentist.stats.scheduled}</p>
                <p className="text-xs text-gray-500 mt-2">This month</p>
              </div>
              <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-accent-danger/20 rounded-lg flex items-center justify-center">
                    <PhoneCall className="text-accent-danger h-6 w-6" />
                  </div>
                </div>
                <h4 className="text-gray-400 text-sm mb-1">Emergency Calls</h4>
                <p className="text-3xl font-bold text-white">{dentist.stats.emergency}</p>
                <p className="text-xs text-gray-500 mt-2">This month</p>
              </div>
              <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-accent-secondary/20 rounded-lg flex items-center justify-center">
                    <Video className="text-accent-secondary h-6 w-6" />
                  </div>
                </div>
                <h4 className="text-gray-400 text-sm mb-1">Remote Consultations</h4>
                <p className="text-3xl font-bold text-white">{dentist.stats.remote}</p>
                <p className="text-xs text-gray-500 mt-2">This month</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                  <p className="text-sm text-gray-400 mt-1">Complete dentist details and credentials</p>
                </div>
                <Button variant="outline" className="bg-dark-elevated border-none hover:bg-dark-border text-white h-10">
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">First Name</label>
                  <p className="text-white font-medium">{dentist.firstName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Last Name</label>
                  <p className="text-white font-medium">{dentist.lastName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Company Name</label>
                  <p className="text-white font-medium">{dentist.clinic}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">License Number</label>
                  <p className="text-white font-medium">{dentist.licenseNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Email Address</label>
                  <p className="text-white font-medium">{dentist.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                  <p className="text-white font-medium">{dentist.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Primary Address</label>
                  <p className="text-white font-medium">{dentist.address}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">City, State, ZIP</label>
                  <p className="text-white font-medium">{dentist.cityStateZip}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Specialization</label>
                  <p className="text-white font-medium">{dentist.specializations}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Years of Experience</label>
                  <p className="text-white font-medium">{dentist.experience}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Registration Date</label>
                  <p className="text-white font-medium">{dentist.memberSince}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Account Status</label>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent-success/20 text-accent-success text-sm rounded-full">
                    <span className="w-2 h-2 bg-accent-success rounded-full"></span>
                    Active & Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

