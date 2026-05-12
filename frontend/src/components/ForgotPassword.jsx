import React, { useState } from 'react';
import { useSleep } from '../context/SleepContext';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const { setAppMode } = useSleep();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
      setAppMode('login');
    }
  };

  return (
    <div className="w-full max-w-md h-full flex flex-col p-6">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setAppMode('login')}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">비밀번호 찾기</h1>
      </header>

      <div className="flex items-center justify-center mb-8">
        <div className="p-6 rounded-full bg-blue-500/20 shadow-lg shadow-black/20">
          <Mail className="w-16 h-16 text-blue-400" />
        </div>
      </div>

      <p className="text-slate-300 text-center mb-8 leading-relaxed">
        가입하신 이메일 주소를 입력해주세요.<br />
        비밀번호 재설정 링크를 보내드립니다.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="w-full bg-navy-light border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div className="mt-auto">
          <button
            type="submit"
            disabled={!email}
            className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] ${email
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
          >
            전송하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
