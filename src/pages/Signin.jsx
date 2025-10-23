// login api - 백앤드로 보내야할것들
// member_id: int8		primary
// korean_name: varchar
// english_name: varchar
// graduate_year: int4 
// school_email: varchar
// is_admin: bool
// current_university: text	현재 학교 이름
// team: varchar			프로젝트/스터디 팀
// is_undergraduate: bool	학사인지 아닌지
// is_mentor: bool		멘토 여부 (회사도 포함시켜야 하나?)
// is_graduated: bool		졸업 여부
// is_active: bool			현재 활동중인지 여부

import { useState } from 'react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    korean_name: '',
    english_name: '',
    graduate_year: '',
    school_email: '',
    password: '',
    current_university: '',
    team: '',
    is_admin: false,
    is_undergraduate: false,
    is_mentor: false,
    is_graduated: false,
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      // 여기에 실제 백엔드 API 주소를 입력하세요
      const response = await fetch('http://localhost:3000/api/members-users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          graduate_year: parseInt(formData.graduate_year)
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('✅ 회원가입이 완료되었습니다!');
        console.log('서버 응답:', result);
        
        // 폼 초기화
        setFormData({
          korean_name: '',
          english_name: '',
          graduate_year: '',
          school_email: '',
          password: '',
          current_university: '',
          team: '',
          is_admin: false,
          is_undergraduate: false,
          is_mentor: false,
          is_graduated: false,
          is_active: true
        });
      } else {
        setMessage('❌ 회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      setMessage('❌ 서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="flex items-center px-8 py-4 bg-white justify-between">
        <div className="text-custom-32 font-bold">
          LikeLion x <span className="text-purple-600">NYU</span>
        </div>
        
        <div className="flex items-center gap-12 bg-white border border-black rounded-full px-[48px] py-[13px] font-normal">
          <a href="#about" className="text-xl hover:text-purple-600">About Us</a>
          <a href="#members" className="text-xl hover:text-purple-600">Members</a>
          <a href="#mentoring" className="text-xl hover:text-purple-600">Mentoring</a>
          <a href="#activities" className="text-xl hover:text-purple-600">Activities</a>
          <a href="#attendance" className="text-xl hover:text-purple-600">Attendance</a>
        </div>
        

        <button className="px-[28px] py-[13px] border border-black rounded-full text-sm hover:bg-gray-50 text-xl font-normal">
          Log In
        </button>
      </nav>

      {/* Main Content */}
      <div className="px-8 py-12">
        <h1 className="text-5xl font-bold mb-12">Sign Up</h1>

        <div className="max-w-xl mx-auto">
          <div className="bg-white border-2 border-gray-300 rounded-3xl p-12">
            {/* Title */}
            <h2 className="text-4xl font-bold text-center mb-12">
              LikeLion x <span className="text-purple-600">NYU</span>
            </h2>

            {/* Form */}
            <div className="space-y-6">
              {/* Korean Name */}
              <div>
                <label className="block text-base font-semibold mb-2">
                  Korean Name:
                </label>
                <input
                  type="text"
                  name="korean_name"
                  value={formData.korean_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* English Name */}
              <div>
                <label className="block text-base font-semibold mb-2">
                  English Name:
                </label>
                <input
                  type="text"
                  name="english_name"
                  value={formData.english_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* School Email */}
              <div>
                <label className="block text-base font-semibold mb-2">
                  School Email:
                </label>
                <input
                  type="email"
                  name="school_email"
                  value={formData.school_email}
                  onChange={handleChange}
                  required
                  placeholder="example@nyu.edu"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-base font-semibold mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Current University */}
              <div>
                <label className="block text-base font-semibold mb-2">
                  Current University:
                </label>
                <input
                  type="text"
                  name="current_university"
                  value={formData.current_university}
                  onChange={handleChange}
                  required
                  placeholder="New York University"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block text-base font-semibold mb-2">
                  Graduation Year:
                </label>
                <input
                  type="number"
                  name="graduate_year"
                  value={formData.graduate_year}
                  onChange={handleChange}
                  required
                  min="2000"
                  max="2030"
                  placeholder="2025"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Team */}
              <div>
                <label className="block text-base font-semibold mb-2">
                  Team (Project/Study):
                </label>
                <input
                  type="text"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  placeholder="Development Team"
                  className="w-full px-4 py-3 border border-black rounded-full focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 pt-4 pb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_undergraduate"
                    checked={formData.is_undergraduate}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="ml-3 text-base font-medium">
                    Undergraduate Student (학사 과정)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_graduated"
                    checked={formData.is_graduated}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="ml-3 text-base font-medium">
                    Graduated (졸업 여부)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_mentor"
                    checked={formData.is_mentor}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="ml-3 text-base font-medium">
                    Mentor (멘토)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="ml-3 text-base font-medium">
                    Currently Active (현재 활동중)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_admin"
                    checked={formData.is_admin}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="ml-3 text-base font-medium">
                    Admin (관리자 권한)
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-12 py-3 border-2 border-gray-300 rounded-full text-base font-medium hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '제출 중...' : 'Submit'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`text-center py-3 px-4 rounded-full ${
                  message.includes('완료') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* 입력 데이터 미리보기 (개발용) */}
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm">
              백엔드로 전송될 데이터:
            </h3>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
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