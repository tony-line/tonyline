import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI if GEMINI_API_KEY is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

const SYSTEM_INSTRUCTION =
  "You are an expert hospitality negotiator for a restaurant in Thailand serving foreign customers. The owner describes a situation. Write 3 different English replies for the LINE chat app. Rules: warm, sincere, calming; 1–3 short sentences each; simple everyday English because the customer may not be a native speaker; no corporate jargon; do not over-apologize; no defensive excuses; do not promise anything (refunds, discounts, free items) unless the owner mentioned it; acknowledge the customer's feelings first, then move toward the owner's desired ending; the 3 options must differ in approach (gentle apology, solution-focused, warm and friendly); keep emojis to at most one per message and only when it feels natural; never blame the customer. Also provide a natural Thai translation of each message and a short Thai label describing the approach.";

// POST /api/generate-messages
app.post('/api/generate-messages', async (req, res) => {
  const { whatHappened, customerFeels, desiredEnding, tone = 'อ่อนโยน' } = req.body;

  const situation = whatHappened || req.body.situation;
  if (!situation || typeof situation !== 'string' || !situation.trim()) {
    return res.status(400).json({
      success: false,
      error: 'กรุณากรอกว่าเกิดอะไรขึ้นก่อนครับ',
    });
  }

  // If AI client is available, call Gemini API
  if (ai) {
    try {
      const prompt = `
เจ้าของร้านอาหารอธิบายสถานการณ์ลูกค้าดังนี้:
- เกิดอะไรขึ้น: "${situation.trim()}"
${customerFeels ? `- ลูกค้าพูด/รู้สึกอย่างไร: "${customerFeels.trim()}"` : ''}
${desiredEnding ? `- อยากให้จบด้วยอะไร: "${desiredEnding.trim()}"` : ''}
${tone ? `- โทนเสียงที่ต้องการ: "${tone.trim()}"` : ''}

กรุณาวิเคราะห์สถานการณ์และสร้างคำตอบภาษาอังกฤษ 3 แบบที่พร้อมส่งใน LINE ตามกติกาใน system instruction
โดยกำหนด approach ที่แตกต่างกัน 3 แบบ เช่น:
- แบบที่ 1: ขอโทษอย่างอ่อนโยน (Gentle Apology)
- แบบที่ 2: เน้นแก้ปัญหา (Solution-focused)
- แบบที่ 3: อบอุ่นเป็นกันเอง (Warm & Friendly)
พร้อมระบุ label ภาษาไทยสั้นๆ, ข้อความภาษาอังกฤษ 1-3 ประโยค, และคำแปลภาษาไทยที่เป็นธรรมชาติ
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              options: {
                type: Type.ARRAY,
                description: 'Exactly 3 distinct reply options',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: {
                      type: Type.STRING,
                      description: 'Short Thai label for the approach e.g. ขอโทษอย่างอ่อนโยน, เน้นแก้ปัญหา, อบอุ่นเป็นกันเอง',
                    },
                    english: {
                      type: Type.STRING,
                      description: '1 to 3 short sentences in warm, simple English suitable for LINE',
                    },
                    thai: {
                      type: Type.STRING,
                      description: 'Accurate natural Thai translation explaining the message',
                    },
                  },
                  required: ['label', 'english', 'thai'],
                },
              },
            },
            required: ['options'],
          },
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.options && Array.isArray(parsed.options) && parsed.options.length >= 3) {
          const replies = parsed.options.slice(0, 3).map((item: any, index: number) => ({
            id: `reply-${Date.now()}-${index + 1}`,
            optionNumber: index + 1,
            label: item.label || (index === 0 ? 'ขอโทษอย่างอ่อนโยน' : index === 1 ? 'เน้นแก้ปัญหา' : 'อบอุ่นเป็นกันเอง'),
            english: item.english,
            thai: item.thai,
          }));

          return res.json({
            success: true,
            options: replies,
          });
        }
      }
    } catch (aiErr) {
      console.error('Gemini generation error, will use contextual fallback:', aiErr);
    }
  }

  // Fallback response for offline / no key environment
  return res.json({
    success: false,
    error: 'AI_FALLBACK_TRIGGERED',
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Guest Reply Helper server listening on port ${PORT}`);
  });
}

startServer();
