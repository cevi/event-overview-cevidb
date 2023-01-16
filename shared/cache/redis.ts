import Redis, {RedisOptions} from 'ioredis';
import * as dns from "dns";

export type RedisConfiguration = {
    port: number | undefined,
    host: string | undefined;
    password: string | undefined;
}

function getDefaultConfig(): RedisConfiguration {
    return {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined
    };
}

export async function getRedisInstance(config = getDefaultConfig()): Promise<Redis | undefined> {

    let redis: Redis | undefined = undefined;

    // check if NextJS is running or building
    // There is no Redis during build of the docker container
    if (process.env.BUILDING) return undefined;

    // Otherwise create a new instance
    try {

        if (config.host === undefined) {
            throw new Error('No Redis host specified!');
        }

        const options: RedisOptions = {
            host: config.host,
            lazyConnect: true,
            showFriendlyErrorStack: true,
            enableAutoPipelining: true,
            maxRetriesPerRequest: 1,
        };

        // check if config.host is resolvable
        await new Promise((res, rej) =>
            dns.lookup(config.host as string, (err: any, address: any, family: any) => {
                if (err) {
                    rej(`[Redis] Could not resolve ${config.host}!`);
                }
            })).catch((err) => {
            throw new Error(err)
        });


        if (config.port) {
            options.port = config.port;
        }

        if (config.password) {
            options.password = config.password;
        }

        redis = new Redis(options);


    } catch (_) {

        redis?.disconnect();

        console.debug('[Redis] Error connecting');
        console.debug('[Redis] Falling back to in-memory cache');
        return undefined;

    }

    return redis;

}