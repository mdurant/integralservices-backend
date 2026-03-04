import { Request, Response } from 'express';
import { geographyService } from './geography.service';

export class GeographyController {
  async getRegions(_req: Request, res: Response): Promise<void> {
    const data = await geographyService.getRegions();
    res.json({ data });
  }

  async getProvinces(_req: Request, res: Response): Promise<void> {
    const data = await geographyService.getProvinces();
    res.json({ data });
  }

  async getCommunes(_req: Request, res: Response): Promise<void> {
    const data = await geographyService.getCommunes();
    res.json({ data });
  }

  async getMyIp(_req: Request, res: Response): Promise<void> {
    const data = await geographyService.getMyIp();
    res.json(data);
  }

  async getHolidays(req: Request, res: Response): Promise<void> {
    const year = req.query.year ? Number(req.query.year) : undefined;
    const data = await geographyService.getHolidays(year);
    res.json({ data });
  }
}

export const geographyController = new GeographyController();
