import React, { useState } from 'react';
import { CUSTOMISATION_SCENARIOS } from '../data/farzamData';
import { toPersianDigits } from '../utils/telemetryLogic';

export const PersonalVsOrgAndCustomisation: React.FC = () => {
  const [tierMode, setTierMode] = useState<'personal' | 'organisational'>('organisational');
  const [activeScenarioId, setActiveScenarioId] = useState<string>(CUSTOMISATION_SCENARIOS[0].id);

  const activeScenario =
    CUSTOMISATION_SCENARIOS.find((s) => s.id === activeScenarioId) ?? CUSTOMISATION_SCENARIOS[0];

  return (
    <>
      {/* =====================================================================
          CHAPTER 6: PERSONAL VS ORGANISATION (شخصی در برابر سازمانی)
          ===================================================================== */}
      <section
        id="personal-vs-org"
        aria-labelledby="heading-personal-org"
        className="chapter-light-mid py-16 lg:py-24"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-sm font-bold mb-2" style={{ color: 'var(--color-orange-600)' }}>
                ۰۶ · مقیاس‌پذیری سامانه: از یک خودرو تا ناوگان سازمانی
              </p>
              <h2 id="heading-personal-org" className="headline-chapter" style={{ color: 'var(--color-navy-900)' }}>
                چه یک خودروی شخصی داشته باشید و چه ناوگانی در چند استان؛ یک هسته واحد پاسخگوی شماست.
              </h2>
            </div>

            {/* Interactive Tier Switcher */}
            <div
              className="well-light p-1.5 flex items-center gap-1.5 self-start lg:self-auto"
              role="group"
              aria-label="مقایسه اشتراک شخصی و سازمانی"
            >
              <button
                type="button"
                onClick={() => setTierMode('personal')}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: tierMode === 'personal' ? 'var(--color-navy-900)' : 'transparent',
                  color: tierMode === 'personal' ? 'var(--color-beige-50)' : 'var(--color-navy-900)',
                }}
              >
                نمای اشتراک شخصی (تک‌واحدی)
              </button>
              <button
                type="button"
                onClick={() => setTierMode('organisational')}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: tierMode === 'organisational' ? 'var(--color-orange-500)' : 'transparent',
                  color: tierMode === 'organisational' ? 'var(--color-navy-950)' : 'var(--color-navy-900)',
                }}
              >
                نمای اشتراک سازمانی (گروه و ناوگان)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Visual Constellation Diagram (7 cols) */}
            <div
              className="lg:col-span-7 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--color-navy-900)',
                color: 'var(--color-beige-50)',
                boxShadow: 'var(--shadow-beige-float)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className="headline-title">
                  {tierMode === 'personal'
                    ? 'معماری اشتراک شخصی: تمرکز مستقیم روی یک دارایی'
                    : 'معماری اشتراک سازمانی: مدیریت گروه‌ها، مقایسه چنددستگاهی و نقشه حرارتی'}
                </h3>
                <span className="text-xs font-semibold" style={{ color: 'var(--color-orange-400)' }}>
                  {tierMode === 'personal' ? '۱ دستگاه به ازای هر گزارش' : 'گروه‌بندی + گزارش‌های چنددستگاهی'}
                </span>
              </div>

              <div
                className="rounded-2xl p-4 sm:p-6 my-2"
                style={{
                  backgroundColor: 'var(--color-navy-950)',
                  border: '1px solid var(--surface-dark-border)',
                }}
              >
                {tierMode === 'personal' ? (
                  <svg viewBox="0 0 640 220" className="w-full h-auto" role="img" aria-label="نمودار اشتراک شخصی تک‌خودرو">
                    <path
                      d="M 540 110 C 410 55, 250 165, 110 110"
                      fill="none"
                      stroke="var(--color-orange-500)"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <g transform="translate(540, 110)">
                      <circle r="26" fill="var(--color-navy-800)" stroke="var(--color-orange-500)" strokeWidth="3" />
                      <text y="5" textAnchor="middle" fill="var(--color-beige-50)" fontSize="11" fontWeight="700">
                        خودروی شخصی
                      </text>
                    </g>
                    <g transform="translate(325, 110)">
                      <rect x="-75" y="-28" width="150" height="56" rx="14" fill="var(--color-navy-800)" stroke="var(--color-beige-200)" strokeWidth="1.5" />
                      <text y="-4" textAnchor="middle" fill="var(--color-beige-50)" fontSize="12" fontWeight="700">
                        نقشه زنده + اعلان‌ها
                      </text>
                      <text y="16" textAnchor="middle" fill="var(--color-orange-400)" fontSize="10">
                        گزارش پیمایش، سفر، توقف، روزانه
                      </text>
                    </g>
                    <g transform="translate(110, 110)">
                      <circle r="32" fill="var(--color-orange-500)" />
                      <text y="4" textAnchor="middle" fill="var(--color-navy-950)" fontSize="11" fontWeight="800">
                        کنترل فردی
                      </text>
                    </g>
                  </svg>
                ) : (
                  <svg viewBox="0 0 640 220" className="w-full h-auto" role="img" aria-label="نمودار اشتراک سازمانی با مدیریت گروه‌ها و مقایسه چنددستگاهی">
                    {/* Branching organizational signal tree */}
                    <path
                      d="M 550 45 C 440 45, 390 110, 310 110 M 550 110 L 310 110 M 550 175 C 440 175, 390 110, 310 110 M 310 110 L 95 110"
                      fill="none"
                      stroke="var(--color-orange-500)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {[
                      { y: 45, name: 'گروه ترانزیت جاده‌ای', count: '۱۸ دستگاه' },
                      { y: 110, name: 'گروه زنجیره سرد دارو', count: '۱۲ دستگاه' },
                      { y: 175, name: 'گروه پخش مویرگی پایتخت', count: '۲۴ دستگاه' },
                    ].map((grp) => (
                      <g key={grp.name} transform={`translate(545, ${grp.y})`}>
                        <rect x="-82" y="-22" width="164" height="44" rx="12" fill="var(--color-navy-800)" stroke="var(--color-beige-200)" strokeWidth="1.2" />
                        <text x="0" y="-3" textAnchor="middle" fill="var(--color-beige-50)" fontSize="11" fontWeight="700">
                          {grp.name}
                        </text>
                        <text x="0" y="14" textAnchor="middle" fill="var(--color-orange-400)" fontSize="10">
                          {grp.count}
                        </text>
                      </g>
                    ))}
                    <g transform="translate(310, 110)">
                      <rect x="-78" y="-38" width="156" height="76" rx="16" fill="var(--color-navy-800)" stroke="var(--color-orange-500)" strokeWidth="2" />
                      <text y="-10" textAnchor="middle" fill="var(--color-beige-50)" fontSize="12" fontWeight="800">
                        موتور تجمیع سازمانی
                      </text>
                      <text y="10" textAnchor="middle" fill="var(--color-beige-200)" fontSize="10">
                        مقایسه چنددستگاهی (عملکرد)
                      </text>
                      <text y="26" textAnchor="middle" fill="var(--color-orange-400)" fontSize="10">
                        + نقشه حرارتی گروهی
                      </text>
                    </g>
                    <g transform="translate(95, 110)">
                      <rect x="-70" y="-32" width="140" height="64" rx="16" fill="var(--color-orange-500)" />
                      <text y="-4" textAnchor="middle" fill="var(--color-navy-950)" fontSize="12" fontWeight="900">
                        داشبورد مدیریتی
                      </text>
                      <text y="15" textAnchor="middle" fill="var(--color-navy-950)" fontSize="10" fontWeight="700">
                        خروجی اکسل مستند
                      </text>
                    </g>
                  </svg>
                )}
              </div>

              {/* Group Summary Pills for Organisational */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
                <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--color-navy-800)' }}>
                  <span className="block opacity-75 mb-1">مدیریت گروه‌ها</span>
                  <strong className="text-sm">جستجو، افزودن گروه و شمارش دستگاه‌ها</strong>
                </div>
                <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--color-navy-800)' }}>
                  <span className="block opacity-75 mb-1">گزارش عملکرد و نقشه حرارتی</span>
                  <strong className="text-sm">انتخاب همزمان گروه و چند دستگاه</strong>
                </div>
                <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--color-navy-800)' }}>
                  <span className="block opacity-75 mb-1">برچسب اشتراک در لیست دستگاه</span>
                  <strong className="text-sm">تفکیک شفاف شخصی، سازمانی و پایه</strong>
                </div>
              </div>
            </div>

            {/* Capability Matrix Card (5 cols) */}
            <div className="lg:col-span-5 card-light-float p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="headline-title mb-2" style={{ color: 'var(--color-navy-900)' }}>
                  جدول تطبیق کاربری در مای‌فرزام
                </h3>
                <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--color-navy-800)' }}>
                  بر اساس ساختار واقعی سامانه مای‌فرزام، تفاوت رفتار کاربری شخصی، سازمانی و پایه به شرح زیر است:
                </p>

                <div className="space-y-4">
                  <div
                    className="p-4 rounded-2xl transition-all"
                    style={{
                      backgroundColor: tierMode === 'personal' ? 'var(--color-navy-900)' : 'var(--color-beige-100)',
                      color: tierMode === 'personal' ? 'var(--color-beige-50)' : 'var(--color-navy-900)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-extrabold">۱. اشتراک شخصی (Personal)</span>
                      <span className="text-xs font-bold" style={{ color: tierMode === 'personal' ? 'var(--color-orange-400)' : 'var(--color-orange-600)' }}>
                        تک‌خودرو / شخص
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      مناسب پایش یک خودرو یا دارایی؛ شامل نقشه زنده، اعلان‌های روشن/خاموش شدن سوئیچ و حرکت، و گزارش‌های تک‌دستگاهی (پیمایش، سفر، توقف، روزانه، رویداد).
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-2xl transition-all"
                    style={{
                      backgroundColor: tierMode === 'organisational' ? 'var(--color-navy-900)' : 'var(--color-beige-100)',
                      color: tierMode === 'organisational' ? 'var(--color-beige-50)' : 'var(--color-navy-900)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-extrabold">۲. اشتراک سازمانی (Organisational)</span>
                      <span className="text-xs font-bold" style={{ color: tierMode === 'organisational' ? 'var(--color-orange-400)' : 'var(--color-orange-600)' }}>
                        ناوگان و گروه‌ها
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      علاوه بر تمام امکانات فردی، شامل «مدیریت گروه‌ها»، فیلتر گروهی در نقشه و لیست دستگاه‌ها، داشبورد مدیریتی ناوگان و انتخاب چنددستگاهی در گزارش‌های «عملکرد» و «نقشه حرارتی» است.
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: 'var(--color-beige-100)',
                      color: 'var(--color-navy-900)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-extrabold">۳. برچسب اشتراک پایه (Base)</span>
                      <span className="text-xs font-semibold" style={{ color: 'var(--color-navy-500)' }}>
                        مشاهده‌شده در لیست دستگاه‌ها
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-navy-800)' }}>
                      در جدول مدیریت دستگاه‌ها، نوع اشتراک و تاریخ انقضای هر ردیاب به صورت شفاف نمایش داده می‌شود تا تداوم دریافت داده تضمین گردد.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-beige-300)' }}>
                <span style={{ color: 'var(--color-navy-800)' }}>نیاز به راهنمایی برای انتخاب نوع اشتراک دارید؟</span>
                <a href="#final-cta" className="font-extrabold hover:underline" style={{ color: 'var(--color-orange-600)' }}>
                  مشاوره استقرار ناوگان ←
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CHAPTER 7: CUSTOMISATION (سفارشی‌سازی سخت‌افزار و نرم‌افزار)
          ===================================================================== */}
      <section
        id="customisation"
        aria-labelledby="heading-customisation"
        className="chapter-light py-16 lg:py-24"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-sm font-bold mb-2" style={{ color: 'var(--color-orange-600)' }}>
                ۰۷ · سفارشی‌سازی سخت‌افزار و نرم‌افزار (Tailored Integrations)
              </p>
              <h2 id="heading-customisation" className="headline-chapter" style={{ color: 'var(--color-navy-900)' }}>
                سیستمی که به جای تحمیل قالب آماده، در فرآیندهای سازمان شما چفت می‌شود.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed" style={{ color: 'var(--color-navy-800)' }}>
              هر ناوگان، سنسورها و قوانین عملیاتی خودش را دارد. فرزام چیدمان سخت‌افزار ردیاب (ورودی‌های دما، سوخت، ولتاژ و سوئیچ) و جریان گزارش‌گیری مای‌فرزام را دقیقاً بر اساس صنعت شما پیکربندی می‌کند.
            </p>
          </div>

          {/* Scenario Selector Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" role="tablist" aria-label="سناریوهای سفارشی‌سازی سازمانی">
            {CUSTOMISATION_SCENARIOS.map((sc, idx) => {
              const active = sc.id === activeScenario.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveScenarioId(sc.id)}
                  className="text-right p-5 rounded-2xl transition-all cursor-pointer"
                  style={{
                    backgroundColor: active ? 'var(--color-navy-900)' : 'var(--color-beige-50)',
                    color: active ? 'var(--color-beige-50)' : 'var(--color-navy-900)',
                    boxShadow: active ? 'var(--shadow-beige-float)' : 'var(--shadow-beige-soft)',
                  }}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold" style={{ color: active ? 'var(--color-orange-400)' : 'var(--color-orange-600)' }}>
                      سناریوی {toPersianDigits(idx + 1)} · {sc.sector}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold">{sc.title}</h3>
                </button>
              );
            })}
          </div>

          {/* Active Plug-In Architecture Diagram */}
          <div className="card-light-float p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--color-beige-100)' }}>
                  <span className="text-xs font-bold block mb-1" style={{ color: 'var(--color-orange-600)' }}>
                    چالش عملیاتی سازمان:
                  </span>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--color-navy-900)' }}>
                    {activeScenario.challenge}
                  </p>
                </div>

                <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--color-navy-900)', color: 'var(--color-beige-50)' }}>
                  <span className="text-xs font-bold block mb-1" style={{ color: 'var(--color-orange-400)' }}>
                    خروجی و دستاورد نهایی:
                  </span>
                  <p className="text-sm font-medium leading-relaxed">
                    {activeScenario.outcomeStatement}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="card-light-elevated p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-extrabold" style={{ color: 'var(--color-navy-900)' }}>
                      ۱. پیکربندی سخت‌افزار و سنسورها
                    </h4>
                    <span className="text-xs font-bold" style={{ color: 'var(--color-orange-600)' }}>
                      لایه تله‌متری
                    </span>
                  </div>
                  <ul className="space-y-3 text-xs leading-relaxed" style={{ color: 'var(--color-navy-800)' }}>
                    {activeScenario.hardwareTailoring.map((hw) => (
                      <li key={hw} className="flex items-start gap-2">
                        <span className="font-bold" style={{ color: 'var(--color-orange-600)' }}>●</span>
                        <span>{hw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-light-elevated p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-extrabold" style={{ color: 'var(--color-navy-900)' }}>
                      ۲. یکپارچه‌سازی در نرم‌افزار مای‌فرزام
                    </h4>
                    <span className="text-xs font-bold" style={{ color: 'var(--color-orange-600)' }}>
                      لایه نرم‌افزار
                    </span>
                  </div>
                  <ul className="space-y-3 text-xs leading-relaxed" style={{ color: 'var(--color-navy-800)' }}>
                    {activeScenario.softwareTailoring.map((sw) => (
                      <li key={sw} className="flex items-start gap-2">
                        <span className="font-bold" style={{ color: 'var(--color-orange-600)' }}>●</span>
                        <span>{sw}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
