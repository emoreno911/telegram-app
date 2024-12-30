export const splitHexAddress = (addr) => {
    if (!addr) return "0x0";
    return `${addr.slice(0, 6)}...${addr.slice(addr.length - 4)}`;
}

export function sleep(ms) {
    return new Promise((val) => setTimeout(val, ms));
}

export function calculateScore(guessTime, maxTime = 15, baseScore = 30, quickBonusThreshold = 3, quickBonusMultiplier = 2) {
    // If the guess time exceeds the maximum time, return 0 points
    if (guessTime > maxTime) {
      return 0;
    }
  
    // Calculate the basic score based on how quickly the guess was made
    let score = baseScore * (1 - guessTime / maxTime);
  
    // Apply quick bonus for guesses made within the quick bonus threshold
    if (guessTime < quickBonusThreshold) {
      let bonusMultiplier = 1 + (quickBonusMultiplier - 1) * (1 - guessTime / quickBonusThreshold);
      score *= bonusMultiplier;
    }
  
    // Round the score to the nearest integer
    return Math.round(score);
}
  