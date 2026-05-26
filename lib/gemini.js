import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-1.5-flash';

if (!apiKey) {
  throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `Anda adalah AI Spesialis Analisis Kulit untuk platform "SobatKulit". Tugas Anda adalah menganalisis foto kondisi kulit yang dikombinasikan dengan data kuesioner keluhan subjektif pengguna (lokasi tubuh, gejala, dan deskripsi).

Patuhi aturan klasifikasi klinis berikut:
1. Jika gejala atau gambar mengarah pada infeksi bakteri akut parah, penyebaran cepat, atau kerusakan jaringan luas (Contoh: Selulitis, Fasciitis Nekrotikans, Luka Bakar Derajat Tinggi, Infeksi Sistemik), set properti "is_emergency" menjadi true.
2. Jika kondisi berupa penyakit kulit umum yang tidak mengancam jiwa (Contoh: Eksim, Jerawat, Panu, Dermatitis Kontak, Psoriasis), set properti "is_emergency" menjadi false.

Kembalikan hasil analisis dalam struktur JSON dengan key berikut:
- "condition_name": (string) Nama penyakit/kondisi kulit dalam Bahasa Indonesia (sertakan nama medis di dalam kurung).
- "confidence_score": (integer) Angka persentase keyakinan Anda antara 0 hingga 100.
- "causes": (string) Faktor penyebab utama kondisi tersebut muncul.
- "handling_tips": (array of strings) Minimal 3 tips atau langkah pertolongan pertama yang aman dilakukan di rumah.
- "is_emergency": (boolean) true jika termasuk infeksi akut berbahaya, false jika kondisi normal.
- "medical_disclaimer": (string) Kalimat pengingat bahwa ini adalah penapisan awal AI dan bukan diagnosis pengganti dokter spesialis kulit.

KELUARAN WAJIB HANYA BERUPA VALID JSON. Jangan berikan teks pembuka atau penutup. Jangan gunakan markdown block.`;

/**
 * Analyze a skin condition using Gemini multimodal AI
 * @param {string} imageBase64 - Base64 encoded image data
 * @param {string} mimeType - Image MIME type (image/jpeg, image/png)
 * @param {object} questionnaire - { bodyLocation, symptoms[], description }
 * @returns {Promise<object>} Parsed JSON analysis result
 */
export async function analyzeSkinCondition(imageBase64, mimeType, questionnaire) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const questionnaireText = `
Data Kuesioner Pasien:
- Lokasi Tubuh: ${questionnaire.bodyLocation || 'Tidak disebutkan'}
- Gejala: ${questionnaire.symptoms?.length > 0 ? questionnaire.symptoms.join(', ') : 'Tidak disebutkan'}
- Deskripsi Keluhan: ${questionnaire.description || 'Tidak ada deskripsi tambahan'}
  `.trim();

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    },
    { text: questionnaireText },
  ]);

  const responseText = result.response.text();

  // Clean response: remove markdown code blocks if present
  let cleanJson = responseText.trim();
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }

  try {
    const parsed = JSON.parse(cleanJson);

    // Validate required fields
    if (typeof parsed.condition_name !== 'string') throw new Error('Missing condition_name');
    if (typeof parsed.confidence_score !== 'number') throw new Error('Missing confidence_score');
    if (typeof parsed.causes !== 'string') throw new Error('Missing causes');
    if (!Array.isArray(parsed.handling_tips)) throw new Error('Missing handling_tips');
    if (typeof parsed.is_emergency !== 'boolean') throw new Error('Missing is_emergency');
    if (typeof parsed.medical_disclaimer !== 'string') throw new Error('Missing medical_disclaimer');

    return parsed;
  } catch (parseError) {
    console.error('Failed to parse Gemini response:', responseText);
    throw new Error(`AI response parsing failed: ${parseError.message}`);
  }
}

/**
 * Compare two scan results for skin tracker progression
 * @param {string} oldImageBase64 - Base64 of older scan image
 * @param {string} newImageBase64 - Base64 of newer scan image
 * @param {string} mimeType - Image MIME type
 * @param {object} oldScan - Previous scan data
 * @param {object} newQuestionnaire - New questionnaire data
 * @returns {Promise<object>} Progression analysis
 */
export async function analyzeProgression(oldImageBase64, newImageBase64, mimeType, oldScan, newQuestionnaire) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: `Anda adalah AI Spesialis Analisis Kulit untuk platform "SobatKulit". Tugas Anda adalah membandingkan dua foto kondisi kulit yang diambil pada waktu berbeda dan menentukan apakah kondisi MEMBAIK, MEMBURUK, atau STABIL.

Kembalikan hasil analisis dalam struktur JSON dengan key berikut:
- "progression_status": (string) Salah satu dari "MEMBAIK", "MEMBURUK", atau "STABIL"
- "condition_name": (string) Nama penyakit/kondisi kulit terkini dalam Bahasa Indonesia (sertakan nama medis di dalam kurung).
- "confidence_score": (integer) Angka persentase keyakinan Anda antara 0 hingga 100.
- "causes": (string) Faktor penyebab utama kondisi tersebut.
- "handling_tips": (array of strings) Minimal 3 saran lanjutan kontekstual berdasarkan perbandingan kedua kondisi.
- "is_emergency": (boolean) true jika kondisi terbaru menunjukkan infeksi akut berbahaya, false jika tidak.
- "analysis_summary": (string) Rangkuman perbandingan visual antara kedua foto.
- "medical_disclaimer": (string) Kalimat pengingat bahwa ini adalah penapisan awal AI dan bukan diagnosis pengganti dokter spesialis kulit.

KELUARAN WAJIB HANYA BERUPA VALID JSON. Jangan berikan teks pembuka atau penutup. Jangan gunakan markdown block.`,
  });

  const comparisonText = `
Perbandingan Kondisi Kulit:

DATA PEMINDAIAN SEBELUMNYA:
- Kondisi: ${oldScan.condition_name}
- Skor Keyakinan: ${oldScan.confidence_score}%
- Lokasi Tubuh: ${oldScan.body_location || 'Tidak disebutkan'}
- Gejala Sebelumnya: ${oldScan.symptoms?.join(', ') || 'Tidak disebutkan'}

DATA KUESIONER TERBARU:
- Lokasi Tubuh: ${newQuestionnaire.bodyLocation || 'Tidak disebutkan'}
- Gejala Saat Ini: ${newQuestionnaire.symptoms?.length > 0 ? newQuestionnaire.symptoms.join(', ') : 'Tidak disebutkan'}
- Deskripsi Keluhan: ${newQuestionnaire.description || 'Tidak ada deskripsi tambahan'}

Foto pertama (sebelumnya) dan foto kedua (terbaru) disertakan. Bandingkan keduanya.
  `.trim();

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType,
        data: oldImageBase64,
      },
    },
    {
      inlineData: {
        mimeType: mimeType,
        data: newImageBase64,
      },
    },
    { text: comparisonText },
  ]);

  const responseText = result.response.text();

  let cleanJson = responseText.trim();
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }

  try {
    return JSON.parse(cleanJson);
  } catch (parseError) {
    console.error('Failed to parse Gemini progression response:', responseText);
    throw new Error(`AI response parsing failed: ${parseError.message}`);
  }
}
