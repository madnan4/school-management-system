import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const empty = { class_id: '', subject_id: '', teacher_id: '' };

export default function Assignments() {
  const toast = useToast();
  const [assignments, setAssignments] = useState([]);
  const [classes,     setClasses]     = useState([]);
  const [subjects,    setSubjects]    = useState([]);
  const [teachers,    setTeachers]    = useState([]);
  const [form,        setForm]        = useState(empty);
  const [editId,      setEditId]      = useState(null);
  const [search,      setSearch]      = useState('');
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/class-subjects'),
      api.get('/classes'),
      api.get('/subjects'),
      api.get('/users'),
    ]).then(([ar, cr, sr, ur]) => {
      setAssignments(ar.data);
      setClasses(cr.data);
      setSubjects(sr.data);
      setTeachers(ur.data.filter(u => u.role === 'teacher'));
    }).finally(() => setLoading(false));
  }, []);

  const fetchAssignments = () => api.get('/class-subjects').then(r => setAssignments(r.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.patch(`/class-subjects/${editId}`, { teacher_id: form.teacher_id });
        toast('Teacher updated successfully.');
      } else {
        await api.post('/class-subjects', form);
        toast('Teacher assigned successfully.');
      }
      setForm(empty); setEditId(null); fetchAssignments();
    } catch (err) {
      toast(err.response?.data?.error || 'Something went wrong.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this assignment?')) return;
    try {
      await api.delete(`/class-subjects/${id}`);
      toast('Assignment removed.');
      fetchAssignments();
    } catch (err) {
      toast(err.response?.data?.error || 'Something went wrong.', 'error');
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const filtered = assignments.filter(a =>
    `${a.class_name} ${a.subject_name} ${a.teacher_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Assignments</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{editId ? 'Change Teacher' : 'Assign Teacher'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
            <select value={form.class_id} onChange={set('class_id')} required disabled={!!editId} className={selectClass}>
              <option value="">Select class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
            <select value={form.subject_id} onChange={set('subject_id')} required disabled={!!editId} className={selectClass}>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Teacher</label>
            <select value={form.teacher_id} onChange={set('teacher_id')} required className={selectClass}>
              <option value="">Select teacher</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="col-span-3 flex gap-2">
            <button type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              {editId ? 'Update Teacher' : 'Assign'}
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by class, subject or teacher…"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72" />
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Class', 'Subject', 'Teacher', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{a.class_name}</td>
                  <td className="px-4 py-3 text-gray-900">{a.subject_name}</td>
                  <td className="px-4 py-3 text-gray-600">{a.teacher_name}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => { setEditId(a.id); setForm({ ...empty, teacher_id: '' }); }}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDelete(a.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">{search ? 'No results match your search.' : 'No assignments found.'}</p>
        )}
      </div>
    </div>
  );
}
