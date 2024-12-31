import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/app/pc/Card';
import { getAssetPath } from '@/utils/path';
import { PC } from '@/constants/i18n';

const QRCodeDisplay = ({ url, label }: { url: string; label: string }) => (
  <div className="w-full flex justify-center">
    <Card className="w-[300px] bg-gray-50">
      <CardContent className="p-6">
        <h2 className="font-semibold text-gray-700 mb-4 text-center">{label}</h2>
        <div className="w-[180px] h-[180px] mx-auto bg-white border-2 border-gray-200 flex items-center justify-center">
          <Image
            src={getAssetPath('/sp-qr.png')}
            alt="QR Code"
            width={160}
            height={160}
            className="object-contain"
          />
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">{url}</p>
      </CardContent>
    </Card>
  </div>
);

const PcLanding = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ja' ? 'en' : 'ja');
  };

  const t = (text: { ja: string; en: string }) => text[currentLanguage as keyof typeof text];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <button
        onClick={toggleLanguage}
        className="fixed top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
      >
        🌐
      </button>

      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 text-blue-500 flex items-center justify-center">
              📱
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t(PC.TITLE)}
          </h1>
          <p className="text-gray-600">
            {t(PC.DESCRIPTION)}
          </p>
        </div>

        <QRCodeDisplay 
          url="van-toilet-smash.vercel.app/sp"
          label={t(PC.QR_TITLE)}
        />

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">
            {t(PC.HOW_TO_ACCESS)}
          </h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-2">
            <li>
              {t(PC.STEP_CAMERA)}
            </li>
            <li>
              {t(PC.STEP_SCAN)}
            </li>
            <li>
              {t(PC.STEP_ACCESS)}
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PcLanding;