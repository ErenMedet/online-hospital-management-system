import { kullanicilar, bolumler } from '../data/mockData';

// Date formatting (MM/DD/YYYY)
export const tarihFormat = (tarihStr) => {
  if (!tarihStr) return '—';
  const [yil, ay, gun] = tarihStr.split('-');
  return `${ay}/${gun}/${yil}`;
};

export const tarihSaatFormat = (isoStr) => {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
};

// User lookup
export const kullaniciBul = (id, personelListesi) => {
  const liste = personelListesi || kullanicilar;
  return liste.find(k => k.id === id);
};

export const kullaniciAdSoyad = (id, personelListesi) => {
  const k = kullaniciBul(id, personelListesi);
  return k ? `${k.ad} ${k.soyad}` : id;
};

// Department lookup
export const bolumBul = (id) => bolumler.find(b => b.id === id);
export const bolumAdi = (id) => bolumBul(id)?.ad || id;

// Role labels (English)
export const rolTurkce = (rol) => {
  const map = {
    hasta: 'Patient',
    doktor: 'Doctor',
    hemsire: 'Nurse',
    onBuro: 'Front Desk',
  };
  return map[rol] || rol;
};

// Status badge colors
export const durumRenk = (durum) => {
  const map = {
    onaylandi: 'bg-emerald-100 text-emerald-800',
    tamamlandi: 'bg-cyan-100 text-cyan-800',
    iptalEdildi: 'bg-rose-100 text-rose-800',
    bekliyor: 'bg-amber-100 text-amber-800',
    hazır: 'bg-emerald-100 text-emerald-800',
  };
  return map[durum] || 'bg-gray-100 text-gray-700';
};

export const durumTonu = (durum) => {
  const map = {
    onaylandi: 'success',
    tamamlandi: 'info',
    iptalEdildi: 'danger',
    bekliyor: 'warning',
    hazır: 'success',
  };
  return map[durum] || 'neutral';
};

// Status labels (English)
export const durumTurkce = (durum) => {
  const map = {
    onaylandi: 'Confirmed',
    tamamlandi: 'Completed',
    iptalEdildi: 'Cancelled',
    bekliyor: 'Pending',
    hazır: 'Ready',
  };
  return map[durum] || durum;
};

// Unique ID
export const uniqueId = (prefix = 'id') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// Today's date string
export const bugunStr = () => new Date().toISOString().split('T')[0];

// Is appointment in the future?
export const gelecekMi = (tarih, saat) => {
  const rZamani = new Date(`${tarih}T${saat}`);
  return rZamani > new Date();
};
