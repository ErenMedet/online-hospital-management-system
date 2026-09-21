import { useDeferredValue, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { Button, EmptyState, PageHeader, SectionCard } from '../../components/ui';
import { inputClassName } from '../../components/ui-helpers';
import { tarihFormat, bolumAdi, kullaniciAdSoyad, durumRenk, durumTurkce } from '../../utils/helpers';

export default function OnBuroRandevular() {
  const { randevular, personelListesi } = useApp();
  const [searchName, setSearchName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const deferredSearch = useDeferredValue(searchName);

  const filtered = randevular
    .filter((r) => {
      const patient = personelListesi.find((p) => p.id === r.hastaId);
      const doctor = personelListesi.find((p) => p.id === r.doktorId);
      const nameMatch =
        !deferredSearch ||
        `${patient?.ad} ${patient?.soyad}`.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        `${doctor?.ad} ${doctor?.soyad}`.toLowerCase().includes(deferredSearch.toLowerCase());
      const dateMatch = !filterDate || r.tarih === filterDate;
      const statusMatch = filterStatus === 'all' || r.durum === filterStatus;
      return nameMatch && dateMatch && statusMatch;
    })
    .sort((a, b) => `${b.tarih}${b.saat}`.localeCompare(`${a.tarih}${a.saat}`));

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          eyebrow="Appointment operations"
          title="All appointments"
          description="Search and filter appointment activity across patients, doctors, dates, and status states."
          actions={<Button as={Link} to="/on-buro/manuel-randevu" icon="edit">Manual Entry</Button>}
        />

        <SectionCard className="p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_190px]">
            <input value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Search patient or doctor name..." className={inputClassName} />
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className={inputClassName} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputClassName}>
              <option value="all">All statuses</option>
              <option value="onaylandi">Confirmed</option>
              <option value="tamamlandi">Completed</option>
              <option value="iptalEdildi">Cancelled</option>
            </select>
          </div>
        </SectionCard>

        {!filtered.length ? (
          <EmptyState icon="calendar" title="No appointments found" description="Try changing the search query, date, or status filter." />
        ) : (
          <SectionCard className="p-0">
            <div className="border-b border-slate-100 px-5 py-4 text-sm text-slate-500">{filtered.length} appointments listed</div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Date / Time</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Patient</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Doctor</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Department</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((appointment) => (
                    <tr key={appointment.id} className="border-t border-slate-100">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-cyan-700">{tarihFormat(appointment.tarih)}</div>
                        <div className="text-sm text-slate-500">{appointment.saat}</div>
                        {appointment.manuelGiris ? <div className="mt-1 text-xs text-amber-700">Manual entry</div> : null}
                      </td>
                      <td className="px-5 py-4 text-slate-900">{kullaniciAdSoyad(appointment.hastaId, personelListesi)}</td>
                      <td className="px-5 py-4 text-slate-600">{kullaniciAdSoyad(appointment.doktorId, personelListesi)}</td>
                      <td className="px-5 py-4 text-slate-500">{bolumAdi(appointment.bolumId)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${durumRenk(appointment.durum)}`}>{durumTurkce(appointment.durum)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}
      </div>
    </Layout>
  );
}
