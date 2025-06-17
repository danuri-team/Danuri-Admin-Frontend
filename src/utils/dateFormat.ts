import { format, set } from "date-fns" 

export const formatDatetoISOString = (date:Date) => {
    return format(set(date, {
        hours: 0,
        minutes: 0,
        seconds: 0
    }), "yyyy-MM-dd'T'HH:mm:ss").toString();
} 

export const formatDatetoTime = (date:Date) => {
    return format(date, 'HH:mm:ss').toString();
}