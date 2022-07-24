import { format } from "date-fns";

const oneDayInMiliseconds = 60 * 60 * 24 * 1000;

export function moreDays(amountOfDays) {
  return new Date(new Date().getTime() + oneDayInMiliseconds * amountOfDays);
}

export const YESTERDAY = moreDays(-1);
export const TOMORROW = moreDays(1);

export const DD_MM_YYYY_WITH_SLASHS = "dd/MM/yyyy";

export function formatDate(date, dateFormat = DD_MM_YYYY_WITH_SLASHS) {
  return format(date, dateFormat);
}

export function toDate(date) {
  return new Date(Date.parse(date));
}
