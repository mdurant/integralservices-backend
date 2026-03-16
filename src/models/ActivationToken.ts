import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface ActivationTokenAttributes {
  id: number;
  user_id: string;
  token: string;
  expires_at: Date;
  used_at: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivationTokenCreationAttributes = Optional<ActivationTokenAttributes, 'id' | 'used_at' | 'createdAt' | 'updatedAt'>;

export class ActivationToken extends Model<ActivationTokenAttributes, ActivationTokenCreationAttributes> implements ActivationTokenAttributes {
  declare id: number;
  declare user_id: string;
  declare token: string;
  declare expires_at: Date;
  declare used_at: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ActivationToken.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    token: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used_at: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
  },
  { sequelize, tableName: 'activation_tokens', underscored: true, timestamps: true }
);
