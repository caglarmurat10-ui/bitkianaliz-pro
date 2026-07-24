import type { Disease, SeverityLevel } from "@/lib/types";

/** Yerel yedek görsel */
const fallback = (id: string) => `/catalog/${id}.svg`;

export type CatalogSeed = Omit<Disease, "image"> & {
  image?: string;
  /** Wikipedia sayfa başlıkları (online özet + görsel) */
  wiki?: { en?: string; tr?: string };
  /** Openverse arama sorgusu */
  openverseQuery?: string;
};

export const CATALOG_SEEDS: CatalogSeed[] = [
  {
    id: "tomato-early-blight",
    kind: "disease",
    plant: "Domates",
    name: "Erken Mildiyö (Alternaria)",
    pathogen: "Alternaria solani",
    wiki: { en: "Alternaria_solani", tr: "Alternaria" },
    openverseQuery: "Alternaria solani tomato leaf",
    symptoms: ["Yapraklarda hedef tahtası lekeleri", "Alt yapraklardan başlayan sararma", "Meyvede çökük lezyonlar"],
    cultural_measures: ["Alt yaprak budaması", "Damla sulama", "Ürün rotasyonu (3 yıl)", "Sık dikimden kaçının"],
    biological_measures: ["Bacillus subtilis biofungisit", "Dayanıklı çeşit"],
    chemical_measures: ["Mancozeb 80 WP — 200 g/100 L", "Azoksistrobin — etiket dozu"],
    severity_hint: "medium",
  },
  {
    id: "tomato-late-blight",
    kind: "disease",
    plant: "Domates",
    name: "Geç Mildiyö (Phytophthora)",
    pathogen: "Phytophthora infestans",
    wiki: { en: "Phytophthora_infestans", tr: "Phytophthora_infestans" },
    openverseQuery: "Phytophthora infestans tomato",
    symptoms: ["Yağlı grimsi lekeler", "Beyaz misel alt yüzde", "Nemli havada hızlı yayılım"],
    cultural_measures: ["Hava sirkülasyonu", "Gece ıslak yaprak bırakmayın", "Enfekteli bitki imhası"],
    biological_measures: ["Bakırlı erken koruma", "Dayanıklı çeşit"],
    chemical_measures: ["Metalaksil + Mancozeb", "Cymoxanil + bakır"],
    severity_hint: "high",
  },
  {
    id: "grape-powdery-mildew",
    kind: "disease",
    plant: "Asma",
    name: "Külleme",
    pathogen: "Erysiphe necator",
    wiki: { en: "Erysiphe_necator", tr: "Külleme" },
    openverseQuery: "grape powdery mildew Erysiphe",
    symptoms: ["Yaprak üstünde unsu beyaz tabaka", "Salkımda çatlama", "Genç sürgün bozulması"],
    cultural_measures: ["Yaprak seyreltme", "Azot aşırılamayın", "Havalı terbiye"],
    biological_measures: ["Bacillus amyloliquefaciens", "Potasyum bikarbonat"],
    chemical_measures: ["Kükürt — 400 ml/100 L", "Tebuconazole — etiket"],
    severity_hint: "medium",
  },
  {
    id: "grape-downy-mildew",
    kind: "disease",
    plant: "Asma",
    name: "Mildiyö (Plasmopara)",
    pathogen: "Plasmopara viticola",
    wiki: { en: "Plasmopara_viticola" },
    openverseQuery: "Plasmopara viticola grape downy mildew",
    symptoms: ["Yağlı lekeler", "Alt yüzde beyaz küf", "Salkım kuruması"],
    cultural_measures: ["Havalandırma", "Yağış sonrası izleme", "Sık dikimden kaçının"],
    biological_measures: ["Bakırlı koruyucu program", "Fosetil-Al"],
    chemical_measures: ["Metalaksil + bakır", "Mancozeb — etiket"],
    severity_hint: "high",
  },
  {
    id: "olive-peacock-spot",
    kind: "disease",
    plant: "Zeytin",
    name: "Halkalı Leke",
    pathogen: "Spilocaea oleagina",
    wiki: { en: "Venturia_oleaginea", tr: "Zeytin_halkalı_lekesi" },
    openverseQuery: "olive peacock spot Spilocaea",
    symptoms: ["Koyu halkalı yaprak lekeleri", "Erken yaprak dökümü", "Zayıf sürgün"],
    cultural_measures: ["Budama ile havalandırma", "Dökülen yaprak temizliği"],
    biological_measures: ["Kış-ilkbahar bakır programı"],
    chemical_measures: ["Bakır oksiklorür", "Dodine — etiket"],
    severity_hint: "medium",
  },
  {
    id: "apple-scab",
    kind: "disease",
    plant: "Elma",
    name: "Karaleke",
    pathogen: "Venturia inaequalis",
    wiki: { en: "Apple_scab", tr: "Karaleke" },
    openverseQuery: "apple scab Venturia inaequalis",
    symptoms: ["Zeytin yeşili yaprak lekeleri", "Meyvede siyah çatlak lezyonlar"],
    cultural_measures: ["Dökülen yaprak imhası", "Açık taç yapısı"],
    biological_measures: ["Bacillus subtilis", "Dayanıklı çeşit"],
    chemical_measures: ["Captan", "Difenoconazole"],
    severity_hint: "high",
  },
  {
    id: "wheat-rust",
    kind: "disease",
    plant: "Buğday",
    name: "Sarı Pas",
    pathogen: "Puccinia striiformis",
    wiki: { en: "Puccinia_striiformis", tr: "Pas_hastalığı" },
    openverseQuery: "wheat stripe rust Puccinia striiformis",
    symptoms: ["Sarı çizgiler", "Erken yaşlanma", "Verim kaybı"],
    cultural_measures: ["Dayanıklı çeşit", "Ekim zamanı", "Dengeli azot"],
    biological_measures: ["Sertifikalı tohum", "Çeşit rotasyonu"],
    chemical_measures: ["Propikonazol", "Tebuconazole — bayrak yaprak"],
    severity_hint: "high",
  },
  {
    id: "pepper-blossom-end-rot",
    kind: "disease",
    plant: "Biber",
    name: "Çiçek Burnu Çürüklüğü",
    pathogen: "Fizyolojik (Ca / sulama)",
    wiki: { en: "Blossom_end_rot" },
    openverseQuery: "blossom end rot tomato pepper",
    symptoms: ["Meyve ucunda kahverengi çürüme", "Ca taşınma bozukluğu"],
    cultural_measures: ["Düzenli sulama", "Aşırı azottan kaçının"],
    biological_measures: ["Organik madde artırımı", "Humik asit"],
    chemical_measures: ["Kalsiyum nitrat — 500 g/100 L"],
    severity_hint: "low",
  },
  {
    id: "tomato-botrytis",
    kind: "disease",
    plant: "Domates",
    name: "Kurşuni Küf",
    pathogen: "Botrytis cinerea",
    wiki: { en: "Botrytis_cinerea", tr: "Botrytis_cinerea" },
    openverseQuery: "Botrytis cinerea gray mold tomato",
    symptoms: ["Gri küf tabakası", "Çiçek/meyve çürümesi", "Yüksek nemde patlama"],
    cultural_measures: ["Havalandırma", "Yaralı doku temizliği", "Damla sulama"],
    biological_measures: ["Trichoderma ürünleri", "Bacillus subtilis"],
    chemical_measures: ["Fenhexamid", "Cyprodinil + fludioxonil"],
    severity_hint: "high",
  },
  {
    id: "citrus-canker",
    kind: "disease",
    plant: "Turunçgil",
    name: "Turunçgil Kanseri",
    pathogen: "Xanthomonas citri",
    wiki: { en: "Citrus_canker" },
    openverseQuery: "citrus canker Xanthomonas",
    symptoms: ["Kabarıık lezyonlar", "Yaprak/meyve lekeleri", "Erken döküm"],
    cultural_measures: ["Enfekteli dal budama", "Rüzgar kıran", "Alet dezenfeksiyonu"],
    biological_measures: ["Bakırlı koruma programı"],
    chemical_measures: ["Bakır hidroksit — etiket", "Antibiyotikler yalnızca yasal çerçevede"],
    severity_hint: "critical",
  },
  {
    id: "citrus-leafminer",
    kind: "pest",
    plant: "Turunçgil",
    name: "Yaprak Galerigüvesi",
    pathogen: "Phyllocnistis citrella",
    wiki: { en: "Phyllocnistis_citrella" },
    openverseQuery: "citrus leafminer Phyllocnistis",
    symptoms: ["Gümüşi galeriler", "Kıvrık genç yaprak", "Yeni sürgün zararı"],
    cultural_measures: ["Dengeli azot", "Genç bahçe izleme"],
    biological_measures: ["Parazitoid arılar", "Mineral yağ"],
    chemical_measures: ["Abamectin — 25-30 ml/100 L"],
    severity_hint: "medium",
  },
  {
    id: "generic-aphid",
    kind: "pest",
    plant: "Genel",
    name: "Yaprak Biti",
    pathogen: "Aphididae spp.",
    wiki: { en: "Aphid", tr: "Yaprak_biti" },
    openverseQuery: "aphid colony plant leaf",
    symptoms: ["Yaprak altı koloniler", "Ballımsı madde", "Kıvrık sürgün", "Virus taşıma"],
    cultural_measures: ["Azot düşür", "Sarı tuzak", "Yabancı ot temizliği"],
    biological_measures: ["Uğur böceği", "Aphidius", "Neem / potasyum sabunu"],
    chemical_measures: ["Acetamiprid — etiket", "Imidacloprid — rotasyonlu"],
    severity_hint: "medium",
  },
  {
    id: "whitefly",
    kind: "pest",
    plant: "Genel",
    name: "Beyazsine",
    pathogen: "Trialeurodes / Bemisia",
    wiki: { en: "Whitefly", tr: "Beyazsinek" },
    openverseQuery: "whitefly Bemisia greenhouse",
    symptoms: ["Beyaz uçuşan erginler", "Fumajin", "Virus riski (TYLCV)"],
    cultural_measures: ["Sarı tuzak", "Sera perdesi", "Temiz fide"],
    biological_measures: ["Encarsia formosa", "Amblyseius", "Sabunlu uygulama"],
    chemical_measures: ["Spiromesifen", "Pyriproxyfen"],
    severity_hint: "high",
  },
  {
    id: "red-spider-mite",
    kind: "pest",
    plant: "Genel",
    name: "Kırmızı Örümcek",
    pathogen: "Tetranychus urticae",
    wiki: { en: "Tetranychus_urticae", tr: "Kırmızı_örümcek" },
    openverseQuery: "Tetranychus urticae spider mite",
    symptoms: ["Bronzlaşma", "İnce ağ", "Sıcak-kuru patlama"],
    cultural_measures: ["Nem artır", "Yaprak yıkama", "Azot dengesi"],
    biological_measures: ["Phytoseiulus persimilis", "Amblyseius californicus"],
    chemical_measures: ["Abamectin", "Hexythiazox / Etoxazole"],
    severity_hint: "high",
  },
  {
    id: "thrips",
    kind: "pest",
    plant: "Genel",
    name: "Trips",
    pathogen: "Thrips tabaci / Frankliniella",
    wiki: { en: "Thrips", tr: "Thysanoptera" },
    openverseQuery: "thrips plant damage Frankliniella",
    symptoms: ["Gümüşi lekeler", "Çiçek bozulması", "TSWV taşıyıcılığı"],
    cultural_measures: ["Mavi tuzak", "Yabancı ot", "Sera perdesi"],
    biological_measures: ["Orius", "Amblyseius swirskii", "Neem"],
    chemical_measures: ["Spinosad", "Abamectin — rotasyon"],
    severity_hint: "high",
  },
  {
    id: "tuta-absoluta",
    kind: "pest",
    plant: "Domates",
    name: "Domates Güvesi (Tuta)",
    pathogen: "Tuta absoluta",
    wiki: { en: "Tuta_absoluta" },
    openverseQuery: "Tuta absoluta tomato leaf mine",
    symptoms: ["Geniş yaprak galerileri", "Meyvede delik", "Hızlı popülasyon"],
    cultural_measures: ["Feromon tuzak", "Artık imhası", "Sera giriş kontrolü"],
    biological_measures: ["Bacillus thuringiensis (Bt)", "Trichogramma"],
    chemical_measures: ["Chlorantraniliprole", "Emamectin benzoate"],
    severity_hint: "critical",
  },
  {
    id: "olive-fruit-fly",
    kind: "pest",
    plant: "Zeytin",
    name: "Zeytin Sineği",
    pathogen: "Bactrocera oleae",
    wiki: { en: "Olive_fruit_fly", tr: "Zeytin_sineği" },
    openverseQuery: "Bactrocera oleae olive fruit fly",
    symptoms: ["Yumurta batırma deliği", "Larva tüneli", "Yağ kalitesi düşüşü"],
    cultural_measures: ["Erken hasat", "Dökülen meyve toplama", "McPhail tuzak"],
    biological_measures: ["Mass trapping", "Kaolin kil"],
    chemical_measures: ["Spinosad yem+zehir", "Deltamethrin — PHI dikkat"],
    severity_hint: "high",
  },
  {
    id: "codling-moth",
    kind: "pest",
    plant: "Elma",
    name: "Elma İçkurdu",
    pathogen: "Cydia pomonella",
    wiki: { en: "Codling_moth", tr: "Elma_içkurdu" },
    openverseQuery: "codling moth Cydia pomonella apple",
    symptoms: ["Giriş deliği", "İç tünel", "Erken döküm"],
    cultural_measures: ["Feromon izleme", "Karton bant", "Dökülen meyve imha"],
    biological_measures: ["CpGV granulovirus", "Mating disruption", "Trichogramma"],
    chemical_measures: ["Chlorantraniliprole", "Emamectin"],
    severity_hint: "high",
  },
  {
    id: "medfly",
    kind: "pest",
    plant: "Turunçgil",
    name: "Akdeniz Meyve Sineği",
    pathogen: "Ceratitis capitata",
    wiki: { en: "Mediterranean_fruit_fly", tr: "Akdeniz_meyve_sineği" },
    openverseQuery: "Ceratitis capitata Mediterranean fruit fly",
    symptoms: ["Yumurta batırma", "İç çürüme", "Erken döküm"],
    cultural_measures: ["Dökülen meyve", "Erken hasat", "Tuzak ağı"],
    biological_measures: ["Mass trapping", "Steril böcek programları"],
    chemical_measures: ["Spinosad yem", "Lambda-cyhalothrin — PHI"],
    severity_hint: "high",
  },
  {
    id: "cutworm",
    kind: "pest",
    plant: "Genel",
    name: "Bozkurt / Kesici Kurt",
    pathogen: "Agrotis spp.",
    wiki: { en: "Cutworm", tr: "Bozkurt_(zararlı)" },
    openverseQuery: "cutworm Agrotis larva soil",
    symptoms: ["Fide boğazından kesme", "Gece zararı", "Toprak yüzeyi larva"],
    cultural_measures: ["Gece kontrol", "Yabancı ot", "Fide bariyeri"],
    biological_measures: ["Bacillus thuringiensis", "Doğal düşman koruma"],
    chemical_measures: ["Etiketli pyrethroid — fide döneminde dikkat"],
    severity_hint: "medium",
  },
  {
    id: "colorado-beetle",
    kind: "pest",
    plant: "Patates",
    name: "Patates Böceği",
    pathogen: "Leptinotarsa decemlineata",
    wiki: { en: "Colorado_potato_beetle", tr: "Patates_böceği" },
    openverseQuery: "Colorado potato beetle Leptinotarsa",
    symptoms: ["Yaprak iskeletleşme", "Larva+ergin bir arada", "Hızlı yaprak kaybı"],
    cultural_measures: ["Rotasyon", "Elle toplama (küçük alan)", "Erken izleme"],
    biological_measures: ["Bt tenebrionis", "Neem"],
    chemical_measures: ["Spinosad", "Chlorantraniliprole — rotasyon"],
    severity_hint: "high",
  },
  {
    id: "generic-healthy",
    kind: "disease",
    plant: "Genel",
    name: "Sağlıklı",
    pathogen: undefined,
    wiki: { en: "Plant_health", tr: "Bitki" },
    openverseQuery: "healthy green plant leaf",
    symptoms: ["Belirgin hastalık / zararlı belirtisi yok"],
    cultural_measures: ["Rutin izleme", "Besleme programı"],
    biological_measures: ["Yararlı böcek habitatı"],
    chemical_measures: [],
    severity_hint: "low",
  },
];

/** Geriye uyumluluk — enrich öncesi lokal görseller */
export const DISEASES: Disease[] = CATALOG_SEEDS.map((s) => ({
  ...s,
  image: s.image || fallback(s.id),
  biological_measures: s.biological_measures || [],
}));

export function findDiseaseById(id?: string | null) {
  if (!id) return undefined;
  return DISEASES.find((d) => d.id === id);
}

export function matchDisease(plantName: string, diagnosis: string) {
  const p = plantName.toLowerCase();
  const d = diagnosis.toLowerCase();
  if (d.includes("sağlıklı") || d.includes("saglikli")) {
    return DISEASES.find((x) => x.id === "generic-healthy");
  }
  const scored = DISEASES.map((disease) => {
    let score = 0;
    if (disease.plant !== "Genel" && p.includes(disease.plant.toLowerCase())) score += 2;
    if (d.includes(disease.name.toLowerCase().split(" ")[0])) score += 3;
    disease.symptoms.forEach((s) => {
      if (d.includes(s.toLowerCase().slice(0, 8))) score += 1;
    });
    if (disease.pathogen && d.includes(disease.pathogen.toLowerCase().split(" ")[0])) score += 2;
    return { disease, score };
  }).sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].disease : undefined;
}

export function diseaseCatalogForPrompt() {
  return DISEASES.filter((d) => d.id !== "generic-healthy")
    .map((d) => `${d.id}|${d.kind}|${d.plant}|${d.name}`)
    .join("\n");
}

export function plantsInCatalog() {
  return [...new Set(DISEASES.map((d) => d.plant))];
}

export function diseasesOnly() {
  return DISEASES.filter((d) => d.kind === "disease");
}

export function pestsOnly() {
  return DISEASES.filter((d) => d.kind === "pest");
}

export type { SeverityLevel };
