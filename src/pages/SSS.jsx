import { useDeferredValue, useState } from 'react';
import { sssIcerigi } from '../data/mockData';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import AppIcon from '../components/AppIcon';
import { EmptyState, PageHeader, SectionCard, Tabs } from '../components/ui';
import { inputClassName } from '../components/ui-helpers';

export default function SSS() {
  const { aktifKullanici } = useApp();
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const categories = ['All', ...new Set(sssIcerigi.map((s) => s.kategori))];

  const filtered = sssIcerigi.filter((s) => {
    const catMatch = filter === 'All' || s.kategori === filter;
    const searchMatch =
      !deferredSearch ||
      s.soru.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      s.cevap.toLowerCase().includes(deferredSearch.toLowerCase());
    return catMatch && searchMatch;
  });

  const Content = (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Help center"
        title="Frequently asked questions"
        description="Find quick guidance about appointments, prescriptions, security, and account access."
      />

      <SectionCard className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <AppIcon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions and answers..."
              className={`${inputClassName} pl-11`}
            />
          </div>
          <Tabs items={categories.map((category) => ({ label: category, value: category }))} value={filter} onChange={setFilter} />
        </div>
      </SectionCard>

      {!filtered.length ? (
        <EmptyState icon="search" title="No matching questions" description="Try a different keyword or change the selected category." />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <SectionCard key={item.id} className="overflow-hidden p-0">
              <button
                type="button"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left hover:bg-slate-50"
              >
                <div>
                  <div className="mb-2 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                    {item.kategori}
                  </div>
                  <div className="text-base font-semibold text-slate-900">{item.soru}</div>
                </div>
                <AppIcon name="chevronDown" className={`mt-1 h-5 w-5 text-slate-400 transition ${openId === item.id ? 'rotate-180' : ''}`} />
              </button>
              {openId === item.id ? (
                <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-5 text-sm leading-7 text-slate-600">
                  {item.cevap}
                </div>
              ) : null}
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );

  if (!aktifKullanici) {
    return <div className="min-h-screen px-4 py-8 md:px-6">{Content}</div>;
  }

  return <Layout>{Content}</Layout>;
}
