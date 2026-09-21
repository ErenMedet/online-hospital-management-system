import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { bolumler } from '../../data/mockData';
import { Button, EmptyState, Field, InfoBanner, PageHeader, SectionCard } from '../../components/ui';
import { inputClassName } from '../../components/ui-helpers';
import { tarihFormat } from '../../utils/helpers';

export default function ManuelRandevu() {
  const { personelListesi, doktorProgramlari, randevular, manuelRandevuEkle } = useApp();
  const [searchTC, setSearchTC] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const searchPatient = () => {
    const patient = personelListesi.find((p) => p.tc === searchTC && p.rol === 'hasta');
    if (!patient) {
      setSearchError('No patient found with this National ID.');
      setFoundPatient(null);
      return;
    }
    setSearchError('');
    setFoundPatient(patient);
  };

  const deptDoctors = selectedDept ? personelListesi.filter((p) => p.rol === 'doktor' && p.bolumId === selectedDept) : [];
  const doctorSchedule = doktorProgramlari.find((dp) => dp.doktorId === selectedDoctor);
  const bookedTimes = randevular.filter((r) => r.doktorId === selectedDoctor && r.tarih === selectedDate && r.durum !== 'iptalEdildi').map((r) => r.saat);
  const availableTimes = doctorSchedule ? (doctorSchedule.musaitSaatler.find((m) => m.tarih === selectedDate)?.saatler || []).filter((s) => !bookedTimes.includes(s)) : [];
  const availableDates = doctorSchedule ? doctorSchedule.musaitSaatler.map((m) => m.tarih) : [];

  const confirm = () => {
    if (!foundPatient || !selectedDept || !selectedDoctor || !selectedDate || !selectedTime) {
      setError('Please fill in all required fields.');
      return;
    }
    const res = manuelRandevuEkle({
      hastaId: foundPatient.id,
      doktorId: selectedDoctor,
      bolumId: selectedDept,
      tarih: selectedDate,
      saat: selectedTime,
      notlar: notes,
    });
    setResult(res);
    setError('');
  };

  const reset = () => {
    setResult(null);
    setFoundPatient(null);
    setSearchTC('');
    setSearchError('');
    setSelectedDept('');
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
  };

  if (result?.basarili) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl">
          <SectionCard className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-950">Appointment created</h2>
            <p className="mt-2 text-sm text-slate-500">The manual appointment has been booked successfully.</p>
            <div className="mx-auto mt-5 max-w-xl rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-left">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Patient</div><div className="mt-1 text-sm font-semibold text-slate-900">{foundPatient.ad} {foundPatient.soyad}</div></div>
                <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Date</div><div className="mt-1 text-sm font-semibold text-slate-900">{tarihFormat(selectedDate)}</div></div>
                <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Time</div><div className="mt-1 text-sm font-semibold text-slate-900">{selectedTime}</div></div>
              </div>
            </div>
            <div className="mt-6">
              <Button onClick={reset}>New Appointment</Button>
            </div>
          </SectionCard>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader eyebrow="Front-desk scheduling" title="Manual appointment entry" description="Create an appointment on behalf of a patient while keeping the same routing and availability logic used by self-service booking." />
        {error ? <InfoBanner tone="danger" icon="warning">{error}</InfoBanner> : null}

        <SectionCard className="p-6">
          <div className="mb-4 text-lg font-bold text-slate-900">1. Find patient</div>
          <div className="flex flex-col gap-3 md:flex-row">
            <input value={searchTC} onChange={(e) => setSearchTC(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="National ID Number" maxLength={11} className={`${inputClassName} font-mono tracking-[0.18em]`} />
            <Button onClick={searchPatient}>Search</Button>
          </div>
          {searchError ? <div className="mt-3 text-sm text-rose-700">{searchError}</div> : null}
          {foundPatient ? (
            <div className="mt-4 rounded-[24px] border border-cyan-200 bg-cyan-50 p-4">
              <div className="text-sm font-semibold text-cyan-900">{foundPatient.ad} {foundPatient.soyad}</div>
              <div className="text-sm text-cyan-700">{foundPatient.telefon || foundPatient.email || 'Contact available in record'}</div>
            </div>
          ) : null}
        </SectionCard>

        {foundPatient ? (
          <>
            <SectionCard className="p-6">
              <div className="mb-4 text-lg font-bold text-slate-900">2. Select department</div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {bolumler.map((department) => (
                  <button
                    key={department.id}
                    type="button"
                    onClick={() => { setSelectedDept(department.id); setSelectedDoctor(''); setSelectedDate(''); setSelectedTime(''); }}
                    className={`rounded-[28px] border p-4 text-left text-sm font-semibold transition ${selectedDept === department.id ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-800 hover:border-cyan-300'}`}
                  >
                    {department.ad}
                  </button>
                ))}
              </div>
            </SectionCard>

            {selectedDept ? (
              <SectionCard className="p-6">
                <div className="mb-4 text-lg font-bold text-slate-900">3. Select doctor</div>
                {!deptDoctors.length ? (
                  <EmptyState icon="users" title="No doctors in this department" description="Choose a different department to continue scheduling." className="min-h-40" />
                ) : (
                  <div className="space-y-3">
                    {deptDoctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        type="button"
                        onClick={() => { setSelectedDoctor(doctor.id); setSelectedDate(''); setSelectedTime(''); }}
                        className={`w-full rounded-[28px] border p-4 text-left transition ${selectedDoctor === doctor.id ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-800 hover:border-cyan-300'}`}
                      >
                        <div className="text-sm font-semibold">{doctor.ad} {doctor.soyad}</div>
                        <div className={`mt-1 text-sm ${selectedDoctor === doctor.id ? 'text-cyan-50' : 'text-slate-500'}`}>{doctor.uzmanlik}</div>
                      </button>
                    ))}
                  </div>
                )}
              </SectionCard>
            ) : null}

            {selectedDoctor ? (
              <SectionCard className="p-6">
                <div className="mb-4 text-lg font-bold text-slate-900">4. Choose date and time</div>
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-700">Date</div>
                    <div className="flex flex-wrap gap-2">
                      {availableDates.map((date) => (
                        <button key={date} type="button" onClick={() => { setSelectedDate(date); setSelectedTime(''); }} className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${selectedDate === date ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300'}`}>
                          {tarihFormat(date)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedDate ? (
                    <div>
                      <div className="mb-2 text-sm font-semibold text-slate-700">Time</div>
                      {!availableTimes.length ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">No available slots remain for the selected date.</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {availableTimes.map((time) => (
                            <button key={time} type="button" onClick={() => setSelectedTime(time)} className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${selectedTime === time ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300'}`}>
                              {time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                  <Field id="manual-appointment-notes" label="Notes (optional)">
                    <textarea id="manual-appointment-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${inputClassName} resize-none`} placeholder="Appointment note..." />
                  </Field>
                </div>
              </SectionCard>
            ) : null}

            {selectedTime ? <Button onClick={confirm} variant="success" className="w-full">Create Manual Appointment</Button> : null}
          </>
        ) : null}
      </div>
    </Layout>
  );
}
