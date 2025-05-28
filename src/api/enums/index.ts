export enum UserCourierType {
  PEDESTRIAN = 'pedestrian',
  MOTORBIKE = 'motorbike',
  AUTO = 'auto'
}

export enum UserDriverStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable'
}

export enum UserStatus {
  ACTIVE = 'active',
  VACATION = 'vacation',
  FIRED = 'fired',
  STAGING = 'staging',
  DECREE = 'decree',
  UNAVAILABLE = 'unavailable'
}

export enum VehicleType {
  AUTO = 'auto',
  VAN = 'van',
  MOTORBIKE = 'motorbike'
}
export enum VehicleStatus {
  ONLINE = 'on_line',
  SERVICE = 'on_service'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum ApplicationsStatus {
  NEW = 'new',
  RUNNING = 'running',
  COMPLETED = 'completed',
  DECLINED = 'declined'
}

export enum TaskPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskStatus {
  TODO = 'to_do',
  PROGRESS = 'in_progress',
  OUTDATED = 'outdated',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export enum TaskType {
  INNER = 'inner',
  ORDERS = 'orders',
  APPLICATIONS = 'applications',
  PACKAGES = 'packages',
  USERS = 'users'
}

export enum TemplateType {
  EMAIL = 'email',
  SMS = 'sms',
  PRINT_FORM = 'print_form'
}

export enum CargoStatus {
  FORMED = 'formed',
  ARRIVED_AIRPORT_SENDER = 'arrived_airport_sender',
  ACCEPTED_AIRPORT_SENDER = 'accepted_airport_sender',
  ARRIVED_AIRPORT_RECEIVER = 'arrived_airport_receiver',
  AWAITING_ACCEPT_AIRPORT_SENDER = 'awaiting_accept_airport_sender',
  ACCEPTED_TSW = 'accepted_tsw',
  TRANSFERRED_TSW = 'transferred_tsw'
}

export enum PackageStatus {
  AWAITING_AIRPORT = 'awaiting_airport',
  READY_SEND = 'ready_send',
  READY_DELIVERY = 'ready_delivery',
  HEADING_CLIENT = 'heading_client',
  DONE_PACKAGING = 'done_packaging',
  IN_CARGO = 'in_cargo',
  AWAITING_CUSTOMS = 'awaiting_customs',
  READY_ODD = 'ready_odd',
  HEADING_ODD = 'heading_odd',
  ARRIVED_ODD = 'arrived_odd',
  ARRIVED_AIRPORT = 'arrived_airport',
  ARRIVED_WAREHOUSE = 'arrived_warehouse',
  ACCEPTED_WAREHOUSE = 'accepted_warehouse',
  PASSED_CUSTOMS = 'passed_customs',
  TRANSFERED_COURIER = 'transfered_courier',
  DELIVERED = 'delivered',
  REJECT_DAMAGED = 'rejected_damaged',
  REJECTED_CLIENT = 'rejected_client',
  REJECT_OTHER = 'rejected_other'
}
