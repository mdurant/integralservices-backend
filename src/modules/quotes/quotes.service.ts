import {
  QuoteDto,
  CreateQuoteDto,
  UpdateQuoteDto,
  QuoteListQueryDto,
} from './dtos';
import { HttpError } from '../../shared/errors/httpError';

export class QuotesService {
  async list(_query: QuoteListQueryDto): Promise<{ data: QuoteDto[]; total: number }> {
    // TODO: listar desde DB con paginación
    return { data: [], total: 0 };
  }

  async getById(id: string): Promise<QuoteDto> {
    // TODO: obtener por id
    throw HttpError.notFound(`Quote ${id} not found`);
  }

  async create(data: CreateQuoteDto): Promise<QuoteDto> {
    // TODO: crear en DB, programar job de expiración si validUntil
    throw HttpError.notFound('QuotesService.create not implemented');
  }

  async update(id: string, data: UpdateQuoteDto): Promise<QuoteDto> {
    // TODO: actualizar en DB
    throw HttpError.notFound('QuotesService.update not implemented');
  }

  async expire(id: string): Promise<void> {
    // TODO: marcar como expirada
    throw HttpError.notFound('QuotesService.expire not implemented');
  }
}

export const quotesService = new QuotesService();
