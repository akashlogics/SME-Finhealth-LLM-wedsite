import { calculateCreditScore } from "./creditScore";
import { identifyRisks } from "./riskEngine";

export function analyzeFinancials(data: any) {
  return {
    creditScore: calculateCreditScore(data),
    risks: identifyRisks(data)
  };
}
