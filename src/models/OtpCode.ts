import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export type OtpType = 'activation' | 'login' | 'password_reset';

export interface OtpCodeAttributes {
  id: number;
  user_id: string;
  code: string;
  type: OtpType;
  expires_at: Date;
  used_at: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type OtpCodeCreationAttributes = Optional<OtpCodeAttributes, 'id' | 'used_at' | 'createdAt' | 'updatedAt'>;

export class OtpCode extends Model<OtpCodeAttributes, OtpCodeCreationAttributes> implements OtpCodeAttributes {
  declare id: number;
  declare user_id: string;
  declare code: string;
  declare type: OtpType;
  declare expires_at: Date;
  declare used_at: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

OtpCode.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    code: { type: DataTypes.STRING(8), allowNull: false },
    type: { type: DataTypes.ENUM('activation', 'login', 'password_reset'), allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used_at: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
  },
  { sequelize, tableName: 'otp_codes', underscored: true, timestamps: true }
);
