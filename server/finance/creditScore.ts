export function calculateCreditScore(data: any) {
  let score = 700;

  if (data.cashFlow < 0) score -= 100;
  if (data.debt > data.assets) score -= 80;
  if (data.gstCompliant === false) score -= 60;

  return Math.max(score, 300);
}
