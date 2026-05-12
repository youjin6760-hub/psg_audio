import React from 'react';
import { useSleep } from '../context/SleepContext';
import { Moon, BarChart2, Settings as SettingsIcon, Play, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, setAppMode, startSleeping } = useSleep();

  return (
    <div className="w-full max-w-md h-full flex flex-col p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            안녕하세요, {user?.name}님
          </h1>
          <p className="text-slate-400">오늘도 꿀잠 주무세요 🌙</p>
        </div>
        <button
          onClick={() => setAppMode('settings')}
          className="p-2 bg-navy-light rounded-xl text-slate-300 hover:text-white transition-colors"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 space-y-6">
        {/* Last Sleep Card */}
        <div className="bg-navy-light p-6 rounded-3xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-medium">지난 수면</h3>
            <span className="text-sm text-slate-500">어제</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-white">85</span>
            <span className="text-lg text-slate-400 mb-1">점</span>
          </div>
          <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[85%] rounded-full" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setAppMode('check')}
            className="bg-blue-600 hover:bg-blue-500 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 group"
          >
            <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
            <span className="text-white font-bold">수면 시작</span>
          </button>

          <button
            onClick={() => setAppMode('report')}
            className="bg-navy-light hover:bg-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 border border-slate-700/50 transition-all active:scale-[0.98]"
          >
            <div className="p-3 bg-slate-700/50 rounded-full">
              <BarChart2 className="w-8 h-8 text-blue-400" />
            </div>
            <span className="text-slate-300 font-medium">리포트</span>
          </button>
        </div>

        {/* Tips or Info */}
        <div className="bg-navy-light p-6 rounded-3xl border border-slate-700/50 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl">
            <Moon className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">수면 팁</h4>
            <p className="text-sm text-slate-400">
              취침 1시간 전에는 스마트폰 사용을 줄이세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
