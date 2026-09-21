import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppIcon from '../../components/AppIcon';
import { tibbiKayitlar, testSonuclari } from '../../data/mockData';
import { Button, EmptyState, Field, Modal, PageHeader, SectionCard } from '../../components/ui';
import { inputClassName } from '../../components/ui-helpers';
import { tarihFormat } from '../../utils/helpers';

export default function HastaKayitlari() {
  const { aktifKullanici, randevular, personelListesi, denetimEkle } = useApp();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [coveragePromptPatient, setCoveragePromptPatient] = useState(null);
  const [accessReason, setAccessReason] = useState('');

  const assignedPatientIds = [...new Set(randevular.filter((r) => r.doktorId === aktifKullanici.id && r.durum !== 'iptalEdildi').map((r) => r.hastaId))];
  const coveragePatientIds = [...new Set(randevular.filter((r) => r.doktorId === aktifKullanici.id && r.devirNotu).map((r) => r.hastaId))];
  const allPatientIds = [...new Set([...assignedPatientIds, ...coveragePatientIds])];
  const patients = allPatientIds.map((id) => personelListesi.find((p) => p.id === id)).filter(Boolean);

  const patientRecords = (patientId) => tibbiKayitlar.filter((k) => k.hastaId === patientId);
  const patientTests = (patientId) => testSonuclari.filter((t) => t.hastaId === patientId);

  const accessRecord = (patient) => {
    const isCoverageOnly = coveragePatientIds.includes(patient.id) && !assignedPatientIds.includes(patient.id);
    if (isCoverageOnly) {
      setCoveragePromptPatient(patient);
      return;
    }
    denetimEkle('Medical record access', `Patient ${patient.id} (${patient.ad} ${patient.soyad}) record viewed`);
    setSelectedPatient(patient);
  };

  const confirmCoverageAccess = () => {
    if (!coveragePromptPatient || !accessReason.trim()) return;
    denetimEkle('Coverage access', `Patient ${coveragePromptPatient.id} coverage access - Reason: ${accessReason}`);
    setSelectedPatient(coveragePromptPatient);
    setCoveragePromptPatient(null);
    setAccessReason('');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader eyebrow="Clinical records" title="Patient records" description="Review patient histories and test summaries with transfer-aware access control for coverage scenarios." />

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <SectionCard className="p-5">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Patients ({patients.length})</div>
            {!patients.length ? (
              <EmptyState icon="users" title="No assigned patients" description="Patients will appear here when appointments are scheduled under your care." className="min-h-48" />
            ) : (
              <div className="space-y-2">
                {patients.map((patient) => {
                  const isCoverage = coveragePatientIds.includes(patient.id) && !assignedPatientIds.includes(patient.id);
                  return (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => accessRecord(patient)}
                      className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${selectedPatient?.id === patient.id ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50'}`}
                    >
                      <div className="text-sm font-semibold text-slate-900">{patient.ad} {patient.soyad}</div>
                      <div className="mt-1 text-xs text-slate-500">{patient.dogumTarihi ? tarihFormat(patient.dogumTarihi) : ''}</div>
                      {isCoverage ? <div className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">Coverage transfer</div> : null}
                    </button>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {!selectedPatient ? (
            <EmptyState icon="records" title="Select a patient" description="Choose a patient from the left to review medical notes and related tests." />
          ) : (
            <div className="space-y-4">
              <SectionCard className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 font-bold text-cyan-800">
                    {selectedPatient.ad[0]}{selectedPatient.soyad[0]}
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-950">{selectedPatient.ad} {selectedPatient.soyad}</div>
                    <div className="text-sm text-slate-500">
                      {selectedPatient.cinsiyet ? `${selectedPatient.cinsiyet} · ` : ''}
                      {selectedPatient.kan ? `Blood Type ${selectedPatient.kan} · ` : ''}
                      {selectedPatient.dogumTarihi ? tarihFormat(selectedPatient.dogumTarihi) : ''}
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard className="p-6">
                <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900"><AppIcon name="records" className="h-5 w-5 text-cyan-700" />Medical records</div>
                {!patientRecords(selectedPatient.id).length ? (
                  <EmptyState icon="records" title="No records available" description="This patient does not yet have recorded clinical notes." className="min-h-40" />
                ) : (
                  <div className="space-y-3">
                    {patientRecords(selectedPatient.id).map((record) => (
                      <div key={record.id} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="text-sm font-semibold text-slate-900">{record.tani}</div>
                          <div className="text-xs text-slate-400">{tarihFormat(record.tarih)}</div>
                        </div>
                        <div className="mt-2 text-sm text-slate-500"><strong>Symptoms:</strong> {record.semptomlar}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">{record.notlar}</div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard className="p-6">
                <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900"><AppIcon name="flask" className="h-5 w-5 text-emerald-700" />Test results</div>
                {!patientTests(selectedPatient.id).length ? (
                  <EmptyState icon="flask" title="No test results" description="This patient has no related test activity on file." className="min-h-40" />
                ) : (
                  <div className="space-y-3">
                    {patientTests(selectedPatient.id).map((test) => (
                      <div key={test.id} className="app-list-item flex items-center gap-4 p-4">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900">{test.testAdi}</div>
                          <div className="text-sm text-slate-500">{tarihFormat(test.tarih)}</div>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${test.durum === 'hazır' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {test.durum === 'hazır' ? 'Ready' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
          )}
        </div>
      </div>

      {coveragePromptPatient ? (
        <Modal title="Coverage access required" description="This patient was transferred to your care. Provide a reason before opening the record." onClose={() => { setCoveragePromptPatient(null); setAccessReason(''); }} width="max-w-xl">
          <div className="space-y-4">
            <Field id="coverage-reason" label="Reason for access">
              <textarea id="coverage-reason" value={accessReason} onChange={(e) => setAccessReason(e.target.value)} rows={4} className={`${inputClassName} resize-none`} placeholder="Document why coverage access is needed..." />
            </Field>
            <div className="flex gap-3">
              <Button onClick={confirmCoverageAccess} disabled={!accessReason.trim()} className="w-full">Confirm Access</Button>
              <Button variant="secondary" onClick={() => { setCoveragePromptPatient(null); setAccessReason(''); }} className="w-full">Cancel</Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </Layout>
  );
}
