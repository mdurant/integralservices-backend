import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface UserSessionAttributes {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  remember_me: boolean;
  expires_at: Date;
  revoked_at: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserSessionCreationAttributes = Optional<UserSessionAttributes, 'id' | 'revoked_at' | 'createdAt' | 'updatedAt'>;

export class UserSession extends Model<UserSessionAttributes, UserSessionCreationAttributes> implements UserSessionAttributes {
  declare id: string;
  declare user_id: string;
  declare refresh_token_hash: string;
  declare remember_me: boolean;
  declare expires_at: Date;
  declare revoked_at: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserSession.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    refresh_token_hash: { type: DataTypes.STRING(255), allowNull: false },
    remember_me: { type: DataTypes.BOOLEAN, defaultValue: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    revoked_at: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
  },
  { sequelize, tableName: 'user_sessions', underscored: true, timestamps: true }
);
