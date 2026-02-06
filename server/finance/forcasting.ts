export function forecastRevenue(current: number) {
  return {
    nextQuarter: current * 1.08,
    nextYear: current * 1.15
  };
}
