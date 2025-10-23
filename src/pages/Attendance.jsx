import { useState } from 'react';

export default function AttendancePage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAttendance = async () => {
    setLoading(true);
    setMessage('');

    try {
      // 여기에 실제 백엔드 API 주소를 입력하세요
      const response = await fetch('https://your-backend-api.com/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('✅ 출석 체크가 완료되었습니다!');
        console.log('서버 응답:', result);
        
        // 폼 초기화
        setFormData({
          email: '',
          password: ''
        });
      } else {
        setMessage('❌ 이메일 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      setMessage('❌ 서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <div className="text-xl font-bold">
          LikeLion x <span className="text-purple-600">NYU</span>
        </div>
        
        <div className="flex items-center gap-6 bg-white border-2 border-gray-300 rounded-full px-8 py-2">
          <a href="#about" className="text-sm hover:text-purple-600">About Us</a>
          <a href="#members" className="text-sm hover:text-purple-600">Members</a>
          <a href="#mentoring" className="text-sm hover:text-purple-600">Mentoring</a>
          <a href="#activities" className="text-sm hover:text-purple-600">Activities</a>
          <a href="#attendance" className="text-sm hover:text-purple-600">Attendance</a>
        </div>

        <button className="px-6 py-2 border-2 border-gray-300 rounded-full text-sm hover:bg-gray-50">
          Log In
        </button>
      </nav>

      {/* Main Content */}
      <div className="px-8 py-16">
        <h1 className="text-6xl font-bold mb-20">Attendance</h1>

        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <div className="w-full max-w-md bg-white border-2 border-gray-300 rounded-[3rem] p-16">
            {/* Title */}
            <h2 className="text-4xl font-bold text-center mb-16">
              LikeLion x <span className="text-purple-600">NYU</span>
            </h2>

            {/* Form */}
            <div className="space-y-8">
              {/* Email */}
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600 text-base"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600 text-base"
                />
              </div>

              {/* Check In Button */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleAttendance}
                  disabled={loading}
                  className="px-16 py-3 border-2 border-gray-300 rounded-full text-base font-medium hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '처리 중...' : 'Log In'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`text-center py-3 px-4 rounded-full text-sm ${
                  message.includes('완료') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <a href="#signup" className="text-orange-500 font-semibold hover:text-orange-600">
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 text-center">
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 hover:opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </footer>
    </div>
  );
}