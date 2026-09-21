import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { Badge, Button, Field, InfoBanner, PageHeader, SectionCard } from '../components/ui';
import { inputClassName } from '../components/ui-helpers';
import { tarihFormat, rolTurkce } from '../utils/helpers';

export default function Profil() {
  const { aktifKullanici, profilGuncelle } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...aktifKullanici });
  const [saved, setSaved] = useState(false);

  const save = (e) => {
    e.preventDefault();
    profilGuncelle({ ad: form.ad, soyad: form.soyad, email: form.email, telefon: form.telefon });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    { label: 'National ID', value: aktifKullanici.tc },
    { label: 'First Name', value: aktifKullanici.ad },
    { label: 'Last Name', value: aktifKullanici.soyad },
    { label: 'Date of Birth', value: tarihFormat(aktifKullanici.dogumTarihi) },
    { label: 'Phone', value: aktifKullanici.telefon || '—' },
    { label: 'Email', value: aktifKullanici.email || '—' },
    aktifKullanici.cinsiyet && { label: 'Gender', value: aktifKullanici.cinsiyet },
    aktifKullanici.kan && { label: 'Blood Type', value: aktifKullanici.kan },
    aktifKullanici.uzmanlik && { label: 'Specialization', value: aktifKullanici.uzmanlik },
  ].filter(Boolean);

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          eyebrow="Profile settings"
          title="Your profile"
          description="Review your identity details and keep your contact information up to date."
          actions={
            editing ? (
              <>
                <Button variant="secondary" onClick={() => { setEditing(false); setForm({ ...aktifKullanici }); }}>
                  Cancel
                </Button>
                <Button form="profile-form" type="submit">
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => { setEditing(true); setForm({ ...aktifKullanici }); }} icon="edit">
                Edit Profile
              </Button>
            )
          }
        />

        {saved ? <InfoBanner tone="success" icon="check">Profile updated successfully.</InfoBanner> : null}

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <SectionCard className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#0f8fb0_100%)] text-3xl font-bold text-white shadow-[0_24px_50px_rgba(15,23,42,0.16)]">
                {aktifKullanici.ad[0]}{aktifKullanici.soyad[0]}
              </div>
              <h2 className="text-xl font-bold text-slate-950">{aktifKullanici.ad} {aktifKullanici.soyad}</h2>
              <div className="mt-2">
                <Badge tone="info">{rolTurkce(aktifKullanici.rol)}</Badge>
              </div>
              <div className="mt-6 grid w-full gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-left">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Primary contact</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{aktifKullanici.telefon || 'Not provided'}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-left">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Email</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{aktifKullanici.email || 'Not provided'}</div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-6">
            {!editing ? (
              <div className="grid gap-3 md:grid-cols-2">
                {fields.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50/80 px-5 py-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">{item.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <form id="profile-form" onSubmit={save} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field id="profile-first-name" label="First Name">
                    <input id="profile-first-name" value={form.ad} onChange={(e) => setForm((p) => ({ ...p, ad: e.target.value }))} className={inputClassName} />
                  </Field>
                  <Field id="profile-last-name" label="Last Name">
                    <input id="profile-last-name" value={form.soyad} onChange={(e) => setForm((p) => ({ ...p, soyad: e.target.value }))} className={inputClassName} />
                  </Field>
                </div>
                <Field id="profile-phone" label="Phone">
                  <input id="profile-phone" value={form.telefon || ''} onChange={(e) => setForm((p) => ({ ...p, telefon: e.target.value }))} className={inputClassName} />
                </Field>
                <Field id="profile-email" label="Email">
                  <input id="profile-email" type="email" value={form.email || ''} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className={inputClassName} />
                </Field>
              </form>
            )}
          </SectionCard>
        </div>
      </div>
    </Layout>
  );
}
