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

export interface AdminVendorDocument {
  id: string;
  filePath: string;
  approved: boolean;
  revisionRequested: boolean;
  systemRejected: boolean;
  requestedEdits: string | null;
  invalidRecordsFilePath: string | null;
  revisedFilePath: string | null;
  createdDate: string;
  updatedDate: string;
  name: string;
  ownerId: string;
  deleted: boolean;
}

export interface VendorDocumentListResponse {
  content: AdminVendorDocument[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface RejectDocumentResponse {
  documentId: string;
  success: boolean;
  message: string;
  timestamp: number;
}

export interface ApproveDocumentResponse {
  documentId: string;
  success: boolean;
  message: string;
  importedCount: number;
  failedCount: number;
  invalidRecordsFilePath: string | null;
  timestamp: number;
}

export interface PendingProductReview {
  productId: string;
  productName: string;
  coverPhotoPath: string | null;
  active: boolean;
  createdDate: string;
  userId: string;
  ownerName: string;
  ownerId: string;
  reviewStatusId: string;
  approved: boolean | null;
  rejectedReason: string | null;
  lastReviewedByAdminId: string | null;
  updatedDate: string;
}

export interface PendingProductReviewListResponse {
  content: PendingProductReview[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApproveProductReviewResponse {
  success: boolean;
  message: string;
}

export interface RejectProductReviewResponse {
  success: boolean;
  message: string;
}

/** Response of ecommerce-api GET /api/products/{id} (ProductResponseDto) */
export interface ProductDetail {
  id: string;
  name: string;
  detailedName: string | null;
  aboutProduct: string | null;
  subCategoriesId: string | null;
  reviewCount: number;
  vendorsCount: number;
  overallStar: number;
  barcode: number | null;
  barcodeFormats: string | null;
  active: boolean;
  userId: string | null;
  coverPhotoPath: string | null;
  photoPhats: string[] | null;
  createdDate: string | null;
  description: string | null;
  manufacturerCode: string | null;
  manufacturer: string | null;
  brand: string | null;
  packaging: string | null;
  primaryMarket: string | null;
  scent: string | null;
  size: string | null;
  type: string | null;
  sds: string | null;
  exampleVariationsProductId: string | null;
  categoryLevel1: string | null;
  categoryLevel2: string | null;
  categoryLevel3: string | null;
  categoryLevel4: string | null;
  categoryLevel5: string | null;
  manufacturerSiteProductPage: string | null;
  dentalLicenseRequired: string | null;
  reorderId: string | null;
  referanceNumber: string | null;
  height: number;
  length: number;
  width: number;
  distanceUnit: string | null;
  weight: number;
  massUnit: string | null;
}
