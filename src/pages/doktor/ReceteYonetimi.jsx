import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { Button, EmptyState, Field, InfoBanner, PageHeader, SectionCard } from '../../components/ui';
import { inputClassName } from '../../components/ui-helpers';
import { tarihFormat, kullaniciAdSoyad } from '../../utils/helpers';

export default function ReceteYonetimi() {
  const { aktifKullanici, receteler, receteGuncelle, personelListesi } = useApp();
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedMeds, setUpdatedMeds] = useState([]);
  const [notification, setNotification] = useState(null);

  const doctorPrescriptions = receteler.filter((r) => r.doktorId === aktifKullanici.id).sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

  const startEditing = (prescription) => {
    setUpdatedMeds(prescription.ilaclar.map((m) => ({ ...m })));
    setEditing(true);
  };

  const updateMed = (idx, field, value) => {
    setUpdatedMeds((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };

  const save = () => {
    const result = receteGuncelle(selected.id, updatedMeds);
    setEditing(false);
    setNotification(result.basarili ? 'Prescription updated successfully.' : 'Update failed.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader eyebrow="Prescriptions" title="Prescription management" description="Review your active and historical prescriptions, then update medication details without leaving the doctor workspace." />
        {notification ? <InfoBanner tone="success" icon="check">{notification}</InfoBanner> : null}

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <SectionCard className="p-5">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Prescriptions ({doctorPrescriptions.length})</div>
            {!doctorPrescriptions.length ? (
              <EmptyState icon="capsule" title="No prescriptions found" description="Prescriptions you create or manage will appear here." className="min-h-48" />
            ) : (
              <div className="space-y-2">
                {doctorPrescriptions.map((rx) => (
                  <button
                    key={rx.id}
                    type="button"
                    onClick={() => { setSelected(rx); setEditing(false); }}
                    className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${selected?.id === rx.id ? 'border-violet-300 bg-violet-50' : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-slate-50'}`}
                  >
                    <div className="text-sm font-semibold text-slate-900">{rx.tani}</div>
                    <div className="mt-1 text-xs text-slate-500">{kullaniciAdSoyad(rx.hastaId, personelListesi)} · {tarihFormat(rx.tarih)}</div>
                    <div className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${rx.aktif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {rx.aktif ? 'Active' : 'Expired'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </SectionCard>

          {!selected ? (
            <EmptyState icon="capsule" title="Select a prescription" description="Choose a prescription from the left to review or update medication details." />
          ) : (
            <SectionCard className="p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xl font-bold text-slate-950">{selected.tani}</div>
                  <div className="mt-1 text-sm text-slate-500">{kullaniciAdSoyad(selected.hastaId, personelListesi)} · {tarihFormat(selected.tarih)}</div>
                </div>
                {selected.aktif && !editing ? <Button onClick={() => startEditing(selected)} icon="edit">Edit Prescription</Button> : null}
              </div>

              {!editing ? (
                <div className="space-y-3">
                  {selected.ilaclar.map((med, index) => (
                    <div key={index} className="rounded-[28px] border border-violet-100 bg-violet-50/75 p-5">
                      <div className="text-sm font-bold text-violet-950">{med.ilacAdi} <span className="font-medium text-violet-700">- {med.doz}</span></div>
                      <div className="mt-2 text-sm text-slate-700"><strong>Frequency:</strong> {med.kullanimSikligi}</div>
                      <div className="text-sm text-slate-700"><strong>Duration:</strong> {med.sure}</div>
                      {med.talimatlar ? <div className="mt-3 rounded-2xl bg-white/90 px-4 py-3 text-sm text-slate-600">{med.talimatlar}</div> : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {updatedMeds.map((med, idx) => (
                    <div key={idx} className="rounded-[28px] border border-violet-100 bg-violet-50/75 p-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field id={`med-name-${idx}`} label="Medication Name">
                          <input id={`med-name-${idx}`} value={med.ilacAdi} onChange={(e) => updateMed(idx, 'ilacAdi', e.target.value)} className={inputClassName} />
                        </Field>
                        <Field id={`med-dose-${idx}`} label="Dosage">
                          <input id={`med-dose-${idx}`} value={med.doz} onChange={(e) => updateMed(idx, 'doz', e.target.value)} className={inputClassName} />
                        </Field>
                        <Field id={`med-duration-${idx}`} label="Duration">
                          <input id={`med-duration-${idx}`} value={med.sure} onChange={(e) => updateMed(idx, 'sure', e.target.value)} className={inputClassName} />
                        </Field>
                        <Field id={`med-frequency-${idx}`} label="Frequency">
                          <input id={`med-frequency-${idx}`} value={med.kullanimSikligi} onChange={(e) => updateMed(idx, 'kullanimSikligi', e.target.value)} className={inputClassName} />
                        </Field>
                      </div>
                      <Field id={`med-note-${idx}`} label="Instructions" className="mt-4">
                        <textarea id={`med-note-${idx}`} value={med.talimatlar} onChange={(e) => updateMed(idx, 'talimatlar', e.target.value)} rows={3} className={`${inputClassName} resize-none`} />
                      </Field>
                    </div>
                  ))}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button onClick={save} className="w-full">Save Changes</Button>
                    <Button variant="secondary" onClick={() => setEditing(false)} className="w-full">Cancel</Button>
                  </div>
                </div>
              )}
            </SectionCard>
          )}
        </div>
      </div>
    </Layout>
  );
}
