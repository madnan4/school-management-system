import { useEffect, useState } from 'react';
import api from '../../api/axios';

function gradeColor(g) {
  if (g >= 80) return 'text-green-600';
  if (g >= 60) return 'text-yellow-600';
  return 'text-red-500';
}

export default function MyGrades() {
  const [grades,  setGrades]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/grades').then(r => setGrades(r.data)).finally(() => setLoading(false));
  }, []);

  const avg = grades.length
    ? (grades.reduce((s, g) => s + parseFloat(g.grade), 0) / grades.length).toFixed(1)
    : '—';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Grades</h2>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 inline-block">
        <p className="text-3xl font-bold text-indigo-600">{avg}</p>
        <p className="text-sm text-indigo-500 font-medium">Overall Average</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Subject', 'Class', 'Term', 'Grade'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.map(g => (
                <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{g.subject_name}</td>
                  <td className="px-4 py-3 text-gray-600">{g.class_name}</td>
                  <td className="px-4 py-3 text-gray-600">{g.term}</td>
                  <td className={`px-4 py-3 font-bold text-base ${gradeColor(parseFloat(g.grade))}`}>
                    {parseFloat(g.grade).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && grades.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No grades recorded yet.</p>}
      </div>
    </div>
  );
}
