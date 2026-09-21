import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  kullanicilar,
  randevularBaslangic,
  recetelerBaslangic,
  bagimliProfillerBaslangic,
  bakimVerenOnayi,
  denetimKayitlariBaslangic,
  doktorProgramlari as doktorProgramlariBaslangic,
} from '../data/mockData';

const AppContext = createContext(null);

const ls = {
  get: (key, fallback) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { return; }
  },
};

export function AppProvider({ children }) {
  const [aktifKullanici, setAktifKullanici] = useState(() => ls.get('aktifKullanici', null));
  const [aktifProfil, setAktifProfil] = useState(() => ls.get('aktifProfil', null));
  const [randevular, setRandevular] = useState(() => ls.get('randevular', randevularBaslangic));
  const [receteler, setReceteler] = useState(() => ls.get('receteler', recetelerBaslangic));
  const [bagimliProfiller, setBagimliProfiller] = useState(() => ls.get('bagimliProfiller', bagimliProfillerBaslangic));
  const [bakimOnayi, setBakimOnayi] = useState(() => ls.get('bakimOnayi', bakimVerenOnayi));
  const [denetimKayitlari, setDenetimKayitlari] = useState(() => ls.get('denetimKayitlari', denetimKayitlariBaslangic));
  const [doktorProgramlari, setDoktorProgramlari] = useState(() => ls.get('doktorProgramlari', doktorProgramlariBaslangic));
  const [personelListesi, setPersonelListesi] = useState(() => ls.get('personelListesi', kullanicilar));
  const [sonIslemZamani, setSonIslemZamani] = useState(() => Date.now());

  useEffect(() => { ls.set('aktifKullanici', aktifKullanici); }, [aktifKullanici]);
  useEffect(() => { ls.set('aktifProfil', aktifProfil); }, [aktifProfil]);
  useEffect(() => { ls.set('randevular', randevular); }, [randevular]);
  useEffect(() => { ls.set('receteler', receteler); }, [receteler]);
  useEffect(() => { ls.set('bagimliProfiller', bagimliProfiller); }, [bagimliProfiller]);
  useEffect(() => { ls.set('bakimOnayi', bakimOnayi); }, [bakimOnayi]);
  useEffect(() => { ls.set('denetimKayitlari', denetimKayitlari); }, [denetimKayitlari]);
  useEffect(() => { ls.set('doktorProgramlari', doktorProgramlari); }, [doktorProgramlari]);
  useEffect(() => { ls.set('personelListesi', personelListesi); }, [personelListesi]);

  const oturumuKapat = useCallback(() => {
    setAktifKullanici(null);
    setAktifProfil(null);
    ls.set('aktifKullanici', null);
    ls.set('aktifProfil', null);
  }, []);

  // Auto-logout after 15 minutes of inactivity
  useEffect(() => {
    if (!aktifKullanici) return;
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const resetTimer = () => setSonIslemZamani(Date.now());
    events.forEach(e => window.addEventListener(e, resetTimer));
    const interval = setInterval(() => {
      if (Date.now() - sonIslemZamani > 15 * 60 * 1000) {
        oturumuKapat();
        alert('Your session was closed after 15 minutes of inactivity.');
      }
    }, 30000);
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearInterval(interval);
    };
  }, [aktifKullanici, sonIslemZamani, oturumuKapat]);

  const denetimEkle = useCallback((islem, detay) => {
    if (!aktifKullanici) return;
    const yeni = {
      id: `DK${Date.now()}`,
      kullaniciId: aktifKullanici.id,
      zaman: new Date().toISOString(),
      islem, detay,
    };
    setDenetimKayitlari(prev => [yeni, ...prev]);
  }, [aktifKullanici]);

  // Login
  const girisYap = (tc, rol) => {
    const kullanici = personelListesi.find(k => k.tc === tc && k.rol === rol);
    if (!kullanici) return { basarili: false, mesaj: 'Invalid National ID or role selection.' };
    setAktifKullanici(kullanici);
    setAktifProfil(null);
    const denetimYeni = {
      id: `DK${Date.now()}`,
      kullaniciId: kullanici.id,
      zaman: new Date().toISOString(),
      islem: 'Login',
      detay: `${kullanici.ad} ${kullanici.soyad} signed in`,
    };
    setDenetimKayitlari(prev => [denetimYeni, ...prev]);
    return { basarili: true };
  };

  // Register
  const kayitOl = (bilgiler) => {
    const mevcut = personelListesi.find(k => k.tc === bilgiler.tc);
    if (mevcut) return { basarili: false, mesaj: 'An account with this National ID already exists.' };
    const yeni = { id: `H${Date.now()}`, rol: 'hasta', ...bilgiler };
    setPersonelListesi(prev => [...prev, yeni]);
    return { basarili: true };
  };

  // Book appointment
  const randevuAl = (veri) => {
    const yeni = {
      id: `R${Date.now()}`,
      hastaId: aktifProfil ? aktifProfil.id : aktifKullanici.id,
      durum: 'onaylandi',
      ...veri,
    };
    setRandevular(prev => [...prev, yeni]);
    denetimEkle('Appointment booked', `Appointment on ${veri.tarih} at ${veri.saat} created`);
    return { basarili: true, randevu: yeni };
  };

  // Cancel appointment
  const randevuIptal = (randevuId) => {
    const randevu = randevular.find(r => r.id === randevuId);
    if (!randevu) return { basarili: false, mesaj: 'Appointment not found.' };
    const randevuZamani = new Date(`${randevu.tarih}T${randevu.saat}`);
    const farkSaat = (randevuZamani - new Date()) / (1000 * 60 * 60);
    if (farkSaat < 1) {
      return { basarili: false, mesaj: 'Appointments can only be cancelled at least 1 hour in advance.' };
    }
    setRandevular(prev => prev.map(r => r.id === randevuId ? { ...r, durum: 'iptalEdildi' } : r));
    denetimEkle('Appointment cancelled', `${randevu.tarih} ${randevu.saat} appointment cancelled`);
    return { basarili: true };
  };

  // Reschedule appointment
  const randevuYenidenZamanla = (randevuId, yeniTarih, yeniSaat) => {
    setRandevular(prev => prev.map(r =>
      r.id === randevuId ? { ...r, tarih: yeniTarih, saat: yeniSaat, durum: 'onaylandi' } : r
    ));
    denetimEkle('Appointment rescheduled', `Updated to ${yeniTarih} at ${yeniSaat}`);
    return { basarili: true };
  };

  // Update prescription (doctor)
  const receteGuncelle = (receteId, guncelIlaclar) => {
    setReceteler(prev => prev.map(r =>
      r.id === receteId ? { ...r, ilaclar: guncelIlaclar, guncellemeTarihi: new Date().toISOString().split('T')[0] } : r
    ));
    denetimEkle('Prescription updated', `Prescription ${receteId} updated`);
    return { basarili: true };
  };

  // Add dependent profile
  const bagimliProfilEkle = (veri) => {
    const yeni = { id: `BP${Date.now()}`, anaHastaId: aktifKullanici.id, aktif: true, ...veri };
    setBagimliProfiller(prev => [...prev, yeni]);
    return { basarili: true, profil: yeni };
  };

  // Add caregiver consent (front desk)
  const bakimVerenOnasiEkle = (veri) => {
    const yeni = {
      id: `BVO${Date.now()}`,
      onayTarihi: new Date().toISOString().split('T')[0],
      onaylayan: aktifKullanici.id,
      aktif: true,
      ...veri,
    };
    setBakimOnayi(prev => [...prev, yeni]);
    denetimEkle('Caregiver consent recorded', `Caregiver consent for patient ${veri.hastaId} saved`);
    return { basarili: true };
  };

  // Manual appointment (front desk)
  const manuelRandevuEkle = (veri) => {
    const yeni = {
      id: `R${Date.now()}`,
      durum: 'onaylandi',
      manuelGiris: true,
      girenPersonel: aktifKullanici.id,
      ...veri,
    };
    setRandevular(prev => [...prev, yeni]);
    denetimEkle('Manual appointment', `Manual appointment created for patient ${veri.hastaId}`);
    return { basarili: true, randevu: yeni };
  };

  // Update doctor schedule
  const doktorProgramiGuncelle = (doktorId, yeniProgram) => {
    setDoktorProgramlari(prev => prev.map(dp =>
      dp.doktorId === doktorId ? { ...dp, ...yeniProgram } : dp
    ));
    denetimEkle('Schedule updated', `Doctor ${doktorId} schedule updated`);
    return { basarili: true };
  };

  // Doctor coverage transfer
  const doktorDevirAta = (mevcutDoktorId, yeniDoktorId) => {
    setRandevular(prev => prev.map(r =>
      r.doktorId === mevcutDoktorId && r.durum === 'onaylandi'
        ? { ...r, doktorId: yeniDoktorId, devirNotu: `Coverage transfer: ${mevcutDoktorId} → ${yeniDoktorId}` }
        : r
    ));
    denetimEkle('Coverage transfer', `${mevcutDoktorId} appointments transferred to ${yeniDoktorId}`);
    return { basarili: true };
  };

  // Update staff role
  const personelRoluGuncelle = (personelId, yeniRol) => {
    setPersonelListesi(prev => prev.map(p => p.id === personelId ? { ...p, rol: yeniRol } : p));
    denetimEkle('Role changed', `Staff ${personelId} role updated to ${yeniRol}`);
    return { basarili: true };
  };

  // Update own profile
  const profilGuncelle = (guncelBilgiler) => {
    setPersonelListesi(prev => prev.map(p =>
      p.id === aktifKullanici.id ? { ...p, ...guncelBilgiler } : p
    ));
    setAktifKullanici(prev => ({ ...prev, ...guncelBilgiler }));
    return { basarili: true };
  };

  const aktifHastaId = aktifProfil ? aktifProfil.id : aktifKullanici?.id;

  return (
    <AppContext.Provider value={{
      aktifKullanici, aktifProfil, setAktifProfil,
      aktifHastaId,
      randevular, receteler, bagimliProfiller, bakimOnayi,
      denetimKayitlari, doktorProgramlari, personelListesi,
      girisYap, kayitOl, oturumuKapat,
      randevuAl, randevuIptal, randevuYenidenZamanla,
      receteGuncelle,
      bagimliProfilEkle,
      bakimVerenOnasiEkle,
      manuelRandevuEkle,
      doktorProgramiGuncelle, doktorDevirAta,
      personelRoluGuncelle,
      profilGuncelle,
      denetimEkle,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
