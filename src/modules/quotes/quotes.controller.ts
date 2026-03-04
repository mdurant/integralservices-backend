import { Request, Response } from 'express';
import { quotesService } from './quotes.service';
import { CreateQuoteDto, UpdateQuoteDto, QuoteListQueryDto } from './dtos';

export class QuotesController {
  async list(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as QuoteListQueryDto;
    const result = await quotesService.list(query);
    res.json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await quotesService.getById(id);
    res.json(result);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = req.body as CreateQuoteDto;
    const result = await quotesService.create(data);
    res.status(201).json(result);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = req.body as UpdateQuoteDto;
    const result = await quotesService.update(id, data);
    res.json(result);
  }

  async expire(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await quotesService.expire(id);
    res.status(204).send();
  }
}

export const quotesController = new QuotesController();
