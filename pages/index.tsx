import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

type DBEvent = {
    id: number,
    name: string,
    description: string,
    participant_count: number,
    maximum_participants: number,
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

    const res = await fetch("https://demo.hitobito.com/groups/1/events.json?token=" + token, requestOptions)
    const jsonResult = await res.json();
    return jsonResult.events;


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


export default function Home({allDBEvents}: { allDBEvents: DBEvent[] }) {
    return (
        <Layout home>

            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Anlässe</h2>
                <ul className={utilStyles.list}>
                    {allDBEvents.map((event: DBEvent) => (
                        <li className={utilStyles.listItem} key={event.id}>
                            {event.name} <br/> {event.description} <br/>
                            Anmeldungen: {event.participant_count} / {event.maximum_participants}
                        </li>
                    ))}
                </ul>
            </section>
        </Layout>
    );
}