import { format } from "date-fns";

const oneDayInMiliseconds = 60 * 60 * 24 * 1000;

export function moreDays(amountOfDays) {
  return new Date(new Date().getTime() + oneDayInMiliseconds * amountOfDays);
}

export const YESTERDAY = moreDays(-1);
export const TOMORROW = moreDays(1);

export const DD_MM_YYYY_WITH_SLASHS = "dd/MM/yyyy";
export const YYYY_MM_DD_WITH_MIDDLE_DASHS = "yyyy-MM-dd";

export function formatDate(date, dateFormat = DD_MM_YYYY_WITH_SLASHS) {
  return format(date, dateFormat);
}

export function toDate(date) {
  const finalDate = `${date}T00:00:00`;
  return new Date(Date.parse(finalDate));
}
