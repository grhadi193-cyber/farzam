import React, { useState } from 'react';
import {
  filterAndSummarizeFleet,
  formatPersianNumber,
  toPersianDigits,
  type FleetDeviceRecord,
} from '../utils/telemetryLogic';
import { FarzamLogoMark } from './BrandSvg';

interface ProductUiShowcaseProps {
  devices: FleetDeviceRecord[];
}

type WorkspacePage = 'dashboard' | 'map' | 'devices' | 'groups' | 'geofences';
type DashboardPeriod = '7d' | '2w' | '1m';

export const ProductUiShowcase: React.FC<ProductUiShowcaseProps> = ({ devices }) => {
  const [activePage, setActivePage] = useState<WorkspacePage>('dashboard');
  const [period, setPeriod] = useState<DashboardPeriod>('7d');
  const [groupFilter, setGroupFilter] = useState<string>('همه گروه‌ها');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id ?? 'dev-101');

  const { filtered, summary } = filterAndSummarizeFleet(devices, groupFilter, searchQuery);

  // Period multiplier for realistic synthetic chart scaling (7 days, 2 weeks, 1 month)
  const periodFactor = period === '7d' ? 1 : period === '2w' ? 1.85 : 3.6;

  const groupsList = [
    { name: 'ترانزیت جاده‌ای', count: devices.filter((d) => d.group === 'ترانزیت جاده‌ای').length },
    { name: 'زنجیره سرد دارو', count: devices.filter((d) => d.group === 'زنجیره سرد دارو').length },
    { name: 'پخش مویرگی پایتخت', count: devices.filter((d) => d.group === 'پخش مویرگی پایتخت').length },
    { name: 'خودروهای شخصی و مدیریتی', count: devices.filter((d) => d.group === 'خودروهای شخصی و مدیریتی').length },
  ];

  const geofencesList = [
    { name: 'انبار مرکزی کرج', type: 'چندضلعی (Polygon)', maxSpeed: '۴۰ km/h', desc: 'محوطه بارگیری و سردخانه مرکزی' },
    { name: 'پایانه باربری غرب', type: 'دایره (Circle)', maxSpeed: '۵۰ km/h', desc: 'شعاع ۱٫۲ کیلومتری پایانه' },
    { name: 'محدوده توزیع منطقه ۵', type: 'چندضلعی (Polygon)', maxSpeed: '۶۰ km/h', desc: 'محدوده پخش مویرگی شهری' },
    { name: 'محور آزادراه قزوین', type: 'خطی (Polyline)', maxSpeed: '۹۵ km/h', desc: 'کریدور ترانزیت بین‌شهری' },
  ];

  const selectedDevice =
    devices.find((d) => d.id === selectedDeviceId) ?? filtered[0] ?? devices[0];

  return (
    <section
      id="product-ui"
      aria-labelledby="heading-product-ui"
      className="chapter-light-mid py-16 lg:py-24"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-bold mb-2" style={{ color: 'var(--color-orange-600)' }}>
              ۰۸ · محیط زنده نرم‌افزار مای‌فرزام (ساخته‌شده در کد با داده‌های نمایشی)
            </p>
            <h2 id="heading-product-ui" className="headline-chapter" style={{ color: 'var(--color-navy-900)' }}>
              داشبورد مدیریتی، نقشه دستگاه‌ها و مدیریت ناوگان را همین‌جا تجربه کنید.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed" style={{ color: 'var(--color-navy-800)' }}>
            بدون نیاز به ورود، میان صفحات اصلی مای‌فرزام جابه‌جا شوید، بازه نمودارها (۷ روز، ۲ هفته، ۱ ماه) را تغییر دهید و ناوگان نمایشی را بر اساس گروه یا پلاک فیلتر کنید.
          </p>
        </div>

        {/* 3D-Tilted Architectural Frame Holding the Interactive MyFarzam UI */}
        <div
          className="rounded-[28px] overflow-hidden border"
          style={{
            backgroundColor: 'var(--color-navy-950)',
            borderColor: 'var(--color-navy-700)',
            boxShadow: 'var(--shadow-beige-float)',
          }}
        >
          {/* App Window Top Chrome */}
          <div
            className="px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b"
            style={{
              backgroundColor: 'var(--color-navy-900)',
              borderColor: 'var(--surface-dark-border)',
            }}
          >
            <div className="flex items-center gap-3">
              <FarzamLogoMark className="w-5 h-7" fill="var(--color-orange-500)" />
              <div>
                <span className="text-xs font-extrabold block" style={{ color: 'var(--color-beige-50)' }}>
                  مای‌فرزام (MyFarzam) — پنل سازمانی نمایشی
                </span>
                <span className="text-[11px]" style={{ color: 'var(--color-beige-400)' }}>
                  تمامی پلاک‌ها، شماره‌ها و موقعیت‌ها شبیه‌سازی‌شده و نمایشی هستند
                </span>
              </div>
            </div>

            {/* Global Group Filter & Search inside the Product Shell */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="فیلتر گروه ناوگان در مای‌فرزام"
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--color-navy-950)',
                  color: 'var(--color-beige-50)',
                  border: '1px solid var(--surface-dark-border)',
                }}
              >
                <option value="همه گروه‌ها">همه گروه‌ها ({toPersianDigits(devices.length)})</option>
                {groupsList.map((g) => (
                  <option key={g.name} value={g.name}>
                    {g.name} ({toPersianDigits(g.count)})
                  </option>
                ))}
              </select>

              <input
                type="search"
                aria-label="جستجوی نام، پلاک یا IMEI دستگاه"
                placeholder="جستجوی خودرو، پلاک یا IMEI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs w-48 sm:w-56"
                style={{
                  backgroundColor: 'var(--color-navy-950)',
                  color: 'var(--color-beige-50)',
                  border: '1px solid var(--surface-dark-border)',
                }}
              />
            </div>
          </div>

          {/* Main Workspace Grid: RTL Sidebar + Active View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
            {/* RTL Navigation Sidebar (3 cols on desktop, horizontal bar on mobile) */}
            <div
              className="lg:col-span-3 p-4 border-b lg:border-b-0 lg:border-l flex flex-row lg:flex-col gap-1.5 overflow-x-auto"
              style={{
                backgroundColor: 'var(--color-navy-900)',
                borderColor: 'var(--surface-dark-border)',
              }}
              role="tablist"
              aria-label="منوی اصلی نرم‌افزار مای‌فرزام"
            >
              {[
                { id: 'dashboard', label: 'داشبورد مدیریتی', sub: 'KPI و نمودارهای دوره‌ای' },
                { id: 'map', label: 'نقشه دستگاه‌ها', sub: 'مکان‌یابی زنده و لایه‌ها' },
                { id: 'devices', label: 'مدیریت دستگاه‌ها', sub: 'لیست ردیاب‌ها و اشتراک' },
                { id: 'groups', label: 'مدیریت گروه‌ها', sub: 'سازمان‌دهی ناوگان' },
                { id: 'geofences', label: 'مدیریت محدوده‌ها', sub: 'دایره، چندضلعی و سرعت' },
              ].map((nav) => {
                const active = activePage === nav.id;
                return (
                  <button
                    key={nav.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActivePage(nav.id as WorkspacePage)}
                    className="text-right px-4 py-3 rounded-xl transition-all cursor-pointer shrink-0 lg:shrink"
                    style={{
                      backgroundColor: active ? 'var(--color-orange-500)' : 'transparent',
                      color: active ? 'var(--color-navy-950)' : 'var(--color-beige-100)',
                    }}
                  >
                    <span className="text-xs font-extrabold block whitespace-nowrap">{nav.label}</span>
                    <span
                      className="text-[10px] hidden lg:block mt-0.5"
                      style={{ color: active ? 'var(--color-navy-900)' : 'var(--color-beige-400)' }}
                    >
                      {nav.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Workspace Content (9 cols on desktop) */}
            <div className="lg:col-span-9 p-5 sm:p-7" style={{ backgroundColor: 'var(--color-navy-950)' }}>
              {/* VIEW 1: DASHBOARD (داشبورد مدیریتی) */}
              {activePage === 'dashboard' && (
                <div className="space-y-6">
                  {/* Period Switcher + Heatmap Entry Point */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-extrabold" style={{ color: 'var(--color-beige-50)' }}>
                        داشبورد مدیریتی ناوگان
                      </h3>
                      <p className="text-xs" style={{ color: 'var(--color-beige-400)' }}>
                        خلاصه وضعیت لحظه‌ای و نمودارهای تحلیلی بازه انتخابی
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className="flex items-center gap-1 p-1 rounded-xl"
                        style={{ backgroundColor: 'var(--color-navy-900)' }}
                        role="group"
                        aria-label="انتخاب بازه زمانی نمودارهای داشبورد"
                      >
                        {[
                          { id: '7d', label: '۷ روز گذشته' },
                          { id: '2w', label: '۲ هفته گذشته' },
                          { id: '1m', label: '۱ ماه گذشته' },
                        ].map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPeriod(p.id as DashboardPeriod)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                            style={{
                              backgroundColor: period === p.id ? 'var(--color-orange-500)' : 'transparent',
                              color: period === p.id ? 'var(--color-navy-950)' : 'var(--color-beige-200)',
                            }}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      <a
                        href="#reports"
                        className="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
                        style={{
                          backgroundColor: 'var(--color-navy-800)',
                          color: 'var(--color-orange-400)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      >
                        ورود به نقشه حرارتی ←
                      </a>
                    </div>
                  </div>

                  {/* 4 Authentic MyFarzam KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                      {
                        label: 'کل دستگاه‌ها',
                        val: summary.totalDevices,
                        sub: 'ثبت‌شده در فیلتر فعلی',
                        accent: 'var(--color-beige-50)',
                      },
                      {
                        label: 'دستگاه‌های روشن',
                        val: summary.poweredOnDevices,
                        sub: 'ورودی سوئیچ / تغذیه فعال',
                        accent: 'var(--color-orange-400)',
                      },
                      {
                        label: 'در حال حرکت',
                        val: summary.movingDevices,
                        sub: 'تله‌متری سرعت > ۰',
                        accent: 'var(--color-orange-500)',
                      },
                      {
                        label: 'دارای موقعیت فعال',
                        val: summary.activeLocationDevices,
                        sub: 'دریافت موقعیت معتبر GPS',
                        accent: 'var(--color-beige-200)',
                      },
                    ].map((kpi) => (
                      <div
                        key={kpi.label}
                        className="p-4 rounded-2xl"
                        style={{
                          backgroundColor: 'var(--color-navy-900)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      >
                        <span className="text-xs block mb-1" style={{ color: 'var(--color-beige-400)' }}>
                          {kpi.label}
                        </span>
                        <span
                          className="text-2xl sm:text-3xl font-black font-tabular block"
                          style={{ color: kpi.accent }}
                        >
                          {toPersianDigits(kpi.val)}
                        </span>
                        <span className="text-[11px] block mt-1" style={{ color: 'var(--color-beige-400)' }}>
                          {kpi.sub}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 4 Authentic MyFarzam Charts (Highest Speed, Longest Distance, Average Speed, Stop Count) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Chart 1: Highest Speed & Average Speed */}
                    <div
                      className="p-5 rounded-2xl"
                      style={{
                        backgroundColor: 'var(--color-navy-900)',
                        border: '1px solid var(--surface-dark-border)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-extrabold" style={{ color: 'var(--color-beige-50)' }}>
                          نمودار بیشترین سرعت و میانگین سرعت
                        </h4>
                        <span className="text-[11px] font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                          سقف ثبت‌شده: {toPersianDigits(96)} km/h
                        </span>
                      </div>
                      <div className="space-y-3">
                        {filtered.slice(0, 4).map((dev) => {
                          const maxSpd = dev.moving ? Math.min(98, dev.speedKmh + 14) : 72;
                          const avgSpd = dev.moving ? Math.max(42, dev.speedKmh - 12) : 48;
                          return (
                            <div key={dev.id} className="text-xs">
                              <div className="flex justify-between mb-1">
                                <span className="truncate max-w-[180px]" style={{ color: 'var(--color-beige-200)' }}>
                                  {dev.label}
                                </span>
                                <span className="font-tabular" style={{ color: 'var(--color-beige-400)' }}>
                                  میانگین: {toPersianDigits(avgSpd)} · بیشترین: {toPersianDigits(maxSpd)} km/h
                                </span>
                              </div>
                              <div className="h-2.5 rounded-full overflow-hidden flex gap-1" style={{ backgroundColor: 'var(--color-navy-950)' }}>
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${avgSpd}%`, backgroundColor: 'var(--color-beige-300)' }}
                                />
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${maxSpd - avgSpd}%`, backgroundColor: 'var(--color-orange-500)' }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chart 2: Longest Distance & Stop Counts */}
                    <div
                      className="p-5 rounded-2xl"
                      style={{
                        backgroundColor: 'var(--color-navy-900)',
                        border: '1px solid var(--surface-dark-border)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-extrabold" style={{ color: 'var(--color-beige-50)' }}>
                          نمودار بیشترین مسافت و تعداد توقف‌ها
                        </h4>
                        <span className="text-[11px] font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                          بازه: {period === '7d' ? '۷ روزه' : period === '2w' ? '۲ هفته‌ای' : '۱ ماهه'}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {filtered.slice(0, 4).map((dev, idx) => {
                          const distKm = Math.round((1420 - idx * 240) * periodFactor);
                          const stopsCount = Math.round((18 + idx * 5) * periodFactor);
                          const barPct = Math.min(95, 88 - idx * 14);
                          return (
                            <div key={dev.id} className="text-xs">
                              <div className="flex justify-between mb-1">
                                <span className="truncate max-w-[180px]" style={{ color: 'var(--color-beige-200)' }}>
                                  {dev.label}
                                </span>
                                <span className="font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                                  {formatPersianNumber(distKm)} km · {toPersianDigits(stopsCount)} توقف
                                </span>
                              </div>
                              <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-navy-950)' }}>
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{ width: `${barPct}%`, backgroundColor: 'var(--color-orange-500)' }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: DEVICES MAP (نقشه دستگاه‌ها) */}
              {activePage === 'map' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold" style={{ color: 'var(--color-beige-50)' }}>
                      نقشه زنده دستگاه‌ها (فیلترشده بر اساس: {groupFilter})
                    </h3>
                    <span className="text-xs font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                      {toPersianDigits(filtered.length)} دستگاه روی نقشه
                    </span>
                  </div>

                  <div
                    className="relative rounded-2xl overflow-hidden h-[340px]"
                    style={{
                      backgroundColor: 'var(--color-navy-900)',
                      border: '1px solid var(--surface-dark-border)',
                    }}
                  >
                    <svg viewBox="0 0 800 380" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                      <g stroke="var(--color-navy-700)" strokeWidth="1" opacity="0.5">
                        <line x1="0" y1="95" x2="800" y2="95" />
                        <line x1="0" y1="190" x2="800" y2="190" />
                        <line x1="0" y1="285" x2="800" y2="285" />
                        <line x1="200" y1="0" x2="200" y2="380" />
                        <line x1="400" y1="0" x2="400" y2="380" />
                        <line x1="600" y1="0" x2="600" y2="380" />
                      </g>
                      <path
                        d="M 70 290 Q 260 150 450 210 T 740 110"
                        fill="none"
                        stroke="var(--color-orange-500)"
                        strokeWidth="2.5"
                        strokeDasharray="6 6"
                      />
                      {filtered.map((dev) => {
                        const cx = (dev.xPct / 100) * 720 + 40;
                        const cy = (dev.yPct / 100) * 300 + 40;
                        const isSel = selectedDevice?.id === dev.id;
                        return (
                          <g
                            key={dev.id}
                            transform={`translate(${cx}, ${cy})`}
                            onClick={() => setSelectedDeviceId(dev.id)}
                            className="cursor-pointer"
                          >
                            <circle
                              r={isSel ? 18 : 11}
                              fill={dev.moving ? 'var(--color-orange-500)' : 'var(--color-beige-300)'}
                              fillOpacity="0.3"
                            />
                            <circle
                              r={isSel ? 8 : 6}
                              fill={dev.moving ? 'var(--color-orange-500)' : 'var(--color-beige-200)'}
                            />
                            <text
                              y="-14"
                              textAnchor="middle"
                              fill="var(--color-beige-50)"
                              fontSize="11"
                              fontWeight="700"
                            >
                              {dev.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {selectedDevice && (
                    <div
                      className="p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs"
                      style={{
                        backgroundColor: 'var(--color-navy-900)',
                        border: '1px solid var(--surface-dark-border)',
                      }}
                    >
                      <div>
                        <strong className="text-sm block" style={{ color: 'var(--color-beige-50)' }}>
                          {selectedDevice.label}
                        </strong>
                        <span style={{ color: 'var(--color-beige-400)' }}>
                          پلاک: {selectedDevice.plate} · گروه: {selectedDevice.group} · محدوده: {selectedDevice.geofenceName}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 font-tabular">
                        <span style={{ color: 'var(--color-orange-400)' }}>
                          سرعت: {toPersianDigits(selectedDevice.speedKmh)} km/h
                        </span>
                        <span style={{ color: 'var(--color-beige-200)' }}>
                          ولتاژ: {toPersianDigits(selectedDevice.voltage)}V
                        </span>
                        <span style={{ color: 'var(--color-beige-400)' }}>
                          آخرین موقعیت: {selectedDevice.lastPositionText}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 3: DEVICE MANAGEMENT (مدیریت دستگاه‌ها) */}
              {activePage === 'devices' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold" style={{ color: 'var(--color-beige-50)' }}>
                      جدول مدیریت دستگاه‌ها (موجودی ردیاب‌ها، تازگی اتصال و اعتبار اشتراک)
                    </h3>
                    <a
                      href="#connectivity"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold"
                      style={{ backgroundColor: 'var(--color-orange-500)', color: 'var(--color-navy-950)' }}
                    >
                      + افزودن دستگاه جدید
                    </a>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--surface-dark-border)' }}>
                    <table className="w-full text-right text-xs border-collapse font-tabular">
                      <thead>
                        <tr style={{ backgroundColor: 'var(--color-navy-900)', color: 'var(--color-beige-200)' }}>
                          <th className="py-3 px-3.5 font-bold">برچسب خودرو / شخص</th>
                          <th className="py-3 px-3.5 font-bold">پلاک</th>
                          <th className="py-3 px-3.5 font-bold">شناسه IMEI</th>
                          <th className="py-3 px-3.5 font-bold">شماره سیم‌کارت</th>
                          <th className="py-3 px-3.5 font-bold">آخرین موقعیت / اتصال</th>
                          <th className="py-3 px-3.5 font-bold">نوع و اعتبار اشتراک</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((dev) => (
                          <tr
                            key={dev.id}
                            className="border-t"
                            style={{
                              borderColor: 'var(--surface-dark-border)',
                              color: 'var(--color-beige-50)',
                            }}
                          >
                            <td className="py-3 px-3.5 font-bold whitespace-nowrap">{dev.label}</td>
                            <td className="py-3 px-3.5 whitespace-nowrap">{dev.plate}</td>
                            <td className="py-3 px-3.5 whitespace-nowrap" style={{ color: 'var(--color-beige-400)' }}>
                              {toPersianDigits(dev.imei)}
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap" style={{ color: 'var(--color-beige-400)' }}>
                              {toPersianDigits(dev.sim)}
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap" style={{ color: 'var(--color-orange-400)' }}>
                              {dev.lastPositionText}
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              {dev.subscriptionType} · {toPersianDigits(dev.subscriptionDaysLeft)} روز مانده
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 4: GROUPS (مدیریت گروه‌ها) */}
              {activePage === 'groups' && (
                <div className="space-y-4">
                  <h3 className="text-base font-extrabold" style={{ color: 'var(--color-beige-50)' }}>
                    مدیریت گروه‌ها (سازمان‌دهی ناوگان برای فیلتر نقشه و گزارش‌های تجمیعی)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {groupsList.map((grp) => (
                      <div
                        key={grp.name}
                        className="p-5 rounded-2xl flex items-center justify-between"
                        style={{
                          backgroundColor: 'var(--color-navy-900)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      >
                        <div>
                          <h4 className="text-sm font-extrabold" style={{ color: 'var(--color-beige-50)' }}>
                            {grp.name}
                          </h4>
                          <p className="text-xs mt-1" style={{ color: 'var(--color-beige-400)' }}>
                            قابل انتخاب در گزارش عملکرد و نقشه حرارتی
                          </p>
                        </div>
                        <div className="text-left">
                          <span className="text-xl font-black font-tabular block" style={{ color: 'var(--color-orange-400)' }}>
                            {toPersianDigits(grp.count)}
                          </span>
                          <span className="text-[11px]" style={{ color: 'var(--color-beige-400)' }}>
                            دستگاه عضو
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 5: GEOFENCES (مدیریت محدوده‌ها) */}
              {activePage === 'geofences' && (
                <div className="space-y-4">
                  <h3 className="text-base font-extrabold" style={{ color: 'var(--color-beige-50)' }}>
                    مدیریت محدوده‌های جغرافیایی (Geofences)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {geofencesList.map((gf) => (
                      <div
                        key={gf.name}
                        className="p-5 rounded-2xl"
                        style={{
                          backgroundColor: 'var(--color-navy-900)',
                          border: '1px solid var(--surface-dark-border)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-extrabold" style={{ color: 'var(--color-beige-50)' }}>
                            {gf.name}
                          </h4>
                          <span className="text-xs font-bold font-tabular" style={{ color: 'var(--color-orange-400)' }}>
                            سقف سرعت: {gf.maxSpeed}
                          </span>
                        </div>
                        <p className="text-xs mb-2" style={{ color: 'var(--color-beige-200)' }}>
                          نوع هندسه: {gf.type}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-beige-400)' }}>
                          {gf.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
