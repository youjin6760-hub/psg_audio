import React from 'react';
import { useSleep } from '../context/SleepContext';
import { Clock, Moon, ArrowLeft } from 'lucide-react';

const SleepSettings = () => {
  const {
    user,
    sleepSchedule,
    setSleepSchedule,
    setAppMode,
    isFirstTime,
    redirectAfterSleepSettings,
    setRedirectAfterSleepSettings,
    saveSleepSchedule,
  } = useSleep();

  const handleStartChange = (e) => {
    setSleepSchedule(prev => ({ ...prev, start: e.target.value }));
  };

  const handleEndChange = (e) => {
    setSleepSchedule(prev => ({ ...prev, end: e.target.value }));
  };

  const handleBack = () => {
    // 취침 5분 전 팝업에서 "아니요" 타고 들어왔다가
    // 뒤로 갈 때 플래그도 같이 초기화
    setRedirectAfterSleepSettings(false);
    setAppMode('settings');
  };

  const handleSave = async () => {
    // 온보딩(첫 가입 후 초기 설정) 중일 때:
    // DB 저장은 completeOnboarding 쪽에서 처리한다고 가정하고
    // 다음 단계(각성 알림 설정)로만 이동
    if (isFirstTime) {
      setAppMode('arousal-settings');
      return;
    }

    // 로그인된 사용자라면 DB에 수면 스케줄 저장
    if (user) {
      const ok = await saveSleepSchedule();
      if (!ok) {
        // 저장 실패 시에는 그냥 머무르도록
        return;
      }
    }

    // 취침 5분 전 팝업에서 "아니요"를 눌러서
    // 이 화면으로 들어온 경우라면 → 리포트 화면으로
    if (redirectAfterSleepSettings) {
      setRedirectAfterSleepSettings(false);
      setAppMode('report');
    } else {
      // 일반 설정 화면에서 들어온 경우라면 → 설정 메인으로
      setAppMode('settings');
    }
  };

  return (
    <div className="w-full max-w-md h-full flex flex-col p-6">
      <header className="flex items-center gap-4 mb-8">
        {!isFirstTime && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-2xl font-bold text-white">수면 패턴 설정</h1>
      </header>

      <div className="flex items-center justify-center mb-8">
        <div className="p-6 bg-navy-light rounded-full shadow-lg shadow-black/20">
          <Moon className="w-16 h-16 text-blue-400" />
        </div>
      </div>

      <p className="text-slate-400 text-center mb-8">
        규칙적인 수면은 건강의 시작입니다.<br />
        취침 및 기상 시간을 설정해주세요.
      </p>

      <div className="space-y-6">
        <div className="bg-navy-light p-4 rounded-2xl border border-slate-700/50">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            취침 시간
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
            <input
              type="time"
              value={sleepSchedule.start}
              onChange={handleStartChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-10 pr-4 text-white text-lg font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-navy-light p-4 rounded-2xl border border-slate-700/50">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            기상 시간
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
            <input
              type="time"
              value={sleepSchedule.end}
              onChange={handleEndChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-10 pr-4 text-white text-lg font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] mt-8"
        >
          {isFirstTime ? '다음' : '저장하기'}
        </button>

        {isFirstTime && (
          <button
            onClick={() => setAppMode('login')}
            className="w-full text-slate-400 font-medium py-4 hover:text-white transition-colors"
          >
            돌아가기
          </button>
        )}
      </div>
    </div>
  );
};

export default SleepSettings;
