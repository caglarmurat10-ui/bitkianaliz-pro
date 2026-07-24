import type { Disease } from "@/lib/types";

/** Yerel SVG katalog görselleri — /public/diseases */
const img = (id: string) => `/diseases/${id}.svg`;

export const DISEASES: Disease[] = [
  {
    id: "tomato-early-blight",
    plant: "Domates",
    name: "Erken Mildiyö (Alternaria)",
    pathogen: "Alternaria solani",
    symptoms: ["Yapraklarda hedef tahtası lekeleri", "Alt yapraklardan başlayan sararma", "Meyvede çökük lezyonlar"],
    cultural_measures: ["Alt yaprak budaması", "Damla sulama tercih edin", "Ürün rotasyonu (3 yıl)"],
    chemical_measures: ["Mancozeb 80 WP — 200 g/100 L", "Azoksistrobin — etiket dozuna uyun"],
    severity_hint: "medium",
    image: img("tomato-early-blight"),
  },
  {
    id: "tomato-late-blight",
    plant: "Domates",
    name: "Geç Mildiyö (Phytophthora)",
    pathogen: "Phytophthora infestans",
    symptoms: ["Yağlı grimsi lekeler", "Beyaz misel alt yüzde", "Hızlı yayılım nemli havada"],
    cultural_measures: ["Hava sirkülasyonu artırın", "Gece ıslak yaprak bırakmayın"],
    chemical_measures: ["Metalaksil + Mancozeb", "Bakırlı preparatlar (erken dönem)"],
    severity_hint: "high",
    image: img("tomato-late-blight"),
  },
  {
    id: "grape-powdery-mildew",
    plant: "Asma",
    name: "Külleme",
    pathogen: "Erysiphe necator",
    symptoms: ["Yaprak üstünde unsu beyaz tabaka", "Salkımda çatlama", "Genç sürgünlerde bozulma"],
    cultural_measures: ["Sıkışık yaprak seyreltme", "Azot aşırılamayın"],
    chemical_measures: ["Kükürt — 100 L'ye 400 ml (sıvı)", "Tebuconazole — etiket dozu"],
    severity_hint: "medium",
    image: img("grape-powdery-mildew"),
  },
  {
    id: "olive-peacock-spot",
    plant: "Zeytin",
    name: "Halkalı Leke",
    pathogen: "Spilocaea oleagina",
    symptoms: ["Yaprakta koyu halkalı lekeler", "Erken yaprak dökümü", "Zayıf sürgün gelişimi"],
    cultural_measures: ["Budama ile iç havalandırma", "Düşen yaprakları temizleyin"],
    chemical_measures: ["Bakır oksiklorür — kış ve ilkbahar", "Dodine — etiket dozu"],
    severity_hint: "medium",
    image: img("olive-peacock-spot"),
  },
  {
    id: "citrus-leafminer",
    plant: "Turunçgil",
    name: "Yaprak Galerigüvesi",
    pathogen: "Phyllocnistis citrella",
    symptoms: ["Yaprakta gümüşi galeriler", "Kıvrılmış genç yapraklar", "Yeni sürgünde yoğun zarar"],
    cultural_measures: ["Azotlu gübreyi dengeli verin", "Genç bahçelerde izleme"],
    chemical_measures: ["Abamectin — 25-30 ml/100 L", "Mineral yağ + insektisit tank karışımı (kavanoz testi)"],
    severity_hint: "medium",
    image: img("citrus-leafminer"),
  },
  {
    id: "wheat-rust",
    plant: "Buğday",
    name: "Sarı Pas",
    pathogen: "Puccinia striiformis",
    symptoms: ["Yaprakta sarı çizgiler", "Erken yaşlanma", "Verim kaybı"],
    cultural_measures: ["Dayanıklı çeşit tercih edin", "Erken ekim penceresine dikkat"],
    chemical_measures: ["Propikonazol", "Tebuconazole — bayrak yaprak döneminde"],
    severity_hint: "high",
    image: img("wheat-rust"),
  },
  {
    id: "apple-scab",
    plant: "Elma",
    name: "Karaleke",
    pathogen: "Venturia inaequalis",
    symptoms: ["Yaprakta zeytin yeşili lekeler", "Meyvede çatlak siyah lezyonlar"],
    cultural_measures: ["Düşen yaprakları yok edin", "Açık taç yapısı"],
    chemical_measures: ["Captan", "Difenoconazole — çiçek sonrası"],
    severity_hint: "high",
    image: img("apple-scab"),
  },
  {
    id: "pepper-blossom-end-rot",
    plant: "Biber",
    name: "Çiçek Burnu Çürüklüğü",
    pathogen: "Fizyolojik (Ca eksikliği / düzensiz sulama)",
    symptoms: ["Meyve ucunda kahverengi çürüme", "Kalsiyum taşınma bozukluğu"],
    cultural_measures: ["Düzenli sulama", "Aşırı azottan kaçının"],
    chemical_measures: ["Kalsiyum nitrat yaprak uygulaması — 500 g/100 L"],
    severity_hint: "low",
    image: img("pepper-blossom-end-rot"),
  },
  {
    id: "generic-aphid",
    plant: "Genel",
    name: "Yaprak Biti",
    pathogen: "Aphididae spp.",
    symptoms: ["Yaprak altı koloniler", "Yapışkan ballımsı madde", "Kıvrık sürgünler"],
    cultural_measures: ["Yararlı böcekleri koruyun", "Azot dozunu düşürün"],
    chemical_measures: ["Imidacloprid — 15-20 ml/100 L", "Potasyum sabunu — düşük yoğunluk"],
    severity_hint: "medium",
    image: img("generic-aphid"),
  },
  {
    id: "generic-healthy",
    plant: "Genel",
    name: "Sağlıklı",
    pathogen: undefined,
    symptoms: ["Belirgin hastalık belirtisi yok"],
    cultural_measures: ["Rutin izleme devam", "Besleme programını sürdürün"],
    chemical_measures: [],
    severity_hint: "low",
    image: img("generic-healthy"),
  },
];

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
    .map((d) => `${d.id}|${d.plant}|${d.name}`)
    .join("\n");
}

export function plantsInCatalog() {
  return [...new Set(DISEASES.map((d) => d.plant))];
}
