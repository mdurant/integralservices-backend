'use strict';

const now = new Date();
const regions = [
  { code: '01', name: 'Región de Arica y Parinacota' },
  { code: '02', name: 'Región de Tarapacá' },
  { code: '03', name: 'Región de Antofagasta' },
  { code: '04', name: 'Región de Atacama' },
  { code: '05', name: 'Región de Coquimbo' },
  { code: '06', name: 'Región de Valparaíso' },
  { code: '07', name: "Región del Libertador Gral. Bernardo O'Higgins" },
  { code: '08', name: 'Región del Maule' },
  { code: '09', name: 'Región del Biobío' },
  { code: '10', name: 'Región de la Araucanía' },
  { code: '11', name: 'Región de Los Ríos' },
  { code: '12', name: 'Región de Los Lagos' },
  { code: '13', name: 'Región de Aysén del Gral. Carlos Ibáñez del Campo' },
  { code: '14', name: 'Región de Magallanes y de la Antártica Chilena' },
  { code: '15', name: 'Región Metropolitana de Santiago' },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('regions', regions.map(({ code, name }) => ({
      code,
      name,
      created_at: now,
      updated_at: now,
    })));
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('regions', null, {});
  },
};
