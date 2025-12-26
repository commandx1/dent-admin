import { 
  Users, 
  Building, 
  User, 
  Plus, 
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TableItem } from './types';
import { TechnicianRow } from './TechnicianRow';
import { StatsCard } from '../common/StatsCard';
import { TablePagination } from '../common/TablePagination';
import { SortButton } from '../common/SortButton';
import { useState } from 'react';

const techniciansData: TableItem[] = [
  {
    id: 'COMP-001',
    companyName: 'TechCare Solutions',
    type: 'Company',
    technicians: [
      {
        id: 'TCH-2024-1247',
        name: 'John Smith',
        type: 'Headquarter',
        email: 'john.smith@techcare.com',
        phone: '+1 (555) 123-4567',
        jobsCompleted: 98,
        jobsThisMonth: 12,
        rating: 4.9,
        reviewsCount: 142,
        status: 'Active',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg'
      },
      {
        id: 'TCH-2024-1247-1',
        name: 'Alex Rivera',
        type: 'Member',
        email: 'alex.r@techcare.com',
        phone: '+1 (555) 111-2222',
        jobsCompleted: 45,
        jobsThisMonth: 5,
        rating: 4.8,
        reviewsCount: 32,
        status: 'Active',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
      },
      {
        id: 'TCH-2024-1247-2',
        name: 'Sarah Connor',
        type: 'Member',
        email: 'sarah.c@techcare.com',
        phone: '+1 (555) 111-3333',
        jobsCompleted: 38,
        jobsThisMonth: 4,
        rating: 4.7,
        reviewsCount: 28,
        status: 'Active',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg'
      }
    ]
  },
  {
    id: 'COMP-002',
    companyName: 'ProTech Services',
    type: 'Company',
    technicians: [
      {
        id: 'TCH-2024-1246',
        name: 'Robert Johnson',
        type: 'Headquarter',
        email: 'robert.j@protech.com',
        phone: '+1 (555) 234-5678',
        jobsCompleted: 87,
        jobsThisMonth: 9,
        rating: 4.8,
        reviewsCount: 98,
        status: 'Active',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg'
      },
      {
        id: 'TCH-2024-1246-1',
        name: 'Mike Ross',
        type: 'Member',
        email: 'mike.r@protech.com',
        phone: '+1 (555) 222-1111',
        jobsCompleted: 22,
        jobsThisMonth: 3,
        rating: 4.6,
        reviewsCount: 12,
        status: 'Active',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg'
      }
    ]
  },
  {
    id: 'TCH-2024-1245',
    name: 'David Martinez',
    type: 'Individual',
    email: 'david.m@email.com',
    phone: '+1 (555) 345-6789',
    jobsCompleted: 82,
    jobsThisMonth: 11,
    rating: 4.7,
    reviewsCount: 76,
    status: 'Active',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg'
  },
  {
    id: 'TCH-2024-1244',
    name: 'Christopher Lee',
    type: 'Individual',
    email: 'chris.lee@email.com',
    phone: '+1 (555) 456-7890',
    jobsCompleted: 79,
    jobsThisMonth: 8,
    rating: 4.8,
    reviewsCount: 89,
    status: 'Active',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg'
  }
];

export const TechnicianManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <section id="technicians-stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Total Technicians"
            value="156"
            description="Active professionals"
            icon={Users}
            accentColor="secondary"
          />
          <StatsCard 
            title="Company Technicians"
            value="89"
            description="From 24 companies"
            icon={Building}
            accentColor="primary"
          />
          <StatsCard 
            title="Individual Technicians"
            value="67"
            description="Independent workers"
            icon={User}
            accentColor="warning"
          />
        </div>
      </section>

      {/* Quick Actions */}
      {/* ... (actions section can stay as is or be refactored too, but let's focus on the repetitive parts) */}
      <section id="technicians-actions">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
              <p className="text-sm text-gray-400">Create new technician profiles</p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-accent-primary hover:bg-accent-primary/80 text-white px-6 py-2 h-11">
                <Building className="h-4 w-4 mr-2" /> Create Company Technician
              </Button>
              <Button className="bg-accent-secondary hover:bg-accent-secondary/80 text-white px-6 py-2 h-11">
                <Plus className="h-4 w-4 mr-2" /> Create Individual Technician
              </Button>
              <Button variant="outline" className="bg-dark-elevated hover:bg-dark-border text-white border-none px-6 py-2 h-11">
                <Download className="h-4 w-4 mr-2" /> Export List
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Table section */}
      <section id="technicians-table">
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-elevated border-b border-dark-border">
                  <th className="w-10 py-4 px-4"></th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Name" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Type" />
                  </th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-300 text-left">Contact</th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Jobs Completed" />
                  </th>
                  <th className="py-4 px-4 text-left">
                    <SortButton label="Rating" />
                  </th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-300 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {techniciansData.map((item) => (
                  <TechnicianRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={16}
            totalItems={156}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemName="technicians"
          />
        </div>
      </section>
    </div>
  );
};
