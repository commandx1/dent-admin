import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Globe, 
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VendorDetail, Product } from './types';
import { StatusBadge } from '../common/StatusBadge';

const mockVendorDetail: VendorDetail = {
  name: "Enis",
  surname: "Atay",
  email: "ataymustafaenis@gmail.com",
  password: "Password1234!!",
  phoneNumber: "5551234567",
  businessDescribe: "Dental_Service_Industry",
  address: {
    title: "Home",
    fullName: "Enis Atay",
    phoneNumber: "5551234567",
    country: "United States",
    state: "California",
    city: "New York",
    district: "Manhattan",
    postalCode: "10001",
    addressLine: "350 5th Ave, Apt 12B",
    defaultAddress: true,
    latitude: 34.102871, 
    longitude: -118.337581, 
    placeId: "ChIJb_kY-XfIwoARh5vV8oJtD7w", 
    formattedAddress: "6925 Hollywood Blvd, Los Angeles, CA 90028, USA"
  }
};

const mockProducts: Product[] = [
  {
    id: "68a59fea-e466-4969-8811-1ea0833bb5a3",
    userId: "81441531-af03-49b0-8b6f-f6103e51bfc1",
    productId: "f9e79c1e-411f-454e-8f36-543ff4374c8c",
    productName: "Premium Dental Crown",
    price: 120.5,
    discount: 10,
    stock: 50,
    active: true,
    coverPhotoPath: "https://storage.googleapis.com/uxpilot-auth.appspot.com/5d889bf8dc-d29a23cb1ac828ed9751.png",
    skuCode: "123",
    subCategoriesId: "12345"
  },
  {
    id: "68a59fea-e466-4969-8811-1ea0833bb5a4",
    userId: "81441531-af03-49b0-8b6f-f6103e51bfc1",
    productId: "f9e79c1e-411f-454e-8f36-543ff4374c8c",
    productName: "Implant Starter Kit",
    price: 589.0,
    discount: 25,
    stock: 89,
    active: true,
    coverPhotoPath: "https://storage.googleapis.com/uxpilot-auth.appspot.com/5d889bf8dc-d29a23cb1ac828ed9751.png",
    skuCode: "SKU-994",
    subCategoriesId: "12345"
  },
  {
    id: "68a59fea-e466-4969-8811-1ea0833bb5a5",
    userId: "81441531-af03-49b0-8b6f-f6103e51bfc1",
    productId: "f9e79c1e-411f-454e-8f36-543ff4374c8c",
    productName: "Orthodontic Brackets",
    price: 125.0,
    discount: 0,
    stock: 7,
    active: false,
    coverPhotoPath: "https://storage.googleapis.com/uxpilot-auth.appspot.com/5d889bf8dc-d29a23cb1ac828ed9751.png",
    skuCode: "SKU-995",
    subCategoriesId: "12345"
  }
];

interface ProductRowProps {
  product: Product;
}

const ProductRow: React.FC<ProductRowProps> = ({ product }) => {
  const [isActive, setIsActive] = useState(product.active);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <tr key={product.id} className="hover:bg-dark-elevated/30 transition-all">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-dark-border rounded-lg overflow-hidden shrink-0">
            <img 
              src={product.coverPhotoPath} 
              alt={product.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-white font-medium">{product.productName}</p>
            <p className="text-xs text-gray-400">ID: {product.productId.substring(0, 8)}...</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-300 font-mono text-sm">{product.skuCode}</td>
      <td className="py-4 px-6 text-white font-semibold">${product.price.toFixed(2)}</td>
      <td className="py-4 px-6 text-accent-warning">-${product.discount.toFixed(2)}</td>
      <td className="py-4 px-6 text-accent-success font-semibold">
        ${(product.price - product.discount).toFixed(2)}
      </td>
      <td className="py-4 px-6">
        <span className={cn(
          "font-semibold",
          product.stock < 10 ? "text-accent-danger" : "text-white"
        )}>
          {product.stock}
        </span>
      </td>
      <td className="py-4 px-6">
        <StatusBadge 
          status={isActive ? 'Active' : 'Inactive'}
          type={isActive ? 'success' : 'default'}
          onToggle={handleToggle}
        />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <button className="text-accent-primary hover:text-accent-primary/80 transition-colors p-2 hover:bg-accent-primary/10 rounded-lg">
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const VendorDetails = () => {
  return (
    <div className="space-y-8">
      {/* Vendor Profile Section */}
      <section id="vendor-profile">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-accent-primary/20 rounded-2xl flex items-center justify-center mb-4">
                  <Building className="text-accent-primary h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{mockVendorDetail.name} {mockVendorDetail.surname}</h3>
                <p className="text-sm text-gray-400 mb-4">{mockVendorDetail.businessDescribe}</p>
                
                <div className="w-full space-y-3 pt-4 border-t border-dark-border">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="text-gray-400 w-4 h-4 shrink-0" />
                    <span className="text-gray-300 truncate">{mockVendorDetail.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="text-gray-400 w-4 h-4 shrink-0" />
                    <span className="text-gray-300">{mockVendorDetail.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="text-gray-400 w-4 h-4 shrink-0" />
                    <span className="text-gray-300">{mockVendorDetail.address.country}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="text-gray-400 w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-gray-300 leading-relaxed">
                      {mockVendorDetail.address.addressLine}, {mockVendorDetail.address.city}, {mockVendorDetail.address.state} {mockVendorDetail.address.postalCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="lg:col-span-3">
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-white">Business Information</h3>
                  <p className="text-sm text-gray-400 mt-1">Vendor account and contact details</p>
                </div>
                <Button variant="outline" className="bg-dark-elevated border-none hover:bg-dark-border text-white h-10">
                  <Edit className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">First Name</label>
                  <p className="text-white font-medium">{mockVendorDetail.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Last Name</label>
                  <p className="text-white font-medium">{mockVendorDetail.surname}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Email Address</label>
                  <p className="text-white font-medium">{mockVendorDetail.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                  <p className="text-white font-medium">{mockVendorDetail.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Business Type</label>
                  <p className="text-white font-medium">{mockVendorDetail.businessDescribe.replaceAll('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">ZIP Code</label>
                  <p className="text-white font-medium">{mockVendorDetail.address.postalCode}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Address</label>
                  <p className="text-white font-medium">{mockVendorDetail.address.formattedAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Inventory Section */}
      <section id="product-inventory">
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-dark-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Product Inventory</h3>
              <p className="text-sm text-gray-400 mt-1">Manage and track product stock and pricing</p>
            </div>
            <Button className="bg-accent-primary hover:bg-accent-primary/80 text-white">
              Add New Product
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-elevated/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Product</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">SKU Code</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Discount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Final Price</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Stock</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {mockProducts.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

