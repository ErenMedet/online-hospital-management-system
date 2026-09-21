// ===================== USERS =====================
export const kullanicilar = [
  // Patients
  {
    id: 'H001', tc: '12345678901', sifre: '1234', rol: 'hasta',
    ad: 'Emily', soyad: 'Johnson', dogumTarihi: '1985-03-15',
    telefon: '05301234567', email: 'emily.johnson@email.com',
    cinsiyet: 'Female', kan: 'A+',
  },
  {
    id: 'H002', tc: '23456789012', sifre: '1234', rol: 'hasta',
    ad: 'Michael', soyad: 'Brown', dogumTarihi: '1970-07-22',
    telefon: '05312345678', email: 'michael.brown@email.com',
    cinsiyet: 'Male', kan: 'B+',
  },
  {
    id: 'H003', tc: '34567890123', sifre: '1234', rol: 'hasta',
    ad: 'Sarah', soyad: 'Williams', dogumTarihi: '1995-11-08',
    telefon: '05323456789', email: 'sarah.williams@email.com',
    cinsiyet: 'Female', kan: 'O+',
  },
  // Doctors
  {
    id: 'D001', tc: '45678901234', sifre: '1234', rol: 'doktor',
    ad: 'Dr. James', soyad: 'Mitchell', dogumTarihi: '1975-05-10',
    telefon: '05334567890', email: 'j.mitchell@hospital.com',
    uzmanlik: 'Cardiology', bolumId: 'B001',
  },
  {
    id: 'D002', tc: '56789012345', sifre: '1234', rol: 'doktor',
    ad: 'Dr. Laura', soyad: 'Chen', dogumTarihi: '1980-09-25',
    telefon: '05345678901', email: 'l.chen@hospital.com',
    uzmanlik: 'Neurology', bolumId: 'B002',
  },
  {
    id: 'D003', tc: '67890123456', sifre: '1234', rol: 'doktor',
    ad: 'Dr. Robert', soyad: 'Hayes', dogumTarihi: '1978-01-30',
    telefon: '05356789012', email: 'r.hayes@hospital.com',
    uzmanlik: 'Orthopedics', bolumId: 'B003',
  },
  {
    id: 'D004', tc: '78901234567', sifre: '1234', rol: 'doktor',
    ad: 'Dr. Amanda', soyad: 'Foster', dogumTarihi: '1982-06-14',
    telefon: '05367890123', email: 'a.foster@hospital.com',
    uzmanlik: 'Internal Medicine', bolumId: 'B004',
  },
  // Nurses
  {
    id: 'HEM001', tc: '89012345678', sifre: '1234', rol: 'hemsire',
    ad: 'Nicole', soyad: 'Parker', dogumTarihi: '1990-04-18',
    telefon: '05378901234', email: 'n.parker@hospital.com',
    bolumId: 'B001',
  },
  {
    id: 'HEM002', tc: '90123456789', sifre: '1234', rol: 'hemsire',
    ad: 'Daniel', soyad: 'Moore', dogumTarihi: '1988-12-03',
    telefon: '05389012345', email: 'd.moore@hospital.com',
    bolumId: 'B002',
  },
  // Front Desk
  {
    id: 'OB001', tc: '01234567890', sifre: '1234', rol: 'onBuro',
    ad: 'Rachel', soyad: 'Turner', dogumTarihi: '1992-08-20',
    telefon: '05390123456', email: 'r.turner@hospital.com',
  },
  {
    id: 'OB002', tc: '11223344556', sifre: '1234', rol: 'onBuro',
    ad: 'Kevin', soyad: 'Walsh', dogumTarihi: '1987-02-11',
    telefon: '05301122334', email: 'k.walsh@hospital.com',
  },
];

// ===================== DEPARTMENTS =====================
export const bolumler = [
  { id: 'B001', ad: 'Cardiology', ikon: '❤️' },
  { id: 'B002', ad: 'Neurology', ikon: '🧠' },
  { id: 'B003', ad: 'Orthopedics', ikon: '🦴' },
  { id: 'B004', ad: 'Internal Medicine', ikon: '🩺' },
  { id: 'B005', ad: 'Ophthalmology', ikon: '👁️' },
  { id: 'B006', ad: 'ENT', ikon: '👂' },
  { id: 'B007', ad: 'Dermatology', ikon: '🩹' },
  { id: 'B008', ad: 'Psychiatry', ikon: '🧩' },
];

// ===================== DOCTOR SCHEDULES =====================
export const doktorProgramlari = [
  {
    id: 'DP001', doktorId: 'D001', bolumId: 'B001',
    musaitSaatler: [
      { tarih: '2026-05-05', saatler: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'] },
      { tarih: '2026-05-06', saatler: ['09:00', '09:30', '10:00', '11:00', '14:00', '15:00', '15:30'] },
      { tarih: '2026-05-07', saatler: ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30'] },
      { tarih: '2026-05-08', saatler: ['09:00', '09:30', '10:00', '10:30', '11:00'] },
      { tarih: '2026-05-09', saatler: ['14:00', '14:30', '15:00', '15:30', '16:00'] },
      { tarih: '2026-05-12', saatler: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30'] },
      { tarih: '2026-05-13', saatler: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
    ],
    musait: true,
  },
  {
    id: 'DP002', doktorId: 'D002', bolumId: 'B002',
    musaitSaatler: [
      { tarih: '2026-05-05', saatler: ['08:30', '09:00', '09:30', '10:00', '13:30', '14:00'] },
      { tarih: '2026-05-06', saatler: ['09:00', '09:30', '10:30', '11:00', '14:00', '14:30'] },
      { tarih: '2026-05-07', saatler: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { tarih: '2026-05-08', saatler: ['08:30', '09:00', '10:00', '11:00', '14:00'] },
      { tarih: '2026-05-12', saatler: ['09:00', '09:30', '10:00', '14:00', '14:30', '15:00'] },
    ],
    musait: true,
  },
  {
    id: 'DP003', doktorId: 'D003', bolumId: 'B003',
    musaitSaatler: [
      { tarih: '2026-05-05', saatler: ['10:00', '10:30', '11:00', '14:00', '14:30', '15:00'] },
      { tarih: '2026-05-06', saatler: ['09:00', '09:30', '11:00', '14:00', '15:00'] },
      { tarih: '2026-05-07', saatler: ['10:00', '10:30', '11:00'] },
      { tarih: '2026-05-09', saatler: ['09:00', '09:30', '10:00', '14:00', '14:30'] },
      { tarih: '2026-05-13', saatler: ['10:00', '10:30', '11:00', '14:00', '15:00'] },
    ],
    musait: false, // Coverage transfer scenario
  },
  {
    id: 'DP004', doktorId: 'D004', bolumId: 'B004',
    musaitSaatler: [
      { tarih: '2026-05-05', saatler: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'] },
      { tarih: '2026-05-06', saatler: ['09:00', '10:00', '11:00', '14:00', '15:00', '15:30'] },
      { tarih: '2026-05-07', saatler: ['09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'] },
      { tarih: '2026-05-08', saatler: ['09:00', '09:30', '10:00', '11:00', '14:00', '15:00'] },
      { tarih: '2026-05-09', saatler: ['09:00', '09:30', '10:30', '11:00', '14:00', '14:30', '15:00'] },
      { tarih: '2026-05-12', saatler: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
    ],
    musait: true,
  },
];

// ===================== APPOINTMENTS =====================
export const randevularBaslangic = [
  {
    id: 'R001', hastaId: 'H001', doktorId: 'D001', bolumId: 'B001',
    tarih: '2026-05-05', saat: '09:00', durum: 'onaylandi',
    notlar: 'Routine check-up',
  },
  {
    id: 'R002', hastaId: 'H001', doktorId: 'D004', bolumId: 'B004',
    tarih: '2026-05-08', saat: '10:00', durum: 'onaylandi',
    notlar: 'Blood test follow-up',
  },
  {
    id: 'R003', hastaId: 'H002', doktorId: 'D002', bolumId: 'B002',
    tarih: '2026-05-06', saat: '09:00', durum: 'onaylandi',
    notlar: 'Headache complaint',
  },
  {
    id: 'R004', hastaId: 'H002', doktorId: 'D001', bolumId: 'B001',
    tarih: '2026-04-20', saat: '11:00', durum: 'tamamlandi',
    notlar: 'ECG check',
  },
  {
    id: 'R005', hastaId: 'H003', doktorId: 'D003', bolumId: 'B003',
    tarih: '2026-05-07', saat: '10:00', durum: 'onaylandi',
    notlar: 'Knee pain examination',
  },
  {
    id: 'R006', hastaId: 'H001', doktorId: 'D002', bolumId: 'B002',
    tarih: '2026-04-15', saat: '14:00', durum: 'tamamlandi',
    notlar: 'Migraine follow-up',
  },
];

// ===================== MEDICAL RECORDS =====================
export const tibbiKayitlar = [
  {
    id: 'TK001', hastaId: 'H001', doktorId: 'D001',
    tarih: '2026-04-15', tani: 'Hypertension — under control',
    notlar: 'Blood pressure 130/85 mmHg. Continue current medication dose.',
    semptomlar: 'Headache, fatigue',
  },
  {
    id: 'TK002', hastaId: 'H001', doktorId: 'D002',
    tarih: '2026-04-15', tani: 'Migraine',
    notlar: '3-4 attacks per month. Prophylactic treatment initiated.',
    semptomlar: 'Throbbing headache, light sensitivity',
  },
  {
    id: 'TK003', hastaId: 'H002', doktorId: 'D001',
    tarih: '2026-04-20', tani: 'Arrhythmia — under observation',
    notlar: 'ECG within normal limits. Follow-up in 3 months.',
    semptomlar: 'Palpitations, shortness of breath',
  },
  {
    id: 'TK004', hastaId: 'H003', doktorId: 'D003',
    tarih: '2026-03-10', tani: 'Meniscus tear — left knee',
    notlar: 'Physical therapy recommended. MRI results pending.',
    semptomlar: 'Knee pain, swelling',
  },
];

// ===================== TEST RESULTS =====================
export const testSonuclari = [
  {
    id: 'TS001', hastaId: 'H001', doktorId: 'D001',
    tarih: '2026-04-20', testAdi: 'Complete Blood Count',
    durum: 'hazır',
    sonuclar: [
      { parametre: 'Hemoglobin', deger: '13.5 g/dL', referans: '12–16 g/dL', normal: true },
      { parametre: 'WBC', deger: '7200 /μL', referans: '4000–10000 /μL', normal: true },
      { parametre: 'Platelets', deger: '285000 /μL', referans: '150000–400000 /μL', normal: true },
      { parametre: 'Hematocrit', deger: '41%', referans: '36–46%', normal: true },
    ],
    notlar: 'All values within normal range.',
  },
  {
    id: 'TS002', hastaId: 'H001', doktorId: 'D004',
    tarih: '2026-04-22', testAdi: 'Biochemistry Panel',
    durum: 'hazır',
    sonuclar: [
      { parametre: 'Fasting Glucose', deger: '108 mg/dL', referans: '70–100 mg/dL', normal: false },
      { parametre: 'Total Cholesterol', deger: '210 mg/dL', referans: '<200 mg/dL', normal: false },
      { parametre: 'Triglycerides', deger: '145 mg/dL', referans: '<150 mg/dL', normal: true },
      { parametre: 'HDL', deger: '52 mg/dL', referans: '>40 mg/dL', normal: true },
      { parametre: 'LDL', deger: '135 mg/dL', referans: '<100 mg/dL', normal: false },
      { parametre: 'Creatinine', deger: '0.9 mg/dL', referans: '0.6–1.2 mg/dL', normal: true },
    ],
    notlar: 'Fasting glucose and cholesterol above reference range. Dietary changes recommended.',
  },
  {
    id: 'TS003', hastaId: 'H002', doktorId: 'D001',
    tarih: '2026-04-20', testAdi: 'ECG',
    durum: 'hazır',
    sonuclar: [
      { parametre: 'Rhythm', deger: 'Sinus rhythm', referans: 'Normal sinus rhythm', normal: true },
      { parametre: 'Heart Rate', deger: '78 bpm', referans: '60–100 bpm', normal: true },
      { parametre: 'PR Interval', deger: '168 ms', referans: '120–200 ms', normal: true },
    ],
    notlar: 'ECG within normal limits. No arrhythmia observed.',
  },
  {
    id: 'TS004', hastaId: 'H003', doktorId: 'D003',
    tarih: '2026-03-15', testAdi: 'MRI — Left Knee',
    durum: 'bekliyor',
    sonuclar: [],
    notlar: 'You will be notified when results are ready.',
  },
  {
    id: 'TS005', hastaId: 'H001', doktorId: 'D002',
    tarih: '2026-04-28', testAdi: 'Brain MRI',
    durum: 'bekliyor',
    sonuclar: [],
    notlar: 'Imaging completed. Radiologist evaluation in progress.',
  },
];

// ===================== PRESCRIPTIONS =====================
export const recetelerBaslangic = [
  {
    id: 'RC001', hastaId: 'H001', doktorId: 'D001',
    tarih: '2026-04-15', gecerlilikBitis: '2026-07-15',
    ilaclar: [
      {
        ilacAdi: 'Amlodipine',
        doz: '5 mg',
        kullanimSikligi: 'Once daily, morning',
        sure: '90 days',
        talimatlar: 'May be taken with or without food. Avoid grapefruit juice.',
      },
      {
        ilacAdi: 'Ramipril',
        doz: '10 mg',
        kullanimSikligi: 'Once daily, evening',
        sure: '90 days',
        talimatlar: 'Take with plenty of water. Notify doctor if blood pressure drops significantly.',
      },
    ],
    tani: 'Hypertension',
    aktif: true,
  },
  {
    id: 'RC002', hastaId: 'H001', doktorId: 'D002',
    tarih: '2026-04-15', gecerlilikBitis: '2026-07-15',
    ilaclar: [
      {
        ilacAdi: 'Propranolol',
        doz: '40 mg',
        kullanimSikligi: 'Twice daily (morning and evening)',
        sure: '90 days',
        talimatlar: 'Take with meals. Do not stop abruptly.',
      },
      {
        ilacAdi: 'Sumatriptan',
        doz: '50 mg',
        kullanimSikligi: 'At onset of attack, max 2 times per day',
        sure: 'During attack',
        talimatlar: 'Take at onset. Do not exceed 2 tablets in 24 hours.',
      },
    ],
    tani: 'Migraine',
    aktif: true,
  },
  {
    id: 'RC003', hastaId: 'H002', doktorId: 'D001',
    tarih: '2026-04-20', gecerlilikBitis: '2026-07-20',
    ilaclar: [
      {
        ilacAdi: 'Metoprolol',
        doz: '25 mg',
        kullanimSikligi: 'Once daily, morning',
        sure: '90 days',
        talimatlar: 'Take on an empty stomach. Do not use if pulse falls below 50.',
      },
    ],
    tani: 'Arrhythmia',
    aktif: true,
  },
  {
    id: 'RC004', hastaId: 'H001', doktorId: 'D004',
    tarih: '2026-01-10', gecerlilikBitis: '2026-04-10',
    ilaclar: [
      {
        ilacAdi: 'Metformin',
        doz: '500 mg',
        kullanimSikligi: 'Twice daily with meals',
        sure: '90 days',
        talimatlar: 'Take with food.',
      },
    ],
    tani: 'Pre-diabetes',
    aktif: false,
  },
];

// ===================== DEPENDENT PROFILES =====================
export const bagimliProfillerBaslangic = [
  {
    id: 'BP001', anaHastaId: 'H001',
    ad: 'Alex', soyad: 'Johnson', dogumTarihi: '2010-06-15',
    yakinlikTuru: 'Child', tc: '99887766554',
    telefon: '', aktif: true,
  },
  {
    id: 'BP002', anaHastaId: 'H001',
    ad: 'Margaret', soyad: 'Davis', dogumTarihi: '1948-03-20',
    yakinlikTuru: 'Mother', tc: '88776655443',
    telefon: '05321112233', aktif: true,
  },
];

// ===================== CAREGIVER APPROVALS =====================
export const bakimVerenOnayi = [
  {
    id: 'BVO001', hastaId: 'H002',
    bakimVerenAd: 'Thomas Brown', bakimVerenTc: '55443322110',
    yakinlikTuru: 'Son', onayTarihi: '2026-03-01',
    onaylayan: 'OB001', aktif: true,
  },
];

// ===================== FAQ =====================
export const sssIcerigi = [
  {
    id: 'SSS001', kategori: 'Appointments',
    soru: 'How do I book an appointment?',
    cevap: 'After logging in, go to "Book Appointment" and select a department, doctor, and available time slot.',
  },
  {
    id: 'SSS002', kategori: 'Appointments',
    soru: 'How far in advance can I cancel an appointment?',
    cevap: 'You may cancel up to 1 hour before your scheduled appointment time. Cancellations within 1 hour are not permitted.',
  },
  {
    id: 'SSS003', kategori: 'Appointments',
    soru: 'Can I reschedule my appointment?',
    cevap: 'Yes. Go to "My Appointments", select the appointment and click "Reschedule" to choose a new date and time.',
  },
  {
    id: 'SSS004', kategori: 'Test Results',
    soru: 'How do I access my test results?',
    cevap: 'Navigate to "Test Results" from the menu to view, download, or print your results.',
  },
  {
    id: 'SSS005', kategori: 'Test Results',
    soru: 'When will my test results be available?',
    cevap: 'Blood tests are typically available within 24 hours. Imaging results may take 48–72 hours.',
  },
  {
    id: 'SSS006', kategori: 'Prescriptions',
    soru: 'How do I view my prescriptions?',
    cevap: 'Go to "My Prescriptions" to see active and past prescriptions including medication name, dosage, and instructions.',
  },
  {
    id: 'SSS007', kategori: 'Account',
    soru: 'What should I do if I forgot my access code?',
    cevap: 'Use the "Recover Account" option on the login page. Enter your National ID and registered phone number to regain access.',
  },
  {
    id: 'SSS008', kategori: 'Account',
    soru: 'Can I manage family members from my account?',
    cevap: 'Yes. Use "Family Profiles" to add dependents (spouse, children, parents) and switch between profiles in the same session.',
  },
  {
    id: 'SSS009', kategori: 'Security',
    soru: 'Is my personal data secure?',
    cevap: 'All data is handled in accordance with applicable privacy laws. Communications are encrypted via HTTPS/TLS and sensitive data is protected against unauthorized access.',
  },
  {
    id: 'SSS010', kategori: 'Security',
    soru: 'Why does my session log out automatically?',
    cevap: 'For security, your session is automatically terminated after 15 minutes of inactivity. This is a clinical security requirement.',
  },
  {
    id: 'SSS011', kategori: 'Technical',
    soru: 'Which devices can I use to access the system?',
    cevap: 'The system is accessible from any modern web browser on computers, tablets, and smartphones.',
  },
  {
    id: 'SSS012', kategori: 'Technical',
    soru: 'What if I don\'t receive my SMS verification code?',
    cevap: 'Wait a few minutes and try "Resend Code". If the issue persists, contact front desk support.',
  },
];

// ===================== AUDIT LOGS =====================
export const denetimKayitlariBaslangic = [
  {
    id: 'DK001', kullaniciId: 'D001', zaman: '2026-04-22T09:15:00',
    islem: 'Medical record accessed', detay: 'Patient H001 record viewed',
  },
  {
    id: 'DK002', kullaniciId: 'OB001', zaman: '2026-04-22T10:30:00',
    islem: 'Manual appointment created', detay: 'Appointment for H003 with D003 created',
  },
  {
    id: 'DK003', kullaniciId: 'D002', zaman: '2026-04-23T14:00:00',
    islem: 'Prescription updated', detay: 'Patient H001 prescription RC002 updated',
  },
];
