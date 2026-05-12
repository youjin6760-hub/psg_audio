import React, { useState } from 'react';
import { useSleep } from '../context/SleepContext';
import { Lock, Mail } from 'lucide-react';
import loginLogo from '../assets/login_logo.png';

const Login = () => {
  const { login, setAppMode } = useSleep();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="w-full max-w-md p-8">
      {/* 로고 / 타이틀 */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={loginLogo}
          alt="SleepGuard Logo"
          className="w-32 h-32 mb-4 object-contain"
        />
        <h1 className="text-3xl font-bold text-white mb-2">DeepSleep</h1>
        <p className="text-slate-400">수면 무호흡 모니터링</p>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* 이메일 */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-light text-white pl-12 pr-4 py-4 rounded-2xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-light text-white pl-12 pr-4 py-3 rounded-2xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* 로그인 상태 유지 */}
        {/* <div className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-700 bg-navy-light text-blue-600 focus:ring-blue-500/50"
          />
          로그인 상태 유지
        </div> */}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
        >
          로그인
        </button>

        {/* 아래 링크들 */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => setAppMode('forgot-password')}
            className="text-blue-400 hover:text-blue-300"
          >
            비밀번호 찾기
          </button>
          <span className="text-slate-700">|</span>
          <button
            type="button"
            onClick={() => setAppMode('signup')}
            className="text-blue-400 hover:text-blue-300"
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
