import React, { useState } from 'react';
import { EvaluationResult, Finding } from '../types';
import { downloadTXT } from '../services/pdfService';

interface ResultScreenProps {
  data: EvaluationResult;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ data, onReset }) => {
  const { meta, decision, counts, findingsTable, reportTxt } = data;
  const [filter, setFilter] = useState<string>('ALL');

  const handleDownload = () => {
    if (reportTxt) {
      downloadTXT(reportTxt, meta.fileName);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass = "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset uppercase";
    switch (status) {
      case 'UYGUN':
      case 'GEÇTİ':
        return <span className={`${baseClass} bg-green-50 text-green-700 ring-green-600/20`}>Uygun</span>;
      case 'UYARI':
        return <span className={`${baseClass} bg-yellow-50 text-yellow-700 ring-yellow-600/20`}>Uyarı</span>;
      case 'HATA':
      case 'İDARİ_RED':
      case 'RED':
        return <span className={`${baseClass} bg-red-50 text-red-700 ring-red-600/10`}>Hata</span>;
      case 'N/A':
        return <span className={`${baseClass} bg-gray-100 text-gray-600 ring-gray-500/10`}>N/A</span>;
      case 'BİLGİ':
      case 'BILGI':
        return <span className={`${baseClass} bg-blue-50 text-blue-600 ring-blue-500/10`}>Bilgi</span>;
      default:
        return <span className={`${baseClass} bg-gray-50 text-gray-600 ring-gray-500/10`}>{status}</span>;
    }
  };

  const filteredFindings = findingsTable.filter(f => filter === 'ALL' || f.status === filter);

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 py-8 flex-grow animate-fade-in-up pb-24">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-white text-3xl font-black mb-2 leading-tight">Değerlendirme Sonuçları</h1>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">description</span> {meta.fileName}</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> {meta.candidateName}</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> {meta.evaluatedAt}</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
          Framework: {meta.version}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* General Decision Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Genel Karar</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                decision.risk === 'DÜŞÜK' ? 'bg-green-100 text-green-800' :
                decision.risk === 'ORTA' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>{decision.risk} RİSK</span>
            </div>
            <div className={`text-2xl font-black mb-2 tracking-tight ${decision.overall.includes('RED') ? 'text-red-600' : 'text-green-600'}`}>
              {decision.overall.replace('_', ' ')}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              {decision.summaryText}
            </p>
          </div>
        </div>

        {/* Success Rate Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Başarı Oranı</h3>
          <div className="text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">%{counts.score.successRate}</div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${counts.score.successRate}%` }}></div>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 italic leading-tight mt-auto">
            {counts.note || `${counts.applicable} uygulanabilir kural üzerinden hesaplandı.`}
          </p>
        </div>

        {/* Error Rate Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Hata Oranı</h3>
          <div className="text-5xl font-black text-red-600 mb-4 tracking-tighter">%{counts.score.errorRate}</div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${counts.score.errorRate}%` }}></div>
          </div>
          <div className="flex gap-2 mt-auto">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">HATA: {counts.countsByStatus.HATA}</span>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">N/A: {counts.countsByStatus.N_A}</span>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">BİLGİ: {counts.countsByStatus.BILGI || counts.countsByStatus.BILGI || 0}</span>
          </div>
        </div>
      </div>

      {/* Findings Table Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Bulgular Listesi (22 Kural)</h3>
        <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {['ALL', 'HATA', 'UYARI', 'UYGUN', 'N/A', 'BİLGİ'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f === 'BİLGİ' ? 'BİLGİ' : f)}
              className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${
                (filter === f || (filter === 'BİLGİ' && f === 'BİLGİ')) ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest">Kural ve Kategori</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Durum</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest">Değerlendirme Notu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredFindings.map((f, idx) => (
                <tr key={idx} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{f.ruleName}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{f.tier} • {f.ruleId}</div>
                  </td>
                  <td className="px-6 py-5 text-center">{getStatusBadge(f.status)}</td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300 mb-1.5 leading-relaxed">{f.note}</p>
                    {f.evidence && <p className="text-[10px] text-gray-400 italic font-medium bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded inline-block">Kanıt: {f.evidence}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredFindings.length === 0 && (
          <div className="p-16 text-center text-gray-400 italic font-medium">Bu filtreye uygun herhangi bir bulgu bulunmamaktadır.</div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-6 py-4 z-50">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-tighter">
            <span className="material-symbols-outlined text-sm">security</span>
            Hesaplama IGL-TEF v1 Standartlarına Uygundur
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onReset} 
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
            >
              Yeniden Başlat
            </button>
            <button 
              onClick={handleDownload} 
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
            >
              Dosyayı İndir (TXT)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
