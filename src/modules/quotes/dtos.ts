export interface QuoteDto {
  id: string;
  serviceId: string;
  tenantId?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  amount?: number;
  currency?: string;
  validUntil?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuoteDto {
  serviceId: string;
  tenantId?: string;
  amount?: number;
  currency?: string;
  validUntil?: string;
}

export interface UpdateQuoteDto {
  status?: QuoteDto['status'];
  amount?: number;
  currency?: string;
  validUntil?: string;
}

export interface QuoteListQueryDto {
  page?: number;
  limit?: number;
  status?: QuoteDto['status'];
  tenantId?: string;
}
