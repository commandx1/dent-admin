import React, { useState, useEffect, useCallback } from 'react'
import {
  Package,
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Product } from './types'
import { vendorService } from '@/services/vendorService'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'

interface ProductRowProps {
  product: Product
}

const ProductRow: React.FC<ProductRowProps> = ({ product }) => {
  return (
    <tr key={product.id} className="hover:bg-dark-elevated/30 transition-all">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="min-w-12 h-12 bg-dark-border rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
            {product.coverPhotoPath ? (
              <img
                src={product.coverPhotoPath}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="text-slate-400 h-6 w-6" />
            )}
          </div>
          <div>
            <p className="text-slate-900 font-medium">{product.productName}</p>
            <p className="text-xs text-slate-500">ID: {product.productId.substring(0, 8)}...</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-slate-700 font-mono text-sm">{product.skuCode}</td>
      <td className="py-4 px-6 text-slate-900 font-semibold">${product.price.toFixed(2)}</td>
      <td className="py-4 px-6 text-accent-warning">-${product.discount.toFixed(2)}</td>
      <td className="py-4 px-6 text-accent-success font-semibold">
        ${(product.price - product.discount).toFixed(2)}
      </td>
      <td className="py-4 px-6">
        <span className={cn(
          "font-semibold",
          product.stock < 10 ? "text-accent-danger" : "text-slate-900"
        )}>
          {product.stock}
        </span>
      </td>
    </tr>
  )
}

const ProductRowSkeleton = () => (
  <tr className="animate-pulse border-b border-dark-border">
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-200 rounded-lg" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-20 bg-slate-200 rounded" />
        </div>
      </div>
    </td>
    <td className="py-4 px-6"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
    <td className="py-4 px-6"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
    <td className="py-4 px-6"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
    <td className="py-4 px-6"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
    <td className="py-4 px-6"><div className="h-4 w-8 bg-slate-200 rounded" /></td>
  </tr>
)

export const VendorDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState('sellcount')
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC')

  const fetchProducts = useCallback(async () => {
    if (!id) return
    try {
      setIsLoading(true)
      const data = await vendorService.getVendorProducts(id, currentPage, itemsPerPage, sortBy, sortDirection)
      setProducts(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch vendor products:', error)
    } finally {
      setIsLoading(false)
    }
  }, [id, currentPage, itemsPerPage, sortBy, sortDirection])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortBy(field)
      setSortDirection('ASC')
    }
    setCurrentPage(0)
  }

  return (
    <section id="product-inventory">
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden min-h-[400px] relative">
        <div className="p-6 border-b border-dark-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Product Inventory</h3>
            <p className="text-sm text-slate-500 mt-1">Manage and track product stock and pricing</p>
          </div>
          <Button className="bg-accent-primary hover:bg-accent-primary/80 text-white">
            Add New Product
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-elevated/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                  <SortButton 
                    label="SKU Code" 
                    isActive={sortBy === 'skucode'} 
                    direction={sortBy === 'skucode' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                    onClick={() => handleSort('skucode')}
                  />
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                  <SortButton 
                    label="Price" 
                    isActive={sortBy === 'oldprice'} 
                    direction={sortBy === 'oldprice' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                    onClick={() => handleSort('oldprice')}
                  />
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Discount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Final Price</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {isLoading ? (
                [...Array(5)].map((_, i) => <ProductRowSkeleton key={i} />)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-slate-500">
                    No products found for this vendor.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && totalElements > 0 && (
          <TablePagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            totalItems={totalElements}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page - 1)}
            onItemsPerPageChange={setItemsPerPage}
            itemName="products"
          />
        )}
      </div>
    </section>
  )
}

