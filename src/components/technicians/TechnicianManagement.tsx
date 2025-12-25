import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building, 
  User, 
  Plus, 
  SortAsc, 
  ChevronLeft, 
  ChevronRight,
  Download
} from 'lucide-react';
import type { Technician } from './types';
import { TechnicianRow } from './TechnicianRow';

const techniciansData: Technician[] = [
  {
    id: 'TCH-2024-1247',
    name: 'John Smith',
    type: 'Company',
    companyName: 'TechCare Solutions',
    email: 'john.smith@techcare.com',
    phone: '+1 (555) 123-4567',
    jobsCompleted: 98,
    jobsThisMonth: 12,
    rating: 4.9,
    reviewsCount: 142,
    status: 'Active',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
    subTechnicians: [
      {
        id: 'TCH-2024-1247-1',
        name: 'Alex Rivera',
        type: 'Individual',
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
        type: 'Individual',
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
    id: 'TCH-2024-1246',
    name: 'Robert Johnson',
    type: 'Company',
    companyName: 'ProTech Services',
    email: 'robert.j@protech.com',
    phone: '+1 (555) 234-5678',
    jobsCompleted: 87,
    jobsThisMonth: 9,
    rating: 4.8,
    reviewsCount: 98,
    status: 'Active',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
    subTechnicians: [
      {
        id: 'TCH-2024-1246-1',
        name: 'Mike Ross',
        type: 'Individual',
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
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg',
    mobileAdded: true
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
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    mobileAdded: true
  },
  {
    id: 'TCH-2024-1243',
    name: 'Daniel Brown',
    type: 'Company',
    companyName: 'Swift Tech Solutions',
    email: 'daniel.b@swifttech.com',
    phone: '+1 (555) 567-8901',
    jobsCompleted: 76,
    jobsThisMonth: 10,
    rating: 4.6,
    reviewsCount: 64,
    status: 'Active',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
  },
  {
    id: 'TCH-2024-1242',
    name: 'Michael Anderson',
    type: 'Company',
    companyName: 'Elite Dental Tech',
    email: 'm.anderson@elitetech.com',
    phone: '+1 (555) 678-9012',
    jobsCompleted: 71,
    jobsThisMonth: 7,
    rating: 4.5,
    reviewsCount: 52,
    status: 'Inactive',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg'
  }
];

export const TechnicianManagement = () => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <section id="technicians-stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-accent-secondary transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-secondary/20 rounded-lg flex items-center justify-center">
                <Users className="text-accent-secondary h-6 w-6" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Technicians</h3>
            <p className="text-3xl font-bold text-white">156</p>
            <p className="text-xs text-gray-500 mt-2">Active professionals</p>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-accent-primary transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                <Building className="text-accent-primary h-6 w-6" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Company Technicians</h3>
            <p className="text-3xl font-bold text-white">89</p>
            <p className="text-xs text-gray-500 mt-2">From 24 companies</p>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-accent-warning transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-warning/20 rounded-lg flex items-center justify-center">
                <User className="text-accent-warning h-6 w-6" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Individual Technicians</h3>
            <p className="text-3xl font-bold text-white">67</p>
            <p className="text-xs text-gray-500 mt-2">Independent workers</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
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
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border text-left">
                  <th className="w-10 py-4 px-4"></th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-400">
                    <button className="flex items-center gap-2 hover:text-white transition-all">
                      Name <SortAsc className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    <button className="flex items-center gap-2 hover:text-white transition-all">
                      Type <SortAsc className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    <button className="flex items-center gap-2 hover:text-white transition-all">
                      Company/EIN <SortAsc className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Contact</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    <button className="flex items-center gap-2 hover:text-white transition-all">
                      Jobs Completed <SortAsc className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    <button className="flex items-center gap-2 hover:text-white transition-all">
                      Rating <SortAsc className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {techniciansData.map((tech) => (
                  <TechnicianRow key={tech.id} technician={tech} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-dark-border">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Showing</span>
              <select className="bg-dark-elevated border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-primary">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="text-sm text-gray-400">of 156 technicians</span>
            </div>
            <div className="flex items-center gap-2">
              <Button disabled variant="outline" className="px-3 py-2 bg-dark-elevated border-none text-gray-400">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button className="px-4 py-2 bg-accent-primary text-white">1</Button>
              <Button variant="outline" className="px-4 py-2 bg-dark-elevated border-none text-gray-400">2</Button>
              <Button variant="outline" className="px-4 py-2 bg-dark-elevated border-none text-gray-400">3</Button>
              <span className="px-3 py-2 text-gray-500">...</span>
              <Button variant="outline" className="px-4 py-2 bg-dark-elevated border-none text-gray-400">16</Button>
              <Button variant="outline" className="px-3 py-2 bg-dark-elevated border-none text-gray-400">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
