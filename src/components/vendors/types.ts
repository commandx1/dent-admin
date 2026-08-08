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

export interface PendingProductVendor {
  userId: string;
  name: string;
  surname: string;
  companyId: string | null;
  companyName: string | null;
  ownerName: string;
  ownerId: string;
  pendingProductCount: number;
  latestProductCreatedDate: string | null;
  latestReviewUpdatedDate: string | null;
}

export interface PendingProductVendorListResponse {
  content: PendingProductVendor[];
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

export type VendorLicenseType = 'DEA' | 'STATE_DENTAL';

export interface VendorLicense {
  id: string;
  userId: string;
  licenseType: VendorLicenseType;
  stateOfLicense: string | null;
  licenseNumber: string;
  year: number;
  month: number;
  day: number;
  /** Null: pending review, true: approved, false: rejected. */
  approved: boolean | null;
  rejectDescription: string | null;
  createdDate: string;
  updatedDate: string;
  lastReviewedByAdminId: string | null;
  lastReviewedByAdminName: string | null;
  lastReviewedByAdminSurname: string | null;
  /** Owner name - company name if a company, otherwise user name. */
  name: string;
  ownerId: string;
  deleted: boolean;
}

export interface VendorLicenseListResponse {
  content: VendorLicense[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApproveVendorLicenseResponse {
  licenseId: string;
  success: boolean;
  message: string;
  timestamp: number;
}

export interface RejectVendorLicenseResponse {
  licenseId: string;
  success: boolean;
  message: string;
  timestamp: number;
}

/** `product` field of dt-admin-api's PendingProductDetailsResponseDto */
export interface ProductDetail {
  id: string;
  name: string;
  aboutProduct: string | null;
  userProductId: string | null;
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
  height: number;
  length: number;
  width: number;
  distanceUnit: string | null;
  weight: number;
  massUnit: string | null;
}

/** Nested shape of dt-admin-api's PendingProductDetailsResponseDto */
export interface PendingProductDetailsResponse {
  product: ProductDetail;
  attributes: Array<{
    id: string;
    productId: string;
    attributeName: string;
    attributeValue: string;
  }>;
  userProduct: {
    id: string;
    userId: string;
    productId: string;
    skuCode: string | null;
    oldPrice: number;
    price: number;
    discount: number;
    stock: number;
    active: boolean;
    sellCount: number;
    shipmentFee: number;
    heavyShippingSurcharge: number | null;
    exportPackaging: boolean | null;
    fulfillmentPolicy: string | null;
  };
}
