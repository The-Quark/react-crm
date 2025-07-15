export enum ClientType {
  LEGAL = 'legal',
  INDIVIDUAL = 'individual'
}

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
  USERS = 'users',
  DELIVERY = 'delivery',
  COURIER = 'courier',
  DRIVER = 'driver'
}

export enum TemplateType {
  EMAIL = 'email',
  SMS = 'sms',
  PRINT_FORM = 'print_form',
  QR = 'qr',
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  PUSH = 'push',
  VIBER = 'viber',
  INTERNAL = 'internal',
  WEBHOOK = 'webhook'
}

export enum CargoStatus {
  FORMED = 'formed',
  ACCEPTED_AIRPORT_SENDER = 'accepted_airport_sender',
  ARRIVED_AIRPORT_RECEIVER = 'arrived_airport_receiver',
  AWAITING_ACCEPT_AIRPORT_SENDER = 'awaiting_accept_airport_sender',
  ACCEPTED_TSW = 'accepted_tsw',
  TRANSFERRED_TSW = 'transferred_tsw'
}

export enum PackageStatus {
  // Phase 1: Synchronization with cargo
  PACKAGE_RECEIVED = 'package_received', // Посылка получена
  PACKAGE_FORMED = 'package_formed', // Посылка сформирована в груз
  PACKAGE_AWAITING_AIRPORT = 'package_awaiting_airport', // Ожидает принятия аэропортом
  PACKAGE_ACCEPTED_AIRPORT_SENDER = 'package_accepted_airport_sender', // Принята в аэропорту отправления
  PACKAGE_IN_TRANSIT = 'package_in_transit', // В пути/транзите
  PACKAGE_ARRIVED_AIRPORT_RECEIVER = 'package_arrived_airport_receiver', // Прибыла в аэропорт назначения
  PACKAGE_ACCEPTED_TSW = 'package_accepted_tsw', // Принята на СВХ
  PACKAGE_TRANSFERRED_TSW = 'package_transferred_tsw', // Перемещена на склад

  // Phase 2: Independent package statuses
  START_CUSTOM_CLEARANCE = 'start_custom_clearance', // Начало таможенного оформления
  AWAITING_CUSTOM_CLEARANCE_APPROVAL = 'awaiting_custom_clearance_approval', // Ожидает одобрения таможни
  DONE_CUSTOM_CLEARANCE = 'done_custom_clearance', // Таможенное оформление завершено
  READY_FOR_RECEIVE = 'ready_for_receive', // Готова к получению
  TRANSFERRED_TO_COURIER = 'transferred_to_courier', // Передана курьеру
  READY_FOR_TRANSFER_TO_PVZ = 'ready_for_transfer_to_pvz', // Готова к передаче в ПВЗ
  HEADING_TO_PVZ = 'heading_to_pvz', // Направляется в ПВЗ
  DELIVERED_TO_PVZ = 'delivered_to_pvz', // Доставлена в ПВЗ
  HEADING_TO_RECEIVER = 'heading_to_receiver', // Направляется к получателю
  READY_FOR_DELIVERY = 'ready_for_delivery', // Готова к доставке
  DELIVERED = 'delivered', // Доставлена
  PARTIALLY_DELIVERED = 'partially_delivered', // Частично доставлена

  // Problem statuses
  DAMAGED = 'damaged', // Повреждена
  LOST = 'lost', // Потеряна
  DELAYED = 'delayed', // Задержана
  RETURNED = 'returned', // Возвращена
  REJECTED = 'rejected' // Отклонена таможней

  // Old statuses for compatibility (to be removed after migration)
  // READY_FOR_SHIPMENT = 'ready_for_shipment',
  // PACKED = 'packed'
}

export enum OrderStatus {
  // Creation and processing
  DRAFT = 'draft', // Черновик
  CREATED = 'created', // Создан
  CONFIRMED = 'confirmed', // Подтвержден
  PAYMENT_PENDING = 'payment_pending', // Ожидает оплаты
  PAID = 'paid', // Оплачен

  // Execution
  PACKAGE_AWAITING = 'package_awaiting', // Ожидает посылку
  BUY_FOR_SOMEONE = 'buy_for_someone', // Покупка для кого-то
  REWEIGHING = 'reweighing', // Перевешивание
  PACKAGE_RECEIVED = 'package_received', // Посылка получена
  IN_PROCESSING = 'in_processing', // В обработке
  READY_FOR_SHIPMENT = 'ready_for_shipment', // Готов к отправке
  SHIPPED = 'shipped', // Отправлен
  IN_TRANSIT = 'in_transit', // В пути
  ARRIVED_DESTINATION = 'arrived_destination', // Прибыл в пункт назначения
  READY_FOR_DELIVERY = 'ready_for_delivery', // Готов к доставке

  // Completion
  COMPLETED = 'completed', // Выполнен
  DELIVERED = 'delivered', // Доставлен
  PICKED_UP = 'picked_up', // Забран клиентом

  // Problems and cancellations
  ON_HOLD = 'on_hold', // Приостановлен
  EXPIRED = 'expired', // Истек срок
  CANCELLED_BY_CLIENT = 'cancelled_by_client', // Отменен клиентом
  CANCELLED_BY_SYSTEM = 'cancelled_by_system', // Отменен системой
  REFUNDED = 'refunded', // Возвращен
  DISPUTED = 'disputed' // Спорный

  // // Old statuses for compatibility (to be removed after migration)
  // CANCELLED = 'cancelled'
}

export enum GenderUser {
  MALE = 'male',
  FEMALE = 'female'
}

export enum DeliveryCategories {
  B2B = 'b2b',
  B2C = 'b2c',
  C2C = 'c2c',
  C2B = 'c2b'
}

export enum ClientSystemStatus {
  REGULAR = 'regular',
  GOLD = 'gold',
  VIP = 'vip',
  BLACKLIST = 'blacklist',
  TEST = 'test'
}
