export function calculateWarrantyRisk(input) {
  const servicing = Math.min(Math.max(input.servicingFrequencyPerYear || 0, 0), 12);
  const complexity = Math.min(Math.max(input.warrantyComplexity || 5, 0), 10);
  const failureRate = Math.min(Math.max(input.failureRate || 5, 0), 100);
  const claimSuccess = Math.min(Math.max(input.claimSuccessProbability || 50, 0), 100);

  const servicingRisk = (servicing / 12) * 30;
  const complexityRisk = (complexity / 10) * 25;
  const failureRisk = (failureRate / 100) * 30;
  const claimRisk = ((100 - claimSuccess) / 100) * 15;

  const total = Math.round(servicingRisk + complexityRisk + failureRisk + claimRisk);
  let band = "Low";
  if (total >= 70) band = "High";
  else if (total >= 40) band = "Moderate";

  return { score: total, band };
}
