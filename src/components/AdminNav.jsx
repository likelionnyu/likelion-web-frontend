import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

export default function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef(null);

  const isActive = (path) => location.pathname === path;
  const isManagement = () =>
    ['/admin/users', '/admin/calendar', '/admin/projects'].includes(location.pathname);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  const activeClass = 'px-[28px] py-[13px] rounded-full text-[20px] bg-[#2a2a2a] text-white border border-gray-700';
  const inactiveClass = 'px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]';

  return (
    <nav className="flex items-center w-full px-[32px] py-[16px] bg-[#1a1a1a] border-b border-gray-800">
      <div
        onClick={() => navigate('/admin')}
        className="flex items-center text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity text-white"
      >
        LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
        <img src={NYULogo} alt="NYU Logo" className="h-[32px] ml-[8px]" />
      </div>

      <div className="flex items-center gap-[16px] ml-auto">
        {/* Attendance QR */}
        <button
          onClick={() => navigate('/admin/qr')}
          className={isActive('/admin/qr') ? activeClass : inactiveClass}
        >
          Attendance QR
        </button>

        {/* Attendance Session */}
        <button
          onClick={() => navigate('/admin/attendance')}
          className={isActive('/admin/attendance') ? activeClass : inactiveClass}
        >
          Attendance Session
        </button>

        {/* Management 드롭다운 */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={isManagement() ? activeClass : inactiveClass}
          >
            Management ▾
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-[6px] bg-[#1a1a1a] border border-gray-700 rounded-[12px] overflow-hidden z-50 min-w-[220px] shadow-lg">
              <button
                onClick={() => { navigate('/admin/users'); setDropdownOpen(false); }}
                className={`w-full text-left px-[20px] py-[14px] text-[16px] transition-colors ${
                  isActive('/admin/users')
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => { navigate('/admin/calendar'); setDropdownOpen(false); }}
                className={`w-full text-left px-[20px] py-[14px] text-[16px] transition-colors border-t border-gray-800 ${
                  isActive('/admin/calendar')
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                Calendar Management
              </button>
              <button
                onClick={() => { navigate('/admin/projects'); setDropdownOpen(false); }}
                className={`w-full text-left px-[20px] py-[14px] text-[16px] transition-colors border-t border-gray-800 ${
                  isActive('/admin/projects')
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                Project Management
              </button>
            </div>
          )}
        </div>

        {/* Log In */}
        <button
          onClick={() => navigate('/login')}
          className={inactiveClass}
        >
          Log In
        </button>
      </div>
    </nav>
  );
}
