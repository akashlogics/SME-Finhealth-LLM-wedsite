export function identifyRisks(data: any) {
  const risks: string[] = [];

  if (data.cashFlow < 0) risks.push("Negative cash flow");
  if (data.receivables > data.revenue * 0.4)
    risks.push("High accounts receivable");
  if (data.debtRatio > 2)
    risks.push("High leverage");

  return risks;
}
