import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

type DBEvent_Date = {
    start_at: string,
    finish_at: string,
    location: string
    label: string
}

type DBEvent = {
    id: number,
    name: string,
    motto: string,
    location: string,
    description: string,
    participant_count: number,
    maximum_participants: number,
    dates: DBEvent_Date[],
}

async function getEventsData(): Promise<DBEvent[]> {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // load token from environment variable
    const token = process.env.CEVI_DB_TOKEN;

    // events and courses must be retrieved separately using different endpoints
    const api_endpoints = [
        "https://demo.hitobito.com/groups/1/events.json?token=" + token,
        "https://demo.hitobito.com/groups/1/events/course.json?token=" + token
    ]

    const events: DBEvent[] = [];

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
                    return date_obj as DBEvent_Date;
                });

            event.dates ||= []; // if dates is undefined, set it to an empty array
            return event as DBEvent;
        });

        events.push(...data.events);
    }

    return events;

}

// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.
export async function getServerSideProps({req, res}: { req: any, res: any }) {

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    const allDBEvents = await getEventsData();
    return {
        props: {
            "allDBEvents": allDBEvents
        },
    };
}

function date_formatter(date: Date, extras = {}): string {
    let format: Intl.DateTimeFormatOptions = {day: '2-digit'};
    format = {...format, ...extras};
    return date.toLocaleDateString('de-CH', format);
}

function time_formatter(date: Date, extras = {}): string {

    let format: Intl.DateTimeFormatOptions = {day: '2-digit', hour: '2-digit', minute: '2-digit'};
    format = {...format, ...extras};
    return date.toLocaleDateString('de-CH', format);
}

function dbEventDateToString(date: DBEvent_Date) {

    const event_date: any = date;
    event_date.start_at = new Date(event_date.start_at);
    event_date.finish_at = new Date(event_date.finish_at);

    if (date.start_at === date.finish_at) {
        return `${date_formatter(event_date.start_at)} (Ort: ${date.location})`;
    }

    let formatter = time_formatter;
    if (event_date.start_at.toLocaleTimeString() === event_date.finish_at.toLocaleTimeString()) {
        formatter = date_formatter;
    }

    let extras = {};
    if (event_date.start_at.month !== event_date.finish_at.month) {
        extras = {...extras, month: '2-digit'};
    }

    if (event_date.start_at.year !== event_date.finish_at.year) {
        extras = {...extras, year: 'numeric'};
    }

    return (<span>
        <b>{event_date.label}:</b>
        <br />
        {formatter(event_date.start_at, extras)} -
        {formatter(event_date.finish_at, {...extras, month: '2-digit', year: 'numeric'})} <br />
    </span>);
}

export default function Home({allDBEvents}: { allDBEvents: DBEvent[] }) {
    return (
        <Layout home>

            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <caption className="mt-6">Anlass und Kursübersicht</caption>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Beschreibung</th>
                        <th scope="col" className="px-6 py-3">Daten</th>
                        <th scope="col" className="px-6 py-3">Anmeldungen</th>
                    </tr>
                    </thead>

                    <tbody>
                    {allDBEvents.slice(0, 15).map((event: DBEvent) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            key={event.id}>
                            <td className="px-6 py-4">{event.name}</td>
                            <td className="px-6 py-4">{event.description}</td>
                            <td className="px-6 py-4">{
                                event.dates.map((date: DBEvent_Date) => (
                                    <div key={date.label}>
                                        {dbEventDateToString(date)}
                                    </div>
                                ))
                            }</td>
                            <td className="px-6 py-4 text-center">{event.participant_count} / {event.maximum_participants}</td>
                        </tr>
                    ))}

                    </tbody>

                </table>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-5">
                    Mehr Events/Lager anzeigen
                </button>

            </section>
        </Layout>
    );
}