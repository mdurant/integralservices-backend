/**
 * Declaración de tipos para @api/apis-chile (generado por npx api install).
 * El SDK real se instala con: npx api install "@apis-chile/v1.0#4fapz6p32rmm0t1qxm"
 */
declare module '@api/apis-chile' {
  interface ApiResponse<T> {
    data: T;
    status?: number;
    headers?: Record<string, string>;
    res?: unknown;
  }

  interface ApisChileClient {
    holidays(params?: { year?: number }): Promise<ApiResponse<unknown>>;
    geographyRegions(): Promise<ApiResponse<unknown>>;
    geographyProvinces(): Promise<ApiResponse<unknown>>;
    geographyCommunes(): Promise<ApiResponse<unknown>>;
    showMyIp(): Promise<ApiResponse<unknown>>;
  }

  const client: ApisChileClient;
  export default client;
}
