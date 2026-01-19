export interface Vendor {
  id: string;
  name: string;
  vendorId: string;
  contactPerson: string;
  email: string;
  phone: string;
  totalProducts: number;
  activeProducts: number;
  soldCount: number;
  memberSince: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface Address {
  title: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  district: string;
  postalCode: string;
  addressLine: string;
  defaultAddress: boolean;
  latitude: number;
  longitude: number;
  placeId: string;
  formattedAddress: string;
}

export interface Product {
  id: string;
  productId: string;
  productName: string;
  price: number;
  oldPrice: number;
  discount: number;
  stock: number;
  active: boolean;
  coverPhotoPath: string | null;
  skuCode: string;
  sellCount: number;
  barcode: string | null;
  barcodeFormats: string | null;
  manufacturerCode: string | null;
}

export interface VendorProductResponse {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface VendorStatistics {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalSales: number;
  lowStockProducts: number;
  totalVendors: number;
  lockedVendors: number;
}

export interface VendorAPIItem {
  id: string;
  name: string;
  surname: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  accessFailedCount: number;
  createdDate: string;
  totalProducts: number;
  activeProducts: number;
  fullName: string;
}

export interface VendorListResponse {
  content: VendorAPIItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
