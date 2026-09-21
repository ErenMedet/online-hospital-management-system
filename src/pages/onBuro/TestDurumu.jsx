import { useState } from 'react';
import Layout from '../../components/Layout';
import { testSonuclari } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { EmptyState, InfoBanner, PageHeader, SectionCard, Button } from '../../components/ui';
import { inputClassName } from '../../components/ui-helpers';
import { tarihFormat } from '../../utils/helpers';

export default function TestDurumu() {
  const { personelListesi, denetimEkle } = useApp();
  const [searchTC, setSearchTC] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const search = () => {
    const patient = personelListesi.find((p) => p.tc === searchTC && p.rol === 'hasta');
    if (!patient) {
      setError('No patient found with this National ID.');
      setResults(null);
      return;
    }
    const tests = testSonuclari.filter((t) => t.hastaId === patient.id).map((t) => ({ id: t.id, testAdi: t.testAdi, tarih: t.tarih, durum: t.durum }));
    denetimEkle('Test status query', `Patient ${patient.id} test status queried`);
    setResults({ patient, tests });
    setError('');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader eyebrow="Restricted lookup" title="Test status lookup" description="Front-desk users can check readiness only. Clinical result values and medical details remain hidden." />
        <InfoBanner tone="warning" icon="warning">Only completion status is displayed. Test values, notes, and diagnosis content are intentionally restricted from this screen.</InfoBanner>

        <SectionCard className="p-6">
          <div className="mb-4 text-lg font-bold text-slate-900">Patient search</div>
          <div className="flex flex-col gap-3 md:flex-row">
            <input value={searchTC} onChange={(e) => setSearchTC(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="National ID Number" maxLength={11} className={`${inputClassName} font-mono tracking-[0.18em]`} />
            <Button onClick={search}>Search</Button>
          </div>
          {error ? <div className="mt-3 text-sm text-rose-700">{error}</div> : null}
        </SectionCard>

        {results ? (
          <SectionCard className="p-6">
            <div className="mb-4 flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 font-bold text-cyan-800">
                {results.patient.ad[0]}{results.patient.soyad[0]}
              </div>
              <div>
                <div className="text-base font-bold text-slate-950">{results.patient.ad} {results.patient.soyad}</div>
                <div className="text-sm text-slate-500">Test status summary</div>
              </div>
            </div>
            {!results.tests.length ? (
              <EmptyState icon="flask" title="No test records found" description="There are no test workflows currently associated with this patient." className="min-h-40" />
            ) : (
              <div className="space-y-3">
                {results.tests.map((test) => (
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
        ) : null}
      </div>
    </Layout>
  );
}
