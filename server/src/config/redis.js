import {Redis} from "ioredis";
const connectRedis = (redisURI)=>{
    const redis = new Redis(redisURI);

    redis.on('connect', () => {
        console.log('Connected to Redis...');
    });

    redis.on('error', (err) => {
        console.error(`Error connecting to Redis: ${err}`);
    });
    return redis;
}

export {connectRedis}
