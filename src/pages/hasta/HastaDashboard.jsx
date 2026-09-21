import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppIcon from '../../components/AppIcon';
import { Badge, Button, EmptyState, PageHeader, SectionCard, StatCard } from '../../components/ui';
import { tarihFormat, bolumAdi, kullaniciAdSoyad, gelecekMi } from '../../utils/helpers';
import { testSonuclari } from '../../data/mockData';

export default function HastaDashboard() {
  const { aktifKullanici, aktifProfil, aktifHastaId, randevular, receteler, personelListesi } = useApp();

  const myAppointments = randevular
    .filter((r) => r.hastaId === aktifHastaId && r.durum !== 'iptalEdildi')
    .sort((a, b) => new Date(`${a.tarih}T${a.saat}`) - new Date(`${b.tarih}T${b.saat}`));

  const upcoming = myAppointments.filter((r) => gelecekMi(r.tarih, r.saat)).slice(0, 3);
  const myTests = testSonuclari.filter((t) => t.hastaId === aktifHastaId);
  const activeRx = receteler.filter((r) => r.hastaId === aktifHastaId && r.aktif);

  const displayName = aktifProfil ? `${aktifProfil.ad} ${aktifProfil.soyad}` : aktifKullanici.ad;

  return (
    <Layout>
      <div className="space-y-6">
        {aktifProfil ? (
          <SectionCard className="border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.96),rgba(255,247,237,0.96))] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-200 text-sm font-bold text-amber-900">
                  {aktifProfil.ad[0]}{aktifProfil.soyad[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-900">Viewing dependent profile</div>
                  <div className="text-sm text-amber-700">{aktifProfil.ad} {aktifProfil.soyad} · {aktifProfil.yakinlikTuru}</div>
                </div>
              </div>
              <Badge tone="warning">Managed by your session</Badge>
            </div>
          </SectionCard>
        ) : null}

        <PageHeader
          eyebrow="Patient overview"
          title={`Hello, ${displayName}`}
          description="Track appointments, test results, prescriptions, and family profiles from a single clear workspace."
          actions={<Button as={Link} to="/hasta/randevu-al" icon="calendar">Book Appointment</Button>}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link to="/hasta/randevularim"><StatCard icon="calendar" value={upcoming.length} label="Upcoming Appointments" tone="cyan" className="h-full" /></Link>
          <Link to="/hasta/test-sonuclari"><StatCard icon="flask" value={myTests.filter((t) => t.durum === 'hazır').length} label="Results Ready" tone="emerald" className="h-full" /></Link>
          <Link to="/hasta/recetelerim"><StatCard icon="capsule" value={activeRx.length} label="Active Prescriptions" tone="violet" className="h-full" /></Link>
          <Link to="/hasta/test-sonuclari"><StatCard icon="clock" value={myTests.filter((t) => t.durum === 'bekliyor').length} label="Pending Tests" tone="amber" className="h-full" /></Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><AppIcon name="calendar" className="h-5 w-5 text-cyan-700" />Upcoming appointments</h2>
              <Link to="/hasta/randevularim" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800">View all</Link>
            </div>
            {!upcoming.length ? (
              <EmptyState
                icon="calendar"
                title="No upcoming appointments"
                description="Schedule a new visit to keep your care plan on track."
                action={<Button as={Link} to="/hasta/randevu-al" variant="secondary">Book now</Button>}
                className="min-h-48"
              />
            ) : (
              <div className="space-y-3">
                {upcoming.map((appointment) => (
                  <div key={appointment.id} className="app-list-item flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-sm font-bold text-white">
                      {appointment.saat}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900">{bolumAdi(appointment.bolumId)}</div>
                      <div className="text-sm text-slate-500">{kullaniciAdSoyad(appointment.doktorId, personelListesi)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">{tarihFormat(appointment.tarih)}</div>
                      <div className="text-xs text-slate-500">Confirmed</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><AppIcon name="flask" className="h-5 w-5 text-emerald-700" />Latest test results</h2>
              <Link to="/hasta/test-sonuclari" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800">View all</Link>
            </div>
            {!myTests.length ? (
              <EmptyState icon="flask" title="No test activity yet" description="Results will appear here once a lab or imaging workflow is completed." className="min-h-48" />
            ) : (
              <div className="space-y-3">
                {myTests.slice(0, 4).map((test) => (
                  <div key={test.id} className="app-list-item flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <AppIcon name="flask" className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900">{test.testAdi}</div>
                      <div className="text-sm text-slate-500">{tarihFormat(test.tarih)}</div>
                    </div>
                    <Badge tone={test.durum === 'hazır' ? 'success' : 'warning'}>{test.durum === 'hazır' ? 'Ready' : 'Pending'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {activeRx.length ? (
          <SectionCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><AppIcon name="capsule" className="h-5 w-5 text-violet-700" />Active prescriptions</h2>
              <Link to="/hasta/recetelerim" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800">View all</Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {activeRx.slice(0, 2).map((rx) => (
                <div key={rx.id} className="rounded-[28px] border border-violet-100 bg-violet-50/80 p-5">
                  <div className="text-base font-bold text-violet-950">{rx.tani}</div>
                  <div className="mt-1 text-sm text-violet-700">{kullaniciAdSoyad(rx.doktorId, personelListesi)} · {tarihFormat(rx.tarih)}</div>
                  <div className="mt-4 space-y-2">
                    {rx.ilaclar.slice(0, 2).map((med, index) => (
                      <div key={index} className="rounded-2xl bg-white/90 px-4 py-3 text-sm text-slate-700">
                        <strong className="text-slate-900">{med.ilacAdi}</strong> {med.doz} · {med.kullanimSikligi}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { to: '/hasta/randevu-al', icon: 'calendar', label: 'Book Appointment' },
            { to: '/hasta/test-sonuclari', icon: 'flask', label: 'Test Results' },
            { to: '/hasta/recetelerim', icon: 'capsule', label: 'Prescriptions' },
            { to: '/sss', icon: 'question', label: 'Help Center' },
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
