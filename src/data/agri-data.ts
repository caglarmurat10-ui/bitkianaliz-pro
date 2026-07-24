export interface AgriculturalItem {
  id: string;
  name: string;
  category: "GÜBRE" | "İLAÇ" | "DİĞER";
  description: string;
  activeIngredient?: string;
  content?: string;
  dosage?: string;
  /** Gübre: N | P | K | Ca | Mg | mikro | organik | komple */
  nutrientRole?: string;
  /** İlaç: fungisit | insektisit | akarisit | herbisit | bakterisit | yağ | biyolojik */
  pestClass?: string;
  /** Rotasyon grubu (FRAC/IRAC benzeri etiket) */
  rotationGroup?: string;
  /** Önerilen tekrar aralığı (gün) */
  intervalDays?: number;
  stage?: string;
}

export type CompatibilityStatus = "UYGUN" | "RİSKLİ" | "YASAK";

export interface CompatibilityRule {
  item1: string;
  item2: string;
  status: CompatibilityStatus;
  note: string;
}

export const AGRI_ITEMS: AgriculturalItem[] = [
  // ——— GÜBRELER ———
  { id: "g1", name: "Üre (%46 N)", category: "GÜBRE", description: "Yüksek azotlu granül; üst gübreleme.", content: "46-0-0", dosage: "15-25 kg/dekar", nutrientRole: "N", intervalDays: 21, stage: "Vejetatif" },
  { id: "g2", name: "DAP (18-46-0)", category: "GÜBRE", description: "Taban fosfor kaynağı.", content: "18-46-0", dosage: "15-25 kg/dekar", nutrientRole: "P", intervalDays: 60, stage: "Taban" },
  { id: "g3", name: "Amonyum Sülfat", category: "GÜBRE", description: "Şeker gübresi; asit seven bitkiler.", content: "21-0-0 + 24S", dosage: "20-30 kg/dekar", nutrientRole: "N", intervalDays: 21, stage: "Üst" },
  { id: "g4", name: "Kalsiyum Nitrat", category: "GÜBRE", description: "Çiçek burnu / kalsiyum taşınması.", content: "15.5-0-0 + 19Ca", dosage: "100L'ye 400-600 g", nutrientRole: "Ca", intervalDays: 14, stage: "Meyve" },
  { id: "g5", name: "Potasyum Sülfat", category: "GÜBRE", description: "Klor içermeyen potasyum.", content: "0-0-50 + 18S", dosage: "10-20 kg/dekar veya 100L'ye 300 g", nutrientRole: "K", intervalDays: 21, stage: "Meyve" },
  { id: "g6", name: "MKP (0-52-34)", category: "GÜBRE", description: "Çiçek ve kök için P+K.", content: "0-52-34", dosage: "100L'ye 250-300 g", nutrientRole: "P", intervalDays: 14, stage: "Çiçek" },
  { id: "g7", name: "MAP (12-61-0)", category: "GÜBRE", description: "Damla sulamada yüksek fosfor.", content: "12-61-0", dosage: "100L'ye 200-300 g", nutrientRole: "P", intervalDays: 14, stage: "Köklenme" },
  { id: "g8", name: "Potasyum Nitrat (13-0-46)", category: "GÜBRE", description: "Meyve kalitesi ve renk.", content: "13-0-46", dosage: "100L'ye 250-400 g", nutrientRole: "K", intervalDays: 14, stage: "Meyve" },
  { id: "g9", name: "Humik Asit", category: "GÜBRE", description: "Toprak yapısı ve besin alımı.", content: "Humik+Fulvik", dosage: "1-2 L/dekar", nutrientRole: "organik", intervalDays: 30, stage: "Sezon başı" },
  { id: "g10", name: "Çinko Sülfat", category: "GÜBRE", description: "Sürgün ve hormon dengesi.", content: "ZnSO4", dosage: "100L'ye 100-150 g", nutrientRole: "mikro", intervalDays: 30, stage: "Sürgün" },
  { id: "g11", name: "15-15-15 Kompoze", category: "GÜBRE", description: "Dengeli taban/üst gübre.", content: "15-15-15", dosage: "25-40 kg/dekar", nutrientRole: "komple", intervalDays: 30, stage: "Taban" },
  { id: "g12", name: "20-20-20 + Mikro", category: "GÜBRE", description: "Suda eriyen dengeli formül.", content: "20-20-20", dosage: "100L'ye 200-300 g", nutrientRole: "komple", intervalDays: 10, stage: "Vejetatif" },
  { id: "g13", name: "CAN (Kalsiyum Amonyum Nitrat)", category: "GÜBRE", description: "Granül azot + kalsiyum.", content: "26-0-0 + Ca", dosage: "20-30 kg/dekar", nutrientRole: "N", intervalDays: 21, stage: "Üst" },
  { id: "g14", name: "TSP (Triple Süper Fosfat)", category: "GÜBRE", description: "Yüksek fosfor taban.", content: "0-46-0", dosage: "15-25 kg/dekar", nutrientRole: "P", intervalDays: 90, stage: "Taban" },
  { id: "g15", name: "Potasyum Klorür (MOP)", category: "GÜBRE", description: "Ucuz potasyum; klor hassas bitkide dikkat.", content: "0-0-60", dosage: "10-20 kg/dekar", nutrientRole: "K", intervalDays: 30, stage: "Taban" },
  { id: "g16", name: "Magnezyum Sülfat (Epsom)", category: "GÜBRE", description: "Klorofil / yaprak sararması.", content: "MgSO4", dosage: "100L'ye 500 g–1 kg", nutrientRole: "Mg", intervalDays: 21, stage: "Vejetatif" },
  { id: "g17", name: "Demir Şelat (Fe-EDDHA)", category: "GÜBRE", description: "Kloroz; kireçli topraklar.", content: "Fe-EDDHA %6", dosage: "1-3 kg/dekar veya etiket", nutrientRole: "mikro", intervalDays: 30, stage: "Sürgün" },
  { id: "g18", name: "Borik Asit / Bor", category: "GÜBRE", description: "Çiçek tozlaşma ve hücre duvarı.", content: "B", dosage: "100L'ye 50-100 g (dikkat: fitotoksite)", nutrientRole: "mikro", intervalDays: 45, stage: "Çiçek" },
  { id: "g19", name: "Manganez Sülfat", category: "GÜBRE", description: "Fotosentez enzimleri.", content: "MnSO4", dosage: "100L'ye 100-200 g", nutrientRole: "mikro", intervalDays: 30, stage: "Vejetatif" },
  { id: "g20", name: "Bakır Sülfat (gübre doz)", category: "GÜBRE", description: "Mikro element; düşük doz.", content: "CuSO4", dosage: "100L'ye 50-100 g", nutrientRole: "mikro", intervalDays: 45, stage: "Sürgün" },
  { id: "g21", name: "Organik Solucan Gübresi", category: "GÜBRE", description: "Humus ve mikrobiyal canlılık.", content: "Organik", dosage: "50-100 kg/dekar", nutrientRole: "organik", intervalDays: 60, stage: "Taban" },
  { id: "g22", name: "Tavuk Gübresi (yanmış)", category: "GÜBRE", description: "Organik NPK; iyi yanmış olmalı.", content: "Organik NPK", dosage: "1-2 ton/dekar", nutrientRole: "organik", intervalDays: 120, stage: "Taban" },
  { id: "g23", name: "Amino Asit / Deniz Yosunu", category: "GÜBRE", description: "Stres ve büyüme düzenleyici.", content: "Amino+Alg", dosage: "100L'ye 150-300 ml", nutrientRole: "organik", intervalDays: 14, stage: "Stres" },
  { id: "g24", name: "NPK 10-10-40", category: "GÜBRE", description: "Yüksek potasyumlu meyve formülü.", content: "10-10-40", dosage: "100L'ye 250-350 g", nutrientRole: "K", intervalDays: 10, stage: "Meyve" },
  { id: "g25", name: "NPK 30-10-10", category: "GÜBRE", description: "Yüksek azotlu yaprak büyümesi.", content: "30-10-10", dosage: "100L'ye 200-300 g", nutrientRole: "N", intervalDays: 10, stage: "Vejetatif" },
  { id: "g26", name: "Fosforik Asit (pH düşürücü)", category: "GÜBRE", description: "Damla hattı pH ve fosfor.", content: "H3PO4", dosage: "Su analizi + etiket", nutrientRole: "P", intervalDays: 7, stage: "Sulama" },
  { id: "g27", name: "Nitrik Asit (pH)", category: "GÜBRE", description: "Sulama suyu pH ayarı + azot.", content: "HNO3", dosage: "Su analizi + etiket", nutrientRole: "N", intervalDays: 7, stage: "Sulama" },
  { id: "g28", name: "Potasyum Humat", category: "GÜBRE", description: "Kök gelişimi ve şelat etkisi.", content: "K-Humat", dosage: "1-2 kg/dekar", nutrientRole: "organik", intervalDays: 30, stage: "Köklenme" },
  { id: "g29", name: "Kalsiyum Klorür (yaprak)", category: "GÜBRE", description: "Meyve sertliği (dikkatli doz).", content: "CaCl2", dosage: "100L'ye 300-500 g", nutrientRole: "Ca", intervalDays: 14, stage: "Meyve" },
  { id: "g30", name: "Kompoze 12-30-12", category: "GÜBRE", description: "Yüksek fosforlu dikim gübresi.", content: "12-30-12", dosage: "20-30 kg/dekar", nutrientRole: "P", intervalDays: 60, stage: "Dikim" },

  // ——— İLAÇLAR ———
  { id: "i1", name: "Bakır Sülfat (Göztaşı)", category: "İLAÇ", description: "Mantar ve bakteriyel hastalıklar.", activeIngredient: "Bakır", dosage: "%1 Bordo / etiket", pestClass: "fungisit", rotationGroup: "M01", intervalDays: 14, stage: "Koruyucu" },
  { id: "i2", name: "Kükürt (Toz/Sıvı)", category: "İLAÇ", description: "Külleme ve akar.", activeIngredient: "Kükürt", dosage: "100L'ye 300-500 ml", pestClass: "fungisit", rotationGroup: "M02", intervalDays: 10, stage: "Külleme" },
  { id: "i3", name: "Abamectin", category: "İLAÇ", description: "Kırmızı örümcek / yaprak galerigüvesi.", activeIngredient: "Abamectin", dosage: "100L'ye 25-40 ml", pestClass: "akarisit", rotationGroup: "6", intervalDays: 14, stage: "Akar" },
  { id: "i4", name: "Imidacloprid", category: "İLAÇ", description: "Sistemik emici böcek.", activeIngredient: "Imidacloprid", dosage: "100L'ye 15-25 ml", pestClass: "insektisit", rotationGroup: "4A", intervalDays: 21, stage: "Yaprak biti" },
  { id: "i5", name: "Kalsiyum Polisülfat", category: "İLAÇ", description: "Kış mücadelesi / kabuklu bit.", activeIngredient: "Kalsiyum Polisülfat", dosage: "100L'ye 1-2 L", pestClass: "yağ", rotationGroup: "UN", intervalDays: 45, stage: "Kış" },
  { id: "i6", name: "Mancozeb 80 WP", category: "İLAÇ", description: "Geniş spektrum kontakt fungisit.", activeIngredient: "Mancozeb", dosage: "100L'ye 200 g", pestClass: "fungisit", rotationGroup: "M03", intervalDays: 10, stage: "Mildiyö" },
  { id: "i7", name: "Azoksistrobin", category: "İLAÇ", description: "Strobilurin sistemik fungisit.", activeIngredient: "Azoksistrobin", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "11", intervalDays: 14, stage: "Mildiyö" },
  { id: "i8", name: "Tebuconazole", category: "İLAÇ", description: "Triazol; külleme ve pas.", activeIngredient: "Tebuconazole", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "3", intervalDays: 14, stage: "Külleme" },
  { id: "i9", name: "Lambda-cyhalothrin", category: "İLAÇ", description: "Piretroid; çiğneyici zararlılar.", activeIngredient: "Lambda-cyhalothrin", dosage: "100L'ye 20-30 ml", pestClass: "insektisit", rotationGroup: "3A", intervalDays: 14, stage: "Larva" },
  { id: "i10", name: "Yazlık Mineral Yağ", category: "İLAÇ", description: "Kabuklu bit ve kışlayan zararlı.", activeIngredient: "Mineral Yağ", dosage: "%1-1.5", pestClass: "yağ", rotationGroup: "UN", intervalDays: 21, stage: "Kış/İlkbahar" },
  { id: "i11", name: "Bacillus thuringiensis (Bt)", category: "İLAÇ", description: "Biyolojik tırtıl mücadelesi.", activeIngredient: "Bt", dosage: "Etiket dozu", pestClass: "biyolojik", rotationGroup: "11A", intervalDays: 7, stage: "Tırtıl" },
  { id: "i12", name: "Metalaksil + Mancozeb", category: "İLAÇ", description: "Geç mildiyö kombinasyonu.", activeIngredient: "Metalaksil", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "4", intervalDays: 10, stage: "Mildiyö" },
  { id: "i13", name: "Difenoconazole", category: "İLAÇ", description: "Karaleke / yaprak lekeleri.", activeIngredient: "Difenoconazole", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "3", intervalDays: 14, stage: "Karaleke" },
  { id: "i14", name: "Propikonazol", category: "İLAÇ", description: "Pas ve yaprak hastalıkları.", activeIngredient: "Propikonazol", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "3", intervalDays: 14, stage: "Pas" },
  { id: "i15", name: "Chlorothalonil", category: "İLAÇ", description: "Kontakt geniş spektrum.", activeIngredient: "Chlorothalonil", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "M05", intervalDays: 10, stage: "Koruyucu" },
  { id: "i16", name: "Captan", category: "İLAÇ", description: "Elma karaleke vb.", activeIngredient: "Captan", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "M04", intervalDays: 10, stage: "Karaleke" },
  { id: "i17", name: "Fosetyl-Al", category: "İLAÇ", description: "Sistemik mildiyö / kök çürüklüğü.", activeIngredient: "Fosetyl-Al", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "33", intervalDays: 14, stage: "Kök" },
  { id: "i18", name: "Acetamiprid", category: "İLAÇ", description: "Yaprak biti / beyazsine.", activeIngredient: "Acetamiprid", dosage: "Etiket dozu", pestClass: "insektisit", rotationGroup: "4A", intervalDays: 14, stage: "Emici" },
  { id: "i19", name: "Thiamethoxam", category: "İLAÇ", description: "Sistemik neonikotinoid.", activeIngredient: "Thiamethoxam", dosage: "Etiket dozu", pestClass: "insektisit", rotationGroup: "4A", intervalDays: 21, stage: "Emici" },
  { id: "i20", name: "Spinosad", category: "İLAÇ", description: "Tırtıl ve thrips.", activeIngredient: "Spinosad", dosage: "Etiket dozu", pestClass: "insektisit", rotationGroup: "5", intervalDays: 10, stage: "Thrips" },
  { id: "i21", name: "Emamectin benzoate", category: "İLAÇ", description: "Yeşil kurt / tırtıllar.", activeIngredient: "Emamectin", dosage: "Etiket dozu", pestClass: "insektisit", rotationGroup: "6", intervalDays: 14, stage: "Tırtıl" },
  { id: "i22", name: "Indoxacarb", category: "İLAÇ", description: "Çiğneyici larvalar.", activeIngredient: "Indoxacarb", dosage: "Etiket dozu", pestClass: "insektisit", rotationGroup: "22A", intervalDays: 14, stage: "Larva" },
  { id: "i23", name: "Bifenazate", category: "İLAÇ", description: "Akar; seçici.", activeIngredient: "Bifenazate", dosage: "Etiket dozu", pestClass: "akarisit", rotationGroup: "20D", intervalDays: 14, stage: "Akar" },
  { id: "i24", name: "Hexythiazox", category: "İLAÇ", description: "Akar yumurta/larva.", activeIngredient: "Hexythiazox", dosage: "Etiket dozu", pestClass: "akarisit", rotationGroup: "10A", intervalDays: 21, stage: "Akar" },
  { id: "i25", name: "Spiromesifen", category: "İLAÇ", description: "Beyazsine ve akar.", activeIngredient: "Spiromesifen", dosage: "Etiket dozu", pestClass: "insektisit", rotationGroup: "23", intervalDays: 14, stage: "Beyazsine" },
  { id: "i26", name: "Glyphosate", category: "İLAÇ", description: "Yabancı ot (sıra arası dikkat).", activeIngredient: "Glyphosate", dosage: "Etiket dozu", pestClass: "herbisit", rotationGroup: "9", intervalDays: 30, stage: "Yabancı ot" },
  { id: "i27", name: "Pendimethalin", category: "İLAÇ", description: "Çıkış öncesi herbisit.", activeIngredient: "Pendimethalin", dosage: "Etiket dozu", pestClass: "herbisit", rotationGroup: "3", intervalDays: 60, stage: "Yabancı ot" },
  { id: "i28", name: "Dodine", category: "İLAÇ", description: "Zeytin halkalı leke.", activeIngredient: "Dodine", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "U12", intervalDays: 21, stage: "Halkalı leke" },
  { id: "i29", name: "Bakır Oksiklorür", category: "İLAÇ", description: "Koruyucu bakırlı fungisit.", activeIngredient: "Bakır Oksiklorür", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "M01", intervalDays: 14, stage: "Koruyucu" },
  { id: "i30", name: "Potasyum Sabunu", category: "İLAÇ", description: "Yumuşak vücutlu zararlılar.", activeIngredient: "Yağ asidi tuzları", dosage: "Etiket / %1-2", pestClass: "insektisit", rotationGroup: "UN", intervalDays: 7, stage: "Yaprak biti" },
  { id: "i31", name: "Neem (Azadirachtin)", category: "İLAÇ", description: "Botanik insektisit/akarisit.", activeIngredient: "Azadirachtin", dosage: "Etiket dozu", pestClass: "biyolojik", rotationGroup: "UN", intervalDays: 7, stage: "Genel" },
  { id: "i32", name: "Cymoxanil + Mancozeb", category: "İLAÇ", description: "Mildiyö lokal sistemik.", activeIngredient: "Cymoxanil", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "27", intervalDays: 10, stage: "Mildiyö" },
  { id: "i33", name: "Boscalid + Pyraclostrobin", category: "İLAÇ", description: "Külleme ve botrytis.", activeIngredient: "Boscalid", dosage: "Etiket dozu", pestClass: "fungisit", rotationGroup: "7+11", intervalDays: 14, stage: "Botrytis" },
  { id: "i34", name: "Chlorantraniliprole", category: "İLAÇ", description: "Tırtıl; diamid grubu.", activeIngredient: "Chlorantraniliprole", dosage: "Etiket dozu", pestClass: "insektisit", rotationGroup: "28", intervalDays: 14, stage: "Tırtıl" },
  { id: "i35", name: "Flonicamid", category: "İLAÇ", description: "Yaprak biti; seçici.", activeIngredient: "Flonicamid", dosage: "Etiket dozu", pestClass: "insektisit", rotationGroup: "29", intervalDays: 14, stage: "Yaprak biti" },
];

export const COMPATIBILITY_RULES: CompatibilityRule[] = [
  { item1: "g4", item2: "g5", status: "YASAK", note: "Kalsiyum nitrat + sülfat → jips çökmesi." },
  { item1: "g4", item2: "g2", status: "RİSKLİ", note: "Ca + yüksek P çökme riski." },
  { item1: "g4", item2: "g3", status: "YASAK", note: "Ca nitrat + amonyum sülfat çöker." },
  { item1: "g4", item2: "g10", status: "RİSKLİ", note: "Ca + sülfatlı mikro riskli." },
  { item1: "g4", item2: "g16", status: "YASAK", note: "Ca nitrat + Mg sülfat çökme." },
  { item1: "g29", item2: "g5", status: "RİSKLİ", note: "CaCl2 ile sülfatlı karışımda dikkat." },
  { item1: "i1", item2: "i4", status: "RİSKLİ", note: "Bakır + organik insektisit riski." },
  { item1: "i5", item2: "i1", status: "YASAK", note: "Polisülfat + bakır yasak." },
  { item1: "i2", item2: "i10", status: "RİSKLİ", note: "Kükürt ile yağ arasında 2-3 hafta." },
  { item1: "i6", item2: "i7", status: "UYGUN", note: "Kontakt + strobilurin yaygın; kavanoz testi yapın." },
  { item1: "i3", item2: "i9", status: "RİSKLİ", note: "Rotasyon önerilir; aynı sezonda aşırı birleştirmeyin." },
  { item1: "g1", item2: "i1", status: "RİSKLİ", note: "Üre + bakır fitotoksite riski." },
  { item1: "i7", item2: "i33", status: "RİSKLİ", note: "Aynı QoI (grup 11) üst üste direnç riski." },
  { item1: "i8", item2: "i13", status: "RİSKLİ", note: "Aynı DMI (grup 3) üst üste kullanmayın." },
  { item1: "i4", item2: "i18", status: "RİSKLİ", note: "Aynı neonikotinoid grubu (4A) rotasyon yapın." },
  { item1: "g2", item2: "g4", status: "RİSKLİ", note: "MAP/DAP + Ca nitrat tankta çökme riski." },
  { item1: "g7", item2: "i1", status: "RİSKLİ", note: "Demir şelat + bakır birlikte fitotoksite riski." },
  { item1: "g8", item2: "i5", status: "YASAK", note: "Yağ bazlı / kükürt ürünlerle fosforik asit karıştırmayın." },
  { item1: "i10", item2: "i2", status: "RİSKLİ", note: "Yağ + kükürt arasında bekleme süresi şart." },
  { item1: "g11", item2: "g4", status: "RİSKLİ", note: "Humik asit + Ca nitrat flokülasyon riski." },
  { item1: "i12", item2: "i1", status: "RİSKLİ", note: "Fosetil-Al + bakır ürünleri ayrı uygulayın." },
];

export function checkCompatibility(id1: string, id2: string): { status: CompatibilityStatus; note: string } {
  const rule = COMPATIBILITY_RULES.find(
    (r) => (r.item1 === id1 && r.item2 === id2) || (r.item1 === id2 && r.item2 === id1)
  );
  if (rule) return { status: rule.status, note: rule.note };

  const item1 = AGRI_ITEMS.find((i) => i.id === id1);
  const item2 = AGRI_ITEMS.find((i) => i.id === id2);

  if (item1?.category === "GÜBRE" && item2?.category === "İLAÇ") {
    return { status: "RİSKLİ", note: "Gübre + ilaç karışımında kavanoz testi yapın." };
  }
  if (item1?.rotationGroup && item2?.rotationGroup && item1.rotationGroup === item2.rotationGroup) {
    return { status: "RİSKLİ", note: `Aynı rotasyon grubu (${item1.rotationGroup}); direnç riski.` };
  }

  return { status: "UYGUN", note: "Bilinen uyumsuzluk yok. Ön karışım testi önerilir." };
}

export type TankMixResult = {
  status: CompatibilityStatus;
  note: string;
  pairs: Array<{ a: string; b: string; status: CompatibilityStatus; note: string }>;
};

/** 2+ ürün tank karışımı: en kötü sonucu döner */
export function checkTankMix(ids: string[]): TankMixResult {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length < 2) {
    return { status: "UYGUN", note: "En az iki ürün seçin.", pairs: [] };
  }

  const pairs: TankMixResult["pairs"] = [];
  let worst: CompatibilityStatus = "UYGUN";
  const rank = { UYGUN: 0, RİSKLİ: 1, YASAK: 2 };

  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      const res = checkCompatibility(unique[i], unique[j]);
      const a = AGRI_ITEMS.find((x) => x.id === unique[i])?.name || unique[i];
      const b = AGRI_ITEMS.find((x) => x.id === unique[j])?.name || unique[j];
      pairs.push({ a, b, status: res.status, note: res.note });
      if (rank[res.status] > rank[worst]) worst = res.status;
    }
  }

  const note =
    worst === "YASAK"
      ? "Tankta yasak kombinasyon var — karıştırmayın."
      : worst === "RİSKLİ"
        ? "Riskli çiftler var — kavanoz testi ve ayrı uygulama önerilir."
        : "Seçilen ürünler bilinen kurallara göre uyumlu görünüyor.";

  return { status: worst, note, pairs };
}

export function fertilizers() {
  return AGRI_ITEMS.filter((i) => i.category === "GÜBRE");
}

export function pesticides() {
  return AGRI_ITEMS.filter((i) => i.category === "İLAÇ");
}

export function getItemById(id: string) {
  return AGRI_ITEMS.find((i) => i.id === id);
}
