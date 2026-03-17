'use strict';

const now = new Date();
const nationalities = [
  { code: 'CL', label: 'Chile' },
  { code: 'AR', label: 'Argentina' },
  { code: 'VE', label: 'Venezuela' },
  { code: 'CO', label: 'Colombia' },
  { code: 'PE', label: 'Perú' },
  { code: 'EC', label: 'Ecuador' },
  { code: 'BO', label: 'Bolivia' },
  { code: 'PY', label: 'Paraguay' },
  { code: 'UY', label: 'Uruguay' },
  { code: 'BR', label: 'Brasil' },
  { code: 'GY', label: 'Guyana' },
  { code: 'SR', label: 'Surinam' },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('nationalities', nationalities.map(({ code, label }) => ({
      code,
      label,
      created_at: now,
      updated_at: now,
    })));
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('nationalities', null, {});
  },
};
