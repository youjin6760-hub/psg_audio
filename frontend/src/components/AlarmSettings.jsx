import React from 'react';
import { useSleep } from '../context/SleepContext';
import { AlarmClock, ArrowLeft } from 'lucide-react';

const AlarmSettings = () => {
  const {
    alarmEnabled,
    setAlarmEnabled,
    setAppMode,
    isFirstTime,
    completeOnboarding,
    sleepSchedule,
  } = useSleep();

  const handleComplete = () => {
    if (isFirstTime) {
      completeOnboarding();
    } else {
      setAppMode('settings');
    }
  };

  return (
    <div className="w-full max-w-md h-full flex flex-col p-6">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setAppMode('arousal-settings')}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">기상 알람 설정</h1>
      </header>

      <div className="flex items-center justify-center mb-8">
        <div
          className={`p-6 rounded-full shadow-lg shadow-black/20 transition-colors ${alarmEnabled ? 'bg-orange-500/20' : 'bg-slate-800'
            }`}
        >
          <AlarmClock
            className={`w-16 h-16 ${alarmEnabled ? 'text-orange-500' : 'text-slate-500'
              }`}
          />
        </div>
      </div>

      <div className="bg-navy-light p-6 rounded-3xl border border-slate-700/50 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-white block">기상 알람</span>
            <span className="text-3xl font-bold text-blue-400 mt-1 block">
              {sleepSchedule.end}
            </span>
          </div>
          <button
            onClick={() => setAlarmEnabled(!alarmEnabled)}
            className={`w-14 h-8 rounded-full transition-colors relative ${alarmEnabled ? 'bg-green-500' : 'bg-slate-600'
              }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${alarmEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

        <div className="pt-4 border-t border-slate-700/50">
          <p className="text-slate-300 leading-relaxed">
            {alarmEnabled
              ? `설정하신 기상 시간(${sleepSchedule.end})에 알람이 울립니다. 상쾌한 아침을 맞이하세요.`
              : '알람이 꺼져 있습니다. 기상 시간에 알람이 울리지 않습니다.'}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleComplete}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
        >
          {isFirstTime ? '설정 완료' : '저장하기'}
        </button>

        <button
          onClick={() => setAppMode('arousal-settings')}
          className="w-full text-slate-400 font-medium py-4 hover:text-white transition-colors"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default AlarmSettings;
