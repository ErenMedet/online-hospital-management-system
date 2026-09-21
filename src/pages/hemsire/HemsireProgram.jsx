import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { EmptyState, PageHeader, SectionCard } from '../../components/ui';
import { tarihFormat, bolumAdi, kullaniciAdSoyad, durumRenk, durumTurkce } from '../../utils/helpers';

export default function HemsireProgram() {
  const { aktifKullanici, randevular, personelListesi } = useApp();

  const deptAppointments = randevular
    .filter((r) => r.durum !== 'iptalEdildi')
    .filter((r) => {
      const doctor = personelListesi.find((p) => p.id === r.doktorId);
      return doctor?.bolumId === aktifKullanici.bolumId;
    })
    .sort((a, b) => `${a.tarih}${a.saat}`.localeCompare(`${b.tarih}${b.saat}`));

  const today = new Date().toISOString().split('T')[0];
  const upcoming = deptAppointments.filter((r) => r.tarih >= today);
  const past = deptAppointments.filter((r) => r.tarih < today);

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader eyebrow="Department operations" title="Department schedule" description={`${bolumAdi(aktifKullanici.bolumId)} appointment view for nursing coordination and patient flow.`} />

        {!upcoming.length && !past.length ? (
          <EmptyState icon="calendar" title="No appointments in this department" description="Scheduled visits will appear here as doctors and patients confirm appointments." />
        ) : (
          <div className="space-y-6">
            {upcoming.length ? (
              <SectionCard className="p-6">
                <div className="mb-4 text-lg font-bold text-slate-900">Today and upcoming</div>
                <div className="space-y-3">
                  {upcoming.map((appointment) => (
                    <div key={appointment.id} className="app-list-item flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                      <div className="w-28 shrink-0">
                        <div className="text-sm font-semibold text-cyan-700">{tarihFormat(appointment.tarih)}</div>
                        <div className="text-sm text-slate-500">{appointment.saat}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-900">{kullaniciAdSoyad(appointment.hastaId, personelListesi)}</div>
                        <div className="text-sm text-slate-500">{kullaniciAdSoyad(appointment.doktorId, personelListesi)}</div>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${durumRenk(appointment.durum)}`}>{durumTurkce(appointment.durum)}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            {past.length ? (
              <SectionCard className="p-6">
                <div className="mb-4 text-lg font-bold text-slate-900">Recent past appointments</div>
                <div className="space-y-3">
                  {past.slice(0, 10).map((appointment) => (
                    <div key={appointment.id} className="app-list-item flex flex-col gap-3 p-4 opacity-80 sm:flex-row sm:items-center">
                      <div className="w-28 shrink-0">
                        <div className="text-sm font-semibold text-slate-700">{tarihFormat(appointment.tarih)}</div>
                        <div className="text-sm text-slate-400">{appointment.saat}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-800">{kullaniciAdSoyad(appointment.hastaId, personelListesi)}</div>
                        <div className="text-sm text-slate-500">{kullaniciAdSoyad(appointment.doktorId, personelListesi)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ) : null}
          </div>
        )}
      </div>
    </Layout>
  );
}
