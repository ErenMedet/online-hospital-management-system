import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppIcon from '../../components/AppIcon';
import { Button, EmptyState, PageHeader, SectionCard, StatCard } from '../../components/ui';
import { tarihFormat, bolumAdi, kullaniciAdSoyad, durumTurkce } from '../../utils/helpers';
import { testSonuclari } from '../../data/mockData';

export default function DoktorDashboard() {
  const { aktifKullanici, randevular, receteler, personelListesi } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const doctorAppointments = randevular
    .filter((r) => r.doktorId === aktifKullanici.id && r.durum !== 'iptalEdildi')
    .sort((a, b) => `${a.tarih}${a.saat}`.localeCompare(`${b.tarih}${b.saat}`));

  const todayAppointments = doctorAppointments.filter((r) => r.tarih === today);
  const upcomingAppointments = doctorAppointments.filter((r) => r.tarih > today).slice(0, 5);
  const patientIds = [...new Set(doctorAppointments.map((r) => r.hastaId))];

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Doctor command center"
          title={`Welcome, ${aktifKullanici.ad} ${aktifKullanici.soyad}`}
          description={`${aktifKullanici.uzmanlik} · ${bolumAdi(aktifKullanici.bolumId)}. Review your clinic load, patient access points, and prescription work from one dashboard.`}
          actions={<Button as={Link} to="/doktor/program" icon="calendar">View Schedule</Button>}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon="calendar" value={todayAppointments.length} label="Today's Appointments" tone="cyan" />
          <StatCard icon="users" value={patientIds.length} label="Patients in Care" tone="emerald" />
          <StatCard icon="capsule" value={receteler.filter((r) => r.doktorId === aktifKullanici.id && r.aktif).length} label="Active Prescriptions" tone="violet" />
          <StatCard icon="flask" value={testSonuclari.filter((t) => t.doktorId === aktifKullanici.id).length} label="Related Test Results" tone="amber" />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><AppIcon name="calendar" className="h-5 w-5 text-cyan-700" />Today's appointments</h2>
              <Link to="/doktor/program" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800">View all</Link>
            </div>
            {!todayAppointments.length ? (
              <EmptyState icon="calendar" title="No appointments today" description="Your clinic schedule is clear for the current day." className="min-h-48" />
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="app-list-item flex items-center gap-4 p-4">
                    <div className="w-14 shrink-0 text-sm font-bold text-cyan-700">{appointment.saat}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900">{kullaniciAdSoyad(appointment.hastaId, personelListesi)}</div>
                      {appointment.notlar ? <div className="truncate text-sm text-slate-500">{appointment.notlar}</div> : null}
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{durumTurkce(appointment.durum)}</div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard className="p-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900"><AppIcon name="clock" className="h-5 w-5 text-emerald-700" />Upcoming appointments</div>
            {!upcomingAppointments.length ? (
              <EmptyState icon="clock" title="No upcoming appointments" description="Future visits will populate here as new bookings are confirmed." className="min-h-48" />
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="app-list-item flex items-center gap-4 p-4">
                    <div className="shrink-0">
                      <div className="text-sm font-semibold text-cyan-700">{tarihFormat(appointment.tarih)}</div>
                      <div className="text-xs text-slate-500">{appointment.saat}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900">{kullaniciAdSoyad(appointment.hastaId, personelListesi)}</div>
                      {appointment.notlar ? <div className="truncate text-sm text-slate-500">{appointment.notlar}</div> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            { to: '/doktor/program', icon: 'calendar', label: 'My Schedule' },
            { to: '/doktor/hasta-kayitlari', icon: 'records', label: 'Patient Records' },
            { to: '/doktor/recete-yonetimi', icon: 'capsule', label: 'Prescriptions' },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="app-card-panel flex items-center gap-4 p-5 hover:-translate-y-0.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <AppIcon name={item.icon} className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold text-slate-800">{item.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
