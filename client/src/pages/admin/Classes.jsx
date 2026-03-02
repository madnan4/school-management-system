import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export default function Classes() {
  const toast = useToast();
  const [classes, setClasses] = useState([]);
  const [name,    setName]    = useState('');
  const [editId,  setEditId]  = useState(null);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/classes').then(r => setClasses(r.data)).finally(() => setLoading(false));
  }, []);

  const fetchClasses = () => api.get('/classes').then(r => setClasses(r.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.patch(`/classes/${editId}`, { class_name: name });
        toast('Class updated successfully.');
      } else {
        await api.post('/classes', { class_name: name });
        toast('Class added successfully.');
      }
      setName(''); setEditId(null); fetchClasses();
    } catch (err) {
      toast(err.response?.data?.error || 'Something went wrong.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this class? This will remove all related data.')) return;
    try {
      await api.delete(`/classes/${id}`);
      toast('Class deleted.');
      fetchClasses();
    } catch (err) {
      toast(err.response?.data?.error || 'Something went wrong.', 'error');
    }
  };

  const filtered = classes.filter(c => c.class_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Classes</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{editId ? 'Edit Class' : 'Add Class'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Class Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Grade 10A"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            {editId ? 'Update' : 'Add Class'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setName(''); }}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search classes…"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72" />
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Class Name</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.class_name}</td>
                  <td className="px-4 py-3 flex gap-3 justify-end">
                    <button onClick={() => { setEditId(c.id); setName(c.class_name); }}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDelete(c.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">{search ? 'No results match your search.' : 'No classes found.'}</p>
        )}
      </div>
    </div>
  );
}
