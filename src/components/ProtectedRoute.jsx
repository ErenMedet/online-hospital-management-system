import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children, roller }) {
  const { aktifKullanici } = useApp();

  if (!aktifKullanici) return <Navigate to="/giris" replace />;

  if (roller && !roller.includes(aktifKullanici.rol)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm mx-4 border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-1">You don't have permission to view this page.</p>
          <p className="text-xs text-gray-400 bg-gray-50 rounded px-2 py-1 inline-block mt-1">
            Role: {aktifKullanici.rol}
          </p>
        </div>
      </div>
    );
  }

  return children;
}
