import { Link } from 'react-router-dom';
import AppIcon from './AppIcon';

export default function AuthShell({
  badge = 'Secure healthcare access',
  title,
  description,
  children,
  contentWidth = 'max-w-xl',
}) {
  const backgroundEmojis = [
    { emoji: '🩺', className: 'left-[6%] top-[10%] text-[44px] rotate-[-12deg]' },
    { emoji: '💊', className: 'left-[16%] top-[78%] text-[38px] rotate-[10deg]' },
    { emoji: '🫀', className: 'left-[82%] top-[12%] text-[46px] rotate-[8deg]' },
    { emoji: '🧬', className: 'left-[88%] top-[56%] text-[42px] rotate-[-8deg]' },
    { emoji: '🩹', className: 'left-[74%] top-[82%] text-[36px] rotate-[14deg]' },
    { emoji: '🧪', className: 'left-[10%] top-[48%] text-[38px] rotate-[-6deg]' },
    { emoji: '🏥', className: 'left-[48%] top-[8%] text-[40px] rotate-[4deg]' },
    { emoji: '🩻', className: 'left-[52%] top-[86%] text-[40px] rotate-[-10deg]' },
    { emoji: '🧑‍⚕️', className: 'left-[24%] top-[18%] text-[42px] rotate-[7deg]' },
    { emoji: '👩‍⚕️', className: 'left-[92%] top-[28%] text-[40px] rotate-[-7deg]' },
    { emoji: '🧠', className: 'left-[28%] top-[90%] text-[34px] rotate-[9deg]' },
    { emoji: '❤️', className: 'left-[66%] top-[20%] text-[34px] rotate-[-12deg]' },
    { emoji: '🦴', className: 'left-[4%] top-[30%] text-[34px] rotate-[10deg]' },
    { emoji: '👁️', className: 'left-[86%] top-[74%] text-[34px] rotate-[-3deg]' },
    { emoji: '🧑‍🔬', className: 'left-[38%] top-[72%] text-[38px] rotate-[6deg]' },
    { emoji: '💉', className: 'left-[58%] top-[34%] text-[34px] rotate-[-14deg]' },
    { emoji: '🫁', className: 'left-[18%] top-[60%] text-[36px] rotate-[8deg]' },
    { emoji: '🩼', className: 'left-[72%] top-[62%] text-[34px] rotate-[-8deg]' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fcff_0%,#eef6fb_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,118,110,0.12),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {backgroundEmojis.map((item) => (
          <span
            key={`${item.emoji}-${item.className}`}
            aria-hidden="true"
            className={`absolute select-none opacity-[0.16] blur-[0.2px] saturate-75 hidden md:block ${item.className}`}
          >
            {item.emoji}
          </span>
        ))}
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] items-center justify-center px-4 py-6 md:px-6 md:py-8 xl:px-8">
        <section className="flex items-center justify-center xl:py-6">
          <div className={`w-full ${contentWidth}`}>
            <div className="mb-5 flex items-center justify-between gap-3 rounded-[30px] border border-white/80 bg-white/80 px-5 py-4 shadow-[0_22px_55px_rgba(15,23,42,0.08)] backdrop-blur-sm md:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0f8fb0_100%)] text-white shadow-[0_18px_34px_rgba(14,116,144,0.24)]">
                  <AppIcon name="heartPulse" className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">MediCare HMS</div>
                  <div className="truncate text-xs text-slate-500">Premium hospital workspace</div>
                </div>
              </div>
              <Link
                to="/giris"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
              >
                <AppIcon name="arrowLeft" className="h-4 w-4" />
                Sign In
              </Link>
            </div>

            <div className="overflow-hidden rounded-[34px] border border-white/70 bg-white/92 shadow-[0_34px_100px_rgba(15,23,42,0.14)] backdrop-blur-md">
              <div className="border-b border-slate-100 px-6 py-6 md:px-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold text-cyan-700">
                  <AppIcon name="shield" className="h-4 w-4" />
                  {badge}
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-950 md:text-4xl">{title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">{description}</p>
              </div>
              <div className="px-6 py-6 md:px-8 md:py-7">{children}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
