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
