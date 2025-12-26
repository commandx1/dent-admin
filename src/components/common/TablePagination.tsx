import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
  itemName?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemName = 'items'
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="p-6 border-t border-dark-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Showing {startItem}-{endItem}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Rows per page:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-dark-elevated border border-dark-border rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-accent-primary"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <span className="text-sm text-gray-400">of {totalItems} {itemName}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)}
          variant="outline" 
          className="px-3 py-1.5 bg-dark-elevated border-none text-gray-400 hover:bg-dark-border"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Simple page numbers */}
        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(page => (
          <Button 
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-lg text-sm ${currentPage === page ? 'bg-accent-primary text-white' : 'bg-dark-elevated border-none text-gray-400 hover:bg-dark-border'}`}
          >
            {page}
          </Button>
        ))}
        {totalPages > 3 && <span className="px-2 text-gray-500">...</span>}
        {totalPages > 3 && (
          <Button 
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1.5 rounded-lg text-sm ${currentPage === totalPages ? 'bg-accent-primary text-white' : 'bg-dark-elevated border-none text-gray-400 hover:bg-dark-border'}`}
          >
            {totalPages}
          </Button>
        )}

        <Button 
          disabled={currentPage === totalPages} 
          onClick={() => onPageChange(currentPage + 1)}
          variant="outline" 
          className="px-3 py-1.5 bg-dark-elevated border-none text-gray-400 hover:bg-dark-border"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

