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

export interface VendorDetail {
  name: string;
  surname: string;
  email: string;
  password?: string;
  phoneNumber: string;
  businessDescribe: string;
  address: Address;
}

export interface Product {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  price: number;
  discount: number;
  stock: number;
  active: boolean;
  coverPhotoPath: string;
  skuCode: string;
  subCategoriesId: string;
}
