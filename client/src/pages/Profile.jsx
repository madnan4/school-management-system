import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

const empty = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function Profile() {
  const { user } = useAuth();
  const toast    = useToast();
  const [form,    setForm]    = useState(empty);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast('New passwords do not match.', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      });
      toast('Password changed successfully.');
      setForm(empty);
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to change password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Profile</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 max-w-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Info</h3>
        <dl className="space-y-2 text-sm">
          {[['Name', user?.name], ['Email', user?.email], ['Role', user?.role]].map(([label, val]) => (
            <div key={label} className="flex gap-3">
              <dt className="w-14 text-gray-500 shrink-0">{label}</dt>
              <dd className="text-gray-900 font-medium capitalize">{val}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 max-w-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
            <input type="password" value={form.currentPassword} onChange={set('currentPassword')} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
            <input type="password" value={form.newPassword} onChange={set('newPassword')} required minLength={6} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
            <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required className={inputClass} />
          </div>
          <button type="submit" disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {loading ? 'Saving…' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
