import { GoogleGenAI } from "@google/genai";
import { EvaluationResult } from "../types";

const SYSTEM_PROMPT = `
Rol: Sen, “IGL-TEF Tez Değerlendirme Sistemi” için kural motoru + rapor üretici olarak çalışan bir yazılım mimarı ve ürün geliştiricisin.
Halüsinasyon yapma: yalnızca verilen kurallara ve metinden çıkarılabilen kanıtlara dayan. Varsayım gerekiyorsa “BİLGİ” ile işaretle, HATA üretme.

0) Ürün hedefi
Tez dosyasını parse et -> IGL-TEF kural motoruyla değerlendir -> JSON üret.

1) Kural Statüleri
- UYGUN (pass)
- UYARI (minor issue)
- HATA (fail)
- N/A (uygulanamaz: çalışmanın niteliği gereği kural bu tez için geçersiz)
- BİLGİ (tezde beyan bulunmuyor ama “zorunlu değil”)

Önemli: Zorunlu olmayan hiçbir madde “HATA” olmamalı.

2) Tier Bazlı Karar Mantığı
- Tier I (Zorunlu): Özetler, İçindekiler, Sayfa Numaralama. Eksikse -> İDARİ_RED.
- Tier II: Etik, Benzerlik, AI, Çıkar Çatışması. Genelde BEYAN/KOŞULLU (N/A veya BİLGİ).
- Tier III: Akademik Rubrik (Yöntem, Tartışma vb.).

3) Skorlama Formülü (KESİN)
- UygulanabilirKuralSayisi = ToplamKural - N/A - BİLGİ
- BaşarıPuanı = (UYGUN * 1.0 + UYARI * 0.5)
- BaşarıOranı(%) = (BaşarıPuanı / UygulanabilirKuralSayisi) * 100
- HataOranı(%) = (HATA / UygulanabilirKuralSayisi) * 100
- score.note: “Toplam X kuralın Y’si N/A, Z’si BİLGİ olduğu için değerlendirme dışı bırakıldı. Kalan K uygulanabilir kuralda: A UYGUN, B UYARI, C HATA.”

4) 22 Maddelik Rule Engine (MUTLAKA HEPSİ findingsTable'da OLMALI)
T1: Türkçe Özet, İngilizce Özet, İçindekiler Tablosu, Sayfa numaralama standardı, Ekler.
T2: Etik kurul belgesi, İntihal / benzerlik beyanı, Çıkar çatışması beyanı, Generative AI beyanı.
T3: Literatür sentezi, Teorik boşluk tanımı, Yöntem-amaç uyumu, Yöntem gerekçesi, Örneklem büyüklüğü raporu, N<30 için gerekçe, APA p-değeri raporlama, İstatistik kısaltmaları, Tartışma bölümü, Sonuç-amaç uyumu, Sınırlılıklar, Akademik dil ve üslup, Kaynakça tutarlılığı.

5) Rapor Metni (reportTxt)
UTF-8 uyumlu, UI'da gösterilen tüm detayları içeren profesyonel bir TXT raporu.
`;

const JSON_SCHEMA = `
{
  "meta": { "candidateName": "string", "fileName": "string", "evaluatedAt": "YYYY-MM-DD", "version": "IGL-TEF v1" },
  "decision": { "overall": "İDARİ_RED | GEÇTİ | DÜZELTME_GEREKİR | RED", "risk": "DÜŞÜK | ORTA | YÜKSEK", "summaryText": "string" },
  "counts": {
    "totalRules": 22,
    "applicable": number,
    "countsByStatus": { "UYGUN": number, "UYARI": number, "HATA": number, "N_A": number, "BILGI": number },
    "score": { "points": number, "maxPoints": number, "successRate": number, "errorRate": number },
    "note": "string"
  },
  "tiers": [
    { "tier": "TIER I", "status": "string", "summary": "string", "findings": [] }
  ],
  "findingsTable": [
    { "tier": "TIER 1", "ruleId": "string", "ruleName": "string", "status": "UYGUN | UYARI | HATA | N/A | BİLGİ", "note": "string", "evidence": "string" }
  ],
  "reportTxt": "string"
}
`;

export const analyzeThesis = async (file: File, candidateName: string): Promise<EvaluationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const base64Data = await fileToBase64(file);
  const mimeType = file.type;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nAday: ${candidateName}\nDosya: ${file.name}\n\nLütfen JSON Şemasına %100 uyarak yanıt ver. allFindingsFlat yerine findingsTable kullan:\n${JSON_SCHEMA}`
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("Boş yanıt alındı.");
    
    return JSON.parse(textResponse) as EvaluationResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
