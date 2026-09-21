import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppIcon from '../../components/AppIcon';
import { EmptyState, PageHeader, SectionCard, StatCard } from '../../components/ui';
import { kullaniciAdSoyad, bolumAdi } from '../../utils/helpers';

export default function OnBuroDashboard() {
  const { aktifKullanici, randevular, personelListesi } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = randevular
    .filter((r) => r.tarih === today && r.durum !== 'iptalEdildi')
    .sort((a, b) => a.saat.localeCompare(b.saat));

  const pendingCount = randevular.filter((r) => r.tarih >= today && r.durum === 'onaylandi').length;
  const manualCount = randevular.filter((r) => r.manuelGiris).length;
  const totalPatients = [...new Set(randevular.map((r) => r.hastaId))].length;

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Operations overview"
          title={`Welcome, ${aktifKullanici.ad} ${aktifKullanici.soyad}`}
          description="Front-desk coordination workspace for appointments, manual scheduling, patient support, and operational management."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon="calendar" value={todayAppointments.length} label="Today's Appointments" tone="cyan" />
          <StatCard icon="clock" value={pendingCount} label="Upcoming Confirmed" tone="amber" />
          <StatCard icon="edit" value={manualCount} label="Manual Entries" tone="emerald" />
          <StatCard icon="users" value={totalPatients} label="Patients Served" tone="violet" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <SectionCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><AppIcon name="calendar" className="h-5 w-5 text-cyan-700" />Today's appointments</h2>
              <Link to="/on-buro/randevular" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800">View all</Link>
            </div>
            {!todayAppointments.length ? (
              <EmptyState icon="calendar" title="No appointments today" description="New bookings and arrivals will appear here for front-desk coordination." className="min-h-48" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppointments.slice(0, 8).map((appointment) => (
                      <tr key={appointment.id} className="border-b border-slate-100">
                        <td className="px-4 py-4 font-semibold text-cyan-700">{appointment.saat}</td>
                        <td className="px-4 py-4 text-slate-900">{kullaniciAdSoyad(appointment.hastaId, personelListesi)}</td>
                        <td className="px-4 py-4 text-slate-600">{kullaniciAdSoyad(appointment.doktorId, personelListesi)}</td>
                        <td className="px-4 py-4 text-slate-500">{bolumAdi(appointment.bolumId)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <SectionCard className="p-6">
            <div className="mb-4 text-lg font-bold text-slate-900">Quick access</div>
            <div className="space-y-3">
              {[
                { to: '/on-buro/manuel-randevu', icon: 'edit', title: 'Manual entry', description: 'Create an appointment on behalf of a patient.' },
                { to: '/on-buro/test-durumu', icon: 'flask', title: 'Test status lookup', description: 'Check readiness without exposing clinical content.' },
                { to: '/on-buro/bakim-veren', icon: 'group', title: 'Caregiver approvals', description: 'Register verified caregiver access requests.' },
                { to: '/on-buro/personel-yonetimi', icon: 'users', title: 'Staff management', description: 'Update role assignments and operational access.' },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="app-list-item flex items-center gap-4 p-4 hover:bg-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <AppIcon name={item.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-500">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </Layout>
  );
}
