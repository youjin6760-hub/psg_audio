// import React, { createContext, useContext, useState, useEffect } from 'react';

// const SleepContext = createContext();
// export const useSleep = () => useContext(SleepContext);


// export const SleepProvider = ({ children }) => {
//   const [sleepSchedule, setSleepSchedule] = useState({
//     start: '23:00',
//     end: '07:00'
//   });

//   // Sleep Prompt State
//   const [showSleepPrompt, setShowSleepPrompt] = useState(false);
//   const [isSleepScheduled, setIsSleepScheduled] = useState(false);
//   const [countdown, setCountdown] = useState(null);
//   const [promptShown, setPromptShown] = useState(false);
//   const [countdownInterval, setCountdownInterval] = useState(null);

//   // Auth State
//   const [user, setUser] = useState(null);
//   const [isFirstTime, setIsFirstTime] = useState(false);
//   const [registeredUsers, setRegisteredUsers] = useState([]);

//   const login = (email, password) => {
//     const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

//     if (foundUser) {
//       setUser(foundUser);
//       setProfile({
//         name: foundUser.name,
//         birthDate: foundUser.birthDate,
//         gender: foundUser.gender,
//         age: calculateAge(foundUser.birthDate)
//       });

//       if (foundUser.hasCompletedOnboarding) {
//         setIsFirstTime(false);
//         setAppMode('report');
//       } else {
//         setIsFirstTime(true); // Treat as first time to show onboarding flow
//         setAppMode('sleep-settings');
//       }
//     } else {
//       alert('이메일 또는 비밀번호가 올바르지 않습니다.');
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setAppMode('login');
//     setIsFirstTime(false);
//   };

//   const signup = (name, email, password, birthDate, gender) => {
//     const newUser = {
//       id: Date.now().toString(),
//       name,
//       email,
//       password,
//       birthDate,
//       gender,
//       hasCompletedOnboarding: false
//     };
//     setRegisteredUsers(prev => [...prev, newUser]);
//     setIsFirstTime(true);
//     setAppMode('login');
//   };

//   const completeOnboarding = () => {
//     if (user) {
//       const updatedUser = { ...user, hasCompletedOnboarding: true };
//       setUser(updatedUser);
//       setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
//     }
//     setIsFirstTime(false);
//     setAppMode('report');
//   };

//   const calculateAge = (birthDate) => {
//     if (!birthDate) return 0;

//     const today = new Date();
//     const birth = new Date(birthDate);

//     if (isNaN(birth.getTime())) return 0;

//     let age = today.getFullYear() - birth.getFullYear();
//     const monthDiff = today.getMonth() - birth.getMonth();

//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
//       age--;
//     }

//     return age;
//   };

//   // Settings State
//   const [wakeUpEnabled, setWakeUpEnabled] = useState(true);
//   const [alarmEnabled, setAlarmEnabled] = useState(true);
//   const [wakeUpTypes, setWakeUpTypes] = useState(['Central Apnea', 'Obstructive Apnea']);
//   const [profile, setProfile] = useState({
//     name: '',
//     age: 0,
//     gender: '',
//     birthDate: ''
//   });

//   const [appMode, setAppMode] = useState('splash');

//   const [isSleeping, setIsSleeping] = useState(false);
//   const [detectionLog, setDetectionLog] = useState([]);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);

//   const startSleeping = () => {
//     setIsSleeping(true);
//     setStartTime(new Date());
//     setDetectionLog([]);
//     setAppMode('detecting');
//   };

//   const stopSleeping = () => {
//     setIsSleeping(false);
//     setEndTime(new Date());
//     setAppMode('report');
//   };

//   const addDetectionEvent = (type) => {
//     setDetectionLog(prev => [...prev, {
//       timestamp: new Date(),
//       type: type
//     }]);
//   };

//   // Splash screen timer
//   useEffect(() => {
//     if (appMode === 'splash') {
//       const timer = setTimeout(() => {
//         setAppMode('login');
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [appMode]);

//   // Reset promptShown when sleep schedule changes
//   useEffect(() => {
//     setPromptShown(false);
//   }, [sleepSchedule]);

//   // Check for sleep time
//   useEffect(() => {
//     // Don't show prompt if user is in settings or already detecting/sleeping
//     if (!user || isSleepScheduled || appMode === 'detecting' || appMode === 'sleep-settings' || promptShown) return;

//     const checkTime = () => {
//       const now = new Date();
//       const [scheduleHour, scheduleMin] = sleepSchedule.start.split(':').map(Number);

//       let targetTime = new Date();
//       targetTime.setHours(scheduleHour, scheduleMin, 0, 0);

//       // Calculate difference in minutes from now to target time
//       let diffMs = targetTime.getTime() - now.getTime();

//       if (diffMs < -1000 * 60 * 60 * 12) { // If passed by more than 12 hours, assume tomorrow
//         targetTime.setDate(targetTime.getDate() + 1);
//         diffMs = targetTime.getTime() - now.getTime();
//       } else if (diffMs < 0 && diffMs > -1000 * 60 * 10) {
//         // If passed by less than 10 minutes, it's just passed. Don't add day.
//       } else if (diffMs < 0) {
//         targetTime.setDate(targetTime.getDate() + 1);
//         diffMs = targetTime.getTime() - now.getTime();
//       }

//       const diffMinutes = Math.floor(diffMs / 1000 / 60);

//       console.log(`Time until sleep: ${diffMinutes} minutes, promptShown: ${promptShown}`);

//       // Show prompt between 4m 50s and 5m before sleep
//       // 4m 50s = 290,000 ms
//       // 5m 0s = 300,000 ms
//       // 5분전 알림 설정
//       // if (diffMs >= 290000 && diffMs <= 300000 && !promptShown) {
//       //   console.log('Showing sleep prompt!');
//       //   setShowSleepPrompt(true);
//       //   setPromptShown(true);
//       // }
//     };

//     const timer = setInterval(checkTime, 1000);
//     return () => clearInterval(timer);
//   }, [sleepSchedule, user, isSleepScheduled, appMode, promptShown]);

//   const handleSleepPromptResponse = (response, startNow = false) => {
//     setShowSleepPrompt(false);

//     if (startNow) {
//       startSleeping();
//       setIsSleepScheduled(false);
//       setPromptShown(true);
//       return;
//     }

//     if (response) {
//       setIsSleepScheduled(true);

//       const now = new Date();
//       const [scheduleHour, scheduleMin] = sleepSchedule.start.split(':').map(Number);

//       let targetTime = new Date();
//       targetTime.setHours(scheduleHour, scheduleMin, 0, 0); // Sleep time

//       if (targetTime < now) {
//         targetTime.setDate(targetTime.getDate() + 1);
//       }

//       const delayMs = targetTime.getTime() - now.getTime();
//       const totalSeconds = Math.floor(delayMs / 1000);

//       setCountdown(totalSeconds);

//       const interval = setInterval(() => {
//         setCountdown(prev => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             startSleeping();
//             setIsSleepScheduled(false);
//             setPromptShown(false);
//             return null;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       setCountdownInterval(interval);
//     }
//     // If NO, promptShown stays true (don't ask again)
//   };

//   const cancelCountdown = () => {
//     if (countdownInterval) {
//       clearInterval(countdownInterval);
//     }
//     setCountdown(null);
//     setIsSleepScheduled(false);
//     setPromptShown(true); // Prevent prompt from showing again after cancellation
//   };

//   return (
//     <SleepContext.Provider value={{
//       user,
//       login,
//       logout,
//       signup,
//       isFirstTime,
//       completeOnboarding,
//       wakeUpEnabled,
//       setWakeUpEnabled,
//       alarmEnabled,
//       setAlarmEnabled,
//       wakeUpTypes,
//       setWakeUpTypes,
//       profile,
//       setProfile,
//       sleepSchedule,
//       setSleepSchedule,
//       appMode,
//       setAppMode,
//       isSleeping,
//       startSleeping,
//       stopSleeping,
//       detectionLog,
//       addDetectionEvent,
//       startTime,
//       endTime,
//       showSleepPrompt,
//       handleSleepPromptResponse,
//       countdown,
//       cancelCountdown
//     }}>
//       {children}
//     </SleepContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const SleepContext = createContext();
export const useSleep = () => useContext(SleepContext);

const API_BASE_URL = 'http://127.0.0.1:8000'; // FastAPI 서버 주소에 맞게 수정

// ========================================
// [녹음-WAV 추가] Float32 → 16bit WAV 인코더
// ========================================
const encodeWAV = (samples, sampleRate) => {
  const numSamples = samples.length;
  const bytesPerSample = 2; // 16bit
  const blockAlign = bytesPerSample * 1; // mono

  const buffer = new ArrayBuffer(44 + numSamples * bytesPerSample);
  const view = new DataView(buffer);

  let offset = 0;
  const writeString = (s) => {
    for (let i = 0; i < s.length; i++) {
      view.setUint8(offset + i, s.charCodeAt(i));
    }
    offset += s.length;
  };

  // RIFF header
  writeString('RIFF');
  view.setUint32(offset, 36 + numSamples * bytesPerSample, true); offset += 4;
  writeString('WAVE');

  // fmt chunk
  writeString('fmt ');
  view.setUint32(offset, 16, true); offset += 4;   // Subchunk1Size
  view.setUint16(offset, 1, true); offset += 2;    // AudioFormat (1=PCM)
  view.setUint16(offset, 1, true); offset += 2;    // NumChannels (1=mono)
  view.setUint32(offset, sampleRate, true); offset += 4; // SampleRate
  view.setUint32(offset, sampleRate * bytesPerSample, true); offset += 4; // ByteRate
  view.setUint16(offset, blockAlign, true); offset += 2; // BlockAlign
  view.setUint16(offset, 16, true); offset += 2;   // BitsPerSample

  // data chunk
  writeString('data');
  view.setUint32(offset, numSamples * bytesPerSample, true); offset += 4;

  // PCM data (Float32 -> Int16)
  let index = offset;
  const volume = 32767;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(index, s * volume, true);
    index += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
};

export const SleepProvider = ({ children }) => {
  const [sleepSchedule, setSleepSchedule] = useState({
    start: '23:00',
    end: '07:00'
  });

  // Sleep Prompt State
  const [showSleepPrompt, setShowSleepPrompt] = useState(false);
  const [isSleepScheduled, setIsSleepScheduled] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [promptShown, setPromptShown] = useState(false);
  const [countdownInterval, setCountdownInterval] = useState(null);

  // Auth State
  const [user, setUser] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Settings State
  const [wakeUpEnabled, setWakeUpEnabled] = useState(true);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [wakeUpTypes, setWakeUpTypes] = useState(['Central Apnea', 'Obstructive Apnea']);
  const [profile, setProfile] = useState({
    name: '',
    age: 0,
    gender: '',
    birthDate: ''
  });

  const [appMode, setAppMode] = useState('splash');
  // const [appMode, setAppMode] = useState('detecting');

  const [isSleeping, setIsSleeping] = useState(false);
  const [detectionLog, setDetectionLog] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [analysisStartTime, setAnalysisStartTime] = useState(null); // [추가] 분석 시작 시간(수면 시작 1시간 후 기준)

  // -----------------------------
  // 알람 상태 / 알람 사운드
  // -----------------------------
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  // const alarmAudioRef = useRef(null);
  const lastAlarmKeyRef = useRef(null); // 하루에 한 번만 울리도록 키 저장

  // 기상 알람 소리
  const wakeAlarmAudioRef = useRef(null);
  // 각성 알람 소리
  const arousalAlarmAudioRef = useRef(null);
  // 알람이 울리는 이유 ('wake-up' | 'arousal')
  const [alarmReason, setAlarmReason] = useState(null);

  // -----------------------------
  // [녹음-WAV 추가] 업로드 인터벌 ref
  // -----------------------------
  const uploadIntervalRef = useRef(null);

  // ========================================
  // [녹음-WAV 추가] 마이크 / 오디오 컨텍스트 ref
  // ========================================
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const processorNodeRef = useRef(null);
  const streamRef = useRef(null);
  const pcmChunksRef = useRef([]);
  const isRecordingRef = useRef(false);

  // ============================
  // [추가] sleep_report 조회 + analysisDuration 제공
  // ============================
  const [sleepReport, setSleepReport] = useState(null);
  const [analysisDuration, setAnalysisDuration] = useState('0분');

  // 일주일 AHI 그래프
  const [weeklyReports, setWeeklyReports] = useState([]);

  // 분석(업로드) 시작 지연 타이머
  const analysisStartTimeoutRef = useRef(null);

  // stop 했는데도 타이머가 늦게 실행되는 것 방지용
  const isSleepingRef = useRef(false);

  // SleepContext 내부 state 추가
  const [currentStatus, setCurrentStatus] = useState('Normal');
  const [isAlerting, setIsAlerting] = useState(false);

  const [redirectAfterSleepSettings, setRedirectAfterSleepSettings] = useState(false);

  // label -> status 매핑 함수 (백엔드 규칙에 맞게 조정)
  const labelToStatus = (label) => {
    const map = {
      0: 'Normal',
      1: 'Hypopnea',
      2: 'Mixed Apnea',
      3: 'Obstructive Apnea',
    };
    return map[label] ?? 'Normal';
  };

  const updateLiveStatus = useCallback((nextStatus) => {
    const s = nextStatus || 'Normal';
    setCurrentStatus(s);
    setIsAlerting(s !== 'Normal');
  }, []);



  // ----------------- 유틸: 나이 계산 -----------------
  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;

    const today = new Date();
    const birth = new Date(birthDate);

    if (isNaN(birth.getTime())) return 0;

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const formatDuration = (t) => {
    if (!t) return '0분';
    // "HH:MM:SS" 예상
    const parts = String(t).split(':').map(Number);
    if (parts.length < 2 || parts.some(Number.isNaN)) return '0분';
    const [hh, mm, ss = 0] = parts;

    if (hh > 0 && mm > 0) return `${hh}시간 ${mm}분`;
    if (hh > 0) return `${hh}시간`;
    return `${mm}분`;
  };

  // (선택) 리포트가 없을 때 fallback(기존 프론트 계산 로직)
  const computeFallbackAnalysisDuration = () => {
    const ONE_HOUR_MINUTES = 60;
    const ONE_HOUR_MS = ONE_HOUR_MINUTES * 60 * 1000;

    let totalMinutes = 0;

    if (startTime && endTime) {
      const analysisStartMs = startTime.getTime() + ONE_HOUR_MS;
      const diffMs = endTime.getTime() - analysisStartMs;
      totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
    } else if (sleepSchedule.start && sleepSchedule.end) {
      const [startHour, startMin] = sleepSchedule.start.split(':').map(Number);
      const [endHour, endMin] = sleepSchedule.end.split(':').map(Number);

      let duration = endHour * 60 + endMin - (startHour * 60 + startMin);
      if (duration < 0) duration += 24 * 60;

      duration = duration - ONE_HOUR_MINUTES;
      if (duration < 0) duration = 0;

      totalMinutes = duration;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) return `${hours}시간 ${minutes}분`;
    if (hours > 0) return `${hours}시간`;
    return `${minutes}분`;
  };


  // 날짜 유틸 (로컬 기준 YYYY-MM-DD)
  const toYMD = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // "HH:MM:SS" -> hours
  const parseDurationHours = (t) => {
    if (!t || typeof t !== 'string') return 0;
    const parts = t.split(':').map(Number);
    if (parts.length < 2 || parts.some(Number.isNaN)) return 0;
    const [hh, mm, ss = 0] = parts;
    return hh + mm / 60 + ss / 3600;
  };

  // AHI 계산 (DB 기반)
  const calcAhiFromReport = (r) => {
    if (!r) return 0;
    const total =
      (r.apnea_level_1 ?? 0) +
      (r.apnea_level_2 ?? 0) +
      (r.apnea_level_3 ?? 0);

    const hours = parseDurationHours(r.sleep_analysis_time);
    return hours > 0 ? total / hours : 0;
  };

  // ----------------- 설정 불러오기 / 저장용 함수들 -----------------

  // [추가] 서버에서 User_Setting 불러오기 (로그인 직후 사용)
  const loadUserSettings = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}/settings`);
      if (!res.ok) {
        console.error('Failed to load user settings');
        return;
      }
      const data = await res.json();

      // 백엔드 응답: sleep_time "HH:MM", wake_up_time "HH:MM"
      setSleepSchedule({
        start: data.sleep_time || '23:00',
        end: data.wake_up_time || '07:00',
      });
      setWakeUpEnabled(!!data.is_awake_check_enabled);
      setAlarmEnabled(!!data.is_alarm_enabled);
    } catch (err) {
      console.error('loadUserSettings error:', err);
    }
  };

  // [추가] SleepSettings에서 "저장하기" 눌렀을 때 호출할 함수
  // 현재 sleepSchedule 상태를 DB에 반영
  const saveSleepSchedule = async () => {
    if (!user) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      return false;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users/${user.user_id}/sleep-schedule`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sleep_time: sleepSchedule.start, // "23:00"
            wake_up_time: sleepSchedule.end, // "07:00"
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('saveSleepSchedule error:', errData);
        alert(errData.detail || '수면 패턴 저장에 실패했습니다.');
        return false;
      }

      // 필요하다면 응답값으로 상태 다시 동기화
      const data = await res.json();
      // data.sleep_time, data.wake_up_time, data.is_awake_check_enabled, data.is_alarm_enabled 등

      return true;
    } catch (err) {
      console.error('saveSleepSchedule error:', err);
      alert('수면 패턴 저장 중 오류가 발생했습니다.');
      return false;
    }
  };

  // [추가] Settings 화면에서 각성/알람 토글 변경 시 서버 동기화
  const updateToggleSettings = async (nextWakeUpEnabled, nextAlarmEnabled) => {
    if (!user) {
      // 로그인 안 된 상태에서는 로컬 상태만 변경
      setWakeUpEnabled(nextWakeUpEnabled);
      setAlarmEnabled(nextAlarmEnabled);
      return;
    }

    // 먼저 로컬 UI 상태 반영
    setWakeUpEnabled(nextWakeUpEnabled);
    setAlarmEnabled(nextAlarmEnabled);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users/${user.user_id}/settings`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            is_awake_check_enabled: nextWakeUpEnabled,
            is_alarm_enabled: nextAlarmEnabled,
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('updateToggleSettings error:', errData);
        alert(errData.detail || '알림 설정 저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('updateToggleSettings error:', err);
      alert('알림 설정 저장 중 오류가 발생했습니다.');
    }
  };


  // ============================
  // [새로 추가] 프로필 업데이트 API 연동
  // ============================
  const updateUserProfile = async (newProfile) => { // [추가]
    if (!user) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      return false;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users/${user.user_id}/profile`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newProfile.name,
            birthDate: newProfile.birthDate || null,
            gender: newProfile.gender || null,
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('updateUserProfile error:', errData);
        alert(errData.detail || '프로필 저장에 실패했습니다.');
        return false;
      }

      // 백엔드에서 최신 프로필 재조회한 값 반환:
      // { user_id, name, email, birthDate, gender, age }
      const updated = await res.json();

      // Context의 profile 갱신
      setProfile({
        name: updated.name,
        birthDate: updated.birthDate || '',
        gender: updated.gender || '',
        age:
          typeof updated.age === 'number'
            ? updated.age
            : calculateAge(updated.birthDate || ''),
      });

      // user 상태도 이름/성별/생년월일 반영
      setUser((prev) =>
        prev
          ? {
            ...prev,
            name: updated.name,
            gender: updated.gender,
            // 백엔드 login 응답은 birth_date 필드를 쓰므로 최대한 맞춰줌
            birth_date: updated.birthDate || prev.birth_date,
          }
          : prev
      );

      return true;
    } catch (err) {
      console.error('updateUserProfile error:', err);
      alert('프로필 저장 중 오류가 발생했습니다.');
      return false;
    }
  };


  // ============================
  // [녹음-WAV 추가] 10초 녹음 → WAV → /upload-audio 업로드
  // ============================
  const record10SecAndUpload = async () => {
    if (!user) {
      alert('로그인 후 이용해 주세요.');
      return;
    }
    if (isRecordingRef.current) {
      console.warn('이미 녹음 중입니다.');
      return;
    }

    try {
      // 1) 마이크 권한 및 스트림
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceNodeRef.current = source;

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processor;

      pcmChunksRef.current = [];
      isRecordingRef.current = true;

      processor.onaudioprocess = (e) => {
        if (!isRecordingRef.current) return;
        const input = e.inputBuffer.getChannelData(0);
        // 복사해서 저장 (원본 버퍼는 재사용됨)
        pcmChunksRef.current.push(new Float32Array(input));
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

      // 2) 10초 뒤 녹음 종료 & 업로드
      await new Promise((resolve) => setTimeout(resolve, 10_000));

      isRecordingRef.current = false;

      // 연결 해제 및 스트림 종료
      processor.disconnect();
      source.disconnect();
      stream.getTracks().forEach((t) => t.stop());
      const sampleRate = audioCtx.sampleRate || 44100;
      await audioCtx.close();

      // 3) PCM 조각 합치기
      const chunks = pcmChunksRef.current;
      const totalLen = chunks.reduce((sum, arr) => sum + arr.length, 0);
      const merged = new Float32Array(totalLen);
      let offset = 0;
      for (const arr of chunks) {
        merged.set(arr, offset);
        offset += arr.length;
      }

      // 4) WAV 인코딩
      const wavBlob = encodeWAV(merged, sampleRate);

      // 5) 백엔드로 업로드 (파일명 확장자를 .wav 로!)
      const formData = new FormData();
      formData.append(
        'file',
        wavBlob,
        `chunk_${Date.now()}.wav`
      );

      const res = await fetch(
        `${API_BASE_URL}/upload-audio?user_id=${user.user_id}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('record10SecAndUpload error:', errData);
        alert(errData.detail || '녹음 데이터 전송에 실패했습니다.');
        return;
      }

      const data = await res.json();
      console.log('upload-audio response:', data);

      // ✅ 여기(바로 이 아래)에 추가
      let next = 'Normal';

      if (typeof data.label_name === 'string' && data.label_name.trim()) {
        next = data.label_name.trim();
      } else if (typeof data.label === 'number') {
        next = labelToStatus(data.label);
      }

      // 이미 만들어두신 함수/상태 업데이트
      updateLiveStatus(next);

      // 필요하다면 여기서 label을 보고 detectionLog에 반영할 수도 있음
      // 예: if (data.label !== 0) addDetectionEvent(data.label_name);

    } catch (err) {
      console.error('record10SecAndUpload error:', err);
      alert('녹음 중 오류가 발생했습니다.');
      isRecordingRef.current = false;

      // 에러 시 리소스 정리
      try {
        if (processorNodeRef.current) processorNodeRef.current.disconnect();
        if (sourceNodeRef.current) sourceNodeRef.current.disconnect();
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      } catch (e) {
        console.error('cleanup error:', e);
      }
    }
  };

  // ============================
  // [녹음-WAV 추가] 반복 업로드용 함수들
  // ============================
  const startStreamingAudio = () => {
    if (uploadIntervalRef.current) return; // 이미 돌고 있으면 무시

    // 즉시 한 번 실행
    record10SecAndUpload();

    // 이후 10초마다 실행
    uploadIntervalRef.current = setInterval(() => {
      record10SecAndUpload();
    }, 10_000);
  };

  const stopStreamingAudio = () => {
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }
    isRecordingRef.current = false; // 녹음 플래그도 정리
  };

  // loadSleepReport를 useCallback으로 고정 (중요)
  // const loadSleepReport = useCallback(async (userId, date = null) => {
  //   if (!userId) return;

  //   const qs = new URLSearchParams({ user_id: String(userId) });
  //   if (date) qs.set('date', date);

  //   const res = await fetch(`${API_BASE_URL}/predict?${qs.toString()}`);
  //   const data = await res.json();

  //   if (data.status === 'ok') {
  //     setSleepReport(data);
  //     setAnalysisDuration(formatDuration(data.sleep_analysis_time));
  //     // 현재 상태 업데이트
  //     let next = 'Normal';

  //     if (typeof data.label_name === 'string' && data.label_name.trim()) {
  //       next = data.label_name.trim();
  //     } else if (typeof data.label === 'number') {
  //       next = labelToStatus(data.label);
  //     }

  //     setCurrentStatus(next);
  //     setIsAlerting(next !== 'Normal');
  //   } else {
  //     setSleepReport(null);
  //     setAnalysisDuration(computeFallbackAnalysisDuration());
  //     // 실패 시 기본값
  //     setCurrentStatus('Normal');
  //     setIsAlerting(false);
  //   }
  // }, []);

  const loadSleepReport = useCallback(async (userId, date = null) => {
    if (!userId) return;

    const qs = new URLSearchParams({ user_id: String(userId) });
    if (date) qs.set('date', date);

    const res = await fetch(`${API_BASE_URL}/predict?${qs.toString()}`);
    const data = await res.json();

    if (data.status === 'ok') {
      setSleepReport(data);
      setAnalysisDuration(formatDuration(data.sleep_analysis_time));

      let next = 'Normal';
      if (typeof data.label_name === 'string' && data.label_name.trim()) {
        next = data.label_name.trim();
      } else if (typeof data.label === 'number') {
        next = labelToStatus(data.label);
      }

      updateLiveStatus(next);
    } else {
      setSleepReport(null);
      setAnalysisDuration('0분');
      updateLiveStatus('Normal');
    }
  }, [updateLiveStatus]);


  const loadWeeklyReports = useCallback(async (userId) => {
    if (!userId) return;

    try {
      const days = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(toYMD(d));
      }

      const results = await Promise.all(
        days.map(async (date) => {
          const qs = new URLSearchParams({ user_id: String(userId), date });
          const res = await fetch(`${API_BASE_URL}/predict?${qs.toString()}`);
          const data = await res.json();
          if (data?.status !== 'ok') return { date, ahi: 0, raw: null };
          return { date, ahi: calcAhiFromReport(data), raw: data };
        })
      );

      setWeeklyReports(results);
    } catch (e) {
      console.error('loadWeeklyReports error:', e);
      setWeeklyReports([]);
    }
  }, []);


  // ----------------- Auth: 로그인 / 로그아웃 / 회원가입 -----------------

  // 로그인 (백엔드 연동)
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || '로그인에 실패했습니다.');
        return false;
      }

      const data = await res.json();
      const foundUser = data.user;

      // 백엔드에서 내려주는 필드 이름에 맞게 매핑
      const birth = foundUser.birth_date || foundUser.birthDate || '';
      const gender = foundUser.gender || '';

      setUser(foundUser);
      setProfile({
        name: foundUser.name,
        birthDate: birth,
        gender: gender,
        age: calculateAge(birth)
      });


      // [추가] 로그인 후 DB에 저장된 수면 설정 불러오기
      await loadUserSettings(foundUser.user_id);

      const hasCompleted =
        foundUser.hasCompletedOnboarding !== undefined
          ? foundUser.hasCompletedOnboarding
          : false;

      if (hasCompleted) {
        setIsFirstTime(false);
        setAppMode('report');
      } else {
        setIsFirstTime(true);
        setAppMode('sleep-settings');
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
      return false;
    }
  };

  // const logout = () => {
  //   setUser(null);
  //   setAppMode('login');
  //   setIsFirstTime(false);
  //   setProfile({
  //     name: '',
  //     age: 0,
  //     gender: '',
  //     birthDate: ''
  //   });
  // };

  const logout = () => {
    // 필요한 정리만 하고
    try {
      // 업로드/타이머 중지
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
        uploadIntervalRef.current = null;
      }
      isRecordingRef.current = false;

      if (analysisStartTimeoutRef.current) {
        clearTimeout(analysisStartTimeoutRef.current);
        analysisStartTimeoutRef.current = null;
      }

      // 알람 정지
      if (wakeAlarmAudioRef.current) {
        wakeAlarmAudioRef.current.pause();
        wakeAlarmAudioRef.current.currentTime = 0;
      }
      if (arousalAlarmAudioRef.current) {
        arousalAlarmAudioRef.current.pause();
        arousalAlarmAudioRef.current.currentTime = 0;
      }

      // 마이크/오디오 종료(가능하면)
      if (processorNodeRef.current) processorNodeRef.current.disconnect();
      if (sourceNodeRef.current) sourceNodeRef.current.disconnect();
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    } catch (e) {
      console.error('logout cleanup error:', e);
    }

    // state 변경 없이 바로 새로고침 (깜빡임 최소화)
    window.location.reload();
  };

  // 회원가입 (백엔드 연동)
  const signup = async (name, email, password, birthDate, gender) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          birth_date: birthDate, // FastAPI에서 받는 필드 이름
          gender
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || '회원가입에 실패했습니다.');
        return false;
      }

      await res.json(); // 필요하면 data.user 등을 받아서 사용

      // 이전과 동일하게: 회원가입 후 로그인 화면으로
      alert('회원가입이 완료되었습니다!');
      setIsFirstTime(true); // 다음 로그인 때 온보딩 태우고 싶으면 유지
      setAppMode('login');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
      return false;
    }
  };

  // 온보딩 완료 시: User_Setting 저장 + has_completed_onboarding = 1
  const completeOnboarding = async () => {
    if (!user) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/user-setting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id, // 백엔드에서 내려준 PK
          sleep_time: sleepSchedule.start, // "23:00"
          wake_up_time: sleepSchedule.end, // "07:00"
          is_awake_check_enabled: wakeUpEnabled,
          is_alarm_enabled: alarmEnabled,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to save user setting:', errorData);
        alert(errorData.detail || '사용자 설정 저장에 실패했습니다.');
        return;
      }

      // 서버 저장 성공 → 온보딩 완료 상태로 전환
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      setUser(updatedUser);
      setIsFirstTime(false);
      setAppMode('report');
    } catch (error) {
      console.error('completeOnboarding error:', error);
      alert('설정을 저장하는 중 오류가 발생했습니다.');
    }
  };


  // const completeOnboarding = () => {
  //   if (user) {
  //     const updatedUser = { ...user, hasCompletedOnboarding: true };
  //     setUser(updatedUser);
  //   }
  //   setIsFirstTime(false);
  //   setAppMode('report');
  // };

  // ----------------- 수면 관련 상태/함수 -----------------


  // const startSleeping = (baseTime = null) => {        // [추가] baseTime 인자 허용
  //   setIsSleeping(true);
  //   const start = baseTime || new Date();            // [추가] 지정 시간 또는 현재시간
  //   setStartTime(start);

  //   const analysisStart = new Date(                  // [추가] 분석 시작 시간(1시간 후)
  //     start.getTime() + 60 * 60 * 1000
  //   );
  //   setAnalysisStartTime(analysisStart);             // [추가]

  //   setDetectionLog([]);
  //   setAppMode('detecting');
  //   startStreamingAudio();   // [녹음-WAV 추가] 여기 한 줄
  // };

  const startSleeping = (baseTime = null, options = {}) => {
    // const { testDelay = false } = options; // 테스트 옵션

    setIsSleeping(true);
    isSleepingRef.current = true;

    const start = baseTime || new Date();
    setStartTime(start);

    // 지연시간: 실사용 1시간 / 테스트 5분
    // const delayMs = testDelay ? 5 * 60 * 1000 : 60 * 60 * 1000;
    const delayMs = 60 * 60 * 1000; // 1시간

    // 분석 시작 시각(표시/필터링에도 사용 가능)
    const analysisStart = new Date(start.getTime() + delayMs);
    setAnalysisStartTime(analysisStart);

    setDetectionLog([]);
    setAppMode('detecting');

    // 혹시 이전 타이머가 남아있다면 제거
    if (analysisStartTimeoutRef.current) {
      clearTimeout(analysisStartTimeoutRef.current);
      analysisStartTimeoutRef.current = null;
    }

    // delayMs 후에 /upload-audio 업로드 시작
    analysisStartTimeoutRef.current = setTimeout(() => {
      if (!isSleepingRef.current) return; // 중간에 stop 누르면 시작 안 함
      startStreamingAudio();               // 여기서부터 10초마다 /upload-audio
    }, delayMs);
  };

  // const startSleeping = () => {
  //   setIsSleeping(true);
  //   setStartTime(new Date());
  //   setDetectionLog([]);
  //   setAppMode('detecting');
  // };

  // const stopSleeping = () => {
  //   setIsSleeping(false);
  //   setEndTime(new Date());
  //   setAppMode('report');
  //   stopStreamingAudio();    // [녹음-WAV 추가] 여기 한 줄
  // };

  const stopSleeping = () => {
    setIsSleeping(false);
    isSleepingRef.current = false;

    setEndTime(new Date());
    setAppMode('report');

    // 타이머 정리 (아직 시작 전이면 업로드 자체가 안 됨)
    if (analysisStartTimeoutRef.current) {
      clearTimeout(analysisStartTimeoutRef.current);
      analysisStartTimeoutRef.current = null;
    }

    // 업로드 중이었다면 중지
    stopStreamingAudio();
    // 종료 시 상태 초기화
    updateLiveStatus('Normal');
  };

  // const addDetectionEvent = (type) => {
  //   setDetectionLog(prev => [
  //     ...prev,
  //     {
  //       timestamp: new Date(),
  //       type: type
  //     }
  //   ]);
  // };

  const addDetectionEvent = (type) => {
    const now = new Date();

    // [추가] 수면 시작 1시간이 지나기 전에는 이벤트 기록하지 않음
    if (!analysisStartTime || now < analysisStartTime) return;

    setDetectionLog((prev) => [
      ...prev,
      {
        timestamp: now,
        type,
      },
    ]);
  };

  // ----------------- useEffect: 스플래시, 프롬프트 등 -----------------

  // Splash screen timer
  useEffect(() => {
    if (appMode === 'splash') {
      const timer = setTimeout(() => {
        setAppMode('login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [appMode]);

  // // Reset promptShown when sleep schedule changes
  // useEffect(() => {
  //   setPromptShown(false);
  // }, [sleepSchedule]);

  // // Check for sleep time
  // useEffect(() => {
  //   // Don't show prompt if user is in settings or already detecting/sleeping
  //   if (!user || isSleepScheduled || appMode === 'detecting' || appMode === 'sleep-settings' || promptShown) return;

  //   const checkTime = () => {
  //     const now = new Date();
  //     const [scheduleHour, scheduleMin] = sleepSchedule.start.split(':').map(Number);

  //     let targetTime = new Date();
  //     targetTime.setHours(scheduleHour, scheduleMin, 0, 0);

  //     // Calculate difference in minutes from now to target time
  //     let diffMs = targetTime.getTime() - now.getTime();

  //     if (diffMs < -1000 * 60 * 60 * 12) { // If passed by more than 12 hours, assume tomorrow
  //       targetTime.setDate(targetTime.getDate() + 1);
  //       diffMs = targetTime.getTime() - now.getTime();
  //     } else if (diffMs < 0 && diffMs > -1000 * 60 * 10) {
  //       // If passed by less than 10 minutes, it's just passed. Don't add day.
  //     } else if (diffMs < 0) {
  //       targetTime.setDate(targetTime.getDate() + 1);
  //       diffMs = targetTime.getTime() - now.getTime();
  //     }

  //     const diffMinutes = Math.floor(diffMs / 1000 / 60);

  //     console.log(`Time until sleep: ${diffMinutes} minutes, promptShown: ${promptShown}`);

  //     // 5분 전에 프롬프트 (4분 50초 ~ 5분 사이)
  //     if (diffMs >= 290000 && diffMs <= 300000 && !promptShown) {
  //       console.log('Showing sleep prompt (5 minutes before)!');
  //       setShowSleepPrompt(true);
  //       setPromptShown(true);
  //     }
  //   };

  //   const timer = setInterval(checkTime, 1000);
  //   return () => clearInterval(timer);
  // }, [sleepSchedule, user, isSleepScheduled, appMode, promptShown]);

  // // -----------------------------
  // // 수면 패턴 변경 시 프롬프트 초기화
  // // -----------------------------
  // useEffect(() => {
  //   setPromptShown(false);
  // }, [sleepSchedule.start, sleepSchedule.end]);


  // 기상 시간(end)이 바뀌면, 오늘 다시 한 번 울릴 수 있도록 키 초기화
  useEffect(() => {
    lastAlarmKeyRef.current = null;
  }, [sleepSchedule.end]);


  // -----------------------------
  // 취침 5분 전 안내 팝업 로직
  // -----------------------------
  useEffect(() => {
    if (
      !user ||
      isSleepScheduled ||
      appMode === 'detecting' ||
      appMode === 'sleep-settings' ||
      promptShown
    ) {
      return;
    }

    const checkSleepPrompt = () => {
      const now = new Date();
      const [scheduleHour, scheduleMin] = sleepSchedule.start
        .split(':')
        .map(Number);

      let targetTime = new Date();
      targetTime.setHours(scheduleHour, scheduleMin, 0, 0);

      let diffMs = targetTime.getTime() - now.getTime();

      if (diffMs < -1000 * 60 * 60 * 12) {
        targetTime.setDate(targetTime.getDate() + 1);
        diffMs = targetTime.getTime() - now.getTime();
      } else if (diffMs < 0 && diffMs > -1000 * 60 * 10) {
        // 10분 이내 경과
      } else if (diffMs < 0) {
        targetTime.setDate(targetTime.getDate() + 1);
        diffMs = targetTime.getTime() - now.getTime();
      }

      if (diffMs >= 290000 && diffMs <= 300000 && !promptShown) {
        setShowSleepPrompt(true);
        setPromptShown(true);
      }
    };

    const timer = setInterval(checkSleepPrompt, 1000);
    return () => clearInterval(timer);
  }, [user, isSleepScheduled, appMode, promptShown, sleepSchedule.start]);


  // -----------------------------
  // [추가] 알람 사운드 초기화 (앱 로드 시 1회)
  // -----------------------------
  // useEffect(() => {
  //   const audio = new Audio(
  //     'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
  //   );
  //   audio.loop = true;
  //   alarmAudioRef.current = audio;
  // }, []);

  useEffect(() => {
    // 기상 알람용
    const wakeAudio = new Audio(
      'https://assets.mixkit.co/active_storage/sfx/989/989-preview.mp3'      // ➜ 기상 알람용 소리
    );
    wakeAudio.loop = true;
    wakeAlarmAudioRef.current = wakeAudio;

    // 각성 알람용
    const arousalAudio = new Audio(
      'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'   // ➜ 각성 알람용 소리
    );
    arousalAudio.loop = true;
    arousalAlarmAudioRef.current = arousalAudio;
  }, []);

  // -----------------------------
  // [추가] 기상 알람: 매일 지정된 시간에 울리기
  // -----------------------------
  // useEffect(() => {
  //   if (!user) return;
  //   if (!alarmEnabled) return;

  //   const checkAlarm = () => {
  //     const now = new Date();
  //     const [endHour, endMin] = sleepSchedule.end.split(':').map(Number);

  //     if (Number.isNaN(endHour) || Number.isNaN(endMin)) return;

  //     if (now.getHours() === endHour && now.getMinutes() === endMin) {
  //       const key = `${now.getFullYear()}-${now.getMonth() + 1
  //         }-${now.getDate()}-${endHour}:${endMin}`;

  //       // 오늘 이미 울렸으면 재울림 방지
  //       if (lastAlarmKeyRef.current === key) return;
  //       lastAlarmKeyRef.current = key;

  //       if (!isAlarmRinging) {
  //         setIsAlarmRinging(true);
  //         if (alarmAudioRef.current) {
  //           alarmAudioRef.current.currentTime = 0;
  //           alarmAudioRef.current
  //             .play()
  //             .catch((e) => console.error('알람 재생 실패:', e));
  //         }
  //       }
  //     }
  //   };

  //   const timer = setInterval(checkAlarm, 1000);
  //   return () => clearInterval(timer);
  // }, [user, alarmEnabled, sleepSchedule.end, isAlarmRinging]);


  useEffect(() => {
    if (!user) return;
    if (!alarmEnabled) return;

    const checkAlarm = () => {
      const now = new Date();
      const [endHour, endMin] = sleepSchedule.end.split(':').map(Number);
      if (Number.isNaN(endHour) || Number.isNaN(endMin)) return;

      if (now.getHours() === endHour && now.getMinutes() === endMin) {
        const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${endHour}:${endMin}`;

        if (lastAlarmKeyRef.current === key) return;
        lastAlarmKeyRef.current = key;

        if (!isAlarmRinging) {
          setAlarmReason('wake-up');
          setIsAlarmRinging(true);

          if (wakeAlarmAudioRef.current) {
            wakeAlarmAudioRef.current.currentTime = 0;
            wakeAlarmAudioRef.current
              .play()
              .catch((e) => console.error('기상 알람 재생 실패:', e));
          }
        }
      }
    };

    const timer = setInterval(checkAlarm, 1000);
    return () => clearInterval(timer);
  }, [user, alarmEnabled, sleepSchedule.end, isAlarmRinging]);


  const handleSleepPromptResponse = (response, startNow = false) => {
    setShowSleepPrompt(false);

    if (startNow) {
      startSleeping(null, { testDelay: true });
      setIsSleepScheduled(false);
      setPromptShown(true);
      return;
    }

    if (response) {
      setIsSleepScheduled(true);

      const now = new Date();
      const [scheduleHour, scheduleMin] = sleepSchedule.start.split(':').map(Number);

      let targetTime = new Date();
      targetTime.setHours(scheduleHour, scheduleMin, 0, 0); // Sleep time

      if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const delayMs = targetTime.getTime() - now.getTime();
      const totalSeconds = Math.floor(delayMs / 1000);

      setCountdown(totalSeconds);

      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            startSleeping();
            setIsSleepScheduled(false);
            setPromptShown(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      setCountdownInterval(interval);
    }
    // If NO, promptShown stays true (don't ask again)
  };

  const cancelCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    setCountdown(null);
    setIsSleepScheduled(false);
    setPromptShown(true); // Prevent prompt from showing again after cancellation
  };

  // -----------------------------
  // [추가] 알람 정지 함수
  // -----------------------------
  // const stopAlarm = () => {
  //   setIsAlarmRinging(false);
  //   if (alarmAudioRef.current) {
  //     alarmAudioRef.current.pause();
  //     alarmAudioRef.current.currentTime = 0;
  //   }
  // };

  // ★ 수정된 stopAlarm
  const stopAlarm = () => {
    // 알람 이유를 먼저 저장해 두고
    const reason = alarmReason;

    setIsAlarmRinging(false);
    setAlarmReason(null);

    if (wakeAlarmAudioRef.current) {
      wakeAlarmAudioRef.current.pause();
      wakeAlarmAudioRef.current.currentTime = 0;
    }
    if (arousalAlarmAudioRef.current) {
      arousalAlarmAudioRef.current.pause();
      arousalAlarmAudioRef.current.currentTime = 0;
    }

    // ★ 기상 알람이었던 경우에만 수면을 종료하고 리포트 화면으로 이동
    if (reason === 'wake-up') {
      stopSleeping();  // isSleeping=false, endTime 설정, appMode='report'
    }
  };

  const triggerArousalAlarm = () => {
    if (!wakeUpEnabled) return;   // 각성 기능 OFF면 무시
    if (isAlarmRinging) return;   // 이미 알람 울리는 중이면 무시

    setAlarmReason('arousal');
    setIsAlarmRinging(true);

    if (arousalAlarmAudioRef.current) {
      arousalAlarmAudioRef.current.currentTime = 0;
      arousalAlarmAudioRef.current
        .play()
        .catch((e) => console.error('각성 알람 재생 실패:', e));
    }
  };

  return (
    <SleepContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        isFirstTime,
        completeOnboarding,
        wakeUpEnabled,
        setWakeUpEnabled,
        alarmEnabled,
        setAlarmEnabled,
        wakeUpTypes,
        setWakeUpTypes,
        profile,
        setProfile,
        sleepSchedule,
        setSleepSchedule,
        appMode,
        setAppMode,
        isSleeping,
        startSleeping,
        stopSleeping,
        detectionLog,
        addDetectionEvent,
        startTime,
        endTime,
        showSleepPrompt,
        handleSleepPromptResponse,
        countdown,
        cancelCountdown,
        redirectAfterSleepSettings,
        setRedirectAfterSleepSettings,

        currentStatus,
        isAlerting,
        // [추가] 알람 상태 제어
        isAlarmRinging,
        alarmReason,
        stopAlarm,
        triggerArousalAlarm,

        // [추가] 외부에서 사용할 수 있게 노출
        saveSleepSchedule,
        updateToggleSettings,

        // [추가] 프로필 업데이트 함수 노출
        updateUserProfile,

        record10SecAndUpload,
        startStreamingAudio,   // [선택]
        stopStreamingAudio,    // [선택]

        sleepReport,
        analysisDuration,
        loadSleepReport,

        weeklyReports,
        loadWeeklyReports,
      }}
    >
      {children}
    </SleepContext.Provider>
  );
};

