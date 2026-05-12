import React, { useState, useMemo, useEffect } from 'react';
import { useSleep } from '../context/SleepContext';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Settings, MapPin, X, Phone, User, HelpCircle } from 'lucide-react';
import hospitalCsv from '../data/대한수면연구학회_수면클리닉.csv?raw';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ----------------- CSV 파서 -----------------
const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = [];
    let inQuotes = false;
    let currentValue = '';

    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    row.push(currentValue);

    if (row.length > 1) {
      result.push({
        id: row[0],
        name: row[1],
        address: row[2]?.replace(/^"|"$/g, ''),
        doctor: row[3]?.replace(/^"|"$/g, ''),
        phone: row[4],
        lat: parseFloat(row[5]),
        lng: parseFloat(row[6])
      });
    }
  }
  return result;
};

const hospitals = parseCSV(hospitalCsv);

// ★ 지도 중심 재설정용 컴포넌트
const RecenterMap = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

const SleepReport = () => {
  const {
    detectionLog,
    startTime,
    endTime,
    setAppMode,
    sleepSchedule,
    profile,
    isFirstTime,
    // 추가
    user,
    analysisDuration,
    loadSleepReport,
    sleepReport,
    weeklyReports,
    loadWeeklyReports,
  } = useSleep();

  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [showHospitalInfo, setShowHospitalInfo] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // [lat, lng]

  // ----------------- 분석 시간 계산 -----------------
  // const analysisDuration = useMemo(() => {
  //   const ONE_HOUR_MINUTES = 60;
  //   const ONE_HOUR_MS = ONE_HOUR_MINUTES * 60 * 1000;
  //   let totalMinutes = 0;

  //   if (startTime && endTime) {
  //     const analysisStartMs = startTime.getTime() + ONE_HOUR_MS;
  //     const diffMs = endTime.getTime() - analysisStartMs;
  //     totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  //   } else if (sleepSchedule.start && sleepSchedule.end) {
  //     const [startHour, startMin] = sleepSchedule.start
  //       .split(':')
  //       .map(Number);
  //     const [endHour, endMin] = sleepSchedule.end.split(':').map(Number);

  //     let duration =
  //       endHour * 60 +
  //       endMin -
  //       (startHour * 60 + startMin);
  //     if (duration < 0) duration += 24 * 60;

  //     duration = duration - ONE_HOUR_MINUTES;
  //     if (duration < 0) duration = 0;

  //     totalMinutes = duration;
  //   } else {
  //     totalMinutes = 0;
  //   }

  //   const hours = Math.floor(totalMinutes / 60);
  //   const minutes = totalMinutes % 60;

  //   if (hours > 0 && minutes > 0) {
  //     return `${hours}시간 ${minutes}분`;
  //   } else if (hours > 0) {
  //     return `${hours}시간`;
  //   } else {
  //     return `${minutes}분`;
  //   }
  // }, [sleepSchedule, startTime, endTime]);

  // ----------------- AHI 계산 -----------------
  // const stats = useMemo(() => {
  //   const mockCounts = {
  //     Hypopnea: 5,
  //     'Mixed Apnea': 3,
  //     'Obstructive Apnea': 8,
  //     'Central Apnea': 2
  //   };

  //   const ONE_HOUR_MS = 60 * 60 * 1000;

  //   let eventsToUse = detectionLog;

  //   if (startTime) {
  //     const analysisStart = new Date(startTime.getTime() + ONE_HOUR_MS);
  //     eventsToUse = detectionLog.filter((ev) => ev.timestamp >= analysisStart);
  //   }

  //   const hasRealEvents = eventsToUse.length > 0;

  //   const counts = hasRealEvents
  //     ? eventsToUse.reduce((acc, curr) => {
  //       acc[curr.type] = (acc[curr.type] || 0) + 1;
  //       return acc;
  //     }, {})
  //     : mockCounts;

  //   const totalEvents = Object.values(counts).reduce(
  //     (sum, value) => sum + value,
  //     0
  //   );

  //   const ahiEvents =
  //     (counts['Obstructive Apnea'] || 0) +
  //     (counts['Central Apnea'] || 0) +
  //     (counts['Mixed Apnea'] || 0) +
  //     (counts['Hypopnea'] || 0);

  //   let ahi = 0;

  //   if (startTime && endTime) {
  //     const analysisStartMs = startTime.getTime() + ONE_HOUR_MS;
  //     const diffMs = endTime.getTime() - analysisStartMs;
  //     const minutes = Math.max(0, diffMs / (1000 * 60));
  //     const hours = minutes / 60;
  //     ahi = hours > 0 ? ahiEvents / hours : 0;
  //   }

  //   return {
  //     counts,
  //     ahi,
  //     totalEvents
  //   };
  // }, [detectionLog, startTime, endTime]);

  // ----------------- DB 기반 통계 (sleep_report 테이블 값 사용) -----------------
  const stats = useMemo(() => {
    // DB에서 내려온 값이 있으면 그걸 100% 사용
    const db = sleepReport;

    const counts = {
      Hypopnea: db?.apnea_level_1 ?? 0,          // 저호흡
      'Mixed Apnea': db?.apnea_level_2 ?? 0,     // 혼합성
      'Obstructive Apnea': db?.apnea_level_3 ?? 0, // 폐쇄성
      'Central Apnea': 0, // 현재 테이블에 없으니 0 고정 (추후 컬럼 추가 시 연결)
    };

    const totalEvents =
      (counts.Hypopnea || 0) +
      (counts['Mixed Apnea'] || 0) +
      (counts['Obstructive Apnea'] || 0) +
      (counts['Central Apnea'] || 0);

    // AHI: (이벤트 총합 / 분석시간(시간)) 로 계산
    // sleep_analysis_time: "HH:MM:SS" 형태가 일반적
    const parseDurationHours = (t) => {
      if (!t || typeof t !== 'string') return 0;
      const parts = t.split(':').map((x) => Number(x));
      if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return 0;
      const [hh, mm, ss = 0] = parts;
      return hh + mm / 60 + ss / 3600;
    };

    const hours = parseDurationHours(db?.sleep_analysis_time);
    const ahiEvents = totalEvents; // 현재는 1~3만 합산 + central 0
    const ahi = hours > 0 ? ahiEvents / hours : 0;

    return { counts, totalEvents, ahi };
  }, [sleepReport]);

  // ----------------- 차트용 데이터 -----------------
  const legendItems = [
    { key: 'Hypopnea', label: '저호흡', color: '#60a5fa', value: stats.counts['Hypopnea'] || 0 },
    { key: 'Mixed Apnea', label: '혼합성', color: '#818cf8', value: stats.counts['Mixed Apnea'] || 0 },
    { key: 'Obstructive Apnea', label: '폐쇄성', color: '#3b82f6', value: stats.counts['Obstructive Apnea'] || 0 },
    { key: 'Central Apnea', label: '중추성', color: '#2563eb', value: stats.counts['Central Apnea'] || 0 },
  ].filter((i) => i.value > 0);

  // ----------------- 차트용 데이터 -----------------
  const dayChartData = [
    { name: '저호흡', value: stats.counts['Hypopnea'] || 0, color: '#60a5fa' },
    { name: '혼합성', value: stats.counts['Mixed Apnea'] || 0, color: '#818cf8' },
    {
      name: '폐쇄성',
      value: stats.counts['Obstructive Apnea'] || 0,
      color: '#3b82f6'
    },
    { name: '중추성', value: stats.counts['Central Apnea'] || 0, color: '#2563eb' }
  ].filter((d) => d.value > 0);

  // const weekChartData = [
  //   { day: '월', ahi: 5 },
  //   { day: '화', ahi: 7 },
  //   { day: '수', ahi: 3 },
  //   { day: '목', ahi: 10 },
  //   { day: '금', ahi: 4 },
  //   { day: '토', ahi: 6 },
  //   { day: '일', ahi: stats.ahi }
  // ];

  const weekChartData = useMemo(() => {
    // weeklyReports: [{date:'YYYY-MM-DD', ahi:number}, ...] (7개)
    if (!weeklyReports || weeklyReports.length === 0) {
      return [
        { day: '월', ahi: 0 },
        { day: '화', ahi: 0 },
        { day: '수', ahi: 0 },
        { day: '목', ahi: 0 },
        { day: '금', ahi: 0 },
        { day: '토', ahi: 0 },
        { day: '일', ahi: 0 },
      ];
    }

    const dayKor = (ymd) => {
      const d = new Date(`${ymd}T00:00:00`);
      const map = ['일', '월', '화', '수', '목', '금', '토'];
      return map[d.getDay()];
    };

    return weeklyReports.map((r) => ({
      day: dayKor(r.date),
      ahi: Number.isFinite(r.ahi) ? r.ahi : 0,
      date: r.date, // 툴팁에 쓰고 싶으면 유지
    }));
  }, [weeklyReports]);

  // ----------------- 지도 중심 (기본: 첫 병원 or 서울) -----------------
  const defaultCenter = useMemo(() => {
    const first = hospitals.find(
      (h) => !isNaN(h.lat) && !isNaN(h.lng)
    );
    if (first) return [first.lat, first.lng];
    return [37.5665, 126.9780]; // 서울
  }, []);

  // ★ 내 위치 기준으로 병원 리스트를 거리 순 정렬
  const sortedHospitals = useMemo(() => {
    const withCoords = [];
    const withoutCoords = [];

    hospitals.forEach((h) => {
      if (!isNaN(h.lat) && !isNaN(h.lng)) {
        withCoords.push(h);
      } else {
        withoutCoords.push(h);
      }
    });

    if (!userLocation) {
      // 내 위치를 모르면 원래 순서 유지
      return [...withCoords, ...withoutCoords];
    }

    const [uLat, uLng] = userLocation;
    const R = 6371; // km
    const toRad = (deg) => (deg * Math.PI) / 180;

    const withDistance = withCoords.map((h) => {
      const dLat = toRad(h.lat - uLat);
      const dLng = toRad(h.lng - uLng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(uLat)) *
        Math.cos(toRad(h.lat)) *
        Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return { ...h, distance };
    });

    withDistance.sort((a, b) => a.distance - b.distance);

    return [...withDistance, ...withoutCoords];
  }, [userLocation]);

  // ----------------- 버튼 핸들러 -----------------
  const handleHospitalInfoClick = () => {
    if (locationPermissionGranted) {
      setShowHospitalInfo(true);
    } else {
      setShowLocationPopup(true);
    }
  };

  // ★ 동의 클릭 시 실제 브라우저 위치 가져오기 + 모달 열기
  const handlePermissionAgree = () => {
    setLocationPermissionGranted(true);
    setShowLocationPopup(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setShowHospitalInfo(true);
        },
        (err) => {
          console.error('위치 정보 가져오기 실패:', err);
          // 실패해도 병원 리스트는 보여줌
          setShowHospitalInfo(true);
        }
      );
    } else {
      setShowHospitalInfo(true);
    }
  };

  // useEffect(() => {
  //   if (!user?.user_id) return;
  //   loadSleepReport(user.user_id); // user_id를 인자로 넘김
  // }, [user?.user_id, loadSleepReport]);

  useEffect(() => {
    if (!user?.user_id) return;
    loadSleepReport(user.user_id);      // 오늘(도넛)
    loadWeeklyReports(user.user_id);    // 최근 7일(라인)
  }, [user?.user_id, loadSleepReport, loadWeeklyReports]);

  // ----------------- 렌더 -----------------
  return (
    <div className="w-full h-full flex flex-col p-4 bg-navy relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            안녕하세요, {profile?.name || '사용자'}님
          </h1>
          <p className="text-sm text-slate-400">오늘도 꿀잠 주무세요 🌙</p>
        </div>
        <button
          onClick={() => setAppMode('settings')}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      {/* Info Box */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-3 mb-4 text-center">
        <p className="text-blue-100 text-lg font-medium leading-relaxed mb-1">
          분석에 사용한 시간은{' '}
          <span className="font-bold">{analysisDuration}</span>
          입니다.
        </p>
        <p className="text-blue-100 text-xs leading-relaxed">
          사용자가 설정한 취침 시간으로부터 1시간 뒤에 측정한 결과입니다.
        </p>
      </div>

      {/* Toggle */}
      <div className="bg-navy-light p-1 rounded-2xl flex mb-4">
        <button
          onClick={() => setViewMode('day')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${viewMode === 'day'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          하루
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${viewMode === 'week'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          일주일
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-navy-light rounded-3xl p-4 mb-4 flex-1 min-h-[320px] flex flex-col items-center justify-center relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAppMode('apnea-definition');
          }}
          className="absolute top-4 right-4 z-20 text-slate-500 hover:text-white transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {isFirstTime && detectionLog.length === 0 ? (
          <div className="text-center p-6 animate-fade-in">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🌙</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              첫 수면 분석을 시작해보세요
            </h3>
            <p className="text-slate-400 leading-relaxed">
              오늘 밤 편안하게 주무시면
              <br />
              내일 아침 상세한 수면 리포트가
              <br />
              이곳에 표시됩니다.
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'day' ? (
              <div className="w-full flex-1 flex flex-col items-center justify-start">
                <div className="w-full h-[250px] relative mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          dayChartData.length > 0
                            ? dayChartData
                            : [
                              {
                                name: 'No Data',
                                value: 1,
                                color: '#475569'
                              }
                            ]
                        }
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        strokeWidth={0}      // 경계선 제거(안티앨리어싱 틈 방지)
                        startAngle={90}      // 12시 방향부터 시작
                        endAngle={-270}      // 시계방향
                      >
                        {(dayChartData.length > 0
                          ? dayChartData
                          : [
                            {
                              name: 'No Data',
                              value: 1,
                              color: '#475569'
                            }
                          ]
                        ).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {stats.totalEvents}
                      </div>
                      <div className="text-xs text-slate-400">
                        Total
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-xs">
                  <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-3">
                    {legendItems.map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white/90 text-sm font-semibold">
                          {item.label} {item.value}회
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                    {legendItems.map((item, idx) => {
                      const isLastOdd =
                        legendItems.length % 2 === 1 && idx === legendItems.length - 1;

                      const justifyClass = isLastOdd
                        ? 'justify-center'
                        : idx % 2 === 0
                          ? 'justify-start'
                          : 'justify-end';

                      return (
                        <div
                          key={item.key}
                          className={`flex items-center gap-2 ${justifyClass} ${isLastOdd ? 'col-span-2' : ''}`}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-white/90 text-sm font-semibold">
                            {item.label} {item.value}회
                          </span>
                        </div>
                      );
                    })}
                  </div> */}
                </div>
                {/* <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-xs h-[50px]">
                  {legendItems.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 text-sm">
                        {item.label}: {item.value}회
                      </span>
                    </div>
                  ))}
                </div> */}
              </div>
            ) : (
              <div className="w-full flex-1 flex flex-col items-center justify-start">
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weekChartData}
                      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="day"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: '#475569' }}
                        height={20}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        domain={[0, 40]}
                        tickLine={false}
                        axisLine={{ stroke: '#475569' }}
                        ticks={[0, 10, 20, 30, 40]}
                        width={40}
                        label={{
                          value: 'AHI (/h)',
                          angle: -90,
                          position: 'insideLeft',
                          style: {
                            fill: '#94a3b8',
                            fontSize: 11
                          }
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          padding: '8px 12px'
                        }}
                        cursor={{
                          stroke: '#3b82f6',
                          strokeWidth: 2
                        }}
                        formatter={(value) => [
                          `${Number(value).toFixed(1)}`,
                          'AHI'
                        ]}
                        labelFormatter={(label, payload) => {
                          const p = payload?.[0]?.payload;
                          return p?.date ? `${label} (${p.date})` : label;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="ahi"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{
                          fill: '#3b82f6',
                          strokeWidth: 0,
                          r: 5
                        }}
                        activeDot={{
                          r: 7,
                          fill: '#60a5fa'
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-3 h-28 shrink-0">
        {/* AHI Card */}
        <div className="bg-navy-light rounded-3xl p-5 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="relative z-10 text-center">
            <div className="text-slate-400 text-xs font-medium mb-2">
              AHI (무호흡 지수)
            </div>
            <div
              className={`text-4xl font-bold mb-1 ${stats.ahi < 5
                ? 'text-emerald-400'
                : stats.ahi < 15
                  ? 'text-yellow-400'
                  : stats.ahi < 30
                    ? 'text-orange-400'
                    : 'text-red-400'
                }`}
            >
              {stats.ahi.toFixed(1)}
            </div>
            <div className="text-slate-400 text-xs font-medium">
              회/시간입니다
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAppMode('ahi-info');
            }}
            className="absolute top-3 right-3 z-20 text-slate-500 hover:text-white transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
        </div>

        {/* Hospital Info */}
        <button
          onClick={handleHospitalInfoClick}
          className="bg-navy-light rounded-3xl p-5 flex flex-col items-center justify-center hover:bg-slate-800 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-colors">
            <MapPin className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </div>
          <span className="text-slate-300 font-medium">병원 정보</span>
        </button>
      </div>

      {/* Location Permission Popup */}
      {showLocationPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fade-in">
          <div className="bg-navy-light rounded-3xl p-6 w-full max-w-sm border border-slate-700 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                위치 정보 수집 동의
              </h3>
              <p className="text-slate-400 text-sm">
                가까운 병원 정보를 제공하기 위해
                <br />
                위치 정보를 수집하는데 동의하시겠습니까?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLocationPopup(false)}
                className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 font-bold hover:bg-slate-600 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handlePermissionAgree}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
              >
                동의
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Info Modal/View */}
      {showHospitalInfo && (
        <div className="absolute inset-0 z-50 bg-navy flex flex-col animate-slide-up">
          <header className="flex items-center justify-between p-6 border-b border-slate-800 bg-navy z-10">
            <h2 className="text-xl font-bold text-white">주변 병원 찾기</h2>
            <button
              onClick={() => setShowHospitalInfo(false)}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </header>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* 지도 영역 */}
            <div className="h-64 relative w-full shrink-0">
              <MapContainer
                center={userLocation || defaultCenter}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <RecenterMap
                  center={userLocation || defaultCenter}
                />

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {sortedHospitals
                  .filter(
                    (h) =>
                      !isNaN(h.lat) && !isNaN(h.lng)
                  )
                  .map((hospital) => (
                    <CircleMarker
                      key={hospital.id}
                      center={[hospital.lat, hospital.lng]}
                      radius={6}
                      pathOptions={{
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.9
                      }}
                    >
                      <Popup>
                        <div>
                          <div className="font-semibold mb-1">
                            {hospital.name}
                          </div>
                          <div className="text-xs mb-1">
                            {hospital.address}
                          </div>
                          {hospital.phone &&
                            hospital.phone !== '-' && (
                              <div className="text-xs">
                                ☎ {hospital.phone}
                              </div>
                            )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}

                {userLocation && (
                  <CircleMarker
                    center={userLocation}
                    radius={7}
                    pathOptions={{
                      color: '#22c55e',
                      fillColor: '#22c55e',
                      fillOpacity: 0.9
                    }}
                  >
                    <Popup>현재 위치</Popup>
                  </CircleMarker>
                )}
              </MapContainer>

              <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/20">
                {userLocation ? '현 위치 중심' : '병원 기준 중심'}
              </div>
            </div>

            {/* 병원 리스트 */}
            <div className="flex-1 overflow-y-auto bg-navy">
              <div className="p-4 space-y-3">
                <h3 className="text-slate-400 text-sm font-bold mb-2 px-1">
                  추천 수면 클리닉 ({sortedHospitals.length})
                </h3>
                {sortedHospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="bg-navy-light p-4 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors"
                  >
                    <h4 className="text-white font-bold text-lg mb-1">
                      {hospital.name}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      {hospital.address}
                    </p>
                    {userLocation &&
                      typeof hospital.distance ===
                      'number' && (
                        <p className="text-xs text-slate-500 mt-1">
                          내 위치에서 약{' '}
                          {hospital.distance.toFixed(
                            1
                          )}
                          km
                        </p>
                      )}

                    <div className="flex items-center gap-4 text-sm mt-3">
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <User className="w-4 h-4" />
                        <span>{hospital.doctor}</span>
                      </div>
                      {hospital.phone &&
                        hospital.phone !== '-' && (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-4 h-4" />
                            <span>
                              {hospital.phone}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepReport;