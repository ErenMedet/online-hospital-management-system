export const roleMeta = {
  hasta: {
    label: 'Patient',
    shortLabel: 'Patient',
    home: '/hasta',
    accent: 'cyan',
  },
  doktor: {
    label: 'Doctor',
    shortLabel: 'Doctor',
    home: '/doktor',
    accent: 'emerald',
  },
  hemsire: {
    label: 'Nurse',
    shortLabel: 'Nurse',
    home: '/hemsire',
    accent: 'violet',
  },
  onBuro: {
    label: 'Front Desk',
    shortLabel: 'Front Desk',
    home: '/on-buro',
    accent: 'amber',
  },
};

export const roleMenus = {
  hasta: [
    { path: '/hasta', label: 'Dashboard', icon: 'dashboard' },
    { path: '/hasta/randevu-al', label: 'Book Appointment', icon: 'calendar' },
    { path: '/hasta/randevularim', label: 'My Appointments', icon: 'book' },
    { path: '/hasta/test-sonuclari', label: 'Test Results', icon: 'flask' },
    { path: '/hasta/recetelerim', label: 'Prescriptions', icon: 'capsule' },
    { path: '/hasta/bagimli-profiller', label: 'Family Profiles', icon: 'group' },
    { path: '/sss', label: 'Help', icon: 'question' },
  ],
  doktor: [
    { path: '/doktor', label: 'Dashboard', icon: 'dashboard' },
    { path: '/doktor/program', label: 'Schedule', icon: 'calendar' },
    { path: '/doktor/hasta-kayitlari', label: 'Patient Records', icon: 'records' },
    { path: '/doktor/recete-yonetimi', label: 'Prescriptions', icon: 'capsule' },
  ],
  hemsire: [
    { path: '/hemsire', label: 'Dashboard', icon: 'dashboard' },
    { path: '/hemsire/program', label: 'Department Schedule', icon: 'calendar' },
    { path: '/hemsire/hasta-kayitlari', label: 'Patient Records', icon: 'records' },
  ],
  onBuro: [
    { path: '/on-buro', label: 'Dashboard', icon: 'dashboard' },
    { path: '/on-buro/randevular', label: 'Appointments', icon: 'calendar' },
    { path: '/on-buro/manuel-randevu', label: 'Manual Entry', icon: 'edit' },
    { path: '/on-buro/test-durumu', label: 'Test Status', icon: 'flask' },
    { path: '/on-buro/bakim-veren', label: 'Caregiver Access', icon: 'group' },
    { path: '/on-buro/personel-yonetimi', label: 'Staff Management', icon: 'users' },
    { path: '/on-buro/doktor-program', label: 'Doctor Schedules', icon: 'swap' },
  ],
};
