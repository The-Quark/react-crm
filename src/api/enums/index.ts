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
  READY_FOR_SHIPMENT = 'ready_for_shipment',
  PACKED = 'packed',
  DELIVERED_TO_PVZ = 'delivered_to_pvz',
  START_CUSTOM_CLEARANCE = 'start_custom_clearance',
  DONE_CUSTOM_CLEARANCE = 'done_custom_clearance',
  AWAITING_CUSTOM_CLEARANCE_APPROVAL = 'awaiting_custom_clearance_approval',
  READY_FOR_RECEIVE = 'ready_for_receive',
  TRANSFERRED_TO_COURIER = 'transferred_to_courier',
  READY_FOR_TRANSFER_TO_PVZ = 'ready_for_transfer_to_pvz',
  HEADING_TO_PVZ = 'heading_to_pvz',
  HEADING_TO_RECEIVER = 'heading_to_receiver',
  READY_FOR_DELIVERY = 'ready_for_delivery',
  DELIVERED = 'delivered',
  DAMAGED = 'damaged',
  DELAYED = 'delayed'
}

export enum OrderStatus {
  PACKAGE_AWAITING = 'package_awaiting',
  BUY_FOR_SOMEONE = 'buy_for_someone',
  PACKAGE_RECEIVED = 'package_received',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  REWEIGHING = 'reweighing'
}
