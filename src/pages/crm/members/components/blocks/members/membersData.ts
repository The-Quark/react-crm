interface IMember {
  avatar: string;
  name: string;
  position: string;
}

interface IMembersData {
  member: IMember;
  role: string;
  location: string;
  recentlyActivity: string;
}

const MembersData: IMembersData[] = [
  {
    member: {
      avatar: '',
      name: 'Brad Simmons',
      position: 'Manager'
    },
    role: 'Admin',
    location: 'Ukraine',
    recentlyActivity: 'Today, 3:00 pm'
  },
  {
    member: {
      avatar: '',
      name: 'Floyd Miles',
      position: 'Lead Developer'
    },
    role: 'Support',
    location: 'India',
    recentlyActivity: 'Today, 11:45 am'
  }
];

export { MembersData, type IMembersData };
