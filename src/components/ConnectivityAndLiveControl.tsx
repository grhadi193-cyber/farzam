import React, { useState } from 'react';
import {
  MYFARZAM_NOTIFICATIONS,
  type NotificationItem,
} from '../data/farzamData';
import {
  toPersianDigits,
  validateSimNumber,
  validateTrackerImei,
  type FleetDeviceRecord,
} from '../utils/telemetryLogic';

interface ConnectivityAndLiveControlProps {
  devices: FleetDeviceRecord[];
  onRegisterDevice: (newDevice: FleetDeviceRecord) => void;
}

export const ConnectivityAndLiveControl: React.FC<ConnectivityAndLiveControlProps> = ({
  devices,
  onRegisterDevice,
}) => {
  // Chapter 3: Add Device (افزودن دستگاه) state
  const [imei, setImei] = useState('۸۶۴۲۰۱۰۹۴۸۲۱۱۸۸');
  const [model, setModel] = useState('FZ-Pro T800 (صنعتی)');
  const [sim, setSim] = useState('۰۹۱۲۰۰۴۸۱۸۸');
  const [label, setLabel] = useState('کشنده اسکانیا G410 (کد ۱۱۸)');
  const [timeBasis, setTimeBasis] = useState<'UTC' | 'LOCAL'>('UTC');
  const [timezone, setTimezone] = useState('Asia/Tehran (+03:30)');
  const [platePart, setPlatePart] = useState('۵۲ ع ۶۴۱ - ایران ۱۱');
  const [formError, setFormError] = useState<string | null>(null);
  const [justRegisteredLabel, setJustRegisteredLabel] = useState<string | null>(null);

  // Chapter 4: Live Control (Geofence + Notifications) state
  const [geofenceGeometry, setGeofenceGeometry] = useState<'circle' | 'polygon' | 'polyline'>('polygon');
  const [geofenceScenario, setGeofenceScenario] = useState<'inside' | 'exit' | 'overspeed'>('inside');
  const [maxSpeedLimit, setMaxSpeedLimit] = useState(80);
  const [activeNotifTab, setActiveNotifTab] = useState<NotificationItem['category']>('alerts');
  const [selectedNotifId, setSelectedNotifId] = useState<string>(MYFARZAM_NOTIFICATIONS[0].id);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const imeiCheck = validateTrackerImei(imei);
    if (!imeiCheck.valid) {
      setFormError(imeiCheck.error ?? 'خطا در شناسه دستگاه');
      return;
    }
    const simCheck = validateSimNumber(sim);
    if (!simCheck.valid) {
      setFormError(simCheck.error ?? 'خطا در شماره سیم‌کارت');
      return;
    }
    if (!label.trim()) {
      setFormError('برچسب خودرو یا شخص را وارد کنید.');
      return;
    }

    setFormError(null);
    const created: FleetDeviceRecord = {
      id: `dev-${Date.now()}`,
      label: label.trim(),
      imei: imeiCheck.normalized,
      model,
      sim: simCheck.normalized,
      plate: platePart.trim() || 'ثبت‌نشده',
      group: 'ترانزیت جاده‌ای',
      poweredOn: true,
      moving: true,
      activeLocation: true,
      speedKmh: 76,
      voltage: 24.3,
      temperatureC: model.includes('Cold') ? -4.0 : null,
      fuelLitersPer100Km: 26.8,
      lastPositionText: 'هم‌اکنون (زنده)',
      lastConnectionText: 'هم‌اکنون (زنده)',
      subscriptionType: 'سازمانی',
      subscriptionStatus: 'معتبر',
      subscriptionDaysLeft: 365,
      geofenceState: 'داخل محدوده',
      geofenceName: 'پایانه مرکزی تهران',
      xPct: 44,
      yPct: 46,
    };

    onRegisterDevice(created);
    setJustRegisteredLabel(created.label);
  };

  const applyPreset = (preset: 'heavy' | 'cold' | 'personal') => {
    setFormError(null);
    if (preset === 'heavy') {
      setImei('۸۶۴۲۰۱۰۹۴۸۲۱۱۸۸');
      setModel('FZ-Pro T800 (صنعتی)');
      setSim('۰۹۱۲۰۰۴۸۱۸۸');
      setLabel('کشنده اسکانیا G410 (کد ۱۱۸)');
      setPlatePart('۵۲ ع ۶۴۱ - ایران ۱۱');
    } else if (preset === 'cold') {
      setImei('۸۶۴۲۰۱۰۹۴۸۲۱۱۹۹');
      setModel('FZ-Cold S400 (زنجیره سرد)');
      setSim('۰۹۱۲۰۰۴۸۱۹۹');
      setLabel('کامیونت یخچالی دارو (کد ۲۱۹)');
      setPlatePart('۱۹ ط ۴۳۲ - ایران ۲۲');
    } else {
      setImei('۸۶۴۲۰۱۰۹۴۸۲۱۱۷۷');
      setModel('FZ-Lite P100 (شخصی)');
      setSim('۰۹۱۲۰۰۴۸۱۷۷');
      setLabel('خودروی شخصی مدیریت');
      setPlatePart('۷۴ ب ۸۱۱ - ایران ۴۴');
    }
  };

  const filteredNotifs = MYFARZAM_NOTIFICATIONS.filter((n) => n.category === activeNotifTab);
  const selectedNotif =
    filteredNotifs.find((n) => n.id === selectedNotifId) ?? filteredNotifs[0];

  return (
    <>
      {/* =====================================================================
          CHAPTER 3: CONNECTIVITY (SIM + IMEI -> The Moment a Device Comes Alive)
          ===================================================================== */}
      <section
        id="connectivity"
        aria-labelledby="heading-connectivity"
        className="chapter-navy relative py-16 lg:py-24 border-t"
        style={{ borderColor: 'var(--surface-dark-border)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Editorial Chapter Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-orange-400)' }}>
                ۰۳ · اتصال و بیداری سخت‌افزار (افزودن دستگاه در مای‌فرزام)
              </p>
              <h2 id="heading-connectivity" className="headline-chapter">
                چطور یک قطعه فیزیکی، در یک ثانیه به دارایی زنده روی نقشه تبدیل می‌شود؟
              </h2>
            </div>
            <p
              className="max-w-xl text-base leading-relaxed"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              در مای‌فرزام، ثبت هر ردیاب با شناسه یکتای سخت‌افزار (IMEI/ID)، مدل ردیاب، شماره سیم‌کارت و مبنای زمان آغاز می‌شود. به محض ثبت، رشته سیگنال نخستین پالس موقعیت و اتصال را روشن می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Form Column (5 cols on desktop) */}
            <form
              onSubmit={handleRegisterSubmit}
              className="lg:col-span-5 card-dark p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <h3 className="headline-title">شبیه‌ساز ثبت دستگاه جدید</h3>
                  <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                    داده نمایشی · آماده آزمایش
                  </span>
                </div>

                {/* Preset selector buttons */}
                <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="پیش‌فرض‌های نمایشی دستگاه">
                  <button
                    type="button"
                    onClick={() => applyPreset('heavy')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-navy-950)',
                      color: 'var(--color-beige-100)',
                      border: '1px solid var(--surface-dark-border)',
                    }}
                  >
                    پیش‌فرض کشنده ترانزیت
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('cold')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-navy-950)',
                      color: 'var(--color-beige-100)',
                      border: '1px solid var(--surface-dark-border)',
                    }}
                  >
                    پیش‌فرض کامیونت یخچالی
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('personal')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-navy-950)',
                      color: 'var(--color-beige-100)',
                      border: '1px solid var(--surface-dark-border)',
                    }}
                  >
                    پیش‌فرض خودروی شخصی
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="input-imei" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                      شناسه یکتای ردیاب (IMEI / ID) *
                    </label>
                    <input
                      id="input-imei"
                      type="text"
                      value={imei}
                      onChange={(e) => setImei(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm font-tabular"
                      style={{
                        backgroundColor: 'var(--color-navy-950)',
                        color: 'var(--color-beige-50)',
                        border: '1px solid var(--surface-dark-border)',
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="select-model" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                        مدل ردیاب *
                      </label>
                      <select
                        id="select-model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                        style={{
                          backgroundColor: 'var(--color-navy-950)',
                          color: 'var(--color-beige-50)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      >
                        <option value="FZ-Pro T800 (صنعتی)">FZ-Pro T800 (صنعتی)</option>
                        <option value="FZ-Cold S400 (زنجیره سرد)">FZ-Cold S400 (زنجیره سرد)</option>
                        <option value="FZ-City M200 (شهری)">FZ-City M200 (شهری)</option>
                        <option value="FZ-Lite P100 (شخصی)">FZ-Lite P100 (شخصی)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="input-sim" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                        شماره سیم‌کارت دستگاه *
                      </label>
                      <input
                        id="input-sim"
                        type="text"
                        value={sim}
                        onChange={(e) => setSim(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm font-tabular"
                        style={{
                          backgroundColor: 'var(--color-navy-950)',
                          color: 'var(--color-beige-50)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="input-label" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                        برچسب خودرو یا شخص *
                      </label>
                      <input
                        id="input-label"
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                        style={{
                          backgroundColor: 'var(--color-navy-950)',
                          color: 'var(--color-beige-50)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="input-plate" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                        پلاک خودرو (اختیاری)
                      </label>
                      <input
                        id="input-plate"
                        type="text"
                        value={platePart}
                        onChange={(e) => setPlatePart(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm font-tabular"
                        style={{
                          backgroundColor: 'var(--color-navy-950)',
                          color: 'var(--color-beige-50)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Time basis toggle (UTC default vs Local device time) */}
                  <div>
                    <span className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                      مبنای زمان دستگاه
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTimeBasis('UTC')}
                        className="py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        style={{
                          backgroundColor: timeBasis === 'UTC' ? 'var(--color-orange-500)' : 'var(--color-navy-950)',
                          color: timeBasis === 'UTC' ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      >
                        ساعت جهانی UTC (پیش‌فرض)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeBasis('LOCAL')}
                        className="py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        style={{
                          backgroundColor: timeBasis === 'LOCAL' ? 'var(--color-orange-500)' : 'var(--color-navy-950)',
                          color: timeBasis === 'LOCAL' ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      >
                        زمان محلی دستگاه
                      </button>
                    </div>
                  </div>

                  {timeBasis === 'LOCAL' && (
                    <div>
                      <label htmlFor="select-tz" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                        منطقه زمانی محلی
                      </label>
                      <select
                        id="select-tz"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs"
                        style={{
                          backgroundColor: 'var(--color-navy-950)',
                          color: 'var(--color-beige-50)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      >
                        <option value="Asia/Tehran (+03:30)">ایران — تهران (UTC+03:30)</option>
                        <option value="Europe/Istanbul (+03:00)">ترکیه — استانبول (UTC+03:00)</option>
                        <option value="Asia/Dubai (+04:00)">امارات — دبی (UTC+04:00)</option>
                      </select>
                    </div>
                  )}
                </div>

                {formError && (
                  <p role="alert" className="mt-4 text-xs font-semibold" style={{ color: 'var(--color-orange-400)' }}>
                    {formError}
                  </p>
                )}

                {justRegisteredLabel && (
                  <div
                    role="status"
                    className="mt-4 p-3 rounded-xl text-xs"
                    style={{
                      backgroundColor: 'var(--color-orange-soft)',
                      border: '1px solid var(--color-orange-500)',
                      color: 'var(--color-beige-50)',
                    }}
                  >
                    دستگاه <strong>«{justRegisteredLabel}»</strong> با موفقیت ثبت شد و به نقشه زنده و داشبورد ناوگان پیوست.
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--surface-dark-border)' }}>
                <button type="submit" className="btn-signal-primary w-full">
                  ثبت و ادامه (بیداری دستگاه روی نقشه)
                </button>
              </div>
            </form>

            {/* Visual Bridge Column (7 cols on desktop): Signal Packet Journey */}
            <div className="lg:col-span-7 card-dark p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
                    فرآیند احراز و همگام‌سازی زنده
                  </span>
                  <h3 className="headline-title mt-1">
                    مسیر تبدیل شناسه سخت‌افزاری به نقطه زنده روی نقشه
                  </h3>
                </div>
                <span className="text-xs font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                  تعداد کل واحدهای ثبت‌شده در جلسه فعلی: {toPersianDigits(devices.length)} دستگاه
                </span>
              </div>

              {/* SVG Signal Awakening Schematic */}
              <div
                className="relative rounded-2xl p-4 sm:p-6 my-2"
                style={{
                  backgroundColor: 'var(--color-navy-950)',
                  border: '1px solid var(--surface-dark-border)',
                }}
              >
                <svg
                  viewBox="0 0 720 240"
                  className="w-full h-auto"
                  role="img"
                  aria-label="نمودار جریان سیگنال از ردیاب و سیم‌کارت به نقشه مای‌فرزام"
                >
                  {/* Background coordinate lines */}
                  <line x1="40" y1="120" x2="680" y2="120" stroke="var(--color-navy-700)" strokeWidth="2" strokeDasharray="6 6" />
                  {/* Living Orange Signal Bridge */}
                  <path
                    d="M 640 120 C 520 45, 440 195, 360 120 C 280 45, 200 195, 80 120"
                    fill="none"
                    stroke="var(--color-orange-500)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Node 1 (Right - RTL Start): IMEI + Hardware */}
                  <g transform="translate(560, 68)">
                    <rect width="130" height="104" rx="18" fill="var(--color-navy-800)" stroke="var(--color-orange-500)" strokeWidth="2" />
                    <text x="65" y="38" textAnchor="middle" fill="var(--color-beige-50)" fontSize="13" fontWeight="700">
                      ۱. سخت‌افزار ردیاب
                    </text>
                    <text x="65" y="62" textAnchor="middle" fill="var(--color-beige-200)" fontSize="11">
                      IMEI + مدل دستگاه
                    </text>
                    <text x="65" y="84" textAnchor="middle" fill="var(--color-orange-400)" fontSize="10">
                      {toPersianDigits(imei.slice(-6))}...
                    </text>
                  </g>

                  {/* Node 2 (Center): SIM + Time Basis */}
                  <g transform="translate(295, 68)">
                    <rect width="130" height="104" rx="18" fill="var(--color-navy-800)" stroke="var(--color-beige-300)" strokeWidth="1.5" />
                    <text x="65" y="38" textAnchor="middle" fill="var(--color-beige-50)" fontSize="13" fontWeight="700">
                      ۲. سیم‌کارت و زمان
                    </text>
                    <text x="65" y="62" textAnchor="middle" fill="var(--color-beige-200)" fontSize="11">
                      {toPersianDigits(sim)}
                    </text>
                    <text x="65" y="84" textAnchor="middle" fill="var(--color-beige-400)" fontSize="10">
                      مبنا: {timeBasis === 'UTC' ? 'UTC جهانی' : 'زمان محلی'}
                    </text>
                  </g>

                  {/* Node 3 (Left - RTL End): Live Map Asset */}
                  <g transform="translate(25, 68)">
                    <rect width="140" height="104" rx="18" fill="var(--color-orange-500)" />
                    <text x="70" y="38" textAnchor="middle" fill="var(--color-navy-950)" fontSize="13" fontWeight="800">
                      ۳. دارایی زنده روی نقشه
                    </text>
                    <text x="70" y="62" textAnchor="middle" fill="var(--color-navy-950)" fontSize="11" fontWeight="600">
                      آخرین اتصال: هم‌اکنون
                    </text>
                    <text x="70" y="84" textAnchor="middle" fill="var(--color-navy-900)" fontSize="10" fontWeight="700">
                      آماده گزارش‌گیری
                    </text>
                  </g>
                </svg>
              </div>

              {/* Recently Registered / Active Fleet Strip */}
              <div className="mt-4">
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  واحدهای متصل در جدول «مدیریت دستگاه‌ها» (همگام با داشبورد):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {devices.slice(0, 4).map((dev) => (
                    <div
                      key={dev.id}
                      className="p-3.5 rounded-xl flex items-center justify-between gap-3"
                      style={{
                        backgroundColor: 'var(--color-navy-950)',
                        border: '1px solid var(--surface-dark-border)',
                      }}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: 'var(--color-beige-50)' }}>
                          {dev.label}
                        </p>
                        <p className="text-[11px] font-tabular mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
                          پلاک: {dev.plate} · آخرین اتصال: {dev.lastConnectionText}
                        </p>
                      </div>
                      <span
                        className="text-[11px] font-semibold shrink-0"
                        style={{
                          color: dev.poweredOn ? 'var(--color-orange-400)' : 'var(--text-on-dark-muted)',
                        }}
                      >
                        {dev.poweredOn ? (dev.moving ? 'در حرکت' : 'روشن (متوقف)') : 'خاموش'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CHAPTER 4: LIVE CONTROL (Map, Geofence Glass Dome & 3-Tab Notifications)
          ===================================================================== */}
      <section
        id="live-control"
        aria-labelledby="heading-live-control"
        className="chapter-dark relative py-16 lg:py-24 border-t"
        style={{ borderColor: 'var(--surface-dark-border)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-orange-400)' }}>
                ۰۴ · کنترل زنده، مدیریت محدوده‌ها (Geofences) و اعلان‌ها
              </p>
              <h2 id="heading-live-control" className="headline-chapter">
                آیا ناوگان در مسیر و محدوده مجاز حرکت می‌کند؟ بدون چشم دوختن دائمی به نقشه بدانید.
              </h2>
            </div>
            <p
              className="max-w-xl text-base leading-relaxed"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              محدوده‌های جغرافیایی را به شکل دایره، چندضلعی یا مسیر خطی به همراه سقف سرعت مجاز تعریف کنید. هر زمان خودرو وارد یا خارج شود، یا سرویس دوره‌ای و انقضای اشتراک فرا برسد، مرکز اعلان‌ها شما را آگاه می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left/Right 7 cols: Interactive Geofence Glass Dome Stage */}
            <div className="lg:col-span-7 card-dark p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="headline-title">گنبد محدوده جغرافیایی و سقف سرعت</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                    هندسه محدوده و وضعیت عبور رشته سیگنال را تغییر دهید
                  </p>
                </div>

                {/* Geometry Switcher (Circle, Polygon, Polyline from farzam-features.md) */}
                <div
                  className="flex items-center gap-1 p-1 rounded-xl"
                  style={{ backgroundColor: 'var(--color-navy-950)' }}
                  role="group"
                  aria-label="نوع هندسه محدوده"
                >
                  {[
                    { id: 'polygon', label: 'چندضلعی (سایت/انبار)' },
                    { id: 'circle', label: 'دایره (شعاع مجاز)' },
                    { id: 'polyline', label: 'خطی (کریدور جاده‌ای)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGeofenceGeometry(item.id as 'circle' | 'polygon' | 'polyline')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                      style={{
                        backgroundColor:
                          geofenceGeometry === item.id ? 'var(--color-orange-500)' : 'transparent',
                        color:
                          geofenceGeometry === item.id
                            ? 'var(--color-navy-950)'
                            : 'var(--color-beige-200)',
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive SVG 3D-Perspective Geofence Dome Map */}
              <div
                className="relative rounded-2xl overflow-hidden p-4 sm:p-6"
                style={{
                  backgroundColor: 'var(--color-navy-950)',
                  border: '1px solid var(--surface-dark-border)',
                }}
              >
                <svg
                  viewBox="0 0 680 320"
                  className="w-full h-auto"
                  role="img"
                  aria-label="نمایش تعاملی عبور رشته سیگنال از گنبد محدوده جغرافیایی"
                >
                  <defs>
                    <radialGradient id="domeGrad" cx="50%" cy="45%" r="55%">
                      <stop
                        offset="0%"
                        stopColor={
                          geofenceScenario === 'inside'
                            ? '#8AB0C7'
                            : '#FF742E'
                        }
                        stopOpacity="0.28"
                      />
                      <stop
                        offset="100%"
                        stopColor="#102333"
                        stopOpacity="0.05"
                      />
                    </radialGradient>
                  </defs>

                  {/* Isometric Map Grid */}
                  <g stroke="var(--color-navy-700)" strokeWidth="1" opacity="0.55">
                    <line x1="40" y1="260" x2="640" y2="260" />
                    <line x1="80" y1="210" x2="600" y2="210" />
                    <line x1="120" y1="160" x2="560" y2="160" />
                    <line x1="160" y1="110" x2="520" y2="110" />
                    <line x1="140" y1="90" x2="60" y2="280" />
                    <line x1="270" y1="90" x2="220" y2="280" />
                    <line x1="410" y1="90" x2="460" y2="280" />
                    <line x1="540" y1="90" x2="620" y2="280" />
                  </g>

                  {/* Geofence Boundary Shape */}
                  {geofenceGeometry === 'circle' && (
                    <g>
                      <ellipse
                        cx="340"
                        cy="195"
                        rx="155"
                        ry="68"
                        fill="url(#domeGrad)"
                        stroke={geofenceScenario === 'inside' ? 'var(--color-beige-200)' : 'var(--color-orange-500)'}
                        strokeWidth="2.5"
                      />
                      <path
                        d="M 185 195 A 155 125 0 0 1 495 195"
                        fill="url(#domeGrad)"
                        stroke="var(--color-beige-200)"
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                      />
                    </g>
                  )}

                  {geofenceGeometry === 'polygon' && (
                    <g>
                      <polygon
                        points="210,145 350,115 485,155 450,245 235,245"
                        fill="url(#domeGrad)"
                        stroke={geofenceScenario === 'inside' ? 'var(--color-beige-200)' : 'var(--color-orange-500)'}
                        strokeWidth="2.5"
                      />
                      {/* Vertical 3D walls of polygon geofence */}
                      <polygon
                        points="210,145 350,115 485,155 485,105 350,65 210,95"
                        fill="url(#domeGrad)"
                        stroke="var(--color-beige-200)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    </g>
                  )}

                  {geofenceGeometry === 'polyline' && (
                    <g>
                      <path
                        d="M 90 225 Q 250 120 360 185 T 600 135"
                        fill="none"
                        stroke="var(--color-navy-700)"
                        strokeWidth="38"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 90 225 Q 250 120 360 185 T 600 135"
                        fill="none"
                        stroke="var(--color-beige-300)"
                        strokeWidth="2"
                        strokeDasharray="8 6"
                      />
                    </g>
                  )}

                  {/* The Living Signal Line passing through the geofence */}
                  <path
                    d="M 630 215 C 510 205, 430 165, 340 180 C 250 195, 170 150, 60 135"
                    fill="none"
                    stroke="var(--color-orange-500)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />

                  {/* Active Vehicle Marker Position depending on scenario */}
                  {geofenceScenario === 'inside' && (
                    <g transform="translate(340, 180)">
                      <circle r="18" fill="var(--color-orange-500)" fillOpacity="0.25" />
                      <circle r="8" fill="var(--color-orange-500)" />
                      <rect x="-75" y="-44" width="150" height="28" rx="8" fill="var(--color-navy-900)" stroke="var(--color-beige-200)" strokeWidth="1" />
                      <text x="0" y="-26" textAnchor="middle" fill="var(--color-beige-50)" fontSize="11" fontWeight="700">
                        داخل محدوده · سرعت: {toPersianDigits(Math.min(62, maxSpeedLimit - 10))} km/h
                      </text>
                    </g>
                  )}

                  {geofenceScenario === 'exit' && (
                    <g transform="translate(135, 148)">
                      <circle r="22" fill="var(--color-orange-500)" fillOpacity="0.35" />
                      <circle r="9" fill="var(--color-orange-500)" />
                      <rect x="-85" y="-46" width="170" height="28" rx="8" fill="var(--color-orange-500)" />
                      <text x="0" y="-28" textAnchor="middle" fill="var(--color-navy-950)" fontSize="11" fontWeight="800">
                        رویداد خروج از محدوده ثبت شد!
                      </text>
                    </g>
                  )}

                  {geofenceScenario === 'overspeed' && (
                    <g transform="translate(340, 180)">
                      <circle r="24" fill="var(--color-orange-500)" fillOpacity="0.4" />
                      <circle r="9" fill="var(--color-orange-500)" />
                      <rect x="-95" y="-46" width="190" height="28" rx="8" fill="var(--color-orange-500)" />
                      <text x="0" y="-28" textAnchor="middle" fill="var(--color-navy-950)" fontSize="11" fontWeight="800">
                        هشدار سرعت در محدوده: {toPersianDigits(maxSpeedLimit + 24)} km/h
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Scenario Controls & Max Speed Slider */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="flex flex-wrap gap-2" role="group" aria-label="وضعیت خودرو نسبت به محدوده">
                  {[
                    { id: 'inside', label: 'حضور مجاز داخل محدوده' },
                    { id: 'exit', label: 'خروج از مرز محدوده' },
                    { id: 'overspeed', label: 'عبور از سقف سرعت محدوده' },
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setGeofenceScenario(sc.id as 'inside' | 'exit' | 'overspeed')}
                      className="px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      style={{
                        backgroundColor:
                          geofenceScenario === sc.id ? 'var(--color-orange-500)' : 'var(--color-navy-950)',
                        color:
                          geofenceScenario === sc.id ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                        border: '1px solid var(--surface-dark-border)',
                      }}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>

                <div
                  className="p-3 rounded-xl flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: 'var(--color-navy-950)',
                    border: '1px solid var(--surface-dark-border)',
                  }}
                >
                  <label htmlFor="geofence-speed-slider" className="text-xs whitespace-nowrap" style={{ color: 'var(--text-on-dark-secondary)' }}>
                    حداکثر سرعت مجاز محدوده:
                  </label>
                  <input
                    id="geofence-speed-slider"
                    type="range"
                    min={40}
                    max={110}
                    step={5}
                    value={maxSpeedLimit}
                    onChange={(e) => setMaxSpeedLimit(Number(e.target.value))}
                    className="w-24 accent-[#FF742E] cursor-pointer"
                  />
                  <span className="text-xs font-bold font-tabular whitespace-nowrap" style={{ color: 'var(--color-orange-400)' }}>
                    {toPersianDigits(maxSpeedLimit)} km/h
                  </span>
                </div>
              </div>
            </div>

            {/* 5 cols: Authentic 3-Tab Notifications Feed (Alerts | Maintenance | System) */}
            <div className="lg:col-span-5 card-dark p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="headline-title">مرکز اعلان‌ها (Notifications)</h3>
                  <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                    ۳ دسته رسمی مای‌فرزام
                  </span>
                </div>

                {/* 3 Tabs: Alerts | Maintenance | System */}
                <div
                  className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl mb-5"
                  style={{ backgroundColor: 'var(--color-navy-950)' }}
                  role="tablist"
                  aria-label="دسته‌بندی اعلان‌های مای‌فرزام"
                >
                  {[
                    { id: 'alerts', label: 'هشدارها (Alerts)' },
                    { id: 'maintenance', label: 'سرویس و نگهداری' },
                    { id: 'system', label: 'سیستمی (System)' },
                  ].map((tab) => {
                    const active = activeNotifTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          setActiveNotifTab(tab.id as NotificationItem['category']);
                          const first = MYFARZAM_NOTIFICATIONS.find((n) => n.category === tab.id);
                          if (first) setSelectedNotifId(first.id);
                        }}
                        className="py-2 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center whitespace-nowrap truncate"
                        style={{
                          backgroundColor: active ? 'var(--color-orange-500)' : 'transparent',
                          color: active ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Chronological Notification Feed */}
                <div className="space-y-3">
                  {filteredNotifs.map((item) => {
                    const isSelected = selectedNotif?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedNotifId(item.id)}
                        className="w-full text-right p-4 rounded-xl transition-all cursor-pointer block"
                        style={{
                          backgroundColor: isSelected ? 'var(--color-navy-900)' : 'var(--color-navy-950)',
                          border: isSelected
                            ? '1px solid var(--color-orange-500)'
                            : '1px solid var(--surface-dark-border)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold" style={{ color: 'var(--color-beige-50)' }}>
                            {item.title}
                          </span>
                          <span className="text-[11px] font-tabular shrink-0" style={{ color: 'var(--color-orange-400)' }}>
                            {item.timeAgo}
                          </span>
                        </div>
                        <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--color-beige-200)' }}>
                          {item.deviceLabel}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
                          {item.detail}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Notification Detail Footer */}
              {selectedNotif && (
                <div
                  className="mt-6 p-4 rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-navy-950)',
                    border: '1px solid var(--surface-dark-border)',
                  }}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-on-dark-muted)' }}>
                      منبع داده اعلان:
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--color-beige-100)' }}>
                      {selectedNotif.category === 'alerts'
                        ? 'تله‌متری سخت‌افزار (سوئیچ / حرکت / GPS)'
                        : selectedNotif.category === 'maintenance'
                        ? 'پارامترهای برنامه‌ریزی سرویس و نگهداری'
                        : 'پایش زمان آخرین اتصال و اعتبار اشتراک'}
                    </span>
                  </div>
                  {selectedNotif.coordinatesDemo && (
                    <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t" style={{ borderColor: 'var(--surface-dark-border)' }}>
                      <span style={{ color: 'var(--text-on-dark-muted)' }}>پیوست موقعیت نقشه:</span>
                      <span className="font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                        {selectedNotif.coordinatesDemo}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
