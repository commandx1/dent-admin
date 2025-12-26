import { useState } from 'react';
import type { Dentist } from './types';
import { DentistRow } from './DentistRow';
import { LocationModal } from './LocationModal';
import { ArrowDown } from 'lucide-react';
import { SortButton } from '../common/SortButton';
import { TablePagination } from '../common/TablePagination';

const dentistsData: Dentist[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Mitchell",
    companyName: "Smile Dental Clinic",
    membership: "Premium Member",
    email: "sarah.mitchell@smiledental.com",
    phone: "+1 (555) 123-4567",
    locationsCount: 8,
    lastLogin: "2 hours ago",
    lastLoginDate: "Dec 9, 2024 12:15 PM",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Chen",
    companyName: "Advanced Dental Care",
    membership: "Standard Member",
    email: "michael.chen@advanceddental.com",
    phone: "+1 (555) 234-5678",
    locationsCount: 6,
    lastLogin: "5 hours ago",
    lastLoginDate: "Dec 9, 2024 9:30 AM",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
  },
  {
    id: 3,
    firstName: "Emily",
    lastName: "Rodriguez",
    companyName: "Family Dental Group",
    membership: "Premium Member",
    email: "emily.rodriguez@familydental.com",
    phone: "+1 (555) 345-6789",
    locationsCount: 12,
    lastLogin: "Yesterday",
    lastLoginDate: "Dec 8, 2024 4:45 PM",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
  },
  {
    id: 4,
    firstName: "James",
    lastName: "Wilson",
    companyName: "Premier Dental Studio",
    membership: "Standard Member",
    email: "james.wilson@premierdental.com",
    phone: "+1 (555) 456-7890",
    locationsCount: 4,
    lastLogin: "2 days ago",
    lastLoginDate: "Dec 7, 2024 11:20 AM",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
  },
  {
    id: 5,
    firstName: "Lisa",
    lastName: "Thompson",
    companyName: "Bright Smiles Dentistry",
    membership: "Premium Member",
    email: "lisa.thompson@brightsmiles.com",
    phone: "+1 (555) 567-8901",
    locationsCount: 7,
    lastLogin: "3 days ago",
    lastLoginDate: "Dec 6, 2024 3:15 PM",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg"
  },
  {
    id: 6,
    firstName: "Robert",
    lastName: "Anderson",
    companyName: "Complete Dental Solutions",
    membership: "Standard Member",
    email: "robert.anderson@completedental.com",
    phone: "+1 (555) 678-9012",
    locationsCount: 5,
    lastLogin: "5 days ago",
    lastLoginDate: "Dec 4, 2024 10:30 AM",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
  },
  {
    id: 7,
    firstName: "Jennifer",
    lastName: "Martinez",
    companyName: "Elite Dental Practice",
    membership: "Premium Member",
    email: "jennifer.martinez@elitedental.com",
    phone: "+1 (555) 789-0123",
    locationsCount: 9,
    lastLogin: "1 week ago",
    lastLoginDate: "Dec 2, 2024 2:45 PM",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg"
  },
  {
    id: 8,
    firstName: "David",
    lastName: "Taylor",
    companyName: "Modern Dental Center",
    membership: "Standard Member",
    email: "david.taylor@moderndental.com",
    phone: "+1 (555) 890-1234",
    locationsCount: 3,
    lastLogin: "No recent login",
    lastLoginDate: "Last: Nov 28, 2024",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg"
  }
];

export const DentistManagement = () => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeDentist, setActiveDentist] = useState<Dentist | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const openLocations = (dentist: Dentist) => {
    setActiveDentist(dentist);
    setIsLocationModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Dentists Table */}
      <section id="dentists-table" className="mb-6">
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-elevated border-b border-dark-border">
                  <th className="py-4 px-4 text-left">
                    <SortButton label="First Name" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Last Name" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Company Name" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Email" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Phone" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Locations" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Last Login" icon={ArrowDown} isActive />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <span className="text-sm font-semibold text-gray-300">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dentistsData.map((dentist) => (
                  <DentistRow
                    key={dentist.id}
                    dentist={dentist}
                    onOpenLocations={openLocations}
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

      {activeDentist && (
        <LocationModal 
          isOpen={isLocationModalOpen} 
          onClose={() => setIsLocationModalOpen(false)} 
          dentist={activeDentist} 
        />
      )}
    </div>
  );
};
