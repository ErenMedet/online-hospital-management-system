import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthShell from '../components/AuthShell';
import AppIcon from '../components/AppIcon';
import { AuthField } from '../components/AuthField';
import { inputClassName } from '../components/ui-helpers';
import { Button, InfoBanner } from '../components/ui';

export default function Kayit() {
  const { kayitOl } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tc: '',
    ad: '',
    soyad: '',
    dogumTarihi: '',
    telefon: '',
    email: '',
    cinsiyet: '',
    kan: '',
    kvkkOnay: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.tc || form.tc.length !== 11 || !/^\d+$/.test(form.tc)) nextErrors.tc = 'Enter a valid 11-digit National ID.';
    if (!form.ad.trim()) nextErrors.ad = 'First name is required.';
    if (!form.soyad.trim()) nextErrors.soyad = 'Last name is required.';
    if (!form.dogumTarihi) nextErrors.dogumTarihi = 'Date of birth is required.';
    if (!form.telefon || !/^05\d{9}$/.test(form.telefon)) nextErrors.telefon = 'Enter a valid phone number (05XXXXXXXXX).';
    if (!form.cinsiyet) nextErrors.cinsiyet = 'Please select a gender.';
    if (!form.kvkkOnay) nextErrors.kvkkOnay = 'You must accept the Privacy Notice.';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const result = kayitOl({
      tc: form.tc,
      ad: form.ad,
      soyad: form.soyad,
      dogumTarihi: form.dogumTarihi,
      telefon: form.telefon,
      email: form.email,
      cinsiyet: form.cinsiyet,
      kan: form.kan,
    });

    if (!result.basarili) {
      setGeneralError(result.mesaj);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <AuthShell
        badge="Patient account ready"
        title="Your account has been created"
        description="Your patient profile is active and ready to use."
        asideTitle="A registration flow designed to feel trustworthy from the first interaction."
        asideDescription="Structured form groups, gentle surfaces, and accessible controls make onboarding feel more like a real healthcare platform than a student project."
      >
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <AppIcon name="checkBadge" className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950">Account Created</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Continue to sign in with your National ID and verification code.</p>
          </div>
          <Button onClick={() => navigate('/giris')} className="w-full">
            Go to Sign In
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge="Patient registration"
      title="Create your patient account"
      description="Enter your identity and contact details once to activate your patient workspace."
      asideTitle="A registration experience that feels structured, clinical, and easy to trust."
      asideDescription="The new layout groups related fields, protects scanability, and stays readable across desktop and mobile without visual clutter."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {generalError ? <InfoBanner tone="danger" icon="warning">{generalError}</InfoBanner> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <AuthField id="register-first-name" label="First Name" error={errors.ad}>
            <input id="register-first-name" value={form.ad} onChange={(event) => update('ad', event.target.value)} className={inputClassName} />
          </AuthField>
          <AuthField id="register-last-name" label="Last Name" error={errors.soyad}>
            <input id="register-last-name" value={form.soyad} onChange={(event) => update('soyad', event.target.value)} className={inputClassName} />
          </AuthField>
          <AuthField id="register-tc" label="National ID Number" error={errors.tc}>
            <input
              id="register-tc"
              value={form.tc}
              onChange={(event) => update('tc', event.target.value.replace(/\D/g, '').slice(0, 11))}
              maxLength={11}
              inputMode="numeric"
              placeholder="12345678901"
              className={`${inputClassName} font-mono tracking-[0.22em]`}
            />
          </AuthField>
          <AuthField id="register-phone" label="Phone Number" error={errors.telefon}>
            <input
              id="register-phone"
              value={form.telefon}
              onChange={(event) => update('telefon', event.target.value.replace(/[^\d]/g, '').slice(0, 11))}
              inputMode="tel"
              placeholder="05XXXXXXXXX"
              className={inputClassName}
            />
          </AuthField>
          <AuthField id="register-birth-date" label="Date of Birth" error={errors.dogumTarihi}>
            <input id="register-birth-date" type="date" value={form.dogumTarihi} onChange={(event) => update('dogumTarihi', event.target.value)} className={inputClassName} />
          </AuthField>
          <AuthField id="register-gender" label="Gender" error={errors.cinsiyet}>
            <select id="register-gender" value={form.cinsiyet} onChange={(event) => update('cinsiyet', event.target.value)} className={inputClassName}>
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </AuthField>
          <AuthField id="register-email" label="Email">
            <input id="register-email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className={inputClassName} />
          </AuthField>
          <AuthField id="register-blood-type" label="Blood Type">
            <select id="register-blood-type" value={form.kan} onChange={(event) => update('kan', event.target.value)} className={inputClassName}>
              <option value="">Select</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </AuthField>
        </div>

        <div className={`rounded-[28px] border p-4 ${errors.kvkkOnay ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-slate-50/80'}`}>
          <label htmlFor="register-kvkk" className="flex cursor-pointer items-start gap-3">
            <input
              id="register-kvkk"
              type="checkbox"
              checked={form.kvkkOnay}
              onChange={(event) => update('kvkkOnay', event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-cyan-600"
            />
            <span className="text-sm leading-6 text-slate-600">
              <strong className="text-slate-900">Privacy Notice:</strong> I consent to the processing of my personal data for healthcare services and related operational communication in accordance with applicable privacy law.
            </span>
          </label>
          {errors.kvkkOnay ? <p className="mt-2 text-xs text-rose-600">{errors.kvkkOnay}</p> : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="w-full">
            Create Account
          </Button>
          <Button as={Link} to="/giris" variant="secondary" className="w-full">
            Back to Sign In
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
