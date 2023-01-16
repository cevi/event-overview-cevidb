import {Hitobito_Date, Hitobito_Event} from "./types";
import {cacheResults} from "../cache/cache";

async function _getEventsData(): Promise<Hitobito_Event[]> {

    console.log('Query Hitobito Instance for (new) events...');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // load token from environment variable
    const token = process.env.HITOBITO_API_TOKEN;
    if (!token) throw new Error('No API token found!');

    const group_id = process.env.HITOBITO__GROUP_ID;
    const hitobito_instance = process.env.HITOBITO_INSTANCE;

    // events and courses must be retrieved separately using different endpoints
    const api_endpoints = [
        `https://${hitobito_instance}/groups/${group_id}/events.json?token=${token}`,
        `https://${hitobito_instance}/groups/${group_id}/events/course.json?token=${token}`
    ];

    const events: Hitobito_Event[] = [];

    for (const api_endpoint of api_endpoints) {
        const response = await fetch(api_endpoint, requestOptions);
        const data = await response.json();

        // TODO: paging is not implemented yet;
        //       only events from the first page are loaded

        // extract date of event
        data.events.map((event: any) => {

            const date_ids = event.links.dates;
            const date_objs = data.linked.event_dates;

            // find all associated dates objects
            event.dates = date_objs
                .filter((date_obj: any) => date_ids.includes(date_obj.id))
                .map((date_obj: any) => {
                    date_obj.location ||= "unbekannt";
                    return date_obj as Hitobito_Date;
                });

            event.dates ||= []; // if dates is undefined, set it to an empty array
            return event as Hitobito_Event;
        });

        events.push(...data.events);
    }

    return events;

}

export async function getEventsData(force_refresh = false): Promise<Hitobito_Event[]> {

    return cacheResults<Hitobito_Event[]>(_getEventsData, 'events', force_refresh, 60);

}