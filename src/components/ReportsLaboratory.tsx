import React, { useState } from 'react';
import {
  NINE_REPORTS,
  STOP_REPORT_DEMO_ENTRIES,
  type ReportChapterSpec,
} from '../data/farzamData';
import {
  buildExcelCsv,
  filterStopReportByDuration,
  toPersianDigits,
} from '../utils/telemetryLogic';

export const ReportsLaboratory: React.FC = () => {
  const [activeReportId, setActiveReportId] = useState<ReportChapterSpec['id']>('route');
  const [generatedMap, setGeneratedMap] = useState<Record<string, boolean>>({
    route: true, // Pre-generated on initial load so no empty states ever appear
  });
  const [exportedFeedback, setExportedFeedback] = useState<string | null>(null);

  // Interactive controls per report metaphor
  // 1. Route controls
  const [routeZeroSpeedFilter, setRouteZeroSpeedFilter] = useState(true);
  const [routeJammingClean, setRouteJammingClean] = useState(true);
  const [routeShowVoltage, setRouteShowVoltage] = useState(true);

  // 2. Trip controls
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);

  // 3. Stop duration filter controls
  const [minStopMinutes, setMinStopMinutes] = useState(15);
  const [maxStopMinutes, setMaxStopMinutes] = useState<number | null>(300);

  // 4. Daily work-hour controls
  const [shiftMode, setShiftMode] = useState<'standard' | 'extended'>('standard');

  // 5. Performance metric sort
  const [perfMetric, setPerfMetric] = useState<'distance' | 'speed' | 'fuel'>('distance');

  // 6. Geofence prerequisite & inside/outside checkboxes
  const [selectedGeofenceSite, setSelectedGeofenceSite] = useState('انبار مرکزی کرج (چندضلعی)');
  const [includeInside, setIncludeInside] = useState(true);
  const [includeOutside, setIncludeOutside] = useState(true);

  // 7. Event multi-select filter
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([
    'ورود به محدوده',
    'سرعت غیرمجاز',
    'روشن شدن سوئیچ',
    'نشت سوخت',
  ]);

  // 8. Heatmap group filter
  const [heatmapCorridor, setHeatmapCorridor] = useState<'all' | 'tehran-west' | 'karaj'>('all');

  // 9. Temperature cold-chain slider
  const [containerTemp, setContainerTemp] = useState(-4.2);

  const activeReport =
    NINE_REPORTS.find((r) => r.id === activeReportId) ?? NINE_REPORTS[0];
  const isReportGenerated = Boolean(generatedMap[activeReport.id]);

  const handleGenerateReport = () => {
    setGeneratedMap((prev) => ({ ...prev, [activeReport.id]: true }));
    setExportedFeedback(null);
  };

  const handleExcelExport = () => {
    if (!isReportGenerated || !activeReport.hasExcelExport) return;
    const csvContent = buildExcelCsv(
      activeReport.persianName,
      activeReport.tableHeaders,
      activeReport.tableRows,
    );
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `myfarzam-${activeReport.id}-demo.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback if blob download is restricted
    }
    setExportedFeedback(
      `فایل اکسل (CSV/XLS) «${activeReport.persianName}» با ${toPersianDigits(activeReport.tableRows.length)} ردیف مستند آماده و صادر شد.`,
    );
  };

  const filteredStopEntries = filterStopReportByDuration(
    STOP_REPORT_DEMO_ENTRIES,
    minStopMinutes,
    maxStopMinutes,
  );

  const toggleEventType = (evt: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(evt) ? (prev.length > 1 ? prev.filter((item) => item !== evt) : prev) : [...prev, evt],
    );
  };

  return (
    <section
      id="reports"
      aria-labelledby="heading-reports"
      className="chapter-light relative pb-20 lg:pb-28"
    >
      {/* =====================================================================
          INTENTIONAL DARK-TO-LIGHT ARCHITECTURAL SIGNAL BRIDGE
          Dark chapters = live control; Light chapters = organisation, reports, proof.
          ===================================================================== */}
      <div
        className="w-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-navy-950)' }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-[64px] sm:h-[96px] block"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 L0,48 C360,115 720,0 1080,68 C1260,96 1360,40 1440,24 L1440,120 Z"
            fill="var(--color-beige-200)"
          />
          <path
            d="M0,48 C360,115 720,0 1080,68 C1260,96 1360,40 1440,24"
            fill="none"
            stroke="var(--color-orange-500)"
            strokeWidth="4"
          />
          <circle cx="720" cy="46" r="7" fill="var(--color-orange-500)" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 lg:pt-14">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-bold mb-2" style={{ color: 'var(--color-orange-600)' }}>
              ۰۵ · آزمایشگاه ۹ گزارش تحلیلی مای‌فرزام (هسته تصمیم‌گیری سازمانی)
            </p>
            <h2 id="heading-reports" className="headline-chapter" style={{ color: 'var(--color-navy-900)' }}>
              هر گزارش، پاسخ دقیق به یک سؤال مدیریتی است؛ از مسیر لحظه‌ای تا سند اکسل.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed" style={{ color: 'var(--color-navy-800)' }}>
            در مای‌فرزام، گزارش‌ها فهرستی از اعداد خام نیستند. هر گزارش با انتخاب دستگاه یا گروه و بازه زمانی شکل می‌گیرد و پس از تولید نتایج، به مستندات قابل استناد اکسل تبدیل می‌شود.
          </p>
        </div>

        {/* 4 Organizational Value Pillars (Accountability, Cost Control, Safety/Compliance, Evidence) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              title: '۱. پاسخگویی و شفافیت',
              desc: 'مسیر پیمایش، تفکیک سفرها و نقشه حرارتی تردد هیچ نقطه ابهامی در عملکرد روزانه باقی نمی‌گذارد.',
            },
            {
              title: '۲. کنترل هزینه و سوخت',
              desc: 'تفکیک ساعت حرکت از درجا کار کردن موتور، حذف توقف‌های کاذب و مقایسه مصرف سوخت ناوگان.',
            },
            {
              title: '۳. ایمنی و انطباق زنجیره سرد',
              desc: 'ثبت رویدادهای سرعت غیرمجاز، حضور در محدوده‌های مجاز و پایش پیوسته دمای یخچال با سنسور سازگار.',
            },
            {
              title: '۴. مستندسازی و خروجی اکسل',
              desc: 'تبدیل نتایج گزارش به فایل اکسل (Excel) تنها پس از تولید گزارش، برای حسابرسی و بایگانی سازمانی.',
            },
          ].map((pillar) => (
            <div key={pillar.title} className="card-light-elevated p-5">
              <h3 className="text-sm font-extrabold mb-1.5" style={{ color: 'var(--color-navy-900)' }}>
                {pillar.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-navy-800)' }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 9 Report Selector Tabs (Tactile 3x3 on mobile, 9-column bar on desktop) */}
        <div
          className="well-light p-2 mb-8 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5"
          role="tablist"
          aria-label="انتخاب یکی از ۹ گزارش مای‌فرزام"
        >
          {NINE_REPORTS.map((rep, idx) => {
            const active = rep.id === activeReportId;
            return (
              <button
                key={rep.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveReportId(rep.id);
                  setExportedFeedback(null);
                }}
                className="min-h-[46px] px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center text-center"
                style={{
                  backgroundColor: active ? 'var(--color-navy-900)' : 'var(--color-beige-50)',
                  color: active ? 'var(--color-beige-50)' : 'var(--color-navy-900)',
                  boxShadow: active ? 'var(--shadow-beige-float)' : 'none',
                }}
              >
                <span className="text-[10px] opacity-75 font-tabular">
                  {toPersianDigits(idx + 1)}
                </span>
                <span className="whitespace-nowrap">{rep.persianName.replace('گزارش ', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Active Report Master Stage */}
        <div className="card-light-float p-6 sm:p-8 lg:p-10">
          {/* Top Row: Manager's Question + Pillar + Multi-device Indicator */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b" style={{ borderColor: 'var(--color-beige-300)' }}>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mb-2" style={{ color: 'var(--color-navy-500)' }}>
                <span>{activeReport.persianName} ({activeReport.englishName})</span>
                <span aria-hidden="true">·</span>
                <span style={{ color: 'var(--color-orange-600)' }}>محور ارزش: {activeReport.orgPillar}</span>
                {activeReport.isMultiDeviceCapable && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold" style={{ color: 'var(--color-navy-900)' }}>
                      پشتیبانی از انتخاب گروه و چند دستگاه همزمان (ویژه سازمان‌ها)
                    </span>
                  </>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black leading-snug" style={{ color: 'var(--color-navy-900)' }}>
                سؤال مدیر: {activeReport.managerQuestion}
              </h3>
            </div>

            {/* Authentic Report Generation & Excel Evidence Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleGenerateReport}
                className="btn-signal-primary text-xs"
              >
                {isReportGenerated ? 'به‌روزرسانی و تولید مجدد گزارش' : 'تولید گزارش (پیش‌نیاز خروجی اکسل)'}
              </button>

              {activeReport.hasExcelExport ? (
                <button
                  type="button"
                  disabled={!isReportGenerated}
                  onClick={handleExcelExport}
                  className="px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isReportGenerated ? 'var(--color-navy-900)' : 'var(--color-beige-300)',
                    color: isReportGenerated ? 'var(--color-beige-50)' : 'var(--color-navy-500)',
                  }}
                >
                  {isReportGenerated ? 'خروجی اکسل (Excel / CSV)' : 'خروجی اکسل (قفل تا قبل از تولید گزارش)'}
                </button>
              ) : (
                <span className="text-xs font-medium px-3 py-2 rounded-full" style={{ backgroundColor: 'var(--color-beige-100)', color: 'var(--color-navy-800)' }}>
                  خروجی بصری و تحلیلی مستقیم در سامانه
                </span>
              )}
            </div>
          </div>

          {exportedFeedback && (
            <div
              role="status"
              className="mb-6 p-3.5 rounded-xl text-xs font-bold"
              style={{
                backgroundColor: 'var(--color-navy-900)',
                color: 'var(--color-beige-50)',
              }}
            >
              {exportedFeedback}
            </div>
          )}

          {/* Middle Row: Unique Visual Metaphor Canvas (7 cols) + Inputs/Hardware Specs (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
            {/* Bespoke Interactive Metaphor Stage */}
            <div
              className="lg:col-span-7 rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--color-navy-950)',
                color: 'var(--color-beige-50)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold" style={{ color: 'var(--color-orange-400)' }}>
                  استعاره بصری: {activeReport.metaphorTitle}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--color-beige-400)' }}>
                  تعامل زنده با پارامترهای گزارش
                </span>
              </div>

              {/* 1. ROUTE METAPHOR */}
              {activeReport.id === 'route' && (
                <div>
                  <svg viewBox="0 0 600 210" className="w-full h-auto" role="img" aria-label="مسیر پیمایش با فیلتر سرعت صفر و ولتاژ نقاط">
                    <path
                      d="M 540 165 C 440 40, 320 190, 210 75 C 140 20, 95 140, 50 110"
                      fill="none"
                      stroke="var(--color-orange-500)"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    {!routeJammingClean && (
                      <polyline
                        points="320,115 285,12 255,125"
                        fill="none"
                        stroke="#E04819"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    )}
                    {[
                      { x: 540, y: 165, v: '۲۴٫۴V', s: '۸۲ km/h' },
                      { x: 385, y: 108, v: '۲۴٫۲V', s: '۶۴ km/h' },
                      { x: 210, y: 75, v: '۲۳٫۹V', s: '۱۲ km/h' },
                      { x: 50, y: 110, v: '۲۴٫۵V', s: '۸۸ km/h' },
                    ].map((pt, i) => (
                      <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
                        <circle r="7" fill="var(--color-orange-500)" />
                        <text y="-14" textAnchor="middle" fill="var(--color-beige-50)" fontSize="11" fontWeight="700">
                          {pt.s}
                        </text>
                        {routeShowVoltage && (
                          <text y="22" textAnchor="middle" fill="var(--color-orange-400)" fontSize="10">
                            {pt.v}
                          </text>
                        )}
                      </g>
                    ))}
                  </svg>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setRouteZeroSpeedFilter((v) => !v)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      style={{
                        backgroundColor: routeZeroSpeedFilter ? 'var(--color-orange-500)' : 'var(--color-navy-800)',
                        color: routeZeroSpeedFilter ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                      }}
                    >
                      حذف نقاط سرعت صفر: {routeZeroSpeedFilter ? 'فعال' : 'غیرفعال'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRouteJammingClean((v) => !v)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      style={{
                        backgroundColor: routeJammingClean ? 'var(--color-orange-500)' : 'var(--color-navy-800)',
                        color: routeJammingClean ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                      }}
                    >
                      پاک‌سازی جمینگ و پرش GPS: {routeJammingClean ? 'فعال' : 'غیرفعال'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRouteShowVoltage((v) => !v)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      style={{
                        backgroundColor: routeShowVoltage ? 'var(--color-orange-500)' : 'var(--color-navy-800)',
                        color: routeShowVoltage ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                      }}
                    >
                      نمایش ولتاژ نقاط: {routeShowVoltage ? 'فعال' : 'غیرفعال'}
                    </button>
                  </div>
                </div>
              )}

              {/* 2. TRIP METAPHOR */}
              {activeReport.id === 'trip' && (
                <div>
                  <svg viewBox="0 0 600 190" className="w-full h-auto" role="img" aria-label="مهره‌های تفکیک سفر روی رشته سیگنال">
                    <line x1="60" y1="95" x2="540" y2="95" stroke="var(--color-orange-500)" strokeWidth="4" />
                    {[
                      { idx: 0, x: 490, label: 'سفر ۱', dist: '۱۸۴٫۵ km', max: '۹۴ km/h' },
                      { idx: 1, x: 360, label: 'سفر ۲', dist: '۱۴۲٫۰ km', max: '۸۸ km/h' },
                      { idx: 2, x: 230, label: 'سفر ۳', dist: '۲۱۸٫۳ km', max: '۹۶ km/h' },
                      { idx: 3, x: 100, label: 'سفر ۴', dist: '۹۱٫۲ km', max: '۸۴ km/h' },
                    ].map((bead) => {
                      const selected = selectedTripIndex === bead.idx;
                      return (
                        <g
                          key={bead.idx}
                          transform={`translate(${bead.x}, 95)`}
                          onClick={() => setSelectedTripIndex(bead.idx)}
                          className="cursor-pointer"
                        >
                          <circle
                            r={selected ? 22 : 14}
                            fill={selected ? 'var(--color-orange-500)' : 'var(--color-navy-800)'}
                            stroke="var(--color-beige-200)"
                            strokeWidth="2"
                          />
                          <text y="-32" textAnchor="middle" fill="var(--color-beige-50)" fontSize="12" fontWeight="800">
                            {bead.label}
                          </text>
                          <text y="44" textAnchor="middle" fill="var(--color-orange-400)" fontSize="11" fontWeight="700">
                            {bead.dist}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedTripIndex(idx)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        style={{
                          backgroundColor: selectedTripIndex === idx ? 'var(--color-orange-500)' : 'var(--color-navy-800)',
                          color: selectedTripIndex === idx ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                        }}
                      >
                        انتخاب سفر {toPersianDigits(idx + 1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. STOP METAPHOR */}
              {activeReport.id === 'stop' && (
                <div>
                  <svg viewBox="0 0 600 190" className="w-full h-auto" role="img" aria-label="حلقه‌های زمان توقف زیر پین نقشه">
                    <line x1="40" y1="105" x2="560" y2="105" stroke="var(--color-navy-700)" strokeWidth="2" />
                    {STOP_REPORT_DEMO_ENTRIES.map((stp, i) => {
                      const x = 500 - i * 135;
                      const included =
                        stp.durationMinutes >= minStopMinutes &&
                        (maxStopMinutes === null || stp.durationMinutes <= maxStopMinutes);
                      const radius = Math.min(54, 12 + Math.sqrt(stp.durationMinutes) * 2.5);
                      return (
                        <g key={stp.id} transform={`translate(${x}, 105)`} opacity={included ? 1 : 0.25}>
                          <circle
                            r={radius}
                            fill="var(--color-orange-500)"
                            fillOpacity="0.22"
                            stroke="var(--color-orange-500)"
                            strokeWidth="2"
                          />
                          <circle r="6" fill="var(--color-beige-50)" />
                          <text y="-62" textAnchor="middle" fill="var(--color-beige-50)" fontSize="11" fontWeight="700">
                            {toPersianDigits(stp.durationMinutes)} دقیقه
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <label htmlFor="stop-min-slider" className="text-xs">
                        حداقل زمان توقف (حذف توقف‌های کوتاه):
                      </label>
                      <input
                        id="stop-min-slider"
                        type="range"
                        min={0}
                        max={60}
                        step={5}
                        value={minStopMinutes}
                        onChange={(e) => setMinStopMinutes(Number(e.target.value))}
                        className="w-28 accent-[#FF742E] cursor-pointer"
                      />
                      <span className="text-xs font-bold font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                        {toPersianDigits(minStopMinutes)} دقیقه
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMaxStopMinutes(maxStopMinutes === null ? 180 : null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        style={{
                          backgroundColor: 'var(--color-navy-800)',
                          color: 'var(--color-beige-200)',
                        }}
                      >
                        حداکثر توقف: {maxStopMinutes === null ? 'نامحدود' : `${toPersianDigits(maxStopMinutes)} دقیقه`}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. DAILY METAPHOR */}
              {activeReport.id === 'daily' && (
                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                  <svg viewBox="0 0 220 220" className="w-44 h-44 shrink-0" role="img" aria-label="حلقه ساعت کارکرد روزانه موتور">
                    <circle cx="110" cy="110" r="82" fill="none" stroke="var(--color-navy-800)" strokeWidth="18" />
                    {/* Movement arc */}
                    <circle
                      cx="110"
                      cy="110"
                      r="82"
                      fill="none"
                      stroke="var(--color-orange-500)"
                      strokeWidth="18"
                      strokeDasharray={shiftMode === 'standard' ? '310 520' : '380 520'}
                      strokeLinecap="round"
                      transform="rotate(-90 110 110)"
                    />
                    {/* Idle arc */}
                    <circle
                      cx="110"
                      cy="110"
                      r="60"
                      fill="none"
                      stroke="#D99B52"
                      strokeWidth="10"
                      strokeDasharray={shiftMode === 'standard' ? '85 400' : '130 400'}
                      strokeLinecap="round"
                      transform="rotate(110 110 110)"
                    />
                    <text x="110" y="104" textAnchor="middle" fill="var(--color-beige-50)" fontSize="14" fontWeight="800">
                      {shiftMode === 'standard' ? '۰۷:۴۰ حرکت' : '۰۹:۲۰ حرکت'}
                    </text>
                    <text x="110" y="126" textAnchor="middle" fill="var(--color-orange-400)" fontSize="11">
                      {shiftMode === 'standard' ? '۰۱:۱۵ درجا (Idle)' : '۰۱:۵۰ درجا (Idle)'}
                    </text>
                  </svg>
                  <div className="space-y-3 text-xs">
                    <p className="font-bold text-sm" style={{ color: 'var(--color-beige-50)' }}>
                      بازه روز کاری و ساعت استارت
                    </p>
                    <p style={{ color: 'var(--color-beige-200)' }}>
                      اولین روشن شدن سوئیچ: <strong className="font-tabular">۰۶:۱۲ صبح</strong> · آخرین خاموشی: <strong className="font-tabular">۱۹:۴۸ عصر</strong>
                    </p>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShiftMode('standard')}
                        className="px-3 py-1.5 rounded-lg font-semibold cursor-pointer"
                        style={{
                          backgroundColor: shiftMode === 'standard' ? 'var(--color-orange-500)' : 'var(--color-navy-800)',
                          color: shiftMode === 'standard' ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                        }}
                      >
                        شیفت استاندارد (۰۷ تا ۱۹)
                      </button>
                      <button
                        type="button"
                        onClick={() => setShiftMode('extended')}
                        className="px-3 py-1.5 rounded-lg font-semibold cursor-pointer"
                        style={{
                          backgroundColor: shiftMode === 'extended' ? 'var(--color-orange-500)' : 'var(--color-navy-800)',
                          color: shiftMode === 'extended' ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                        }}
                      >
                        شیفت سنگین ترانزیت
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. PERFORMANCE METAPHOR */}
              {activeReport.id === 'performance' && (
                <div>
                  <div className="space-y-3 my-2">
                    {[
                      { name: 'کشنده داف XF-۵۳۰ (کد ۱۰۴)', dist: 96, speed: 88, fuel: 74, labelDist: '۳٬۱۲۰ km', labelSpeed: '۷۲ km/h', labelFuel: '۲۷٫۱ L' },
                      { name: 'کشنده ولوو FH-۴۸۰ (کد ۱۰۱)', dist: 86, speed: 82, fuel: 79, labelDist: '۲٬۸۴۰ km', labelSpeed: '۶۸ km/h', labelFuel: '۲۸٫۴ L' },
                      { name: 'کامیونت ایسوزو ۶ تن (کد ۲۰۸)', dist: 54, speed: 66, fuel: 48, labelDist: '۱٬۶۹۰ km', labelSpeed: '۵۴ km/h', labelFuel: '۱۶٫۵ L' },
                      { name: 'وانت نیسان یخچالی (کد ۳۱۲)', dist: 42, speed: 58, fuel: 41, labelDist: '۱٬۲۴۰ km', labelSpeed: '۴۹ km/h', labelFuel: '۱۴٫۲ L' },
                    ].map((row) => {
                      const pct = perfMetric === 'distance' ? row.dist : perfMetric === 'speed' ? row.speed : row.fuel;
                      const valText = perfMetric === 'distance' ? row.labelDist : perfMetric === 'speed' ? row.labelSpeed : row.labelFuel;
                      return (
                        <div key={row.name} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{row.name}</span>
                            <span className="font-bold font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                              {valText}
                            </span>
                          </div>
                          <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-navy-800)' }}>
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: 'var(--color-orange-500)',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { id: 'distance', label: 'مقایسه بر اساس مسافت' },
                      { id: 'speed', label: 'مقایسه بر اساس میانگین سرعت' },
                      { id: 'fuel', label: 'مقایسه مصرف سوخت (با سنسور سازگار)' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPerfMetric(m.id as 'distance' | 'speed' | 'fuel')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        style={{
                          backgroundColor: perfMetric === m.id ? 'var(--color-orange-500)' : 'var(--color-navy-800)',
                          color: perfMetric === m.id ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. GEOFENCE METAPHOR */}
              {activeReport.id === 'geofence' && (
                <div>
                  <svg viewBox="0 0 600 185" className="w-full h-auto" role="img" aria-label="تفکیک حضور داخل و خارج از محدوده">
                    <polygon
                      points="180,35 420,35 460,150 140,150"
                      fill="rgba(255, 116, 46, 0.14)"
                      stroke="var(--color-beige-200)"
                      strokeWidth="2"
                    />
                    {includeInside && (
                      <path
                        d="M 200 95 L 390 95"
                        stroke="var(--color-orange-500)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    )}
                    {includeOutside && (
                      <path
                        d="M 40 130 L 160 110 M 435 110 L 560 70"
                        stroke="#8AB0C7"
                        strokeWidth="5"
                        strokeDasharray="8 6"
                        strokeLinecap="round"
                      />
                    )}
                    <text x="300" y="72" textAnchor="middle" fill="var(--color-beige-50)" fontSize="12" fontWeight="700">
                      {selectedGeofenceSite}
                    </text>
                  </svg>
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs">
                    <select
                      aria-label="انتخاب محدوده جغرافیایی"
                      value={selectedGeofenceSite}
                      onChange={(e) => setSelectedGeofenceSite(e.target.value)}
                      className="px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: 'var(--color-navy-800)', color: 'var(--color-beige-50)' }}
                    >
                      <option value="انبار مرکزی کرج (چندضلعی)">انبار مرکزی کرج (چندضلعی)</option>
                      <option value="پایانه لجستیک جنوب (دایره)">پایانه لجستیک جنوب (دایره)</option>
                    </select>
                    <div className="flex items-center gap-4">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeInside}
                          onChange={(e) => setIncludeInside(e.target.checked)}
                          className="accent-[#FF742E]"
                        />
                        <span>داخل محدوده</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeOutside}
                          onChange={(e) => setIncludeOutside(e.target.checked)}
                          className="accent-[#FF742E]"
                        />
                        <span>خارج از محدوده</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. EVENT METAPHOR */}
              {activeReport.id === 'event' && (
                <div>
                  <svg viewBox="0 0 600 180" className="w-full h-auto" role="img" aria-label="منورهای رویداد روی خط زمان">
                    <line x1="40" y1="130" x2="560" y2="130" stroke="var(--color-beige-400)" strokeWidth="2" />
                    {[
                      { type: 'ورود به محدوده', x: 480, time: '۱۰:۰۴' },
                      { type: 'سرعت غیرمجاز', x: 355, time: '۱۱:۴۲' },
                      { type: 'روشن شدن سوئیچ', x: 230, time: '۱۳:۱۸' },
                      { type: 'نشت سوخت', x: 105, time: '۱۵:۳۰' },
                    ].map((ev) => {
                      const active = selectedEventTypes.includes(ev.type);
                      return (
                        <g key={ev.type} transform={`translate(${ev.x}, 130)`} opacity={active ? 1 : 0.2}>
                          <line x1="0" y1="0" x2="0" y2="-65" stroke="var(--color-orange-500)" strokeWidth="2.5" />
                          <circle cy="-65" r="9" fill="var(--color-orange-500)" />
                          <text y="-82" textAnchor="middle" fill="var(--color-beige-50)" fontSize="11" fontWeight="700">
                            {ev.type}
                          </text>
                          <text y="22" textAnchor="middle" fill="var(--color-orange-400)" fontSize="10">
                            {ev.time}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['ورود به محدوده', 'سرعت غیرمجاز', 'روشن شدن سوئیچ', 'نشت سوخت'].map((evt) => {
                      const active = selectedEventTypes.includes(evt);
                      return (
                        <button
                          key={evt}
                          type="button"
                          onClick={() => toggleEventType(evt)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                          style={{
                            backgroundColor: active ? 'var(--color-orange-500)' : 'var(--color-navy-800)',
                            color: active ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                          }}
                        >
                          {evt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 8. HEATMAP METAPHOR */}
              {activeReport.id === 'heatmap' && (
                <div>
                  <svg viewBox="0 0 600 190" className="w-full h-auto" role="img" aria-label="توپوگرافی نقشه حرارتی تراکم تردد">
                    <defs>
                      <radialGradient id="heatSpot" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FF742E" stopOpacity="0.85" />
                        <stop offset="55%" stopColor="#FF742E" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#102333" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    {(heatmapCorridor === 'all' || heatmapCorridor === 'tehran-west') && (
                      <circle cx="410" cy="95" r="78" fill="url(#heatSpot)" />
                    )}
                    {(heatmapCorridor === 'all' || heatmapCorridor === 'karaj') && (
                      <circle cx="220" cy="105" r="64" fill="url(#heatSpot)" />
                    )}
                    <path
                      d="M 80 145 Q 220 55 350 110 T 530 75"
                      fill="none"
                      stroke="var(--color-beige-100)"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                    />
                  </svg>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      { id: 'all', label: 'همه گروه‌های سازمانی (چنددستگاهی)' },
                      { id: 'tehran-west', label: 'کریدور غرب تهران (۴۲٪ تراکم)' },
                      { id: 'karaj', label: 'پایانه و انبار کرج (۲۷٪ تراکم)' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setHeatmapCorridor(c.id as 'all' | 'tehran-west' | 'karaj')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        style={{
                          backgroundColor: heatmapCorridor === c.id ? 'var(--color-orange-500)' : 'var(--color-navy-800)',
                          color: heatmapCorridor === c.id ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                        }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 9. TEMPERATURE METAPHOR */}
              {activeReport.id === 'temperature' && (
                <div>
                  <svg viewBox="0 0 600 185" className="w-full h-auto" role="img" aria-label="نمودار بلور یخ و دمای زنجیره سرد">
                    <rect
                      x="40"
                      y="25"
                      width="520"
                      height="130"
                      rx="18"
                      fill={containerTemp <= 0 ? 'rgba(138, 176, 199, 0.22)' : 'rgba(255, 116, 46, 0.22)'}
                      stroke={containerTemp <= 0 ? '#8AB0C7' : 'var(--color-orange-500)'}
                      strokeWidth="2"
                    />
                    <path
                      d="M 70 95 Q 190 65 300 95 T 530 85"
                      fill="none"
                      stroke={containerTemp <= 0 ? '#8AB0C7' : 'var(--color-orange-500)'}
                      strokeWidth="4"
                    />
                    <text x="300" y="65" textAnchor="middle" fill="var(--color-beige-50)" fontSize="15" fontWeight="800">
                      دمای کانتینر: {toPersianDigits(containerTemp.toFixed(1))} درجه سانتی‌گراد
                    </text>
                    <text x="300" y="132" textAnchor="middle" fill="var(--color-beige-200)" fontSize="11">
                      {containerTemp <= 0
                        ? 'وضعیت زنجیره سرد: انجماد استاندارد و ایمن (با سنسور دمای سازگار)'
                        : 'هشدار افزایش دما: خارج از بازه انجماد استاندارد'}
                    </text>
                  </svg>
                  <div className="flex items-center gap-3 mt-3 text-xs">
                    <label htmlFor="temp-slider">تغییر دمای شبیه‌ساز سنسور:</label>
                    <input
                      id="temp-slider"
                      type="range"
                      min={-18}
                      max={8}
                      step={0.5}
                      value={containerTemp}
                      onChange={(e) => setContainerTemp(Number(e.target.value))}
                      className="w-36 accent-[#FF742E] cursor-pointer"
                    />
                    <span className="font-bold font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                      {toPersianDigits(containerTemp)} °C
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs mt-4 pt-3 border-t leading-relaxed" style={{ borderColor: 'var(--surface-dark-border)', color: 'var(--color-beige-200)' }}>
                {activeReport.metaphorDescription}
              </p>
            </div>

            {/* 5 cols: Authentic Inputs, Outputs & Hardware Dependency Card */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="card-light-elevated p-5">
                <h4 className="text-xs font-extrabold mb-2.5" style={{ color: 'var(--color-navy-900)' }}>
                  ورودی‌های گزارش در مای‌فرزام (Inputs):
                </h4>
                <ul className="space-y-2 text-xs leading-relaxed" style={{ color: 'var(--color-navy-800)' }}>
                  {activeReport.inputsObserved.map((inp) => (
                    <li key={inp} className="flex items-start gap-2">
                      <span className="font-bold" style={{ color: 'var(--color-orange-600)' }}>•</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-light-elevated p-5">
                <h4 className="text-xs font-extrabold mb-2.5" style={{ color: 'var(--color-navy-900)' }}>
                  خروجی‌ها و مستندات (Outputs):
                </h4>
                <ul className="space-y-2 text-xs leading-relaxed" style={{ color: 'var(--color-navy-800)' }}>
                  {activeReport.outputsObserved.map((out) => (
                    <li key={out} className="flex items-start gap-2">
                      <span className="font-bold" style={{ color: 'var(--color-orange-600)' }}>•</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="p-4 rounded-2xl text-xs leading-relaxed"
                style={{
                  backgroundColor: 'var(--color-beige-100)',
                  color: 'var(--color-navy-900)',
                }}
              >
                <strong className="block mb-1">وابستگی سخت‌افزاری (Hardware Dependency):</strong>
                {activeReport.hardwareDependency}
              </div>
            </div>
          </div>

          {/* Bottom Row: Generated Report Table (with special interactive filtering on Stop report) */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--color-beige-100)' }}>
            <div className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: 'var(--color-navy-900)', color: 'var(--color-beige-50)' }}>
              <span className="text-xs font-bold">
                پیش‌نمایش جدول نتایج «{activeReport.persianName}» (داده‌های نمایشی ناوگان)
              </span>
              <span className="text-[11px] font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                {activeReport.id === 'stop'
                  ? `${toPersianDigits(filteredStopEntries.length)} ردیف منطبق با فیلتر زمان توقف`
                  : `${toPersianDigits(activeReport.tableRows.length)} ردیف نمونه`}
              </span>
            </div>

            <div className="overflow-x-auto">
              {activeReport.id === 'stop' ? (
                <table className="w-full text-right text-xs border-collapse font-tabular">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-beige-200)', color: 'var(--color-navy-900)' }}>
                      <th className="py-3 px-4 font-bold">واحد ناوگان</th>
                      <th className="py-3 px-4 font-bold">شروع توقف</th>
                      <th className="py-3 px-4 font-bold">پایان توقف</th>
                      <th className="py-3 px-4 font-bold">مدت توقف</th>
                      <th className="py-3 px-4 font-bold">نشانی مکانی (نمایشی)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStopEntries.map((row) => (
                      <tr key={row.id} className="border-t" style={{ borderColor: 'var(--color-beige-300)' }}>
                        <td className="py-3 px-4 font-semibold">{row.deviceLabel}</td>
                        <td className="py-3 px-4">{row.startTime}</td>
                        <td className="py-3 px-4">{row.endTime}</td>
                        <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-orange-600)' }}>
                          {row.durationLabel}
                        </td>
                        <td className="py-3 px-4">{row.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-right text-xs border-collapse font-tabular">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-beige-200)', color: 'var(--color-navy-900)' }}>
                      {activeReport.tableHeaders.map((hdr) => (
                        <th key={hdr} className="py-3 px-4 font-bold whitespace-nowrap">
                          {hdr}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeReport.tableRows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="border-t"
                        style={{
                          borderColor: 'var(--color-beige-300)',
                          backgroundColor:
                            activeReport.id === 'trip' && rIdx === selectedTripIndex
                              ? 'rgba(255, 116, 46, 0.12)'
                              : 'transparent',
                        }}
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-3 px-4 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
