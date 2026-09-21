import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { tarihFormat } from '../../utils/helpers';
import { Button, EmptyState, Field, InfoBanner, PageHeader, SectionCard } from '../../components/ui';
import { inputClassName } from '../../components/ui-helpers';

export default function BakimVeren() {
  const { personelListesi, bakimOnayi, bakimVerenOnasiEkle } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ hastaTC: '', bakimVerenAd: '', bakimVerenTc: '', yakinlikTuru: '' });
  const [foundPatient, setFoundPatient] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchError, setSearchError] = useState('');
  const [notification, setNotification] = useState('');

  const searchPatient = () => {
    const patient = personelListesi.find((p) => p.tc === form.hastaTC && p.rol === 'hasta');
    if (!patient) {
      setSearchError('No patient found with this National ID.');
      setFoundPatient(null);
      return;
    }
    setSearchError('');
    setFoundPatient(patient);
  };

  const validate = () => {
    const e = {};
    if (!foundPatient) e.hastaTC = 'Patient not found.';
    if (!form.bakimVerenAd.trim()) e.bakimVerenAd = 'Caregiver name is required.';
    if (!form.bakimVerenTc || form.bakimVerenTc.length !== 11) e.bakimVerenTc = 'Enter a valid National ID.';
    if (!form.yakinlikTuru) e.yakinlikTuru = 'Relationship type is required.';
    return e;
  };

  const save = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    bakimVerenOnasiEkle({
      hastaId: foundPatient.id,
      bakimVerenAd: form.bakimVerenAd,
      bakimVerenTc: form.bakimVerenTc,
      yakinlikTuru: form.yakinlikTuru,
    });
    setFormOpen(false);
    setForm({ hastaTC: '', bakimVerenAd: '', bakimVerenTc: '', yakinlikTuru: '' });
    setFoundPatient(null);
    setSearchError('');
    setErrors({});
    setNotification('Caregiver approval saved successfully.');
    setTimeout(() => setNotification(''), 4000);
  };

  const activeApprovals = bakimOnayi.filter((b) => b.aktif);
  const relationships = ['Son', 'Daughter', 'Spouse', 'Mother', 'Father', 'Sibling', 'Guardian', 'Other'];

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          eyebrow="Caregiver access"
          title="Caregiver approvals"
          description="Register verified caregiver permissions after written consent has been physically submitted and reviewed."
          actions={<Button onClick={() => setFormOpen((open) => !open)} icon={formOpen ? 'close' : 'group'}>{formOpen ? 'Close Form' : 'New Approval'}</Button>}
        />

        {notification ? <InfoBanner tone="success" icon="check">{notification}</InfoBanner> : null}
        <InfoBanner tone="warning" icon="info">Caregiver access can only be recorded after the signed consent form has been physically received. This screen logs operational approval only.</InfoBanner>

        {formOpen ? (
          <SectionCard className="p-6">
            <div className="mb-5 text-lg font-bold text-slate-900">New caregiver approval</div>
            <form onSubmit={save} className="space-y-4">
              <Field id="caregiver-patient-id" label="Patient National ID" error={errors.hastaTC}>
                <div className="flex flex-col gap-3 md:flex-row">
                  <input id="caregiver-patient-id" value={form.hastaTC} onChange={(e) => setForm((p) => ({ ...p, hastaTC: e.target.value.replace(/\D/g, '').slice(0, 11) }))} maxLength={11} className={`${inputClassName} font-mono tracking-[0.18em]`} placeholder="11-digit National ID" />
                  <Button type="button" onClick={searchPatient}>Search</Button>
                </div>
              </Field>
              {searchError ? <div className="text-sm text-rose-700">{searchError}</div> : null}
              {foundPatient ? <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4 text-sm font-semibold text-cyan-900">{foundPatient.ad} {foundPatient.soyad}</div> : null}

              <Field id="caregiver-name" label="Caregiver Full Name" error={errors.bakimVerenAd}>
                <input id="caregiver-name" value={form.bakimVerenAd} onChange={(e) => setForm((p) => ({ ...p, bakimVerenAd: e.target.value }))} className={inputClassName} />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field id="caregiver-id" label="Caregiver National ID" error={errors.bakimVerenTc}>
                  <input id="caregiver-id" value={form.bakimVerenTc} onChange={(e) => setForm((p) => ({ ...p, bakimVerenTc: e.target.value.replace(/\D/g, '').slice(0, 11) }))} maxLength={11} className={`${inputClassName} font-mono tracking-[0.18em]`} />
                </Field>
                <Field id="caregiver-relationship" label="Relationship" error={errors.yakinlikTuru}>
                  <select id="caregiver-relationship" value={form.yakinlikTuru} onChange={(e) => setForm((p) => ({ ...p, yakinlikTuru: e.target.value }))} className={inputClassName}>
                    <option value="">Select</option>
                    {relationships.map((relationship) => <option key={relationship} value={relationship}>{relationship}</option>)}
                  </select>
                </Field>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" className="w-full">Save Approval</Button>
                <Button type="button" variant="secondary" className="w-full" onClick={() => setFormOpen(false)}>Cancel</Button>
              </div>
            </form>
          </SectionCard>
        ) : null}

        <SectionCard className="p-6">
          <div className="mb-4 text-lg font-bold text-slate-900">Registered approvals ({activeApprovals.length})</div>
          {!activeApprovals.length ? (
            <EmptyState icon="group" title="No registered approvals" description="Approved caregiver relationships will be listed here." className="min-h-44" />
          ) : (
            <div className="space-y-3">
              {activeApprovals.map((approval) => {
                const patient = personelListesi.find((p) => p.id === approval.hastaId);
                return (
                  <div key={approval.id} className="app-list-item flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{patient ? `${patient.ad} ${patient.soyad}` : approval.hastaId} → {approval.bakimVerenAd}</div>
                      <div className="text-sm text-slate-500">Relationship: {approval.yakinlikTuru}</div>
                      <div className="text-xs text-slate-400">Approval date: {tarihFormat(approval.onayTarihi)}</div>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Active</div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </Layout>
  );
}
