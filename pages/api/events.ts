import {getEventsData} from "../../shared/hitobito/api";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log(req.url)

    const allEvents = await getEventsData();
    return res.status(200).json(allEvents)

}