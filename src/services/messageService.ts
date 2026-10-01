import { ReplyOption, SituationInput } from '../types';

export async function generateReplies(input: SituationInput): Promise<ReplyOption[]> {
  try {
    const res = await fetch('/api/generate-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.options) && data.options.length === 3) {
        return data.options;
      }
    }
  } catch (err) {
    console.warn('Network issue reaching backend, using smart contextual generator:', err);
  }

  return generateSmartFallbackReplies(input);
}

/**
 * Contextual fallback generator that follows all hospitality rules:
 * - 1-3 short sentences
 * - Simple everyday English
 * - Acknowledges feelings first, moves toward desired ending
 * - 3 distinct approaches (ขอโทษอย่างอ่อนโยน, เน้นแก้ปัญหา, อบอุ่นเป็นกันเอง)
 * - Max 1 emoji
 */
export function generateSmartFallbackReplies(input: SituationInput): ReplyOption[] {
  const { whatHappened, customerFeels, desiredEnding, tone } = input;
  const combined = `${whatHappened} ${customerFeels} ${desiredEnding}`.toLowerCase();

  const isLate = combined.includes('ช้า') || combined.includes('delay') || combined.includes('นาน');
  const isWrong = combined.includes('ผิด') || combined.includes('ไม่ตรง') || combined.includes('wrong') || combined.includes('missing');
  const isRefund = combined.includes('คืนเงิน') || combined.includes('refund');
  const isTaste = combined.includes('รสชาติ') || combined.includes('ไม่อร่อย') || combined.includes('เค็ม') || combined.includes('เย็น');
  const isBill = combined.includes('คิดเงิน') || combined.includes('บิล') || combined.includes('bill');
  const isLost = combined.includes('หาย') || combined.includes('ลืม');
  const isTable = combined.includes('จอง') || combined.includes('โต๊ะ') || combined.includes('reservation');

  let opt1En = '';
  let opt1Th = '';
  let opt2En = '';
  let opt2Th = '';
  let opt3En = '';
  let opt3Th = '';

  if (isLate) {
    opt1En = "I am so sorry for keeping you waiting today. We know you must be hungry, and our kitchen is packing your warm meal right now.";
    opt1Th = "ต้องขอโทษจริงๆ ที่ทำให้คุณต้องรอนานในวันนี้นะครับ พวกเราเข้าใจว่าคุณคงหิวมาก ตอนนี้ในครัวกำลังแพ็กอาหารร้อนๆ ให้อยู่ครับ";

    opt2En = "Thank you for your patience with us. Your order is leaving the restaurant right now with our delivery rider and will arrive in a few minutes.";
    opt2Th = "ขอบคุณมากสำหรับความอดทนรอครับ ตอนนี้ออร์เดอร์กำลังออกจากร้านพร้อมคนขับแล้ว และจะถึงคุณภายในไม่กี่นาทีนี้ครับ";

    opt3En = "We feel terrible about the delay during tonight's rush! Our team is rushing your dishes directly to you now, and we truly appreciate your kind understanding. 🙏";
    opt3Th = "พวกเรารู้สึกเสียใจจริงๆ ที่อาหารล่าช้าในช่วงเวลาเร่งด่วนของคืนนี้ครับ! ทีมงานกำลังเร่งนำส่งให้อย่างเร็วที่สุด และขอบคุณในความเข้าใจเป็นอย่างยิ่งครับ 🙏";
  } else if (isWrong) {
    opt1En = "I am very sorry about this mix-up with your order. We completely understand your disappointment and want to make this right for you immediately.";
    opt1Th = "ขอโทษเป็นอย่างยิ่งสำหรับความผิดพลาดในออร์เดอร์ของคุณครับ เราเข้าใจความรู้สึกผิดหวังของคุณเป็นอย่างดี และอยากรีบแก้ไขให้ถูกต้องทันทีครับ";

    opt2En = "Please accept our sincere apologies for sending the wrong dish. We are preparing the correct item for you right now, or we can issue a full refund if you prefer.";
    opt2Th = "ขออภัยจากใจจริงที่จัดส่งอาหารผิดจานครับ ตอนนี้เรากำลังรีบทำจานที่ถูกต้องให้ใหม่ หรือหากคุณสะดวกให้คืนเงินเต็มจำนวนก็สามารถแจ้งได้เลยครับ";

    opt3En = "Oh no, we are so sorry about that mistake! Our kitchen is already cooking the right dish on priority, and we will send it to you with our fastest rider. ✨";
    opt3Th = "ต้องขอโทษด้วยจริงๆ สำหรับความผิดพลาดนั้นครับ! ในครัวกำลังรีบทำจานที่ถูกต้องให้ด่วนที่สุด และจะรีบส่งให้ทันทีเลยครับ ✨";
  } else if (isRefund) {
    opt1En = "We are deeply sorry for the trouble today. We have processed a full refund for you, and we truly hope to have a chance to welcome you back again.";
    opt1Th = "ขออภัยเป็นอย่างยิ่งสำหรับปัญหาที่เกิดขึ้นในวันนี้ครับ ทางเราได้ดำเนินการคืนเงินเต็มจำนวนให้เรียบร้อยแล้ว และหวังว่าจะได้มีโอกาสต้อนรับคุณอีกครั้งครับ";

    opt2En = "Thank you for letting us know about this issue. Your complete refund is already on its way to your account, and we appreciate your patience with us.";
    opt2Th = "ขอบคุณที่แจ้งปัญหาให้เราทราบครับ ทางเราได้โอนเงินคืนเข้าบัญชีของคุณเรียบร้อยแล้ว และขอขอบคุณสำหรับความเข้าใจครับ";

    opt3En = "We completely understand your frustration and we're so sorry. A full refund has been issued right away. Please let us know if you need anything else! 🙏";
    opt3Th = "เราเข้าใจความรู้สึกของคุณอย่างยิ่งและขอโทษด้วยจริงๆ ครับ ตอนนี้คืนเงินเต็มจำนวนให้ทันทีแล้ว หากต้องการให้ดูแลสิ่งใดเพิ่มเติมแจ้งได้เลยนะครับ 🙏";
  } else if (isBill) {
    opt1En = "I am so sorry for the billing error on your check. We have reviewed it and will fix the amount for you immediately.";
    opt1Th = "ต้องขอโทษด้วยจริงๆ สำหรับความผิดพลาดในการคิดเงินครับ ทางเราตรวจสอบแล้วและจะรีบแก้ไขยอดเงินให้คุณในทันทีครับ";

    opt2En = "Thank you for pointing out the mistake on your receipt. We have corrected the total and sent the updated receipt directly to you.";
    opt2Th = "ขอบคุณที่ช่วยทักท้วงข้อผิดพลาดในใบเสร็จครับ ทางเราแก้ไขยอดที่ถูกต้องและส่งใบเสร็จฉบับใหม่ให้เรียบร้อยแล้วครับ";

    opt3En = "We are very sorry for the oversight on your bill! We have refunded the extra charge right away, and we thank you for your kind understanding. 🙏";
    opt3Th = "ขออภัยเป็นอย่างยิ่งสำหรับความผิดพลาดในบิลครับ! เราได้โอนคืนส่วนที่คิดเกินให้ทันที และขอบคุณมากสำหรับความเข้าใจครับ 🙏";
  } else if (isLost) {
    opt1En = "We understand how worried you must be about your item. Our staff is checking the dining area and security cameras right now to help you find it.";
    opt1Th = "เราเข้าใจเลยครับว่าคุณคงเป็นกังวลเรื่องของที่หาย ตอนนี้พนักงานกำลังช่วยกันค้นหาทั่วร้านและเปิดกล้องวงจรปิดเพื่อช่วยหาให้อย่างเต็มที่ครับ";

    opt2En = "Thank you for reaching out. We have safely kept your item at our front counter, and you are welcome to pick it up anytime today.";
    opt2Th = "ขอบคุณที่ติดต่อเข้ามาครับ ทางเราได้เก็บของของคุณไว้อย่างปลอดภัยที่เคาน์เตอร์หน้าร้าน สามารถแวะเข้ามารับได้ตลอดเวลาในวันนี้เลยครับ";

    opt3En = "We are doing everything we can to look for your belongings. As soon as we find anything, we will message you here right away! 🙏";
    opt3Th = "พวกเรากำลังช่วยกันค้นหาของของคุณอย่างเต็มที่ครับ ทันทีที่พบจะรีบส่งข้อความแจ้งคุณที่นี่ทันทีเลยนะครับ! 🙏";
  } else if (isTaste) {
    opt1En = "I am so sorry that your meal did not meet your expectations today. We take your feedback to heart and want you to leave happy.";
    opt1Th = "ขออภัยเป็นอย่างยิ่งที่อาหารมื้อนี้ไม่เป็นไปตามที่คุณคาดหวังครับ เราน้อมรับคำแนะนำของคุณอย่างจริงใจและอยากให้คุณประทับใจครับ";

    opt2En = "Thank you for your honest feedback about the food. Would you like us to prepare a fresh replacement for you right now?";
    opt2Th = "ขอบคุณสำหรับข้อเสนอแนะที่ตรงไปตรงมาเกี่ยวกับอาหารครับ สะดวกให้เราทำจานใหม่เปลี่ยนให้ทันทีเลยไหมครับ?";

    opt3En = "We are truly sorry you didn't enjoy your dish today. Your dining experience matters deeply to us, and we would love to make this right for you. 🙏";
    opt3Th = "เรารู้สึกเสียใจจริงๆ ที่คุณไม่ถูกใจอาหารในวันนี้ครับ ประสบการณ์ของคุณสำคัญต่อเรามาก และเราอยากขอโอกาสแก้ไขให้ถูกต้องครับ 🙏";
  } else if (isTable) {
    opt1En = "I sincerely apologize for the mix-up with your table reservation. We are arranging a lovely table for you right now so you can be seated comfortably.";
    opt1Th = "ขออภัยอย่างจริงใจสำหรับความผิดพลาดเรื่องการจองโต๊ะครับ ตอนนี้เรากำลังเร่งจัดโต๊ะสวยๆ ให้คุณเพื่อให้นั่งได้อย่างสบายใจครับ";

    opt2En = "Thank you for your patience. Your table is being set up right this moment and will be ready for your party in just a few minutes.";
    opt2Th = "ขอบคุณสำหรับความอดทนรอครับ ตอนนี้โต๊ะกำลังได้รับการจัดเตรียมและจะพร้อมสำหรับคณะของคุณในอีกไม่กี่นาทีนี้ครับ";

    opt3En = "We are so sorry for keeping you waiting for your table! We have a great spot ready for you now, and our team is excited to serve you tonight. ✨";
    opt3Th = "ต้องขอโทษด้วยจริงๆ ที่ทำให้รอโต๊ะครับ! ตอนนี้เราเตรียมที่นั่งที่ดีมากๆ ไว้ให้แล้ว และทีมงานยินดีอย่างยิ่งที่จะได้ดูแลคุณในคืนนี้ครับ ✨";
  } else {
    opt1En = "I am so sorry for the inconvenience this has caused you today. We truly understand your frustration and want to make things right for you right away.";
    opt1Th = "ต้องขออภัยในความไม่สะดวกที่เกิดขึ้นกับคุณในวันนี้เป็นอย่างยิ่งครับ เราเข้าใจความรู้สึกของคุณและอยากรีบแก้ไขให้คุณในทันทีครับ";

    opt2En = "Thank you for letting us know about the situation. We are taking immediate steps right now to resolve this to your satisfaction.";
    opt2Th = "ขอบคุณที่แจ้งให้เราทราบถึงสถานการณ์นี้ครับ ทางเรากำลังเร่งดำเนินการเพื่อแก้ไขปัญหาให้คุณได้รับความพึงพอใจสูงสุดครับ";

    opt3En = "We feel terrible about this and truly appreciate your patience. Please let us know how we can best assist you right now so you feel taken care of. 🙏";
    opt3Th = "พวกเรารู้สึกเสียใจกับเรื่องนี้จริงๆ และขอบคุณในความเข้าใจของคุณครับ โปรดบอกเราได้เลยว่าต้องการให้ช่วยดูแลอย่างไรเพื่อให้คุณสบายใจที่สุดครับ 🙏";
  }

  // Adjust wording slightly if tone was chosen
  if (tone === 'สุภาพทางการ') {
    opt1En = opt1En.replace('I am so sorry', 'Please accept our sincere apologies');
  } else if (tone === 'เป็นกันเอง') {
    if (!opt3En.includes('🙏') && !opt3En.includes('✨')) {
      opt3En += ' 🙏';
    }
  }

  return [
    {
      id: `fallback-${Date.now()}-1`,
      optionNumber: 1,
      label: 'ขอโทษอย่างอ่อนโยน',
      english: opt1En,
      thai: opt1Th,
    },
    {
      id: `fallback-${Date.now()}-2`,
      optionNumber: 2,
      label: 'เน้นแก้ปัญหา',
      english: opt2En,
      thai: opt2Th,
    },
    {
      id: `fallback-${Date.now()}-3`,
      optionNumber: 3,
      label: 'อบอุ่นเป็นกันเอง',
      english: opt3En,
      thai: opt3Th,
    },
  ];
}
