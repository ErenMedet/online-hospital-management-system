import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppIcon from '../../components/AppIcon';
import { testSonuclari } from '../../data/mockData';
import { Badge, Button, EmptyState, PageHeader, SectionCard } from '../../components/ui';
import { tarihFormat, kullaniciAdSoyad } from '../../utils/helpers';

export default function TestSonuclari() {
  const { aktifHastaId, personelListesi } = useApp();
  const [selected, setSelected] = useState(null);

  const myTests = testSonuclari
    .filter((t) => t.hastaId === aktifHastaId)
    .sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

  const download = (test) => {
    const content = `
MEDICARE HOSPITAL - TEST RESULT
================================
Test: ${test.testAdi}
Date: ${tarihFormat(test.tarih)}
Doctor: ${kullaniciAdSoyad(test.doktorId, personelListesi)}

RESULTS:
${test.sonuclar.map((s) => `${s.parametre}: ${s.deger} (Ref: ${s.referans}) ${s.normal ? 'Normal' : 'Abnormal'}`).join('\n')}

NOTES:
${test.notlar}
    `.trim();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `result_${test.testAdi.replace(/\s/g, '_')}_${test.tarih}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const print = (test) => {
    const html = `
      <html><head><title>Test Result</title>
      <style>body{font-family:Arial,sans-serif;max-width:700px;margin:20px auto;padding:20px;color:#0f172a}h2{color:#0f766e}table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #dbe4ee;padding:10px;text-align:left}th{background:#f8fafc}.abnormal{color:#be123c;font-weight:bold}.normal{color:#047857}</style></head>
      <body>
      <h2>MediCare Hospital</h2>
      <h3>${test.testAdi}</h3>
      <p>Date: ${tarihFormat(test.tarih)} | Doctor: ${kullaniciAdSoyad(test.doktorId, personelListesi)}</p>
      <table><tr><th>Parameter</th><th>Value</th><th>Reference</th><th>Status</th></tr>
      ${test.sonuclar.map((s) => `<tr><td>${s.parametre}</td><td>${s.deger}</td><td>${s.referans}</td><td class="${s.normal ? 'normal' : 'abnormal'}">${s.normal ? 'Normal' : 'Abnormal'}</td></tr>`).join('')}
      </table>
      <p><strong>Notes:</strong> ${test.notlar}</p>
      </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.print();
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader eyebrow="Laboratory and imaging" title="Test results" description="View completed tests, review abnormalities, and download or print result summaries." />

        {!myTests.length ? (
          <EmptyState icon="flask" title="No test results yet" description="Results will appear here after laboratory or imaging workflows are completed." />
        ) : (
          <div className="space-y-4">
            {myTests.map((test) => (
              <SectionCard key={test.id} className="overflow-hidden p-0">
                <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                      <AppIcon name="flask" className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-950">{test.testAdi}</div>
                      <div className="text-sm text-slate-500">{kullaniciAdSoyad(test.doktorId, personelListesi)} · {tarihFormat(test.tarih)}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={test.durum === 'hazır' ? 'success' : 'warning'}>{test.durum === 'hazır' ? 'Ready' : 'Pending'}</Badge>
                    {test.durum === 'hazır' ? (
                      <Button variant="secondary" onClick={() => setSelected(selected?.id === test.id ? null : test)} icon={selected?.id === test.id ? 'close' : 'eye'}>
                        {selected?.id === test.id ? 'Hide' : 'View'}
                      </Button>
                    ) : null}
                  </div>
                </div>

                {selected?.id === test.id && test.durum === 'hazır' ? (
                  <div className="border-t border-slate-100 px-5 py-5">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px] text-sm">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="rounded-l-2xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Parameter</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Value</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Reference</th>
                            <th className="rounded-r-2xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {test.sonuclar.map((result, index) => (
                            <tr key={index} className={`border-t border-slate-100 ${!result.normal ? 'bg-rose-50/60' : ''}`}>
                              <td className="px-4 py-4 font-medium text-slate-700">{result.parametre}</td>
                              <td className={`px-4 py-4 font-bold ${result.normal ? 'text-slate-900' : 'text-rose-700'}`}>{result.deger}</td>
                              <td className="px-4 py-4 text-slate-500">{result.referans}</td>
                              <td className="px-4 py-4">
                                <Badge tone={result.normal ? 'success' : 'danger'}>{result.normal ? 'Normal' : 'Abnormal'}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {test.notlar ? <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4 text-sm text-cyan-900">{test.notlar}</div> : null}
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <Button variant="success" onClick={() => download(test)} icon="download">Download</Button>
                      <Button variant="secondary" onClick={() => print(test)} icon="print">Print</Button>
                    </div>
                  </div>
                ) : null}

                {test.durum === 'bekliyor' ? (
                  <div className="border-t border-amber-100 bg-amber-50 px-5 py-4 text-sm text-amber-900">{test.notlar}</div>
                ) : null}
              </SectionCard>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
