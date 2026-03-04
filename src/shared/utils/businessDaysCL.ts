/**
 * Utilidades para días hábiles en Chile (CL).
 * Usa apis-chile para feriados legales; considera fines de semana (sábado = 6, domingo = 0).
 */

import { getHolidaysCL } from '../clients/apisChile.client';

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

/**
 * Verifica si una fecha es día hábil en Chile (no fin de semana ni festivo).
 * Versión síncrona: requiere pasar la lista de feriados (obtenida con getHolidaysCL).
 */
export function isBusinessDayCL(date: Date, holidays: string[]): boolean {
  if (isWeekend(date)) return false;
  return !holidays.includes(toDateKey(date));
}

/**
 * Verifica si una fecha es día hábil en Chile (versión async; obtiene feriados de apis-chile).
 */
export async function isBusinessDayCLAsync(date: Date, year?: number): Promise<boolean> {
  const holidays = await getHolidaysCL(year ?? date.getFullYear());
  return isBusinessDayCL(date, holidays);
}

/**
 * Suma N días hábiles a una fecha (Chile).
 * @param date - Fecha base
 * @param days - Cantidad de días hábiles a sumar
 * @param holidays - Lista de fechas feriadas YYYY-MM-DD (obtener con getHolidaysCL)
 */
export function addBusinessDaysCL(date: Date, days: number, holidays: string[]): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDayCL(result, holidays)) added++;
  }
  return result;
}

/**
 * Suma N días hábiles a una fecha (Chile), obteniendo feriados desde apis-chile.
 */
export async function addBusinessDaysCLAsync(
  date: Date,
  days: number,
  year?: number
): Promise<Date> {
  const holidays = await getHolidaysCL(year ?? date.getFullYear());
  return addBusinessDaysCL(date, days, holidays);
}

/**
 * Diferencia en días hábiles entre dos fechas (Chile).
 * @param start - Fecha inicio
 * @param end - Fecha fin (exclusiva)
 * @param holidays - Lista de fechas feriadas (obtener con getHolidaysCL)
 */
export function businessDaysBetweenCL(start: Date, end: Date, holidays: string[]): number {
  const startDate = new Date(start);
  let count = 0;
  while (startDate < end) {
    if (isBusinessDayCL(startDate, holidays)) count++;
    startDate.setDate(startDate.getDate() + 1);
  }
  return count;
}

/**
 * Diferencia en días hábiles entre dos fechas (Chile), con feriados desde apis-chile.
 */
export async function businessDaysBetweenCLAsync(
  start: Date,
  end: Date,
  year?: number
): Promise<number> {
  const holidays = await getHolidaysCL(year ?? start.getFullYear());
  return businessDaysBetweenCL(start, end, holidays);
}
