export type Hitobito_Date = {
    start_at: string,
    finish_at: string,
    location: string
    label: string
}

export type Hitobito_Event = {
    id: number,
    name: string,
    motto: string,
    location: string,
    description: string,
    participant_count: number,
    maximum_participants: number,
    dates: Hitobito_Date[],
}