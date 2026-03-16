/**
 * Listado de nacionalidades para el perfil (select).
 * Formato: { value, label }.
 */
export const NACIONALIDADES = [
  { value: 'CL', label: 'Chile' },
  { value: 'AR', label: 'Argentina' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'BR', label: 'Brasil' },
  { value: 'CO', label: 'Colombia' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Perú' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'MX', label: 'México' },
  { value: 'ES', label: 'España' },
  { value: 'US', label: 'Estados Unidos' },
  { value: 'OTRO', label: 'Otro' },
] as const;

export type NacionalidadValue = (typeof NACIONALIDADES)[number]['value'];
