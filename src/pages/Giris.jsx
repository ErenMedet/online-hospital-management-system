import { useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthShell from '../components/AuthShell';
import AppIcon from '../components/AppIcon';
import { AuthField } from '../components/AuthField';
import { inputClassName } from '../components/ui-helpers';
import { Button, InfoBanner, Stepper } from '../components/ui';

const roleRedirect = {
  hasta: '/hasta',
  doktor: '/doktor',
  hemsire: '/hemsire',
  onBuro: '/on-buro',
};

const roles = [
  { value: 'hasta', label: 'Patient', description: 'Appointments, results, prescriptions', icon: 'userCircle' },
  { value: 'doktor', label: 'Doctor', description: 'Schedule, records, prescriptions', icon: 'records' },
  { value: 'hemsire', label: 'Nurse', description: 'Department schedule and summaries', icon: 'calendar' },
  { value: 'onBuro', label: 'Front Desk', description: 'Operations, lookup, manual booking', icon: 'building' },
];

const demoAccounts = [
  { role: 'hasta', label: 'Patient', tc: '12345678901' },
  { role: 'doktor', label: 'Doctor', tc: '45678901234' },
  { role: 'hemsire', label: 'Nurse', tc: '89012345678' },
  { role: 'onBuro', label: 'Front Desk', tc: '01234567890' },
];

const steps = [
  { kicker: 'Step 1', title: 'Choose role' },
  { kicker: 'Step 2', title: 'Verify ID' },
  { kicker: 'Step 3', title: 'Enter code' },
  { kicker: 'Step 4', title: 'Open workspace' },
];

export default function Giris() {
  const { girisYap, personelListesi } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tc, setTc] = useState('');
  const [role, setRole] = useState('hasta');
  const [otp, setOtp] = useState('');
  const [mockOtp] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const tcId = useId();
  const roleId = useId();
  const otpId = useId();

  const applyDemoAccount = (demo) => {
    setRole(demo.role);
    setTc(demo.tc);
    setError('');
  };

  const handleTcSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (tc.length !== 11 || !/^\d+$/.test(tc)) {
      setError('National ID must be exactly 11 digits.');
      return;
    }

    const userExists = personelListesi.some((user) => user.tc === tc && user.rol === role);
    if (!userExists) {
      setError('No account was found for this National ID and selected role.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 700);
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (otp !== mockOtp) {
      setError('Incorrect verification code. Please try again.');
      return;
    }

    const result = girisYap(tc, role);
    if (!result.basarili) {
      setError(result.mesaj);
      setStep(1);
      return;
    }

    navigate(roleRedirect[role] || '/');
  };

  return (
    <AuthShell
      badge="Secure sign in"
      title="Access your hospital workspace"
      description="Role-aware sign in for patients and care teams with a cleaner, calmer layout optimized for desktop and mobile."
      contentWidth="max-w-5xl"
    >
      <div className="space-y-6">
        <Stepper steps={steps} currentStep={step === 1 ? 2 : 3} />

        {step === 1 ? (
          <form onSubmit={handleTcSubmit} className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-3 rounded-[30px] border border-slate-200 bg-white/88 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] md:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">Choose your workspace</div>
                    <div className="mt-1 text-xs text-slate-500">Pick the role that matches how you use the hospital system.</div>
                  </div>
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    4 role views
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {roles.map((item) => {
                    const active = role === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setRole(item.value)}
                        className={`rounded-[26px] border p-4 text-left transition ${
                          active
                            ? 'border-cyan-300 bg-cyan-50 shadow-[0_18px_40px_rgba(8,145,178,0.12)]'
                            : 'border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                          <AppIcon name={item.icon} className="h-5 w-5" />
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">{item.description}</div>
                      </button>
                    );
                  })}
                </div>
                <select id={roleId} value={role} onChange={(event) => setRole(event.target.value)} className="sr-only" aria-hidden="true" tabIndex={-1}>
                  {roles.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-slate-50/78 p-4 md:p-5">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-slate-700">Verify your identity</div>
                  <div className="mt-1 text-xs text-slate-500">Patients and staff can continue without scrolling through extra steps.</div>
                </div>
                <AuthField id={tcId} label="National ID Number" hint="Enter the 11-digit ID linked to your account.">
                  <input
                    id={tcId}
                    type="text"
                    value={tc}
                    onChange={(event) => setTc(event.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="12345678901"
                    maxLength={11}
                    inputMode="numeric"
                    className={`${inputClassName} font-mono tracking-[0.22em]`}
                  />
                </AuthField>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Selected role</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{roles.find((item) => item.value === role)?.label}</div>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Access method</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">SMS verification</div>
                  </div>
                </div>
                {error ? <div className="mt-4"><InfoBanner tone="danger" icon="warning">{error}</InfoBanner></div> : null}
                <div className="mt-4 flex flex-col gap-3">
                  <Button type="submit" className="w-full" iconRight="arrowRight" disabled={loading}>
                    {loading ? 'Verifying...' : 'Continue'}
                  </Button>
                  <Button as={Link} to="/kayit" variant="secondary" className="w-full">
                    Create Account
                  </Button>
                </div>
                <div className="mt-4 text-center">
                  <Link to="/hesap-kurtar" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-cyan-700">
                    <AppIcon name="shield" className="h-4 w-4" />
                    Recover account access
                  </Link>
                </div>
              </div>
            </div>

            <InfoBanner tone="info" icon="info">
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <strong>Demo accounts</strong>
                    <div className="mt-1 text-sm font-normal">
                      Use one of the test IDs below and continue with the verification code shown on the next step.
                    </div>
                  </div>
                  <div className="hidden justify-self-end rounded-2xl border border-cyan-100 bg-white/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700 sm:block">
                    Prototype mode
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {demoAccounts.map((demo) => (
                    <button
                      key={demo.tc}
                      type="button"
                      onClick={() => applyDemoAccount(demo)}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-cyan-100 bg-white/75 px-4 py-3 text-left text-sm transition hover:border-cyan-300 hover:bg-white hover:shadow-sm"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{demo.label}</div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-cyan-700">Click to autofill</div>
                      </div>
                      <span className="font-mono font-bold text-right text-slate-900">{demo.tc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </InfoBanner>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="overflow-hidden rounded-[30px] border border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.9)_0%,rgba(209,250,229,0.9)_100%)]">
              <div className="flex flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    <AppIcon name="shield" className="h-3.5 w-3.5" />
                    Verification required
                  </div>
                  <div className="mt-3 text-lg font-bold text-emerald-950">SMS verification</div>
                  <div className="mt-1 text-sm leading-6 text-emerald-900/80">Enter the 6-digit code sent to the registered mobile number for this account.</div>
                </div>
                <div className="rounded-[24px] border border-emerald-100 bg-white px-5 py-4 text-center shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600">Demo code</div>
                  <div className="mt-1 font-mono text-2xl font-black text-emerald-900">{mockOtp}</div>
                </div>
              </div>
            </div>

            <AuthField id={otpId} label="Verification Code" hint="The demo code is displayed above for this prototype flow.">
              <input
                id={otpId}
                type="text"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                inputMode="numeric"
                className={`${inputClassName} text-center font-mono text-2xl font-black tracking-[0.42em] md:text-3xl`}
              />
            </AuthField>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Role</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{roles.find((item) => item.value === role)?.label}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">ID status</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">Verified</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Delivery</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">SMS</div>
              </div>
            </div>

            {error ? <InfoBanner tone="danger" icon="warning">{error}</InfoBanner> : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setStep(1);
                  setError('');
                  setOtp('');
                }}
              >
                Go Back
              </Button>
            </div>
          </form>
        )}

        <div className="relative overflow-hidden rounded-[30px] border border-cyan-100 bg-[linear-gradient(135deg,rgba(8,47,73,0.98)_0%,rgba(14,116,144,0.96)_62%,rgba(15,118,110,0.94)_100%)] px-5 py-5 text-white shadow-[0_28px_80px_rgba(8,47,73,0.22)] md:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.05)_100%)]" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-50">
                <AppIcon name="shield" className="h-3.5 w-3.5" />
                Trusted access
              </div>
              <h3 className="text-2xl font-bold tracking-[-0.04em] text-white md:text-[30px]">
                Sign in to a calmer, more modern hospital workspace
              </h3>
              <p className="mt-2 text-sm leading-6 text-cyan-50/90">
                Secure role-based access with a cleaner clinical interface for patients, doctors, nurses, and front-desk teams.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:min-w-[260px]">
              {[
                ['2-step', 'Secure flow'],
                ['4 roles', 'One product'],
                ['Mobile', 'Ready'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/12 bg-white/10 px-3 py-3 text-center backdrop-blur-sm">
                  <div className="text-lg font-bold tracking-[-0.04em] text-white">{value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-cyan-100/80">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
