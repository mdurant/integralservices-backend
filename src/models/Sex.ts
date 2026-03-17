import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface SexAttributes {
  id: number;
  code: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SexCreationAttributes = Optional<SexAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Sex extends Model<SexAttributes, SexCreationAttributes> implements SexAttributes {
  declare id: number;
  declare code: string;
  declare label: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Sex.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    label: { type: DataTypes.STRING(20), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
  },
  { sequelize, tableName: 'sexes', underscored: true, timestamps: true }
);
