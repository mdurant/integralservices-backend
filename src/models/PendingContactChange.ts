import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export type PendingContactKind = 'email' | 'phone';

export interface PendingContactChangeAttributes {
  id: number;
  user_id: string;
  kind: PendingContactKind;
  new_value: string;
  code: string;
  expires_at: Date;
  used_at: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PendingContactChangeCreationAttributes = Optional<PendingContactChangeAttributes, 'id' | 'used_at' | 'createdAt' | 'updatedAt'>;

export class PendingContactChange extends Model<PendingContactChangeAttributes, PendingContactChangeCreationAttributes> implements PendingContactChangeAttributes {
  declare id: number;
  declare user_id: string;
  declare kind: PendingContactKind;
  declare new_value: string;
  declare code: string;
  declare expires_at: Date;
  declare used_at: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PendingContactChange.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    kind: { type: DataTypes.ENUM('email', 'phone'), allowNull: false },
    new_value: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(8), allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used_at: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
  },
  { sequelize, tableName: 'pending_contact_changes', underscored: true, timestamps: true }
);
