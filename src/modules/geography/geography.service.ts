import {
  getGeographyRegions,
  getGeographyCommunes,
  getGeographyProvinces,
  getMyIp,
  getHolidaysCL,
} from '../../shared/clients/apisChile.client';

export class GeographyService {
  async getRegions() {
    return getGeographyRegions();
  }

  async getProvinces() {
    return getGeographyProvinces();
  }

  async getCommunes() {
    return getGeographyCommunes();
  }

  async getMyIp() {
    return getMyIp();
  }

  async getHolidays(year?: number) {
    return getHolidaysCL(year);
  }
}

export const geographyService = new GeographyService();
