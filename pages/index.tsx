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
import {useRouter} from "next/router";


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

    const router = useRouter()

    const [queryParams, setQueryParams] = React.useState({
        search: router.query.search as string || '',
        pagination: router.query.pagination as string || '1',
        filter: router.query.filter as string || '[]',
    });

    const [ready, setReady] = React.useState(false);

    // restore state from url
    React.useEffect(() => {

        if (ready) return;

        setQueryParams({
            ...queryParams,
            search: router.query.search as string || '',
            pagination: router.query.pagination as string || '1',
            filter: router.query.filter as string || '[]',
        });

        if (router.asPath.includes('?') && JSON.stringify(router.query) === '{}') return;
        setReady(true);


    }, [router]);

    // update url when state changes
    React.useEffect(() => {

        // filter out empty values
        const params = Object.fromEntries(Object.entries(queryParams)
            .filter(([_, v]) => v !== ''));

        if (!ready) return;

        router.push({
            pathname: '/',
            query: params,
        }, undefined, {shallow: true});

    }, [queryParams]);


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


    const [showHighlight, setShowHighlight] = React.useState(false);

    function highlighter(name: string) {

        return (
            <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[queryParams.search]}
                className={showHighlight ? '' : 'fade-out'}
                autoEscape
                textToHighlight={name ? name.toString() : ''}
            />
        );
    }

    React.useEffect(() => {

        const filteredEvents = allEvents.filter(event => {
            return event.name?.toLowerCase().includes(queryParams.search.toLowerCase()) ||
                event.description?.toLowerCase().includes(queryParams.search.toLowerCase()) ||
                event.kind.label?.toLowerCase().includes(queryParams.search.toLowerCase());
        });


        setEvents(filteredEvents);

    }, [queryParams.search]);

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
            filteredValue: JSON.parse(queryParams.filter),
            onFilter: (value, event) => event.kind.label === value,
            width: '18%',
        }
    ];

    // on small screens, hide the description column
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        columns.splice(1, 1);
        columns[0].width = '100%';
    }

    const tableProps: TableProps<Hitobito_Event> = {
        expandable: {
            expandedRowRender: (event: Hitobito_Event) =>

                <div>
                    <Descriptions title={event.name} bordered column={1}>
                        <Descriptions.Item label="Beschreibung">{highlighter(event.description)}</Descriptions.Item>
                        <Descriptions.Item label="Motto">{highlighter(event.motto)}</Descriptions.Item>
                        <Descriptions.Item label="Ort">{event.location}</Descriptions.Item>
                        <Descriptions.Item
                            label="Anzahl Teilnehmer">

                            {event.maximum_participants ? <>
                                {event.participant_count == event.maximum_participants ? <>Kurs
                                    ausgebucht</> : <>{event.participant_count} von {event.maximum_participants}</>}

                            </> : <>
                                Anmeldungen: {event.participant_count}
                            </>}

                        </Descriptions.Item>

                        <Descriptions.Item label="Daten">
                            {
                                event.dates.map((date: Hitobito_Date) => {
                                    return <div key={event.id + date.label}>
                                        {date.label !== '' ? (<b>{date.label}: </b>) : (<> </>)}
                                        {dateToString(date)}
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
        expandRowByClick: true,
        dataSource: events,
        rowKey: (event) => event.id,
        locale: {
            emptyText: "Keine Anlässe oder Lager gefunden, die zu deinen Suchkriterien passen."
        }
    };

    const onChange: TableProps<Hitobito_Event>['onChange'] = (pagination, filters) => {

        setReady(true);
        setQueryParams({
            ...queryParams,
            pagination: pagination.current?.toString() || '1',
            filter: filters.kind ? JSON.stringify(filters.kind) : '',
        });
    };


    return (
        <Layout home>

            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>

                <Input.Search
                    allowClear
                    enterButton="Search"
                    size="large"
                    value={queryParams.search}
                    onChange={(e) => {
                        setQueryParams({...queryParams, search: e.currentTarget.value});
                        setShowHighlight(true);
                        setTimeout(() => setShowHighlight(false), 1_000);
                        setReady(true);
                    }}
                    onSearch={(value: string) => setQueryParams({...queryParams, search: value})}
                    placeholder="Suche nach Events"
                />

                {ready ? (
                    <Table {...tableProps}
                           onChange={onChange}
                           pagination={{current: +queryParams.pagination}}
                    />
                ) : <></>}

            </section>
        </Layout>
    );
}