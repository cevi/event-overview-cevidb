import Redis from "ioredis";
import {getRedisInstance} from "./redis";

// 120 seconds
const MAX_CACHE_AGE = 60 * 2;

const in_memory_cache = new Map<string, {
    time_stamp: number,
    data: any
}>();

let redis: Redis | undefined | null = null;

export async function retrieve<t>(key: string, max_age: number = MAX_CACHE_AGE) {

    if (redis === null) redis = await getRedisInstance();

    let generic_object;
    if (redis !== undefined) {
        console.debug(`[Redis] Retrieving ${key} from Redis...`);
        generic_object = redis.get(key);
    } else {

        console.debug(`[Redis] Retrieving ${key} from in-memory cache...`);

        // fallback to in-memory cache
        const cache_entry = in_memory_cache.get(key);

        if (cache_entry !== undefined && cache_entry.time_stamp + max_age * 1_000 >= Date.now()) {
            generic_object = cache_entry.data;
        }
    }

    return generic_object as Promise<t | undefined>;

}

export async function store<t>(key: string, object: t, max_age: number = MAX_CACHE_AGE) {

    if (redis === null) redis = await getRedisInstance();

    const generic_object = JSON.stringify(object);

    if (redis !== undefined) {
        redis.setex(key, max_age, generic_object);

    } else {
        // fallback to in-memory cache
        in_memory_cache.set(key, {time_stamp: Date.now(), data: JSON.parse(generic_object)});
    }


}

export async function cacheResults<t>(
    functor: () => Promise<t>,
    key: string,
    force_refresh = false,
    max_age = MAX_CACHE_AGE): Promise<t> {

    if (!force_refresh) {
        const cached = await retrieve<t>(key, max_age);
        if (cached) {
            return cached;
        }
    }

    const result = await functor();

    // Update cache
    await store<t>(key, result, max_age);
    return result;


}
