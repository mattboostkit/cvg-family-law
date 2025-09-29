export type SupportedLocale = 'en' | 'ur' | 'ar' | 'pl' | 'hi';

export type RTLLocale = 'ar' | 'ur';

export interface TranslationKeys {
  // Navigation
  navigation: {
    home: string;
    about: string;
    services: string;
    contact: string;
    booking: string;
    resources: string;
    faq: string;
    blog: string;
    login: string;
  };

  // Emergency
  emergency: {
    title: string;
    subtitle: string;
    callNow: string;
    emergencyServices: string;
    police: string;
    ambulance: string;
    domesticAbuseHelpline: string;
    immediateDanger: string;
    call999: string;
    description: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    submit: string;
    next: string;
    previous: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    open: string;
    yes: string;
    no: string;
    required: string;
    optional: string;
  };

  // Services
  services: {
    domesticAbuse: string;
    divorce: string;
    childrenLaw: string;
    financial: string;
    title: string;
    description: string;
    getHelp: string;
  };

  // Booking
  booking: {
    title: string;
    subtitle: string;
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    bookAppointment: string;
    confirmBooking: string;
    selectService: string;
  };

  // Risk Assessment
  riskAssessment: {
    title: string;
    subtitle: string;
    question: string;
    startAssessment: string;
    results: string;
    highRisk: string;
    mediumRisk: string;
    lowRisk: string;
    getHelpNow: string;
  };

  // Footer
  footer: {
    privacy: string;
    terms: string;
    cookies: string;
    accessibility: string;
    sraNumber: string;
    regulatedBy: string;
  };
}

export interface LanguageInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
  culturalNotes?: string;
}

export interface I18nConfig {
  defaultLocale: SupportedLocale;
  locales: SupportedLocale[];
  rtlLocales: RTLLocale[];
}