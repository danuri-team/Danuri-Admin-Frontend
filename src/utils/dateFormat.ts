import { format, isBefore } from "date-fns" 

export const formatDatetoISOString = (date:Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss").toString();

export const formatDatetoTime = (date:Date) => {
    return format(date, 'HH:mm:ss').toString();
}

export const isFutureDate = (date:string) => {
    const now = new Date();
    console.log(new Date(date),isBefore(now, new Date(date)), typeof date);
    return isBefore(now,new Date(date));
}