import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { EmptyState, PageHeader, SectionCard, Button } from '../../components/ui';
import { tarihFormat, kullaniciAdSoyad, durumRenk, durumTurkce } from '../../utils/helpers';

export default function DoktorProgram() {
  const { aktifKullanici, randevular, personelListesi } = useApp();
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayStr = new Date().toISOString().split('T')[0];

  const doctorAppointments = randevular.filter((r) => r.doktorId === aktifKullanici.id && r.durum !== 'iptalEdildi');
  const dayAppointments = (date) => doctorAppointments.filter((r) => r.tarih === date).sort((a, b) => a.saat.localeCompare(b.saat));
  const weekAppointments = doctorAppointments.filter((r) => weekDays.includes(r.tarih)).sort((a, b) => `${a.tarih}${a.saat}`.localeCompare(`${b.tarih}${b.saat}`));

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          eyebrow="Schedule"
          title="My schedule"
          description="Weekly calendar and appointment stream for your current clinic load."
          actions={
            <>
              <Button variant="secondary" onClick={() => setWeekOffset((p) => p - 1)} icon="chevronLeft">Previous</Button>
              <Button variant="secondary" onClick={() => setWeekOffset(0)}>Current Week</Button>
              <Button variant="secondary" onClick={() => setWeekOffset((p) => p + 1)} iconRight="chevronRight">Next</Button>
            </>
          }
        />

        <SectionCard className="p-5">
          <div className="grid gap-2 md:grid-cols-7">
            {weekDays.map((date, i) => {
              const isToday = date === todayStr;
              const d = new Date(date);
              return (
                <div key={date} className={`rounded-[24px] border p-3 ${isToday ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white'}`}>
                  <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${isToday ? 'text-cyan-700' : 'text-slate-400'}`}>{dayLabels[i]}</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">{d.getDate()}</div>
                  <div className="mt-3 space-y-2">
                    {dayAppointments(date).length ? dayAppointments(date).map((appointment) => (
                      <div key={appointment.id} className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-2.5">
                        <div className="text-xs font-bold text-cyan-700">{appointment.saat}</div>
                        <div className="truncate text-xs text-slate-700">{kullaniciAdSoyad(appointment.hastaId, personelListesi)}</div>
                      </div>
                    )) : <div className="pt-5 text-center text-xs text-slate-300">No visits</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard className="p-6">
          <div className="mb-4 text-lg font-bold text-slate-900">This week's appointments</div>
          {!weekAppointments.length ? (
            <EmptyState icon="calendar" title="No appointments this week" description="The selected week does not contain any scheduled visits." className="min-h-44" />
          ) : (
            <div className="space-y-3">
              {weekAppointments.map((appointment) => (
                <div key={appointment.id} className="app-list-item flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="w-28 shrink-0">
                    <div className="text-sm font-semibold text-cyan-700">{tarihFormat(appointment.tarih)}</div>
                    <div className="text-sm text-slate-500">{appointment.saat}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900">{kullaniciAdSoyad(appointment.hastaId, personelListesi)}</div>
                    {appointment.notlar ? <div className="truncate text-sm text-slate-500">{appointment.notlar}</div> : null}
                    {appointment.devirNotu ? <div className="mt-1 text-xs text-amber-700">{appointment.devirNotu}</div> : null}
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${durumRenk(appointment.durum)}`}>{durumTurkce(appointment.durum)}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </Layout>
  );
}
