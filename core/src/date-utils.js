const oneDayInMiliseconds = 60 * 60 * 24 * 1000;

export function moreDays(amountOfDays) {
  return new Date(new Date().getTime() + oneDayInMiliseconds * amountOfDays);
}

export const YESTERDAY = moreDays(-1);
export const TOMORROW = moreDays(1);
