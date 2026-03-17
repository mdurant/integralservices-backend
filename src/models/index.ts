import { User } from './User';
import { OtpCode } from './OtpCode';
import { UserSession } from './UserSession';
import { RegistrationLog } from './RegistrationLog';
import { ActivationToken } from './ActivationToken';
import { Nationality } from './Nationality';
import { Sex } from './Sex';
import { Region } from './Region';
import { Commune } from './Commune';
import { PendingContactChange } from './PendingContactChange';

User.hasMany(OtpCode, { foreignKey: 'user_id' });
OtpCode.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(UserSession, { foreignKey: 'user_id' });
UserSession.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(RegistrationLog, { foreignKey: 'user_id' });
RegistrationLog.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ActivationToken, { foreignKey: 'user_id' });
ActivationToken.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(PendingContactChange, { foreignKey: 'user_id' });
PendingContactChange.belongsTo(User, { foreignKey: 'user_id' });

Region.hasMany(Commune, { foreignKey: 'region_code', sourceKey: 'code' });
Commune.belongsTo(Region, { foreignKey: 'region_code', targetKey: 'code' });

export { User, OtpCode, UserSession, RegistrationLog, ActivationToken, Nationality, Sex, Region, Commune, PendingContactChange };
