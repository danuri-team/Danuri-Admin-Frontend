import { format, isBefore, set } from "date-fns";

export const formatDatetoISOString = (date: Date):string =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss");

export const formatDatetoTime = (date: Date):string => {
  return format(date, "HH:mm:ss");
};

export const formatTimetoDate = (time: number[]) => {
  if(time.length < 3){
    return set(new Date, {hours:0, minutes:0, seconds: 0});
  }
  return set(new Date(), {hours:time[0], minutes:time[1], seconds:time[2]})
}

export const isFutureDate = (date: string) => {
  const now = new Date();
  return isBefore(now, new Date(date));
};
