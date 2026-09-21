import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppIcon from '../../components/AppIcon';
import { EmptyState, PageHeader, SectionCard, StatCard } from '../../components/ui';
import { bolumAdi, kullaniciAdSoyad } from '../../utils/helpers';

export default function HemsireDashboard() {
  const { aktifKullanici, randevular, personelListesi } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const deptAppointments = randevular
    .filter((r) => r.durum !== 'iptalEdildi')
    .filter((r) => {
      const doctor = personelListesi.find((p) => p.id === r.doktorId);
      return doctor?.bolumId === aktifKullanici.bolumId;
    })
    .sort((a, b) => `${a.tarih}${a.saat}`.localeCompare(`${b.tarih}${b.saat}`));

  const todayAppointments = deptAppointments.filter((r) => r.tarih === today);
  const upcomingCount = deptAppointments.filter((r) => r.tarih > today).length;

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Nursing station"
          title={`Welcome, ${aktifKullanici.ad} ${aktifKullanici.soyad}`}
          description={`Department overview for ${bolumAdi(aktifKullanici.bolumId)} with fast access to schedules and patient record summaries.`}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard icon="calendar" value={todayAppointments.length} label="Today's Appointments" tone="cyan" />
          <StatCard icon="clock" value={upcomingCount} label="Upcoming Visits" tone="emerald" />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><AppIcon name="calendar" className="h-5 w-5 text-cyan-700" />Today's appointments</h2>
              <Link to="/hemsire/program" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800">View all</Link>
            </div>
            {!todayAppointments.length ? (
              <EmptyState icon="calendar" title="No appointments today" description="Department visits for today will appear here." className="min-h-48" />
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="app-list-item flex items-center gap-4 p-4">
                    <div className="w-14 shrink-0 text-sm font-bold text-cyan-700">{appointment.saat}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900">{kullaniciAdSoyad(appointment.hastaId, personelListesi)}</div>
                      <div className="text-sm text-slate-500">{kullaniciAdSoyad(appointment.doktorId, personelListesi)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard className="p-6">
            <div className="mb-4 text-lg font-bold text-slate-900">Quick access</div>
            <div className="space-y-3">
              {[
                { to: '/hemsire/program', icon: 'calendar', title: 'Department Schedule', description: 'Review all planned appointments in your unit.' },
                { to: '/hemsire/hasta-kayitlari', icon: 'records', title: 'Patient Records', description: 'Open nursing-level patient summaries for your department.' },
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
