/**
 * Cliente apis-chile (feriados, geografía, IP).
 * Requiere: npx api install "@apis-chile/v1.0#4fapz6p32rmm0t1qxm" (elegir TypeScript).
 */

import { logger } from '../../config/logger';

// Tipos según respuesta típica de apis-chile
export interface HolidayItem {
  date?: string;
  name?: string;
  [key: string]: unknown;
}

export interface GeographyItem {
  code?: string;
  name?: string;
  [key: string]: unknown;
}

const HOLIDAYS_CACHE = new Map<number, string[]>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hora
const cacheTimestamps = new Map<number, number>();

function getSdk() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@api/apis-chile').default;
  } catch {
    logger.warn('SDK @api/apis-chile no instalado. Ejecutar: npx api install "@apis-chile/v1.0#4fapz6p32rmm0t1qxm"');
    return null;
  }
}

function parseHolidaysToDateStrings(data: unknown): string[] {
  if (!Array.isArray(data)) return [];
  return data
    .map((item: HolidayItem) => item?.date ?? (item as { fecha?: string })?.fecha)
    .filter(Boolean)
    .map((d: string) => (d.includes('T') ? d.slice(0, 10) : d));
}

/**
 * Obtiene feriados legales de Chile (con cache en memoria por año).
 */
export async function getHolidaysCL(year?: number): Promise<string[]> {
  const y = year ?? new Date().getFullYear();
  const now = Date.now();
  if (HOLIDAYS_CACHE.has(y) && (now - (cacheTimestamps.get(y) ?? 0)) < CACHE_TTL_MS) {
    return HOLIDAYS_CACHE.get(y)!;
  }

  const sdk = getSdk();
  if (!sdk?.holidays) {
    return [];
  }

  try {
    const res = await sdk.holidays().catch((err: Error) => {
      logger.error('apisChile.holidays error', { year: y, err: err.message });
      throw err;
    });
    const allDates = parseHolidaysToDateStrings(res?.data ?? []);
    const dates = allDates.filter((d: string) => d.startsWith(String(y)));
    HOLIDAYS_CACHE.set(y, dates);
    cacheTimestamps.set(y, now);
    return dates;
  } catch (err) {
    logger.error('getHolidaysCL failed', { year: y, err });
    throw err;
  }
}

/**
 * Invalida la cache de feriados (útil en tests o tras actualizar datos).
 */
export function clearHolidaysCache(): void {
  HOLIDAYS_CACHE.clear();
  cacheTimestamps.clear();
}

/**
 * Regiones de Chile.
 */
export async function getGeographyRegions(): Promise<GeographyItem[]> {
  const sdk = getSdk();
  if (!sdk?.geographyRegions) throw new Error('SDK apis-chile no disponible');
  const { data } = await sdk.geographyRegions();
  return Array.isArray(data) ? data : [];
}

/**
 * Provincias de Chile.
 */
export async function getGeographyProvinces(): Promise<GeographyItem[]> {
  const sdk = getSdk();
  if (!sdk?.geographyProvinces) throw new Error('SDK apis-chile no disponible');
  const { data } = await sdk.geographyProvinces();
  return Array.isArray(data) ? data : [];
}

/**
 * Comunas de Chile.
 */
export async function getGeographyCommunes(): Promise<GeographyItem[]> {
  const sdk = getSdk();
  if (!sdk?.geographyCommunes) throw new Error('SDK apis-chile no disponible');
  const { data } = await sdk.geographyCommunes();
  return Array.isArray(data) ? data : [];
}

/**
 * Dirección IP del cliente/servidor según la API.
 */
export async function getMyIp(): Promise<{ ip?: string; [key: string]: unknown }> {
  const sdk = getSdk();
  if (!sdk?.showMyIp) throw new Error('SDK apis-chile no disponible');
  const { data } = await sdk.showMyIp();
  return (data as object) ?? {};
}
