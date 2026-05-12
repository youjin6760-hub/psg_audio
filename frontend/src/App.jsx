import React from 'react';
import { SleepProvider, useSleep } from './context/SleepContext';
import SleepSettings from './components/SleepSettings';
import PreSleepCheck from './components/PreSleepCheck';
import DetectionScreen from './components/DetectionScreen';
import SleepReport from './components/SleepReport';
import Login from './components/Login';
import Signup from './components/Signup';
import Settings from './components/Settings';
import MobileLayout from './components/MobileLayout';
import ArousalSettings from './components/ArousalSettings';
import AlarmSettings from './components/AlarmSettings';
import ForgotPassword from './components/ForgotPassword';
import SplashScreen from './components/SplashScreen';
import ApneaDefinition from './components/ApneaDefinition';
import AHIInfo from './components/AHIInfo';
import { Bell, X } from 'lucide-react';

const AppContent = () => {
  const {
    appMode,
    showSleepPrompt,
    handleSleepPromptResponse,
    countdown,
    cancelCountdown,
    isAlarmRinging,
    alarmReason,
    stopAlarm,
  } = useSleep();

  // 카운트다운 초 → MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <MobileLayout>
      {/* 알람 전체 오버레이 */}
      {isAlarmRinging && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-navy animate-fade-in">
          <div className="flex-1 flex flex-col items-center justify-center w-full p-6 text-center">
            <div className="w-48 h-48 rounded-full bg-orange-500/20 flex items-center justify-center mb-10 animate-pulse">
              <Bell className="w-24 h-24 text-orange-500 animate-bounce" />
            </div>

            {/* 알람 종류에 따라 텍스트 변경 */}
            <h2 className="text-4xl font-bold text-white mb-4">
              {alarmReason === 'arousal' ? '각성 알림입니다!' : '기상 시간입니다!'}
            </h2>

            <p className="text-xl text-slate-300">
              {alarmReason === 'arousal' ? (
                <>
                  30초 이상 무호흡이 감지되었습니다.
                  <br />
                  안전한 수면을 위해 잠시 깨워드릴게요.
                </>
              ) : (
                <>
                  상쾌한 아침이 밝았습니다.
                  <br />
                  오늘 하루도 화이팅하세요! ☀️
                </>
              )}
            </p>
          </div>

          <div className="w-full p-6 pb-12">
            <button
              onClick={stopAlarm}
              className="w-full py-5 bg-white text-navy rounded-2xl font-bold text-xl shadow-lg shadow-white/10 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-6 h-6" />
              알람 끄기
            </button>
          </div>
        </div>
      )}

      {/* 수면 분석 카운트다운 오버레이 */}
      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-navy animate-fade-in">
          <div className="text-center">
            <div className="mb-8">
              <img
                src="/src/assets/login_logo.png"
                alt="Logo"
                className="w-24 h-24 mx-auto animate-pulse-slow"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">수면 분석 대기 중</h2>
            <p className="text-slate-400 mb-8">
              잠시 후 분석이 시작됩니다.
              <br />
              편안하게 누워주세요.
            </p>
            <div className="text-6xl font-bold text-blue-400 font-mono mb-8">
              {formatTime(countdown)}
            </div>
            <button
              onClick={cancelCountdown}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 취침 5분 전 안내 모달 */}
      {showSleepPrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
          <div className="bg-navy-light rounded-3xl p-8 w-full max-w-sm border border-slate-700 shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🌙</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              취침 시간 5분 전입니다!
            </h3>
            <p className="text-slate-300 mb-8 leading-relaxed">
              오늘도 꿀잠 잘 준비 되셨나요?
              <br />
              지금 주무시겠습니까?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleSleepPromptResponse(false, true)}
                className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
              >
                지금 바로 시작
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSleepPromptResponse(false)}
                  className="flex-1 py-4 rounded-xl bg-slate-700 text-slate-300 font-bold hover:bg-slate-600 transition-colors"
                >
                  아니요
                </button>
                <button
                  onClick={() => handleSleepPromptResponse(true)}
                  className="flex-1 py-4 rounded-xl bg-slate-600 text-white font-bold hover:bg-slate-500 transition-colors"
                >
                  5분 후 시작
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 스플래시 */}
      {appMode === 'splash' && <SplashScreen />}

      {/* 메인 콘텐츠 */}
      <div className="min-h-full flex flex-col">
        {appMode === 'login' ||
          appMode === 'signup' ||
          appMode === 'forgot-password' ? (
          <div className="flex-1 flex items-center justify-center">
            {appMode === 'login' && <Login />}
            {appMode === 'signup' && <Signup />}
            {appMode === 'forgot-password' && <ForgotPassword />}
          </div>
        ) : (
          <>
            {appMode === 'settings' && <Settings />}
            {appMode === 'sleep-settings' && <SleepSettings />}
            {appMode === 'arousal-settings' && <ArousalSettings />}
            {appMode === 'alarm-settings' && <AlarmSettings />}
            {appMode === 'check' && <PreSleepCheck />}
            {appMode === 'detecting' && <DetectionScreen />}
            {appMode === 'report' && <SleepReport />}
            {appMode === 'apnea-definition' && <ApneaDefinition />}
            {appMode === 'ahi-info' && <AHIInfo />}
          </>
        )}
      </div>
    </MobileLayout>
  );
};

function App() {
  return (
    <SleepProvider>
      <div className="min-h-screen flex items-center justify-center font-sans antialiased p-4">
        <AppContent />
      </div>
    </SleepProvider>
  );
}

export default App;
