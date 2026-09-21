import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthShell from '../components/AuthShell';
import AppIcon from '../components/AppIcon';
import { AuthField } from '../components/AuthField';
import { inputClassName } from '../components/ui-helpers';
import { Button, InfoBanner } from '../components/ui';

export default function HesapKurtar() {
  const { personelListesi } = useApp();
  const [tc, setTc] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [otp] = useState('654321');
  const [entered, setEntered] = useState('');
  const [success, setSuccess] = useState(false);

  const verify = (event) => {
    event.preventDefault();
    const user = personelListesi.find((item) => item.tc === tc && item.telefon === phone);
    if (!user) {
      setError('National ID and phone number do not match our records.');
      return;
    }
    setError('');
    setStep(2);
  };

  const verifySms = (event) => {
    event.preventDefault();
    if (entered !== otp) {
      setError('Incorrect code. Please try again.');
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <AuthShell
        badge="Recovery complete"
        title="Identity verified"
        description="Your account access has been restored."
        asideTitle="Account recovery designed to stay calm under pressure."
        asideDescription="The flow mirrors the rest of the product with stronger hierarchy and fewer points of friction when users need urgent access."
      >
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <AppIcon name="checkBadge" className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950">Access Restored</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Sign in again to continue to the appropriate hospital workspace.</p>
          </div>
          <Button as={Link} to="/giris" className="w-full">
            Go to Sign In
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge="Account recovery"
      title="Restore account access"
      description="Verify your identity with your National ID and registered phone number, then confirm the SMS code."
      asideTitle="A recovery flow that stays readable on every screen."
      asideDescription="Stronger alignment, clearer panel hierarchy, and simplified steps reduce stress when users need help regaining access."
    >
      {step === 1 ? (
        <form onSubmit={verify} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AuthField id="recovery-tc" label="National ID Number">
              <input
                id="recovery-tc"
                value={tc}
                onChange={(event) => setTc(event.target.value.replace(/\D/g, '').slice(0, 11))}
                maxLength={11}
                inputMode="numeric"
                placeholder="12345678901"
                className={`${inputClassName} font-mono tracking-[0.22em]`}
              />
            </AuthField>

            <AuthField id="recovery-phone" label="Registered Phone Number">
              <input
                id="recovery-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/[^\d]/g, '').slice(0, 11))}
                inputMode="tel"
                placeholder="05XXXXXXXXX"
                className={inputClassName}
              />
            </AuthField>
          </div>

          {error ? <InfoBanner tone="danger" icon="warning">{error}</InfoBanner> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="w-full">
              Continue
            </Button>
            <Button as={Link} to="/giris" variant="secondary" className="w-full">
              Back to Sign In
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={verifySms} className="space-y-5">
          <InfoBanner tone="success" icon="shield">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <strong>SMS verification</strong>
                <div>Enter the 6-digit verification code sent to the registered mobile number.</div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 font-mono text-2xl font-black text-emerald-900 shadow-sm">
                {otp}
              </div>
            </div>
          </InfoBanner>

          <AuthField id="recovery-otp" label="Verification Code">
            <input
              id="recovery-otp"
              value={entered}
              onChange={(event) => setEntered(event.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              inputMode="numeric"
              className={`${inputClassName} text-center font-mono text-2xl font-black tracking-[0.42em] md:text-3xl`}
            />
          </AuthField>

          {error ? <InfoBanner tone="danger" icon="warning">{error}</InfoBanner> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="w-full">
              Verify and Restore Access
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                setStep(1);
                setError('');
                setEntered('');
              }}
            >
              Go Back
            </Button>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
