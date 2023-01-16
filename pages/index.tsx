import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import {Hitobito_Date, Hitobito_Event} from "../shared/hitobito/types";
import {getEventsData} from "../shared/hitobito/api";
import React from "react";
import {Descriptions, Input, Table} from 'antd';
import type {ColumnsType, TableProps} from 'antd/es/table';
import {dateToString} from "../shared/hitobito/utils";
import {ColumnFilterItem} from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';


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

    let allEvents = allDBEvents;
    const [events, setEvents] = React.useState<Hitobito_Event[]>(allDBEvents.slice(0, 10));
    const [searchText, setSearchText] = React.useState('');


    // lazy load the rest of the events
    React.useEffect(() => {

        fetch('/api/events')
            .then(res => res.json())
            .then(res => {
                setEvents(res);
                allEvents = res;
            });


    }, []);

    let event_kindes: ColumnFilterItem[] = [...new Set(events.map(event => event.kind.label))].map((kind: string) => {
        return {text: kind, value: kind}
    });

    function highlighter(name: string) {
        return <Highlighter
            highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={name ? name.toString() : ''}
        />;
    }

    const columns: ColumnsType<Hitobito_Event> = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (name: string) => highlighter(name),
            width: '18%',
        },
        {
            title: 'Beschreibung',
            dataIndex: 'description',
            render: (name: string) => highlighter(name),
            ellipsis: true,
        },
        {
            title: 'Typ',
            dataIndex: 'kind',
            render: (kind) => highlighter(kind.label),
            sorter: (a, b) => a.kind.label.localeCompare(b.kind.label),
            filters: event_kindes,
            onFilter: (value, event) => event.kind.label === value,
            width: '18%',
        }
    ];

    React.useEffect(() => {

        const filteredEvents = allEvents.filter(event => {
            return event.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchText.toLowerCase()) ||
                event.kind.label?.toLowerCase().includes(searchText.toLowerCase());
        });

        setEvents(filteredEvents);

    }, [searchText]);

    const tableProps: TableProps<Hitobito_Event> = {
        expandable: {
            expandedRowRender: (event: Hitobito_Event) =>

                <div>
                    <Descriptions title={event.name} bordered column={1}>
                        <Descriptions.Item label="Beschreibung">{highlighter(event.description)}</Descriptions.Item>
                        <Descriptions.Item label="Motto">{highlighter(event.motto)}</Descriptions.Item>
                        <Descriptions.Item label="Ort">{event.location}</Descriptions.Item>
                        <Descriptions.Item
                            label="Teilnehmer">{event.participant_count} von {event.maximum_participants}
                        </Descriptions.Item>

                        <Descriptions.Item label="Daten">
                            {
                                event.dates.map((date: Hitobito_Date) => {
                                    return <div key={event.id + date.label}><b>{date.label}:</b> {dateToString(date)}
                                    </div>
                                })
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Infos und Anmeldung">
                            <a href={event.external_application_link}>Anmelden via CeviDB</a>
                        </Descriptions.Item>
                    </Descriptions>
                </div>

        },
        columns,
        dataSource: events,
        rowKey: (event) => event.id,
        locale: {
            emptyText: "Keine Anlässe oder Lager gefunden, die zu deinen Suchkriterien passen."
        }
    };

    return (
        <Layout home>

            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>

                <Input.Search
                    allowClear
                    enterButton="Search"
                    size="large"
                    onKeyUp={(e) => setSearchText(e.currentTarget.value)}
                    onSearch={(value: string) => setSearchText(value)}
                    placeholder="Suche nach Events"
                />
                <Table {...tableProps}/>

            </section>
        </Layout>
    );
}