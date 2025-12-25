import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Dentist } from './types';
import { DentistRow } from './DentistRow';
import { LocationModal } from './LocationModal';
import { ArrowUpDown, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

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
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white">
                      First Name <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-left">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white">
                      Last Name <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-left">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white">
                      Company Name <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-left">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white">
                      Email <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-left">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white">
                      Phone <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-left">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white">
                      Locations <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-left">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white">
                      Last Login <ArrowDown className="h-4 w-4 text-accent-primary" />
                    </button>
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

          {/* Pagination */}
          <div className="px-6 py-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Showing</span>
                <select className="bg-dark-elevated border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-accent-primary">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
                <span className="text-sm text-gray-400">of 248 dentists</span>
              </div>
              <div className="flex items-center gap-2">
                <Button disabled variant="outline" className="px-3 py-1.5 bg-dark-elevated border-none text-gray-400 hover:bg-dark-border">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button className="px-3 py-1.5 bg-accent-primary text-white">1</Button>
                <Button variant="outline" className="px-3 py-1.5 bg-dark-elevated border-none text-gray-400 hover:bg-dark-border">2</Button>
                <Button variant="outline" className="px-3 py-1.5 bg-dark-elevated border-none text-gray-400 hover:bg-dark-border">3</Button>
                <span className="px-2 text-gray-500">...</span>
                <Button variant="outline" className="px-3 py-1.5 bg-dark-elevated border-none text-gray-400 hover:bg-dark-border">25</Button>
                <Button variant="outline" className="px-3 py-1.5 bg-dark-elevated border-none text-gray-400 hover:bg-dark-border">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
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
