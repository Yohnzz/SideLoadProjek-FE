import type { Game, Review } from '../types/game'

export const DUMMY_GAMES: Game[] = [
  {
    id: 'game-1',
    slug: 'kala-warisan-kabut',
    title: 'Kala: Warisan Kabut',
    developer: 'Nusantara Horizon Studios',
    developer_id: 'dev-001',
    genre: 'Petualangan Naratif, Teka-teki',
    platforms: ['WIN'],
    price: 45000,
    rating: 4.8,
    review_count: 124,
    cover_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop'
    ],
    release_date: '12 Jan 2026',
    file_size: '1.4 GB',
    languages: ['Indonesia', 'Inggris'],
    drm_free: true,
    version: 'v1.2.0',
    badge: 'Versi Baru Tersedia',
    short_description: 'Jelajahi peradaban lereng pegunungan mistis Jawa kuno yang terlupakan. Pecahkan teka-teki lingkungan berbasis waktu dan dengarkan ritme gending gamelan minimalis yang memikat.',
    description: 'Kala: Warisan Kabut adalah game petualangan teka-teki atmosferik berlatar dataran tinggi mistis nusantara masa lampau. Anda memandu seorang penjelajah sunyi yang berusaha menyingkap misteri hilangnya peradaban lembah dan mengungkap artefak kuno pengendali cuaca.\n\nTanpa adanya petunjuk visual yang berlebihan di layar, Anda diajak mengamati tanda alam, relief batu, dan arah pergerakan angin lembah untuk memecahkan rangkaian teka-teki spasial.',
    features: [
      'Eksplorasi Murni: Lanskap visual tanpa antarmuka yang mengaburkan pandangan (Zero HUD), memaksimalkan pengalaman visual editorial.',
      'Teka-teki Spasial Lingkungan: 18 ruang puzzle kuil berbasis mekanika air, bayangan matahari, dan batu pembalik masa.',
      'Musik Akustik Otentik: 12 komposisi orisinal yang memadukan gamelan slendro kontemporer dan suasana angin pegunungan alami.',
      'Dukungan Pengontrol Penuh: Optimalisasi kendali menggunakan keyboard dan gamepad secara mulus.'
    ],
    system_requirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i3-4160 / AMD FX-6300',
        memory: '4 GB RAM',
        graphics: 'GeForce GTX 750 Ti / AMD Radeon R7 260X',
        storage: '2 GB ruang kosong'
      },
      recommended: {
        os: 'Windows 11 64-bit',
        processor: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 1060 (6GB) / RX 580',
        storage: '2 GB ruang kosong SSD'
      }
    },
    changelog: [
      {
        version: 'v1.2.0',
        date: '28 Jan 2026',
        notes: [
          'Peningkatan performa rendering bayangan di area Candi Barat.',
          'Penambahan opsi subtitle Bahasa Jawa halus (Krama Inggil).',
          'Perbaikan bug mekanika pintu air di ruang puzzle ketiga.'
        ]
      }
    ]
  },
  {
    id: 'game-2',
    slug: 'kopi-malam-kisah-sudut-kota',
    title: 'Kopi Malam: Kisah Sudut Kota',
    developer: 'Studio Senja',
    developer_id: 'dev-002',
    genre: 'Naratif, Simulasi Kehidupan',
    platforms: ['WIN', 'WEB'],
    price: 35000,
    rating: 4.7,
    review_count: 86,
    cover_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=900&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop'
    ],
    release_date: '04 Jan 2026',
    file_size: '850 MB',
    languages: ['Indonesia'],
    drm_free: true,
    version: 'v1.0.4',
    short_description: 'Dengarkan kisah malam warga kota di sebuah kedai kopi tenda pinggir jalan sembari meracik minuman hangat yang menenangkan.',
    description: 'Di tengah hiruk pikuk jalanan malam kota besar, sebuah kedai kopi kecil menjadi tempat berlabuh bagi orang-orang dengan seribu cerita. Jadilah barista yang mendengarkan keluh kesah dan membantu mereka menemukan jalan keluar lewat racikan minuman yang tepat.',
    features: [
      'Mekanika seduh kopi manual dengan beragam biji nusantara.',
      'Percabangan dialog mendalam dengan lebih dari 15 karakter unik.',
      'Lagu latar lo-fi akustik hangat bersanding dengan suara rintik hujan.'
    ]
  },
  {
    id: 'game-3',
    slug: 'layar-pinisi-ekspedisi-samudra',
    title: 'Layar Pinisi: Ekspedisi Samudra',
    developer: 'Nusantara Odyssey',
    developer_id: 'dev-003',
    genre: 'Petualangan, Strategi Pelayaran',
    platforms: ['WIN'],
    price: 50000,
    rating: 4.9,
    review_count: 210,
    cover_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop'
    ],
    release_date: '20 Des 2025',
    file_size: '2.8 GB',
    languages: ['Indonesia', 'Inggris'],
    drm_free: true,
    version: 'v1.1.0',
    short_description: 'Nakhodai kapal pinisi legendaris melintasi kepulauan rempah nusantara. Hadapi badai tropis dan bangun rute perdagangan maritim Anda.',
    description: 'Sebuah simulasi bahari yang memadukan sejarah pelaut Bugis dengan strategi manajemen kru dan perbekalan kapal. Jelajahi laut biru yang luas dengan peta astronomi tradisional.',
    features: [
      'Simulasi angin dan pasang surut air laut yang realistis.',
      'Manajemen perbaikan kapal, kesehatan kru, dan muatan rempah-rempah.',
      'Puluhan pelabuhan bersejarah yang dapat disinggahi.'
    ]
  },
  {
    id: 'game-4',
    slug: 'memori-kaset-pita',
    title: 'Memori Kaset Pita',
    developer: 'Nada Reka',
    developer_id: 'dev-004',
    genre: 'Fiksi Interaktif, Nostalgia 90an',
    platforms: ['WEB'],
    price: 0, // Gratis
    rating: 4.6,
    review_count: 95,
    cover_url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=900&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1200&auto=format&fit=crop'
    ],
    release_date: '15 Jan 2026',
    file_size: '120 MB',
    languages: ['Indonesia'],
    drm_free: true,
    version: 'v1.1',
    short_description: 'Putar kembali rekaman pita kaset lawas dari kamar tidur tahun 1999 dan telusuri jejak pesan rahasia sahabat masa kecil.',
    description: 'Game naratif interaktif santai yang dimainkan langsung di peramban web. Dengarkan rekaman suara analog dan putar pensil untuk mengurai pita kaset yang kusut.',
    features: [
      'Dimainkan instan di browser tanpa unduh file besar.',
      'Tata suara analog otentik dengan rekaman suara asli.',
      'Cerita singkat menyentuh hati berdurasi 30 sampai 45 menit.'
    ]
  },
  {
    id: 'game-5',
    slug: 'candi-runtuh-labirin-kuno',
    title: 'Candi Runtuh: Labirin Kuno',
    developer: 'Pusaka Games',
    developer_id: 'dev-005',
    genre: 'Isometric Dungeon Crawler',
    platforms: ['WIN', 'APK'],
    price: 28000,
    rating: 4.5,
    review_count: 63,
    cover_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=900&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop'
    ],
    release_date: '10 Jan 2026',
    file_size: '620 MB',
    languages: ['Indonesia', 'Inggris'],
    drm_free: true,
    version: 'v1.0.2',
    short_description: 'Eksplorasi labirin bawah tanah candi yang terlupakan, hindari jebakan mekanik kuno, dan kumpulkan artefak pusaka.',
    description: 'Perpaduan sudut pandang isometrik klasik dengan pertarungan taktis cepat. Cocok dimainkan di PC maupun perangkat Android.',
    features: [
      'Labirin prosedural yang selalu berubah di setiap permainan.',
      'Sistem artefak pusaka yang memberi kekuatan unik pada karakter.',
      'Dukungan touch control responsif untuk platform Android.'
    ]
  },
  {
    id: 'game-6',
    slug: 'bayang-lakon-dalang',
    title: 'Bayang: Lakon Dalang',
    developer: 'Wayang Interactive',
    developer_id: 'dev-006',
    genre: 'Artistik, Naratif Siluet',
    platforms: ['WIN'],
    price: 40000,
    rating: 4.9,
    review_count: 142,
    cover_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=900&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=1200&auto=format&fit=crop'
    ],
    release_date: '24 Jan 2026',
    file_size: '2.1 GB',
    languages: ['Indonesia'],
    drm_free: true,
    version: 'v1.0.1',
    short_description: 'Kendalikan karakter wayang kulit di balik kelir putih bercahaya pelita blencong. Bawa pesan perdamaian ke negeri yang terpecah.',
    description: 'Karya seni visual memukau yang menghidupkan seni tradisi pertunjukan wayang kulit ke dalam media video game kontemporer.',
    features: [
      'Visual berbasis siluet wayang dengan animasi mekanik sendi otentik.',
      'Narasi puitis dengan pengisi suara dalang profesional.',
      'Iringan gamelan dinamis yang menyesuaikan intensitas adegan.'
    ]
  },
  {
    id: 'game-7',
    slug: 'subak-siklus-air-padi',
    title: 'Subak: Siklus Air Padi',
    developer: 'Bali Indie Lab',
    developer_id: 'dev-007',
    genre: 'Manajemen, Agro Simulasi',
    platforms: ['WIN', 'WEB'],
    price: 0, // Gratis
    rating: 4.8,
    review_count: 77,
    cover_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=900&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop'
    ],
    release_date: '26 Jan 2026',
    file_size: '410 MB',
    languages: ['Indonesia', 'Inggris'],
    drm_free: true,
    version: 'v1.0.0',
    short_description: 'Kelola irigasi persawahan bertingkat Bali dengan filosofi harmoni Tri Hita Karana. Jaga ketersediaan air bersama para petani desa.',
    description: 'Game santai bertema pengelolaan sumber daya air tradisional yang mengajarkan gotong royong dan keseimbangan ekosistem terasering.',
    features: [
      'Simulasi aliran air gravitasi dari hulu danau ke petak sawah hilir.',
      'Siklus musim hujan dan kemarau dengan dinamika hama alami.',
      'Grafis menyejukkan bertema pemandangan alam perdesaan Bali.'
    ]
  },
  {
    id: 'game-8',
    slug: 'kereta-parahyangan-1994',
    title: 'Kereta Parahyangan 1994',
    developer: 'Jalur Nostalgia',
    developer_id: 'dev-008',
    genre: 'Nostalgia, Simulasi Perjalanan',
    platforms: ['WIN'],
    price: 32000,
    rating: 4.7,
    review_count: 118,
    cover_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=900&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1200&auto=format&fit=crop'
    ],
    release_date: '18 Jan 2026',
    file_size: '1.2 GB',
    languages: ['Indonesia'],
    drm_free: true,
    version: 'v1.0.3',
    short_description: 'Rasakan perjalanan kereta api legendaris jalur Jakarta ke Bandung melintasi jembatan tinggi Cikubang di era tahun sembilan puluhan.',
    description: 'Sebuah perjalanan santai di balik jendela gerbong kereta era 90-an. Dengarkan deru roda besi dan nikmati pemandangan perbukitan teh Parahyangan.',
    features: [
      'Rekonstruksi mendetail stasiun dan jembatan kereta api historis.',
      'Interaksi santai dengan penumpang dan pedagang asongan khas era 90-an.',
      'Dukungan resolusi lebar 21:9 untuk sensasi panorama jendela kereta.'
    ]
  },
  {
    id: 'game-9',
    slug: 'bintang-sumba-peta-langit',
    title: 'Bintang Sumba: Peta Langit',
    developer: 'Nusa Timur Interactive',
    developer_id: 'dev-009',
    genre: 'Puzzle Astronomi',
    platforms: ['APK'],
    price: 20000,
    rating: 4.6,
    review_count: 52,
    cover_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=900&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop'
    ],
    release_date: '22 Jan 2026',
    file_size: '340 MB',
    languages: ['Indonesia'],
    drm_free: true,
    version: 'v1.0.1',
    short_description: 'Tafsirkan formasi rasi bintang di atas padang sabana Sumba untuk menuntun kawanan kuda kembali ke perkampungan adat.',
    description: 'Game teka-teki astronomi menenangkan dengan latar bentang alam bukit dan padang rumput Sumba di bawah gemerlap galaksi Bima Sakti.',
    features: [
      'Lebih dari 40 formasi rasi bintang tradisional nusantara.',
      'Kontrol sentuh satu jari yang sangat ramah di ponsel Android.',
      'Mode relaksasi tanpa batasan waktu maupun penalti skor.'
    ]
  }
]

export const DUMMY_REVIEWS: Record<string, Review[]> = {
  'kala-warisan-kabut': [
    {
      id: 'rev-1',
      game_id: 'game-1',
      author: 'Bagas P.',
      rating: 5.0,
      date: '20 Jan 2026',
      verified_purchase: true,
      playtime_hours: 5.2,
      helpful_count: 9,
      content: 'Sangat menghargai pendekatan visual yang tidak memanjakan mata dengan efek neon berlebih. Suasana kabutnya terasa sangat kental dengan mitos orisinal lokal tanpa terkesan klise. Teka-teki batu bayangan di kuil ketiga dirancang dengan sangat cerdas.'
    },
    {
      id: 'rev-2',
      game_id: 'game-1',
      author: 'Siti Rahma',
      rating: 4.5,
      date: '18 Jan 2026',
      verified_purchase: true,
      playtime_hours: 7.0,
      helpful_count: 11,
      content: 'Musik latar gamelan kontemporernya luar biasa tenang dan khidmat. Tidak ada lag sama sekali di kartu grafis GTX 1050 Ti lama saya. Sedikit catatan di perpindahan sudut pandang kamera yang terkadang agak lambat, tetapi secara keseluruhan pengalaman naratifnya berkelas.'
    },
    {
      id: 'rev-3',
      game_id: 'game-1',
      author: 'Dimas Arya',
      rating: 5.0,
      date: '14 Jan 2026',
      verified_purchase: true,
      playtime_hours: 4.5,
      helpful_count: 6,
      content: 'Karya indie lokal yang matang. Pacing teka-tekinya tenang, tidak memaksa pemain terburu-buru. Senang melihat rilisan DRM-free di SideLoad yang bersih seperti ini tanpa launcher bloatware tambahan.'
    }
  ]
}
