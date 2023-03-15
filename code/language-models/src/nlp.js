export function generateWords(wordDistribution, numWords) {
  const words = Object.keys(wordDistribution);
  const probabilities = Object.values(wordDistribution);

  const getRandomWord = () => {
    const random = Math.random();
    let sum = 0;

    for (let i = 0; i < probabilities.length; i++) {
      sum += probabilities[i];
      if (random < sum) {
        return words[i];
      }
    }
  };

  const generatedWords = [];

  for (let i = 0; i < numWords; i++) {
    generatedWords.push(getRandomWord());
  }

  return generatedWords;
}
