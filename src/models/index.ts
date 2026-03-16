import { User } from './User';
import { OtpCode } from './OtpCode';
import { UserSession } from './UserSession';
import { RegistrationLog } from './RegistrationLog';
import { ActivationToken } from './ActivationToken';

User.hasMany(OtpCode, { foreignKey: 'user_id' });
OtpCode.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(UserSession, { foreignKey: 'user_id' });
UserSession.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(RegistrationLog, { foreignKey: 'user_id' });
RegistrationLog.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ActivationToken, { foreignKey: 'user_id' });
ActivationToken.belongsTo(User, { foreignKey: 'user_id' });

export { User, OtpCode, UserSession, RegistrationLog, ActivationToken };
