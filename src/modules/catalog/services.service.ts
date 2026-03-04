import {
  ServiceDto,
  CreateServiceDto,
  UpdateServiceDto,
  ServiceListQueryDto,
} from './dtos';
import { HttpError } from '../../shared/errors/httpError';

export class ServicesService {
  async list(_query: ServiceListQueryDto): Promise<{ data: ServiceDto[]; total: number }> {
    // TODO: listar desde DB con paginación
    return { data: [], total: 0 };
  }

  async getById(id: string): Promise<ServiceDto> {
    // TODO: obtener por id
    throw HttpError.notFound(`Service ${id} not found`);
  }

  async create(data: CreateServiceDto): Promise<ServiceDto> {
    // TODO: crear en DB
    throw HttpError.notFound('ServicesService.create not implemented');
  }

  async update(id: string, data: UpdateServiceDto): Promise<ServiceDto> {
    // TODO: actualizar en DB
    throw HttpError.notFound('ServicesService.update not implemented');
  }

  async delete(id: string): Promise<void> {
    // TODO: soft delete o hard delete
    throw HttpError.notFound('ServicesService.delete not implemented');
  }
}

export const servicesService = new ServicesService();
