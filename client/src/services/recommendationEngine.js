export function explainRecommendation(content, telemetry) {
  const reasons = [];

  const aiScore = telemetry.interestScores?.AI || 0;
  const startupScore = telemetry.interestScores?.Startups || 0;

  if (aiScore > 70) {
    reasons.push(`Viewed multiple AI-related posts`);
  }

  if (startupScore > 50) {
    reasons.push(`Frequently engages with startup content`);
  }

  if (telemetry.totalClicks > 5) {
    reasons.push(`High engagement with similar content`);
  }

  return {
    content,
    confidence: Math.max(aiScore, startupScore),
    reasons
  };
}