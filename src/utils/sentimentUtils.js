export function getSentimentColor(score) {
  if (score > 0.7) return "#4CAF50"; // green = positive
  if (score < 0.3) return "#F44336"; // red = negative
  return "#FFEB3B"; // yellow = neutral
}
