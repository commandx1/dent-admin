import { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  MapPin, 
  Search, 
  Filter, 
  Plus, 
  Download 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DentistRow } from './DentistRow';
import { LocationModal } from './LocationModal';
import type { Dentist } from './types';
import { StatsCard } from '../common/StatsCard';
import { TablePagination } from '../common/TablePagination';
import { SortButton } from '../common/SortButton';

const dentistsData: Dentist[] = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Mitchell',
    companyName: 'Smile Dental Clinic',
    membership: 'Premium Member',
    email: 'sarah.mitchell@smileclinic.com',
    phone: '+1 (555) 123-4567',
    locationsCount: 3,
    lastLogin: 'Today, 2:30 PM',
    lastLoginDate: 'Dec 8, 2024',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg'
  },
  {
    id: 2,
    firstName: 'Michael',
    lastName: 'Chen',
    companyName: 'Advanced Dental Care',
    membership: 'Standard Member',
    email: 'm.chen@advanceddental.com',
    phone: '+1 (555) 234-5678',
    locationsCount: 2,
    lastLogin: 'Yesterday, 11:15 AM',
    lastLoginDate: 'Dec 7, 2024',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg'
  },
  {
    id: 3,
    firstName: 'Emily',
    lastName: 'Rodriguez',
    companyName: 'Family Dental Group',
    membership: 'Premium Member',
    email: 'e.rodriguez@familydental.com',
    phone: '+1 (555) 345-6789',
    locationsCount: 4,
    lastLogin: '2 days ago, 4:45 PM',
    lastLoginDate: 'Dec 6, 2024',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
  },
  {
    id: 4,
    firstName: 'David',
    lastName: 'Wilson',
    companyName: 'Wilson Dentistry',
    membership: 'Standard Member',
    email: 'd.wilson@wilsondentistry.com',
    phone: '+1 (555) 456-7890',
    locationsCount: 1,
    lastLogin: 'Dec 5, 2024, 10:20 AM',
    lastLoginDate: 'Dec 5, 2024',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg'
  }
];

export const DentistManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleOpenLocations = (dentist: Dentist) => {
    setSelectedDentist(dentist);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <section id="dentists-stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Total Dentists"
            value="248"
            description="Active accounts"
            icon={Users}
            accentColor="primary"
          />
          <StatsCard 
            title="Premium Members"
            value="156"
            description="63% of total"
            icon={UserCheck}
            accentColor="success"
          />
          <StatsCard 
            title="Service Locations"
            value="482"
            description="Across 12 states"
            icon={MapPin}
            accentColor="warning"
          />
        </div>
      </section>

      {/* Actions & Filters */}
      <section id="dentists-actions">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, email or clinic..."
                className="w-full pl-10 pr-4 py-2 bg-dark-elevated border-none rounded-lg focus:ring-2 focus:ring-accent-primary/20 text-slate-800 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-dark-elevated border-none hover:bg-dark-border text-slate-800 px-4 py-2 h-10">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
              <Button variant="outline" className="bg-dark-elevated border-none hover:bg-dark-border text-slate-800 px-4 py-2 h-10">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button className="bg-accent-primary hover:bg-accent-primary/80 text-white px-6 py-2 h-10">
                <Plus className="h-4 w-4 mr-2" /> Add Dentist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section id="dentists-table">
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-elevated border-b border-dark-border text-left">
                  <th className="py-4 px-4">
                    <SortButton label="First Name" />
                  </th>
                  <th className="py-4 px-4">
                    <SortButton label="Last Name" />
                  </th>
                  <th className="py-4 px-4">
                    <SortButton label="Clinic / Membership" />
                  </th>
                  <th className="py-4 px-4 text-sm font-semibold text-slate-700">Email</th>
                  <th className="py-4 px-4 text-sm font-semibold text-slate-700">Phone</th>
                  <th className="py-4 px-4">
                    <SortButton label="Locations" />
                  </th>
                  <th className="py-4 px-4">
                    <SortButton label="Last Login" />
                  </th>
                  <th className="py-4 px-4 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {dentistsData.map((dentist) => (
                  <DentistRow 
                    key={dentist.id} 
                    dentist={dentist} 
                    onOpenLocations={handleOpenLocations}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={25}
            totalItems={248}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemName="dentists"
          />
        </div>
      </section>

      {selectedDentist && (
        <LocationModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          dentist={selectedDentist}
        />
      )}
    </div>
  );
};

