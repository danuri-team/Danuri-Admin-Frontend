import { format, isBefore, set } from "date-fns";

export const formatDatetoISOString = (date: Date) =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss").toString();

export const formatDatetoTime = (date: Date) => {
  return format(date, "HH:mm:ss").toString();
};

export const formatTimetoDate = (time: number[]) => {
  return set(new Date(), {hours:time[0], minutes:time[1], seconds:time[2]})
}

export const isFutureDate = (date: string) => {
  const now = new Date();
  return isBefore(now, new Date(date));
};
