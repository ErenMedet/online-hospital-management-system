import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { tibbiKayitlar } from '../../data/mockData';
import { EmptyState, InfoBanner, PageHeader, SectionCard } from '../../components/ui';
import { tarihFormat, bolumAdi } from '../../utils/helpers';

export default function HemsireHastaKayitlari() {
  const { aktifKullanici, randevular, personelListesi, denetimEkle } = useApp();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const deptPatientIds = [...new Set(
    randevular
      .filter((r) => {
        const doctor = personelListesi.find((p) => p.id === r.doktorId);
        return doctor?.bolumId === aktifKullanici.bolumId && r.durum !== 'iptalEdildi';
      })
      .map((r) => r.hastaId),
  )];

  const patients = deptPatientIds.map((id) => personelListesi.find((p) => p.id === id)).filter(Boolean);

  const accessRecord = (patient) => {
    denetimEkle('Medical record access (Nurse)', `Patient ${patient.id} record viewed`);
    setSelectedPatient(patient);
  };

  const patientRecords = selectedPatient ? tibbiKayitlar.filter((k) => k.hastaId === selectedPatient.id) : [];

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader eyebrow="Nursing summaries" title="Patient records" description={`${bolumAdi(aktifKullanici.bolumId)} patient summaries with nurse-level access controls.`} />
        <InfoBanner tone="warning" icon="warning">Nursing access is limited to department-level summaries. Full medical content and result interpretation remain restricted to doctor-authorized workflows.</InfoBanner>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <SectionCard className="p-5">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Patients ({patients.length})</div>
            {!patients.length ? (
              <EmptyState icon="users" title="No patients found" description="Department patients will appear here once scheduled appointments exist." className="min-h-48" />
            ) : (
              <div className="space-y-2">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => accessRecord(patient)}
                    className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${selectedPatient?.id === patient.id ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50'}`}
                  >
                    <div className="text-sm font-semibold text-slate-900">{patient.ad} {patient.soyad}</div>
                    <div className="mt-1 text-xs text-slate-500">{patient.dogumTarihi ? tarihFormat(patient.dogumTarihi) : ''}</div>
                  </button>
                ))}
              </div>
            )}
          </SectionCard>

          {!selectedPatient ? (
            <EmptyState icon="records" title="Select a patient" description="Choose a patient from the left to view the nursing summary." />
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
                      {selectedPatient.kan ? `Blood Type ${selectedPatient.kan}` : ''}
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard className="p-6">
                <div className="mb-4 text-lg font-bold text-slate-900">Medical records summary</div>
                {!patientRecords.length ? (
                  <EmptyState icon="records" title="No records available" description="There are no nursing-visible records for this patient." className="min-h-40" />
                ) : (
                  <div className="space-y-3">
                    {patientRecords.map((record) => (
                      <div key={record.id} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                        <div className="text-sm font-semibold text-slate-900">{record.tani}</div>
                        <div className="mt-1 text-sm text-slate-500">{tarihFormat(record.tarih)} · {record.semptomlar}</div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
