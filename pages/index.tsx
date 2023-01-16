import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import {Hitobito_Date, Hitobito_Event} from "../shared/hitobito/types";
import {getEventsData} from "../shared/hitobito/api";
import {dateToString} from "../shared/hitobito/utils";


export async function getStaticProps() {

    const allDBEvents = await getEventsData();
    return {
        props: {
            "allDBEvents": allDBEvents
        },
        revalidate: 120 // 120 seconds
    };
}

export default function Home({allDBEvents}: { allDBEvents: Hitobito_Event[] }) {
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
                    {allDBEvents.slice(0, 15).map((event: Hitobito_Event) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            key={event.id}>
                            <td className="px-6 py-4">{event.name}</td>
                            <td className="px-6 py-4">{event.description}</td>
                            <td className="px-6 py-4">{
                                event.dates.map((date: Hitobito_Date) => (
                                    <div key={date.label}>
                                        {dateToString(date)}
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