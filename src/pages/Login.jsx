// import { useState } from 'react';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     id: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [errors, setErrors] = useState({});

//   // 입력값 변경 처리
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//     // 입력 시 해당 필드의 에러 제거
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ''
//       });
//     }
//   };

//   // 유효성 검사
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.id) {
//       newErrors.id = '아이디를 입력해주세요.';
//     } else if (formData.id.length < 4) {
//       newErrors.id = '아이디는 최소 4자 이상이어야 합니다.';
//     }

//     if (!formData.password) {
//       newErrors.password = '비밀번호를 입력해주세요.';
//     } else if (formData.password.length < 6) {
//       newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // 회원가입 제출
//   const handleSubmit = async () => {
//     // 유효성 검사
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       // 여기에 실제 백엔드 API 주소를 입력하세요
//       const response = await fetch('https://your-backend-api.com/api/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           id: formData.id,
//           password: formData.password
//         })
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessage('✅ 회원가입이 완료되었습니다!');
//         console.log('서버 응답:', result);
        
//         // 폼 초기화
//         setFormData({
//           id: '',
//           password: '',
//           confirmPassword: ''
//         });
//       } else {
//         const error = await response.json();
//         setMessage(`❌ ${error.message || '회원가입에 실패했습니다.'}`);
//       }
//     } catch (error) {
//       console.error('에러 발생:', error);
//       setMessage('❌ 서버 연결에 실패했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//         {/* 헤더 */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             회원가입
//           </h1>
//           <p className="text-gray-600 text-sm">
//             새 계정을 만들어보세요
//           </p>
//         </div>

//         <div className="space-y-5">
//           {/* 아이디 입력 */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               아이디
//             </label>
//             <input
//               type="text"
//               name="id"
//               value={formData.id}
//               onChange={handleChange}
//               className={`w-full px-4 py-3 border ${
//                 errors.id ? 'border-red-500' : 'border-gray-300'
//               } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
//               placeholder="아이디를 입력하세요"
//             />
//             {errors.id && (
//               <p className="mt-1 text-sm text-red-500">{errors.id}</p>
//             )}
//           </div>

//           {/* 비밀번호 입력 */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               비밀번호
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 border ${
//                   errors.password ? 'border-red-500' : 'border-gray-300'
//                 } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12`}
//                 placeholder="비밀번호를 입력하세요"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? '🙈' : '👁️'}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-500">{errors.password}</p>
//             )}
//           </div>

//           {/* 비밀번호 확인 */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               비밀번호 확인
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 border ${
//                   errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//                 } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12`}
//                 placeholder="비밀번호를 다시 입력하세요"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               >
//                 {showConfirmPassword ? '🙈' : '👁️'}
//               </button>
//             </div>
//             {errors.confirmPassword && (
//               <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
//             )}
//           </div>

//           {/* 회원가입 버튼 */}
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
//           >
//             {loading ? '가입 중...' : '회원가입'}
//           </button>

//           {/* 메시지 표시 */}
//           {message && (
//             <div className={`p-4 rounded-lg text-center font-medium ${
//               message.includes('완료') 
//                 ? 'bg-green-100 text-green-800' 
//                 : 'bg-red-100 text-red-800'
//             }`}>
//               {message}
//             </div>
//           )}

//           {/* 로그인 링크 */}
//           <div className="text-center pt-4 border-t border-gray-200">
//             <p className="text-sm text-gray-600">
//               이미 계정이 있으신가요?{' '}
//               <button className="text-blue-600 hover:text-blue-700 font-medium">
//                 로그인
//               </button>
//             </p>
//           </div>
//         </div>

//         {/* 입력 데이터 미리보기 (개발용) */}
//         <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//           <h3 className="font-semibold text-gray-700 mb-2 text-sm">
//             입력 데이터 미리보기:
//           </h3>
//           <pre className="text-xs text-gray-600 overflow-x-auto">
//             {JSON.stringify({ 
//               id: formData.id, 
//               password: formData.password 
//             }, null, 2)}
//           </pre>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';

export default function LoginPage() {
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

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      // 여기에 실제 백엔드 API 주소를 입력하세요
      const response = await fetch('https://your-backend-api.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('✅ 로그인 성공!');
        console.log('서버 응답:', result);
        
        // 로그인 성공 후 처리 (예: 페이지 이동)
        // window.location.href = '/dashboard';
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
        <h1 className="text-6xl font-bold mb-20">Log In</h1>

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

              {/* Login Button */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-16 py-3 border-2 border-gray-300 rounded-full text-base font-medium hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '로그인 중...' : 'Log In'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`text-center py-3 px-4 rounded-full text-sm ${
                  message.includes('성공') 
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