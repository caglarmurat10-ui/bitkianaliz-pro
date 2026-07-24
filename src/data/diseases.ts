import type { Disease } from "@/lib/types";

const img = (id: string) => `/catalog/${id}.svg`;

export const DISEASES: Disease[] = [
  {
    id: "tomato-early-blight",
    kind: "disease",
    plant: "Domates",
    name: "Erken Mildiyö (Alternaria)",
    pathogen: "Alternaria solani",
    symptoms: ["Yapraklarda hedef tahtası lekeleri", "Alt yapraklardan başlayan sararma", "Meyvede çökük lezyonlar"],
    cultural_measures: ["Alt yaprak budaması", "Damla sulama tercih edin", "Ürün rotasyonu (3 yıl)", "Sık dikimden kaçının"],
    biological_measures: ["Bacillus subtilis içeren biofungisitler", "Dayanıklı çeşit tercih edin"],
    chemical_measures: ["Mancozeb 80 WP — 200 g/100 L", "Azoksistrobin — etiket dozuna uyun"],
    severity_hint: "medium",
    image: img("tomato-early-blight"),
  },
  {
    id: "tomato-late-blight",
    kind: "disease",
    plant: "Domates",
    name: "Geç Mildiyö (Phytophthora)",
    pathogen: "Phytophthora infestans",
    symptoms: ["Yağlı grimsi lekeler", "Beyaz misel alt yüzde", "Hızlı yayılım nemli havada"],
    cultural_measures: ["Hava sirkülasyonu artırın", "Gece ıslak yaprak bırakmayın", "Enfekteli bitkileri uzaklaştırın"],
    biological_measures: ["Fosetil-Al erken koruyucu program", "Bakırlı preparatlar (erken dönem)"],
    chemical_measures: ["Metalaksil + Mancozeb", "Cymoxanil + bakır — etiket dozu"],
    severity_hint: "high",
    image: img("tomato-late-blight"),
  },
  {
    id: "grape-powdery-mildew",
    kind: "disease",
    plant: "Asma",
    name: "Külleme",
    pathogen: "Erysiphe necator",
    symptoms: ["Yaprak üstünde unsu beyaz tabaka", "Salkımda çatlama", "Genç sürgünlerde bozulma"],
    cultural_measures: ["Sıkışık yaprak seyreltme", "Azot aşırılamayın", "Havalandırmalı terbiye"],
    biological_measures: ["Bacillus amyloliquefaciens", "Potasyum bikarbonat uygulamaları"],
    chemical_measures: ["Kükürt — 100 L'ye 400 ml (sıvı)", "Tebuconazole — etiket dozu"],
    severity_hint: "medium",
    image: img("grape-powdery-mildew"),
  },
  {
    id: "olive-peacock-spot",
    kind: "disease",
    plant: "Zeytin",
    name: "Halkalı Leke",
    pathogen: "Spilocaea oleagina",
    symptoms: ["Yaprakta koyu halkalı lekeler", "Erken yaprak dökümü", "Zayıf sürgün gelişimi"],
    cultural_measures: ["Budama ile iç havalandırma", "Düşen yaprakları temizleyin", "Aşırı sulamadan kaçının"],
    biological_measures: ["Bakırlı koruyucu program (kış-ilkbahar)", "Dayanıklı çeşit seçimi"],
    chemical_measures: ["Bakır oksiklorür — kış ve ilkbahar", "Dodine — etiket dozu"],
    severity_hint: "medium",
    image: img("olive-peacock-spot"),
  },
  {
    id: "citrus-leafminer",
    kind: "pest",
    plant: "Turunçgil",
    name: "Yaprak Galerigüvesi",
    pathogen: "Phyllocnistis citrella",
    symptoms: ["Yaprakta gümüşi galeriler", "Kıvrılmış genç yapraklar", "Yeni sürgünde yoğun zarar"],
    cultural_measures: ["Azotlu gübreyi dengeli verin", "Genç bahçelerde düzenli izleme", "Aşırı sürgün teşvikinden kaçının"],
    biological_measures: ["Doğal düşmanları koruyun (parazitoid arılar)", "Mineral yağ uygulamaları"],
    chemical_measures: ["Abamectin — 25-30 ml/100 L", "Mineral yağ + insektisit (kavanoz testi)"],
    severity_hint: "medium",
    image: img("citrus-leafminer"),
  },
  {
    id: "wheat-rust",
    kind: "disease",
    plant: "Buğday",
    name: "Sarı Pas",
    pathogen: "Puccinia striiformis",
    symptoms: ["Yaprakta sarı çizgiler", "Erken yaşlanma", "Verim kaybı"],
    cultural_measures: ["Dayanıklı çeşit tercih edin", "Erken ekim penceresine dikkat", "Dengeli azot"],
    biological_measures: ["Sertifikalı tohum", "Çeşit rotasyonu"],
    chemical_measures: ["Propikonazol", "Tebuconazole — bayrak yaprak döneminde"],
    severity_hint: "high",
    image: img("wheat-rust"),
  },
  {
    id: "apple-scab",
    kind: "disease",
    plant: "Elma",
    name: "Karaleke",
    pathogen: "Venturia inaequalis",
    symptoms: ["Yaprakta zeytin yeşili lekeler", "Meyvede çatlak siyah lezyonlar"],
    cultural_measures: ["Düşen yaprakları yok edin", "Açık taç yapısı", "Islak süreleri kısaltın"],
    biological_measures: ["Bacillus subtilis programı", "Dayanıklı çeşitler"],
    chemical_measures: ["Captan", "Difenoconazole — çiçek sonrası"],
    severity_hint: "high",
    image: img("apple-scab"),
  },
  {
    id: "pepper-blossom-end-rot",
    kind: "disease",
    plant: "Biber",
    name: "Çiçek Burnu Çürüklüğü",
    pathogen: "Fizyolojik (Ca eksikliği / düzensiz sulama)",
    symptoms: ["Meyve ucunda kahverengi çürüme", "Kalsiyum taşınma bozukluğu"],
    cultural_measures: ["Düzenli sulama", "Aşırı azottan kaçının", "Toprak nemini dengede tutun"],
    biological_measures: ["Toprak organik madde artırımı", "Kök sağlığını destekleyen humik asit"],
    chemical_measures: ["Kalsiyum nitrat yaprak uygulaması — 500 g/100 L"],
    severity_hint: "low",
    image: img("pepper-blossom-end-rot"),
  },
  {
    id: "generic-aphid",
    kind: "pest",
    plant: "Genel",
    name: "Yaprak Biti",
    pathogen: "Aphididae spp.",
    symptoms: ["Yaprak altı koloniler", "Yapışkan ballımsı madde", "Kıvrık sürgünler", "Virus taşıyıcılığı riski"],
    cultural_measures: ["Azot dozunu düşürün", "Yabancı ot temizliği", "Sarı yapışkan tuzak"],
    biological_measures: ["Uğur böceği ve lacewing korunması", "Potasyum sabunu / neem yağı", "Aphidius parazitoidleri"],
    chemical_measures: ["Imidacloprid — 15-20 ml/100 L (etiket)", "Acetamiprid — etiket dozu, rotasyonlu"],
    severity_hint: "medium",
    image: img("generic-aphid"),
  },
  {
    id: "whitefly",
    kind: "pest",
    plant: "Genel",
    name: "Beyazsine",
    pathogen: "Trialeurodes / Bemisia spp.",
    symptoms: ["Yaprak altında beyaz uçuşan erginler", "Ballımsı madde ve fumajin", "Virüs (TYLCV vb.) riski"],
    cultural_measures: ["Sarı yapışkan tuzak", "Sera girişinde önlem perdesi", "Enfekteli fide kullanmayın"],
    biological_measures: ["Encarsia formosa salımı", "Amblyseius predatörleri", "Sabunlu su / yağ uygulamaları"],
    chemical_measures: ["Spiromesifen — etiket dozu", "Pyriproxyfen — juvenil hormon analogu"],
    severity_hint: "high",
    image: img("whitefly"),
  },
  {
    id: "red-spider-mite",
    kind: "pest",
    plant: "Genel",
    name: "Kırmızı Örümcek",
    pathogen: "Tetranychus urticae",
    symptoms: ["Yaprakta bronzlaşma / beneklenme", "İnce ağ dokusu", "Kurak-sıcak havada patlama"],
    cultural_measures: ["Nem artırımı (sera)", "Tozlu yaprakları yıkayın", "Aşırı azottan kaçının"],
    biological_measures: ["Phytoseiulus persimilis salımı", "Amblyseius californicus", "Kükürt (dikkat: predatöre zarar verebilir)"],
    chemical_measures: ["Abamectin — etiket dozu", "Hexythiazox / Etoxazole (yumurta-larva)"],
    severity_hint: "high",
    image: img("red-spider-mite"),
  },
  {
    id: "thrips",
    kind: "pest",
    plant: "Genel",
    name: "Trips",
    pathogen: "Thrips tabaci / Frankliniella",
    symptoms: ["Gümüşi yaprak lekeleri", "Çiçek bozulması", "TSWV virus taşıyıcılığı"],
    cultural_measures: ["Mavi yapışkan tuzak", "Yabancı ot mücadelesi", "Sera perdeleri"],
    biological_measures: ["Orius predatör böcek", "Amblyseius swirskii", "Neem yağı düşük doz"],
    chemical_measures: ["Spinosad — etiket dozu", "Abamectin — rotasyonlu kullanım"],
    severity_hint: "high",
    image: img("thrips"),
  },
  {
    id: "tuta-absoluta",
    kind: "pest",
    plant: "Domates",
    name: "Domates Güvesi (Tuta)",
    pathogen: "Tuta absoluta",
    symptoms: ["Yaprakta geniş galeriler", "Meyvede delikler", "Hızlı popülasyon artışı"],
    cultural_measures: ["Feromon tuzak + izleme", "Hasat artığı imhası", "Sera giriş kontrolü"],
    biological_measures: ["Bacillus thuringiensis (Bt)", "Trichogramma salımı", "Nesidiocoris tenuis (kontrollü)"],
    chemical_measures: ["Chlorantraniliprole — etiket", "Emamectin benzoate — rotasyon"],
    severity_hint: "critical",
    image: img("tuta-absoluta"),
  },
  {
    id: "olive-fruit-fly",
    kind: "pest",
    plant: "Zeytin",
    name: "Zeytin Sineği",
    pathogen: "Bactrocera oleae",
    symptoms: ["Meyvede yumurta batırma deliği", "Larva tüneli", "Yağ kalitesi düşüşü"],
    cultural_measures: ["Erken hasat (riskli yıllarda)", "Yere düşen meyveyi toplayın", "Feromon / McPhail tuzak"],
    biological_measures: ["Mass trapping (kitlesel tuzak)", "Kaolin kil uygulamaları"],
    chemical_measures: ["Spinosad yem+zehir (GF-120 tipi)", "Deltamethrin — etiket ve PHI'ye dikkat"],
    severity_hint: "high",
    image: img("olive-fruit-fly"),
  },
  {
    id: "codling-moth",
    kind: "pest",
    plant: "Elma",
    name: "Elma İçkurdu",
    pathogen: "Cydia pomonella",
    symptoms: ["Meyvede giriş deliği", "İçte tünel ve dışkı", "Erken meyve dökümü"],
    cultural_measures: ["Feromon tuzak izleme", "Karton tuzak bantları", "Dökülen meyveyi imha"],
    biological_measures: ["Granulovirus (CpGV)", "Mating disruption (çiftleşmeyi engelleme)", "Trichogramma"],
    chemical_measures: ["Chlorantraniliprole", "Emamectin — etiket / hasat aralığı"],
    severity_hint: "high",
    image: img("codling-moth"),
  },
  {
    id: "medfly",
    kind: "pest",
    plant: "Turunçgil",
    name: "Akdeniz Meyve Sineği",
    pathogen: "Ceratitis capitata",
    symptoms: ["Meyvede yumurta batırma", "İç çürüme", "Erken döküm"],
    cultural_measures: ["Yere düşen meyveyi toplayın", "Erken hasat", "Tuzak izleme ağı"],
    biological_measures: ["Mass trapping", "Steril böcek tekniği (bölgesel programlar)"],
    chemical_measures: ["Spinosad yem uygulamaları", "Lambda-cyhalothrin — etiket / PHI"],
    severity_hint: "high",
    image: img("medfly"),
  },
  {
    id: "cutworm",
    kind: "pest",
    plant: "Genel",
    name: "Bozkurt / Kesici Kurt",
    pathogen: "Agrotis spp.",
    symptoms: ["Fide boğazından kesme", "Gece zararı", "Toprak yüzeyinde larva"],
    cultural_measures: ["Gece kontrolü", "Yabancı ot temizliği", "Fide yakasına bariyer"],
    biological_measures: ["Bacillus thuringiensis", "Toprak nemi yönetimi", "Kuşları / doğal düşmanları koruyun"],
    chemical_measures: ["Chlorpyrifos-methyl alternatifleri (etiketli ürün)", "Lambda-cyhalothrin — fide döneminde dikkatli"],
    severity_hint: "medium",
    image: img("cutworm"),
  },
  {
    id: "generic-healthy",
    kind: "disease",
    plant: "Genel",
    name: "Sağlıklı",
    pathogen: undefined,
    symptoms: ["Belirgin hastalık / zararlı belirtisi yok"],
    cultural_measures: ["Rutin izleme devam", "Besleme programını sürdürün"],
    biological_measures: ["Yararlı böcek habitatını koruyun"],
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
