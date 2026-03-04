export interface ServiceDto {
  id: string;
  name: string;
  description?: string;
  code: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  code: string;
  active?: boolean;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  code?: string;
  active?: boolean;
}

export interface ServiceListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}
