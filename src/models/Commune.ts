import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface CommuneAttributes {
  id: number;
  code: string;
  name: string;
  region_code: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CommuneCreationAttributes = Optional<CommuneAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Commune extends Model<CommuneAttributes, CommuneCreationAttributes> implements CommuneAttributes {
  declare id: number;
  declare code: string;
  declare name: string;
  declare region_code: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Commune.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    region_code: { type: DataTypes.STRING(10), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
  },
  { sequelize, tableName: 'communes', underscored: true, timestamps: true }
);
