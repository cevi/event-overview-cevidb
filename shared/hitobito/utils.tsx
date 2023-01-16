import {Hitobito_Date} from "./types";

function dateFormatter(date: Date, extras = {}): string {
    let format: Intl.DateTimeFormatOptions = {day: '2-digit'};
    format = {...format, ...extras};
    return date.toLocaleDateString('de-CH', format);
}

function timeFormatter(date: Date, extras = {}): string {

    let format: Intl.DateTimeFormatOptions = {day: '2-digit', hour: '2-digit', minute: '2-digit'};
    format = {...format, ...extras};
    return date.toLocaleDateString('de-CH', format);
}

export function dateToString(date: Hitobito_Date) {

    const start_at = new Date(date.start_at);
    const finish_at = new Date(date.finish_at);

    if (start_at === finish_at) {
        return `${dateFormatter(start_at)} (Ort: ${date.location})`;
    }

    let formatter = timeFormatter;
    if (start_at.toLocaleTimeString() === finish_at.toLocaleTimeString()) {
        formatter = dateFormatter;
    }

    let extras = {};
    if (start_at.getMonth() !== finish_at.getMonth()) {
        extras = {...extras, month: '2-digit'};
    }

    if (start_at.getFullYear() !== finish_at.getFullYear()) {
        extras = {...extras, year: 'numeric'};
    }

    return (<span>
        <b>{date.label}:</b>
        <br/>
        {formatter(start_at, extras)} -
        {formatter(finish_at, {...extras, month: '2-digit', year: 'numeric'})}
        <br/>
    </span>);
}