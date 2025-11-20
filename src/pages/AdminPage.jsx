import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';
import QRCode from 'qrcode';

export default function AdminPage() {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [meetingNumber, setMeetingNumber] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [status, setStatus] = useState('');

  const handleQRClick = () => {
    setShowQR(true);
  };

  const loadQR = async () => {
    if (!meetingNumber) {
      setStatus('Please enter a meeting number.');
      return;
    }

    setStatus('Generating QR Code...');

    try {
      // 프론트엔드에서 직접 QR 코드 생성
      const qrData = `${window.location.origin}/attendance?meeting=${meetingNumber}`;

      const qrImageData = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrImage(qrImageData);
      setStatus(`QR Code for Meeting #${meetingNumber}`);
    } catch (error) {
      console.error('QR Code generation error:', error);
      setStatus('Error generating QR code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="flex items-center w-full px-[32px] py-[16px] bg-[#1a1a1a] border-b border-gray-800">
        <div
          onClick={() => navigate('/')}
          className="flex items-center text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity text-white"
        >
          LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
          <img
            src={NYULogo}
            alt="NYU Logo"
            className="h-[32px] ml-[8px]"
          />
        </div>

        <div className="flex items-center gap-[16px] ml-auto">
          <button
            onClick={handleQRClick}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a] font-normal shadow-button transition-all duration-200 hover:-translate-y-1 hover:shadow-hover"
          >
            Attendance QR
          </button>
          <button
            onClick={() => navigate('#user-management')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a] font-normal shadow-button transition-all duration-200 hover:-translate-y-1 hover:shadow-hover"
          >
            User Management
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a] font-normal shadow-button transition-all duration-200 hover:-translate-y-1 hover:shadow-hover"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Main Content with Dark Background */}
      <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] flex items-center justify-center">
        {!showQR ? (
          <h1 className="text-[96px] font-bold text-white">
            NYU Admin Page
          </h1>
        ) : (
          <div className="text-center">
            <h2 className="text-[48px] font-bold text-white mb-[40px]">
              Attendance QR Generator
            </h2>

            {/* 미팅 번호 입력창 */}
            <input
              type="number"
              value={meetingNumber}
              onChange={(e) => setMeetingNumber(e.target.value)}
              placeholder="Enter meeting number"
              className="px-[16px] py-[12px] text-[20px] w-[300px] rounded-lg bg-[#2a2a2a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-nyu-purple"
            />
            <br /><br />

            {/* 생성 버튼 */}
            <button
              onClick={loadQR}
              className="px-[32px] py-[16px] text-[20px] bg-nyu-purple text-white rounded-full hover:opacity-80 transition-opacity cursor-pointer border-none font-normal"
            >
              Generate QR Code
            </button>

            <br /><br />

            {/* QR 이미지 */}
            {qrImage && (
              <div className="flex justify-center mt-[30px]">
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="w-[250px] border-2 border-gray-700 rounded-lg"
                />
              </div>
            )}

            {/* 상태 메시지 */}
            {status && (
              <p className="text-white text-[18px] mt-[20px]">{status}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
