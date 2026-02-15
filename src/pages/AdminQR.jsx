import { useState } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

export default function AdminQR() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [meetingNumber, setMeetingNumber] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [status, setStatus] = useState('');

  const loadQR = async () => {
    if (!meetingNumber) {
      setStatus('Please enter a meeting number.');
      return;
    }

    setStatus('Generating QR Code...');

    try {
      // QR 안에 들어갈 실제 URL
      const qrData = `${window.location.origin}/attendance?meeting=${meetingNumber}`;

      // QR 이미지 생성
      const qrImageData = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrImage(qrImageData);
      setStatus(`QR Code for Meeting #${meetingNumber}`);
    } catch (error) {
      console.error('QR generation error:', error);
      setStatus('Failed to generate QR Code.');
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
          <button onClick={() => navigate('/admin/qr')} className="px-[28px] py-[13px] rounded-full text-[20px] bg-[#2a2a2a] text-white border border-gray-700">Attendance QR</button>
          <button onClick={() => navigate('/admin/users')} className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]">User Management</button>
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
          <button onClick={() => { navigate('/admin/qr'); setMobileMenuOpen(false); }} className="block w-full text-left text-white text-lg bg-transparent border-none cursor-pointer py-2">Attendance QR</button>
          <button onClick={() => { navigate('/admin/users'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 text-lg hover:text-white bg-transparent border-none cursor-pointer py-2">User Management</button>
          <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 text-lg hover:text-white bg-transparent border-none cursor-pointer py-2">Log In</button>
        </div>
      )}

      {/* Main QR Generator */}
      <div className="flex flex-col items-center justify-center mt-12 md:mt-[80px] px-4 md:px-[32px] md:leading-normal">
        <h1 className="text-2xl md:text-[48px] font-bold text-white mb-6 md:mb-[32px] md:leading-normal text-center">
          Attendance QR Generator
        </h1>

        {/* Meeting number input */}
        <input
          type="number"
          value={meetingNumber}
          onChange={(e) => setMeetingNumber(e.target.value)}
          placeholder="Enter meeting number"
          className="px-4 md:px-[16px] py-3 md:py-[12px] text-base md:text-[20px] md:leading-normal w-full max-w-[280px] rounded-lg bg-[#2a2a2a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-nyu-purple"
        />

        <button
          onClick={loadQR}
          className="px-6 md:px-[32px] py-3 md:py-[16px] bg-nyu-purple text-white rounded-full text-base md:text-[20px] mt-6 md:mt-[24px] md:leading-normal hover:opacity-80"
        >
          Generate QR Code
        </button>

        {/* QR Image */}
        {qrImage && (
          <div className="mt-6 md:mt-[32px] md:leading-normal flex justify-center">
            <img
              src={qrImage}
              alt="QR Code"
              className="w-48 md:w-[250px] md:leading-normal border border-gray-600 rounded-lg"
            />
          </div>
        )}

        {/* Status message */}
        {status && (
          <p className="text-gray-300 text-base md:text-[18px] md:leading-normal mt-4 md:mt-[20px] text-center">{status}</p>
        )}
      </div>
    </div>
  );
}
