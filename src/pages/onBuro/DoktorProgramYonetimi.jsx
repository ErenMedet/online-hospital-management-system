import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { tarihFormat } from '../../utils/helpers';
import { Button, EmptyState, Field, InfoBanner, Modal, PageHeader, SectionCard } from '../../components/ui';
import { inputClassName } from '../../components/ui-helpers';

export default function DoktorProgramYonetimi() {
  const { personelListesi, doktorProgramlari, doktorProgramiGuncelle, doktorDevirAta, randevular } = useApp();
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [transferModal, setTransferModal] = useState(false);
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [notification, setNotification] = useState('');
  const [availabilityOverride, setAvailabilityOverride] = useState({});

  const doctors = personelListesi.filter((p) => p.rol === 'doktor');
  const selectedSchedule = doktorProgramlari.find((dp) => dp.doktorId === selectedDoctorId);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const toggleAvailability = (doctorId, currentStatus) => {
    doktorProgramiGuncelle(doctorId, { musait: !currentStatus });
    setAvailabilityOverride((prev) => ({ ...prev, [doctorId]: !currentStatus }));
    notify('Doctor availability updated.');
  };

  const confirmTransfer = () => {
    if (!transferFrom || !transferTo || transferFrom === transferTo) return;
    doktorDevirAta(transferFrom, transferTo);
    doktorProgramiGuncelle(transferFrom, { musait: false });
    setAvailabilityOverride((prev) => ({ ...prev, [transferFrom]: false }));
    setTransferModal(false);
    setTransferFrom('');
    setTransferTo('');
    notify('Coverage transfer completed successfully.');
  };

  const appointmentCount = (doctorId) => randevular.filter((r) => r.doktorId === doctorId && r.durum === 'onaylandi').length;
  const isAvailable = (doctorId) => {
    if (availabilityOverride[doctorId] !== undefined) return availabilityOverride[doctorId];
    const prog = doktorProgramlari.find((dp) => dp.doktorId === doctorId);
    return prog?.musait !== false;
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          eyebrow="Clinician operations"
          title="Doctor schedule management"
          description="Manage doctor availability and coverage transfers while preserving existing schedule and appointment logic."
          actions={<Button variant="warning" onClick={() => setTransferModal(true)} icon="swap">Coverage Transfer</Button>}
        />

        {notification ? <InfoBanner tone="success" icon="check">{notification}</InfoBanner> : null}

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <SectionCard className="p-6">
            <div className="mb-4 text-lg font-bold text-slate-900">Doctors and availability</div>
            <div className="space-y-3">
              {doctors.map((doctor) => {
                const available = isAvailable(doctor.id);
                return (
                  <div key={doctor.id} className={`rounded-[28px] border p-4 transition ${selectedDoctorId === doctor.id ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <button type="button" onClick={() => setSelectedDoctorId(selectedDoctorId === doctor.id ? '' : doctor.id)} className="min-w-0 flex-1 text-left">
                        <div className="text-sm font-semibold text-slate-900">{doctor.ad} {doctor.soyad}</div>
                        <div className="mt-1 text-sm text-slate-500">{doctor.uzmanlik} · {appointmentCount(doctor.id)} active appointments</div>
                      </button>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {available ? 'Available' : 'Unavailable'}
                        </div>
                        <Button variant="secondary" onClick={() => toggleAvailability(doctor.id, available)}>Toggle</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {selectedDoctorId && selectedSchedule ? (
            <SectionCard className="p-6">
              <div className="mb-4 text-lg font-bold text-slate-900">
                {doctors.find((d) => d.id === selectedDoctorId)?.ad} {doctors.find((d) => d.id === selectedDoctorId)?.soyad} - Available Slots
              </div>
              {!selectedSchedule.musaitSaatler.length ? (
                <EmptyState icon="calendar" title="No schedule configured" description="This doctor does not currently have published available slots." className="min-h-40" />
              ) : (
                <div className="space-y-3">
                  {selectedSchedule.musaitSaatler.map((day) => (
                    <div key={day.tarih} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                      <div className="mb-3 text-sm font-semibold text-slate-900">{tarihFormat(day.tarih)}</div>
                      <div className="flex flex-wrap gap-2">
                        {day.saatler.map((slot) => (
                          <span key={slot} className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          ) : (
            <EmptyState icon="calendar" title="Select a doctor" description="Choose a doctor from the left to review availability and schedule details." />
          )}
        </div>
      </div>

      {transferModal ? (
        <Modal title="Coverage transfer" description="Reassign active appointments from an unavailable doctor to another doctor." onClose={() => { setTransferModal(false); setTransferFrom(''); setTransferTo(''); }} width="max-w-xl">
          <div className="space-y-4">
            <Field id="transfer-from" label="Transferring Doctor (Unavailable)">
              <select id="transfer-from" value={transferFrom} onChange={(e) => setTransferFrom(e.target.value)} className={inputClassName}>
                <option value="">Select doctor</option>
                {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.ad} {doctor.soyad}</option>)}
              </select>
            </Field>
            <Field id="transfer-to" label="Receiving Doctor">
              <select id="transfer-to" value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className={inputClassName}>
                <option value="">Select doctor</option>
                {doctors.filter((doctor) => doctor.id !== transferFrom).map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.ad} {doctor.soyad}</option>
                ))}
              </select>
            </Field>
            {transferFrom && transferTo ? (
              <InfoBanner tone="warning" icon="warning">
                All active appointments from <strong>{doctors.find((d) => d.id === transferFrom)?.ad}</strong> will be transferred to <strong>{doctors.find((d) => d.id === transferTo)?.ad}</strong>.
              </InfoBanner>
            ) : null}
            <div className="flex gap-3">
              <Button variant="warning" onClick={confirmTransfer} disabled={!transferFrom || !transferTo || transferFrom === transferTo} className="w-full">Confirm Transfer</Button>
              <Button variant="secondary" onClick={() => { setTransferModal(false); setTransferFrom(''); setTransferTo(''); }} className="w-full">Cancel</Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </Layout>
  );
}
