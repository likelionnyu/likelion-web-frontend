import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editedMembers, setEditedMembers] = useState({});
  const [deleteList, setDeleteList] = useState([]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/adminpage/members_list`
      );
      const data = await res.json();
      setMembers(data.members || []);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEdit = (id, field, value) => {
    setEditedMembers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const toggleDelete = (id) => {
    setDeleteList((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const saveChanges = async () => {
    const body = {
      updates: Object.entries(editedMembers).map(([id, fields]) => ({
        member_id: Number(id),
        ...fields,
      })),
      deletes: deleteList,
      inserts: [],
    };

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/adminpage/save_manage_members`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      const result = await res.json();
      if (res.ok) {
        alert('Changes saved!');
        setEditedMembers({});
        setDeleteList([]);
        fetchMembers();
      } else {
        alert(result.error || 'Failed to save changes');
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving changes');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="flex items-center w-full px-4 md:px-[32px] py-3 md:py-[16px] bg-[#1a1a1a] border-b border-gray-800">
        <div
          onClick={() => navigate('/admin')}
          className="flex items-center text-xl md:text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity text-white"
        >
          LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
          <img src={NYULogo} alt="logo" className="h-5 md:h-[32px] ml-[8px]" />
        </div>

        <div className="hidden md:flex items-center gap-[16px] ml-auto">
          <button onClick={() => navigate('/admin/qr')} className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]">Attendance QR</button>
          <button onClick={() => navigate('/admin/users')} className="px-[28px] py-[13px] rounded-full text-[20px] bg-[#2a2a2a] text-white border border-gray-700">User Management</button>
          <button onClick={() => navigate('/login')} className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]">Log In</button>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden ml-auto p-2 text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-b border-gray-800 px-4 py-4 space-y-3">
          <button onClick={() => { navigate('/admin/qr'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 text-lg hover:text-white bg-transparent border-none cursor-pointer py-2">Attendance QR</button>
          <button onClick={() => { navigate('/admin/users'); setMobileMenuOpen(false); }} className="block w-full text-left text-white text-lg bg-transparent border-none cursor-pointer py-2">User Management</button>
          <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 text-lg hover:text-white bg-transparent border-none cursor-pointer py-2">Log In</button>
        </div>
      )}

      {/* CONTENT */}
      <div className="px-4 md:px-[32px] py-6 md:py-[40px]">
        <h1 className="text-2xl md:text-[48px] md:leading-normal font-bold text-white text-center mb-6 md:mb-[40px]">
          User Management
        </h1>

        {loading ? (
          <p className="text-white text-center text-lg md:text-[24px]md:leading-normal ">
            Loading members...
          </p>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg overflow-x-auto border border-gray-800">
            <table className="w-full text-gray-300 text-sm md:text-base md:leading-normal min-w-[700px]">
              <thead className="bg-[#2a2a2a] text-white">
                <tr>
                  <th className="px-3 md:px-4 py-3 md:leading-normal text-left">ID</th>
                  <th className="px-3 md:px-4 py-3 md:leading-normal text-left">Korean Name</th>
                  <th className="px-3 md:px-4 py-3 md:leading-normal text-left">English Name</th>
                  <th className="px-3 md:px-4 py-3 md:leading-normal text-left">Email</th>
                  <th className="px-3 md:px-4 py-3 md:leading-normal text-left">University</th>
                  <th className="px-3 md:px-4 py-3 md:leading-normal text-left">Team</th>
                  <th className="px-3 md:px-4 py-3 md:leading-normal text-left">Grad Year</th>
                  <th className="px-3 md:px-4 py-3 md:leading-normal text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {members.length > 0 ? (
                  members.map((m, index) => (
                    <tr
                      key={m.member_id || index}
                      className="border-t border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                    >
                      <td className="px-3 md:px-4 py-3 md:leading-normal">{m.member_id}</td>
                      <td className="px-3 md:px-4 py-3 md:leading-normal">{m.korean_name}</td>
                      <td className="px-3 md:px-4 py-3 md:leading-normal">{m.english_name}</td>
                      <td className="px-3 md:px-4 py-3 md:leading-normal">{m.school_email}</td>
                      <td className="px-3 md:px-4 py-3 md:leading-normal">
                        {m.current_university || 'N/A'}
                      </td>
                      <td className="px-3 md:px-4 py-3 md:leading-normal">{m.team || 'N/A'}</td>
                      <td className="px-3 md:px-4 py-3 md:leading-normal">{m.graduate_year}</td>
                      <td className="px-3 md:px-4 py-3 md:leading-normal">
                        <span
                          className={`px-2 md:px-[12px] py-1 md:py-[4px] rounded-full text-xs md:text-[14px] md:leading-normal ${
                            m.is_active
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {m.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="flex justify-center mt-6 md:mt-[40px]">
          <button
            onClick={saveChanges}
            className="px-8 md:px-[40px] py-3 md:py-[14px] md:leading-normal bg-nyu-purple text-white rounded-full text-lg md:text-[22px] hover:opacity-80 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
