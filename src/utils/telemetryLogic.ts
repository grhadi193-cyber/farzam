const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Converts ASCII digits (0-9) in any string or number to Persian digits (۰-۹).
 */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

/**
 * Converts Persian/Arabic digits back to ASCII digits for validation and math.
 */
export function toAsciiDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/**
 * Formats an integer or float with Persian digits and Persian thousands separator.
 */
export function formatPersianNumber(value: number, decimals = 0): string {
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  const formatted = decPart ? `${withCommas}٫${decPart}` : withCommas;
  return toPersianDigits(formatted);
}

/**
 * Validates tracker IMEI/ID (8 to 15 numeric digits).
 */
export function validateTrackerImei(raw: string): { valid: boolean; normalized: string; error?: string } {
  const clean = toAsciiDigits(raw).replace(/[\s-]/g, '');
  if (!clean) {
    return { valid: false, normalized: '', error: 'شناسه دستگاه (IMEI/ID) الزامی است.' };
  }
  if (!/^\d{8,15}$/.test(clean)) {
    return { valid: false, normalized: clean, error: 'شناسه IMEI باید بین ۸ تا ۱۵ رقم باشد.' };
  }
  return { valid: true, normalized: clean };
}

/**
 * Validates cellular SIM card number for tracker (11 digits starting with 09).
 */
export function validateSimNumber(raw: string): { valid: boolean; normalized: string; error?: string } {
  const clean = toAsciiDigits(raw).replace(/[\s-]/g, '');
  if (!clean) {
    return { valid: false, normalized: '', error: 'شماره سیم‌کارت دستگاه الزامی است.' };
  }
  if (!/^09\d{9}$/.test(clean)) {
    return { valid: false, normalized: clean, error: 'شماره سیم‌کارت باید ۱۱ رقم و با ۰۹ شروع شود.' };
  }
  return { valid: true, normalized: clean };
}

export interface FleetDeviceRecord {
  id: string;
  label: string;
  imei: string;
  model: string;
  sim: string;
  plate: string;
  group: string;
  poweredOn: boolean;
  moving: boolean;
  activeLocation: boolean;
  speedKmh: number;
  voltage: number;
  temperatureC: number | null;
  fuelLitersPer100Km: number | null;
  lastPositionText: string;
  lastConnectionText: string;
  subscriptionType: 'سازمانی' | 'شخصی' | 'پایه';
  subscriptionStatus: 'معتبر' | 'نیازمند تمدید';
  subscriptionDaysLeft: number;
  geofenceState: 'داخل محدوده' | 'خارج از محدوده';
  geofenceName: string;
  xPct: number;
  yPct: number;
}

export interface FleetKpiSummary {
  totalDevices: number;
  poweredOnDevices: number;
  movingDevices: number;
  activeLocationDevices: number;
}

/**
 * Filters devices by group and search query, and computes the 4 MyFarzam Dashboard KPIs.
 */
export function filterAndSummarizeFleet(
  devices: FleetDeviceRecord[],
  groupFilter: string,
  searchQuery: string,
): { filtered: FleetDeviceRecord[]; summary: FleetKpiSummary } {
  const normalizedQuery = toAsciiDigits(searchQuery.trim()).toLowerCase();

  const filtered = devices.filter((device) => {
    const matchesGroup = groupFilter === 'همه گروه‌ها' || !groupFilter || device.group === groupFilter;
    if (!matchesGroup) return false;
    if (!normalizedQuery) return true;

    const searchable = toAsciiDigits(
      `${device.label} ${device.imei} ${device.plate} ${device.group} ${device.sim}`,
    ).toLowerCase();
    return searchable.includes(normalizedQuery);
  });

  const summary: FleetKpiSummary = {
    totalDevices: filtered.length,
    poweredOnDevices: filtered.filter((d) => d.poweredOn).length,
    movingDevices: filtered.filter((d) => d.moving).length,
    activeLocationDevices: filtered.filter((d) => d.activeLocation).length,
  };

  return { filtered, summary };
}

export interface StopReportEntry {
  id: string;
  deviceLabel: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  durationLabel: string;
  address: string;
}

/**
 * Filters Stop Report rows by minimum and maximum stop duration in minutes.
 */
export function filterStopReportByDuration(
  entries: StopReportEntry[],
  minMinutes: number,
  maxMinutes: number | null,
): StopReportEntry[] {
  return entries.filter((entry) => {
    if (entry.durationMinutes < minMinutes) return false;
    if (maxMinutes !== null && entry.durationMinutes > maxMinutes) return false;
    return true;
  });
}

/**
 * Generates an Excel-compatible UTF-8 BOM CSV string from report headers and rows.
 */
export function buildExcelCsv(title: string, headers: string[], rows: string[][]): string {
  const escapeCell = (val: string) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };
  const lines = [
    escapeCell(`گزارش سامانه مای‌فرزام (داده نمایشی) - ${title}`),
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ];
  return `\uFEFF${lines.join('\r\n')}`;
}

export interface LeadSubmissionInput {
  fullName: string;
  organizationName: string;
  phone: string;
  subscriptionMode: 'سازمانی' | 'شخصی' | 'سفارشی';
  fleetCount: string;
}

export function validateLeadSubmission(input: LeadSubmissionInput): {
  valid: boolean;
  errors: Partial<Record<keyof LeadSubmissionInput, string>>;
} {
  const errors: Partial<Record<keyof LeadSubmissionInput, string>> = {};
  if (!input.fullName || input.fullName.trim().length < 3) {
    errors.fullName = 'لطفاً نام و نام خانوادگی را وارد کنید (حداقل ۳ حرف).';
  }
  const simCheck = validateSimNumber(input.phone);
  if (!simCheck.valid) {
    errors.phone = 'شماره موبایل معتبر ۱۱ رقمی (مثال: ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.';
  }
  const countNum = Number(toAsciiDigits(input.fleetCount));
  if (!input.fleetCount || Number.isNaN(countNum) || countNum < 1) {
    errors.fleetCount = 'تعداد دستگاه یا خودرو را مشخص کنید.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
