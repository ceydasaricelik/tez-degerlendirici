import React, { useState, useRef } from 'react';

interface InputScreenProps {
  onStart: (name: string, file: File) => void;
}

const InputScreen: React.FC<InputScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert("Lütfen sadece PDF veya DOCX formatında dosya yükleyin.");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setName('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (name && file) {
      onStart(name, file);
    }
  };

  return (
    <div className="w-full max-w-[1100px] flex flex-col items-center gap-6 animate-fade-in-up">
      <div className="w-full bg-white dark:bg-[#1A2633] border border-gray-200 dark:border-gray-700 shadow-md rounded-xl p-8 md:p-12">
        {/* Heading */}
        <div className="flex flex-col gap-3 mb-10 border-b border-gray-200 dark:border-gray-700 pb-6">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
            Bitirme Tezi Değerlendirme
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg font-normal leading-normal">
            Lütfen bilgilerinizi eksiksiz doldurun ve tez dosyanızı yükleyin.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Name Input */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal">
              Ad Soyad
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2b7cee]/50 focus:border-[#2b7cee] h-14 px-4 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base transition-shadow duration-200"
                placeholder="Adınız ve Soyadınız"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <span className="material-symbols-outlined">person</span>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-2">
            <span className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal">Tez Dosyası</span>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
              className={`group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-all duration-300 px-6 py-12 cursor-pointer
                ${isDragging 
                  ? 'border-[#2b7cee] bg-[#2b7cee]/10' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-[#2b7cee]/70 hover:bg-[#2b7cee]/5 dark:hover:bg-[#2b7cee]/10 bg-gray-50 dark:bg-gray-800/50'
                }`}
            >
              <div className="size-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#2b7cee] mb-2 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center max-w-md z-10">
                <p className="text-gray-900 dark:text-white text-lg font-bold">
                  {file ? file.name : "Tez Dosyası Yükle"}
                </p>
                {!file && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Dosyayı buraya sürükleyin veya bilgisayarınızdan seçin
                  </p>
                )}
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 font-medium">
                  PDF, DOCX (Maks 10MB)
                </p>
              </div>
              <button className="mt-4 flex items-center justify-center h-10 px-6 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors z-20 pointer-events-none">
                <span className="truncate">{file ? "Değiştir" : "Gözat"}</span>
              </button>
              <input
                type="file"
                accept=".pdf,.docx"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              onClick={handleReset}
              className="flex items-center justify-center h-12 px-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
            >
              Sıfırla
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name || !file}
              className={`flex items-center justify-center h-12 px-8 rounded-lg text-white text-sm font-bold shadow-md transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#2b7cee] dark:focus:ring-offset-gray-900
                ${!name || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2b7cee] hover:bg-blue-600 hover:shadow-lg'}`}
            >
              Başla
              <span className="material-symbols-outlined text-lg ml-2">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-[800px] text-center px-4">
        <div className="inline-flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
          <span className="material-symbols-outlined text-lg">info</span>
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            Değerlendirme süreci 3 aşamadan oluşur: Biçimsel Uygunluk, Etik & Bütünlük, Akademik Rubrik.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputScreen;
