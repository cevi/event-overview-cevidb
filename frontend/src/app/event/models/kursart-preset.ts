export interface KursartPreset {
  label: string;
  kursarten: string[];
}

export const KURSART_PRESETS: KursartPreset[] = [
  {
    label: 'J+S-Leiter/-in werden',
    kursarten: [
      'J+S-Leiter*innenkurs LS/T Jugendliche',
      'J+S-Einführungskurs LS/T Kinder',
      'J+S-Modul Lagerleiter*in LS/T (inkl. EK Kinder)',
    ],
  },
  {
    label: 'für J+S-Leiter/-in',
    kursarten: [
      'J+S-Modul Fortbildung Leiter*in LS/T Kinder und Jugendliche',
      'J+S-Modul Fortbildung Leiter*in LS/T Kinder',
      'J+S-Modul Fortbildung Leiter*in LS/T Jugendliche',
      'J+S-Modul im Sicherheitsbereich Winter',
      'J+S-Modul im Sicherheitsbereich Berg',
      'J+S-Modul im Sicherheitsbereich Wasser',
      'J+S-Modul Wasser LS/T',
    ],
  },
  {
    label: 'J+S-Experte/-in',
    kursarten: [
      'J+S-Modul Fortbildung Expert*in LS/T',
      'J+S-Expert*innenkurs LS/T',
      'J+S-Modul Fortbildung Expert*in im Sicherheitsbereich Wasser',
      'J+S-Modul Fortbildung Expert*in im Sicherheitsbereich Berg',
      'J+S-Modul Fortbildung Expert*in im Sicherheitsbereich Winter',
      'J+S-Kaderkurs',
      'J+S-Modul Fortbildung Expert*in SLRG',
    ],
  },
  {
    label: 'J+S-Coach',
    kursarten: [
      'J+S-Modul Fortbildung Coach LS/T',
      'J+S-Coachkurs LS/T',
      'J+S-Modul Fortbildung Coach-Expert*in LS/T',
    ],
  },
];

export const ALL_NAMED_PRESET_KURSARTEN: string[] = KURSART_PRESETS.flatMap(p => p.kursarten);
