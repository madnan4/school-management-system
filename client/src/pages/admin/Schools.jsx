import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const empty = { school_name: '', director_name: '', email: '', contact_number: '', address: '' };

export default function Schools() {
  const toast = useToast();
  const [schools, setSchools] = useState([]);
  const [form,    setForm]    = useState(empty);
  const [editId,  setEditId]  = useState(null);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/schools').then(r => setSchools(r.data)).finally(() => setLoading(false));
  }, []);

  const fetchSchools = () => api.get('/schools').then(r => setSchools(r.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.patch(`/schools/${editId}`, form);
        toast('School updated successfully.');
      } else {
        await api.post('/schools', form);
        toast('School added successfully.');
      }
      setForm(empty); setEditId(null); fetchSchools();
    } catch (err) {
      toast(err.response?.data?.error || 'Something went wrong.', 'error');
    }
  };

  const handleEdit = (s) => {
    setForm({ school_name: s.school_name, director_name: s.director_name, email: s.email, contact_number: s.contact_number || '', address: s.address || '' });
    setEditId(s.id);
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const filtered = schools.filter(s =>
    `${s.school_name} ${s.director_name} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Schools</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{editId ? 'Edit School' : 'Add School'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          {[
            { field: 'school_name', label: 'School Name', required: true },
            { field: 'director_name', label: 'Director Name', required: true },
            { field: 'email', label: 'Email', required: true, type: 'email' },
            { field: 'contact_number', label: 'Contact Number' },
          ].map(({ field, label, required, type }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type={type || 'text'} value={form[field]} onChange={set(field)} required={required}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
            <input value={form.address} onChange={set('address')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="col-span-2 flex gap-2">
            <button type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              {editId ? 'Update School' : 'Add School'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm(empty); }}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, director or email…"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72" />
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['School Name', 'Director', 'Email', 'Contact', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.school_name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.director_name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600">{s.contact_number || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleEdit(s)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">{search ? 'No results match your search.' : 'No schools found.'}</p>
        )}
      </div>
    </div>
  );
}
