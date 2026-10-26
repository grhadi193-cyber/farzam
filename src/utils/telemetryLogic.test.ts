import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toPersianDigits,
  toAsciiDigits,
  formatPersianNumber,
  validateTrackerImei,
  validateSimNumber,
  filterAndSummarizeFleet,
  filterStopReportByDuration,
  buildExcelCsv,
  validateLeadSubmission,
  type FleetDeviceRecord,
} from './telemetryLogic';

test('toPersianDigits and toAsciiDigits roundtrip accurately', () => {
  assert.equal(toPersianDigits(1403), '۱۴۰۳');
  assert.equal(toPersianDigits('IMEI-864209'), 'IMEI-۸۶۴۲۰۹');
  assert.equal(toAsciiDigits('۰۹۱۲۳۴۵۶۷۸۹'), '09123456789');
});

test('formatPersianNumber formats thousands and decimals with Persian numerals', () => {
  assert.equal(formatPersianNumber(12480), '۱۲٬۴۸۰');
  assert.equal(formatPersianNumber(14.6, 1), '۱۴٫۶');
});

test('validateTrackerImei and validateSimNumber accept Persian and ASCII numerals', () => {
  assert.equal(validateTrackerImei('۸۶۴۲۱۰۹۸۷۶۵۴۳۲۱').valid, true);
  assert.equal(validateTrackerImei('1234').valid, false);
  assert.equal(validateSimNumber('۰۹۱۲۰۰۱۱۱۲۲').valid, true);
  assert.equal(validateSimNumber('08120011122').valid, false);
});

test('filterAndSummarizeFleet calculates MyFarzam Dashboard KPIs accurately', () => {
  const sample: FleetDeviceRecord[] = [
    {
      id: 'd1',
      label: 'کشنده ولوو FH-۴۸۰',
      imei: '864201000011112',
      model: 'FZ-Pro T800',
      sim: '09120001101',
      plate: '۱۲ ع ۳۴۵ - ایران ۱۱',
      group: 'ترانزیت جاده‌ای',
      poweredOn: true,
      moving: true,
      activeLocation: true,
      speedKmh: 84,
      voltage: 24.4,
      temperatureC: -18.2,
      fuelLitersPer100Km: 29.5,
      lastPositionText: '۱۰ ثانیه پیش',
      lastConnectionText: '۱۰ ثانیه پیش',
      subscriptionType: 'سازمانی',
      subscriptionStatus: 'معتبر',
      subscriptionDaysLeft: 240,
      geofenceState: 'داخل محدوده',
      geofenceName: 'پایانه غرب تهران',
      xPct: 42,
      yPct: 38,
    },
    {
      id: 'd2',
      label: 'ایسوزو یخچال‌دار ۶ تن',
      imei: '864201000022223',
      model: 'FZ-Cold S400',
      sim: '09120001102',
      plate: '۶۸ ط ۷۱۲ - ایران ۲۲',
      group: 'زنجیره سرد دارو',
      poweredOn: true,
      moving: false,
      activeLocation: true,
      speedKmh: 0,
      voltage: 24.1,
      temperatureC: 3.4,
      fuelLitersPer100Km: 16.2,
      lastPositionText: '۱ دقیقه پیش',
      lastConnectionText: '۱ دقیقه پیش',
      subscriptionType: 'سازمانی',
      subscriptionStatus: 'معتبر',
      subscriptionDaysLeft: 185,
      geofenceState: 'داخل محدوده',
      geofenceName: 'انبار مرکزی کرج',
      xPct: 64,
      yPct: 52,
    },
  ];

  const all = filterAndSummarizeFleet(sample, 'همه گروه‌ها', '');
  assert.equal(all.summary.totalDevices, 2);
  assert.equal(all.summary.poweredOnDevices, 2);
  assert.equal(all.summary.movingDevices, 1);
  assert.equal(all.summary.activeLocationDevices, 2);

  const coldGroup = filterAndSummarizeFleet(sample, 'زنجیره سرد دارو', '');
  assert.equal(coldGroup.summary.totalDevices, 1);
  assert.equal(coldGroup.summary.movingDevices, 0);
});

test('filterStopReportByDuration filters short and long stops', () => {
  const stops = [
    { id: 's1', deviceLabel: 'واحد ۱', startTime: '08:00', endTime: '08:04', durationMinutes: 4, durationLabel: '۴ دقیقه', address: 'نقطه الف' },
    { id: 's2', deviceLabel: 'واحد ۱', startTime: '09:00', endTime: '09:45', durationMinutes: 45, durationLabel: '۴۵ دقیقه', address: 'نقطه ب' },
    { id: 's3', deviceLabel: 'واحد ۱', startTime: '12:00', endTime: '16:30', durationMinutes: 270, durationLabel: '۴ ساعت و ۳۰ دقیقه', address: 'نقطه ج' },
  ];
  const filtered = filterStopReportByDuration(stops, 15, 120);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 's2');
});

test('buildExcelCsv produces BOM-prefixed CSV and validateLeadSubmission checks fields', () => {
  const csv = buildExcelCsv('عملکرد', ['نام دستگاه', 'مسافت'], [['کامیونت ۱', '۴۲۰ کیلومتر']]);
  assert.equal(csv.startsWith('\uFEFF'), true);
  assert.equal(csv.includes('کامیونت ۱'), true);

  const invalid = validateLeadSubmission({
    fullName: 'ع',
    organizationName: 'پخش البرز',
    phone: '123',
    subscriptionMode: 'سازمانی',
    fleetCount: '0',
  });
  assert.equal(invalid.valid, false);

  const valid = validateLeadSubmission({
    fullName: 'مهندس آرش کاظمی',
    organizationName: 'لجستیک البرز',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    subscriptionMode: 'سازمانی',
    fleetCount: '۴۵',
  });
  assert.equal(valid.valid, true);
});
