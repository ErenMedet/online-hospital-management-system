import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppIcon from '../../components/AppIcon';
import { Badge, Button, EmptyState, Modal, PageHeader, SectionCard, Tabs } from '../../components/ui';
import { tarihFormat, bolumAdi, kullaniciAdSoyad, durumTurkce, gelecekMi } from '../../utils/helpers';

export default function Randevularim() {
  const { aktifHastaId, randevular, randevuIptal, randevuYenidenZamanla, doktorProgramlari: dp, personelListesi } = useApp();
  const [filter, setFilter] = useState('all');
  const [cancelId, setCancelId] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [notification, setNotification] = useState(null);

  const myAppointments = randevular
    .filter((r) => r.hastaId === aktifHastaId)
    .sort((a, b) => new Date(`${b.tarih}T${b.saat}`) - new Date(`${a.tarih}T${a.saat}`));

  const filtered =
    filter === 'all' ? myAppointments :
    filter === 'upcoming' ? myAppointments.filter((r) => gelecekMi(r.tarih, r.saat) && r.durum !== 'iptalEdildi') :
    filter === 'past' ? myAppointments.filter((r) => !gelecekMi(r.tarih, r.saat)) :
    myAppointments.filter((r) => r.durum === filter);

  const notify = (type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const doCancel = () => {
    if (!cancelId) return;
    const result = randevuIptal(cancelId);
    setCancelId(null);
    result.basarili ? notify('success', 'Appointment cancelled successfully.') : notify('error', result.mesaj);
  };

  const availableRescheduleTimes = rescheduleModal && newDate
    ? (dp.find((p) => p.doktorId === rescheduleModal.doktorId)?.musaitSaatler.find((m) => m.tarih === newDate)?.saatler || [])
        .filter((s) => !randevular.some((r) => r.doktorId === rescheduleModal.doktorId && r.tarih === newDate && r.saat === s && r.durum !== 'iptalEdildi'))
    : [];

  const availableRescheduleDates = rescheduleModal
    ? dp.find((p) => p.doktorId === rescheduleModal.doktorId)?.musaitSaatler.map((m) => m.tarih) || []
    : [];

  const doReschedule = () => {
    if (!newDate || !newTime) return;
    randevuYenidenZamanla(rescheduleModal.id, newDate, newTime);
    setRescheduleModal(null);
    setNewDate('');
    setNewTime('');
    notify('success', 'Appointment rescheduled successfully.');
  };

  const filterItems = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
    { value: 'iptalEdildi', label: 'Cancelled' },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          eyebrow="Appointments"
          title="My appointments"
          description="Review upcoming visits, past encounters, and appointment changes from one responsive scheduling view."
          actions={<Button as={Link} to="/hasta/randevu-al" icon="calendar">New Appointment</Button>}
        />

        {notification ? (
          <div className={`rounded-3xl border px-4 py-4 text-sm ${notification.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-900'}`}>
            {notification.msg}
          </div>
        ) : null}

        <SectionCard className="p-5">
          <Tabs items={filterItems} value={filter} onChange={setFilter} />
        </SectionCard>

        {!filtered.length ? (
          <EmptyState icon="calendar" title="No appointments found" description="Try a different filter or schedule a new visit." action={<Button as={Link} to="/hasta/randevu-al" variant="secondary">Book Appointment</Button>} />
        ) : (
          <div className="space-y-4">
            {filtered.map((appointment) => {
              const isFuture = gelecekMi(appointment.tarih, appointment.saat);
              const canCancel = isFuture && appointment.durum === 'onaylandi';
              const statusTone =
                appointment.durum === 'onaylandi' ? 'success' :
                appointment.durum === 'tamamlandi' ? 'info' :
                appointment.durum === 'iptalEdildi' ? 'danger' : 'warning';

              return (
                <SectionCard key={appointment.id} className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                        <AppIcon name="building" className="h-5 w-5" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-base font-bold text-slate-950">{bolumAdi(appointment.bolumId)}</div>
                          <div className="text-sm text-slate-500">{kullaniciAdSoyad(appointment.doktorId, personelListesi)}</div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-1.5"><AppIcon name="calendar" className="h-4 w-4 text-slate-400" />{tarihFormat(appointment.tarih)}</span>
                          <span className="inline-flex items-center gap-1.5"><AppIcon name="clock" className="h-4 w-4 text-slate-400" />{appointment.saat}</span>
                        </div>
                        {appointment.notlar ? <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{appointment.notlar}</div> : null}
                        <div className="flex flex-wrap gap-2">
                          {appointment.manuelGiris ? <Badge tone="warning">Manual entry</Badge> : null}
                          {appointment.devirNotu ? <Badge tone="neutral">{appointment.devirNotu}</Badge> : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <Badge tone={statusTone}>{durumTurkce(appointment.durum)}</Badge>
                      {canCancel ? (
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button variant="secondary" onClick={() => setRescheduleModal(appointment)} icon="swap">
                            Reschedule
                          </Button>
                          <Button variant="danger" onClick={() => setCancelId(appointment.id)}>
                            Cancel
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </SectionCard>
              );
            })}
          </div>
        )}
      </div>

      {cancelId ? (
        <Modal title="Cancel appointment" description="This action will mark the appointment as cancelled." onClose={() => setCancelId(null)} width="max-w-md">
          <div className="space-y-4">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-900">
              Appointments can only be cancelled if they are more than one hour away.
            </div>
            <div className="flex gap-3">
              <Button variant="danger" onClick={doCancel} className="w-full">Yes, cancel</Button>
              <Button variant="secondary" onClick={() => setCancelId(null)} className="w-full">Keep it</Button>
            </div>
          </div>
        </Modal>
      ) : null}

      {rescheduleModal ? (
        <Modal
          title="Reschedule appointment"
          description={`Current slot: ${tarihFormat(rescheduleModal.tarih)} at ${rescheduleModal.saat}`}
          onClose={() => { setRescheduleModal(null); setNewDate(''); setNewTime(''); }}
        >
          <div className="space-y-5">
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">New date</div>
              <div className="flex flex-wrap gap-2">
                {availableRescheduleDates.filter((d) => d !== rescheduleModal.tarih).map((availableDate) => (
                  <button
                    key={availableDate}
                    type="button"
                    onClick={() => { setNewDate(availableDate); setNewTime(''); }}
                    className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${newDate === availableDate ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300'}`}
                  >
                    {tarihFormat(availableDate)}
                  </button>
                ))}
              </div>
            </div>
            {newDate ? (
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">New time</div>
                {!availableRescheduleTimes.length ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">No available slots remain for the selected date.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableRescheduleTimes.map((availableTime) => (
                      <button
                        key={availableTime}
                        type="button"
                        onClick={() => setNewTime(availableTime)}
                        className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${newTime === availableTime ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300'}`}
                      >
                        {availableTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
            <div className="flex gap-3">
              <Button onClick={doReschedule} disabled={!newDate || !newTime} className="w-full">Confirm</Button>
              <Button variant="secondary" onClick={() => { setRescheduleModal(null); setNewDate(''); setNewTime(''); }} className="w-full">Cancel</Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </Layout>
  );
}
