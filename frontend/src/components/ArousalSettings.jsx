import React from 'react';
import { useSleep } from '../context/SleepContext';
import { Bell, ArrowLeft } from 'lucide-react';

const ArousalSettings = () => {
  const { wakeUpEnabled, setWakeUpEnabled, setAppMode, isFirstTime } = useSleep();

  const handleNext = () => {
    if (isFirstTime) {
      setAppMode('alarm-settings');
    } else {
      setAppMode('settings');
    }
  };

  return (
    <div className="w-full max-w-md h-full flex flex-col p-6">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setAppMode('sleep-settings')}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">각성 알림 설정</h1>
      </header>

      <div className="flex items-center justify-center mb-8">
        <div
          className={`p-6 rounded-full shadow-lg shadow-black/20 transition-colors ${wakeUpEnabled ? 'bg-red-500/20' : 'bg-slate-800'
            }`}
        >
          <Bell
            className={`w-16 h-16 ${wakeUpEnabled ? 'text-red-500' : 'text-slate-500'
              }`}
          />
        </div>
      </div>

      <div className="bg-navy-light p-6 rounded-3xl border border-slate-700/50 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-white">각성 알림</span>
          <button
            onClick={() => setWakeUpEnabled(!wakeUpEnabled)}
            className={`w-14 h-8 rounded-full transition-colors relative ${wakeUpEnabled ? 'bg-green-500' : 'bg-slate-600'
              }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${wakeUpEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

        <div className="pt-4 border-t border-slate-700/50">
          <p className="text-slate-300 leading-relaxed">
            {wakeUpEnabled
              ? '각성 알림이 켜져 있습니다. 30초 이상 무호흡이 감지되면 진동과 알림음으로 깨워드립니다.'
              : '각성 알림이 꺼져 있습니다. 무호흡이 감지되어도 알림이 울리지 않으며, 수면 리포트에만 기록됩니다.'}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
        >
          {isFirstTime ? '다음' : '저장하기'}
        </button>

        <button
          onClick={() => setAppMode('sleep-settings')}
          className="w-full text-slate-400 font-medium py-4 hover:text-white transition-colors"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default ArousalSettings;
