import React from 'react';
import { Button } from '@/components/ui/button';
import type { Dentist } from './types';
import { X, MapPin, Phone, Clock, Plus } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dentist: Dentist;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  dentist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-dark-surface border border-dark-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div>
            <h3 className="text-xl font-bold text-white">Locations - Dr. {dentist.firstName} {dentist.lastName}</h3>
            <p className="text-sm text-gray-400 mt-1">{dentist.companyName} • {dentist.locationsCount} locations</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="p-2 hover:bg-dark-elevated rounded-lg">
            <X className="h-6 w-6 text-gray-400 hover:text-white" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-dark-elevated border border-dark-border rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">
                      {i === 0 ? "Main Office - Downtown" : i === 1 ? "Midtown Branch" : "Upper East Side"}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <MapPin className="h-4 w-4 text-accent-primary" />
                      <span>123 Main Street, Suite 200, New York, NY 10001</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-accent-success/20 text-accent-success text-xs rounded-full">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-300">{dentist.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-300">Mon-Fri: 8AM-6PM</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-dark-border p-6">
          <div className="flex items-center justify-between">
            <button className="text-accent-primary hover:text-accent-primary/80 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Location
            </button>
            <Button onClick={onClose} className="bg-accent-primary hover:bg-accent-primary/80 text-white px-6 py-2.5">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
