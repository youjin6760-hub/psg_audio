import React from 'react';
import { useSleep } from '../context/SleepContext';
import { BedDouble, X, Check } from 'lucide-react';

const PreSleepCheck = () => {
  const { startSleeping, setAppMode } = useSleep();

  return (
    <div className="w-full max-w-md p-8 flex flex-col items-center text-center">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
        <div className="relative p-6 bg-navy-light rounded-3xl border border-slate-700/50 shadow-xl">
          <BedDouble className="w-16 h-16 text-indigo-400" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">수면을 시작할까요?</h2>
      <p className="text-slate-400 mb-10 leading-relaxed">
        설정하신 취침 시간이 다가왔습니다.
        <br />
        잠잘 준비를 모두 마치셨나요?
      </p>

      <div className="w-full grid grid-cols-2 gap-4">
        <button
          onClick={() => setAppMode('dashboard')}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-navy-light hover:bg-slate-800 text-slate-300 rounded-2xl font-bold transition-colors border border-slate-700/50"
        >
          <X className="w-5 h-5" />
          아니요
        </button>

        <button
          onClick={startSleeping}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-colors shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
        >
          <Check className="w-5 h-5" />
          네, 시작할게요
        </button>
      </div>
    </div>
  );
};

export default PreSleepCheck;
