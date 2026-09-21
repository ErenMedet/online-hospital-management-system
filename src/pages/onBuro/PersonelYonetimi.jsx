import { useDeferredValue, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { rolTurkce } from '../../utils/helpers';
import { Button, EmptyState, InfoBanner, PageHeader, SectionCard, Tabs } from '../../components/ui';
import { inputClassName } from '../../components/ui-helpers';

export default function PersonelYonetimi() {
  const { personelListesi, personelRoluGuncelle } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editId, setEditId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [notification, setNotification] = useState('');
  const deferredSearch = useDeferredValue(search);

  const filtered = personelListesi.filter((p) => {
    const nameMatch = `${p.ad} ${p.soyad}`.toLowerCase().includes(deferredSearch.toLowerCase()) || p.tc.includes(deferredSearch);
    const roleMatch = filter === 'all' || p.rol === filter;
    return nameMatch && roleMatch;
  });

  const updateRole = (id) => {
    personelRoluGuncelle(id, newRole);
    setEditId(null);
    setNotification('Role updated successfully.');
    setTimeout(() => setNotification(''), 3000);
  };

  const roleBadge = {
    hasta: 'bg-cyan-100 text-cyan-700',
    doktor: 'bg-emerald-100 text-emerald-700',
    hemsire: 'bg-violet-100 text-violet-700',
    onBuro: 'bg-amber-100 text-amber-700',
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader eyebrow="Administration" title="Staff and role management" description="Search users, review role assignments, and update access responsibilities while preserving audit-trail behavior." />
        {notification ? <InfoBanner tone="success" icon="check">{notification}</InfoBanner> : null}

        <SectionCard className="p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or National ID..." className={inputClassName} />
            <Tabs
              items={[
                { value: 'all', label: 'All' },
                { value: 'hasta', label: 'Patients' },
                { value: 'doktor', label: 'Doctors' },
                { value: 'hemsire', label: 'Nurses' },
                { value: 'onBuro', label: 'Front Desk' },
              ]}
              value={filter}
              onChange={setFilter}
            />
          </div>
        </SectionCard>

        {!filtered.length ? (
          <EmptyState icon="users" title="No matching records" description="Try a different search query or filter selection." />
        ) : (
          <SectionCard className="p-0">
            <div className="border-b border-slate-100 px-5 py-4 text-sm text-slate-500">{filtered.length} records found</div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Name</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">National ID</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Role</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Contact</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((person) => (
                    <tr key={person.id} className="border-t border-slate-100">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">{person.ad} {person.soyad}</div>
                        {person.uzmanlik ? <div className="text-sm text-slate-500">{person.uzmanlik}</div> : null}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">{person.tc}</td>
                      <td className="px-5 py-4">
                        {editId === person.id ? (
                          <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900">
                            <option value="hasta">Patient</option>
                            <option value="doktor">Doctor</option>
                            <option value="hemsire">Nurse</option>
                            <option value="onBuro">Front Desk</option>
                          </select>
                        ) : (
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleBadge[person.rol] || 'bg-slate-100 text-slate-600'}`}>
                            {rolTurkce(person.rol)}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{person.telefon || person.email || '—'}</td>
                      <td className="px-5 py-4">
                        {editId === person.id ? (
                          <div className="flex gap-2">
                            <Button variant="success" onClick={() => updateRole(person.id)}>Save</Button>
                            <Button variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <Button variant="secondary" onClick={() => { setEditId(person.id); setNewRole(person.rol); }}>
                            Edit Role
                          </Button>
                        )}
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
