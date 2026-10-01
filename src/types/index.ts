export type ToneType = 'อ่อนโยน' | 'เป็นกันเอง' | 'สุภาพทางการ';

export interface ReplyOption {
  id: string;
  optionNumber: number;
  label: string;
  english: string;
  thai: string;
}

export interface SituationInput {
  whatHappened: string;
  customerFeels: string;
  desiredEnding: string;
  tone: ToneType;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  whatHappened: string;
  customerFeels: string;
  desiredEnding: string;
  tone: ToneType;
  options: ReplyOption[];
}

export const WHAT_HAPPENED_CHIPS = [
  'ออเดอร์ช้า',
  'อาหารผิดเมนู',
  'อาหารหมด',
  'คิดเงินผิด',
  'ของหายในร้าน',
  'ลูกค้าไม่พอใจรสชาติ',
  'จองโต๊ะมีปัญหา',
];

export const CUSTOMER_FEELS_CHIPS = [
  'โกรธ',
  'หงุดหงิด',
  'ผิดหวัง',
  'สุภาพแต่ไม่พอใจ',
  'ขอเงินคืน',
];

export const DESIRED_ENDING_CHIPS = [
  'ให้อภัยและกลับมาอีก',
  'ขอโทษและแก้ไขให้',
  'เสนอของแถม/ส่วนลด',
  'อธิบายเหตุผลอย่างสุภาพ',
  'ปฏิเสธอย่างนุ่มนวล',
];

export const TONE_OPTIONS: { label: ToneType; desc: string }[] = [
  { label: 'อ่อนโยน', desc: 'Gentle & Calming' },
  { label: 'เป็นกันเอง', desc: 'Warm & Friendly' },
  { label: 'สุภาพทางการ', desc: 'Polite & Professional' },
];
