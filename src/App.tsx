import React, { useEffect, useState } from 'react';
import {
  FarzamLogoMark,
  FarzamWordmark,
  FARZAM_LOGO_PATH,
} from './components/BrandSvg';
import {
  ThreeHeroAndHardwareStage,
  type SignalVisualMode,
} from './components/ThreeHeroAndHardwareStage';
import { ConnectivityAndLiveControl } from './components/ConnectivityAndLiveControl';
import { ReportsLaboratory } from './components/ReportsLaboratory';
import { PersonalVsOrgAndCustomisation } from './components/PersonalVsOrgAndCustomisation';
import { ProductUiShowcase } from './components/ProductUiShowcase';
import {
  HARDWARE_LAYERS,
  SYNTHETIC_FLEET_DEVICES,
  type HardwareLayerSpec,
} from './data/farzamData';
import {
  toPersianDigits,
  validateLeadSubmission,
  type FleetDeviceRecord,
} from './utils/telemetryLogic';

export default function App() {
  // Global Living Signal State
  const [heroSignalState, setHeroSignalState] = useState<SignalVisualMode>('moving');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Chapter 2: Hardware Exploded View State
  const [activeHardwareLayer, setActiveHardwareLayer] =
    useState<HardwareLayerSpec['id']>('gps');
  const [explodeAmount, setExplodeAmount] = useState(0.72);

  // Shared Fleet Inventory State (wired between Chapter 3 Registration & Chapter 8 Product UI)
  const [fleetDevices, setFleetDevices] = useState<FleetDeviceRecord[]>(
    SYNTHETIC_FLEET_DEVICES,
  );

  // Chapter 9: Final CTA Lead Form State
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [subMode, setSubMode] = useState<'سازمانی' | 'شخصی' | 'سفارشی'>('سازمانی');
  const [fleetCount, setFleetCount] = useState('۲۵');
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(
        Math.min(1, Math.max(0, window.scrollY / docHeight)),
      );
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLayerSpec =
    HARDWARE_LAYERS.find((l) => l.id === activeHardwareLayer) ??
    HARDWARE_LAYERS[0];

  const handleRegisterNewDevice = (newDevice: FleetDeviceRecord) => {
    setFleetDevices((prev) => [newDevice, ...prev]);
  };

  const handleLeadFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateLeadSubmission({
      fullName,
      organizationName: orgName,
      phone,
      subscriptionMode: subMode,
      fleetCount,
    });
    if (!check.valid) {
      setLeadErrors(check.errors as Record<string, string>);
      setLeadSubmitted(false);
      return;
    }
    setLeadErrors({});
    setLeadSubmitted(true);
  };

  return (
    <div className="min-h-screen relative selection:bg-[#FF742E] selection:text-[#08131C]">
      {/* Skip to content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-50 px-4 py-2 rounded-lg font-bold text-xs"
        style={{
          backgroundColor: 'var(--color-orange-500)',
          color: 'var(--color-navy-950)',
        }}
      >
        پرش به محتوای اصلی
      </a>

      {/* =====================================================================
          LIVING SIGNAL PROGRESS THREAD (Top Horizon Bar)
          ===================================================================== */}
      <div
        className="fixed top-0 inset-x-0 h-[3px] z-50 pointer-events-none"
        style={{ backgroundColor: 'rgba(232, 222, 205, 0.08)' }}
        aria-hidden="true"
      >
        <div
          className="h-full transition-transform duration-150 origin-right"
          style={{
            backgroundColor: 'var(--color-orange-500)',
            boxShadow: 'var(--shadow-signal)',
            transform: `scaleX(${Math.max(0.03, scrollProgress)})`,
          }}
        />
      </div>

      {/* =====================================================================
          TOP BAR CONTRACT (3 Zones: Brand Wordmark | 5 Nav Links | 1 Primary CTA)
          ===================================================================== */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'rgba(8, 19, 28, 0.92)',
          borderColor: 'var(--surface-dark-border)',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Lockup (Real Logo + Real Typography Wordmark) */}
          <a
            href="#hero"
            aria-label="فرزام - بازگشت به ابتدای صفحه"
            className="flex items-center gap-3 whitespace-nowrap shrink-0"
          >
            <FarzamLogoMark
              className="w-6 h-8 shrink-0"
              fill="var(--color-orange-500)"
            />
            <FarzamWordmark
              className="h-6 w-auto shrink-0"
              fill="var(--color-beige-50)"
              nuqtaColor="var(--color-orange-500)"
            />
          </a>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav
            aria-label="ناوبری فصل‌های فرزام"
            className="hidden md:flex items-center gap-6 text-xs font-bold"
            style={{ color: 'var(--color-beige-200)' }}
          >
            <a
              href="#hardware"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              سخت‌افزار
            </a>
            <a
              href="#connectivity"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              اتصال و کنترل
            </a>
            <a
              href="#reports"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              ۹ گزارش تحلیلی
            </a>
            <a
              href="#personal-vs-org"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              شخصی و سازمانی
            </a>
            <a
              href="#product-ui"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              محیط مای‌فرزام
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <a
              href="#final-cta"
              className="px-4 py-2 rounded-full text-xs font-extrabold transition-colors whitespace-nowrap shrink-0"
              style={{
                backgroundColor: 'var(--color-orange-500)',
                color: 'var(--color-navy-950)',
              }}
            >
              درخواست دمو
            </a>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* ===================================================================
            CHAPTER 1: HERO (قهرمان داستان: سیگنال زنده)
            Persian text on the right (inline-start), 3D animation on the left (inline-end), NEVER behind the text.
            =================================================================== */}
        <section
          id="hero"
          aria-labelledby="heading-hero"
          className="chapter-dark relative min-h-[calc(100svh-4rem)] flex items-center py-8 lg:py-16"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
            {/* Mobile-only non-sticky quick chapter jump bar */}
            <nav
              aria-label="دسترسی سریع فصل‌ها در موبایل"
              className="flex md:hidden items-center gap-2 overflow-x-auto pb-4 mb-4 border-b text-xs font-bold"
              style={{
                borderColor: 'var(--surface-dark-border)',
                color: 'var(--color-beige-200)',
              }}
            >
              <a href="#hardware" className="px-3 py-1.5 rounded-full whitespace-nowrap shrink-0" style={{ backgroundColor: 'var(--color-navy-900)' }}>سخت‌افزار</a>
              <a href="#connectivity" className="px-3 py-1.5 rounded-full whitespace-nowrap shrink-0" style={{ backgroundColor: 'var(--color-navy-900)' }}>اتصال و کنترل</a>
              <a href="#reports" className="px-3 py-1.5 rounded-full whitespace-nowrap shrink-0" style={{ backgroundColor: 'var(--color-navy-900)' }}>۹ گزارش تحلیلی</a>
              <a href="#personal-vs-org" className="px-3 py-1.5 rounded-full whitespace-nowrap shrink-0" style={{ backgroundColor: 'var(--color-navy-900)' }}>شخصی و سازمانی</a>
              <a href="#product-ui" className="px-3 py-1.5 rounded-full whitespace-nowrap shrink-0" style={{ backgroundColor: 'var(--color-navy-900)' }}>محیط مای‌فرزام</a>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Right Column in RTL (inline-start, 5 cols): Crisp Persian Headline & Primary Action */}
              <div className="lg:col-span-5 flex flex-col justify-between py-2 min-w-0">
                <div>
                  <p
                    className="text-xs sm:text-sm font-bold mb-4"
                    style={{ color: 'var(--color-orange-400)' }}
                  >
                    سخت‌افزار ردیاب · نرم‌افزار مای‌فرزام · سفارشی‌سازی سازمانی
                  </p>

                  <h1
                    id="heading-hero"
                    className="font-black leading-[1.18] tracking-tight mb-6"
                    style={{ fontSize: 'clamp(2rem, 3.4vw + 0.6rem, 3.65rem)' }}
                  >
                    هر پالس حرکت،
                    <br />
                    یک تصمیم روشن برای
                    <br />
                    مدیریت ناوگان شما.
                  </h1>

                  <p
                    className="text-base sm:text-lg leading-relaxed mb-8"
                    style={{ color: 'var(--text-on-dark-secondary)' }}
                  >
                    فرزام، ردیاب سخت‌افزاری، نقشه زنده و ۹ گزارش تحلیلی را در یک رشته سیگنال یکپارچه به هم متصل می‌کند؛ از یک خودروی شخصی تا ناوگان صدها کشنده و سردخانه.
                  </p>

                  {/* Single Primary CTA + Quiet Secondary Anchor */}
                  <div className="flex flex-wrap items-center gap-3 mb-8">
                    <a href="#reports" className="btn-signal-primary text-sm">
                      کاوش در ۹ گزارش مدیریتی
                    </a>
                    <a href="#product-ui" className="btn-neutral-dark text-sm">
                      تجربه زنده محیط مای‌فرزام
                    </a>
                  </div>
                </div>

                {/* Interactive Signal State Switcher (controls the 3D Hero & Living Signal) */}
                <div
                  className="p-4 rounded-2xl"
                  style={{
                    backgroundColor: 'var(--color-navy-900)',
                    border: '1px solid var(--surface-dark-border)',
                  }}
                >
                  <span
                    className="block text-xs font-bold mb-2.5"
                    style={{ color: 'var(--color-beige-200)' }}
                  >
                    حالت زنده رشته سیگنال را در صحنه سه‌بعدی تغییر دهید:
                  </span>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-1.5"
                    role="group"
                    aria-label="تغییر حالت سیگنال زنده در صحنه سه‌بعدی"
                  >
                    {[
                      { id: 'moving', label: 'در حال حرکت' },
                      { id: 'stopped', label: 'متوقف در محدوده' },
                      { id: 'alert', label: 'هشدار رویداد' },
                      { id: 'cold', label: 'زنجیره سرد' },
                    ].map((st) => {
                      const active = heroSignalState === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() =>
                            setHeroSignalState(st.id as SignalVisualMode)
                          }
                          className="py-2 px-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center whitespace-nowrap"
                          style={{
                            backgroundColor: active
                              ? 'var(--color-orange-500)'
                              : 'var(--color-navy-950)',
                            color: active
                              ? 'var(--color-navy-950)'
                              : 'var(--color-beige-200)',
                            border: '1px solid var(--surface-dark-border)',
                          }}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Left Column in RTL (inline-end, 7 cols): 3D Spatial Farzam Sculpture & Signal Orbit */}
              <div className="lg:col-span-7 min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] flex">
                <ThreeHeroAndHardwareStage
                  mode="hero"
                  signalState={heroSignalState}
                />
              </div>
            </div>

            {/* Full-Width 3-Pillar Architecture Strip Below the Hero Split */}
            <div
              className="mt-10 pt-8 border-t grid grid-cols-1 md:grid-cols-3 gap-6"
              style={{ borderColor: 'var(--surface-dark-border)' }}
            >
              <div>
                <span
                  className="text-xs font-bold block mb-1"
                  style={{ color: 'var(--color-orange-400)' }}
                >
                  ۰۱ · سخت‌افزار دقیق (Hardware)
                </span>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-on-dark-secondary)' }}
                >
                  ردیاب‌های GPS با شناسه IMEI و سیم‌کارت، ورودی سوئیچ و برق، تله‌متری حرکت و سرعت، ولتاژ و در مدل‌های سازگار، سنسور دما و سوخت.
                </p>
              </div>
              <div>
                <span
                  className="text-xs font-bold block mb-1"
                  style={{ color: 'var(--color-orange-400)' }}
                >
                  ۰۲ · نرم‌افزار مای‌فرزام (MyFarzam)
                </span>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-on-dark-secondary)' }}
                >
                  داشبورد مدیریتی، نقشه زنده، مدیریت دستگاه‌ها و گروه‌ها، محدوده‌های جغرافیایی، اعلان‌های ۳گانه و ۹ گزارش تخصصی با خروجی اکسل.
                </p>
              </div>
              <div>
                <span
                  className="text-xs font-bold block mb-1"
                  style={{ color: 'var(--color-orange-400)' }}
                >
                  ۰۳ · سفارشی‌سازی سازمانی (Customisation)
                </span>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-on-dark-secondary)' }}
                >
                  تطبیق کامل ورودی‌های سخت‌افزاری و جریان‌های گزارش‌گیری با نیازهای اختصاصی ناوگان پخش، ترانزیت و زنجیره سرد شما.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            CHAPTER 2: HARDWARE (کالبدشکافی سه‌بعدی سخت‌افزار ردیاب و سنسورها)
            =================================================================== */}
        <section
          id="hardware"
          aria-labelledby="heading-hardware"
          className="chapter-navy relative py-16 lg:py-24 border-t"
          style={{ borderColor: 'var(--surface-dark-border)' }}
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: 'var(--color-orange-400)' }}
                >
                  ۰۲ · کالبدشکافی سخت‌افزار و لایه‌های تله‌متری
                </p>
                <h2 id="heading-hardware" className="headline-chapter">
                  هر عدد روی داشبورد مای‌فرزام، از کدام لایه سخت‌افزار متولد می‌شود؟
                </h2>
              </div>
              <p
                className="max-w-xl text-base leading-relaxed"
                style={{ color: 'var(--text-on-dark-secondary)' }}
              >
                روی هر یک از ۷ لایه سخت‌افزاری زیر کلیک کنید تا ردیاب سه‌بعدی باز شود و ببینید هر سنسور دقیقاً کدام شاخص‌ها، اعلان‌ها و گزارش‌های نرم‌افزار را تغذیه می‌کند.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Right in RTL (5 cols): 7 Interactive Sensor Layers */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-3">
                <div
                  className="space-y-2"
                  role="tablist"
                  aria-label="لایه‌های سنسور و سخت‌افزار ردیاب فرزام"
                >
                  {HARDWARE_LAYERS.map((layer, index) => {
                    const isSelected = layer.id === activeHardwareLayer;
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveHardwareLayer(layer.id)}
                        className="w-full text-right p-3.5 rounded-2xl transition-all cursor-pointer block"
                        style={{
                          backgroundColor: isSelected
                            ? 'var(--color-navy-800)'
                            : 'var(--color-navy-950)',
                          border: isSelected
                            ? '1px solid var(--color-orange-500)'
                            : '1px solid var(--surface-dark-border)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-xs sm:text-sm font-extrabold"
                            style={{
                              color: isSelected
                                ? 'var(--color-beige-50)'
                                : 'var(--color-beige-200)',
                            }}
                          >
                            {toPersianDigits(index + 1)}. {layer.title}
                          </span>
                          {layer.optionalBadge && (
                            <span
                              className="text-[10px] font-semibold shrink-0"
                              style={{ color: 'var(--color-orange-400)' }}
                            >
                              {layer.optionalBadge}
                            </span>
                          )}
                        </div>
                        <p
                          className="text-xs mt-1"
                          style={{ color: 'var(--text-on-dark-muted)' }}
                        >
                          {layer.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Exploded View Separation Slider */}
                <div
                  className="p-4 rounded-2xl flex items-center justify-between gap-4"
                  style={{
                    backgroundColor: 'var(--color-navy-950)',
                    border: '1px solid var(--surface-dark-border)',
                  }}
                >
                  <label
                    htmlFor="hardware-explode-slider"
                    className="text-xs font-semibold whitespace-nowrap"
                    style={{ color: 'var(--color-beige-200)' }}
                  >
                    فاصله لایه‌های سه‌بعدی:
                  </label>
                  <input
                    id="hardware-explode-slider"
                    type="range"
                    min={0.15}
                    max={1}
                    step={0.05}
                    value={explodeAmount}
                    onChange={(e) => setExplodeAmount(Number(e.target.value))}
                    className="w-full accent-[#FF742E] cursor-pointer"
                  />
                  <span
                    className="text-xs font-bold font-tabular whitespace-nowrap"
                    style={{ color: 'var(--color-orange-400)' }}
                  >
                    {toPersianDigits(Math.round(explodeAmount * 100))}٪
                  </span>
                </div>
              </div>

              {/* Left in RTL (7 cols): 3D Exploded Hardware Stage + Hardware-to-Software Output Card */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="h-[340px] sm:h-[390px]">
                  <ThreeHeroAndHardwareStage
                    mode="hardware"
                    activeLayerId={activeHardwareLayer}
                    explodeFactor={explodeAmount}
                    signalState={
                      activeHardwareLayer === 'temperature' ? 'cold' : 'moving'
                    }
                  />
                </div>

                {/* Synchronized Hardware-to-Software Mapping Detail Card */}
                <div className="card-dark p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b" style={{ borderColor: 'var(--surface-dark-border)' }}>
                    <div>
                      <span
                        className="text-xs font-semibold block"
                        style={{ color: 'var(--color-orange-400)' }}
                      >
                        منبع سخت‌افزاری: {currentLayerSpec.hardwareSource}
                      </span>
                      <h3 className="headline-title mt-1">
                        {currentLayerSpec.title}
                      </h3>
                    </div>
                    <span
                      className="text-xs font-tabular px-3 py-1.5 rounded-xl"
                      style={{
                        backgroundColor: 'var(--color-navy-950)',
                        color: 'var(--color-beige-100)',
                        border: '1px solid var(--surface-dark-border)',
                      }}
                    >
                      {currentLayerSpec.telemetrySample}
                    </span>
                  </div>

                  <p
                    className="text-xs font-bold mb-2.5"
                    style={{ color: 'var(--color-beige-200)' }}
                  >
                    قابلیت‌های نرم‌افزار مای‌فرزام که از این لایه تغذیه می‌شوند:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentLayerSpec.softwareCapabilitiesFed.map((cap) => (
                      <li
                        key={cap}
                        className="p-3 rounded-xl text-xs leading-relaxed"
                        style={{
                          backgroundColor: 'var(--color-navy-950)',
                          color: 'var(--color-beige-100)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      >
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            CHAPTERS 3 & 4: CONNECTIVITY & LIVE CONTROL
            =================================================================== */}
        <ConnectivityAndLiveControl
          devices={fleetDevices}
          onRegisterDevice={handleRegisterNewDevice}
        />

        {/* ===================================================================
            CHAPTER 5: THE 9 REPORTS LABORATORY (آزمایشگاه ۹ گزارش تحلیلی)
            =================================================================== */}
        <ReportsLaboratory />

        {/* ===================================================================
            CHAPTERS 6 & 7: PERSONAL VS ORGANISATION & CUSTOMISATION
            =================================================================== */}
        <PersonalVsOrgAndCustomisation />

        {/* ===================================================================
            CHAPTER 8: PRODUCT UI SHOWCASE (محیط واقعی نرم‌افزار مای‌فرزام)
            =================================================================== */}
        <ProductUiShowcase devices={fleetDevices} />

        {/* ===================================================================
            CHAPTER 9: FINAL CTA (پایان مسیر سیگنال و استقرار ناوگان)
            =================================================================== */}
        <section
          id="final-cta"
          aria-labelledby="heading-final-cta"
          className="chapter-dark relative pb-20"
        >
          {/* Intentional Light-to-Dark Architectural Signal Bridge */}
          <div
            className="w-full overflow-hidden"
            style={{ backgroundColor: 'var(--color-beige-100)' }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 1440 110"
              className="w-full h-[60px] sm:h-[90px] block"
              preserveAspectRatio="none"
            >
              <path
                d="M0,110 L0,30 C420,105 920,5 1440,65 L1440,110 Z"
                fill="var(--color-navy-950)"
              />
              <path
                d="M0,30 C420,105 920,5 1440,65"
                fill="none"
                stroke="var(--color-orange-500)"
                strokeWidth="4"
              />
            </svg>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 lg:pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Right Column in RTL (6 cols): Signature Brand Emblem Moment + Support Channels */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: 'var(--color-navy-900)', border: '1px solid var(--surface-dark-border)' }}>
                  <svg
                    viewBox="0 0 234.21 324.76"
                    className="w-12 h-16 shrink-0"
                    role="img"
                    aria-label="نشان فرزام ترسیم‌شده با رشته سیگنال"
                  >
                    <path d={FARZAM_LOGO_PATH} fill="var(--color-navy-800)" />
                    <path
                      d={FARZAM_LOGO_PATH}
                      fill="none"
                      stroke="var(--color-orange-500)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="420 780"
                    />
                  </svg>
                  <div>
                    <FarzamWordmark
                      className="h-8 w-auto mb-1"
                      fill="var(--color-beige-50)"
                      nuqtaColor="var(--color-orange-500)"
                    />
                    <span className="text-xs block" style={{ color: 'var(--color-orange-400)' }}>
                      پایان مسیر سیگنال · آغاز هوشمندسازی ناوگان شما
                    </span>
                  </div>
                </div>

                <h2 id="heading-final-cta" className="headline-chapter">
                  ناوگان خود را به یک سیستم یکپارچه و قابل استناد متصل کنید.
                </h2>

                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--text-on-dark-secondary)' }}
                >
                  فرقی نمی‌کند یک خودروی شخصی داشته باشید یا مدیریت ده‌ها کشنده، کامیونت پخش و سردخانه را بر عهده گرفته باشید؛ تیم فنی فرزام ترکیب دقیق ردیاب، سنسورهای سازگار و پنل مای‌فرزام را برای شما آماده می‌کند.
                </p>

                {/* Support Channels from farzam-features.md (Phone and messaging-channel contacts) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: 'var(--color-navy-900)',
                      border: '1px solid var(--surface-dark-border)',
                    }}
                  >
                    <span className="text-xs block mb-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                      پشتیبانی تلفنی و مشاوره استقرار
                    </span>
                    <strong className="text-sm font-tabular block" style={{ color: 'var(--color-beige-50)' }}>
                      ۰۲۱-۹۱۰۰فرزام (خط نمایشی مشاوره)
                    </strong>
                  </div>
                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: 'var(--color-navy-900)',
                      border: '1px solid var(--surface-dark-border)',
                    }}
                  >
                    <span className="text-xs block mb-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                      کانال‌های پیام‌رسان پشتیبانی (Support)
                    </span>
                    <strong className="text-sm block" style={{ color: 'var(--color-orange-400)' }}>
                      ارتباط مستقیم با واحد فنی و امور مشترکین
                    </strong>
                  </div>
                </div>
              </div>

              {/* Left Column in RTL (6 cols): Validated Consultation & Demo Request Form */}
              <div className="lg:col-span-6">
                <form
                  onSubmit={handleLeadFormSubmit}
                  noValidate
                  className="card-dark p-6 sm:p-8 lg:p-10 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="headline-title">درخواست دمو و مشاوره اختصاصی</h3>
                    <span className="text-xs" style={{ color: 'var(--color-orange-400)' }}>
                      پاسخگویی سریع
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor="cta-fullname"
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: 'var(--color-beige-200)' }}
                    >
                      نام و نام خانوادگی *
                    </label>
                    <input
                      id="cta-fullname"
                      type="text"
                      placeholder="مثال: مهندس آرش کاظمی"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      style={{
                        backgroundColor: 'var(--color-navy-950)',
                        color: 'var(--color-beige-50)',
                        border: '1px solid var(--surface-dark-border)',
                      }}
                    />
                    {leadErrors.fullName && (
                      <p role="alert" className="text-xs mt-1 font-semibold" style={{ color: 'var(--color-orange-400)' }}>
                        {leadErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="cta-org"
                        className="block text-xs font-semibold mb-1.5"
                        style={{ color: 'var(--color-beige-200)' }}
                      >
                        نام سازمان یا شرکت (اختیاری)
                      </label>
                      <input
                        id="cta-org"
                        type="text"
                        placeholder="مثال: پخش دارویی البرز"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={{
                          backgroundColor: 'var(--color-navy-950)',
                          color: 'var(--color-beige-50)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cta-phone"
                        className="block text-xs font-semibold mb-1.5"
                        style={{ color: 'var(--color-beige-200)' }}
                      >
                        شماره موبایل جهت هماهنگی *
                      </label>
                      <input
                        id="cta-phone"
                        type="tel"
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm font-tabular"
                        style={{
                          backgroundColor: 'var(--color-navy-950)',
                          color: 'var(--color-beige-50)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      />
                      {leadErrors.phone && (
                        <p role="alert" className="text-xs mt-1 font-semibold" style={{ color: 'var(--color-orange-400)' }}>
                          {leadErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="cta-mode"
                        className="block text-xs font-semibold mb-1.5"
                        style={{ color: 'var(--color-beige-200)' }}
                      >
                        نوع کاربری مورد نظر
                      </label>
                      <select
                        id="cta-mode"
                        value={subMode}
                        onChange={(e) =>
                          setSubMode(e.target.value as 'سازمانی' | 'شخصی' | 'سفارشی')
                        }
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={{
                          backgroundColor: 'var(--color-navy-950)',
                          color: 'var(--color-beige-50)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      >
                        <option value="سازمانی">اشتراک سازمانی (گروه‌ها و گزارش چنددستگاهی)</option>
                        <option value="شخصی">اشتراک شخصی (تک‌خودرو)</option>
                        <option value="سفارشی">سفارشی‌سازی سخت‌افزار و نرم‌افزار</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="cta-count"
                        className="block text-xs font-semibold mb-1.5"
                        style={{ color: 'var(--color-beige-200)' }}
                      >
                        تعداد تقریبی خودرو / دستگاه *
                      </label>
                      <input
                        id="cta-count"
                        type="text"
                        value={fleetCount}
                        onChange={(e) => setFleetCount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm font-tabular"
                        style={{
                          backgroundColor: 'var(--color-navy-950)',
                          color: 'var(--color-beige-50)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      />
                      {leadErrors.fleetCount && (
                        <p role="alert" className="text-xs mt-1 font-semibold" style={{ color: 'var(--color-orange-400)' }}>
                          {leadErrors.fleetCount}
                        </p>
                      )}
                    </div>
                  </div>

                  {leadSubmitted && (
                    <div
                      role="status"
                      className="p-4 rounded-xl text-xs leading-relaxed"
                      style={{
                        backgroundColor: 'var(--color-orange-soft)',
                        border: '1px solid var(--color-orange-500)',
                        color: 'var(--color-beige-50)',
                      }}
                    >
                      درخواست دمو و مشاوره برای <strong>{fullName}</strong> ({subMode} — {toPersianDigits(fleetCount)} دستگاه) ثبت شد. کارشناسان استقرار فرزام با شماره <span className="font-tabular">{toPersianDigits(phone)}</span> تماس خواهند گرفت.
                    </div>
                  )}

                  <button type="submit" className="btn-signal-primary w-full text-sm">
                    ثبت درخواست دمو و دریافت مشاوره استقرار
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          QUIET FOOTER (Brand Wordmark, Navigation Mirror, Synthetic Data Notice)
          ===================================================================== */}
      <footer
        className="border-t py-10"
        style={{
          backgroundColor: 'var(--color-navy-950)',
          borderColor: 'var(--surface-dark-border)',
          color: 'var(--text-on-dark-muted)',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <FarzamLogoMark className="w-5 h-7" fill="var(--color-orange-500)" />
            <FarzamWordmark className="h-5 w-auto" fill="var(--color-beige-200)" />
            <span>· سامانه هوشمند مدیریت ناوگان و تله‌متری زنده</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a href="#hardware" className="hover:underline">سخت‌افزار</a>
            <a href="#connectivity" className="hover:underline">اتصال</a>
            <a href="#reports" className="hover:underline">۹ گزارش</a>
            <a href="#product-ui" className="hover:underline">مای‌فرزام</a>
            <span>تمامی داده‌ها، پلاک‌ها و موقعیت‌ها نمایشی (Demo) هستند.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
