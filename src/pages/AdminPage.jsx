import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

export default function AdminPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="flex items-center w-full px-4 md:px-[32px] py-3 md:py-[16px] bg-[#1a1a1a] border-b border-gray-800">
        <div
          onClick={() => navigate('/admin')}
          className="flex items-center text-xl md:text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity text-white"
        >
          LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
          <img src={NYULogo} alt="NYU Logo" className="h-5 md:h-[32px] ml-[8px]" />
        </div>

        <div className="hidden md:flex items-center gap-[16px] ml-auto">
          <button onClick={() => navigate('/admin/qr')} className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]">Attendance QR</button>
          <button onClick={() => navigate('/admin/users')} className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]">User Management</button>
          <button onClick={() => navigate('/admin/calendar')} className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]">Calendar Management</button>
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
          <button onClick={() => { navigate('/admin/users'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 text-lg hover:text-white bg-transparent border-none cursor-pointer py-2">User Management</button>
          <button onClick={() => { navigate('/admin/calendar'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 text-lg hover:text-white bg-transparent border-none cursor-pointer py-2">Calendar Management</button>
          <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 text-lg hover:text-white bg-transparent border-none cursor-pointer py-2">Log In</button>
        </div>
      )}

      {/* Admin Home Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#0a0a0a] px-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[96px] font-bold text-white text-center">NYU Admin Page</h1>
      </div>
    </div>
  );
}
