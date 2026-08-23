export const INITIAL_SERVICES = [
  {
    id: 's1',
    number: '01',
    name: "O'rindiqlar ximchistkasi",
    description: "Sidenya chexol Almashtirish",
    basePrice: 80000,
    tag: 'Eng mashhur'
  },
  {
    id: 's2',
    number: '02',
    name: "To'liq salon",
    description: "Shift, gilam, panel, eshik qoplamalari va bagaj — salonning har bir santimetri.",
    basePrice: 500000,
    tag: 'Tavsiya etiladi'
  },
  {
    id: 's3',
    number: '03',
    name: "Mator chiska",
    description: "Mator Ximchistka",
    basePrice: 100000,
    tag: 'Gigiyena'
  },
  {
    id: 's4',
    number: '04',
    name: "Sidenya ximchistka",
    description: "Sidenya ximchistka",
    basePrice: 200000,
    tag: 'Mashhur'
  },
  {
    id: 's5',
    number: '05',
    name: "Obshivka Ximchistka",
    description: "Obshivka Ximchistka",
    basePrice: 100000,
    tag: 'Sifatli'
  },
  {
    id: 's6',
    number: '06',
    name: "Shift Patalok ximchistka",
    description: "shift patalok",
    basePrice: 100000,
    tag: 'Sifatli'
  },
];

export const CAR_TYPES = [
  { id: 'sedan', name: 'Sedan / Hatchback', multiplier: 1.0, icon: 'Car' },
  { id: 'crossover', name: 'Crossover / Kichik SUV', multiplier: 1.2, icon: 'Truck' },
  { id: 'suv', name: 'Katta SUV / Minivan', multiplier: 1.4, icon: 'ShieldAlert' }
];

export const INITIAL_GALLERY = [
  {
    id: 'g1',
    title: "BMW X5 — O'rindiqlar va Teri Tiklash",
    before: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    after: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
    category: "Teri tiklash"
  },
  {
    id: 'g2',
    title: "Mercedes E-Class — Gilam va Pol Ekstraksiyasi",
    before: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
    after: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800",
    category: "Chuqur tozalash"
  },
  {
    id: 'g3',
    title: "Porsche Cayenne — Kompleks Salon Restavratsiyasi",
    before: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&q=80&w=800",
    after: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
    category: "Nano Himoya"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'r1',
    author: "Jasur K. (Tashkent)",
    car: "Malibu 2",
    rating: 5,
    comment: "Malibu 2 mashinamni bergan edim, ayniqsa teri o'rindiqlardagi dog'lar butunlay ketibdi. Yangiday bo'lib qoldi, rahmat!",
    date: "Bugun"
  },
  {
    id: 'r2',
    author: "Sardor M. (Gentrall)",
    car: "Gentra",
    rating: 5,
    comment: "Bagaj va shift qismidagi noxush hid ozonlashdan keyin umuman yo'qoldi. Hizmat ko'rsatish juda tez va sifatli.",
    date: "Kechagacha"
  },
  {
    id: 'r3',
    author: "Alisher R. (Tracker)",
    car: "Chevrolet Tracker",
    rating: 5,
    comment: "Tracker krossoverimni to'liq salon ximchistkasiga qoldirgandim, 4 soatda top-top qilib topshirishdi. Tavsiya qilaman!",
    date: "3 kun oldin"
  }
];

export const INITIAL_HERO = {
  subtitle: "★ Tozalik Ustasi Luxury Auto Detailing Studio",
  titleLine1: "TOZALIK",
  titleLine2: "USTASI",
  titleLine3: "STUDIYASI",
  description: "Avtomobil salon ximchistkasi: o'rindiq, gilam, shift va butun salonni chuqur tozalash. Oldin/keyin natijalar, onlayn buyurtma.",
  stat1Value: "3–5 Soatda",
  stat1Label: "Avtomobilingiz to'liq tozalab, quritib topshiriladi.",
  stat2Value: "40+",
  stat2Label: "Muvaffaqiyatli tozalangan avtomobillar soni."
};

export const INITIAL_SITE_INFO = {
  phone1: "+998 33 779 80 80",
  phone2: "+998 33 779 80 80",
  address: "Xorazm viloyati, Yangibozor tumani, G'afurgulom ko'chasi",
  workingHours: "Har kuni: 09:00 – 20:00",
  telegramToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || "8925592658:AAGYwLXwNrqawhwHVJ-L5A70O1i4bXq_CbQ",
  telegramChatId: "7338450259",
  telegramUrl: "https://t.me/tozalik_ustasi",
  instagramUrl: "https://www.instagram.com/tozalik.ustasi/"
};

