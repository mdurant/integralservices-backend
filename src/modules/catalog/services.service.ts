import { Op, WhereOptions } from 'sequelize';
import { Service as ServiceModel } from '../../models';
import {
  ServiceDto,
  CreateServiceDto,
  UpdateServiceDto,
  ServiceListQueryDto,
} from './dtos';
import { HttpError } from '../../shared/errors/httpError';

function toDto(s: ServiceModel): ServiceDto {
  return {
    id: s.id,
    nombre: s.nombre,
    descripcion: s.descripcion ?? null,
    categoria: s.categoria ?? null,
    precioBaseReferencial: s.precio_base_referencial != null ? Number(s.precio_base_referencial) : null,
    activo: s.activo,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

export class ServicesService {
  async list(query: ServiceListQueryDto): Promise<{ data: ServiceDto[]; total: number }> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const offset = (page - 1) * limit;
    const searchTerm = query.search?.trim();
    const where: WhereOptions<ServiceModel> =
      searchTerm
        ? {
            ...(query.activo !== undefined && { activo: query.activo }),
            [Op.or]: [
              { nombre: { [Op.like]: `%${searchTerm}%` } },
              { descripcion: { [Op.like]: `%${searchTerm}%` } },
              { categoria: { [Op.like]: `%${searchTerm}%` } },
            ],
          }
        : query.activo !== undefined
          ? { activo: query.activo }
          : {};
    const { rows, count } = await ServiceModel.findAndCountAll({
      where,
      order: [['nombre', 'ASC']],
      limit,
      offset,
    });
    return { data: rows.map(toDto), total: count };
  }

  async getById(id: string): Promise<ServiceDto> {
    const s = await ServiceModel.findByPk(id);
    if (!s) throw HttpError.notFound(`Servicio ${id} no encontrado`);
    return toDto(s);
  }

  async create(data: CreateServiceDto): Promise<ServiceDto> {
    const s = await ServiceModel.create({
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() ?? null,
      categoria: data.categoria?.trim() ?? null,
      precio_base_referencial: data.precioBaseReferencial ?? null,
      activo: data.activo ?? true,
    });
    return toDto(s);
  }

  async update(id: string, data: UpdateServiceDto): Promise<ServiceDto> {
    const s = await ServiceModel.findByPk(id);
    if (!s) throw HttpError.notFound(`Servicio ${id} no encontrado`);
    await s.update({
      ...(data.nombre !== undefined && { nombre: data.nombre.trim() }),
      ...(data.descripcion !== undefined && { descripcion: data.descripcion?.trim() ?? null }),
      ...(data.categoria !== undefined && { categoria: data.categoria?.trim() ?? null }),
      ...(data.precioBaseReferencial !== undefined && { precio_base_referencial: data.precioBaseReferencial }),
      ...(data.activo !== undefined && { activo: data.activo }),
    });
    return toDto(s);
  }

  async delete(id: string): Promise<void> {
    const s = await ServiceModel.findByPk(id);
    if (!s) throw HttpError.notFound(`Servicio ${id} no encontrado`);
    await s.update({ activo: false });
  }
}

export const servicesService = new ServicesService();
