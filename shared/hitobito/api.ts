import {Hitobito_Event} from "./types";
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

        console.log(JSON.stringify(data.events[0]))

        // extract date of event
        data.events.forEach((event: any) => {

            const date_ids = event.links.dates;
            const date_objs = data.linked.event_dates;

            // find all associated dates objects
            event.dates = date_objs
                .filter((date_obj: any) => date_ids.includes(date_obj.id))
                .map((date_obj: any) => {
                    date_obj.location ||= "unbekannt";

                    return {
                        start_at: date_obj.start_at,
                        finish_at: date_obj.finish_at,
                        location: date_obj.location,
                        label: date_obj.label
                    };

                });

            event.dates ||= []; // if dates is undefined, set it to an empty array
            event.links.kind ||= "-1"; // events don't have a kind, so we set it to -1

            // find the kind of the event
            let kind_obj = data.linked.event_kinds?.find((kind_obj: any) => kind_obj.id == event.links.kind);
            kind_obj ||= {}; // if kind_obj is undefined, set it to an empty object
            kind_obj.label ||= "Event"; // if kind_obj is undefined, set it to an empty object
            kind_obj.short_name ||= "Event"; // if short_name is undefined, set it to "Event"
            kind_obj.minimum_age ||= 0; // if minimum_age is undefined, set it to 0

            events.push({
                id: event.id,
                name: event.name,
                motto: event.motto,
                location: event.location,
                description: event.description,
                participant_count: event.participant_count,
                maximum_participants: event.maximum_participants,
                dates: event.dates,
                kind: kind_obj,
                external_application_link: event.external_application_link
            });
        });

    }

    return events;

}

export async function getEventsData(force_refresh = false): Promise<Hitobito_Event[]> {

    return cacheResults<Hitobito_Event[]>(_getEventsData, 'events', force_refresh);

}