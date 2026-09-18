export interface LibraryItemDef {
  id: string;
  name: string;
  svg: string;
  aspect: number; // width / height
}

export interface LibrarySubject {
  id: string;
  name: string;
  items: LibraryItemDef[];
}

const S = (inner: string, viewBox = '0 0 100 100') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const ELEMENTS_LIBRARY: LibrarySubject[] = [
  {
    id: 'math',
    name: 'الرياضيات',
    items: [
      {
        id: 'math-circle',
        name: 'دائرة',
        aspect: 1,
        svg: S('<circle cx="50" cy="50" r="42"/>'),
      },
      {
        id: 'math-square',
        name: 'مربع',
        aspect: 1,
        svg: S('<rect x="10" y="10" width="80" height="80"/>'),
      },
      {
        id: 'math-triangle',
        name: 'مثلث',
        aspect: 1,
        svg: S('<polygon points="50,8 92,90 8,90"/>'),
      },
      {
        id: 'math-right-triangle',
        name: 'مثلث قائم الزاوية',
        aspect: 1,
        svg: S('<polygon points="10,90 10,10 90,90"/><rect x="10" y="76" width="14" height="14"/>'),
      },
      {
        id: 'math-rectangle',
        name: 'مستطيل',
        aspect: 1.5,
        svg: S('<rect x="6" y="20" width="138" height="60"/>', '0 0 150 100'),
      },
      {
        id: 'math-grid',
        name: 'شبكة إحداثيات',
        aspect: 1,
        svg: S(
          Array.from({ length: 9 }, (_, i) => (i + 1) * 10)
            .map((v) => `<line x1="${v}" y1="0" x2="${v}" y2="100"/><line x1="0" y1="${v}" x2="100" y2="${v}"/>`)
            .join('') +
            '<line x1="0" y1="50" x2="100" y2="50" stroke-width="3"/><line x1="50" y1="0" x2="50" y2="100" stroke-width="3"/>' +
            '<path d="M94 46 L100 50 L94 54" fill="none"/><path d="M46 6 L50 0 L54 6" fill="none"/>',
        ),
      },
      {
        id: 'math-ruler',
        name: 'مسطرة',
        aspect: 4,
        svg: S(
          '<rect x="3" y="10" width="194" height="30"/>' +
            Array.from({ length: 19 }, (_, i) => (i + 1) * 10)
              .map((v, i) => `<line x1="${v + 3}" y1="10" x2="${v + 3}" y2="${(i + 1) % 5 === 0 ? 26 : 20}"/>`)
              .join(''),
          '0 0 200 50',
        ),
      },
      {
        id: 'math-protractor',
        name: 'منقلة',
        aspect: 2,
        svg: S(
          '<path d="M5 95 A95 95 0 0 1 195 95" />' +
            '<line x1="5" y1="95" x2="195" y2="95"/>' +
            Array.from({ length: 12 }, (_, i) => {
              const angle = (Math.PI / 12) * i;
              const x1 = 100 - Math.cos(angle) * 95;
              const y1 = 95 - Math.sin(angle) * 95;
              const x2 = 100 - Math.cos(angle) * 82;
              const y2 = 95 - Math.sin(angle) * 82;
              return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
            }).join(''),
          '0 0 200 100',
        ),
      },
      {
        id: 'math-compass',
        name: 'فرجار',
        aspect: 0.8,
        svg: S(
          '<line x1="50" y1="10" x2="20" y2="95"/><line x1="50" y1="10" x2="80" y2="95"/>' +
            '<circle cx="50" cy="10" r="6"/><circle cx="20" cy="95" r="3"/><path d="M80 95 A62 62 0 0 0 30 60" stroke-dasharray="4 4"/>',
          '0 0 100 100',
        ),
      },
      {
        id: 'math-pi',
        name: 'رمز π',
        aspect: 1,
        svg: S('<line x1="15" y1="30" x2="85" y2="30" stroke-width="6"/><line x1="30" y1="30" x2="26" y2="85"/><line x1="68" y1="30" x2="72" y2="80" /><path d="M72 80 a6 6 0 1 0 8 4"/>'),
      },
      {
        id: 'math-plus-minus',
        name: 'رموز + − ×',
        aspect: 2.4,
        svg: S(
          '<line x1="10" y1="30" x2="10" y2="10"/><line x1="0" y1="20" x2="20" y2="20"/>' +
            '<line x1="35" y1="20" x2="55" y2="20"/>' +
            '<line x1="70" y1="10" x2="90" y2="30"/><line x1="90" y1="10" x2="70" y2="30"/>',
          '0 0 100 40',
        ),
      },
    ],
  },
  {
    id: 'physics',
    name: 'الفيزياء',
    items: [
      {
        id: 'physics-circuit',
        name: 'دائرة كهربائية',
        aspect: 1.6,
        svg: S(
          '<rect x="5" y="5" width="150" height="80"/>' +
            '<rect x="60" y="5" width="30" height="16" transform="translate(0,-8)" />' +
            '<line x1="20" y1="5" x2="45" y2="5"/><rect x="45" y="-3" width="18" height="16"/><line x1="63" y1="5" x2="90" y2="5"/>' +
            '<circle cx="115" cy="45" r="16"/><line x1="103" y1="33" x2="127" y2="57"/><line x1="127" y1="33" x2="103" y2="57"/>',
          '0 0 160 90',
        ),
      },
      {
        id: 'physics-battery',
        name: 'بطارية',
        aspect: 1.8,
        svg: S(
          '<line x1="10" y1="10" x2="10" y2="50" stroke-width="6"/><line x1="30" y1="0" x2="30" y2="60" stroke-width="2"/>' +
            '<line x1="50" y1="10" x2="50" y2="50" stroke-width="6"/><line x1="70" y1="0" x2="70" y2="60" stroke-width="2"/>' +
            '<line x1="0" y1="30" x2="10" y2="30"/><line x1="70" y1="30" x2="90" y2="30"/>',
          '0 0 90 60',
        ),
      },
      {
        id: 'physics-lever',
        name: 'رافعة وميزان',
        aspect: 1.6,
        svg: S(
          '<polygon points="70,60 90,90 50,90"/>' +
            '<line x1="10" y1="55" x2="130" y2="65" stroke-width="4"/>' +
            '<line x1="20" y1="55" x2="20" y2="40"/><line x1="120" y1="65" x2="120" y2="80"/>',
          '0 0 140 90',
        ),
      },
      {
        id: 'physics-pulley',
        name: 'بكرة',
        aspect: 1,
        svg: S(
          '<circle cx="50" cy="30" r="20"/><circle cx="50" cy="30" r="3"/>' +
            '<line x1="50" y1="0" x2="50" y2="10"/>' +
            '<line x1="32" y1="35" x2="20" y2="90"/><line x1="68" y1="35" x2="80" y2="70"/>' +
            '<rect x="10" y="90" width="20" height="8"/>',
        ),
      },
      {
        id: 'physics-prism',
        name: 'منشور وحزمة ضوء',
        aspect: 1.6,
        svg: S(
          '<polygon points="70,10 110,80 30,80"/>' +
            '<line x1="0" y1="60" x2="60" y2="55" stroke="#dc2626"/>' +
            '<line x1="60" y1="55" x2="100" y2="20" stroke="#2563eb"/>' +
            '<line x1="60" y1="55" x2="105" y2="35" stroke="#16a34a"/>' +
            '<line x1="60" y1="55" x2="110" y2="50" stroke="#ea580c"/>',
          '0 0 140 90',
        ),
      },
      {
        id: 'physics-magnet',
        name: 'مغناطيس',
        aspect: 1.5,
        svg: S(
          '<path d="M10 10 v40 a30 30 0 0 0 60 0 v-40" />' +
            '<line x1="10" y1="10" x2="30" y2="10"/><line x1="40" y1="10" x2="60" y2="10"/>' +
            '<line x1="10" y1="0" x2="10" y2="10"/><line x1="60" y1="0" x2="60" y2="10"/>',
          '0 0 70 60',
        ),
      },
      {
        id: 'physics-spring',
        name: 'نابض',
        aspect: 2.2,
        svg: S(
          '<path d="M0 20 h15 l8 -15 l16 30 l16 -30 l16 30 l16 -30 l8 15 h15" />',
          '0 0 110 40',
        ),
      },
    ],
  },
  {
    id: 'chemistry',
    name: 'الكيمياء',
    items: [
      {
        id: 'chem-atom',
        name: 'ذرة',
        aspect: 1,
        svg: S(
          '<circle cx="50" cy="50" r="6" fill="#1e293b"/>' +
            '<ellipse cx="50" cy="50" rx="45" ry="18"/>' +
            '<ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(60 50 50)"/>' +
            '<ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(120 50 50)"/>' +
            '<circle cx="95" cy="50" r="4" fill="#dc2626"/><circle cx="27" cy="18" r="4" fill="#2563eb"/><circle cx="27" cy="82" r="4" fill="#16a34a"/>',
        ),
      },
      {
        id: 'chem-molecule-h2o',
        name: 'جزيء H₂O',
        aspect: 1.4,
        svg: S(
          '<circle cx="60" cy="50" r="18" fill="#dc2626" fill-opacity="0.15"/>' +
            '<circle cx="20" cy="25" r="11" fill="#2563eb" fill-opacity="0.15"/>' +
            '<circle cx="20" cy="75" r="11" fill="#2563eb" fill-opacity="0.15"/>' +
            '<line x1="60" y1="50" x2="20" y2="25"/><line x1="60" y1="50" x2="20" y2="75"/>',
          '0 0 90 100',
        ),
      },
      {
        id: 'chem-beaker',
        name: 'كأس مخبري',
        aspect: 0.8,
        svg: S(
          '<path d="M30 5 h40 v20 l25 60 a5 5 0 0 1 -5 8 h-80 a5 5 0 0 1 -5 -8 l25 -60 z"/>' +
            '<line x1="25" y1="65" x2="95" y2="65"/><line x1="26" y1="10" x2="94" y2="10"/>',
          '0 0 120 100',
        ),
      },
      {
        id: 'chem-test-tube',
        name: 'أنبوب اختبار',
        aspect: 0.35,
        svg: S(
          '<path d="M15 5 h20 v70 a10 10 0 0 1 -20 0 z"/>' +
            '<line x1="12" y1="5" x2="38" y2="5"/><line x1="15" y1="55" x2="35" y2="55" stroke="#16a34a" stroke-width="14" opacity="0.3"/>',
          '0 0 50 100',
        ),
      },
      {
        id: 'chem-flask',
        name: 'دورق مخروطي',
        aspect: 0.9,
        svg: S(
          '<path d="M42 5 h16 v25 l32 60 a6 6 0 0 1 -6 9 h-68 a6 6 0 0 1 -6 -9 l32 -60 z"/>' +
            '<line x1="40" y1="5" x2="60" y2="5"/>',
          '0 0 100 100',
        ),
      },
      {
        id: 'chem-burner',
        name: 'موقد بنسن',
        aspect: 0.6,
        svg: S(
          '<path d="M25 40 q10 -25 -5 -35" stroke="#ea580c"/>' +
            '<rect x="15" y="40" width="30" height="15"/>' +
            '<path d="M5 55 h50 l-6 20 h-38 z"/>',
          '0 0 60 100',
        ),
      },
      {
        id: 'chem-periodic-tile',
        name: 'بطاقة عنصر',
        aspect: 1,
        svg: S(
          '<rect x="8" y="8" width="84" height="84" rx="6"/>' +
            '<text x="50" y="45" font-size="30" text-anchor="middle" stroke="none" fill="#1e293b" font-family="sans-serif">H</text>' +
            '<text x="50" y="75" font-size="12" text-anchor="middle" stroke="none" fill="#1e293b" font-family="sans-serif">1.008</text>',
        ),
      },
    ],
  },
  {
    id: 'science',
    name: 'العلوم',
    items: [
      {
        id: 'science-plant-cell',
        name: 'خلية نباتية',
        aspect: 1,
        svg: S(
          '<rect x="8" y="8" width="84" height="84" rx="10"/>' +
            '<circle cx="50" cy="50" r="16"/>' +
            '<circle cx="30" cy="30" r="8"/><circle cx="70" cy="70" r="10"/><circle cx="72" cy="28" r="6"/>',
        ),
      },
      {
        id: 'science-dna',
        name: 'الحمض النووي DNA',
        aspect: 0.5,
        svg: S(
          '<path d="M10 5 C40 20 10 35 40 50 C10 65 40 80 10 95" />' +
            '<path d="M40 5 C10 20 40 35 10 50 C40 65 10 80 40 95" />' +
            Array.from({ length: 5 }, (_, i) => 12 + i * 18)
              .map((y) => `<line x1="14" y1="${y}" x2="36" y2="${y}" stroke-dasharray="2 3"/>`)
              .join(''),
          '0 0 50 100',
        ),
      },
      {
        id: 'science-magnifier',
        name: 'عدسة مكبرة',
        aspect: 0.8,
        svg: S('<circle cx="38" cy="38" r="28"/><line x1="58" y1="58" x2="90" y2="90" stroke-width="6"/>', '0 0 100 100'),
      },
      {
        id: 'science-thermometer',
        name: 'ميزان حرارة',
        aspect: 0.3,
        svg: S(
          '<rect x="12" y="5" width="10" height="65" rx="5"/><circle cx="17" cy="82" r="14"/>' +
            '<line x1="17" y1="20" x2="17" y2="70" stroke="#dc2626" stroke-width="4"/><circle cx="17" cy="82" r="8" fill="#dc2626" stroke="none"/>',
          '0 0 34 100',
        ),
      },
      {
        id: 'science-microscope',
        name: 'مجهر',
        aspect: 0.7,
        svg: S(
          '<rect x="10" y="85" width="50" height="8"/>' +
            '<line x1="30" y1="85" x2="30" y2="55"/>' +
            '<path d="M30 55 h25"/><rect x="48" y="30" width="10" height="25"/>' +
            '<circle cx="53" cy="25" r="7"/><line x1="30" y1="70" x2="45" y2="70"/>',
          '0 0 70 100',
        ),
      },
    ],
  },
  {
    id: 'geography',
    name: 'الجغرافيا',
    items: [
      {
        id: 'geo-globe',
        name: 'كرة أرضية',
        aspect: 1,
        svg: S(
          '<circle cx="50" cy="50" r="42"/>' +
            '<ellipse cx="50" cy="50" rx="18" ry="42"/>' +
            '<line x1="8" y1="50" x2="92" y2="50"/>' +
            '<path d="M8 34 q42 14 84 0"/><path d="M8 66 q42 -14 84 0"/>',
        ),
      },
      {
        id: 'geo-compass',
        name: 'بوصلة',
        aspect: 1,
        svg: S(
          '<circle cx="50" cy="50" r="42"/>' +
            '<polygon points="50,15 58,50 50,85 42,50" fill="#dc2626" fill-opacity="0.5"/>' +
            '<text x="50" y="12" font-size="10" text-anchor="middle" stroke="none" fill="#1e293b" font-family="sans-serif">ش</text>',
        ),
      },
      {
        id: 'geo-mountain',
        name: 'جبل ونهر',
        aspect: 1.6,
        svg: S(
          '<polygon points="20,80 45,30 60,55 75,20 100,80"/>' +
            '<path d="M0 90 q30 -10 60 0 t60 0" stroke="#2563eb"/>',
          '0 0 120 90',
        ),
      },
      {
        id: 'geo-flag',
        name: 'علم على عمود',
        aspect: 0.6,
        svg: S('<line x1="10" y1="5" x2="10" y2="95"/><path d="M10 8 h45 l-10 12 l10 12 h-45 z"/>', '0 0 60 100'),
      },
      {
        id: 'geo-continent',
        name: 'خريطة تقريبية',
        aspect: 1.4,
        svg: S(
          '<path d="M10 40 q10 -25 35 -20 q10 -15 35 -5 q25 5 20 30 q10 15 -5 30 q-15 15 -40 10 q-25 10 -40 -10 q-15 -10 -5 -35 z"/>',
          '0 0 110 80',
        ),
      },
    ],
  },
  {
    id: 'language',
    name: 'العربي والإنجليزي',
    items: [
      {
        id: 'lang-writing-lines',
        name: 'سطور كتابة',
        aspect: 2,
        svg: S(
          '<rect x="4" y="4" width="192" height="92"/>' +
            '<line x1="4" y1="30" x2="196" y2="30"/><line x1="4" y1="50" x2="196" y2="50" stroke-dasharray="4 4"/><line x1="4" y1="70" x2="196" y2="70"/>',
          '0 0 200 100',
        ),
      },
      {
        id: 'lang-speech-bubble',
        name: 'فقاعة حوار',
        aspect: 1.3,
        svg: S(
          '<rect x="5" y="5" width="120" height="70" rx="16"/>' +
            '<polygon points="30,75 30,95 55,75"/>',
          '0 0 130 95',
        ),
      },
      {
        id: 'lang-word-card',
        name: 'بطاقة كلمة',
        aspect: 1.8,
        svg: S('<rect x="5" y="5" width="150" height="70" rx="8"/>', '0 0 160 80'),
      },
    ],
  },
];

export function findLibraryItem(itemId: string): { subject: LibrarySubject; item: LibraryItemDef } | null {
  for (const subject of ELEMENTS_LIBRARY) {
    const item = subject.items.find((i) => i.id === itemId);
    if (item) return { subject, item };
  }
  return null;
}
