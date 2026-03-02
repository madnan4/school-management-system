import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export default function Subjects() {
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [name,     setName]     = useState('');
  const [editId,   setEditId]   = useState(null);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/subjects').then(r => setSubjects(r.data)).finally(() => setLoading(false));
  }, []);

  const fetchSubjects = () => api.get('/subjects').then(r => setSubjects(r.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.patch(`/subjects/${editId}`, { subject_name: name });
        toast('Subject updated successfully.');
      } else {
        await api.post('/subjects', { subject_name: name });
        toast('Subject added successfully.');
      }
      setName(''); setEditId(null); fetchSubjects();
    } catch (err) {
      toast(err.response?.data?.error || 'Something went wrong.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      toast('Subject deleted.');
      fetchSubjects();
    } catch (err) {
      toast(err.response?.data?.error || 'Something went wrong.', 'error');
    }
  };

  const filtered = subjects.filter(s => s.subject_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Subjects</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{editId ? 'Edit Subject' : 'Add Subject'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Subject Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Mathematics"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            {editId ? 'Update' : 'Add Subject'}
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subjects…"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72" />
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Subject Name</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.subject_name}</td>
                  <td className="px-4 py-3 flex gap-3 justify-end">
                    <button onClick={() => { setEditId(s.id); setName(s.subject_name); }}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDelete(s.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">{search ? 'No results match your search.' : 'No subjects found.'}</p>
        )}
      </div>
    </div>
  );
}
