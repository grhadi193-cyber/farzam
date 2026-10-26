import type { FleetDeviceRecord, StopReportEntry } from '../utils/telemetryLogic';

export interface HardwareLayerSpec {
  id: 'gps' | 'sim' | 'ignition' | 'motion' | 'voltage' | 'temperature' | 'fuel';
  title: string;
  subtitle: string;
  optionalBadge?: string;
  hardwareSource: string;
  softwareCapabilitiesFed: string[];
  telemetrySample: string;
  yOffset3D: number;
  accentRole: 'orange' | 'navy' | 'beige' | 'cold';
}

export const HARDWARE_LAYERS: HardwareLayerSpec[] = [
  {
    id: 'gps',
    title: 'ماژول موقعیت‌یاب ماهواره‌ای (GPS + IMEI/ID)',
    subtitle: 'هسته مکانی و شناسه یکتای سخت‌افزار',
    hardwareSource: 'ردیاب GPS با شناسه یکتای IMEI/ID',
    softwareCapabilitiesFed: [
      'ثبت دستگاه در حساب کاربری',
      'نقشه زنده دستگاه‌ها و تازگی آخرین موقعیت',
      'گزارش‌های پیمایش، سفر، توقف، محدوده و نقشه حرارتی',
    ],
    telemetrySample: 'IMEI: ۸۶۴۲۰۱۰۹۴۸۲۱۱۰۴ · دقت افقی: ۱٫۸ متر',
    yOffset3D: 1.45,
    accentRole: 'orange',
  },
  {
    id: 'sim',
    title: 'ماژول مخابراتی و سیم‌کارت (Cellular SIM)',
    subtitle: 'کانال انتقال پالس به سرورهای مای‌فرزام',
    hardwareSource: 'سیم‌کارت سلولی داخل ردیاب',
    softwareCapabilitiesFed: [
      'احراز اتصال در فرم افزودن دستگاه',
      'پایش وضعیت ارتباط و زمان آخرین اتصال',
      'اعلان سیستمی «عدم دریافت داده جدید» در صورت قطع آنتن',
    ],
    telemetrySample: 'SIM: ۰۹۱۲۰۰۴۸۱۱۰ · آخرین اتصال: ۴ ثانیه پیش',
    yOffset3D: 0.95,
    accentRole: 'beige',
  },
  {
    id: 'ignition',
    title: 'ورودی سوئیچ و تغذیه (Ignition / ACC)',
    subtitle: 'تشخیص لحظه استارت و ساعت کارکرد واقعی موتور',
    hardwareSource: 'ورودی برق و سوئیچ خودرو (بسته به مدل ردیاب)',
    softwareCapabilitiesFed: [
      'شاخص کلیدی «دستگاه‌های روشن» در داشبورد مدیریتی',
      'اعلان‌های روشن و خاموش شدن سوئیچ (Ignition On/Off)',
      'محاسبه اولین استارت، آخرین خاموشی و زمان روشن بودن در گزارش روزانه و عملکرد',
    ],
    telemetrySample: 'وضعیت ACC: روشن · کارکرد شیفت: ۰۶:۴۲:۱۰',
    yOffset3D: 0.45,
    accentRole: 'orange',
  },
  {
    id: 'motion',
    title: 'تله‌متری حرکت و شتاب‌سنج (Motion & Speed)',
    subtitle: 'تفکیک حرکت واقعی، درجا کار کردن و توقف',
    hardwareSource: 'تله‌متری سرعت و تشخیص حرکت سخت‌افزاری',
    softwareCapabilitiesFed: [
      'شاخص «در حال حرکت» در داشبورد مدیریتی',
      'اعلان شروع حرکت، توقف و سرعت غیرمجاز در محدوده',
      'نمودارهای بیشترین سرعت و میانگین سرعت + گزارش‌های سفر و توقف',
    ],
    telemetrySample: 'سرعت لحظه‌ای: ۷۸ کیلومتر بر ساعت · زاویه: ۲۴۵ درجه',
    yOffset3D: -0.05,
    accentRole: 'orange',
  },
  {
    id: 'voltage',
    title: 'پایش ولتاژ و سلامت برق (Power / Voltage)',
    subtitle: 'کنترل پایداری باتری در طول مسیر پیمایش',
    hardwareSource: 'تله‌متری ولتاژ و تغذیه سازگار',
    softwareCapabilitiesFed: [
      'امکان نمایش ولتاژ در هر نقطه مکانی در «گزارش پیمایش» (Route)',
      'پایش نوسان ولتاژ باتری کشنده یا خودرو در طول مسیر',
    ],
    telemetrySample: 'ولتاژ نقطه پیمایش: ۲۴٫۳ ولت (پایدار)',
    yOffset3D: -0.55,
    accentRole: 'beige',
  },
  {
    id: 'temperature',
    title: 'سنسور دما و زنجیره سرد (Temperature)',
    subtitle: 'پایش پیوسته محموله‌های حساس دارویی و غذایی',
    optionalBadge: 'با سنسور یا ردیاب سازگار',
    hardwareSource: 'ردیاب دارای قابلیت دما یا سنسور دمای متصل',
    softwareCapabilitiesFed: [
      'تولید «گزارش دما» (Temperature Report) با ثبت دقیق دما و زمان',
      'کاهش ریسک فساد محموله در حمل‌ونقل یخچالی و سردخانه‌ای',
    ],
    telemetrySample: 'دمای کابین عقب: ۴٫۲- درجه سانتی‌گراد',
    yOffset3D: -1.05,
    accentRole: 'cold',
  },
  {
    id: 'fuel',
    title: 'سنسور و محاسبه‌گر سوخت (Fuel Sensing)',
    subtitle: 'رهگیری مصرف در ۱۰۰ کیلومتر و هشدار نشت سوخت',
    optionalBadge: 'با سنسور یا محاسبه‌گر سازگار',
    hardwareSource: 'سنسور سوخت یا محاسبه سوخت سازگار با مدل ردیاب',
    softwareCapabilitiesFed: [
      'ثبت رویداد «نشت سوخت» (Fuel Leak) در گزارش رویداد',
      'محاسبه مصرف سوخت در ۱۰۰ کیلومتر در گزارش‌های روزانه و عملکرد',
    ],
    telemetrySample: 'مصرف میانگین: ۲۸٫۴ لیتر در ۱۰۰ کیلومتر',
    yOffset3D: -1.55,
    accentRole: 'navy',
  },
];

export interface ReportChapterSpec {
  id: 'route' | 'trip' | 'stop' | 'daily' | 'performance' | 'geofence' | 'event' | 'heatmap' | 'temperature';
  persianName: string;
  englishName: string;
  managerQuestion: string;
  metaphorTitle: string;
  metaphorDescription: string;
  orgPillar: 'پاسخگویی و شفافیت' | 'کنترل هزینه' | 'ایمنی و انطباق' | 'مستندسازی و اکسل';
  inputsObserved: string[];
  outputsObserved: string[];
  hardwareDependency: string;
  hasExcelExport: boolean;
  isMultiDeviceCapable?: boolean;
  tableHeaders: string[];
  tableRows: string[][];
}

export const NINE_REPORTS: ReportChapterSpec[] = [
  {
    id: 'route',
    persianName: 'گزارش پیمایش',
    englishName: 'Route',
    managerQuestion: '«خودرو دقیقاً از کدام مسیر رفت و ولتاژ برق در هر نقطه چقدر بود؟»',
    metaphorTitle: 'رشته سیگنال ترسیم‌کننده مسیر',
    metaphorDescription: 'خط نارنجی سیگنال، نقاط GPS را به هم می‌دوزد؛ با فیلتر حذف نقاط سرعت صفر، پاک‌سازی پرش‌های جمینگ و نمایش ولتاژ هر نقطه.',
    orgPillar: 'پاسخگویی و شفافیت',
    inputsObserved: [
      'انتخاب یک دستگاه',
      'بازه سریع: ساعت گذشته، امروز، دیروز یا سفارشی',
      'فیلتر حذف سرعت صفر، پاک‌سازی پرش مسافت طولانی / جمینگ GPS، و نمایش ولتاژ نقاط',
    ],
    outputsObserved: ['نقشه کامل مسیر پیمایش', 'خروجی اکسل پس از تولید نتایج'],
    hardwareDependency: 'نقاط GPS؛ نمایش ولتاژ نیازمند تله‌متری ولتاژ سازگار است.',
    hasExcelExport: true,
    tableHeaders: ['زمان ثبت', 'موقعیت نمایشی', 'سرعت (km/h)', 'وضعیت سرعت صفر', 'ولتاژ نقطه (V)'],
    tableRows: [
      ['۱۴۰۳/۰۸/۰۴ - ۰۸:۱۲:۱۰', 'کیلومتر ۱۴ آزادراه تهران-کرج (نمایشی)', '۸۲', 'در حرکت', '۲۴٫۴ ولت'],
      ['۱۴۰۳/۰۸/۰۴ - ۰۸:۲۸:۴۵', 'ورودی شهرک صنعتی البرز (نمایشی)', '۶۴', 'در حرکت', '۲۴٫۲ ولت'],
      ['۱۴۰۳/۰۸/۰۴ - ۰۸:۵۰:۰۰', 'پایانه باربری قزوین - سوله ۳ (نمایشی)', '۱۲', 'در حرکت', '۲۳٫۹ ولت'],
      ['۱۴۰۳/۰۸/۰۴ - ۰۹:۱۵:۳۰', 'کمربندی شمالی زنجان (نمایشی)', '۸۸', 'در حرکت', '۲۴٫۵ ولت'],
    ],
  },
  {
    id: 'trip',
    persianName: 'گزارش سفر',
    englishName: 'Trip',
    managerQuestion: '«این خودرو در طول دوره به چند سفر مجزا تقسیم شد؟»',
    metaphorTitle: 'مهره‌های سفر روی نخ سیگنال',
    metaphorDescription: 'بازه کاری دستگاه به قطعات روشن و مشخص (هر سفر یک مهره با مبدا، مقصد، مسافت و سرعت) تفکیک می‌شود.',
    orgPillar: 'پاسخگویی و شفافیت',
    inputsObserved: ['انتخاب دستگاه', 'تاریخ و ساعت شروع و پایان'],
    outputsObserved: ['ساعت شروع و پایان هر سفر', 'مسافت طی‌شده، میانگین سرعت و بیشترین سرعت', 'خروجی اکسل پس از تولید نتایج'],
    hardwareDependency: 'موقعیت GPS و تشخیص حرکت دستگاه.',
    hasExcelExport: true,
    tableHeaders: ['شماره سفر', 'زمان شروع', 'زمان پایان', 'مسافت (کیلومتر)', 'میانگین سرعت', 'بیشترین سرعت'],
    tableRows: [
      ['سفر ۱ (نمایشی)', '۰۶:۳۰:۰۰', '۰۹:۱۰:۰۰', '۱۸۴٫۵ km', '۶۹ km/h', '۹۴ km/h'],
      ['سفر ۲ (نمایشی)', '۱۰:۱۵:۰۰', '۱۲:۴۵:۰۰', '۱۴۲٫۰ km', '۵۷ km/h', '۸۸ km/h'],
      ['سفر ۳ (نمایشی)', '۱۴:۰۰:۰۰', '۱۷:۲۰:۰۰', '۲۱۸٫۳ km', '۶۵ km/h', '۹۶ km/h'],
      ['سفر ۴ (نمایشی)', '۱۸:۱۰:۰۰', '۱۹:۴۰:۰۰', '۹۱٫۲ km', '۶۱ km/h', '۸۴ km/h'],
    ],
  },
  {
    id: 'stop',
    persianName: 'گزارش توقف',
    englishName: 'Stop',
    managerQuestion: '«کجا و چه مدت متوقف ماند؟ توقف‌های کوتاه بی‌اهمیت را چطور کنار بگذارم؟»',
    metaphorTitle: 'حلقه‌های ماندگاری زیر پین نقشه',
    metaphorDescription: 'حلقه‌ای که زیر نقطه توقف متناسب با زمان درنگ بزرگ می‌شود؛ با فیلتر حداقل و حداکثر زمان توقف از چند دقیقه تا چند روز.',
    orgPillar: 'کنترل هزینه',
    inputsObserved: ['انتخاب دستگاه', 'تاریخ و ساعت شروع و پایان', 'حداقل و حداکثر مدت توقف (نامحدود، دقیقه، ساعت، چند روز)'],
    outputsObserved: ['زمان شروع و پایان توقف', 'مدت توقف، نشانی مکانی و عملیات ردیف', 'خروجی اکسل پس از تولید نتایج'],
    hardwareDependency: 'موقعیت GPS و تشخیص سرعت/توقف.',
    hasExcelExport: true,
    tableHeaders: ['واحد ناوگان', 'شروع توقف', 'پایان توقف', 'مدت توقف', 'نشانی نمایشی'],
    tableRows: [
      ['کشنده ولوو FH-۴۸۰', '۰۹:۱۰:۰۰', '۱۰:۱۵:۰۰', '۶۵ دقیقه', 'مجتمع خدماتی آفتاب - محور قزوین (نمایشی)'],
      ['کشنده ولوو FH-۴۸۰', '۱۲:۴۵:۰۰', '۱۴:۰۰:۰۰', '۷۵ دقیقه', 'انبار تخلیه منطقه‌ای زنجان (نمایشی)'],
      ['کشنده ولوو FH-۴۸۰', '۱۷:۲۰:۰۰', '۱۸:۱۰:۰۰', '۵۰ دقیقه', 'ایستگاه توزین و کنترل بار (نمایشی)'],
    ],
  },
  {
    id: 'daily',
    persianName: 'گزارش روزانه',
    englishName: 'Daily',
    managerQuestion: '«شیفت کاری دیروز چطور گذشت؟ چقدر حرکت و چقدر درجا کار کردن داشتیم؟»',
    metaphorTitle: 'حلقه ساعت شیفت و تفکیک کارکرد موتور',
    metaphorDescription: 'حلقه ۲۴ ساعته که نخستین روشن شدن سوئیچ تا آخرین خاموشی را به زمان حرکت، توقف و کارکرد درجا (Idle) تقسیم می‌کند.',
    orgPillar: 'کنترل هزینه',
    inputsObserved: ['انتخاب دستگاه', 'تاریخ و ساعت شروع و پایان', 'ساعت شروع و پایان روز کاری'],
    outputsObserved: [
      'اولین روشن شدن و آخرین خاموش شدن سوئیچ',
      'مسافت، میانگین و بیشترین سرعت',
      'مجموع زمان توقف، حرکت، روشن بودن سوئیچ و درجا کار کردن + مصرف سوخت در ۱۰۰ کیلومتر',
      'خروجی اکسل پس از تولید نتایج',
    ],
    hardwareDependency: 'GPS، سرعت و سوئیچ؛ فیلد مصرف سوخت نیازمند تله‌متری/محاسبه سوخت سازگار است.',
    hasExcelExport: true,
    tableHeaders: ['تاریخ کاری', 'اولین استارت', 'آخرین خاموشی', 'مسافت کل', 'زمان حرکت / درجا', 'مصرف سوخت (۱۰۰km)'],
    tableRows: [
      ['۱۴۰۳/۰۸/۰۱', '۰۶:۱۲', '۱۹:۴۸', '۵۱۲ km', '۰۷:۴۰ حرکت / ۰۱:۱۵ درجا', '۲۸٫۶ لیتر (با سنسور سازگار)'],
      ['۱۴۰۳/۰۸/۰۲', '۰۶:۰۵', '۱۸:۳۰', '۴۶۸ km', '۰۶:۵۵ حرکت / ۰۰:۴۸ درجا', '۲۷٫۹ لیتر (با سنسور سازگار)'],
      ['۱۴۰۳/۰۸/۰۳', '۰۷:۰۰', '۲۰:۱۰', '۵۴۹ km', '۰۸:۱۰ حرکت / ۰۱:۳۲ درجا', '۲۹٫۴ لیتر (با سنسور سازگار)'],
    ],
  },
  {
    id: 'performance',
    persianName: 'گزارش عملکرد',
    englishName: 'Performance',
    managerQuestion: '«در میان کل گروه یا چند خودرو، کدام واحد عملکرد بهتری داشت؟»',
    metaphorTitle: 'مسابقه ستون‌های موازی ناوگان',
    metaphorDescription: 'مقایسه شانه‌به‌شانه چند دستگاه یا یک گروه کامل در مسافت، سرعت، ساعت روشن بودن موتور و مصرف سوخت.',
    orgPillar: 'کنترل هزینه',
    inputsObserved: ['انتخابگر گروه (اختیاری)', 'انتخابگر چند دستگاه (Multi-device)', 'تاریخ و ساعت شروع و پایان'],
    outputsObserved: [
      'برچسب خودرو/شخص، بازه شروع و پایان',
      'مسافت، میانگین/بیشترین سرعت، کل زمان توقف/حرکت/روشن بودن سوئیچ و مصرف سوخت',
      'خروجی اکسل پس از تولید نتایج',
    ],
    hardwareDependency: 'مشابه گزارش روزانه؛ انتخاب چند دستگاه ویژه بهره‌برداری سازمانی است.',
    hasExcelExport: true,
    isMultiDeviceCapable: true,
    tableHeaders: ['نام واحد (چنددستگاهی)', 'مسافت طی‌شده', 'میانگین سرعت', 'بیشترین سرعت', 'زمان روشن بودن سوئیچ', 'مصرف سوخت'],
    tableRows: [
      ['کشنده ولوو FH-۴۸۰ (کد ۱۰۱)', '۲٬۸۴۰ km', '۶۸ km/h', '۹۵ km/h', '۴۱:۲۰:۰۰', '۲۸٫۴ L/100km'],
      ['کشنده داف XF-۵۳۰ (کد ۱۰۴)', '۳٬۱۲۰ km', '۷۲ km/h', '۹۲ km/h', '۴۳:۱۰:۰۰', '۲۷٫۱ L/100km'],
      ['کامیونت ایسوزو ۶ تن (کد ۲۰۸)', '۱٬۶۹۰ km', '۵۴ km/h', '۸۶ km/h', '۳۱:۴۵:۰۰', '۱۶٫۵ L/100km'],
      ['وانت نیسان یخچالی (کد ۳۱۲)', '۱٬۲۴۰ km', '۴۹ km/h', '۸۰ km/h', '۲۵:۳۰:۰۰', '۱۴٫۲ L/100km'],
    ],
  },
  {
    id: 'geofence',
    persianName: 'گزارش محدوده',
    englishName: 'Geofence',
    managerQuestion: '«خودرو چه ساعتی داخل سایت یا انبار بود و چه مدتی خارج از محدوده فعالیت کرد؟»',
    metaphorTitle: 'گنبد مرزی و تفکیک داخل / خارج',
    metaphorDescription: 'عبور رشته سیگنال از مرز هندسی (دایره یا چندضلعی) و ثبت دقیق کارکرد داخل و خارج از هر محدوده.',
    orgPillar: 'ایمنی و انطباق',
    inputsObserved: [
      'انتخاب دستگاه، تاریخ و ساعت شروع و پایان، بازه ساعت کاری',
      'انتخابگر محدوده (فعال پس از انتخاب پیش‌نیاز) + چک‌باکس‌های «داخل محدوده» و «خارج از محدوده»',
    ],
    outputsObserved: [
      'نام محدوده، وضعیت داخل/خارج، شروع و پایان',
      'مسافت، میانگین/بیشترین سرعت، کل زمان توقف/حرکت/روشن بودن سوئیچ',
      'خروجی اکسل پس از تولید نتایج',
    ],
    hardwareDependency: 'موقعیت GPS به همراه هندسه محدوده‌های ذخیره‌شده در نرم‌افزار.',
    hasExcelExport: true,
    tableHeaders: ['نام محدوده', 'وضعیت حضور', 'زمان ورود / شروع', 'زمان خروج / پایان', 'مسافت در وضعیت', 'زمان روشن بودن سوئیچ'],
    tableRows: [
      ['انبار مرکزی کرج (چندضلعی)', 'داخل محدوده', '۰۷:۱۵:۰۰', '۰۸:۴۵:۰۰', '۳٫۲ km', '۰۱:۱۰:۰۰'],
      ['محور توزیع غرب تهران', 'خارج از محدوده', '۰۸:۴۵:۰۰', '۱۳:۲۰:۰۰', '۱۶۸٫۴ km', '۰۴:۳۵:۰۰'],
      ['پایانه لجستیک جنوب (دایره)', 'داخل محدوده', '۱۳:۲۰:۰۰', '۱۵:۱۰:۰۰', '۲٫۱ km', '۰۰:۵۵:۰۰'],
    ],
  },
  {
    id: 'event',
    persianName: 'گزارش رویداد',
    englishName: 'Event',
    managerQuestion: '«در این بازه زمانی دقیقاً چه رخدادها یا تخلفاتی ثبت شده است؟»',
    metaphorTitle: 'منورهای هشدار روی خط زمان',
    metaphorDescription: 'فیلتر چندانتخابی از ۱۱ نوع رویداد عملیاتی که هر کدام را به صورت یک منور زمان‌مند با آدرس دقیق برجسته می‌کند.',
    orgPillar: 'ایمنی و انطباق',
    inputsObserved: [
      'انتخاب دستگاه، بازه سریع یا سفارشی',
      'انتخاب چندگانه نوع رویداد: غیرفعال، شروع حرکت، توقف، سرعت غیرمجاز، نشت سوخت، ورود به محدوده، خروج از محدوده، هشدار، روشن شدن سوئیچ، خاموش شدن سوئیچ، سرویس و نگهداری',
    ],
    outputsObserved: ['زمان رویداد، نوع رویداد، نشانی و جزئیات', 'خروجی اکسل پس از تولید نتایج'],
    hardwareDependency: 'GPS، سوئیچ و حرکت؛ رویداد نشت سوخت نیازمند سنسور سوخت سازگار و رویداد محدوده نیازمند تعریف محدوده است.',
    hasExcelExport: true,
    tableHeaders: ['زمان رخداد', 'نوع رویداد', 'واحد ناوگان', 'نشانی نمایشی', 'جزئیات تله‌متری'],
    tableRows: [
      ['۱۰:۰۴:۱۲', 'ورود به محدوده', 'ایسوزو یخچال‌دار ۶ تن', 'محدوده انبار دارویی البرز (نمایشی)', 'سرعت ورود: ۲۸ km/h'],
      ['۱۱:۴۲:۵۰', 'سرعت غیرمجاز', 'کشنده ولوو FH-۴۸۰', 'آزادراه قزوین-زنجان، کیلومتر ۳۸ (نمایشی)', 'سرعت ثبت‌شده: ۱۰۴ km/h (مجاز: ۹۰)'],
      ['۱۳:۱۸:۰۵', 'روشن شدن سوئیچ', 'کامیونت پخش شهری ۲۰۸', 'مرکز توزیع شادآباد (نمایشی)', 'ولتاژ استارت: ۲۴٫۱V'],
      ['۱۵:۳۰:۰۰', 'نشت سوخت (با سنسور سازگار)', 'کشنده داف XF-۵۳۰', 'پارکینگ تیرپارک همدان (نمایشی)', 'افت ناگهانی تراز باک در حالت توقف'],
    ],
  },
  {
    id: 'heatmap',
    persianName: 'گزارش نقشه حرارتی',
    englishName: 'Heatmap',
    managerQuestion: '«تراکم تردد و حضور ناوگان ما در کدام نقاط جغرافیایی متمرکز شده است؟»',
    metaphorTitle: 'توپوگرافی نورانی تراکم تردد',
    metaphorDescription: 'تبدیل هزاران نقطه حضور چند خودرو یا یک گروه به برجستگی‌های حرارتی روی نقشه برای کشف گلوگاه‌های عملیاتی.',
    orgPillar: 'پاسخگویی و شفافیت',
    inputsObserved: ['انتخابگر گروه (اختیاری)', 'انتخابگر چند دستگاه (Multi-device)', 'تاریخ و ساعت شروع و پایان'],
    outputsObserved: ['نقشه حرارتی جغرافیایی (Geographic Heatmap)'],
    hardwareDependency: 'نقاط موقعیت GPS دستگاه‌های انتخاب‌شده.',
    hasExcelExport: false,
    isMultiDeviceCapable: true,
    tableHeaders: ['پهنه جغرافیایی (نمایشی)', 'گروه ناوگان', 'تعداد نقاط ثبت‌شده', 'سهم تمرکز تردد', 'میانگین زمان حضور'],
    tableRows: [
      ['کریدور غرب تهران - شهرقدس (نمایشی)', 'پخش مویرگی پایتخت', '۱۴٬۸۲۰ نقطه', '۴۲٪', '۳٫۴ ساعت در روز'],
      ['پایانه باربری و انبار کرج (نمایشی)', 'ترانزیت جاده‌ای', '۹٬۳۱۰ نقطه', '۲۷٪', '۲٫۱ ساعت در روز'],
      ['حلقه جنوبی آزادراه آزادگان (نمایشی)', 'پخش مویرگی پایتخت', '۶٬۴۵۰ نقطه', '۱۹٪', '۱٫۵ ساعت در روز'],
      ['منطقه ویژه اقتصادی پیام (نمایشی)', 'زنجیره سرد دارو', '۴٬۱۲۰ نقطه', '۱۲٪', '۱٫۱ ساعت در روز'],
    ],
  },
  {
    id: 'temperature',
    persianName: 'گزارش دما',
    englishName: 'Temperature',
    managerQuestion: '«آیا محموله یخچالی در تمام طول مسیر در بازه دمایی ایمن باقی ماند؟»',
    metaphorTitle: 'بلور یخ و منشور حرارتی زنجیره سرد',
    metaphorDescription: 'ماده شیشه‌ای یخ‌زده که با تغییر دمای سنسور سازگار، تاریخچه لحظه‌به‌لحظه دمای کانتینر را شفاف می‌کند.',
    orgPillar: 'ایمنی و انطباق',
    inputsObserved: ['انتخاب دستگاه', 'تاریخ و ساعت شروع و پایان'],
    outputsObserved: ['ردیف‌های زمان و دمای ثبت‌شده'],
    hardwareDependency: 'ردیاب دارای قابلیت دما یا سنسور دمای متصل سازگار.',
    hasExcelExport: false,
    tableHeaders: ['زمان ثبت', 'واحد مجهز به سنسور دما', 'دمای ثبت‌شده (°C)', 'بازه هدف زنجیره سرد', 'وضعیت محموله'],
    tableRows: [
      ['۰۸:۰۰:۰۰', 'ایسوزو یخچال‌دار ۶ تن (زنجیره سرد)', '۴٫۱- °C', '۲- تا ۶- درجه', 'ایمن و پایدار'],
      ['۰۹:۳۰:۰۰', 'ایسوزو یخچال‌دار ۶ تن (زنجیره سرد)', '۴٫۵- °C', '۲- تا ۶- درجه', 'ایمن و پایدار'],
      ['۱۱:۰۰:۰۰', 'ایسوزو یخچال‌دار ۶ تن (زنجیره سرد)', '۳٫۸- °C', '۲- تا ۶- درجه', 'ایمن (باز شدن درب تخلیه)'],
      ['۱۲:۳۰:۰۰', 'ایسوزو یخچال‌دار ۶ تن (زنجیره سرد)', '۴٫۶- °C', '۲- تا ۶- درجه', 'ایمن و پایدار'],
    ],
  },
];

export const SYNTHETIC_FLEET_DEVICES: FleetDeviceRecord[] = [
  {
    id: 'dev-101',
    label: 'کشنده ولوو FH-۴۸۰ (کد ۱۰۱)',
    imei: '864201094821101',
    model: 'FZ-Pro T800',
    sim: '09120048101',
    plate: '۱۲ ع ۳۴۵ - ایران ۱۱',
    group: 'ترانزیت جاده‌ای',
    poweredOn: true,
    moving: true,
    activeLocation: true,
    speedKmh: 84,
    voltage: 24.4,
    temperatureC: null,
    fuelLitersPer100Km: 28.4,
    lastPositionText: '۸ ثانیه پیش',
    lastConnectionText: '۸ ثانیه پیش',
    subscriptionType: 'سازمانی',
    subscriptionStatus: 'معتبر',
    subscriptionDaysLeft: 264,
    geofenceState: 'خارج از محدوده',
    geofenceName: 'محور آزادراه قزوین',
    xPct: 34,
    yPct: 42,
  },
  {
    id: 'dev-102',
    label: 'ایسوزو یخچال‌دار ۶ تن (کد ۱۰۲)',
    imei: '864201094821102',
    model: 'FZ-Cold S400',
    sim: '09120048102',
    plate: '۶۸ ط ۷۱۲ - ایران ۲۲',
    group: 'زنجیره سرد دارو',
    poweredOn: true,
    moving: true,
    activeLocation: true,
    speedKmh: 62,
    voltage: 24.1,
    temperatureC: -4.2,
    fuelLitersPer100Km: 16.5,
    lastPositionText: '۱۲ ثانیه پیش',
    lastConnectionText: '۱۲ ثانیه پیش',
    subscriptionType: 'سازمانی',
    subscriptionStatus: 'معتبر',
    subscriptionDaysLeft: 190,
    geofenceState: 'داخل محدوده',
    geofenceName: 'انبار مرکزی کرج',
    xPct: 58,
    yPct: 36,
  },
  {
    id: 'dev-103',
    label: 'کشنده داف XF-۵۳۰ (کد ۱۰۳)',
    imei: '864201094821103',
    model: 'FZ-Pro T800',
    sim: '09120048103',
    plate: '۴۴ ع ۸۱۹ - ایران ۶۸',
    group: 'ترانزیت جاده‌ای',
    poweredOn: true,
    moving: false,
    activeLocation: true,
    speedKmh: 0,
    voltage: 23.8,
    temperatureC: null,
    fuelLitersPer100Km: 27.1,
    lastPositionText: '۱ دقیقه پیش',
    lastConnectionText: '۱ دقیقه پیش',
    subscriptionType: 'سازمانی',
    subscriptionStatus: 'معتبر',
    subscriptionDaysLeft: 312,
    geofenceState: 'داخل محدوده',
    geofenceName: 'پایانه باربری غرب',
    xPct: 48,
    yPct: 64,
  },
  {
    id: 'dev-104',
    label: 'کامیونت پخش شهری (کد ۲۰۸)',
    imei: '864201094821104',
    model: 'FZ-City M200',
    sim: '09120048104',
    plate: '۸۵ د ۲۱۴ - ایران ۳۳',
    group: 'پخش مویرگی پایتخت',
    poweredOn: true,
    moving: true,
    activeLocation: true,
    speedKmh: 51,
    voltage: 13.9,
    temperatureC: null,
    fuelLitersPer100Km: 13.8,
    lastPositionText: '۵ ثانیه پیش',
    lastConnectionText: '۵ ثانیه پیش',
    subscriptionType: 'سازمانی',
    subscriptionStatus: 'معتبر',
    subscriptionDaysLeft: 145,
    geofenceState: 'داخل محدوده',
    geofenceName: 'محدوده توزیع منطقه ۵',
    xPct: 72,
    yPct: 48,
  },
  {
    id: 'dev-105',
    label: 'وانت سردخانه‌ای (کد ۳۱۲)',
    imei: '864201094821105',
    model: 'FZ-Cold S400',
    sim: '09120048105',
    plate: '۲۹ ص ۵۵۶ - ایران ۱۱',
    group: 'زنجیره سرد دارو',
    poweredOn: false,
    moving: false,
    activeLocation: true,
    speedKmh: 0,
    voltage: 12.6,
    temperatureC: 2.1,
    fuelLitersPer100Km: null,
    lastPositionText: '۱۴ دقیقه پیش',
    lastConnectionText: '۱۴ دقیقه پیش',
    subscriptionType: 'پایه',
    subscriptionStatus: 'نیازمند تمدید',
    subscriptionDaysLeft: 6,
    geofenceState: 'داخل محدوده',
    geofenceName: 'کلینیک توزیع مرکزی',
    xPct: 24,
    yPct: 68,
  },
  {
    id: 'dev-106',
    label: 'خودروی سواری مدیر عملیات (شخصی)',
    imei: '864201094821106',
    model: 'FZ-Lite P100',
    sim: '09120048106',
    plate: '۷۷ ب ۹۳۱ - ایران ۴۴',
    group: 'خودروهای شخصی و مدیریتی',
    poweredOn: true,
    moving: true,
    activeLocation: true,
    speedKmh: 74,
    voltage: 14.1,
    temperatureC: null,
    fuelLitersPer100Km: null,
    lastPositionText: '۶ ثانیه پیش',
    lastConnectionText: '۶ ثانیه پیش',
    subscriptionType: 'شخصی',
    subscriptionStatus: 'معتبر',
    subscriptionDaysLeft: 210,
    geofenceState: 'خارج از محدوده',
    geofenceName: 'بزرگراه همت',
    xPct: 66,
    yPct: 26,
  },
];

export const STOP_REPORT_DEMO_ENTRIES: StopReportEntry[] = [
  {
    id: 'stp-1',
    deviceLabel: 'کامیونت پخش شهری (کد ۲۰۸)',
    startTime: '۰۸:۱۵',
    endTime: '۰۸:۱۹',
    durationMinutes: 4,
    durationLabel: '۴ دقیقه (توقف کوتاه چراغ راهنمایی)',
    address: 'تقاطع آزادی - بهبودی (داده نمایشی)',
  },
  {
    id: 'stp-2',
    deviceLabel: 'کشنده ولوو FH-۴۸۰ (کد ۱۰۱)',
    startTime: '۰۹:۱۰',
    endTime: '۰۹:۵۸',
    durationMinutes: 48,
    durationLabel: '۴۸ دقیقه (توقف بارگیری)',
    address: 'پایانه باربری البرز - سکوی شماره ۴ (داده نمایشی)',
  },
  {
    id: 'stp-3',
    deviceLabel: 'ایسوزو یخچال‌دار ۶ تن (کد ۱۰۲)',
    startTime: '۱۱:۲۰',
    endTime: '۱۲:۵۵',
    durationMinutes: 95,
    durationLabel: '۱ ساعت و ۳۵ دقیقه (تخلیه سردخانه)',
    address: 'مرکز پخش دارویی غرب تهران (داده نمایشی)',
  },
  {
    id: 'stp-4',
    deviceLabel: 'کشنده داف XF-۵۳۰ (کد ۱۰۳)',
    startTime: '۱۳:۰۰',
    endTime: '۱۷:۴۰',
    durationMinutes: 280,
    durationLabel: '۴ ساعت و ۴۰ دقیقه (توقف طولانی استراحتگاه)',
    address: 'مجتمع خدماتی بین‌راهی زنجان (داده نمایشی)',
  },
];

export interface NotificationItem {
  id: string;
  category: 'alerts' | 'maintenance' | 'system';
  categoryLabel: 'هشدارها' | 'سرویس و نگهداری' | 'سیستمی';
  title: string;
  deviceLabel: string;
  timeAgo: string;
  detail: string;
  hasMapPin?: boolean;
  coordinatesDemo?: string;
}

export const MYFARZAM_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'alerts',
    categoryLabel: 'هشدارها',
    title: 'روشن شدن سوئیچ و شروع حرکت',
    deviceLabel: 'کشنده ولوو FH-۴۸۰ (کد ۱۰۱)',
    timeAgo: '۲ دقیقه پیش',
    detail: 'سوئیچ در محدوده «پایانه باربری غرب» روشن شد و سرعت به ۴۲ km/h رسید.',
    hasMapPin: true,
    coordinatesDemo: '۳۵٫۷۰۱۲° N, ۵۱٫۳۳۸۰° E (نمایشی)',
  },
  {
    id: 'notif-2',
    category: 'alerts',
    categoryLabel: 'هشدارها',
    title: 'توقف بیش از حد مجاز با سوئیچ روشن',
    deviceLabel: 'کامیونت پخش شهری (کد ۲۰۸)',
    timeAgo: '۱۴ دقیقه پیش',
    detail: 'توقف با موتور روشن به مدت ۲۵ دقیقه در محدوده توزیع منطقه ۵.',
    hasMapPin: true,
    coordinatesDemo: '۳۵٫۷۲۴۵° N, ۵۱٫۲۹۱۰° E (نمایشی)',
  },
  {
    id: 'notif-3',
    category: 'alerts',
    categoryLabel: 'هشدارها',
    title: 'خاموش شدن سوئیچ در مقصد',
    deviceLabel: 'ایسوزو یخچال‌دار ۶ تن (کد ۱۰۲)',
    timeAgo: '۳۸ دقیقه پیش',
    detail: 'ورود به «انبار مرکزی کرج» و خاموش شدن سوئیچ خودرو؛ دمای ثبت‌شده: ۴٫۲- درجه.',
    hasMapPin: true,
    coordinatesDemo: '۳۵٫۸۳۲۱° N, ۵۰٫۹۹۱۴° E (نمایشی)',
  },
  {
    id: 'notif-4',
    category: 'maintenance',
    categoryLabel: 'سرویس و نگهداری',
    title: 'موعد سرویس دوره‌ای روغن موتور و فیلترها',
    deviceLabel: 'کشنده داف XF-۵۳۰ (کد ۱۰۳)',
    timeAgo: '۱ ساعت پیش',
    detail: 'بر اساس پیمایش ثبت‌شده (۹٬۸۵۰ کیلومتر از آخرین سرویس)، زمان تعویض روغن و بازدید لنت فرا رسیده است.',
  },
  {
    id: 'notif-5',
    category: 'maintenance',
    categoryLabel: 'سرویس و نگهداری',
    title: 'کالیبراسیون دوره‌ای سنسور دمای کانتینر',
    deviceLabel: 'ایسوزو یخچال‌دار ۶ تن (کد ۱۰۲)',
    timeAgo: 'دیروز',
    detail: 'یادآور برنامه نگهداری پیشگیرانه جهت بازبینی صحت سنسور دمای یخچال.',
  },
  {
    id: 'notif-6',
    category: 'system',
    categoryLabel: 'سیستمی',
    title: 'یادآور انقضای اشتراک دستگاه',
    deviceLabel: 'وانت سردخانه‌ای (کد ۳۱۲)',
    timeAgo: '۳ ساعت پیش',
    detail: 'تنها ۶ روز تا پایان اعتبار اشتراک باقی مانده است؛ جهت جلوگیری از وقفه در گزارش‌گیری تمدید نمایید.',
  },
  {
    id: 'notif-7',
    category: 'system',
    categoryLabel: 'سیستمی',
    title: 'عدم دریافت داده جدید بیش از ۱۰ دقیقه',
    deviceLabel: 'وانت سردخانه‌ای (کد ۳۱۲)',
    timeAgo: '۱۴ دقیقه پیش',
    detail: 'آخرین بسته موقعیت ۱۴ دقیقه پیش دریافت شده است؛ وضعیت آنتن‌دهی سیم‌کارت ۰۹۱۲۰۰۴۸۱۰۵ بررسی شود.',
  },
];

export interface CustomisationScenario {
  id: string;
  title: string;
  sector: string;
  challenge: string;
  hardwareTailoring: string[];
  softwareTailoring: string[];
  outcomeStatement: string;
}

export const CUSTOMISATION_SCENARIOS: CustomisationScenario[] = [
  {
    id: 'cold-chain',
    title: 'زنجیره سرد دارو و مواد غذایی فاسدشدنی',
    sector: 'پخش دارویی و لبنیات',
    challenge: 'نیاز به اثبات دمای لحظه‌به‌لحظه کانتینر در کنار موقعیت مکانی و زمان توقف در هر داروخانه یا فروشگاه.',
    hardwareTailoring: [
      'ردیاب GPS سازگار با ورودی سنسور دمای دیجیتال کانتینر',
      'ورودی سوئیچ و پایش ولتاژ باتری سردخانه در زمان توقف',
    ],
    softwareTailoring: [
      'فعال‌سازی «گزارش دما» در کنار «گزارش محدوده» و «گزارش توقف»',
      'تعریف محدوده‌های جغرافیایی (Geofence) برای هر مرکز تحویل با خروجی اکسل مستند',
    ],
    outcomeStatement: 'تبدیل داده‌های دما و مسیر به مستندات قابل استناد اکسل برای ممیزی‌های بهداشتی و کنترل کیفیت.',
  },
  {
    id: 'heavy-transit',
    title: 'ناوگان ترانزیت جاده‌ای و کنترل مصرف سوخت',
    sector: 'حمل‌ونقل سنگین و بین‌شهری',
    challenge: 'مقایسه عملکرد رانندگان و کشنده‌ها در مسیرهای طولانی، کشف توقف‌های غیرضروری و پایش مصرف سوخت.',
    hardwareTailoring: [
      'ردیاب صنعتی با تشخیص دقیق سوئیچ (ACC)، حرکت، ولتاژ ۲۴ ولت و سنسور/محاسبه‌گر سوخت سازگار',
      'فیلتر سخت‌افزاری و نرم‌افزاری پرش‌های مسافت و جمینگ GPS',
    ],
    softwareTailoring: [
      'گروه‌بندی ناوگان بر اساس محورهای ترانزیتی در «مدیریت گروه‌ها»',
      'گزارش «عملکرد» چنددستگاهی، گزارش «روزانه» (تفکیک حرکت و درجا) و رویداد «نشت سوخت»',
    ],
    outcomeStatement: 'مقایسه شفاف تمام کشنده‌ها در یک جدول واحد و کاهش ساعت کارکرد درجای موتور.',
  },
  {
    id: 'urban-distribution',
    title: 'پخش مویرگی و ناوگان توزیع شهری',
    sector: 'فروشگاه‌های زنجیره‌ای و خدمات شهری',
    challenge: 'مدیریت ده‌ها خودروی توزیع در ترافیک شهری، کشف نقاط پرتراکم تردد و کنترل سرعت در محدوده‌های مجاز.',
    hardwareTailoring: [
      'ردیاب‌های سریع شهری با نرخ نمونه‌برداری دقیق پیچ‌ها و توقف‌های کوتاه',
      'سیم‌کارت پایدار با پایش لحظه‌ای آخرین زمان اتصال',
    ],
    softwareTailoring: [
      '«نقشه حرارتی» (Heatmap) چنددستگاهی برای بهینه‌سازی مناطق توزیع',
      'تعریف سقف سرعت روی محدوده‌های چندضلعی و دریافت اعلان‌های لحظه‌ای',
    ],
    outcomeStatement: 'دید یکپارچه از تراکم ناوگان روی نقشه حرارتی و تسلط کامل بر زمان حضور در هر منطقه.',
  },
];
