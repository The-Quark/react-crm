import {
  Gender,
  UserCourierType,
  UserDriverStatus,
  UserStatus,
  ApplicationsStatus,
  TaskType,
  TaskPriority,
  TaskStatus,
  TemplateType,
  CargoStatus,
  PackageStatus,
  OrderStatus,
  GenderUser,
  DeliveryCategories
} from '@/api/enums';
import { toAbsoluteUrl } from '@/utils';

export const timezoneMock = [
  {
    code: 'AA',
    timezone: 'America/Chicago',
    key: 'AA-America/Chicago'
  },
  {
    code: 'DL',
    timezone: 'America/New_York',
    key: 'DL-America/New_York'
  },
  {
    code: 'LH',
    timezone: 'Europe/Berlin',
    key: 'LH-Europe/Berlin'
  },
  {
    code: 'AF',
    timezone: 'Europe/Paris',
    key: 'AF-Europe/Paris'
  },
  {
    code: 'BA',
    timezone: 'Europe/London',
    key: 'BA-Europe/London'
  },
  {
    code: 'EK',
    timezone: 'Asia/Dubai',
    key: 'EK-Asia/Dubai'
  },
  {
    code: 'QR',
    timezone: 'Asia/Qatar',
    key: 'QR-Asia/Qatar'
  },
  {
    code: 'CX',
    timezone: 'Asia/Hong_Kong',
    key: 'CX-Asia/Hong_Kong'
  },
  {
    code: 'KZ',
    timezone: 'Asia/Qyzylorda',
    key: 'KZ-Asia/Qyzylorda'
  }
];

export const mockEntityTypes = [
  {
    id: 1,
    name: 'Package',
    value: 'package'
  },
  {
    id: 2,
    name: 'Cargo',
    value: 'cargo'
  }
];

export const mockApplicationsStatus = [
  {
    id: 1,
    name: 'New',
    value: ApplicationsStatus.NEW
  },
  {
    id: 2,
    name: 'Running',
    value: ApplicationsStatus.RUNNING
  },
  {
    id: 3,
    name: 'Completed',
    value: ApplicationsStatus.COMPLETED
  },
  {
    id: 4,
    name: 'Declined',
    value: ApplicationsStatus.DECLINED
  }
];

export const mockOrdersStatus = [
  {
    id: 1,
    name: 'Draft',
    value: OrderStatus.DRAFT
  },
  {
    id: 2,
    name: 'Created',
    value: OrderStatus.CREATED
  },
  {
    id: 3,
    name: 'Confirmed',
    value: OrderStatus.CONFIRMED
  },
  {
    id: 4,
    name: 'Payment pending',
    value: OrderStatus.PAYMENT_PENDING
  },
  {
    id: 5,
    name: 'Paid',
    value: OrderStatus.PAID
  },
  {
    id: 6,
    name: 'Package awaiting',
    value: OrderStatus.PACKAGE_AWAITING
  },
  {
    id: 7,
    name: 'Buy for someone',
    value: OrderStatus.BUY_FOR_SOMEONE
  },
  {
    id: 8,
    name: 'Reweighing',
    value: OrderStatus.REWEIGHING
  },
  {
    id: 9,
    name: 'Package received',
    value: OrderStatus.PACKAGE_RECEIVED
  },
  {
    id: 10,
    name: 'In processing',
    value: OrderStatus.IN_PROCESSING
  },
  {
    id: 11,
    name: 'Ready for shipment',
    value: OrderStatus.READY_FOR_SHIPMENT
  },
  {
    id: 12,
    name: 'Shipped',
    value: OrderStatus.SHIPPED
  },
  {
    id: 13,
    name: 'In transit',
    value: OrderStatus.IN_TRANSIT
  },
  {
    id: 14,
    name: 'Arrived destination',
    value: OrderStatus.ARRIVED_DESTINATION
  },
  {
    id: 15,
    name: 'Ready for delivery',
    value: OrderStatus.READY_FOR_DELIVERY
  },
  {
    id: 16,
    name: 'Completed',
    value: OrderStatus.COMPLETED
  },
  {
    id: 17,
    name: 'Delivered',
    value: OrderStatus.DELIVERED
  },
  {
    id: 18,
    name: 'Picked up',
    value: OrderStatus.PICKED_UP
  },
  {
    id: 19,
    name: 'On hold',
    value: OrderStatus.ON_HOLD
  },
  {
    id: 20,
    name: 'Expired',
    value: OrderStatus.EXPIRED
  },
  {
    id: 21,
    name: 'Cancelled by client',
    value: OrderStatus.CANCELLED_BY_CLIENT
  },
  {
    id: 22,
    name: 'Cancelled by system',
    value: OrderStatus.CANCELLED_BY_SYSTEM
  },
  {
    id: 23,
    name: 'Refunded',
    value: OrderStatus.REFUNDED
  },
  {
    id: 24,
    name: 'Disputed',
    value: OrderStatus.DISPUTED
  }
  // Old status for compatibility (commented out as per your enum)
  // {
  //   id: 25,
  //   name: 'Cancelled',
  //   value: OrderStatus.CANCELLED
  // }
];

export const packageStatusOptions = [
  // Phase 1: Synchronization with cargo
  {
    id: 1,
    name: 'Package received',
    value: PackageStatus.PACKAGE_RECEIVED
  },
  {
    id: 2,
    name: 'Package formed',
    value: PackageStatus.PACKAGE_FORMED
  },
  {
    id: 3,
    name: 'Awaiting airport acceptance',
    value: PackageStatus.PACKAGE_AWAITING_AIRPORT
  },
  {
    id: 4,
    name: 'Accepted at sender airport',
    value: PackageStatus.PACKAGE_ACCEPTED_AIRPORT_SENDER
  },
  {
    id: 5,
    name: 'In transit',
    value: PackageStatus.PACKAGE_IN_TRANSIT
  },
  {
    id: 6,
    name: 'Arrived at receiver airport',
    value: PackageStatus.PACKAGE_ARRIVED_AIRPORT_RECEIVER
  },
  {
    id: 7,
    name: 'Accepted at TSW',
    value: PackageStatus.PACKAGE_ACCEPTED_TSW
  },
  {
    id: 8,
    name: 'Transferred to warehouse',
    value: PackageStatus.PACKAGE_TRANSFERRED_TSW
  },

  // Phase 2: Independent package statuses
  {
    id: 9,
    name: 'Customs clearance started',
    value: PackageStatus.START_CUSTOM_CLEARANCE
  },
  {
    id: 10,
    name: 'Awaiting customs approval',
    value: PackageStatus.AWAITING_CUSTOM_CLEARANCE_APPROVAL
  },
  {
    id: 11,
    name: 'Customs clearance completed',
    value: PackageStatus.DONE_CUSTOM_CLEARANCE
  },
  {
    id: 12,
    name: 'Ready for receive',
    value: PackageStatus.READY_FOR_RECEIVE
  },
  {
    id: 13,
    name: 'Transferred to courier',
    value: PackageStatus.TRANSFERRED_TO_COURIER
  },
  {
    id: 14,
    name: 'Ready for transfer to PVZ',
    value: PackageStatus.READY_FOR_TRANSFER_TO_PVZ
  },
  {
    id: 15,
    name: 'Heading to PVZ',
    value: PackageStatus.HEADING_TO_PVZ
  },
  {
    id: 16,
    name: 'Delivered to PVZ',
    value: PackageStatus.DELIVERED_TO_PVZ
  },
  {
    id: 17,
    name: 'Heading to receiver',
    value: PackageStatus.HEADING_TO_RECEIVER
  },
  {
    id: 18,
    name: 'Ready for delivery',
    value: PackageStatus.READY_FOR_DELIVERY
  },
  {
    id: 19,
    name: 'Delivered',
    value: PackageStatus.DELIVERED
  },
  {
    id: 20,
    name: 'Partially delivered',
    value: PackageStatus.PARTIALLY_DELIVERED
  },

  // Problem statuses
  {
    id: 21,
    name: 'Damaged',
    value: PackageStatus.DAMAGED
  },
  {
    id: 22,
    name: 'Lost',
    value: PackageStatus.LOST
  },
  {
    id: 23,
    name: 'Delayed',
    value: PackageStatus.DELAYED
  },
  {
    id: 24,
    name: 'Returned',
    value: PackageStatus.RETURNED
  },
  {
    id: 25,
    name: 'Rejected by customs',
    value: PackageStatus.REJECTED
  }

  // Old statuses for compatibility (commented out as per your enum)
  // {
  //   id: 26,
  //   name: 'Ready for shipment',
  //   value: PackageStatus.READY_FOR_SHIPMENT
  // },
  // {
  //   id: 27,
  //   name: 'Packed',
  //   value: PackageStatus.PACKED
  // }
];

export const cargoStatusOptions = [
  { id: 1, name: 'Formed', value: CargoStatus.FORMED },
  { id: 2, name: 'Accepted at Sender Airport', value: CargoStatus.ACCEPTED_AIRPORT_SENDER },
  { id: 3, name: 'Arrived at Receiver Airport', value: CargoStatus.ARRIVED_AIRPORT_RECEIVER },
  {
    id: 4,
    name: 'Awaiting Accept Airport Sender',
    value: CargoStatus.AWAITING_ACCEPT_AIRPORT_SENDER
  },
  { id: 5, name: 'Accepted TSW', value: CargoStatus.ACCEPTED_TSW },
  { id: 6, name: 'Transferred TSW', value: CargoStatus.TRANSFERRED_TSW }
];

export const templateTypesOptions = [
  { id: 1, name: 'Email', value: TemplateType.EMAIL },
  { id: 2, name: 'SMS', value: TemplateType.SMS },
  { id: 3, name: 'Print form', value: TemplateType.PRINT_FORM },
  { id: 4, name: 'Whatsapp', value: TemplateType.WHATSAPP },
  { id: 5, name: 'Telegram', value: TemplateType.TELEGRAM },
  { id: 6, name: 'Push', value: TemplateType.PUSH },
  { id: 7, name: 'Viber', value: TemplateType.VIBER },
  { id: 8, name: 'Internal', value: TemplateType.INTERNAL },
  { id: 9, name: 'Webhook', value: TemplateType.WEBHOOK },
  { id: 10, name: 'QR', value: TemplateType.QR }
];

export const taskPriorityOptions = [
  { id: 1, name: 'Low', value: TaskPriority.LOW },
  { id: 2, name: 'Normal', value: TaskPriority.NORMAL },
  { id: 3, name: 'High', value: TaskPriority.HIGH },
  { id: 4, name: 'Urgent', value: TaskPriority.URGENT }
];

export const taskStatusOptions = [
  { id: 1, name: 'To Do', value: TaskStatus.TODO },
  { id: 2, name: 'In Progress', value: TaskStatus.PROGRESS },
  { id: 3, name: 'Outdated', value: TaskStatus.OUTDATED },
  { id: 4, name: 'Blocked', value: TaskStatus.BLOCKED },
  { id: 5, name: 'Cancelled', value: TaskStatus.CANCELLED },
  { id: 6, name: 'Completed', value: TaskStatus.COMPLETED }
];

export const taskTypeOptions = [
  { id: 1, name: 'Inner', value: TaskType.INNER },
  { id: 2, name: 'Orders', value: TaskType.ORDERS },
  { id: 3, name: 'Applications', value: TaskType.APPLICATIONS },
  { id: 4, name: 'Packages', value: TaskType.PACKAGES },
  { id: 5, name: 'Users', value: TaskType.USERS }
];

export const mockDeliveryCategories = [
  { value: DeliveryCategories.B2C, name: 'SYSTEM.DELIVERY_CATEGORY_B2C' },
  { value: DeliveryCategories.B2B, name: 'SYSTEM.DELIVERY_CATEGORY_B2B' },
  { value: DeliveryCategories.C2B, name: 'SYSTEM.DELIVERY_CATEGORY_C2B' },
  { value: DeliveryCategories.C2C, name: 'SYSTEM.DELIVERY_CATEGORY_C2C' }
];

export const mockGenderOptions = [
  { id: 1, name: 'Male', value: Gender.MALE },
  { id: 2, name: 'Female', value: Gender.FEMALE }
];

export const mockUserStatusOptions = [
  { id: 1, name: 'Active', value: UserStatus.ACTIVE },
  { id: 2, name: 'Vacation', value: UserStatus.VACATION },
  { id: 3, name: 'Fired', value: UserStatus.FIRED },
  { id: 4, name: 'Staging', value: UserStatus.STAGING },
  { id: 5, name: 'Decree', value: UserStatus.DECREE },
  { id: 6, name: 'Unavailable', value: UserStatus.UNAVAILABLE }
];

export const mockDriverStatusOptions = [
  { id: 1, name: 'Available', value: UserDriverStatus.AVAILABLE },
  { id: 2, name: 'Unavailable', value: UserDriverStatus.UNAVAILABLE }
];

export const mockCourierTypeOptions = [
  { id: 1, name: 'Auto', value: UserCourierType.AUTO },
  { id: 2, name: 'Motorbike', value: UserCourierType.MOTORBIKE },
  { id: 3, name: 'Pedestrian', value: UserCourierType.PEDESTRIAN }
];

export const mockApplicationsStatusOptions = [
  { id: 1, name: 'New', value: ApplicationsStatus.NEW },
  { id: 2, name: 'Completed', value: ApplicationsStatus.COMPLETED },
  { id: 3, name: 'Declined', value: ApplicationsStatus.DECLINED },
  { id: 4, name: 'Running', value: ApplicationsStatus.RUNNING }
];

export const mockGenderUserOptions = [
  { id: 1, name: 'Female', value: GenderUser.FEMALE },
  { id: 2, name: 'Male', value: GenderUser.MALE }
];

export const mockLicenseCategoryOptions = [
  { id: 1, name: 'A — Motorcycles', value: 'A' },
  { id: 2, name: 'A1 — Light motorcycles', value: 'A1' },
  { id: 3, name: 'B — Passenger cars', value: 'B' },
  { id: 4, name: 'B1 — Tricycles and quadricycles', value: 'B1' },
  { id: 5, name: 'C — Trucks', value: 'C' },
  { id: 6, name: 'C1 — Medium trucks (up to 7.5 tons)', value: 'C1' },
  { id: 7, name: 'D — Buses', value: 'D' },
  { id: 8, name: 'D1 — Minibuses (up to 16 seats)', value: 'D1' },
  { id: 9, name: 'BE — Passenger cars with trailer', value: 'BE' },
  { id: 10, name: 'C1E — Medium trucks with trailer', value: 'C1E' },
  { id: 11, name: 'CE — Trucks with trailer', value: 'CE' },
  { id: 12, name: 'D1E — Minibuses with trailer', value: 'D1E' },
  { id: 13, name: 'DE — Buses with trailer', value: 'DE' },
  { id: 14, name: 'M — Mopeds', value: 'M' },
  { id: 15, name: 'Tm — Trams', value: 'Tm' },
  { id: 16, name: 'Tb — Trolleybuses', value: 'Tb' }
];

export const CURRENCIES = [
  {
    code: 'USD',
    label: '$',
    flag: toAbsoluteUrl('/media/flags/united-states.svg')
  },
  {
    code: 'RUB',
    label: '₽',
    flag: toAbsoluteUrl('/media/flags/russia.svg')
  },
  {
    code: 'KZT',
    label: '₸',
    flag: toAbsoluteUrl('/media/flags/kazakhstan.svg')
  }
] as const;
