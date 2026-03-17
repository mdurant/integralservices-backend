'use strict';

const now = new Date();
const sexes = [
  { code: 'M', label: 'Hombre' },
  { code: 'F', label: 'Mujer' },
  { code: 'X', label: 'Otro' },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('sexes', sexes.map(({ code, label }) => ({
      code,
      label,
      created_at: now,
      updated_at: now,
    })));
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('sexes', null, {});
  },
};
