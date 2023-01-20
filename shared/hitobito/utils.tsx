import {Hitobito_Date} from "./types";

function dateFormatter(date: Date, extras: Intl.DateTimeFormatOptions = {}): string {
    let format: Intl.DateTimeFormatOptions = {day: '2-digit'};
    format = {...format, ...extras};
    return date.toLocaleDateString('de-CH', format);
}

function timeFormatter(date: Date, extras: Intl.DateTimeFormatOptions = {}): string {

    let format: Intl.DateTimeFormatOptions = {day: '2-digit', hour: '2-digit', minute: '2-digit'};
    format = {...format, ...extras};
    return date.toLocaleDateString('de-CH', format);
}

export function dateToString(date: Hitobito_Date) {

    const start_at = new Date(date.start_at);
    const finish_at = new Date(date.finish_at);

    if (start_at >= finish_at) {
        return `${dateFormatter(start_at, {
            year: 'numeric',
            month: '2-digit'
        })}`;
    }

    let formatter = timeFormatter;
    if (start_at.toLocaleTimeString() === finish_at.toLocaleTimeString()) {
        formatter = dateFormatter;
    }

    let extras: Intl.DateTimeFormatOptions = {month: '2-digit'};

    if (start_at.getFullYear() !== finish_at.getFullYear()) {
        extras = {...extras, year: 'numeric'};
    }

    return `${formatter(start_at, extras)} - ${formatter(finish_at, {
        ...extras,
        year: 'numeric',
        month: '2-digit'
    })}`


}