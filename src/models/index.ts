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
import { Service } from './Service';
import { Technician } from './Technician';
import { TechnicianService } from './TechnicianService';
import { ServiceRequest } from './ServiceRequest';
import { Quote } from './Quote';
import { WorkOrder } from './WorkOrder';
import { VisitSchedule } from './VisitSchedule';
import { Notification } from './Notification';
import { AuditLog } from './AuditLog';

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

User.hasOne(Technician, { foreignKey: 'user_id' });
Technician.belongsTo(User, { foreignKey: 'user_id' });

Technician.belongsToMany(Service, { through: TechnicianService, foreignKey: 'technician_id', otherKey: 'service_id' });
Service.belongsToMany(Technician, { through: TechnicianService, foreignKey: 'service_id', otherKey: 'technician_id' });
Technician.hasMany(TechnicianService, { foreignKey: 'technician_id' });
TechnicianService.belongsTo(Technician, { foreignKey: 'technician_id' });
Service.hasMany(TechnicianService, { foreignKey: 'service_id' });
TechnicianService.belongsTo(Service, { foreignKey: 'service_id' });

Service.hasMany(ServiceRequest, { foreignKey: 'service_id' });
ServiceRequest.belongsTo(Service, { foreignKey: 'service_id' });
User.hasMany(ServiceRequest, { foreignKey: 'client_user_id', as: 'clientRequests' });
ServiceRequest.belongsTo(User, { foreignKey: 'client_user_id', as: 'client' });
User.hasMany(ServiceRequest, { foreignKey: 'technician_user_id', as: 'technicianRequests' });
ServiceRequest.belongsTo(User, { foreignKey: 'technician_user_id', as: 'technician' });

ServiceRequest.hasMany(Quote, { foreignKey: 'request_id' });
Quote.belongsTo(ServiceRequest, { foreignKey: 'request_id' });
Quote.belongsTo(Service, { foreignKey: 'service_id' });
User.hasMany(Quote, { foreignKey: 'technician_user_id', as: 'quotesAsTechnician' });
Quote.belongsTo(User, { foreignKey: 'technician_user_id', as: 'technician' });
User.hasMany(Quote, { foreignKey: 'client_user_id', as: 'quotesAsClient' });
Quote.belongsTo(User, { foreignKey: 'client_user_id', as: 'client' });

Quote.hasOne(WorkOrder, { foreignKey: 'quote_id' });
WorkOrder.belongsTo(Quote, { foreignKey: 'quote_id' });
ServiceRequest.hasMany(WorkOrder, { foreignKey: 'request_id' });
WorkOrder.belongsTo(ServiceRequest, { foreignKey: 'request_id' });
WorkOrder.belongsTo(Service, { foreignKey: 'service_id' });
User.hasMany(WorkOrder, { foreignKey: 'client_user_id', as: 'workOrdersAsClient' });
WorkOrder.belongsTo(User, { foreignKey: 'client_user_id', as: 'client' });
User.hasMany(WorkOrder, { foreignKey: 'technician_user_id', as: 'workOrdersAsTechnician' });
WorkOrder.belongsTo(User, { foreignKey: 'technician_user_id', as: 'technician' });

WorkOrder.hasMany(VisitSchedule, { foreignKey: 'work_order_id' });
VisitSchedule.belongsTo(WorkOrder, { foreignKey: 'work_order_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

export {
  User,
  OtpCode,
  UserSession,
  RegistrationLog,
  ActivationToken,
  Nationality,
  Sex,
  Region,
  Commune,
  PendingContactChange,
  Service,
  Technician,
  TechnicianService,
  ServiceRequest,
  Quote,
  WorkOrder,
  VisitSchedule,
  Notification,
  AuditLog,
};
