// import React, { useEffect, useState, useRef } from 'react'
// import { useSleep } from '../context/SleepContext';
// import { Activity, AlertTriangle, StopCircle, Bell } from 'lucide-react';

// const DetectionScreen = () => {
//   // console.log('🚨 DetectionScreen mounted');
//   // 지금은 stopSleeping만 사용 (시뮬 제거했으니 addDetectionEvent, wakeUpEnabled, wakeUpTypes 미사용)
//   const { stopSleeping, user } = useSleep();

//   const [currentStatus, setCurrentStatus] = useState('Normal');
//   const [isAlerting, setIsAlerting] = useState(false); // 향후 백엔드 예측 결과에 따라 true/false 설정 예정

//   // 녹음 관련 ref
//   const mediaRecorderRef = useRef(null);
//   const streamRef = useRef(null);

//   // --------------------------------------------------
//   // 1. 컴포넌트 마운트 시 녹음 시작 + 10초 단위로 업로드
//   // --------------------------------------------------
//   useEffect(() => {
//     let isCancelled = false;

//     const setupRecording = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         if (isCancelled) return;

//         streamRef.current = stream;
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = mediaRecorder;

//         // 10초마다 dataavailable 발생
//         mediaRecorder.ondataavailable = async (event) => {
//           if (event.data && event.data.size > 0) {
//             await sendAudioChunkToBackend(event.data);
//             // TODO: 여기서 백엔드의 예측 결과를 받아와서
//             // setCurrentStatus / setIsAlerting 등을 업데이트하면 됨.
//           }
//         };

//         // timeslice 10000ms → 10초 단위 청크
//         mediaRecorder.start(10000);
//         console.log('Recording started');
//       } catch (err) {
//         console.error('마이크 사용 중 오류:', err);
//         alert('마이크 권한을 허용해야 수면 분석을 사용할 수 있습니다.');
//       }
//     };

//     setupRecording();

//     return () => {
//       isCancelled = true;
//       stopRecording();
//     };
//   }, []);

//   // 10초 오디오 조각을 백엔드로 보내는 함수
//   const sendAudioChunkToBackend = async (blob) => {
//     try {
//       if (!user || !user.user_id) {
//         console.warn('로그인된 사용자 정보가 없어 오디오를 전송하지 않습니다.');
//         return;
//       }
//       const formData = new FormData();
//       formData.append('file', blob, `chunk_${Date.now()}.webm`);

//       await fetch(`http://127.0.0.1:8000/upload-audio?user_id=${user.user_id}`, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json().catch(() => ({}));
//       console.log('upload-audio 응답:', res.status, data);

//       if (!res.ok) {
//         console.error('백엔드 에러:', data.detail || data.message);
//         return;
//       }

//       // 여기서 실시간 상태 표시도 가능
//       if (data.status === 'ok') {
//         setCurrentStatus(data.label_name);
//         setIsAlerting(data.label !== 0);
//       }

//       console.log('10초 오디오 청크 전송 완료');
//     } catch (err) {
//       console.error('오디오 전송 실패:', err);
//     }
//   };

//   // 녹음 정지 + 스트림 정리
//   const stopRecording = () => {
//     try {
//       if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//         mediaRecorderRef.current.stop();
//         console.log('Recording stopped');
//       }
//     } catch (e) {
//       console.warn('stopRecording 중 오류:', e);
//     }

//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((t) => t.stop());
//       streamRef.current = null;
//     }
//   };

//   // 종료 버튼 핸들러: 녹음 정지 + 수면 종료
//   const handleStopMonitoring = () => {
//     stopRecording();
//     stopSleeping();
//   };

//   // --------------------------------------------------
//   // UI Helper
//   // --------------------------------------------------
//   const getStatusKorean = (status) => {
//     const map = {
//       Normal: '정상 호흡',
//       Hypopnea: '저호흡',
//       'Mixed Apnea': '혼합성 무호흡',
//       'Obstructive Apnea': '폐쇄성 무호흡',
//       'Central Apnea': '중추성 무호흡',
//     };
//     return map[status] || status;
//   };

//   const getStatusColor = (status) => {
//     if (status === 'Normal') return 'text-green-400';
//     if (status.includes('Apnea')) return 'text-red-400';
//     return 'text-yellow-400';
//   };

//   return (
//     <div
//       className={`w-full max-w-md h-full flex flex-col items-center justify-center p-8 transition-colors duration-500 ${isAlerting ? 'bg-red-900/30' : ''
//         }`}
//     >
//       {isAlerting && (
//         <div className="absolute inset-0 bg-red-500/20 animate-pulse z-0 pointer-events-none" />
//       )}

//       <div className="relative z-10 w-full flex flex-col items-center">
//         <div className="mb-12 relative">
//           {isAlerting ? (
//             <div className="relative">
//               <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
//               <div className="relative p-8 bg-red-500/20 rounded-full border border-red-500/50 backdrop-blur-sm">
//                 <AlertTriangle className="w-24 h-24 text-red-500 animate-bounce" />
//               </div>
//             </div>
//           ) : (
//             <div className="relative">
//               <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping duration-[3000ms]" />
//               <div className="relative p-8 bg-navy-light rounded-full border border-slate-700/50 shadow-2xl shadow-blue-900/20">
//                 <Activity className="w-24 h-24 text-blue-400" />
//               </div>
//             </div>
//           )}
//         </div>

//         <h2 className="text-3xl font-bold text-white mb-2">
//           {isAlerting ? '일어나세요!' : '수면 모니터링 중'}
//         </h2>
//         <p className="text-slate-400 mb-10">
//           {isAlerting ? '무호흡이 감지되었습니다.' : '편안한 밤 되세요 🌙'}
//         </p>

//         <div className="w-full bg-navy-light/80 backdrop-blur-md px-6 py-6 rounded-3xl mb-10 border border-slate-700/50 shadow-lg">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-slate-400 text-sm">현재 상태</span>
//             {isAlerting && <Bell className="w-4 h-4 text-red-400 animate-pulse" />}
//           </div>
//           <span className={`text-2xl font-bold ${getStatusColor(currentStatus)}`}>
//             {getStatusKorean(currentStatus)}
//           </span>
//         </div>

//         <button
//           onClick={handleStopMonitoring}
//           className="group flex items-center gap-3 px-8 py-4 bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-2xl font-bold transition-all"
//         >
//           <StopCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
//           모니터링 종료
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DetectionScreen;



// import React, { useEffect, useState } from 'react';
// import { useSleep } from '../context/SleepContext';
// import { Activity, AlertTriangle, StopCircle, Bell } from 'lucide-react';

// const DetectionScreen = () => {
//   // 👉 SleepContext에서 이제는 stopSleeping만 사용
//   const { stopSleeping } = useSleep(); // [변경] user, 녹음 관련 함수 제거

//   const [currentStatus, setCurrentStatus] = useState('Normal');
//   const [isAlerting, setIsAlerting] = useState(false); // 향후 백엔드 예측 결과에 따라 true/false 설정 예정

//   // ------------------------------------------------------------------
//   // [삭제됨] MediaRecorder / webm 전송 로직
//   //  - mediaRecorderRef, streamRef
//   //  - useEffect에서 navigator.mediaDevices.getUserMedia 호출
//   //  - sendAudioChunkToBackend 함수
//   //  - stopRecording 함수
//   //  이 모든 것은 SleepContext 쪽 녹음/업로드 로직으로 이동했습니다.
//   // ------------------------------------------------------------------

//   // 종료 버튼 핸들러: 수면 종료만 호출
//   const handleStopMonitoring = () => {
//     // [변경] 더 이상 stopRecording 호출 없음
//     stopSleeping();
//   };

//   // --------------------------------------------------
//   // UI Helper
//   // --------------------------------------------------
//   const getStatusKorean = (status) => {
//     const map = {
//       Normal: '정상 호흡',
//       Hypopnea: '저호흡',
//       'Mixed Apnea': '혼합성 무호흡',
//       'Obstructive Apnea': '폐쇄성 무호흡',
//       // 'Central Apnea': '중추성 무호흡',
//     };
//     return map[status] || status;
//   };

//   const getStatusColor = (status) => {
//     if (status === 'Normal') return 'text-green-400';
//     if (status.includes('Apnea')) return 'text-red-400';
//     return 'text-yellow-400';
//   };

//   return (
//     <div
//       className={`w-full max-w-md h-full flex flex-col items-center justify-center p-8 transition-colors duration-500 ${isAlerting ? 'bg-red-900/30' : ''
//         }`}
//     >
//       {isAlerting && (
//         <div className="absolute inset-0 bg-red-500/20 animate-pulse z-0 pointer-events-none" />
//       )}

//       <div className="relative z-10 w-full flex flex-col items-center">
//         <div className="mb-12 relative">
//           {isAlerting ? (
//             <div className="relative">
//               <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
//               <div className="relative p-8 bg-red-500/20 rounded-full border border-red-500/50 backdrop-blur-sm">
//                 <AlertTriangle className="w-24 h-24 text-red-500 animate-bounce" />
//               </div>
//             </div>
//           ) : (
//             <div className="relative">
//               <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping duration-[3000ms]" />
//               <div className="relative p-8 bg-navy-light rounded-full border border-slate-700/50 shadow-2xl shadow-blue-900/20">
//                 <Activity className="w-24 h-24 text-blue-400" />
//               </div>
//             </div>
//           )}
//         </div>

//         <h2 className="text-3xl font-bold text-white mb-2">
//           {isAlerting ? '일어나세요!' : '수면 모니터링 중'}
//         </h2>
//         <p className="text-slate-400 mb-10">
//           {isAlerting ? '무호흡이 감지되었습니다.' : '편안한 밤 되세요 🌙'}
//         </p>

//         <div className="w-full bg-navy-light/80 backdrop-blur-md px-6 py-6 rounded-3xl mb-10 border border-slate-700/50 shadow-lg">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-slate-400 text-sm">현재 상태</span>
//             {isAlerting && <Bell className="w-4 h-4 text-red-400 animate-pulse" />}
//           </div>
//           <span className={`text-2xl font-bold ${getStatusColor(currentStatus)}`}>
//             {getStatusKorean(currentStatus)}
//           </span>
//         </div>

//         <button
//           onClick={handleStopMonitoring}
//           className="group flex items-center gap-3 px-8 py-4 bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-2xl font-bold transition-all"
//         >
//           <StopCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
//           모니터링 종료
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DetectionScreen;




// import React from 'react';
// import { useSleep } from '../context/SleepContext';
// import { Activity, AlertTriangle, StopCircle, Bell } from 'lucide-react';

// const DetectionScreen = () => {
//   const { stopSleeping, currentStatus, isAlerting } = useSleep();

//   const handleStopMonitoring = () => stopSleeping();

//   const getStatusKorean = (status) => {
//     const map = {
//       Normal: '정상 호흡',
//       Hypopnea: '저호흡',
//       'Mixed Apnea': '혼합성 무호흡',
//       'Obstructive Apnea': '폐쇄성 무호흡',
//     };
//     return map[status] || status;
//   };

//   const getStatusColor = (status) => {
//     if (status === 'Normal') return 'text-green-400';
//     if (String(status).includes('Apnea')) return 'text-red-400';
//     return 'text-yellow-400';
//   };

//   return (
//     <div
//       className={`w-full max-w-md h-full flex flex-col items-center justify-center p-8 transition-colors duration-500 ${isAlerting ? 'bg-red-900/30' : ''
//         }`}
//     >
//       {isAlerting && (
//         <div className="absolute inset-0 bg-red-500/20 animate-pulse z-0 pointer-events-none" />
//       )}

//       <div className="relative z-10 w-full flex flex-col items-center">
//         <div className="mb-12 relative">
//           {isAlerting ? (
//             <div className="relative">
//               <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
//               <div className="relative p-8 bg-red-500/20 rounded-full border border-red-500/50 backdrop-blur-sm">
//                 <AlertTriangle className="w-24 h-24 text-red-500 animate-bounce" />
//               </div>
//             </div>
//           ) : (
//             <div className="relative">
//               <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping duration-[3000ms]" />
//               <div className="relative p-8 bg-navy-light rounded-full border border-slate-700/50 shadow-2xl shadow-blue-900/20">
//                 <Activity className="w-24 h-24 text-blue-400" />
//               </div>
//             </div>
//           )}
//         </div>

//         <h2 className="text-3xl font-bold text-white mb-2">
//           {isAlerting ? '일어나세요!' : '수면 모니터링 중'}
//         </h2>
//         <p className="text-slate-400 mb-10">
//           {isAlerting ? '무호흡이 감지되었습니다.' : '편안한 밤 되세요 🌙'}
//         </p>

//         <div className="w-full bg-navy-light/80 backdrop-blur-md px-6 py-6 rounded-3xl mb-10 border border-slate-700/50 shadow-lg">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-slate-400 text-sm">현재 상태</span>
//             {isAlerting && <Bell className="w-4 h-4 text-red-400 animate-pulse" />}
//           </div>
//           <span className={`text-2xl font-bold ${getStatusColor(currentStatus)}`}>
//             {getStatusKorean(currentStatus)}
//           </span>
//         </div>

//         <button
//           onClick={handleStopMonitoring}
//           className="group flex items-center gap-3 px-8 py-4 bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-2xl font-bold transition-all"
//         >
//           <StopCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
//           모니터링 종료
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DetectionScreen;



import React, { useEffect, useRef } from 'react';
import { useSleep } from '../context/SleepContext';
import { Activity, AlertTriangle, StopCircle, Bell } from 'lucide-react';

const DetectionScreen = () => {
  const {
    stopSleeping,

    // 라이브 상태 (SleepContext에서 내려옴)
    currentStatus,

    // 각성 알림 설정
    wakeUpEnabled,
    wakeUpTypes,
    triggerArousalAlarm,

    // 알람 상태(기상/각성)
    isAlarmRinging,
    alarmReason,     // 'wake-up' | 'arousal' | null
    stopAlarm,
  } = useSleep();

  // ===== 각성(30초 연속) 트리거용 =====
  const statusRef = useRef(currentStatus);
  const apneaDurationRef = useRef(0);     // 초 누적
  const arousalFiredRef = useRef(false);  // 한 에피소드 1회만

  useEffect(() => {
    statusRef.current = currentStatus;
  }, [currentStatus]);

  useEffect(() => {
    const timer = setInterval(() => {
      const type = statusRef.current;

      const isApneaType =
        !!wakeUpEnabled &&
        Array.isArray(wakeUpTypes) &&
        wakeUpTypes.includes(type);

      if (isApneaType) {
        apneaDurationRef.current += 1; // 1초씩 누적
      } else {
        apneaDurationRef.current = 0;
        arousalFiredRef.current = false; // 정상으로 돌아오면 다음 에피소드 허용
      }

      // 30초 이상 연속 + 아직 발사 안 했을 때 1회만 트리거
      if (isApneaType && apneaDurationRef.current >= 30 && !arousalFiredRef.current) {
        arousalFiredRef.current = true;

        // 진동(가능한 환경에서만)
        if (navigator.vibrate) navigator.vibrate([500, 200, 500]);

        // 실제 각성 알람(소리) - SleepContext에서 처리(중복 울림 방지도 거기서)
        triggerArousalAlarm();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      apneaDurationRef.current = 0;
      arousalFiredRef.current = false;
    };
  }, [wakeUpEnabled, wakeUpTypes, triggerArousalAlarm]);

  // ===== UI용 경고 상태 =====
  const uiAlerting = isAlarmRinging && (alarmReason === 'arousal' || alarmReason === 'wake-up');

  const getStatusKorean = (status) => {
    const map = {
      Normal: '정상 호흡',
      Hypopnea: '저호흡',
      'Mixed Apnea': '혼합성 무호흡',
      'Obstructive Apnea': '폐쇄성 무호흡',
      'Central Apnea': '중추성 무호흡',
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    if (status === 'Normal') return 'text-green-400';
    if (String(status).includes('Apnea')) return 'text-red-400';
    return 'text-yellow-400';
  };

  const titleText =
    alarmReason === 'wake-up' ? '기상 시간입니다!' :
      alarmReason === 'arousal' ? '일어나세요!' :
        '수면 모니터링 중';

  const subText =
    alarmReason === 'wake-up' ? '설정된 기상 시간입니다.' :
      alarmReason === 'arousal' ? '무호흡이 30초 이상 지속되었습니다.' :
        '편안한 밤 되세요 🌙';

  return (
    <div
      className={`w-full max-w-md h-full flex flex-col items-center justify-center p-8 transition-colors duration-500 ${uiAlerting ? 'bg-red-900/30' : ''
        }`}
    >
      {uiAlerting && (
        <div className="absolute inset-0 bg-red-500/20 animate-pulse z-0 pointer-events-none" />
      )}

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="mb-12 relative">
          {uiAlerting ? (
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
              <div className="relative p-8 bg-red-500/20 rounded-full border border-red-500/50 backdrop-blur-sm">
                <AlertTriangle className="w-24 h-24 text-red-500 animate-bounce" />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping duration-[3000ms]" />
              <div className="relative p-8 bg-navy-light rounded-full border border-slate-700/50 shadow-2xl shadow-blue-900/20">
                <Activity className="w-24 h-24 text-blue-400" />
              </div>
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">{titleText}</h2>
        <p className="text-slate-400 mb-10">{subText}</p>

        <div className="w-full bg-navy-light/80 backdrop-blur-md px-6 py-6 rounded-3xl mb-10 border border-slate-700/50 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">현재 상태</span>
            {uiAlerting && <Bell className="w-4 h-4 text-red-400 animate-pulse" />}
          </div>
          <span className={`text-2xl font-bold ${getStatusColor(currentStatus)}`}>
            {getStatusKorean(currentStatus)}
          </span>
        </div>

        {/* 알람이 울리는 중이면 끄기 버튼 노출 */}
        {isAlarmRinging && (
          <button
            onClick={stopAlarm}
            className="mb-3 w-full flex items-center justify-center gap-3 px-8 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 rounded-2xl font-bold transition-all"
          >
            <Bell className="w-6 h-6" />
            알람 끄기
          </button>
        )}

        <button
          onClick={stopSleeping}
          className="group flex items-center gap-3 px-8 py-4 bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-2xl font-bold transition-all"
        >
          <StopCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          모니터링 종료
        </button>
      </div>
    </div>
  );
};

export default DetectionScreen;


