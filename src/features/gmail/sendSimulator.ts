const messageResponses = [
  'Not enough emotional context.',
  'Too many grammatical errors.',
  'This email doesn’t contain enough love.',
  'Your message lacks passion.',
  'Subject missing. Confidence missing too.',
  'Recipient detected. Emotional preparation required.',
  'Insufficient affection detected.',
  'Please add more feelings.',
  'This email is technically correct. Unfortunately, that’s not enough.',
  'Message rejected. It felt emotionally unavailable.',
  'Too little enthusiasm. Try again.',
  'Your email has failed the vibe check.',
  'Not enough words. We need at least 4 more compliments.',
  'Grammar detected. Please remove some.',
  'Server says this email needs therapy.',
  'Email rejected due to lack of personality.',
  'Almost sent it. Then we thought better of it.',
  'Delivery failed. The email wasn’t emotionally ready.',
  'Your message is giving “we need to talk.”',
  'Please make the email sound less reasonable.',
  'Send failed. Reason: vibes.'
];

const fileResponses = [
  'File format rejected. We changed our mind.',
  'Image is too large. Please make it smaller.',
  'Server busy. Your image will have to wait.',
  'Too many pixels. We’re overwhelmed.',
  'This image format is emotionally incompatible.',
  'Unsupported format. Please use a format we haven’t rejected yet.',
  'File accepted. Just kidding.'
];

const pick = (items: string[], attempt: number) => items[attempt % items.length];

export function simulateSend(file: File | null, attempt: number) {
  if (!file) return pick(messageResponses, attempt);
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (attempt === 0 && ['jpg', 'jpeg'].includes(extension ?? '')) return 'JPEG detected. Please convert it to PNG.';
  if (attempt === 0 && extension === 'png') return 'PNG detected. Please convert it to WebP.';
  if (attempt === 0 && extension === 'webp') return 'WebP detected. Please convert it to JPEG.';
  return pick(fileResponses, attempt);
}
