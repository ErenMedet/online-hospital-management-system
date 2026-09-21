import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Giris from './pages/Giris';
import Kayit from './pages/Kayit';
import HesapKurtar from './pages/HesapKurtar';
import SSS from './pages/SSS';

// Shared
import Profil from './pages/Profil';

// Hasta
import HastaDashboard from './pages/hasta/HastaDashboard';
import RandevuAl from './pages/hasta/RandevuAl';
import Randevularim from './pages/hasta/Randevularim';
import TestSonuclari from './pages/hasta/TestSonuclari';
import Recetelerim from './pages/hasta/Recetelerim';
import BagimliProfiller from './pages/hasta/BagimliProfiller';

// Doktor
import DoktorDashboard from './pages/doktor/DoktorDashboard';
import DoktorProgram from './pages/doktor/DoktorProgram';
import HastaKayitlari from './pages/doktor/HastaKayitlari';
import ReceteYonetimi from './pages/doktor/ReceteYonetimi';

// Hemşire
import HemsireDashboard from './pages/hemsire/HemsireDashboard';
import HemsireProgram from './pages/hemsire/HemsireProgram';
import HemsireHastaKayitlari from './pages/hemsire/HemsireHastaKayitlari';

// Ön Büro
import OnBuroDashboard from './pages/onBuro/OnBuroDashboard';
import ManuelRandevu from './pages/onBuro/ManuelRandevu';
import TestDurumu from './pages/onBuro/TestDurumu';
import BakimVeren from './pages/onBuro/BakimVeren';
import PersonelYonetimi from './pages/onBuro/PersonelYonetimi';
import DoktorProgramYonetimi from './pages/onBuro/DoktorProgramYonetimi';
import OnBuroRandevular from './pages/onBuro/OnBuroRandevular';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/giris" element={<Giris />} />
          <Route path="/kayit" element={<Kayit />} />
          <Route path="/hesap-kurtar" element={<HesapKurtar />} />
          <Route path="/sss" element={<SSS />} />

          {/* Shared (any logged-in role) */}
          <Route path="/profil" element={
            <ProtectedRoute roller={['hasta', 'doktor', 'hemsire', 'onBuro']}>
              <Profil />
            </ProtectedRoute>
          } />

          {/* Hasta */}
          <Route path="/hasta" element={
            <ProtectedRoute roller={['hasta']}>
              <HastaDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hasta/randevu-al" element={
            <ProtectedRoute roller={['hasta']}>
              <RandevuAl />
            </ProtectedRoute>
          } />
          <Route path="/hasta/randevularim" element={
            <ProtectedRoute roller={['hasta']}>
              <Randevularim />
            </ProtectedRoute>
          } />
          <Route path="/hasta/test-sonuclari" element={
            <ProtectedRoute roller={['hasta']}>
              <TestSonuclari />
            </ProtectedRoute>
          } />
          <Route path="/hasta/recetelerim" element={
            <ProtectedRoute roller={['hasta']}>
              <Recetelerim />
            </ProtectedRoute>
          } />
          <Route path="/hasta/bagimli-profiller" element={
            <ProtectedRoute roller={['hasta']}>
              <BagimliProfiller />
            </ProtectedRoute>
          } />

          {/* Doktor */}
          <Route path="/doktor" element={
            <ProtectedRoute roller={['doktor']}>
              <DoktorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doktor/program" element={
            <ProtectedRoute roller={['doktor']}>
              <DoktorProgram />
            </ProtectedRoute>
          } />
          <Route path="/doktor/hasta-kayitlari" element={
            <ProtectedRoute roller={['doktor']}>
              <HastaKayitlari />
            </ProtectedRoute>
          } />
          <Route path="/doktor/recete-yonetimi" element={
            <ProtectedRoute roller={['doktor']}>
              <ReceteYonetimi />
            </ProtectedRoute>
          } />

          {/* Hemşire */}
          <Route path="/hemsire" element={
            <ProtectedRoute roller={['hemsire']}>
              <HemsireDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hemsire/program" element={
            <ProtectedRoute roller={['hemsire']}>
              <HemsireProgram />
            </ProtectedRoute>
          } />
          <Route path="/hemsire/hasta-kayitlari" element={
            <ProtectedRoute roller={['hemsire']}>
              <HemsireHastaKayitlari />
            </ProtectedRoute>
          } />

          {/* Ön Büro */}
          <Route path="/on-buro" element={
            <ProtectedRoute roller={['onBuro']}>
              <OnBuroDashboard />
            </ProtectedRoute>
          } />
          <Route path="/on-buro/manuel-randevu" element={
            <ProtectedRoute roller={['onBuro']}>
              <ManuelRandevu />
            </ProtectedRoute>
          } />
          <Route path="/on-buro/test-durumu" element={
            <ProtectedRoute roller={['onBuro']}>
              <TestDurumu />
            </ProtectedRoute>
          } />
          <Route path="/on-buro/bakim-veren" element={
            <ProtectedRoute roller={['onBuro']}>
              <BakimVeren />
            </ProtectedRoute>
          } />
          <Route path="/on-buro/personel-yonetimi" element={
            <ProtectedRoute roller={['onBuro']}>
              <PersonelYonetimi />
            </ProtectedRoute>
          } />
          <Route path="/on-buro/doktor-program" element={
            <ProtectedRoute roller={['onBuro']}>
              <DoktorProgramYonetimi />
            </ProtectedRoute>
          } />
          <Route path="/on-buro/randevular" element={
            <ProtectedRoute roller={['onBuro']}>
              <OnBuroRandevular />
            </ProtectedRoute>
          } />

          {/* Default */}
          <Route path="/" element={<Navigate to="/giris" replace />} />
          <Route path="*" element={<Navigate to="/giris" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
