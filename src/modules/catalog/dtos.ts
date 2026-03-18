export interface ServiceDto {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  precioBaseReferencial: number | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  nombre: string;
  descripcion?: string;
  categoria?: string;
  precioBaseReferencial?: number;
  activo?: boolean;
}

export interface UpdateServiceDto {
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  precioBaseReferencial?: number;
  activo?: boolean;
}

export interface ServiceListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  activo?: boolean;
}
