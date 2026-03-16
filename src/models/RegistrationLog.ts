import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface RegistrationLogAttributes {
  id: number;
  user_id: string;
  event: string;
  ip: string | null;
  user_agent: string | null;
  created_at: Date;
}

export type RegistrationLogCreationAttributes = Optional<RegistrationLogAttributes, 'id' | 'ip' | 'user_agent' | 'created_at'>;

export class RegistrationLog extends Model<RegistrationLogAttributes, RegistrationLogCreationAttributes> implements RegistrationLogAttributes {
  declare id: number;
  declare user_id: string;
  declare event: string;
  declare ip: string | null;
  declare user_agent: string | null;
  declare created_at: Date;
}

RegistrationLog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    event: { type: DataTypes.STRING(80), allowNull: false },
    ip: { type: DataTypes.STRING(45), allowNull: true },
    user_agent: { type: DataTypes.STRING(500), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: 'registration_logs', underscored: true, timestamps: false }
);
