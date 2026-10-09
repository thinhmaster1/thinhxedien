export function validateMoneyInput(input, maximum = Number.MAX_SAFE_INTEGER, label = 'Số tiền') {
  const raw = String(input ?? '').trim();
  if (!raw) return { value: 0, error: '' };
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(raw)) return { value: 0, error: `${label} phải là số nguyên không âm, không chứa chữ hoặc ký hiệu lạ.` };
  const value = Number(raw.replaceAll(',', ''));
  if (!Number.isSafeInteger(value) || value > maximum) return { value: 0, error: `${label} vượt giới hạn cho phép.` };
  return { value, error: '' };
}

export function localDateKey(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
}

export function promotionAvailability(promotion, programs = {}, date = localDateKey()) {
  const rules = promotion?.program ? programs[promotion.program] : promotion;
  if (rules?.startsAt && date < rules.startsAt) return { available: false, reason: 'Chưa đến thời gian áp dụng.' };
  if (rules?.endsAt && date > rules.endsAt) return { available: false, reason: 'Đã hết thời hạn áp dụng.' };
  return { available: true, reason: '' };
}
