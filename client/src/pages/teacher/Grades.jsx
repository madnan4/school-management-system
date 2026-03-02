import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export default function Grades() {
  const toast = useToast();
  const [classes,     setClasses]     = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [classId,     setClassId]     = useState('');
  const [subjectId,   setSubjectId]   = useState('');
  const [term,        setTerm]        = useState('');
  const [students,    setStudents]    = useState([]);
  const [gradeMap,    setGradeMap]    = useState({});
  const [loaded,      setLoaded]      = useState(false);
  const [saving,      setSaving]      = useState(false);

  useEffect(() => {
    Promise.all([api.get('/classes'), api.get('/class-subjects')])
      .then(([cr, ar]) => { setClasses(cr.data); setAssignments(ar.data); });
  }, []);

  // Subjects available for the selected class
  const subjectsForClass = assignments.filter(a => String(a.class_id) === String(classId));

  const loadStudents = async () => {
    if (!classId || !subjectId || !term) return;

    const subjectName = subjectsForClass.find(a => String(a.subject_id) === String(subjectId))?.subject_name;

    const [enrollRes, gradesRes] = await Promise.all([
      api.get(`/enrollments?class_id=${classId}`),
      api.get(`/grades?class_id=${classId}&term=${encodeURIComponent(term)}`),
    ]);

    setStudents(enrollRes.data);

    const existing = {};
    gradesRes.data
      .filter(g => g.subject_name === subjectName)
      .forEach(g => { existing[g.student_name] = g.grade; });

    const initial = {};
    enrollRes.data.forEach(e => { initial[e.student_id] = existing[e.student_name] ?? ''; });
    setGradeMap(initial);
    setLoaded(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        students
          .filter(s => gradeMap[s.student_id] !== '')
          .map(s =>
            api.post('/grades', {
              student_id: s.student_id,
              subject_id: parseInt(subjectId),
              class_id:   parseInt(classId),
              grade:      parseFloat(gradeMap[s.student_id]),
              term,
            })
          )
      );
      toast('Grades saved successfully.');
    } catch {
      toast('Failed to save grades.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Record Grades</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="grid grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
            <select value={classId} onChange={e => { setClassId(e.target.value); setSubjectId(''); setLoaded(false); }} className={inputClass}>
              <option value="">Select class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
            <select value={subjectId} onChange={e => { setSubjectId(e.target.value); setLoaded(false); }} className={inputClass} disabled={!classId}>
              <option value="">Select subject</option>
              {subjectsForClass.map(a => <option key={a.subject_id} value={a.subject_id}>{a.subject_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Term</label>
            <input value={term} onChange={e => { setTerm(e.target.value); setLoaded(false); }} placeholder="e.g. Term 1" className={inputClass} />
          </div>
          <button onClick={loadStudents} disabled={!classId || !subjectId || !term}
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
              {saving ? 'Saving…' : 'Save Grades'}
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Grade (0–100)</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.student_id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.student_name}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number" min="0" max="100" step="0.5"
                      value={gradeMap[s.student_id]}
                      onChange={e => setGradeMap(m => ({ ...m, [s.student_id]: e.target.value }))}
                      placeholder="—"
                      className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
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
