export interface InvoiceItem {
  product_id?: string;
  custom_product_name: string;
  quantity: number;
  unit_price: number;
}

export interface CreateInvoiceResponse {
  appointment_id: string;
  description: string;
  items: InvoiceItem[];
}
