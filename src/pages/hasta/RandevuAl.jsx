import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppIcon from '../../components/AppIcon';
import { bolumler } from '../../data/mockData';
import { Stepper, Button, EmptyState, Field, PageHeader, SectionCard } from '../../components/ui';
import { inputClassName } from '../../components/ui-helpers';
import { tarihFormat } from '../../utils/helpers';

const steps = [
  { kicker: 'Step 1', title: 'Department' },
  { kicker: 'Step 2', title: 'Doctor' },
  { kicker: 'Step 3', title: 'Date and time' },
  { kicker: 'Step 4', title: 'Confirm' },
];

export default function RandevuAl() {
  const { randevuAl, doktorProgramlari, randevular, personelListesi } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dept, setDept] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const deptDoctors = (deptId) => personelListesi.filter((k) => k.rol === 'doktor' && k.bolumId === deptId);
  const doctorSchedule = doctor ? doktorProgramlari.find((dp) => dp.doktorId === doctor.id) : null;
  const bookedTimes = randevular
    .filter((r) => r.doktorId === doctor?.id && r.tarih === date && r.durum !== 'iptalEdildi')
    .map((r) => r.saat);
  const availableTimes = doctorSchedule ? (doctorSchedule.musaitSaatler.find((m) => m.tarih === date)?.saatler || []).filter((s) => !bookedTimes.includes(s)) : [];
  const availableDates = doctorSchedule ? doctorSchedule.musaitSaatler.map((m) => m.tarih) : [];

  const confirm = () => {
    randevuAl({ doktorId: doctor.id, bolumId: dept.id, tarih: date, saat: time, notlar: notes });
    setConfirmed(true);
  };

  const reset = () => {
    setStep(1);
    setDept(null);
    setDoctor(null);
    setDate('');
    setTime('');
    setNotes('');
    setConfirmed(false);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader eyebrow="Appointment booking" title="Book an appointment" description="Choose a department, select an available clinician, and confirm a visit with full mobile-friendly clarity." />
        <Stepper steps={steps} currentStep={step} />

        {step === 1 ? (
          <SectionCard className="p-6">
            <div className="mb-4 text-lg font-bold text-slate-900">Select a department</div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {bolumler.map((department) => {
                const hasDoctor = deptDoctors(department.id).length > 0;
                return (
                  <button
                    key={department.id}
                    type="button"
                    onClick={() => {
                      if (hasDoctor) {
                        setDept(department);
                        setStep(2);
                      }
                    }}
                    disabled={!hasDoctor}
                    className={`rounded-[28px] border p-5 text-left transition ${hasDoctor ? 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50' : 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'}`}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <AppIcon name="building" className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{department.ad}</div>
                    <div className="mt-1 text-xs text-slate-500">{hasDoctor ? `${deptDoctors(department.id).length} available doctors` : 'No doctors available'}</div>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        ) : null}

        {step === 2 && dept ? (
          <SectionCard className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <button type="button" onClick={() => { setStep(1); setDept(null); }} className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                <AppIcon name="arrowLeft" className="h-4 w-4" />
              </button>
              <div>
                <div className="text-lg font-bold text-slate-900">{dept.ad}</div>
                <div className="text-sm text-slate-500">Select the clinician for this visit.</div>
              </div>
            </div>
            <div className="space-y-3">
              {deptDoctors(dept.id).map((d) => {
                const prog = doktorProgramlari.find((dp) => dp.doktorId === d.id);
                const available = prog?.musait !== false;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      if (available) {
                        setDoctor(d);
                        setStep(3);
                      }
                    }}
                    disabled={!available}
                    className={`flex w-full items-center gap-4 rounded-[28px] border p-5 text-left transition ${available ? 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50' : 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-60'}`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-sm font-bold text-cyan-800">
                      {d.ad.replace('Dr. ', '')[0]}{d.soyad[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900">{d.ad} {d.soyad}</div>
                      <div className="text-sm text-slate-500">{d.uzmanlik}</div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {available ? 'Available' : 'Unavailable'}
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        ) : null}

        {step === 3 && doctor ? (
          <SectionCard className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <button type="button" onClick={() => { setStep(2); setDoctor(null); setDate(''); setTime(''); }} className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                <AppIcon name="arrowLeft" className="h-4 w-4" />
              </button>
              <div>
                <div className="text-lg font-bold text-slate-900">Select date and time</div>
                <div className="text-sm text-slate-500">{doctor.ad} {doctor.soyad} · {dept.ad}</div>
              </div>
            </div>

            {!availableDates.length ? (
              <EmptyState icon="calendar" title="No available slots" description="This doctor does not currently have published appointment availability." />
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-700">Available dates</div>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((availableDate) => (
                      <button
                        key={availableDate}
                        type="button"
                        onClick={() => { setDate(availableDate); setTime(''); }}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${date === availableDate ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300'}`}
                      >
                        {tarihFormat(availableDate)}
                      </button>
                    ))}
                  </div>
                </div>

                {date ? (
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-700">Available times</div>
                    {!availableTimes.length ? (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">No time slots remain for the selected date.</div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {availableTimes.map((availableTime) => (
                          <button
                            key={availableTime}
                            type="button"
                            onClick={() => setTime(availableTime)}
                            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${time === availableTime ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300'}`}
                          >
                            {availableTime}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                <Field id="appointment-notes" label="Notes (optional)" hint="Share symptoms or visit context for the clinical team.">
                  <textarea id="appointment-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className={`${inputClassName} resize-none`} placeholder="Describe your symptoms or reason for visit..." />
                </Field>

                <Button type="button" className="w-full" disabled={!date || !time} onClick={() => setStep(4)} iconRight="arrowRight">
                  Continue
                </Button>
              </div>
            )}
          </SectionCard>
        ) : null}

        {step === 4 ? (
          <SectionCard className="p-6">
            {confirmed ? (
              <div className="space-y-5 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <AppIcon name="checkBadge" className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">Appointment confirmed</h2>
                  <p className="mt-2 text-sm text-slate-500">Your visit has been scheduled successfully.</p>
                </div>
                <div className="mx-auto max-w-xl rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-left">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Department</div><div className="mt-1 text-sm font-semibold text-slate-900">{dept.ad}</div></div>
                    <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Doctor</div><div className="mt-1 text-sm font-semibold text-slate-900">{doctor.ad} {doctor.soyad}</div></div>
                    <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Date</div><div className="mt-1 text-sm font-semibold text-slate-900">{tarihFormat(date)}</div></div>
                    <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Time</div><div className="mt-1 text-sm font-semibold text-slate-900">{time}</div></div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => navigate('/hasta/randevularim')} className="w-full">My Appointments</Button>
                  <Button variant="secondary" onClick={reset} className="w-full">Book Another</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Review and confirm</h2>
                  <p className="mt-1 text-sm text-slate-500">Double-check the visit details before creating the appointment.</p>
                </div>
                <div className="rounded-[28px] border border-cyan-200 bg-cyan-50 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Department</div><div className="mt-1 text-sm font-semibold text-slate-900">{dept?.ad}</div></div>
                    <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Doctor</div><div className="mt-1 text-sm font-semibold text-slate-900">{doctor?.ad} {doctor?.soyad}</div></div>
                    <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Date</div><div className="mt-1 text-sm font-semibold text-slate-900">{tarihFormat(date)}</div></div>
                    <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Time</div><div className="mt-1 text-sm font-semibold text-slate-900">{time}</div></div>
                  </div>
                  {notes ? <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">{notes}</div> : null}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="success" onClick={confirm} className="w-full">Confirm Appointment</Button>
                  <Button variant="secondary" onClick={() => setStep(3)} className="w-full">Back</Button>
                </div>
              </div>
            )}
          </SectionCard>
        ) : null}
      </div>
    </Layout>
  );
}
