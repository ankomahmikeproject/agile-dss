
export interface FrameworkData {
  id: string;
  name: string;
  scores: {
    criterionId: string;
    value: number; 
  }[];
}

export type UserWeights = Record<string, number>;

export function calculateSAW(frameworks: FrameworkData[], weights: UserWeights) {
  if (!weights || Object.keys(weights).length === 0) {
    return frameworks.map(f => ({ id: f.id, name: f.name, score: 0 }));
  }

  const maxPossibleRawScore = Object.values(weights).reduce((sum, w) => sum + (w * 10), 0);

  const results = frameworks.map((framework) => {
    const rawTotalScore = framework.scores.reduce((sum, scoreEntry) => {
      const weight = weights[scoreEntry.criterionId] || 0;
            return sum + (weight * scoreEntry.value);
    }, 0);
    const normalizedScore = maxPossibleRawScore > 0 
      ? (rawTotalScore / maxPossibleRawScore) * 100 
      : 0;

    return {
      id: framework.id,
      name: framework.name,
      score: parseFloat(normalizedScore.toFixed(1)), 
    };
  });

  return results.sort((a, b) => b.score - a.score);
}