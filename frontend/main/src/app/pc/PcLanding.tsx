import React, { useState } from 'react';

const QRCodeDisplay = ({ url, label }: { url: string; label: string }) => (
  <div className="w-full flex justify-center">
    <div className="border rounded-lg p-6 bg-gray-50 w-[300px]">
      <h2 className="font-semibold text-gray-700 mb-4 text-center">{label}</h2>
      <div className="w-[180px] h-[180px] mx-auto bg-white border-2 border-gray-200 flex items-center justify-center">
        <div className="grid grid-cols-5 grid-rows-5 gap-1 p-4">
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4 bg-black"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4 bg-black"></div>
        </div>
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">{url}</p>
    </div>
  </div>
);

const PcLanding = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en'); // Changed from 'ja' to 'en'
  
  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ja' ? 'en' : 'ja');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      {/* Language Toggle Button */}
      <button 
        onClick={toggleLanguage}
        className="fixed top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        aria-label={currentLanguage === 'ja' ? '言語を切り替え' : 'Toggle language'}
      >
        🌐
      </button>

      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 text-blue-500 flex items-center justify-center">
              📱
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {currentLanguage === 'ja' 
              ? 'トイレスマッシュはスマートフォン専用です'
              : 'Toilet Smash is a Mobile-Only Application'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'ja'
              ? 'より良い体験のため、スマートフォンからアクセスしてください。'
              : 'Please access from your smartphone for the best experience.'}
          </p>
        </div>

        {/* Centered QR Code */}
        <QRCodeDisplay 
          url="van-toilet-smash.vercel.app/sp"
          label={currentLanguage === 'ja' ? 'アクセス用QRコード' : 'Access QR Code'}
        />

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">
            {currentLanguage === 'ja' ? 'アクセス方法' : 'How to Access'}
          </h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-2">
            <li>
              {currentLanguage === 'ja'
                ? 'スマートフォンのカメラを起動'
                : 'Open your smartphone camera'}
            </li>
            <li>
              {currentLanguage === 'ja'
                ? 'QRコードを読み取り'
                : 'Scan the QR code'}
            </li>
            <li>
              {currentLanguage === 'ja'
                ? '表示されたリンクをタップしてアプリにアクセス'
                : 'Tap the link that appears to access the app'}
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PcLanding;