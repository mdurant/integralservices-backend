import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export type UserStatus = 'pending_activation' | 'pending_otp' | 'active' | 'deactivated';
export type Sex = 'M' | 'F' | 'X' | 'other';

export interface UserAttributes {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  nationality: string | null;
  phone: string | null;
  sex: Sex | null;
  region_code: string | null;
  comuna_code: string | null;
  actividad_ofertada_id: string | null;
  profile_image_url: string | null;
  email_verified_at: Date | null;
  two_fa_enabled: boolean;
  two_fa_secret: string | null;
  status: UserStatus;
  terms_accepted_at: Date | null;
  last_login_at: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'first_name' | 'last_name' | 'nationality' | 'phone' | 'sex' | 'region_code' | 'comuna_code' | 'actividad_ofertada_id' | 'profile_image_url' | 'email_verified_at' | 'two_fa_enabled' | 'two_fa_secret' | 'terms_accepted_at' | 'last_login_at' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare password_hash: string;
  declare first_name: string | null;
  declare last_name: string | null;
  declare nationality: string | null;
  declare phone: string | null;
  declare sex: Sex | null;
  declare region_code: string | null;
  declare comuna_code: string | null;
  declare actividad_ofertada_id: string | null;
  declare profile_image_url: string | null;
  declare email_verified_at: Date | null;
  declare two_fa_enabled: boolean;
  declare two_fa_secret: string | null;
  declare status: UserStatus;
  declare terms_accepted_at: Date | null;
  declare last_login_at: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    first_name: { type: DataTypes.STRING(120), allowNull: true },
    last_name: { type: DataTypes.STRING(120), allowNull: true },
    nationality: { type: DataTypes.STRING(80), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    sex: { type: DataTypes.ENUM('M', 'F', 'X', 'other'), allowNull: true },
    region_code: { type: DataTypes.STRING(20), allowNull: true },
    comuna_code: { type: DataTypes.STRING(20), allowNull: true },
    actividad_ofertada_id: { type: DataTypes.STRING(60), allowNull: true },
    profile_image_url: { type: DataTypes.STRING(500), allowNull: true },
    email_verified_at: { type: DataTypes.DATE, allowNull: true },
    two_fa_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    two_fa_secret: { type: DataTypes.STRING(255), allowNull: true },
    status: { type: DataTypes.ENUM('pending_activation', 'pending_otp', 'active', 'deactivated'), defaultValue: 'pending_activation' },
    terms_accepted_at: { type: DataTypes.DATE, allowNull: true },
    last_login_at: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
  },
  { sequelize, tableName: 'users', underscored: true, timestamps: true }
);
