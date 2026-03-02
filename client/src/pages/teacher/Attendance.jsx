import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const STATUSES = ['present', 'absent', 'late'];

export default function Attendance() {
  const toast = useToast();
  const [classes,   setClasses]   = useState([]);
  const [classId,   setClassId]   = useState('');
  const [date,      setDate]      = useState(new Date().toISOString().slice(0, 10));
  const [students,  setStudents]  = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loaded,    setLoaded]    = useState(false);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    api.get('/classes').then(r => setClasses(r.data));
  }, []);

  const loadStudents = async () => {
    if (!classId || !date) return;
    const [enrollRes, attRes] = await Promise.all([
      api.get(`/enrollments?class_id=${classId}`),
      api.get(`/attendance?class_id=${classId}&date=${date}`),
    ]);

    setStudents(enrollRes.data);

    const existing = {};
    attRes.data.forEach(a => { existing[a.student_name] = a.status; });

    const initial = {};
    enrollRes.data.forEach(e => { initial[e.student_id] = existing[e.student_name] || 'present'; });
    setStatusMap(initial);
    setLoaded(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        students.map(s =>
          api.post('/attendance', {
            student_id: s.student_id,
            class_id:   parseInt(classId),
            date,
            status:     statusMap[s.student_id],
          })
        )
      );
      toast('Attendance saved successfully.');
    } catch {
      toast('Failed to save attendance.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = { present: 'text-green-600', absent: 'text-red-500', late: 'text-yellow-600' };
  const inputClass  = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Record Attendance</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
            <select value={classId} onChange={e => { setClassId(e.target.value); setLoaded(false); }} className={inputClass}>
              <option value="">Select class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input type="date" value={date} onChange={e => { setDate(e.target.value); setLoaded(false); }} className={inputClass} />
          </div>
          <button onClick={loadStudents} disabled={!classId}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            Load Students
          </button>
        </div>
      </div>

      {loaded && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">{students.length} student{students.length !== 1 ? 's' : ''}</p>
            <button onClick={handleSave} disabled={saving || students.length === 0}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : 'Save Attendance'}
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.student_id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.student_name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      {STATUSES.map(st => (
                        <label key={st} className={`flex items-center gap-1.5 cursor-pointer text-sm font-medium capitalize ${statusMap[s.student_id] === st ? statusColor[st] : 'text-gray-400'}`}>
                          <input
                            type="radio"
                            name={`status-${s.student_id}`}
                            value={st}
                            checked={statusMap[s.student_id] === st}
                            onChange={() => setStatusMap(m => ({ ...m, [s.student_id]: st }))}
                            className="accent-indigo-600"
                          />
                          {st}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No students enrolled in this class.</p>}
        </div>
      )}
    </div>
  );
}
