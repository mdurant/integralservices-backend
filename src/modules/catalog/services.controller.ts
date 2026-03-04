import { Request, Response } from 'express';
import { servicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto, ServiceListQueryDto } from './dtos';

export class ServicesController {
  async list(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as ServiceListQueryDto;
    const result = await servicesService.list(query);
    res.json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await servicesService.getById(id);
    res.json(result);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = req.body as CreateServiceDto;
    const result = await servicesService.create(data);
    res.status(201).json(result);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = req.body as UpdateServiceDto;
    const result = await servicesService.update(id, data);
    res.json(result);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await servicesService.delete(id);
    res.status(204).send();
  }
}

export const servicesController = new ServicesController();
