import { PackageStatus } from '@/api/get/getPackages/types.ts';
import { CargoStatus } from '@/api/get/getCargo/types.ts';
import { TemplateType } from '@/api/get/getTemplates/types.ts';
import { TaskType, TaskPriority, TaskStatus } from '@/api/get/getTask/types.ts';
import { Gender, UserStatus } from '@/api/enums';
export const localesMock = [
  {
    code: 'en',
    label: 'English'
  },
  {
    code: 'ru',
    label: 'Russian'
  },
  {
    code: 'ar',
    label: 'Arabic'
  }
];

export const curreniesMock = [
  {
    code: 'USD',
    label: 'United States Dollar'
  },
  {
    code: 'RUB',
    label: 'Russian Ruble'
  },
  {
    code: 'KZT',
    label: 'Kazakhstani Tenge'
  }
];

export const airlinesMock = [
  {
    code: 'AA',
    label: 'American Airlines'
  },
  {
    code: 'DL',
    label: 'Delta Air Lines'
  },
  {
    code: 'UA',
    label: 'United Airlines'
  },
  {
    code: 'LH',
    label: 'Lufthansa'
  },
  {
    code: 'AF',
    label: 'Air France'
  },
  {
    code: 'BA',
    label: 'British Airways'
  },
  {
    code: 'EK',
    label: 'Emirates'
  },
  {
    code: 'QR',
    label: 'Qatar Airways'
  },
  {
    code: 'EY',
    label: 'Etihad Airways'
  },
  {
    code: 'CX',
    label: 'Cathay Pacific'
  }
];

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

export const fieldActivityOptions = [
  { value: 'it', label: 'Information Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'construction', label: 'Construction' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'marketing', label: 'Marketing' }
];

export interface FakeIndividualClient {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  orderCount: number;
  activeOrder: number;
}

export const fakeClientsIndividualMock: FakeIndividualClient[] = [
  {
    id: 1,
    name: 'Ayan',
    surname: 'Tulegenov',
    patronymic: 'Serikovich',
    phone: '+77011234567',
    orderCount: 5,
    activeOrder: 1
  },
  {
    id: 2,
    name: 'Dana',
    surname: 'Nurpeisova',
    patronymic: 'Bolatovna',
    phone: '+77029876543',
    orderCount: 3,
    activeOrder: 0
  },
  {
    id: 3,
    name: 'Alikhan',
    surname: 'Beketov',
    patronymic: 'Zhanibekovich',
    phone: '+77034567891',
    orderCount: 8,
    activeOrder: 2
  },
  {
    id: 4,
    name: 'Aruzhan',
    surname: 'Kairatova',
    patronymic: 'Muratovna',
    phone: '+77041234567',
    orderCount: 2,
    activeOrder: 0
  },
  {
    id: 5,
    name: 'Yerassyl',
    surname: 'Mukhan',
    patronymic: 'Samatovich',
    phone: '+77057894561',
    orderCount: 4,
    activeOrder: 1
  }
];

export interface FakeLegalClient {
  id: number;
  companyName: string;
  bin: number;
  surname: string;
  patronymic: string;
  phone: string;
  orderCount: number;
  activeOrder: number;
}

export const fakeLegalClientsMock: FakeLegalClient[] = [
  {
    id: 1,
    companyName: 'Tech Solutions LLP',
    bin: 990840000123,
    surname: 'Zhaksylykov',
    patronymic: 'Nursultanovich',
    phone: '+77012345678',
    orderCount: 10,
    activeOrder: 3
  },
  {
    id: 2,
    companyName: 'Astana Logistics',
    bin: 990840005123,
    surname: 'Ramazanov',
    patronymic: 'Almasovich',
    phone: '+77029873456',
    orderCount: 7,
    activeOrder: 1
  },
  {
    id: 3,
    companyName: 'Eurasia Group',
    bin: 990846000123,
    surname: 'Serikkali',
    patronymic: 'Bauyrzhanovich',
    phone: '+77034561234',
    orderCount: 12,
    activeOrder: 5
  },
  {
    id: 4,
    companyName: 'Nomad Trade',
    bin: 990840060123,
    surname: 'Tasmagambetov',
    patronymic: 'Yerlanovich',
    phone: '+77041239876',
    orderCount: 4,
    activeOrder: 0
  },
  {
    id: 5,
    companyName: 'KazTech Industries',
    bin: 991220000789,
    surname: 'Yermekov',
    patronymic: 'Dauletovich',
    phone: '+77058947321',
    orderCount: 9,
    activeOrder: 2
  }
];

export const mockTypes = [
  {
    id: 1,
    name: 'car'
  },
  {
    id: 2,
    name: 'motorcycle'
  },
  {
    id: 3,
    name: 'truck'
  },
  {
    id: 4,
    name: 'bus'
  }
];

export const mockStatus = [
  {
    id: 1,
    name: 'available'
  },
  {
    id: 2,
    name: 'rented'
  },
  {
    id: 3,
    name: 'maintenance'
  }
];

export const mockApplicationsStatus = [
  {
    id: 1,
    name: 'New',
    value: 'new'
  },
  {
    id: 2,
    name: 'Running',
    value: 'running'
  },
  {
    id: 3,
    name: 'Completed',
    value: 'completed'
  },
  {
    id: 4,
    name: 'Declined',
    value: 'declined'
  }
];

export const mockOrdersStatus = [
  {
    id: 1,
    name: 'Package awaiting',
    value: 'package_awaiting'
  },
  {
    id: 2,
    name: 'Buy for someone',
    value: 'buy_for_someone'
  },
  {
    id: 3,
    name: 'Package received',
    value: 'package_received'
  },
  {
    id: 4,
    name: 'Expired',
    value: 'expired'
  }
];

export const packageStatusOptions = [
  { id: 1, name: 'Awaiting Airport', value: PackageStatus.AWAITING_AIRPORT },
  { id: 2, name: 'Ready to Send', value: PackageStatus.READY_SEND },
  { id: 3, name: 'Ready for Delivery', value: PackageStatus.READY_DELIVERY },
  { id: 4, name: 'Heading to Client', value: PackageStatus.HEADING_CLIENT },
  { id: 5, name: 'Done Packaging', value: PackageStatus.DONE_PACKAGING },
  { id: 6, name: 'In Cargo', value: PackageStatus.IN_CARGO },
  { id: 7, name: 'Awaiting Customs', value: PackageStatus.AWAITING_CUSTOMS },
  { id: 8, name: 'Ready Odd', value: PackageStatus.READY_ODD },
  { id: 9, name: 'Heading Odd', value: PackageStatus.HEADING_ODD },
  { id: 10, name: 'Arrived Odd', value: PackageStatus.ARRIVED_ODD },
  { id: 11, name: 'Arrived Airport', value: PackageStatus.ARRIVED_AIRPORT },
  { id: 12, name: 'Arrived Warehouse', value: PackageStatus.ARRIVED_WAREHOUSE },
  { id: 13, name: 'Accepted Warehouse', value: PackageStatus.ACCEPTED_WAREHOUSE },
  { id: 14, name: 'Passed Customs', value: PackageStatus.PASSED_CUSTOMS },
  { id: 15, name: 'Transferred to Courier', value: PackageStatus.TRANSFERED_COURIER },
  { id: 16, name: 'Delivered', value: PackageStatus.DELIVERED },
  { id: 17, name: 'Rejected (Damaged)', value: PackageStatus.REJECT_DAMAGED },
  { id: 18, name: 'Rejected by Client', value: PackageStatus.REJECTED_CLIENT },
  { id: 19, name: 'Rejected (Other)', value: PackageStatus.REJECT_OTHER }
];

export const cargoStatusOptions = [
  { id: 1, name: 'Formed', value: CargoStatus.FORMED },
  { id: 2, name: 'Arrived at Sender Airport', value: CargoStatus.ARRIVED_AIRPORT_SENDER },
  { id: 3, name: 'Accepted at Sender Airport', value: CargoStatus.ACCEPTED_AIRPORT_SENDER },
  { id: 4, name: 'Arrived at Receiver Airport', value: CargoStatus.ARRIVED_AIRPORT_RECEIVER }
];

export const templateTypesOptions = [
  { id: 1, name: 'Email', value: TemplateType.EMAIL },
  { id: 2, name: 'SMS', value: TemplateType.SMS },
  { id: 3, name: 'Print form', value: TemplateType.PRINT_FORM }
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
  { value: 'b2c', name: 'Business to Customer' },
  { value: 'b2b', name: 'Business to Business' },
  { value: 'c2b', name: 'Customer to Business' },
  { value: 'c2c', name: 'Customer to Customer' }
];

export const mockGenderOptions = [
  { id: 1, name: 'Male', value: Gender.MALE },
  { id: 2, name: 'Female', value: Gender.FEMALE },
  { id: 3, name: 'Other', value: Gender.OTHER }
];

export const mockUserStatusOptions = [
  { id: 1, name: 'Active', value: UserStatus.ACTIVE },
  { id: 2, name: 'Vacation', value: UserStatus.VACATION },
  { id: 3, name: 'Fired', value: UserStatus.FIRED },
  { id: 1, name: 'Staging', value: UserStatus.STAGING },
  { id: 2, name: 'Decree', value: UserStatus.DECREE },
  { id: 3, name: 'Unavailable', value: UserStatus.UNAVAILABLE }
];
