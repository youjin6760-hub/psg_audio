import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useSleep } from '../context/SleepContext';

const ApneaDefinition = () => {
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
        <h1 className="text-xl font-bold ml-2">수면 무호흡 정의</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-sm leading-relaxed text-slate-300">
        {/* 수면무호흡증이란? */}
        <section>
          <h2 className="text-blue-400 font-bold text-base mb-2">수면무호흡증이란?</h2>
          <p className="mb-2">
            잠을 자는 동안{' '}
            <span className="text-white font-bold">10초 이상</span> 호흡이 멈추는
            상태가 반복되는 것을 말합니다.
          </p>
          <p>
            이런 호흡 정지가 한 시간에 5회 이상, 또는 전체 수면 시간 동안 30회
            이상 발생하면 수면무호흡증으로 진단합니다.
          </p>
        </section>

        {/* 저호흡 정의 */}
        <section>
          <h2 className="text-blue-400 font-bold text-base mb-2">저호흡 (Hypopnea)</h2>
          <p>
            숨은 쉬고 있지만,{' '}
            <span className="text-white font-bold">10초 이상</span> 동안 호흡량이
            평소의 50% 이상 줄어들고, 혈중 산소 포화도가 약 3% 이상 감소하는
            경우를 저호흡이라고 합니다.
          </p>
        </section>

        {/* 수면무호흡증의 종류 */}
        <section className="flex-1 flex flex-col gap-3">
          <h2 className="text-blue-400 font-bold text-base">수면무호흡증의 종류</h2>

          {/* 중추성 수면무호흡 */}
          <div className="bg-navy-light p-3 rounded-xl border border-white/5">
            <h3 className="text-white font-bold mb-1">중추성 수면무호흡</h3>
            <p className="text-xs text-slate-400">
              뇌에서 호흡하라는 신호가 제대로 전달되지 않아, 가슴과 배 근육
              움직임 자체가 줄어들거나 사라지면서 호흡이 멈추는 경우입니다.
            </p>
          </div>

          {/* 폐쇄성 수면무호흡 */}
          <div className="bg-navy-light p-3 rounded-xl border border-white/5">
            <h3 className="text-white font-bold mb-1">폐쇄성 수면무호흡</h3>
            <p className="text-xs text-slate-400">
              가슴과 배는 열심히 움직이지만, 혀나 목 안의 연조직이 좁아지거나
              막혀 공기가 코·입을 통해 잘 드나들지 못해 숨이 막히는 경우입니다.
            </p>
          </div>

          {/* 혼합성 수면무호흡 */}
          <div className="bg-navy-light p-3 rounded-xl border border-white/5">
            <h3 className="text-white font-bold mb-1">혼합성 수면무호흡</h3>
            <p className="text-xs text-slate-400">
              중추성 무호흡과 폐쇄성 무호흡이 함께 나타나는 형태로, 처음에는
              호흡 신호가 줄어들고 이후 기도 폐쇄까지 동반되는 양상입니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApneaDefinition;
