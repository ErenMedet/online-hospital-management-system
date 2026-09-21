import AppIcon from './AppIcon';
import { cn } from './ui-helpers';

const buttonStyles = {
  primary: 'bg-slate-950 text-white hover:bg-slate-800 shadow-[0_18px_34px_rgba(15,23,42,0.16)]',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_18px_34px_rgba(5,150,105,0.18)]',
  warning: 'bg-amber-500 text-white hover:bg-amber-600 shadow-[0_18px_34px_rgba(245,158,11,0.18)]',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-[0_18px_34px_rgba(225,29,72,0.18)]',
};

export function Button({
  as: Component = 'button',
  variant = 'primary',
  className,
  icon,
  iconRight,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        buttonStyles[variant],
        className,
      )}
      {...props}
    >
      {icon ? <AppIcon name={icon} className="h-4 w-4" /> : null}
      {children}
      {iconRight ? <AppIcon name={iconRight} className="h-4 w-4" /> : null}
    </Component>
  );
}

export function Surface({ className, children }) {
  return <div className={cn('app-panel', className)}>{children}</div>;
}

export function SectionCard({ className, children }) {
  return <section className={cn('app-card-panel', className)}>{children}</section>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}) {
  return (
    <SectionCard className={cn('overflow-hidden', className)}>
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_55%),radial-gradient(circle_at_top_right,rgba(14,116,144,0.12),transparent_50%)]" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <div className="app-eyebrow mb-4">
              <AppIcon name="spark" className="h-4 w-4" />
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-3xl font-bold tracking-[-0.045em] text-slate-950 md:text-4xl">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
      </div>
    </SectionCard>
  );
}

const badgeStyles = {
  neutral: 'bg-slate-100 text-slate-700',
  info: 'bg-cyan-100 text-cyan-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-rose-100 text-rose-800',
  violet: 'bg-violet-100 text-violet-800',
};

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', badgeStyles[tone], className)}>
      {children}
    </span>
  );
}

export function StatCard({ icon, value, label, detail, tone = 'cyan', className }) {
  const toneStyles = {
    cyan: 'from-cyan-500/12 to-sky-500/12 border-cyan-100 text-cyan-900',
    emerald: 'from-emerald-500/12 to-teal-500/12 border-emerald-100 text-emerald-900',
    violet: 'from-violet-500/12 to-fuchsia-500/12 border-violet-100 text-violet-900',
    amber: 'from-amber-500/12 to-orange-500/12 border-amber-100 text-amber-900',
    slate: 'from-slate-500/10 to-slate-300/10 border-slate-200 text-slate-900',
  };

  return (
    <SectionCard className={cn('bg-gradient-to-br p-5', toneStyles[tone], className)}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-slate-700 shadow-sm">
        <AppIcon name={icon} className="h-5 w-5" />
      </div>
      <div className="text-3xl font-black tracking-[-0.04em]">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">{label}</div>
      {detail ? <div className="mt-3 text-sm text-slate-500">{detail}</div> : null}
    </SectionCard>
  );
}

export function EmptyState({ icon = 'spark', title, description, action, className }) {
  return (
    <SectionCard className={cn('flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
        <AppIcon name={icon} className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </SectionCard>
  );
}

export function InfoBanner({ tone = 'info', icon = 'info', children, className }) {
  const toneStyles = {
    info: 'border-cyan-200 bg-cyan-50 text-cyan-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    danger: 'border-rose-200 bg-rose-50 text-rose-900',
  };

  return (
    <div className={cn('flex items-start gap-3 rounded-3xl border px-4 py-4 text-sm leading-6', toneStyles[tone], className)}>
      <AppIcon name={icon} className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function Field({ id, label, hint, error, children, className }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
      {!error && hint ? <p className="mt-2 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function Tabs({ items, value, onChange, className }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer',
            value === item.value
              ? 'bg-slate-950 text-white shadow-[0_16px_28px_rgba(15,23,42,0.16)]'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-700',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function Modal({ title, description, children, onClose, width = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
      <div className={cn('app-card-panel w-full p-6 md:p-7', width)}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-[-0.03em] text-slate-950">{title}</h3>
            {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <AppIcon name="close" className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function DataTable({ columns, rows, emptyTitle, emptyDescription }) {
  if (!rows.length) {
    return <EmptyState icon="search" title={emptyTitle} description={emptyDescription} className="min-h-44" />;
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.key || index} className="border-t border-slate-100 hover:bg-slate-50/80">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 align-top text-slate-700">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Stepper({ steps, currentStep }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => {
        const state = currentStep === index + 1 ? 'current' : currentStep > index + 1 ? 'complete' : 'upcoming';
        return (
          <div
            key={step.title}
            className={cn(
              'rounded-3xl border px-4 py-4 transition',
              state === 'current' && 'border-cyan-200 bg-white shadow-sm',
              state === 'complete' && 'border-emerald-200 bg-emerald-50',
              state === 'upcoming' && 'border-slate-200 bg-slate-50/80',
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                  state === 'current' && 'bg-cyan-600 text-white',
                  state === 'complete' && 'bg-emerald-600 text-white',
                  state === 'upcoming' && 'bg-slate-200 text-slate-500',
                )}
              >
                {state === 'complete' ? <AppIcon name="check" className="h-4 w-4" /> : index + 1}
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{step.kicker}</div>
            </div>
            <div className="text-sm font-semibold text-slate-900">{step.title}</div>
          </div>
        );
      })}
    </div>
  );
}
