import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useSleep } from '../context/SleepContext';

const AHIInfo = () => {
  const { setAppMode } = useSleep();

  return (
    <div className="flex flex-col h-full bg-navy text-white animate-fade-in relative z-50">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-white/10 shrink-0">
        <button
          onClick={() => setAppMode('report')}
          className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-300" />
        </button>
        <h1 className="text-xl font-bold ml-2">AHI (무호흡 지수)</h1>
      </header>

      <div className="flex-1 p-5 flex flex-col gap-6">
        {/* Formula Section */}
        <section className="bg-blue-500/10 rounded-2xl p-5 border border-blue-500/20">
          <h2 className="text-blue-400 font-bold mb-3">AHI 계산 공식</h2>
          <div className="bg-navy p-3 rounded-xl text-center mb-3">
            <div className="text-white font-medium text-sm">
              (저호흡 + 혼합성 + 폐쇄성 + 중추성)
            </div>
            <div className="h-[1px] bg-slate-500 my-1 w-full opacity-50"></div>
            <div className="text-white font-medium text-sm">
              분석 시간 (Time)
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed text-center">
            수면 1시간당 발생하는
            <br />
            호흡 장애의 총 횟수입니다.
          </p>
        </section>

        {/* Severity Section */}
        <section className="flex-1">
          <h2 className="text-blue-400 font-bold mb-4">심각도 단계</h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center p-4 bg-navy-light rounded-xl border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <div className="w-20 text-emerald-400 font-bold text-lg">정상</div>
              <div className="w-[1px] h-8 bg-slate-700 mx-4"></div>
              <div className="text-slate-300">5 미만</div>
            </div>

            <div className="flex items-center p-4 bg-navy-light rounded-xl border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
              <div className="w-20 text-yellow-400 font-bold text-lg">경도</div>
              <div className="w-[1px] h-8 bg-slate-700 mx-4"></div>
              <div className="text-slate-300">5 이상 ~ 15 미만</div>
            </div>

            <div className="flex items-center p-4 bg-navy-light rounded-xl border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
              <div className="w-20 text-orange-400 font-bold text-lg">중등도</div>
              <div className="w-[1px] h-8 bg-slate-700 mx-4"></div>
              <div className="text-slate-300">15 이상 ~ 30 미만</div>
            </div>

            <div className="flex items-center p-4 bg-navy-light rounded-xl border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              <div className="w-20 text-red-400 font-bold text-lg">중증</div>
              <div className="w-[1px] h-8 bg-slate-700 mx-4"></div>
              <div className="text-slate-300">30 이상</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AHIInfo;
