import React, { useState } from 'react';
import { useSleep } from '../context/SleepContext';
import { User, Lock, Mail, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const { signup, setAppMode } = useSleep();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Male');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    signup(name, email, password, birthDate, gender);
  };

  return (
    <div className="w-full max-w-md p-8">
      <button
        onClick={() => setAppMode('login')}
        className="mb-8 p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">회원가입</h1>
        <p className="text-slate-400">
          SleepGuard와 함께 건강한 수면을 시작하세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* 이름 */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-navy-light text-white pl-12 pr-4 py-4 rounded-2xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

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
              className="w-full bg-navy-light text-white pl-12 pr-4 py-4 rounded-2xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-navy-light text-white pl-12 pr-4 py-4 rounded-2xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* 생년월일 / 성별 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 생년월일 */}
            <div className="relative">
              <label className="text-gray-300 text-xs absolute left-4 top-2">
                생년월일
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-navy-light text-white px-4 pt-7 pb-3 rounded-2xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                required
              />
            </div>

            {/* 성별 */}
            <div className="relative">
              <label className="text-gray-300 text-xs absolute left-4 top-2">
                성별
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-navy-light text-white px-4 pt-7 pb-3 rounded-2xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm appearance-none"
              >
                <option value="Male">남성</option>
                <option value="Female">여성</option>
                <option value="Other">기타</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
        >
          가입하기
        </button>
      </form>
    </div>
  );
};

export default Signup;
