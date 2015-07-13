var servicesAdvisorApp = angular.module('servicesAdvisorApp');

servicesAdvisorApp.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('EN', {
    'CATEGORY': 'Category',
    'SEARCH_TEXT': 'To find a service, select from the category or region below. Use the filter button above to further refine your search.',
    'REGION': 'Region',
    'FILTERS': 'Filter your search',
    'TOGGLE_MAP': 'Show/Hide Map',
    'CLEAR': 'Clear',
    'REFERRAL_REQUIRED': 'Referral Required',
    'CANCEL': 'Cancel',
    'APPLY': 'Apply',
    'ORGANIZATIONS': 'Organizations',
    'DISTANCE': 'Distance',
    'BACK': 'Back',
    'SEARCH_RESULTS': 'Search Results',
    'HOURS': 'Hours',
    'NA': 'N/A',
    'ACTIVITY_DETAILS': 'Activity Details',
    'START_DATE': 'Start Date',
    'END_DATE': 'End Date',
    'SHOW_ON_ACTIVITYINFO': 'Show on ActivityInfo',
    'SEARCH': 'search',
    'OFFICE_OPEN_AT': '8. Office Open at',
    'OFFICE_CLOSE_AT' : '9. Office close at',
    'CASH': 'CASH',
    'EDUCATION': 'EDUCATION',
    'FOOD': 'FOOD',
    'HEALTH': 'HEALTH',
    'NFI': 'NFI',
    'PROTECTION': 'PROTECTION',
    'SHELTER': 'SHELTER',
    'WASH': 'WASH',
    "REFERRAL_METHOD": "Referral Method",
    "ACTIVITY_DETAIL": "Activity Detail",
    "SHOW_DETAILS": "Show details",
    "Ajlun Governorate": "Ajlun Governorate",
    "Al Aqabah Governorate": "Al Aqabah Governorate",
    "Al Balqa Governorate": "Al Balqa Governorate",
    "Al Karak Governorate": "Al Karak Governorate",
    "Al Mafraq Governorate": "Al Mafraq Governorate",
    "Amman Governorate": "Amman Governorate",
    "At Tafilah Governorate": "At Tafilah Governorate",
    "Az Zarqa Governorate": "Az Zarqa Governorate",
    "Irbid Governorate": "Irbid Governorate",
    "Jarash Governorate": "Jarash Governorate",
    "Ma'an Governorate": "Ma'an Governorate",
    "Madaba Governorate": "Madaba Governorate"
  });

  $translateProvider.translations('AR', {
    'CATEGORY': 'فئة',
    'SEARCH_TEXT': 'العثور على الخدمة، اختر من فئة أو منطقة أدناه. استخدم زر مرشح فوق لمزيد من تضييق نطاق البحث.',
    'REGION': 'منطقة',
    'FILTERS': 'بحثك صفي',
    'TOGGLE_MAP': 'الخريطة إخفاء / ظهار إ',
    'CLEAR': 'امسح',
    'REFERRAL_REQUIRED': 'إحالة مطلوب',
    'CANCEL': 'إلغاء',
    'APPLY': 'طبق',
    'ORGANIZATIONS': 'المنظمات',
    'DISTANCE': 'مسافه',
    'BACK': 'ارجع',
    'SEARCH_RESULTS': 'البحث نتائج',
    'HOURS': 'ساعات',
    'NA': 'ينطبق لا',
    'ACTIVITY_DETAILS': 'النشاط تفاصيل',
    'START_DATE': 'البداية تاريخ',
    'END_DATE': 'النهاية تاريخ',
    'SHOW_ON_ACTIVITYINFO': 'ActivityInfo نشاط معلومات على أعرض',
    'SEARCH': 'بحث',
    'OFFICE_OPEN_AT': '8. موعد فتح المكتب',
    'OFFICE_CLOSE_AT' : '9. موعد إغلاق المكتب',
    'CASH': 'نقد',
    'EDUCATION': 'التعليم',
    'FOOD': 'الغذاء',
    'HEALTH': 'الصحة',
    'NFI': 'المواد غير الغذائية',
    'PROTECTION': 'الحماية',
    'SHELTER': 'المأوى',
    'WASH': 'المياه والصرف الصحي',
    "REFERRAL_METHOD": "الإحالة أسلوب",
    "ACTIVITY_DETAIL": "النشاط تفاصيل",
    "SHOW_DETAILS": "التفاصيل عرض",
    "Ajlun Governorate": "عجلون محافظة",
    "Al Aqabah Governorate": "العقبة محافظة",
    "Al Balqa Governorate": "البلقاء محافظةة",
    "Al Karak Governorate": "الكرك محافظة",
    "Al Mafraq Governorate": "المفرق محافظة",
    "Amman Governorate": "عمان محافظة",
    "At Tafilah Governorate": "الطفيلة محافظة",
    "Az Zarqa Governorate": "الزرقاء محافظة",
    "Irbid Governorate": "اربد محافظة",
    "Jarash Governorate": "جرش محافظة",
    "Ma'an Governorate": "معان محافظة",
    "Madaba Governorate": "مادبا محافظةا"
  });
}]);
