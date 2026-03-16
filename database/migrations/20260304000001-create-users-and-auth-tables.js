'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      first_name: { type: Sequelize.STRING(120), allowNull: true },
      last_name: { type: Sequelize.STRING(120), allowNull: true },
      nationality: { type: Sequelize.STRING(80), allowNull: true },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      sex: { type: Sequelize.ENUM('M', 'F', 'X', 'other'), allowNull: true },
      region_code: { type: Sequelize.STRING(20), allowNull: true },
      comuna_code: { type: Sequelize.STRING(20), allowNull: true },
      actividad_ofertada_id: { type: Sequelize.STRING(60), allowNull: true },
      profile_image_url: { type: Sequelize.STRING(500), allowNull: true },
      email_verified_at: { type: Sequelize.DATE, allowNull: true },
      two_fa_enabled: { type: Sequelize.BOOLEAN, defaultValue: false },
      two_fa_secret: { type: Sequelize.STRING(255), allowNull: true },
      status: { type: Sequelize.ENUM('pending_activation', 'pending_otp', 'active', 'deactivated'), defaultValue: 'pending_activation' },
      terms_accepted_at: { type: Sequelize.DATE, allowNull: true },
      last_login_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('otp_codes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      code: { type: Sequelize.STRING(8), allowNull: false },
      type: { type: Sequelize.ENUM('activation', 'login', 'password_reset'), allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      used_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('user_sessions', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      refresh_token_hash: { type: Sequelize.STRING(255), allowNull: false },
      remember_me: { type: Sequelize.BOOLEAN, defaultValue: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      revoked_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('registration_logs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      event: { type: Sequelize.STRING(80), allowNull: false },
      ip: { type: Sequelize.STRING(45), allowNull: true },
      user_agent: { type: Sequelize.STRING(500), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('activation_tokens', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      token: { type: Sequelize.STRING(64), allowNull: false, unique: true },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      used_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('activation_tokens');
    await queryInterface.dropTable('registration_logs');
    await queryInterface.dropTable('user_sessions');
    await queryInterface.dropTable('otp_codes');
    await queryInterface.dropTable('users');
  },
};
