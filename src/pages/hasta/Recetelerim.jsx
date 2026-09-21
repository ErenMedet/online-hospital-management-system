import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppIcon from '../../components/AppIcon';
import { Badge, Button, EmptyState, PageHeader, SectionCard, Tabs } from '../../components/ui';
import { tarihFormat, kullaniciAdSoyad } from '../../utils/helpers';

export default function Recetelerim() {
  const { aktifHastaId, receteler, personelListesi } = useApp();
  const [filter, setFilter] = useState('active');

  const myPrescriptions = receteler
    .filter((r) => r.hastaId === aktifHastaId)
    .sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

  const filtered = filter === 'active' ? myPrescriptions.filter((r) => r.aktif) : filter === 'past' ? myPrescriptions.filter((r) => !r.aktif) : myPrescriptions;

  const print = (rx) => {
    const html = `
      <html><head><title>Prescription</title>
      <style>body{font-family:Arial,sans-serif;max-width:700px;margin:20px auto;padding:20px;color:#0f172a}.med{background:#f8fafc;padding:14px;margin:8px 0;border-radius:14px;border-left:4px solid #7c3aed}.name{font-size:16px;font-weight:bold;color:#6d28d9}.detail{color:#475569;font-size:13px;margin-top:4px}</style></head>
      <body>
      <h2>MediCare Hospital - Prescription</h2>
      <p>Diagnosis: <strong>${rx.tani}</strong></p>
      <p>Date: ${tarihFormat(rx.tarih)} | Valid Until: ${tarihFormat(rx.gecerlilikBitis)}</p>
      <p>Doctor: ${kullaniciAdSoyad(rx.doktorId, personelListesi)}</p>
      ${rx.ilaclar.map((m) => `<div class="med"><div class="name">${m.ilacAdi} - ${m.doz}</div><div class="detail">Frequency: ${m.kullanimSikligi}</div><div class="detail">Duration: ${m.sure}</div><div class="detail">Instructions: ${m.talimatlar}</div></div>`).join('')}
      </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.print();
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader eyebrow="Medication history" title="Prescriptions" description="Review active treatment plans, validity windows, and printable medication instructions." />

        <SectionCard className="p-5">
          <Tabs
            items={[
              { value: 'active', label: 'Active' },
              { value: 'past', label: 'Past' },
              { value: 'all', label: 'All' },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </SectionCard>

        {!filtered.length ? (
          <EmptyState icon="capsule" title="No prescriptions in this category" description="Try another filter to view your medication history." />
        ) : (
          <div className="space-y-4">
            {filtered.map((rx) => (
              <SectionCard key={rx.id} className="overflow-hidden p-0">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-lg font-bold text-slate-950">{rx.tani}</div>
                    <div className="mt-1 text-sm text-slate-500">{kullaniciAdSoyad(rx.doktorId, personelListesi)} · {tarihFormat(rx.tarih)}</div>
                    <div className="mt-1 text-xs text-slate-400">Valid until {tarihFormat(rx.gecerlilikBitis)}{rx.guncellemeTarihi ? ` · Updated ${tarihFormat(rx.guncellemeTarihi)}` : ''}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={rx.aktif ? 'success' : 'neutral'}>{rx.aktif ? 'Active' : 'Expired'}</Badge>
                    <Button variant="secondary" onClick={() => print(rx)} icon="print">Print</Button>
                  </div>
                </div>

                <div className="grid gap-3 px-5 py-5">
                  {rx.ilaclar.map((med, index) => (
                    <div key={index} className="rounded-[28px] border border-violet-100 bg-violet-50/75 p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700">
                          <AppIcon name="capsule" className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-violet-950">{med.ilacAdi} <span className="font-medium text-violet-700">- {med.doz}</span></div>
                          <div className="mt-2 text-sm text-slate-700"><strong>Frequency:</strong> {med.kullanimSikligi}</div>
                          <div className="text-sm text-slate-700"><strong>Duration:</strong> {med.sure}</div>
                          {med.talimatlar ? <div className="mt-3 rounded-2xl bg-white/90 px-4 py-3 text-sm text-slate-600">{med.talimatlar}</div> : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
