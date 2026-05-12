import React, { useState } from 'react';
import { useSleep } from '../context/SleepContext';
import {
  ArrowLeft,
  User,
  Bell,
  Moon,
  Info,
  LogOut,
  ChevronRight,
  AlarmClock,
} from 'lucide-react';

const Settings = () => {
  const {
    setAppMode,
    logout,
    profile,
    wakeUpEnabled,
    alarmEnabled,
    updateToggleSettings, // 각성 알림 / 기상 알람 토글을 서버와 함께 업데이트
    updateUserProfile,   // 프로필 수정 내용을 서버와 함께 업데이트
  } = useSleep();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile });

  // 프로필 저장 시 -> 백엔드 + Context 업데이트
  const handleSaveProfile = async () => {
    const success = await updateUserProfile(tempProfile);
    if (success) {
      setIsEditingProfile(false);
    }
  };

  // ===== 프로필 편집 화면 =====
  if (isEditingProfile) {
    return (
      <div className="w-full max-w-md h-full flex flex-col p-6">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setIsEditingProfile(false)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">프로필 수정</h1>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">이름</label>
            <input
              type="text"
              value={tempProfile.name}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, name: e.target.value })
              }
              className="w-full bg-navy-light text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">생년월일</label>
            <input
              type="date"
              value={tempProfile.birthDate || ''}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, birthDate: e.target.value })
              }
              className="w-full bg-navy-light text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">성별</label>
            <select
              value={tempProfile.gender}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, gender: e.target.value })
              }
              className="w-full bg-navy-light text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none"
            >
              <option value="Male">남성</option>
              <option value="Female">여성</option>
              <option value="Other">기타</option>
            </select>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl mt-8"
          >
            저장하기
          </button>
        </div>
      </div>
    );
  }

  // ===== 기본 설정 화면 =====
  return (
    <div className="w-full max-w-md h-full flex flex-col p-6">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setAppMode('report')}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">설정</h1>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <section>
          <h2 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
            계정
          </h2>
          <div className="bg-navy-light rounded-2xl overflow-hidden border border-slate-700/50">
            <button
              onClick={() => {
                // 프로필 수정 들어갈 때, 최신 profile 값으로 폼 초기화
                setTempProfile({ ...profile });
                setIsEditingProfile(true);
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{profile.name}</p>
                  <p className="text-xs text-slate-400">
                    {profile.gender === 'Male'
                      ? '남성'
                      : profile.gender === 'Female'
                        ? '여성'
                        : '기타'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </section>

        {/* Sleep Settings */}
        <section>
          <h2 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
            수면 & 알림
          </h2>
          <div className="bg-navy-light rounded-2xl overflow-hidden border border-slate-700/50 divide-y divide-slate-700/50">
            {/* 수면 패턴 설정 버튼 */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="text-white font-medium">수면 패턴 설정</span>
              </div>
              <button
                onClick={() => setAppMode('sleep-settings')}
                className="text-sm text-blue-400 font-medium"
              >
                변경
              </button>
            </div>

            {/* 각성 알림 설정 토글 */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium">각성 알림 설정</p>
                  <p className="text-xs text-slate-400">무호흡 감지 시 깨우기</p>
                </div>
              </div>
              <button
                onClick={() => updateToggleSettings(!wakeUpEnabled, alarmEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${wakeUpEnabled ? 'bg-green-500' : 'bg-slate-600'
                  }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${wakeUpEnabled ? 'left-6' : 'left-1'
                    }`}
                />
              </button>
            </div>

            {/* 기상 알람 설정 토글 */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                  <AlarmClock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium">기상 알람 설정</p>
                  <p className="text-xs text-slate-400">기상 시간 알람</p>
                </div>
              </div>
              <button
                onClick={() => updateToggleSettings(wakeUpEnabled, !alarmEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${alarmEnabled ? 'bg-green-500' : 'bg-slate-600'
                  }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${alarmEnabled ? 'left-6' : 'left-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* App Info */}
        <section>
          <h2 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
            앱 정보
          </h2>
          <div className="bg-navy-light rounded-2xl overflow-hidden border border-slate-700/50 divide-y divide-slate-700/50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-lg text-slate-400">
                  <Info className="w-5 h-5" />
                </div>
                <span className="text-white font-medium">버전 정보</span>
              </div>
              <span className="text-sm text-slate-500">v1.0.0</span>
            </div>
          </div>
        </section>

        {/* 로그아웃 */}
        <button
          onClick={logout}
          className="w-full p-4 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
