import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { Button, EmptyState, Field, InfoBanner, PageHeader, SectionCard } from '../../components/ui';
import { inputClassName } from '../../components/ui-helpers';
import { tarihFormat } from '../../utils/helpers';

export default function BagimliProfiller() {
  const { aktifKullanici, aktifProfil, setAktifProfil, bagimliProfiller, bagimliProfilEkle } = useApp();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ ad: '', soyad: '', dogumTarihi: '', yakinlikTuru: '', tc: '', telefon: '' });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const myDependents = bagimliProfiller.filter((p) => p.anaHastaId === aktifKullanici.id);

  const switchProfile = (profile) => {
    setAktifProfil(profile);
    navigate('/hasta');
  };

  const validate = () => {
    const e = {};
    if (!form.ad.trim()) e.ad = 'First name is required.';
    if (!form.soyad.trim()) e.soyad = 'Last name is required.';
    if (!form.dogumTarihi) e.dogumTarihi = 'Date of birth is required.';
    if (!form.yakinlikTuru) e.yakinlikTuru = 'Relationship type is required.';
    return e;
  };

  const addProfile = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    bagimliProfilEkle(form);
    setFormOpen(false);
    setForm({ ad: '', soyad: '', dogumTarihi: '', yakinlikTuru: '', tc: '', telefon: '' });
    setErrors({});
    setNotification('Dependent profile added successfully.');
    setTimeout(() => setNotification(null), 3000);
  };

  const relationships = ['Child', 'Mother', 'Father', 'Spouse', 'Sibling', 'Grandmother', 'Grandfather', 'Guardian', 'Other'];

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          eyebrow="Family profiles"
          title="Manage dependent profiles"
          description="Switch between family members without leaving your session and keep household care workflows organized."
          actions={
            <Button variant={formOpen ? 'secondary' : 'primary'} onClick={() => setFormOpen((open) => !open)} icon={formOpen ? 'close' : 'group'}>
              {formOpen ? 'Close form' : 'Add Family Member'}
            </Button>
          }
        />

        {notification ? <InfoBanner tone="success" icon="check">{notification}</InfoBanner> : null}
        {aktifProfil ? <InfoBanner tone="warning" icon="info">You are currently viewing <strong>{aktifProfil.ad} {aktifProfil.soyad}</strong>. Switching back to your own profile does not require a new sign-in.</InfoBanner> : null}

        <div className="grid gap-4">
          <SectionCard className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0f8fb0_100%)] text-sm font-bold text-white">
                  {aktifKullanici.ad[0]}{aktifKullanici.soyad[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{aktifKullanici.ad} {aktifKullanici.soyad}</div>
                  <div className="text-sm text-slate-500">My account</div>
                </div>
              </div>
              {aktifProfil ? <Button onClick={() => setAktifProfil(null)}>Switch Here</Button> : <div className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">Active</div>}
            </div>
          </SectionCard>

          {myDependents.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {myDependents.map((profile) => (
                <SectionCard key={profile.id} className={`p-5 ${aktifProfil?.id === profile.id ? 'border-amber-200' : ''}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-bold text-emerald-800">
                        {profile.ad[0]}{profile.soyad[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{profile.ad} {profile.soyad}</div>
                        <div className="text-sm text-slate-500">{profile.yakinlikTuru} · Born {tarihFormat(profile.dogumTarihi)}</div>
                        {profile.tc ? <div className="text-xs text-slate-400">ID: {profile.tc}</div> : null}
                      </div>
                    </div>
                    {aktifProfil?.id === profile.id ? (
                      <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Active</div>
                    ) : (
                      <Button variant="secondary" onClick={() => switchProfile(profile)}>Switch</Button>
                    )}
                  </div>
                </SectionCard>
              ))}
            </div>
          ) : !formOpen ? (
            <EmptyState icon="group" title="No dependent profiles yet" description="Add a family member to manage their appointments and records within your session." />
          ) : null}
        </div>

        {formOpen ? (
          <SectionCard className="p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-950">New dependent profile</h2>
              <p className="mt-1 text-sm text-slate-500">Create a profile for a child, parent, spouse, or another supported dependent.</p>
            </div>
            <form onSubmit={addProfile} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field id="dependent-first-name" label="First Name" error={errors.ad}>
                  <input id="dependent-first-name" value={form.ad} onChange={(e) => setForm((p) => ({ ...p, ad: e.target.value }))} className={inputClassName} />
                </Field>
                <Field id="dependent-last-name" label="Last Name" error={errors.soyad}>
                  <input id="dependent-last-name" value={form.soyad} onChange={(e) => setForm((p) => ({ ...p, soyad: e.target.value }))} className={inputClassName} />
                </Field>
                <Field id="dependent-dob" label="Date of Birth" error={errors.dogumTarihi}>
                  <input id="dependent-dob" type="date" value={form.dogumTarihi} onChange={(e) => setForm((p) => ({ ...p, dogumTarihi: e.target.value }))} className={inputClassName} />
                </Field>
                <Field id="dependent-relationship" label="Relationship" error={errors.yakinlikTuru}>
                  <select id="dependent-relationship" value={form.yakinlikTuru} onChange={(e) => setForm((p) => ({ ...p, yakinlikTuru: e.target.value }))} className={inputClassName}>
                    <option value="">Select</option>
                    {relationships.map((relationship) => <option key={relationship} value={relationship}>{relationship}</option>)}
                  </select>
                </Field>
                <Field id="dependent-tc" label="National ID">
                  <input id="dependent-tc" value={form.tc} onChange={(e) => setForm((p) => ({ ...p, tc: e.target.value.replace(/\D/g, '').slice(0, 11) }))} maxLength={11} className={`${inputClassName} font-mono tracking-[0.18em]`} />
                </Field>
                <Field id="dependent-phone" label="Phone">
                  <input id="dependent-phone" value={form.telefon} onChange={(e) => setForm((p) => ({ ...p, telefon: e.target.value }))} placeholder="05XXXXXXXXX" className={inputClassName} />
                </Field>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" className="w-full">Add Profile</Button>
                <Button type="button" variant="secondary" className="w-full" onClick={() => { setFormOpen(false); setErrors({}); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </SectionCard>
        ) : null}
      </div>
    </Layout>
  );
}
