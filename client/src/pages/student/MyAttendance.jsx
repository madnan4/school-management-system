import { useEffect, useState } from 'react';
import api from '../../api/axios';

const statusStyle = {
  present: 'bg-green-100 text-green-700',
  absent:  'bg-red-100 text-red-600',
  late:    'bg-yellow-100 text-yellow-700',
};

export default function MyAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance').then(r => setRecords(r.data)).finally(() => setLoading(false));
  }, []);

  const present = records.filter(r => r.status === 'present').length;
  const absent  = records.filter(r => r.status === 'absent').length;
  const late    = records.filter(r => r.status === 'late').length;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Attendance</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Present', count: present, cls: 'text-green-600 bg-green-50 border-green-200' },
          { label: 'Absent',  count: absent,  cls: 'text-red-600 bg-red-50 border-red-200' },
          { label: 'Late',    count: late,    cls: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
        ].map(({ label, count, cls }) => (
          <div key={label} className={`rounded-xl border p-4 ${cls}`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Date', 'Class', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-600">{r.class_name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && records.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No attendance records yet.</p>}
      </div>
    </div>
  );
}
