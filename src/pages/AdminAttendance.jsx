import { useEffect, useState } from 'react';
import AdminNav from '../components/AdminNav';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/adminpage/attendance_list`
      );
      const data = await res.json();
      // 마지막 미팅(meeting_number 높은 순) 기준 정렬
      const sorted = (data.attendance || []).sort(
        (a, b) => b.meeting_number - a.meeting_number
      );
      setRecords(sorted);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminNav />

      <div className="px-[32px] py-[40px]">
        <h1 className="text-[48px] font-bold text-white text-center mb-[40px]">
          Attendance Session
        </h1>

        {loading ? (
          <p className="text-white text-center text-[24px]">
            Loading attendance...
          </p>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
            <table className="w-full text-gray-300">
              <thead className="bg-[#2a2a2a] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Meeting #</th>
                  <th className="px-4 py-3 text-left">Korean Name</th>
                  <th className="px-4 py-3 text-left">English Name</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((r, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                    >
                      <td className="px-4 py-3">{r.meeting_number}</td>
                      <td className="px-4 py-3">{r.korean_name}</td>
                      <td className="px-4 py-3">{r.english_name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-[12px] py-[4px] rounded-full text-[14px] ${
                            r.status
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {r.status ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
