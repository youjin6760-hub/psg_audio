import React, { useEffect } from 'react';
import { useSleep } from '../context/SleepContext';
import loginLogo from '../assets/login_logo.png';

const SplashScreen = () => {
  const { setAppMode } = useSleep();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppMode('login');
    }, 2000); // 2초 후 로그인 화면으로 전환

    return () => clearTimeout(timer);
  }, [setAppMode]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0A1628] animate-fade-in">
      <img
        src={loginLogo}
        alt="SleepGuard Logo"
        className="w-48 h-48 object-contain animate-pulse-slow"
      />
    </div>
  );
};

export default SplashScreen;
