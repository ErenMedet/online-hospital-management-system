import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AppIcon from './AppIcon';
import { Button, Badge } from './ui';
import { roleMenus, roleMeta } from './navigation';
import { cn } from './ui-helpers';

export default function Navbar() {
  const { aktifKullanici, aktifProfil, setAktifProfil, oturumuKapat } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!aktifKullanici) return null;

  const menuItems = roleMenus[aktifKullanici.rol] || [];
  const meta = roleMeta[aktifKullanici.rol] || roleMeta.hasta;
  const initials = `${aktifKullanici.ad[0]}${aktifKullanici.soyad[0]}`;
  const profileName = aktifProfil
    ? `${aktifProfil.ad} ${aktifProfil.soyad}`
    : `${aktifKullanici.ad} ${aktifKullanici.soyad}`;

  const isDashboard = [meta.home, '/profil'].includes(location.pathname);

  const handleLogout = () => {
    oturumuKapat();
    navigate('/giris');
  };

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 md:px-6 xl:px-8">
      <div className="app-panel mx-auto max-w-[1500px] rounded-[30px] px-4 py-3 md:px-5">
        <div className="flex items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <NavLink to={meta.home} className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#0f172a_0%,#0f8fb0_100%)] text-white shadow-[0_18px_34px_rgba(14,116,144,0.24)]">
                <AppIcon name="heartPulse" className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">MediCare HMS</div>
                <div className="truncate text-xs text-slate-500">{meta.label} workspace</div>
              </div>
            </NavLink>

            <nav className="hidden min-w-0 flex-1 items-center gap-2 xl:flex">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition',
                      isActive || (item.path === meta.home && isDashboard)
                        ? 'bg-slate-950 text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)]'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900',
                    )
                  }
                >
                  <AppIcon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {aktifProfil ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-right">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">Viewing dependent</div>
                <div className="text-sm font-semibold text-amber-900">{profileName}</div>
              </div>
            ) : null}

            {aktifProfil ? (
              <Button variant="secondary" onClick={() => { setAktifProfil(null); navigate('/hasta'); }} icon="arrowLeft">
                My profile
              </Button>
            ) : null}

            <NavLink to="/profil" className="flex items-center gap-3 rounded-2xl px-2 py-1.5 hover:bg-slate-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#06b6d4_0%,#0f766e_100%)] text-sm font-bold text-white ring-4 ring-cyan-100">
                {initials}
              </div>
              <div className="hidden text-right md:block">
                <div className="text-sm font-semibold text-slate-900">{aktifKullanici.ad} {aktifKullanici.soyad}</div>
                <Badge tone="info">{meta.shortLabel}</Badge>
              </div>
            </NavLink>

            <Button variant="secondary" onClick={handleLogout} icon="logout">
              Sign out
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-2xl border border-slate-200 p-2 text-slate-700 transition hover:bg-white xl:hidden"
            aria-label="Toggle navigation"
          >
            <AppIcon name={menuOpen ? 'close' : 'menu'} className="h-5 w-5" />
          </button>
        </div>

        {menuOpen ? (
          <div className="mt-4 border-t border-slate-200 pt-4 xl:hidden">
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#06b6d4_0%,#0f766e_100%)] text-sm font-bold text-white">
                {initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">{aktifKullanici.ad} {aktifKullanici.soyad}</div>
                <div className="text-xs text-slate-500">{meta.label}</div>
              </div>
            </div>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition',
                      isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-50',
                    )
                  }
                >
                  <AppIcon name={item.icon} className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/profil"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <AppIcon name="profile" className="h-5 w-5" />
                Profile
              </NavLink>
              {aktifProfil ? (
                <button
                  type="button"
                  onClick={() => {
                    setAktifProfil(null);
                    setMenuOpen(false);
                    navigate('/hasta');
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
                >
                  <AppIcon name="arrowLeft" className="h-5 w-5" />
                  Return to my profile
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                <AppIcon name="logout" className="h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
