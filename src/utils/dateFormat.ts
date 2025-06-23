import { format, isBefore, set } from "date-fns";

export const formatDatetoISOString = (date: Date) =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss").toString();

export const formatDatetoTime = (date: Date) => {
  return format(date, "HH:mm:ss").toString();
};

export const formatTimetoDate = (time: string) => {
  return set(new Date(), {hours: Number(time.substring(0,1)), minutes:Number(time.substring(3,4)), seconds:Number(time.substring(6,7))})
}

export const isFutureDate = (date: string) => {
  const now = new Date();
  console.log(new Date(date), isBefore(now, new Date(date)), typeof date);
  return isBefore(now, new Date(date));
};
