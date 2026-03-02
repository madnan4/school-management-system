import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const empty = { student_id: '', class_id: '' };

export default function Enrollments() {
  const toast = useToast();
  const [enrollments, setEnrollments] = useState([]);
  const [students,    setStudents]    = useState([]);
  const [classes,     setClasses]     = useState([]);
  const [form,        setForm]        = useState(empty);
  const [search,      setSearch]      = useState('');
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([api.get('/enrollments'), api.get('/users'), api.get('/classes')])
      .then(([er, ur, cr]) => {
        setEnrollments(er.data);
        setStudents(ur.data.filter(u => u.role === 'student'));
        setClasses(cr.data);
      }).finally(() => setLoading(false));
  }, []);

  const fetchEnrollments = () => api.get('/enrollments').then(r => setEnrollments(r.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/enrollments', form);
      toast('Student enrolled successfully.');
      setForm(empty); fetchEnrollments();
    } catch (err) {
      toast(err.response?.data?.error || 'Something went wrong.', 'error');
    }
  };

  const handleUnenroll = async (id) => {
    if (!confirm('Unenroll this student?')) return;
    try {
      await api.delete(`/enrollments/${id}`);
      toast('Student unenrolled.');
      fetchEnrollments();
    } catch (err) {
      toast(err.response?.data?.error || 'Something went wrong.', 'error');
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const filtered = enrollments.filter(e =>
    `${e.student_name} ${e.class_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Enrollments</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Enroll Student</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Student</label>
            <select value={form.student_id} onChange={set('student_id')} required className={selectClass}>
              <option value="">Select student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
            <select value={form.class_id} onChange={set('class_id')} required className={selectClass}>
              <option value="">Select class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <button type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Enroll
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student or class…"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72" />
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Student', 'Class', 'Enrolled At', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{e.student_name}</td>
                  <td className="px-4 py-3 text-gray-600">{e.class_name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(e.enrolled_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleUnenroll(e.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium">Unenroll</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">{search ? 'No results match your search.' : 'No enrollments found.'}</p>
        )}
      </div>
    </div>
  );
}
