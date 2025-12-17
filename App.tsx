import React, { useState } from 'react';
import InputScreen from './components/InputScreen';
import ResultScreen from './components/ResultScreen';
import LoadingScreen from './components/LoadingScreen';
import { AppStep, EvaluationResult } from './types';
import { analyzeThesis } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('input');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (name: string, file: File) => {
    setStep('analyzing');
    setError(null);
    try {
      const evaluationResult = await analyzeThesis(file, name);
      setResult(evaluationResult);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError("Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      setStep('error');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setStep('input');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8] dark:bg-[#101822] font-display text-gray-900 dark:text-gray-100 antialiased overflow-x-hidden transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A2633] shadow-sm">
        <div className="px-6 md:px-10 lg:px-40 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white hover:opacity-80 transition-opacity cursor-pointer" onClick={handleReset}>
            <div className="size-8 flex items-center justify-center text-[#2b7cee] bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">Tez Değerlendirme Sistemi</h2>
          </div>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-10">
        {step === 'input' && <InputScreen onStart={handleStart} />}
        
        {step === 'analyzing' && <LoadingScreen />}
        
        {step === 'result' && result && (
          <ResultScreen data={result} onReset={handleReset} />
        )}

        {step === 'error' && (
             <div className="flex flex-col items-center justify-center w-full max-w-md gap-4 p-8 bg-white dark:bg-[#1A2633] rounded-xl border border-red-200 dark:border-red-900 shadow-md">
                <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                    <span className="material-symbols-outlined text-4xl">error</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bir Hata Oluştu</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">{error}</p>
                <button 
                  onClick={handleReset}
                  className="mt-4 px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Tekrar Dene
                </button>
             </div>
        )}
      </main>
    </div>
  );
};

export default App;
