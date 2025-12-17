import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-96 gap-6 animate-fade-in">
      <div className="relative size-20">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#2b7cee] border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#2b7cee] text-2xl">neurology</span>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tez Değerlendiriliyor</h3>
        <p className="text-gray-500 dark:text-gray-400">Yapay zeka dökümanı inceliyor ve analiz ediyor...</p>
        <p className="text-xs text-gray-400 mt-2">Bu işlem dosya boyutuna göre 1-2 dakika sürebilir.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
