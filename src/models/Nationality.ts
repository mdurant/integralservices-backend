import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface NationalityAttributes {
  id: number;
  code: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NationalityCreationAttributes = Optional<NationalityAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Nationality extends Model<NationalityAttributes, NationalityCreationAttributes> implements NationalityAttributes {
  declare id: number;
  declare code: string;
  declare label: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Nationality.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    label: { type: DataTypes.STRING(80), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
  },
  { sequelize, tableName: 'nationalities', underscored: true, timestamps: true }
);
