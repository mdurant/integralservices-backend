import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface RegionAttributes {
  id: number;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RegionCreationAttributes = Optional<RegionAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Region extends Model<RegionAttributes, RegionCreationAttributes> implements RegionAttributes {
  declare id: number;
  declare code: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Region.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
  },
  { sequelize, tableName: 'regions', underscored: true, timestamps: true }
);
