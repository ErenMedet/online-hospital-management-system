export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

export const inputClassName =
  'min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100';
